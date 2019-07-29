import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/jspViewer',
      name: 'jspViewer',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/JspViewer.vue')
    },
    {
      path: '/jspEditor',
      name: 'jspEditor',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/JspEditor.vue')
    },
    {
      path: '/jojViewer',
      name: 'jojViewer',
      component: () => import(/* webpackChunkName: "jojViewer" */'./views/JojViewer.vue')
    }
  ]
})
