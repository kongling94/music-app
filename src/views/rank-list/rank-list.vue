<template>
  <transition name="slide">
    <div class="rank-list">
      <music-list :title="title"
                  :bgImage="bgImage"
                  :rank="rank"
                  :songs="this.songList"></music-list>
    </div>
  </transition>
</template>
<script>
import musicList from 'views/music-list/music-list'
import { getSongVkey } from 'api/singer.js'
import { getMusicList } from 'api/rank.js'
import { ERR_OK } from 'api/config.js'
import { createSong } from 'common/js/song'
import { mapGetters } from 'vuex'
export default {
  name: 'rank-list',
  components: {
    musicList
  },
  data () {
    return {
      songList: [],
      rank: true
    }
  },
  computed: {
    ...mapGetters([
      'topList'
    ]),
    title () {
      return this.topList.topTitle
    },
    bgImage () {
      return this.topList.picUrl
    }
  },
  methods: {
    _getTopList () {
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songList = this._normalizeSongs(res.songlist)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach(element => {
        let musicData = element.data
        if (musicData.songid && musicData.albummid) {
          getSongVkey(musicData.songmid).then(res => {
            if (res.code === ERR_OK) {
              let more = res.data.items[0]
              let obj = Object.assign(musicData, more)
              ret.push(createSong(obj))
            }
          })
        }
      })
      return ret
    }
  },
  created () {
    this._getTopList()
  }
}
</script>
<style lang="stylus" scoped>
.rank-list
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
