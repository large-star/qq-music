
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from '@/assets/js/config'
import { shuffle } from '@/assets/js/utils'

//过滤播放量
export const setPlayCount = {
  filters: {
    setPlayCount(val) {
      if(!val) return;
      if(val > 100000000) {
        val = ((val / 100000000).toFixed(1)) + '亿';
      }else if(val > 10000) {
        val = (val/10000).toFixed(1) + '万';
      }
      return val;
    }
  }
}

//监听是否有播放器
export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist(playlist) {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

//混入播放模式
export const playerMixin = {
  computed: {
    ...mapGetters([
      'mode',
      'sequencelist',
      'currentSong',
      'currentIndex',
      'playlist',
      'favoriteList'
    ]),
    //播放模式
    iconMode() {
      const { mode } = this
      return mode === playMode.sequence ? 'icon-sequence' : mode === playMode.loop ? 'icon-loop' : 'icon-random'
    }
  },
  methods: {
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ]),
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST'
    }),
    //切换播放模式
    changeMode() {
      let mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = []
      if(mode === playMode.random) {
        list = shuffle(this.sequencelist)
      }else {
        list = this.sequencelist
      }
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    //找到列表中的index
    resetCurrentIndex(list) {
      const curId = this.currentSong.id
      let index = list.findIndex(item => {
        return item.id === curId
      })
      this.setCurrentIndex(index)
    },
    //判断当前歌曲是否已经是在我的喜欢中
    isFavorite(song) {
      const index = this.favoriteList.findIndex(item => {
        return item.id === song.id
      })
      return index > -1
    },
    //根据 isFavorite 设置icon
    getFavoriteIcon(song) {
      if(this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    //保存或者移出对该歌曲的喜欢
    toggleFavorite(song) {
      //如果有则移出，无则保存
      if(this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      }else {
        this.saveFavoriteList(song)
      }
    }
  }
}

//混入搜索
export const searchMixin = {
  data() {
    return {
      query: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ]),
    //点击历史项
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    //query发送改变回调
    onQueryChange(query) {
      this.query = query
    },
    //开始滚动使input失去焦点
    scrollStart() {
      this.$refs.searchBox.blur()
    },
    //保存搜索结果
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
  }
}
