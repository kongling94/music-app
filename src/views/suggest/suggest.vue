<template>
  <div>
    <Scroll class="suggest"
            :data="result"
            :pullup="pullup"
            @scrollToEnd="getMoreInfo"
            ref="suggest">
      <ul class="suggest-list">
        <li class="suggest-item"
            v-for="item in result"
            :key="item.id"
            @click="selectItem(item)">
          <div class="icon">
            <i :class="getIconCls(item)"></i>
          </div>
          <div class="name">
            <p class="text"
               v-html="getDisplayName(item)"></p>
          </div>
        </li>
      </ul>
    </Scroll>
  </div>
</template>
<script>
import { getSearchList } from 'api/search'
import { getSongVkey } from 'api/singer.js'
import { ERR_OK } from 'api/config'
import Scroll from 'base/scroll'
import { createSong } from 'common/js/song'
import Singer from 'common/js/singer'
import { mapMutations, mapActions } from 'vuex'
const TYPE_SINGER = 'singer'
const PERPAGE = 20
export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Scroll
  },
  data () {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true
    }
  },
  methods: {
    getMoreInfo () {
      if (!this.hasMore) {
        return
      }
      this.page++
      this.search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._formatReslut(res.data))
          this._checkMore(res.data)
        }
      })
    },
    search () {
      this.hasMore = true
      this.page = 1
      this.$refs.suggest.scrollTo(0, 0)
      getSearchList(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res.data)
          this.result = this._formatReslut(res.data)
          // console.log(this.result)
          this._checkMore(res.data)
        }
      })
    },
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    selectItem (item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        getSongVkey(item.mid).then(res => {
          if (res.code === ERR_OK) {
            let more = res.data.items[0]
            let obj = Object.assign(item, more)
            let song = createSong(obj)
            this.insertSong(song)
          }
        })
      }
    },
    _checkMore (data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * PERPAGE) > song.totalnum) {
        this.hasMore = false
      }
    },
    _formatReslut (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }
      if (data.song) {
        ret = ret.concat(this._normallizeSongs(data.song.list))
      }
      return ret
    },
    _normallizeSongs (list) {
      // console.log(list)
      let ret = []
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          // console.log(musicData)

          ret.push(createSong(musicData))
        }
      })
      // console.log(ret)
      return ret
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query () {
      this.search()
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~stylus/variable'
@import '~stylus/mixin'
.suggest
  height 100%
  overflow hidden
  .suggest-list
    padding 0 30px
    .suggest-item
      display flex
      align-items center
      padding-bottom 20px
    .icon
      flex 0 0 30px
      width 30px
      [class^='icon-']
        font-size 14px
        color $color-text-d
    .name
      flex 1
      font-size $font-size-medium
      color $color-text-d
      overflow hidden
      .text
        no-wrap()
  .no-result-wrapper
    position absolute
    width 100%
    top 50%
    transform translateY(-50%)
</style>
