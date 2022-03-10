<template>
  <div class="bulk-account">
    <b-nav-item-dropdown
      id="dropdown-grouped"
      variant="link"
      class="dropdown-language d-inline-block overflow-y-auto"
      right
    >
      <template #button-content>
        <span> SMS Credits: {{ orgCurrency.name }}</span>
        <span class="text-body">
          {{ parseFloat(parseFloat(bulkAccounts.credits) * parseFloat(orgCurrency.rate)).toFixed(2) }}
        </span>
        <span>
          <feather-icon
            size="16"
            icon="ChevronDownIcon"
            class="ml-1"
          />
        </span>
        <span>
          <feather-icon
            size="13"
            icon="RefreshCwIcon"
            class="ml-1 text-primary"
            @click="refreshBulkAccount"
          />
        </span>
      </template>
      <b-dropdown-item
        v-for="(curr, index) in currencies"
        :key="index"
        @click="changeCurrency(curr.value)"
      >
        <span
          class="ml-2"
        >{{ curr.name.toLocaleString() }}</span>
      </b-dropdown-item>
    </b-nav-item-dropdown>
  </div>
</template>

<script>
import Vue from 'vue'
import { ref } from '@vue/composition-api'
import { BNavItemDropdown, BDropdownItem } from 'bootstrap-vue'
// import vSelect from 'vue-select'
import axios from '@axios'
import { get } from 'axios'

export default {
  components: {
    BNavItemDropdown,
    BDropdownItem,
    // vSelect,
  },
  setup() {
    /* eslint-disable global-require */
    const userData = ref(JSON.parse(JSON.stringify(Vue.$cookies.get('userData'))))
    const bulkAccounts = ref(userData.value.bulk_accounts)
    const orgCurrency = ref({
      name: 'KES',
      value: 'KES',
      rate: 1,
    })
    const currencies = [
      {
        name: 'KES',
        value: 'KES',
      },
      {
        name: 'USD',
        value: 'USD',
      },
      {
        name: 'EUR',
        value: 'EUR',
      },
      {
        name: 'GBP',
        value: 'GBP',
      },
      {
        name: 'CAD',
        value: 'CAD',
      },
    ]
    /* eslint-disable global-require */

    if (userData.value.currency.name === undefined || userData.value.currency.rate === undefined) {
      userData.value.currency = JSON.parse(JSON.stringify(orgCurrency.value))
      Vue.$cookies.set('userData', JSON.parse(JSON.stringify(userData.value)), '2m')
    } else {
      orgCurrency.value = JSON.parse(JSON.stringify(userData.value.currency))
    }

    const changeCurrency = curr => {
      // refresh org currency
      get(`https://v6.exchangerate-api.com/v6/{API_KEY}/pair/KES/${curr}`)
        .then(res => {
          orgCurrency.value = {
            name: curr,
            value: curr,
            rate: parseFloat(res.data.conversion_rate),
          }
          userData.value.currency = JSON.parse(JSON.stringify(orgCurrency.value))
          // console.log('New currency: ', JSON.parse(JSON.stringify(userData.value.currency)))
          Vue.$cookies.set('userData', JSON.parse(JSON.stringify(userData.value)), '2m')
        })
        .catch(err => {
          console.log('ERROR OCCURED', err)
        })
    }

    return {
      userData,
      currencies,
      orgCurrency,
      bulkAccounts,
      changeCurrency,
    }
  },
  methods: {
    refreshBulkAccount() {
      axios.get(`/organisations/bulk-account/${this.bulkAccounts.id}`).then(res => {
        this.bulkAccounts = res.data
      })
        .catch(() => {
        })
    },
  },
}
</script>

<style>
</style>
