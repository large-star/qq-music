<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back" @click="$router.back()"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length" ref="playBtn">
          <i class="icon-play"></i>
          <span @click="random">随机播放全部</span>
        </div>
      </div>
      <div class="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll class="scroll" ref="scroll" 
      :datas="[songs]"
      :probeType="3"
      listenScroll
      @onScroll="onScroll"
      >
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem" :rank="rank"/>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading/>
      </div>
    </scroll>
  </div>
</template>

<script>
import SongList from '@/components/songList/songList'
import Scroll from '@/components/scroll/scroll'
import Loading from '@/components/loading/loading'
import { prefixStyle } from '@/assets/js/utils'

import { mapActions } from 'vuex'

import { playlistMixin } from '@/assets/js/mixin'

const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')

export default {
  mixins: [playlistMixin],
  props: {
    title: { type: String, default: '' },
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    bgImage: { type: String, default: '' },
    rank: { type: Boolean, default: false }
  },
  data() {
    return {
      scrollY: 0,
    }
  },
  components: {
   SongList,
   Scroll,
   Loading
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    }
  },
  mounted() {
    this.imgHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imgHeight + RESERVED_HEIGHT
    this.$refs.scroll.$el.style.top = `${this.imgHeight}px` 
  },
  methods: {
    onScroll(pos) {
      this.scrollY = pos.y
    },
    selectItem(song,index) {
      // console.log(song,index)
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ]),
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' :''
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    //随机播放按钮
    random() {
      this.randomPlay({
        list: this.songs
      })
    }
  },
  watch: {
    scrollY(newY) {
      let translageY = Math.max(this.minTranslateY,newY)
      this.$refs.layer.style[transform] = `translate(0,${translageY}px)`
      const bgImage = this.$refs.bgImage
      let zIndex = 0
      let scale = 1
      const percent = Math.abs(newY / this.imgHeight)
      if(newY > 0) {
        zIndex = 55
        scale = 1 + percent
      }

      if(newY < this.minTranslateY) {
        zIndex = 55
        bgImage.style.paddingTop = 0
        bgImage.style.height = `${RESERVED_HEIGHT}px`
        this.$refs.playBtn.style.display = 'none'
      }else {
        bgImage.style.paddingTop = '70%'
        bgImage.style.height = 0
        this.$refs.playBtn.style.display = ''
      }
      bgImage.style.zIndex = zIndex
      bgImage.style[transform] = `scale(${scale})`
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/assets/less/_variable.less');
.music-list{
  position: fixed;
  z-index: 10;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: @color-background;
  .back{
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 60;
    >i{
      font-size: @font-size-large-x;
      color: @color-theme;
      display: block;
      padding: 10px;
    }
  }
  .title{
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    text-align: center;
    font-size: @font-size-large;
    line-height: 40px;
    color: @color-text;
    z-index: 60;
    .ellipsis();
  }
  .bg-image{
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    -webkit-transform-origin: top;
    transform-origin: top;
    background-size: cover;
    z-index: 0;
    .play-wrapper{
      position: absolute;
      bottom: 20px;
      z-index: 20;
      width: 100%;
      .play{
        width: 120px;
        padding: 6px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid @color-theme;
        color: @color-theme;
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
  .bg-layer{
    position: relative;
    height: 100%;
    background: @color-background;
    z-index: 40;
  }
  .filter{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(7,17,27,.4)
  }
  .scroll{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: @color-background;
    overflow: inherit;
    height: auto;
    z-index: 50;
  }
}

.loading-container{
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}

.song-list-wrapper{
  padding: 20px 30px;
}
</style>