<template>
  <transition name="slider">
    <div class="disc">
      <music-list :title="title"
                  :bg-image="bgImage"
                  :songs="songs"></music-list>
    </div>
  </transition>
</template>
<script>
import musicList from 'views/music-list/music-list'
import { mapGetters } from 'vuex'
export default {
  name: 'disc',
  data () {
    return {
      discList: {}
    }
  },
  computed: {
    ...mapGetters([
      'disc'
    ]),
    title () {
      return this.disc.dissname
    },
    bgImage () {
      return this.disc.logo
    },
    songs () {
      return this.disc.songlist
    }
  },
  methods: {
  },
  components: {
    musicList
  },
  created () {
    console.log(this.disc)
  }
}
</script>
<style lang="stylus" scoped>
.disc
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  z-index 40
  background-color $color-background
.slider-enter-active, .slider-leave-active
  transition all 0.3s
.slider-enter, .slider-leave-to
  transform translate3d(100%, 0, 0)
</style>
