<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->

    <homeHeader></homeHeader>
    <tag></tag>
    <router-view/>
  </div>
</template>

<script>
import homeHeader from 'views/home/home-header'
import tag from 'views/home/tag'
export default {
  name: 'App',
  components: {
    homeHeader,
    tag
  }
}
</script>

<style lang="stylus" scoped>
@import "~stylus/variable"
#app {
  text-align: center;
  // color: $color-base;
}
</style>
