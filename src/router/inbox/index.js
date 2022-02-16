export default [
  {
    path: '/short-code/inbox',
    name: 'short-code-inbox',
    component: () => import('@/views/inbox/inbox-list/InboxList.vue'),
    meta: {
      pageTitle: 'MO Messages',
      breadcrumb: [
        {
          text: 'Inbox',
          active: true,
        },
      ],
    },
  },  {
    path: '/short-code/outbox',
    name: 'short-code-outbox',
    component: () => import('@/views/outbox/outbox-list/PremiumOutboxList.vue'),
    meta: {
      pageTitle: 'MT Messages',
      breadcrumb: [
        {
          text: 'Outbox',
          active: true,
        },
      ],
    },
  },
]
