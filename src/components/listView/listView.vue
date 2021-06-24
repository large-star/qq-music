<template>
  <div class="list-view">
    <h2 class="header-title" v-show="isShowTips">
      {{shortcurList[currentIndex] == '热'?'热门':shortcurList[currentIndex]}}
    </h2>
    <scroll class="scroll" ref="scroll" 
      :datas="[list]" 
      :probeType="2" 
      @scrollEnd="scrollEnd" 
      @scrollStart="scrollStart"
      listenScrollStart
      listenScrollEnd>
      <div class="container">
        <div class="list-group" v-for="group in list" :key="group.title" ref="listGroup">
          <h2 class="list-group-title" ref="groupTitle">{{group.title}}</h2>
          <ul>
            <li class="list-group-item" v-for="singer in group.items" :key="singer.id" @click="selectItem(singer)">
              <img v-lazy="singer.avatar" alt="">
              <span>{{singer.name}}</span>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <div class="list-shortcut" 
      @touchstart.prevent="onShortcutTouchStart"
      @touchmove.prevent="onShortcutTouchMove">
      <ul>
        <li class="item" 
          v-for="(item,index) in shortcurList" :key="index" 
          :data-index="index"
          :class="{ current: currentIndex == index }"
        >{{item}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import Scroll from '@/components/scroll/scroll'
import { getData } from '@/assets/js/utils'

const ANCHOR_HEIGHT = 19.6
export default {
  created() {
    this.touch = {}
  },
  props: {
    list: Array,
    default() {
      return []
    }
  },
  data() {
    return {
      titlesOffsetTop: [],
      currentIndex: 0,
      isShowTips: false
    }
  },
  components: {
    Scroll
  },
  computed: {
    shortcurList() {
      return this.list.map(item => {
        return item.title.substr(0,1)
      })
    }
  },
  methods: {
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.srcElement,'index')
      if(!anchorIndex) return
      let firstTouch = e.touches[0]
      this.touch.length = this.$refs.listGroup.length-1
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
      
    },
    onShortcutTouchMove(e) {
      if(!this.touch.anchorIndex) return
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = ( this.touch.y2 - this.touch.y1 ) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      if(anchorIndex < 0) anchorIndex = 0
      if(anchorIndex > this.touch.length) anchorIndex = this.touch.length
      this._scrollTo(anchorIndex)
    },
    _scrollTo(index) {
      this.$refs.scroll.scrollToElement(this.$refs.listGroup[index],0)
      this.currentIndex = index
    },
    scrollEnd(pos) {
      let y = -pos.y
      let {titlesOffsetTop,currentIndex} =  this
      let length = titlesOffsetTop.length
      for(let i = 0 ;i < length; i++) {
        if( i === currentIndex ) continue
        if(y >= titlesOffsetTop[i] && y <= titlesOffsetTop[i+1]) {
           this.currentIndex = i
           break
        }
      }
      if(pos.y >= 0){
        return this.isShowTips = false
      }
      this.isShowTips = true
    },
    scrollStart(pos) {
      this.isShowTips = false
    },
    _initOffsetTop() {
      let tops = []
      let titles = document.querySelectorAll('.list-group-title')
      titles.forEach(el => {
        tops.push(el.offsetTop)
      })
      tops.push(Number.MAX_VALUE)
      this.titlesOffsetTop = tops
    },
    selectItem(item) {
      this.$emit('selectItem',item)
    },
    refresh() {
      this.$refs.scroll.refresh()
    }
  },
  mounted() {
    // this._initOffsetTop()
  },
  watch: {
    list() {
      this.$nextTick(() => {
        this._initOffsetTop()
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/assets/less/_variable.less');
.list-view{
  height: 100%;
  position: relative;
  overflow: hidden;
  .header-title{
    position: absolute;
    width: 100%;
    left: 0;
    top: -1px;
    font-size: @font-size-small;
    color: @color-text-l;
    background: @color-highlight-background;
    padding-left: 20px;
    height: 26px;
    line-height: 26px;
    z-index: 1;
  }
}
.container{
  position: relative;
}
.list-group{
  padding-bottom: 20px;
  .list-group-title{
    font-size: @font-size-small;
    color: @color-text-l;
    background: @color-highlight-background;
    padding-left: 20px;
    height: 26px;
    line-height: 26px;
  }
  .list-group-item{
    height: 50px;
    display: flex;
    align-items: center;
    font-size: @font-size-small;
    color: @color-text-l;
    padding: 20px 0 0 30px;
    img{
      height: 50px;
      width: 50px;
      border-radius: 50px;
      margin-right: 20px;
    }
  }
}
.list-shortcut{
  position: absolute;
  width: 18px;
  padding: 16px 0;
  border-radius: 10px;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: @color-background-d;
  text-align: center;
  font-size: @font-size-small-s;
  color: @color-text-l;
  .item{
    width: 100%;
    height: 18px;
    line-height: 18px;
    &.current{
      color: @color-theme;
    }
  }
}
</style>