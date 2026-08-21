// 通用工具函数：包含：防抖、节流、金额处理、时间格式化、正则校验、通用工具
/**
 * 防抖：多次触发只在停止后延迟执行一次
 * @param fn 回调函数
 * @param delay 延迟毫秒，默认300ms
 */
export function debounce<T extends (...args: any[]) => void>(fn: T, delay = 300) {
  // 小程序 setTimeout 返回 number，不用 NodeJS.Timeout
  let timer: number | null = null
  return function (...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
      timer = null
    }, delay)
  }
}
/**
 * 节流：固定间隔只执行一次
 * @param fn 回调
 * @param interval 间隔ms，默认500ms
 */
export function throttle<T extends(...args:any[]) => void>(fn:T,interval = 500){
  let lastTime = 0
  let timer : number | null = null
  return function (...args:Parameters<T>){
    const now = Date.now()
    if(now-lastTime >= interval){
      lastTime = now
      fn(...args)
    }else if(!timer){
      timer = setTimeout(() => {
        fn(...args)
        lastTime = Date.now()
        timer = null
      },interval-(now-lastTime))
    }
  }
}
/**
 * 金额格式化 保留2位小数
 * @param num 数字
 * @param unit 是否带 ¥ 符号
 */
export function formatMoney(num:number | string, unit = true):string{
  const n =Number(num) || 0
  const res = n.toFixed(2)
  return unit?`￥${res}`:res
}
/**
 * 时间戳格式化
 * @param timestamp 毫秒时间戳
 * @param fmt 格式 YYYY-MM-DD HH:mm:ss
 */
export function formatTime(timestamp:number,fmt='YYYY-MM-DD HH:mm:ss'):string{
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() +1).padStart(2,'0')
  const day = String(date.getDate()).padStart(2,'0')
  const hours = String(date.getHours()).padStart(2,'0')
  const min = String(date.getMinutes()).padStart(2,'0')
  const sec = String(date.getSeconds()).padStart(2,'0')
  return fmt
    .replace('YYYY',String(year))
    .replace('MM',month)
    .replace('DD',day)
    .replace('HH',hours)
    .replace('mm',min)
    .replace('ss',sec)
}
/**
 * 手机号脱敏 138****0000
 */
export function maskPhone(phone:string):string{
  if(!/^1\d{10}$/.test(phone)) return phone
  return phone.slice(0,3) + '****' + phone.slice(7)
}
/**
 * 正则校验合集
 */
export const regRules = {
  phone:/^1[3-9]\d{9}$/,   //手机号
  number:/^\d+$/,       //纯数字
  price:/^\d+(\.\d{1,2})?$/     //金额
}

/**
 * 复制文本到剪贴板
 */
export function copyText(text:string):Promise<boolean>{
  return new Promise((resolve)=>{
    wx.setClipboardData({
      data:text,
      success:()=>resolve(true),
      fail:()=>resolve(false)
    })
  })
}
/**
 * 页面跳转封装，简化代码
 * @param url 页面路径
 * @param type navigateTo/redirectTo/reLaunch
 */
export function navigateTo(url:string,type:'navigateTo'|'redirectTo' | 'reLaunch'='navigateTo'){
 const option = {url}
 if(type==='navigateTo'){
  wx.navigateTo(option)
 }else if(type==='redirectTo'){
  wx.redirectTo(option)
 }else{
  wx.reLaunch(option)
 }
}
/**
 * 图片压缩上传简易封装（小程序压缩）
 * @param src 图片临时路径
 * @param quality 压缩质量 0~1
 */
export function compressImage(src:string,quality=0.7):Promise<string>{
  return new Promise((resolve,reject)=>{
    wx.compressImage({
      src,
      quality,
      success:(res)=>resolve(res.tempFilePath),
      fail:reject
    })
  })
}
/**
 * 空值判断
 */
export function isEmpty(val:any):boolean{
  if(val===null || val ===undefined || val==='') return true
  if(Array.isArray(val)&&val.length===0)return true
  if(typeof val ==='object' && Object.keys(val).length===0) return true
  return false
}
