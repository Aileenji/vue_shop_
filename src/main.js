import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import 'element-ui/lib/theme-chalk/index.css';
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme





axios.defaults.baseURL='https://lianghj.top:8888/api/private/v1/'
// axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'

// axios请求拦截器
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})

Vue.use(VueQuillEditor, /* { default global options } */)
Vue.prototype.$http=axios
Vue.config.productionTip = false
Vue.component('tree-table',TreeTable)
Vue.filter('dataFoemat',function(orifinval){
  const dt = new Date(orifinval)

  const y=dt.getFullYear()
  const m = (dt.getMonth()+1 +'').padStart('2','0')
  const d = (dt.getDay() +'').padStart('2','0')
  const hh = (dt.getHours()+'').padStart('2','0')
  const mm = (dt.getMinutes() +'').padStart('2','0')
  const ss = (dt.getSeconds() +'').padStart('2','0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
