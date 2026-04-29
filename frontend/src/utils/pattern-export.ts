import type { PatternResult } from './pixelation'
import type { BeadVendorId } from '@/data/mard-palette'

export function createPatternJsonPayload(pattern: PatternResult, sourceName: string, paletteSource: string, vendor: BeadVendorId, aiMeta?: Record<string, string>) {
  return {
    app: 'AIpindou',
    version: '1.0.0',
    source: sourceName,
    paletteSource,
    vendor,
    options: pattern.options,
    totalBeads: pattern.totalBeads,
    colors: pattern.colors.map(({ key, displayCode, name, hex, count, vendorCodes }) => ({
      canonicalCode: key,
      displayCode,
      vendorCodes,
      vendor,
      name,
      hex,
      count
    })),
    ai: aiMeta ?? null,
    cells: pattern.cells.flat().map((cell) => ({
      row: cell.row,
      col: cell.col,
      canonicalCode: cell.isExternal ? null : cell.key,
      displayCode: cell.isExternal ? null : cell.displayCode,
      hex: cell.isExternal ? null : cell.color,
      isExternal: cell.isExternal
    }))
  }
}

export function createColorCsv(pattern: PatternResult, vendor: BeadVendorId) {
  const rows = [
    ['canonicalCode', 'displayCode', 'vendor', 'name', 'hex', 'count'],
    ...pattern.colors.map((color) => [color.key, color.displayCode, vendor, color.name, color.hex, String(color.count)])
  ]
  return rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n')
}

function escapeCsvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`
}
