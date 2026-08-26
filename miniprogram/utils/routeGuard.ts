import { userStore } from '../store/user'

// 需要登录才能访问的页面
const NEED_LOGIN_PATHS = [
  '/subPackages/cart/index',
  '/subPackages/checkout/index',
  '/subPackages/address/list',
  '/subPackages/address/edit',
  '/subPackages/order/list',
  '/subPackages/order/detail'
]

/**
 * 路由登录校验
 * @param targetUrl 目标页面路径
 * @returns true放行 false拦截
 */
export function routeGuard(targetUrl: string): boolean {
  const needLogin = NEED_LOGIN_PATHS.some(path => targetUrl.includes(path))
  if (!needLogin) return true

  const user = userStore.getUserInfo()
  if (!user || !user.token) {
    wx.showToast({ title: '请先登录', icon: 'none', duration: 1200 })
    setTimeout(() => {
      wx.navigateTo({ url: '/pages/login/index' })
    }, 1200)
    return false
  }
  return true
}

// 封装跳转API，全局替换wx.navigateTo
export function safeNavigate(url: string) {
  if (routeGuard(url)) wx.navigateTo({ url })
}

export function safeRedirect(url: string) {
  if (routeGuard(url)) wx.redirectTo({ url })
}

export function safeReLaunch(url: string) {
  if (routeGuard(url)) wx.reLaunch({ url })
}