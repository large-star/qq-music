<template>
  <div class="singer" ref="singer">
    <list-view ref="list" :list="singerList" @selectItem="selectSinger"/>
    <div class="loading-container" v-if="!singerList.length">
      <loading />
    </div>
    
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { getSingerList } from '@/api/singer'
import {pinyin} from '@/assets/js/Convert_Pinyin'
import Scroll from '@/components/scroll/scroll'
import Loading from '@/components/loading/loading'
import ListView from '@/components/listView/listView'

import { playlistMixin } from '@/assets/js/mixin'

import { mapMutations } from 'vuex'
export default {
  mixins: [playlistMixin],
  name: 'Singer',
  components: {
    Scroll,
    Loading,
    ListView
  },
  data() {
    return {
      query: {
        limit: 60,
        offset: 0,
        type: -1,
        area: -1
      },
      singerList: []
    }
  },
  methods: {
    async _getSingerList() {
      let res = await getSingerList(this.query)
      if(!res || res.code !== 200) return
      let list = this.setFindex(res.artists)
      this.singerList = this._normalizeSinger(list)
      // console.log(this.singerList)
    },
    //添加Findx字段
    setFindex(list) {
      return list.map(item => {
        let first = item.name[0]
        if([0,1,2,3,4,5,6,7,8,9].findIndex(item => item == first) != -1){
          item.Findex = String.fromCharCode(first*1+65).toUpperCase()
        }else{
          item.Findex = pinyin.getCamelChars(first).toUpperCase()
        }
        return item
      })
    },
    //处理歌手列表，得出滚动列表项
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: '热门',
          items: []
        }
      }

      
      // for (var i = 0; i < 26; i++) {
      //   // String.fromCharCode((65 + i))
      //   let letter = String.fromCharCode((65 + i))
      //   map[letter] = {
      //     title: letter,
      //     items: []
      //   }
      // }

      list.forEach((item,index) => {
        if(index <5) {
          map.hot.items.push({
            id: item.id,
            name: item.name,
            avatar: item.img1v1Url
          })
        }

        const key = item.Findex
        if(!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push({
          id: item.id,
          name: item.name,
          avatar: item.img1v1Url
        })
      })

      //为了得到有序列表，需要处理 map
      let hot = []
      let ret = []
      for(let key in map) {
        let val = map[key]
        if(val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        }else if(val.title == '热门') {
          hot.push(val)
        }
      }

      ret.sort((a,b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })

      return hot.concat(ret)
    },
    //选中当前歌曲
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    }
  },
  created() {
    this._getSingerList()
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

.cate-lable{
  display: flex;
  height: 30px;
  line-height: 30px;
  align-items: center;
  padding: 0 10px;
  .lable-item{
    font-size: @font-size-small;
    color: @color-text-ll;
    margin: 0 10px;
    &.active{
      color: @color-theme-d;
    }
  }
}

.back-top{
  position: fixed;
  width: 30px;
  height: 30px;
  right: 30px;
  bottom: 80px;
  text-align: center;
  background: @color-text-l;
  border-radius: 50%;
  
  i{
    font-size: @font-size-large-x;
    line-height: 30px;
    color: @color-highlight-background;
  }
}

.loading-container{
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>