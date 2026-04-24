import express from 'express'
import { Request, Response } from 'express'
import { ImageService } from '../services/ImageService.js'

const imageService = new ImageService()

export const imageRouter = express.Router()

// 上传图片
imageRouter.post('/upload', async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const result = await imageService.uploadImage(req.file)
    res.json(result)
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Upload failed' })
  }
})

// 处理图片并生成拼豆图案
imageRouter.post('/process', async (req: Request, res: Response) => {
  try {
    const { imageUrl, gridSize = 20, colorScheme = 'hama' } = req.body

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' })
    }

    const result = await imageService.processImage(imageUrl, gridSize, colorScheme)
    res.json(result)
  } catch (error) {
    console.error('Processing error:', error)
    res.status(500).json({ error: 'Processing failed' })
  }
})

// 获取处理历史
imageRouter.get('/history', async (req: Request, res: Response) => {
  try {
    const history = await imageService.getProcessingHistory()
    res.json(history)
  } catch (error) {
    console.error('History error:', error)
    res.status(500).json({ error: 'Failed to get history' })
  }
})

// 删除处理记录
imageRouter.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await imageService.deleteProcessingHistory(id)
    res.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    res.status(500).json({ error: 'Failed to delete' })
  }
})