import { userStore } from '../store/user'

// 埋点事件枚举
type TrackEventName = 'page_view' | 'goods_click' | 'submit_order'

// 通用埋点参数
interface TrackBaseParams {
  pagePath: string
  userId?: string
  timestamp: number
}

// 页面曝光参数
interface PageViewParams extends TrackBaseParams {}

// 商品点击参数
interface GoodsClickParams extends TrackBaseParams {
  goodsId: string
  goodsTitle: string
}

// 下单事件参数
interface SubmitOrderParams extends TrackBaseParams {
  orderId: string
  totalPrice: number
  goodsCount: number
}

/**
 * 埋点上报核心方法
 * 线上替换为后端埋点接口，本地console模拟上报
 */
function report<T>(event: TrackEventName, data: T) {
  const loginUser = userStore.getUserInfo()
  const trackData = {
    event,
    userId: loginUser?.token || '',
    time: Date.now(),
    ...data
  }
  console.log('【埋点上报】', trackData)
  // 线上接口示例
  // wx.request({
  //   url: 'https://xxx.com/api/track',
  //   method: 'POST',
  //   data: trackData
  // })
}

/**
 * 页面曝光埋点，页面onShow中调用
 */
export function trackPageView(pagePath: string) {
  const params: PageViewParams = {
    pagePath,
    timestamp: Date.now()
  }
  report<PageViewParams>('page_view', params)
}

/**
 * 商品卡片点击埋点
 */
export function trackGoodsClick(goodsId: string, goodsTitle: string, pagePath: string) {
  const params: GoodsClickParams = {
    pagePath,
    goodsId,
    goodsTitle,
    timestamp: Date.now()
  }
  report<GoodsClickParams>('goods_click', params)
}

/**
 * 提交订单埋点（转化核心事件）
 */
export function trackSubmitOrder(orderId: string, totalPrice: number, goodsCount: number, pagePath: string) {
  const params: SubmitOrderParams = {
    pagePath,
    orderId,
    totalPrice,
    goodsCount,
    timestamp: Date.now()
  }
  report<SubmitOrderParams>('submit_order', params)
}
