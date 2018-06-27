import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'

Vue.config.productionTip = false
store.dispatch('startGame')
store.dispatch('rouseDragon')
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,  
  router,
  components: { App },
  template: '<App/>',
})

