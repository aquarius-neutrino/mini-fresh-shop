import type { OrderItem } from '../../types'
import { getOrderList } from '../../utils/orderStorage'

type PageData = {
  order: OrderItem | null
}
type PageMethods = {
}
Page<PageData, PageMethods>({
  data: {
    order: null
  },

  onLoad(opt: Record<string, string | undefined>) {
    const orderId = opt.id
    if (!orderId) return
    const allList = getOrderList()
    const target = allList.find(item => item.orderId === orderId)
    if (target) {
      this.setData({ order: target })
    }
  }
})