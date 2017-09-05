import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: require('@/components/Index')
    },
    {
      path: '/welcome',
      component: require('@/components/Welcome')
    },
    {
      path: '/tracker',
      component: require('@/components/Tracker')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
