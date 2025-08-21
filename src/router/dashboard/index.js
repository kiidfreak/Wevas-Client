export default [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/dashboard/Home.vue'),
    meta: {
      action: 'read',
      subject: 'dashboard',
    },
  },
]
