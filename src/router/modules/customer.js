/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const customerRouter = {
  path: '/customer',
  component: Layout,
  redirect: 'noRedirect',
  alwaysShow: true, // will always show the root menu
  name: 'Customer',
  meta: {
    title: '客户管理',
    icon: 'chart',
    auth: 'customer'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/customer/list'),
      name: 'CustomerList',
      meta: { title: '客户列表', auth: 'customer:list', noCache: true }
    }
  ]
}

export default customerRouter
