import type { MardColor, MardTier } from '@/data/mard-palette'

export type PixelationMode = 'dominant' | 'average'

export type RgbColor = {
  r: number
  g: number
  b: number
}

export type PaletteColor = {
  key: string
  name: string
  hex: string
  rgb: RgbColor
}

export type MappedBeadCell = {
  row: number
  col: number
  key: string
  name: string
  color: string
  rgb: RgbColor
  isExternal: boolean
}

export type ColorUsage = PaletteColor & {
  count: number
}

export type PatternOptions = {
  columns: number
  rows: number
  paletteTier: MardTier
  pixelationMode: PixelationMode
  similarityThreshold: number
  excludedColorKeys: string[]
}

export type PatternResult = {
  width: number
  height: number
  totalBeads: number
  colors: ColorUsage[]
  cells: MappedBeadCell[][]
  options: PatternOptions
}

export const TRANSPARENT_KEY = 'ERASE'

export const transparentCell = (row: number, col: number): MappedBeadCell => ({
  row,
  col,
  key: TRANSPARENT_KEY,
  name: '外部区域',
  color: '#FFFFFF',
  rgb: { r: 255, g: 255, b: 255 },
  isExternal: true
})

export function toPaletteColor(color: MardColor): PaletteColor {
  return {
    key: color.code,
    name: color.name,
    hex: color.hex,
    rgb: {
      r: color.rgb[0],
      g: color.rgb[1],
      b: color.rgb[2]
    }
  }
}

export function colorDistance(first: RgbColor, second: RgbColor) {
  const red = first.r - second.r
  const green = first.g - second.g
  const blue = first.b - second.b
  return Math.sqrt(red * red + green * green + blue * blue)
}

export function findClosestPaletteColor(target: RgbColor, palette: PaletteColor[]) {
  let closest = palette[0]
  let minDistance = Number.POSITIVE_INFINITY

  for (const color of palette) {
    const distance = colorDistance(target, color.rgb)
    if (distance < minDistance) {
      closest = color
      minDistance = distance
    }
    if (distance === 0) {
      break
    }
  }

  return closest
}

export function calculatePixelGrid(
  context: CanvasRenderingContext2D,
  imageWidth: number,
  imageHeight: number,
  columns: number,
  rows: number,
  palette: PaletteColor[],
  mode: PixelationMode
) {
  const imageData = context.getImageData(0, 0, imageWidth, imageHeight)
  const cellWidth = imageWidth / columns
  const cellHeight = imageHeight / rows
  const cells: MappedBeadCell[][] = []

  for (let row = 0; row < rows; row += 1) {
    const line: MappedBeadCell[] = []
    for (let col = 0; col < columns; col += 1) {
      const startX = Math.floor(col * cellWidth)
      const startY = Math.floor(row * cellHeight)
      const endX = Math.min(imageWidth, Math.ceil((col + 1) * cellWidth))
      const endY = Math.min(imageHeight, Math.ceil((row + 1) * cellHeight))
      const representative = calculateRepresentativeColor(imageData, startX, startY, endX, endY, mode, columns)

      if (!representative || palette.length === 0) {
        line.push(transparentCell(row, col))
        continue
      }

      const matched = findClosestPaletteColor(representative, palette)
      line.push({
        row,
        col,
        key: matched.key,
        name: matched.name,
        color: matched.hex,
        rgb: matched.rgb,
        isExternal: false
      })
    }
    cells.push(line)
  }

  return cells
}

export function mergeSimilarColors(cells: MappedBeadCell[][], palette: PaletteColor[], threshold: number) {
  if (threshold <= 0) {
    return cloneCells(cells)
  }

  const paletteByKey = new Map(palette.map((color) => [color.key, color]))
  const counts = new Map<string, number>()
  for (const cell of cells.flat()) {
    if (!cell.isExternal && cell.key !== TRANSPARENT_KEY) {
      counts.set(cell.key, (counts.get(cell.key) ?? 0) + 1)
    }
  }

  const sortedKeys = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([key]) => key)
  const replaced = new Map<string, string>()

  for (let currentIndex = 0; currentIndex < sortedKeys.length; currentIndex += 1) {
    const currentKey = sortedKeys[currentIndex]
    if (replaced.has(currentKey)) {
      continue
    }
    const currentColor = paletteByKey.get(currentKey)
    if (!currentColor) {
      continue
    }

    for (let nextIndex = currentIndex + 1; nextIndex < sortedKeys.length; nextIndex += 1) {
      const nextKey = sortedKeys[nextIndex]
      if (replaced.has(nextKey)) {
        continue
      }
      const nextColor = paletteByKey.get(nextKey)
      if (nextColor && colorDistance(currentColor.rgb, nextColor.rgb) < threshold) {
        replaced.set(nextKey, currentKey)
      }
    }
  }

  return cells.map((row) =>
    row.map((cell) => {
      const targetKey = replaced.get(cell.key)
      const target = targetKey ? paletteByKey.get(targetKey) : null
      if (!target || cell.isExternal) {
        return { ...cell }
      }
      return {
        ...cell,
        key: target.key,
        name: target.name,
        color: target.hex,
        rgb: target.rgb,
        isExternal: false
      }
    })
  )
}

export function buildPatternFromImage(
  image: HTMLImageElement,
  palette: PaletteColor[],
  options: Omit<PatternOptions, 'rows'>
): PatternResult {
  const columns = options.columns
  const rows = Math.max(1, Math.round(columns * (image.height / image.width)))
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d', { willReadFrequently: true })

  if (!context) {
    throw new Error('当前环境无法创建 Canvas。')
  }

  canvas.width = image.width
  canvas.height = image.height
  context.drawImage(image, 0, 0, image.width, image.height)

  const activePalette = palette.filter((color) => !options.excludedColorKeys.includes(color.key))
  if (activePalette.length === 0) {
    throw new Error('当前可用色盘为空，请恢复至少一种颜色。')
  }

  const initialCells = calculatePixelGrid(context, image.width, image.height, columns, rows, activePalette, options.pixelationMode)
  const mergedCells = mergeSimilarColors(initialCells, activePalette, getEffectiveMergeThreshold(columns, options.similarityThreshold))
  const { colors, totalBeads } = summarizeCells(mergedCells)

  return {
    width: columns,
    height: rows,
    totalBeads,
    colors,
    cells: mergedCells,
    options: {
      ...options,
      rows
    }
  }
}

export function summarizeCells(cells: MappedBeadCell[][]) {
  const usage = new Map<string, ColorUsage>()
  let totalBeads = 0

  for (const cell of cells.flat()) {
    if (cell.isExternal || cell.key === TRANSPARENT_KEY) {
      continue
    }
    totalBeads += 1
    const current = usage.get(cell.key)
    if (current) {
      current.count += 1
    } else {
      usage.set(cell.key, {
        key: cell.key,
        name: cell.name,
        hex: cell.color,
        rgb: cell.rgb,
        count: 1
      })
    }
  }

  return {
    totalBeads,
    colors: [...usage.values()].sort((a, b) => b.count - a.count)
  }
}

export function cloneCells(cells: MappedBeadCell[][]) {
  return cells.map((row) => row.map((cell) => ({ ...cell, rgb: { ...cell.rgb } })))
}

function calculateRepresentativeColor(
  imageData: ImageData,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  mode: PixelationMode,
  columns: number
) {
  const data = imageData.data
  const imageWidth = imageData.width
  let redSum = 0
  let greenSum = 0
  let blueSum = 0
  let count = 0
  const colorCounts = new Map<string, { score: number; redSum: number; greenSum: number; blueSum: number }>()
  let dominant: RgbColor | null = null
  let dominantScore = 0
  let luminanceSum = 0

  for (let y = startY; y < endY; y += 1) {
    for (let x = startX; x < endX; x += 1) {
      const index = (y * imageWidth + x) * 4
      if (data[index + 3] < 128) {
        continue
      }
      const rgb = {
        r: data[index],
        g: data[index + 1],
        b: data[index + 2]
      }
      const luminance = getLuminance(rgb)
      count += 1
      luminanceSum += luminance

      if (mode === 'average') {
        redSum += rgb.r
        greenSum += rgb.g
        blueSum += rgb.b
        continue
      }
    }
  }

  if (count === 0) {
    return null
  }

  if (mode === 'average') {
    return {
      r: Math.round(redSum / count),
      g: Math.round(greenSum / count),
      b: Math.round(blueSum / count)
    }
  }

  const averageLuminance = luminanceSum / count
  const bucketSize = columns < 80 ? 24 : 16

  for (let y = startY; y < endY; y += 1) {
    for (let x = startX; x < endX; x += 1) {
      const index = (y * imageWidth + x) * 4
      if (data[index + 3] < 128) {
        continue
      }

      const rgb = {
        r: data[index],
        g: data[index + 1],
        b: data[index + 2]
      }
      const luminance = getLuminance(rgb)
      const edge = getLocalEdgeStrength(imageData, x, y, luminance)
      let weight = 1

      if (columns < 80) {
        weight += Math.min(5, edge / 28)
        if (luminance < averageLuminance - 24) {
          weight += 2.4
        }
      } else {
        weight += Math.min(2, edge / 72)
      }

      const key = `${quantize(rgb.r, bucketSize)},${quantize(rgb.g, bucketSize)},${quantize(rgb.b, bucketSize)}`
      const current = colorCounts.get(key) ?? { score: 0, redSum: 0, greenSum: 0, blueSum: 0 }
      current.score += weight
      current.redSum += rgb.r * weight
      current.greenSum += rgb.g * weight
      current.blueSum += rgb.b * weight
      colorCounts.set(key, current)

      if (current.score > dominantScore) {
        dominantScore = current.score
        dominant = {
          r: Math.round(current.redSum / current.score),
          g: Math.round(current.greenSum / current.score),
          b: Math.round(current.blueSum / current.score)
        }
      }
    }
  }

  return dominant
}

function getEffectiveMergeThreshold(columns: number, threshold: number) {
  if (columns >= 80) {
    return threshold
  }

  return Math.min(threshold, 18)
}

function quantize(value: number, bucketSize: number) {
  return Math.max(0, Math.min(255, Math.round(value / bucketSize) * bucketSize))
}

function getLuminance(rgb: RgbColor) {
  return 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b
}

function getLocalEdgeStrength(imageData: ImageData, x: number, y: number, luminance: number) {
  const width = imageData.width
  const height = imageData.height
  let edge = 0

  for (const point of [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1]
  ]) {
    const [nextX, nextY] = point
    if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) {
      continue
    }
    const index = (nextY * width + nextX) * 4
    if (imageData.data[index + 3] < 128) {
      continue
    }
    const neighborLuminance = getLuminance({
      r: imageData.data[index],
      g: imageData.data[index + 1],
      b: imageData.data[index + 2]
    })
    edge = Math.max(edge, Math.abs(luminance - neighborLuminance))
  }

  return edge
}
