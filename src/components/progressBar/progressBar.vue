<template>
  <div class="progress-bar">
    <div class="bar-inner" ref="progressWrapper" @click="progressWrapperClick">
      <div class="progress" ref="progress">
        <div class="progress-btn"
          @touchstart.prevent="progressTouchStart"
          @touchmove.prevent="progressTouchMovw"
          @touchend.prevent="progressTouchEnd"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    percent(newVal) {
      if(newVal >=0 && !this.touch.initiated) {
        this._setProgressWidth(newVal * 100)
      }
    }
  },
  created() {
    this.touch = {
      initiated: false
    }
  },
  methods: {
    _setProgressWidth(width) {
      this.$refs.progress.style.width = width.toFixed(2) + '%'
    },
    progressTouchStart(e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.currentWidth = this.$refs.progress.clientWidth
      this.touch.barWidth = this.$refs.progressWrapper.clientWidth
    },
    progressTouchMovw(e) {
      if(!this.touch.initiated) return
      const deltaX = e.touches[0].pageX - this.touch.startX
      const width = Math.min(this.touch.barWidth,Math.max(0,deltaX + this.touch.currentWidth))
      this._setProgressWidth(width / this.touch.barWidth * 100)
    },
    progressTouchEnd(e) {
      this._triggerPercent()
      this.touch.initiated = false
    },
    _triggerPercent() {
      const barWidth = this.$refs.progressWrapper.clientWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('onProgressBarChange',percent)
    },
    progressWrapperClick(e) {
      const barWidth = this.$refs.progressWrapper.clientWidth
      const width = e.offsetX / barWidth * 100
      this._setProgressWidth(width)
      this._triggerPercent()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/assets/less/_variable.less');
.progress-bar{
  height: 20px;
  .bar-inner{
    position: relative;
    height: 4px;
    top: 8px;
    background: @color-background-d;
    .progress{
      position: absolute;
      height: 100%;
      width: 0;
      background: @color-theme;
      .progress-btn{
        position: absolute;
        width: 16px;
        height: 16px;
        top: -7px;
        right: -7px;
        box-sizing: border-box;
        background: @color-theme;
        border: 3px solid @color-text;
        border-radius: 50%;
      }
    }
  }
}
</style>