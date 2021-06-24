<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" :datas="[hotList,recommendList,highqualityList]">
      <!-- 轮播图区域 -->
      <swiper class="m-swiper" ref="mySwiper" :options="swiperOptions">
        <swiper-slide v-for="(item,index) in banners" :key="index">
          <img :src="item.imageUrl" alt="" @load="imgLoad">
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <list-wrapper :list="hotList" title="热门歌单" playCount/>
      <list-wrapper :list="highqualityList" title="精品歌单" high playCount/>
      <div class="list-wrapper">
        <div class="title">推荐歌单</div>
        <main-loading :data="recommendList">
          <div class="list-container">
            <div class="item" v-for="item in recommendList" :key="item.id" @click="selectItem(item)">
              <div class="left"><img v-lazy="item.picUrl" alt=""></div>
              <div class="right">
                <p class="name">{{item.name}}/p>
                <p class="desc">播放量：{{item.playCount | setPlayCount}}</p>
              </div>
            </div>
          </div>
        </main-loading>
      </div>
      
    </scroll>
    <transition name="slide">
      <router-view/>
    </transition>
  </div>
</template>

<script>
import { getBanners, getHotList,getRecommendList,getHighqualityList } from '@/api/recommend'
import ImgCard from '@/components/imgCard/imgCard'
import Scroll from '@/components/scroll/scroll'
import MainLoading from '@/components/mainLoading/mainLoading'
import ListWrapper from '@/components/listWrapper/listWrapper'

import { setPlayCount,playlistMixin } from '@/assets/js/mixin'
import { mapMutations } from 'vuex'

import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
  name: 'Recommend',
  mixins: [setPlayCount,playlistMixin],
  data() {
    return {
      // 轮播图配置
      swiperOptions: {
        pagination: {
          el: '.swiper-pagination',
        },
        loop: true,
        autoplay: {
          disableOnInteraction: false,
        },
      },
      banners: [],
      hotList: [],
      recommendList: [],
      highqualityList: [],
      isImgLoad: false
    }
  },
  components: {
    Swiper,
    SwiperSlide,
    ImgCard,
    Scroll,
    MainLoading,
    ListWrapper
  },
  methods: {
    ...mapMutations({
      setDisc: 'SET_DISC'
    }),
    //获取轮播图
    async _getBanners () {
      let res = await getBanners()
      // console.log(res)
      if(!res || res.code !== 200) return
      this.banners = res.banners
    },
    //获取热门歌单
    async _getHotList () {
      let res = await getHotList()
      if(!res || res.code !== 200) return
      // console.log(res)
      this.hotList = res.playlists
    },
    //获取推荐歌单
    async _getRecommendList () {
      let res = await getRecommendList()
      if(!res || res.code !== 200) return
      // console.log(res)
      this.recommendList = res.result
    },
    //获取精品歌单
    async _getHighqualityList() {
      let res = await getHighqualityList()
      // console.log(res)
      if(!res || res.code !== 200) return
      this.highqualityList = res.playlists
    },
    //监听图片加载完成
    imgLoad() {
      if(this.isImgLoad) return
      this.isImgLoad = true
      this.$refs.scroll.refresh()
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectItem(item) {
      let disc = {
        id: item.id,
        name: item.name,
        avatar: item.coverImgUrl || item.picUrl || ''
      }
      this.setDisc(disc)
      this.$router.push({
        path: `/recommend/${disc.id}`
      })
    }
  },
  created() {
    this._getBanners()
    this._getHotList()
    this._getRecommendList()
    this._getHighqualityList()
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

.m-swiper{
  width: 100%;
  /deep/.swiper-pagination{
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
  
  img{
    width: 100%;
    box-sizing: border-box;
    padding: 0 10px;
    border-radius: 5%;
  }
}

.list-wrapper{
  padding: 0 10px;
  .title{
    padding: 15px 0 10px;
    text-align: center;
    font-size: @font-size-medium;
    color: @color-theme;
    font-weight: 700;
  }
  .img-col{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  &:last-child{
    padding-bottom: 20px;
  }
}

.list-container{
  .item{
    display: flex;
    align-items: center;
    height: 60px;
    margin: 10px 0;
    .left{
      height: 100%;
      width: 60px;
      margin-right: 20px;
      img{
        width: 100%;
        border-radius: 10%;
      }
    }
    .right{
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: @color-text-d;
      font-size: @font-size-small;
      overflow: hidden;
      p{
        width: 100%;
        overflow: hidden;
        .ellipsis()
      }
      p:first-child{
        color: @color-text;
        font-size: @font-size-medium;
        margin-bottom: 10px;
      }
    }
  }
}
</style>