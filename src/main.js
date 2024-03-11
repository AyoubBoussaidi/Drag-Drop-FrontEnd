import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import draggable from 'vuedraggable';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en'
import ApiService from './service/apiService.js'
const API_BASE_URL = '/api';
import store from './store/index.js';


Vue.use(ElementUI, { locale })
Vue.config.productionTip = false;
ApiService.init(API_BASE_URL);


new Vue({
  router,
  el: '#app',
  components: {
    draggable,
  },


  render: (h) => h(App),
  store,
}).$mount('#app')
