import { get } from './request'
import type { ApiRes, GoodsItem, CategoryItem, PageParams, PageResult } from '../types'

/**
 * 获取首页商品分页列表
 */
export function getGoodsListApi(params: PageParams) {
  return get<PageResult<GoodsItem>>('/goods/list', params)
}

/**
 * 获取商品分类列表
 */
export function getCategoryListApi() {
  return get<CategoryItem[]>('/goods/category')
}