<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">API Outbox</h1>
        <p class="text-gray-600">Monitor API-driven SMS messages and delivery status</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">API Calls</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalStats.totalCalls.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Success Rate</p>
              <p class="text-2xl font-bold text-green-600">{{ totalStats.successRate }}%</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Avg Response</p>
              <p class="text-2xl font-bold text-blue-600">{{ totalStats.avgResponse }}ms</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Errors</p>
              <p class="text-2xl font-bold text-red-600">{{ totalStats.errors.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- API Key Info -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">API Configuration</h3>
            <p class="text-sm text-gray-600">Your API key and endpoint information</p>
          </div>
          <button 
            @click="showApiDocs = true"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 0 1121 9z"></path>
            </svg>
            View API Docs
          </button>
        </div>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">API Endpoint</label>
            <div class="flex items-center space-x-2">
              <code class="flex-1 px-3 py-2 bg-gray-100 text-gray-800 rounded text-sm font-mono">https://api.wevas.com/v1/sms/send</code>
              <button 
                @click="copyToClipboard('https://api.wevas.com/v1/sms/send')"
                class="px-2 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Copy endpoint"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H8z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">API Key</label>
            <div class="flex items-center space-x-2">
              <code class="flex-1 px-3 py-2 bg-gray-100 text-gray-800 rounded text-sm font-mono">{{ maskedApiKey }}</code>
              <button 
                @click="toggleApiKeyVisibility"
                class="px-2 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                :title="showApiKey ? 'Hide key' : 'Show key'"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="!showApiKey" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path v-if="!showApiKey" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  <path v-if="showApiKey" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
              </button>
              <button 
                @click="copyToClipboard(apiKey)"
                class="px-2 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Copy API key"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H8z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions Bar -->
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="flex items-center space-x-4">
            <button 
              @click="showTestApiModal = true"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Test API
            </button>
            <button 
              @click="exportLogs"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
              Export Logs
            </button>
          </div>
          
          <div class="flex items-center space-x-3">
            <input 
              v-model="searchQuery"
              @input="handleSearch"
              type="text" 
              placeholder="Search API calls..." 
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <select 
              v-model="statusFilter"
              @change="handleFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      <!-- API Calls Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="call in paginatedApiCalls" :key="call.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <code class="text-sm text-gray-900 font-mono">{{ call.requestId }}</code>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(call.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ call.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ call.phoneNumber }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="max-w-xs truncate text-sm text-gray-900" :title="call.message">
                    {{ call.message }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ call.responseTime }}ms</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="viewApiCall(call)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                      title="View Details"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                    <button 
                      @click="retryApiCall(call)"
                      v-if="call.status === 'failed'"
                      class="text-green-600 hover:text-green-900 transition-colors"
                      title="Retry API Call"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
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
              Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredApiCalls.length }} results
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

    <!-- Test API Modal -->
    <div v-if="showTestApiModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Test API Call</h3>
        <form @submit.prevent="testApiCall">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                v-model="testApiData.phoneNumber"
                type="tel" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1234567890"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea 
                v-model="testApiData.message"
                rows="3"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter test message"
              ></textarea>
            </div>
          </div>
          <div class="flex items-center justify-end space-x-3 mt-6">
            <button 
              type="button"
              @click="showTestApiModal = false"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="isTesting"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ isTesting ? 'Testing...' : 'Test API' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- API Call Details Modal -->
    <div v-if="selectedApiCall" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">API Call Details</h3>
          <button 
            @click="selectedApiCall = null"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Request ID</label>
            <p class="text-gray-900 font-mono">{{ selectedApiCall.requestId }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <span :class="getStatusClass(selectedApiCall.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
              {{ selectedApiCall.status }}
            </span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <p class="text-gray-900">{{ selectedApiCall.phoneNumber }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <p class="text-gray-900">{{ selectedApiCall.message }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Response Time</label>
            <p class="text-gray-900">{{ selectedApiCall.responseTime }}ms</p>
          </div>
        </div>
      </div>
    </div>

    <!-- API Documentation Modal -->
    <div v-if="showApiDocs" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">API Documentation</h3>
          <button 
            @click="showApiDocs = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="space-y-6">
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-2">Send SMS</h4>
            <div class="bg-gray-100 p-4 rounded-lg">
              <p class="text-sm text-gray-700 mb-2"><strong>Endpoint:</strong> POST /v1/sms/send</p>
              <p class="text-sm text-gray-700 mb-2"><strong>Headers:</strong></p>
              <pre class="text-xs text-gray-600 bg-white p-2 rounded">Authorization: Bearer YOUR_API_KEY
Content-Type: application/json</pre>
              <p class="text-sm text-gray-700 mb-2 mt-2"><strong>Body:</strong></p>
              <pre class="text-xs text-gray-600 bg-white p-2 rounded">{
  "phone_number": "+1234567890",
  "message": "Your verification code is 123456",
  "sender_id": "WEVAS"
}</pre>
            </div>
          </div>
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-2">Response Codes</h4>
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <span class="w-3 h-3 bg-green-500 rounded-full"></span>
                <span class="text-sm text-gray-700">200 - Success</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="w-3 h-3 bg-red-500 rounded-full"></span>
                <span class="text-sm text-gray-700">400 - Bad Request</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="w-3 h-3 bg-red-500 rounded-full"></span>
                <span class="text-sm text-gray-700">401 - Unauthorized</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="w-3 h-3 bg-red-500 rounded-full"></span>
                <span class="text-sm text-gray-700">429 - Rate Limited</span>
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

interface ApiCall {
  id: number
  requestId: string
  status: 'success' | 'failed' | 'pending'
  phoneNumber: string
  message: string
  responseTime: number
}

interface TestApiData {
  phoneNumber: string
  message: string
}

const apiCalls = ref<ApiCall[]>([
  {
    id: 1,
    requestId: 'req_abc123',
    status: 'success',
    phoneNumber: '+1234567890',
    message: 'Your verification code is 123456',
    responseTime: 89
  },
  {
    id: 2,
    requestId: 'req_def456',
    status: 'success',
    phoneNumber: '+1987654321',
    message: 'Welcome to Wevas! Your account is now active.',
    responseTime: 156
  },
  {
    id: 3,
    requestId: 'req_ghi789',
    status: 'failed',
    phoneNumber: '+1122334455',
    message: 'Order #12345 has been shipped',
    responseTime: 234
  },
  {
    id: 4,
    requestId: 'req_jkl012',
    status: 'success',
    phoneNumber: '+1555666777',
    message: 'Your appointment is confirmed for tomorrow at 2 PM',
    responseTime: 67
  },
  {
    id: 5,
    requestId: 'req_mno345',
    status: 'pending',
    phoneNumber: '+1888999000',
    message: 'Thank you for your purchase! Order #67890',
    responseTime: 0
  },
  {
    id: 6,
    requestId: 'req_pqr678',
    status: 'success',
    phoneNumber: '+1444333222',
    message: 'Your delivery will arrive today between 3-5 PM',
    responseTime: 123
  }
])

// Reactive state
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(5)
const showTestApiModal = ref(false)
const showApiDocs = ref(false)
const selectedApiCall = ref<ApiCall | null>(null)
const isTesting = ref(false)
const showApiKey = ref(false)
const apiKey = ref('sk_live_wevas_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz')

const testApiData = ref<TestApiData>({
  phoneNumber: '',
  message: ''
})

// Computed properties
const filteredApiCalls = computed(() => {
  let filtered = apiCalls.value

  if (searchQuery.value) {
    filtered = filtered.filter(call => 
      call.requestId.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      call.phoneNumber.includes(searchQuery.value) ||
      call.message.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(call => call.status === statusFilter.value)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredApiCalls.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredApiCalls.value.length))

const paginatedApiCalls = computed(() => {
  return filteredApiCalls.value.slice(startIndex.value, endIndex.value)
})

const totalStats = computed(() => {
  const total = apiCalls.value.reduce((acc, call) => {
    acc.totalCalls++
    if (call.status === 'success') acc.successCount++
    if (call.status === 'failed') acc.errorCount++
    acc.totalResponseTime += call.responseTime
    return acc
  }, { totalCalls: 0, successCount: 0, errorCount: 0, totalResponseTime: 0 })
  
  return {
    totalCalls: total.totalCalls,
    successRate: total.totalCalls > 0 ? Math.round((total.successCount / total.totalCalls) * 100) : 0,
    avgResponse: total.totalCalls > 0 ? Math.round(total.totalResponseTime / total.totalCalls) : 0,
    errors: total.errorCount
  }
})

const maskedApiKey = computed(() => {
  if (showApiKey.value) {
    return apiKey.value
  }
  return apiKey.value.substring(0, 8) + '...' + apiKey.value.substring(apiKey.value.length - 4)
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

const exportLogs = () => {
  const csvContent = generateCSV(filteredApiCalls.value)
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `api-outbox-logs-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

const generateCSV = (data: ApiCall[]) => {
  const headers = ['Request ID', 'Status', 'Phone Number', 'Message', 'Response Time']
  const rows = data.map(call => [
    call.requestId,
    call.status,
    call.phoneNumber,
    call.message,
    call.responseTime
  ])
  
  return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n')
}

const testApiCall = async () => {
  isTesting.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const newCall: ApiCall = {
    id: Date.now(),
    requestId: `req_${Math.random().toString(36).substr(2, 9)}`,
    status: Math.random() > 0.2 ? 'success' : 'failed',
    phoneNumber: testApiData.value.phoneNumber,
    message: testApiData.value.message,
    responseTime: Math.floor(Math.random() * 200) + 50
  }
  
  apiCalls.value.unshift(newCall)
  showTestApiModal.value = false
  
  // Reset form
  testApiData.value = {
    phoneNumber: '',
    message: ''
  }
  
  // Show result
  alert(`API call ${newCall.status === 'success' ? 'succeeded' : 'failed'}! Response time: ${newCall.responseTime}ms`)
  isTesting.value = false
}

const viewApiCall = (call: ApiCall) => {
  selectedApiCall.value = call
}

const retryApiCall = async (call: ApiCall) => {
  if (confirm(`Retry API call ${call.requestId}?`)) {
    // Simulate retry
    call.status = 'pending'
    call.responseTime = 0
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    call.status = Math.random() > 0.3 ? 'success' : 'failed'
    call.responseTime = Math.floor(Math.random() * 200) + 50
    
    alert(`Retry ${call.status === 'success' ? 'succeeded' : 'failed'}!`)
  }
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('Copied to clipboard!')
  }
}

const toggleApiKeyVisibility = () => {
  showApiKey.value = !showApiKey.value
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'success':
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
