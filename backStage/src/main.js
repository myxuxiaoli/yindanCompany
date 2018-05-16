// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
//主组件
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css';
Vue.use(ElementUI);
//vue路由
import router from './router';
//vuex配置文件
import store from '@/config/store';
//常用过滤器
import filter from '@/config/filter';
Vue.use(filter);
Vue.config.productionTip = false;
/* eslint-disable no-new */
window.$vm = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
});
//板块
import Upload from '@/components/common/upload.vue';
Vue.component('zUpload', Upload);
//上传图片
import Modular from '@/components/common/zModular.vue';
Vue.component('zModular', Modular);
