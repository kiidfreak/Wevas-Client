import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@axios'

export interface UserData {
  id?: number
  email?: string
  fullName?: string
  role?: string
  [key: string]: unknown
}

export interface LoginPayload {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null)
  const user = ref<UserData | null>(null)
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)

  const isAuthenticated = computed(() => Boolean(token.value))

  async function login(payload: LoginPayload) {
    try {
      isLoading.value = true
      errorMessage.value = null

      console.log('🔐 Auth: Attempting login with:', payload)
      console.log('🔐 Auth: API base URL:', api.defaults.baseURL)
      console.log('🔐 Auth: Making request to /auth/login')

      const { data } = await api.post('/auth/login', payload)
      
      console.log('🔐 Auth: Login response received:', data)
      
      // Handle mock or real API response
      if (data?.errors) {
        const first = Array.isArray(data.errors?.email) ? data.errors.email[0] : undefined
        throw { response: { data: { message: first || 'Invalid credentials' } } }
      }

      const accessToken = data?.tokens?.access_token || data?.accessToken || 'dev-token'
      token.value = accessToken
      user.value = data?.userData || null

      if (typeof localStorage !== 'undefined') localStorage.setItem('token', accessToken)

      console.log('🔐 Auth: Login successful, token stored:', accessToken)
      return { success: true }
    } catch (err: any) {
      console.error('🔐 Auth: Login error:', err)
      console.error('🔐 Auth: Error response:', err?.response)
      errorMessage.value = err?.response?.data?.message || err?.response?.data?.error || 'Login failed'
      return { success: false, error: errorMessage.value }
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      await api.post('/auth/logout')
    } catch (_e) {
      // Ignore mock errors
    }
    token.value = null
    user.value = null
    if (typeof localStorage !== 'undefined') localStorage.removeItem('token')
  }

  return {
    token,
    user,
    isLoading,
    errorMessage,
    isAuthenticated,
    login,
    logout,
  }
})


