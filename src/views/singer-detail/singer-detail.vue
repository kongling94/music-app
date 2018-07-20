<template>
  <transition name="slider">
    <div class="singer-detail">
      112233
    </div>
  </transition>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'singer-detail',
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    console.log(this.singer)
  },
  mounted () {
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable'
.singer-detail
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  z-index 40
  background-color $color-background
.slider-enter-active, .slider-leave-active
  transition all 0.3s
.slider-enter, .slider-leave
  transform translate3d(100%, 0, 0)
</style>
