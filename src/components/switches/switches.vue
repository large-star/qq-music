<template>
  <div class="switches">
    <div class="switch-item"
     v-for="(item,index) in switches" :key="index"
     :class="{active: currentIndex === index}"
     @click="switchItem(index)"
     >{{item.name}}</div>
  </div>
</template>

<script>
export default {
  props: {
    switches: {
      type: Array,
      default() {
        return []
      }
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    switchItem(index) {
      this.$emit('switchItem',index)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/assets/less/_variable.less');
.switches{
  margin: 12px auto;
  width: 240px;
  box-sizing: border-box;
  padding: 1px;
  display: flex;
  align-items: center;
  border: 1px solid @color-highlight-background;
  border-radius: 5px;
  font-size: @font-size-medium;
  color: @color-text-l;
  .switch-item{
    flex: 1;
    text-align: center;
    padding: 8px 0;
    border-radius: 4px;
    &.active{
      background: @color-highlight-background;
      color: @color-text;
    }
  }
}
</style>