<template>
  <div class="list-wrapper">
    <div class="title" v-if="title">{{title}}</div>
    <main-loading :data="list">
      <div class="img-col">
        <img-card v-for="song in list" 
          :key="song.id" 
          :name="song.name"
          :imgUrl="song.coverImgUrl"
          :updateFrequency="updateFrequency ? song.updateFrequency : ''"
          :playCount="playCount ? song.playCount : 0"
          :high="high"
          :lines="lines"
          @click.native="selectItem(song)"
        />
      </div>
    </main-loading>
  </div>
</template>

<script>
import MainLoading from '@/components/mainLoading/mainLoading'
import ImgCard from '@/components/imgCard/imgCard'

import { setPlayCount,playlistMixin } from '@/assets/js/mixin'
import { mapMutations } from 'vuex'
export default {
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    title: { type: String },
    high: { type: Boolean, default: false },
    lines: { type: String, default: 'two' },
    updateFrequency: { type: Boolean, default: false},
    playCount: { type: Boolean },
    path: { type: String, default: 'recommend' }
  },
  components: {
    ImgCard,
    MainLoading
  },
  methods: {
    ...mapMutations({
      setDisc: 'SET_DISC',
      setTopList: 'SET_TOP_LIST'
    }),
    //选中当前项
    selectItem(item) {
      let obj = {
        id: item.id,
        name: item.name,
        avatar: item.coverImgUrl || item.picUrl || ''
      }
      if(this.path == 'recommend') {
        this.setDisc(obj)
      }else {
        this.setTopList(obj)
      }
      
      this.$router.push({
        path: `/${this.path}/${obj.id}`
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/assets/less/_variable.less');
.list-wrapper{
  padding: 0 10px;
  .title{
    padding: 15px 0 10px;
    text-align: center;
    font-size: @font-size-medium;
    color: @color-theme;
    font-weight: 700;
  }
  .img-col{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  &:last-child{
    padding-bottom: 20px;
  }
}
</style>