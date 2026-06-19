import { describe, expect, it } from 'vitest'
import { createColorCsv, createPatternJsonPayload } from './pattern-export'
import type { PatternResult } from './pixelation'

describe('pattern export vendor codes', () => {
  it('exports canonical and selected vendor display codes', () => {
    const pattern = createPattern()
    const payload = createPatternJsonPayload(pattern, 'source.png', 'test palette', 'coco')
    const csv = createColorCsv(pattern, 'coco')

    expect(payload.vendor).toBe('coco')
    expect(payload.colors[0]).toMatchObject({
      canonicalCode: 'COCO_XMAS_RED',
      displayCode: '圣诞红',
      vendor: 'coco',
      hex: '#B83944',
      count: 1
    })
    expect(payload.cells[0]).toMatchObject({
      canonicalCode: 'COCO_XMAS_RED',
      displayCode: '圣诞红'
    })
    expect(csv).toContain('"canonicalCode","displayCode","vendor","name","hex","count"')
    expect(csv).toContain('"COCO_XMAS_RED","圣诞红","coco","COCO 圣诞红","#B83944","1"')
  })
})

function createPattern(): PatternResult {
  return {
    width: 1,
    height: 1,
    totalBeads: 1,
    colors: [
      {
        key: 'COCO_XMAS_RED',
        displayCode: '圣诞红',
        name: 'COCO 圣诞红',
        hex: '#B83944',
        rgb: { r: 184, g: 57, b: 68 },
        vendor: 'coco',
        vendorCodes: { coco: '圣诞红' },
        count: 1
      }
    ],
    cells: [
      [
        {
          row: 0,
          col: 0,
          key: 'COCO_XMAS_RED',
          displayCode: '圣诞红',
          name: 'COCO 圣诞红',
          color: '#B83944',
          rgb: { r: 184, g: 57, b: 68 },
          isExternal: false,
          vendor: 'coco',
          vendorCodes: { coco: '圣诞红' }
        }
      ]
    ],
    options: {
      columns: 1,
      rows: 1,
      paletteTier: 'all',
      paletteVendor: 'coco',
      conversionMode: 'clear-pixel',
      pixelationMode: 'dominant',
      maxColors: 18,
      autoEraseBackground: true,
      cleanupStrength: 'normal',
      similarityThreshold: 0,
      excludedColorKeys: []
    }
  }
}
