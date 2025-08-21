<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Premium Outbox</h1>
        <p class="text-gray-600">Manage premium SMS messages and shortcode campaigns</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Premium SMS</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalStats.totalSent.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <p class="text-sm font-medium text-gray-600">Revenue</p>
              <p class="text-2xl font-bold text-yellow-600">KSh {{ totalStats.revenue.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
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
              @click="showNewMessageModal = true"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              New Premium Message
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
              placeholder="Search messages..." 
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
            <select 
              v-model="statusFilter"
              @change="handleFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Messages Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shortcode</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="message in paginatedMessages" :key="message.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ message.title }}</div>
                    <div class="text-sm text-gray-500">{{ message.content }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                    {{ message.shortcode }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ message.recipients.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    getStatusClass(message.status)
                  ]">
                    {{ message.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  KSh {{ message.revenue.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ message.created }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button @click="viewMessage(message)" class="text-blue-600 hover:text-blue-900">View</button>
                    <button @click="editMessage(message)" class="text-green-600 hover:text-green-900">Edit</button>
                    <button @click="deleteMessage(message)" class="text-red-600 hover:text-red-900">Delete</button>
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
                @click="previousPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button 
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing <span class="font-medium">{{ startIndex + 1 }}</span> to <span class="font-medium">{{ endIndex }}</span> of <span class="font-medium">{{ filteredMessages.length }}</span> results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button 
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button 
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Message Modal -->
    <div v-if="showNewMessageModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Create Premium Message</h3>
        <form @submit.prevent="createMessage">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Message Title</label>
              <input 
                v-model="newMessage.title"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter message title"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
              <textarea 
                v-model="newMessage.content"
                rows="3"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter message content"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Shortcode</label>
              <input 
                v-model="newMessage.shortcode"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 12345"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
              <input 
                v-model.number="newMessage.recipients"
                type="number" 
                required
                min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Number of recipients"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Price per SMS (KSh)</label>
              <input 
                v-model.number="newMessage.pricePerSms"
                type="number" 
                required
                min="0.1"
                step="0.1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 2.50"
              >
            </div>
          </div>
          <div class="flex items-center justify-end space-x-3 mt-6">
            <button 
              type="button"
              @click="showNewMessageModal = false"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Create Message
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Message Details Modal -->
    <div v-if="selectedMessage" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Message Details</h3>
          <button 
            @click="selectedMessage = null"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Message Title</label>
            <p class="text-gray-900">{{ selectedMessage.title }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
            <p class="text-gray-900">{{ selectedMessage.content }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Shortcode</label>
            <p class="text-gray-900">{{ selectedMessage.shortcode }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
            <p class="text-gray-900">{{ selectedMessage.recipients.toLocaleString() }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <span :class="[
              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
              getStatusClass(selectedMessage.status)
            ]">
              {{ selectedMessage.status }}
            </span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Revenue</label>
            <p class="text-gray-900">KSh {{ selectedMessage.revenue.toLocaleString() }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Created</label>
            <p class="text-gray-900">{{ selectedMessage.created }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface PremiumMessage {
  id: number
  title: string
  content: string
  shortcode: string
  recipients: number
  status: 'delivered' | 'failed' | 'pending'
  revenue: number
  created: string
  pricePerSms: number
}

interface NewPremiumMessage {
  title: string
  content: string
  shortcode: string
  recipients: number
  pricePerSms: number
}

const messages = ref<PremiumMessage[]>([
  {
    id: 1,
    title: 'Premium News Alert',
    content: 'Breaking: Major announcement coming today at 3 PM. Stay tuned!',
    shortcode: 'NEWS',
    recipients: 15000,
    status: 'delivered',
    revenue: 37500,
    created: '20/08/2024',
    pricePerSms: 2.50
  },
  {
    id: 2,
    title: 'VIP Event Invitation',
    content: 'You\'re invited to our exclusive VIP event this weekend. RSVP now!',
    shortcode: 'VIP',
    recipients: 5000,
    status: 'delivered',
    revenue: 15000,
    created: '18/08/2024',
    pricePerSms: 3.00
  },
  {
    id: 3,
    title: 'Premium Service Update',
    content: 'Your premium service has been upgraded. Enjoy new features!',
    shortcode: 'UPGRADE',
    recipients: 8000,
    status: 'pending',
    revenue: 20000,
    created: '15/08/2024',
    pricePerSms: 2.50
  },
  {
    id: 4,
    title: 'Exclusive Offer',
    content: 'Limited time: 50% off premium products. Use code PREMIUM50',
    shortcode: 'OFFER',
    recipients: 12000,
    status: 'failed',
    revenue: 30000,
    created: '12/08/2024',
    pricePerSms: 2.50
  },
  {
    id: 5,
    title: 'Premium Content Access',
    content: 'Your premium content is ready. Access it now at premium.wevas.com',
    shortcode: 'CONTENT',
    recipients: 3000,
    status: 'delivered',
    revenue: 9000,
    created: '10/08/2024',
    pricePerSms: 3.00
  }
])

// Reactive state
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(5)
const showNewMessageModal = ref(false)
const selectedMessage = ref<PremiumMessage | null>(null)
const newMessage = ref<NewPremiumMessage>({
  title: '',
  content: '',
  shortcode: '',
  recipients: 0,
  pricePerSms: 2.50
})

// Computed properties
const filteredMessages = computed(() => {
  let filtered = messages.value

  if (searchQuery.value) {
    filtered = filtered.filter(message => 
      message.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      message.shortcode.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(message => message.status === statusFilter.value)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredMessages.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredMessages.value.length))

const paginatedMessages = computed(() => {
  return filteredMessages.value.slice(startIndex.value, endIndex.value)
})

const totalStats = computed(() => {
  const total = messages.value.reduce((acc, message) => {
    acc.totalSent += message.recipients
    if (message.status === 'delivered') acc.delivered += message.recipients
    if (message.status === 'failed') acc.failed += message.recipients
    if (message.status === 'pending') acc.pending += message.recipients
    acc.revenue += message.revenue
    return acc
  }, { totalSent: 0, delivered: 0, failed: 0, pending: 0, revenue: 0 })
  
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
  const csvContent = generateCSV(filteredMessages.value)
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `premium-outbox-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

const generateCSV = (data: PremiumMessage[]) => {
  const headers = ['Title', 'Content', 'Shortcode', 'Recipients', 'Status', 'Revenue', 'Created']
  const rows = data.map(message => [
    message.title,
    message.content,
    message.shortcode,
    message.recipients,
    message.status,
    message.revenue,
    message.created
  ])
  
  return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n')
}

const createMessage = () => {
  const message: PremiumMessage = {
    id: Date.now(),
    title: newMessage.value.title,
    content: newMessage.value.content,
    shortcode: newMessage.value.shortcode,
    recipients: newMessage.value.recipients,
    status: 'pending',
    revenue: newMessage.value.recipients * newMessage.value.pricePerSms,
    created: new Date().toLocaleDateString(),
    pricePerSms: newMessage.value.pricePerSms
  }
  
  messages.value.unshift(message)
  showNewMessageModal.value = false
  
  // Reset form
  newMessage.value = {
    title: '',
    content: '',
    shortcode: '',
    recipients: 0,
    pricePerSms: 2.50
  }
  
  alert('Premium message created successfully!')
}

const viewMessage = (message: PremiumMessage) => {
  selectedMessage.value = message
}

const editMessage = (message: PremiumMessage) => {
  alert(`Edit message: ${message.title}`)
}

const deleteMessage = (message: PremiumMessage) => {
  if (confirm(`Are you sure you want to delete "${message.title}"?`)) {
    const index = messages.value.findIndex(m => m.id === message.id)
    if (index > -1) {
      messages.value.splice(index, 1)
      alert('Message deleted successfully!')
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

<style scoped>
.premium-outbox {
  @apply w-full;
}
</style>
