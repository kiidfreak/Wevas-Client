<template>
  <div class="message-manager">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Message Management</h2>
          <p class="text-gray-600 mt-1">Monitor SMS delivery, track message status, and manage outbox</p>
        </div>
        
        <div class="flex space-x-3">
          <button 
            @click="showComposeModal = true"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
            <span>Compose Message</span>
          </button>
          
          <button 
            @click="showBulkModal = true"
            class="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span>Bulk Send</span>
          </button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-blue-50 rounded-lg">
          <p class="text-2xl font-bold text-blue-600">{{ messageStats.total }}</p>
          <p class="text-sm text-blue-600">Total Messages</p>
        </div>
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <p class="text-2xl font-bold text-green-600">{{ messageStats.delivered }}</p>
          <p class="text-sm text-green-600">Delivered</p>
        </div>
        <div class="text-center p-4 bg-yellow-50 rounded-lg">
          <p class="text-2xl font-bold text-yellow-600">{{ messageStats.pending }}</p>
          <p class="text-sm text-yellow-600">Pending</p>
        </div>
        <div class="text-center p-4 bg-red-50 rounded-lg">
          <p class="text-2xl font-bold text-red-600">{{ messageStats.failed }}</p>
          <p class="text-sm text-red-600">Failed</p>
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
        <!-- SMS Outbox Tab -->
        <div v-if="activeTab === 'smsoutbox'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">SMS Outbox</h3>
            <div class="flex space-x-2">
              <button 
                @click="refreshOutbox"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span>Refresh</span>
              </button>
              <button 
                @click="exportOutbox"
                class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span>Export</span>
              </button>
            </div>
          </div>
          
          <!-- Filters & Search -->
          <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div class="flex flex-wrap gap-4">
              <!-- Status Filter -->
              <div class="flex items-center space-x-2">
                <label class="text-sm font-medium text-gray-700">Status:</label>
                <select 
                  v-model="smsFilters.status"
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="queued">Queued</option>
                  <option value="sent">Sent</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <!-- Date Range -->
              <div class="flex items-center space-x-2">
                <label class="text-sm font-medium text-gray-700">Date:</label>
                <input 
                  type="date" 
                  v-model="smsFilters.startDate"
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                <span class="text-gray-500">to</span>
                <input 
                  type="date" 
                  v-model="smsFilters.endDate"
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>

              <!-- Sender Filter -->
              <div class="flex items-center space-x-2">
                <label class="text-sm font-medium text-gray-700">Sender:</label>
                <select 
                  v-model="smsFilters.sender"
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Senders</option>
                  <option value="WEVAS">WEVAS</option>
                  <option value="INFO">INFO</option>
                  <option value="ALERTS">ALERTS</option>
                </select>
              </div>
            </div>

            <!-- Search -->
            <div class="relative">
              <input 
                v-model="smsFilters.search"
                type="text" 
                placeholder="Search messages..." 
                class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <!-- SMS Messages Table -->
          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr 
                    v-for="message in paginatedSmsMessages"
                    :key="message.id"
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="max-w-xs">
                        <div class="text-sm font-medium text-gray-900 truncate">{{ message.content }}</div>
                        <div class="text-xs text-gray-500">{{ message.content.length }} chars</div>
                      </div>
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ message.recipient }}</div>
                      <div class="text-xs text-gray-500">{{ message.recipientName || 'Unknown' }}</div>
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {{ message.sender }}
                      </span>
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        :class="[
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          statusClasses[message.status]
                        ]"
                      >
                        {{ message.status }}
                      </span>
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatDateTime(message.sentAt) }}
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ message.deliveredAt ? formatDateTime(message.deliveredAt) : '-' }}
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center justify-end space-x-2">
                        <button 
                          @click="viewMessage(message)"
                          class="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                        </button>
                        
                        <button 
                          @click="resendMessage(message)"
                          v-if="message.status === 'failed'"
                          class="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                          </svg>
                        </button>
                        
                        <button 
                          @click="deleteMessage(message)"
                          class="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
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
                      <span class="font-medium">{{ filteredSmsMessages.length }}</span>
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

        <!-- Message Outbox Tab -->
        <div v-if="activeTab === 'messageoutbox'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Message Outbox</h3>
            <div class="flex space-x-2">
              <button 
                @click="refreshMessageOutbox"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span>Refresh</span>
              </button>
              <button 
                @click="exportMessageOutbox"
                class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span>Export</span>
              </button>
            </div>
          </div>
          
          <!-- Message Outbox Table -->
          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr 
                    v-for="message in paginatedOutboxMessages"
                    :key="message.id"
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="max-w-xs">
                        <div class="text-sm font-medium text-gray-900 truncate">{{ message.subject }}</div>
                        <div class="text-xs text-gray-500">{{ message.preview }}</div>
                      </div>
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ message.recipients.toLocaleString() }}</div>
                      <div class="text-xs text-gray-500">{{ message.recipientType }}</div>
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        :class="[
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          typeClasses[message.type]
                        ]"
                      >
                        {{ message.type }}
                      </span>
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        :class="[
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          statusClasses[message.status]
                        ]"
                      >
                        {{ message.status }}
                      </span>
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatDateTime(message.createdAt) }}
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ message.scheduledAt ? formatDateTime(message.scheduledAt) : 'Immediate' }}
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center justify-end space-x-2">
                        <button 
                          @click="viewOutboxMessage(message)"
                          class="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                        </button>
                        
                        <button 
                          @click="editOutboxMessage(message)"
                          v-if="message.status === 'draft'"
                          class="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        
                        <button 
                          @click="deleteOutboxMessage(message)"
                          class="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
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
                      <span class="font-medium">{{ filteredOutboxMessages.length }}</span>
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

        <!-- Delivery Reports Tab -->
        <div v-if="activeTab === 'deliveryreports'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Delivery Reports</h3>
            <div class="flex space-x-2">
              <button 
                @click="generateReport"
                class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span>Generate Report</span>
              </button>
            </div>
          </div>
          
          <!-- Delivery Statistics -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Delivery Rate</h4>
              <div class="text-center">
                <div class="text-3xl font-bold text-green-600 mb-2">98.7%</div>
                <div class="text-sm text-gray-500">Last 30 days</div>
                <div class="mt-4">
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-green-500 h-2 rounded-full" style="width: 98.7%"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Average Delivery Time</h4>
              <div class="text-center">
                <div class="text-3xl font-bold text-blue-600 mb-2">2.3s</div>
                <div class="text-sm text-gray-500">Last 30 days</div>
                <div class="mt-4">
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full" style="width: 85%"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Failure Rate</h4>
              <div class="text-center">
                <div class="text-3xl font-bold text-red-600 mb-2">1.3%</div>
                <div class="text-sm text-gray-500">Last 30 days</div>
                <div class="mt-4">
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-red-500 h-2 rounded-full" style="width: 1.3%"></div>
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
interface SmsMessage {
  id: number
  content: string
  recipient: string
  recipientName?: string
  sender: string
  status: 'queued' | 'sent' | 'delivered' | 'failed' | 'pending'
  sentAt: string
  deliveredAt?: string
}

interface OutboxMessage {
  id: number
  subject: string
  preview: string
  recipients: number
  recipientType: string
  type: 'sms' | 'email' | 'push' | 'webhook'
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
  createdAt: string
  scheduledAt?: string
}

interface SmsFilters {
  status: string
  startDate: string
  endDate: string
  sender: string
  search: string
}

// Reactive data
const activeTab = ref('smsoutbox')
const showComposeModal = ref(false)
const showBulkModal = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10

// Filters
const smsFilters = ref<SmsFilters>({
  status: '',
  startDate: '',
  endDate: '',
  sender: '',
  search: ''
})

// Tabs
const tabs = [
  { id: 'smsoutbox', label: 'SMS Outbox', count: 1247 },
  { id: 'messageoutbox', label: 'Message Outbox', count: 89 },
  { id: 'deliveryreports', label: 'Delivery Reports', count: undefined }
]

// Status classes
const statusClasses = {
  queued: 'bg-yellow-100 text-yellow-800',
  sent: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  pending: 'bg-gray-100 text-gray-800',
  draft: 'bg-gray-100 text-gray-800',
  scheduled: 'bg-purple-100 text-purple-800',
  sending: 'bg-blue-100 text-blue-800'
}

const typeClasses = {
  sms: 'bg-blue-100 text-blue-800',
  email: 'bg-green-100 text-green-800',
  push: 'bg-purple-100 text-purple-800',
  webhook: 'bg-orange-100 text-orange-800'
}

// Sample data
const smsMessages = ref<SmsMessage[]>([
  {
    id: 1,
    content: 'Your order #12345 has been confirmed and will be delivered tomorrow.',
    recipient: '+1234567890',
    recipientName: 'John Doe',
    sender: 'WEVAS',
    status: 'delivered',
    sentAt: '2024-08-20T10:30:00Z',
    deliveredAt: '2024-08-20T10:30:05Z'
  },
  {
    id: 2,
    content: 'Reminder: Your appointment is scheduled for 2 PM today.',
    recipient: '+1234567891',
    recipientName: 'Jane Smith',
    sender: 'INFO',
    status: 'sent',
    sentAt: '2024-08-20T09:15:00Z'
  },
  {
    id: 3,
    content: 'Your verification code is 123456. Valid for 10 minutes.',
    recipient: '+1234567892',
    recipientName: 'Bob Johnson',
    sender: 'ALERTS',
    status: 'failed',
    sentAt: '2024-08-20T08:45:00Z'
  }
])

const outboxMessages = ref<OutboxMessage[]>([
  {
    id: 1,
    subject: 'Welcome to Wevas',
    preview: 'Thank you for joining our platform...',
    recipients: 1500,
    recipientType: 'New Users',
    type: 'sms',
    status: 'sent',
    createdAt: '2024-08-20T07:00:00Z'
  },
  {
    id: 2,
    subject: 'Monthly Newsletter',
    preview: 'Stay updated with our latest features...',
    recipients: 5000,
    recipientType: 'Subscribers',
    type: 'email',
    status: 'scheduled',
    createdAt: '2024-08-19T15:30:00Z',
    scheduledAt: '2024-08-21T09:00:00Z'
  },
  {
    id: 3,
    subject: 'Promotional Campaign',
    preview: 'Special offer for our valued customers...',
    recipients: 2500,
    recipientType: 'VIP Customers',
    type: 'sms',
    status: 'draft',
    createdAt: '2024-08-18T12:00:00Z'
  }
])

// Computed properties
const messageStats = computed(() => {
  const total = smsMessages.value.length
  const delivered = smsMessages.value.filter(m => m.status === 'delivered').length
  const pending = smsMessages.value.filter(m => m.status === 'pending' || m.status === 'queued').length
  const failed = smsMessages.value.filter(m => m.status === 'failed').length
  
  return { total, delivered, pending, failed }
})

const filteredSmsMessages = computed(() => {
  let filtered = [...smsMessages.value]
  
  if (smsFilters.value.status) {
    filtered = filtered.filter(m => m.status === smsFilters.value.status)
  }
  
  if (smsFilters.value.sender) {
    filtered = filtered.filter(m => m.sender === smsFilters.value.sender)
  }
  
  if (smsFilters.value.search) {
    const search = smsFilters.value.search.toLowerCase()
    filtered = filtered.filter(m => 
      m.content.toLowerCase().includes(search) || 
      m.recipient.includes(search) ||
      (m.recipientName && m.recipientName.toLowerCase().includes(search))
    )
  }
  
  return filtered
})

const filteredOutboxMessages = computed(() => {
  return [...outboxMessages.value]
})

const totalPages = computed(() => Math.ceil(filteredSmsMessages.value.length / itemsPerPage))

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredSmsMessages.value.length))

const paginatedSmsMessages = computed(() => {
  return filteredSmsMessages.value.slice(startIndex.value, endIndex.value)
})

const paginatedOutboxMessages = computed(() => {
  return filteredOutboxMessages.value
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
const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

const refreshOutbox = () => {
  console.log('Refreshing SMS outbox...')
}

const exportOutbox = () => {
  console.log('Exporting SMS outbox...')
}

const refreshMessageOutbox = () => {
  console.log('Refreshing message outbox...')
}

const exportMessageOutbox = () => {
  console.log('Exporting message outbox...')
}

const viewMessage = (message: SmsMessage) => {
  console.log('Viewing message:', message.id)
}

const resendMessage = (message: SmsMessage) => {
  console.log('Resending message:', message.id)
}

const deleteMessage = (message: SmsMessage) => {
  if (confirm(`Are you sure you want to delete this message?`)) {
    smsMessages.value = smsMessages.value.filter(m => m.id !== message.id)
  }
}

const viewOutboxMessage = (message: OutboxMessage) => {
  console.log('Viewing outbox message:', message.id)
}

const editOutboxMessage = (message: OutboxMessage) => {
  console.log('Editing outbox message:', message.id)
}

const deleteOutboxMessage = (message: OutboxMessage) => {
  if (confirm(`Are you sure you want to delete "${message.subject}"?`)) {
    outboxMessages.value = outboxMessages.value.filter(m => m.id !== message.id)
  }
}

const generateReport = () => {
  console.log('Generating delivery report...')
}

// Lifecycle
onMounted(() => {
  console.log('Message Manager mounted')
})
</script>

<style scoped>
.message-manager {
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

/* Status badge animations */
.status-badge {
  @apply transition-all duration-200;
}

.status-badge:hover {
  @apply transform scale-105;
}

/* Progress bar animations */
.bg-green-500,
.bg-blue-500,
.bg-red-500 {
  transition: width 0.5s ease-in-out;
}
</style>
