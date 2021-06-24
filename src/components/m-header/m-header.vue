<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">山寨音乐</h1>
    <router-link to="/user" tag="div" class="mine">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
@import url('~@/assets/less/_variable');
.m-header{
  position: relative;
  height: 44px;
  text-align: center;
  color: @color-theme;
  font-size: 0;
  .icon{
    display: inline-block;
    vertical-align: top;
    margin-top: 6px;
    width: 30px;
    height: 32px;
    margin-right: 9px;
    background-size: 30px 32px;
    background-image: url("logo@2x.png");
  }
  .text{
    display: inline-block;
    vertical-align: top;
    line-height: 44px;
    font-size: @font-size-large;
  }
  .mine{
    position: absolute;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 10px;
    top: 0;
    right: 0;
    i{
      font-size: @font-size-large-x;
      color: @color-theme;
    }
  }
}
</style>