import request from '@/utils/request'

/**
 * 员工分页列表
 * @param query
 * @returns {AxiosPromise}
 */
export function employeePageList(query) {
  return request({
    url: '/admin',
    method: 'get',
    params: query
  })
}

/**
 * 新增员工
 * @param data
 * @returns {AxiosPromise}
 */
export function addEmployee(data) {
  return request({
    url: '/admin',
    method: 'post',
    data
  })
}

/**
 * 更新员工
 * @param data
 * @returns {AxiosPromise}
 */
export function updateEmployee(data) {
  return request({
    url: '/admin/' + data.id,
    method: 'put',
    data
  })
}

/**
 * 删除员工
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteEmployee(id) {
  return request({
    url: '/admin/' + id,
    method: 'delete'
  })
}

/**
 * 员工列表
 * @param type Number|Array
 * @returns {AxiosPromise}
 */
export function employeeList(type = null) {
  return request({
    url: '/admin/list',
    method: 'get',
    params: {
      type
    }
  })
}

/**
 * 切换员工状态 1-正常 2-禁用
 * @param id
 * @param status
 * @returns {AxiosPromise}
 */
export function changeStatus(id, status) {
  return request({
    url: '/admin/status/' + id,
    method: 'put',
    data: {
      status
    }
  })
}

/**
 * 员工已分配的客户ids
 * @param adminId
 * @returns {AxiosPromise}
 */
export function existCustomerIds(adminId) {
  return request({
    url: '/admin/exist/' + adminId,
    method: 'get'
  })
}

/**
 * 给员工分配客户
 * @param adminId
 * @param customerIds
 * @returns {AxiosPromise}
 */
export function assignCustomer({ adminId, customerIds }) {
  return request({
    url: '/admin/assign',
    method: 'post',
    data: {
      adminId,
      customerIds
    }
  })
}

/**
 * 重置员工密码
 * @param adminId
 * @param newPassword
 * @param surePassword
 * @returns {AxiosPromise}
 */
export function resetPwd({ adminId, newPassword, surePassword }) {
  return request({
    url: '/admin/resetPwd/' + adminId,
    method: 'put',
    data: {
      newPassword,
      surePassword
    }
  })
}
