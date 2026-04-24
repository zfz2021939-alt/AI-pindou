# AIpindou 项目规范

## 项目目标
AIpindou 是一个拼豆图像转换桌面软件。当前最小闭环目标是：导入图片、按网格生成拼豆图、匹配基础色卡、预览统计、导出 PNG/JSON，并打包为 Windows exe。

## 技术路线
- 前端：Vue 3 + TypeScript + Vite + Element Plus
- 桌面壳：Electron
- 图像处理：浏览器 Canvas API，本地完成，不依赖后端服务
- 后端目录：保留为后续扩展，MVP 不作为运行必需项

## 目录约定
- `frontend/src/`：前端源码
- `frontend/src/views/`：页面级 Vue 组件
- `electron/`：Electron 主进程和桌面打包入口
- `docs/`：设计和使用文档，后续新增文档放这里
- `scripts/`：构建、测试、辅助脚本
- `.Codex/memory/`：Codex 项目记忆，记录长期有效上下文

## 开发约定
- 文件命名优先使用 kebab-case，已有框架入口文件保持原状
- UI 文案默认中文，代码标识符使用英文
- MVP 优先保持少依赖、可运行、可打包
- 大功能先最小实现，再迭代编辑、PDF、完整 Mard 色卡等能力

## 验证命令
- 前端构建：`cd frontend && npm.cmd run build`
- 桌面打包：`npm.cmd run build:exe`
- 本地预览：`cd frontend && npm.cmd run dev`

## 安全红线
- 不删除文件/目录或 git 历史，除非用户明确确认
- 不修改 `.env`、密钥、token、CI/CD 配置
- 不做数据库 schema 变更或迁移
- 不执行 `git push`、`git rebase`、`git reset --hard`、强推
- 不安装全局依赖或修改系统配置
- 不公开发布或生产部署
