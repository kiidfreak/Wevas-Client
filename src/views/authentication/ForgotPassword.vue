<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">

      <!-- Brand logo-->
      <b-link class="brand-logo">
        <b-img
          style="width:auto; height:100px"
          :src="appLogoImage"
          alt="logo"
        />
      </b-link>
      <!-- /Brand logo-->

      <!-- Left Text-->
      <b-col
        lg="8"
        class="d-none d-lg-flex align-items-center p-5"
      >
        <div class="w-100 d-lg-flex align-items-center justify-content-center px-5">
          <b-img
            fluid
            :src="imgUrl"
            alt="Forgot password V2"
          />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Forgot password-->
      <b-col
        lg="4"
        class="d-flex align-items-center auth-bg px-2 p-lg-5"
      >
        <b-col
          sm="8"
          md="6"
          lg="12"
          class="px-xl-2 mx-auto"
        >
          <b-card-title class="mb-1">
            Forgot Password? 🔒
          </b-card-title>
          <b-card-text class="mb-2">
            Enter your email and we'll send you instructions to reset your password
          </b-card-text>

          <!-- form -->
          <validation-observer ref="emailForm">
            <b-form
              class="auth-forgot-password-form mt-2"
              @submit.prevent="sendResetLink"
            >
              <b-form-group
                label="Email"
                label-for="forgot-password-email"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Email"
                  rules="required|email"
                >
                  <b-form-input
                    id="forgot-password-email"
                    v-model="userEmail"
                    :state="errors.length > 0 ? false:null"
                    name="forgot-password-email"
                    placeholder="john@example.com"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-button
                type="submit"
                variant="primary"
                block
              >
                Send reset link
              </b-button>
            </b-form>
          </validation-observer>

          <p class="text-center mt-2">
            <b-link :to="{name:'auth-login'}">
              <feather-icon icon="ChevronLeftIcon" /> Back to login
            </b-link>
          </p>
        </b-col>
      </b-col>
      <!-- /Forgot password-->
    </b-row>
  </div>
</template>

<script>
import { $themeConfig } from '@themeConfig'
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BRow, BCol, BLink, BCardTitle, BCardText, BImg, BForm, BFormGroup, BFormInput, BButton,
} from 'bootstrap-vue'
import { required, email } from '@validations'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import store from '@/store/index'
import useJwt from '@/auth/jwt/useJwt'
// import { response } from 'express'

export default {
  components: {
    BRow,
    BCol,
    BLink,
    BImg,
    BForm,
    BButton,
    BFormGroup,
    BFormInput,
    BCardTitle,
    BCardText,
    ValidationProvider,
    ValidationObserver,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
  data() {
    return {
      userEmail: '',
      sideImg: require('@/assets/images/pages/forgot-password-v2.svg'),
      // validation
      required,
      email,
      appLogoImage: $themeConfig.app.appLogoImage,
    }
  },
  computed: {
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/forgot-password-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    },
  },
  methods: {
    sendResetLink() {
      this.$refs.emailForm.validate().then(success => {
        if (success) {
          useJwt.sendResetLink({
            email: this.userEmail,
          })
            .then(response => {
              // console.log(response)
              if (String(response.status) === '200') {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: response.data.detail,
                    icon: 'CoffeeIcon',
                    variant: 'success',
                  },
                })
              }
            })
            .catch(error => {
              // console.log(error.response.data.detail)
              if (error?.response?.data?.detail) {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: error?.response?.data?.detail,
                    icon: 'AlertTriangleIcon',
                    variant: 'danger',
                  },
                })
              }
            })
        }
      })
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
