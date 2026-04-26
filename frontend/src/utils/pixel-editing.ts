import {
  TRANSPARENT_KEY,
  cloneCells,
  colorDistance,
  findClosestPaletteColor,
  summarizeCells,
  transparentCell
} from './pixelation'
import type { MappedBeadCell, PaletteColor } from './pixelation'

export function eraseBorderBackground(cells: MappedBeadCell[][]) {
  const height = cells.length
  const width = cells[0]?.length ?? 0
  const counts = new Map<string, number>()

  const countCell = (row: number, col: number) => {
    const cell = cells[row]?.[col]
    if (!cell || cell.isExternal || cell.key === TRANSPARENT_KEY) {
      return
    }
    counts.set(cell.key, (counts.get(cell.key) ?? 0) + 1)
  }

  for (let col = 0; col < width; col += 1) {
    countCell(0, col)
    countCell(height - 1, col)
  }
  for (let row = 1; row < height - 1; row += 1) {
    countCell(row, 0)
    countCell(row, width - 1)
  }

  const targetKey = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
  if (!targetKey) {
    return cloneCells(cells)
  }

  const next = cloneCells(cells)
  const visited = Array.from({ length: height }, () => Array.from({ length: width }, () => false))
  const stack: Array<{ row: number; col: number }> = []

  const pushIfTarget = (row: number, col: number) => {
    if (row < 0 || row >= height || col < 0 || col >= width || visited[row][col]) {
      return
    }
    const cell = next[row][col]
    if (!cell || cell.isExternal || cell.key !== targetKey) {
      return
    }
    visited[row][col] = true
    stack.push({ row, col })
  }

  for (let col = 0; col < width; col += 1) {
    pushIfTarget(0, col)
    pushIfTarget(height - 1, col)
  }
  for (let row = 1; row < height - 1; row += 1) {
    pushIfTarget(row, 0)
    pushIfTarget(row, width - 1)
  }

  while (stack.length > 0) {
    const current = stack.pop()
    if (!current) {
      continue
    }
    next[current.row][current.col] = transparentCell(current.row, current.col)
    pushIfTarget(current.row - 1, current.col)
    pushIfTarget(current.row + 1, current.col)
    pushIfTarget(current.row, current.col - 1)
    pushIfTarget(current.row, current.col + 1)
  }

  return next
}

export function remapExcludedColors(cells: MappedBeadCell[][], palette: PaletteColor[], excludedKeys: string[]) {
  const availablePalette = palette.filter((color) => !excludedKeys.includes(color.key))
  if (availablePalette.length === 0) {
    return cloneCells(cells)
  }

  return cells.map((row) =>
    row.map((cell) => {
      if (cell.isExternal || cell.key === TRANSPARENT_KEY || !excludedKeys.includes(cell.key)) {
        return { ...cell }
      }
      const closest = findClosestPaletteColor(cell.rgb, availablePalette)
      return {
        ...cell,
        key: closest.key,
        name: closest.name,
        color: closest.hex,
        rgb: closest.rgb,
        isExternal: false
      }
    })
  )
}

export function replaceColor(cells: MappedBeadCell[][], sourceKey: string, target: PaletteColor) {
  return cells.map((row) =>
    row.map((cell) => {
      if (cell.isExternal || cell.key !== sourceKey) {
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

export function replaceCellColor(cells: MappedBeadCell[][], row: number, col: number, target: PaletteColor) {
  return cells.map((line, rowIndex) =>
    line.map((cell, colIndex) => {
      if (rowIndex !== row || colIndex !== col) {
        return { ...cell, rgb: { ...cell.rgb } }
      }
      return {
        ...cell,
        key: target.key,
        name: target.name,
        color: target.hex,
        rgb: { ...target.rgb },
        isExternal: false
      }
    })
  )
}

export function findClosestUsedColor(source: PaletteColor, usedColors: PaletteColor[]) {
  return usedColors
    .filter((color) => color.key !== source.key)
    .sort((first, second) => colorDistance(source.rgb, first.rgb) - colorDistance(source.rgb, second.rgb))[0]
}

export function withUpdatedStats(cells: MappedBeadCell[][]) {
  const stats = summarizeCells(cells)
  return { cells, ...stats }
}
