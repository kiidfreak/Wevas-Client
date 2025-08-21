<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">API Keys</h3>
        <p class="text-sm text-gray-600">Manage your API credentials</p>
      </div>
      <button 
        @click="generateNewKey"
        :disabled="isGenerating"
        class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
      >
        <svg v-if="isGenerating" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>{{ isGenerating ? 'Generating...' : 'Generate New Key' }}</span>
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Key</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="key in keys" :key="key.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-900">{{ key.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-900">
              <span class="px-2 py-1 rounded bg-gray-100">{{ key.value }}</span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ new Date(key.createdAt).toLocaleString() }}</td>
            <td class="px-6 py-4 text-right">
              <button 
                @click="copyKey(key.value)"
                class="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                title="Copy to clipboard"
              >
                Copy
              </button>
              <button 
                @click="revokeKey(key.id)"
                class="text-red-600 hover:text-red-900 transition-colors"
                title="Revoke API key"
              >
                Revoke
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface ApiKeyRow {
  id: number
  name: string
  value: string
  createdAt: string
}

const keys = ref<ApiKeyRow[]>([
  { id: 1, name: 'Production', value: 'prod_************abcd', createdAt: '2024-08-15T09:00:00Z' },
  { id: 2, name: 'Staging', value: 'stg_************wxyz', createdAt: '2024-08-16T12:30:00Z' },
])

const isGenerating = ref(false)

// Generate a new API key
const generateNewKey = async () => {
  isGenerating.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const newKey: ApiKeyRow = {
      id: Date.now(),
      name: `API Key ${keys.value.length + 1}`,
      value: `key_${Math.random().toString(36).substr(2, 15)}`,
      createdAt: new Date().toISOString()
    }
    
    keys.value.unshift(newKey)
    
    alert('New API key generated successfully!')
    
  } catch (error) {
    console.error('Error generating API key:', error)
    alert('Failed to generate API key. Please try again.')
  } finally {
    isGenerating.value = false
  }
}

// Copy API key to clipboard
const copyKey = async (keyValue: string) => {
  try {
    await navigator.clipboard.writeText(keyValue)
    alert('API key copied to clipboard!')
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = keyValue
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('API key copied to clipboard!')
  }
}

// Revoke API key
const revokeKey = (keyId: number) => {
  if (confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
    const index = keys.value.findIndex(key => key.id === keyId)
    if (index > -1) {
      keys.value.splice(index, 1)
      alert('API key revoked successfully!')
    }
  }
}
</script>

<style scoped>
</style>


