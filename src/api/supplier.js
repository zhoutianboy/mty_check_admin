import request from '@/utils/request'

/**
 * 供应商分页列表
 * @param query
 * @returns {AxiosPromise}
 */
export function supplierPageList(query) {
  return request({
    url: '/supplier',
    method: 'get',
    params: query
  })
}

/**
 * 新增供应商
 * @param data
 * @returns {AxiosPromise}
 */
export function addSupplier(data) {
  return request({
    url: '/supplier',
    method: 'post',
    data
  })
}

/**
 * 更新供应商
 * @param data
 * @returns {AxiosPromise}
 */
export function updateSupplier(data) {
  return request({
    url: '/supplier/' + data.id,
    method: 'put',
    data
  })
}

/**
 * 删除供应商
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteSupplier(id) {
  return request({
    url: '/supplier/' + id,
    method: 'delete'
  })
}

/**
 * 供应商列表
 * @returns {AxiosPromise}
 */
export function supplierList() {
  return request({
    url: '/supplier/list',
    method: 'get'
  })
}

/**
 * 供应商未关联货品分页列表
 * @param id
 * @param other
 * @returns {AxiosPromise}
 */
export function assignProductPageList({ id, ...other }) {
  return request({
    url: '/supplier/product/' + id,
    method: 'get',
    params: other
  })
}

/**
 * 供应商已提供货品分页列表
 * @param id
 * @param other
 * @returns {AxiosPromise}
 */
export function provideProductPageList({ id, ...other }) {
  return request({
    url: '/supplier/provide/' + id,
    method: 'get',
    params: other
  })
}

/**
 * 供应商分配货品
 * @param supplierId
 * @param productList
 * @returns {AxiosPromise}
 */
export function assignSupplierProduct({ supplierId, productList }) {
  return request({
    url: '/supplier/assign',
    method: 'post',
    data: {
      supplierId,
      products: productList
    }
  })
}

/**
 * 更新供应商货品关联信息
 * @param supplierId
 * @param productId
 * @param other
 * @returns {AxiosPromise}
 */
export function updateSupplierProduct({ supplierId, productId, ...other }) {
  return request({
    url: '/supplier/assign/' + supplierId + '/' + productId,
    method: 'put',
    data: other
  })
}

/**
 * 删除供应商货品关联信息
 * @param supplierId
 * @param productId
 * @returns {AxiosPromise}
 */
export function deleteSupplierProduct({ supplierId, productId }) {
  return request({
    url: '/supplier/assign/' + supplierId + '/' + productId,
    method: 'delete'
  })
}
