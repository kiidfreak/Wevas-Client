import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers)

// Make the `worker` and `rest` references available globally so they are not eliminated by module bundlers
if (typeof window !== 'undefined') {
  window.msw = {
    worker,
  }
}
