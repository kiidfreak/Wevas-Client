<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Stop List</h1>
        <p class="text-gray-600">Manage blocked phone numbers and opt-out requests</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Blocked</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalStats.totalBlocked.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">This Month</p>
              <p class="text-2xl font-bold text-orange-600">{{ totalStats.thisMonth.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Opt-outs</p>
              <p class="text-2xl font-bold text-blue-600">{{ totalStats.optOuts.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Complaints</p>
              <p class="text-2xl font-bold text-purple-600">{{ totalStats.complaints.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
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
              @click="showAddNumberModal = true"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Number
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
            <button 
              @click="exportStopList"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
              Export List
            </button>
          </div>
          
          <div class="flex items-center space-x-3">
            <input 
              v-model="searchQuery"
              @input="handleSearch"
              type="text" 
              placeholder="Search numbers..." 
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <select 
              v-model="typeFilter"
              @change="handleFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="opt-out">Opt-out</option>
              <option value="complaint">Complaint</option>
              <option value="manual">Manual Block</option>
              <option value="spam">Spam Report</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Stop List Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in paginatedStopList" :key="item.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ item.phoneNumber }}</div>
                      <div class="text-sm text-gray-500">{{ item.country }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getTypeClass(item.type)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ item.type }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="max-w-xs">
                    <p class="text-sm text-gray-900">{{ item.reason }}</p>
                    <p v-if="item.details" class="text-xs text-gray-500 mt-1">{{ item.details }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.dateAdded }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {{ item.source }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="viewStopListItem(item)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                      title="View Details"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                    <button 
                      @click="removeFromStopList(item)"
                      class="text-green-600 hover:text-green-900 transition-colors"
                      title="Remove from Stop List"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </button>
                    <button 
                      @click="deleteStopListItem(item)"
                      class="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete Permanently"
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
              Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredStopList.length }} results
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

    <!-- Add Number Modal -->
    <div v-if="showAddNumberModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Add Number to Stop List</h3>
        <form @submit.prevent="addToStopList">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                v-model="newStopItem.phoneNumber"
                type="tel" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1234567890"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select 
                v-model="newStopItem.type"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                <option value="opt-out">Opt-out</option>
                <option value="complaint">Complaint</option>
                <option value="manual">Manual Block</option>
                <option value="spam">Spam Report</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <input 
                v-model="newStopItem.reason"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief reason for blocking"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Details (Optional)</label>
              <textarea 
                v-model="newStopItem.details"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional details..."
              ></textarea>
            </div>
          </div>
          <div class="flex items-center justify-end space-x-3 mt-6">
            <button 
              type="button"
              @click="showAddNumberModal = false"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="isAdding"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {{ isAdding ? 'Adding...' : 'Add to Stop List' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Bulk Import Modal -->
    <div v-if="showBulkImportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Bulk Import Stop List</h3>
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
              CSV should have columns: Phone Number, Type, Reason, Details
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Or paste CSV data</label>
            <textarea 
              v-model="bulkImportData"
              rows="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+1234567890,opt-out,User requested to stop receiving messages,User complaint&#10;+1987654321,complaint,Spam content,Multiple user reports"
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
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            Import Numbers
          </button>
        </div>
      </div>
    </div>

    <!-- Stop List Item Details Modal -->
    <div v-if="selectedStopItem" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Stop List Item Details</h3>
          <button 
            @click="selectedStopItem = null"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <p class="text-gray-900 font-mono">{{ selectedStopItem.phoneNumber }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <p class="text-gray-900">{{ selectedStopItem.country }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <span :class="getTypeClass(selectedStopItem.type)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
              {{ selectedStopItem.type }}
            </span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <p class="text-gray-900">{{ selectedStopItem.reason }}</p>
          </div>
          <div v-if="selectedStopItem.details">
            <label class="block text-sm font-medium text-gray-700 mb-1">Details</label>
            <p class="text-gray-900">{{ selectedStopItem.details }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date Added</label>
              <p class="text-gray-900">{{ selectedStopItem.dateAdded }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <p class="text-gray-900">{{ selectedStopItem.source }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface StopListItem {
  id: number
  phoneNumber: string
  country: string
  type: 'opt-out' | 'complaint' | 'manual' | 'spam'
  reason: string
  details?: string
  dateAdded: string
  source: string
}

interface NewStopItem {
  phoneNumber: string
  type: string
  reason: string
  details: string
}

const stopList = ref<StopListItem[]>([
  {
    id: 1,
    phoneNumber: '+1234567890',
    country: 'United States',
    type: 'opt-out',
    reason: 'User requested to stop receiving messages',
    details: 'Customer called support to opt out',
    dateAdded: '15/08/2024',
    source: 'Support Ticket'
  },
  {
    id: 2,
    phoneNumber: '+1987654321',
    country: 'United States',
    type: 'complaint',
    reason: 'Spam content reported',
    details: 'Multiple user reports of unwanted messages',
    dateAdded: '12/08/2024',
    source: 'User Report'
  },
  {
    id: 3,
    phoneNumber: '+1555666777',
    country: 'United States',
    type: 'manual',
    reason: 'Compliance requirement',
    details: 'Blocked due to regulatory compliance',
    dateAdded: '10/08/2024',
    source: 'Admin'
  },
  {
    id: 4,
    phoneNumber: '+1888999000',
    country: 'United States',
    type: 'spam',
    reason: 'High bounce rate',
    details: 'Phone number consistently bounces messages',
    dateAdded: '08/08/2024',
    source: 'System'
  },
  {
    id: 5,
    phoneNumber: '+1444333222',
    country: 'United States',
    type: 'opt-out',
    reason: 'Reply with STOP',
    details: 'User replied STOP to opt out',
    dateAdded: '05/08/2024',
    source: 'SMS Reply'
  },
  {
    id: 6,
    phoneNumber: '+1777888999',
    country: 'United States',
    type: 'complaint',
    reason: 'Inappropriate content',
    details: 'User reported inappropriate message content',
    dateAdded: '01/08/2024',
    source: 'User Report'
  },
  {
    id: 7,
    phoneNumber: '+1111111111',
    country: 'United States',
    type: 'spam',
    reason: 'Fake number',
    details: 'Number appears to be fake or invalid',
    dateAdded: '28/07/2024',
    source: 'System'
  }
])

// Reactive state
const searchQuery = ref('')
const typeFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(5)
const showAddNumberModal = ref(false)
const showBulkImportModal = ref(false)
const selectedStopItem = ref<StopListItem | null>(null)
const isAdding = ref(false)

const newStopItem = ref<NewStopItem>({
  phoneNumber: '',
  type: '',
  reason: '',
  details: ''
})

const bulkImportData = ref('')

// Computed properties
const filteredStopList = computed(() => {
  let filtered = stopList.value

  if (searchQuery.value) {
    filtered = filtered.filter(item => 
      item.phoneNumber.includes(searchQuery.value) ||
      item.reason.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.details?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (typeFilter.value) {
    filtered = filtered.filter(item => item.type === typeFilter.value)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredStopList.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredStopList.value.length))

const paginatedStopList = computed(() => {
  return filteredStopList.value.slice(startIndex.value, endIndex.value)
})

const totalStats = computed(() => {
  const total = stopList.value.reduce((acc, item) => {
    acc.totalBlocked++
    
    // Check if added this month (simplified logic)
    if (item.dateAdded.includes('08/2024')) {
      acc.thisMonth++
    }
    
    if (item.type === 'opt-out') acc.optOuts++
    if (item.type === 'complaint') acc.complaints++
    
    return acc
  }, { totalBlocked: 0, thisMonth: 0, optOuts: 0, complaints: 0 })
  
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

const exportStopList = () => {
  const csvContent = generateCSV(filteredStopList.value)
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `stop-list-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

const generateCSV = (data: StopListItem[]) => {
  const headers = ['Phone Number', 'Country', 'Type', 'Reason', 'Details', 'Date Added', 'Source']
  const rows = data.map(item => [
    item.phoneNumber,
    item.country,
    item.type,
    item.reason,
    item.details || '',
    item.dateAdded,
    item.source
  ])
  
  return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n')
}

const addToStopList = async () => {
  isAdding.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const stopItem: StopListItem = {
    id: Date.now(),
    phoneNumber: newStopItem.value.phoneNumber,
    country: 'United States', // Simplified - could be enhanced with phone number validation
    type: newStopItem.value.type as any,
    reason: newStopItem.value.reason,
    details: newStopItem.value.details || undefined,
    dateAdded: new Date().toLocaleDateString(),
    source: 'Manual Entry'
  }
  
  stopList.value.unshift(stopItem)
  showAddNumberModal.value = false
  
  // Reset form
  newStopItem.value = {
    phoneNumber: '',
    type: '',
    reason: '',
    details: ''
  }
  
  alert('Number added to stop list successfully!')
  isAdding.value = false
}

const viewStopListItem = (item: StopListItem) => {
  selectedStopItem.value = item
}

const removeFromStopList = (item: StopListItem) => {
  if (confirm(`Remove ${item.phoneNumber} from stop list?`)) {
    const index = stopList.value.findIndex(i => i.id === item.id)
    if (index > -1) {
      stopList.value.splice(index, 1)
      if (selectedStopItem.value?.id === item.id) {
        selectedStopItem.value = null
      }
      alert('Number removed from stop list successfully!')
    }
  }
}

const deleteStopListItem = (item: StopListItem) => {
  if (confirm(`Permanently delete ${item.phoneNumber} from stop list? This action cannot be undone.`)) {
    const index = stopList.value.findIndex(i => i.id === item.id)
    if (index > -1) {
      stopList.value.splice(index, 1)
      if (selectedStopItem.value?.id === item.id) {
        selectedStopItem.value = null
      }
      alert('Stop list item deleted permanently!')
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
    const [phoneNumber, type, reason, details] = line.split(',').map(s => s.trim())
    if (phoneNumber && type && reason) {
      const stopItem: StopListItem = {
        id: Date.now() + index,
        phoneNumber,
        country: 'United States', // Simplified
        type: type as any,
        reason,
        details: details || undefined,
        dateAdded: new Date().toLocaleDateString(),
        source: 'Bulk Import'
      }
      stopList.value.unshift(stopItem)
      added++
    }
  })
  
  showBulkImportModal.value = false
  bulkImportData.value = ''
  
  if (added > 0) {
    alert(`${added} numbers imported to stop list successfully!`)
  } else {
    alert('No valid numbers found in the data. Please check the format.')
  }
}

const getTypeClass = (type: string) => {
  switch (type) {
    case 'opt-out':
      return 'bg-blue-100 text-blue-800'
    case 'complaint':
      return 'bg-red-100 text-red-800'
    case 'manual':
      return 'bg-gray-100 text-gray-800'
    case 'spam':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Reset to first page when filters change
onMounted(() => {
  currentPage.value = 1
})
</script>
