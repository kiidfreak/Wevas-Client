<template>
  <div class="contact-groups">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Contact Groups</h1>
        <p class="text-gray-600 mt-1">Organize your contacts into targeted groups for campaigns</p>
      </div>
      <button 
        @click="showCreateModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        <span>Create Group</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Groups</p>
            <p class="text-2xl font-bold text-gray-900">{{ contactGroups.length }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Contacts</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalContacts.toLocaleString() }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Active Groups</p>
            <p class="text-2xl font-bold text-gray-900">{{ activeGroups }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Avg Group Size</p>
            <p class="text-2xl font-bold text-gray-900">{{ Math.round(totalContacts / contactGroups.length).toLocaleString() }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Groups Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <!-- Table Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Contact Groups</h3>
          <div class="flex items-center space-x-4">
            <div class="relative">
              <input 
                type="text" 
                placeholder="Search groups..." 
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                v-model="searchQuery"
              >
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Content -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacts</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Campaign</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="group in filteredGroups" :key="group.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div :class="[
                      'h-10 w-10 rounded-lg flex items-center justify-center text-white font-semibold',
                      group.color
                    ]">
                      {{ group.name.charAt(0).toUpperCase() }}
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ group.name }}</div>
                    <div class="text-sm text-gray-500">{{ group.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ group.contactCount.toLocaleString() }}</div>
                <div class="text-sm text-gray-500">contacts</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  group.status === 'active' ? 'bg-green-100 text-green-800' : 
                  group.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                  'bg-yellow-100 text-yellow-800'
                ]">
                  {{ group.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ group.createdAt }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ group.lastCampaign || 'Never' }}
              </td>
                             <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                 <div class="flex items-center space-x-2">
                   <button @click="editGroup(group)" class="text-blue-600 hover:text-blue-900">Edit</button>
                   <button @click="createCampaign(group)" class="text-green-600 hover:text-green-900">Campaign</button>
                   <button @click="deleteGroup(group)" class="text-red-600 hover:text-red-900">Delete</button>
                 </div>
               </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Group Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Create New Contact Group</h3>
            <button 
              @click="showCreateModal = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="createGroup" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
              <input 
                v-model="newGroup.name"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter group name"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea 
                v-model="newGroup.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter group description"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Group Color</label>
              <div class="grid grid-cols-6 gap-2">
                <button 
                  v-for="color in groupColors" 
                  :key="color.value"
                  type="button"
                  @click="newGroup.color = color.value"
                  :class="[
                    'w-8 h-8 rounded-lg border-2 transition-all',
                    color.value,
                    newGroup.color === color.value ? 'border-gray-800 scale-110' : 'border-gray-300 hover:scale-105'
                  ]"
                  :title="color.name"
                ></button>
              </div>
            </div>
            
            <div class="flex items-center justify-end space-x-3 pt-4">
              <button 
                type="button"
                @click="showCreateModal = false"
                class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                :disabled="isCreating"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <svg v-if="isCreating" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isCreating ? 'Creating...' : 'Create Group' }}</span>
              </button>
            </div>
          </form>
                 </div>
       </div>
     </div>

     <!-- Edit Group Modal -->
     <div v-if="showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
       <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
         <div class="mt-3">
           <div class="flex items-center justify-between mb-4">
             <h3 class="text-lg font-semibold text-gray-900">Edit Contact Group</h3>
             <button 
               @click="showEditModal = false"
               class="text-gray-400 hover:text-gray-600"
             >
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
               </svg>
             </button>
           </div>
           
           <form @submit.prevent="updateGroup" class="space-y-4">
             <div>
               <label class="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
               <input 
                 v-model="editingGroup.name"
                 type="text" 
                 required
                 class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 placeholder="Enter group name"
               >
             </div>
             
             <div>
               <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
               <textarea 
                 v-model="editingGroup.description"
                 rows="3"
                 class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 placeholder="Enter group description"
               ></textarea>
             </div>
             
             <div>
               <label class="block text-sm font-medium text-gray-700 mb-2">Group Color</label>
               <div class="grid grid-cols-6 gap-2">
                 <button 
                   v-for="color in groupColors" 
                   :key="color.value"
                   type="button"
                   @click="editingGroup.color = color.value"
                   :class="[
                     'w-8 h-8 rounded-lg border-2 transition-all',
                     color.value,
                     editingGroup.color === color.value ? 'border-gray-800 scale-110' : 'border-gray-300 hover:scale-105'
                   ]"
                   :title="color.name"
                 ></button>
               </div>
             </div>
             
             <div class="flex items-center justify-end space-x-3 pt-4">
               <button 
                 type="button"
                 @click="showEditModal = false"
                 class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
               >
                 Cancel
               </button>
               <button 
                 type="submit"
                 :disabled="isEditing"
                 class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center space-x-2"
               >
                 <svg v-if="isEditing" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                   <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                   <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 <span>{{ isEditing ? 'Updating...' : 'Update Group' }}</span>
               </button>
             </div>
           </form>
         </div>
       </div>
     </div>

     <!-- Create Campaign Modal -->
     <div v-if="showCampaignModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
       <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
         <div class="mt-3">
           <div class="flex items-center justify-between mb-4">
             <h3 class="text-lg font-semibold text-gray-900">Create Campaign</h3>
             <button 
               @click="showCampaignModal = false"
               class="text-gray-400 hover:text-gray-600"
             >
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
               </svg>
             </button>
           </div>
           
           <div class="space-y-4">
             <div class="p-4 bg-blue-50 rounded-lg">
               <p class="text-sm font-medium text-blue-900">Target Group</p>
               <p class="text-lg font-bold text-blue-700">{{ editingGroup?.name }}</p>
               <p class="text-sm text-blue-600">{{ editingGroup?.contactCount?.toLocaleString() }} contacts</p>
             </div>
             
             <div>
               <label class="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
               <input 
                 type="text" 
                 class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 placeholder="Enter campaign name"
               >
             </div>
             
             <div>
               <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
               <textarea 
                 rows="4"
                 class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 placeholder="Enter your SMS message"
               ></textarea>
             </div>
             
             <div class="flex items-center justify-end space-x-3 pt-4">
               <button 
                 type="button"
                 @click="showCampaignModal = false"
                 class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
               >
                 Cancel
               </button>
               <button 
                 type="button"
                 @click="showCampaignModal = false"
                 class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
               >
                 Create Campaign
               </button>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showCampaignModal = ref(false)
const isCreating = ref(false)
const isEditing = ref(false)
const isDeleting = ref(false)
const editingGroup = ref<any>(null)

const newGroup = ref({
  name: '',
  description: '',
  color: 'bg-blue-600'
})

const groupColors = [
  { name: 'Blue', value: 'bg-blue-600' },
  { name: 'Green', value: 'bg-green-600' },
  { name: 'Purple', value: 'bg-purple-600' },
  { name: 'Indigo', value: 'bg-indigo-600' },
  { name: 'Pink', value: 'bg-pink-600' },
  { name: 'Yellow', value: 'bg-yellow-600' },
  { name: 'Red', value: 'bg-red-600' },
  { name: 'Gray', value: 'bg-gray-600' },
  { name: 'Teal', value: 'bg-teal-600' },
  { name: 'Orange', value: 'bg-orange-600' }
]

const contactGroups = ref([
  {
    id: 1,
    name: 'VIP Customers',
    description: 'High-value customers with premium memberships',
    contactCount: 1247,
    status: 'active',
    color: 'bg-blue-600',
    createdAt: '2024-01-15',
    lastCampaign: '2024-01-20'
  },
  {
    id: 2,
    name: 'New Subscribers',
    description: 'Recently registered users',
    contactCount: 3892,
    status: 'active',
    color: 'bg-green-600',
    createdAt: '2024-01-10',
    lastCampaign: '2024-01-18'
  },
  {
    id: 3,
    name: 'Newsletter Subscribers',
    description: 'Weekly newsletter recipients',
    contactCount: 15623,
    status: 'active',
    color: 'bg-purple-600',
    createdAt: '2023-12-01',
    lastCampaign: '2024-01-19'
  },
  {
    id: 4,
    name: 'Inactive Users',
    description: 'Users who haven\'t engaged in 90+ days',
    contactCount: 2156,
    status: 'inactive',
    color: 'bg-gray-600',
    createdAt: '2023-11-15',
    lastCampaign: null
  },
  {
    id: 5,
    name: 'Mobile App Users',
    description: 'Users who downloaded our mobile app',
    contactCount: 8934,
    status: 'active',
    color: 'bg-indigo-600',
    createdAt: '2023-10-20',
    lastCampaign: '2024-01-17'
  },
  {
    id: 6,
    name: 'Event Attendees',
    description: 'People who attended our recent events',
    contactCount: 567,
    status: 'active',
    color: 'bg-pink-600',
    createdAt: '2024-01-08',
    lastCampaign: '2024-01-16'
  },
  {
    id: 7,
    name: 'Beta Testers',
    description: 'Early adopters testing new features',
    contactCount: 234,
    status: 'active',
    color: 'bg-yellow-600',
    createdAt: '2024-01-05',
    lastCampaign: '2024-01-14'
  },
  {
    id: 8,
    name: 'International Customers',
    description: 'Customers outside domestic market',
    contactCount: 4521,
    status: 'active',
    color: 'bg-red-600',
    createdAt: '2023-09-12',
    lastCampaign: '2024-01-12'
  }
])

const totalContacts = computed(() => {
  return contactGroups.value.reduce((sum, group) => sum + group.contactCount, 0)
})

const activeGroups = computed(() => {
  return contactGroups.value.filter(group => group.status === 'active').length
})

const filteredGroups = computed(() => {
  if (!searchQuery.value) {
    return contactGroups.value
  }
  return contactGroups.value.filter(group => 
    group.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Create new contact group
const createGroup = async () => {
  if (!newGroup.value.name.trim()) return
  
  isCreating.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newGroupData = {
      id: contactGroups.value.length + 1,
      name: newGroup.value.name.trim(),
      description: newGroup.value.description.trim() || 'No description provided',
      contactCount: 0,
      status: 'active',
      color: newGroup.value.color,
      createdAt: new Date().toISOString().split('T')[0] || '2024-01-01',
      lastCampaign: null
    }
    
    contactGroups.value.unshift(newGroupData)
    
    // Reset form
    newGroup.value = {
      name: '',
      description: '',
      color: 'bg-blue-600'
    }
    
    // Close modal
    showCreateModal.value = false
    
    // Show success feedback (you could add a toast notification here)
    console.log('Contact group created successfully!')
    
  } catch (error) {
    console.error('Error creating contact group:', error)
  } finally {
    isCreating.value = false
  }
}

// Edit contact group
const editGroup = (group: any) => {
  editingGroup.value = { ...group }
  showEditModal.value = true
}

// Update contact group
const updateGroup = async () => {
  if (!editingGroup.value?.name.trim()) return
  
  isEditing.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const index = contactGroups.value.findIndex(g => g.id === editingGroup.value.id)
    if (index !== -1) {
      contactGroups.value[index] = { ...editingGroup.value }
    }
    
    // Close modal
    showEditModal.value = false
    editingGroup.value = null
    
    console.log('Contact group updated successfully!')
    
  } catch (error) {
    console.error('Error updating contact group:', error)
  } finally {
    isEditing.value = false
  }
}

// Create campaign for group
const createCampaign = (group: any) => {
  showCampaignModal.value = true
  editingGroup.value = group
}

// Delete contact group
const deleteGroup = async (group: any) => {
  if (!confirm(`Are you sure you want to delete "${group.name}"? This action cannot be undone.`)) {
    return
  }
  
  isDeleting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const index = contactGroups.value.findIndex(g => g.id === group.id)
    if (index !== -1) {
      contactGroups.value.splice(index, 1)
    }
    
    console.log('Contact group deleted successfully!')
    
  } catch (error) {
    console.error('Error deleting contact group:', error)
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
.contact-groups {
  @apply p-6;
}
</style>
