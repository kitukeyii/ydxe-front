// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex'
// 引入axios
import axios from 'axios'
import VueAxios from 'vue-axios'
// 引入Element UI 相关组件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(ElementUI)

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    if (to.meta.requiresAuth && !sessionStorage.getItem('Token')) {
      next({path: '/login'})
    } else {
      next()
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
