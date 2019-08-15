import request from '@/utils/request'

export function login(data) {
  return new Promise((resolve, reject) => {
    request({
      url: '/api/user/login',
      method: 'post',
      data
    }).then(res => {
      if (res.code === 0) {
        return request({
          url: '/api/user/token',
          method: 'post',
          data: { ticket: res.data.ticket }
        }).then((res1) => {
          if (res1.code !== 0) {
            resolve(res1)
            return
          }
          res.data.token = res1.data.token
          resolve(res)
        })
      } else {
        resolve(res)
      }
    }).catch(e => {
      reject(e)
    })
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
