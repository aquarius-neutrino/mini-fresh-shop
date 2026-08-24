import type { OrderItem } from '../../types'
import { getOrderList, changeOrderStatus } from '../../utils/orderStorage'

type PageData = {
  activeTab: number
  allOrderList: OrderItem[]
  filterOrderList: OrderItem[]
}

type PageMethods = {
  loadOrderData: () => void
  tabChange: (e: WechatMiniprogram.BaseEvent) => void
  filterOrder: () => void
  toDetail: (e: WechatMiniprogram.TouchEvent) => void
  payOrder: (e: WechatMiniprogram.TouchEvent) => void
}

Page<PageData, PageMethods>({
  data: {
    activeTab: 0,
    allOrderList: [],
    filterOrderList: []
  },

  onShow() {
    this.loadOrderData()
  },

  loadOrderData() {
    const list = getOrderList()
    this.setData({ allOrderList: list })
    this.filterOrder()
  },

  tabChange(e: WechatMiniprogram.BaseEvent) {
    const index = (e as any).detail.index as number
    this.setData({ activeTab: index })
    this.filterOrder()
  },

  filterOrder() {
    const { activeTab, allOrderList } = this.data
    let res: OrderItem[] = []
    if (activeTab === 0) {
      res = allOrderList
    } else if (activeTab === 1) {
      res = allOrderList.filter(item => item.status === 0)
    } else if (activeTab === 2) {
      res = allOrderList.filter(item => item.status === 1)
    }
    this.setData({ filterOrderList: res })
  },

  toDetail(e: WechatMiniprogram.TouchEvent) {
    const orderId = e.currentTarget.dataset.id as string
    wx.navigateTo({ url: `./detail?id=${orderId}` })
  },

  payOrder(e: WechatMiniprogram.BaseEvent) {
    // (e as any).stopPropagation()
    const orderId = e.currentTarget.dataset.id as string
    console.log('去支付')
    wx.showModal({
      title: '模拟支付',
      content: '确认完成支付？',
      success: res => {
        if (res.confirm) {
          changeOrderStatus(orderId, 1)
          wx.showToast({ title: '支付成功' })
          this.loadOrderData()
        }
      }
    })
  }
})