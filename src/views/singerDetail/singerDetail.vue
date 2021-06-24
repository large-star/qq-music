<template>
  <music-list :songs="songs" :title="title" :bgImage="bgImage"/>
</template>

<script>
import MusicList from '@/components/musicList/musicList'
import { mapGetters } from 'vuex'
import { getSingerDetail } from '@/api/singer'
import { createSong } from '@/assets/js/song'



export default {
  name: 'singer-detail',
  data() {
    return {
      songs: [],
      briefDesc: ''
    }
  },
  components: {
    MusicList
  },
  computed: {
    ...mapGetters([
      'singer'
    ]),
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    }
  },
  created() {
    this._getSingerDetail()
  },
  methods: {
    async _getSingerDetail() {
      const {singer} = this
      if(!singer.id) {
        return this.$router.replace('/singer')
      }
      let res = await getSingerDetail(singer.id)
      if(!res || res.code !== 200) return
      // this.briefDesc = res.artist.briefDesc
      this.songs = this._normalizeSong(res.hotSongs)
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
  }
}
</script>

<style lang="less" scoped>
@import url('~@/assets/less/_variable.less');
.singer-detail{
  position: fixed;
  z-index: 10;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: @color-background;
}
</style>