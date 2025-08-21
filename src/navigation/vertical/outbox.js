export default [
  {
    header: 'MESSAGE OUTBOX',
  },
  {
    title: 'SMS Outbox',
    icon: 'SendIcon',
    children: [
      {
        title: 'Bulk Outbox',
        route: 'outbox',
      },
      {
        title: 'API Outbox',
        route: { name: 'api-outbox' },
      },
    ],
  },
]
