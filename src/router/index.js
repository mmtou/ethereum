import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index'
import Account from '@/views/account'
import Wallet from '@/views/wallet'
import Test from '@/views/test'
import SmartContract from '@/views/smartContract'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/account',
      name: 'Account',
      component: Account
    },
    {
      path: '/wallet',
      name: 'Wallet',
      component: Wallet
    },
    {
      path: '/test',
      name: 'Test',
      component: Test
    },
    {
      path: '/smartContract',
      name: 'SmartContract',
      component: SmartContract
    }
  ]
})
