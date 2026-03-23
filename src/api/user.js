import request from './index'

// 用户登录
export function login(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: { username, password }
  })
}

// 用户注册
export function register(username, password) {
  return request({
    url: '/user/register',
    method: 'post',
    data: { username, password }
  })
}

// 获取用户信息
export function getUserInfo(userId) {
  return request({
    url: `/user/${userId}`,
    method: 'get'
  })
}

// 获取用户地址列表
export function getAddressList(userId) {
  return request({
    url: '/trade/user/addresses',
    method: 'get',
    params: { userId }
  })
}

// 获取默认地址
export function getDefaultAddress(userId) {
  return request({
    url: '/trade/user/default-address',
    method: 'get',
    params: { userId }
  })
}
