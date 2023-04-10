import request from '@/utils/request'

/**
 * 报价单分页列表
 * @param query
 * @returns {AxiosPromise}
 */
export function offerPageList(query) {
  return request({
    url: '/offer',
    method: 'get',
    params: query
  })
}

/**
 * 新增报价单
 * @param data
 * @returns {AxiosPromise}
 */
export function addOffer(data) {
  return request({
    url: '/offer',
    method: 'post',
    data
  })
}

/**
 * 更新报价单
 * @param data
 * @returns {AxiosPromise}
 */
export function updateOffer(data) {
  return request({
    url: '/offer/' + data.id,
    method: 'put',
    data
  })
}

/**
 * 删除报价单
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteOffer(id) {
  return request({
    url: '/offer/' + id,
    method: 'delete'
  })
}

/**
 * 报价单未关联货品分页列表
 * @param id
 * @param other
 * @returns {AxiosPromise}
 */
export function assignProductPageList({ id, ...other }) {
  return request({
    url: '/offer/product/' + id,
    method: 'get',
    params: other
  })
}

/**
 * 报价单已关联货品分页列表
 * @param id
 * @param other
 * @returns {AxiosPromise}
 */
export function relateProductPageList({ id, ...other }) {
  return request({
    url: '/offer/relate/' + id,
    method: 'get',
    params: other
  })
}

/**
 * 报价单关联货品
 * @param orderId
 * @param productList
 * @returns {AxiosPromise}
 */
export function assignOfferProduct({ orderId, productList }) {
  return request({
    url: '/offer/assign',
    method: 'post',
    data: {
      offerId: orderId,
      products: productList
    }
  })
}

/**
 * 更新报价单货品关联信息
 * @param offerId
 * @param productId
 * @param other
 * @returns {AxiosPromise}
 */
export function updateOfferProduct({ orderId: offerId, productId, ...other }) {
  return request({
    url: '/offer/assign/' + offerId + '/' + productId,
    method: 'put',
    data: other
  })
}

/**
 * 删除报价单货品关联信息
 * @param offerId
 * @param productId
 * @returns {AxiosPromise}
 */
export function deleteOfferProduct({ offerId, productId }) {
  return request({
    url: '/offer/assign/' + offerId + '/' + productId,
    method: 'delete'
  })
}

/**
 * 根据报价单创建合同单
 * @param offerId
 * @returns {AxiosPromise}
 */
export function createContract(offerId) {
  return request({
    url: '/offer/contract/' + offerId,
    method: 'post'
  })
}
