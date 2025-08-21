<template>
  <section id="dashboard-ecommerce">
    <b-row class="match-height">
      <!-- Per Page -->
        <b-col
          cols="12"
          md="6"
          class="d-flex align-items-start justify-content-start mb-md-0"
        >
         <h5 class="card-title">
            Delivery Report
          </h5>
        </b-col>

        <!-- Search -->
        <b-col
          cols="12"
          md="6"
        >
          <div class="d-flex align-items-start justify-content-start mb-1 ml-auto">
            <label>Report Date</label>
            <flat-pickr
            v-model="rangeConfig.defaultDate"
            @on-close="refreshReport"
            class="form-control"
            :config="rangeConfig"
          />
          </div>
        </b-col>
    </b-row>
    <b-row class="match-height">
      <!-- <b-col
        xl="4"
        md="6"
      >
        <delivery-rate-chart />
      </b-col> -->
      <b-col
        xl="12"
        md="6"
      >
        <delivery-statistics :delivery-report="deliveryReport" />
      </b-col>
    </b-row>
    <b-row class="match-height">
      <!-- Company Table Card -->
      <b-col lg="6">
        <traffic-by-operator-table :table-data="trafficTableData" />
      </b-col>
      <b-col lg="6">
        <address-books-table :tableData="addressBooksTableData"/>
      </b-col>
    </b-row>
    <hr>
    <b-row class="match-height">
      <!-- Per Page -->
        <b-col
          cols="12"
          md="6"
          class="d-flex align-items-start justify-content-start mb-md-0"
        >
         <h5 class="card-title">
            Usage Traffic
          </h5>
        </b-col>

        <!-- Search -->
        <b-col
          cols="12"
          md="6"
        >
          <div class="d-flex align-items-start justify-content-start mb-1 ml-auto">
          </div>
        </b-col>
    </b-row>
    <div class="">
      <traffic-per-month />
    </div>
    <h5 class="card-title">
    Last 5 Messages Sent
    </h5>
    <b-row class="match-height">
      <!-- Company Table Card -->
      <b-col lg="12">
       <outbox-table :table-data="outboxTableData" />
      </b-col>
    </b-row>
  </section>
</template>

<script>
import { BRow, BCol } from 'bootstrap-vue'
import flatPickr from 'vue-flatpickr-component'
import store from '@/store'
import moment from 'moment'
import DeliveryStatistics from './DeliveryStatistics.vue'
// import DeliveryRateChart from './DeliveryRateChart.vue'
import TrafficByOperatorTable from './TrafficByOperatorTable.vue'
import AddressBooksTable from './AddressBooksTable.vue'
import OutboxTable from './OutboxTable.vue'
import TrafficPerMonth from './charts/TrafficPerMonth.vue'
import statsStoreModule from './statsStoreModule'

export default {
  components: {
    BRow,
    BCol,
    // BCardText,
    DeliveryStatistics,
    // DeliveryRateChart,
    TrafficByOperatorTable,
    AddressBooksTable,
    OutboxTable,
    flatPickr,
    TrafficPerMonth,
  },
  mounted() {
    const STATS_STORE_MODULE_NAME = 'stats'
    // Register module
    if (!store.hasModule(STATS_STORE_MODULE_NAME)) store.registerModule(STATS_STORE_MODULE_NAME, statsStoreModule)
    
    this.fetchReport()
  },
  
  beforeDestroy() {
    const STATS_STORE_MODULE_NAME = 'stats'
    // UnRegister on leave
    if (store.hasModule(STATS_STORE_MODULE_NAME)) store.unregisterModule(STATS_STORE_MODULE_NAME)
  },
  data() {
    return {
      data: {},
      blankDeliveryReport: {
        sent: 0,
        waiting: 0,
        queued: 0,
        delivered: 0,
        undelivered: 0,
        failed: 0,
        cancelled: 0,
        total: 0,
        units_used: 0,
      },
      blankConfig: {
        mode: 'range',
        dateFormat: 'Y-m-d',
        allowInput: true,
        defaultDate: [],
      },
      rangeConfig: {
        mode: 'range',
        dateFormat: 'Y-m-d',
        allowInput: true,
        defaultDate: [],
      },
      trafficTableData: [],
      addressBooksTableData: [],
      outboxTableData: [],
      dateRange: [],
      deliveryReport: {
        sent: 0,
        waiting: 0,
        queued: 0,
        delivered: 0,
        undelivered: 0,
        failed: 0,
        cancelled: 0,
        total: 0,
        units_used: 0,
      },
    }
  },
  
  methods: {
    refreshReport(selectedDates, dateStr, instance) {
      const start = moment(new Date(String(selectedDates[0]))).format('YYYY-MM-DD')
      const end = moment(new Date(String(selectedDates[1]))).format('YYYY-MM-DD')
      store.dispatch('stats/fetchReport', {
        start: start,
        end: end,
        org_id: this.$cookies.get('userData').membership.organisation_id,
      })
        .then(response => {
          this.deliveryReport = response.data.delivery_report
          this.trafficTableData = response.data.operator_traffic
          this.addressBooksTableData = response.data.contacts_by_operator
          this.outboxTableData = response.data.outbox
        })
    },
    
    fetchReport() {
      store.dispatch('stats/fetchReport', {
        org_id: this.$cookies.get('userData').membership.organisation_id
      })
        .then(response => {
          this.deliveryReport = response.data.delivery_report
          this.trafficTableData = response.data.operator_traffic
          this.addressBooksTableData = response.data.contacts_by_operator
          this.outboxTableData = response.data.outbox
          this.rangeConfig.defaultDate = [response.data.start, response.data.end]
        })
        .catch(error => {
          console.error('Error fetching report:', error)
        })
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/dashboard-ecommerce.scss';
@import '@core/scss/vue/libs/chart-apex.scss';
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
