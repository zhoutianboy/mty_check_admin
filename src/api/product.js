import request from '@/utils/request'

export function productPageList(query) {
  return request({
    url: '/product',
    method: 'get',
    params: query
  })
}

export function addProduct(data) {
  return request({
    url: '/product',
    method: 'post',
    data
  })
}

export function updateProduct(data) {
  return request({
    url: '/product/' + data.id,
    method: 'put',
    data
  })
}

export function deleteProduct(id) {
  return request({
    url: '/product/' + id,
    method: 'delete'
  })
}

export function fromSupplierPageList({ id, ...other }) {
  return request({
    url: '/product/from/' + id,
    method: 'get',
    params: other
  })
}
