<template>
<transition name="list-fade">
  <div class="playlist" v-show="showFlag" @click.stop="hide">
    <div class="list-wrapper" @click.stop>
      <!-- 列表头 -->
      <div class="list-header">
        <i class="mode" :class="iconMode" @click="changeMode"></i>
        <span class="text">{{modeText}}</span>
        <i class="icon-clear clear" @click="clearAll"></i>
      </div>
      <!-- 列表内容 -->
      <scroll class="list-content" ref="scroll" :datas="[sequencelist]">
        <transition-group name="list" tag="div">
          <div class="item" ref="listItem" v-for="(item,index) in sequencelist" :key="item.id" @click="selectItem(item,index)">
            <i class="current" :class="getCurrentIcon(item)"></i>
            <span class="text ellipsis">{{item.name}}</span>
            <span class="like" @click.stop="toggleFavorite(item)"><i :class="getFavoriteIcon(item)"></i></span>
            <span class="delete"><i class="icon-delete" @click.stop="deleteOne(item)"></i></span>
          </div>
        </transition-group>
      </scroll>
      <!-- 底部添加按钮 -->
      <div class="list-operate">
        <div class="add-btn" @click="addSongBtn">
          <i class="icon-add"></i>
          <span>添加歌曲队列</span>
        </div>
      </div>
      <!-- 底部关闭按钮 -->
      <div class="list-close" @click="hide">关闭</div>
    </div>
    <!-- 弹窗提示 -->
    <confirm ref="confirm" text="是否清空播放列表" confirmBtnText="清空" @confirm="confirmClear"/>
    <!-- 添加歌曲 -->
    <add-song ref="addSong"/>
  </div>
</transition>
</template>

<script>
import Scroll from '@/components/scroll/scroll'
import Confirm from '@/components/confirm/confirm'
import AddSong from '@/components/addSong/addSong'
import { playMode } from '../../assets/js/config'
import { mapGetters, mapMutations, mapActions } from 'vuex'

import { playerMixin } from '@/assets/js/mixin'

export default {
  mixins: [playerMixin],
  data() {
    return {
      list: [],
      showFlag: false
    }
  },
  computed: {
    modeText() {
      return this.mode === playMode.random? '随机播放': this.mode === playMode.sequence? '顺序播放':'循环循环'
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  },
  methods: {
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE',
    }),
    ...mapActions([
      'deleteSong',
      'deleteSongList'
    ]),
    show() {
      this.showFlag = true
      this.$nextTick(() => {
        this.$refs.scroll.refresh()
        this.scrollToCurrent(this.currentSong)
      })
    },
    hide() {
      this.showFlag = false
    },
    //判断是否是当前正在播放的歌曲
    getCurrentIcon(item) {
      if(item.id === this.currentSong.id){
        return 'icon-play'
      }else {
        return ''
      }
    },
    //选中当前歌曲
    selectItem(item,index) {
      if(this.mode === playMode.random) {
        index = this.playlist.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    //滚动到当前播放的歌曲位置
    scrollToCurrent(current) {
      let index = this.sequencelist.findIndex((song) => {
        return current.id === song.id
      })
      this.$nextTick(() => {
        this.$refs.scroll.scrollToElement(this.$refs.listItem[index],300)
      })
      
    },
    //删除列表内的歌曲
    deleteOne(song) {
      this.deleteSong(song)
      if(!this.playlist.length) {
        this.hide()
      }
    },
    //清空播放列表
    clearAll() {
      this.$refs.confirm.show()
    },
    //点击确认清空
    confirmClear() {
      this.deleteSongList()
      this.hide()
    },
    addSongBtn() {
      this.$refs.addSong.show()
    }
  },
  watch: {
    currentSong(newSong,oldSong) {
      if(newSong.id === oldSong.id || !this.showFlag) {
        return
      }
      this.scrollToCurrent(newSong)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/assets/less/_variable.less');

.list-fade-enter-active, .list-fade-leave-active {
  transition: all 0.4s;
  .list-wrapper{
    transition: all 0.4s;
  }
}
.list-fade-enter, .list-fade-leave-to {
  opacity: 0;
  .list-wrapper{
    transform: translateY(100%);
  }
}



.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: @color-background-d;
  .list-wrapper{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: @color-highlight-background;
    .list-header{
      display: flex;
      align-items: center;
      padding: 20px 20px 10px;
      font-size: @font-size-medium;
      color: @color-text-ll;
      .mode{
        font-size: @font-size-large-x;
        color: @color-theme-d;
      }
      .clear{
        color: @color-text-l;
      }
      .text{
        flex: 1;
        margin-left: 10px;
      }
    }
    .list-content{
      max-height: 240px;
      overflow: hidden;
      .item{
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 28px;
        font-size: @font-size-medium;
        color: @color-text-l;
        overflow: hidden;
        &.list-enter-active, &.list-leave-active{
          transition: all 0.1s linear;
        }
        &.list-enter, &.list-leave-to{
          height: 0;
          opacity: 0;
        }
        .text{
          flex: 1;
        }
        i{
          color: @color-theme;
          &.icon-favorite{
            color: @color-sub-theme;
          }
        }
        .current{
          width: 20px;
          color: @color-theme-d;
        }
        .like{
          margin-right: 10px;
        }
      }
    }
    .list-operate{
      margin: 20px auto;
      .add-btn{
        display: flex;
        width: 100px;
        text-align: center;
        margin: 0 auto;
        padding: 8px 12px;
        border: 1px solid @color-text-ll;
        border-radius: 20px;
        justify-content: center;
        i{
          margin-right: 10px;
        }
      } 
    }
    .list-close{
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: @color-text-l;
      font-size: @font-size-medium;
      background: @color-background;
    }
  }
}
</style>