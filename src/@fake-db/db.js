import mock from './mock'

console.log('🔧 Mock DB: Starting initialization...')

/* eslint-disable import/extensions */

// JWT
import './jwt'
console.log('🔧 Mock DB: JWT module loaded')

// Table
import './data/extensions/good-table'
import './data/extensions/auto-suggest'
import './data/card/card-statistics'
import './data/card/card-analytics'

// Apps
import './data/apps/calendar'
import './data/apps/user'
import './data/apps/email'
import './data/apps/invoice'
import './data/apps/todo'
import './data/apps/chat'
import './data/apps/eCommerce'

// dashboard
import './data/dashboard/analytics'
import './data/dashboard/ecommerce'

// pages
import './data/pages/faq-data'
import './data/pages/knowledge-base'
import './data/pages/pricing-data'
import './data/pages/account-setting'
import './data/pages/address-book'
import './data/pages/profile-data'
import './data/pages/blog'
/* eslint-enable import/extensions */

// mock.onAny().passThrough() // Commented out to use mock system instead of forwarding to network

console.log('🔧 Mock DB: All modules loaded successfully')
console.log('🔧 Mock DB: Mock system ready:', mock)
