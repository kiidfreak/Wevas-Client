import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Route components
import DashboardStats from '@/components/dashboard/DashboardStats.vue'
import CampaignManager from '@/components/campaigns/CampaignManager.vue'
import ContactManager from '@/components/contacts/ContactManager.vue'
import MessageManager from '@/components/messages/MessageManager.vue'
import SmsServiceManager from '@/components/sms-services/SmsServiceManager.vue'
import SystemManager from '@/components/system/SystemManager.vue'
import UsageStats from '@/components/usage/UsageStats.vue'
import ApiKeys from '@/components/system/ApiKeys.vue'
import LoginPage from '@/views/authentication/LoginSimple.vue'

// Import existing route modules
// Legacy route modules (Vue 2) disabled in Vue 3 app startup to avoid pre-transform errors.
// If needed, migrate these views to Vue 3 and re-enable progressively.
// import addressbooks from './addressbooks'
// import campaigns from './campaigns'
// import outbox from './outbox'
// import inbox from './inbox'
// import senders from './senders'
// import stoplist from './stoplist'
// import topups from './topups'
// import payments from './payments'
// import apikeys from './apikeys'
// import organisations from './organisations'
// import miscellaneous from './miscellaneous'
// import authentication from './authentication'

const routes: RouteRecordRaw[] = [
  // Main dashboard routes
  { path: '/', name: 'dashboard', component: DashboardStats, meta: { title: 'Dashboard', requiresAuth: true } },
  { path: '/usage', name: 'usage', component: UsageStats, meta: { title: 'Usage Statistics', requiresAuth: true } },
  
  // Address Books
  { path: '/address-books-groups-list', name: 'address-books-groups-list', component: () => import('@/components/contacts/ContactGroups.vue'), meta: { title: 'Contact Groups', requiresAuth: true } },
  
  // Campaigns
  { path: '/bulk-campaigns', name: 'bulk-campaigns', component: CampaignManager, meta: { title: 'SMS Campaigns', requiresAuth: true } },
  { path: '/misc-coming-soon', name: 'misc-coming-soon', component: () => import('@/views/miscellaneous/ComingSoon.vue'), meta: { title: 'Coming Soon', requiresAuth: true } },
  
  // Message Outbox
  { path: '/outbox', name: 'outbox', component: () => import('@/components/outbox/BulkOutbox.vue'), meta: { title: 'Bulk Outbox', requiresAuth: true } },
  { path: '/api-outbox', name: 'api-outbox', component: () => import('@/components/outbox/ApiOutbox.vue'), meta: { title: 'API Outbox', requiresAuth: true } },
  
  // Premium SMS
  { path: '/premium-inbox', name: 'premium-inbox', component: () => import('@/components/outbox/SmsInbox.vue'), meta: { title: 'Premium Inbox', requiresAuth: true } },
  { path: '/premium-outbox', name: 'premium-outbox', component: () => import('@/components/outbox/PremiumOutbox.vue'), meta: { title: 'Premium Outbox', requiresAuth: true } },
  
  // Senders & Stop List
  { path: '/senders', name: 'senders', component: () => import('@/components/senders/Senders.vue'), meta: { title: 'Senders', requiresAuth: true } },
  { path: '/stoplist', name: 'stoplist', component: () => import('@/components/senders/StopList.vue'), meta: { title: 'Stop List', requiresAuth: true } },
  
  // Bulk Topups
  { path: '/bulk-topups', name: 'bulk-topups', component: () => import('@/components/topups/BulkTopups.vue'), meta: { title: 'Topups', requiresAuth: true } },
  { path: '/transactions', name: 'transactions', component: () => import('@/components/transactions/Transactions.vue'), meta: { title: 'Transactions', requiresAuth: true } },
  
  // API Settings
  { path: '/api-keys', name: 'api-keys', component: ApiKeys, meta: { title: 'API Keys', requiresAuth: true } },

  // Auth
  { path: '/login', name: 'login', component: LoginPage, meta: { title: 'Login', requiresAuth: false } },
  
  // Legacy routes disabled (see imports above)
  
  // Catch-all route
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// Global auth guard: protect main app routes, allow auth pages
router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  const requiresAuth = Boolean(to.meta && (to.meta as any).requiresAuth)
  const authed = auth.isAuthenticated

  if (requiresAuth && !authed) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else if (to.name === 'login' && authed) {
    next({ path: '/' })
  } else {
    next()
  }
})

export default router


