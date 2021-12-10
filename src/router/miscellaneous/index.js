export default [
  {
    path: '/error-404',
    name: 'error-404',
    component: () => import('@/views/miscellaneous/Error.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      action: 'read',
    },
  },
  {
    path: '/miscellaneous/coming-soon',
    name: 'misc-coming-soon',
    component: () => import('@/views/miscellaneous/ComingSoon.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/miscellaneous/not-authorized',
    name: 'misc-not-authorized',
    component: () => import('@/views/miscellaneous/NotAuthorized.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
    },
  },
  {
    path: '/miscellaneous/under-maintenance',
    name: 'misc-under-maintenance',
    component: () => import('@/views/miscellaneous/UnderMaintenance.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/miscellaneous/error',
    name: 'misc-error',
    component: () => import('@/views/miscellaneous/Error.vue'),
    meta: {
      layout: 'full',
    },
  },
]
