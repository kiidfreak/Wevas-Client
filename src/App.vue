<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Modern Sidebar Navigation -->
    <div class="flex h-screen">
      <!-- Mobile Sidebar Overlay -->
      <div 
        v-if="$route.name !== 'login' && isSidebarOpen" 
        class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
        @click="toggleSidebar"
      ></div>
      
      <!-- Sidebar -->
      <aside 
        v-if="$route.name !== 'login'" 
        :class="[
          'fixed inset-y-0 left-0 z-50 bg-white shadow-lg border-r border-gray-200 transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          isCollapsed ? 'w-16' : 'w-64'
        ]"
      >
        <!-- Logo Section -->
        <div :class="[
          'border-b border-gray-200 flex-shrink-0',
          isCollapsed ? 'p-4' : 'p-6'
        ]">
          <div class="flex items-center justify-between">
            <div class="flex items-center" :class="{ 'justify-center': isCollapsed }">
              <!-- Small Logo Icon (always visible) -->
              <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <!-- Text (hidden when collapsed) -->
              <div v-show="!isCollapsed" class="ml-3">
                <h1 class="text-xl font-bold text-gray-900">Wevas</h1>
                <p class="text-sm text-gray-500">Next-Gen SMS Platform</p>
              </div>
            </div>
            <!-- Collapse Button -->
            <button 
              v-show="!isCollapsed"
              @click="toggleCollapse"
              class="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              title="Collapse Sidebar"
            >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7m-6-7l7-7"></path>
            </svg>
            </button>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav :class="[
          'flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100',
          isCollapsed ? 'p-2' : 'p-4'
        ]">
          <!-- DASHBOARD -->
          <div v-show="!isCollapsed" class="nav-section-header">
            <span>DASHBOARD</span>
          </div>
          <RouterLink to="/usage" class="nav-item" active-class="active" :class="{ 'justify-center': isCollapsed, 'px-2': isCollapsed }">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span v-show="!isCollapsed">Usage Statistics</span>
          </RouterLink>

          <!-- ADDRESS BOOKS -->
          <div v-show="!isCollapsed" class="nav-section-header">
            <span>ADDRESS BOOKS</span>
          </div>
          <RouterLink to="/address-books-groups-list" class="nav-item" active-class="active" :class="{ 'justify-center': isCollapsed, 'px-2': isCollapsed }">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <span v-show="!isCollapsed">Contact Groups</span>
          </RouterLink>

          <!-- BULK CAMPAIGNS -->
          <div v-show="!isCollapsed" class="nav-section-header">
            <span>BULK CAMPAIGNS</span>
          </div>
          <div class="space-y-1">
            <div 
              class="nav-group-header" 
              @click="toggleSection('campaigns')"
              :class="{ 
                'bg-gray-50': openSections.campaigns,
                'justify-center': isCollapsed,
                'px-2': isCollapsed
              }"
            >
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <span v-show="!isCollapsed">Campaigns</span>
              </div>
              <svg 
                v-show="!isCollapsed"
                class="w-4 h-4 transform transition-transform" 
                :class="{ 'rotate-180': openSections.campaigns }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            <div v-show="openSections.campaigns && !isCollapsed" class="space-y-1 transition-all duration-200">
              <RouterLink to="/bulk-campaigns" class="nav-item sub-item" active-class="active">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                <span>SMS</span>
              </RouterLink>
              <RouterLink to="/misc-coming-soon" class="nav-item sub-item" active-class="active">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <span>Email</span>
                <span class="tag tag-warning">Soon</span>
              </RouterLink>
              <RouterLink to="/misc-coming-soon" class="nav-item sub-item" active-class="active">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <span>Whatsapp</span>
                <span class="tag tag-warning">Soon</span>
              </RouterLink>
            </div>
          </div>

          <!-- MESSAGE OUTBOX -->
          <div v-show="!isCollapsed" class="nav-section-header">
            <span>MESSAGE OUTBOX</span>
          </div>
          <div class="space-y-1">
            <div 
              class="nav-group-header" 
              @click="toggleSection('outbox')"
              :class="{ 
                'bg-gray-50': openSections.outbox,
                'justify-center': isCollapsed,
                'px-2': isCollapsed
              }"
            >
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
                <span v-show="!isCollapsed">SMS Outbox</span>
              </div>
              <svg 
                v-show="!isCollapsed"
                class="w-4 h-4 transform transition-transform" 
                :class="{ 'rotate-180': openSections.outbox }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            <div v-show="openSections.outbox && !isCollapsed" class="space-y-1 transition-all duration-200">
              <RouterLink to="/outbox" class="nav-item sub-item" active-class="active">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                <span>Bulk Outbox</span>
              </RouterLink>
              <RouterLink to="/api-outbox" class="nav-item sub-item" active-class="active">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                <span>API Outbox</span>
              </RouterLink>
            </div>
          </div>

          <!-- SHORT CODES -->
          <div v-show="!isCollapsed" class="nav-section-header">
            <span>SHORT CODES</span>
          </div>
          <div class="space-y-1">
            <div 
              class="nav-group-header" 
              @click="toggleSection('premium')"
              :class="{ 
                'bg-gray-50': openSections.premium,
                'justify-center': isCollapsed,
                'px-2': isCollapsed
              }"
            >
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
                <span v-show="!isCollapsed">Premium SMS</span>
              </div>
              <svg 
                v-show="!isCollapsed"
                class="w-4 h-4 transform transition-transform" 
                :class="{ 'rotate-180': openSections.premium }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            <div v-show="openSections.premium && !isCollapsed" class="space-y-1 transition-all duration-200">
              <RouterLink to="/premium-inbox" class="nav-item sub-item" active-class="active">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                <span>Inbox</span>
              </RouterLink>
              <RouterLink to="/premium-outbox" class="nav-item sub-item" active-class="active">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                <span>Outbox</span>
              </RouterLink>
            </div>
          </div>

          <!-- SENDERS & STOP LIST -->
          <div v-show="!isCollapsed" class="nav-section-header">
            <span>SENDERS & STOP LIST</span>
          </div>
          <RouterLink to="/senders" class="nav-item" active-class="active" :class="{ 'justify-center': isCollapsed, 'px-2': isCollapsed }">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
            </svg>
            <span v-show="!isCollapsed">Senders</span>
          </RouterLink>
          <RouterLink to="/stoplist" class="nav-item" active-class="active" :class="{ 'justify-center': isCollapsed, 'px-2': isCollapsed }">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span v-show="!isCollapsed">Stop List</span>
          </RouterLink>

          <!-- BULK TOPUPS -->
          <div v-show="!isCollapsed" class="nav-section-header">
            <span>BULK TOPUPS</span>
          </div>
          <RouterLink to="/bulk-topups" class="nav-item" active-class="active" :class="{ 'justify-center': isCollapsed, 'px-2': isCollapsed }">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
            <span v-show="!isCollapsed">Topups</span>
          </RouterLink>
          <RouterLink to="/transactions" class="nav-item" active-class="active" :class="{ 'justify-center': isCollapsed, 'px-2': isCollapsed }">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
            </svg>
            <span v-show="!isCollapsed">Transactions</span>
          </RouterLink>

          <!-- API SETTINGS -->
          <div v-show="!isCollapsed" class="nav-section-header">
            <span>API SETTINGS</span>
          </div>
          <RouterLink to="/api-keys" class="nav-item" active-class="active" :class="{ 'justify-center': isCollapsed, 'px-2': isCollapsed }">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            <span v-show="!isCollapsed">API Keys</span>
          </RouterLink>
        </nav>

        <!-- Bottom Expand Button (when collapsed) -->
        <div v-if="isCollapsed" class="p-2 border-t border-gray-200 flex-shrink-0">
          <button 
            @click="toggleCollapse"
            class="w-full p-3 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center"
            title="Expand Sidebar"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </aside>

              <!-- Main Content Area -->
        <main class="flex-1 flex flex-col overflow-hidden">
          <!-- Top Header Bar -->
          <header v-if="$route.name !== 'login'" class="bg-white border-b border-gray-200 px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <!-- Mobile Menu Button -->
                <button 
                  @click="toggleSidebar"
                  class="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </button>
                
                <h2 class="text-2xl font-bold text-gray-900">{{ $route.meta?.title || 'Dashboard' }}</h2>
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span class="text-sm text-gray-600">System Online</span>
                </div>
              </div>
            
            <div class="flex items-center space-x-4">
              <!-- Search Bar -->
              <div class="relative search-container">
                <input 
                  v-model="searchQuery"
                  type="text" 
                  placeholder="Search..." 
                  class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  @input="handleSearch"
                  @keyup.enter="performSearch"
                >
                <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <!-- Search Results Dropdown -->
                <div v-if="searchResults.length > 0 && searchQuery" class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  <div v-for="result in searchResults" :key="result.id" class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="result.icon"></path>
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ result.title }}</p>
                        <p class="text-xs text-gray-500">{{ result.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Notifications -->
              <button class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              <!-- User Profile with Logout -->
              <div class="relative group profile-menu-container">
                <button @click="toggleProfileMenu" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <div class="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div class="hidden md:block text-left">
                    <p class="text-sm font-medium text-gray-900">Admin User</p>
                    <p class="text-xs text-gray-500">admin@wevas.com</p>
                  </div>
                  <svg class="w-4 h-4 text-gray-400 transform transition-transform" :class="{ 'rotate-180': showProfileMenu }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                <!-- Profile Dropdown Menu -->
                <div v-if="showProfileMenu" class="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div class="py-2">
                    <button @click="handleLogout" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <div class="flex items-center space-x-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <!-- Main Content -->
        <div class="flex-1 overflow-auto p-6">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Define search result type
interface SearchResult {
  id: number
  title: string
  description: string
  icon: string
}

const router = useRouter()

// Reactive state for collapsible sections
const openSections = ref({
  campaigns: true,
  outbox: true,
  premium: true
})

// Toggle section visibility
const toggleSection = (section: keyof typeof openSections.value) => {
  openSections.value[section] = !openSections.value[section]
}

// Responsive sidebar state
const isSidebarOpen = ref(true)
const isCollapsed = ref(false)

// Toggle sidebar on mobile
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// Toggle sidebar collapse (icons only)
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

// Search functionality
const searchQuery = ref('')
const searchResults = ref<SearchResult[]>([])

const handleSearch = () => {
  if (searchQuery.value.trim().length < 2) {
    searchResults.value = []
    return
  }
  
  // Mock search results - replace with actual search logic
  searchResults.value = [
    {
      id: 1,
      title: 'SMS Campaigns',
      description: 'Manage your SMS campaigns',
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
    },
    {
      id: 2,
      title: 'Contact Groups',
      description: 'Manage your contact lists',
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
    },
    {
      id: 3,
      title: 'Usage Statistics',
      description: 'View your platform usage',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  ]
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Searching for:', searchQuery.value)
    // Add your search logic here
    // For now, just log the search query
  }
}

// Profile menu functionality
const showProfileMenu = ref(false)

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const handleLogout = () => {
  // Clear authentication state
  const authStore = useAuthStore()
  authStore.logout()
  
  // Close profile menu
  showProfileMenu.value = false
  
  // Redirect to login
  router.push('/login')
}

onMounted(() => {
  console.log('🚀 Wevas Next-Gen SMS Platform is running!')
  console.log('✨ Modern UI with Vue 3 + TypeScript + Tailwind CSS')
  
  // Close menus when clicking outside
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    
    // Close profile menu if clicking outside
    if (!target.closest('.profile-menu-container')) {
      showProfileMenu.value = false
    }
    
    // Close search results if clicking outside
    if (!target.closest('.search-container')) {
      searchResults.value = []
    }
  })
})
</script>

<style scoped>
/* Navigation Styles */
.nav-item {
  @apply flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900;
}

.nav-item.active {
  @apply bg-blue-50 text-blue-700 border-r-2 border-blue-600;
}

.nav-item.sub-item {
  @apply ml-6 text-sm;
}

.nav-section-header {
  @apply px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider;
}

.nav-group-header {
  @apply flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 rounded-lg transition-all duration-200;
}

.tag {
  @apply inline-flex items-center px-2 py-1 text-xs font-medium rounded-full;
}

.tag-warning {
  @apply bg-orange-100 text-orange-800;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .sidebar-overlay {
    @apply block;
  }
}

/* Smooth transitions */
* {
  transition: all 0.2s ease-in-out;
}

/* Collapsible animations */
.nav-group-content {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .nav-item {
    @apply py-3;
  }
  
  .nav-section-header {
    @apply py-3;
  }
  
  .nav-group-header {
    @apply py-3;
  }
}

/* Collapsed state styles */
.nav-item.justify-center {
  justify-content: center;
  gap: 0;
}

.nav-group-header.justify-center {
  justify-content: center;
}

/* Clean collapsed UI */
.nav-item.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.nav-group-header.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

/* Icon-only mode styling */
.nav-item.justify-center svg {
  margin-left: auto;
  margin-right: auto;
}

.nav-group-header.justify-center svg {
  margin-left: auto;
  margin-right: auto;
}

/* Custom scrollbar */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 6px;
}

.scrollbar-track-gray-100::-webkit-scrollbar-track {
  background-color: #f3f4f6;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
</style>
