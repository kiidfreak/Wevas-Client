<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Senders</h1>
        <p class="text-gray-600">Manage your SMS sender IDs and their approval status</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Senders</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalStats.totalSenders.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Approved</p>
              <p class="text-2xl font-bold text-green-600">{{ totalStats.approved.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
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

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Rejected</p>
              <p class="text-2xl font-bold text-red-600">{{ totalStats.rejected.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
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
              @click="showAddSenderModal = true"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add New Sender
            </button>
            <button 
              @click="showBulkImportModal = true"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              Bulk Import
            </button>
          </div>
          
          <div class="flex items-center space-x-3">
            <input 
              v-model="searchQuery"
              @input="handleSearch"
              type="text" 
              placeholder="Search senders..." 
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <select 
              v-model="statusFilter"
              @change="handleFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Senders Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Messages Sent</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="sender in paginatedSenders" :key="sender.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span class="text-xs font-medium text-gray-700">{{ sender.senderId.charAt(0).toUpperCase() }}</span>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ sender.senderId }}</div>
                      <div class="text-sm text-gray-500">{{ sender.description }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(sender.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ sender.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {{ sender.type }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ sender.created }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ sender.messagesSent.toLocaleString() }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="viewSender(sender)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                      title="View Details"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                    <button 
                      @click="editSender(sender)"
                      class="text-green-600 hover:text-green-900 transition-colors"
                      title="Edit Sender"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button 
                      @click="deleteSender(sender)"
                      class="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete Sender"
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
              Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredSenders.length }} results
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

    <!-- Add New Sender Modal -->
    <div v-if="showAddSenderModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Add New Sender</h3>
        <form @submit.prevent="addSender">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sender ID</label>
              <input 
                v-model="newSender.senderId"
                type="text" 
                required
                maxlength="11"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., WEVAS"
              >
              <div class="text-xs text-gray-500 mt-1">
                Maximum 11 characters, alphanumeric only
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                v-model="newSender.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of this sender ID"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select 
                v-model="newSender.type"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                <option value="Alphanumeric">Alphanumeric</option>
                <option value="Numeric">Numeric</option>
                <option value="Short Code">Short Code</option>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-end space-x-3 mt-6">
            <button 
              type="button"
              @click="showAddSenderModal = false"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="isAdding"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ isAdding ? 'Adding...' : 'Add Sender' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Bulk Import Modal -->
    <div v-if="showBulkImportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Bulk Import Senders</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Upload CSV File</label>
            <input 
              type="file" 
              accept=".csv"
              @change="handleFileUpload"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <div class="text-xs text-gray-500 mt-1">
              CSV should have columns: Sender ID, Description, Type
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Or paste CSV data</label>
            <textarea 
              v-model="bulkImportData"
              rows="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="WEVAS,Wevas Company,Alphanumeric&#10;INFO,Information Service,Alphanumeric"
            ></textarea>
          </div>
        </div>
        <div class="flex items-center justify-end space-x-3 mt-6">
          <button 
            type="button"
            @click="showBulkImportModal = false"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            @click="processBulkImport"
            :disabled="!bulkImportData.trim()"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Import Senders
          </button>
        </div>
      </div>
    </div>

    <!-- Sender Details Modal -->
    <div v-if="selectedSender" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Sender Details</h3>
          <button 
            @click="selectedSender = null"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sender ID</label>
            <p class="text-gray-900 font-mono">{{ selectedSender.senderId }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <p class="text-gray-900">{{ selectedSender.description }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <span :class="getStatusClass(selectedSender.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
              {{ selectedSender.status }}
            </span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <p class="text-gray-900">{{ selectedSender.type }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Created</label>
              <p class="text-gray-900">{{ selectedSender.created }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Messages Sent</label>
              <p class="text-gray-900">{{ selectedSender.messagesSent.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Sender {
  id: number
  senderId: string
  description: string
  status: 'approved' | 'pending' | 'rejected'
  type: string
  created: string
  messagesSent: number
}

interface NewSender {
  senderId: string
  description: string
  type: string
}

const senders = ref<Sender[]>([
  {
    id: 1,
    senderId: 'WEVAS',
    description: 'Wevas Company - Main business sender',
    status: 'approved',
    type: 'Alphanumeric',
    created: '15/01/2024',
    messagesSent: 125000
  },
  {
    id: 2,
    senderId: 'INFO',
    description: 'Information service notifications',
    status: 'approved',
    type: 'Alphanumeric',
    created: '20/02/2024',
    messagesSent: 89000
  },
  {
    id: 3,
    senderId: 'ALERT',
    description: 'Emergency and security alerts',
    status: 'pending',
    type: 'Alphanumeric',
    created: '10/03/2024',
    messagesSent: 0
  },
  {
    id: 4,
    senderId: 'SALES',
    description: 'Sales and promotional messages',
    status: 'approved',
    type: 'Alphanumeric',
    created: '05/04/2024',
    messagesSent: 67000
  },
  {
    id: 5,
    senderId: '12345',
    description: 'Short code for premium services',
    status: 'rejected',
    type: 'Short Code',
    created: '01/05/2024',
    messagesSent: 0
  },
  {
    id: 6,
    senderId: 'SUPPORT',
    description: 'Customer support messages',
    status: 'approved',
    type: 'Alphanumeric',
    created: '12/06/2024',
    messagesSent: 45000
  },
  {
    id: 7,
    senderId: 'NEWS',
    description: 'News and updates',
    status: 'pending',
    type: 'Alphanumeric',
    created: '18/07/2024',
    messagesSent: 0
  }
])

// Reactive state
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(5)
const showAddSenderModal = ref(false)
const showBulkImportModal = ref(false)
const selectedSender = ref<Sender | null>(null)
const isAdding = ref(false)

const newSender = ref<NewSender>({
  senderId: '',
  description: '',
  type: ''
})

const bulkImportData = ref('')

// Computed properties
const filteredSenders = computed(() => {
  let filtered = senders.value

  if (searchQuery.value) {
    filtered = filtered.filter(sender => 
      sender.senderId.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      sender.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(sender => sender.status === statusFilter.value)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredSenders.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredSenders.value.length))

const paginatedSenders = computed(() => {
  return filteredSenders.value.slice(startIndex.value, endIndex.value)
})

const totalStats = computed(() => {
  const total = senders.value.reduce((acc, sender) => {
    acc.totalSenders++
    if (sender.status === 'approved') acc.approved++
    if (sender.status === 'pending') acc.pending++
    if (sender.status === 'rejected') acc.rejected++
    return acc
  }, { totalSenders: 0, approved: 0, pending: 0, rejected: 0 })
  
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

const addSender = async () => {
  isAdding.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const sender: Sender = {
    id: Date.now(),
    senderId: newSender.value.senderId.toUpperCase(),
    description: newSender.value.description,
    status: 'pending',
    type: newSender.value.type,
    created: new Date().toLocaleDateString(),
    messagesSent: 0
  }
  
  senders.value.unshift(sender)
  showAddSenderModal.value = false
  
  // Reset form
  newSender.value = {
    senderId: '',
    description: '',
    type: ''
  }
  
  alert('Sender added successfully! It will be reviewed for approval.')
  isAdding.value = false
}

const viewSender = (sender: Sender) => {
  selectedSender.value = sender
}

const editSender = (sender: Sender) => {
  // For now, just show an alert. You can implement a full edit modal
  alert(`Edit sender: ${sender.senderId}`)
}

const deleteSender = (sender: Sender) => {
  if (confirm(`Delete sender "${sender.senderId}"? This action cannot be undone.`)) {
    const index = senders.value.findIndex(s => s.id === sender.id)
    if (index > -1) {
      senders.value.splice(index, 1)
      if (selectedSender.value?.id === sender.id) {
        selectedSender.value = null
      }
      alert('Sender deleted successfully!')
    }
  }
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      bulkImportData.value = content
    }
    reader.readAsText(file)
  }
}

const processBulkImport = () => {
  if (!bulkImportData.value.trim()) return
  
  const lines = bulkImportData.value.trim().split('\n')
  let added = 0
  
  lines.forEach((line, index) => {
    const [senderId, description, type] = line.split(',').map(s => s.trim())
    if (senderId && description && type) {
      const sender: Sender = {
        id: Date.now() + index,
        senderId: senderId.toUpperCase(),
        description,
        status: 'pending',
        type,
        created: new Date().toLocaleDateString(),
        messagesSent: 0
      }
      senders.value.unshift(sender)
      added++
    }
  })
  
  showBulkImportModal.value = false
  bulkImportData.value = ''
  
  if (added > 0) {
    alert(`${added} senders imported successfully! They will be reviewed for approval.`)
  } else {
    alert('No valid senders found in the data. Please check the format.')
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Reset to first page when filters change
onMounted(() => {
  currentPage.value = 1
})
</script>
