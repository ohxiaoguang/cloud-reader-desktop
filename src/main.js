import { createApp } from 'vue'
import App from './App.vue'
// import store from './store'
import router from './route'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import axios from 'axios';
const fs = window.require('fs')
const constDict = window.require('electron').remote.getGlobal('constDict')
const { ipcRenderer } =window.require('electron') 
const path = window.require("path")

createApp(App)
.provide('$axios',axios)
.provide('$fs',fs)
.provide('$constDict',constDict)
.provide('$ipcRenderer',ipcRenderer)
.provide('$path',path)
.provide('$serverHost','http://110.42.188.51')

// .use(store)
.use(Antd)
.use(router)
.mount('#app')