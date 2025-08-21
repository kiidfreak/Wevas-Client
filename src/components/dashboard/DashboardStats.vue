<template>
  <div class="dashboard-stats">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        v-for="stat in stats"
        :key="stat.id"
        :title="stat.title"
        :value="stat.value"
        :change="stat.change"
        :icon="stat.icon"
        :color="stat.color"
        :trend="stat.trend"
      />
    </div>

    <!-- Performance Chart -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Performance Overview</h3>
        <div class="flex items-center space-x-2">
          <button 
            v-for="period in timePeriods" 
            :key="period.value"
            @click="selectedPeriod = period.value"
            :class="[
              'px-3 py-1 text-sm font-medium rounded-lg transition-colors',
              selectedPeriod === period.value
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            ]"
          >
            {{ period.label }}
          </button>
        </div>
      </div>
      
      <!-- Performance Chart -->
      <div class="h-64">
        <PerformanceChart 
          type="line" 
          :period="selectedPeriod"
          :height="256"
        />
      </div>
      
      <!-- Performance Insights -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div class="text-center p-4 bg-blue-50 rounded-lg">
          <p class="text-sm font-medium text-blue-600">Avg Daily Messages</p>
          <p class="text-xl font-bold text-blue-900">{{ getAverageDailyMessages() }}</p>
        </div>
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <p class="text-sm font-medium text-green-600">Avg Delivery Rate</p>
          <p class="text-xl font-bold text-green-900">98.2%</p>
        </div>
        <div class="text-center p-4 bg-purple-50 rounded-lg">
          <p class="text-sm font-medium text-purple-600">Peak Day</p>
          <p class="text-xl font-bold text-purple-900">Thursday</p>
        </div>
      </div>
    

    </div>

    <!-- Delivery Statistics -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Delivery Statistics</h3>
        <span class="text-sm text-gray-500">Last 30 days</span>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Delivery Rate Pie Chart -->
        <div class="h-64">
          <DeliveryChart />
        </div>
        
        <!-- Delivery Trend Chart -->
        <div class="h-64 bg-gray-50 rounded-lg p-4">
          <h4 class="text-sm font-medium text-gray-700 mb-3">Delivery Trend (Last 7 Days)</h4>
          <div class="h-48">
            <canvas id="delivery-trend-chart"></canvas>
          </div>
        </div>
        
        <!-- Delivery Metrics -->
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div>
              <p class="text-sm font-medium text-green-900">Successful Deliveries</p>
              <p class="text-2xl font-bold text-green-600">2,334,861</p>
              <p class="text-xs text-green-600">82% of total</p>
            </div>
            <div class="text-green-600">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          
          <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <p class="text-sm font-medium text-red-900">Failed Deliveries</p>
              <p class="text-2xl font-bold text-red-600">227,792</p>
              <p class="text-xs text-red-600">8% of total</p>
            </div>
            <div class="text-red-600">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          
          <div class="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
            <div>
              <p class="text-sm font-medium text-yellow-900">Pending Deliveries</p>
              <p class="text-2xl font-bold text-yellow-600">170,844</p>
              <p class="text-xs text-yellow-600">6% of total</p>
            </div>
            <div class="text-yellow-600">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p class="text-sm font-medium text-gray-900">Bounced Messages</p>
              <p class="text-2xl font-bold text-gray-600">113,895</p>
              <p class="text-xs text-gray-600">4% of total</p>
            </div>
            <div class="text-gray-600">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Campaign Performance -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Campaign Performance</h3>
        <span class="text-sm text-gray-500">Last 30 days</span>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-blue-50 rounded-lg">
          <p class="text-sm font-medium text-blue-600">Total Campaigns</p>
          <p class="text-2xl font-bold text-blue-900">24</p>
          <p class="text-xs text-blue-600">+3 this month</p>
        </div>
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <p class="text-sm font-medium text-green-600">Active Campaigns</p>
          <p class="text-2xl font-bold text-green-900">8</p>
          <p class="text-xs text-green-600">Currently running</p>
        </div>
        <div class="text-center p-4 bg-purple-50 rounded-lg">
          <p class="text-sm font-medium text-purple-600">Avg Open Rate</p>
          <p class="text-2xl font-bold text-purple-900">67.3%</p>
          <p class="text-xs text-purple-600">+5.2% vs last month</p>
        </div>
        <div class="text-center p-4 bg-yellow-50 rounded-lg">
          <p class="text-sm font-medium text-yellow-600">Click Rate</p>
          <p class="text-2xl font-bold text-yellow-900">12.8%</p>
          <p class="text-xs text-yellow-600">+2.1% vs last month</p>
        </div>
      </div>
    </div>

    <!-- Recent Activity & Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Activity -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button class="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
        </div>
        <div class="space-y-4">
          <ActivityItem
            v-for="activity in recentActivities"
            :key="activity.id"
            :activity="activity"
          />
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div class="space-y-3">
          <QuickActionButton
            v-for="action in quickActions"
            :key="action.id"
            :action="action"
            @click="handleQuickAction(action)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Chart } from 'chart.js/auto'
import StatCard from './StatCard.vue'
import ActivityItem from './ActivityItem.vue'
import QuickActionButton from './QuickActionButton.vue'
import PerformanceChart from '@/components/charts/PerformanceChart.vue'
import DeliveryChart from '@/components/charts/DeliveryChart.vue'

// Reactive data
const selectedPeriod = ref('7d')

// Time periods for chart
const timePeriods = [
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
  { label: '1Y', value: '1y' }
]

// Dashboard statistics
const stats = ref([
  {
    id: 1,
    title: 'Total SMS Sent',
    value: '2,847,392',
    change: '+12.5%',
    trend: 'up' as const,
    icon: 'message',
    color: 'blue' as const,
    showProgress: true,
    progress: 78
  },
  {
    id: 2,
    title: 'Active Campaigns',
    value: '24',
    change: '+8.2%',
    trend: 'up' as const,
    icon: 'campaign',
    color: 'green' as const,
    showProgress: true,
    progress: 65
  },
  {
    id: 3,
    title: 'Total Contacts',
    value: '156,847',
    change: '+15.3%',
    trend: 'up' as const,
    icon: 'users',
    color: 'purple' as const,
    showProgress: true,
    progress: 92
  },
  {
    id: 4,
    title: 'Revenue',
    value: '$45,892',
    change: '+23.1%',
    trend: 'up' as const,
    icon: 'dollar',
    color: 'yellow' as const,
    showProgress: true,
    progress: 87
  }
])

// Recent activities
const recentActivities = ref([
  {
    id: 1,
    type: 'campaign',
    title: 'Campaign "Summer Sale" completed',
    description: 'Successfully sent 45,230 SMS messages',
    time: '2 minutes ago',
    status: 'success' as const
  },
  {
    id: 2,
    type: 'contacts',
    title: 'New contact group "VIP Customers" created',
    description: 'Added 1,247 contacts to the group',
    time: '15 minutes ago',
    status: 'info' as const
  },
  {
    id: 3,
    type: 'topup',
    title: 'Topup completed: $500 added to account',
    description: 'Account balance updated successfully',
    time: '1 hour ago',
    status: 'success' as const
  },
  {
    id: 4,
    type: 'api',
    title: 'New API key generated',
    description: 'API key "prod_key_2024" created',
    time: '2 hours ago',
    status: 'warning' as const
  }
])

// Quick actions
const quickActions = ref([
  {
    id: 1,
    title: 'New Campaign',
    icon: 'campaign',
    color: 'blue' as const,
    action: 'create-campaign'
  },
  {
    id: 2,
    title: 'Add Contacts',
    icon: 'users',
    color: 'green' as const,
    action: 'add-contacts'
  },
  {
    id: 3,
    title: 'Topup Account',
    icon: 'dollar',
    color: 'purple' as const,
    action: 'topup-account'
  },
  {
    id: 4,
    title: 'API Settings',
    icon: 'settings',
    color: 'gray' as const,
    action: 'api-settings'
  }
])

// Methods
const handleQuickAction = (action: any) => {
  switch (action.action) {
    case 'create-campaign':
      // Navigate to campaign creation
      window.location.href = '/bulk-campaigns'
      break
    case 'add-contacts':
      // Navigate to contact management
      window.location.href = '/address-books-groups-list'
      break
    case 'topup-account':
      // Navigate to topup page
      window.location.href = '/bulk-topups'
      break
    case 'api-settings':
      // Navigate to API settings
      window.location.href = '/api-keys'
      break
    default:
      console.log('Quick action clicked:', action.action)
  }
}

const getAverageDailyMessages = () => {
  const periodData = {
    '7d': '32,857',
    '30d': '28,450',
    '90d': '26,167',
    '1y': '33,500'
  }
  return periodData[selectedPeriod.value as keyof typeof periodData] || '28,450'
}

// Create delivery trend chart
const createDeliveryTrendChart = () => {
  const ctx = document.getElementById('delivery-trend-chart') as HTMLCanvasElement
  if (!ctx) return

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Delivery Rate %',
        data: [98.2, 97.8, 99.1, 98.5, 96.9, 99.3, 97.7],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
          cornerRadius: 8,
          callbacks: {
            label: function(context: any) {
              return `Delivery Rate: ${context.parsed.y}%`
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11,
              weight: 'normal'
            }
          }
        },
        y: {
          display: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          min: 95,
          max: 100,
          ticks: {
            font: {
              size: 11,
              weight: 'normal'
            }
          }
        }
      },
      elements: {
        point: {
          hoverBackgroundColor: 'white',
          hoverBorderWidth: 3
        }
      }
    }
  })
}

// Create chart when component mounts
onMounted(() => {
  createDeliveryTrendChart()
})
</script>

<style scoped>
.dashboard-stats {
  @apply w-full;
}
</style>
