// 全局接口通用类型
// 后端统一返回格式
export interface ApiRes<T = any>{
  code:number
  msg:string
  data:T
}
// 请求额外参数类型
export type RequestOptions = Omit<WechatMiniprogram.RequestOption,'url' | 'data' > & {
  url:string
  data?:any
  hideLoading?:boolean
}
// 登录token结构
export interface TokenInfo {
  token:string
  refreshToken:string
}
// 用户信息
export interface UserInfo {
  id:string
  nickName:string
  avatar:string
  phone:string
}