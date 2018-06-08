<template>
  <div class="recommend">
   <div class="recommend-slider">
     <slider :sliderList="sliderList"></slider>
   </div>
   <div class="recommend-content">
      <div class="list-title">热门推荐</div>
     <div class="recommend-list">
       <div class="item" v-for="list in songList" :key="list.id">
         <div class="icon">
           <router-link to="http://y.qq.com/w/taoge.html?ADTAG=myqq&from=myqq&channel=10007100&id=2043041547">
            <img :src="list.picUrl" alt="">
           </router-link>
         </div>
         <div class="text">
           <div class="desc" v-text="list.songListDesc"></div>
           <div class="name" v-text="list.songListAuthor"></div>
         </div>
       </div>
     </div>
   </div>
  </div>
</template>
<script>
// import axios from 'axios'
import slider from 'base/slider'
import { getRecommend } from 'api/recommend.js'
import { ERR_OK } from 'api/config.js'

export default {
  name: 'recommend',
  components: {
    slider
  },
  data () {
    return {
      data: [],
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
  position absolute
  width 100%
  top 88px
  left 0
  right 0
  bottom 0
  .recommend-content
    margin-top 10px
    padding 0 10px
    height 100%
    // overflow hidden
    // .slider-wrapper
    //   position relative
    //   width 100%
    //   overflow hidden
    .list-title
      flex none
      height 40px
      line-height 40px
      text-align center
      font-size $font-size-medium
      color $color-theme
    .recommend-list
      // display flex
      // flex-wrap wrap
      .item
        width 50%
        display inline-block
        padding 20px
        box-sizing border-box
        // align-items center
        // padding 0 20px 20px 20px
        .icon
          width 100%
          height 100%
          img
            width 100%
            height 100%
        .text
          line-height 20px
          overflow hidden
          font-size $font-size-medium
          .name
            color $color-text
          .desc
            white-space nowrap
            overflow hidden
            text-overflow ellipsis
            margin-top 5px
            color $color-text-d
            margin-bottom 10px
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>
