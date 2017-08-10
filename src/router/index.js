import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Auto from '@/components/Auto'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/auto',
      name: 'Auto',
      component: Auto
    }
  ]
})
