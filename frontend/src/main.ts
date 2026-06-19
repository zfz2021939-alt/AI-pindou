import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'

// 1. 创建 Vue 应用实例
const app = createApp(App)

// 2. 全局注册 Element Plus 图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 3. 安装插件
app.use(createPinia())
app.use(router)
app.use(ElementPlus)

// 4. 将应用挂载到 HTML 中 id 为 'app' 的元素上
app.mount('#app')
