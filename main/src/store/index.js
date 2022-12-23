import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
Vue.use(Vuex)
import tabs from './module/tabs.js'

const store = new Vuex.Store({
  state: {},
  actions: {},
  mutations: {},
  getters,
  modules: {
    tabs
  }
})

export default store

// export default createStore({
//   state: {},
//   actions: {},
//   mutations: {},
//   getters: {},
//   modules: {
//     tabs
//   }
// })
