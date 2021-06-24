import { urlHeader } from './config'
import {http} from './axios'

export const getSongUrl = (id) => {
  return http({
    url: urlHeader + '/song/url',
    params: {
      id
    }
  })
}

export const getLyric = (id) => {
  return http({
    url: urlHeader + '/lyric',
    params: {
      id
    }
  })
}