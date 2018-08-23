import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index'
import SmartContract from '@/views/smartContract'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    }
  ]
})
