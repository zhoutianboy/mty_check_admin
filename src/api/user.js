import request from '@/utils/request'

/**
 * 登录
 * @param data
 * @returns {AxiosPromise}
 */
export function login(data) {
  return request({
    // url: '/vue-element-admin/user/login',
    url: '/login',
    method: 'post',
    data
  })
}

/**
 * 获取登录用户信息
 * @param token
 * @returns {AxiosPromise}
 */
export function getInfo(token) {
  return request({
    // url: '/vue-element-admin/user/info',
    url: '/info',
    method: 'get'
    // params: { token }
  })
}

/**
 * 重置登录密码
 * @param newPassword
 * @param surePassword
 * @returns {AxiosPromise}
 */
export function resetPwd({ newPassword, surePassword }) {
  return request({
    url: '/resetPwd',
    method: 'put',
    data: {
      newPassword,
      surePassword
    }
  })
}

/**
 * 退出
 * @returns {AxiosPromise}
 */
export function logout() {
  return request({
    // url: '/vue-element-admin/user/logout',
    url: '/logout',
    method: 'post'
  })
}
