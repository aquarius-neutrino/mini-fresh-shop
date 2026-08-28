//统一做图片压缩、裁剪、占位兜底、自动拼接 CDN，全项目复用
/**
 * 图片统一优化处理
 * @param src 原始图片地址
 * @param w 目标宽度 rpx
 * @param h 目标高度 rpx
 * @returns 处理后图片url
 */
export function getOptImage(src: string, w = 750, h = 750): string {
  // 空地址返回兜底占位图
  if (!src) return '/static/images/goods-default.png'

  // 本地静态图不处理，直接返回
  if (src.startsWith('/static')) return src

  // 线上图片拼接CDN裁剪参数（后端图床通用规则）
  const cdnSuffix = `?width=${w}&height=${h}&quality=75&format=webp`
  return src + cdnSuffix
}

/**
 * 商品列表小图专用（压缩更小）
 */
export function getThumbImage(src: string) {
  console.log('src',src)
  return getOptImage(src, 240, 240)
}

/**
 * 商品详情大图
 */
export function getDetailImage(src: string) {
  return getOptImage(src, 750, 750)
}
