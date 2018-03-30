import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'

// import VueSocketio from 'vue-socket.io';
// Vue.use(VueSocketio, 'http://localhost:8080', store);


Vue.config.productionTip = false
store.dispatch('startGame')
store.dispatch('rouseDragon')
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,  
  router,
  components: { App },
  template: '<App/>'
})
