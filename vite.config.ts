import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import DefineOptions from 'unplugin-vue-define-options/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      // Auto-import Vue composition API functions
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
        '@vueuse/head'
      ],
      // Auto-import Vue components
      dirs: ['src/composables', 'src/stores'],
      // Auto-import Vue macros
      vueTemplate: true,
      // Generate TypeScript declarations
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
    }),
    Components({
      // Auto-import components from src/components
      dirs: ['src/components'],
      // Generate TypeScript declarations
      dts: 'src/components.d.ts',
      // Auto-import UI components
      resolvers: [
        // Add shadcn-vue resolver here when available
      ],
    }),
    DefineOptions(),
  ],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@core': resolve(__dirname, 'src/@core'),
      '@components': resolve(__dirname, 'src/components'),
      '@composables': resolve(__dirname, 'src/composables'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@libs': resolve(__dirname, 'src/libs'),
      '@types': resolve(__dirname, 'src/types'),
    },
  },
  
  // Build optimization
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['@headlessui/vue', '@heroicons/vue'],
          'chart-vendor': ['chart.js', 'vue-chartjs'],
          'utils-vendor': ['@vueuse/core', 'lodash-es', 'date-fns'],
        },
      },
    },
    // Enable source maps for debugging
    sourcemap: true,
  },
  
  // Development server
  server: {
    port: 3001,
    host: true,
    open: true,
    cors: true,
    // Hot module replacement
    hmr: {
      overlay: true,
    },
  },
  
  // CSS processing
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/variables.scss";`,
      },
    },
    // PostCSS processing
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('cssnano')({
          preset: 'default',
        }),
      ],
    },
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      '@vueuse/core',
      'axios',
      'chart.js',
    ],
    exclude: ['@vue/devtools'],
  },
  
  // Environment variables
  define: {
    __VUE_OPTIONS_API__: false,
    __VUE_PROD_DEVTOOLS__: false,
  },
  
  // Testing configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
