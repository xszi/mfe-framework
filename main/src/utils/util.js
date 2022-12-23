import store from '@/store'
/**
 * @param {string} key
 * @returns {String | Array | Object}
 */
export function removeBrowserCache(key) {
  sessionStorage.removeItem(key)
  localStorage.removeItem(key)
}

export async function logout() {
  sessionStorage.clear()
  localStorage.clear()
  // const url = await getLoginPage()
  // if (url) {
  //   window.location.href = url
  // }
  window.location.href = window.location.origin
}

export function getLoginJumpBackLink() {
  const protocol = window.location.hostname.includes('.com') ? 'https' : 'http'
  let locationUrl = `${protocol}://${window.location.hostname}`
  locationUrl = window.location.port ? `${locationUrl}:${window.location.port}/` : `${locationUrl}/`
  return locationUrl
}

export async function getLoginPage() {
  // 开发环境 develop 分支 合并代码时需要注意
  // let locationUrl = `http://${window.location.hostname}`
  // 测试环境 test 分支
  // let locationUrl = `https://${window.location.hostname}`
  // if (window.location.port) {
  //   locationUrl = `${locationUrl}:${window.location.port}/`
  // } else {
  //   locationUrl = `${locationUrl}/`
  // }
  const locationUrl = getLoginJumpBackLink()
  if (window.location.href.includes('layout') || window.location.href.includes('undefined')) {
    return locationUrl
  } else {
    const res = await store.dispatch('user/getLoginPage', locationUrl)
    return res.data
  }
}

