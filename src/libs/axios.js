import axios from 'axios'

// Create Axios instance compatible with Vue 3 apps
const api = axios.create({
  baseURL: import.meta?.env?.VITE_API_URL || '/',
  timeout: 10000,
})

// Attach auth token if available
api.interceptors.request.use(
  config => {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error),
)

// Basic response interceptor (extend with refresh logic later)
api.interceptors.response.use(
  response => response,
  error => Promise.reject(error),
)

export default api
