/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const orderRouter = {
  path: '/order',
  component: Layout,
  redirect: 'noRedirect',
  alwaysShow: true, // will always show the root menu
  name: 'Order',
  meta: {
    title: '订单管理',
    icon: 'chart',
    auth: 'order'
  },
  children: [
    {
      path: 'offerList',
      component: () => import('@/views/order/offer/list'),
      name: 'OfferList',
      meta: { title: '报价单列表', auth: 'offer:list', noCache: true }
    },
    {
      path: 'offerRelate',
      component: () => import('@/views/order/offer/relate'),
      hidden: true,
      name: 'OfferRelate',
      meta: { title: '报价单货品', auth: ['offer:add', 'offer:edit'], noCache: true, activeMenu: '/order/offerList' }
    },
    {
      path: 'purchaseList',
      component: () => import('@/views/order/purchase/list'),
      name: 'purchaseList',
      meta: { title: '采购单列表', auth: 'purchase:list', noCache: true }
    },
    {
      path: 'purchaseRelate',
      component: () => import('@/views/order/purchase/relate'),
      hidden: true,
      name: 'PurchaseRelate',
      meta: { title: '采购单货品', auth: ['purchase:add', 'purchase:edit'], noCache: true, activeMenu: '/order/purchaseList' }
    },
    {
      path: 'contractList',
      component: () => import('@/views/order/contract/list'),
      name: 'contractList',
      meta: { title: '合同列表', auth: 'contract:list', noCache: true }
    },
    {
      path: 'contractRelate',
      component: () => import('@/views/order/contract/relate'),
      hidden: true,
      name: 'ContractRelate',
      meta: { title: '合同单货品', auth: ['contract:add', 'contract:edit'], noCache: true, activeMenu: '/order/contractList' }
    },
    {
      path: 'contractPay',
      component: () => import('@/views/order/contract/pay'),
      hidden: true,
      name: 'ContractPay',
      meta: { title: '合同单付款明细', auth: 'contract:pay', noCache: true, activeMenu: '/order/contractList' }
    },
    {
      path: 'contractPurchase',
      component: () => import('@/views/order/contract/purchase'),
      hidden: true,
      name: 'ContractPurchase',
      meta: { title: '生成采购单', auth: 'contract:purchase', noCache: true, activeMenu: '/order/contractList' }
    }
  ]
}

export default orderRouter
