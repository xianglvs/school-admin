import request from '@/utils/request'

export async function login(data) {
  try {
    const res = await request({
      url: '/api/user/login',
      method: 'post',
      data
    })
    if (res.code !== 0) {
      return Promise.resolve(res)
    }
    const res1 = await request({
      url: '/api/user/token',
      method: 'post',
      data: {
        ticket: res.data.ticket
      }
    })
    return Promise.resolve(res1)
  } catch (e) {
    return Promise.reject(e)
  }
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: {
      token
    }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
