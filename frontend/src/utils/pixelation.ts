import { getBeadDisplayCode } from '@/data/mard-palette'
import type { BeadVendorId, MardColor, MardTier } from '@/data/mard-palette'

export type PixelationMode = 'dominant' | 'average'
export type ConversionMode = 'clear-pixel' | PixelationMode
export type CleanupStrength = 'soft' | 'normal' | 'strong'

export type RgbColor = {
  r: number
  g: number
  b: number
}

export type PaletteColor = {
  key: string
  displayCode: string
  name: string
  hex: string
  rgb: RgbColor
  vendor: BeadVendorId
  vendorCodes: Partial<Record<BeadVendorId, string>>
}

export type MappedBeadCell = {
  row: number
  col: number
  key: string
  displayCode: string
  name: string
  color: string
  rgb: RgbColor
  isExternal: boolean
  vendor: BeadVendorId
  vendorCodes: Partial<Record<BeadVendorId, string>>
}

export type ColorUsage = PaletteColor & {
  count: number
}

export type PatternOptions = {
  columns: number
  rows: number
  paletteTier: MardTier
  paletteVendor: BeadVendorId
  conversionMode: ConversionMode
  pixelationMode: PixelationMode
  maxColors: number
  autoEraseBackground: boolean
  cleanupStrength: CleanupStrength
  similarityThreshold: number
  excludedColorKeys: string[]
  backgroundErase?: { mode: 'ai' | 'fallback' | 'local'; used: boolean }
  faceContourEnhance?: { used: boolean; detector: 'mediapipe' | 'heuristic' | 'none' }
  silhouetteOutline?: 'off' | 'dark'
}

export type PatternResult = {
  width: number
  height: number
  totalBeads: number
  colors: ColorUsage[]
  cells: MappedBeadCell[][]
  options: PatternOptions
}

type BuildPatternOptions = Omit<PatternOptions, 'rows' | 'conversionMode' | 'maxColors' | 'autoEraseBackground' | 'cleanupStrength'> &
  Partial<Pick<PatternOptions, 'conversionMode' | 'maxColors' | 'autoEraseBackground' | 'cleanupStrength'>>

export const TRANSPARENT_KEY = 'ERASE'

export const transparentCell = (row: number, col: number): MappedBeadCell => ({
  row,
  col,
  key: TRANSPARENT_KEY,
  displayCode: TRANSPARENT_KEY,
  name: '外部区域',
  color: '#FFFFFF',
  rgb: { r: 255, g: 255, b: 255 },
  isExternal: true,
  vendor: 'mard',
  vendorCodes: {}
})

export function toPaletteColor(color: MardColor, vendor: BeadVendorId = 'mard'): PaletteColor {
  return {
    key: color.code,
    displayCode: getBeadDisplayCode(color, vendor),
    name: color.name,
    hex: color.hex,
    rgb: {
      r: color.rgb[0],
      g: color.rgb[1],
      b: color.rgb[2]
    },
    vendor,
    vendorCodes: { ...color.vendorCodes }
  }
}

// RGB 欧氏距离：仅用于颜色「合并 / 限色」的阈值判断（mergeSimilarColors /
// selectLimitedPalette），这些阈值按 RGB 尺度(0~441)调校，保持不变。
export function colorDistance(first: RgbColor, second: RgbColor) {
  const red = first.r - second.r
  const green = first.g - second.g
  const blue = first.b - second.b
  return Math.sqrt(red * red + green * green + blue * blue)
}

// 「最近豆」匹配改用 CIELAB 感知距离而非 RGB 欧氏。RGB 距离在肤色 / 粉 / pastel 上
// 会系统性选到「数学最近但肉眼明显不对」的豆：在真实 MARD 48 色盘上实测，约 1/3~1/2
// 的像素被选到非感知最优豆（以 CIEDE2000 衡量），换 CIELAB 可把平均感知误差砍掉一半以上。
type LabColor = { L: number; a: number; b: number }

const labCache = new Map<number, LabColor>()

function rgbToLab(rgb: RgbColor): LabColor {
  const key = (rgb.r << 16) | (rgb.g << 8) | rgb.b
  const cached = labCache.get(key)
  if (cached) {
    return cached
  }
  const toLinear = (channel: number) => {
    const c = channel / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  const r = toLinear(rgb.r)
  const g = toLinear(rgb.g)
  const b = toLinear(rgb.b)
  // 线性 sRGB -> XYZ(D65) -> 归一化到 D65 白点
  const x = (0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047
  const y = 0.2126729 * r + 0.7151522 * g + 0.0721750 * b
  const z = (0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / 1.08883
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116)
  const fx = f(x)
  const fy = f(y)
  const fz = f(z)
  const lab: LabColor = { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) }
  labCache.set(key, lab)
  return lab
}

export function findClosestPaletteColor(target: RgbColor, palette: PaletteColor[]) {
  const targetLab = rgbToLab(target)
  let closest = palette[0]
  let minDistance = Number.POSITIVE_INFINITY

  for (const color of palette) {
    const lab = rgbToLab(color.rgb)
    const dL = targetLab.L - lab.L
    const da = targetLab.a - lab.a
    const db = targetLab.b - lab.b
    const distance = dL * dL + da * da + db * db // 平方 CIE76 ΔE*，比较用平方即可省去开方
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
        displayCode: matched.displayCode,
        name: matched.name,
        color: matched.hex,
        rgb: matched.rgb,
        isExternal: false,
        vendor: matched.vendor,
        vendorCodes: { ...matched.vendorCodes }
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
        displayCode: target.displayCode,
        name: target.name,
        color: target.hex,
        rgb: target.rgb,
        isExternal: false,
        vendor: target.vendor,
        vendorCodes: { ...target.vendorCodes }
      }
    })
  )
}

export function buildPatternFromImage(
  image: HTMLImageElement,
  palette: PaletteColor[],
  options: BuildPatternOptions
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

  const normalizedOptions = normalizePatternOptions(options, rows)
  const imageData = context.getImageData(0, 0, image.width, image.height)
  let cells: MappedBeadCell[][]
  let finalOptions = normalizedOptions

  if (normalizedOptions.conversionMode === 'clear-pixel') {
    const foregroundMask = createForegroundMask(imageData, normalizedOptions.autoEraseBackground)
    const enhancedImageData = enhanceSourceForPattern(imageData, foregroundMask)
    const limitedPalette = selectLimitedPalette(enhancedImageData, activePalette, foregroundMask, normalizedOptions.maxColors)
    const gridCells = calculateClearPixelGrid(enhancedImageData, foregroundMask, columns, rows, limitedPalette)
    const reinforced = reinforcePatternEdges(gridCells, enhancedImageData, foregroundMask, limitedPalette)
    cells = cleanupPatternNoise(reinforced.cells, limitedPalette, normalizedOptions.cleanupStrength, reinforced.protectedCells)
    if (normalizedOptions.silhouetteOutline === 'dark') {
      cells = reinforceSilhouetteOutline(cells, limitedPalette)
    }
    finalOptions = {
      ...normalizedOptions,
      backgroundErase: normalizedOptions.autoEraseBackground ? { mode: 'local', used: true } : normalizedOptions.backgroundErase
    }
  } else {
    const initialCells = calculatePixelGrid(context, image.width, image.height, columns, rows, activePalette, normalizedOptions.pixelationMode)
    cells = mergeSimilarColors(initialCells, activePalette, getEffectiveMergeThreshold(columns, normalizedOptions.similarityThreshold))
  }

  const { colors, totalBeads } = summarizeCells(cells)

  return {
    width: columns,
    height: rows,
    totalBeads,
    colors,
    cells,
    options: finalOptions
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
        displayCode: cell.displayCode,
        name: cell.name,
        hex: cell.color,
        rgb: cell.rgb,
        vendor: cell.vendor,
        vendorCodes: { ...cell.vendorCodes },
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
  return cells.map((row) => row.map((cell) => ({ ...cell, rgb: { ...cell.rgb }, vendorCodes: { ...cell.vendorCodes } })))
}

function normalizePatternOptions(options: BuildPatternOptions, rows: number): PatternOptions {
  const conversionMode = options.conversionMode ?? 'clear-pixel'
  const pixelationMode = conversionMode === 'average' || conversionMode === 'dominant' ? conversionMode : options.pixelationMode

  return {
    ...options,
    rows,
    conversionMode,
    pixelationMode,
    maxColors: clampNumber(Math.round(options.maxColors ?? 18), 12, 24),
    autoEraseBackground: options.autoEraseBackground ?? true,
    cleanupStrength: options.cleanupStrength ?? 'normal',
    silhouetteOutline: options.silhouetteOutline ?? 'off'
  }
}

export function createForegroundMask(imageData: ImageData, autoEraseBackground = true) {
  const { width, height, data } = imageData
  const mask = new Uint8Array(width * height)

  if (!autoEraseBackground) {
    for (let index = 0; index < mask.length; index += 1) {
      mask[index] = data[index * 4 + 3] >= 128 ? 1 : 0
    }
    return mask
  }

  const borderAverage = getOpaqueBorderAverage(imageData)
  const visited = new Uint8Array(width * height)
  const queue: number[] = []

  const pushIfBackground = (x: number, y: number) => {
    if (x < 0 || x >= width || y < 0 || y >= height) {
      return
    }
    const index = y * width + x
    if (visited[index] || !isLocalBackgroundPixel(imageData, x, y, borderAverage)) {
      return
    }
    visited[index] = 1
    queue.push(index)
  }

  for (let x = 0; x < width; x += 1) {
    pushIfBackground(x, 0)
    pushIfBackground(x, height - 1)
  }
  for (let y = 1; y < height - 1; y += 1) {
    pushIfBackground(0, y)
    pushIfBackground(width - 1, y)
  }

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const index = queue[cursor]
    const x = index % width
    const y = Math.floor(index / width)
    pushIfBackground(x - 1, y)
    pushIfBackground(x + 1, y)
    pushIfBackground(x, y - 1)
    pushIfBackground(x, y + 1)
  }

  for (let index = 0; index < mask.length; index += 1) {
    mask[index] = data[index * 4 + 3] >= 128 && !visited[index] ? 1 : 0
  }

  return mask
}

export function enhanceSourceForPattern(imageData: ImageData, foregroundMask: Uint8Array) {
  const { width, height, data } = imageData
  const next = new Uint8ClampedArray(data)

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixelIndex = y * width + x
      const dataIndex = pixelIndex * 4
      if (!foregroundMask[pixelIndex] || data[dataIndex + 3] < 128) {
        next[dataIndex + 3] = 0
        continue
      }

      const source = { r: data[dataIndex], g: data[dataIndex + 1], b: data[dataIndex + 2] }
      const edge = getLocalEdgeStrength(imageData, x, y, getLuminance(source))
      const adjusted = adjustColorForPattern(source, edge)
      next[dataIndex] = adjusted.r
      next[dataIndex + 1] = adjusted.g
      next[dataIndex + 2] = adjusted.b
      next[dataIndex + 3] = 255
    }
  }

  return { width, height, data: next } as ImageData
}

export function selectLimitedPalette(imageData: ImageData, palette: PaletteColor[], foregroundMask: Uint8Array, maxColors: number) {
  const colorScores = new Map<string, { color: PaletteColor; score: number; edgeScore: number }>()
  const stride = Math.max(1, Math.floor(Math.sqrt((imageData.width * imageData.height) / 26000)))

  for (let y = 0; y < imageData.height; y += stride) {
    for (let x = 0; x < imageData.width; x += stride) {
      const pixelIndex = y * imageData.width + x
      const dataIndex = pixelIndex * 4
      if (!foregroundMask[pixelIndex] || imageData.data[dataIndex + 3] < 128) {
        continue
      }

      const rgb = {
        r: imageData.data[dataIndex],
        g: imageData.data[dataIndex + 1],
        b: imageData.data[dataIndex + 2]
      }
      const edge = getLocalEdgeStrength(imageData, x, y, getLuminance(rgb))
      const matched = findClosestPaletteColor(rgb, palette)
      const current = colorScores.get(matched.key) ?? { color: matched, score: 0, edgeScore: 0 }
      current.score += 1 + Math.min(3, edge / 70)
      current.edgeScore += edge
      colorScores.set(matched.key, current)
    }
  }

  const targetCount = Math.min(clampNumber(Math.round(maxColors), 12, 24), palette.length)
  const sorted = [...colorScores.values()].sort((first, second) => second.score + second.edgeScore * 0.008 - (first.score + first.edgeScore * 0.008))
  const selected: PaletteColor[] = []

  for (const item of sorted) {
    const minDistance = selected.reduce((distance, color) => Math.min(distance, colorDistance(color.rgb, item.color.rgb)), Number.POSITIVE_INFINITY)
    if (selected.length < Math.max(4, Math.floor(targetCount * 0.65)) || minDistance > 18) {
      selected.push(item.color)
    }
    if (selected.length >= targetCount) {
      return selected
    }
  }

  for (const item of sorted) {
    if (!selected.some((color) => color.key === item.color.key)) {
      selected.push(item.color)
    }
    if (selected.length >= targetCount) {
      break
    }
  }

  return selected.length > 0 ? selected : palette.slice(0, targetCount)
}

export function calculateClearPixelGrid(
  imageData: ImageData,
  foregroundMask: Uint8Array,
  columns: number,
  rows: number,
  palette: PaletteColor[]
) {
  const cellWidth = imageData.width / columns
  const cellHeight = imageData.height / rows
  const cells: MappedBeadCell[][] = []

  for (let row = 0; row < rows; row += 1) {
    const line: MappedBeadCell[] = []
    for (let col = 0; col < columns; col += 1) {
      const bounds = getCellBounds(imageData.width, imageData.height, columns, rows, row, col)
      const foregroundRatio = getAverageMaskValue(foregroundMask, imageData.width, bounds)
      if (foregroundRatio < 0.34 || palette.length === 0) {
        line.push(transparentCell(row, col))
        continue
      }

      const representative = calculateStableCellColor(imageData, foregroundMask, bounds, columns)
      if (!representative) {
        line.push(transparentCell(row, col))
        continue
      }

      line.push(createCellFromPalette(row, col, findClosestPaletteColor(representative, palette)))
    }
    cells.push(line)
  }

  return cells
}

// 对前景主体强制一圈 silhouette 描边豆 —— 解决「水彩软边 / 无描边线源图」轮廓不清的问题。
// 与 reinforcePatternEdges 不同:不依赖边缘对比度阈值,只看前景/背景边界,因此对低对比
// 软边主体(如纯白脸)也能勾出清晰轮廓。opt-in(silhouetteOutline:'dark'),默认关以保留原作风格。
export function reinforceSilhouetteOutline(cells: MappedBeadCell[][], palette: PaletteColor[]) {
  const height = cells.length
  const width = cells[0]?.length ?? 0
  if (height === 0 || width === 0 || palette.length === 0) {
    return cells
  }
  const lum = (c: RgbColor) => 0.299 * c.r + 0.587 * c.g + 0.114 * c.b
  const outlineColor = palette.reduce((darkest, color) => (lum(color.rgb) < lum(darkest.rgb) ? color : darkest), palette[0])
  const isForeground = (row: number, col: number) =>
    row >= 0 && row < height && col >= 0 && col < width &&
    !cells[row][col].isExternal && cells[row][col].key !== TRANSPARENT_KEY
  const next = cloneCells(cells)
  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      if (!isForeground(row, col)) {
        continue
      }
      const onBoundary =
        !isForeground(row - 1, col) ||
        !isForeground(row + 1, col) ||
        !isForeground(row, col - 1) ||
        !isForeground(row, col + 1)
      if (onBoundary) {
        next[row][col] = createCellFromPalette(row, col, outlineColor)
      }
    }
  }
  return next
}

export function cleanupPatternNoise(
  cells: MappedBeadCell[][],
  palette: PaletteColor[],
  strength: CleanupStrength,
  protectedCells = createBooleanGrid(cells.length, cells[0]?.length ?? 0)
) {
  const height = cells.length
  const width = cells[0]?.length ?? 0
  const maxSize = strength === 'soft' ? 1 : strength === 'strong' ? 4 : 2
  const next = cloneCells(cells)
  const visited = createBooleanGrid(height, width)
  const paletteByKey = new Map(palette.map((color) => [color.key, color]))

  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      if (visited[row][col] || next[row][col].isExternal || next[row][col].key === TRANSPARENT_KEY) {
        continue
      }

      const component = collectComponent(next, visited, row, col)
      const protectedCount = component.filter((point) => protectedCells[point.row]?.[point.col]).length
      if (component.length > maxSize || protectedCount > 0) {
        continue
      }

      const replacement = findNeighborReplacement(next, component, paletteByKey)
      if (!replacement) {
        continue
      }
      for (const point of component) {
        next[point.row][point.col] = createCellFromPalette(point.row, point.col, replacement)
      }
    }
  }

  return next
}

export function reinforcePatternEdges(
  cells: MappedBeadCell[][],
  imageData: ImageData,
  foregroundMask: Uint8Array,
  palette: PaletteColor[]
) {
  const height = cells.length
  const width = cells[0]?.length ?? 0
  const next = cloneCells(cells)
  const protectedCells = createBooleanGrid(height, width)
  const darkPalette = palette.filter((color) => getLuminance(color.rgb) < 120)
  const edgePalette = darkPalette.length > 0 ? darkPalette : palette

  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      const cell = next[row][col]
      if (cell.isExternal || cell.key === TRANSPARENT_KEY) {
        continue
      }
      const bounds = getCellBounds(imageData.width, imageData.height, width, height, row, col)
      const edge = getAverageEdgeStrength(imageData, foregroundMask, bounds)
      const boundary = getCellForegroundBoundaryScore(foregroundMask, imageData.width, imageData.height, bounds)
      const isCriticalEdge = edge > 58 || boundary > 0.24
      if (!isCriticalEdge) {
        continue
      }

      protectedCells[row][col] = true
      if (getLuminance(cell.rgb) > 178 && edge > 78) {
        const target = findClosestPaletteColor(scaleColor(cell.rgb, 0.58), edgePalette)
        next[row][col] = createCellFromPalette(row, col, target)
      }
    }
  }

  return { cells: next, protectedCells }
}

function getOpaqueBorderAverage(imageData: ImageData) {
  const { width, height, data } = imageData
  let red = 0
  let green = 0
  let blue = 0
  let count = 0

  const add = (x: number, y: number) => {
    const index = (y * width + x) * 4
    if (data[index + 3] < 128) {
      return
    }
    red += data[index]
    green += data[index + 1]
    blue += data[index + 2]
    count += 1
  }

  for (let x = 0; x < width; x += 1) {
    add(x, 0)
    add(x, height - 1)
  }
  for (let y = 1; y < height - 1; y += 1) {
    add(0, y)
    add(width - 1, y)
  }

  if (count === 0) {
    return null
  }

  return { r: Math.round(red / count), g: Math.round(green / count), b: Math.round(blue / count) }
}

function isLocalBackgroundPixel(imageData: ImageData, x: number, y: number, borderAverage: RgbColor | null) {
  const index = (y * imageData.width + x) * 4
  const alpha = imageData.data[index + 3]
  if (alpha < 128) {
    return true
  }

  const rgb = { r: imageData.data[index], g: imageData.data[index + 1], b: imageData.data[index + 2] }
  const luminance = getLuminance(rgb)
  const saturation = getSaturationRange(rgb)
  if (luminance > 236 && saturation < 26) {
    return true
  }

  return Boolean(borderAverage && getLuminance(borderAverage) > 205 && colorDistance(rgb, borderAverage) < 34)
}

function adjustColorForPattern(rgb: RgbColor, edge: number): RgbColor {
  const contrast = 1.08
  const saturation = 1.1
  const average = (rgb.r + rgb.g + rgb.b) / 3
  const edgeBoost = Math.min(18, edge / 6)
  const luminance = getLuminance(rgb)
  const darkness = luminance < 128 ? -edgeBoost : edgeBoost * 0.35

  return {
    r: clampChannel((average + (rgb.r - average) * saturation - 128) * contrast + 128 + darkness),
    g: clampChannel((average + (rgb.g - average) * saturation - 128) * contrast + 128 + darkness),
    b: clampChannel((average + (rgb.b - average) * saturation - 128) * contrast + 128 + darkness)
  }
}

function getCellBounds(width: number, height: number, columns: number, rows: number, row: number, col: number) {
  return {
    startX: Math.floor(col * (width / columns)),
    startY: Math.floor(row * (height / rows)),
    endX: Math.min(width, Math.ceil((col + 1) * (width / columns))),
    endY: Math.min(height, Math.ceil((row + 1) * (height / rows)))
  }
}

function getAverageMaskValue(mask: Uint8Array, width: number, bounds: { startX: number; startY: number; endX: number; endY: number }) {
  let sum = 0
  let count = 0
  for (let y = bounds.startY; y < bounds.endY; y += 1) {
    for (let x = bounds.startX; x < bounds.endX; x += 1) {
      sum += mask[y * width + x] ?? 0
      count += 1
    }
  }
  return count > 0 ? sum / count : 0
}

function calculateStableCellColor(
  imageData: ImageData,
  foregroundMask: Uint8Array,
  bounds: { startX: number; startY: number; endX: number; endY: number },
  columns: number
) {
  const bucketSize = columns < 80 ? 30 : 22
  const colorCounts = new Map<string, { score: number; redSum: number; greenSum: number; blueSum: number }>()
  let best: RgbColor | null = null
  let bestScore = 0

  for (let y = bounds.startY; y < bounds.endY; y += 1) {
    for (let x = bounds.startX; x < bounds.endX; x += 1) {
      const pixelIndex = y * imageData.width + x
      const dataIndex = pixelIndex * 4
      if (!foregroundMask[pixelIndex] || imageData.data[dataIndex + 3] < 128) {
        continue
      }

      const rgb = { r: imageData.data[dataIndex], g: imageData.data[dataIndex + 1], b: imageData.data[dataIndex + 2] }
      const edge = getLocalEdgeStrength(imageData, x, y, getLuminance(rgb))
      const weight = 1 + Math.min(columns < 80 ? 4 : 2.2, edge / (columns < 80 ? 34 : 56))
      const key = `${quantize(rgb.r, bucketSize)},${quantize(rgb.g, bucketSize)},${quantize(rgb.b, bucketSize)}`
      const current = colorCounts.get(key) ?? { score: 0, redSum: 0, greenSum: 0, blueSum: 0 }
      current.score += weight
      current.redSum += rgb.r * weight
      current.greenSum += rgb.g * weight
      current.blueSum += rgb.b * weight
      colorCounts.set(key, current)

      if (current.score > bestScore) {
        bestScore = current.score
        best = {
          r: Math.round(current.redSum / current.score),
          g: Math.round(current.greenSum / current.score),
          b: Math.round(current.blueSum / current.score)
        }
      }
    }
  }

  return best
}

function createCellFromPalette(row: number, col: number, color: PaletteColor): MappedBeadCell {
  return {
    row,
    col,
    key: color.key,
    displayCode: color.displayCode,
    name: color.name,
    color: color.hex,
    rgb: { ...color.rgb },
    isExternal: false,
    vendor: color.vendor,
    vendorCodes: { ...color.vendorCodes }
  }
}

function createBooleanGrid(height: number, width: number) {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => false))
}

function collectComponent(cells: MappedBeadCell[][], visited: boolean[][], row: number, col: number) {
  const targetKey = cells[row][col].key
  const stack = [{ row, col }]
  const component: Array<{ row: number; col: number }> = []
  visited[row][col] = true

  while (stack.length > 0) {
    const current = stack.pop()
    if (!current) {
      continue
    }
    component.push(current)
    for (const neighbor of getCellNeighbors(cells.length, cells[0]?.length ?? 0, current.row, current.col)) {
      const cell = cells[neighbor.row][neighbor.col]
      if (!visited[neighbor.row][neighbor.col] && !cell.isExternal && cell.key === targetKey) {
        visited[neighbor.row][neighbor.col] = true
        stack.push(neighbor)
      }
    }
  }

  return component
}

function findNeighborReplacement(cells: MappedBeadCell[][], component: Array<{ row: number; col: number }>, paletteByKey: Map<string, PaletteColor>) {
  const componentKeys = new Set(component.map((point) => `${point.row},${point.col}`))
  const counts = new Map<string, number>()
  for (const point of component) {
    for (const neighbor of getCellNeighbors(cells.length, cells[0]?.length ?? 0, point.row, point.col)) {
      if (componentKeys.has(`${neighbor.row},${neighbor.col}`)) {
        continue
      }
      const cell = cells[neighbor.row][neighbor.col]
      if (!cell.isExternal && cell.key !== TRANSPARENT_KEY) {
        counts.set(cell.key, (counts.get(cell.key) ?? 0) + 1)
      }
    }
  }

  const targetKey = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
  return targetKey ? paletteByKey.get(targetKey) : null
}

function getCellNeighbors(height: number, width: number, row: number, col: number) {
  return [
    { row: row - 1, col },
    { row: row + 1, col },
    { row, col: col - 1 },
    { row, col: col + 1 }
  ].filter((point) => point.row >= 0 && point.row < height && point.col >= 0 && point.col < width)
}

function getAverageEdgeStrength(imageData: ImageData, foregroundMask: Uint8Array, bounds: { startX: number; startY: number; endX: number; endY: number }) {
  let sum = 0
  let count = 0
  for (let y = bounds.startY; y < bounds.endY; y += 1) {
    for (let x = bounds.startX; x < bounds.endX; x += 1) {
      const pixelIndex = y * imageData.width + x
      const dataIndex = pixelIndex * 4
      if (!foregroundMask[pixelIndex] || imageData.data[dataIndex + 3] < 128) {
        continue
      }
      const rgb = { r: imageData.data[dataIndex], g: imageData.data[dataIndex + 1], b: imageData.data[dataIndex + 2] }
      sum += getLocalEdgeStrength(imageData, x, y, getLuminance(rgb))
      count += 1
    }
  }
  return count > 0 ? sum / count : 0
}

function getCellForegroundBoundaryScore(
  foregroundMask: Uint8Array,
  width: number,
  height: number,
  bounds: { startX: number; startY: number; endX: number; endY: number }
) {
  let boundary = 0
  let count = 0
  for (let y = bounds.startY; y < bounds.endY; y += 1) {
    for (let x = bounds.startX; x < bounds.endX; x += 1) {
      const index = y * width + x
      if (!foregroundMask[index]) {
        continue
      }
      count += 1
      for (const [nextX, nextY] of [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1]
      ]) {
        if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height || !foregroundMask[nextY * width + nextX]) {
          boundary += 1
          break
        }
      }
    }
  }
  return count > 0 ? boundary / count : 0
}

function scaleColor(rgb: RgbColor, factor: number) {
  return {
    r: clampChannel(rgb.r * factor),
    g: clampChannel(rgb.g * factor),
    b: clampChannel(rgb.b * factor)
  }
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

export function getEffectiveMergeThreshold(columns: number, threshold: number) {
  if (columns >= 80) {
    return threshold
  }

  return Math.min(threshold, 18)
}

function quantize(value: number, bucketSize: number) {
  return Math.max(0, Math.min(255, Math.round(value / bucketSize) * bucketSize))
}

function clampNumber(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function clampChannel(value: number) {
  return Math.round(clampNumber(value, 0, 255))
}

function getSaturationRange(rgb: RgbColor) {
  return Math.max(rgb.r, rgb.g, rgb.b) - Math.min(rgb.r, rgb.g, rgb.b)
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
