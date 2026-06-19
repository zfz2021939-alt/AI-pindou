import mardColorsData from './mard-colors.json'
import cocoSpecialColorsData from './coco-special-colors.json'
import mardTierCodesData from './mard-tier-codes.json'

// 色卡大数据保存在 JSON 中，本文件只保留轻量类型和查询入口，方便 Agent 快速阅读。
export type BeadVendorId = 'mard' | 'xiaowujia' | 'manman' | 'panpan' | 'mixiaowo' | 'huangdoudou' | 'coco'
export type BeadPaletteTier = 24 | 48 | 72 | 96 | 120 | 144 | 168 | 221 | 'all'
export type MardTier = BeadPaletteTier
export type BeadColorSource = 'xlsx-mard' | 'coco-special'
export type BeadColor = {
  code: string
  name: string
  hex: string
  rgb: [number, number, number]
  family: string
  source: BeadColorSource
  vendorCodes: Partial<Record<BeadVendorId, string>>
}
export type MardColor = BeadColor

export const BEAD_VENDOR_OPTIONS: Array<{ id: BeadVendorId; label: string }> = [
  { id: 'mard', label: 'MARD' },
  { id: 'xiaowujia', label: '\u5c0f\u821e\u5bb6' },
  { id: 'manman', label: '\u6f2b\u6f2b' },
  { id: 'panpan', label: '\u76fc\u76fc' },
  { id: 'mixiaowo', label: '\u54aa\u5c0f\u7a9d' },
  { id: 'huangdoudou', label: '\u9ec4\u8c46\u8c46' },
  { id: 'coco', label: 'COCO' }
]

export const MARD_TIER_OPTIONS: BeadPaletteTier[] = [24, 48, 72, 96, 120, 144, 168, 221, 'all']

export const MARD_COLORS = mardColorsData as BeadColor[]
export const COCO_SPECIAL_COLORS = cocoSpecialColorsData as BeadColor[]

export const MARD_TIER_CODES = mardTierCodesData as Record<Exclude<BeadPaletteTier, 'all'>, readonly string[]>

export const MARD_COLOR_BY_CODE = new Map(MARD_COLORS.map((color) => [color.code, color]))
export const BEAD_COLOR_BY_CODE = new Map([...MARD_COLORS, ...COCO_SPECIAL_COLORS].map((color) => [color.code, color]))

export function getMardTierPalette(tier: BeadPaletteTier, vendor: BeadVendorId = 'mard') {
  const baseColors =
    tier === 'all'
      ? MARD_COLORS
      : MARD_TIER_CODES[tier]
          .map((code) => MARD_COLOR_BY_CODE.get(code))
          .filter((color): color is BeadColor => Boolean(color))
  return tier === 'all' && vendor === 'coco' ? [...baseColors, ...COCO_SPECIAL_COLORS] : baseColors
}

export function getMardTierMissingCodes(tier: BeadPaletteTier) {
  if (tier === 'all') {
    return []
  }
  return MARD_TIER_CODES[tier].filter((code) => !MARD_COLOR_BY_CODE.has(code))
}

export function getBeadDisplayCode(color: BeadColor, vendor: BeadVendorId) {
  return color.vendorCodes[vendor] ?? color.vendorCodes.mard ?? '-'
}

export function getVendorLabel(vendor: BeadVendorId) {
  return BEAD_VENDOR_OPTIONS.find((option) => option.id === vendor)?.label ?? vendor
}

export function getPaletteTierLabel(tier: BeadPaletteTier) {
  return tier === 'all' ? '\u5168\u91cf' : `${tier}\u8272`
}

export const MARD_TIER_SOURCE_NOTE =
  'MARD \u8272\u503c\u4e0e\u591a\u5382\u5546\u7f16\u53f7\u6765\u81ea\u9879\u76ee\u6839\u76ee\u5f55 \u62fc\u8c46\u8272\u5361.xlsx\uff1b24/48 \u8272\u89c4\u683c\u6765\u81ea MARD\u8272\u53f7\u89c4\u683c/*.txt\uff1bQ1/Q5 \u6309\u4eba\u5de5\u786e\u8ba4\u4fee\u6b63\uff1bCOCO \u5723\u8bde\u7ea2/\u7eff\u4e3a\u7528\u6237\u8865\u5145\u8272\u3002'
