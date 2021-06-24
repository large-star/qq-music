import { urlHeader } from './config'
import {http} from './axios'

//获取歌手列表
export function getSingerList ({limit,offset,type,area}) {
  return http({
    url: urlHeader +'/artist/list',
    params: {
      limit,
      offset,
      type,
      area
    }
  })
}

export function getSingerDetail (id) {
  return http({
    url: urlHeader + '/artists',
    params: {
      id
    }
  })
}