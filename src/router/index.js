import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home/index.vue')
  },
  {
    path: '/product/:id',
    name: 'Product',
    component: () => import('../views/product/index.vue')
  },
  {
    path: '/order/confirm',
    name: 'OrderConfirm',
    component: () => import('../views/order/confirm.vue')
  },
  {
    path: '/order/list',
    name: 'OrderList',
    component: () => import('../views/order/list.vue')
  },
  {
    path: '/pay/:orderNo',
    name: 'Pay',
    component: () => import('../views/pay/index.vue')
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('../views/user/index.vue'),
    children: [
      {
        path: '',
        redirect: '/user/orders'
      },
      {
        path: 'orders',
        name: 'UserOrders',
        component: () => import('../views/user/orders.vue')
      },
      {
        path: 'addresses',
        name: 'UserAddresses',
        component: () => import('../views/user/addresses.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/user/login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
