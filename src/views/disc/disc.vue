<template>
  <transition name="slide">
    <music-list :title="title"
                :bg-img="bgImage"></music-list>
  </transition>
</template>
<script>
import musicList from 'views/music-list/music-list'
import { mapGetters } from 'vuex'
import { ERR_OK } from 'api/config.js'
import { getDisc } from 'api/disc'
export default {
  name: 'disc',
  data () {
    return {
      songList: {}
    }
  },
  computed: {
    ...mapGetters([
      'disc'
    ]),
    title () {
      return this.disc.id
    },
    bgImage () {
      return this.disc.logo
    }
  },
  methods: {
    _getDisc () {
      const id = this.$router.params.id
      getDisc(id).then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data)
          this.songList = res.cdlist
        }
      })
    }
  },
  components: {
    musicList
  },
  created () {
    this._getDisc()
  }
}
</script>
<style lang="stylus" scoped>
.slide-enter-active, .slider-leave-active
  transition all 0.3s
.slide-enter, .slide-levae-to
  transform translate3d(100%, 0, 0)
</style>
