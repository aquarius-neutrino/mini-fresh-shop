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
  token: string
  phone: string
  pwd: string
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
// 新增购物车CartItem类型
export interface CartItem extends GoodsItem {
  count: number
  selected: boolean
}
// 订单商品子项
export interface OrderGoodsItem extends GoodsItem {
  count: number
}

// 订单主结构
export interface OrderItem {
  orderId: string
  createTime: string
  totalPrice: number
  status: 0 | 1 | 2 // 0待付款 1已完成 2已取消
  address: AddressItem
  goodsList: OrderGoodsItem[]
}