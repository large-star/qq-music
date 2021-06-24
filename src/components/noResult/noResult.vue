<template>
  <div class="no-result">
    <p class="title">{{title}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '暂无搜索结果'
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/assets/less/_variable.less');
.no-result{
  font-size: @font-size-medium-x;
  color: @color-theme;
  text-align: center;
  font-weight: 700;
}
</style>