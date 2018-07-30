import Vue from 'vue'
import Router from 'vue-router'
// import home from 'views/home/home-header'
import search from 'views/search/search'
import recommend from 'views/recommend/recommend'
import rank from 'views/rank/rank'
import singer from 'views/singer/singer'
import singerDetail from 'views/singer-detail/singer-detail'
import disc from 'views/disc/disc'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: '/recommend',
      component: recommend
    },
    {
      path: '/recommend',
      name: 'recommen',
      component: recommend,
      children: [
        {
          path: ':id',
          component: disc
        }
      ]
    },
    {
      path: '/singer',
      component: singer,
      children: [
        {
          path: ':id',
          component: singerDetail
        }
      ]
    },
    {
      path: '/rank',
      name: 'rank',
      component: rank
    },
    {
      path: '/search',
      name: 'search',
      component: search
    }
  ]
})
