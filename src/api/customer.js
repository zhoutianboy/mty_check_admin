import request from '@/utils/request'

/**
 * 客户分页列表
 * @param query
 * @returns {AxiosPromise}
 */
export function customerPageList(query) {
  return request({
    url: '/customer',
    method: 'get',
    params: query
  })
}

/**
 * 新增客户
 * @param data
 * @returns {AxiosPromise}
 */
export function addCustomer(data) {
  return request({
    url: '/customer',
    method: 'post',
    data
  })
}

/**
 * 更新客户
 * @param data
 * @returns {AxiosPromise}
 */
export function updateCustomer(data) {
  return request({
    url: '/customer/' + data.id,
    method: 'put',
    data
  })
}

/**
 * 删除客户
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteCustomer(id) {
  return request({
    url: '/customer/' + id,
    method: 'delete'
  })
}

/**
 * 客户列表
 * @returns {AxiosPromise}
 */
export function customerList() {
  return request({
    url: '/customer/list',
    method: 'get'
  })
}

/**
 * 客户已指派的员工ids
 * @param customerId
 * @returns {AxiosPromise}
 */
export function existEmployeeIds(customerId) {
  return request({
    url: '/customer/exist/' + customerId,
    method: 'get'
  })
}

/**
 * 给客户指派员工
 * @param customerId
 * @param adminIds
 * @returns {AxiosPromise}
 */
export function assignEmployee({ customerId, adminIds }) {
  return request({
    url: '/customer/assign',
    method: 'post',
    data: {
      customerId,
      adminIds
    }
  })
}
