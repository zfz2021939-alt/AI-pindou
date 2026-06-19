# AIpindou 项目规范

## Agent 阅读入口
- 接手项目时，优先阅读 `package.json`、`frontend/src/main.ts`、`frontend/src/router/index.ts`、`frontend/src/views/Home.vue`、`frontend/src/utils/` 和 `electron/`。
- 色卡业务默认只读 `frontend/src/data/mard-palette.ts`。该文件是轻量查询入口，不要为了解业务主动通读完整色卡 JSON。
- 只有在处理色卡数据、色号规格或数据一致性问题时，才读取 `frontend/src/data/mard-colors.json`、`frontend/src/data/mard-tier-codes.json`、`拼豆色卡.xlsx`、`MARD色号规格/`。
- 不要主动阅读 `frontend/dist/`、`frontend/public/models/`、`frontend/public/mediapipe/`、`frontend/public/ort/`、`.npm-cache/`、`node_modules/`，除非任务明确要求排查构建产物、模型资源或依赖包。
- 色卡数据修改后运行 `npm.cmd run validate:palette` 和 `npm.cmd run test` 验证。

## 项目目标
AIpindou 是一个拼豆图像转换桌面软件。当前最小闭环目标是：导入图片、按网格生成拼豆图、匹配基础色卡、预览统计、导出 PNG/JSON，并打包为 Windows exe。

产品长期方向是提供功能完整的拼豆图纸生成工具，支持 Mard 标准色卡、智能配色、实时预览、手动编辑和打印/数据导出。

## 技术路线
- 前端：Vue 3 + TypeScript + Vite + Element Plus
- 桌面壳：Electron
- 图像处理：浏览器 Canvas API，本地完成，不依赖后端服务
- 后端目录：保留为后续扩展，MVP 不作为运行必需项

## 核心功能模块
- 图像处理：图片导入、预处理、颜色量化
- 图案生成：网格映射、拼豆预览、后续手动编辑
- 配色系统：基础色卡匹配，逐步扩展到完整 Mard 色卡和自定义色板
- 导出功能：PNG/JSON 优先，后续扩展 JPG、PDF 打印导出

## 项目阶段
- MVP 版本：完成基础图像转换、基础色卡匹配、预览统计、PNG/JSON 导出和 Windows exe 打包
- 增强版本：增加高级编辑、完整 Mard 色卡、PDF 打印和更细的导出设置
- 完整版本：探索 AI 增强、商业化功能和更完整的工作流体验

## 目录约定
- `frontend/src/`：前端源码
- `frontend/src/views/`：页面级 Vue 组件
- `electron/`：Electron 主进程和桌面打包入口
- `docs/`：设计和使用文档，后续新增文档放这里
- `scripts/`：构建、测试、辅助脚本
- `.agents/skills/`：仓库级 Codex skills
- `.codex/rules/`：仓库级 Codex 命令执行规则
- 项目长期强约束写入本文件；Codex memories 只作为本地辅助记忆，不作为项目规则唯一来源

## 开发约定
- 文件命名优先使用 kebab-case，已有框架入口文件保持原状
- UI 文案默认中文，代码标识符使用英文
- MVP 优先保持少依赖、可运行、可打包
- 大功能先最小实现，再迭代编辑、PDF、完整 Mard 色卡等能力
- 使用 TypeScript 时优先保持类型明确，避免为了快速实现牺牲核心数据结构可读性

## Git 提交规范
提交信息优先使用：

```text
type(scope): description

[optional body]

[optional footer(s)]
```

常用类型：
- `feat`：新功能
- `fix`：修复
- `docs`：文档更新
- `style`：代码格式
- `refactor`：重构
- `test`：测试
- `chore`：构建过程或辅助工具变动

## 飞书文档保存规则
- 每次输出完整 `<proposed_plan>` 后，必须询问用户是否要保存到飞书云文档
- 用户选择更新已有文档时，使用 `lark-cli docs +update`
- 用户选择新建文档时，使用 `newdoc-feishu` skill
- 未经用户确认，不自动上传或新建飞书文档

## 验证命令
- 前端构建：`cd frontend && npm.cmd run build`
- 桌面打包：`npm.cmd run build:exe`
- 本地预览：`cd frontend && npm.cmd run dev`
- 测试：`npm.cmd run test`
- Lint：`npm.cmd run lint`

## 参考资料
- [pixel-beads.com 拼豆图生成器](https://www.pixel-beads.com/zh/perler-bead-pattern-generator)
- [pindou.online 色卡](https://www.pindou.online/colors)
- [Mard 标准色卡](https://www.pindou.online/colors)


## 安全红线
- 不删除文件/目录或 git 历史，除非用户明确确认
- 不修改 `.env`、密钥、token、CI/CD 配置
- 不做数据库 schema 变更或迁移
- 不执行 `git push`、`git rebase`、`git reset --hard`、强推
- 不安装全局依赖或修改系统配置
- 不公开发布或生产部署
