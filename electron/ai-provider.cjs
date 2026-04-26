const { readProviders } = require('./provider-store.cjs')
const fs = require('node:fs/promises')
const path = require('node:path')
const { app } = require('electron')

async function optimizeImage({ providerId, variables }) {
  const providers = await readProviders()
  const provider = providers.find((item) => item.id === providerId)
  if (!provider) {
    throw new Error('未找到 AI Provider 配置。')
  }
  if (!provider.endpoint) {
    throw new Error('AI Provider 缺少 endpoint。')
  }

  const timeoutMs = provider.timeoutMs || 300000
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const mergedVariables = { ...(provider.variables || {}), ...withoutEmptyValues(variables || {}) }
    const headers = renderHeaders(provider.headersTemplate, mergedVariables)
    const body = renderTemplate(provider.bodyTemplate, mergedVariables)
    validateProviderBody(provider, body)
    await writeAiLog(`request start provider=${provider.name} endpoint=${provider.endpoint} timeout=${timeoutMs}`)
    const response = await fetch(provider.endpoint, {
      method: provider.method || 'POST',
      headers,
      body,
      signal: controller.signal
    })
    const text = await response.text()
    await writeAiLog(`request response status=${response.status} bytes=${text.length}`)

    if (!response.ok) {
      throw new Error(`AI 请求失败：${response.status} ${text}`)
    }

    const data = parseJson(text)
    const image = readByPath(data, provider.responseImagePath) || findFirstImageValue(data)
    if (!image || typeof image !== 'string') {
      throw new Error(`响应中未找到图片字段：${provider.responseImagePath}`)
    }

    await writeAiLog(`image result found type=${image.startsWith('http') ? 'url' : 'inline'}`)
    const normalized = await normalizeImageResult(image, controller.signal)
    await writeAiLog(`image normalized bytes=${normalized.length}`)
    return { image: normalized }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`AI 请求超时：超过 ${Math.round(timeoutMs / 1000)} 秒未完成。`)
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

async function writeAiLog(message) {
  const filePath = path.join(app.getPath('userData'), 'ai-provider.log')
  const line = `${new Date().toISOString()} ${message}\n`
  await fs.appendFile(filePath, line, 'utf8')
}

function renderHeaders(headersTemplate, variables) {
  const headers = {}
  for (const [key, value] of Object.entries(headersTemplate || {})) {
    headers[key] = renderTemplate(String(value), variables)
  }
  return headers
}

function validateProviderBody(provider, body) {
  if (!provider.endpoint.includes('dashscope.aliyuncs.com')) {
    return
  }

  const parsed = parseJson(body)
  if (!parsed.input?.messages) {
    throw new Error('DashScope Wan2.6 请求体缺少 input.messages。请在 AI 设置中选择 DashScope Wan2.6 Image，或点击“填入 DashScope Wan2.6 预设”后保存。')
  }
}

function withoutEmptyValues(values) {
  return Object.fromEntries(Object.entries(values).filter(([, value]) => value !== undefined && value !== null && value !== ''))
}

function renderTemplate(template, variables) {
  return String(template).replace(/\{\{\s*([A-Z0-9_]+)\s*\}\}/g, (_match, key) => escapeTemplateValue(variables?.[key] ?? ''))
}

function escapeTemplateValue(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
}

function parseJson(text) {
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('AI 响应不是合法 JSON。')
  }
}

function readByPath(data, pathExpression) {
  return String(pathExpression || '')
    .split('.')
    .filter(Boolean)
    .reduce((current, segment) => {
      if (current == null) {
        return undefined
      }
      const arrayMatch = /^(.+)\[(\d+)]$/.exec(segment)
      if (arrayMatch) {
        return current[arrayMatch[1]]?.[Number(arrayMatch[2])]
      }
      return current[segment]
    }, data)
}

function findFirstImageValue(value) {
  if (!value || typeof value !== 'object') {
    return undefined
  }
  if (typeof value.image === 'string') {
    return value.image
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const result = findFirstImageValue(item)
      if (result) {
        return result
      }
    }
    return undefined
  }
  for (const item of Object.values(value)) {
    const result = findFirstImageValue(item)
    if (result) {
      return result
    }
  }
  return undefined
}

async function normalizeImageResult(image, signal) {
  if (image.startsWith('data:image/')) {
    return image
  }
  if (!/^https?:\/\//i.test(image)) {
    return image
  }

  const response = await fetch(image, { signal })
  if (!response.ok) {
    throw new Error(`AI 图片下载失败：${response.status}`)
  }
  const contentType = response.headers.get('content-type') || 'image/png'
  const buffer = Buffer.from(await response.arrayBuffer())
  return `data:${contentType};base64,${buffer.toString('base64')}`
}

module.exports = {
  optimizeImage
}
