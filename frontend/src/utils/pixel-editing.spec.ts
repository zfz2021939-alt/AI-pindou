import { describe, expect, it } from 'vitest'
import { replaceCellColor, withUpdatedStats } from './pixel-editing'
import type { MappedBeadCell, PaletteColor } from './pixelation'

const red: PaletteColor = {
  key: 'A1',
  displayCode: 'A1',
  name: 'MARD A1',
  hex: '#FF0000',
  rgb: { r: 255, g: 0, b: 0 },
  vendor: 'mard',
  vendorCodes: { mard: 'A1' }
}

const blue: PaletteColor = {
  key: 'B1',
  displayCode: 'B1',
  name: 'MARD B1',
  hex: '#0000FF',
  rgb: { r: 0, g: 0, b: 255 },
  vendor: 'mard',
  vendorCodes: { mard: 'B1' }
}

describe('replaceCellColor', () => {
  it('updates one cell and keeps other cells unchanged', () => {
    const cells = [
      [cell(0, 0, red), cell(0, 1, red)],
      [cell(1, 0, red), cell(1, 1, red)]
    ]

    const next = replaceCellColor(cells, 1, 0, blue)

    expect(next[1][0]).toMatchObject({
      key: 'B1',
      name: 'MARD B1',
      color: '#0000FF',
      isExternal: false
    })
    expect(next[0][0].key).toBe('A1')
    expect(cells[1][0].key).toBe('A1')
  })

  it('turns an external cell into a normal bead and updates stats', () => {
    const cells = [
      [cell(0, 0, red), { ...cell(0, 1, red), isExternal: true }]
    ]

    const stats = withUpdatedStats(replaceCellColor(cells, 0, 1, blue))

    expect(stats.totalBeads).toBe(2)
    expect(stats.colors).toEqual([
      expect.objectContaining({ key: 'A1', count: 1 }),
      expect.objectContaining({ key: 'B1', count: 1 })
    ])
  })
})

function cell(row: number, col: number, color: PaletteColor): MappedBeadCell {
  return {
    row,
    col,
    key: color.key,
    displayCode: color.displayCode,
    name: color.name,
    color: color.hex,
    rgb: color.rgb,
    isExternal: false,
    vendor: color.vendor,
    vendorCodes: { ...color.vendorCodes }
  }
}
