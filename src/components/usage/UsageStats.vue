<template>
  <div class="usage-stats">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Usage Statistics</h1>
        <p class="text-gray-600 mt-1">Monitor your SMS usage and account activity</p>
      </div>
      <div class="flex items-center space-x-4">
        <select v-model="selectedPeriod" class="border border-gray-300 rounded-lg px-4 py-2 bg-white">
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>
    </div>

    <!-- Usage Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">SMS Sent</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatNumber(usageStats.smsSent) }}</p>
            <p class="text-sm text-green-600 mt-1">+12.5% vs last period</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Credits Used</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatNumber(usageStats.creditsUsed) }}</p>
            <p class="text-sm text-red-600 mt-1">{{ usageStats.creditsUsed / usageStats.totalCredits * 100 }}% of total</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Delivery Rate</p>
            <p class="text-2xl font-bold text-gray-900">{{ usageStats.deliveryRate }}%</p>
            <p class="text-sm text-green-600 mt-1">+2.1% vs last period</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Active Campaigns</p>
            <p class="text-2xl font-bold text-gray-900">{{ usageStats.activeCampaigns }}</p>
            <p class="text-sm text-blue-600 mt-1">{{ usageStats.totalCampaigns }} total campaigns</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Usage Chart and Details -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Daily Usage Chart -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Daily Usage Trend</h3>
          <div class="flex items-center space-x-2">
            <button 
              v-for="chartType in chartTypes" 
              :key="chartType.value"
              @click="selectedChartType = chartType.value"
              :class="[
                'px-3 py-1 text-sm font-medium rounded-lg transition-colors',
                selectedChartType === chartType.value
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              ]"
            >
              {{ chartType.label }}
            </button>
          </div>
        </div>
        <div class="h-64">
          <canvas ref="usageChartCanvas" id="usage-chart" class="w-full h-full"></canvas>
        </div>
        
        <!-- Chart Summary -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div class="text-center p-3 bg-blue-50 rounded-lg">
            <p class="text-sm font-medium text-blue-600">Peak Day</p>
            <p class="text-lg font-bold text-blue-900">{{ getPeakDay() }}</p>
          </div>
          <div class="text-center p-3 bg-green-50 rounded-lg">
            <p class="text-sm font-medium text-green-600">Avg Daily SMS</p>
            <p class="text-lg font-bold text-green-900">{{ getAverageDailySMS() }}</p>
          </div>
          <div class="text-center p-3 bg-purple-50 rounded-lg">
            <p class="text-sm font-medium text-purple-600">Total Period</p>
            <p class="text-lg font-bold text-purple-900">{{ getTotalPeriodSMS() }}</p>
          </div>
        </div>
      </div>

      <!-- Usage Breakdown -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Usage Breakdown</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-600">Bulk SMS</span>
            <span class="text-sm font-bold text-gray-900">{{ formatNumber(usageBreakdown.bulkSms) }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-blue-500 h-2 rounded-full" :style="{ width: '75%' }"></div>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-600">API SMS</span>
            <span class="text-sm font-bold text-gray-900">{{ formatNumber(usageBreakdown.apiSms) }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-green-500 h-2 rounded-full" :style="{ width: '20%' }"></div>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-600">Premium SMS</span>
            <span class="text-sm font-bold text-gray-900">{{ formatNumber(usageBreakdown.premiumSms) }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-purple-500 h-2 rounded-full" :style="{ width: '5%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Usage Activity</h3>
      <div class="space-y-4">
        <div v-for="activity in recentActivity" :key="activity.id" class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
          <div class="flex items-center space-x-3">
            <div :class="[
              'w-10 h-10 rounded-lg flex items-center justify-center',
              activity.type === 'bulk' ? 'bg-blue-100' : 
              activity.type === 'api' ? 'bg-green-100' : 'bg-purple-100'
            ]">
              <svg class="w-5 h-5" :class="[
                activity.type === 'bulk' ? 'text-blue-600' : 
                activity.type === 'api' ? 'text-green-600' : 'text-purple-600'
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ activity.description }}</p>
              <p class="text-sm text-gray-500">{{ activity.timestamp }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-medium text-gray-900">{{ formatNumber(activity.count) }}</p>
            <p class="text-sm text-gray-500">{{ activity.type.toUpperCase() }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { Chart } from 'chart.js/auto'

const selectedPeriod = ref('30d')
const selectedChartType = ref('line')
const usageChartCanvas = ref<HTMLCanvasElement>()

// Chart types for switching between different visualizations
const chartTypes = [
  { label: 'Line', value: 'line' },
  { label: 'Bar', value: 'bar' },
  { label: 'Area', value: 'area' }
]

const usageStats = ref({
  smsSent: 2847392,
  creditsUsed: 284739,
  totalCredits: 500000,
  deliveryRate: 98.2,
  activeCampaigns: 8,
  totalCampaigns: 24
})

const usageBreakdown = ref({
  bulkSms: 2137544,
  apiSms: 568934,
  premiumSms: 140914
})

const recentActivity = ref([
  {
    id: 1,
    type: 'bulk',
    description: 'Bulk SMS Campaign "Summer Sale" sent',
    timestamp: '2 hours ago',
    count: 45230
  },
  {
    id: 2,
    type: 'api',
    description: 'API SMS messages sent via webhook',
    timestamp: '4 hours ago',
    count: 12567
  },
  {
    id: 3,
    type: 'premium',
    description: 'Premium SMS shortcode messages',
    timestamp: '6 hours ago',
    count: 3421
  },
  {
    id: 4,
    type: 'bulk',
    description: 'Bulk SMS Campaign "Weekly Update" sent',
    timestamp: '1 day ago',
    count: 28945
  }
])

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num)
}

// Chart data based on selected period
const getChartData = () => {
  const baseData = {
    '7d': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'SMS Sent',
          data: [12500, 18900, 23000, 45000, 32000, 28000, 35000],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: selectedChartType.value === 'area'
        },
        {
          label: 'Credits Used',
          data: [1250, 1890, 2300, 4500, 3200, 2800, 3500],
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: selectedChartType.value === 'area'
        }
      ]
    },
    '30d': {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'SMS Sent',
          data: [156000, 234000, 187000, 289000],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: selectedChartType.value === 'area'
        },
        {
          label: 'Credits Used',
          data: [15600, 23400, 18700, 28900],
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: selectedChartType.value === 'area'
        }
      ]
    },
    '90d': {
      labels: ['Jan', 'Feb', 'Mar'],
      datasets: [
        {
          label: 'SMS Sent',
          data: [650000, 780000, 920000],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: selectedChartType.value === 'area'
        },
        {
          label: 'Credits Used',
          data: [65000, 78000, 92000],
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: selectedChartType.value === 'area'
        }
      ]
    },
    '1y': {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'SMS Sent',
          data: [2350000, 2890000, 3120000, 3980000],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: selectedChartType.value === 'area'
        },
        {
          label: 'Credits Used',
          data: [235000, 289000, 312000, 398000],
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: selectedChartType.value === 'area'
        }
      ]
    }
  }

  return baseData[selectedPeriod.value as keyof typeof baseData] || baseData['30d']
}

// Chart options
const getChartOptions = () => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function(context: any) {
            if (context.dataset.label === 'Credits Used') {
              return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`
            }
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`
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
        title: {
          display: true,
          text: 'Count',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        ticks: {
          font: {
            size: 11,
            weight: 'normal'
          }
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    },
    elements: {
      point: {
        hoverBackgroundColor: 'white',
        hoverBorderWidth: 3
      }
    }
  }
}

let chartInstance: Chart | null = null

// Create or update chart
const createChart = async () => {
  if (!usageChartCanvas.value) return

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy()
  }

  await nextTick()

  const ctx = usageChartCanvas.value.getContext('2d')
  if (!ctx) return

  // Update dataset fill property based on chart type
  const chartData = getChartData()
  chartData.datasets.forEach(dataset => {
    dataset.fill = selectedChartType.value === 'area'
  })

  chartInstance = new Chart(ctx, {
    type: selectedChartType.value === 'area' ? 'line' : selectedChartType.value as 'line' | 'bar',
    data: chartData,
    options: getChartOptions()
  })
}

// Watch for changes in period or chart type
watch([selectedPeriod, selectedChartType], () => {
  createChart()
}, { deep: true })

// Create chart when component mounts
onMounted(() => {
  createChart()
})

// Helper functions for chart summary
const getPeakDay = () => {
  const data = getChartData()
  const smsData = data.datasets[0].data
  const maxIndex = smsData.indexOf(Math.max(...smsData))
  return data.labels[maxIndex]
}

const getAverageDailySMS = () => {
  const data = getChartData()
  const smsData = data.datasets[0].data
  const average = smsData.reduce((a, b) => a + b, 0) / smsData.length
  return formatNumber(Math.round(average))
}

const getTotalPeriodSMS = () => {
  const data = getChartData()
  const smsData = data.datasets[0].data
  const total = smsData.reduce((a, b) => a + b, 0)
  return formatNumber(total)
}
</script>

<style scoped>
.usage-stats {
  @apply p-6;
}
</style>