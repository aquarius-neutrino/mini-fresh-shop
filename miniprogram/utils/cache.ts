// 带过期时间本地缓存
interface CacheItem<T = any>{
  value:T
  expire:number
}
/**
 * 设置缓存，默认过期1天
 */
export function setCache<T>(key:string,value:T,expire = 86400*1000){
  const storeData:CacheItem<T> = {
    value,
    expire:Date.now() + expire
  }
  wx.setStorageSync(key,JSON.stringify(storeData))
}
/**
 * 获取缓存，自动清理过期数据
 */
export function getCache<T>(key:string):T|null{
  const str = wx.getStorageSync(key)
  if(!str) return null
  const item : CacheItem<T> = JSON.parse(str)
  if(Date.now() > item.expire){
    removeCache(key)
    return null
  }
  return item.value
}
// 删除单个缓存
export function removeCache(key:string){
  wx.removeStorageSync(key)
}
// 清空全部缓存
export function clearAllCache(){
  wx.clearStorageSync()
}