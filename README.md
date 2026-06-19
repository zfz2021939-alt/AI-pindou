# AIpindou 拼豆图像转换器

AIpindou 是一个拼豆图像转换桌面软件，用于把导入图片转换成拼豆图纸。当前版本可以在本地完成图片导入、网格生成、MARD 色卡匹配、预览统计、手动微调和 PNG/JSON/CSV 导出。

## 技术栈

- 前端：Vue 3 + TypeScript + Vite + Element Plus
- 桌面壳：Electron
- 图像处理：浏览器 Canvas API，本地完成
- 后端：`backend/` 目录暂时预留，MVP 运行不依赖后端服务

## 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0
- Windows 环境优先；当前打包目标是 Windows portable exe

## 首次安装

项目根目录和 `frontend/` 都有独立的 `package.json`，需要分别安装依赖。`backend/` 当前只是预留目录，运行 MVP 不需要安装后端依赖。

推荐使用 `npm.cmd ci` 按 lockfile 精确安装：

```powershell
Set-Location -LiteralPath "G:\BackUp\AI+网络项目孵化\AI-pindou"
npm.cmd ci --cache ".\.npm-cache"

Set-Location -LiteralPath "G:\BackUp\AI+网络项目孵化\AI-pindou\frontend"
npm.cmd ci --cache "..\.npm-cache"
```

这样安装后依赖会分别落在：

- `G:\BackUp\AI+网络项目孵化\AI-pindou\node_modules`
- `G:\BackUp\AI+网络项目孵化\AI-pindou\frontend\node_modules`

`--cache` 参数把 npm 下载缓存也放在项目目录内的 `.npm-cache/`，避免写到用户目录下的默认 npm cache。不要使用 `-g` 或 `--global`，否则会变成全局安装。

如果 `npm.cmd ci` 因 lockfile 和 `package.json` 不一致失败，可以在同一目录下改用：

```powershell
npm.cmd install --cache ".\.npm-cache"
```

安装 Electron 时如果 GitHub 下载源连接失败，可以临时使用 Electron 镜像：

```powershell
Set-Location -LiteralPath "G:\BackUp\AI+网络项目孵化\AI-pindou"
$env:ELECTRON_MIRROR = "https://npmmirror.com/mirrors/electron/"
npm.cmd ci --cache ".\.npm-cache"
```

## 本地启动

### 启动完整桌面开发环境

在项目根目录执行：

```powershell
Set-Location -LiteralPath "G:\BackUp\AI+网络项目孵化\AI-pindou"
npm.cmd run dev
```

这个命令会同时启动：

- Vite 前端服务：`http://127.0.0.1:3000/`
- Electron 桌面窗口：等待前端服务可访问后自动打开

启动成功时终端会看到类似输出：

```text
VITE v5.x.x ready
Local: http://127.0.0.1:3000/
```

如果只想确认前端服务是否可访问，可以打开浏览器访问：

```text
http://127.0.0.1:3000/
```

### 仅启动前端页面

如果只想在浏览器里预览前端页面，不打开 Electron：

```powershell
Set-Location -LiteralPath "G:\BackUp\AI+网络项目孵化\AI-pindou\frontend"
npm.cmd run dev -- --host 127.0.0.1
```

然后打开：

```text
http://127.0.0.1:3000/
```

## 启动后的主要功能

启动后进入 `拼豆图像转换器` 工作台，可以使用以下能力：

- 图片导入：点击“选择图片”或拖拽图片到左侧区域，支持 PNG、JPEG、WebP、GIF。
- 网格生成：设置横向颗数，纵向颗数会按原图比例自动计算。
- 算法模式：支持“主色模式”和“平均模式”；主色适合头像、卡通、像素风，平均适合照片和渐变。
- 近似色合并：调节合并阈值，减少低频近似色，控制最终用色数量。
- 色卡匹配：支持 MARD 色盘档位选择，并可切换不同厂商编号显示。
- 预览统计：实时显示拼豆图宽高、总颗数、颜色数量和用色清单。
- 渲染样式：支持圆珠和方格两种预览/导出样式。
- 水印：支持关闭、明水印和暗水印，并可自定义水印文字。
- 颜色排除：在用色清单中排除不想使用的颜色，系统会重新映射到可用色。
- 拼豆微调：打开“微调”后可用画笔、吸管、网格线、色号显示和缩放进行手动编辑。
- 背景处理：支持本地 AI 背景擦除，失败时会回退到边界背景算法。
- 面部轮廓增强：对头像类图片可尝试增强面部轮廓。
- AI 优化：可配置自定义 AI Provider，内置 DashScope Wan2.6 Image 模板；基础图片转换不需要 API Key。
- 导出：支持导出 PNG 图纸、JSON 数据和 CSV 用色清单。PNG 导出时可以选择是否显示网格线和色号。

## 构建与打包

### 构建前端

在项目根目录执行：

```powershell
Set-Location -LiteralPath "G:\BackUp\AI+网络项目孵化\AI-pindou"
npm.cmd run build
```

该命令会进入 `frontend/` 并执行前端构建，产物输出到 `frontend/dist/`。

### 打包 Windows portable exe

在项目根目录执行：

```powershell
Set-Location -LiteralPath "G:\BackUp\AI+网络项目孵化\AI-pindou"
npm.cmd run build:exe
```

该命令会先构建前端，再使用 `electron-builder` 打包 Windows portable 程序，产物输出到 `release/`。

## 测试与检查

### 运行测试

在项目根目录执行：

```powershell
Set-Location -LiteralPath "G:\BackUp\AI+网络项目孵化\AI-pindou"
npm.cmd run test
```

### 运行 lint

在项目根目录执行：

```powershell
Set-Location -LiteralPath "G:\BackUp\AI+网络项目孵化\AI-pindou"
npm.cmd run lint
```

注意：当前 lint 脚本会调用 ESLint 的 `--fix`，会自动修改可修复的前端代码格式问题。

## 目录结构

```text
AI-pindou/
├── frontend/      # Vue 3 前端源码和 Vite 配置
├── electron/      # Electron 主进程、preload 和桌面打包入口
├── backend/       # 后续扩展预留，MVP 不依赖
├── docs/          # 项目文档和分析报告
├── scripts/       # 构建、测试、辅助脚本
├── package.json   # 桌面开发、构建和打包脚本
└── AGENTS.md      # Codex 项目规范
```

## 常见问题

### `npm.cmd run dev` 启动失败或提示找不到命令

通常是依赖没有安装完整。请确认已经分别安装根目录和 `frontend/` 依赖：

```powershell
Set-Location -LiteralPath "G:\BackUp\AI+网络项目孵化\AI-pindou"
npm.cmd ci --cache ".\.npm-cache"

Set-Location -LiteralPath "G:\BackUp\AI+网络项目孵化\AI-pindou\frontend"
npm.cmd ci --cache "..\.npm-cache"
```

### Electron 安装时下载失败

如果安装根目录依赖时在 `electron` postinstall 阶段出现 `ECONNRESET`、`ETIMEDOUT` 等网络错误，可以使用 Electron 镜像后重试：

```powershell
Set-Location -LiteralPath "G:\BackUp\AI+网络项目孵化\AI-pindou"
$env:ELECTRON_MIRROR = "https://npmmirror.com/mirrors/electron/"
npm.cmd ci --cache ".\.npm-cache"
```

### Electron 窗口一直没有打开

Electron 开发模式会等待 `http://127.0.0.1:3000/` 可访问。请确认前端 Vite 服务已经启动，并且 3000 端口没有被其他程序占用。

### 3000 端口被占用

当前 Electron 开发入口固定加载 `http://127.0.0.1:3000/`，Vite 配置也固定使用 3000 端口。请先关闭占用该端口的程序，再重新运行：

```powershell
npm.cmd run dev
```

### 打包后页面加载失败

打包前必须先生成 `frontend/dist/`。推荐直接使用：

```powershell
npm.cmd run build:exe
```

该命令会自动先执行前端构建。
