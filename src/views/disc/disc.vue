<template>
  <transition name="slide">
    <div class="disc">
      <music-list :songs="this.songList"
                  :title="title"
                  :bgImage="bgImage"></music-list>
    </div>
  </transition>
</template>
<script>
import musicList from 'views/music-list/music-list'
import { mapGetters } from 'vuex'
import { ERR_OK } from 'api/config.js'
import { getDisc } from 'api/disc'
import { getSongVkey } from 'api/singer.js'
import { createSong } from 'common/js/song'
export default {
  name: 'disc',
  data () {
    return {
      songList: []
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
    }
  },
  methods: {
    _getDisc () {
      const id = this.$route.params.id
      getDisc(id).then((res) => {
        if (res.code === ERR_OK) {
          this.songList = this._normalizeSongs(res.cdlist[0].songlist)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      for (const key in list) {
        if (list.hasOwnProperty(key)) {
          let musicData = list[key]
          if (musicData.songid && musicData.albummid) {
            getSongVkey(musicData.songmid).then(res => {
              if (res.code === ERR_OK) {
                let more = res.data.items[0]
                let obj = Object.assign(musicData, more)
                ret.push(createSong(obj))
              }
            })
          }
        }
      }
      // list.forEach(element => {
      //   let { musicData } = element
      //   if (musicData.songid && musicData.albummid) {
      //     getSongVkey(musicData.songmid).then(res => {
      //       if (res.code === ERR_OK) {
      //         let more = res.data.items[0]
      //         let obj = Object.assign(musicData, more)
      //         ret.push(createSong(obj))
      //       }
      //     })
      //   }
      // })
      return ret
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
.disc
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  z-index 40
  background-color $color-background
.slide-enter-active, .slide-leave-active
  transition all 0.3s
.slide-enter, .slide-levae-to
  transform translate3d(100%, 0, 0)
</style>
