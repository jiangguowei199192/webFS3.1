import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './axios/axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import './style/theme/index.css'
import './style/common.less'
import './assets/font/iconfont.css'
Vue.use(ElementUI)
Vue.prototype.$axios = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
