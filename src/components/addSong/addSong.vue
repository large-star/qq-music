<template>
<transition name="slide">
  <div class="add-song" v-show="showFlag" @click.stop>
    <div class="header">
      <div class="title">添加歌曲到队列</div>
      <div class="close" @click="hide">
        <i class="icon-close"></i>
      </div>
    </div>
    <div class="seach-box-wrapper">
      <search-box ref="searchBox" @onQueryChange="onQueryChange" placeholder="搜索歌曲"/>
    </div>
    <div class="shortcut" v-show="!query">
      <!-- 切换 -->
      <switches :switches="switches" :currentIndex="currentIndex" @switchItem="switchItem"/>
      <div class="list-wrapper">
        <scroll v-if="currentIndex === 0" :datas="[playHistory]">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"/>
          </div>
        </scroll>
        <scroll v-if="currentIndex === 1" :datas="[playHistory]">
          <div class="list-inner">
            <!-- 搜索列表组件 -->
            <search-list :searches="searchHistory" @delete="deleteSearchHistory" @select="addQuery"/>
          </div>
        </scroll>
      </div>
    </div>
    <!-- 搜索结果 -->
    <div class="search-result" v-show="query">
      <suggest :query="query" @select="saveSearch" @scrollStart="scrollStart"/>
    </div>
    <!-- 顶部提示 -->
    <top-tip ref="topTip">
      <div class="tip-title">
        <i class="icon-ok"></i>
        <span>1首歌曲已经添加到播放队列</span>
      </div>
    </top-tip>
  </div>
</transition>
</template>

<script>
import SearchBox from '@/components/searchBox/searchBox'
import Suggest from '@/views/suggest/suggest'
import Switches from '@/components/switches/switches'
import Scroll from '@/components/scroll/scroll'
import SongList from '@/components/songList/songList'
import SearchList from '@/components/searchList/searchList'
import TopTip from '@/components/topTip/topTip'
import { searchMixin } from '@/assets/js/mixin'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [searchMixin],
  data() {
    return {
      showFlag: false,
      currentIndex: 0,
      switches: [
        { name: '最近播放' },
        { name: '搜索历史' }
      ]
    }
  },
  components: {
    SearchBox,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList,
    TopTip
  },
  computed: {
    ...mapGetters([
      'playHistory'
    ])
  },
  methods: {
    ...mapActions([
      'insertSong'
    ]),
    show() {
      this.showFlag = true
    },
    hide() {
      this.showFlag = false
    },
    //切换index
    switchItem(index) {
      this.currentIndex = index
    },
    //选中当前歌曲
    selectSong(song,index) {
      if(index === 0) return
      this.insertSong(song)
      this.showTip()
    },
    //弹出顶部提示
    showTip() {
      this.$refs.topTip.show()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/assets/less/_variable.less');
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
} 
.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
.add-song{
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 200;
  background: #222;
  .header{
    position: relative;
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: @font-size-medium-x;
    color: @color-text;
    .close{
      position: absolute;
      right: 20px;
      top: 0;
      font-size: @font-size-large;
      color: @color-theme;
    }
  }
}
.seach-box-wrapper{
  padding: 0 20px;
}
.shortcut{
  .list-wrapper{
    position: absolute;
    top: 140px;
    bottom: 0;
    width: 100%;
    .list-inner{
      padding: 20px 30px;
    }
  }
}
.search-result{
  position: fixed;
  top: 100px;
  bottom: 0;
  width: 100%;
}

.tip-title{
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
  font-size: @font-size-medium;
  color: @color-text;
  i{
    color: @color-theme-d;
    margin-right: 5px;
  }
}
</style>