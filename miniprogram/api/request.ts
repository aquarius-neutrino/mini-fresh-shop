// 核心请求拦截器（企业级架构）
import type { ApiRes,RequestOptions,PageParams,GoodsItem } from '../types'
import { getCache, clearAllCache } from '../utils/cache'
import { refreshTokenApi } from './user'

//环境地址
const BASE_URL = '/mock/api'

// ========== 新增本地Mock模拟数据 ==========
const mockData: Record<string, any> = {
  '/user/login': { token: 'test-token-123', refreshToken: 'refresh-456' },
  '/user/info': {
    id: 'u001',
    nickName: '生鲜用户',
    avatar: 'https://picsum.photos/id/237/100/100',
    phone: '13800138000'
  },
  // 新增商品分类mock
  '/goods/category': [
    { id: 'c1', name: '新鲜蔬菜', icon: 'https://picsum.photos/id/101/80/80' },
    { id: 'c2', name: '时令水果', icon: 'https://picsum.photos/id/102/80/80' },
    { id: 'c3', name: '肉禽蛋奶', icon: 'https://picsum.photos/id/103/80/80' },
    { id: 'c4', name: '水产海鲜', icon: 'https://picsum.photos/id/104/80/80' },
  ],
  // 商品分页列表mock
  '/goods/list': (params: PageParams) => {
    const { page, pageSize,categoryId } = params
    const total = 31    //5*6=30<31~35<6*6=36,所以36条，hasMore决定
    const mockGoods: GoodsItem[] = []
    for (let i = 1; i <= pageSize; i++) {
      const idx = (page - 1) * pageSize + i
      mockGoods.push({
        id: `g${idx}`,
        title: categoryId==='c1'?`新鲜蔬菜${idx}号，新鲜直达当日达`:categoryId==='c2'?`时令水果${idx}号，新鲜直达当日达`:categoryId==='c3'?`肉禽蛋奶${idx}号，新鲜直达当日达`:`水产海鲜${idx}号，新鲜直达当日达`,
        cover: `https://picsum.photos/id/${200 + idx}/300/300`,
        price: 9.9 + idx,
        originPrice: 19.9 + idx,
        sales: 120 + idx * 10,
        stock: 99,
        categoryId:''
      })
    }
    return {
      list: mockGoods,
      total,
      page,
      pageSize,
      hasMore: page * pageSize < total
    }
  }
}

// 重写mock匹配函数，兼容带参数的商品分页接口
function tryMock(url: string, data?: any): ApiRes | null {
  const apiPath = url.replace(BASE_URL, '')
  const mockItem = mockData[apiPath]
  if (!mockItem) return null

  // 如果mock是函数，传入请求参数生成分页数据
  const mockResData = typeof mockItem === 'function' ? mockItem(data) : mockItem
  return {
    code: 200,
    msg: 'success',
    data: mockResData
  }
}
// ========================================


//刷新token锁，防止并发401重复请求
let isRefreshing = false
let waitQueue:Array<(newToken:string)=> void> = []

export function request<T>(options:RequestOptions): Promise<T>{
  const token  =  getCache<string>('token')
  return new Promise((resolve,reject) => {
     // 优先走本地mock，跳过真实网络请求
     const mockResult = tryMock(options.url, options.data)
     if (mockResult) {
       if (!options.hideLoading) wx.showLoading({ title: '加载中', mask: true })
       setTimeout(() => {
         wx.hideLoading()
         resolve(mockResult.data as T)
       }, 600)
       return
     }
     // 下面原有wx.request逻辑不变，保留不动
    const reqConfig: WechatMiniprogram.RequestOption = {
      url:BASE_URL + options.url,
      method:options.method || 'GET',
      data: options.data || {},
      header:{
        'Content-Type': 'application/json',
        ...(token ? {Authorization:`Beatrt ${token}`}:{}),
        ...options.header
      },
      success:async(res)=>{
        const result = res.data as ApiRes<T>
        //token过期 401处理
        if(result.code === 401){
          if(isRefreshing){
            waitQueue.push((newToken) => {
              options.header = {...options.header,Authorization:`Bearer ${newToken}`}
              request<T>(options).then(resolve).catch(reject)
            })
            return
          }
          isRefreshing = true
          try{
            const tokenData = await refreshTokenApi()
            // 重放队列所有等待请求
            waitQueue.forEach(fn=>fn(tokenData.token))
            waitQueue = []
            //重新执行当前请求
            options.header = {...options.header,Authorization:`Bearer ${tokenData.token}`}
            const data = await request<T>(options)
            resolve(data)
          }catch(err){
            clearAllCache()
            wx.reLaunch({url:'/pages/index/index'})
            reject(result)
          }finally{
            isRefreshing = false
          }
        return
      }
      //业务错误码
      if(result.code !== 200){
        wx.showToast({title: result.msg || '请求失败',icon:'none'})
        reject(result)
        return
      }
      resolve(result.data)
    },
    fail:()=>{
      wx.showToast({title:'网络异常，请重试',icon:'none'})
      reject('网络错误')
    }
  }
  //全局loading
  if(!options.hideLoading){
    wx.showLoading({title:'加载中',mask:true})
    reqConfig.complete = () => wx.hideLoading()
  }
  wx.request(reqConfig)
  })
}
//快捷get/post封装
export function get<T>(url:string, data?:any, other?:Omit<RequestOptions,'url' | 'data' >){
  return request<T>({ url, data, method:'GET', ...other})
}

export function post<T>(url:string, data?:any, other?:Omit<RequestOptions,'url' | 'data'>){
  return request<T>({ url, data, method:'POST', ...other})
}