# Claude Code 技能集合

## newdoc_feishu - 飞书文档创建技能

### 功能描述
快速登录飞书并创建新文档，支持从文件或 stdin 读取内容。

### 使用方法

#### 基本语法
```bash
/newdoc_feishu <文档标题> [内容来源]
```

#### 使用场景

1. **从 stdin 输入内容**
```bash
# 直接输入内容
/newdoc_feishu "我的文档"
```

2. **从文件读取内容**
```bash
# 使用现有文件
/newdoc_feishu "设计方案" design.md
```

3. **在脚本中使用**
```bash
#!/bin/bash
# 生成内容并保存到飞书
echo "# 项目文档\n\n这是项目内容" | /newdoc_feishu "项目文档"
```

### 自动化流程

1. **自动检查认证状态**
   - 如果未认证，自动登录飞书
   - 如果已认证，直接使用

2. **创建文档**
   - 在个人知识库中创建
   - 返回文档 URL 和 ID

3. **错误处理**
   - 自动重试认证
   - 详细的错误提示

### 配置要求

- 需要安装 `lark-cli`
- 需要有飞书开发权限
- 建议使用项目配置的认证信息

### 依赖安装

```bash
# 安装 lark-cli
npm install -g @lark-base/cli

# 或者使用 yarn
yarn global add @lark-base/cli
```

### 示例

1. **创建项目文档**
```bash
/newdoc_feishu "拼豆软件设计方案" docs/design.md
```

2. **快速笔记**
```bash
/newdoc_feishu "会议记录" <<EOF
# 会议记录

- 讨论了项目进展
- 下周计划
EOF
```

### 返回格式

成功时返回：
```json
{
  "success": true,
  "doc_id": "文档ID",
  "doc_url": "文档URL",
  "title": "文档标题"
}
```

失败时返回：
```json
{
  "success": false,
  "error": "错误信息"
}
```

### 注意事项

- 文档内容会自动转义 Markdown 特殊字符
- 文档会保存在个人知识库（my_library）中
- 支持的最大内容长度受飞书 API 限制