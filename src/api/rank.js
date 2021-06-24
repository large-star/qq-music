import { urlHeader } from './config'
import {http} from './axios'

export const getToplist = () => {
  return http({
    url: urlHeader + '/toplist/detail'
  })
}