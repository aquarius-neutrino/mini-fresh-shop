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
// ============ 新增商品类型 ============
// 单个商品
export interface GoodsItem {
  id: string
  title: string
  cover: string
  price: number
  originPrice: number
  sales: number
  stock: number
  categoryId: string
}

// 商品分类
export interface CategoryItem {
  id: string
  name: string
  icon: string
}

// 分页请求参数
export interface PageParams {
  page: number
  pageSize: number
  categoryId: string
}

// 分页返回结构
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
export interface AddressItem {
  id: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: boolean
}