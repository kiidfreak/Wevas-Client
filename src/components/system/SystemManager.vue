<template>
  <div class="system-manager">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">System Management</h2>
          <p class="text-gray-600 mt-1">Manage system settings, senders, topups, and API configuration</p>
        </div>
        
        <div class="flex space-x-3">
          <button 
            @click="showTopupModal = true"
            class="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.592 1L21 12h-3.812c-.668 1.953-2.705 3.5-5.188 3.5-3.007 0-5.5-1.25-5.5-3.5s2.493-3.5 5.5-3.5z"></path>
            </svg>
            <span>Topup Account</span>
          </button>
          
          <button 
            @click="showSenderModal = true"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>Add Sender</span>
          </button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-blue-50 rounded-lg">
          <p class="text-2xl font-bold text-blue-600">{{ systemStats.accountBalance }}</p>
          <p class="text-sm text-blue-600">Account Balance</p>
        </div>
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <p class="text-2xl font-bold text-green-600">{{ systemStats.activeSenders }}</p>
          <p class="text-sm text-green-600">Active Senders</p>
        </div>
        <div class="text-center p-4 bg-purple-50 rounded-lg">
          <p class="text-2xl font-bold text-purple-600">{{ systemStats.totalTransactions }}</p>
          <p class="text-sm text-purple-600">Total Transactions</p>
        </div>
        <div class="text-center p-4 bg-yellow-50 rounded-lg">
          <p class="text-2xl font-bold text-yellow-600">{{ systemStats.stopListCount }}</p>
          <p class="text-sm text-yellow-600">Stop List Entries</p>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8 px-6">
          <button 
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.label }}
            <span 
              v-if="tab.count !== undefined"
              :class="[
                'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium',
                activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900'
              ]"
            >
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <!-- Senders & Stop List Tab -->
        <div v-if="activeTab === 'senders'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Senders Management</h3>
            <div class="flex space-x-2">
              <button 
                @click="refreshSenders"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
          
          <!-- Senders Table -->
          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sender ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Messages Sent</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="sender in senders" :key="sender.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">{{ sender.senderId }}</div>
                    <div class="text-sm text-gray-500">{{ sender.description }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      sender.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    ]">
                      {{ sender.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">{{ sender.country }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{{ sender.messagesSent.toLocaleString() }}</td>
                  <td class="px-6 py-4 text-right">
                    <button @click="toggleSender(sender)" class="text-blue-600 hover:text-blue-900">
                      {{ sender.status === 'active' ? 'Disable' : 'Enable' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Stop List Section -->
          <div class="mt-8">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Stop List Management</h4>
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <div class="flex space-x-4 mb-4">
                <input 
                  v-model="newStopNumber"
                  type="tel" 
                  placeholder="Enter phone number"
                  class="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                >
                <button 
                  @click="addToStopList"
                  class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Add to Stop List
                </button>
              </div>
              
              <div class="space-y-2">
                <div v-for="number in stopList" :key="number" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span class="text-sm text-gray-900">{{ number }}</span>
                  <button @click="removeFromStopList(number)" class="text-red-600 hover:text-red-800">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Topups Tab -->
        <div v-if="activeTab === 'topups'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Topup History</h3>
            <button 
              @click="showTopupModal = true"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              New Topup
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="topup in topups" :key="topup.id" class="bg-white rounded-lg border border-gray-200 p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="text-2xl font-bold text-green-600">{{ topup.amount }}</div>
                <span :class="[
                  'px-2 py-1 text-xs font-semibold rounded-full',
                  topup.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                ]">
                  {{ topup.status }}
                </span>
              </div>
              <div class="text-sm text-gray-600 mb-2">{{ topup.method }}</div>
              <div class="text-xs text-gray-500">{{ formatDate(topup.date) }}</div>
            </div>
          </div>
        </div>

        <!-- Transactions Tab -->
        <div v-if="activeTab === 'transactions'" class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-900">Transaction History</h3>
          
          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="transaction in transactions" :key="transaction.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ transaction.id }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{{ transaction.type }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{{ transaction.amount }}</td>
                  <td class="px-6 py-4">
                    <span :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    ]">
                      {{ transaction.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">{{ formatDate(transaction.date) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- API Settings Tab -->
        <div v-if="activeTab === 'apisettings'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">API Configuration</h3>
            <button 
              @click="saveApiSettings"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Save Settings
            </button>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">General Settings</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">API Version</label>
                  <select v-model="apiSettings.version" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="v1">v1.0</option>
                    <option value="v2">v2.0</option>
                    <option value="v3">v3.0</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Rate Limit</label>
                  <input v-model="apiSettings.rateLimit" type="number" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Webhook Settings</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                  <input v-model="apiSettings.webhookUrl" type="url" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Retry Attempts</label>
                  <input v-model="apiSettings.retryAttempts" type="number" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                </div>
              </div>
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
interface Sender {
  id: number
  senderId: string
  description: string
  status: 'active' | 'inactive'
  country: string
  messagesSent: number
}

interface Topup {
  id: number
  amount: string
  method: string
  status: 'completed' | 'pending'
  date: string
}

interface Transaction {
  id: string
  type: string
  amount: string
  status: 'completed' | 'pending'
  date: string
}

interface ApiSettings {
  version: string
  rateLimit: number
  webhookUrl: string
  retryAttempts: number
}

// Reactive data
const activeTab = ref('senders')
const showTopupModal = ref(false)
const showSenderModal = ref(false)
const newStopNumber = ref('')

// Data
const senders = ref<Sender[]>([
  { id: 1, senderId: 'WEVAS', description: 'Main company sender', status: 'active', country: 'US', messagesSent: 150000 },
  { id: 2, senderId: 'INFO', description: 'Information service', status: 'active', country: 'US', messagesSent: 75000 },
  { id: 3, senderId: 'ALERTS', description: 'Alert notifications', status: 'inactive', country: 'US', messagesSent: 25000 }
])

const stopList = ref<string[]>([
  '+1234567890',
  '+1234567891',
  '+1234567892'
])

const topups = ref<Topup[]>([
  { id: 1, amount: '$500', method: 'Credit Card', status: 'completed', date: '2024-08-20' },
  { id: 2, amount: '$250', method: 'Bank Transfer', status: 'completed', date: '2024-08-15' },
  { id: 3, amount: '$1000', method: 'PayPal', status: 'pending', date: '2024-08-18' }
])

const transactions = ref<Transaction[]>([
  { id: 'TXN001', type: 'Topup', amount: '$500', status: 'completed', date: '2024-08-20' },
  { id: 'TXN002', type: 'SMS Credit', amount: '-$150', status: 'completed', date: '2024-08-19' },
  { id: 'TXN003', type: 'Topup', amount: '$250', status: 'completed', date: '2024-08-15' }
])

const apiSettings = ref<ApiSettings>({
  version: 'v2',
  rateLimit: 1000,
  webhookUrl: 'https://your-domain.com/webhook',
  retryAttempts: 3
})

// Tabs
const tabs = [
  { id: 'senders', label: 'Senders & Stop List', count: senders.value.length },
  { id: 'topups', label: 'Topups', count: topups.value.length },
  { id: 'transactions', label: 'Transactions', count: transactions.value.length },
  { id: 'apisettings', label: 'API Settings', count: undefined }
]

// Computed properties
const systemStats = computed(() => ({
  accountBalance: '$2,450',
  activeSenders: senders.value.filter(s => s.status === 'active').length,
  totalTransactions: transactions.value.length,
  stopListCount: stopList.value.length
}))

// Methods
const refreshSenders = () => {
  console.log('Refreshing senders...')
}

const toggleSender = (sender: Sender) => {
  sender.status = sender.status === 'active' ? 'inactive' : 'active'
}

const addToStopList = () => {
  if (newStopNumber.value && !stopList.value.includes(newStopNumber.value)) {
    stopList.value.push(newStopNumber.value)
    newStopNumber.value = ''
  }
}

const removeFromStopList = (number: string) => {
  stopList.value = stopList.value.filter(n => n !== number)
}

const saveApiSettings = () => {
  console.log('Saving API settings:', apiSettings.value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle
onMounted(() => {
  console.log('System Manager mounted')
})
</script>

<style scoped>
.system-manager {
  @apply w-full;
}

/* Smooth transitions */
* {
  transition: all 0.2s ease-in-out;
}

/* Tab hover effects */
nav button:hover {
  @apply transform translate-y-0.5;
}

/* Table hover effects */
tbody tr:hover {
  @apply bg-gray-50;
}

/* Card hover effects */
.grid > div:hover {
  @apply transform -translate-y-1;
}
</style>
