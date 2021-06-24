<template>
  <div class="wrapper" ref="wrapper">
    <div class="content" :style="{width:scrollWidth}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BetterScroll from 'better-scroll';
export default {
  name: 'Scroll',
  props: {
    datas: { 
      type: Array,
      default() {
        return null
      }
    },
    click: { type: Boolean, default: true},
    probeType: { type: Number, default: 0 },
    useTransition: { type: Boolean, default: true },
    stopPropagation: { type: Boolean, default: false },
    scrollX: { type: Boolean, default: false },
    scrollWidth: { type: String, default: '100%' },
    listenScroll: { type: Boolean, default: false },
    listenScrollEnd: { type: Boolean, default: false },
    listenScrollStart: { type: Boolean, default: false },
    listenPullUpLoad: { type: Boolean, default: false }
  },
  data() {
    return {
      scroll: null
    }
  },
  mounted() {
    this.scroll = new BetterScroll(this.$refs.wrapper,{
      click: this.click,
      probeType: this.probeType,
      useTransition: this.useTransition,
      stopPropagation: this.stopPropagation,
      pullUpLoad: this.listenPullUpLoad,
      scrollX: this.scrollX,
    });

    if(this.probeType === 2 || this.probeType === 3){
      const { listenScroll,listenScrollEnd,listenScrollStart } = this
      if(listenScroll) {
        this.scroll.on('scroll', (pos) => {
          this.$emit('onScroll',pos);
        })
      }
      
      if(listenScrollEnd) {
        this.scroll.on('scrollEnd',(pos) => {
          this.$emit('scrollEnd',pos)
        })
      }

      if(listenScrollStart) {
        this.scroll.on('scrollStart', (pos) => {
          this.$emit('scrollStart',pos)
        })
      }
    }

    //上拉加载
    if(this.listenPullUpLoad) {
      this.scroll.on('pullingUp', () => {
        this.$emit('pullingUp')
      })
    }
    
  },
  methods: {
    refresh() {
      // console.log(123)
      this.scroll && this.scroll.refresh()
    },
    scrollTo(x=0,y=0,time=1000){
      this.scroll && this.scroll.scrollTo(x,y,time)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments)
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp()
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    enable() {
      this.scroll && this.scroll.enable()
    }
  },
  watch: {
    datas() {
      this.$nextTick(() => {
        this.refresh();
      })
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>