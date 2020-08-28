import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'
import enterpriseAreaOverview from './modules/enterpriseAreaOverview'
import Layout from '@/Layout/index.vue'
import advantageIndustry from './modules/advantageIndustry'
import importantEnterprise from './modules/importantEnterprise'
import focusedInvestment from './modules/focusedInvestment'
import OverallTrend from './modules/OverallTrend'

// import getDefault from '@/utils/defaultPage'


Vue.use(Router)

export const constantRoutes: Array<RouteConfig> = [
  {
    path: '/',
    component: Layout,
    // redirect:'/enterpriseAreaOverview',
    children:[
      enterpriseAreaOverview,
      advantageIndustry,
      OverallTrend,
      importantEnterprise,
      focusedInvestment
    ]
  },
  {
    path: '/login',
    name:'Login',
    component: () => import('@/views/login/index.vue')
  }
]

export const asyncRoutes: RouteConfig[] = []

const createRouter = () => new Router({
  // mode: 'history',  // Disabled due to Github Pages doesn't support this, enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
