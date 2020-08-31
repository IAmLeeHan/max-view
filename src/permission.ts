import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// import { Message } from 'element-ui'
import { Route } from 'vue-router'
import { UserModule } from '@/store/modules/user'
import i18n from '@/lang' // Internationalization
import settings from './settings'
import { getRefresh ,getToken} from '@/utils/cookies'
import getDefault from '@/utils/defaultPage'


NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect']

const getPageTitle = (key: string) => {
  const hasKey = i18n.te(`route.${key}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${key}`)
    return `${pageName} - ${settings.title}`
  }
  return `${settings.title}`
}

router.beforeEach(async(to: Route, _: Route, next: any) => {
  // Start progress bar
  NProgress.start()

  //判断用户是否有refresh（保持登录）
  if (getRefresh()) {
    // 判断用户是否有token（接口请求，处于登录状态）
    if(getToken()){
      // 如果跳转到登录页面
      if (to.path === '/login' || to.path === '/') {
        // 重镜像到首页
        next({ path: getDefault() })
        NProgress.done()
      } else {
        // 直接跳转
        next()
      }
    }else{
      // 用户没有处于登录状态
      // 用户登录
      UserModule.Login().then(()=>{
        router.push({name:getDefault()})
        NProgress.done()
      })
    }
  } else {
    // Has no refresh
    if (whiteList.indexOf(to.path) !== -1) {
      // In the free login whitelist, go directly
      next()
    } else {
      if(to.path === '/'){
        next('/login')
      }else{
        next(`/login?redirect=${to.path}`)
      }
      // Other pages that do not have permission to access are redirected to the login page.
      NProgress.done()
    }
  }
  // next()
})

router.afterEach((to: Route) => {
  // Finish progress bar
  // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
  NProgress.done()
  // set page title
  document.title = getPageTitle(to.meta.title)
})
