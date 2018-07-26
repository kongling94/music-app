<template>
  <div class="recommend">
    <scroll :data="songList"
            class="recommend-content">
      <div>
        <div class="recommend-slider">
          <div v-if="sliderList.length"
               class="slider-wrapper">
            <slider>
              <div v-for="item in sliderList"
                   :key="item.id">
                <a :href="item.linkUrl">
                  <img class="needsclick"
                       :src="item.picUrl">
                </a>
              </div>
            </slider>
          </div>
        </div>
        <div class="recommend-content">
          <div class="list-title">热门推荐</div>
          <div class="recommend-list">
            <div class="item"
                 v-for="list in songList"
                 :key="list.id">
              <div class="icon">
                <a :href="`http://y.qq.com/w/taoge.html?ADTAG=myqq&from=myqq&channel=${list.accessnum}&id=${list.id}`">
                  <img :src="list.picUrl"
                       alt="">
                </a>
              </div>
              <div class="text">
                <div class="desc"
                     v-text="list.songListDesc"></div>
                <div class="name"
                     v-text="list.songListAuthor"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>
<script>
import scroll from 'base/scroll'
import slider from 'base/slider'
import { getRecommend } from 'api/recommend.js'
import { ERR_OK } from 'api/config.js'

export default {
  name: 'recommend',
  components: {
    slider,
    scroll
  },
  data () {
    return {
      sliderList: [],
      songList: []
    }
  },
  methods: {
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.sliderList = res.data.slider
          this.songList = res.data.songList
        }
      })
    }
  },
  created () {
    this._getRecommend()
  }
}
</script>
<style lang="stylus" scoped>
@import '~stylus/variable'
.recommend
  position fixed
  width 100%
  top 88px
  bottom 0
  .recommend-content, .recommend-slider
    height 100%
    overflow hidden
    padding 0 8px
    .slider-wrapper
      position relative
      width 100%
      overflow hidden
    .list-title
      height 65px
      line-height 65px
      text-align center
      font-size $font-size-medium
      color $color-theme
    .recommend-list
      margin-right -8px
      .item
        float left
        width 50%
        box-sizing border-box
        align-items center
        margin-bottom 10px
        padding-right 8px
        overflow hidden
        .icon
          // flex 0 0 60px
          width 100%
          // padding-right 20px
          a
            display block
            width 100%
            img
              width 100%
        .text
          display flex
          flex-direction column
          justify-content center
          flex 1
          line-height 20px
          overflow hidden
          font-size $font-size-medium
          .name
            margin-bottom 10px
            color $color-text
          .desc
            color $color-text-d
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>
