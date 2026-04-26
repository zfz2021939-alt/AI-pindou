import type { PatternResult } from './pixelation'

export function createPatternJsonPayload(pattern: PatternResult, sourceName: string, paletteSource: string, aiMeta?: Record<string, string>) {
  return {
    app: 'AIpindou',
    version: '1.0.0',
    source: sourceName,
    paletteSource,
    options: pattern.options,
    totalBeads: pattern.totalBeads,
    colors: pattern.colors.map(({ key, name, hex, count }) => ({ code: key, name, hex, count })),
    ai: aiMeta ?? null,
    cells: pattern.cells.flat().map((cell) => ({
      row: cell.row,
      col: cell.col,
      code: cell.isExternal ? null : cell.key,
      hex: cell.isExternal ? null : cell.color,
      isExternal: cell.isExternal
    }))
  }
}

export function createColorCsv(pattern: PatternResult) {
  const rows = [
    ['code', 'name', 'hex', 'count'],
    ...pattern.colors.map((color) => [color.key, color.name, color.hex, String(color.count)])
  ]
  return rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n')
}

function escapeCsvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`
}
