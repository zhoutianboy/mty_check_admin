import request from '@/utils/request'

/**
 * 采购单分页列表
 * @param query
 * @returns {AxiosPromise}
 */
export function purchasePageList(query) {
  return request({
    url: '/purchase',
    method: 'get',
    params: query
  })
}

/**
 * 新增采购单
 * @param data
 * @returns {AxiosPromise}
 */
export function addPurchase(data) {
  return request({
    url: '/purchase',
    method: 'post',
    data
  })
}

/**
 * 更新采购单
 * @param data
 * @returns {AxiosPromise}
 */
export function updatePurchase(data) {
  return request({
    url: '/purchase/' + data.id,
    method: 'put',
    data
  })
}

/**
 * 删除采购单
 * @param id
 * @returns {AxiosPromise}
 */
export function deletePurchase(id) {
  return request({
    url: '/purchase/' + id,
    method: 'delete'
  })
}

/**
 * 采购单未关联货品分页列表
 * @param id
 * @param other
 * @returns {AxiosPromise}
 */
export function assignProductPageList({ id, ...other }) {
  return request({
    url: '/purchase/product/' + id,
    method: 'get',
    params: other
  })
}

/**
 * 采购单已关联货品分页列表
 * @param id
 * @param other
 * @returns {AxiosPromise}
 */
export function relateProductPageList({ id, ...other }) {
  return request({
    url: '/purchase/relate/' + id,
    method: 'get',
    params: other
  })
}

/**
 * 采购单关联货品
 * @param orderId
 * @param productList
 * @returns {AxiosPromise}
 */
export function assignPurchaseProduct({ orderId, productList }) {
  return request({
    url: '/purchase/assign',
    method: 'post',
    data: {
      purchaseId: orderId,
      products: productList
    }
  })
}

/**
 * 更新采购单货品关联信息
 * @param purchaseId
 * @param productId
 * @param other
 * @returns {AxiosPromise}
 */
export function updatePurchaseProduct({ orderId: purchaseId, productId, ...other }) {
  return request({
    url: '/purchase/assign/' + purchaseId + '/' + productId,
    method: 'put',
    data: other
  })
}

/**
 * 删除采购单货品关联信息
 * @param purchaseId
 * @param productId
 * @returns {AxiosPromise}
 */
export function deletePurchaseProduct({ purchaseId, productId }) {
  return request({
    url: '/purchase/assign/' + purchaseId + '/' + productId,
    method: 'delete'
  })
}
