import { createApp } from 'vue'
import App from './App.vue'

// Import global styles
import './assets/styles/main.css'
import { router } from './router'
import { createPinia } from 'pinia'

// Create app instance
const app = createApp(App)

// Install Pinia
const pinia = createPinia()
app.use(pinia)

app.use(router)

// Mount app first
app.mount('#app')

// Initialize MSW (Mock Service Worker) after app is mounted
async function enableMocking() {
  if (typeof window === 'undefined') {
    return
  }

  try {
    // Check if we're in a browser environment
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      // Start MSW
      const { worker } = await import('./mocks/browser')
      await worker.start({
        onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
        serviceWorker: {
          url: '/mockServiceWorker.js',
        },
      })
      console.log('✅ MSW enabled (Mock Service Worker)')
    }
  } catch (error) {
    console.warn('⚠️ Failed to initialize MSW:', error)
    // Don't let MSW errors block the app
  }
}

// Enable mocking after app is mounted (non-blocking)
setTimeout(() => {
  enableMocking().catch(error => {
    console.warn('⚠️ MSW initialization failed, but app is running:', error)
  })
}, 100)

console.log('🚀 Wevas Next-Gen starting up...')
console.log('✨ Vue 3 + Vite + TypeScript + Tailwind CSS + MSW')
