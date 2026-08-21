// 用户全局状态管理（本次编写）
/**
 * 全局只读用户信息
 * 登录赋值、本地持久化存储（复用之前 cache）
 * 退出登录清空缓存、页面重定向
 * 简单发布订阅（多页面同步更新用户信息）
 */
import { UserInfo } from '../types'
import { setCache, getCache, clearAllCache } from '../utils/cache'
// 全局状态
let userState: UserInfo | null = getCache<UserInfo>('userInfo')
// 订阅回调池，页面监听用户信息变化
const watchCallbacks: Array<(user:UserInfo | null )=> void> = []
export const userStore = {
  // 获取当前用户
  get state():UserInfo | null{
    return userState
  },
  // 登录：保存用户信息到内存➕本地缓存
  setUser(info : UserInfo){
    userState = info
    // 缓存7天
    setCache('userInfo',info,7*24*3600*1000)
    // 通知所有订阅页面更新视图
    watchCallbacks.forEach(cb=>cb(userState))
  },
  // 退出登录
  logout(){
    userState = null
    clearAllCache()
    watchCallbacks.forEach(cb=>cb(null))
    // 提转到首页/登录页
    wx.reLaunch({
      url:'/pages/index/index'
    })
  },
  //订阅用户状态变化（页面销毁记得取消订阅）
  // 传入的回调函数 cb，接收参数 user，类型是 UserInfo 用户对象 或者 null（用户未登录）,void 代表回调没有返回值
  watch(cb:(user:UserInfo | null) => void){
     // 1. 把回调存入全局回调数组
    watchCallbacks.push(cb)
    // 2. 初始化时立刻执行一次回调，渲染初始页面
    cb(userState)
    //  3. 返回销毁函数，用于取消监听
    return()=>{
       // 找到当前回调在数组中的下标
      const index = watchCallbacks.indexOf(cb)
       // 存在就删除，不再触发更新
      if(index>-1) watchCallbacks.splice(index,1)
    }
  }

}