import { playMode } from '@/assets/js/config'
import { loadSearch, loadPlay, loadFavorite } from '../assets/js/cache'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequencelist: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},//recommend/disc
  topList: {},//rank/topList
  searchHistory: loadSearch(),//搜索历史,
  playHistory: loadPlay(),//播放历史
  favoriteList: loadFavorite()//我的喜欢歌曲列表
}

export default state