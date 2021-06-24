import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false

// 解决移动端点击300毫秒延迟
fastclick.attach(document.body);

import './assets/less/index.less'
import 'lib-flexible'



Vue.use(VueLazyload, {
  error: require('./assets/image/default01.jpg'),
  loading: require('./assets/image/default01.jpg')
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
