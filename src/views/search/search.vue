<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @onQueryChange="onQueryChange"/>
    </div>
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
      <scroll class="shortcut" ref="shortcut" :datas="[hotKey,searchHistory]">
        <!-- 热搜 -->
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul v-if="hotKey.length">
            <li class="item" v-for="(item,index) in hotKey" :key="index" @click="addQuery(item.first)">{{item.first}}</li>
          </ul>
          <loading v-else/>
        </div>
        <!-- 搜索历史 -->
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear">
              <i class="icon-clear" @click="clearAll"></i>
            </span>
          </h1>
          <!-- 搜索列表组件 -->
          <search-list :searches="searchHistory" @delete="deleteSearchHistory" @select="addQuery"/>
        </div>
      </scroll>
    </div>

    <!-- 搜索结果 -->
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest ref="suggest" :query="query" @select="saveSearch" @scrollStart="scrollStart"/>
    </div>

    <!-- 弹窗 -->
    <confirm ref="confirm" text="确定要清空所有搜索记录" confirmBtnText="清空" @confirm="clearSearchHistory"/>
  </div>
</template>

<script>
import SearchBox from '@/components/searchBox/searchBox'
import Suggest from '../suggest/suggest'
import SearchList from '@/components/searchList/searchList'
import Loading from '@/components/loading/loading'
import Scroll from '@/components/scroll/scroll'
import Confirm from '@/components/confirm/confirm'
import { getSearchHot } from '@/api/search'
import { mapActions } from 'vuex'

import { playlistMixin,searchMixin } from '@/assets/js/mixin'

export default {
  name: 'Search',
  mixins: [playlistMixin,searchMixin],
  components: {
    SearchBox,
    Suggest,
    Loading,
    SearchList,
    Scroll,
    Confirm
  },
  data() {
    return {
      hotKey: [],
    }
  },
  computed: {
  },
  methods: {
    ...mapActions([
      'clearSearchHistory'
    ]),
    async _getSearchHot() {
      let res = await getSearchHot()
      if(!res || res.code !== 200) return
      this.hotKey = res.result.hots
      // console.log(res)
    },

    //监听更新可滚动区域
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '70px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    clearAll() {
      this.$refs.confirm.show()
      // this.clearSearchHistory()
    }
  },
  created() {
    this._getSearchHot()
  }
}
</script>

<style lang="less" scoped>
@import url('~@/assets/less/_variable.less');
.search-box-wrapper{
  box-sizing: border-box;
  padding: 0 20px;
  margin: 10px 0;
}
.shortcut-wrapper{
  position: fixed;
  top: 157px;
  left: 0;
  right: 0;
  bottom: 0;
}
.shortcut{
  .hot-key{
    margin: 0 20px 20px;
    .title{
      margin-bottom: 20px;
      font-size: @font-size-medium;
      color: @color-text-l;
    }
    .item{
      display: inline-block;
      margin: 0 10px 10px;
      padding: 5px 10px;
      border-radius: 6px;
      background: @color-highlight-background;
      font-size: @font-size-small;
      color: @color-text-l;
    }
  }
  .search-history{
    margin: 0 20px;
    .title{
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: @font-size-medium;
      color: @color-text-l;
    }
  }
}
.search-result{
  position: fixed;
  top: 157px;
  right: 0;
  bottom: 0;
  left: 0;
  background: #222;
}
</style>