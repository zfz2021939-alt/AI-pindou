import * as ort from 'onnxruntime-web'

type SegmentRequest = {
  id: number
  imageData: ImageData
}

type SegmentResponse =
  | {
      id: number
      ok: true
      mask: Float32Array
      width: number
      height: number
      provider: 'webgpu' | 'wasm'
    }
  | {
      id: number
      ok: false
      error: string
    }

type WorkerPostMessage = typeof self & {
  postMessage(message: unknown, transfer: Transferable[]): void
}

const MODEL_SIZE = 320
let sessionPromise: Promise<{ session: ort.InferenceSession; provider: 'webgpu' | 'wasm' }> | null = null

ort.env.wasm.wasmPaths = '/ort/'

self.onmessage = async (event: MessageEvent<SegmentRequest>) => {
  const { id, imageData } = event.data
  try {
    const { session, provider } = await getSession()
    const input = preprocess(imageData)
    const inputName = session.inputNames[0]
    const feeds: Record<string, ort.Tensor> = {
      [inputName]: new ort.Tensor('float32', input, [1, 3, MODEL_SIZE, MODEL_SIZE])
    }
    const output = await session.run(feeds)
    const outputName = session.outputNames[0]
    const values = output[outputName].data as Float32Array
    const normalized = normalizeMask(values)
    const mask = resizeMask(normalized, MODEL_SIZE, MODEL_SIZE, imageData.width, imageData.height)
    ;(self as WorkerPostMessage).postMessage(
      { id, ok: true, mask, width: imageData.width, height: imageData.height, provider } satisfies SegmentResponse,
      [mask.buffer as ArrayBuffer]
    )
  } catch (error) {
    self.postMessage({ id, ok: false, error: error instanceof Error ? error.message : '本地背景分割失败。' } satisfies SegmentResponse)
  }
}

async function getSession() {
  if (!sessionPromise) {
    sessionPromise = createSession()
  }
  return sessionPromise
}

async function createSession() {
  const modelUrl = '/models/u2netp.onnx'
  try {
    return {
      session: await ort.InferenceSession.create(modelUrl, { executionProviders: ['webgpu', 'wasm'] }),
      provider: 'webgpu' as const
    }
  } catch {
    return {
      session: await ort.InferenceSession.create(modelUrl, { executionProviders: ['wasm'] }),
      provider: 'wasm' as const
    }
  }
}

function preprocess(imageData: ImageData) {
  const resized = resizeImageData(imageData, MODEL_SIZE, MODEL_SIZE)
  const input = new Float32Array(3 * MODEL_SIZE * MODEL_SIZE)
  const mean = [0.485, 0.456, 0.406]
  const std = [0.229, 0.224, 0.225]

  for (let index = 0; index < MODEL_SIZE * MODEL_SIZE; index += 1) {
    const source = index * 4
    input[index] = (resized[source] / 255 - mean[0]) / std[0]
    input[MODEL_SIZE * MODEL_SIZE + index] = (resized[source + 1] / 255 - mean[1]) / std[1]
    input[2 * MODEL_SIZE * MODEL_SIZE + index] = (resized[source + 2] / 255 - mean[2]) / std[2]
  }

  return input
}

function resizeImageData(imageData: ImageData, targetWidth: number, targetHeight: number) {
  const output = new Uint8ClampedArray(targetWidth * targetHeight * 4)
  const xRatio = imageData.width / targetWidth
  const yRatio = imageData.height / targetHeight

  for (let y = 0; y < targetHeight; y += 1) {
    for (let x = 0; x < targetWidth; x += 1) {
      const sourceX = Math.min(imageData.width - 1, Math.floor((x + 0.5) * xRatio))
      const sourceY = Math.min(imageData.height - 1, Math.floor((y + 0.5) * yRatio))
      const source = (sourceY * imageData.width + sourceX) * 4
      const target = (y * targetWidth + x) * 4
      output[target] = imageData.data[source]
      output[target + 1] = imageData.data[source + 1]
      output[target + 2] = imageData.data[source + 2]
      output[target + 3] = imageData.data[source + 3]
    }
  }

  return output
}

function normalizeMask(values: Float32Array) {
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY
  for (const value of values) {
    min = Math.min(min, value)
    max = Math.max(max, value)
  }
  const range = Math.max(1e-6, max - min)
  const output = new Float32Array(MODEL_SIZE * MODEL_SIZE)
  for (let index = 0; index < output.length; index += 1) {
    output[index] = (values[index] - min) / range
  }
  return output
}

function resizeMask(mask: Float32Array, sourceWidth: number, sourceHeight: number, targetWidth: number, targetHeight: number) {
  const output = new Float32Array(targetWidth * targetHeight)
  const xRatio = sourceWidth / targetWidth
  const yRatio = sourceHeight / targetHeight

  for (let y = 0; y < targetHeight; y += 1) {
    for (let x = 0; x < targetWidth; x += 1) {
      const sourceX = Math.min(sourceWidth - 1, Math.floor((x + 0.5) * xRatio))
      const sourceY = Math.min(sourceHeight - 1, Math.floor((y + 0.5) * yRatio))
      output[y * targetWidth + x] = mask[sourceY * sourceWidth + sourceX]
    }
  }

  return output
}
