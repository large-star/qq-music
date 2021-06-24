import { urlHeader } from './config'
import {http} from './axios'

//请求歌单详情
export function getDetail(id) {
  return http({
    url: urlHeader + '/playlist/detail',
    params: {
      id
    }
  })
}

export function login() {
  return http({
    url: urlHeader + '/login/cellphone',
    params: {
      phone: '',
      password: ''
    }
  })
}
