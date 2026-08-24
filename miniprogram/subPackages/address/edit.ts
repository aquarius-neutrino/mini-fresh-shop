import type { AddressItem } from '../../types'
import { addAddress, updateAddress, getAddressList } from '../../utils/storage'
import { formatMoney } from '../../utils/common'

type PageData = {
  form: AddressItem
  regionText: string
  editId: string
  // 新增：picker 绑定值 [省,市,区]
  regionArr: string[]
}
type PageMethods = {
  // initForm: () => void
  onChange: (e: WechatMiniprogram.BaseEvent) => void
  onSwitchChange: (e: WechatMiniprogram.BaseEvent) => void
  // selectRegion: () => void
  // 新增
  onRegionChange: (e: WechatMiniprogram.BaseEvent) => void
  submit: () => void
}
Page<PageData,PageMethods>({
  data: {
    editId: '',
    regionText: '',
    regionArr: [], // 新增
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
          regionText: `${info.province}${info.city}${info.district}`,
          // 回填picker选中值
          regionArr: [info.province, info.city, info.district]
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
  // selectRegion() {
  //   // 简易省市区，真实项目可引入area.json
  //   wx.showToast({ title: '省市区组件自行接入', icon: 'none' })
  // },

  submit() {
    const { form, editId } = this.data
    if (!form.name) return wx.showToast({ title: '请填写姓名', icon: 'none' })
    if (!/^1\d{10}$/.test(form.phone)) return wx.showToast({ title: '手机号格式错误', icon: 'none' })
    // 校验省市区全部选完
    if (!form.province || !form.city || !form.district) {
      return wx.showToast({ title: '请完整选择省、市、区', icon: 'none' })
    }
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
  },
  // 省市区picker选中回调
  onRegionChange(e: WechatMiniprogram.BaseEvent) {
    const [province, city, district] = (e as any).detail.value as string[]
    this.setData({
      regionArr: [province, city, district],
      regionText: `${province}${city}${district}`,
      'form.province': province,
      'form.city': city,
      'form.district': district
    })
  },
})
