// 登录成功后自动存入全局状态，不用每个页面手动存缓存
import { get, post }from './request'
import { setCache, getCache } from '../utils/cache'
import type { TokenInfo, ApiRes, UserInfo } from '../types'
import { userStore } from '../store/user'
/**
 * 微信登录获取token
 */
export function wxLoginApi(code:string){
  return post<TokenInfo>('/user/login',{code}).then(res=>{
    setCache('token',res.token)
    setCache('refreshToken',res.refreshToken,7*24*3600*1000)
    return res
  })
}
/**
 * 刷新token（拦截器内部自动调用）
 */
export function refreshTokenApi(){
  const refreshToken = getCache<string>('refreshToken')
  return post<TokenInfo>('/user/refresh-token',{refreshToken})
}
/**
 * 获取用户信息,并存入全局store
 */
export async function getUserInfoApi(){
  // <UserInfo>：TS 泛型，指定本次接口返回数据的类型
  const user = await get<UserInfo>('/user/info')
  // 接口返回用户信息后，更新全局状态
  userStore.setUser(user)
  return user
}