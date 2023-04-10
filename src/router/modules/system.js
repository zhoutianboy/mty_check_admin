/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const systemRouter = {
  path: '/system',
  component: Layout,
  redirect: 'noRedirect',
  alwaysShow: true, // will always show the root menu
  name: 'System',
  meta: {
    title: '系统管理',
    icon: 'chart',
    auth: 'system'
  },
  children: [
    {
      path: 'employeeList',
      component: () => import('@/views/system/employee/list'),
      name: 'EmployeeList',
      meta: { title: '员工列表', auth: 'employee:list', noCache: true }
    }
  ]
}

export default systemRouter
