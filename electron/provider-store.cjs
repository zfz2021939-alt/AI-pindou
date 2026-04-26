const fs = require('node:fs/promises')
const path = require('node:path')
const { app } = require('electron')

function getStorePath() {
  return path.join(app.getPath('userData'), 'ai-providers.json')
}

async function readProviders() {
  try {
    const content = await fs.readFile(getStorePath(), 'utf8')
    const parsed = JSON.parse(content)
    return mergeBuiltInProviders(Array.isArray(parsed.providers) ? parsed.providers : [])
  } catch (error) {
    if (error.code === 'ENOENT') {
      return mergeBuiltInProviders([])
    }
    throw error
  }
}

async function writeProviders(providers) {
  await fs.mkdir(path.dirname(getStorePath()), { recursive: true })
  await fs.writeFile(getStorePath(), JSON.stringify({ providers }, null, 2), 'utf8')
  return providers
}

async function saveProvider(provider) {
  const providers = await readProviders()
  const id = provider.id || `provider-${Date.now()}`
  const normalized = normalizeProvider({ ...provider, id })
  const next = providers.filter((item) => item.id !== id)
  next.push(normalized)
  return writeProviders(next)
}

async function removeProvider(id) {
  const providers = await readProviders()
  return writeProviders(providers.filter((provider) => provider.id !== id))
}

function normalizeProvider(provider) {
  return {
    id: String(provider.id),
    name: String(provider.name || '未命名 Provider'),
    endpoint: String(provider.endpoint || ''),
    method: provider.method === 'PUT' ? 'PUT' : 'POST',
    headersTemplate: provider.headersTemplate && typeof provider.headersTemplate === 'object' ? provider.headersTemplate : {},
    bodyTemplate: String(provider.bodyTemplate || '{}'),
    responseImagePath: String(provider.responseImagePath || 'image'),
    timeoutMs: Number(provider.timeoutMs || 120000),
    variables: provider.variables && typeof provider.variables === 'object' ? provider.variables : {}
  }
}

function mergeBuiltInProviders(storedProviders) {
  const providersById = new Map(storedProviders.map((provider) => [provider.id, normalizeProvider(provider)]))
  const builtIns = [createDashScopeProvider()]
  const mergedBuiltIns = builtIns.map((provider) => providersById.get(provider.id) || provider)
  const customProviders = [...providersById.values()].filter((provider) => !builtIns.some((builtIn) => builtIn.id === provider.id))
  return [...mergedBuiltIns, ...customProviders]
}

function createDashScopeProvider() {
  return {
    id: 'dashscope-wan26-image',
    name: 'DashScope Wan2.6 Image',
    endpoint: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation',
    method: 'POST',
    headersTemplate: {
      Authorization: 'Bearer {{API_KEY}}',
      'Content-Type': 'application/json'
    },
    bodyTemplate:
      '{\n' +
      '  "model": "{{MODEL}}",\n' +
      '  "input": {\n' +
      '    "messages": [\n' +
      '      {\n' +
      '        "role": "user",\n' +
      '        "content": [\n' +
      '          { "text": "{{PROMPT}}" },\n' +
      '          { "image": "{{IMAGE_DATA_URL}}" }\n' +
      '        ]\n' +
      '      }\n' +
      '    ]\n' +
      '  },\n' +
      '  "parameters": {\n' +
      '    "prompt_extend": true,\n' +
      '    "watermark": false,\n' +
      '    "n": 1,\n' +
      '    "size": "1K"\n' +
      '  }\n' +
      '}',
    responseImagePath: 'output.choices[0].message.content[0].image',
    timeoutMs: 300000,
    variables: {
      API_KEY: '',
      MODEL: 'wan2.6-image'
    }
  }
}

module.exports = {
  readProviders,
  saveProvider,
  removeProvider
}
