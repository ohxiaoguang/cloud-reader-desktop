import { createRouter,createWebHashHistory} from "vue-router";
import SettingPage from '../pages/SettingPage'
import BookListPage from '../pages/BookListPage'
import LoginPage from '../pages/LoginPage'
import HomePage from '../pages/HomePage'

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/index', redirect:  '/login' },

    { path: '/home', redirect:  '/books' },
    { path: '/home/index', redirect:  '/books' },

    { path: '/login',name:"login", component: LoginPage },
    { 
      path: '/home',
      name:"home", 
      component: HomePage,
      children:[
        { path: '/books',name:"books", component: BookListPage },
        { path: '/setting',name:"setting", component: SettingPage },
      ]
    },
  ]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

export default router