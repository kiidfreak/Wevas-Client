<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Bulk Outbox</h1>
        <p class="text-gray-600">Manage and monitor your bulk SMS campaigns</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Sent</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalStats.totalSent.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Delivered</p>
              <p class="text-2xl font-bold text-green-600">{{ totalStats.delivered.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Failed</p>
              <p class="text-2xl font-bold text-red-600">{{ totalStats.failed.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Pending</p>
              <p class="text-2xl font-bold text-yellow-600">{{ totalStats.pending.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions Bar -->
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="flex items-center space-x-4">
            <button 
              @click="showNewCampaignModal = true"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              New Campaign
            </button>
            <button 
              @click="exportData"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
              Export
            </button>
          </div>
          
          <div class="flex items-center space-x-3">
            <input 
              v-model="searchQuery"
              @input="handleSearch"
              type="text" 
              placeholder="Search campaigns..." 
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <select 
              v-model="statusFilter"
              @change="handleFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Campaigns Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="campaign in paginatedCampaigns" :key="campaign.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ campaign.name }}</div>
                    <div class="text-sm text-gray-500">{{ campaign.description }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(campaign.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ campaign.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ campaign.recipients.toLocaleString() }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ campaign.sent.toLocaleString() }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ campaign.created }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="viewCampaign(campaign)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                      title="View Details"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                    <button 
                      @click="editCampaign(campaign)"
                      class="text-green-600 hover:text-green-900 transition-colors"
                      title="Edit Campaign"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button 
                      @click="deleteCampaign(campaign)"
                      class="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete Campaign"
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
        <div class="bg-white px-6 py-3 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredCampaigns.length }} results
            </div>
            <div class="flex items-center space-x-2">
              <button 
                @click="previousPage"
                :disabled="currentPage === 1"
                class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span class="px-3 py-1 text-sm text-gray-700">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <button 
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Campaign Modal -->
    <div v-if="showNewCampaignModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Create New Campaign</h3>
        <form @submit.prevent="createCampaign">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
              <input 
                v-model="newCampaign.name"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter campaign name"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                v-model="newCampaign.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter campaign description"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea 
                v-model="newCampaign.message"
                rows="3"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter SMS message"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
              <input 
                v-model.number="newCampaign.recipients"
                type="number" 
                required
                min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Number of recipients"
              >
            </div>
          </div>
          <div class="flex items-center justify-end space-x-3 mt-6">
            <button 
              type="button"
              @click="showNewCampaignModal = false"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Campaign
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Campaign Details Modal -->
    <div v-if="selectedCampaign" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Campaign Details</h3>
          <button 
            @click="selectedCampaign = null"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
            <p class="text-gray-900">{{ selectedCampaign.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <p class="text-gray-900">{{ selectedCampaign.description }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <span :class="getStatusClass(selectedCampaign.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
              {{ selectedCampaign.status }}
            </span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
              <p class="text-gray-900">{{ selectedCampaign.recipients.toLocaleString() }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sent</label>
              <p class="text-gray-900">{{ selectedCampaign.sent.toLocaleString() }}</p>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Created</label>
            <p class="text-gray-900">{{ selectedCampaign.created }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Campaign Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Edit Campaign</h3>
        <form @submit.prevent="updateCampaign">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
              <input 
                v-model="editingCampaign!.name"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter campaign name"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                v-model="editingCampaign!.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter campaign description"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea 
                v-model="editingCampaign!.message"
                rows="3"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter SMS message"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
              <input 
                v-model.number="editingCampaign!.recipients"
                type="number" 
                required
                min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Number of recipients"
              >
            </div>
          </div>
          <div class="flex items-center justify-end space-x-3 mt-6">
            <button 
              type="button"
              @click="showEditModal = false"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Campaign {
  id: number
  name: string
  description: string
  status: 'delivered' | 'failed' | 'pending'
  recipients: number
  sent: number
  created: string
  message?: string
}

interface NewCampaign {
  name: string
  description: string
  message: string
  recipients: number
}

interface EditingCampaign {
  id: number
  name: string
  description: string
  status: 'delivered' | 'failed' | 'pending'
  recipients: number
  sent: number
  created: string
  message: string // Always a string when editing
}

const campaigns = ref<Campaign[]>([
  {
    id: 1,
    name: 'Holiday Special',
    description: 'Festive season promotions',
    status: 'delivered',
    recipients: 75000,
    sent: 74850,
    created: '20/08/2024',
    message: '🎉 Happy Holidays! Get 20% off on all products. Limited time offer!'
  },
  {
    id: 2,
    name: 'Summer Sale 2024',
    description: 'Promotional campaign for summer products',
    status: 'delivered',
    recipients: 50000,
    sent: 48750,
    created: '15/08/2024',
    message: '☀️ Summer Sale is here! Up to 50% off on selected items. Shop now!'
  },
  {
    id: 3,
    name: 'Welcome Series',
    description: 'New customer onboarding sequence',
    status: 'pending',
    recipients: 2500,
    sent: 0,
    created: '10/08/2024',
    message: '👋 Welcome to Wevas! We\'re excited to have you on board.'
  },
  {
    id: 4,
    name: 'Flash Sale Alert',
    description: '24-hour flash sale notification',
    status: 'failed',
    recipients: 15000,
    sent: 12000,
    created: '05/08/2024',
    message: '⚡ Flash Sale! 70% off for next 24 hours only!'
  },
  {
    id: 5,
    name: 'Product Launch',
    description: 'New product announcement',
    status: 'delivered',
    recipients: 30000,
    sent: 29850,
    created: '01/08/2024',
    message: '🚀 New Product Launch! Be the first to try our latest innovation.'
  },
  {
    id: 6,
    name: 'Customer Feedback',
    description: 'Request for product reviews',
    status: 'pending',
    recipients: 8000,
    sent: 0,
    created: '28/07/2024',
    message: '📝 We value your opinion! Please share your feedback about our service.'
  }
])

// Reactive state
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(5)
const showNewCampaignModal = ref(false)
const showEditModal = ref(false)
const selectedCampaign = ref<Campaign | null>(null)
const editingCampaign = ref<EditingCampaign | null>(null)
const newCampaign = ref<NewCampaign>({
  name: '',
  description: '',
  message: '',
  recipients: 0
})

// Computed properties
const filteredCampaigns = computed(() => {
  let filtered = campaigns.value

  if (searchQuery.value) {
    filtered = filtered.filter(campaign => 
      campaign.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(campaign => campaign.status === statusFilter.value)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredCampaigns.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredCampaigns.value.length))

const paginatedCampaigns = computed(() => {
  return filteredCampaigns.value.slice(startIndex.value, endIndex.value)
})

const totalStats = computed(() => {
  const total = campaigns.value.reduce((acc, campaign) => {
    acc.totalSent += campaign.sent
    if (campaign.status === 'delivered') acc.delivered += campaign.sent
    if (campaign.status === 'failed') acc.failed += campaign.sent
    if (campaign.status === 'pending') acc.pending += campaign.recipients - campaign.sent
    return acc
  }, { totalSent: 0, delivered: 0, failed: 0, pending: 0 })
  
  return total
})

// Methods
const handleSearch = () => {
  currentPage.value = 1
}

const handleFilter = () => {
  currentPage.value = 1
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const exportData = () => {
  const csvContent = generateCSV(filteredCampaigns.value)
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `bulk-outbox-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

const generateCSV = (data: Campaign[]) => {
  const headers = ['Campaign Name', 'Description', 'Status', 'Recipients', 'Sent', 'Created']
  const rows = data.map(campaign => [
    campaign.name,
    campaign.description,
    campaign.status,
    campaign.recipients,
    campaign.sent,
    campaign.created
  ])
  
  return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n')
}

const createCampaign = () => {
  const campaign: Campaign = {
    id: Date.now(),
    name: newCampaign.value.name,
    description: newCampaign.value.description,
    message: newCampaign.value.message,
    status: 'pending',
    recipients: newCampaign.value.recipients,
    sent: 0,
    created: new Date().toLocaleDateString()
  }
  
  campaigns.value.unshift(campaign)
  showNewCampaignModal.value = false
  
  // Reset form
  newCampaign.value = {
    name: '',
    description: '',
    message: '',
    recipients: 0
  }
  
  // Show success message (you can implement a toast notification system)
  alert('Campaign created successfully!')
}

const viewCampaign = (campaign: Campaign) => {
  selectedCampaign.value = campaign
}

const editCampaign = (campaign: Campaign) => {
  editingCampaign.value = { 
    ...campaign,
    message: campaign.message || '' // Ensure message always has a value
  } as EditingCampaign
  showEditModal.value = true
}

const updateCampaign = () => {
  if (!editingCampaign.value) return
  
  const index = campaigns.value.findIndex(c => c.id === editingCampaign.value!.id)
  if (index > -1) {
    // Convert back to Campaign type (message can be optional)
    const updatedCampaign: Campaign = {
      ...editingCampaign.value,
      message: editingCampaign.value.message
    }
    campaigns.value[index] = updatedCampaign
    showEditModal.value = false
    editingCampaign.value = null
    alert('Campaign updated successfully!')
  }
}

const deleteCampaign = (campaign: Campaign) => {
  if (confirm(`Are you sure you want to delete "${campaign.name}"?`)) {
    const index = campaigns.value.findIndex(c => c.id === campaign.id)
    if (index > -1) {
      campaigns.value.splice(index, 1)
      alert('Campaign deleted successfully!')
    }
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Reset to first page when filters change
onMounted(() => {
  currentPage.value = 1
})
</script>
