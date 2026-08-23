// 首页测试调用接口,用来验证封装的请求拦截器是否生效
//直接读取全局用户
//订阅监听用户登录 / 退出状态变化
import { getUserInfoApi } from '../../api/user'
import { userStore } from '../../store/user'
import { UserInfo } from '../../types'
import {  throttle, debounce, formatMoney, maskPhone, formatTime, isEmpty} from '../../utils/common'
Page({
  data:{
    // 注册小程序页面，并声明页面私有数据 user，初始为空，TS 约束类型为用户对象或 null；
    user:null as UserInfo | null
  },
  // 取消订阅函数，页面卸载时执行
  unwatchUser:null as (()=>void) | null,
  onLoad(){
    // 直接读取当前全局用户
    const user = userStore.state
    if(user){
      this.setData({user})
    }
    // 订阅用户状态变化（登录，退出会自动更新页面）
    this.unwatchUser = userStore.watch((newUser) => {
      this.setData({user:newUser})
    })
    // 测试拉取用户信息，自动存入store
    // this.testRequest()
    // 金额格式化测试
    // console.log(formatMoney(99.9)) // ¥99.90
    // 手机号脱敏
    // console.log(maskPhone('13800138000')) // 138****0000
    // 时间戳格式化
    // console.log(formatTime(Date.now(), 'YYYY-MM-DD'))
    // 空值判断
    // console.log(isEmpty([])) // true
  },
  // 搜索防抖示例（模拟搜索输入）
  handleSearch: debounce(function (e: WechatMiniprogram.Input) {
    const val = e.detail.value
    console.log('搜索关键词：', val)
  }, 400),

  // 节流示例（上拉加载）
  handleScrollBottom: throttle(function () {
    console.log('触底加载更多商品')
  }, 600),

  async testRequest(){
    try{
      const user = await getUserInfoApi()
      console.log('用户信息',userStore.state)
    }catch(err){
      console.error('接口请求失败',err)
    }
  },
  handleLogout(){
    userStore.logout()
    const user = userStore.state;
    console.log(user)
  }
})