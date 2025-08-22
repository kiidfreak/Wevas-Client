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

// Simple mock interceptor for axios (temporary solution)
function setupSimpleMock() {
  console.log('🔧 Setting up simple axios mock interceptor...')
  
  // Import axios and set up interceptors
  import('@axios').then(({ default: api }) => {
    console.log('🔧 Axios instance imported, setting up interceptors...')
    
    // Add request interceptor for logging
    api.interceptors.request.use(
      (config) => {
        console.log('🔧 Axios request interceptor:', config.method?.toUpperCase(), config.url)
        return config
      },
      (error) => {
        console.error('🔧 Axios request error:', error)
        return Promise.reject(error)
      }
    )
    
    // Add response interceptor for mocking
    api.interceptors.response.use(
      (response) => {
        console.log('🔧 Axios response interceptor:', response.status, response.config.url)
        return response
      },
      async (error) => {
        console.log('🔧 Axios error interceptor:', error.config?.method, error.config?.url, error.response?.status)
        
        // Mock auth/login endpoint
        if (error.config?.url?.includes('/auth/login') && error.config?.method === 'post') {
          console.log('🔧 Mock: Intercepting axios /auth/login request')
          
          try {
            const body = JSON.parse(error.config.data || '{}')
            const { email, password } = body
            
            console.log('🔧 Mock: Login attempt:', { email, password })
            
            // Simple mock user validation
            if (email === 'admin@demo.com' && password === 'admin') {
              console.log('🔧 Mock: Login successful')
              
              const mockResponse = {
                userData: {
                  id: 1,
                  fullName: 'John Doe',
                  email: 'admin@demo.com',
                  role: 'admin'
                },
                tokens: {
                  access_token: 'mock-token-' + Date.now(),
                  refresh_token: 'mock-refresh-' + Date.now()
                },
                ability: [{ action: 'manage', subject: 'all' }],
                membership: {
                  type: 'premium',
                  organisation_id: 1,
                  name: 'Demo Organisation'
                }
              }
              
              // Return a successful response
              return Promise.resolve({
                data: mockResponse,
                status: 200,
                statusText: 'OK',
                headers: { 'content-type': 'application/json' },
                config: error.config
              })
            } else {
              console.log('🔧 Mock: Login failed - invalid credentials')
              return Promise.reject({
                response: {
                  data: { errors: { email: ['Email or Password is Invalid'] } },
                  status: 400,
                  statusText: 'Bad Request'
                }
              })
            }
          } catch (parseError) {
            console.error('🔧 Mock: Error processing login:', parseError)
            return Promise.reject({
              response: {
                data: { error: 'Internal server error' },
                status: 500,
                statusText: 'Internal Server Error'
              }
            })
          }
        }
        
        // Mock auth/logout endpoint
        if (error.config?.url?.includes('/auth/logout') && error.config?.method === 'post') {
          console.log('🔧 Mock: Intercepting axios /auth/logout request')
          return Promise.resolve({
            data: { message: 'Logged out successfully' },
            status: 200,
            statusText: 'OK',
            headers: { 'content-type': 'application/json' },
            config: error.config
          })
        }
        
        // For all other errors, pass through
        return Promise.reject(error)
      }
    )
    
    console.log('✅ Simple axios mock interceptor setup complete')
  }).catch(error => {
    console.error('❌ Failed to import axios instance:', error)
  })
}

// Initialize simple mock after app is mounted
setTimeout(() => {
  setupSimpleMock()
}, 500)

console.log('🚀 Wevas Next-Gen starting up...')
console.log('✨ Vue 3 + Vite + TypeScript + Tailwind CSS + Axios Mock')
