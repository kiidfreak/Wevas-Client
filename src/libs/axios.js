import axios from 'axios'

console.log('🔧 Axios: Creating axios instance...')

// Create Axios instance compatible with Vue 3 apps
const api = axios.create({
  baseURL: import.meta?.env?.VITE_API_URL || '/',
  timeout: 10000,
})

console.log('🔧 Axios: Instance created with baseURL:', api.defaults.baseURL)

// Attach auth token if available
api.interceptors.request.use(
  config => {
    console.log('🔧 Axios: Request interceptor - URL:', config.url, 'Method:', config.method)
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
      console.log('🔧 Axios: Token attached to request')
    }
    return config
  },
  error => Promise.reject(error),
)

// Basic response interceptor (extend with refresh logic later)
api.interceptors.response.use(
  response => {
    console.log('🔧 Axios: Response received:', response.status, response.config.url)
    return response
  },
  error => {
    console.error('🔧 Axios: Response error:', error.response?.status, error.config?.url, error.message)
    return Promise.reject(error)
  },
)

console.log('🔧 Axios: Axios instance configured and ready')

export default api
