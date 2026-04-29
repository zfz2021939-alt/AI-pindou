import { describe, expect, it } from 'vitest'
import { applyFaceContourMaskToCells } from './face-contour-enhancement'
import type { MappedBeadCell, PaletteColor } from './pixelation'

const black: PaletteColor = {
  key: 'H7',
  displayCode: 'H7',
  name: 'MARD H7',
  hex: '#000000',
  rgb: { r: 0, g: 0, b: 0 },
  vendor: 'mard',
  vendorCodes: { mard: 'H7' }
}

const white: PaletteColor = {
  key: 'H1',
  displayCode: 'H1',
  name: 'MARD H1',
  hex: '#FFFFFF',
  rgb: { r: 255, g: 255, b: 255 },
  vendor: 'mard',
  vendorCodes: { mard: 'H1' }
}

describe('applyFaceContourMaskToCells', () => {
  it('recolors only cells touched by the contour mask', () => {
    const cells = [
      [cell(0, 0), cell(0, 1)],
      [cell(1, 0), cell(1, 1)]
    ]
    const imageData = createImageData()
    const mask = new Float32Array([
      0, 1,
      0, 0
    ])

    const result = applyFaceContourMaskToCells(cells, imageData, mask, [black, white], 2, 2, 0.45)

    expect(result.changedCells).toBe(1)
    expect(result.cells[0][1].key).toBe('H7')
    expect(result.cells[0][0].key).toBe('H1')
  })
})

function cell(row: number, col: number): MappedBeadCell {
  return {
    row,
    col,
    key: 'H1',
    displayCode: 'H1',
    name: 'MARD H1',
    color: '#FFFFFF',
    rgb: { r: 255, g: 255, b: 255 },
    isExternal: false,
    vendor: 'mard',
    vendorCodes: { mard: 'H1' }
  }
}

function createImageData() {
  return {
    width: 2,
    height: 2,
    data: new Uint8ClampedArray([
      255, 255, 255, 255,
      0, 0, 0, 255,
      255, 255, 255, 255,
      255, 255, 255, 255
    ])
  } as ImageData
}
