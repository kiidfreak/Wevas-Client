<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">SMS Inbox</h1>
        <p class="text-gray-600">View and manage incoming SMS messages</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Messages</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalStats.totalMessages.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Unread</p>
              <p class="text-2xl font-bold text-yellow-600">{{ totalStats.unread.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Today</p>
              <p class="text-2xl font-bold text-green-600">{{ totalStats.today.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Spam</p>
              <p class="text-2xl font-bold text-red-600">{{ totalStats.spam.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"></path>
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
              @click="showComposeModal = true"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              Compose Reply
            </button>
            <button 
              @click="exportMessages"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
              Export
            </button>
            <button 
              @click="markAllAsRead"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Mark All Read
            </button>
          </div>
          
          <div class="flex items-center space-x-3">
            <input 
              v-model="searchQuery"
              @input="handleSearch"
              type="text" 
              placeholder="Search messages..." 
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <select 
              v-model="statusFilter"
              @change="handleFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="spam">Spam</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Messages List -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="divide-y divide-gray-200">
          <div 
            v-for="message in paginatedMessages" 
            :key="message.id" 
            class="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
            @click="selectMessage(message)"
          >
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-gray-700">{{ message.sender.charAt(0).toUpperCase() }}</span>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <p class="text-sm font-medium text-gray-900">{{ message.sender }}</p>
                    <span class="text-sm text-gray-500">{{ message.phoneNumber }}</span>
                    <span v-if="message.isUnread" class="w-2 h-2 bg-blue-500 rounded-full"></span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-500">{{ message.time }}</span>
                    <div class="flex items-center space-x-1">
                      <button 
                        @click.stop="replyToMessage(message)"
                        class="text-blue-600 hover:text-blue-900 transition-colors p-1"
                        title="Reply"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
                        </svg>
                      </button>
                      <button 
                        @click.stop="forwardMessage(message)"
                        class="text-green-600 hover:text-green-900 transition-colors p-1"
                        title="Forward"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                      </button>
                      <button 
                        @click.stop="deleteMessage(message)"
                        class="text-red-600 hover:text-red-900 transition-colors p-1"
                        title="Delete"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                      <button 
                        @click.stop="toggleMessageRead(message)"
                        class="text-gray-600 hover:text-gray-900 transition-colors p-1"
                        :title="message.isUnread ? 'Mark as read' : 'Mark as unread'"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path v-if="message.isUnread" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="mt-2">
                  <p class="text-sm text-gray-900">{{ message.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div class="bg-white px-6 py-3 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredMessages.length }} results
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

    <!-- Compose Reply Modal -->
    <div v-if="showComposeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Compose Reply</h3>
        <form @submit.prevent="sendReply">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input 
                v-model="replyData.to"
                type="tel" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1234567890"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea 
                v-model="replyData.message"
                rows="4"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your reply message..."
              ></textarea>
              <div class="text-xs text-gray-500 mt-1">
                {{ replyData.message.length }}/160 characters
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end space-x-3 mt-6">
            <button 
              type="button"
              @click="showComposeModal = false"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="isSending"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ isSending ? 'Sending...' : 'Send Reply' }}
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Sender</label>
            <p class="text-gray-900">{{ selectedMessage.sender }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <p class="text-gray-900">{{ selectedMessage.phoneNumber }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <p class="text-gray-900">{{ selectedMessage.content }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <p class="text-gray-900">{{ selectedMessage.time }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <span :class="selectedMessage.isUnread ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
              {{ selectedMessage.isUnread ? 'Unread' : 'Read' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Message {
  id: number
  sender: string
  phoneNumber: string
  content: string
  time: string
  isUnread: boolean
  isSpam: boolean
}

interface ReplyData {
  to: string
  message: string
}

const messages = ref<Message[]>([
  {
    id: 1,
    sender: 'John Smith',
    phoneNumber: '+1234567890',
    content: 'Hi! I received your SMS about the new product launch. Can you tell me more about the pricing?',
    time: '2 minutes ago',
    isUnread: true,
    isSpam: false
  },
  {
    id: 2,
    sender: 'Sarah Johnson',
    phoneNumber: '+1987654321',
    content: 'Thank you for the verification code. My account is now active!',
    time: '15 minutes ago',
    isUnread: true,
    isSpam: false
  },
  {
    id: 3,
    sender: 'Mike Wilson',
    phoneNumber: '+1555666777',
    content: 'Your delivery will arrive today between 3-5 PM. Please ensure someone is available to receive it.',
    time: '1 hour ago',
    isUnread: false,
    isSpam: false
  },
  {
    id: 4,
    sender: 'Emma Davis',
    phoneNumber: '+1888999000',
    content: 'I love the new features! The app is working perfectly now.',
    time: '2 hours ago',
    isUnread: false,
    isSpam: false
  },
  {
    id: 5,
    sender: 'David Brown',
    phoneNumber: '+1444333222',
    content: 'Can you help me reset my password? I\'m having trouble logging in.',
    time: '3 hours ago',
    isUnread: true,
    isSpam: false
  },
  {
    id: 6,
    sender: 'Lisa Anderson',
    phoneNumber: '+1777888999',
    content: 'Your appointment is confirmed for tomorrow at 2 PM. See you then!',
    time: '4 hours ago',
    isUnread: false,
    isSpam: false
  },
  {
    id: 7,
    sender: 'Spam Bot',
    phoneNumber: '+1111111111',
    content: 'CONGRATULATIONS! You\'ve won $1,000,000! Click here to claim your prize!',
    time: '5 hours ago',
    isUnread: false,
    isSpam: true
  }
])

// Reactive state
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(5)
const showComposeModal = ref(false)
const selectedMessage = ref<Message | null>(null)
const isSending = ref(false)

const replyData = ref<ReplyData>({
  to: '',
  message: ''
})

// Computed properties
const filteredMessages = computed(() => {
  let filtered = messages.value

  if (searchQuery.value) {
    filtered = filtered.filter(message => 
      message.sender.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      message.phoneNumber.includes(searchQuery.value) ||
      message.content.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    if (statusFilter.value === 'unread') {
      filtered = filtered.filter(message => message.isUnread)
    } else if (statusFilter.value === 'read') {
      filtered = filtered.filter(message => !message.isUnread)
    } else if (statusFilter.value === 'spam') {
      filtered = filtered.filter(message => message.isSpam)
    }
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
    acc.totalMessages++
    if (message.isUnread) acc.unread++
    if (message.isSpam) acc.spam++
    
    // Check if message is from today (simplified logic)
    if (message.time.includes('minutes ago') || message.time.includes('hour ago')) {
      acc.today++
    }
    
    return acc
  }, { totalMessages: 0, unread: 0, today: 0, spam: 0 })
  
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

const exportMessages = () => {
  const csvContent = generateCSV(filteredMessages.value)
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `sms-inbox-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

const generateCSV = (data: Message[]) => {
  const headers = ['Sender', 'Phone Number', 'Content', 'Time', 'Status']
  const rows = data.map(message => [
    message.sender,
    message.phoneNumber,
    message.content,
    message.time,
    message.isUnread ? 'Unread' : 'Read'
  ])
  
  return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n')
}

const markAllAsRead = () => {
  if (confirm('Mark all messages as read?')) {
    messages.value.forEach(message => {
      message.isUnread = false
    })
    alert('All messages marked as read!')
  }
}

const selectMessage = (message: Message) => {
  selectedMessage.value = message
  if (message.isUnread) {
    message.isUnread = false
  }
}

const replyToMessage = (message: Message) => {
  replyData.value.to = message.phoneNumber
  showComposeModal.value = true
}

const forwardMessage = (message: Message) => {
  const forwardData = prompt('Enter phone number to forward to:', '')
  if (forwardData) {
    alert(`Message forwarded to ${forwardData}`)
  }
}

const deleteMessage = (message: Message) => {
  if (confirm(`Delete message from ${message.sender}?`)) {
    const index = messages.value.findIndex(m => m.id === message.id)
    if (index > -1) {
      messages.value.splice(index, 1)
      if (selectedMessage.value?.id === message.id) {
        selectedMessage.value = null
      }
      alert('Message deleted!')
    }
  }
}

const toggleMessageRead = (message: Message) => {
  message.isUnread = !message.isUnread
}

const sendReply = async () => {
  isSending.value = true
  
  // Simulate sending
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Add reply to messages (simulating sent message)
  const replyMessage: Message = {
    id: Date.now(),
    sender: 'You',
    phoneNumber: replyData.value.to,
    content: replyData.value.message,
    time: 'Just now',
    isUnread: false,
    isSpam: false
  }
  
  messages.value.unshift(replyMessage)
  showComposeModal.value = false
  
  // Reset form
  replyData.value = {
    to: '',
    message: ''
  }
  
  alert('Reply sent successfully!')
  isSending.value = false
}

// Reset to first page when filters change
onMounted(() => {
  currentPage.value = 1
})
</script>
