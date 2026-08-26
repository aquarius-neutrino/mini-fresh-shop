import type { CartItem, OrderGoodsItem, AddressItem} from '../../types'
import { cartStore } from '../../store/cart'
import { formatMoney } from '../../utils/common'
import { createNewOrder } from '../../utils/orderStorage'
import { safeNavigate } from '../../utils/routeGuard'
import { trackSubmitOrder } from '../../utils/track'
type PageData = {
  checkoutGoodsList: CartItem[]
  totalMoney: number
  selectedAddress: AddressItem | null
}

type PageMethods = {
  loadCheckoutData: (selectedIds: string[]) => void
  goSelectAddress: () => void
  submitOrder: () => void
}

Page<PageData, PageMethods>({
  data: {
    checkoutGoodsList: [],
    totalMoney: 0,
    selectedAddress: null
  },

  onLoad(opt: Record<string, string | undefined>) {
    // 接收购物车选中商品id数组
    const goodsIdStr = opt.ids || ''
    const selectedIds = goodsIdStr.split(',')
    this.loadCheckoutData(selectedIds)
  },

  onShow() {
    // 读取临时选中地址
    const tempAddr = wx.getStorageSync('temp_select_address') as AddressItem | null
    if (tempAddr) {
      this.setData({ selectedAddress: tempAddr })
    }
  },

  // 筛选购物车选中商品，计算总价
  loadCheckoutData(selectedIds: string[]) {
    const allCart = cartStore.list
    const list = allCart.filter(item => selectedIds.includes(item.id))
    let total = 0
    list.forEach(good => {
      total += good.price * good.count
    })
    this.setData({
      checkoutGoodsList: list,
      totalMoney: total
    })
  },

  // 跳转地址列表，携带来源标记
  goSelectAddress() {
    safeNavigate('/subPackages/address/list?from=checkout')
  },

  // 提交订单
  submitOrder() {
    const { selectedAddress, checkoutGoodsList, totalMoney } = this.data
    // 校验地址
    if (!selectedAddress) {
      return wx.showToast({ title: '请选择收货地址', icon: 'none' })
    }
    // Mock 提交订单接口
    wx.showLoading({ title: '提交中...' })
    setTimeout(() => {
      wx.hideLoading()
      // 1. 创建订单存入本地
    const newOrder = createNewOrder(checkoutGoodsList as OrderGoodsItem[], selectedAddress, totalMoney)
    // ========== 新增下单埋点 ==========
    trackSubmitOrder(
      newOrder.orderId,
      newOrder.totalPrice,
      newOrder.goodsList.length,
      '/subPackages/checkout/index'
    )
      // 清空临时地址缓存
      wx.removeStorageSync('temp_select_address')
      // 删除购物车已结算商品
      cartStore.deleteSelected()
      // 跳转到订单页（后续补充订单分包）
      wx.showModal({
        title: '下单成功',
        content: '是否前往订单查看？',
        confirmText: '查看订单',
        cancelText: '返回首页',
        success: res => {
          if (res.confirm) {
            wx.redirectTo({ url: '/subPackages/order/list' })
          } else {
            wx.redirectTo({ url: '/pages/index/index' })
          }
        }
      })
    }, 1000)
  }
})