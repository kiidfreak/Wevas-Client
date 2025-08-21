<template>
  <!-- Coming soon page-->
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <div class="p-6">
      <RouterLink to="/" class="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
        <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-blue-600">
          SWIFTT SMS
        </h2>
      </RouterLink>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex items-center justify-center px-4">
      <div class="max-w-md w-full text-center">
        <div class="mb-8">
          <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            We are launching soon 🚀
          </h1>
          <p class="text-lg text-gray-600 mb-8">
            We're creating something awesome. Please subscribe to get notified when it's ready!
          </p>
        </div>

        <!-- Subscribe Form -->
        <form @submit.prevent="handleSubscribe" class="space-y-4">
          <div class="flex flex-col sm:flex-row gap-3">
            <input
              v-model="email"
              type="email"
              placeholder="john@example.com"
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="isSubmitting">Subscribing...</span>
              <span v-else>Notify Me</span>
            </button>
          </div>
        </form>

        <!-- Success Message -->
        <div v-if="isSubscribed" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center justify-center space-x-2 text-green-800">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="font-medium">Successfully subscribed! We'll notify you when we launch.</span>
          </div>
        </div>

        <!-- Illustration -->
        <div class="mt-12">
          <div class="w-64 h-48 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg mx-auto flex items-center justify-center">
            <svg class="w-24 h-24 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-6 text-center text-gray-500">
      <p>&copy; 2024 SWIFTT SMS. All rights reserved.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

// Reactive state
const email = ref('')
const isSubmitting = ref(false)
const isSubscribed = ref(false)

// Handle form submission
const handleSubscribe = async () => {
  if (!email.value || isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Show success message
    isSubscribed.value = true
    email.value = ''
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      isSubscribed.value = false
    }, 5000)
    
  } catch (error) {
    console.error('Subscription failed:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
