<template>
  <div id="app">
    <m-header />
    <tab />
    <keep-alive>
      <router-view />
    </keep-alive>
    <player/>
  </div>
</template>

<script>
import MHeader from './components/m-header/m-header'
import Tab from './components/tab/tab'
import Player from './views/player/player'
import { login } from './api/api'
export default {
  components: {
    MHeader,
    Tab,
    Player
  },
  created() {
    // this._login()
  },
  methods: {
    async _login() {
      let res = await login()
      console.log(res)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/_variable.less';
#app {
  position: relative;
  height: 100vh;
}
</style>
