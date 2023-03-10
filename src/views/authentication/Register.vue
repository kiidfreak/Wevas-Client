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
            alt="Register V2"
          />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Register-->
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
            Welcome to SWIFTT SMS 👋
          </b-card-title>
          <b-card-text class="mb-2">
            Register and start sending SMS today
          </b-card-text>

          <!-- form -->
          <validation-observer
            ref="registerForm"
            #default="{invalid}"
          >
            <b-form
              class="auth-register-form mt-2"
              @submit.prevent="register"
            >
              <!-- divider -->
              <div class="divider my-2">
                <div class="divider-text">
                  Organisation Details
                </div>
              </div>

              <!-- org. name -->
              <b-form-group
                label="Organisation Name"
                label-for="register-org-name"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Organisation Name"
                  vid="org_name"
                  rules="required"
                >
                  <b-form-input
                    id="register-org-name"
                    v-model="orgName"
                    name="register-org-name"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Swifttdial Systems Limited"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- org. email -->
              <b-form-group
                label="Organisation Billing Email"
                label-for="register-org-name"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Organisation Billing Email"
                  vid="org_email"
                  rules="required"
                >
                  <b-form-input
                    id="register-org-email"
                    v-model="orgEmail"
                    name="register-org-email"
                    :state="errors.length > 0 ? false:null"
                    placeholder="billing@example.com"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- org. address -->
              <b-form-group
                label="Organisation Address"
                label-for="register-address"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Organisation Address"
                  vid="org_address"
                  rules="required"
                >
                  <b-form-input
                    id="register-org-address"
                    v-model="orgAddress"
                    name="register-org-address"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Lanagata Links Rd., Nairobi, Kenya"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- divider -->
              <div class="divider my-2">
                <div class="divider-text">
                  Admin Details
                </div>
              </div>

              <b-row
                sm="8"
                md="6"
                lg="12"
                class="mx-0"
              >
                <b-col
                  md="12"
                  lg="6"
                  class="mx-0 px-0 cm-2"
                >
                  <!-- firstname -->
                  <b-form-group
                    label="Firstname"
                    label-for="register-firstname"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Firstname"
                      vid="firstname"
                      rules="required"
                    >
                      <b-form-input
                        id="register-firstname"
                        v-model="userFirstname"
                        name="register-firstname"
                        :state="errors.length > 0 ? false:null"
                        placeholder="John"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>

                <b-col
                  md="12"
                  lg="6"
                  class="mx-0 px-0 cm-2"
                >
                  <!-- lastname -->
                  <b-form-group
                    label="Lastname"
                    label-for="register-lastname"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Lastname"
                      vid="lastname"
                      rules="required"
                    >
                      <b-form-input
                        id="register-lastname"
                        v-model="userLastname"
                        name="register-lastname"
                        :state="errors.length > 0 ? false:null"
                        placeholder="Doe"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
              </b-row>

              <!-- email -->
              <b-form-group
                label="Email"
                label-for="register-email"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Email"
                  vid="email"
                  rules="required|email"
                >
                  <b-form-input
                    id="register-email"
                    v-model="userEmail"
                    name="register-email"
                    :state="errors.length > 0 ? false:null"
                    placeholder="john@example.com"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- phone -->
              <b-form-group
                label="Phone"
                label-for="register-email"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Phone Number"
                  vid="phone"
                  rules="required"
                >
                  <b-form-input
                    id="register-email"
                    v-model="userPhone"
                    name="register-email"
                    :state="errors.length > 0 ? false:null"
                    placeholder="2547123456789"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- <b-form-group
                label-for="register-password"
                label="Password"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Password"
                  vid="password"
                  rules="required"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid':null"
                  >
                    <b-form-input
                      id="register-password"
                      v-model="password"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      :state="errors.length > 0 ? false:null"
                      name="register-password"
                      placeholder="············"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        :icon="passwordToggleIcon"
                        class="cursor-pointer"
                        @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group> -->

              <b-form-group>
                <b-form-checkbox
                  id="register-privacy-policy"
                  v-model="status"
                  name="checkbox-1"
                >
                  I agree to
                  <b-link>privacy policy & terms</b-link>
                </b-form-checkbox>
              </b-form-group>

              <b-button
                variant="primary"
                block
                type="submit"
                :disabled="invalid"
              >
                Sign up
              </b-button>
            </b-form>
          </validation-observer>

          <p class="text-center mt-2">
            <span>Already have an account?</span>
            <b-link :to="{name:'auth-login'}">
              <span>&nbsp;Sign in instead</span>
            </b-link>
          </p>

          <!-- divider -->
          <!-- <div class="divider my-2">
            <div class="divider-text">
              or
            </div>
          </div>

          <div class="auth-footer-btn d-flex justify-content-center">
            <b-button
              variant="facebook"
              href="javascript:void(0)"
            >
              <feather-icon icon="FacebookIcon" />
            </b-button>
            <b-button
              variant="twitter"
              href="javascript:void(0)"
            >
              <feather-icon icon="TwitterIcon" />
            </b-button>
            <b-button
              variant="google"
              href="javascript:void(0)"
            >
              <feather-icon icon="MailIcon" />
            </b-button>
            <b-button
              variant="github"
              href="javascript:void(0)"
            >
              <feather-icon icon="GithubIcon" />
            </b-button>
          </div> -->
        </b-col>
      </b-col>
    <!-- /Register-->
    </b-row>
  </div>
</template>

<script>
import { $themeConfig } from '@themeConfig'
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BRow,
  BCol,
  BLink,
  BButton,
  BForm,
  BFormCheckbox,
  BFormGroup,
  BFormInput,
  // BInputGroup,
  // BInputGroupAppend,
  BImg,
  BCardTitle,
  BCardText,
} from 'bootstrap-vue'
import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import store from '@/store/index'
import useJwt from '@/auth/jwt/useJwt'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BRow,
    BImg,
    BCol,
    BLink,
    BButton,
    BForm,
    BCardText,
    BCardTitle,
    BFormCheckbox,
    BFormGroup,
    BFormInput,
    // BInputGroup,
    // BInputGroupAppend,
    // validations
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      status: '',
      orgName: '',
      orgEmail: '',
      orgAddress: '',
      userFirstname: '',
      userLastname: '',
      userEmail: '',
      userPhone: '',
      password: '',
      sideImg: require('@/assets/images/pages/register-v2.svg'),
      // validation
      required,
      email,
      appLogoImage: $themeConfig.app.appLogoImage,
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/register-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    },
  },
  methods: {
    register() {
      this.$refs.registerForm.validate().then(success => {
        if (success && this.status) {
          useJwt.register({
            org_name: this.orgName,
            address: this.orgAddress,
            email: this.orgEmail,
            first_name: this.userFirstname,
            last_name: this.userLastname,
            contact_email: this.userEmail,
            contact_phone: this.userPhone,
            password: this.password,
          })
            .then(response => {
              // console.log(response)
              if (String(response.status) === '200') {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: response.data.Success,
                    icon: 'CoffeeIcon',
                    variant: 'success',
                  },
                })
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: 'Credentials sent to admin email',
                    icon: 'CoffeeIcon',
                    variant: 'success',
                  },
                })
                useJwt.setToken(response.data.accessToken)
                useJwt.setRefreshToken(response.data.refreshToken)
                localStorage.setItem('userData', JSON.stringify(response.data.userData))
                this.$ability.update(response.data.userData.ability)
                this.$router.push('/')
              }
            })
            .catch(error => {
              // console.log(error)
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
        } else if (!this.status) {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Accept terms and conditions',
              icon: 'AlertTriangleIcon',
              variant: 'danger',
            },
          })
        }
      })
    },
  },
}
/* eslint-disable global-require */
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
.cm-2{
  width: 96% !important;
  margin: auto !important;
}
</style>
