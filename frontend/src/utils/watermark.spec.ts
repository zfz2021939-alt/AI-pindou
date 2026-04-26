import { describe, expect, it } from 'vitest'
import { embedDctWatermark, extractDctWatermarkBits, stringToBits } from './watermark'

describe('DCT blind watermark', () => {
  it('encodes strings to bits', () => {
    expect(stringToBits('A')).toEqual([0, 1, 0, 0, 0, 0, 0, 1])
  })

  it('embeds readable bits into image blocks', () => {
    const imageData = createImageData(32, 16)
    const bits = stringToBits('A')

    embedDctWatermark(imageData, 'A')

    expect(extractDctWatermarkBits(imageData, bits.length)).toEqual(bits)
  })
})

function createImageData(width: number, height: number) {
  const data = new Uint8ClampedArray(width * height * 4)
  for (let index = 0; index < data.length; index += 4) {
    const pixel = index / 4
    data[index] = 120 + (pixel % 5)
    data[index + 1] = 132 + (pixel % 7)
    data[index + 2] = 145 + (pixel % 11)
    data[index + 3] = 255
  }
  return { data, width, height } as ImageData
}
