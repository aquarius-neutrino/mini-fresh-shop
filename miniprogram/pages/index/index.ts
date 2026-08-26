import { getGoodsListApi, getCategoryListApi } from '../../api/goods'
import { debounce } from '../../utils/common'
import type { GoodsItem, CategoryItem, PageParams } from '../../types'
import { cartStore } from '../../store/cart'
import { safeNavigate } from '../../utils/routeGuard'
import { trackPageView } from '../../utils/track'
import { trackGoodsClick } from '../../utils/track'
import { checkNetwork, watchNetworkChange, unWatchNetworkChange } from '../../utils/network'
// 页面data类型
type PageData = {
  categoryList: CategoryItem[]
  curCateId: string
  goodsList: GoodsItem[]
  page: number
  pageSize: number
  hasMore: boolean
  refreshing: boolean
  isOffline: boolean
}

// 页面所有方法类型约束
type PageMethods = {
  initPage: () => Promise<void>
  getCategory: () => Promise<void>
  getGoodsList: (isReset: boolean) => Promise<void>
  handleCateChange: (e: WechatMiniprogram.Touch) => Promise<void>
  changeCate: (e: WechatMiniprogram.Touch) => void
  loadMore: () => void
  onRefresh: () => Promise<void>
  handleAddCart: (e: WechatMiniprogram.CustomEvent) => void
  toCart:()=>void,
  toOrder:()=>void,
  toAddress:()=>void,
  onRefreshPage:()=>void
}

// Page仅2个泛型参数 <Data, Methods>
Page<PageData, PageMethods>({
  data: {
    categoryList: [] as CategoryItem[],
    curCateId: 'c1',
    goodsList: [] as GoodsItem[],
    page: 1,
    pageSize: 6,
    hasMore: true,
    refreshing: false,
    isOffline: false
  },

  onLoad() {
    // 页面加载先检测一次网络
    checkNetwork().then((hasNet) => {
      this.setData({ isOffline: !hasNet })
    })

    // 监听网络变化
    watchNetworkChange(
      // 断网
      () => this.setData({ isOffline: true }),
      // 恢复网络
      () => {
        this.setData({ isOffline: false })
        // 自动重新加载页面数据
        this.getGoodsList(true)
      }
    )
    this.initPage()
    // 此处无红线，类型完全匹配
    this.changeCate = debounce(this.handleCateChange.bind(this), 300)
  },
  onUnload() {
    // 页面销毁取消监听，避免多个页面重复监听
    unWatchNetworkChange()
  },
  // 离线组件点击刷新
  onRefreshPage() {
    checkNetwork().then(async (hasNet) => {
      if (hasNet) {
        this.setData({ isOffline: false })
        await this.getGoodsList(true)
      } else {
        wx.showToast({ title: '仍未检测到网络', icon: 'none' })
      }
    })
  },
  // 记录一次页面曝光
  onShow() {
    trackPageView('/pages/index/index')
  },
  // 跳转购物车
  toCart() {
    safeNavigate(
      '/subPackages/cart/index'
    )
  },
  toOrder(){
    safeNavigate(
      '/subPackages/order/list'
    )
  },
  toAddress(){
    safeNavigate(
      '/subPackages/address/list'
    )
  },
  // 真实分类切换逻辑
  async handleCateChange(e: WechatMiniprogram.Touch) {
    const cateId = e.currentTarget.dataset.id
    this.setData({ curCateId: cateId, page: 1 })
    await this.getGoodsList(true)
  },

  // 占位方法：声明接收e，解决赋值类型不匹配
  changeCate(e: WechatMiniprogram.Touch) {},

  async initPage() {
    await this.getCategory()
    this.getGoodsList(true)
  },

  async getCategory() {
    const list = await getCategoryListApi()
    this.setData({ categoryList: list })
  },

  async getGoodsList(isReset: boolean) {
    const { page, pageSize, curCateId, goodsList } = this.data
    const params: PageParams = {
      page,
      pageSize,
      categoryId: curCateId 
    }
    const res = await getGoodsListApi(params)
    const newList = isReset ? res.list : [...goodsList, ...res.list]
    this.setData({
      goodsList: newList,
      hasMore: res.hasMore,
      refreshing: false
    })
  },

  loadMore() {
    const { page, hasMore } = this.data
    if (!hasMore) return
    this.setData({ page: page + 1 })
    this.getGoodsList(false)
  },

  async onRefresh() {
    this.setData({ refreshing: true, page: 1 })
    await this.getGoodsList(true)
  },

  handleAddCart(e: WechatMiniprogram.CustomEvent) {
    const goods = e.detail as GoodsItem
    trackGoodsClick(goods.id, goods.title, '/pages/index/index')
    cartStore.addGoods(goods)
    wx.showToast({ title: `已添加${goods.title.slice(0,6)}...` })
  },
  
})