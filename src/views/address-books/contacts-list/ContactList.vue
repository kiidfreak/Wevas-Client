<template>
<div>
  <!-- Table Container Card -->
  <b-card
    no-body
  >
  <div class="m-2">
      <!-- Table Top -->
      <b-row>
        <!-- Per Page -->
        <b-col
          cols="12"
          md="5"
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
          <!-- <b-button
            variant="primary"
            @click="isAddNewContactSidebarActive = true"
          >
            <span  class="text-nowrap">Add New Contact</span>
          </b-button> -->
        </b-col>
        <!-- Search -->
        <b-col
          cols="12"
          lg="6"
          md="5"
        >
          <div class="d-flex align-items-center justify-content-end">
            <b-form-input
              v-model="searchQuery"
              class="d-inline-block mr-1"
              placeholder="Search..."
            />
            <v-select
              v-model="operatorFilter"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="operatorOptions"
              class="contact-filter-select"
              placeholder="Select Operator"
            >
              <template #selected-option="{ label }">
                <span class="text-truncate overflow-hidden">
                  {{ label }}
                </span>
              </template>
            </v-select>
          </div>
        </b-col>
        <!-- Delete Button -->
        <b-col
          cols="12"
          lg="1"
          md="2"
        >
          <!-- <b-button
            size="sm"
            variant="danger"
            @click="e => deleteContacts()"
            :visible="selectedContacts.length !== 0"
          > -->
          <feather-icon
            icon="TrashIcon"
            class="text-white mt-1 ml-2"
            size="22"
            @click="e => deleteContacts()"
            :visible="selectedContacts.length !== 0"
          />
          <!-- </b-button> -->
        </b-col>
      </b-row>

    </div>

    <b-table
      id="contact-list-table"
      ref="refContactListTable"
      :items="fetchContacts"
      :fields="tableColumns"
      responsive
      primary-key="id"
      :sort-by.sync="sortBy"
      show-empty
      empty-text="No matching records found"
      :sort-desc.sync="isSortDirDesc"
      class="position-relative"
    >
      <!-- Select Contact -->
      <template #cell(select)="data">
        <b-form-checkbox
          :id="`select-contacts-${data.item.id}`"
          :name="`select-contacts-${data.item.id}`"
          :value="true"
          :unchecked-value="false"
          @change="e => selectContacts(e, data.item.id)"
        />
      </template>
      <!-- Contact: Id -->
      <template #cell(id)="data">
        <b-link
          :to="{ name: 'apps-contact-preview', params: { id: data.item.id }}"
          class="font-weight-bold"
        >
          #{{ data.value }}
        </b-link>
      </template>
      <!-- Column: Recipient -->
      <template #cell(contact)="data">
        <b-avatar
          :id="`group-row-${data.item.id}-type`"
          size="32"
          :variant="`light-${resolveContactTypeVariantAndIcon(data.item.type).variant}`"
        >
          <feather-icon
            :icon="resolveContactTypeVariantAndIcon(data.item.type).icon"
          />
        </b-avatar>
          <span class="ml-2">{{ data.item.contact }}</span>
      </template>
      <!-- Column: Actions -->
      <template #cell(actions)="data">

        <div class="text-nowrap">
          <!-- <feather-icon
            :id="`contact-row-${data.item.id}-send-icon`"
            icon="SendIcon"
            class="cursor-pointer"
            size="16"
          />
          <b-tooltip
            title="Send Contact"
            class="cursor-pointer"
            :target="`contact-row-${data.item.id}-send-icon`"
          /> -->

          <!-- <feather-icon
            :id="`contact-row-${data.item.id}-preview-icon`"
            icon="EyeIcon"
            size="16"
            class="mx-1"
            @click="$router.push({ name: 'apps-contact-preview', params: { id: data.item.id }})"
          />
          <b-tooltip
            title="Preview Contact"
            :target="`contact-row-${data.item.id}-preview-icon`"
          /> -->

          <!-- Dropdown -->
          <b-dropdown
            variant="link"
            toggle-class="p-0"
            no-caret
            :right="$store.state.appConfig.isRTL"
          >

            <template #button-content>
              <feather-icon
                icon="MoreVerticalIcon"
                size="16"
                class="align-middle text-body"
              />
            </template>
            <!-- <b-dropdown-item>
              <feather-icon icon="DownloadIcon" />
              <span class="align-middle ml-50">Download</span>
            </b-dropdown-item>
            <b-dropdown-item :to="{ name: 'address', params: { id: data.item.id } }">
              <feather-icon icon="EditIcon" />
              <span class="align-middle ml-50">Edit</span>
            </b-dropdown-item> -->
            <b-dropdown-item>
              <feather-icon icon="TrashIcon" />
              <span
                class="align-middle ml-50"
                @click="e => deleteContacts(data.item.id)"
              >Delete</span>
            </b-dropdown-item>
            <!-- <b-dropdown-item>
              <feather-icon icon="CopyIcon" />
              <span class="align-middle ml-50">Duplicate</span>
            </b-dropdown-item> -->
          </b-dropdown>
        </div>
      </template>

    </b-table>
    <div class="mx-2 mb-2">
      <b-row>

        <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-start"
        >
          <span class="text-muted">Showing {{ dataMeta.from }} to {{ dataMeta.to }} of {{ dataMeta.of }} entries</span>
        </b-col>
        <!-- Pagination -->
        <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-end"
        >

          <b-pagination
            v-model="currentPage"
            :total-rows="totalContacts"
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
  BCard, BRow, BCol, BFormInput, BFormCheckbox, BTable, BAvatar, BLink,
  /* BButton */ BDropdown, BDropdownItem, BPagination, /* BTooltip */
} from 'bootstrap-vue'
import { avatarText } from '@core/utils/filter'
import vSelect from 'vue-select'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { ref, onUnmounted } from '@vue/composition-api'
import { useToast } from 'vue-toastification/composition'
import store from '@/store'
import useContactsList from './useContactList'

import addressBookStoreModule from '../addressBookStoreModule'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BFormInput,
    BFormCheckbox,
    BTable,
    // BButton,
    // BMedia,
    BAvatar,
    BLink,
    // BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    // BTooltip,

    vSelect,
    // ToastificationContent,
  },
  props: {
    groupId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const ADDRESS_BOOK_STORE_MODULE_NAME = 'address-books'

    // Register module
    if (!store.hasModule(ADDRESS_BOOK_STORE_MODULE_NAME)) store.registerModule(ADDRESS_BOOK_STORE_MODULE_NAME, addressBookStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(ADDRESS_BOOK_STORE_MODULE_NAME)) store.unregisterModule(ADDRESS_BOOK_STORE_MODULE_NAME)
    })

    // const isAddNewContactSidebarActive = ref(false)
    const toast = useToast()
    const operatorOptions = [
      'Safaricom',
      'Airtel',
      'Telkom',
      'Finserve',
    ]
    const {
      fetchContacts,
      tableColumns,
      perPage,
      currentPage,
      totalContacts,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refContactListTable,

      operatorFilter,

      refetchData,

      resolveContactTypeVariantAndIcon,
      resolveClientAvatarVariant,
    } = useContactsList(props)

    const resetContactData = ref(() => {
      this.selectedContacts = []
    })

    return {
      fetchContacts,
      tableColumns,
      perPage,
      currentPage,
      totalContacts,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refContactListTable,
      operatorFilter,
      refetchData,
      operatorOptions,
      avatarText,
      toast,
      resolveContactTypeVariantAndIcon,
      resolveClientAvatarVariant,
      resetContactData,
      // isAddNewContactSidebarActive,
    }
  },
  data() {
    return {
      selectedContacts: [],
    }
  },
  methods: {
    selectContacts(selected, cid) {
      if (selected && !this.selectedContacts.includes(cid)) {
        this.selectedContacts.push(cid)
      } else if (!selected && this.selectedContacts.includes(cid)) {
        const index = this.selectedContacts.indexOf(cid)
        if (index > -1) this.selectedContacts.splice(index, 1)
      }
    },
    deleteContacts(cid = null) {
      this.$bvModal
        .msgBoxConfirm(
          'Please confirm that you want to delete selected contacts',
          {
            title: 'Delete Contacts',
            size: 'md',
            buttonSize: 'md',
            okVariant: 'danger',
            okTitle: 'Delete',
            cancelTitle: 'Cancel',
            hideHeaderClose: false,
          },
        )
        .then(value => {
          this.status = value
          if (value) {
            if (cid !== null) this.selectedContacts = [cid]
            store
              .dispatch(
                'address-books/deleteContacts',
                {
                  url: `address-books/${this.groupId}/delete-contacts`,
                  body: {
                    pks: this.selectedContacts,
                  },
                },
              )
              .then(res => {
                if (res.status === 200) {
                  this.toast({
                    component: ToastificationContent,
                    props: {
                      title: 'Contact Deleted Successfully!',
                      icon: 'CoffeeIcon',
                      variant: 'success',
                    },
                  })
                  this.$router.go()
                }
              })
              .catch(err => {
                console.log('ERROR OCCURED', err)
                this.toast({
                  component: ToastificationContent,
                  props: {
                    title: 'Error Occured!',
                    icon: 'AlertTriangleIcon',
                    variant: 'danger',
                  },
                })
              })
          }
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}

.contact-filter-select {
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
@import '@core/scss/vue/libs/vue-select.scss';
</style>
