import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { imageRouter } from './controllers/imageController.js'
import { colorRouter } from './controllers/colorController.js'
import { exportRouter } from './controllers/exportController.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = 8000

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 静态文件
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use('/exports', express.static(path.join(__dirname, '../exports')))

// 路由
app.use('/api/images', imageRouter)
app.use('/api/colors', colorRouter)
app.use('/api/exports', exportRouter)

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// 错误处理中间件
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal Server Error' })
})

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

export default app