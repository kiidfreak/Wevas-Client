<template>
  <b-card no-body>
    <b-modal
      id="add-contact-modal"
      title="Add contact to group"
      ok-title="Send"
      ok-variant="success"
      header-text-variant="primary"
      cancel-variant="outline-secondary"
      modal-class="modal-sticky"
      body-class="p-0"
      size="lg"
      :visible="isAddContactModalOpen"
      @change="(val) => $emit('update:is-add-contact-modal-open', val)"
      @ok="uploadContact"
    >
      <b-form
        class="m-2"
        validated
      >
        <b-form-group
          label="Phone"
          label-for="phone"
        >
          <b-form-input
            id="phone"
            v-model="contactData.phone"
            required
          />
        </b-form-group>
        <div
          v-for="field in customFields"
          v-bind:key="field"
        >
          <b-form-group
            :label="field"
            :label-for="field"
          >
            <b-form-input
              :id="field"
              required
              @change="val => contactData.extra_fields[field] = val"
            />
          </b-form-group>
        </div>
      </b-form>
    </b-modal>
  </b-card>
</template>

<script>
import Vue from 'vue'
import {
  // BRow,
  // BCol,
  BCard,
  BModal,
  BForm,
  BFormGroup,
  BFormInput,
} from 'bootstrap-vue'
// import vSelect from 'vue-select'
// import InputTag from 'vue-input-tag'
import Ripple from 'vue-ripple-directive'
// import axios from '@axios'
// import { v4 as uuidv4 } from 'uuid'
import { onUnmounted, ref } from '@vue/composition-api'
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import store from '@/store'
import addressBookStoreModule from '../addressBookStoreModule'

export default {
  components: {
    // BRow,
    // BCol,
    BCard,
    /* vSelect, */
    BModal,
    BForm,
    BFormGroup,
    BFormInput,
    /* InputTag, */
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isAddContactModalOpen',
    event: 'update:is-add-contact-modal-open',
  },
  props: {
    groupId: {
      type: Number,
      required: true,
    },
    customFields: {
      type: Array,
      required: false,
      default: null,
    },
    isAddContactModalOpen: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    status: '',
    senders: [],
  }),
  setup(props, { emit }) {
    const membership = ref(
      JSON.parse(JSON.stringify(Vue.$cookies.get('userData').membership)),
    )
    const ADDRESS_BOOK_STORE_MODULE_NAME = 'address-books'
    // Register module
    if (!store.hasModule(ADDRESS_BOOK_STORE_MODULE_NAME)) {
      store.registerModule(
        ADDRESS_BOOK_STORE_MODULE_NAME,
        addressBookStoreModule,
      )
    }
    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(ADDRESS_BOOK_STORE_MODULE_NAME)) { store.unregisterModule(ADDRESS_BOOK_STORE_MODULE_NAME) }
    })
    const blankContactData = {
      phone: '',
      extra_fields: {},
    }
    const toast = useToast()
    const recipient = ref('')
    const contactData = ref(JSON.parse(JSON.stringify(blankContactData)))
    const resetContactData = () => {
      contactData.value = JSON.parse(JSON.stringify(blankContactData))
      emit('update:is-add-contact-modal-open', false)
    }
    return {
      resetContactData,
      contactData,
      membership,
      recipient,
      toast,
    }
  },
  methods: {
    uploadContact() {
      if (!this.contactData.phone) {
        this.toast({
          component: ToastificationContent,
          props: {
            title: 'Please enter a phone number',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
        return
      }
      const postData = {
        phone: this.contactData.phone,
        extra_fields: this.contactData.extra_fields,
      }
      store
        .dispatch(
          'address-books/addContact',
          {
            url: `address-books/${this.groupId}/add-single-contact`,
            body: postData,
          },
        )
        .then(res => {
          console.log(res)
          if (res.status === 201) {
            this.toast({
              component: ToastificationContent,
              props: {
                title: 'Contact Uploaded Successfully!',
                icon: 'CoffeeIcon',
                variant: 'success',
              },
            })
            this.resetContactData()
            this.$router.go()
          }
        })
        .catch(() => {
          // console.log('ERROR OCCURED', err)
          this.toast({
            component: ToastificationContent,
            props: {
              title: 'Error Occured!',
              icon: 'AlertTriangleIcon',
              variant: 'danger',
            },
          })
        })
    },
  },
}
</script>
<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}

.sender-filter-select {
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
@import "@core/scss/vue/libs/vue-select.scss"
</style>
