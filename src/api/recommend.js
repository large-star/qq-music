import jsonp from '@/assets/js/jsonp'
import { commonParams, options, urlHeader } from './config'

import {http} from './axios'

//请求轮播图
export function getBanners () {
  return http({
    url: urlHeader + '/banner'
  })
}

//请求热门歌单
export function getHotList () {
  return http({
    url: urlHeader + '/top/playlist?limit=6&order=hot'
  })
}

//请求推荐歌单
export function getRecommendList () {
  return http({
    url: urlHeader + '/personalized?limit=10'
  })
}

//请求精品歌单
export function getHighqualityList() {
  return http({
    url: urlHeader + '/top/playlist/highquality?limit=6'
  })
}


