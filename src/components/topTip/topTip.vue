<template>
<transition name="drop">
  <div class="top-tip" v-show="showFlag" @click.stop="hide">
    <slot></slot>
  </div>
</transition>
</template>

<script>
export default {
  props: {
    delay: {
      type: Number,
      default: 1000
    }
  },
  data() {
    return {
      showFlag: false
    }
  },
  methods: {
    show() {
      this.showFlag = true
      clearTimeout(this.time)
      this.time = setTimeout(() => {
        this.hide()
      },this.delay)
    },
    hide() {
      this.showFlag = false
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/assets/less/_variable.less');
.top-tip{
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 500;
  background: @color-dialog-background;
  &.drop-enter-active, &.drop-leave-active{
    transition: all 0.3s;
  }
  &.drop-enter, &.drop-leave-to{
    transform: translateY(-100%);
  }
}
</style>