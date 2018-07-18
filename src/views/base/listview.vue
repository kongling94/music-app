<template>
  <scroll class="listview"
          :data="data"
          ref="scrollListview">
    <ul>
      <li v-for="group in data"
          :key="group.id"
          class="list-group"
          ref="listGroup">
        <h2 class="list-group-title">
          {{group.title}}
        </h2>
        <ul>
          <li v-for="item in group.items"
              :key="item.id"
              class="list-group-item">
            <img :src="item.avatar"
                 class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut"
         @touchstart="onShortcutTouchStart"
         @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item,index) in shortcutList"
            :key="index"
            :data-index="index"
            class="item">
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>
<script>
import Scroll from 'base/scroll'
import { getData } from 'common/js/dom.js'
export default {
  created () {
    this.touch = {}
  },
  name: 'listview',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Scroll
  },
  computed: {
    shortcutList () {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    }
  },
  methods: {
    onShortcutTouchStart (e) {
      let targetIndex = parseInt(getData(e.target, 'index'))
      let touchStart = e.touches[0]
      this.touch.y1 = touchStart.pageY
      this.touch.elementIndex = targetIndex
      this._scrollTo(targetIndex)
    },
    onShortcutTouchMove (e) {
      let touchStart = e.touches[0]
      this.touch.y2 = touchStart.pageY
      let delta = (this.touch.y2 - this.touch.y1) / 18 | 0
      let targetIndex = this.touch.elementIndex + delta
      // console.log(targetIndex)
      this._scrollTo(targetIndex)
    },
    _scrollTo (index) {
      this.$refs.scrollListview.scrollToElement(this.$refs.listGroup[index], 0)
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable'
.listview
  position relative
  height 100%
  width 100%
  overflow hidden
  background $color-background
  .list-group
    padding-bottom 30px
    .list-group-title
      height 30px
      line-height 30px
      padding-left 20px
      text-align left
      font-size $font-size-small
      color $color-theme
      background $color-hightlight-background
    .list-group-item
      display flex
      align-items center
      padding 20px 0 0 30px
      .avatar
        width 50px
        height 50px
        border-radius 50%
      .name
        margin-left 20px
        color $color-text-l
        font-size $font-size-medium
  .list-shortcut
    position absolute
    z-index 30
    right 0
    top 50%
    transform translateY(-50%)
    width 20px
    padding 15px 0
    border-radius 10px
    text-align center
    background $color-background-d
    font-family Helvetica
    .item
      padding 3px
      line-height 1
      color $color-text-l
      font-size $font-size-small
      &.current
        color $color-theme
  .list-fixed
    position absolute
    top 0
    left 0
    width 100%
    .fixed-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size $font-size-small
      color $color-text-l
      background $color-highlight-background
  .loading-container
    position absolute
    width 100%
    top 50%
    transform translateY(-50%)
</style>
