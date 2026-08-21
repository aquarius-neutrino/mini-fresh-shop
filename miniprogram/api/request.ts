// 核心请求拦截器（企业级架构）
import type { ApiRes,RequestOptions } from '../types'
import { getCache, clearAllCache } from '../utils/cache'
import { refreshTokenApi } from './user'

//环境地址
const BASE_URL = '/mock/api'

//刷新token锁，防止并发401重复请求
let isRefreshing = false
let waitQueue:Array<(newToken:string)=> void> = []

export function request<T>(options:RequestOptions): Promise<T>{
  const token  =  getCache<string>('token')
  return new Promise((resolve,reject) => {
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