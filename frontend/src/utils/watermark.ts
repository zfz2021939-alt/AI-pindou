export type WatermarkMode = 'none' | 'visible' | 'subtle'

export type WatermarkOptions = {
  mode: WatermarkMode
  text: string
}

type DctPoint = {
  u: number
  v: number
}

const BLOCK_SIZE = 8
const COEFFICIENT_A: DctPoint = { u: 3, v: 4 }
const COEFFICIENT_B: DctPoint = { u: 4, v: 3 }

export function applyVisibleWatermark(context: CanvasRenderingContext2D, width: number, height: number, text: string) {
  const label = normalizeWatermarkText(text)
  if (!label) {
    return
  }

  context.save()
  context.globalAlpha = 0.2
  context.fillStyle = '#24342c'
  context.font = `${Math.max(18, Math.round(Math.min(width, height) / 24))}px "Microsoft YaHei", sans-serif`
  context.textAlign = 'right'
  context.textBaseline = 'bottom'
  context.fillText(label, width - 28, height - 24)
  context.restore()
}

export function applySubtleBlindWatermark(context: CanvasRenderingContext2D, width: number, height: number, text: string) {
  const label = normalizeWatermarkText(text)
  if (!label || width < BLOCK_SIZE || height < BLOCK_SIZE) {
    return
  }

  const imageData = context.getImageData(0, 0, width, height)
  embedDctWatermark(imageData, label)
  context.putImageData(imageData, 0, 0)
}

export function embedDctWatermark(imageData: ImageData, text: string) {
  const bits = stringToBits(`${text}\0`)
  if (bits.length === 0) {
    return imageData
  }

  let blockIndex = 0
  for (let y = 0; y + BLOCK_SIZE <= imageData.height; y += BLOCK_SIZE) {
    for (let x = 0; x + BLOCK_SIZE <= imageData.width; x += BLOCK_SIZE) {
      embedBitInBlock(imageData, x, y, bits[blockIndex % bits.length])
      blockIndex += 1
    }
  }

  return imageData
}

export function extractDctWatermarkBits(imageData: ImageData, bitCount: number) {
  const bits: number[] = []
  if (bitCount <= 0) {
    return bits
  }

  for (let y = 0; y + BLOCK_SIZE <= imageData.height && bits.length < bitCount; y += BLOCK_SIZE) {
    for (let x = 0; x + BLOCK_SIZE <= imageData.width && bits.length < bitCount; x += BLOCK_SIZE) {
      bits.push(extractBitFromBlock(imageData, x, y))
    }
  }

  return bits
}

export function stringToBits(text: string) {
  const bytes = new TextEncoder().encode(text)
  const bits: number[] = []
  for (const byte of bytes) {
    for (let bit = 7; bit >= 0; bit -= 1) {
      bits.push((byte >> bit) & 1)
    }
  }
  return bits
}

function embedBitInBlock(imageData: ImageData, startX: number, startY: number, bit: number) {
  const original = readLuminanceBlock(imageData, startX, startY)
  const dct = dct2d(original)
  const indexA = COEFFICIENT_A.u * BLOCK_SIZE + COEFFICIENT_A.v
  const indexB = COEFFICIENT_B.u * BLOCK_SIZE + COEFFICIENT_B.v
  const strength = 8

  if (bit === 1 && dct[indexA] <= dct[indexB] + strength) {
    const average = (dct[indexA] + dct[indexB]) / 2
    dct[indexA] = average + strength
    dct[indexB] = average - strength
  } else if (bit === 0 && dct[indexB] <= dct[indexA] + strength) {
    const average = (dct[indexA] + dct[indexB]) / 2
    dct[indexA] = average - strength
    dct[indexB] = average + strength
  }

  const next = idct2d(dct)
  applyLuminanceDelta(imageData, startX, startY, original, next)
}

function extractBitFromBlock(imageData: ImageData, startX: number, startY: number) {
  const dct = dct2d(readLuminanceBlock(imageData, startX, startY))
  const a = dct[COEFFICIENT_A.u * BLOCK_SIZE + COEFFICIENT_A.v]
  const b = dct[COEFFICIENT_B.u * BLOCK_SIZE + COEFFICIENT_B.v]
  return a > b ? 1 : 0
}

function readLuminanceBlock(imageData: ImageData, startX: number, startY: number) {
  const block = new Array<number>(BLOCK_SIZE * BLOCK_SIZE)
  for (let y = 0; y < BLOCK_SIZE; y += 1) {
    for (let x = 0; x < BLOCK_SIZE; x += 1) {
      const index = ((startY + y) * imageData.width + startX + x) * 4
      block[y * BLOCK_SIZE + x] = 0.299 * imageData.data[index] + 0.587 * imageData.data[index + 1] + 0.114 * imageData.data[index + 2] - 128
    }
  }
  return block
}

function applyLuminanceDelta(imageData: ImageData, startX: number, startY: number, original: number[], next: number[]) {
  for (let y = 0; y < BLOCK_SIZE; y += 1) {
    for (let x = 0; x < BLOCK_SIZE; x += 1) {
      const blockIndex = y * BLOCK_SIZE + x
      const delta = clamp(next[blockIndex] - original[blockIndex], -7, 7)
      const index = ((startY + y) * imageData.width + startX + x) * 4
      imageData.data[index] = clamp(imageData.data[index] + delta, 0, 255)
      imageData.data[index + 1] = clamp(imageData.data[index + 1] + delta, 0, 255)
      imageData.data[index + 2] = clamp(imageData.data[index + 2] + delta, 0, 255)
    }
  }
}

function dct2d(values: number[]) {
  const output = new Array<number>(BLOCK_SIZE * BLOCK_SIZE).fill(0)
  for (let u = 0; u < BLOCK_SIZE; u += 1) {
    for (let v = 0; v < BLOCK_SIZE; v += 1) {
      let sum = 0
      for (let x = 0; x < BLOCK_SIZE; x += 1) {
        for (let y = 0; y < BLOCK_SIZE; y += 1) {
          sum += values[y * BLOCK_SIZE + x] * Math.cos(((2 * x + 1) * u * Math.PI) / 16) * Math.cos(((2 * y + 1) * v * Math.PI) / 16)
        }
      }
      output[u * BLOCK_SIZE + v] = 0.25 * alpha(u) * alpha(v) * sum
    }
  }
  return output
}

function idct2d(coefficients: number[]) {
  const output = new Array<number>(BLOCK_SIZE * BLOCK_SIZE).fill(0)
  for (let x = 0; x < BLOCK_SIZE; x += 1) {
    for (let y = 0; y < BLOCK_SIZE; y += 1) {
      let sum = 0
      for (let u = 0; u < BLOCK_SIZE; u += 1) {
        for (let v = 0; v < BLOCK_SIZE; v += 1) {
          sum += alpha(u) * alpha(v) * coefficients[u * BLOCK_SIZE + v] * Math.cos(((2 * x + 1) * u * Math.PI) / 16) * Math.cos(((2 * y + 1) * v * Math.PI) / 16)
        }
      }
      output[y * BLOCK_SIZE + x] = 0.25 * sum
    }
  }
  return output
}

function alpha(value: number) {
  return value === 0 ? 1 / Math.sqrt(2) : 1
}

function normalizeWatermarkText(text: string) {
  return text.trim().slice(0, 64)
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(value)))
}
