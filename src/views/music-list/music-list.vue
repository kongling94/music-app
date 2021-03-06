<template>
  <div class="music-list">
    <div class="back"
         @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title"
        v-html="title"></h1>
    <div class="bg-image"
         :style="bgStyle"
         ref="bgImage">
      <div class="play-wrapper">
        <div class="play"
             v-show="songs.length>0"
             ref="playBtn"
             @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放歌曲</span>
        </div>
      </div>
      <div class="filter"
           ref="filter"></div>
    </div>
    <div class="bg-layer"
         ref="layer"></div>
    <scroll :data="songs"
            class="list"
            ref="songList"
            :probe-type="probeType"
            :listen-scroll="listenScroll"
            @scroll="scroll">
      <div class="song-list-wrapper">
        <song-list :songs="songs"
                   :rank="rank"
                   @select="select"></song-list>
      </div>
    </scroll>
  </div>
</template>
<script>
import songList from 'base/song-list'
import scroll from 'base/scroll'
import { mapActions } from 'vuex'
export default {
  name: 'music-list',
  props: ['bgImage', 'songs', 'title', 'rank'],
  data () {
    return {
      scrollY: 0
    }
  },
  components: {
    songList,
    scroll
  },
  computed: {
    bgStyle () {
      return `background-image: url(${this.bgImage})`
    }
  },
  methods: {
    scroll (pos) {
      this.scrollY = pos.y
    },
    back () {
      this.$router.back()
    },
    select (item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    random () {
      this.randomPlay({
        list: this.songs
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  watch: {
    scrollY (newY) {
      let translateY = Math.max(this.minTranslateY, newY)
      let zindex = 0
      let scale = 1
      const precent = Math.abs(newY / this.imageHeight)

      if (newY > 0) {
        scale = 1 + precent
        zindex = 10
      }
      // this.$refs.filters.style['backdrop-filter'] = `blur(${blur}px)`
      this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px,0)`
      if (newY < this.minTranslateY) {
        zindex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = 40 + 'px'
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.playBtn.style.display = ''
      }
      this.$refs.bgImage.style.zIndex = zindex
      this.$refs.bgImage.style['transform'] = `scale(${scale})`
    }
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted () {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + 40
    this.$refs.songList.$el.style.top = `${this.imageHeight}px`
  }
}
</script>
<style lang="stylus" scoped>
@import '~stylus/variable'
@import '~stylus/mixin'
.music-list
  position fixed
  z-index 100
  top 0
  left 0
  bottom 0
  right 0
  background $color-background
  .back
    position absolute
    top 0
    left 6px
    z-index 50
    .icon-back
      display block
      padding 10px
      font-size $font-size-large-x
      color $color-theme
  .title
    position absolute
    top 0
    left 10%
    z-index 40
    width 80%
    no-wrap()
    text-align center
    line-height 40px
    font-size $font-size-large
    color $color-text
  .bg-image
    position relative
    width 100%
    height 0
    padding-top 70%
    transform-origin top
    background-size cover
    .play-wrapper
      position absolute
      bottom 20px
      z-index 50
      width 100%
      .play
        box-sizing border-box
        width 135px
        padding 7px 0
        margin 0 auto
        text-align center
        border 1px solid $color-theme
        color $color-theme
        border-radius 100px
        font-size 0
        .icon-play
          display inline-block
          vertical-align middle
          margin-right 6px
          font-size $font-size-medium-x
        .text
          display inline-block
          vertical-align middle
          font-size $font-size-small
    .filter
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      background rgba(7, 17, 27, 0.3)
  .bg-layer
    position relative
    height 100%
    background $color-background
  .list
    position fixed
    top 0
    bottom 0
    width 100%
    background $color-background
    // overflow hidden
    .song-list-wrapper
      padding 20px 30px
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>
