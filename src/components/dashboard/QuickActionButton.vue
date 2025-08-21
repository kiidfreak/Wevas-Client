<template>
  <button 
    @click="$emit('click', action)"
    :class="[
      'quick-action-btn w-full font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group',
      buttonClasses
    ]"
  >
    <!-- Icon -->
    <div 
      :class="[
        'w-5 h-5 transition-transform duration-300 group-hover:scale-110',
        iconColor
      ]"
    >
      <component :is="actionIcon" />
    </div>
    
    <!-- Text -->
    <span class="font-medium">{{ action.title }}</span>
    
    <!-- Arrow -->
    <svg 
      class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
      :class="iconColor"
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Action {
  id: number
  title: string
  icon: string
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'gray'
  action: string
}

interface Props {
  action: Action
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  click: [action: Action]
}>()

// Computed properties
const buttonClasses = computed(() => {
  const colors = {
    blue: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl',
    green: 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl',
    purple: 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl',
    yellow: 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg hover:shadow-xl',
    red: 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl',
    gray: 'bg-gray-600 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl'
  }
  return colors[props.action.color]
})

const iconColor = computed(() => {
  return 'text-current'
})

const actionIcon = computed(() => {
  const icons = {
    campaign: 'CampaignIcon',
    users: 'UsersIcon',
    dollar: 'DollarIcon',
    settings: 'SettingsIcon'
  }
  return icons[props.action.icon as keyof typeof icons] || 'CampaignIcon'
})

// Icon Components
const CampaignIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
    </svg>
  `
}

const UsersIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
    </svg>
  `
}

const DollarIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
    </svg>
  `
}

const SettingsIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
    </svg>
  `
}
</script>

<style scoped>
.quick-action-btn {
  @apply relative overflow-hidden;
}

.quick-action-btn::before {
  content: '';
  @apply absolute inset-0 bg-white opacity-0 transition-opacity duration-300;
}

.quick-action-btn:hover::before {
  @apply opacity-10;
}

.quick-action-btn:active {
  @apply transform scale-95;
}

/* Smooth transitions */
.quick-action-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
