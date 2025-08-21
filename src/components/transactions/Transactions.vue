<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
        <p class="text-gray-600">Complete history of all account transactions and billing</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Spent</p>
              <p class="text-2xl font-bold text-gray-900">KSh {{ totalStats.totalSpent.toFixed(2) }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">This Year</p>
              <p class="text-2xl font-bold text-blue-600">KSh {{ totalStats.thisYear.toFixed(2) }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Refunds</p>
              <p class="text-2xl font-bold text-green-600">KSh {{ totalStats.refunds.toFixed(2) }}</p>
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

      <!-- Filters and Actions -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select 
              v-model="dateRange"
              @change="handleFilter"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
            <select 
              v-model="typeFilter"
              @change="handleFilter"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="topup">Topup</option>
              <option value="refund">Refund</option>
              <option value="adjustment">Adjustment</option>
              <option value="fee">Fee</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select 
              v-model="statusFilter"
              @change="handleFilter"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div class="flex items-end space-x-2">
            <button 
              @click="exportTransactions"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
              Export CSV
            </button>
            <button 
              @click="downloadPDF"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              PDF
            </button>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <input 
            v-model="searchQuery"
            @input="handleSearch"
            type="text" 
            placeholder="Search transactions..." 
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
          <button 
            @click="clearFilters"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
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
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
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
                  <div class="text-sm font-medium" :class="transaction.amount >= 0 ? 'text-gray-900' : 'text-red-600'">
                    {{ transaction.amount >= 0 ? '+' : '' }}KSh {{ transaction.amount.toFixed(2) }}
                  </div>
                  <div v-if="transaction.fee" class="text-xs text-gray-500">Fee: KSh {{ transaction.fee.toFixed(2) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">KSh {{ transaction.balance.toFixed(2) }}</td>
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
                    <button 
                      v-if="transaction.status === 'completed' && transaction.type === 'topup'"
                      @click="downloadReceipt(transaction)"
                      class="text-green-600 hover:text-green-900 transition-colors"
                      title="Download Receipt"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
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
              <p class="text-gray-900" :class="selectedTransaction.amount >= 0 ? 'text-gray-900' : 'text-red-600'">
                {{ selectedTransaction.amount >= 0 ? '+' : '' }}KSh {{ selectedTransaction.amount.toFixed(2) }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Balance After</label>
              <p class="text-gray-900">KSh {{ selectedTransaction.balance.toFixed(2) }}</p>
            </div>
          </div>
          <div v-if="selectedTransaction.fee">
            <label class="block text-sm font-medium text-gray-700 mb-1">Transaction Fee</label>
            <p class="text-gray-900">KSh {{ selectedTransaction.fee.toFixed(2) }}</p>
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
          <div v-if="selectedTransaction.notes">
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <p class="text-gray-900">{{ selectedTransaction.notes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Transaction {
  id: number
  reference: string
  description: string
  type: 'topup' | 'refund' | 'adjustment' | 'fee'
  amount: number
  balance: number
  fee?: number
  status: 'completed' | 'pending' | 'failed'
  date: string
  notes?: string
}

const transactions = ref<Transaction[]>([
  {
    id: 1,
    reference: 'TXN_001',
    description: 'Professional Package Topup',
    type: 'topup',
    amount: 50.00,
    balance: 50.00,
    status: 'completed',
    date: '15/08/2024 14:30'
  },
  {
    id: 2,
    reference: 'TXN_002',
    description: 'Custom Amount Topup',
    type: 'topup',
    amount: 75.00,
    balance: 125.00,
    status: 'completed',
    date: '12/08/2024 09:15'
  },
  {
    id: 3,
    reference: 'TXN_003',
    description: 'Enterprise Package Topup',
    type: 'topup',
    amount: 100.00,
    balance: 225.00,
    status: 'pending',
    date: '10/08/2024 16:45'
  },
  {
    id: 4,
    reference: 'TXN_004',
    description: 'Refund for failed delivery',
    type: 'refund',
    amount: -15.00,
    balance: 210.00,
    status: 'completed',
    date: '08/08/2024 11:20'
  },
  {
    id: 5,
    reference: 'TXN_005',
    description: 'Starter Package Topup',
    type: 'topup',
    amount: 25.00,
    balance: 235.00,
    status: 'completed',
    date: '05/08/2024 13:10'
  },
  {
    id: 6,
    reference: 'TXN_006',
    description: 'System adjustment',
    type: 'adjustment',
    amount: 5.00,
    balance: 240.00,
    status: 'completed',
    date: '01/08/2024 10:00'
  },
  {
    id: 7,
    reference: 'TXN_007',
    description: 'Monthly service fee',
    type: 'fee',
    amount: -9.99,
    balance: 230.01,
    fee: 9.99,
    status: 'completed',
    date: '01/08/2024 00:00',
    notes: 'Monthly subscription fee for premium features'
  },
  {
    id: 8,
    reference: 'TXN_008',
    description: 'Failed topup attempt',
    type: 'topup',
    amount: 50.00,
    balance: 230.01,
    status: 'failed',
    date: '28/07/2024 15:30',
    notes: 'Payment method declined'
  }
])

// Reactive state
const searchQuery = ref('')
const dateRange = ref('all')
const typeFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(5)
const selectedTransaction = ref<Transaction | null>(null)

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

  if (statusFilter.value) {
    filtered = filtered.filter(transaction => transaction.status === statusFilter.value)
  }

  if (dateRange.value !== 'all') {
    const now = new Date()
    filtered = filtered.filter(transaction => {
      const transactionDate = new Date(transaction.date)
      switch (dateRange.value) {
        case 'today':
          return transactionDate.toDateString() === now.toDateString()
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return transactionDate >= weekAgo
        case 'month':
          return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear()
        case 'year':
          return transactionDate.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })
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
      if (transaction.amount > 0) {
        acc.totalSpent += transaction.amount
      } else {
        acc.refunds += Math.abs(transaction.amount)
      }
      
      // Check if this year (simplified logic)
      if (transaction.date.includes('2024')) {
        acc.thisYear += transaction.amount > 0 ? transaction.amount : 0
      }
    } else if (transaction.status === 'pending') {
      acc.pending += transaction.amount > 0 ? transaction.amount : 0
    }
    
    return acc
  }, { totalSpent: 0, thisYear: 0, refunds: 0, pending: 0 })
  
  return total
})

// Methods
const handleSearch = () => {
  currentPage.value = 1
}

const handleFilter = () => {
  currentPage.value = 1
}

const clearFilters = () => {
  searchQuery.value = ''
  dateRange.value = 'all'
  typeFilter.value = ''
  statusFilter.value = ''
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

const exportTransactions = () => {
  const csvContent = generateCSV(filteredTransactions.value)
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

const generateCSV = (data: Transaction[]) => {
  const headers = ['Reference', 'Description', 'Type', 'Amount', 'Balance', 'Fee', 'Status', 'Date', 'Notes']
  const rows = data.map(transaction => [
    transaction.reference,
    transaction.description,
    transaction.type,
    transaction.amount,
    transaction.balance,
    transaction.fee || 0,
    transaction.status,
    transaction.date,
    transaction.notes || ''
  ])
  
  return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n')
}

const downloadPDF = () => {
  // Simulate PDF download
  alert('PDF download started...')
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

const downloadReceipt = (transaction: Transaction) => {
  // Generate PDF receipt
  const receiptContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
          .receipt-title { font-size: 20px; font-weight: bold; margin-bottom: 30px; }
          .transaction-details { margin-bottom: 30px; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .label { font-weight: bold; color: #374151; }
          .value { color: #111827; }
          .amount { font-size: 18px; font-weight: bold; color: ${transaction.amount >= 0 ? '#059669' : '#dc2626'}; }
          .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">WEVAS</div>
          <div>Transaction Receipt</div>
        </div>
        
        <div class="receipt-title">Receipt #${transaction.reference}</div>
        
        <div class="transaction-details">
          <div class="detail-row">
            <span class="label">Date:</span>
            <span class="value">${transaction.date}</span>
          </div>
          <div class="detail-row">
            <span class="label">Description:</span>
            <span class="value">${transaction.description}</span>
          </div>
          <div class="detail-row">
            <span class="label">Type:</span>
            <span class="value">${transaction.type.toUpperCase()}</span>
          </div>
          <div class="detail-row">
            <span class="label">Amount:</span>
            <span class="value amount">${transaction.amount >= 0 ? '+' : ''}KSh ${transaction.amount.toFixed(2)}</span>
          </div>
          <div class="detail-row">
            <span class="label">Balance After:</span>
            <span class="value">KSh ${transaction.balance.toFixed(2)}</span>
          </div>
          ${transaction.fee ? `
          <div class="detail-row">
            <span class="label">Transaction Fee:</span>
            <span class="value">KSh ${transaction.fee.toFixed(2)}</span>
          </div>
          ` : ''}
          <div class="detail-row">
            <span class="label">Status:</span>
            <span class="value">${transaction.status.toUpperCase()}</span>
          </div>
          ${transaction.notes ? `
          <div class="detail-row">
            <span class="label">Notes:</span>
            <span class="value">${transaction.notes}</span>
          </div>
          ` : ''}
        </div>
        
        <div class="footer">
          <p>Thank you for using Wevas SMS Services</p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
    </html>
  `
  
  // Create PDF using browser's print functionality
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(receiptContent)
    printWindow.document.close()
    printWindow.focus()
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 500)
  }
  
  alert(`Receipt for ${transaction.reference} generated successfully!`)
}

const getTypeClass = (type: string) => {
  switch (type) {
    case 'topup':
      return 'bg-green-100 text-green-800'
    case 'refund':
      return 'bg-blue-100 text-blue-800'
    case 'adjustment':
      return 'bg-gray-100 text-gray-800'
    case 'fee':
      return 'bg-red-100 text-red-800'
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
