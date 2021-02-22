import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/web/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/web/root',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/web/user/logout',
    method: 'post'
  })
}

export function changePwd(data) {
  return request({
    url: '/web/password/modify',
    method: 'put',
    data
  })
}

export function getUserRedeemRecords(params) {
  return request({
    url: '/redeemRecords',
    method: 'get',
    params
  })
}
