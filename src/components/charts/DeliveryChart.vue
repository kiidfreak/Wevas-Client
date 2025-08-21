<template>
  <div class="delivery-chart">
    <canvas ref="chartCanvas" :id="chartId"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import {
  Chart,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const chartCanvas = ref<HTMLCanvasElement>()
const chartId = `delivery-chart-${Math.random().toString(36).substr(2, 9)}`
let chartInstance: Chart | null = null

const chartData = {
  labels: ['Delivered', 'Failed', 'Pending', 'Bounced'],
  datasets: [{
    data: [82, 8, 6, 4],
    backgroundColor: [
      'rgb(16, 185, 129)',  // Green for delivered
      'rgb(239, 68, 68)',   // Red for failed
      'rgb(245, 158, 11)',  // Yellow for pending
      'rgb(156, 163, 175)'  // Gray for bounced
    ],
    borderWidth: 0,
    hoverOffset: 4
  }]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
          weight: 'bold' as const
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      callbacks: {
        label: function(context: any) {
          return `${context.label}: ${context.parsed}%`
        }
      }
    }
  }
}

const createChart = async () => {
  if (!chartCanvas.value) return

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy()
  }

  await nextTick()

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: chartData,
    options: chartOptions
  })
}

onMounted(() => {
  createChart()
})
</script>

<style scoped>
.delivery-chart {
  width: 100%;
  height: 100%;
}
</style>
