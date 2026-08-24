import { cartStore } from '../../store/cart'
import { formatMoney } from '../../utils/common'
import type { CartItem } from '../../store/cart'

Page({
  data: {
    cartList: [] as CartItem[],
    isAllSelected: false,
    totalPrice: '',
    selectedNum: 0,
  },
  unwatchCart: null as (() => void) | null,

  onLoad() {
    // 订阅购物车变化
    this.unwatchCart = cartStore.watch((list) => {
      this.setCartData(list)
    })
  },

  onUnload() {
    // 销毁订阅，防止内存泄漏
    if (this.unwatchCart) this.unwatchCart()
  },

  // 刷新页面数据
  setCartData(list: CartItem[]) {
    const allSelected = list.length > 0 && list.every(item => item.selected)
    this.setData({
      cartList: list,
      isAllSelected: allSelected,
      totalPrice: cartStore.getTotalPrice(),
      selectedNum: cartStore.getSelectedCount()
    })
  },

  // 单选切换
  toggleSelect(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id
    cartStore.toggleSelect(id)
  },

  // 修改数量
  changeCount(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id
    const count = (e as any).detail as number
    cartStore.changeCount(id, count)
  },

 // 全选/取消全选
  toggleAll(e: WechatMiniprogram.TouchEvent) {
    const checked = (e as any).detail as boolean
    cartStore.toggleAllSelect(checked)
  },

  // 去结算
  goPay() {
    const num = cartStore.getSelectedCount()
    if (num === 0) {
      wx.showToast({ title: '请选择商品', icon: 'none' })
      return
    }
    wx.showToast({ title: '跳转结算页' })
    // navigateTo('/subPackages/pay/index')
  },
})