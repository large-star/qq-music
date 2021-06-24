<template>
  <div class="search-list">
    <transition-group name="list" tag="ul">
      <li class="search-item" v-for="(item) in searches" :key="item" @click="selectItem(item)">
        <span class="text">{{item}}</span>
        <i class="icon-delete" @click.stop="deleteOne(item)"></i>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select',item)
    },
    deleteOne(item) {
      this.$emit('delete',item)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/assets/less/_variable.less');
.search-list{
  margin: 0 10px;
  .search-item{
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: @color-text-l;
    font-size: @font-size-small;
    &.list-enter-active, &.list-leave-active{
      transition: all 0.1s linear;
    }
    &.list-enter, &.list-leave-to{
      height: 0;
      opacity: 0;
    }
  }
}
</style>