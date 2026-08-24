import type { AddressItem } from '../../types'
import { addAddress, updateAddress, getAddressList } from '../../utils/storage'
import { formatMoney } from '../../utils/common'

type PageData = {
  form: AddressItem
  regionText: string
  editId: string
}
type PageMethods = {
  // initForm: () => void
  onChange: (e: WechatMiniprogram.BaseEvent) => void
  onSwitchChange: (e: WechatMiniprogram.BaseEvent) => void
  selectRegion: () => void
  submit: () => void
}
Page<PageData,PageMethods>({
  data: {
    editId: '',
    regionText: '',
    form: {
      id: '',
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: '',
      isDefault: false
    }
  },
  onLoad(opt: Record<string, string | undefined>) {
    const id = opt.id as string
    if (id) {
      this.setData({ editId: id })
      const list = getAddressList()
      const info = list.find(i => i.id === id)
      if (info) {
        this.setData({
          form: info,
          regionText: `${info.province}${info.city}${info.district}`
        })
      }
    }
  },
  onChange(e: WechatMiniprogram.BaseEvent) {
    const key = e.currentTarget.dataset.key as keyof AddressItem
    const val = (e as any).detail
    this.setData({ [`form.${key}`]: val })
  },
  onSwitchChange(e: WechatMiniprogram.BaseEvent) {
    const val = (e as any).detail as boolean
    this.setData({ 'form.isDefault': val })
  },
  selectRegion() {
    // 简易省市区，真实项目可引入area.json
    wx.showToast({ title: '省市区组件自行接入', icon: 'none' })
  },

  submit() {
    const { form, editId } = this.data
    if (!form.name) return wx.showToast({ title: '请填写姓名', icon: 'none' })
    if (!/^1\d{10}$/.test(form.phone)) return wx.showToast({ title: '手机号格式错误', icon: 'none' })
    if (!form.province) return wx.showToast({ title: '请选择省市区', icon: 'none' })
    if (!form.detail) return wx.showToast({ title: '请填写详细地址', icon: 'none' })

    if (editId) {
      updateAddress(form)
    } else {
      // 简单生成唯一id
      form.id = Date.now().toString()
      addAddress(form)
    }
    wx.showToast({ title: '保存成功' })
    setTimeout(() => wx.navigateBack(), 1000)
  }
})
