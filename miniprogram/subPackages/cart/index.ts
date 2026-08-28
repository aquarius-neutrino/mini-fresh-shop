import { cartStore } from '../../store/cart'
import { formatMoney } from '../../utils/common'
import type { CartItem } from '../../store/cart'
import { getThumbImage } from '../../utils/imgOpt'

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
  onShow() {
    const rawList = cartStore.list
    // 批量预计算缩略图
    const cartList = rawList.map(item => ({
      ...item,
      thumb: getThumbImage(item.cover)
    }))
    this.setData({ cartList })
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
    const { cartList } = this.data
  // 筛选勾选商品
  const selectedGoods = cartList.filter(item => item.selected)
  if (selectedGoods.length === 0) {
    return wx.showToast({ title: '请选择要结算的商品', icon: 'none' })
  }
  // 拼接id逗号分隔传递给结算页
  const ids = selectedGoods.map(i => i.id).join(',')
  wx.navigateTo({
    url: `/subPackages/checkout/index?ids=${ids}`
  })
  },
})