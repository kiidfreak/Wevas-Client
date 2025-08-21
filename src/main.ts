import { createApp } from 'vue'
import App from './App.vue'

// Import global styles
import './assets/styles/main.css'
import { router } from './router'
import { createPinia } from 'pinia'

// Initialize mock API only in development (await to ensure ready before app mounts)
if (import.meta.env.DEV) {
  try {
    await import('@/@fake-db/db')
    console.log('✅ Mock API enabled (development)')
  } catch (e) {
    console.warn('⚠️ Failed to initialize mock API', e)
  }
}

// Create app instance
const app = createApp(App)

// Install Pinia
const pinia = createPinia()
app.use(pinia)

app.use(router)

// Mount app
app.mount('#app')

console.log('🚀 Wevas Next-Gen starting up...')
console.log('✨ Vue 3 + Vite + TypeScript + Tailwind CSS')
