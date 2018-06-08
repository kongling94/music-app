<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <Header></Header>
    <tag></tag>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import Header from 'views/base/header'
import Tag from 'views/base/tag'
import Slider from 'views/base/slider'
export default {
  name: 'App',
  components: {
    Header,
    Tag,
    Slider
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
