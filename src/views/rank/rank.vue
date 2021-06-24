<template>
  <div class="rank" ref="rank">
    <scroll class="scroll" ref="scroll" :datas="[official,recommend,global]">
      <div class="list-content">
        <div class="title">官方榜</div>
        <ul class="content" v-if="official.length">
          <li class="content-item" v-for="item in official" :key="item.id" @click="selectItem(item)">
            <div class="item-info">
              <h2 class="name">{{item.name}}</h2>
              <img v-lazy="item.coverImgUrl" alt="">
            </div>
            <div class="tag">{{item.updateFrequency}}</div>
            <div class="item-tracks">
              <div class="track" v-for="(track,i) in item.tracks" :key="i">
                <span>{{i+1}}. {{track.first}}</span>
                <span class="author"> - {{track.second}}</span>
              </div>
            </div>
          </li>
        </ul>
        <loading v-else/>
      </div>
      <list-wrapper :list="recommend" title="推荐榜" line="one" updateFrequency path="rank"/>
      <list-wrapper :list="global" title="全球榜" line="one" updateFrequency path="rank"/>
    </scroll>
    <transition name="slide">
      <router-view/>
    </transition>
  </div>
</template>

<script>
import { getToplist } from '@/api/rank'
import ListWrapper from '@/components/listWrapper/listWrapper'
import Loading from '@/components/loading/loading'
import Scroll from '@/components/scroll/scroll'
import { playlistMixin } from '@/assets/js/mixin'
import { mapMutations } from 'vuex'
export default {
  mixins: [playlistMixin],
  name: 'Rank',
  components: {
    ListWrapper,
    Scroll,
    Loading
  },
  data() {
    return {
      official: [],//官方
      recommend: [],//推荐
      global: [],//全球
    }
  },
  computed: {
    update() {
      const { official,recommend,global } = this
      return 
    }
  },
  methods: {
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    }),
    async _getToplist() {
      let res = await getToplist()
      if(!res || res.code !== 200) return
      this.official = res.list.slice(0,4)
      this.recommend = res.list.slice(4,10)
      this.global = res.list.slice(10)
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    //选中项
    selectItem(item) {
      let obj = {
        id: item.id,
        name: item.name,
        avatar: item.coverImgUrl || item.picUrl || ''
      }
      this.setTopList(obj)
      this.$router.push({
        path: `/rank/${obj.id}`
      })
    }
  },
  created() {
    this._getToplist()
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

.list-content{
  padding: 0 10px;
  .title{
    padding: 15px 0 10px;
    text-align: center;
    font-size: @font-size-medium;
    color: @color-theme;
    font-weight: 700;
  }

  .content-item{
    position: relative;
    display: flex;
    align-items: center;
    height: 120px;
    padding: 0 20px;
    background: @color-background-d;
    border-radius: 10px;
    margin-bottom: 10px;
    &:last-child{
      margin-bottom: 0;
    }
    .tag{
        position: absolute;
        right: 10px;
        top: 10px;
        color: @color-text-d;
        font-size: @font-size-small;
      }
    .item-info{
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 60px;
      height: 100%;
      .name{
        font-size: @font-size-large;
        text-align: center;
        margin-bottom: 10px;
        font-weight: 700;
      }
      img{
        width: 100%;
        height: 60px;
        border-radius: 10px;
      }
    }
    .item-tracks{
      flex: 1;
      margin-left: 40px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
      .track{
        margin: 8px 0;
        font-size: @font-size-small;
        .ellipsis();
        .author{
          color: @color-text-d;
        }
      }
    }
  }
}
</style>