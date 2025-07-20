import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import './tailwind.css'

import {
  create,
  NButton,
  NDialogProvider,
  NMessageProvider,
  NNotificationProvider,
  NIcon
} from 'naive-ui'

const naive = create({
  components: [
    NButton,
    NDialogProvider,
    NMessageProvider,
    NNotificationProvider,
    NIcon
  ]
})

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(naive)

app.mount('#app')  // ✅ 不再提前调用 initializeApp
