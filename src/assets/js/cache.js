//缓存

import storage from 'good-storage'
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

//插入到数组中
function insertArray(arr,val,compare,maxLen) {
  const index = arr.findIndex(compare)
  if(index === 0) {
    return
  }
  if(index > 0) {
    arr.splice(index,1)
  }
  arr.unshift(val)
  if(maxLen && arr.length > maxLen) {
    //删除数组最后一位
    arr.pop()
  }
}

//从数组中删除
function deleteFormArray(arr,compare) {
  const index = arr.findIndex(compare)
  if(index > -1) {
    arr.splice(index,1)
  }
}

//保存历史记录
export function saveSearch(query) {
  //如果找不到,则返回空数组
  let searches = storage.get(SEARCH_KEY,[])
  //对数组进行操作
  insertArray(searches,query,(item) => {
    return item === query
  },SEARCH_MAX_LENGTH)
  //保存到 localStorage
  storage.set(SEARCH_KEY,searches)
  return searches
}

//读取搜索历史
export function loadSearch() {
  return storage.get(SEARCH_KEY,[])
}



//删除 localStorage 的某一项历史记录
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY,[])
  //操作数组
  deleteFormArray(searches,(item) => {
    return item === query
  })
  //保存到 localStorage
  storage.set(SEARCH_KEY,searches)
  return searches
}

//清空 localStorage 中里所有历史记录
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

//保存到播放历史
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY,[])
  insertArray(songs,song, (item) => {
    return item.id === song.id
  },PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY,songs)
  return songs
}

//读取播放历史
export function loadPlay() {
  return storage.get(PLAY_KEY,[])
}

//保存到我的喜欢列表
export function saveFavorite(song) {
  let arr = storage.get(FAVORITE_KEY,[])
  insertArray(arr,song, (item) => {
    return item.id === song.id
  },FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY,arr)
  return arr
}

//删除我的喜欢
export function deleteFavorite(song) {
  let arr = storage.get(FAVORITE_KEY,[])
  deleteFormArray(arr,(item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY,arr)
  return arr
}

//读取我的喜欢列表
export function loadFavorite() {
  return storage.get(FAVORITE_KEY,[])
}