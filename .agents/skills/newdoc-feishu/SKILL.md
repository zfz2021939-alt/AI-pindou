---
name: newdoc-feishu
description: Create a new Feishu cloud document from Markdown, a local file, or stdin. Use when the user asks Codex to create/save a new Feishu document, preserve a proposed plan/report/notes in Feishu, or upload Markdown content to Feishu as a new document.
---

# New Feishu Document

Use this skill only after the user explicitly confirms they want to create a new Feishu cloud document. Do not create or upload documents silently.

## Workflow

1. Confirm the document title and content source.
2. Check whether `lark-cli` is available before attempting upload.
3. If authentication is needed, run `lark-cli auth` and follow the CLI prompt.
4. Create the document with `lark-cli`, passing the title and Markdown content.
5. Return the resulting document URL or the exact error from the CLI.

## Content Sources

- For an existing Markdown file, use that file as the content source.
- For generated content in the current conversation, write it to a temporary Markdown file or pipe it through stdin.
- Keep secrets, tokens, `.env` values, and private credentials out of uploaded content.

## Requirements

- `lark-cli` must be installed and available on `PATH`.
- The user must have the necessary Feishu permissions.
- If `lark-cli` is missing, explain that the upload cannot run locally and provide the intended title/content source instead.
