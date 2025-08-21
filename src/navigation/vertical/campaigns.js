export default [
  {
    header: 'BULK CAMPAIGNS',
  },
  {
    title: 'Campaigns',
    icon: 'MessageCircleIcon',
    children: [
      {
        title: 'SMS',
        route: 'bulk-campaigns',
      },
      {
        title: 'Email',
        route: { name: 'misc-coming-soon' },
        tag: 'Soon',
        tagVariant: 'light-warning',
      },
      {
        title: 'Whatsapp',
        route: { name: 'misc-coming-soon' },
        tag: 'Soon',
        tagVariant: 'light-warning',
      },
    ],
  },
]
