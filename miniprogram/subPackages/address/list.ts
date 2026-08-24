import type { AddressItem } from '../../types'
import { getAddressList, delAddress } from '../../utils/storage'

type PageData = {
  addressList: AddressItem[]
  showSheet: boolean
  currentId: string
  actionList: { name: string; value: string; color?: string }[]
  fromCheckout: boolean // 标记是否从结算页跳转过来
}
type PageMethods = {
  loadData: () => void
  toAdd: () => void
  toEdit: (e: WechatMiniprogram.TouchEvent) => void
  showOperate: (e: WechatMiniprogram.TouchEvent) => void
  closeSheet: () => void
  onSheetSelect: (e: WechatMiniprogram.BaseEvent) => void
}

Page<PageData, PageMethods>({
  data: {
    addressList: [],
    showSheet: false,
    currentId: '',
    actionList: [
      { name: '编辑', value: 'edit' },
      { name: '删除', value: 'del', color: '#ee0a24' }
    ],
    fromCheckout: false
  },

  onLoad(opt: Record<string, string | undefined>) {
    this.loadData()
    if (opt.from === 'checkout') {
      this.setData({ fromCheckout: true })
    }
  },
  onShow() {
    this.loadData()
  },

  loadData() {
    this.setData({ addressList: getAddressList() })
  },

  toAdd() {
    wx.navigateTo({ url: './edit' })
  },

  toEdit(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id as string
    const { addressList, fromCheckout } = this.data
    const targetAddr = addressList.find(item => item.id === id)
  
    // 如果是结算页过来：存入临时缓存，返回结算页
    if (fromCheckout && targetAddr) {
      wx.setStorageSync('temp_select_address', targetAddr)
      wx.navigateBack()
      return
    }
    // 正常流程：跳转地址编辑页面
    wx.navigateTo({ url: `./edit?id=${id}` })
  },

  showOperate(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id as string
    this.setData({ currentId: id, showSheet: true })
  },

  closeSheet() {
    this.setData({ showSheet: false })
  },

  onSheetSelect(e: WechatMiniprogram.BaseEvent) {
    const type = (e as any).detail.value as string
    const id = this.data.currentId
    this.closeSheet()
    if (type === 'edit') {
      wx.navigateTo({ url: `./edit?id=${id}` })
    } else if (type === 'del') {
      wx.showModal({
        title: '提示',
        content: '确定删除该地址？',
        success: res => {
          if (res.confirm) {
            delAddress(id)
            this.loadData()
          }
        }
      })
    }
  }
})