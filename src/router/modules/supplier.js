/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const supplierRouter = {
  path: '/supplier',
  component: Layout,
  redirect: 'noRedirect',
  alwaysShow: true, // will always show the root menu
  name: 'Supplier',
  meta: {
    title: '供应商管理',
    icon: 'chart',
    auth: 'supplier'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/supplier/list'),
      name: 'SupplierList',
      meta: { title: '供应商列表', auth: 'supplier:list', noCache: true }
    },
    {
      path: 'provide',
      component: () => import('@/views/supplier/provide'),
      hidden: true,
      name: 'SupplierProvide',
      meta: { title: '供应商货品', auth: 'supplier:provide', noCache: true, activeMenu: '/supplier/list' }
    }
  ]
}

export default supplierRouter
