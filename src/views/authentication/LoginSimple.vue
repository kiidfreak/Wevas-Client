<template>
  <div class="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-50">
    <!-- Illustration / Brand Panel -->
    <div class="hidden lg:flex items-center justify-center bg-white p-10">
      <div class="max-w-md text-white">
        <img src="/logo.png" alt="Wevas" class="h-10 w-auto mb-6" />
        <h2 class="text-3xl font-bold leading-tight mb-3 text-gray-900">Welcome back</h2>
        <p class="text-gray-600">Engage your audience with powerful SMS campaigns and real-time insights.</p>
        <img src="https://illustrations.popsy.co/gray/shopping-bags.svg" alt="Illustration" class="mt-10 drop-shadow-xl" />
      </div>
    </div>

    <!-- Login Card -->
    <div class="flex items-center justify-center p-8">
      <div class="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-1">Sign in</h1>
        <!-- <p class="text-sm text-gray-600 mb-6">Use demo: admin@demo.com / admin</p> -->

        <form @submit.prevent="onSubmit" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="admin@demo.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
              class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full inline-flex justify-center items-center rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          >
            <svg v-if="isLoading" class="-ml-1 mr-3 h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Sign in
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const email = ref('admin@demo.com')
const password = ref('admin')
const errorMessage = ref<string | null>(null)

const isLoading = auth.isLoading

async function onSubmit() {
  errorMessage.value = null
  const { success, error } = await auth.login({ email: email.value.trim(), password: password.value })
  if (success) {
    const redirect = (route.query.redirect as string) || '/'
    router.replace(redirect)
  } else {
    errorMessage.value = error || 'Login failed'
  }
}
</script>

<style scoped>
</style>


