import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/api/article/list',
    method: 'get',
    params
  })
}
