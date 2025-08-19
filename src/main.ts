import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { createHead } from '@vueuse/head'
import { createI18n } from 'vue-i18n'
import Toast from 'vue-toastification'

// Import global styles
import '@/assets/styles/main.css'
import 'vue-toastification/dist/index.css'

// Import app components
import App from './App.vue'

// Import stores
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

// Import router
import router from '@/router'

// Import i18n
import i18n from '@/i18n'

// Import mock database (development only)
if (import.meta.env.DEV) {
  await import('@/mocks/browser')
}

// Create app instance
const app = createApp(App)

// Create and install plugins
const pinia = createPinia()
const head = createHead()

// Install plugins
app.use(pinia)
app.use(router)
app.use(head)
app.use(i18n)
app.use(Toast, {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
})

// Initialize stores
const authStore = useAuthStore()
const appStore = useAppStore()

// Initialize app
appStore.initialize()

// Mount app
app.mount('#app')

// Export for testing
export { app, pinia, router, head, i18n }
