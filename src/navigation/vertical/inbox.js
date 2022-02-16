export default [
  {
    header: 'Short Codes',
  },
  {
    title: 'Premium SMS',
    icon: 'LogInIcon',
    children: [
      {
        title: 'Inbox',
        route: { name: 'short-code-inbox' },
      },
      {
        title: 'Outbox',
        route: { name: 'short-code-outbox' },
      },
    ],
  },
]
