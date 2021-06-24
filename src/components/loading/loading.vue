<template>
  <div class="loading">
    <img width="24" height="24" src="./loading.gif" alt="">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '玩命加载中···'
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/assets/less/_variable.less');
.loading{
  width: 100%;
  text-align: center;
  .desc{
    line-height: 20px;
    font-size: @font-size-small;
    color: @color-text-l;
  }
}
</style>