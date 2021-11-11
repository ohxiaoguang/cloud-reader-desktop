import { createRouter,createWebHashHistory} from "vue-router";
import SettingPage from '../pages/SettingPage'
import BookListPage from '../pages/BookListPage'

const routes = [
    { path: '/', redirect: '/books' },
    { path: '/index', redirect:  '/books' },
    { path: '/setting',name:"setting", component: SettingPage },
    { path: '/books',name:"books", component: BookListPage },
  ]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

export default router