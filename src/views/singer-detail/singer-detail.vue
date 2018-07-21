<template>
  <transition name="slider">
    <div class="singer-detail">
      112233
    </div>
  </transition>
</template>
<script>
import { mapGetters } from 'vuex'
import { getSingerDetail, getSongVkey } from 'api/singer.js'
import { ERR_OK } from 'api/config.js'
import { createSong } from 'common/js/song'
export default {
  name: 'singer-detail',
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  data () {
    return {
      songs: []
    }
  },
  created () {
    this._getSingerDetail()
  },
  methods: {
    _getSingerDetail () {
      // 如果当前隐射的...mapGetter中没有id 进行router的跳转
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      // 若请求的数据这渲染视图
      getSingerDetail(this.singer.mid).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list)
          console.log(this.songs)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach(element => {
        let { musicData } = element
        if (musicData.songid && musicData.albummid) {
          getSongVkey(musicData.songmid).then(res => {
            if (res.code === ERR_OK) {
              musicData.push(res.data.items)
            }
          })
          ret.push(createSong(musicData))
        }
      })

      return ret
    }
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
