<template>
<transition name="slide">
  <div class="user-center">
    <div class="top back">
      <i class="icon-back" @click="$router.back()"></i>
    </div>
    <div class="top set">
      <i class="icon-set"></i>
    </div>
    <div class="switches-wrapper">
      <switches :switches="switches" :currentIndex="currentIndex" @switchItem="switchItem"/>
    </div>
    <div class="play-wrapper">
      <div class="play" @click="random">
        <i class="icon-play"></i>
        <span>随机播放全部</span>
      </div>
    </div>
    <div class="list-wrapper" ref="listWrapper">
      <scroll ref="favoriteListWrapper" v-if="currentIndex === 0" :datas="favoriteList">
        <div class="list-inner">
          <song-list :songs="favoriteList" @select="selectSong"/>
        </div>
      </scroll>
      <scroll ref="playHistoryWrapper" v-if="currentIndex === 1" :datas="playHistory">
        <div class="list-inner">
          <song-list :songs="playHistory" @select="selectSong"/>
        </div>
      </scroll>
    </div>
    <div class="no-result-wrapper" v-show="showNoResult">
      <no-result :title="noResultDesc"/>
    </div>
  </div>
</transition>
</template>

<script>
import Switches from '@/components/switches/switches'
import Scroll from '@/components/scroll/scroll'
import SongList from '@/components/songList/songList'
import NoResult from '@/components/noResult/noResult'
import { mapGetters, mapActions } from 'vuex'
import { playlistMixin } from '@/assets/js/mixin'
export default {
  mixins: [playlistMixin],
  data() {
    return {
      currentIndex: 0,
      switches: [
        { name: '我喜欢的' },
        { name: '最近播放' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'favoriteList',
      'playHistory'
    ]),
    //无列表时显示提示
    showNoResult() {
      if(this.currentIndex === 0) {
        return !this.favoriteList.length
      }else {
        return !this.playHistory.length
      }
    },
    //无列表时显示文本
    noResultDesc() {
      if(this.currentIndex === 0) {
        return '暂无收藏歌曲'
      }else {
        return '你还没听过歌曲哦'
      }
    }
  },
  components: {
    Switches,
    Scroll,
    SongList,
    NoResult
  },
  methods: {
    ...mapActions([
      'insertSong',
      'randomPlay'
    ]),
    switchItem(index) {
      this.currentIndex = index
    },
    selectSong(song) {
      this.insertSong(song)
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.listWrapper.style.bottom = bottom
      this.$refs.favoriteListWrapper && this.$refs.favoriteListWrapper.refresh()
      this.$refs.playHistoryWrapper && this.$refs.playHistoryWrapper.refresh()
    },
    //随机播放
    random() {
      let list = this.currentIndex == 0 ? this.favoriteList : this.playHistory
      if(list.length === 0) return
      this.randomPlay({ list })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/assets/less/_variable');
.slide-enter-active, .slide-leave-active{
  transition: all 0.3s;
}
.slide-enter, .slide-leave-to{
  transform: translateX(100%);
} 
.user-center{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: @color-background;
  z-index: 100;
  .top{
    position: absolute;
    top: 10px;
    &.back{
      left: 0;
    }
    &.set{
      right: 0;
    }
    i{
      padding: 10px;
      font-size: @font-size-large-x;
      color: @color-theme;
    }
  }
  .switches-wrapper{
    margin: 10px 0 20px;
  }
  .play-wrapper{
    .play{
      width: 120px;
      padding: 6px 0;
      margin: 0 auto;
      text-align: center;
      border: 1px solid @color-text-ll;
      color: @color-text-ll;
      border-radius: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: @font-size-small-s;
      >i{
        font-size: @font-size-medium-x;
        margin-right: 6px;
      }
    }
  }
}

.list-wrapper{
  position: absolute;
  top: 110px;
  bottom: 0;
  width: 100%;
  .list-inner{
    padding: 20px 30px;
  }
}

.no-result-wrapper{
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50);
}
</style>