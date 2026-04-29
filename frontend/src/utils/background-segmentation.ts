import { summarizeCells, transparentCell } from './pixelation'
import type { MappedBeadCell, PatternResult } from './pixelation'

type SegmentWorkerResponse =
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

export type BackgroundSegmentationResult = {
  pattern: PatternResult
  provider: 'webgpu' | 'wasm'
}

let requestId = 0

export async function eraseBackgroundWithLocalSegmentation(image: HTMLImageElement, pattern: PatternResult, threshold = 0.45): Promise<BackgroundSegmentationResult> {
  const imageData = getImageData(image)
  const result = await runSegmentationWorker(imageData)
  const cells = applyForegroundMaskToCells(pattern.cells, result.mask, result.width, result.height, threshold)
  const stats = summarizeCells(cells)
  return {
    pattern: {
      ...pattern,
      cells,
      colors: stats.colors,
      totalBeads: stats.totalBeads,
      options: {
        ...pattern.options,
        backgroundErase: { mode: 'ai', used: true }
      }
    },
    provider: result.provider
  }
}

export function applyForegroundMaskToCells(cells: MappedBeadCell[][], mask: Float32Array, maskWidth: number, maskHeight: number, threshold: number) {
  const height = cells.length
  const width = cells[0]?.length ?? 0
  if (height === 0 || width === 0) {
    return cells
  }

  const cellWidth = maskWidth / width
  const cellHeight = maskHeight / height

  return cells.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      const startX = Math.floor(colIndex * cellWidth)
      const startY = Math.floor(rowIndex * cellHeight)
      const endX = Math.min(maskWidth, Math.ceil((colIndex + 1) * cellWidth))
      const endY = Math.min(maskHeight, Math.ceil((rowIndex + 1) * cellHeight))
      const foreground = averageMask(mask, maskWidth, startX, startY, endX, endY)
      return foreground < threshold ? transparentCell(rowIndex, colIndex) : { ...cell, rgb: { ...cell.rgb }, vendorCodes: { ...cell.vendorCodes } }
    })
  )
}

function runSegmentationWorker(imageData: ImageData) {
  const worker = new Worker(new URL('../workers/background-segmentation.worker.ts', import.meta.url), { type: 'module' })
  const id = requestId + 1
  requestId = id

  return new Promise<Extract<SegmentWorkerResponse, { ok: true }>>((resolve, reject) => {
    worker.onmessage = (event: MessageEvent<SegmentWorkerResponse>) => {
      if (event.data.id !== id) {
        return
      }
      worker.terminate()
      if (event.data.ok) {
        resolve(event.data)
      } else {
        reject(new Error(event.data.error))
      }
    }
    worker.onerror = (event) => {
      worker.terminate()
      reject(new Error(event.message || '本地背景分割 Worker 失败。'))
    }
    worker.postMessage({ id, imageData })
  })
}

function getImageData(image: HTMLImageElement) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) {
    throw new Error('当前环境无法创建 Canvas。')
  }
  canvas.width = image.naturalWidth || image.width
  canvas.height = image.naturalHeight || image.height
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  return context.getImageData(0, 0, canvas.width, canvas.height)
}

function averageMask(mask: Float32Array, width: number, startX: number, startY: number, endX: number, endY: number) {
  let sum = 0
  let count = 0
  for (let y = startY; y < endY; y += 1) {
    for (let x = startX; x < endX; x += 1) {
      sum += mask[y * width + x] ?? 0
      count += 1
    }
  }
  return count > 0 ? sum / count : 0
}
