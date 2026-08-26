/**
 * 获取当前网络是否可用
 */
export function checkNetwork(): Promise<boolean> {
  return new Promise((resolve) => {
    wx.getNetworkType({
      success: (res) => {
        // none = 无网络
        resolve(res.networkType !== 'none')
      },
      fail: () => resolve(false)
    })
  })
}

/**
 * 全局监听网络切换
 * @param onOffline 断网回调
 * @param onOnline 恢复网络回调
 */
export function watchNetworkChange(
  onOffline: () => void,
  onOnline: () => void
) {
  wx.onNetworkStatusChange((res) => {
    if (!res.isConnected) {
      onOffline()
    } else {
      onOnline()
    }
  })
}

/**
 * 取消网络监听（页面卸载调用，防内存泄漏）
 */
export function unWatchNetworkChange() {
  wx.offNetworkStatusChange()
}
