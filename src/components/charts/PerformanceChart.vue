<template>
  <div class="performance-chart">
    <canvas ref="chartCanvas" :id="chartId"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
} from 'chart.js'

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
)

interface Props {
  type: 'line' | 'bar' | 'doughnut'
  period: string
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 300
})

const chartCanvas = ref<HTMLCanvasElement>()
const chartId = `chart-${Math.random().toString(36).substr(2, 9)}`
let chartInstance: Chart | null = null

// Sample data based on period
const getChartData = () => {
  const baseData = {
    '7d': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Messages Sent',
          data: [12500, 18900, 23000, 45000, 32000, 28000, 35000],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          yAxisID: 'y',
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8
        },
        {
          label: 'Delivery Rate %',
          data: [98.2, 97.8, 99.1, 98.5, 96.9, 99.3, 97.7],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          yAxisID: 'y1',
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    },
    '30d': {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Messages Sent',
          data: [156000, 234000, 187000, 289000],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          yAxisID: 'y',
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8
        },
        {
          label: 'Delivery Rate %',
          data: [97.8, 98.2, 96.9, 99.1],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          yAxisID: 'y1',
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    },
    '90d': {
      labels: ['Jan', 'Feb', 'Mar'],
      datasets: [
        {
          label: 'Messages Sent',
          data: [650000, 780000, 920000],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          yAxisID: 'y',
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8
        },
        {
          label: 'Delivery Rate %',
          data: [97.5, 98.1, 99.2],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          yAxisID: 'y1',
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    },
    '1y': {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Messages Sent',
          data: [2350000, 2890000, 3120000, 3980000],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          yAxisID: 'y',
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8
        },
        {
          label: 'Delivery Rate %',
          data: [97.8, 98.2, 98.7, 99.1],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          yAxisID: 'y1',
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    }
  }

  return baseData[props.period as keyof typeof baseData] || baseData['7d']
}

const getChartOptions = () => {
  const baseOptions = {
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
            if (context.dataset.label === 'Delivery Rate %') {
              return `${context.dataset.label}: ${context.parsed.y}%`
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
            weight: '500'
          }
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        title: {
          display: true,
          text: 'Messages Sent',
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
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false
        },
        title: {
          display: true,
          text: 'Delivery Rate %',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        min: 90,
        max: 100,
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

  if (props.type === 'doughnut') {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right' as const,
          labels: {
            usePointStyle: true,
            padding: 20
          }
        }
      }
    }
  }

  return baseOptions
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
    type: props.type,
    data: getChartData(),
    options: getChartOptions()
  })
}

// Watch for prop changes
watch(() => [props.period, props.type], () => {
  createChart()
}, { deep: true })

onMounted(() => {
  createChart()
})
</script>

<style scoped>
.performance-chart {
  width: 100%;
  height: 100%;
}
</style>
