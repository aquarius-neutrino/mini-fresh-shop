Component({
  properties: {
    activePath: {
      type: String,
      value: ''
    }
  },
  methods: {
    switchTab(e: WechatMiniprogram.TouchEvent) {
      const targetPath = e.currentTarget.dataset.path
      const current = this.properties.activePath
      console.log(targetPath,current)
      // 相同页面不重复跳转
      if (targetPath === current) return
      wx.reLaunch({ url: targetPath }) }
  }
})
