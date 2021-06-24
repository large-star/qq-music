<template>
  <scroll class="suggest" 
    ref="suggest" 
    :datas="[result]" 
    listenPullUpLoad 
    @pullingUp="pullingUp" 
    :probeType="3" listenScrollStart
    @scrollStart="scrollStart">
    <ul class="suggest-list">
      <li class="suggest-item" @click="selectItem(item)" v-for="(item) in result" :key="item.id">
        <i class="icon-music"></i>
        <div class="name">{{getDisplayName(item)}}</div>
      </li>
    </ul>
    <loading  v-show="!isLoad" title=""/>
    <div class="no-result-wrapper" v-show="isNoRes && !result.length">
      <no-result />
    </div>
  </scroll>
</template>

<script>
import Scroll from '@/components/scroll/scroll'
import Loading from '@/components/loading/loading'
import noResult from '@/components/noResult/noResult'
import { search } from '@/api/search'
import { createSong } from '@/assets/js/song'
import { mapActions } from 'vuex'
export default {
  components: {
    Scroll,
    Loading,
    noResult
  }, 
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      limit: 20,
      offset: 1,
      result: [],
      isLoad: false,
      isNoRes: false
    }
  },
  methods: {
    ...mapActions([
      'insertSong'
    ]),
    //搜索
    async _search() {
      this.isLoad = false
      this.isNoRes = false
      const { query,limit,offset } = this
      if(!query) return
      let res = await search(query,limit * offset)
      if(!res || res.code !== 200 || res.result.songCount == 0) {
        this.isNoRes = true
        this.isLoad = true
        this.$refs.suggest.disable()
        return
      }
      // this.result.push(...this._normalizeSongs(res.result.songs))
      // console.log(res)
      this.result = this._normalizeSongs(res.result.songs)
      if(this.result.length < limit * offset) this.offset = 5
      this.isLoad = true
      this.$nextTick(() => {
        this.$refs.suggest.enable()
        this.$refs.suggest.finishPullUp()
      })
    },
    //为每个歌曲 创建一个实例
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        if(item.id && item.al.id) {
          ret.push(createSong(item))
        }
      })
      return ret
    },
    //过滤
    getDisplayName(item) {
      return `${item.name} - ${item.singer}`
    },
    //上拉加载
    pullingUp() {
      if(this.offset >= 5) return
      this.offset++
      this._search()
    },
    //点击歌曲
    selectItem(song) {
      // console.log(song)
      this.insertSong(song)
      this.$emit('select',song)
    },
    //开始滚动
    scrollStart(pos) {
      this.$emit('scrollStart',pos)
    },
    refresh() {
      this.$refs.suggest.refresh()
    }
  },
  watch: {
    query() {
      this.result = []
      this.offset = 1
      this._search()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/assets/less/_variable.less');
.suggest{
  overflow: hidden;
  height: 100%;
  .suggest-list{
    padding: 0 30px;
    .suggest-item{
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      overflow: hidden;
      i{
        font-size: @font-size-large;
        color: @color-text-d;
      }
      .name{
        margin-left: 10px;
        flex: 1;
        font-size: @font-size-small;
        color: @color-text-d;
        .ellipsis()
      }
    }
  }
}

.no-result-wrapper{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  width: 100%;
}
</style>