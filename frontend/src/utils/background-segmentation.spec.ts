import { describe, expect, it } from 'vitest'
import { applyForegroundMaskToCells } from './background-segmentation'
import type { MappedBeadCell } from './pixelation'

describe('applyForegroundMaskToCells', () => {
  it('turns low-foreground cells into external cells', () => {
    const cells = [
      [cell(0, 0), cell(0, 1)],
      [cell(1, 0), cell(1, 1)]
    ]
    const mask = new Float32Array([
      0.1, 0.9,
      0.8, 0.2
    ])

    const next = applyForegroundMaskToCells(cells, mask, 2, 2, 0.45)

    expect(next[0][0].isExternal).toBe(true)
    expect(next[0][1].isExternal).toBe(false)
    expect(next[1][0].isExternal).toBe(false)
    expect(next[1][1].isExternal).toBe(true)
  })
})

function cell(row: number, col: number): MappedBeadCell {
  return {
    row,
    col,
    key: 'A1',
    displayCode: 'A1',
    name: 'MARD A1',
    color: '#111111',
    rgb: { r: 17, g: 17, b: 17 },
    isExternal: false,
    vendor: 'mard',
    vendorCodes: { mard: 'A1' }
  }
}
