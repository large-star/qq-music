import Vue from 'vue'
import VueRouter from 'vue-router'

const Recommend = () => import('@/views/recommend/recommend.vue')
const Disc = () => import('@/views/disc/disc.vue')
const Rank = () => import('@/views/rank/rank.vue')
const TopList = () => import('@/views/topList/topList.vue')
const Search = () => import('@/views/search/search.vue')
const Singer = () => import('@/views/singer/singer.vue')
const SingerDetail = () => import('@/views/singerDetail/singerDetail.vue')
const UserCenter = () => import('@/views/userCenter/userCenter.vue')




Vue.use(VueRouter)

const routes = [
  { path: '', redirect: '/recommend' },
  { path: '/recommend', component: Recommend, children: [
    { path: ':id', component: Disc }
  ]},
  { path: '/rank', component: Rank, children:[
    { path: ':id', component: TopList }
  ]},
  { path: '/search', component: Search },
  { path: '/singer', component: Singer, children: [
    {
      path: ':id',
      component: SingerDetail
    }
  ]},
  { path: '/user', component: UserCenter }
]

const router = new VueRouter({
  routes
})

export default router
