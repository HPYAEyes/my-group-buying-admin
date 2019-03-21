import request from '@/utils/request'

export function login({username, password}) {
  return request({
    url: '/adminusers/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

