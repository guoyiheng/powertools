import naive from 'naive-ui'
import { createApp } from 'vue'
import { router } from '@/router'
// 等宽字体
import 'uno.css'
import 'vfonts/FiraCode.css'
import App from '@/App.vue'

const app = createApp(App)
app.use(router)
app.use(naive)

router.isReady().then(() => {
  app.mount('#app')
})
