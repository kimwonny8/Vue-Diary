import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import Calendar from '@/components/calendar'
import Introduce from '@/components/introduce'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: Calendar
    },
    {
      path: '/aboutJW',
      name: 'introduce',
      component: Introduce
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
