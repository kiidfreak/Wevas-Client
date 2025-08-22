import { http, HttpResponse } from 'msw'

console.log('🔧 MSW: Loading mock handlers...')

// Mock user data
const users = [
  {
    id: 1,
    fullName: 'John Doe',
    username: 'johndoe',
    password: 'admin',
    avatar: '/favicon.ico',
    email: 'admin@demo.com',
    role: 'admin',
    first_name: 'John',
    last_name: 'Doe',
    ability: [
      {
        action: 'manage',
        subject: 'all',
      },
    ],
    extras: {
      eCommerceCartItemsCount: 5,
    },
  },
  {
    id: 2,
    fullName: 'Jane Doe',
    username: 'janedoe',
    password: 'client',
    avatar: '/favicon.ico',
    email: 'client@demo.com',
    role: 'client',
    first_name: 'Jane',
    last_name: 'Doe',
    ability: [
      {
        action: 'read',
        subject: 'ACL',
      },
      {
        action: 'read',
        subject: 'Auth',
      },
    ],
    extras: {
      eCommerceCartItemsCount: 5,
    },
  },
]

// Helper function to create tokens
function createToken(payload) {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify({ payload, iat: Date.now() }))))
  } catch (e) {
    return Math.random().toString(36).slice(2)
  }
}

// Auth handlers
export const authHandlers = [
  // Login endpoint - try multiple path variations
  http.post('/auth/login', async ({ request }) => {
    console.log('🔧 MSW: /auth/login endpoint called!')
    
    try {
      const { email, password } = await request.json()
      console.log('🔧 MSW: Login attempt:', { email, password })

      const user = users.find(u => u.email === email && u.password === password)

      if (user) {
        const accessToken = createToken({ id: user.id, exp: Date.now() + 10 * 60 * 1000 })
        const refreshToken = createToken({ id: user.id, exp: Date.now() + 10 * 60 * 1000 })

        const userData = { ...user }
        delete userData.password

        const response = {
          userData,
          tokens: {
            access_token: accessToken,
            refresh_token: refreshToken,
          },
          ability: userData.ability,
          membership: {
            type: 'premium',
            organisation_id: 1,
            name: 'Demo Organisation'
          },
          bulk_accounts: [],
          tenantInfo: {
            name: 'Demo Tenant',
            id: 1
          }
        }

        console.log('🔧 MSW: Login successful for:', email)
        return HttpResponse.json(response, { status: 200 })
      } else {
        console.log('🔧 MSW: Login failed for:', email)
        return HttpResponse.json(
          {
            errors: {
              email: ['Email or Password is Invalid'],
            },
          },
          { status: 400 }
        )
      }
    } catch (error) {
      console.error('🔧 MSW: Error in login handler:', error)
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }),

  // Also try with full URL path
  http.post('*/auth/login', async ({ request }) => {
    console.log('🔧 MSW: */auth/login endpoint called! (wildcard)')
    
    try {
      const { email, password } = await request.json()
      console.log('🔧 MSW: Login attempt (wildcard):', { email, password })

      const user = users.find(u => u.email === email && u.password === password)

      if (user) {
        const accessToken = createToken({ id: user.id, exp: Date.now() + 10 * 60 * 1000 })
        const refreshToken = createToken({ id: user.id, exp: Date.now() + 10 * 60 * 1000 })

        const userData = { ...user }
        delete userData.password

        const response = {
          userData,
          tokens: {
            access_token: accessToken,
            refresh_token: refreshToken,
          },
          ability: userData.ability,
          membership: {
            type: 'premium',
            organisation_id: 1,
            name: 'Demo Organisation'
          },
          bulk_accounts: [],
          tenantInfo: {
            name: 'Demo Tenant',
            id: 1
          }
        }

        console.log('🔧 MSW: Login successful for (wildcard):', email)
        return HttpResponse.json(response, { status: 200 })
      } else {
        console.log('🔧 MSW: Login failed for (wildcard):', email)
        return HttpResponse.json(
          {
            errors: {
              email: ['Email or Password is Invalid'],
            },
          },
          { status: 400 }
        )
      }
    } catch (error) {
      console.error('🔧 MSW: Error in login handler (wildcard):', error)
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }),

  // Logout endpoint
  http.post('/auth/logout', () => {
    console.log('🔧 MSW: /auth/logout endpoint called!')
    return HttpResponse.json({ message: 'Logged out successfully' }, { status: 200 })
  }),

  // Refresh token endpoint
  http.post('/auth/refresh-token', () => {
    console.log('🔧 MSW: /auth/refresh-token endpoint called!')
    const accessToken = createToken({ id: 1, exp: Date.now() + 10 * 60 * 1000 })
    return HttpResponse.json(
      {
        access_token: accessToken,
      },
      { status: 200 }
    )
  }),
]

// Dashboard and stats handlers
export const dashboardHandlers = [
  // Dashboard stats
  http.get('/api/stats/dashboard', () => {
    console.log('🔧 MSW: /api/stats/dashboard endpoint called!')
    return HttpResponse.json(
      {
        total_campaigns: 25,
        total_contacts: 1500,
        total_sent: 12500,
        delivery_rate: 98.5,
        recent_activity: [
          { id: 1, action: 'Campaign sent', timestamp: new Date().toISOString() },
          { id: 2, action: 'New contact added', timestamp: new Date().toISOString() },
        ]
      },
      { status: 200 }
    )
  }),

  // Delivery report
  http.get('/api/stats/delivery-report', () => {
    console.log('🔧 MSW: /api/stats/delivery-report endpoint called!')
    return HttpResponse.json(
      {
        delivery_report: {
          sent: 1250,
          waiting: 45,
          queued: 23,
          delivered: 1180,
          undelivered: 15,
          failed: 8,
          cancelled: 2,
          total: 1250,
          units_used: 1250
        },
        operator_traffic: [
          { operator: 'MTN', count: 450, percentage: 36 },
          { operator: 'Airtel', count: 380, percentage: 30.4 },
          { operator: 'Glo', count: 220, percentage: 17.6 },
          { operator: '9mobile', count: 200, percentage: 16 }
        ]
      },
      { status: 200 }
    )
  }),
]

// Catch-all handler to see if any requests are being intercepted
export const catchAllHandler = [
  http.all('*', ({ request }) => {
    console.log('🔧 MSW: Catch-all handler called for:', request.method, request.url)
    return HttpResponse.json(
      { message: 'MSW catch-all: Request intercepted but no specific handler found' },
      { status: 404 }
    )
  }),
]

// Export all handlers
export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...catchAllHandler, // Add catch-all at the end
]

console.log('🔧 MSW: Mock handlers loaded successfully. Total handlers:', handlers.length)
console.log('🔧 MSW: Available endpoints:', handlers.map(h => `${h.method} ${h.path}`))
