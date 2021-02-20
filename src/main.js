import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//导入路由
import router from './plugins/router.js'
//导入axios
import './plugins/axios.js'
import qs from 'qs'
import Auth from './directives/auth'
import VueParticles from 'vue-particles'  
Vue.use(VueParticles) 
Vue.config.productionTip = false
Vue.prototype.$qs = qs
Vue.use(Auth);
Vue.use(ElementUI);
//引入样式
import '@/style/index.scss' // global css
//引入公共变量
import common from './plugins/common.js'
//引入富文本组件
import VueQuillEditor from "vue-quill-editor/src";

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.prototype.$common = common;
Vue.use(VueQuillEditor)



new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
