import { urlHeader } from './config'
import {http} from './axios'

export const getSearchHot = () => {
  return http({
    url: urlHeader + '/search/hot'
  })
}

export const search = (keywords,limit=20,offset=0) => {
  return http({
    url: urlHeader + '/cloudsearch',
    params: {
      keywords,
      limit,
      offset
    }
  })
}