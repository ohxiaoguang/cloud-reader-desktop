import { createApp } from 'vue'
import App from './App.vue'
// import store from './store'
import router from './route'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import axios from 'axios';


const fs = window.require('fs')
const { ipcRenderer } =window.require('electron') 
const path = window.require("path")
const Store =  window.require('electron-store');
const store = new Store()

console.log(store)

createApp(App)
.provide('$axios',axios)
.provide('$fs',fs)
.provide('$ipcRenderer',ipcRenderer)
.provide('$path',path)
.provide('$serverHost',store.get('serverHost'))
.provide('$electronStore',store)

// .use(store)
.use(Antd)
.use(router)
.mount('#app')