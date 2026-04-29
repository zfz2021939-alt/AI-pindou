import { describe, expect, it } from 'vitest'
import { BEAD_VENDOR_OPTIONS, COCO_SPECIAL_COLORS, MARD_COLOR_BY_CODE, getBeadDisplayCode, getMardTierPalette, getPaletteTierLabel } from './mard-palette'

describe('bead palette data', () => {
  it('keeps manually confirmed Q color corrections', () => {
    expect(MARD_COLOR_BY_CODE.get('Q1')?.hex).toBe('#F2A5E8')
    expect(MARD_COLOR_BY_CODE.get('Q5')?.hex).toBe('#76CEDE')
  })

  it('includes COCO Christmas colors only in the COCO full palette', () => {
    expect(COCO_SPECIAL_COLORS.find((color) => color.code === 'COCO_XMAS_RED')?.hex).toBe('#B83944')
    expect(COCO_SPECIAL_COLORS.find((color) => color.code === 'COCO_XMAS_GREEN')?.hex).toBe('#008571')

    expect(getMardTierPalette(221, 'coco').some((color) => color.code === 'COCO_XMAS_RED')).toBe(false)
    expect(getMardTierPalette('all', 'mard').some((color) => color.code === 'COCO_XMAS_RED')).toBe(false)
    expect(getMardTierPalette('all', 'coco').some((color) => color.code === 'COCO_XMAS_RED')).toBe(true)
  })

  it('exposes vendor display codes', () => {
    const mardA1 = MARD_COLOR_BY_CODE.get('A1')

    expect(BEAD_VENDOR_OPTIONS.map((vendor) => vendor.id)).toContain('coco')
    expect(BEAD_VENDOR_OPTIONS.find((vendor) => vendor.id === 'xiaowujia')?.label).toBe('小舞家')
    expect(mardA1 && getBeadDisplayCode(mardA1, 'mard')).toBe('A1')
    expect(mardA1 && getBeadDisplayCode(mardA1, 'coco')).toBe('E2')
  })

  it('formats palette tier labels in Chinese', () => {
    expect(getPaletteTierLabel(24)).toBe('24色')
    expect(getPaletteTierLabel('all')).toBe('全量')
  })
})
