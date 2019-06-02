/*
  包含多个工具函数的模块
 */

/*
 动态计算 redirectTo 的值：
 type
     '/laoban'
     '/dashen'
 header
     '/laobaninfo'
     '/dasheninfo'
 */
export function getRedirectTo(type, header) {
  let path
  if (type==='laoban') {
    path = '/laoban'
  } else {
    path = '/dashen'
  }
  if (!header) { // 如果信息未完善
    path += 'info'
  }
  return path
}
