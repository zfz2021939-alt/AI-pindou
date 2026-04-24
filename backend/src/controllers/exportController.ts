import express from 'express'
import { Request, Response } from 'express'
import { ExportService } from '../services/ExportService.js'

const exportService = new ExportService()

export const exportRouter = express.Router()

// 导出为图片
exportRouter.post('/image', async (req: Request, res: Response) => {
  try {
    const { patternId, format = 'png', quality = 100 } = req.body

    if (!patternId) {
      return res.status(400).json({ error: 'Pattern ID is required' })
    }

    const result = await exportService.exportAsImage(patternId, format, quality)
    res.json(result)
  } catch (error) {
    console.error('Export image error:', error)
    res.status(500).json({ error: 'Failed to export image' })
  }
})

// 导出为PDF
exportRouter.post('/pdf', async (req: Request, res: Response) => {
  try {
    const { patternId, options = {} } = req.body

    if (!patternId) {
      return res.status(400).json({ error: 'Pattern ID is required' })
    }

    const result = await exportService.exportAsPDF(patternId, options)
    res.json(result)
  } catch (error) {
    console.error('Export PDF error:', error)
    res.status(500).json({ error: 'Failed to export PDF' })
  }
})

// 导出材料清单
exportRouter.post('/materials', async (req: Request, res: Response) => {
  try {
    const { patternId, format = 'json' } = req.body

    if (!patternId) {
      return res.status(400).json({ error: 'Pattern ID is required' })
    }

    const result = await exportService.exportMaterials(patternId, format)
    res.json(result)
  } catch (error) {
    console.error('Export materials error:', error)
    res.status(500).json({ error: 'Failed to export materials' })
  }
})

// 导出SVG模板
exportRouter.post('/svg', async (req: Request, res: Response) => {
  try {
    const { patternId, options = {} } = req.body

    if (!patternId) {
      return res.status(400).json({ error: 'Pattern ID is required' })
    }

    const result = await exportService.exportAsSVG(patternId, options)
    res.json(result)
  } catch (error) {
    console.error('Export SVG error:', error)
    res.status(500).json({ error: 'Failed to export SVG' })
  }
})

// 获取导出历史
exportRouter.get('/history', async (req: Request, res: Response) => {
  try {
    const history = await exportService.getExportHistory()
    res.json(history)
  } catch (error) {
    console.error('Export history error:', error)
    res.status(500).json({ error: 'Failed to get export history' })
  }
})