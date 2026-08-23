import { formatMoney } from '../../utils/common'
import type { GoodsItem } from '../../types'

Component({
  properties: {
    item: Object
  },
  data: {
    priceText: '',
    originPriceText: ''
  },
  lifetimes: {
    attached() {
      const item = this.properties.item as GoodsItem
      this.handleItemChange(item)
    }
  },
  observers: {
    "item": function (rawVal) {
      const val = rawVal as GoodsItem
      this.handleItemChange(val)
    }
  },
  methods: {
    handleItemChange(val: GoodsItem) {
    
      if (!val) return
      this.setData({
        priceText: formatMoney(val.price),
        originPriceText: formatMoney(val.originPrice, false)
      })
    },
    onAddCart() {
      const val = this.properties.item as GoodsItem
      this.triggerEvent("addcart", val)
    }
  }
})