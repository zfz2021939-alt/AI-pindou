<template>
  <main class="workspace">
    <section class="hero-panel">
      <div>
        <p class="eyebrow">AIpindou Algorithm Upgrade</p>
        <h1>拼豆图像转换器</h1>
        <p class="hero-copy">使用开源拼豆算法：按原图比例分格、主色/平均色采样、近似色合并、背景擦除，并支持自定义 AI 图像模型。</p>
      </div>
      <div class="hero-actions">
        <label class="primary-upload" for="image-input">选择图片</label>
        <input id="image-input" type="file" accept="image/png,image/jpeg,image/webp,image/gif" @change="handleFileInput" />
        <button class="ghost-button" @click="openProviderDialog">AI 设置</button>
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
          <span>新算法不强制裁方图，会按原始宽高比自动计算纵向颗数。</span>
        </div>

        <div class="setting-card">
          <div class="setting-head">
            <span>横向颗数</span>
            <strong>{{ columns }} x {{ pattern?.height || '自动' }}</strong>
          </div>
          <input v-model.number="columns" type="range" min="10" max="200" step="1" @input="rebuildFromSource" />
          <input v-model.number="columns" class="number-input" type="number" min="10" max="300" @change="rebuildFromSource" />
          <div class="quick-sizes">
            <button v-for="size in [24, 32, 50, 80, 120]" :key="size" @click="setColumns(size)">{{ size }}</button>
          </div>
        </div>

        <div class="setting-card">
          <div class="setting-head">
            <span>算法模式</span>
            <strong>{{ pixelationMode === 'dominant' ? '主色' : '平均' }}</strong>
          </div>
          <div class="segmented">
            <button :class="{ active: pixelationMode === 'dominant' }" @click="setPixelationMode('dominant')">主色模式</button>
            <button :class="{ active: pixelationMode === 'average' }" @click="setPixelationMode('average')">平均模式</button>
          </div>
          <p class="setting-note">主色适合头像/卡通/像素风；平均适合照片和渐变。</p>
        </div>

        <div class="setting-card">
          <div class="setting-head">
            <span>近似色合并</span>
            <strong>{{ similarityThreshold }}</strong>
          </div>
          <input v-model.number="similarityThreshold" type="range" min="0" max="90" step="1" @input="rebuildFromSource" />
          <input v-model.number="similarityThreshold" class="number-input" type="number" min="0" max="90" step="1" @change="clampSimilarityThreshold" />
          <p class="setting-note">数值越大，越容易把低频近似色并入高频色；当前实际生效 {{ effectiveSimilarityThreshold }}，横向低于 80 时会自动保护边缘。</p>
        </div>

        <div class="setting-card">
          <div class="setting-head">
            <span>MARD 色盘档位</span>
            <strong>{{ activePalette.length }} 色</strong>
          </div>
          <div class="tier-grid">
            <button v-for="tier in MARD_TIER_OPTIONS" :key="tier" :class="{ active: selectedTier === tier }" @click="setPaletteTier(tier)">
              {{ getPaletteTierLabel(tier) }}
            </button>
          </div>
        </div>

        <div class="setting-card">
          <div class="setting-head">
            <span>厂商编号</span>
            <strong>{{ selectedVendorLabel }}</strong>
          </div>
          <select v-model="selectedVendor" class="select-input" @change="setPaletteVendor(selectedVendor)">
            <option v-for="vendor in BEAD_VENDOR_OPTIONS" :key="vendor.id" :value="vendor.id">{{ vendor.label }}</option>
          </select>
          <p class="setting-note">颜色匹配使用当前色卡 RGB；切换厂商会同步用色清单、微调色号和导出编号。</p>
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
            <span>水印</span>
            <strong>{{ watermarkLabel }}</strong>
          </div>
          <div class="segmented">
            <button :class="{ active: watermarkMode === 'none' }" @click="setWatermarkMode('none')">关闭</button>
            <button :class="{ active: watermarkMode === 'visible' }" @click="setWatermarkMode('visible')">明水印</button>
            <button :class="{ active: watermarkMode === 'subtle' }" @click="setWatermarkMode('subtle')">暗水印</button>
          </div>
          <input v-model="watermarkText" class="text-input" maxlength="64" placeholder="水印文字" @input="renderPattern" />
          <p class="setting-note">暗水印参考 DWT-DCT-SVD 盲水印思路，当前浏览器版使用 DCT 频域嵌入，优先保证导出图纸可读。</p>
        </div>

        <div class="setting-card">
          <div class="setting-head">
            <span>AI 优化</span>
            <strong>{{ providers.length }} 个来源</strong>
          </div>
          <select v-model="selectedProviderId" class="select-input">
            <option value="">选择 Provider</option>
            <option v-for="provider in providers" :key="provider.id" :value="provider.id">{{ provider.name }}</option>
          </select>
          <select v-model="selectedAiStyleId" class="select-input">
            <option v-for="style in AI_STYLE_PRESETS" :key="style.id" :value="style.id">{{ style.name }}</option>
          </select>
          <p class="prompt-preview">{{ selectedAiStyle?.description }}</p>
          <button class="wide-button" :disabled="!sourceDataUrl || !selectedProviderId || isAiProcessing" @click="runAiOptimize">
            {{ isAiProcessing ? 'AI 处理中...' : 'AI 优化当前图片' }}
          </button>
        </div>

        <div class="setting-card">
          <div class="setting-head">
            <span>编辑与导出</span>
            <strong>{{ pattern ? `${pattern.colors.length} 色` : '待生成' }}</strong>
          </div>
          <div class="export-actions">
            <button class="tune-button" :disabled="!pattern" @click="openEditor">打开微调</button>
            <button :disabled="!canEraseBackground" @click="eraseBackground">{{ isBackgroundErasing ? 'AI 分割中...' : backgroundEraseUsed ? '背景已擦除' : 'AI 擦除背景' }}</button>
            <button :disabled="!canEnhanceFaceContour" @click="enhanceFaceOutline">{{ isFaceEnhancing ? '识别轮廓中...' : faceContourEnhanceUsed ? '轮廓已增强' : '面部轮廓增强' }}</button>
            <button :disabled="!pattern" @click="openPngExportDialog">导出 PNG</button>
            <button :disabled="!pattern" @click="downloadJson">导出 JSON</button>
            <button :disabled="!pattern" @click="downloadCsv">导出 CSV</button>
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
            <span>{{ pattern.colors.length }} 色</span>
            <span>{{ pixelationMode === 'dominant' ? '主色' : '平均' }}</span>
            <button class="mini-button tune-button" :disabled="!pattern" @click="openEditor">微调</button>
          </div>
        </div>

        <div class="canvas-wrap">
          <canvas ref="previewCanvas" width="960" height="720" aria-label="拼豆图预览"></canvas>
          <div v-if="!pattern" class="empty-state">
            <span class="bead-dot"></span>
            <p>选择图片后会按开源算法生成第一版拼豆图。</p>
          </div>
        </div>
      </section>

      <section class="palette-panel">
        <div class="panel-title">
          <div>
            <p class="eyebrow">Palette</p>
            <h2>用色清单</h2>
          </div>
          <small v-if="excludedColorKeys.length">已排除 {{ excludedColorKeys.length }} 色</small>
        </div>
        <div v-if="pattern" class="color-list">
          <article v-for="item in pattern.colors" :key="item.key" class="color-row">
            <span class="swatch" :style="{ backgroundColor: item.hex }"></span>
            <div>
              <strong>{{ item.name }}</strong>
              <small>{{ selectedVendorLabel }} {{ item.displayCode }} · MARD {{ item.key }} · {{ item.hex }}</small>
            </div>
            <b>{{ item.count }}</b>
            <button class="mini-button" @click="excludeColor(item.key)">排除</button>
          </article>
        </div>
        <div v-else class="palette-empty">
          <p>转换后这里会显示每种颜色需要的拼豆数量。</p>
        </div>

        <div v-if="excludedColorKeys.length" class="excluded-box">
          <strong>已排除颜色</strong>
          <button v-for="key in excludedColorKeys" :key="key" class="mini-button" @click="restoreColor(key)">恢复 {{ key }}</button>
        </div>
      </section>
    </section>

    <div v-if="editorVisible" class="modal-backdrop" @click.self="closeEditor">
      <section class="modal-panel editor-modal">
        <div class="preview-head">
          <div>
            <p class="eyebrow">Fine Tune</p>
            <h2>拼豆微调</h2>
          </div>
          <div class="export-actions">
            <button class="ghost-button" @click="closeEditor">取消</button>
            <button :disabled="!editPattern" @click="saveEditor">保存</button>
          </div>
        </div>

        <div class="editor-toolbar">
          <button :class="{ active: editMode === 'brush' }" @click="editMode = 'brush'">画笔</button>
          <button :class="{ active: editMode === 'eyedropper' }" @click="editMode = 'eyedropper'">吸管</button>
          <button :class="{ active: editorShowGrid }" @click="toggleEditorGrid">网格线</button>
          <button :class="{ active: editorShowColorKeys }" @click="toggleEditorColorKeys">色号</button>
          <span>{{ selectedVendorLabel }} 编号</span>
        </div>

        <div class="editor-layout">
          <aside class="editor-tools">
            <div class="setting-card">
              <div class="setting-head">
                <span>工具</span>
                <strong>{{ editMode === 'brush' ? '画笔' : '吸管' }}</strong>
              </div>
              <div class="segmented">
                <button :class="{ active: editMode === 'brush' }" @click="editMode = 'brush'">画笔</button>
                <button :class="{ active: editMode === 'eyedropper' }" @click="editMode = 'eyedropper'">吸管</button>
              </div>
              <div class="setting-head compact-head">
                <span>缩放</span>
                <strong>{{ zoomPercent }}%</strong>
              </div>
              <input v-model.number="zoomPercent" type="range" min="50" max="500" step="25" @input="renderEditor" />
              <div class="setting-head compact-head">
                <span>辅助显示</span>
                <strong>{{ editorShowGrid || editorShowColorKeys ? '已开启' : '关闭' }}</strong>
              </div>
              <div class="segmented">
                <button :class="{ active: editorShowGrid }" @click="toggleEditorGrid">网格线</button>
                <button :class="{ active: editorShowColorKeys }" @click="toggleEditorColorKeys">色号</button>
              </div>
              <div v-if="brushColor" class="brush-preview">
                  <span class="swatch" :style="{ backgroundColor: brushColor.hex }"></span>
                <div>
                  <strong>{{ brushColor.name }}</strong>
                  <small>{{ selectedVendorLabel }} {{ brushColor.displayCode }} · MARD {{ brushColor.key }} · {{ brushColor.hex }}</small>
                </div>
              </div>
            </div>

            <div class="setting-card">
              <div class="setting-head">
                <span>编辑色卡</span>
                <strong>{{ editPalette.length }} 色</strong>
              </div>
              <div class="tier-grid">
                <button v-for="tier in MARD_TIER_OPTIONS" :key="tier" :class="{ active: editPaletteTier === tier }" @click="setEditPaletteTier(tier)">
                  {{ getPaletteTierLabel(tier) }}
                </button>
              </div>
              <div class="palette-groups editor-palette-groups">
                <section v-for="group in groupedEditPalette" :key="group.letter" class="palette-group">
                  <strong>{{ group.letter }}</strong>
                  <div>
                    <button
                      v-for="color in group.colors"
                      :key="color.key"
                      class="palette-swatch"
                      :class="{ active: brushColor?.key === color.key }"
                      :title="`${color.displayCode} · ${color.key} · ${color.hex}`"
                      :style="{ backgroundColor: color.hex }"
                      @click="selectBrushColor(color)"
                    >
                      {{ color.displayCode }}
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </aside>

          <div class="editor-canvas-wrap" @pointerup="stopPainting" @pointerleave="stopPainting">
            <canvas
              ref="editorCanvas"
              width="960"
              height="720"
              aria-label="拼豆微调画布"
              :style="editorCanvasDisplayStyle"
              @pointerdown="handleEditorPointerDown"
              @pointermove="handleEditorPointerMove"
              @pointerup="stopPainting"
            ></canvas>
          </div>
        </div>
      </section>
    </div>

    <div v-if="pngExportDialogVisible" class="modal-backdrop" @click.self="pngExportDialogVisible = false">
      <section class="modal-panel export-modal">
        <div class="preview-head">
          <div>
            <p class="eyebrow">Download</p>
            <h2>下载设置</h2>
          </div>
          <button class="ghost-button" @click="pngExportDialogVisible = false">关闭</button>
        </div>
        <div class="export-options">
          <label class="switch-row">
            <span>显示网格线</span>
            <input v-model="exportShowGrid" type="checkbox" />
          </label>
          <label class="switch-row">
            <span>显示色号</span>
            <input v-model="exportShowColorKeys" type="checkbox" />
          </label>
        </div>
        <p v-if="pattern" class="setting-note export-summary">
          PNG 尺寸 {{ Math.round(exportSheetCanvasSize.width) }} x {{ Math.round(exportSheetCanvasSize.height) }}，{{ pattern.width }} x {{ pattern.height }} 格。
        </p>
        <div class="export-actions dialog-actions">
          <button class="ghost-button" @click="pngExportDialogVisible = false">取消</button>
          <button :disabled="!pattern" @click="downloadPng">下载</button>
        </div>
      </section>
    </div>

    <div v-if="providerDialogVisible" class="modal-backdrop" @click.self="providerDialogVisible = false">
      <section class="modal-panel">
        <div class="preview-head">
          <div>
            <p class="eyebrow">AI Provider</p>
            <h2>自定义模型来源</h2>
          </div>
          <button class="ghost-button" @click="providerDialogVisible = false">关闭</button>
        </div>
        <div class="form-grid">
          <label>名称<input v-model="providerDraft.name" class="text-input" /></label>
          <label>Endpoint<input v-model="providerDraft.endpoint" class="text-input" placeholder="https://api.example.com/v1/images" /></label>
          <label>Method
            <select v-model="providerDraft.method" class="text-input"><option>POST</option><option>PUT</option></select>
          </label>
          <label>响应图片路径<input v-model="providerDraft.responseImagePath" class="text-input" placeholder="data[0].url" /></label>
          <label>超时毫秒<input v-model.number="providerDraft.timeoutMs" class="text-input" type="number" /></label>
          <label>变量 JSON<textarea v-model="variablesText" class="text-input mono" rows="5"></textarea></label>
          <label>Headers JSON<textarea v-model="headersText" class="text-input mono" rows="5"></textarea></label>
          <label>Body 模板<textarea v-model="providerDraft.bodyTemplate" class="text-input mono" rows="8"></textarea></label>
        </div>
        <p class="setting-note">支持变量：API_KEY、MODEL、IMAGE_DATA_URL、IMAGE_BASE64、PROMPT、IMAGE_MIME。模板中使用双花括号包裹变量名，配置保存到本机用户数据目录。</p>
        <div class="export-actions">
          <button @click="fillDashScopePreset">填入 DashScope Wan2.6 预设</button>
          <button @click="saveProviderDraft">保存 Provider</button>
          <button v-if="providerDraft.id" @click="removeProviderDraft">删除当前 Provider</button>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import {
  BEAD_VENDOR_OPTIONS,
  MARD_TIER_OPTIONS,
  MARD_TIER_SOURCE_NOTE,
  getPaletteTierLabel,
  getMardTierMissingCodes,
  getMardTierPalette,
  getVendorLabel
} from '@/data/mard-palette'
import type { BeadPaletteTier, BeadVendorId } from '@/data/mard-palette'
import { eraseBackgroundWithLocalSegmentation } from '@/utils/background-segmentation'
import { enhanceFaceContour } from '@/utils/face-contour-enhancement'
import { eraseBorderBackground, remapExcludedColors, replaceCellColor, withUpdatedStats } from '@/utils/pixel-editing'
import { createColorCsv, createPatternJsonPayload } from '@/utils/pattern-export'
import { createPatternSheetCanvas, getPatternSheetCanvasSize, hitTestPatternCell, renderPatternToCanvas } from '@/utils/pattern-render'
import type { BeadStyle, PatternCellPosition } from '@/utils/pattern-render'
import { buildPatternFromImage, cloneCells, getEffectiveMergeThreshold, toPaletteColor } from '@/utils/pixelation'
import type { PaletteColor, PatternResult, PixelationMode } from '@/utils/pixelation'
import type { WatermarkMode } from '@/utils/watermark'

const columns = ref(50)
const similarityThreshold = ref(30)
const pixelationMode = ref<PixelationMode>('dominant')
const selectedTier = ref<BeadPaletteTier>('all')
const editPaletteTier = ref<BeadPaletteTier>('all')
const selectedVendor = ref<BeadVendorId>('mard')
const beadStyle = ref<BeadStyle>('round')
const editMode = ref<'brush' | 'eyedropper'>('brush')
const zoomPercent = ref(100)
const brushColor = ref<PaletteColor | null>(null)
const selectedCell = ref<PatternCellPosition | null>(null)
const isPainting = ref(false)
const lastPaintedCell = ref('')
const watermarkMode = ref<WatermarkMode>('none')
const watermarkText = ref('AIpindou')
const isDragging = ref(false)
const sourceName = ref('')
const sourceDataUrl = ref('')
const status = ref('')
const sourceImage = ref<HTMLImageElement | null>(null)
const pattern = ref<PatternResult | null>(null)
const editPattern = ref<PatternResult | null>(null)
const previewCanvas = ref<HTMLCanvasElement | null>(null)
const editorCanvas = ref<HTMLCanvasElement | null>(null)
const editorVisible = ref(false)
const editorShowGrid = ref(false)
const editorShowColorKeys = ref(false)
const pngExportDialogVisible = ref(false)
const exportShowGrid = ref(true)
const exportShowColorKeys = ref(true)
const backgroundEraseUsed = ref(false)
const faceContourEnhanceUsed = ref(false)
const isBackgroundErasing = ref(false)
const isFaceEnhancing = ref(false)
const excludedColorKeys = ref<string[]>([])
const providers = ref<AiProviderConfig[]>([])
const selectedProviderId = ref('')
const providerDialogVisible = ref(false)
const isAiProcessing = ref(false)
const aiStartedAt = ref(0)
const aiElapsedSeconds = ref(0)
let aiTimer: number | undefined
const EDITOR_GRID_CELL_SIZE = 10
const EDITOR_COLOR_KEY_CELL_SIZE = 16
const EXPORT_GRID_CELL_SIZE = 12
const EXPORT_COLOR_KEY_CELL_SIZE = 18
const AI_STYLE_PRESETS = [
  {
    id: 'chibi-pixel',
    name: '彩蛋 01｜Chibi 像素白底',
    description: 'Q版角色、白底、16-bit 像素游戏感。',
    prompt: '图片修改为：chibi画风，白底背景。pixel art style, 16-bit, retro game aesthetic, sharp focus, high contrast, clean lines, detailed pixel art, masterpiece, best quality'
  },
  {
    id: 'kawaii-sticker',
    name: '彩蛋 02｜可爱贴纸白底',
    description: '可爱贴纸、粗描边、适合拼豆轮廓。',
    prompt: '图片修改为：kawaii sticker 可爱贴纸风格，白底背景，rounded shapes, thick clean outline, simple color blocks, minimal shadows, high contrast, centered composition, suitable for perler beads pattern, masterpiece, best quality'
  },
  {
    id: 'nes-8bit',
    name: '彩蛋 03｜8-bit 复古游戏',
    description: 'FC/NES 低色数复古像素风。',
    prompt: '图片修改为：8-bit retro video game sprite 风格，白底背景，limited color palette, blocky pixel art, crisp edges, no blur, front-facing centered subject, high contrast, clean silhouette, suitable for bead art, masterpiece, best quality'
  },
  {
    id: 'snes-16bit',
    name: '彩蛋 04｜16-bit 精细像素',
    description: 'SFC/街机风，细节更丰富。',
    prompt: '图片修改为：16-bit JRPG pixel art 风格，白底背景，detailed sprite, clean lines, vivid colors, sharp focus, high contrast, readable silhouette, retro game aesthetic, suitable for perler beads, masterpiece, best quality'
  },
  {
    id: 'animal-crossing',
    name: '彩蛋 05｜森系玩偶',
    description: '软萌玩偶、低饱和自然色。',
    prompt: '图片修改为：cozy cute toy character 风格，白底背景，soft rounded shapes, pastel natural colors, clean outline, simple flat shading, warm and friendly, centered composition, suitable for perler beads pattern, masterpiece, best quality'
  },
  {
    id: 'sanrio-pop',
    name: '彩蛋 06｜梦幻糖果',
    description: '粉彩糖果色、甜美卡通。',
    prompt: '图片修改为：pastel candy cartoon 风格，白底背景，cute mascot design, soft pink and blue colors, glossy simple highlights, thick clean outline, high contrast, clean lines, suitable for bead pattern, masterpiece, best quality'
  },
  {
    id: 'flat-icon',
    name: '彩蛋 07｜扁平图标',
    description: '极简块面，最适合低颗数拼豆。',
    prompt: '图片修改为：flat vector icon 风格，白底背景，simple geometric shapes, solid color blocks, minimal details, bold clean outline, high readability, centered object, no complex texture, suitable for perler beads, masterpiece, best quality'
  },
  {
    id: 'anime-avatar',
    name: '彩蛋 08｜动漫头像',
    description: '动漫头像、干净线稿、适合人物图。',
    prompt: '图片修改为：anime avatar illustration 风格，白底背景，clean lineart, simplified facial features, vibrant but limited colors, cel shading, sharp focus, high contrast, centered portrait, suitable for pixel art bead conversion, masterpiece, best quality'
  },
  {
    id: 'mini-diorama',
    name: '彩蛋 09｜迷你立体玩具',
    description: '小模型质感，主体更圆润。',
    prompt: '图片修改为：miniature toy diorama 风格，白底背景，cute 3D toy look, simplified shapes, soft lighting, clean silhouette, vivid color blocks, minimal background, centered composition, suitable for perler beads pattern, masterpiece, best quality'
  },
  {
    id: 'outline-logo',
    name: '彩蛋 10｜徽章 Logo',
    description: '粗线徽章、色块明确、适合图标和宠物。',
    prompt: '图片修改为：bold mascot logo badge 风格，白底背景, thick black outline, clean flat colors, strong silhouette, high contrast, simplified details, centered emblem composition, suitable for perler beads and pixel art conversion, masterpiece, best quality'
  }
] as const
const selectedAiStyleId = ref<(typeof AI_STYLE_PRESETS)[number]['id']>('chibi-pixel')
const variablesText = ref('{\n  "API_KEY": "",\n  "MODEL": ""\n}')
const headersText = ref('{\n  "Authorization": "Bearer {{API_KEY}}",\n  "Content-Type": "application/json"\n}')
const providerDraft = ref<AiProviderConfig>(createEmptyProvider())

const activePalette = computed(() => getMardTierPalette(selectedTier.value, selectedVendor.value).map((color) => toPaletteColor(color, selectedVendor.value)))
const editPalette = computed(() => getMardTierPalette(editPaletteTier.value, selectedVendor.value).map((color) => toPaletteColor(color, selectedVendor.value)))
const missingTierCodes = computed(() => getMardTierMissingCodes(selectedTier.value))
const selectedAiStyle = computed(() => AI_STYLE_PRESETS.find((style) => style.id === selectedAiStyleId.value) ?? AI_STYLE_PRESETS[0])
const aiPrompt = computed(() => selectedAiStyle.value.prompt)
const selectedVendorLabel = computed(() => getVendorLabel(selectedVendor.value))
const effectiveSimilarityThreshold = computed(() => getEffectiveMergeThreshold(columns.value, similarityThreshold.value))
const canEraseBackground = computed(() => Boolean(pattern.value && sourceImage.value && !backgroundEraseUsed.value && !isBackgroundErasing.value && !isFaceEnhancing.value))
const canEnhanceFaceContour = computed(() => Boolean(pattern.value && sourceImage.value && !faceContourEnhanceUsed.value && !isFaceEnhancing.value && !isBackgroundErasing.value))
const watermarkLabel = computed(() => {
  if (watermarkMode.value === 'visible') {
    return '明水印'
  }
  if (watermarkMode.value === 'subtle') {
    return '暗水印'
  }
  return '关闭'
})
const canvasSize = computed(() => {
  const current = pattern.value
  if (!current) {
    return { width: 960, height: 720 }
  }
  const maxWidth = 980
  const maxHeight = 720
  const ratio = current.height / current.width
  const widthByHeight = maxHeight / ratio
  const width = Math.min(maxWidth, widthByHeight)
  return { width, height: width * ratio }
})
const editorCanvasSize = computed(() => {
  const current = editPattern.value
  if (!current) {
    return canvasSize.value
  }

  const minCellSize = editorShowColorKeys.value ? EDITOR_COLOR_KEY_CELL_SIZE : editorShowGrid.value ? EDITOR_GRID_CELL_SIZE : 0
  return minCellSize > 0 ? getPatternRenderSize(current, minCellSize, canvasSize.value) : canvasSize.value
})
const exportCanvasSize = computed(() => {
  const current = pattern.value
  if (!current) {
    return canvasSize.value
  }

  const minCellSize = exportShowColorKeys.value ? EXPORT_COLOR_KEY_CELL_SIZE : exportShowGrid.value ? EXPORT_GRID_CELL_SIZE : 0
  return minCellSize > 0 ? getPatternRenderSize(current, minCellSize, canvasSize.value) : canvasSize.value
})
const exportSheetCanvasSize = computed(() => {
  const current = pattern.value
  if (!current) {
    return canvasSize.value
  }

  return getPatternSheetCanvasSize(current, {
    beadStyle: beadStyle.value,
    width: exportCanvasSize.value.width,
    height: exportCanvasSize.value.height,
    watermark: { mode: watermarkMode.value, text: watermarkText.value },
    showGrid: exportShowGrid.value,
    showColorKeys: exportShowColorKeys.value,
    gridStrength: 'clear'
  })
})
const editorCanvasDisplayStyle = computed(() => ({
  width: `${Math.round(editorCanvasSize.value.width * (zoomPercent.value / 100))}px`,
  maxWidth: editorShowGrid.value || editorShowColorKeys.value || zoomPercent.value > 100 ? 'none' : '100%',
  cursor: editPattern.value ? (editMode.value === 'eyedropper' ? 'copy' : 'crosshair') : 'default'
}))
const groupedEditPalette = computed(() => {
  const groups = new Map<string, PaletteColor[]>()
  for (const color of editPalette.value) {
    const letter = color.key.match(/^[A-Z]+/)?.[0] ?? '#'
    groups.set(letter, [...(groups.get(letter) ?? []), color])
  }
  return [...groups.entries()].map(([letter, colors]) => ({
    letter,
    colors: colors.sort((first, second) => (first.displayCode || first.key).localeCompare(second.displayCode || second.key, undefined, { numeric: true }))
  }))
})

onMounted(() => {
  loadProviders()
})

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

function setColumns(size: number) {
  columns.value = size
  rebuildFromSource()
}

function clampSimilarityThreshold() {
  similarityThreshold.value = Math.max(0, Math.min(90, Math.round(Number(similarityThreshold.value) || 0)))
  rebuildFromSource()
}

function setPixelationMode(mode: PixelationMode) {
  pixelationMode.value = mode
  rebuildFromSource()
}

function setPaletteTier(tier: BeadPaletteTier) {
  selectedTier.value = tier
  editPaletteTier.value = tier
  excludedColorKeys.value = []
  rebuildFromSource()
}

function setEditPaletteTier(tier: BeadPaletteTier) {
  editPaletteTier.value = tier
  brushColor.value = editPalette.value[0] ?? null
}

function setPaletteVendor(vendor: BeadVendorId) {
  selectedVendor.value = vendor
  excludedColorKeys.value = []
  editPaletteTier.value = selectedTier.value
  if (sourceImage.value) {
    rebuildFromSource()
    return
  }
  pattern.value = pattern.value ? relabelPattern(pattern.value, vendor) : null
  editPattern.value = editPattern.value ? relabelPattern(editPattern.value, vendor) : null
  brushColor.value = editPalette.value[0] ?? null
  nextTick(() => {
    renderPattern()
    renderEditor()
  })
}

function setWatermarkMode(mode: WatermarkMode) {
  watermarkMode.value = mode
  renderPattern()
}

function toggleEditorGrid() {
  editorShowGrid.value = !editorShowGrid.value
  renderEditor()
}

function toggleEditorColorKeys() {
  editorShowColorKeys.value = !editorShowColorKeys.value
  renderEditor()
}

function selectBrushColor(color: PaletteColor) {
  brushColor.value = color
  editMode.value = 'brush'
}

function openEditor() {
  if (!pattern.value) {
    return
  }
  editPattern.value = clonePattern(pattern.value)
  selectedCell.value = null
  isPainting.value = false
  lastPaintedCell.value = ''
  if (!brushColor.value) {
    brushColor.value = editPalette.value.find((color) => color.key === pattern.value?.colors[0]?.key) ?? editPalette.value[0] ?? null
  }
  editorVisible.value = true
  nextTick(renderEditor)
}

function closeEditor() {
  editorVisible.value = false
  editPattern.value = null
  selectedCell.value = null
  isPainting.value = false
  lastPaintedCell.value = ''
}

function saveEditor() {
  if (!editPattern.value) {
    return
  }
  pattern.value = clonePattern(editPattern.value)
  status.value = `已保存微调，当前共 ${pattern.value.totalBeads} 颗，${pattern.value.colors.length} 色。`
  closeEditor()
  nextTick(renderPattern)
}

function resetPattern() {
  sourceName.value = ''
  sourceDataUrl.value = ''
  status.value = ''
  sourceImage.value = null
  pattern.value = null
  editPattern.value = null
  editorVisible.value = false
  pngExportDialogVisible.value = false
  resetAiActionUsage()
  excludedColorKeys.value = []
  selectedCell.value = null
  brushColor.value = null
  clearCanvas()
}

async function loadFile(file: File) {
  if (!file.type.startsWith('image/')) {
    status.value = '请选择图片文件。'
    return
  }

  if (file.size > 12 * 1024 * 1024) {
    status.value = '图片超过 12MB，请先压缩后再处理。'
    return
  }

  sourceName.value = file.name
  sourceDataUrl.value = await fileToDataUrl(file)
  await loadImageFromDataUrl(sourceDataUrl.value)
}

async function loadImageFromDataUrl(dataUrl: string) {
  const image = new Image()
  image.onload = () => {
    sourceImage.value = image
    resetAiActionUsage()
    rebuildFromSource()
  }
  image.onerror = () => {
    status.value = '图片读取失败，请换一张图片再试。'
  }
  image.src = dataUrl
}

function rebuildFromSource() {
  if (!sourceImage.value) {
    return
  }

  try {
    const nextPattern = buildPatternFromImage(sourceImage.value, activePalette.value, {
      columns: Math.max(1, Math.round(columns.value)),
      paletteTier: selectedTier.value,
      paletteVendor: selectedVendor.value,
      pixelationMode: pixelationMode.value,
      similarityThreshold: similarityThreshold.value,
      excludedColorKeys: excludedColorKeys.value
    })
    pattern.value = nextPattern
    selectedCell.value = null
    brushColor.value = editPalette.value.find((color) => color.key === nextPattern.colors[0]?.key) ?? editPalette.value[0] ?? null
    const missingText = missingTierCodes.value.length ? `；缺少 ${missingTierCodes.value.join(', ')} 的可验证色值` : ''
    status.value = `已生成 ${nextPattern.width}x${nextPattern.height} 拼豆图，共 ${nextPattern.totalBeads} 颗，${nextPattern.colors.length} 色${missingText}。`
    nextTick(renderPattern)
  } catch (error) {
    status.value = error instanceof Error ? error.message : '转换失败。'
  }
}

function resetAiActionUsage() {
  backgroundEraseUsed.value = false
  faceContourEnhanceUsed.value = false
  isBackgroundErasing.value = false
  isFaceEnhancing.value = false
}

async function eraseBackground() {
  if (!pattern.value || !sourceImage.value || backgroundEraseUsed.value) {
    return
  }

  isBackgroundErasing.value = true
  try {
    const result = await eraseBackgroundWithLocalSegmentation(sourceImage.value, pattern.value)
    pattern.value = result.pattern
    backgroundEraseUsed.value = true
    selectedCell.value = null
    status.value = `AI 已擦除背景（${result.provider}），当前共 ${pattern.value.totalBeads} 颗。`
  } catch (error) {
    const cells = eraseBorderBackground(pattern.value.cells)
    const stats = withUpdatedStats(cells)
    pattern.value = {
      ...pattern.value,
      cells: stats.cells,
      colors: stats.colors,
      totalBeads: stats.totalBeads,
      options: {
        ...pattern.value.options,
        backgroundErase: { mode: 'fallback', used: true }
      }
    }
    backgroundEraseUsed.value = true
    selectedCell.value = null
    const reason = error instanceof Error ? error.message : '本地 AI 分割失败'
    status.value = `AI 擦除失败，已回退边界背景算法：${reason}。当前共 ${stats.totalBeads} 颗。`
  } finally {
    isBackgroundErasing.value = false
    nextTick(renderPattern)
  }
}

async function enhanceFaceOutline() {
  if (!pattern.value || !sourceImage.value || faceContourEnhanceUsed.value) {
    return
  }

  isFaceEnhancing.value = true
  try {
    const result = await enhanceFaceContour(sourceImage.value, pattern.value, activePalette.value)
    pattern.value = result.pattern
    faceContourEnhanceUsed.value = true
    selectedCell.value = null
    status.value =
      result.changedCells > 0
        ? `已使用${getFaceDetectorLabel(result.detector)}增强 ${result.changedCells} 个面部轮廓格。`
        : `未检测到可增强的脸部轮廓，本次机会已使用。`
  } catch (error) {
    faceContourEnhanceUsed.value = true
    status.value = error instanceof Error ? `面部轮廓增强失败，本次机会已使用：${error.message}` : '面部轮廓增强失败，本次机会已使用。'
  } finally {
    isFaceEnhancing.value = false
    nextTick(renderPattern)
  }
}

function getFaceDetectorLabel(detector: string) {
  if (detector === 'mediapipe') {
    return '人脸模型'
  }
  if (detector === 'heuristic') {
    return '卡通脸启发式'
  }
  return '本地模型'
}

function excludeColor(key: string) {
  if (!excludedColorKeys.value.includes(key)) {
    excludedColorKeys.value = [...excludedColorKeys.value, key]
  }
  if (pattern.value) {
    const cells = remapExcludedColors(pattern.value.cells, activePalette.value, excludedColorKeys.value)
    const stats = withUpdatedStats(cells)
    pattern.value = { ...pattern.value, cells: stats.cells, colors: stats.colors, totalBeads: stats.totalBeads }
    nextTick(renderPattern)
  }
}

function restoreColor(key: string) {
  excludedColorKeys.value = excludedColorKeys.value.filter((item) => item !== key)
  rebuildFromSource()
}

function handleEditorPointerDown(event: PointerEvent) {
  if (!editPattern.value) {
    return
  }
  isPainting.value = true
  lastPaintedCell.value = ''
  ;(event.currentTarget as HTMLCanvasElement).setPointerCapture(event.pointerId)
  applyEditorEdit(event)
}

function handleEditorPointerMove(event: PointerEvent) {
  if (!isPainting.value || editMode.value !== 'brush') {
    return
  }
  applyEditorEdit(event)
}

function stopPainting() {
  isPainting.value = false
  lastPaintedCell.value = ''
}

function applyEditorEdit(event: PointerEvent) {
  const canvas = editorCanvas.value
  const currentPattern = editPattern.value
  if (!canvas || !currentPattern) {
    return
  }

  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  const position = hitTestPatternCell(currentPattern, canvas.width, canvas.height, (event.clientX - rect.left) * scaleX, (event.clientY - rect.top) * scaleY)
  if (!position) {
    return
  }

  selectedCell.value = position
  const cellKey = `${position.row}:${position.col}`
  if (editMode.value === 'eyedropper') {
    const cell = currentPattern.cells[position.row]?.[position.col]
    if (cell && !cell.isExternal) {
      brushColor.value = {
        key: cell.key,
        displayCode: cell.displayCode,
        name: cell.name,
        hex: cell.color,
        rgb: { ...cell.rgb },
        vendor: cell.vendor,
        vendorCodes: { ...cell.vendorCodes }
      }
      editMode.value = 'brush'
      status.value = `已吸取 ${cell.displayCode || cell.key}。`
    }
    renderEditor()
    return
  }

  if (!brushColor.value || lastPaintedCell.value === cellKey) {
    renderEditor()
    return
  }
  lastPaintedCell.value = cellKey
  const stats = withUpdatedStats(replaceCellColor(currentPattern.cells, position.row, position.col, brushColor.value))
  editPattern.value = { ...currentPattern, cells: stats.cells, colors: stats.colors, totalBeads: stats.totalBeads }
  status.value = `已将第 ${position.row + 1} 行、第 ${position.col + 1} 列改为 ${brushColor.value.displayCode}。`
  nextTick(renderEditor)
}

function renderPattern() {
  const canvas = previewCanvas.value
  const currentPattern = pattern.value
  if (!canvas || !currentPattern) {
    clearCanvas()
    return
  }

  renderPatternToCanvas(canvas, currentPattern, {
    beadStyle: beadStyle.value,
    width: canvasSize.value.width,
    height: canvasSize.value.height,
    watermark: { mode: watermarkMode.value, text: watermarkText.value },
    showGrid: true
  })
}

function renderEditor() {
  const canvas = editorCanvas.value
  const currentPattern = editPattern.value
  if (!canvas || !currentPattern) {
    return
  }

  renderPatternToCanvas(canvas, currentPattern, {
    beadStyle: beadStyle.value,
    width: editorCanvasSize.value.width,
    height: editorCanvasSize.value.height,
    selectedCell: selectedCell.value,
    showGrid: editorShowGrid.value,
    showColorKeys: editorShowColorKeys.value,
    gridStrength: 'clear'
  })
}

function clonePattern(source: PatternResult): PatternResult {
  return {
    ...source,
    colors: source.colors.map((color) => ({ ...color, rgb: { ...color.rgb }, vendorCodes: { ...color.vendorCodes } })),
    cells: cloneCells(source.cells),
    options: {
      ...source.options,
      excludedColorKeys: [...source.options.excludedColorKeys]
    }
  }
}

function relabelPattern(source: PatternResult, vendor: BeadVendorId): PatternResult {
  const relabeledCells = source.cells.map((row) =>
    row.map((cell) => ({
      ...cell,
      displayCode: cell.vendorCodes[vendor] ?? cell.vendorCodes.mard ?? cell.key,
      vendor,
      rgb: { ...cell.rgb },
      vendorCodes: { ...cell.vendorCodes }
    }))
  )
  const stats = withUpdatedStats(relabeledCells)
  return {
    ...source,
    cells: stats.cells,
    colors: stats.colors,
    totalBeads: stats.totalBeads,
    options: {
      ...source.options,
      paletteVendor: vendor
    }
  }
}

function getPatternRenderSize(currentPattern: PatternResult, minCellSize: number, baseSize: { width: number; height: number }) {
  const baseCellSize = Math.min(baseSize.width / currentPattern.width, baseSize.height / currentPattern.height)
  const cellSize = Math.max(baseCellSize, minCellSize)
  return {
    width: currentPattern.width * cellSize,
    height: currentPattern.height * cellSize
  }
}

function clearCanvas() {
  const canvas = previewCanvas.value
  const context = canvas?.getContext('2d')
  if (canvas && context) {
    context.clearRect(0, 0, canvas.width, canvas.height)
  }
}

function openPngExportDialog() {
  if (!pattern.value) {
    return
  }
  pngExportDialogVisible.value = true
}

function downloadPng() {
  if (!pattern.value) {
    return
  }
  const canvas = createPatternSheetCanvas(pattern.value, {
    beadStyle: beadStyle.value,
    width: exportCanvasSize.value.width,
    height: exportCanvasSize.value.height,
    watermark: { mode: watermarkMode.value, text: watermarkText.value },
    showGrid: exportShowGrid.value,
    showColorKeys: exportShowColorKeys.value,
    gridStrength: 'clear'
  })
  downloadUrl(canvas.toDataURL('image/png'), makeExportName('png'))
  pngExportDialogVisible.value = false
}

function downloadJson() {
  if (!pattern.value) {
    return
  }
  const payload = createPatternJsonPayload(
    pattern.value,
    sourceName.value,
    MARD_TIER_SOURCE_NOTE,
    selectedVendor.value,
    selectedProviderId.value ? { providerId: selectedProviderId.value, prompt: aiPrompt.value } : undefined
  )
  downloadBlob(JSON.stringify(payload, null, 2), 'application/json;charset=utf-8', makeExportName('json'))
}

function downloadCsv() {
  if (!pattern.value) {
    return
  }
  downloadBlob(createColorCsv(pattern.value, selectedVendor.value), 'text/csv;charset=utf-8', makeExportName('csv'))
}

async function loadProviders() {
  providers.value = (await window.aipindou?.providers.list()) ?? []
  if (!selectedProviderId.value && providers.value[0]) {
    selectedProviderId.value = providers.value[0].id
  }
}

function openProviderDialog() {
  const current = providers.value.find((provider) => provider.id === selectedProviderId.value)
  providerDraft.value = current ? { ...current } : createEmptyProvider()
  variablesText.value = JSON.stringify(providerDraft.value.variables ?? { API_KEY: '', MODEL: '' }, null, 2)
  headersText.value = JSON.stringify(providerDraft.value.headersTemplate, null, 2)
  providerDialogVisible.value = true
}

function fillDashScopePreset() {
  providerDraft.value = createDashScopeProvider(providerDraft.value.id)
  variablesText.value = JSON.stringify(providerDraft.value.variables, null, 2)
  headersText.value = JSON.stringify(providerDraft.value.headersTemplate, null, 2)
}

async function saveProviderDraft() {
  try {
    const provider = {
      ...providerDraft.value,
      variables: JSON.parse(variablesText.value || '{}'),
      headersTemplate: JSON.parse(headersText.value || '{}')
    }
    providers.value = (await window.aipindou?.providers.save(provider)) ?? providers.value
    selectedProviderId.value = provider.id || providers.value[providers.value.length - 1]?.id || ''
    providerDialogVisible.value = false
    status.value = 'AI Provider 已保存。'
  } catch (error) {
    status.value = error instanceof Error ? error.message : 'Provider 保存失败。'
  }
}

async function removeProviderDraft() {
  if (!providerDraft.value.id) {
    return
  }
  providers.value = (await window.aipindou?.providers.remove(providerDraft.value.id)) ?? providers.value
  selectedProviderId.value = providers.value[0]?.id ?? ''
  providerDialogVisible.value = false
}

async function runAiOptimize() {
  if (!sourceDataUrl.value || !selectedProviderId.value) {
    return
  }
  isAiProcessing.value = true
  startAiTimer()
  status.value = 'AI 正在优化图片，Wan2.6 通常需要 1-5 分钟，请等待...'
  try {
    const result = await window.aipindou?.ai.optimizeImage({
      providerId: selectedProviderId.value,
      variables: {
        IMAGE_DATA_URL: sourceDataUrl.value,
        IMAGE_BASE64: sourceDataUrl.value.split(',')[1] ?? sourceDataUrl.value,
        IMAGE_MIME: sourceDataUrl.value.match(/^data:(.*?);/)?.[1] ?? 'image/png',
        PROMPT: aiPrompt.value
      }
    })
    if (!result?.image) {
      throw new Error('AI 未返回图片。')
    }
    sourceName.value = `${sourceName.value || 'image'}-ai`
    sourceDataUrl.value = normalizeImageData(result.image)
    await loadImageFromDataUrl(sourceDataUrl.value)
    status.value = 'AI 优化完成，已用新图片重新生成。'
  } catch (error) {
    status.value = error instanceof Error ? error.message : 'AI 优化失败。'
  } finally {
    isAiProcessing.value = false
    stopAiTimer()
  }
}

function startAiTimer() {
  stopAiTimer()
  aiStartedAt.value = Date.now()
  aiElapsedSeconds.value = 0
  aiTimer = window.setInterval(() => {
    aiElapsedSeconds.value = Math.round((Date.now() - aiStartedAt.value) / 1000)
    status.value = `AI 正在优化图片，已等待 ${aiElapsedSeconds.value} 秒；Wan2.6 通常需要 1-5 分钟。`
  }, 1000)
}

function stopAiTimer() {
  if (aiTimer) {
    window.clearInterval(aiTimer)
    aiTimer = undefined
  }
}

function normalizeImageData(image: string) {
  if (image.startsWith('data:image/')) {
    return image
  }
  return `data:image/png;base64,${image}`
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function downloadBlob(content: string, type: string, name: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  downloadUrl(url, name)
  URL.revokeObjectURL(url)
}

function downloadUrl(url: string, name: string) {
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
}

function makeExportName(extension: 'png' | 'json' | 'csv') {
  const base = sourceName.value ? sourceName.value.replace(/\.[^.]+$/, '') : 'aipindou-pattern'
  const current = pattern.value
  return `${base}-${current?.width ?? columns.value}x${current?.height ?? 'auto'}.${extension}`
}

function createEmptyProvider(): AiProviderConfig {
  return {
    id: '',
    name: '自定义图像模型',
    endpoint: '',
    method: 'POST',
    headersTemplate: {
      Authorization: 'Bearer {{API_KEY}}',
      'Content-Type': 'application/json'
    },
    bodyTemplate: '{\n  "model": "{{MODEL}}",\n  "prompt": "{{PROMPT}}",\n  "image": "{{IMAGE_BASE64}}"\n}',
    responseImagePath: 'image',
    timeoutMs: 120000,
    variables: {
      API_KEY: '',
      MODEL: ''
    }
  }
}

function createDashScopeProvider(id = ''): AiProviderConfig {
  return {
    id,
    name: 'DashScope Wan2.6 Image',
    endpoint: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation',
    method: 'POST',
    headersTemplate: {
      Authorization: 'Bearer {{API_KEY}}',
      'Content-Type': 'application/json'
    },
    bodyTemplate:
      '{\n' +
      '  "model": "{{MODEL}}",\n' +
      '  "input": {\n' +
      '    "messages": [\n' +
      '      {\n' +
      '        "role": "user",\n' +
      '        "content": [\n' +
      '          { "text": "{{PROMPT}}" },\n' +
      '          { "image": "{{IMAGE_DATA_URL}}" }\n' +
      '        ]\n' +
      '      }\n' +
      '    ]\n' +
      '  },\n' +
      '  "parameters": {\n' +
      '    "prompt_extend": true,\n' +
      '    "watermark": false,\n' +
      '    "n": 1,\n' +
      '    "size": "1K"\n' +
      '  }\n' +
      '}',
    responseImagePath: 'output.choices[0].message.content[0].image',
    timeoutMs: 300000,
    variables: {
      API_KEY: '',
      MODEL: 'wan2.6-image'
    }
  }
}
</script>

<style scoped>
.workspace {
  width: min(1500px, calc(100vw - 40px));
  margin: 0 auto;
  padding: 28px 0 40px;
}

.hero-panel,
.control-panel,
.preview-panel,
.palette-panel,
.modal-panel {
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
  max-width: 760px;
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
.export-actions button:first-child,
.wide-button {
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
  grid-template-columns: 340px minmax(520px, 1fr) 330px;
  gap: 18px;
  align-items: start;
}

.control-panel,
.preview-panel,
.palette-panel,
.modal-panel {
  border-radius: 28px;
  background: rgba(255, 252, 245, 0.82);
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

.compact-head {
  margin: 12px 0 8px;
}

input[type='range'] {
  width: 100%;
  accent-color: #b45f24;
}

.number-input,
.text-input,
.select-input {
  box-sizing: border-box;
  width: 100%;
  margin-top: 10px;
  padding: 10px 12px;
  border: 1px solid rgba(36, 52, 44, 0.14);
  border-radius: 14px;
  color: #24342c;
  background: rgba(255, 255, 255, 0.78);
}

.text-input {
  resize: vertical;
}

.mono {
  font-family: Consolas, 'SFMono-Regular', monospace;
}

.quick-sizes button,
.segmented button,
.tier-grid button,
.mini-button {
  padding: 8px 12px;
  background: #efe6d2;
}

.segmented button.active,
.tier-grid button.active,
.editor-toolbar button.active {
  color: #fffaf0;
  background: #b45f24;
}

.tune-button {
  color: #fffaf0;
  background: #b45f24;
  box-shadow: 0 12px 24px rgba(180, 95, 36, 0.24);
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

.prompt-preview {
  margin: 10px 0 0;
  padding: 10px 12px;
  border-radius: 14px;
  color: #5a645b;
  background: rgba(239, 230, 210, 0.58);
  font-size: 12px;
  line-height: 1.6;
}

.brush-preview {
  display: grid;
  grid-template-columns: 36px 1fr;
  gap: 10px;
  align-items: center;
  margin-top: 12px;
  padding: 10px;
  border-radius: 14px;
  background: rgba(239, 230, 210, 0.58);
}

.brush-preview strong,
.brush-preview small {
  display: block;
}

.brush-preview small {
  color: #6b746c;
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
  min-height: 600px;
  place-items: center;
  overflow: auto;
  border-radius: 24px;
  background:
    linear-gradient(45deg, rgba(36, 52, 44, 0.05) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(36, 52, 44, 0.05) 25%, transparent 25%),
    #fbf8ef;
  background-size: 24px 24px;
}

canvas {
  max-width: 100%;
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
  grid-template-columns: 36px 1fr auto auto;
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
.palette-empty,
.panel-title small {
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

.excluded-box {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  padding: 12px;
  border-radius: 18px;
  background: rgba(239, 230, 210, 0.68);
}

.palette-groups {
  display: grid;
  gap: 12px;
  max-height: 320px;
  margin-top: 12px;
  overflow: auto;
  padding-right: 4px;
}

.palette-group {
  display: grid;
  grid-template-columns: 30px 1fr;
  gap: 8px;
  align-items: start;
}

.palette-group strong {
  color: #24342c;
  line-height: 28px;
}

.palette-group > div,
.palette-group {
  min-width: 0;
}

.palette-swatch {
  min-width: 42px;
  margin: 0 6px 6px 0;
  padding: 6px 8px;
  border: 2px solid rgba(36, 52, 44, 0.1);
  border-radius: 10px;
  color: #1f2924;
  font-size: 11px;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.72);
}

.palette-swatch.active {
  border-color: #1b6cff;
  box-shadow: 0 0 0 2px rgba(27, 108, 255, 0.18);
}

.wide-button {
  width: 100%;
  margin-top: 12px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(20, 25, 22, 0.42);
}

.modal-panel {
  width: min(900px, 94vw);
  max-height: 88vh;
  overflow: auto;
  padding: 24px;
}

.editor-modal {
  width: min(1380px, 96vw);
  max-height: 92vh;
}

.export-modal {
  width: min(460px, 94vw);
}

.export-options {
  display: grid;
  gap: 12px;
}

.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 16px;
  color: #24342c;
  background: rgba(239, 230, 210, 0.58);
  font-weight: 800;
}

.switch-row input {
  width: 22px;
  height: 22px;
  margin: 0;
  accent-color: #b45f24;
}

.export-summary {
  margin-top: 12px;
}

.dialog-actions {
  justify-content: flex-end;
  margin-top: 18px;
}

.editor-layout {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 16px;
  background: rgba(239, 230, 210, 0.58);
}

.editor-toolbar span {
  margin-left: auto;
  color: #59645a;
  font-size: 13px;
  font-weight: 800;
}

.editor-tools {
  max-height: calc(92vh - 116px);
  overflow: auto;
  padding-right: 4px;
}

.editor-canvas-wrap {
  display: grid;
  min-height: min(70vh, 720px);
  place-items: center;
  overflow: auto;
  border-radius: 22px;
  background:
    linear-gradient(45deg, rgba(36, 52, 44, 0.05) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(36, 52, 44, 0.05) 25%, transparent 25%),
    #fbf8ef;
  background-size: 24px 24px;
}

.editor-palette-groups {
  max-height: 420px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.form-grid label:nth-last-child(-n + 2) {
  grid-column: 1 / -1;
}

@media (max-width: 1220px) {
  .content-grid {
    grid-template-columns: 320px 1fr;
  }

  .palette-panel {
    grid-column: 1 / -1;
  }
}

@media (max-width: 860px) {
  .workspace {
    width: min(100vw - 24px, 720px);
    padding-top: 14px;
  }

  .hero-panel {
    align-items: flex-start;
    flex-direction: column;
  }

  .content-grid,
  .editor-layout,
  .form-grid {
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
