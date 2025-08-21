import mock from '@/@fake-db/mock'

// Lightweight browser-safe token helpers to avoid Node-only jsonwebtoken
function createToken(payload) {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify({ payload, iat: Date.now() }))))
  } catch (e) {
    return Math.random().toString(36).slice(2)
  }
}
function decodeToken(token) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(token))))
  } catch (e) {
    return null
  }
}

const data = {
  users: [
    {
      id: 1,
      fullName: 'John Doe',
      username: 'johndoe',
      password: 'admin',
      // eslint-disable-next-line global-require
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
      // eslint-disable-next-line global-require
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
  ],
}

// ! These two secrets shall be in .env file and not in any other file
const jwtConfig = {
  expireTimeMs: 10 * 60 * 1000,
  refreshTokenExpireTimeMs: 10 * 60 * 1000,
}

mock.onPost('/auth/login').reply(request => {
  const { email, password } = JSON.parse(request.data)

  let error = {
    email: ['Something went wrong'],
  }

  const user = data.users.find(u => u.email === email && u.password === password)

  if (user) {
    const accessToken = createToken({ id: user.id, exp: Date.now() + jwtConfig.expireTimeMs })
    const refreshToken = createToken({ id: user.id, exp: Date.now() + jwtConfig.refreshTokenExpireTimeMs })

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

    return [200, response]
  } else {
    error = {
      email: ['Email or Password is Invalid'],
    }
  }

  return [400, { errors: error }]
})

mock.onPost('/auth/register').reply(request => {
  const { username, email, password } = JSON.parse(request.data)

  // If not any of data is missing return 400
  if (!(username && email && password)) return [400]

  const isEmailAlreadyInUse = data.users.find(user => user.email === email)
  const isUsernameAlreadyInUse = data.users.find(user => user.username === username)

  const error = {
    password: !password ? ['Please enter password'] : null,
    email: (() => {
      if (!email) return ['Please enter your email.']
      if (isEmailAlreadyInUse) return ['This email is already in use.']
      return null
    })(),
    username: (() => {
      if (!username) return ['Please enter your username.']
      if (isUsernameAlreadyInUse) return ['This username is already in use.']
      return null
    })(),
  }

  if (!error.username && !error.email) {
    const userData = {
      email,
      password,
      username,
      fullName: `${username}`,
      first_name: username,
      last_name: '',
      avatar: null,
      role: 'admin',
      ability: [
        {
          action: 'manage',
          subject: 'all',
        },
      ],
    }

    // Add user id
    const { length } = data.users
    let lastIndex = 0
    if (length) {
      lastIndex = data.users[length - 1].id
    }
    userData.id = lastIndex + 1

    data.users.push(userData)

    const accessToken = jwt.sign({ id: userData.id }, jwtConfig.secret, { expiresIn: jwtConfig.expireTime })

    const user = { ...userData }
    delete user.password
          const response = {
        userData: user,
        tokens: {
          access_token: accessToken,
          refresh_token: accessToken, // For demo purposes
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

    return [200, response]
  }
  return [400, { errors: error }]
})

mock.onPost('/auth/refresh-token').reply(request => {
  const { refreshToken } = JSON.parse(request.data)
  const decoded = decodeToken(refreshToken)
  const user = decoded?.payload?.id ? data.users.find(u => u.id === decoded.payload.id) : null
  if (!user) return [401, { error: 'Invalid refresh token' }]

  const userData = { ...user }
  delete userData.password
  const accessToken = createToken({ id: userData.id, exp: Date.now() + jwtConfig.expireTimeMs })
  const newRefreshToken = createToken({ id: userData.id, exp: Date.now() + jwtConfig.refreshTokenExpireTimeMs })
  const response = {
    userData,
    accessToken,
    refreshToken: newRefreshToken,
  }
  return [200, response]
})

// Add missing endpoints
mock.onPost('/auth/reset_password').reply(request => {
  const { email } = JSON.parse(request.data)
  
  // Check if user exists
  const user = data.users.find(u => u.email === email)
  
  if (user) {
    return [200, { message: 'Password reset link sent to your email' }]
  } else {
    return [400, { error: 'User not found' }]
  }
})

mock.onPost('/auth/password_update').reply(request => {
  const { token, password } = JSON.parse(request.data)
  
  // In a real app, you'd verify the token
  // For mock purposes, just return success
  return [200, { message: 'Password updated successfully' }]
})

mock.onPost('/auth/logout').reply(() => {
  return [200, { message: 'Logged out successfully' }]
})

// Mock stats endpoint for dashboard
mock.onPost('/stats/fetchReport').reply((request) => {
  const mockStatsData = {
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
    ],
    contacts_by_operator: [
      { operator: 'MTN', contacts: 1250, percentage: 36 },
      { operator: 'Airtel', contacts: 1050, percentage: 30.4 },
      { operator: 'Glo', contacts: 650, percentage: 17.6 },
      { operator: '9mobile', contacts: 500, percentage: 16 }
    ],
    outbox: [
      { id: 1, subject: 'Welcome Campaign', status: 'sent', sent_at: '2024-01-15 10:30:00', recipients: 1250 },
      { id: 2, subject: 'Product Update', status: 'queued', sent_at: null, recipients: 800 },
      { id: 3, subject: 'Newsletter', status: 'draft', sent_at: null, recipients: 0 }
    ],
    start: '2024-01-01',
    end: '2024-01-15'
  }
  
  return [200, mockStatsData]
})

// Mock campaigns endpoints
mock.onGet('/campaigns/list').reply(() => {
  const mockCampaignsData = {
    results: [
      {
        id: 1,
        name: 'Welcome Campaign',
        subject: 'Welcome to SWIFTT SMS',
        message: 'Welcome to our SMS platform! We are excited to have you on board.',
        state: 4, // 4 = Sent
        created_at: '2024-01-15 10:30:00',
        recipients: 1250,
        sent: 1250,
        delivered: 1180,
        failed: 8,
        sync_completed: true
      },
      {
        id: 2,
        name: 'Product Update',
        subject: 'New Features Available',
        message: 'We have added new features to improve your SMS experience.',
        state: 5, // 5 = Draft
        created_at: '2024-01-14 15:20:00',
        recipients: 800,
        sent: 0,
        delivered: 0,
        failed: 0,
        sync_completed: false
      },
      {
        id: 3,
        name: 'Newsletter',
        subject: 'Monthly Newsletter',
        message: 'Stay updated with our latest news and announcements.',
        state: 2, // 2 = Scheduled
        created_at: '2024-01-13 09:15:00',
        recipients: 2000,
        sent: 0,
        delivered: 0,
        failed: 0,
        sync_completed: false
      }
    ],
    meta: {
      current_page: 1,
      per_page: 10,
      total: 3,
      last_page: 1
    },
    count: 3
  }
  
  return [200, mockCampaignsData]
})

// Mock individual campaign endpoint
mock.onGet(/\/campaigns\/\d+/).reply((config) => {
  const campaignId = config.url.split('/').pop()
  const mockCampaignData = {
    id: parseInt(campaignId),
    name: `Campaign ${campaignId}`,
    subject: `Subject for Campaign ${campaignId}`,
    message: `This is the message content for Campaign ${campaignId}. It contains the actual SMS content that will be sent to recipients.`,
    state: 4, // 4 = Sent
    created_at: '2024-01-15 10:30:00',
    recipients: 1250,
    sent: 1250,
    delivered: 1180,
    failed: 8,
    content: 'This is the campaign content...',
    schedule: null,
    sender: 'SWIFTT SMS',
    sync_completed: true
  }
  
  return [200, mockCampaignData]
})

// Mock campaign progress endpoint
mock.onGet(/\/campaigns\/\d+\/progress/).reply((config) => {
  const campaignId = config.url.split('/')[2]
  const mockProgressData = {
    campaign_id: parseInt(campaignId),
    total_recipients: 1250,
    sent: 1250,
    delivered: 1180,
    failed: 8,
    pending: 0,
    progress_percentage: 100,
    estimated_completion: '2024-01-15 10:35:00'
  }
  
  return [200, mockProgressData]
})

// Mock campaign stop endpoint
mock.onGet(/\/campaigns\/\d+\/stop/).reply((config) => {
  const campaignId = config.url.split('/')[2]
  const mockStopData = {
    campaign_id: parseInt(campaignId),
    status: 'stopped',
    stopped_at: new Date().toISOString(),
    message: 'Campaign stopped successfully'
  }
  
  return [200, mockStopData]
})

// Mock campaign archive endpoint
mock.onPost('/campaigns/archive').reply((request) => {
  const { campaign_ids } = JSON.parse(request.data)
  const mockArchiveData = {
    archived_campaigns: campaign_ids,
    message: 'Campaigns archived successfully',
    archived_at: new Date().toISOString()
  }
  
  return [200, mockArchiveData]
})

// Mock address books endpoint
mock.onGet('/address-books').reply(() => {
  const mockAddressBooksData = {
    results: [
      {
        id: 1,
        name: 'Main Contacts',
        description: 'Primary contact list',
        contacts_count: 1250,
        created_at: '2024-01-15 10:30:00',
        updated_at: '2024-01-15 10:30:00'
      },
      {
        id: 2,
        name: 'VIP Customers',
        description: 'High-value customer list',
        contacts_count: 250,
        created_at: '2024-01-14 15:20:00',
        updated_at: '2024-01-14 15:20:00'
      },
      {
        id: 3,
        name: 'Newsletter Subscribers',
        description: 'Marketing newsletter list',
        contacts_count: 800,
        created_at: '2024-01-13 09:15:00',
        updated_at: '2024-01-13 09:15:00'
      }
    ],
    count: 3
  }
  
  return [200, mockAddressBooksData]
})

// Mock address book groups endpoint
mock.onGet('/address-books/groups').reply(() => {
  console.log('Mock: /address-books/groups endpoint called')
  
  const mockGroupsData = {
    results: [
      {
        id: 1,
        name: 'MTN Users',
        description: 'Contacts using MTN network',
        num_contacts: 450,
        created_at: '2024-01-15 10:30:00',
        state_description: 'Active'
      },
      {
        id: 2,
        name: 'Airtel Users',
        description: 'Contacts using Airtel network',
        num_contacts: 380,
        created_at: '2024-01-14 15:20:00',
        state_description: 'Active'
      },
      {
        id: 3,
        name: 'Glo Users',
        description: 'Contacts using Glo network',
        num_contacts: 220,
        created_at: '2024-01-13 09:15:00',
        state_description: 'Active'
      },
      {
        id: 4,
        name: '9mobile Users',
        description: 'Contacts using 9mobile network',
        num_contacts: 200,
        created_at: '2024-01-12 11:45:00',
        state_description: 'Active'
      }
    ],
    count: 4
  }
  
  console.log('Mock: Returning data:', mockGroupsData)
  return [200, mockGroupsData]
})

// Mock organisation senders endpoint
mock.onGet(/\/organisations\/\d+\/senders/).reply((config) => {
  const orgId = config.url.split('/')[2]
  const mockSendersData = {
    organisation_id: parseInt(orgId),
    senders: [
      {
        id: 1,
        name: 'SWIFTT SMS',
        number: '+2348012345678',
        status: 'active',
        verified: true
      },
      {
        id: 2,
        name: 'Marketing Team',
        number: '+2348098765432',
        status: 'active',
        verified: true
      }
    ]
  }
  
  return [200, mockSendersData]
})

// Mock organisation shortcodes endpoint
mock.onGet(/\/organisations\/\d+\/shortcodes/).reply((config) => {
  const orgId = config.url.split('/')[2]
  const mockShortcodesData = {
    organisation_id: parseInt(orgId),
    shortcodes: [
      {
        id: 1,
        code: 'SWIFT',
        status: 'active',
        verified: true
      },
      {
        id: 2,
        code: 'SMS',
        status: 'active',
        verified: true
      }
    ]
  }
  
  return [200, mockShortcodesData]
})

// Mock address book group endpoint
mock.onGet(/\/address-books\/group\/\d+/).reply((config) => {
  const groupId = config.url.split('/').pop()
  const mockGroupData = {
    id: parseInt(groupId),
    name: `Group ${groupId}`,
    description: `Description for group ${groupId}`,
    contacts_count: 250,
    created_at: '2024-01-15 10:30:00',
    contacts: [
      {
        id: 1,
        name: 'John Doe',
        phone: '+2348012345678',
        email: 'john@example.com',
        operator: 'MTN'
      },
      {
        id: 2,
        name: 'Jane Smith',
        phone: '+2348098765432',
        email: 'jane@example.com',
        operator: 'Airtel'
      }
    ]
  }
  
  return [200, mockGroupData]
})

// Mock address book group contacts endpoint
mock.onGet(/\/address-books\/\d+\/contacts/).reply((config) => {
  const groupId = config.url.split('/')[2]
  const mockContactsData = {
    results: [
      {
        id: 1,
        name: 'John Doe',
        phone: '+2348012345678',
        email: 'john@example.com',
        operator: 'MTN',
        status: 'active'
      },
      {
        id: 2,
        name: 'Jane Smith',
        phone: '+2348098765432',
        email: 'jane@example.com',
        operator: 'Airtel',
        status: 'active'
      }
    ],
    count: 2
  }
  
  return [200, mockContactsData]
})

// Mock add group endpoint
mock.onPost('/address-books/groups/add').reply((request) => {
  const groupData = JSON.parse(request.data)
  const mockNewGroup = {
    id: Math.floor(Math.random() * 1000) + 10,
    name: groupData.name,
    description: groupData.description || '',
    contacts_count: 0,
    created_at: new Date().toISOString(),
    message: 'Group created successfully'
  }
  
  return [200, mockNewGroup]
})

// Mock delete groups endpoint
mock.onPost('address-books/groups/delete').reply((request) => {
  const { group_ids } = JSON.parse(request.data)
  const mockDeleteData = {
    deleted_groups: group_ids,
    message: 'Groups deleted successfully',
    deleted_at: new Date().toISOString()
  }
  
  return [200, mockDeleteData]
})

// Mock outbox endpoints
mock.onGet('/outbox').reply(() => {
  console.log('Mock: /outbox endpoint called')
  
  const mockOutboxData = {
    results: [
      {
        id: 1,
        subject: 'Welcome Message',
        status: 'sent',
        sent_at: '2024-01-15 10:30:00',
        recipients: 1250,
        delivered: 1180,
        failed: 8
      },
      {
        id: 2,
        subject: 'Product Update',
        status: 'queued',
        sent_at: null,
        recipients: 800,
        delivered: 0,
        failed: 0
      }
    ],
    count: 2
  }
  
  console.log('Mock: Returning outbox data:', mockOutboxData)
  return [200, mockOutboxData]
})

// Mock senders endpoint
mock.onGet('/senders').reply(() => {
  const mockSendersData = {
    results: [
      {
        id: 1,
        name: 'SWIFTT SMS',
        number: '+2348012345678',
        status: 'active',
        verified: true
      },
      {
        id: 2,
        name: 'Marketing Team',
        number: '+2348098765432',
        status: 'active',
        verified: true
      }
    ],
    count: 2
  }
  
  return [200, mockSendersData]
})

// Mock stoplist endpoint
mock.onGet('/stoplist').reply(() => {
  const mockStoplistData = {
    results: [
      {
        id: 1,
        name: 'John Doe',
        phone: '+2348012345678',
        reason: 'Unsubscribed',
        added_at: '2024-01-15 10:30:00'
      },
      {
        id: 2,
        name: 'Jane Smith',
        phone: '+2348098765432',
        reason: 'Bounced',
        added_at: '2024-01-14 15:20:00'
      }
    ],
    count: 2
  }
  
  return [200, mockStoplistData]
})

// Mock API outbox endpoint (different from regular outbox)
mock.onGet('/api-outbox').reply(() => {
  console.log('Mock: /api-outbox endpoint called')
  
  const mockApiOutboxData = {
    results: [
      {
        id: 1,
        recipient: '+2348012345678',
        message: 'API test message 1',
        status: 'sent',
        sent_at: '2024-01-15 10:30:00',
        api_key: 'key_123',
        cost: 0.50
      },
      {
        id: 2,
        recipient: '+2348098765432',
        message: 'API test message 2',
        status: 'delivered',
        sent_at: '2024-01-15 09:15:00',
        api_key: 'key_456',
        cost: 0.50
      }
    ],
    count: 2
  }
  
  console.log('Mock: Returning API outbox data:', mockApiOutboxData)
  return [200, mockApiOutboxData]
})

// Mock contacts endpoint for address books
mock.onGet('/contacts').reply(() => {
  const mockContactsData = {
    results: [
      {
        id: 1,
        name: 'John Doe',
        phone: '+2348012345678',
        email: 'john@example.com',
        operator: 'MTN',
        status: 'active',
        group_id: 1
      },
      {
        id: 2,
        name: 'Jane Smith',
        phone: '+2348098765432',
        email: 'jane@example.com',
        operator: 'Airtel',
        status: 'active',
        group_id: 1
      }
    ],
    count: 2
  }
  
  return [200, mockContactsData]
})

// Mock bulk topups endpoint
mock.onGet('/bulk-topups').reply(() => {
  const mockBulkTopupsData = {
    results: [
      {
        id: 1,
        amount: 1000,
        units: 1000,
        status: 'completed',
        created_at: '2024-01-15 10:30:00',
        payment_method: 'card'
      },
      {
        id: 2,
        amount: 500,
        units: 500,
        status: 'pending',
        created_at: '2024-01-14 15:20:00',
        payment_method: 'bank_transfer'
      }
    ],
    count: 2
  }
  
  return [200, mockBulkTopupsData]
})

// Mock payments endpoint
mock.onGet('/payments').reply(() => {
  const mockPaymentsData = {
    results: [
      {
        id: 1,
        amount: 1000,
        status: 'completed',
        created_at: '2024-01-15 10:30:00',
        payment_method: 'card',
        reference: 'PAY_001'
      },
      {
        id: 2,
        amount: 500,
        status: 'pending',
        created_at: '2024-01-14 15:20:00',
        payment_method: 'bank_transfer',
        reference: 'PAY_002'
      }
    ],
    count: 2
  }
  
  return [200, mockPaymentsData]
})

// Mock shortcode inbox endpoint
mock.onGet('/short-code/inbox').reply(() => {
  console.log('Mock: /short-code/inbox endpoint called')
  
  const mockShortcodeInboxData = {
    results: [
      {
        id: 1,
        shortcode: 'SWIFT',
        message: 'Test message 1',
        recipient: '+2348012345678',
        received_at: '2024-01-15 10:30:00',
        status: 'received'
      },
      {
        id: 2,
        shortcode: 'SMS',
        message: 'Test message 2',
        recipient: '+2348098765432',
        received_at: '2024-01-15 09:15:00',
        status: 'received'
      }
    ],
    count: 2
  }
  
  console.log('Mock: Returning shortcode inbox data:', mockShortcodeInboxData)
  return [200, mockShortcodeInboxData]
})

// Mock shortcode outbox endpoint
mock.onGet('/short-code/outbox').reply(() => {
  console.log('Mock: /short-code/outbox endpoint called')
  
  const mockShortcodeOutboxData = {
    results: [
      {
        id: 1,
        shortcode: 'SWIFT',
        message: 'Outgoing message 1',
        recipient: '+2348012345678',
        sent_at: '2024-01-15 10:30:00',
        status: 'sent'
      },
      {
        id: 2,
        shortcode: 'SMS',
        message: 'Outgoing message 2',
        recipient: '+2348098765432',
        sent_at: '2024-01-15 09:15:00',
        status: 'delivered'
      }
    ],
    count: 2
  }
  
  console.log('Mock: Returning shortcode outbox data:', mockShortcodeOutboxData)
  return [200, mockShortcodeOutboxData]
})

// Mock DND policies stoplist endpoint (matches the store module URL)
mock.onGet('/dnd-policies/stop-list').reply(() => {
  console.log('Mock: /dnd-policies/stop-list endpoint called')
  
  const mockDndStoplistData = {
    results: [
      {
        id: 1,
        sender_name: 'SWIFTT SMS',
        recipient: '+2348012345678',
        created_at: '2024-01-15 10:30:00',
        reason: 'Unsubscribed'
      },
      {
        id: 2,
        sender_name: 'Marketing Team',
        recipient: '+2348098765432',
        created_at: '2024-01-14 15:20:00',
        reason: 'Bounced'
      }
    ],
    count: 2
  }
  
  console.log('Mock: Returning DND stoplist data:', mockDndStoplistData)
  return [200, mockDndStoplistData]
})

// Mock general senders endpoint (kept for backward compatibility)
mock.onGet('/senders').reply(() => {
  console.log('Mock: /senders endpoint called')
  
  const mockSendersData = {
    results: [
      {
        id: 1,
        name: 'SWIFTT SMS',
        number: '+2348012345678',
        status: 'active',
        verified: true
      },
      {
        id: 2,
        name: 'Marketing Team',
        number: '+2348098765432',
        status: 'active',
        verified: true
      }
    ],
    count: 2
  }
  
  console.log('Mock: Returning senders data:', mockSendersData)
  return [200, mockSendersData]
})

// Mock organisation senders endpoint for stoplist (matches the store module URL pattern)
mock.onGet(/\/organisations\/\d+\/senders/).reply((config) => {
  const orgId = config.url.split('/')[2]
  console.log('Mock: /organisations/{orgId}/senders endpoint called with orgId:', orgId)
  
  const mockOrganisationSendersData = {
    results: [
      {
        id: 1,
        name: 'SWIFTT SMS',
        number: '+2348012345678',
        status: 'active'
      },
      {
        id: 2,
        name: 'Marketing Team',
        number: '+2348098765432',
        status: 'active'
      }
    ],
    count: 2
  }
  
  console.log('Mock: Returning organisation senders data:', mockOrganisationSendersData)
  return [200, mockOrganisationSendersData]
})

// Mock bulk accounts endpoint
mock.onGet('/api/bulk-accounts/').reply(() => {
  console.log('Mock: /api/bulk-accounts/ endpoint called')
  
  const mockBulkAccountsData = {
    id: 1,
    account_number: 'ACC001',
    account_type: 1,
    account_name: 'Main Account',
    balance: 1000.00,
    currency: 'KES',
    status: 'active',
    created_at: '2024-01-15 10:30:00',
    updated_at: '2024-01-15 10:30:00'
  }
  
  console.log('Mock: Returning bulk accounts data:', mockBulkAccountsData)
  return [200, mockBulkAccountsData]
})

// Mock bulk account by ID endpoint
mock.onGet(/\/organisations\/bulk-account\/\d+/).reply((config) => {
  const accountId = config.url.split('/').pop()
  console.log('Mock: /organisations/bulk-account/{id} endpoint called with accountId:', accountId)
  
  const mockBulkAccountData = {
    id: parseInt(accountId),
    account_number: `ACC${accountId.padStart(3, '0')}`,
    account_type: 1,
    account_name: `Account ${accountId}`,
    balance: 1000.00,
    currency: 'KES',
    status: 'active',
    created_at: '2024-01-15 10:30:00',
    updated_at: '2024-01-15 10:30:00'
  }
  
  console.log('Mock: Returning bulk account data:', mockBulkAccountData)
  return [200, mockBulkAccountData]
})

// Mock organisations list endpoint
mock.onGet('/api/organisations/list').reply((config) => {
  console.log('Mock: /api/organisations/list endpoint called')
  console.log('Query params:', config.params)
  
  const mockOrganisationsData = {
    results: [
      {
        id: 1,
        name: 'Demo Organisation',
        email: 'admin@demo.com',
        phone: '+2348012345678',
        address: '123 Demo Street, Lagos, Nigeria',
        status: 'active',
        created_at: '2024-01-15 10:30:00',
        updated_at: '2024-01-15 10:30:00',
        subscription_plan: 'premium',
        sms_credits: 10000,
        api_enabled: true
      },
      {
        id: 2,
        name: 'Test Company',
        email: 'test@company.com',
        phone: '+2348098765432',
        address: '456 Test Avenue, Abuja, Nigeria',
        status: 'active',
        created_at: '2024-01-14 15:20:00',
        updated_at: '2024-01-14 15:20:00',
        subscription_plan: 'basic',
        sms_credits: 5000,
        api_enabled: false
      }
    ],
    meta: {
      current_page: parseInt(config.params?.page) || 1,
      per_page: parseInt(config.params?.per_page) || 10,
      total: 2,
      last_page: 1
    },
    count: 2
  }
  
  console.log('Mock: Returning organisations data:', mockOrganisationsData)
  return [200, mockOrganisationsData]
})

// Mock stats delivery report endpoint
mock.onGet('/api/stats/delivery-report').reply((config) => {
  console.log('Mock: /api/stats/delivery-report endpoint called')
  console.log('Query params:', config.params)
  
  const mockDeliveryReportData = {
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
    ],
    contacts_by_operator: [
      { operator: 'MTN', contacts: 1250, percentage: 36 },
      { operator: 'Airtel', contacts: 1050, percentage: 30.4 },
      { operator: 'Glo', contacts: 650, percentage: 17.6 },
      { operator: '9mobile', contacts: 500, percentage: 16 }
    ],
    outbox: [
      { id: 1, subject: 'Welcome Campaign', status: 'sent', sent_at: '2024-01-15 10:30:00', recipients: 1250 },
      { id: 2, subject: 'Product Update', status: 'queued', sent_at: null, recipients: 800 },
      { id: 3, subject: 'Newsletter', status: 'draft', sent_at: null, recipients: 0 }
    ],
    start: '2024-01-01',
    end: '2024-01-15'
  }
  
  console.log('Mock: Returning delivery report data:', mockDeliveryReportData)
  return [200, mockDeliveryReportData]
})
