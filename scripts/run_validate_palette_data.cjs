const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const scriptPath = path.join(root, 'scripts', 'validate_palette_data.py')
const candidates = [
  process.env.PALETTE_PYTHON,
  'C:\\Users\\AQCJ\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe',
  'D:\\Anaconda\\python.exe',
  'python'
].filter(Boolean)

for (const candidate of candidates) {
  if (path.isAbsolute(candidate) && !fs.existsSync(candidate)) {
    continue
  }

  const result = spawnSync(candidate, [scriptPath], {
    cwd: root,
    stdio: 'inherit',
    shell: false
  })

  if (result.error) {
    continue
  }
  process.exit(result.status ?? 1)
}

console.error('No usable Python runtime found. Set PALETTE_PYTHON to a Python 3 executable.')
process.exit(1)
