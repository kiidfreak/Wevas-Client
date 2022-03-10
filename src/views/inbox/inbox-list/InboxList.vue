<template>
  <div>
    <!-- Table Container Card -->
    <b-card no-body>
      <div class="m-2">
        <!-- Table Top -->
        <b-row>
          <!-- Per Page -->
          <b-col
            cols="12"
            md="6"
            class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
          >
            <label>Entries</label>
            <v-select
              v-model="perPage"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="perPageOptions"
              :clearable="false"
              class="per-page-selector d-inline-block ml-50 mr-1"
            />
          </b-col>

          <!-- Search -->
          <b-col
            cols="12"
            md="6"
          >
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                v-model="searchQuery"
                class="d-inline-block mr-1"
                placeholder="Search by recipient or message..."
              />
              <v-select
                v-model="statusFilter"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="statusOptions"
                label="name"
                :reduce="(name) => name.value"
                class="inbox-filter-select"
                placeholder="Select Status"
              />
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        id="inbox-list-table"
        ref="refInboxListTable"
        :items="fetchInbox"
        :fields="tableColumns"
        responsive
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        bordered
        :outlined="true"
        empty-text="No matching records found"
        :sort-desc.sync="isSortDirDesc"
        class="position-relative"
      >
        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle" />
            <strong class="p-2">Loading...</strong>
          </div>
        </template>
        <template #cell(show_details)="row">
          <div class="text-nowrap">
            <b-button
              variant="success"
              class="mr-2"
              @click="row.toggleDetails"
            >
              {{ row.detailsShowing ? "Hide" : "Show" }} Details
            </b-button>
          </div>
        </template>
        <template #cell(sender)="data">
          <span class="text-nowrap">
            <b-badge
              :id="`inbox-row-${data.item.id}-sender`"
              :variant="
                resolveInboxSenderTypeVariant(data.item.type_label).variant
              "
            >
              {{ data.item.sender }}
            </b-badge>
          </span>
        </template>
        <!-- Column: SMS State -->
        <template #cell(replied)="data">
          <span class="text-nowrap">
            <b-badge
              :id="`inbox-row-${data.item.id}-replied`"
              :variant="resolveInboxStatusVariant(data.item.replied).variant"
            >
              {{ data.item.replied }}
            </b-badge>
            <b-tooltip
              v-if="data.item.notes && data.item.notes.length > 0"
              title="Notes"
              class="cursor-pointer"
              :target="`inbox-row-${data.item.id}-state`"
              placement="topright"
            >
              <p class="mb-0">Notes: {{ data.item.notes }}</p>
            </b-tooltip>
          </span>
        </template>
        <!-- Column: Recipient -->
        <template #cell(recipient)="data">
          <span class="text-nowrap">
            <feather-icon
              icon="PhoneIcon"
              class="text-success mr-1"
              size="18"
            />
            {{ data.item.recipient }}
          </span>
        </template>
        <!-- Column: Created Date -->
        <template #cell(created_at)="data">
          <span
            :id="`inbox-row-${data.item.id}-created-at`"
            class="text-nowrap"
          >
            {{ formatDateToMonthLong(data.value) }}
            <b-tooltip
              title="Sent At"
              class="cursor-pointer"
              :target="`inbox-row-${data.item.id}-created-at`"
              placement="topright"
            >
              <p class="mb-0">
                {{ data.item.created_at }}
              </p>
            </b-tooltip>
          </span>
        </template>
        <template #row-details="row">
          <b-card>
            <b-row>
              <b-col cols="12">
                <div>
                  <span
                    class="ml-1"
                  ><strong class="mr-1 text-muted">Link ID : </strong>
                    {{ row.item.link_id }}</span>
                  <span class="ml-2">
                    <strong class="ml-3 text-muted">Operator : </strong><span class="ml-1">{{ row.item.operator }}</span>
                  </span>
                  <span class="ml-2">
                    <strong class="ml-3 text-muted">Reference No. :</strong>
                    <span
                      class="ml-1"
                    ><em>{{ row.item.ref_no }}</em></span>
                  </span>
                </div>
                <div>
                  <b-form
                    v-if="row.item.replied === 'No'"
                    class="ml-1 mt-2"
                    @submit="(e) => onSubmitReply(e, row.item)"
                  >
                    <b-form-group
                      id="input-group-1"
                      label="Your Reply:"
                      label-for="reply"
                    >
                      <b-form-input
                        id="reply"
                        v-model="replyData.reply"
                        placeholder="Enter your message here"
                        required
                      />
                    </b-form-group>

                    <b-button
                      class="h-10"
                      type="submit"
                      variant="primary"
                    >Reply</b-button>
                  </b-form>
                </div>
              </b-col>
            </b-row>
          </b-card>
        </template>
      </b-table>
      <div class="mx-2 mb-2">
        <b-row>
          <b-col
            cols="12"
            sm="6"
            class="
              d-flex
              align-items-center
              justify-content-center justify-content-sm-start
            "
          >
            <span
              class="text-muted"
            >Showing {{ dataMeta.from }} to {{ dataMeta.to }} of
              {{ dataMeta.of }} entries</span>
          </b-col>
          <!-- Pagination -->
          <b-col
            cols="12"
            sm="6"
            class="
              d-flex
              align-items-center
              justify-content-center justify-content-sm-end
            "
          >
            <b-pagination
              v-model="currentPage"
              :total-rows="totalInbox"
              :per-page="perPage"
              first-number
              last-number
              class="mb-0 mt-1 mt-sm-0"
              prev-class="prev-item"
              next-class="next-item"
            >
              <template #prev-text>
                <feather-icon
                  icon="ChevronLeftIcon"
                  size="18"
                />
              </template>
              <template #next-text>
                <feather-icon
                  icon="ChevronRightIcon"
                  size="18"
                />
              </template>
            </b-pagination>
          </b-col>
        </b-row>
      </div>
    </b-card>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BTable,
  BSpinner,
  BPagination,
  BTooltip,
  BBadge,
  BButton,
  BForm,
  BFormGroup,
  BFormInput,
} from 'bootstrap-vue'
// import { avatarText } from '@core/utils/filter'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import { ref, onUnmounted } from '@vue/composition-api'
import { useToast } from 'vue-toastification/composition'
import store from '@/store'
import axios from '@axios'
import { title, formatDateToMonthLong } from '@utils/filters'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useInboxList from './useInboxList'
import inBoxStoreModule from '../inBoxStoreModule'

export default {
  directives: {
    Ripple,
  },
  components: {
    BCard,
    BRow,
    BCol,
    BTable,
    BSpinner,
    BBadge,
    BButton,
    // BMedia,
    // BAvatar,
    // BLink,
    // BBadge,
    BPagination,
    BTooltip,
    BForm,
    BFormGroup,
    BFormInput,
    vSelect,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
  setup() {
    const toast = useToast()
    const INBOX_STORE_MODULE_NAME = 'inbox'

    // Register module
    if (!store.hasModule(INBOX_STORE_MODULE_NAME)) store.registerModule(INBOX_STORE_MODULE_NAME, inBoxStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(INBOX_STORE_MODULE_NAME)) store.unregisterModule(INBOX_STORE_MODULE_NAME)
    })

    const replyData = ref({
      message: {},
      reply: '',
    })

    const resetReplyData = () => {
      replyData.value = {
        message: {},
        reply: '',
      }
    }

    const statusOptions = [
      { name: 'Replied', value: true },
      { name: 'Not replied', value: false },
    ]
    const {
      fetchInbox,
      perPage,
      tableColumns,
      currentPage,
      totalInbox,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refInboxListTable,
      resolveInboxStatusVariant,
      resolveInboxSenderTypeVariant,

      statusFilter,

      refetchData,
      isBusy,

      // resolveInboxStatusVariantAndIcon,
    } = useInboxList()

    return {
      toast,
      fetchInbox,
      tableColumns,
      perPage,
      currentPage,
      totalInbox,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refInboxListTable,
      resolveInboxStatusVariant,
      resolveInboxSenderTypeVariant,

      statusFilter,

      refetchData,
      replyData,
      resetReplyData,

      statusOptions,
      isBusy,
      formatDateToMonthLong,
      // formatDateToMonthLong,
      title,

      // avatarText,
      // resolveInboxStatusVariantAndIcon,
      // isAddNewInboxSidebarActive,
    }
  },
  methods: {
    onSubmitReply(e, message) {
      e.preventDefault()
      const { reply } = this.replyData
      const postData = {
        message: reply,
        shortcode_id: 2,
        link_id: message.link_id,
        recipient: message.recipient,
        org_id: message.org_id,
      }
      axios
        .post('/inbox/reply', postData)
        .then(res => {
          // console.log(res.data)
          if (res.status === 200) {
            this.toast({
              component: ToastificationContent,
              props: {
                title: 'Changes Saved',
                icon: 'CoffeeIcon',
                variant: 'success',
                text: 'Reply has been sent successfully',
              },
            })
          }

          this.resetReplyData()
          // refetchData()
        }).catch(err => {
          // console.log('ERROR OCCURED', err)
        })
    },
  },
}

</script>

<style lang="scss" scoped>
.per-page-selector {
width: 90px;
}

.inbox-filter-select {
min-width: 190px;

::v-deep .vs__selected-options {
flex-wrap: nowrap;
}

::v-deep .vs__selected {
width: 100px;
}
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
