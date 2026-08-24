import type { CartItem } from '../../types'
import type { AddressItem } from '../../types'
import { cartStore } from '../../store/cart'
import { formatMoney } from '../../utils/common'

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
    wx.navigateTo({
      url: '/subPackages/address/list?from=checkout'
    })
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
      wx.showToast({ title: '下单成功' })
      // 清空临时地址缓存
      wx.removeStorageSync('temp_select_address')
      // 删除购物车已结算商品
      cartStore.deleteSelected()
      // 跳转到订单页（后续补充订单分包）
      setTimeout(() => {
        wx.redirectTo({ url: '/pages/index/index' })
      }, 1200)
    }, 1000)
  }
})