<template>
  <div class="img-card">
    <div class="img-box">
      <div class="shadow"></div>
      <img v-lazy="imgUrl" alt="">
      <i class="iconfont icon-king high" v-if="high"></i>
      <span class="tag" v-if="playCount">
        <i class="iconfont icon-bofang"></i>
        {{playCount | setPlayCount}}
      </span>
      <span class="update" v-if="updateFrequency">
        {{updateFrequency}}
      </span>
    </div>
    <div class="name" :class="{line: lines=='one', twoLines: lines=='two'}">{{name}}</div>
  </div>
</template>

<script>
export default {
  name: 'ImgCard',
  props: {
    imgUrl:{ type: String },
    name: { type: String },
    playCount: { type: Number },
    high: { type: Boolean },
    albumId: { type: Number },

    dishId: { type: Number },
    lines: { type: String, default: 'two' },
    artists: { type: Array },
    updateFrequency: { type: String }
  },
  filters: {
    setPlayCount(val) {
      if(!val) return;
      if(val > 100000000) {
        val = ((val / 100000000).toFixed(1)) + '亿';
      }else if(val > 10000) {
        val = Math.floor(val / 10000) + '万';
      }
      return val;
    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
@import url('~@/assets/less/_variable.less');
.img-card{
  width: 110px;
  height: 150px;
  margin-top: 10px;
  overflow: hidden;
  .img-box{
    position: relative;
    width: 110px;
    height: 110px;
    .shadow{
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      box-shadow: 0 15px 21px -9px @color-dialog-background inset;
      border-radius: 10px;
    }
    .high{
      position: absolute;
      left: 5px;
      top: 3px;
      font-size: @font-size-large;
      color: @color-theme;
    }
    .tag{
      position: absolute;
      right: 5px;
      top: 5px;
      color: @color-text;
      font-size: @font-size-small;
      font-weight: 700;
      .iconfont{
        font-size: @font-size-small;
        color: @color-text;
      }
    }
    .update{
      position: absolute;
      right: 5px;
      top: 5px;
      color: @color-text-l;
      font-weight: 700;
      padding: 4px 8px;
      background: @color-background-d;
      border-radius: 10px;
    }
    img{
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }
  }
  .name{
    padding: 5px 5px 0;
    color: @color-dialog-background;
    font-size: @font-size-small;
    line-height: 15px;
    overflow: hidden;
    &.line{
      .ellipsis();
    }
    &.twoLines{
      .twoLinesEllipsis();
    }
  }
}
</style>