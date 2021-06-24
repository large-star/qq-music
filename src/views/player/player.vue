<template>
  <div class="player" v-show="playlist.length > 0">
    <transition name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave">
      <!-- 全屏 -->
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" width="100%" height="100%" alt="">
        </div>
        <div class="top">
          <div class="title">
            <i class="icon-back" @click="back"></i>
            <h1 class="name">{{currentSong.name}}</h1>
          </div>
          <div class="subtitle ellipsis">{{currentSong.singer}}</div>
        </div>
        <div class="middle">
          <swiper :options="swiperOptions">
            <swiper-slide>
              <div class="middle-l">
                <div class="cd-wrapper" ref="cdWrapper">
                  <div class="cd" :class="cdCls">
                    <img :src="currentSong.image" width="100%" height="100%" alt="">
                  </div>
                </div>
                <div class="playing-lyric-wrapper">
                  <div class="playing-lyric">{{playingLyric}}</div>
                </div>
              </div>
            </swiper-slide>
            <swiper-slide>
              <div class="middle-r">
                <scroll class="lyric-wrapper" ref="lyricList" :datas="currentLyric && currentLyric.lines" >
                  <div v-if="currentLyric">
                    <p class="text" ref="lyricLine" :class="{ active: currentLineNum === index }" v-for="(line,index) in currentLyric.lines" :key="index">
                      {{line.txt}}
                    </p>
                  </div>
                </scroll>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination" ref="pagination"></div>
          </swiper>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-warpper">
              <progress-bar :percent="percent" @onProgressBarChange="onProgressBarChange"/>
            </div>
            <span class="time-r">{{format(durationTime)}}</span>
          </div>
          <div class="operators">
            <span><i :class="iconMode" @click="changeMode"></i></span>
            <span :class="disableCls"><i class="icon-prev" @click="prev"></i></span>
            <span class="play-btn" :class="disableCls" @click="togglePlaying"><i :class="playIcon"></i></span>
            <span :class="disableCls"><i class="icon-next" @click="next"></i></span>
            <span><i class="icon" :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i></span>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <!-- 缩小 -->
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdCls" :src="currentSong.image" width="40" height="40" alt="">
        </div>
        <div class="text">
          <h2 class="name">{{currentSong.name}}</h2>
          <p class="desc">{{currentSong.singer}}</p>
        </div>
        <div class="control" :class="disableCls" @click.stop="togglePlaying">
          <i :class="playIcon"></i>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"/>
    <audio :src="songUrl" ref="audio"
      @canplay="audioCanplay"
      @error="audioError"
      @timeupdate="updateTime"
      @ended="audioEnd"
    ></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { getSongUrl, getLyric } from '@/api/player'
import animations from 'create-keyframe-animation'
import { prefixStyle, shuffle } from '@/assets/js/utils'
import { playMode } from '@/assets/js/config'
import Playlist from '@/components/playlist/playlist'

const transform = prefixStyle('transform')

import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

import ProgressBar from '@/components/progressBar/progressBar'
import Scroll from '@/components/scroll/scroll'

import xLyric from 'xieyezi-lyric'

import { playerMixin } from '@/assets/js/mixin'

export default {
  name: 'Player',
  mixins: [playerMixin],
  computed: {
    ...mapGetters([
      'fullScreen',
      'playing'
    ]),
    //播放与暂停 icon类
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    //旋转的类
    cdCls() {
      return this.playing ? 'play' : 'play pause'
    },
    //禁用按钮
    disableCls() {
      return this.isCanPlay ? '' : 'disable'
    },
    //播放比例
    percent() {
      return this.currentTime / this.durationTime
    },

  },
  components: {
    Swiper,
    SwiperSlide,
    ProgressBar,
    Scroll,
    Playlist
  },
  data() {
    return {
      // 轮播图配置
      swiperOptions: {
        pagination: {
          el: '.swiper-pagination',
        }
      },
      songUrl: '',
      isCanPlay: false,
      currentTime: 0,
      durationTime: 0,
      currentLyric: null,
      currentLineNum: 0,
      time: 0,
      audioErr: false,
      playingLyric: '山寨产品 伪劣歌词'
    }
  },
  methods: {
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
    }),
    ...mapActions([
      'savePlayHistory'
    ]),
    back() {
      this.setFullScreen(false)
    },
    //全屏
    open() {
      this.setFullScreen(true)
      this.$nextTick(() => {
        this.$refs.lyricList.refresh()
      })
    },
    async _getSongUrl(id) {
      // const { id } = this.currentSong
      let res = await getSongUrl(id)
      if(!res || res.code !== 200) return
      this.songUrl = res.data[0].url
    },
    async _getLyric(id) {
      let res = await getLyric(id)
      if(!res || res.code !== 200) return
      if(!res.lrc || !res.lrc.lyric) {
        this.playingLyric = '纯音乐'
        return
      }
      try{
        this.currentLyric = new xLyric(res.lrc.lyric,this.handleLyric)
        this.$nextTick(() => {
          this.$refs.lyricList.refresh()
        })
        if(this.isCanPlay) {
          this.currentLyric.play(this.currentTime * 1000)
        }
      }catch(err) {
        this.playingLyric = '歌词解析出错'
        return
      }
      
      
    },
    handleLyric({lineNum, txt}) {
      // console.log(lineNum,txt)
      this.currentLineNum = lineNum
      this.playingLyric = txt
      this.$nextTick(() => {
        if(lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        }else {
          this.$refs.lyricList.scrollTo(0,0,1000)
        }
      })
      
    },
    /* 动画钩子 */
    enter(el,done) {
      const { x, y, scale } = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.cdWrapper,'move',done)
    },
    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el,done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const { x, y, scale } = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend',done)
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },

    //获取参数
    _getPosAndScale() {
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 20
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {
        x,y,scale
      }
    },
    //音频可播放回调
    audioCanplay() {
      if(!this.isCanPlay) {
        // console.log('audioCanplay')
        this.savePlayHistory(this.currentSong)
        this.durationTime = this.$refs.audio.duration
        this.$refs.audio.play()
        this.isCanPlay = true
        if(!this.playing) {
          this.togglePlaying()
        }
      }
      if(this.currentLyric && this.time === 0) {
        this.currentLyric.play()
      }
      if(this.currentLyric && this.time > 0) {
        this.currentLyric.play(this.time * 1000)
      }
    },
    //播放状态切换
    togglePlaying() {
      if(!this.isCanPlay) return
      this.setPlayingState(!this.playing)
      if(this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    //上一首
    prev() {
      if(!this.isCanPlay) return
      if(this.playlist.length === 1) {
        this.loop()
        return
      }
      let index = this.currentIndex - 1
      if(index < 0) {
        index = this.playlist.length - 1
      }
      this.setCurrentIndex(index)
      this.isCanPlay = false
      if(!this.playing) this.togglePlaying()
    },
    //下一首
    next() {
      if(!this.isCanPlay) return
      if(this.playlist.length === 1) {
        this.loop()
        return
      }
      let index = this.currentIndex + 1
      if(index === this.playlist.length) index = 0
      this.setCurrentIndex(index)
      this.isCanPlay = false
      if(!this.playing) this.togglePlaying()
      
    },
    //单曲循环
    loop() {
      let audio = this.$refs.audio
      audio.currentTime = 0
      audio.play()
      this.time = 0
      if(this.currentLyric) {
        this.currentLineNum = 0
        this.currentLyric.play()
      }
    },
    //音频播放回调
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    //时间格式化
    format(interval) {
      interval = interval | 0
      const minute = this._pad(interval / 60 | 0)
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    _pad(num,n=2) {
      let len = num.toString().length
      while(len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    //进度条事件回调
    onProgressBarChange(percent) {
      let time = this.durationTime * percent
      this.$refs.audio.currentTime = time
      this.time = time
      if(!this.playing) this.togglePlaying()
      if(this.currentLyric) {
        this.currentLyric.play(time * 1000)
        this.currentLyric.stop()
      }
    },

    //音频播放结束
    audioEnd() {
      if(this.mode === playMode.loop) {
        this.loop()
      }else {
        this.next()
      }
    },
    //打开播放列表
    showPlaylist() {
      this.$refs.playlist.show()
    },
    audioError() {
      // console.log('err')
      if(this.isCanPlay) {
        this.isCanPlay = false
      }
      
      if(this.currentLyric) {
        this.currentLyric.stop()
      }
    }
  },
  watch: {
    currentSong(newSong,oldSong) {
      if(!newSong.id) {
        return
      }
      if(newSong.id === oldSong.id) {
        return
      }
      if(this.currentLyric) {
        this.currentLyric.stop()
        this.currentLyric = null
      }
      this.time = 0
      this.currentLineNum = 0
      this.isCanPlay = false
      this.songUrl = ''
      this.playingLyric = ''
      clearTimeout(this.timeOut)
      this.timeOut = setTimeout(() => {
        this._getSongUrl(newSong.id)
        this._getLyric(newSong.id)
      },1000)
      
      
    },
    playing(newState) {
      const audio = this.$refs.audio
      if(!this.isCanPlay) return
      this.$nextTick(() => {
        newState ? audio.play() : audio.pause()
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/assets/less/_variable.less');

.normal-enter-active, .normal-leave-active {
  transition: all 0.4s;
  .top,.bottom{
    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
  }
}
.normal-enter, .normal-leave-to {
  opacity: 0;
  .top {
    transform: translateY(-100px);
  }
  .bottom {
    transform: translateY(100px);
  }
}

.mini-enter-active, .mini-leave-active {
  transition: all 0.4s;
}
.mini-enter, .mini-leave-to {
  opacity: 0;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}


.normal-player{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 150;
  background: @color-background;
  .background{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: .6;
    -webkit-filter: blur(20px);
    filter: blur(20px);
  }
  .top{
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 20px;
    color: @color-text;
    overflow: hidden;
    .title{
      position: relative;
      text-align: center;
      line-height: 40px;
      font-size: @font-size-large;
      .name{
        width: 80%;
        margin: 0 auto;
        .ellipsis()
      }
      >i{
        position: absolute;
        left: 10px;
        top: 10px;
        font-size: @font-size-large-x;
        color: @color-theme;
        -webkit-transform: rotate(-90deg);
        transform: rotate(-90deg);
      }
    }
    .subtitle{
      margin: 0 20px;
      text-align: center;
      line-height: 20px;
      font-size: @font-size-medium;
    }
  }
  .middle{
    position: fixed;
    width: 100%;
    top: 80px;
    bottom: 120px;
    .middle-l{
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 80%;
      .cd-wrapper{
        position: absolute;
        width: 80%;
        left: 10%;
        top: 0;
        height: 100%;
        .cd{
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          border: 10px solid hsla(0,0%,100%,.1);
          border-radius: 50%;
          &.play{
            animation: rotate 20s linear infinite;
          }
          &.pause{
            animation-play-state: paused;
          }

          img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
      }
      .playing-lyric-wrapper{
        width: 80%;
        margin: 30px auto 0;
        overflow: hidden;
        text-align: center;
        .playing-lyric{
          line-height: 20px;
          height: 20px;
          color: @color-text-l;
          font-size: @font-size-medium;
        }
      }
    }
    .middle-r{
      box-sizing: border-box;
      padding: 0 20px 30px;
      width: 100%;
      height: 100%;
    }
  }
  .bottom{
    position: absolute;
    width: 100%;
    bottom: 40px;
    .dot-wrapper{
      text-align: center;
      font-size: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      .dot{
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: hsla(0,0%,100%,.5);
        &.active{
          width: 20px;
          border-radius: 5px;
          background: hsla(0,0%,100%,.8);
        }
      }
    }
    .operators{
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin: 0 16px;
      font-size: 26px;
      color: @color-theme;
      .icon-favorite{
        color: @color-sub-theme;
      }
      
      .disable{
        color: @color-theme-d;
      }
      .play-btn{
        font-size: 34px;
      }
    }
    .progress-wrapper{
      display: flex;
      margin: 10px 20px;
      align-items: center;
      .time-l,.time-r{
        width: 40px;
        text-align: center;
      }
      .progress-bar-warpper{
        flex: 1;
        margin: 0 5px;
      }
    }
  }
}

/deep/ .swiper-container{
  width: 100%;
  height: 100%;
  .swiper-pagination{
    .swiper-pagination-bullet{
      background: @color-text;
      transition: all .2s linear;
    }
    .swiper-pagination-bullet-active{
      background: @color-text-ll;
      width: 18px;
      border-radius: 6px;
    }
  }
}

.mini-player{
  position: fixed;
  bottom: 0;
  height: 60px;
  width: 100%;
  z-index: 160;
  display: flex;
  align-items: center;
  background: @color-highlight-background;
  .icon{
    width: 40px;
    padding: 0 10px 0 20px;
    img{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      &.play{
        animation: rotate 20s linear infinite;
      }
      &.pause{
        animation-play-state: paused;
      }
    }
  }
  .text{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    .name{
      margin-bottom: 6px;
      font-size: @font-size-medium;
      .ellipsis()
    }
    .desc{
      font-size: @font-size-small;
      color: @color-text-d;
      .ellipsis()
    }
  }
  .control{
    width: 30px;
    padding: 0 8px;
    &.disable{
      i{
        color: @color-theme-d;
      }
    }
    i{
      font-size: 28px;
      color: @color-theme;
    }
  }
}

.lyric-wrapper{
  .text{
    text-align: center;
    line-height: 30px;
    color: @color-text-l;
    font-size: @font-size-medium;
    &.active{
      color: @color-theme;
    }
  }
}
</style>