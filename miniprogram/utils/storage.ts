// 地址缓存工具
import type { AddressItem } from '../types'
const ADDRESS_KEY = 'user_address_list'

// 获取地址列表
export function getAddressList(): AddressItem[] {
  const str = wx.getStorageSync(ADDRESS_KEY)
  return str ? JSON.parse(str) : []
}

// 保存全部地址
export function setAddressList(list: AddressItem[]) {
  wx.setStorageSync(ADDRESS_KEY, JSON.stringify(list))
}

// 新增地址
export function addAddress(item: AddressItem) {
  const list = getAddressList()
  // 如果设为默认，清空其他默认
  if (item.isDefault) {
    list.forEach(addr => addr.isDefault = false)
  }
  list.push(item)
  setAddressList(list)
}

// 更新地址
export function updateAddress(newItem: AddressItem) {
  const list = getAddressList()
  if (newItem.isDefault) {
    list.forEach(addr => addr.isDefault = false)
  }
  const idx = list.findIndex(i => i.id === newItem.id)
  if (idx > -1) list[idx] = newItem
  setAddressList(list)
}

// 删除地址
export function delAddress(id: string) {
  const list = getAddressList().filter(i => i.id !== id)
  setAddressList(list)
}

// 获取默认地址
export function getDefaultAddress(): AddressItem | null {
  const list = getAddressList()
  return list.find(i => i.isDefault) || null
}