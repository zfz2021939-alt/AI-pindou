# 拼豆图像转换软件项目

## 项目概述
一个功能全面的拼豆图像转换软件，能够将图片转换为拼豆图纸，支持 Mard 标准色卡，提供智能配色和实时预览功能。

## 项目结构
```
AIpindou/
├── CLAUDE.md                     # 项目配置
├── .claude/                      # Claude Code 配置
│   ├── memory/                  # 项目记忆
│   └── settings.json            # 项目设置
├── src/                         # 源代码
│   ├── components/              # React 组件
│   ├── hooks/                   # 自定义 Hooks
│   ├── utils/                   # 工具函数
│   ├── algorithms/              # 核心算法
│   ├── styles/                  # 样式文件
│   └── types/                   # TypeScript 类型定义
├── tests/                       # 测试文件
├── docs/                        # 文档
├── scripts/                     # 构建和部署脚本
└── 拼豆图像转换软件设计方案.md   # 设计方案
```

## 技术栈
- **前端**：React 18 + TypeScript + Vite
- **UI 框架**：Ant Design
- **状态管理**：Redux Toolkit
- **画布渲染**：Konva.js
- **构建工具**：Vite
- **测试框架**：Jest + React Testing Library
- **部署平台**：Vercel

## 核心功能模块

### 1. 图像处理模块
- 支持多种图像格式上传
- 自动图像预处理
- 智能颜色量化

### 2. 图案生成引擎
- 网格映射算法
- 实时预览渲染
- 手动编辑功能

### 3. 配色系统
- Mard 标准色卡（221色/291色）
- 智能配色推荐
- 自定义色板

### 4. 导出功能
- 图片导出（PNG/JPG）
- PDF 打印导出
- 数据格式导出

## 开发规范

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 ESLint 和 Prettier 规范
- 组件使用函数式 + Hooks
- 文件命名使用 kebab-case

### Git 工作流
- 主分支：main
- 开发分支：develop
- 功能分支：feature/*
- 修复分支：fix/*

### 提交信息规范
```
type(scope): description

[optional body]

[optional footer(s)]
```

类型说明：
- feat: 新功能
- fix: 修复
- docs: 文档更新
- style: 代码格式
- refactor: 重构
- test: 测试
- chore: 构建过程或辅助工具的变动

## 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发环境
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

### 运行测试
```bash
npm test
```

## 项目阶段
1. **MVP 版本**：基础图像转换功能
2. **增强版本**：高级编辑功能和移动端适配
3. **完整版本**：AI 增强和商业化功能

## 参考资料
- [pixel-beads.com](https://www.pixel-beads.com/zh/perler-bead-pattern-generator)
- [pindou.online](https://www.pindou.online/colors)
- [Mard 标准色卡](https://www.pindou.online/colors)

## 维护者
祝方舟 - vibe coding 工程师 & 游戏测试工程师