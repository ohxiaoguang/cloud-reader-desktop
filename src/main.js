import { createApp } from 'vue'
import App from './App.vue'
// import store from './store'
import router from './route'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';





createApp(App)
// .use(store)
.use(Antd)
.use(router)
.mount('#app')