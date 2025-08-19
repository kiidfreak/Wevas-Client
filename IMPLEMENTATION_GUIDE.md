# 🛠️ Wevas Modernization Implementation Guide

## 🚀 Phase 1: Foundation Setup

### **Step 1: Create New Vite + Vue 3 Project**

```bash
# Create new project
npm create vue@latest wevas-modern -- --typescript --router --pinia --vitest --eslint --prettier

# Navigate to project
cd wevas-modern

# Install dependencies
npm install

# Install additional packages
npm install @headlessui/vue @heroicons/vue tailwindcss @tailwindcss/forms @tailwindcss/typography
npm install chart.js vue-chartjs @vueuse/core axios
npm install -D @types/node
```

### **Step 2: Configure Tailwind CSS**

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### **Step 3: Modern Router Configuration**

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/campaigns',
    name: 'campaigns',
    component: () => import('@/views/campaigns/Campaigns.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/address-books',
    name: 'address-books',
    component: () => import('@/views/address-books/AddressBooks.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guards with modern auth
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
```

### **Step 4: Modern State Management with Pinia**

```typescript
// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials } from '@/types/auth'
import { authApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role || 'user')

  async function login(credentials: LoginCredentials) {
    try {
      isLoading.value = true
      const response = await authApi.login(credentials)
      
      user.value = response.user
      token.value = response.token
      
      // Store in localStorage
      localStorage.setItem('token', response.token)
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  async function checkAuth() {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      try {
        const response = await authApi.me()
        user.value = response.user
        token.value = storedToken
      } catch {
        await logout()
      }
    }
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    userRole,
    login,
    logout,
    checkAuth
  }
})
```

## 🎨 Phase 2: UI/UX Modernization

### **Step 1: Modern Layout Component**

```vue
<!-- src/layouts/DashboardLayout.vue -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
        <img src="@/assets/logo.svg" alt="Wevas" class="h-8 w-auto" />
        <button
          @click="toggleSidebar"
          class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>
      
      <nav class="mt-6 px-3">
        <SidebarNavigation />
      </nav>
    </aside>

    <!-- Main Content -->
    <div :class="[isSidebarOpen ? 'ml-64' : 'ml-0', 'transition-all duration-300 ease-in-out']">
      <!-- Top Navigation -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between h-16 px-6">
          <button
            @click="toggleSidebar"
            class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Bars3Icon class="h-6 w-6" />
          </button>
          
          <div class="flex items-center space-x-4">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import SidebarNavigation from '@/components/layout/SidebarNavigation.vue'
import ThemeToggle from '@/components/layout/ThemeToggle.vue'
import UserMenu from '@/components/layout/UserMenu.vue'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>
```

### **Step 2: Modern Dashboard Component**

```vue
<!-- src/views/Dashboard.vue -->
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Welcome back! Here's what's happening with your campaigns today.
        </p>
      </div>
      
      <div class="mt-4 sm:mt-0">
        <button
          @click="createCampaign"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon class="h-4 w-4 mr-2" />
          New Campaign
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        v-for="stat in stats"
        :key="stat.name"
        :stat="stat"
      />
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Delivery Rate
          </h3>
          <DeliveryRateChart :data="deliveryData" />
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Campaign Performance
          </h3>
          <CampaignPerformanceChart :data="campaignData" />
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          Recent Activity
        </h3>
      </div>
      <RecentActivityTable :activities="recentActivities" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import StatCard from '@/components/dashboard/StatCard.vue'
import DeliveryRateChart from '@/components/charts/DeliveryRateChart.vue'
import CampaignPerformanceChart from '@/components/charts/CampaignPerformanceChart.vue'
import RecentActivityTable from '@/components/dashboard/RecentActivityTable.vue'
import { useDashboardStore } from '@/stores/dashboard'

const router = useRouter()
const dashboardStore = useDashboardStore()

const stats = ref([
  { name: 'Total Campaigns', value: '0', change: '+0%', changeType: 'increase' },
  { name: 'Active Campaigns', value: '0', change: '+0%', changeType: 'increase' },
  { name: 'Total Contacts', value: '0', change: '+0%', changeType: 'increase' },
  { name: 'Delivery Rate', value: '0%', change: '+0%', changeType: 'increase' }
])

const deliveryData = ref([])
const campaignData = ref([])
const recentActivities = ref([])

const createCampaign = () => {
  router.push('/campaigns/new')
}

onMounted(async () => {
  await dashboardStore.fetchDashboardData()
  
  // Update local refs with store data
  stats.value = dashboardStore.stats
  deliveryData.value = dashboardStore.deliveryData
  campaignData.value = dashboardStore.campaignData
  recentActivities.value = dashboardStore.recentActivities
})
</script>
```

### **Step 3: Modern Form Components**

```vue
<!-- src/components/forms/FormInput.vue -->
<template>
  <div>
    <label 
      v-if="label" 
      :for="id" 
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :class="[
          'block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm',
          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
          'dark:bg-gray-700 dark:text-white dark:placeholder-gray-400',
          error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur', $event)"
      />
      
      <div v-if="icon" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <component :is="icon" class="h-5 w-5 text-gray-400" />
      </div>
    </div>
    
    <p v-if="error" class="mt-2 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
    
    <p v-if="helpText" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  modelValue: string
  label?: string
  id?: string
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  helpText?: string
  icon?: Component
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false
})

defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
}>()
</script>
```

## 🔧 Phase 3: Performance & Developer Experience

### **Step 1: Code Splitting & Lazy Loading**

```typescript
// src/router/index.ts - Advanced lazy loading
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { 
      requiresAuth: true,
      preload: true // Preload dashboard for better UX
    }
  },
  {
    path: '/campaigns',
    name: 'campaigns',
    component: () => import('@/views/campaigns/Campaigns.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/campaigns/:id',
    name: 'campaign-detail',
    component: () => import('@/views/campaigns/CampaignDetail.vue'),
    meta: { requiresAuth: true }
  }
]

// Preload critical routes
router.beforeEach((to, from, next) => {
  if (to.meta.preload && to.name !== from.name) {
    // Preload the next route
    const nextRoute = routes.find(route => route.name === to.name)
    if (nextRoute?.component && typeof nextRoute.component === 'function') {
      nextRoute.component()
    }
  }
  next()
})
```

### **Step 2: Modern Testing Setup**

```typescript
// src/components/__tests__/StatCard.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatCard from '../StatCard.vue'

describe('StatCard', () => {
  it('renders stat information correctly', () => {
    const stat = {
      name: 'Total Campaigns',
      value: '25',
      change: '+12%',
      changeType: 'increase' as const
    }

    const wrapper = mount(StatCard, {
      props: { stat }
    })

    expect(wrapper.text()).toContain('Total Campaigns')
    expect(wrapper.text()).toContain('25')
    expect(wrapper.text()).toContain('+12%')
  })

  it('applies correct CSS classes based on change type', () => {
    const stat = {
      name: 'Test',
      value: '100',
      change: '+5%',
      changeType: 'increase' as const
    }

    const wrapper = mount(StatCard, {
      props: { stat }
    })

    const changeElement = wrapper.find('[data-testid="change"]')
    expect(changeElement.classes()).toContain('text-green-600')
  })
})
```

### **Step 3: PWA Configuration**

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.wevas\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          }
        ]
      },
      manifest: {
        name: 'Wevas - Email Marketing Platform',
        short_name: 'Wevas',
        description: 'Modern email marketing platform',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

## 🚀 Phase 4: Advanced Features

### **Step 1: Real-time Updates with WebSockets**

```typescript
// src/composables/useWebSocket.ts
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useWebSocket() {
  const socket = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const messages = ref<any[]>([])
  
  const authStore = useAuthStore()

  const connect = () => {
    const token = authStore.token
    if (!token) return

    socket.value = new WebSocket(`wss://api.wevas.com/ws?token=${token}`)
    
    socket.value.onopen = () => {
      isConnected.value = true
      console.log('WebSocket connected')
    }
    
    socket.value.onmessage = (event) => {
      const data = JSON.parse(event.data)
      messages.value.push(data)
      
      // Handle different message types
      switch (data.type) {
        case 'campaign_update':
          // Update campaign status
          break
        case 'delivery_update':
          // Update delivery statistics
          break
        case 'new_contact':
          // Handle new contact
          break
      }
    }
    
    socket.value.onclose = () => {
      isConnected.value = false
      console.log('WebSocket disconnected')
    }
    
    socket.value.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.close()
      socket.value = null
    }
  }

  const sendMessage = (message: any) => {
    if (socket.value && isConnected.value) {
      socket.value.send(JSON.stringify(message))
    }
  }

  onMounted(() => {
    connect()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    isConnected,
    messages,
    sendMessage
  }
}
```

### **Step 2: Advanced Search with Elasticsearch-like Features**

```typescript
// src/composables/useAdvancedSearch.ts
import { ref, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'

export function useAdvancedSearch<T>(items: Ref<T[]>, searchFields: string[]) {
  const searchQuery = ref('')
  const filters = ref<Record<string, any>>({})
  const sortBy = ref<string>('')
  const sortOrder = ref<'asc' | 'desc'>('asc')
  
  const debouncedSearch = useDebounceFn((query: string) => {
    searchQuery.value = query
  }, 300)

  const filteredItems = computed(() => {
    let result = [...items.value]
    
    // Text search
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(item => 
        searchFields.some(field => {
          const value = getNestedValue(item, field)
          return value?.toString().toLowerCase().includes(query)
        })
      )
    }
    
    // Apply filters
    Object.entries(filters.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        result = result.filter(item => {
          const itemValue = getNestedValue(item, key)
          if (Array.isArray(value)) {
            return value.includes(itemValue)
          }
          return itemValue === value
        })
      }
    })
    
    // Apply sorting
    if (sortBy.value) {
      result.sort((a, b) => {
        const aValue = getNestedValue(a, sortBy.value)
        const bValue = getNestedValue(b, sortBy.value)
        
        if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
        if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
        return 0
      })
    }
    
    return result
  })

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  const updateFilter = (key: string, value: any) => {
    filters.value[key] = value
  }

  const clearFilters = () => {
    filters.value = {}
    searchQuery.value = ''
    sortBy.value = ''
    sortOrder.value = 'asc'
  }

  return {
    searchQuery,
    filters,
    sortBy,
    sortOrder,
    filteredItems,
    debouncedSearch,
    updateFilter,
    clearFilters
  }
}
```

## 📱 Responsive Design Implementation

### **Mobile-First Navigation**

```vue
<!-- src/components/layout/MobileNavigation.vue -->
<template>
  <div class="lg:hidden">
    <!-- Mobile menu button -->
    <button
      @click="isOpen = !isOpen"
      class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <span class="sr-only">Open main menu</span>
      <Bars3Icon v-if="!isOpen" class="h-6 w-6" />
      <XMarkIcon v-else class="h-6 w-6" />
    </button>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-show="isOpen"
        class="absolute top-full left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.href"
            :class="[
              'block px-3 py-2 rounded-md text-base font-medium',
              $route.name === item.name
                ? 'text-primary-700 bg-primary-50 dark:text-primary-300 dark:bg-primary-900/20'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
            ]"
            @click="isOpen = false"
          >
            {{ item.label }}
          </router-link>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const isOpen = ref(false)

const navigationItems = [
  { name: 'dashboard', label: 'Dashboard', href: '/' },
  { name: 'campaigns', label: 'Campaigns', href: '/campaigns' },
  { name: 'address-books', label: 'Address Books', href: '/address-books' },
  { name: 'analytics', label: 'Analytics', href: '/analytics' }
]
</script>
```

## 🔒 Security Implementation

### **JWT Authentication with Refresh Tokens**

```typescript
// src/api/auth.ts
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const authStore = useAuthStore()
        const response = await api.post('/auth/refresh', {
          refreshToken: authStore.refreshToken
        })
        
        authStore.setTokens(response.data.accessToken, response.data.refreshToken)
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, redirect to login
        const authStore = useAuthStore()
        await authStore.logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

export const authApi = {
  login: (credentials: LoginCredentials) => 
    api.post('/auth/login', credentials),
  
  register: (userData: RegisterData) => 
    api.post('/auth/register', userData),
  
  me: () => api.get('/auth/me'),
  
  refresh: (refreshToken: string) => 
    api.post('/auth/refresh', { refreshToken }),
  
  logout: () => api.post('/auth/logout')
}
```

## 📊 Performance Monitoring

### **Web Vitals Tracking**

```typescript
// src/utils/performance.ts
export function trackWebVitals() {
  // Largest Contentful Paint
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      const lcp = entry.startTime
      console.log('LCP:', lcp)
      
      // Send to analytics
      if (lcp > 2500) {
        console.warn('LCP is too slow:', lcp)
      }
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] })

  // First Input Delay
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      const fid = entry.processingStart - entry.startTime
      console.log('FID:', fid)
      
      if (fid > 100) {
        console.warn('FID is too slow:', fid)
      }
    }
  }).observe({ entryTypes: ['first-input'] })

  // Cumulative Layout Shift
  let cls = 0
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        cls += (entry as any).value
        console.log('CLS:', cls)
        
        if (cls > 0.1) {
          console.warn('CLS is too high:', cls)
        }
      }
    }
  }).observe({ entryTypes: ['layout-shift'] })
}
```

---

## 🎯 Next Steps

1. **Start with Phase 1** - Set up the new foundation
2. **Create a parallel development environment** - Don't break the existing system
3. **Implement feature flags** - Gradual rollout of new features
4. **Set up CI/CD pipeline** - Automated testing and deployment
5. **Create comprehensive documentation** - For developers and users
6. **Plan user training** - Smooth transition for existing users

This implementation guide provides a solid foundation for modernizing the Wevas platform while maintaining all existing functionality and significantly improving performance, security, and user experience.
