import Vue from 'vue'
import axios from 'axios'
import Buefy from 'buefy'
import VueI18n from 'vue-i18n'
import messages from '@/locales'
import '@/scss/app.scss'

import App from './App'
import router from './router'
import store from './store'
import db from './datastore'

Vue.use(VueI18n)
Vue.use(Buefy, {
  defaultIconPack: 'fa',
  defaultToastDuration: 3500
})

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  silentTranslationWarn: true,
  messages
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false
Vue.http = Vue.prototype.$http = axios
Vue.http.defaults.baseURL = process.env.API_URL
Vue.prototype.$db = db

// TODO
Vue.mixin({
  data: function () {
    return {
      get API_URL () {
        return process.env.API_URL
      }
    }
  }
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  i18n,
  template: '<App/>'
}).$mount('#app')
