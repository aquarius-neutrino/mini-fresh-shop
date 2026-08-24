import type { OrderItem } from '../types'
const ORDER_KEY = 'user_order_list'
import { OrderGoodsItem, AddressItem } from '../types'
// 获取全部订单
export function getOrderList(): OrderItem[] {
  const str = wx.getStorageSync(ORDER_KEY)
  return str ? JSON.parse(str) : []
}

// 保存订单列表
export function setOrderList(list: OrderItem[]) {
  wx.setStorageSync(ORDER_KEY, JSON.stringify(list))
}

// 创建新订单（结算页下单成功调用）
export function createNewOrder(goodsList: OrderGoodsItem[], addr: AddressItem, totalPrice: number) {
  const allOrders = getOrderList()
  const newOrder: OrderItem = {
    orderId: Date.now().toString(),
    createTime: new Date().toLocaleString(),
    totalPrice,
    status: 0,
    address: addr,
    goodsList
  }
  allOrders.unshift(newOrder)
  setOrderList(allOrders)
  return newOrder
}

// 修改订单状态
export function changeOrderStatus(orderId: string, status: OrderItem['status']) {
  const list = getOrderList()
  const target = list.find(item => item.orderId === orderId)
  if (target) target.status = status
  setOrderList(list)
}