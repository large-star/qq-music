<template>
  <div class="song-list">
    <ul>
      <li class="song-item" v-for="(item,index) in songs" :key="item.id" @click="selectItem(item,index)">
        <div class="item-rank">
          <span :class="getRankCls(index)">{{getRankIndex(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{item.name}}</h2>
          <p class="desc">{{getDesc(item)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    rank: { type: Boolean, default: false }
  },
  methods: {
    getDesc(song) {
      return `${song.singer}·${song.album}`
    },
    selectItem(song,index) {
      this.$emit('select',song,index)
    },
    getRankIndex(index) {
      if(index >2 || !this.rank) {
        return index + 1
      }
      return ''
    },
    getRankCls(index) {
      if(index <= 2 && this.rank) {
        return `icon-rank-${index}`
      }else
        return ''
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/assets/less/_variable.less');
.song-list{
  .song-item{
    display: flex;
    height: 60px;
    align-items: flex-start;
    font-size: @font-size-small;
    .item-rank{
      height: 100%;
      width: 40px;
      color: @color-theme;
      font-size: @font-size-large;
      >span{
        display: inline-block;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding-left: 5px;
        &.icon-rank-0{
          background: url('~@/assets/image/rank/first@2x.png') no-repeat;
          background-size: 60% auto;
        }
        &.icon-rank-1{
          background: url('~@/assets/image/rank/second@2x.png') no-repeat;
          background-size: 60% auto;
        }
        &.icon-rank-2{
          background: url('~@/assets/image/rank/third@2x.png') no-repeat;
          background-size: 60% auto;
        }
      }
    }
    .content{
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .name{
        margin-bottom: 10px;
        .ellipsis()
      }
      .desc{
        color: @color-text-d;
        .ellipsis()
      }
    }
  }
}
</style>