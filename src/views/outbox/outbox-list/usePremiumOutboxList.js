import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'
import Vue from 'vue'
// import router from '@/router'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useApiOutboxList() {
  // Use toast
  const toast = useToast()

  const refOutboxListTable = ref(null)
  // Table Handlers
  const tableColumns = [
    // { key: 'campaign', sortable: true },
    { key: 'sender', label: 'Short Code', sortable: true },
    { key: 'type_label', label: 'Type', sortable: true },
    { key: 'recipient', sortable: true },
    { key: 'message', sortable: true },
    { key: 'replied', label: 'Is Replied', sortable: true },
    { key: 'created_at', label: 'Sent At', sortable: true },
    { key: 'show_details', label: 'Actions' },
    // { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalOutbox = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const statusFilter = ref(null)
  const isBusy = ref(false)

  const dataMeta = computed(() => {
    const localItemsCount = refOutboxListTable.value ? refOutboxListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalOutbox.value,
    }
  })

  const refetchData = () => {
    refOutboxListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, statusFilter], () => {
    refetchData()
  })

  const fetchOutbox = (ctx, callback) => {
    isBusy.value = true
    store
      .dispatch('outbox/fetchOutboxList', {
        org_id: JSON.parse(JSON.stringify(Vue.$cookies.get('userData').membership.organisation_id)),
        type: 4,
        q: searchQuery.value,
        per_page: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
      })
      .then(response => {
        const { results, count } = response.data
        isBusy.value = false

        callback(results.filter(item => item.status === statusFilter.value))
        totalOutbox.value = count
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching outboxs' list",
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveOutboxStatusVariantAndIcon = replied => {
    if (replied === 'Yes') return { variant: 'success', icon: 'PhoneIcon' }
    if (replied === 'No') return { variant: 'warning', icon: 'PhoneIcon' }
    return { variant: 'success', icon: 'PhoneIcon' }
  }
  const resolveOutboxStatusVariant = replied => {
    if (replied === 'Yes') return { variant: 'success' }
    if (replied === 'No') return { variant: 'secondary' }
    return { variant: 'secondary' }
  }
  const resolveOutboxSenderTypeVariant = type => {
    if (type === 'MO') return { variant: 'dark' }
    if (type === 'SUBSCRIPTION') return { variant: 'secondary' }
    return { variant: 'secondary' }
  }

  return {
    fetchOutbox,
    perPage,
    currentPage,
    totalOutbox,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refOutboxListTable,

    statusFilter,
    tableColumns,

    resolveOutboxStatusVariantAndIcon,
    resolveOutboxStatusVariant,
    resolveOutboxSenderTypeVariant,
    refetchData,
    isBusy,
  }
}
