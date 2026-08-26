Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    onRefresh() {
      this.triggerEvent('refresh')
    }
  }
})
