import request from '@/utils/request'

// this is old api
export function getToken() {
  return request({
    url: '/common/uptoken',
    method: 'get'
  })
}
//  this is new api
export function qiniuConfig() {
  return request({ url: '/common/qiniuConfig' })
}
