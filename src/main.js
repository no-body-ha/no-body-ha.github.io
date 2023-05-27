import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入svg-icon自定义组件
import "@/assets/images/icons"

import hljs from 'highlight.js' //导入代码高亮文件
import 'highlight.js/styles/monokai-sublime.css'  //导入代码高亮样式
//自定义一个代码高亮指令
Vue.directive('highlight', function (el) {
  let highlight = el.querySelectorAll('pre code');
  highlight.forEach((block) => {
    hljs.highlightBlock(block)
  })
})

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import 'animate.css';

import Cookies from 'js-cookie'
Vue.prototype.$Cookies = Cookies

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
