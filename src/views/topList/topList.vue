<template>
  <div class="top-list">
    <music-list :songs="songs" :title="title" :bgImage="bgImage" :rank="true"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MusicList from '@/components/musicList/musicList'
import { getDetail } from '@/api/api'
import { createSong } from '@/assets/js/song'
export default {
  components: {
    MusicList
  },
  data() {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'topList'
    ]),
    title() {
      return this.topList.name
    },
    bgImage() {
      return (this.songs.length && this.songs[0].image) || this.topList.avatar
    }
  },
  methods: {
    async _getDetail() {
      const {topList} = this
      if(!topList.id) {
        return this.$router.replace('/rank')
      }
      // console.log(topList)
      let res = await getDetail(topList.id)
      if(!res || res.code !== 200) return
      this.songs = this._normalizeSong(res.playlist.tracks)
      // console.log(this.songs)
    },
    //为每一个song创建实例
    _normalizeSong(list) {
      let ret = []
      list.forEach(item => {
        if(item.id) {
          ret.push(createSong(item))
        }
      })
      return ret
    }
  },
  created() {
    this._getDetail()
  }
}
</script>

<style lang="less" scoped>
@import url('~@/assets/less/_variable.less');
.top-list{
  position: fixed;
  z-index: 10;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: @color-background;
}
</style>