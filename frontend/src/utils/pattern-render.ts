import type { PatternResult, RgbColor } from './pixelation'
import { applySubtleBlindWatermark, applyVisibleWatermark } from './watermark'
import type { WatermarkOptions } from './watermark'

export type BeadStyle = 'round' | 'square'

export type PatternCellPosition = {
  row: number
  col: number
}

export type PatternRenderOptions = {
  beadStyle: BeadStyle
  width: number
  height: number
  selectedCell?: PatternCellPosition | null
  watermark?: WatermarkOptions
  showGrid?: boolean
}

export type PatternGeometry = {
  cellSize: number
  offsetX: number
  offsetY: number
  drawingWidth: number
  drawingHeight: number
}

export function renderPatternToCanvas(canvas: HTMLCanvasElement, pattern: PatternResult, options: PatternRenderOptions) {
  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

  canvas.width = Math.round(options.width)
  canvas.height = Math.round(options.height)
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = '#f8f1e3'
  context.fillRect(0, 0, canvas.width, canvas.height)

  const geometry = getPatternGeometry(pattern, canvas.width, canvas.height)
  drawCells(context, pattern, options.beadStyle, geometry)

  if (options.showGrid !== false && geometry.cellSize >= 8) {
    drawGrid(context, pattern, geometry)
  }

  if (options.selectedCell) {
    drawSelection(context, options.selectedCell, geometry)
  }

  if (options.watermark?.mode === 'visible') {
    applyVisibleWatermark(context, canvas.width, canvas.height, options.watermark.text)
  } else if (options.watermark?.mode === 'subtle') {
    applySubtleBlindWatermark(context, canvas.width, canvas.height, options.watermark.text)
  }
}

export function createPatternCanvas(pattern: PatternResult, options: PatternRenderOptions) {
  const canvas = document.createElement('canvas')
  renderPatternToCanvas(canvas, pattern, options)
  return canvas
}

export function getPatternGeometry(pattern: PatternResult, width: number, height: number): PatternGeometry {
  const cellSize = Math.min(width / pattern.width, height / pattern.height)
  const drawingWidth = pattern.width * cellSize
  const drawingHeight = pattern.height * cellSize
  return {
    cellSize,
    drawingWidth,
    drawingHeight,
    offsetX: (width - drawingWidth) / 2,
    offsetY: (height - drawingHeight) / 2
  }
}

export function hitTestPatternCell(pattern: PatternResult, width: number, height: number, x: number, y: number) {
  const geometry = getPatternGeometry(pattern, width, height)
  const col = Math.floor((x - geometry.offsetX) / geometry.cellSize)
  const row = Math.floor((y - geometry.offsetY) / geometry.cellSize)

  if (row < 0 || row >= pattern.height || col < 0 || col >= pattern.width) {
    return null
  }

  return { row, col }
}

function drawCells(context: CanvasRenderingContext2D, pattern: PatternResult, beadStyle: BeadStyle, geometry: PatternGeometry) {
  for (const row of pattern.cells) {
    for (const cell of row) {
      const px = geometry.offsetX + cell.col * geometry.cellSize
      const py = geometry.offsetY + cell.row * geometry.cellSize

      if (cell.isExternal) {
        context.fillStyle = 'rgba(36,52,44,0.05)'
        context.fillRect(px, py, geometry.cellSize, geometry.cellSize)
        continue
      }

      if (beadStyle === 'round') {
        const center = geometry.cellSize / 2
        const radius = Math.max(1.2, geometry.cellSize * 0.42)
        const gradient = context.createRadialGradient(px + center * 0.72, py + center * 0.68, radius * 0.1, px + center, py + center, radius)
        gradient.addColorStop(0, shiftColor(cell.rgb, 34))
        gradient.addColorStop(0.72, cell.color)
        gradient.addColorStop(1, shiftColor(cell.rgb, -16))
        context.fillStyle = gradient
        context.beginPath()
        context.arc(px + center, py + center, radius, 0, Math.PI * 2)
        context.fill()
      } else {
        context.fillStyle = cell.color
        context.fillRect(px + 0.5, py + 0.5, Math.max(1, geometry.cellSize - 1), Math.max(1, geometry.cellSize - 1))
      }
    }
  }
}

function drawGrid(context: CanvasRenderingContext2D, pattern: PatternResult, geometry: PatternGeometry) {
  context.strokeStyle = 'rgba(39,49,45,0.12)'
  context.lineWidth = 1
  for (let col = 0; col <= pattern.width; col += 1) {
    const pos = Math.round(geometry.offsetX + col * geometry.cellSize) + 0.5
    context.beginPath()
    context.moveTo(pos, geometry.offsetY)
    context.lineTo(pos, geometry.offsetY + geometry.drawingHeight)
    context.stroke()
  }
  for (let row = 0; row <= pattern.height; row += 1) {
    const pos = Math.round(geometry.offsetY + row * geometry.cellSize) + 0.5
    context.beginPath()
    context.moveTo(geometry.offsetX, pos)
    context.lineTo(geometry.offsetX + geometry.drawingWidth, pos)
    context.stroke()
  }
}

function drawSelection(context: CanvasRenderingContext2D, selected: PatternCellPosition, geometry: PatternGeometry) {
  const x = geometry.offsetX + selected.col * geometry.cellSize
  const y = geometry.offsetY + selected.row * geometry.cellSize
  context.save()
  context.strokeStyle = '#1b6cff'
  context.lineWidth = Math.max(2, Math.min(5, geometry.cellSize * 0.12))
  context.strokeRect(x + 1, y + 1, Math.max(1, geometry.cellSize - 2), Math.max(1, geometry.cellSize - 2))
  context.restore()
}

function shiftColor(rgb: RgbColor, amount: number) {
  const clamp = (value: number) => Math.max(0, Math.min(255, value + amount))
  return `rgb(${clamp(rgb.r)},${clamp(rgb.g)},${clamp(rgb.b)})`
}
