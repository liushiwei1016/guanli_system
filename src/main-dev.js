import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import 'css/index.scss'
import './assets/iconfont/iconfont.css'
import {Message} from 'element-ui'
//导入表格树形插件
import tree_table from 'vue-table-with-tree-grid'
//导入富文本编辑器插件(这里是全局导入，也可以局部页面导入)
import VueQuillEditor from 'vue-quill-editor'
//导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//注册为全局组件
Vue.component('tree-table', tree_table);

Vue.prototype.$message = Message;

Vue.use(ElementUI);
//全局注册富文本编辑器组件
Vue.use(VueQuillEditor)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
