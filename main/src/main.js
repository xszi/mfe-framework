import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import { MessageBox } from 'element-ui';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import '@/styles/index.scss'

import App from './App.vue'
import router from './router'
import store from './store'

import '@/icons' // icon

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false
Vue.prototype.$message =  MessageBox

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
