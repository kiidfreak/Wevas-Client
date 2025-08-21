<template>
  <div class="contact-manager">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Contact Management</h2>
          <p class="text-gray-600 mt-1">Manage your address books, contact groups, and individual contacts</p>
        </div>
        
        <div class="flex space-x-3">
          <button 
            @click="showImportModal = true"
            class="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
            </svg>
            <span>Import Contacts</span>
          </button>
          
          <button 
            @click="showCreateModal = true"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-blue-50 rounded-lg">
          <p class="text-2xl font-bold text-blue-600">{{ contactStats.total }}</p>
          <p class="text-sm text-blue-600">Total Contacts</p>
        </div>
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <p class="text-2xl font-bold text-green-600">{{ contactStats.addressBooks }}</p>
          <p class="text-sm text-green-600">Address Books</p>
        </div>
        <div class="text-center p-4 bg-purple-50 rounded-lg">
          <p class="text-2xl font-bold text-purple-600">{{ contactStats.groups }}</p>
          <p class="text-sm text-purple-600">Contact Groups</p>
        </div>
        <div class="text-center p-4 bg-yellow-50 rounded-lg">
          <p class="text-2xl font-bold text-yellow-600">{{ contactStats.valid }}</p>
          <p class="text-sm text-yellow-600">Valid Numbers</p>
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
        <!-- Address Books Tab -->
        <div v-if="activeTab === 'addressbooks'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Address Books</h3>
            <button 
              @click="showCreateAddressBookModal = true"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              New Address Book
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="book in addressBooks"
              :key="book.id"
              class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-medium text-gray-900">{{ book.name }}</h4>
                <span class="text-xs text-gray-500">{{ book.contacts }} contacts</span>
              </div>
              <p class="text-sm text-gray-600 mb-3">{{ book.description }}</p>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>Created {{ formatDate(book.createdAt) }}</span>
                <div class="flex space-x-2">
                  <button class="text-blue-600 hover:text-blue-800">Edit</button>
                  <button class="text-red-600 hover:text-red-800">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Groups Tab -->
        <div v-if="activeTab === 'groups'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Contact Groups</h3>
            <button 
              @click="showCreateGroupModal = true"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              New Group
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="group in contactGroups"
              :key="group.id"
              class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-medium text-gray-900">{{ group.name }}</h4>
                <span class="text-xs text-gray-500">{{ group.contacts }} contacts</span>
              </div>
              <p class="text-sm text-gray-600 mb-3">{{ group.description }}</p>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>Created {{ formatDate(group.createdAt) }}</span>
                <div class="flex space-x-2">
                  <button class="text-blue-600 hover:text-blue-800">Edit</button>
                  <button class="text-red-600 hover:text-red-800">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- All Contacts Tab -->
        <div v-if="activeTab === 'contacts'" class="space-y-6">
          <!-- Filters & Search -->
          <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div class="flex flex-wrap gap-4">
              <!-- Status Filter -->
              <div class="flex items-center space-x-2">
                <label class="text-sm font-medium text-gray-700">Status:</label>
                <select 
                  v-model="contactFilters.status"
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="unsubscribed">Unsubscribed</option>
                </select>
              </div>

              <!-- Source Filter -->
              <div class="flex items-center space-x-2">
                <label class="text-sm font-medium text-gray-700">Source:</label>
                <select 
                  v-model="contactFilters.source"
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Sources</option>
                  <option value="manual">Manual Entry</option>
                  <option value="import">Import</option>
                  <option value="api">API</option>
                  <option value="webform">Web Form</option>
                </select>
              </div>

              <!-- Address Book Filter -->
              <div class="flex items-center space-x-2">
                <label class="text-sm font-medium text-gray-700">Address Book:</label>
                <select 
                  v-model="contactFilters.addressBook"
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Address Books</option>
                  <option v-for="book in addressBooks" :key="book.id" :value="book.id">
                    {{ book.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Search -->
            <div class="relative">
              <input 
                v-model="contactFilters.search"
                type="text" 
                placeholder="Search contacts..." 
                class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <!-- Bulk Actions -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input 
                    type="checkbox" 
                    v-model="selectAll"
                    @change="toggleSelectAll"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  >
                  <span class="ml-2 text-sm text-gray-700">Select All</span>
                </label>
                
                <span v-if="selectedContacts.length > 0" class="text-sm text-gray-600">
                  {{ selectedContacts.length }} contacts selected
                </span>
              </div>
              
              <div v-if="selectedContacts.length > 0" class="flex space-x-2">
                <button class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                  Add to Group
                </button>
                <button class="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                  Export
                </button>
                <button class="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>

          <!-- Contacts Table -->
          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input 
                        type="checkbox" 
                        v-model="selectAll"
                        @change="toggleSelectAll"
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      >
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Groups</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr 
                    v-for="contact in paginatedContacts"
                    :key="contact.id"
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        v-model="selectedContacts"
                        :value="contact.id"
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      >
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span class="text-sm font-medium text-gray-700">
                              {{ contact.firstName.charAt(0) }}{{ contact.lastName.charAt(0) }}
                            </span>
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">
                            {{ contact.firstName }} {{ contact.lastName }}
                          </div>
                          <div class="text-sm text-gray-500">{{ contact.email }}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ contact.phone }}
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        :class="[
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          statusClasses[contact.status]
                        ]"
                      >
                        {{ contact.status }}
                      </span>
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div class="flex flex-wrap gap-1">
                        <span 
                          v-for="group in contact.groups"
                          :key="group"
                          class="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                        >
                          {{ group }}
                        </span>
                      </div>
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatDate(contact.createdAt) }}
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center justify-end space-x-2">
                        <button class="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                        </button>
                        
                        <button class="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        
                        <button class="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors">
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
                      <span class="font-medium">{{ filteredContacts.length }}</span>
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Types
interface AddressBook {
  id: number
  name: string
  description: string
  contacts: number
  createdAt: string
}

interface ContactGroup {
  id: number
  name: string
  description: string
  contacts: number
  createdAt: string
}

interface Contact {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  status: 'active' | 'inactive' | 'unsubscribed'
  groups: string[]
  createdAt: string
}

interface ContactFilters {
  status: string
  source: string
  addressBook: string
  search: string
}

// Reactive data
const activeTab = ref('addressbooks')
const showImportModal = ref(false)
const showCreateModal = ref(false)
const showCreateAddressBookModal = ref(false)
const showCreateGroupModal = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10
const selectAll = ref(false)
const selectedContacts = ref<number[]>([])

// Filters
const contactFilters = ref<ContactFilters>({
  status: '',
  source: '',
  addressBook: '',
  search: ''
})

// Tabs
const tabs = [
  { id: 'addressbooks', label: 'Address Books', count: 5 },
  { id: 'groups', label: 'Contact Groups', count: 12 },
  { id: 'contacts', label: 'All Contacts', count: 156847 }
]

// Status classes
const statusClasses = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  unsubscribed: 'bg-red-100 text-red-800'
}

// Sample data
const addressBooks = ref<AddressBook[]>([
  {
    id: 1,
    name: 'Main Contacts',
    description: 'Primary contact database',
    contacts: 45000,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'VIP Customers',
    description: 'High-value customer contacts',
    contacts: 2500,
    createdAt: '2024-03-20'
  },
  {
    id: 3,
    name: 'Newsletter Subscribers',
    description: 'Marketing newsletter contacts',
    contacts: 12500,
    createdAt: '2024-02-10'
  }
])

const contactGroups = ref<ContactGroup[]>([
  {
    id: 1,
    name: 'Premium Members',
    description: 'Premium subscription customers',
    contacts: 1800,
    createdAt: '2024-04-05'
  },
  {
    id: 2,
    name: 'New Customers',
    description: 'Recently acquired customers',
    contacts: 3200,
    createdAt: '2024-05-12'
  },
  {
    id: 3,
    name: 'Inactive Users',
    description: 'Users with no recent activity',
    contacts: 8500,
    createdAt: '2024-06-01'
  }
])

const contacts = ref<Contact[]>([
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    status: 'active',
    groups: ['VIP Customers', 'Premium Members'],
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1234567891',
    status: 'active',
    groups: ['Newsletter Subscribers'],
    createdAt: '2024-02-20'
  },
  {
    id: 3,
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    phone: '+1234567892',
    status: 'inactive',
    groups: ['Main Contacts'],
    createdAt: '2024-03-10'
  }
])

// Computed properties
const contactStats = computed(() => {
  const total = contacts.value.length
  const addressBooksCount = addressBooks.value.length
  const groups = contactGroups.value.length
  const valid = contacts.value.filter(c => c.status === 'active').length
  
  return { total, addressBooks: addressBooksCount, groups, valid }
})

const filteredContacts = computed(() => {
  let filtered = [...contacts.value]
  
  if (contactFilters.value.status) {
    filtered = filtered.filter(c => c.status === contactFilters.value.status)
  }
  
  if (contactFilters.value.source) {
    // Filter by source logic
  }
  
  if (contactFilters.value.addressBook) {
    // Filter by address book logic
  }
  
  if (contactFilters.value.search) {
    const search = contactFilters.value.search.toLowerCase()
    filtered = filtered.filter(c => 
      c.firstName.toLowerCase().includes(search) || 
      c.lastName.toLowerCase().includes(search) ||
      c.email.toLowerCase().includes(search) ||
      c.phone.includes(search)
    )
  }
  
  return filtered
})

const totalPages = computed(() => Math.ceil(filteredContacts.value.length / itemsPerPage))

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredContacts.value.length))

const paginatedContacts = computed(() => {
  return filteredContacts.value.slice(startIndex.value, endIndex.value)
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
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedContacts.value = paginatedContacts.value.map(c => c.id)
  } else {
    selectedContacts.value = []
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle
onMounted(() => {
  console.log('Contact Manager mounted')
})
</script>

<style scoped>
.contact-manager {
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

/* Card hover effects */
.bg-gray-50:hover {
  @apply transform scale-[1.02];
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
