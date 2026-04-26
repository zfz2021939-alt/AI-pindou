import { TRANSPARENT_KEY } from './pixelation'
import type { PatternResult, RgbColor } from './pixelation'
import { applySubtleBlindWatermark, applyVisibleWatermark } from './watermark'
import type { WatermarkOptions } from './watermark'

export type BeadStyle = 'round' | 'square'
export type GridStrength = 'soft' | 'clear'

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
  showColorKeys?: boolean
  gridStrength?: GridStrength
}

export type PatternSheetRenderOptions = PatternRenderOptions

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

  const gridStrength = options.gridStrength ?? 'soft'
  if (options.showGrid !== false && (gridStrength === 'clear' || geometry.cellSize >= 8)) {
    drawGrid(context, pattern, geometry, gridStrength)
  }

  if (options.showColorKeys) {
    drawColorKeys(context, pattern, geometry)
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

export function createPatternSheetCanvas(pattern: PatternResult, options: PatternSheetRenderOptions) {
  const patternCanvas = createPatternCanvas(pattern, options)
  const sheetSize = getPatternSheetCanvasSize(pattern, options)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.width = sheetSize.width
  canvas.height = sheetSize.height

  if (!context) {
    return canvas
  }

  context.fillStyle = '#f7f7f2'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(patternCanvas, 0, 0)
  drawPaletteLegend(context, pattern, {
    x: 0,
    y: patternCanvas.height + getSheetGap(patternCanvas.width),
    width: canvas.width
  })
  return canvas
}

export function getPatternSheetCanvasSize(pattern: PatternResult, options: PatternSheetRenderOptions) {
  const width = Math.round(options.width)
  const patternHeight = Math.round(options.height)
  return {
    width,
    height: patternHeight + getSheetGap(width) + getPaletteLegendHeight(pattern, width)
  }
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

function drawGrid(context: CanvasRenderingContext2D, pattern: PatternResult, geometry: PatternGeometry, strength: GridStrength) {
  const majorInterval = 10
  context.save()
  for (let col = 0; col <= pattern.width; col += 1) {
    const pos = Math.round(geometry.offsetX + col * geometry.cellSize) + 0.5
    const isMajor = col % majorInterval === 0
    context.strokeStyle = getGridColor(strength, isMajor)
    context.lineWidth = getGridLineWidth(strength, isMajor)
    context.beginPath()
    context.moveTo(pos, geometry.offsetY)
    context.lineTo(pos, geometry.offsetY + geometry.drawingHeight)
    context.stroke()
  }
  for (let row = 0; row <= pattern.height; row += 1) {
    const pos = Math.round(geometry.offsetY + row * geometry.cellSize) + 0.5
    const isMajor = row % majorInterval === 0
    context.strokeStyle = getGridColor(strength, isMajor)
    context.lineWidth = getGridLineWidth(strength, isMajor)
    context.beginPath()
    context.moveTo(geometry.offsetX, pos)
    context.lineTo(geometry.offsetX + geometry.drawingWidth, pos)
    context.stroke()
  }
  context.restore()
}

function drawColorKeys(context: CanvasRenderingContext2D, pattern: PatternResult, geometry: PatternGeometry) {
  if (geometry.cellSize < 5) {
    return
  }

  context.save()
  context.textAlign = 'center'
  context.textBaseline = 'middle'

  for (const row of pattern.cells) {
    for (const cell of row) {
      if (cell.isExternal || cell.key === TRANSPARENT_KEY) {
        continue
      }

      const fontSize = getColorKeyFontSize(context, cell.key, geometry.cellSize)
      if (fontSize < 4) {
        continue
      }

      const x = geometry.offsetX + (cell.col + 0.5) * geometry.cellSize
      const y = geometry.offsetY + (cell.row + 0.5) * geometry.cellSize
      const darkText = getLuminance(cell.rgb) > 150
      context.font = `800 ${fontSize}px Arial, sans-serif`
      context.lineWidth = Math.max(1, fontSize * 0.22)
      context.strokeStyle = darkText ? 'rgba(255,255,255,0.72)' : 'rgba(0,0,0,0.48)'
      context.fillStyle = darkText ? '#101816' : '#ffffff'
      context.strokeText(cell.key, x, y)
      context.fillText(cell.key, x, y)
    }
  }

  context.restore()
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

function drawPaletteLegend(context: CanvasRenderingContext2D, pattern: PatternResult, bounds: { x: number; y: number; width: number }) {
  const layout = getPaletteLegendLayout(pattern, bounds.width)
  const panelX = bounds.x + layout.margin
  const panelY = bounds.y
  const panelWidth = bounds.width - layout.margin * 2
  const panelHeight = getPaletteLegendHeight(pattern, bounds.width) - layout.margin

  context.save()
  context.fillStyle = '#ffffff'
  context.strokeStyle = '#1e2b27'
  context.lineWidth = layout.borderWidth
  context.fillRect(panelX, panelY, panelWidth, panelHeight)
  context.strokeRect(panelX, panelY, panelWidth, panelHeight)

  context.fillStyle = '#1557c8'
  context.fillRect(panelX + layout.borderWidth, panelY + layout.borderWidth, layout.titleWidth, layout.titleHeight)
  context.fillStyle = '#ffffff'
  context.font = `900 ${layout.titleFontSize}px Arial, sans-serif`
  context.textBaseline = 'middle'
  context.fillText('PALETTE', panelX + layout.titlePadding, panelY + layout.titleHeight / 2 + layout.borderWidth)

  context.strokeStyle = 'rgba(30,43,39,0.45)'
  context.lineWidth = layout.borderWidth
  const dividerY = panelY + layout.titleHeight + layout.borderWidth * 2
  context.beginPath()
  context.moveTo(panelX + layout.borderWidth, dividerY)
  context.lineTo(panelX + panelWidth - layout.borderWidth, dividerY)
  context.stroke()

  const sortedColors = [...pattern.colors].sort((first, second) => first.key.localeCompare(second.key, undefined, { numeric: true }))
  context.font = `800 ${layout.itemFontSize}px Arial, sans-serif`
  context.textBaseline = 'middle'

  sortedColors.forEach((color, index) => {
    const column = Math.floor(index / layout.rowsPerColumn)
    const row = index % layout.rowsPerColumn
    const itemX = panelX + layout.itemPaddingX + column * layout.columnWidth
    const itemY = panelY + layout.titleHeight + layout.itemPaddingY + row * layout.rowHeight
    const swatchSize = layout.swatchSize

    context.fillStyle = color.hex
    context.fillRect(itemX, itemY, swatchSize, swatchSize)
    context.strokeStyle = 'rgba(30,43,39,0.55)'
    context.lineWidth = Math.max(1, layout.borderWidth)
    context.strokeRect(itemX, itemY, swatchSize, swatchSize)

    context.fillStyle = '#101816'
    context.textAlign = 'left'
    context.fillText(color.key, itemX + swatchSize + layout.textGap, itemY + swatchSize / 2)
    context.textAlign = 'right'
    context.fillText(`x${color.count}`, itemX + layout.columnWidth - layout.itemPaddingX, itemY + swatchSize / 2)
  })

  const totalText = `总计：${pattern.totalBeads} 颗`
  context.font = `900 ${layout.totalFontSize}px Arial, sans-serif`
  context.textAlign = 'right'
  context.textBaseline = 'middle'
  const totalWidth = Math.max(layout.totalMinWidth, context.measureText(totalText).width + layout.totalPaddingX * 2)
  const totalHeight = layout.totalHeight
  const totalX = panelX + panelWidth - layout.borderWidth - totalWidth
  const totalY = panelY + panelHeight - layout.borderWidth - totalHeight
  context.fillStyle = '#df2a24'
  context.fillRect(totalX, totalY, totalWidth, totalHeight)
  context.fillStyle = '#ffffff'
  context.fillText(totalText, totalX + totalWidth - layout.totalPaddingX, totalY + totalHeight / 2)
  context.restore()
}

function shiftColor(rgb: RgbColor, amount: number) {
  const clamp = (value: number) => Math.max(0, Math.min(255, value + amount))
  return `rgb(${clamp(rgb.r)},${clamp(rgb.g)},${clamp(rgb.b)})`
}

function getSheetGap(width: number) {
  return Math.max(16, Math.round(width * 0.012))
}

function getPaletteLegendHeight(pattern: PatternResult, width: number) {
  const layout = getPaletteLegendLayout(pattern, width)
  const rows = Math.max(1, Math.ceil(pattern.colors.length / layout.columns))
  return layout.margin + layout.titleHeight + layout.itemPaddingY + rows * layout.rowHeight + layout.bottomPadding
}

function getPaletteLegendLayout(pattern: PatternResult, width: number) {
  const scale = Math.max(1, Math.min(2.6, width / 1100))
  const margin = Math.round(8 * scale)
  const availableWidth = width - margin * 2
  const minColumnWidth = Math.round(250 * scale)
  const columns = Math.max(1, Math.min(6, Math.floor(availableWidth / minColumnWidth), pattern.colors.length || 1))
  return {
    margin,
    columns,
    rowsPerColumn: Math.max(1, Math.ceil(pattern.colors.length / columns)),
    columnWidth: availableWidth / columns,
    rowHeight: Math.round(42 * scale),
    swatchSize: Math.round(34 * scale),
    itemFontSize: Math.round(20 * scale),
    titleHeight: Math.round(38 * scale),
    titleWidth: Math.round(150 * scale),
    titleFontSize: Math.round(22 * scale),
    titlePadding: Math.round(8 * scale),
    itemPaddingX: Math.round(8 * scale),
    itemPaddingY: Math.round(12 * scale),
    textGap: Math.round(8 * scale),
    bottomPadding: Math.round(58 * scale),
    borderWidth: Math.max(1, Math.round(1.2 * scale)),
    totalFontSize: Math.round(22 * scale),
    totalHeight: Math.round(38 * scale),
    totalMinWidth: Math.round(220 * scale),
    totalPaddingX: Math.round(10 * scale)
  }
}

function getGridColor(strength: GridStrength, isMajor: boolean) {
  if (strength === 'clear') {
    return isMajor ? 'rgba(14,24,21,0.72)' : 'rgba(14,24,21,0.36)'
  }
  return isMajor ? 'rgba(39,49,45,0.22)' : 'rgba(39,49,45,0.12)'
}

function getGridLineWidth(strength: GridStrength, isMajor: boolean) {
  if (strength === 'clear') {
    return isMajor ? 1.4 : 1
  }
  return isMajor ? 1.2 : 1
}

function getColorKeyFontSize(context: CanvasRenderingContext2D, key: string, cellSize: number) {
  const maxFontSize = Math.min(18, cellSize * 0.58)
  const maxWidth = cellSize * 0.86
  let fontSize = maxFontSize

  while (fontSize >= 4) {
    context.font = `800 ${fontSize}px Arial, sans-serif`
    if (context.measureText(key).width <= maxWidth) {
      return fontSize
    }
    fontSize -= 0.5
  }

  return fontSize
}

function getLuminance(rgb: RgbColor) {
  return 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b
}
