<template>
  <div class="campaign-manager">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Campaign Management</h2>
          <p class="text-gray-600 mt-1">Create, manage, and monitor your SMS campaigns</p>
        </div>
        
        <button 
          @click="showCreateModal = true"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>New Campaign</span>
        </button>
      </div>

      <!-- Stats Row -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-blue-50 rounded-lg">
          <p class="text-2xl font-bold text-blue-600">{{ campaignStats.total }}</p>
          <p class="text-sm text-blue-600">Total Campaigns</p>
        </div>
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <p class="text-2xl font-bold text-green-600">{{ campaignStats.active }}</p>
          <p class="text-sm text-green-600">Active</p>
        </div>
        <div class="text-center p-4 bg-yellow-50 rounded-lg">
          <p class="text-2xl font-bold text-yellow-600">{{ campaignStats.pending }}</p>
          <p class="text-sm text-yellow-600">Pending</p>
        </div>
        <div class="text-center p-4 bg-purple-50 rounded-lg">
          <p class="text-2xl font-bold text-purple-600">{{ campaignStats.completed }}</p>
          <p class="text-sm text-purple-600">Completed</p>
        </div>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div class="flex flex-wrap gap-4">
          <!-- Status Filter -->
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">Status:</label>
            <select 
              v-model="filters.status"
              class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          <!-- Type Filter -->
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">Type:</label>
            <select 
              v-model="filters.type"
              class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="bulk">Bulk Campaign</option>
              <option value="scheduled">Scheduled</option>
              <option value="triggered">Triggered</option>
            </select>
          </div>

          <!-- Date Range -->
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">Date:</label>
            <input 
              type="date" 
              v-model="filters.startDate"
              class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <span class="text-gray-500">to</span>
            <input 
              type="date" 
              v-model="filters.endDate"
              class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
        </div>

        <!-- Search -->
        <div class="relative">
          <input 
            v-model="filters.search"
            type="text" 
            placeholder="Search campaigns..." 
            class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
          <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Campaigns Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th 
                v-for="column in tableColumns"
                :key="column.key"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                @click="sortBy(column.key)"
              >
                <div class="flex items-center space-x-1">
                  <span>{{ column.label }}</span>
                  <svg 
                    v-if="sortKey === column.key"
                    class="w-4 h-4"
                    :class="sortOrder === 'asc' ? 'rotate-180' : ''"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                  </svg>
                </div>
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="campaign in paginatedCampaigns"
              :key="campaign.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ campaign.name }}</div>
                    <div class="text-sm text-gray-500">{{ campaign.description }}</div>
                  </div>
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    statusClasses[campaign.status]
                  ]"
                >
                  {{ campaign.status }}
                </span>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ campaign.type }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ campaign.recipients.toLocaleString() }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ campaign.sent.toLocaleString() }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(campaign.createdAt) }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button 
                    @click="viewCampaign(campaign)"
                    class="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  
                  <button 
                    @click="editCampaign(campaign)"
                    class="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  
                  <button 
                    @click="deleteCampaign(campaign)"
                    class="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button 
              @click="currentPage > 1 && (currentPage--)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button 
              @click="currentPage < totalPages && (currentPage++)"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing 
                <span class="font-medium">{{ startIndex + 1 }}</span>
                to
                <span class="font-medium">{{ endIndex }}</span>
                of
                <span class="font-medium">{{ filteredCampaigns.length }}</span>
                results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button 
                  v-for="page in visiblePages"
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    page === currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Types
interface Campaign {
  id: number
  name: string
  description: string
  status: 'active' | 'pending' | 'completed' | 'paused'
  type: 'bulk' | 'scheduled' | 'triggered'
  recipients: number
  sent: number
  createdAt: string
}

interface Filters {
  status: string
  type: string
  startDate: string
  endDate: string
  search: string
}

// Reactive data
const showCreateModal = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10
const sortKey = ref('createdAt')
const sortOrder = ref<'asc' | 'desc'>('desc')

// Filters
const filters = ref<Filters>({
  status: '',
  type: '',
  startDate: '',
  endDate: '',
  search: ''
})

// Table columns
const tableColumns = [
  { key: 'name', label: 'Campaign' },
  { key: 'status', label: 'Status' },
  { key: 'type', label: 'Type' },
  { key: 'recipients', label: 'Recipients' },
  { key: 'sent', label: 'Sent' },
  { key: 'createdAt', label: 'Created' }
]

// Status classes
const statusClasses = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800',
  paused: 'bg-gray-100 text-gray-800'
}

// Sample data
const campaigns = ref<Campaign[]>([
  {
    id: 1,
    name: 'Summer Sale 2024',
    description: 'Promotional campaign for summer products',
    status: 'active',
    type: 'bulk',
    recipients: 50000,
    sent: 48750,
    createdAt: '2024-08-15'
  },
  {
    id: 2,
    name: 'Welcome Series',
    description: 'New customer onboarding sequence',
    status: 'completed',
    type: 'triggered',
    recipients: 2500,
    sent: 2500,
    createdAt: '2024-08-10'
  },
  {
    id: 3,
    name: 'Holiday Special',
    description: 'Festive season promotions',
    status: 'pending',
    type: 'scheduled',
    recipients: 75000,
    sent: 0,
    createdAt: '2024-08-20'
  }
])

// Computed properties
const campaignStats = computed(() => {
  const total = campaigns.value.length
  const active = campaigns.value.filter(c => c.status === 'active').length
  const pending = campaigns.value.filter(c => c.status === 'pending').length
  const completed = campaigns.value.filter(c => c.status === 'completed').length
  
  return { total, active, pending, completed }
})

const filteredCampaigns = computed(() => {
  let filtered = [...campaigns.value]
  
  if (filters.value.status) {
    filtered = filtered.filter(c => c.status === filters.value.status)
  }
  
  if (filters.value.type) {
    filtered = filtered.filter(c => c.type === filters.value.type)
  }
  
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(search) || 
      c.description.toLowerCase().includes(search)
    )
  }
  
  // Sort
  filtered.sort((a, b) => {
    const aVal = a[sortKey.value as keyof Campaign]
    const bVal = b[sortKey.value as keyof Campaign]
    
    if (sortOrder.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
  
  return filtered
})

const totalPages = computed(() => Math.ceil(filteredCampaigns.value.length / itemsPerPage))

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredCampaigns.value.length))

const paginatedCampaigns = computed(() => {
  return filteredCampaigns.value.slice(startIndex.value, endIndex.value)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const sortBy = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'desc'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const viewCampaign = (campaign: Campaign) => {
  console.log('View campaign:', campaign.id)
}

const editCampaign = (campaign: Campaign) => {
  console.log('Edit campaign:', campaign.id)
}

const deleteCampaign = (campaign: Campaign) => {
  if (confirm(`Are you sure you want to delete "${campaign.name}"?`)) {
    campaigns.value = campaigns.value.filter(c => c.id !== campaign.id)
  }
}

// Lifecycle
onMounted(() => {
  // Load campaigns from API
  console.log('Campaign Manager mounted')
})
</script>

<style scoped>
.campaign-manager {
  @apply w-full;
}

/* Smooth transitions */
* {
  transition: all 0.2s ease-in-out;
}

/* Table hover effects */
tbody tr:hover {
  @apply bg-gray-50;
}

/* Status badge animations */
.status-badge {
  @apply transition-all duration-200;
}

.status-badge:hover {
  @apply transform scale-105;
}
</style>
