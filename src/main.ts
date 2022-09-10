import naive from 'naive-ui'
import { createApp } from 'vue'
import App from '@/App.vue'
import { router } from '@/router'
// 等宽字体
import 'uno.css'
import 'vfonts/FiraCode.css'

const app = createApp(App)
app.use(naive)
app.use(router)

router.isReady().then(() => {
  app.mount('#app')
})
