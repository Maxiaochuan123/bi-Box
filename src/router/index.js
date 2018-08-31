import Vue from 'vue'
import Router from 'vue-router'
import Supersystem from '../Supersystem'
import ErrorPage from '../ErrorPage'
import Home from '@/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children:[
        { path: '/supersystem', name: 'supersystem', component: Supersystem }
      ]
    },
    {
      path: '*',
      name: '404',
      component: ErrorPage,
    }
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: Login
    // }
  ]
})
