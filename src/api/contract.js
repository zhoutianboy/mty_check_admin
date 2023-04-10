import request from '@/utils/request'

/**
 * 合同单分页列表
 * @param query
 * @returns {AxiosPromise}
 */
export function contractPageList(query) {
  return request({
    url: '/contract',
    method: 'get',
    params: query
  })
}

/**
 * 新增合同单
 * @param data
 * @returns {AxiosPromise}
 */
export function addContract(data) {
  return request({
    url: '/contract',
    method: 'post',
    data
  })
}

/**
 * 更新合同单
 * @param data
 * @returns {AxiosPromise}
 */
export function updateContract(data) {
  return request({
    url: '/contract/' + data.id,
    method: 'put',
    data
  })
}

/**
 * 删除合同单
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteContract(id) {
  return request({
    url: '/contract/' + id,
    method: 'delete'
  })
}

/**
 * 合同单未关联货品分页列表
 * @param id
 * @param other
 * @returns {AxiosPromise}
 */
export function assignProductPageList({ id, ...other }) {
  return request({
    url: '/contract/product/' + id,
    method: 'get',
    params: other
  })
}

/**
 * 合同单已关联货品分页列表
 * @param id
 * @param other
 * @returns {AxiosPromise}
 */
export function relateProductPageList({ id, ...other }) {
  return request({
    url: '/contract/relate/' + id,
    method: 'get',
    params: other
  })
}

/**
 * 合同单关联货品
 * @param orderId
 * @param productList
 * @returns {AxiosPromise}
 */
export function assignContractProduct({ orderId, productList }) {
  return request({
    url: '/contract/assign',
    method: 'post',
    data: {
      contractId: orderId,
      products: productList
    }
  })
}

/**
 * 更新合同单货品关联信息
 * @param offerId
 * @param productId
 * @param other
 * @returns {AxiosPromise}
 */
export function updateContractProduct({ orderId: contractId, productId, ...other }) {
  return request({
    url: '/contract/assign/' + contractId + '/' + productId,
    method: 'put',
    data: other
  })
}

/**
 * 删除合同单货品关联信息
 * @param offerId
 * @param productId
 * @returns {AxiosPromise}
 */
export function deleteContractProduct({ contractId, productId }) {
  return request({
    url: '/contract/assign/' + contractId + '/' + productId,
    method: 'delete'
  })
}

/**
 * 合同单付款记录分页列表
 * @param id
 * @param other
 * @returns {AxiosPromise}
 */
export function paymentPageList({ id, ...other }) {
  return request({
    url: '/contract/pay/' + id,
    method: 'get',
    params: other
  })
}

/**
 * 新增合同单付款记录
 * @param contractId
 * @param other
 * @returns {AxiosPromise}
 */
export function addPayment({ contractId, ...other }) {
  return request({
    url: '/contract/pay/' + contractId,
    method: 'post',
    data: other
  })
}

/**
 * 更新合同单付款记录
 * @param id
 * @param other
 * @returns {AxiosPromise}
 */
export function updatePayment({ id, ...other }) {
  return request({
    url: '/contract/pay/' + id,
    method: 'put',
    data: other
  })
}

/**
 * 删除合同单付款记录
 * @param id
 * @returns {AxiosPromise}
 */
export function deletePayment(id) {
  return request({
    url: '/contract/pay/' + id,
    method: 'delete'
  })
}
