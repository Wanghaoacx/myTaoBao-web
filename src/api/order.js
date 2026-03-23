import request from './index'

// 创建订单
export function createOrder(data) {
  return request({
    url: '/trade/order/create',
    method: 'post',
    data
  })
}

// 获取订单详情
export function getOrderDetail(id) {
  return request({
    url: `/trade/order/${id}`,
    method: 'get'
  })
}

// 获取用户订单列表
export function getOrderList(userId) {
  return request({
    url: '/trade/orders',
    method: 'get',
    params: { userId }
  })
}

// 取消订单
export function cancelOrder(id) {
  return request({
    url: `/trade/order/cancel/${id}`,
    method: 'post'
  })
}

// 创建支付
export function createPayment(orderNo, userId, payType) {
  return request({
    url: '/trade/pay/create',
    method: 'post',
    params: { orderNo, userId, payType }
  })
}

// 模拟支付
export function simulatePay(orderNo) {
  return request({
    url: '/trade/pay/simulate',
    method: 'post',
    params: { orderNo }
  })
}
