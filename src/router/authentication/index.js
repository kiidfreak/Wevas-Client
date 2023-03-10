export default [
  {
    path: '/login',
    name: 'auth-login',
    component: () => import('@/views/authentication/Login.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
  {
    path: '/register',
    name: 'auth-register',
    component: () => import('@/views/authentication/Register.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
  {
    path: '/forgot-password',
    name: 'auth-forgot-password',
    component: () => import('@/views/authentication/ForgotPassword.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
  {
    path: '/reset-password/:uid',
    name: 'auth-reset-password',
    component: () => import('@/views/authentication/ResetPassword-v1.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: false,
    },
  },
  {
    path: '/pages/authentication/reset-password-v2',
    name: 'auth-reset-password-v2',
    component: () => import('@/views/authentication/ResetPassword-v2.vue'),
    meta: {
      layout: 'full',
    },
  },
]
