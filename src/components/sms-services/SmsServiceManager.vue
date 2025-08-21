<template>
  <div class="sms-service-manager">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">SMS Services Management</h2>
          <p class="text-gray-600 mt-1">Configure short codes, premium SMS services, and manage service settings</p>
        </div>
        
        <div class="flex space-x-3">
          <button 
            @click="showShortCodeModal = true"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>New Short Code</span>
          </button>
          
          <button 
            @click="showPremiumModal = true"
            class="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.592 1L21 12h-3.812c-.668 1.953-2.705 3.5-5.188 3.5-3.007 0-5.5-1.25-5.5-3.5s2.493-3.5 5.5-3.5z"></path>
            </svg>
            <span>New Premium Service</span>
          </button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-blue-50 rounded-lg">
          <p class="text-2xl font-bold text-blue-600">{{ serviceStats.totalShortCodes }}</p>
          <p class="text-sm text-blue-600">Active Short Codes</p>
        </div>
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <p class="text-2xl font-bold text-green-600">{{ serviceStats.totalPremium }}</p>
          <p class="text-sm text-green-600">Premium Services</p>
        </div>
        <div class="text-center p-4 bg-purple-50 rounded-lg">
          <p class="text-2xl font-bold text-purple-600">{{ serviceStats.totalRevenue }}</p>
          <p class="text-sm text-purple-600">Monthly Revenue</p>
        </div>
        <div class="text-center p-4 bg-yellow-50 rounded-lg">
          <p class="text-2xl font-bold text-yellow-600">{{ serviceStats.totalMessages }}</p>
          <p class="text-sm text-yellow-600">Messages Sent</p>
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
        <!-- Short Codes Tab -->
        <div v-if="activeTab === 'shortcodes'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Short Codes Management</h3>
            <div class="flex space-x-2">
              <button 
                @click="refreshShortCodes"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span>Refresh</span>
              </button>
              <button 
                @click="exportShortCodes"
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
                  v-model="shortCodeFilters.status"
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <!-- Type Filter -->
              <div class="flex items-center space-x-2">
                <label class="text-sm font-medium text-gray-700">Type:</label>
                <select 
                  v-model="shortCodeFilters.type"
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="info">Info</option>
                  <option value="premium">Premium</option>
                  <option value="voting">Voting</option>
                  <option value="subscription">Subscription</option>
                </select>
              </div>

              <!-- Country Filter -->
              <div class="flex items-center space-x-2">
                <label class="text-sm font-medium text-gray-700">Country:</label>
                <select 
                  v-model="shortCodeFilters.country"
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Countries</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>

            <!-- Search -->
            <div class="relative">
              <input 
                v-model="shortCodeFilters.search"
                type="text" 
                placeholder="Search short codes..." 
                class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <!-- Short Codes Table -->
          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short Code</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr 
                    v-for="shortCode in paginatedShortCodes"
                    :key="shortCode.id"
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <div class="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <span class="text-lg font-bold text-blue-600">{{ shortCode.code }}</span>
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ shortCode.code }}</div>
                          <div class="text-sm text-gray-500">{{ shortCode.description }}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ shortCode.serviceName }}</div>
                      <div class="text-xs text-gray-500">{{ shortCode.serviceDescription }}</div>
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        :class="[
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          typeClasses[shortCode.type]
                        ]"
                      >
                        {{ shortCode.type }}
                      </span>
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        :class="[
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          statusClasses[shortCode.status]
                        ]"
                      >
                        {{ shortCode.status }}
                      </span>
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ shortCode.country }}
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div class="text-sm font-medium text-gray-900">{{ shortCode.monthlyRevenue }}</div>
                      <div class="text-xs text-gray-500">{{ shortCode.totalRevenue }} total</div>
                    </td>
                    
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center justify-end space-x-2">
                        <button 
                          @click="viewShortCode(shortCode)"
                          class="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                        </button>
                        
                        <button 
                          @click="editShortCode(shortCode)"
                          class="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        
                        <button 
                          @click="toggleShortCode(shortCode)"
                          :class="[
                            'p-1 rounded transition-colors',
                            shortCode.status === 'active' 
                              ? 'text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50' 
                              : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                          ]"
                        >
                          <svg v-if="shortCode.status === 'active'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </button>
                        
                        <button 
                          @click="deleteShortCode(shortCode)"
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
                      <span class="font-medium">{{ filteredShortCodes.length }}</span>
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

        <!-- Premium SMS Tab -->
        <div v-if="activeTab === 'premiumsms'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Premium SMS Services</h3>
            <div class="flex space-x-2">
              <button 
                @click="refreshPremiumServices"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span>Refresh</span>
              </button>
              <button 
                @click="exportPremiumServices"
                class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span>Export</span>
              </button>
            </div>
          </div>
          
          <!-- Premium Services Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="service in premiumServices"
              :key="service.id"
              class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.592 1L21 12h-3.812c-.668 1.953-2.705 3.5-5.188 3.5-3.007 0-5.5-1.25-5.5-3.5s2.493-3.5 5.5-3.5z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-gray-900">{{ service.name }}</h4>
                    <p class="text-sm text-gray-500">{{ service.shortCode }}</p>
                  </div>
                </div>
                
                <span 
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    statusClasses[service.status]
                  ]"
                >
                  {{ service.status }}
                </span>
              </div>
              
              <p class="text-gray-600 mb-4">{{ service.description }}</p>
              
              <div class="space-y-3 mb-4">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Price:</span>
                  <span class="font-medium text-gray-900">{{ service.price }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Monthly Revenue:</span>
                  <span class="font-medium text-green-600">{{ service.monthlyRevenue }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Messages Sent:</span>
                  <span class="font-medium text-gray-900">{{ service.messagesSent.toLocaleString() }}</span>
                </div>
              </div>
              
              <div class="flex space-x-2">
                <button 
                  @click="viewPremiumService(service)"
                  class="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  View
                </button>
                <button 
                  @click="editPremiumService(service)"
                  class="flex-1 bg-green-100 hover:bg-green-200 text-green-700 font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  Edit
                </button>
                <button 
                  @click="deletePremiumService(service)"
                  class="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Service Configuration Tab -->
        <div v-if="activeTab === 'configuration'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Service Configuration</h3>
            <button 
              @click="saveConfiguration"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
          
          <!-- Configuration Forms -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- General Settings -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">General Settings</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Default Sender ID</label>
                  <input 
                    v-model="configuration.defaultSenderId"
                    type="text" 
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="WEVAS"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Message Rate Limit</label>
                  <input 
                    v-model="configuration.messageRateLimit"
                    type="number" 
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100"
                  >
                  <p class="text-xs text-gray-500 mt-1">Messages per minute per sender</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Timeout</label>
                  <input 
                    v-model="configuration.deliveryTimeout"
                    type="number" 
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="300"
                  >
                  <p class="text-xs text-gray-500 mt-1">Seconds before message expires</p>
                </div>
              </div>
            </div>
            
            <!-- API Settings -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">API Configuration</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">API Version</label>
                  <select 
                    v-model="configuration.apiVersion"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="v1">v1.0</option>
                    <option value="v2">v2.0</option>
                    <option value="v3">v3.0</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                  <input 
                    v-model="configuration.webhookUrl"
                    type="url" 
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://your-domain.com/webhook"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Retry Attempts</label>
                  <input 
                    v-model="configuration.retryAttempts"
                    type="number" 
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="3"
                  >
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
interface ShortCode {
  id: number
  code: string
  description: string
  serviceName: string
  serviceDescription: string
  type: 'info' | 'premium' | 'voting' | 'subscription'
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  country: string
  monthlyRevenue: string
  totalRevenue: string
}

interface PremiumService {
  id: number
  name: string
  shortCode: string
  description: string
  status: 'active' | 'inactive' | 'pending'
  price: string
  monthlyRevenue: string
  messagesSent: number
}

interface ShortCodeFilters {
  status: string
  type: string
  country: string
  search: string
}

interface Configuration {
  defaultSenderId: string
  messageRateLimit: number
  deliveryTimeout: number
  apiVersion: string
  webhookUrl: string
  retryAttempts: number
}

// Reactive data
const activeTab = ref('shortcodes')
const showShortCodeModal = ref(false)
const showPremiumModal = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10

// Filters
const shortCodeFilters = ref<ShortCodeFilters>({
  status: '',
  type: '',
  country: '',
  search: ''
})

// Configuration
const configuration = ref<Configuration>({
  defaultSenderId: 'WEVAS',
  messageRateLimit: 100,
  deliveryTimeout: 300,
  apiVersion: 'v2',
  webhookUrl: 'https://your-domain.com/webhook',
  retryAttempts: 3
})

// Tabs
const tabs = [
  { id: 'shortcodes', label: 'Short Codes', count: 24 },
  { id: 'premiumsms', label: 'Premium SMS', count: 8 },
  { id: 'configuration', label: 'Configuration', count: undefined }
]

// Status classes
const statusClasses = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  suspended: 'bg-red-100 text-red-800'
}

const typeClasses = {
  info: 'bg-blue-100 text-blue-800',
  premium: 'bg-purple-100 text-purple-800',
  voting: 'bg-green-100 text-green-800',
  subscription: 'bg-orange-100 text-orange-800'
}

// Sample data
const shortCodes = ref<ShortCode[]>([
  {
    id: 1,
    code: '12345',
    description: 'Customer Support',
    serviceName: 'Wevas Support',
    serviceDescription: '24/7 customer support service',
    type: 'info',
    status: 'active',
    country: 'US',
    monthlyRevenue: '$1,250',
    totalRevenue: '$15,000'
  },
  {
    id: 2,
    code: '67890',
    description: 'Premium Horoscope',
    serviceName: 'Daily Horoscope',
    serviceDescription: 'Daily personalized horoscope',
    type: 'premium',
    status: 'active',
    country: 'US',
    monthlyRevenue: '$3,500',
    totalRevenue: '$42,000'
  },
  {
    id: 3,
    code: '11111',
    description: 'Voting Service',
    serviceName: 'Poll Master',
    serviceDescription: 'Interactive voting and polls',
    type: 'voting',
    status: 'pending',
    country: 'CA',
    monthlyRevenue: '$800',
    totalRevenue: '$9,600'
  }
])

const premiumServices = ref<PremiumService[]>([
  {
    id: 1,
    name: 'Daily Horoscope',
    shortCode: '67890',
    description: 'Get your daily personalized horoscope delivered to your phone every morning.',
    status: 'active',
    price: '$2.99/month',
    monthlyRevenue: '$3,500',
    messagesSent: 12500
  },
  {
    id: 2,
    name: 'Weather Alerts',
    shortCode: '22222',
    description: 'Severe weather warnings and daily forecasts for your location.',
    status: 'active',
    price: '$1.99/month',
    monthlyRevenue: '$2,800',
    messagesSent: 18750
  },
  {
    id: 3,
    name: 'Stock Alerts',
    shortCode: '33333',
    description: 'Real-time stock price alerts and market updates.',
    status: 'inactive',
    price: '$4.99/month',
    monthlyRevenue: '$1,200',
    messagesSent: 8500
  }
])

// Computed properties
const serviceStats = computed(() => {
  const totalShortCodes = shortCodes.value.filter(sc => sc.status === 'active').length
  const totalPremium = premiumServices.value.filter(ps => ps.status === 'active').length
  const totalRevenue = shortCodes.value.reduce((sum, sc) => {
    const revenue = parseFloat(sc.monthlyRevenue.replace('$', '').replace(',', ''))
    return sum + revenue
  }, 0)
  const totalMessages = premiumServices.value.reduce((sum, ps) => sum + ps.messagesSent, 0)
  
  return { 
    totalShortCodes, 
    totalPremium, 
    totalRevenue: `$${totalRevenue.toLocaleString()}`, 
    totalMessages: totalMessages.toLocaleString() 
  }
})

const filteredShortCodes = computed(() => {
  let filtered = [...shortCodes.value]
  
  if (shortCodeFilters.value.status) {
    filtered = filtered.filter(sc => sc.status === shortCodeFilters.value.status)
  }
  
  if (shortCodeFilters.value.type) {
    filtered = filtered.filter(sc => sc.type === shortCodeFilters.value.type)
  }
  
  if (shortCodeFilters.value.country) {
    filtered = filtered.filter(sc => sc.country === shortCodeFilters.value.country)
  }
  
  if (shortCodeFilters.value.search) {
    const search = shortCodeFilters.value.search.toLowerCase()
    filtered = filtered.filter(sc => 
      sc.code.includes(search) || 
      sc.description.toLowerCase().includes(search) ||
      sc.serviceName.toLowerCase().includes(search)
    )
  }
  
  return filtered
})

const totalPages = computed(() => Math.ceil(filteredShortCodes.value.length / itemsPerPage))

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredShortCodes.value.length))

const paginatedShortCodes = computed(() => {
  return filteredShortCodes.value.slice(startIndex.value, endIndex.value)
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
const refreshShortCodes = () => {
  console.log('Refreshing short codes...')
}

const exportShortCodes = () => {
  console.log('Exporting short codes...')
}

const refreshPremiumServices = () => {
  console.log('Refreshing premium services...')
}

const exportPremiumServices = () => {
  console.log('Exporting premium services...')
}

const viewShortCode = (shortCode: ShortCode) => {
  console.log('Viewing short code:', shortCode.id)
}

const editShortCode = (shortCode: ShortCode) => {
  console.log('Editing short code:', shortCode.id)
}

const toggleShortCode = (shortCode: ShortCode) => {
  if (shortCode.status === 'active') {
    shortCode.status = 'inactive'
  } else {
    shortCode.status = 'active'
  }
}

const deleteShortCode = (shortCode: ShortCode) => {
  if (confirm(`Are you sure you want to delete short code ${shortCode.code}?`)) {
    shortCodes.value = shortCodes.value.filter(sc => sc.id !== shortCode.id)
  }
}

const viewPremiumService = (service: PremiumService) => {
  console.log('Viewing premium service:', service.id)
}

const editPremiumService = (service: PremiumService) => {
  console.log('Editing premium service:', service.id)
}

const deletePremiumService = (service: PremiumService) => {
  if (confirm(`Are you sure you want to delete "${service.name}"?`)) {
    premiumServices.value = premiumServices.value.filter(ps => ps.id !== service.id)
  }
}

const saveConfiguration = () => {
  console.log('Saving configuration:', configuration.value)
  // API call to save configuration
}

// Lifecycle
onMounted(() => {
  console.log('SMS Service Manager mounted')
})
</script>

<style scoped>
.sms-service-manager {
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

/* Card hover effects */
.grid > div:hover {
  @apply transform -translate-y-1;
}

/* Input focus effects */
input:focus,
select:focus {
  @apply ring-2 ring-blue-500 border-transparent;
}
</style>
