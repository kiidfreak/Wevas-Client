import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

console.log('🔧 MSW Browser: Setting up worker with handlers:', handlers.length)

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers)

// Make the `worker` and `rest` references available globally so they are not eliminated by module bundlers
if (typeof window !== 'undefined') {
  window.msw = {
    worker,
  }
}

// Add error handling for worker setup
worker.events.on('unhandledException', (error) => {
  console.warn('MSW: Unhandled exception:', error)
})

worker.events.on('unhandledRejection', (error) => {
  console.warn('MSW: Unhandled rejection:', error)
})

// Add request/response logging
worker.events.on('request:start', ({ request }) => {
  console.log('🔧 MSW: Request started:', request.method, request.url)
})

worker.events.on('request:end', ({ request, response }) => {
  console.log('🔧 MSW: Request ended:', request.method, request.url, response.status)
})

worker.events.on('request:match', ({ request }) => {
  console.log('🔧 MSW: Request matched:', request.method, request.url)
})

console.log('🔧 MSW Browser: Worker setup complete')
