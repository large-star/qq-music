import * as types from './mutations-type'
import { playMode } from '../assets/js/config'
import { shuffle } from '../assets/js/utils'
import { saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite } from '../assets/js/cache'
import storage from 'good-storage'

const findIndex = (list,song) => {
  return list.findIndex(item => {
    return item.id === song.id
  })
}

const getters = {
  //选择播放
  selectPlay({commit,state},{list,index}) {
    commit(types.SET_SEQUENCE_LIST,list)
    if(state.mode === playMode.random) {
      let randomList = shuffle(list)
      index = findIndex(randomList,list[index])
      commit(types.SET_PLAYLIST,randomList)
    }else {
      commit(types.SET_PLAYLIST,list)
    }
    commit(types.SET_CURRENT_INDEX,index)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAYING_STATE,true)
  },
  //随机播放
  randomPlay({commit,state},{list}) {
    commit(types.SET_PLAY_MODE,playMode.random)
    commit(types.SET_SEQUENCE_LIST,list)
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST,randomList)
    commit(types.SET_CURRENT_INDEX,0)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAYING_STATE,true)
  },
  //插入歌曲
  insertSong({commit,state},song) {
    let playlist = state.playlist.slice()
    let sequencelist = state.sequencelist.slice()
    let currentIndex = state.currentIndex

    //记录当前歌曲
    let currentSong = playlist[currentIndex]
    //查找当前列表中是否有 待插入的歌曲 并返回索引
    let fpIndex = findIndex(playlist,song)
    //因为是插入歌曲，所以索引+1
    currentIndex++
    //插入这首歌到当前索引位置
    playlist.splice(currentIndex,0,song)
    //如果已经包含这首歌曲
    if(fpIndex > -1) {
      //如果当前插入的序号，大于原先列表中的序号
      if(currentIndex > fpIndex) {
        playlist.splice(fpIndex,1)
        currentIndex--
      }else {
        playlist.splice(fpIndex+1,1)
      }
    }

    let currentSIndex = findIndex(sequencelist,currentSong) + 1

    let fsIndex = findIndex(sequencelist,song)

    sequencelist.splice(currentSIndex,0,song)

    if(fsIndex > -1) {
      if(currentSIndex > fsIndex) {
        sequencelist.splice(fsIndex,1)
      }else {
        sequencelist.splice(fsIndex+1,1)
      }
    }


    commit(types.SET_PLAYLIST,playlist)
    commit(types.SET_SEQUENCE_LIST,sequencelist)
    commit(types.SET_CURRENT_INDEX,currentIndex)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAYING_STATE,true)
  },
  //保存搜索结果
  saveSearchHistory({commit,state},query) {
    commit(types.SET_SEARCH_HISTORY,saveSearch(query))
  },
  //删除选中的搜索结果项
  deleteSearchHistory({commit,state},query) {
    commit(types.SET_SEARCH_HISTORY,deleteSearch(query))
  },
  //清空历史记录
  clearSearchHistory({commit,state}) {
    commit(types.SET_SEARCH_HISTORY,clearSearch())
  },
  //删除列表内的一首歌曲
  deleteSong({commit,state},song) {
    let playlist = state.playlist.slice()
    let sequencelist = state.sequencelist.slice()
    let currentIndex = state.currentIndex

    let pIndex = findIndex(playlist,song)
    playlist.splice(pIndex,1)

    let sIndex = findIndex(sequencelist,song)
    sequencelist.splice(sIndex,1)

    if(currentIndex > pIndex || currentIndex === playlist.length) {
      currentIndex--
    }
    commit(types.SET_PLAYLIST,playlist)
    commit(types.SET_SEQUENCE_LIST,sequencelist)
    commit(types.SET_CURRENT_INDEX,currentIndex)

    const playingState = playlist.length > 0
    commit(types.SET_PLAYING_STATE,playingState)
    // if(!playlist.length) {
    //   commit(types.SET_PLAYING_STATE,false)
    // }
  },
  //清空播放列表
  deleteSongList({commit}) {
    commit(types.SET_CURRENT_INDEX,-1)
    commit(types.SET_PLAYLIST,[])
    commit(types.SET_SEQUENCE_LIST,[])
    commit(types.SET_PLAYING_STATE,false)
  },
  //保存到播放历史
  savePlayHistory({commit},song) {
    commit(types.SET_PLAY_HISTORY,savePlay(song))
  },
  //保存到我的喜欢列表
  saveFavoriteList({commit},song) {
    commit(types.SET_FAVORITE_LIST,saveFavorite(song))
  },
  //删除我的喜欢
  deleteFavoriteList({commit},song) {
    commit(types.SET_FAVORITE_LIST,deleteFavorite(song))
  }
}

export default getters