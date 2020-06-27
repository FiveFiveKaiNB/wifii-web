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
    url: '/web/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/web/user/logout',
    method: 'post'
  })
}
