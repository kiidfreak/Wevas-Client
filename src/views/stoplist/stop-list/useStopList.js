import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'
import Vue from 'vue'
// import router from '@/router'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useStopList() {
  // Use toast
  const toast = useToast()

  const refStoplistListTable = ref(null)
  // Table Handlers
  const tableColumns = [
    { key: 'sender_name', sortable: true },
    { key: 'recipient', sortable: true },
    { key: 'created_at', label: 'Opted Out On', sortable: true },
    // { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalStoplists = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const sendersFilter = ref(null)
  const isSortDirDesc = ref(true)
  const isBusy = ref(false)
  const dataMeta = computed(() => {
    const localItemsCount = refStoplistListTable.value ? refStoplistListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalStoplists.value,
    }
  })

  const refetchData = () => {
    refStoplistListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, sendersFilter], () => {
    refetchData()
  })

  const fetchStoplists = (ctx, callback) => {
    isBusy.value = true
    try {
      let userData = Vue.$cookies.get('userData')
      console.log('useStopList - User data from cookies:', userData)
      console.log('useStopList - User data membership:', userData?.membership)
      
      // Fix old cookie data structure if needed
      if (userData && typeof userData.membership === 'string') {
        console.log('useStopList - Fixing old cookie data structure...')
        userData.membership = {
          type: userData.membership,
          organisation_id: 1,
          name: 'Demo Organisation'
        }
        // Update the cookie with fixed data
        Vue.$cookies.set('userData', userData, '2m')
        console.log('useStopList - Updated user data:', userData)
      }
      
      const orgId = userData?.membership?.organisation_id
      if (!orgId) {
        console.error('No organisation ID found in user data')
        console.error('Available user data keys:', Object.keys(userData || {}))
        console.error('Available membership keys:', Object.keys(userData?.membership || {}))
        isBusy.value = false
        return
      }
      
      store
        .dispatch('stoplists/fetchOrganisationStopList', {
          org_id: orgId,
          q: searchQuery.value,
          per_page: perPage.value,
          page: currentPage.value,
          sortBy: sortBy.value,
          sortDesc: isSortDirDesc.value,
          sender: sendersFilter.value,
        })
      .then(response => {
        const { results, count } = response.data
        isBusy.value = false

        callback(results)
        totalStoplists.value = count
      })
      .catch((error) => {
        console.error('Error fetching stoplists:', error)
        isBusy.value = false
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching stoplists' list",
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
    } catch (error) {
      console.error('Error in fetchStoplists:', error)
      isBusy.value = false
    }
  }
  return {
    fetchStoplists,
    perPage,
    currentPage,
    totalStoplists,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refStoplistListTable,
    tableColumns,
    refetchData,
    isBusy,
    sendersFilter,
  }
}
