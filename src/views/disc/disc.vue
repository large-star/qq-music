<template>
  <div class="disc">
    <music-list :songs="songs" :title="title" :bgImage="bgImage"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MusicList from '@/components/musicList/musicList'
import { getDetail } from '@/api/api'
import { createSong } from '@/assets/js/song'
export default {
  data() {
    return {
      songs: [],
    }
  },
  components: {
    MusicList
  },
  computed: {
    ...mapGetters([
      'disc'
    ]),
    title() {
      return this.disc.name
    },
    bgImage() {
      return this.disc.avatar
    }
  },
  created() {
    this._getDetail()
  },
  methods: {
    async _getDetail() {
      const {disc} = this
      if(!disc.id) {
        return this.$router.replace('/recommend')
      }
      let res = await getDetail(disc.id)
      if(!res || res.code !== 200) return
      this.songs = this._normalizeSong(res.playlist.tracks)
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
.disc{
  position: fixed;
  z-index: 10;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: @color-background;
}
</style>