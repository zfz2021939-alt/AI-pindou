import express from 'express'
import { Request, Response } from 'express'
import { ColorService } from '../services/ColorService.js'

const colorService = new ColorService()

export const colorRouter = express.Router()

// 获取所有配色方案
colorRouter.get('/palettes', async (req: Request, res: Response) => {
  try {
    const palettes = await colorService.getAllPalettes()
    res.json(palettes)
  } catch (error) {
    console.error('Get palettes error:', error)
    res.status(500).json({ error: 'Failed to get palettes' })
  }
})

// 获取特定配色方案
colorRouter.get('/palettes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const palette = await colorService.getPaletteById(id)
    if (!palette) {
      return res.status(404).json({ error: 'Palette not found' })
    }
    res.json(palette)
  } catch (error) {
    console.error('Get palette error:', error)
    res.status(500).json({ error: 'Failed to get palette' })
  }
})

// 上传自定义配色方案
colorRouter.post('/palettes', async (req: Request, res: Response) => {
  try {
    const { name, colors, brand } = req.body

    if (!name || !colors || !Array.isArray(colors)) {
      return res.status(400).json({ error: 'Invalid palette data' })
    }

    const palette = await colorService.createPalette({
      name,
      colors,
      brand: brand || 'custom'
    })

    res.json(palette)
  } catch (error) {
    console.error('Create palette error:', error)
    res.status(500).json({ error: 'Failed to create palette' })
  }
})

// 删除配色方案
colorRouter.delete('/palettes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await colorService.deletePalette(id)
    res.json({ success: true })
  } catch (error) {
    console.error('Delete palette error:', error)
    res.status(500).json({ error: 'Failed to delete palette' })
  }
})

// 颜色匹配
colorRouter.post('/match', async (req: Request, res: Response) => {
  try {
    const { targetColor, paletteId, tolerance = 10 } = req.body

    if (!targetColor || !paletteId) {
      return res.status(400).json({ error: 'Target color and palette ID are required' })
    }

    const match = await colorService.matchColor(targetColor, paletteId, tolerance)
    res.json(match)
  } catch (error) {
    console.error('Color match error:', error)
    res.status(500).json({ error: 'Failed to match color' })
  }
})