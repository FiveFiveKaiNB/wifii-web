import request from '@/utils/request'

export function delOneResourcesData(url, resourcesId) {
  return request({
    url: `${url}/${resourcesId}`,
    method: 'delete'
  })
}

export function getOneResourcesData(url, resourcesId, params) {
  return request({
    url: `${url}/${resourcesId}`,
    method: 'get',
    params
  })
}

export function putOneResourcesData(url, resourcesId, data) {
  return request({
    url: `${url}/${resourcesId}`,
    method: 'put',
    data
  })
}

export function postOneResourcesData(url, data) {
  return request({
    url: `${url}`,
    method: 'post',
    data
  })
}
