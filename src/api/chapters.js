import request from '@/utils/request'

export function addChapter(chapter) {
  return request({
    url: '/chapters',
    method: 'post',
    data: chapter
  })
}

export function getChapters() {
  return request({
    url: '/chapters',
    method: 'get'
  })
}

export function editChapter(chapter) {
  return request({
    url: '/chapters/' + chapter._id,
    method: 'put',
    data: chapter
  })
}
