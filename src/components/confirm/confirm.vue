<template>
<transition>
  <div class="confirm" v-show="showFlag" @click.stop>
    <div class="confirm-wrapper">
      <div class="confirm-content">
        <p class="text">{{text}}</p>
        <div class="operate">
          <div class="operate-btn" @click="cancel">{{cancelBtnText}}</div>
          <div class="operate-btn" @click="confirm">{{confirmBtnText}}</div>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    cancelBtnText: {
      type: String,
      default: '取消'
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
    },
    hide() {
      this.showFlag = false
    },
    confirm() {
      this.showFlag = false
      this.$emit('confirm')
    },
    cancel() {
      this.showFlag = false
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="less" scoped>
@import url('~@/assets/less/_variable.less');

@keyframes mypopup
{
    0%{
      transform: scale(0.5);
    }
    50%{
      transform: scale(1.1);
    }
    100%{
      transform: scale(1);
    }
}

.confirm{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 900;
  background: @color-background-d;
  .confirm-wrapper{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    .confirm-content{
      width: 240px;
      border-radius: 13px;
      background: @color-highlight-background;
      animation: mypopup .4s;
      .text{
        padding: 19px 15px;
        line-height: 22px;
        text-align: center;
        font-size: @font-size-medium-x;
        color: @color-text-ll;
      }
      .operate{
        display: flex;
        align-items: center;
        text-align: center;
        border-top: 1px solid @color-background-d;
        font-size: @font-size-medium;
        color: @color-text-l;
        width: 100%;
        .operate-btn{
          flex: 1;
          line-height: 35px;
          &:first-child{
            border-right: 1px solid @color-background-d;
          }
        }
      }
    }
  }
}
</style>