<template>
  <div class="activity-item flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
    <!-- Status Icon -->
    <div 
      :class="[
        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
        statusIconBg
      ]"
    >
      <component :is="activityIcon" class="w-4 h-4" :class="statusIconColor" />
    </div>
    
    <!-- Content -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-900 truncate">{{ activity.title }}</p>
      <p class="text-xs text-gray-500 truncate">{{ activity.description }}</p>
    </div>
    
    <!-- Time & Actions -->
    <div class="flex items-center space-x-2 flex-shrink-0">
      <span class="text-xs text-gray-400">{{ activity.time }}</span>
      
      <!-- Action Menu -->
      <div class="relative">
        <button 
          @click="showMenu = !showMenu"
          class="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
          </svg>
        </button>
        
        <!-- Dropdown Menu -->
        <div 
          v-if="showMenu"
          class="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
        >
          <button 
            v-for="action in menuActions"
            :key="action.id"
            @click="handleAction(action)"
            class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {{ action.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Props
interface Activity {
  id: number
  type: string
  title: string
  description: string
  time: string
  status: 'success' | 'info' | 'warning' | 'error'
}

interface Props {
  activity: Activity
}

const props = defineProps<Props>()

// Reactive data
const showMenu = ref(false)

// Computed properties
const statusIconBg = computed(() => {
  const colors = {
    success: 'bg-green-100',
    info: 'bg-blue-100',
    warning: 'bg-yellow-100',
    error: 'bg-red-100'
  }
  return colors[props.activity.status]
})

const statusIconColor = computed(() => {
  const colors = {
    success: 'text-green-600',
    info: 'text-blue-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  }
  return colors[props.activity.status]
})

const activityIcon = computed(() => {
  const icons = {
    campaign: 'CampaignIcon',
    contacts: 'ContactsIcon',
    topup: 'TopupIcon',
    api: 'ApiIcon'
  }
  return icons[props.activity.type as keyof typeof icons] || 'InfoIcon'
})

const menuActions = computed(() => {
  const actions = [
    { id: 1, label: 'View Details', action: 'view' },
    { id: 2, label: 'Copy Link', action: 'copy' },
    { id: 3, label: 'Mark as Read', action: 'mark-read' }
  ]
  return actions
})

// Methods
const handleAction = (action: any) => {
  console.log('Action clicked:', action.action, 'for activity:', props.activity.id)
  showMenu.value = false
  // Emit event or handle action
}

// Close menu when clicking outside
const closeMenu = () => {
  showMenu.value = false
}

// Icon Components
const CampaignIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
    </svg>
  `
}

const ContactsIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
    </svg>
  `
}

const TopupIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
    </svg>
  `
}

const ApiIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
    </svg>
  `
}

const InfoIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `
}
</script>

<style scoped>
.activity-item {
  @apply relative;
}

.activity-item:hover {
  @apply transform scale-[1.02];
}

/* Smooth transitions */
.activity-item {
  transition: all 0.2s ease-in-out;
}
</style>
