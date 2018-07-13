<template>
  <div class="singer">
    歌手
  </div>
</template>
<script>
import { getSingerList } from 'api/singer.js'
import { ERR_OK } from 'api/config.js'
const HOT_NAME = '热门'
const HOT_SINGER_LENGTH = 10
export default {
  name: 'singer',
  data () {
    return {
      singers: []
    }
  },
  methods: {
    _getSingerList () {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = res.data.list
          // console.log(this.singers)
        }
      })
    },
    _normalizeSinger (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LENGTH) {
          map.hot.items.push({
            id: item.Fsinger_id,
            name: item.Fsinger_name,
            avatar: `hhtps://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
          })
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push({

        })
      })
    }
  },
  created () {
    this._getSingerList()
  }
}
</script>
<style lang="stylus" scoped>
@import '~stylus/variable'
.singer
  position fixed
  top 88px
  bottom 0
  width 100%
</style>
