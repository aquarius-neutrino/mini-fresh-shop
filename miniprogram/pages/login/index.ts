import { userStore } from '../../store/user'

type FormData = {
  phone: string
  pwd: string
}
type PageData = {
  form: FormData
}
type PageMethods = {
  onPhoneInput: (e: WechatMiniprogram.BaseEvent) => void
  onPwdInput: (e: WechatMiniprogram.BaseEvent) => void
  handleLogin: () => void
  handleRegister: () => void
}

Page<PageData, PageMethods>({
  data: {
    form: {
      phone: '',
      pwd: ''
    }
  },

  onPhoneInput(e) {
    this.setData({ 'form.phone':(e as any).detail })
  },
  onPwdInput(e) {
    this.setData({ 'form.pwd': (e as any).detail })
  },

  // 登录
  handleLogin() {
    const { phone, pwd } = this.data.form
    if (!/^1\d{10}$/.test(phone)) {
      return wx.showToast({ title: '手机号格式错误', icon: 'none' })
    }
    if (!pwd) {
      return wx.showToast({ title: '请输入密码', icon: 'none' })
    }

    const user = userStore.getUserByPhone(phone)
    if (!user || user.pwd !== pwd) {
      return wx.showToast({ title: '手机号或密码错误', icon: 'none' })
    }

    userStore.setUser(user)
    wx.showToast({ title: '登录成功' })
    setTimeout(() => wx.switchTab({ url: '/pages/index/index' }), 1000)
  },

  // 注册
  handleRegister() {
    const { phone, pwd } = this.data.form
    if (!/^1\d{10}$/.test(phone)) {
      return wx.showToast({ title: '手机号格式错误', icon: 'none' })
    }
    if (!pwd) {
      return wx.showToast({ title: '请设置密码', icon: 'none' })
    }

    const exist = userStore.getUserByPhone(phone)
    if (exist) {
      return wx.showToast({ title: '账号已存在，请直接登录', icon: 'none' })
    }

    userStore.register({ phone, pwd })
    wx.showToast({ title: '注册成功，请登录' })
  }
})