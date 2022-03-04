import Vue from 'vue'

// axios
import axios from 'axios'
import router from '@/router'

const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  // baseURL: '/api/',
  baseURL: 'http://evilcorp.localhost:8000/api/',
  // baseURL: 'https://bulkdev.swifttdial.com:2778/api/',
  // baseURL: 'https://smsapi.swifttdial.com:2778/api/',
  timeout: 9000,
  // headers: {'X-Custom-Header': 'foobar'}
})

// Response interceptor to serve as middleware after reciving response
axiosIns.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  return response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  if (error && error.response && error.response.status === 401) 
    router.push({ name: 'auth-login' })
  return Promise.reject(error)
})

// Request interceptor to serve as middleware before sending request
axiosIns.interceptors.request.use(function (config) {
  // Do something before request is sent
  // if (Object.keys(config.headers).includes("X-API-Key")) 
  //   delete config.headers["Authorization"]
  // console.log(Object.keys(config.headers))
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

Vue.prototype.$http = axiosIns

export default axiosIns
