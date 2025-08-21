<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Bulk Topups</h1>
        <p class="text-gray-600">Manage your account balance and purchase SMS credits</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Current Balance</p>
              <p class="text-2xl font-bold text-gray-900">KSh {{ totalStats.currentBalance.toFixed(2) }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">SMS Credits</p>
              <p class="text-2xl font-bold text-blue-600">{{ totalStats.smsCredits.toLocaleString() }}</p>
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
              <p class="text-sm font-medium text-gray-600">This Month</p>
              <p class="text-2xl font-bold text-purple-600">KSh {{ totalStats.thisMonth.toFixed(2) }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Pending</p>
              <p class="text-2xl font-bold text-yellow-600">KSh {{ totalStats.pending.toFixed(2) }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Topup Packages -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Topup Packages</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            v-for="pkg in topupPackages" 
            :key="pkg.id"
            class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
            @click="selectPackage(pkg)"
          >
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900 mb-2">{{ pkg.name }}</div>
              <div class="text-3xl font-bold text-blue-600 mb-2">KSh {{ pkg.price }}</div>
              <div class="text-sm text-gray-600 mb-3">{{ pkg.credits.toLocaleString() }} SMS Credits</div>
              <div class="text-xs text-gray-500">{{ pkg.bonus }}% Bonus</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions Bar -->
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="flex items-center space-x-4">
            <button 
              @click="showCustomAmountModal = true"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Custom Amount
            </button>
            <button 
              @click="exportHistory"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
              Export History
            </button>
          </div>
          
          <div class="flex items-center space-x-3">
            <input 
              v-model="searchQuery"
              @input="handleSearch"
              type="text" 
              placeholder="Search transactions..." 
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <select 
              v-model="typeFilter"
              @change="handleFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="topup">Topup</option>
              <option value="refund">Refund</option>
              <option value="adjustment">Adjustment</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="transaction in paginatedTransactions" :key="transaction.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ transaction.reference }}</div>
                    <div class="text-sm text-gray-500">{{ transaction.description }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getTypeClass(transaction.type)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ transaction.type }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">${{ transaction.amount.toFixed(2) }}</div>
                  <div v-if="transaction.bonus" class="text-xs text-green-600">+{{ transaction.bonus }}% bonus</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ transaction.credits.toLocaleString() }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(transaction.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ transaction.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ transaction.date }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="viewTransaction(transaction)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                      title="View Details"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                    <button 
                      v-if="transaction.status === 'pending'"
                      @click="cancelTransaction(transaction)"
                      class="text-red-600 hover:text-red-900 transition-colors"
                      title="Cancel Transaction"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
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
              Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredTransactions.length }} results
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

    <!-- Custom Amount Modal -->
    <div v-if="showCustomAmountModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Custom Amount Topup</h3>
        <form @submit.prevent="processCustomTopup">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Amount (KSh)</label>
              <input 
                v-model.number="customTopup.amount"
                type="number" 
                required
                min="1"
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select 
                v-model="customTopup.paymentMethod"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select payment method</option>
                <option value="mpesa">M-Pesa</option>
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg">
              <div class="text-sm text-gray-600 mb-1">Estimated Credits:</div>
              <div class="text-lg font-semibold text-gray-900">{{ estimatedCredits.toLocaleString() }} SMS</div>
              <div v-if="estimatedBonus > 0" class="text-sm text-green-600">+{{ estimatedBonus.toLocaleString() }} bonus credits</div>
            </div>
          </div>
          <div class="flex items-center justify-end space-x-3 mt-6">
            <button 
              type="button"
              @click="showCustomAmountModal = false"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="isProcessing"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ isProcessing ? 'Processing...' : 'Process Topup' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Transaction Details Modal -->
    <div v-if="selectedTransaction" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Transaction Details</h3>
          <button 
            @click="selectedTransaction = null"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Reference</label>
            <p class="text-gray-900 font-mono">{{ selectedTransaction.reference }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <p class="text-gray-900">{{ selectedTransaction.description }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <span :class="getTypeClass(selectedTransaction.type)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
              {{ selectedTransaction.type }}
            </span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <p class="text-gray-900">KSh {{ selectedTransaction.amount.toFixed(2) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Credits</label>
              <p class="text-gray-900">{{ selectedTransaction.credits.toLocaleString() }}</p>
            </div>
          </div>
          <div v-if="selectedTransaction.bonus">
            <label class="block text-sm font-medium text-gray-700 mb-1">Bonus</label>
            <p class="text-green-600">+{{ selectedTransaction.bonus }}% bonus credits</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <span :class="getStatusClass(selectedTransaction.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
              {{ selectedTransaction.status }}
            </span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <p class="text-gray-900">{{ selectedTransaction.date }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface TopupPackage {
  id: number
  name: string
  price: number
  credits: number
  bonus: number
}

interface Transaction {
  id: number
  reference: string
  description: string
  type: 'topup' | 'refund' | 'adjustment'
  amount: number
  credits: number
  bonus?: number
  status: 'completed' | 'pending' | 'failed'
  date: string
}

interface CustomTopup {
  amount: number
  paymentMethod: string
}

const topupPackages = ref<TopupPackage[]>([
  {
    id: 1,
    name: 'Starter',
    price: 25,
    credits: 2500,
    bonus: 0
  },
  {
    id: 2,
    name: 'Professional',
    price: 50,
    credits: 5500,
    bonus: 10
  },
  {
    id: 3,
    name: 'Enterprise',
    price: 100,
    credits: 12000,
    bonus: 20
  }
])

const transactions = ref<Transaction[]>([
  {
    id: 1,
    reference: 'TXN_001',
    description: 'Professional Package Topup',
    type: 'topup',
    amount: 50.00,
    credits: 5500,
    bonus: 10,
    status: 'completed',
    date: '15/08/2024'
  },
  {
    id: 2,
    reference: 'TXN_002',
    description: 'Custom Amount Topup',
    type: 'topup',
    amount: 75.00,
    credits: 7500,
    bonus: 0,
    status: 'completed',
    date: '12/08/2024'
  },
  {
    id: 3,
    reference: 'TXN_003',
    description: 'Enterprise Package Topup',
    type: 'topup',
    amount: 100.00,
    credits: 12000,
    bonus: 20,
    status: 'pending',
    date: '10/08/2024'
  },
  {
    id: 4,
    reference: 'TXN_004',
    description: 'Refund for failed delivery',
    type: 'refund',
    amount: -15.00,
    credits: -1500,
    status: 'completed',
    date: '08/08/2024'
  },
  {
    id: 5,
    reference: 'TXN_005',
    description: 'Starter Package Topup',
    type: 'topup',
    amount: 25.00,
    credits: 2500,
    bonus: 0,
    status: 'completed',
    date: '05/08/2024'
  },
  {
    id: 6,
    reference: 'TXN_006',
    description: 'System adjustment',
    type: 'adjustment',
    amount: 5.00,
    credits: 500,
    status: 'completed',
    date: '01/08/2024'
  }
])

// Reactive state
const searchQuery = ref('')
const typeFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(5)
const showCustomAmountModal = ref(false)
const selectedTransaction = ref<Transaction | null>(null)
const isProcessing = ref(false)

const customTopup = ref<CustomTopup>({
  amount: 0,
  paymentMethod: ''
})

// Computed properties
const filteredTransactions = computed(() => {
  let filtered = transactions.value

  if (searchQuery.value) {
    filtered = filtered.filter(transaction => 
      transaction.reference.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (typeFilter.value) {
    filtered = filtered.filter(transaction => transaction.type === typeFilter.value)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredTransactions.value.length))

const paginatedTransactions = computed(() => {
  return filteredTransactions.value.slice(startIndex.value, endIndex.value)
})

const totalStats = computed(() => {
  const total = transactions.value.reduce((acc, transaction) => {
    if (transaction.status === 'completed') {
      acc.currentBalance += transaction.amount
      acc.smsCredits += transaction.credits
      
      // Check if this month (simplified logic)
      if (transaction.date.includes('08/2024')) {
        acc.thisMonth += transaction.amount
      }
    } else if (transaction.status === 'pending') {
      acc.pending += transaction.amount
    }
    
    return acc
  }, { currentBalance: 0, smsCredits: 0, thisMonth: 0, pending: 0 })
  
  return total
})

const estimatedCredits = computed(() => {
  if (!customTopup.value.amount) return 0
  return Math.floor(customTopup.value.amount * 100) // $1 = 100 credits
})

const estimatedBonus = computed(() => {
  if (!customTopup.value.amount) return 0
  if (customTopup.value.amount >= 100) return Math.floor(estimatedCredits.value * 0.2) // 20% bonus
  if (customTopup.value.amount >= 50) return Math.floor(estimatedCredits.value * 0.1) // 10% bonus
  return 0
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

const exportHistory = () => {
  const csvContent = generateCSV(filteredTransactions.value)
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `topup-history-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

const generateCSV = (data: Transaction[]) => {
  const headers = ['Reference', 'Description', 'Type', 'Amount', 'Credits', 'Bonus', 'Status', 'Date']
  const rows = data.map(transaction => [
    transaction.reference,
    transaction.description,
    transaction.type,
    transaction.amount,
    transaction.credits,
    transaction.bonus || 0,
    transaction.status,
    transaction.date
  ])
  
  return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n')
}

const selectPackage = (pkg: TopupPackage) => {
  if (confirm(`Purchase ${pkg.name} package for $${pkg.price}?`)) {
    processPackageTopup(pkg)
  }
}

const processPackageTopup = async (pkg: TopupPackage) => {
  isProcessing.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const transaction: Transaction = {
    id: Date.now(),
    reference: `TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    description: `${pkg.name} Package Topup`,
    type: 'topup',
    amount: pkg.price,
    credits: pkg.credits,
    bonus: pkg.bonus,
    status: 'completed',
    date: new Date().toLocaleDateString()
  }
  
  transactions.value.unshift(transaction)
  alert(`Topup successful! Added ${pkg.credits.toLocaleString()} credits to your account.`)
  isProcessing.value = false
}

const processCustomTopup = async () => {
  isProcessing.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const transaction: Transaction = {
    id: Date.now(),
    reference: `TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    description: `Custom Amount Topup (${customTopup.value.paymentMethod})`,
    type: 'topup',
    amount: customTopup.value.amount,
    credits: estimatedCredits.value + estimatedBonus.value,
    bonus: estimatedBonus.value > 0 ? Math.round((estimatedBonus.value / (estimatedCredits.value + estimatedBonus.value)) * 100) : undefined,
    status: 'completed',
    date: new Date().toLocaleDateString()
  }
  
  transactions.value.unshift(transaction)
  showCustomAmountModal.value = false
  
  // Reset form
  customTopup.value = {
    amount: 0,
    paymentMethod: ''
  }
  
  alert(`Topup successful! Added ${transaction.credits.toLocaleString()} credits to your account.`)
  isProcessing.value = false
}

const viewTransaction = (transaction: Transaction) => {
  selectedTransaction.value = transaction
}

const cancelTransaction = (transaction: Transaction) => {
  if (confirm(`Cancel transaction ${transaction.reference}?`)) {
    transaction.status = 'failed'
    alert('Transaction cancelled successfully!')
  }
}

const getTypeClass = (type: string) => {
  switch (type) {
    case 'topup':
      return 'bg-green-100 text-green-800'
    case 'refund':
      return 'bg-blue-100 text-blue-800'
    case 'adjustment':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
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
