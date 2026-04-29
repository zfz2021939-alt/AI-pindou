import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'
import { findClosestPaletteColor, summarizeCells } from './pixelation'
import type { MappedBeadCell, PaletteColor, PatternResult, RgbColor } from './pixelation'

type DetectorKind = 'mediapipe' | 'heuristic' | 'none'

export type FaceContourEnhanceResult = {
  pattern: PatternResult
  detector: DetectorKind
  changedCells: number
}

let faceLandmarkerPromise: Promise<FaceLandmarker | null> | null = null

const LOWER_FACE_OVAL = [58, 132, 172, 136, 150, 149, 176, 148, 152, 377, 400, 378, 379, 365, 397, 288]
const MOUTH_CONTOUR = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291]

export async function enhanceFaceContour(image: HTMLImageElement, pattern: PatternResult, palette: PaletteColor[]): Promise<FaceContourEnhanceResult> {
  const imageData = getImageData(image)
  const detected = await createLandmarkMask(image, imageData.width, imageData.height)
  const contour = detected.mask ?? createHeuristicContourMask(imageData)
  const applied = applyFaceContourMaskToCells(pattern.cells, imageData, contour, palette, pattern.width, pattern.height, pattern.width < 80 ? 0.045 : 0.08)
  const stats = summarizeCells(applied.cells)

  return {
    pattern: {
      ...pattern,
      cells: applied.cells,
      colors: stats.colors,
      totalBeads: stats.totalBeads,
      options: {
        ...pattern.options,
        faceContourEnhance: { used: true, detector: detected.detector ?? applied.detector }
      }
    },
    detector: detected.detector ?? applied.detector,
    changedCells: applied.changedCells
  }
}

export function applyFaceContourMaskToCells(
  cells: MappedBeadCell[][],
  imageData: ImageData,
  contourMask: Float32Array,
  palette: PaletteColor[],
  patternWidth: number,
  patternHeight: number,
  threshold: number
) {
  const cellWidth = imageData.width / patternWidth
  const cellHeight = imageData.height / patternHeight
  let changedCells = 0

  const next = cells.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      if (cell.isExternal) {
        return { ...cell, rgb: { ...cell.rgb }, vendorCodes: { ...cell.vendorCodes } }
      }
      const startX = Math.floor(colIndex * cellWidth)
      const startY = Math.floor(rowIndex * cellHeight)
      const endX = Math.min(imageData.width, Math.ceil((colIndex + 1) * cellWidth))
      const endY = Math.min(imageData.height, Math.ceil((rowIndex + 1) * cellHeight))
      const strength = averageMask(contourMask, imageData.width, startX, startY, endX, endY)
      if (strength < threshold) {
        return { ...cell, rgb: { ...cell.rgb }, vendorCodes: { ...cell.vendorCodes } }
      }

      const targetRgb = sampleDarkEdgeColor(imageData, startX, startY, endX, endY)
      const target = findClosestPaletteColor(targetRgb, palette)
      if (!target || target.key === cell.key) {
        return { ...cell, rgb: { ...cell.rgb }, vendorCodes: { ...cell.vendorCodes } }
      }
      changedCells += 1
      return {
        ...cell,
        key: target.key,
        displayCode: target.displayCode,
        name: target.name,
        color: target.hex,
        rgb: { ...target.rgb },
        vendor: target.vendor,
        vendorCodes: { ...target.vendorCodes },
        isExternal: false
      }
    })
  )

  return { cells: next, changedCells, detector: changedCells > 0 ? 'heuristic' as const : 'none' as const }
}

async function createLandmarkMask(image: HTMLImageElement, width: number, height: number): Promise<{ mask: Float32Array | null; detector: DetectorKind | null }> {
  const faceLandmarker = await getFaceLandmarker()
  if (!faceLandmarker) {
    return { mask: null, detector: null }
  }

  const result = faceLandmarker.detect(image)
  const landmarks = result.faceLandmarks?.[0]
  if (!landmarks?.length) {
    return { mask: null, detector: null }
  }

  const mask = new Float32Array(width * height)
  drawPolyline(mask, width, height, LOWER_FACE_OVAL.map((index) => landmarks[index]).filter(Boolean), 3)
  drawPolyline(mask, width, height, MOUTH_CONTOUR.map((index) => landmarks[index]).filter(Boolean), 2)
  dilateMask(mask, width, height, 2)
  return { mask, detector: 'mediapipe' }
}

async function getFaceLandmarker() {
  if (!faceLandmarkerPromise) {
    faceLandmarkerPromise = createFaceLandmarker()
  }
  return faceLandmarkerPromise
}

async function createFaceLandmarker() {
  try {
    const vision = await FilesetResolver.forVisionTasks('/mediapipe')
    return await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: '/models/face_landmarker.task',
        delegate: 'GPU'
      },
      runningMode: 'IMAGE',
      numFaces: 1
    })
  } catch {
    try {
      const vision = await FilesetResolver.forVisionTasks('/mediapipe')
      return await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: '/models/face_landmarker.task',
          delegate: 'CPU'
        },
        runningMode: 'IMAGE',
        numFaces: 1
      })
    } catch {
      return null
    }
  }
}

function createHeuristicContourMask(imageData: ImageData) {
  const { width, height, data } = imageData
  const mask = new Float32Array(width * height)
  const left = Math.floor(width * 0.22)
  const right = Math.ceil(width * 0.78)
  const top = Math.floor(height * 0.28)
  const bottom = Math.ceil(height * 0.82)
  const centerX = (left + right) / 2
  const radiusX = (right - left) / 2
  const radiusY = (bottom - top) / 2
  const centerY = top + radiusY * 0.72

  for (let y = top + 1; y < bottom - 1; y += 1) {
    for (let x = left + 1; x < right - 1; x += 1) {
      const normalizedX = (x - centerX) / radiusX
      const normalizedY = (y - centerY) / radiusY
      if (normalizedX * normalizedX + normalizedY * normalizedY > 1.05 || y < centerY - radiusY * 0.18) {
        continue
      }
      const edge = getSobelEdge(data, width, x, y)
      if (edge > 36) {
        mask[y * width + x] = Math.min(1, edge / 160)
      }
    }
  }

  dilateMask(mask, width, height, 1)
  return mask
}

function drawPolyline(mask: Float32Array, width: number, height: number, points: Array<{ x: number; y: number }>, radius: number) {
  for (let index = 1; index < points.length; index += 1) {
    drawLine(mask, width, height, points[index - 1].x * width, points[index - 1].y * height, points[index].x * width, points[index].y * height, radius)
  }
}

function drawLine(mask: Float32Array, width: number, height: number, x1: number, y1: number, x2: number, y2: number, radius: number) {
  const steps = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1)))
  for (let step = 0; step <= steps; step += 1) {
    const x = Math.round(x1 + ((x2 - x1) * step) / steps)
    const y = Math.round(y1 + ((y2 - y1) * step) / steps)
    paintDisk(mask, width, height, x, y, radius, 1)
  }
}

function paintDisk(mask: Float32Array, width: number, height: number, centerX: number, centerY: number, radius: number, value: number) {
  for (let y = centerY - radius; y <= centerY + radius; y += 1) {
    for (let x = centerX - radius; x <= centerX + radius; x += 1) {
      if (x < 0 || x >= width || y < 0 || y >= height || Math.hypot(x - centerX, y - centerY) > radius) {
        continue
      }
      mask[y * width + x] = Math.max(mask[y * width + x], value)
    }
  }
}

function dilateMask(mask: Float32Array, width: number, height: number, radius: number) {
  const copy = new Float32Array(mask)
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const value = copy[y * width + x]
      if (value <= 0) {
        continue
      }
      paintDisk(mask, width, height, x, y, radius, value * 0.85)
    }
  }
}

function sampleDarkEdgeColor(imageData: ImageData, startX: number, startY: number, endX: number, endY: number): RgbColor {
  let best = { r: 36, g: 32, b: 32 }
  let bestScore = Number.NEGATIVE_INFINITY
  for (let y = startY; y < endY; y += 1) {
    for (let x = startX; x < endX; x += 1) {
      const index = (y * imageData.width + x) * 4
      if (imageData.data[index + 3] < 128) {
        continue
      }
      const rgb = { r: imageData.data[index], g: imageData.data[index + 1], b: imageData.data[index + 2] }
      const luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b
      const edge = getSobelEdge(imageData.data, imageData.width, x, y)
      const score = edge - luminance * 0.25
      if (score > bestScore) {
        bestScore = score
        best = rgb
      }
    }
  }
  return best
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

function getSobelEdge(data: Uint8ClampedArray, width: number, x: number, y: number) {
  const height = data.length / 4 / width
  if (x <= 0 || x >= width - 1 || y <= 0 || y >= height - 1) {
    return 0
  }
  const lum = (nextX: number, nextY: number) => {
    const index = (nextY * width + nextX) * 4
    return 0.299 * data[index] + 0.587 * data[index + 1] + 0.114 * data[index + 2]
  }
  const gx = -lum(x - 1, y - 1) - 2 * lum(x - 1, y) - lum(x - 1, y + 1) + lum(x + 1, y - 1) + 2 * lum(x + 1, y) + lum(x + 1, y + 1)
  const gy = -lum(x - 1, y - 1) - 2 * lum(x, y - 1) - lum(x + 1, y - 1) + lum(x - 1, y + 1) + 2 * lum(x, y + 1) + lum(x + 1, y + 1)
  return Math.hypot(gx, gy)
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
