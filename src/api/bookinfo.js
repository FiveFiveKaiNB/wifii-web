import request from '@/utils/request'

export function addBookinfo(bookinfo) {
  return request({
    url: '/bookinfo',
    method: 'post',
    data: bookinfo
  })
}

export function editBookinfo(bookinfo) {
  return request({
    url: '/bookinfo/' + bookinfo._id,
    method: 'put',
    data: bookinfo
  })
}

export function getBookinfo() {
  return request({
    url: '/bookinfo',
    method: 'get'
  })
}
