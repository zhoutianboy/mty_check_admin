/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const productRouter = {
  path: '/product',
  component: Layout,
  redirect: 'noRedirect',
  alwaysShow: true, // will always show the root menu
  name: 'Product',
  meta: {
    title: '货品管理',
    icon: 'chart',
    auth: 'product'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/product/list'),
      name: 'ProductList',
      meta: { title: '货品列表', auth: 'product:list', noCache: true }
    }
  ]
}

export default productRouter
