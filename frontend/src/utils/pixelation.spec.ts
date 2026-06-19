import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  buildPatternFromImage,
  calculateClearPixelGrid,
  cleanupPatternNoise,
  createForegroundMask,
  selectLimitedPalette
} from './pixelation'
import type { MappedBeadCell, PaletteColor } from './pixelation'

const white = paletteColor('H1', '#FFFFFF', { r: 255, g: 255, b: 255 })
const black = paletteColor('H7', '#000000', { r: 0, g: 0, b: 0 })
const red = paletteColor('R1', '#FF0000', { r: 255, g: 0, b: 0 })

describe('clear-pixel helpers', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('erases transparent and edge-connected white background', () => {
    const imageData = createImageData(5, 5, (x, y) => {
      if (x === 2 && y === 2) {
        return [20, 20, 20, 255]
      }
      return [255, 255, 255, x === 0 && y === 0 ? 0 : 255]
    })

    const mask = createForegroundMask(imageData, true)

    expect(mask[2 * 5 + 2]).toBe(1)
    expect(mask[0]).toBe(0)
    expect(mask[1]).toBe(0)
  })

  it('limits the selected palette to maxColors', () => {
    const palette = Array.from({ length: 30 }, (_, index) => paletteColor(`C${index}`, '#000000', { r: index * 8, g: 80 + index, b: 160 - index }))
    const imageData = createImageData(30, 2, (x) => [x * 8, 80 + x, 160 - x, 255])
    const mask = new Uint8Array(60).fill(1)

    const limited = selectLimitedPalette(imageData, palette, mask, 18)

    expect(limited.length).toBeLessThanOrEqual(18)
    expect(limited.length).toBeGreaterThan(0)
  })

  it('turns foreground cells into transparent cells when auto background erasing removes the area', () => {
    const imageData = createImageData(4, 4, (x, y) => (x >= 1 && x <= 2 && y >= 1 && y <= 2 ? [0, 0, 0, 255] : [255, 255, 255, 255]))
    const mask = createForegroundMask(imageData, true)

    const cells = calculateClearPixelGrid(imageData, mask, 4, 4, [black, white])

    expect(cells[0][0].isExternal).toBe(true)
    expect(cells[1][1].isExternal).toBe(false)
  })

  it('merges isolated noise but keeps a continuous contour line', () => {
    const noise = [
      [cell(0, 0, white), cell(0, 1, white), cell(0, 2, white)],
      [cell(1, 0, white), cell(1, 1, red), cell(1, 2, white)],
      [cell(2, 0, white), cell(2, 1, white), cell(2, 2, white)]
    ]
    const cleanedNoise = cleanupPatternNoise(noise, [white, red, black], 'normal')

    expect(cleanedNoise[1][1].key).toBe(white.key)

    const contour = [
      [cell(0, 0, white), cell(0, 1, black), cell(0, 2, white)],
      [cell(1, 0, white), cell(1, 1, black), cell(1, 2, white)],
      [cell(2, 0, white), cell(2, 1, black), cell(2, 2, white)]
    ]
    const cleanedContour = cleanupPatternNoise(contour, [white, red, black], 'normal')

    expect(cleanedContour[0][1].key).toBe(black.key)
    expect(cleanedContour[1][1].key).toBe(black.key)
    expect(cleanedContour[2][1].key).toBe(black.key)
  })

  it('keeps rows proportional to the source image', () => {
    const imageData = createImageData(50, 100, () => [0, 0, 0, 255])
    vi.stubGlobal('document', {
      createElement: () => ({
        width: 0,
        height: 0,
        getContext: () => ({
          drawImage: vi.fn(),
          getImageData: () => imageData
        })
      })
    })

    const pattern = buildPatternFromImage({ width: 50, height: 100 } as HTMLImageElement, [black, white], {
      columns: 50,
      paletteTier: 'all',
      paletteVendor: 'mard',
      conversionMode: 'dominant',
      pixelationMode: 'dominant',
      similarityThreshold: 0,
      excludedColorKeys: []
    })

    expect(pattern.width).toBe(50)
    expect(pattern.height).toBe(100)
  })
})

function paletteColor(key: string, hex: string, rgb: { r: number; g: number; b: number }): PaletteColor {
  return {
    key,
    displayCode: key,
    name: `MARD ${key}`,
    hex,
    rgb,
    vendor: 'mard',
    vendorCodes: { mard: key }
  }
}

function cell(row: number, col: number, color: PaletteColor): MappedBeadCell {
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

function createImageData(width: number, height: number, colorAt: (x: number, y: number) => [number, number, number, number]) {
  const data = new Uint8ClampedArray(width * height * 4)
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const [redValue, greenValue, blueValue, alphaValue] = colorAt(x, y)
      const index = (y * width + x) * 4
      data[index] = redValue
      data[index + 1] = greenValue
      data[index + 2] = blueValue
      data[index + 3] = alphaValue
    }
  }
  return { width, height, data } as ImageData
}
