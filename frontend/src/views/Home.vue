<template>
  <main class="workspace">
    <section class="hero-panel">
      <div>
        <p class="eyebrow">AIpindou MVP</p>
        <h1>拼豆图像转换器</h1>
        <p class="hero-copy">导入图片后自动采样网格、匹配基础拼豆色卡，并生成可导出的拼豆预览和用色清单。</p>
      </div>
      <div class="hero-actions">
        <label class="primary-upload" for="image-input">选择图片</label>
        <input id="image-input" type="file" accept="image/png,image/jpeg,image/webp,image/gif" @change="handleFileInput" />
        <button class="ghost-button" :disabled="!pattern" @click="resetPattern">清空结果</button>
      </div>
    </section>

    <section class="content-grid">
      <aside class="control-panel">
        <div
          class="drop-zone"
          :class="{ dragging: isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <strong>{{ sourceName || '拖入图片开始转换' }}</strong>
          <span>支持 JPG、PNG、WebP、GIF，MVP 在本地 Canvas 中完成处理。</span>
        </div>

        <div class="setting-card">
          <div class="setting-head">
            <span>网格大小</span>
            <strong>{{ gridSize }} x {{ gridSize }}</strong>
          </div>
          <input v-model.number="gridSize" type="range" min="10" max="50" step="1" @input="rebuildFromSource" />
          <div class="quick-sizes">
            <button v-for="size in [16, 24, 32, 40, 50]" :key="size" @click="setGridSize(size)">{{ size }}</button>
          </div>
        </div>

        <div class="setting-card">
          <div class="setting-head">
            <span>MARD 色盘档位</span>
            <strong>{{ activePalette.length }} 色</strong>
          </div>
          <div class="tier-grid">
            <button
              v-for="tier in MARD_TIER_OPTIONS"
              :key="tier"
              :class="{ active: selectedTier === tier }"
              @click="setPaletteTier(tier)"
            >
              {{ tier }}色
            </button>
          </div>
          <p class="setting-note">按百度分档表选择可用色号，221 色使用 peiseka MARD 全实色。</p>
        </div>

        <div class="setting-card">
          <div class="setting-head">
            <span>渲染样式</span>
            <strong>{{ beadStyle === 'round' ? '圆珠' : '方格' }}</strong>
          </div>
          <div class="segmented">
            <button :class="{ active: beadStyle === 'round' }" @click="beadStyle = 'round'; renderPattern()">圆珠</button>
            <button :class="{ active: beadStyle === 'square' }" @click="beadStyle = 'square'; renderPattern()">方格</button>
          </div>
        </div>

        <div class="setting-card">
          <div class="setting-head">
            <span>导出</span>
            <strong>{{ pattern ? `${pattern.colors.length} 色` : '待生成' }}</strong>
          </div>
          <div class="export-actions">
            <button :disabled="!pattern" @click="downloadPng">导出 PNG</button>
            <button :disabled="!pattern" @click="downloadJson">导出 JSON</button>
          </div>
        </div>

        <p v-if="status" class="status-line">{{ status }}</p>
      </aside>

      <section class="preview-panel">
        <div class="preview-head">
          <div>
            <p class="eyebrow">Preview</p>
            <h2>{{ pattern ? '拼豆预览' : '等待图片' }}</h2>
          </div>
          <div v-if="pattern" class="stats">
            <span>{{ pattern.width }} x {{ pattern.height }}</span>
            <span>{{ pattern.totalBeads }} 颗</span>
            <span>MARD {{ pattern.paletteTier }} 色盘</span>
            <span>{{ pattern.colors.length }} 色</span>
          </div>
        </div>

        <div class="canvas-wrap">
          <canvas ref="previewCanvas" width="960" height="960" aria-label="拼豆图预览"></canvas>
          <div v-if="!pattern" class="empty-state">
            <span class="bead-dot"></span>
            <p>选择一张图片，软件会自动生成第一版拼豆图。</p>
          </div>
        </div>
      </section>

      <section class="palette-panel">
        <div class="panel-title">
          <p class="eyebrow">Palette</p>
          <h2>用色清单</h2>
        </div>
        <div v-if="pattern" class="color-list">
          <article v-for="item in pattern.colors" :key="item.code" class="color-row">
            <span class="swatch" :style="{ backgroundColor: item.hex }"></span>
            <div>
              <strong>{{ item.name }}</strong>
              <small>{{ item.code }} · {{ item.hex }}</small>
            </div>
            <b>{{ item.count }}</b>
          </article>
        </div>
        <div v-else class="palette-empty">
          <p>转换后这里会显示每种颜色需要的拼豆数量。</p>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import {
  MARD_TIER_OPTIONS,
  MARD_TIER_SOURCE_NOTE,
  getMardTierMissingCodes,
  getMardTierPalette
} from '@/data/mard-palette'
import type { MardColor, MardTier } from '@/data/mard-palette'

type BeadStyle = 'round' | 'square'
type PaletteColor = MardColor

type BeadCell = {
  x: number
  y: number
  color: PaletteColor
}

type ColorUsage = PaletteColor & {
  count: number
}

type Pattern = {
  width: number
  height: number
  paletteTier: MardTier
  totalBeads: number
  cells: BeadCell[]
  colors: ColorUsage[]
}

const gridSize = ref(32)
const selectedTier = ref<MardTier>(221)
const beadStyle = ref<BeadStyle>('round')
const isDragging = ref(false)
const sourceName = ref('')
const status = ref('')
const sourceImage = ref<HTMLImageElement | null>(null)
const pattern = ref<Pattern | null>(null)
const previewCanvas = ref<HTMLCanvasElement | null>(null)

const canvasSize = computed(() => Math.min(960, Math.max(420, gridSize.value * 18)))
const activePalette = computed(() => getMardTierPalette(selectedTier.value))
const missingTierCodes = computed(() => getMardTierMissingCodes(selectedTier.value))

watch(beadStyle, () => renderPattern())
watch(selectedTier, () => rebuildFromSource())

function handleFileInput(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    loadFile(file)
  }
  input.value = ''
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    loadFile(file)
  }
}

function setGridSize(size: number) {
  gridSize.value = size
  rebuildFromSource()
}

function setPaletteTier(tier: MardTier) {
  selectedTier.value = tier
}

function resetPattern() {
  sourceName.value = ''
  status.value = ''
  sourceImage.value = null
  pattern.value = null
  clearCanvas()
}

function rebuildFromSource() {
  if (sourceImage.value) {
    buildPattern(sourceImage.value)
  }
}

function loadFile(file: File) {
  if (!file.type.startsWith('image/')) {
    status.value = '请选择图片文件。'
    return
  }

  if (file.size > 10 * 1024 * 1024) {
    status.value = '图片超过 10MB，MVP 暂不处理过大的文件。'
    return
  }

  const image = new Image()
  const url = URL.createObjectURL(file)
  image.onload = () => {
    URL.revokeObjectURL(url)
    sourceName.value = file.name
    sourceImage.value = image
    buildPattern(image)
  }
  image.onerror = () => {
    URL.revokeObjectURL(url)
    status.value = '图片读取失败，请换一张图片再试。'
  }
  image.src = url
}

function buildPattern(image: HTMLImageElement) {
  const size = gridSize.value
  const sampleCanvas = document.createElement('canvas')
  const sampleContext = sampleCanvas.getContext('2d', { willReadFrequently: true })

  if (!sampleContext) {
    status.value = '当前环境无法创建 Canvas。'
    return
  }

  sampleCanvas.width = size
  sampleCanvas.height = size

  const crop = getCenteredCrop(image.width, image.height)
  sampleContext.imageSmoothingEnabled = true
  sampleContext.drawImage(image, crop.x, crop.y, crop.size, crop.size, 0, 0, size, size)

  const imageData = sampleContext.getImageData(0, 0, size, size).data
  const cells: BeadCell[] = []
  const usage = new Map<string, ColorUsage>()

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 4
      const rgb: [number, number, number] = [imageData[index], imageData[index + 1], imageData[index + 2]]
      const matched = findClosestColor(rgb)
      cells.push({ x, y, color: matched })

      const current = usage.get(matched.code)
      if (current) {
        current.count += 1
      } else {
        usage.set(matched.code, { ...matched, count: 1 })
      }
    }
  }

  pattern.value = {
    width: size,
    height: size,
    paletteTier: selectedTier.value,
    totalBeads: size * size,
    cells,
    colors: [...usage.values()].sort((a, b) => b.count - a.count)
  }

  const missingText = missingTierCodes.value.length ? `；缺少 ${missingTierCodes.value.join(', ')} 的可验证色值` : ''
  status.value = `已用 MARD ${selectedTier.value} 色盘生成 ${size}x${size} 拼豆图，共 ${size * size} 颗${missingText}。`
  nextTick(renderPattern)
}

function getCenteredCrop(width: number, height: number) {
  const size = Math.min(width, height)
  return {
    x: Math.floor((width - size) / 2),
    y: Math.floor((height - size) / 2),
    size
  }
}

function findClosestColor(rgb: [number, number, number]) {
  const palette = activePalette.value
  let best = palette[0]
  let bestDistance = Number.POSITIVE_INFINITY

  for (const color of palette) {
    const distance = colorDistance(rgb, color.rgb)
    if (distance < bestDistance) {
      best = color
      bestDistance = distance
    }
  }

  return best
}

function colorDistance(a: [number, number, number], b: [number, number, number]) {
  const redMean = (a[0] + b[0]) / 2
  const red = a[0] - b[0]
  const green = a[1] - b[1]
  const blue = a[2] - b[2]
  return Math.sqrt((2 + redMean / 256) * red * red + 4 * green * green + (2 + (255 - redMean) / 256) * blue * blue)
}

function renderPattern() {
  if (!previewCanvas.value) {
    return
  }

  const canvas = previewCanvas.value
  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

  const currentPattern = pattern.value
  const size = canvasSize.value
  canvas.width = size
  canvas.height = size
  context.clearRect(0, 0, size, size)

  if (!currentPattern) {
    clearCanvas()
    return
  }

  const cellSize = size / currentPattern.width
  context.fillStyle = '#ede2cc'
  context.fillRect(0, 0, size, size)

  for (const cell of currentPattern.cells) {
    const px = cell.x * cellSize
    const py = cell.y * cellSize
    context.fillStyle = cell.color.hex

    if (beadStyle.value === 'round') {
      const center = cellSize / 2
      const radius = Math.max(1.2, cellSize * 0.42)
      const gradient = context.createRadialGradient(px + center * 0.72, py + center * 0.68, radius * 0.1, px + center, py + center, radius)
      gradient.addColorStop(0, lighten(cell.color.rgb, 34))
      gradient.addColorStop(0.72, cell.color.hex)
      gradient.addColorStop(1, darken(cell.color.rgb, 16))
      context.fillStyle = gradient
      context.beginPath()
      context.arc(px + center, py + center, radius, 0, Math.PI * 2)
      context.fill()
    } else {
      context.fillRect(px + 0.5, py + 0.5, Math.max(1, cellSize - 1), Math.max(1, cellSize - 1))
    }
  }

  if (cellSize >= 10) {
    context.strokeStyle = 'rgba(39,49,45,0.12)'
    context.lineWidth = 1
    for (let i = 0; i <= currentPattern.width; i += 1) {
      const pos = Math.round(i * cellSize) + 0.5
      context.beginPath()
      context.moveTo(pos, 0)
      context.lineTo(pos, size)
      context.stroke()
      context.beginPath()
      context.moveTo(0, pos)
      context.lineTo(size, pos)
      context.stroke()
    }
  }
}

function clearCanvas() {
  if (!previewCanvas.value) {
    return
  }
  const context = previewCanvas.value.getContext('2d')
  if (!context) {
    return
  }
  context.clearRect(0, 0, previewCanvas.value.width, previewCanvas.value.height)
}

function lighten(rgb: [number, number, number], amount: number) {
  return `rgb(${rgb.map((value) => Math.min(255, value + amount)).join(',')})`
}

function darken(rgb: [number, number, number], amount: number) {
  return `rgb(${rgb.map((value) => Math.max(0, value - amount)).join(',')})`
}

function downloadPng() {
  if (!previewCanvas.value || !pattern.value) {
    return
  }
  const link = document.createElement('a')
  link.href = previewCanvas.value.toDataURL('image/png')
  link.download = makeExportName('png')
  link.click()
}

function downloadJson() {
  if (!pattern.value) {
    return
  }

  const payload = {
    app: 'AIpindou',
    version: '1.0.0',
    source: sourceName.value,
    gridSize: gridSize.value,
    paletteTier: pattern.value.paletteTier,
    paletteSource: MARD_TIER_SOURCE_NOTE,
    totalBeads: pattern.value.totalBeads,
    colors: pattern.value.colors.map(({ code, name, hex, count }) => ({ code, name, hex, count })),
    cells: pattern.value.cells.map((cell) => ({ x: cell.x, y: cell.y, code: cell.color.code, hex: cell.color.hex }))
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = makeExportName('json')
  link.click()
  URL.revokeObjectURL(link.href)
}

function makeExportName(extension: 'png' | 'json') {
  const base = sourceName.value ? sourceName.value.replace(/\.[^.]+$/, '') : 'aipindou-pattern'
  return `${base}-${gridSize.value}x${gridSize.value}.${extension}`
}
</script>

<style scoped>
.workspace {
  width: min(1440px, calc(100vw - 40px));
  margin: 0 auto;
  padding: 28px 0 40px;
}

.hero-panel,
.control-panel,
.preview-panel,
.palette-panel {
  border: 1px solid rgba(64, 70, 58, 0.13);
  box-shadow: 0 24px 70px rgba(61, 45, 25, 0.12);
  backdrop-filter: blur(18px);
}

.hero-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 22px;
  padding: 28px;
  border-radius: 30px;
  background: linear-gradient(135deg, rgba(255, 255, 247, 0.92), rgba(239, 222, 190, 0.78));
}

.eyebrow {
  margin: 0 0 8px;
  color: #b45f24;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

h1,
h2 {
  margin: 0;
  color: #24342c;
  line-height: 1.05;
}

h1 {
  font-size: clamp(38px, 5vw, 68px);
  letter-spacing: -0.05em;
}

h2 {
  font-size: 28px;
}

.hero-copy {
  max-width: 720px;
  margin: 14px 0 0;
  color: #59645a;
  font-size: 17px;
  line-height: 1.8;
}

.hero-actions,
.export-actions,
.quick-sizes,
.segmented,
.stats {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.primary-upload,
button {
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
}

.primary-upload,
.export-actions button:first-child {
  color: #fffaf0;
  background: #24342c;
  box-shadow: 0 16px 30px rgba(36, 52, 44, 0.24);
}

.primary-upload {
  display: inline-flex;
  align-items: center;
  min-width: 128px;
  justify-content: center;
  padding: 13px 18px;
  font-weight: 800;
}

button {
  padding: 11px 16px;
  color: #28342f;
  background: rgba(255, 255, 255, 0.72);
  font-weight: 700;
}

button:hover:not(:disabled),
.primary-upload:hover {
  transform: translateY(-1px);
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.42;
}

.ghost-button {
  border: 1px solid rgba(36, 52, 44, 0.16);
}

#image-input {
  display: none;
}

.content-grid {
  display: grid;
  grid-template-columns: 320px minmax(420px, 1fr) 300px;
  gap: 18px;
  align-items: start;
}

.control-panel,
.preview-panel,
.palette-panel {
  border-radius: 28px;
  background: rgba(255, 252, 245, 0.78);
}

.control-panel,
.palette-panel {
  padding: 18px;
}

.drop-zone {
  display: grid;
  gap: 8px;
  min-height: 148px;
  place-items: center;
  padding: 24px;
  border: 2px dashed rgba(36, 52, 44, 0.22);
  border-radius: 24px;
  color: #58655b;
  text-align: center;
  background: rgba(255, 255, 255, 0.42);
}

.drop-zone strong {
  color: #24342c;
  font-size: 18px;
}

.drop-zone.dragging {
  border-color: #c56f2b;
  background: rgba(255, 221, 171, 0.48);
}

.setting-card {
  margin-top: 14px;
  padding: 16px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.6);
}

.setting-head,
.preview-head,
.panel-title {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.setting-head span {
  color: #697569;
}

input[type='range'] {
  width: 100%;
  accent-color: #b45f24;
}

.quick-sizes button,
.segmented button,
.tier-grid button {
  padding: 8px 12px;
  background: #efe6d2;
}

.segmented button.active,
.tier-grid button.active {
  color: #fffaf0;
  background: #b45f24;
}

.tier-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.tier-grid button {
  border-radius: 14px;
}

.setting-note {
  margin: 10px 0 0;
  color: #6b746c;
  font-size: 12px;
  line-height: 1.6;
}

.status-line {
  margin: 14px 4px 0;
  color: #59645a;
  line-height: 1.7;
}

.preview-panel {
  min-height: 620px;
  padding: 22px;
}

.stats span {
  padding: 8px 10px;
  border-radius: 999px;
  color: #465048;
  background: #eee2cb;
  font-size: 13px;
  font-weight: 800;
}

.canvas-wrap {
  position: relative;
  display: grid;
  min-height: 540px;
  place-items: center;
  overflow: hidden;
  border-radius: 24px;
  background:
    linear-gradient(45deg, rgba(36, 52, 44, 0.05) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(36, 52, 44, 0.05) 25%, transparent 25%),
    #fbf8ef;
  background-size: 24px 24px;
}

canvas {
  width: min(100%, 640px);
  height: auto;
  border-radius: 18px;
  box-shadow: 0 18px 50px rgba(39, 49, 45, 0.16);
}

.empty-state {
  position: absolute;
  display: grid;
  width: min(340px, 82%);
  place-items: center;
  gap: 16px;
  color: #657064;
  text-align: center;
  line-height: 1.8;
}

.bead-dot {
  width: 78px;
  height: 78px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #fff3c8, #d9822b 58%, #7b3f19 100%);
  box-shadow: 0 18px 35px rgba(180, 95, 36, 0.28);
}

.color-list {
  display: grid;
  gap: 10px;
  max-height: 598px;
  overflow: auto;
  padding-right: 4px;
}

.color-row {
  display: grid;
  grid-template-columns: 36px 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 10px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.64);
}

.swatch {
  width: 34px;
  height: 34px;
  border: 2px solid rgba(36, 52, 44, 0.1);
  border-radius: 50%;
}

.color-row strong,
.color-row small {
  display: block;
}

.color-row small,
.palette-empty {
  color: #6b746c;
}

.color-row b {
  color: #24342c;
}

.palette-empty {
  display: grid;
  min-height: 160px;
  place-items: center;
  text-align: center;
  line-height: 1.8;
}

@media (max-width: 1180px) {
  .content-grid {
    grid-template-columns: 300px 1fr;
  }

  .palette-panel {
    grid-column: 1 / -1;
  }
}

@media (max-width: 820px) {
  .workspace {
    width: min(100vw - 24px, 720px);
    padding-top: 14px;
  }

  .hero-panel {
    align-items: flex-start;
    flex-direction: column;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .preview-panel {
    min-height: auto;
  }

  .canvas-wrap {
    min-height: 380px;
  }
}
</style>
