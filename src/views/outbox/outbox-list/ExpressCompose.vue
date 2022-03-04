<template>
  <b-card no-body>
    <b-modal
      id="express-compose-modal"
      title="Send an express message"
      ok-title="Send"
      ok-variant="success"
      header-text-variant="primary"
      cancel-variant="outline-secondary"
      modal-class="modal-sticky"
      body-class="p-0"
      size="lg"
      :visible="isExpressComposeModalOpen"
      @change="(val) => $emit('update:is-express-compose-modal-open', val)"
      @ok="sendExpressMessages"
    >
      <b-form class="m-2">
        <b-form-group label="Type" label-for="message_type">
          <v-select
            ref="typeFilterSelect"
            id="message-type-filter-select"
            v-model="composeData.type"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :options="expressOptions"
            label="name"
            :reduce="(option) => option.value"
            placeholder="Select message type"
            required
          />
        </b-form-group>
        <b-form-group label="Select Sender ID" label-for="sender-filter-select">
          <v-select
            ref="senderFilterSelect"
            id="sender-filter-select"
            v-model="composeData.sender"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :options="senders"
            label="name"
            @open="fetchSenders"
            :reduce="(name) => name.code"
            placeholder="Select Sender ID"
            required
          />
        </b-form-group>
        <b-form-group label="Message" label-for="message">
          <b-form-input 
            id="message" 
            v-model="composeData.message" 
            required
          />
        </b-form-group>
        <b-form-group label="Recipients" label-for="recipients">
          <input-tag 
            v-model="composeData.recipients"
            class="rounded-sm px-1"
            placeholder="Enter recipients (Press enter to add)"
            validate="digits"
          >
          </input-tag>
        </b-form-group>
      </b-form>
    </b-modal>
  </b-card>
</template>

<script>
import Vue from "vue"
import {
  // BRow,
  // BCol,
  BCard,
  BModal,
  BForm,
  BFormGroup,
  BFormInput,
} from "bootstrap-vue"
import vSelect from "vue-select"
import InputTag from 'vue-input-tag'
import Ripple from "vue-ripple-directive"
import axios from "@axios"
import {v4 as uuidv4} from 'uuid'
import { onUnmounted, ref } from "@vue/composition-api"
import { useToast } from "vue-toastification/composition"
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue"
import campaignsStoreModule from "../../campaigns/campaignStoreModule"
import store from "@/store"

export default {
  components: {       
    // BRow,
    // BCol,
    BCard,
    vSelect,
    BModal,
    BForm,
    BFormGroup,
    BFormInput,
    InputTag,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: "isExpressComposeModalOpen",
    event: "update:is-express-compose-modal-open",
  },
  props: {
    isExpressComposeModalOpen: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    status: "",
    senders: [],
  }),
  setup(props, context) {
    const membership = ref(
      JSON.parse(JSON.stringify(Vue.$cookies.get("userData").membership))
    )
    const CAMPAIGNS_STORE_MODULE_NAME = "campaigns"
    // Register module
    if (!store.hasModule(CAMPAIGNS_STORE_MODULE_NAME))
      store.registerModule(CAMPAIGNS_STORE_MODULE_NAME, campaignsStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(CAMPAIGNS_STORE_MODULE_NAME))
        store.unregisterModule(CAMPAIGNS_STORE_MODULE_NAME)
    })
    const expressOptions = [
      { name: "Ex. Bulk SMS", value: 1 },
      { name: "Ex. Premium SMS", value: 4 },
      { name: "Ex. Two-Way SMS", value: 5 },
    ]
    const blankComposeData = {
      org_id: membership.value.organisation_id,
      type: "",
      sender: "",
      message: "",
      recipients: [],
    }
    const toast = useToast()
    const recipient = ref("")
    const composeData = ref(JSON.parse(JSON.stringify(blankComposeData)))
    const resetComposeData = () => {
      composeData.value = JSON.parse(JSON.stringify(blankComposeData))
    }
    return {
      resetComposeData,
      composeData,
      membership,
      expressOptions,
      recipient,
      toast
    }
  },
  methods: {
    fetchSenders() {
      const type = this.composeData.type
      if(!type) {
        this.toast({
          component: ToastificationContent,
          props: {
            title: "Please select a campaign type first",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        })
        return
      }
      store
        .dispatch("campaigns/fetchOrganisationSenders", {
          orgId: this.composeData.org_id,
          type: this.composeData.type,
          is_active: true,
        })
        .then(response => {
          // console.log(response.data)
          this.senders = response.data.results
        })
        .catch(err => {
          // console.log(err)
        })
    },
    sendExpressMessages() {
      axios
        .get(`/organisations/api-keys/${this.composeData.org_id}`)
        .then(response => {
          if (response.status === 200){
            const messages = []
            this.composeData.recipients.map(phone => {
              messages.push({
                recipient: phone,
                message: this.composeData.message,
                message_type: this.composeData.type,
                req_type: 1,
                external_id: uuidv4(),
              })
            })
            const postData = {
              profile_code: this.composeData.sender,
              messages: messages,
              req_type: this.composeData.type,
              dlr_callback_url: "http://example.com",
            }
            axios
              .post(
                '/outbox/create', 
                postData,
                {
                  headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": response.data.results[0].api_key_encoded,
                  },
                }
              )
              .then(res => {
                console.log(res.data)
                this.resetComposeData()
                this.emit("update:is-express-compose-modal-open", false)
              })
              .catch(err => {
                console.log("ERROR OCCURED", err)
                this.toast({
                  component: ToastificationContent,
                  props: {
                    title: "Error occurred while sending messages",
                    icon: "AlertTriangleIcon",
                    variant: "danger",
                  },
                })
              })
          }
        })
        .catch(err => {
          console.log(err)
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
