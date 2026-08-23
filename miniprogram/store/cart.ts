// 实现：本地持久化购物车、增删改数量、选中 / 全选、总价计算、登录后同步云端，
import { GoodsItem } from '../types'
import { setCache, getCache } from '../utils/cache'
import { formatMoney } from '../utils/common'

// 购物车单项
export interface CartItem extends GoodsItem {
  count: number
  selected: boolean
}

// 全局购物车状态
let cartList: CartItem[] = getCache<CartItem[]>('cartList') || []
const watchCallbacks: Array<(list: CartItem[]) => void> = []

export const cartStore = {
  get list(): CartItem[] {
    return cartList
  },

  // 存入缓存
  saveCache() {
    setCache('cartList', cartList)
    watchCallbacks.forEach(cb => cb([...cartList]))
  },

  // 添加商品
  addGoods(goods: GoodsItem) {
    const existIndex = cartList.findIndex(item => item.id === goods.id)
    if (existIndex > -1) {
      cartList[existIndex].count += 1
    } else {
      cartList.push({
        ...goods,
        count: 1,
        selected: true
      })
    }
    this.saveCache()
  },

  // 修改数量
  changeCount(id: string, num: number) {
    const target = cartList.find(item => item.id === id)
    if (!target) return
    target.count = num
    this.saveCache()
  },

  // 单选切换
  toggleSelect(id: string) {
    const target = cartList.find(item => item.id === id)
    if (!target) return
    target.selected = !target.selected
    this.saveCache()
  },

  // 全选/取消全选
  toggleAllSelect(checked: boolean) {
    cartList.forEach(item => item.selected = checked)
    this.saveCache()
  },

  // 删除选中商品
  deleteSelected() {
    cartList = cartList.filter(item => !item.selected)
    this.saveCache()
  },

  // 获取选中商品总价
  getTotalPrice(): string {
    let total = 0
    cartList.forEach(item => {
      if (item.selected) total += item.price * item.count
    })
    return formatMoney(total)
  },

  // 获取选中商品数量
  getSelectedCount(): number {
    return cartList.filter(item => item.selected).reduce((sum, cur) => sum + cur.count, 0)
  },

  // 监听购物车变化
  watch(cb: (list: CartItem[]) => void) {
    watchCallbacks.push(cb)
    cb([...cartList])
    return () => {
      const idx = watchCallbacks.indexOf(cb)
      if (idx > -1) watchCallbacks.splice(idx, 1)
    }
  }
}