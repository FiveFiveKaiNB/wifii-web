import request from '@/utils/request'

export function getOneRecordDetail() {
  return request({
    url: '/voteRecords',
    method: 'get'
  })
}
