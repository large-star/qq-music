<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" type="text"  class="box" v-model="query" :placeholder="placeholder"/>
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script>
import { debounce } from '@/assets/js/utils'
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: ''
    }
  },
  methods: {
    clear() {
      this.query = ''
    },
    //设置 query
    setQuery(query) {
      this.query = query
    },
    blur() {
      this.$refs.query.blur()
    }
  },
  created() {
    let delay = 200
    this.$watch('query',debounce((newQuery) => {
      this.$emit('onQueryChange',newQuery)
    },delay))
  }
}
</script>

<style lang="less" scoped>
@import url('~@/assets/less/_variable.less');
.search-box{
  display: flex;
  align-items: center;
  height: 40px;
  background: @color-highlight-background;
  border-radius: 6px;
  box-sizing: border-box;
  
  >i{
    width: 40px;
    font-size: @font-size-large-x;
    text-align: center;
    &:first-child{
      left: 10px;
      color: @color-dialog-background;
    }
    &:last-child{
      font-size: @font-size-large;
      right: 10px;
      color: @color-dialog-background;
    }
  }
  .box{
    flex: 1;
    background: @color-highlight-background;
    height: 26px;
    border: 0;
    font-size: @font-size-medium;
    color: @color-text;
  }
}
</style>