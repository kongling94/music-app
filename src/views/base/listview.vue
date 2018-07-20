<template>
  <scroll class="listview"
          :data="data"
          :probeType="probeType"
          :listenScroll="listenScroll"
          @scroll="scroll"
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
              @click="selectItem(item)"
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
            :class="{'current':currentIndex === index}"
            :data-index="index"
            class="item">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed"
         v-show="fixedTitle"
         ref="fixedTop">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
  </scroll>
</template>
<script>
import Scroll from 'base/scroll'
// import loading from 'base/loading'
import { getData } from 'common/js/dom.js'
export default {
  name: 'listview',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  components: {
    Scroll
  },
  created () {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  computed: {
    shortcutList () {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    },
    // 点击滚动
    onShortcutTouchStart (e) {
      let targetIndex = parseInt(getData(e.target, 'index'))
      let touchStart = e.touches[0]
      this.touch.y1 = touchStart.pageY
      this.touch.elementIndex = targetIndex
      this._scrollTo(targetIndex)
    },
    // 侧边滚动
    onShortcutTouchMove (e) {
      let touchStart = e.touches[0]
      this.touch.y2 = touchStart.pageY
      let delta = (this.touch.y2 - this.touch.y1) / 18 | 0
      let targetIndex = this.touch.elementIndex + delta
      // console.log(targetIndex)
      this._scrollTo(targetIndex)
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    _scrollTo (index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.scrollListview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    // 计算滚动列表的高度
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        const element = list[i]
        height += element.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      for (let i = 0; i < listHeight.length - 1; i++) {
        let element1 = listHeight[i]
        let element2 = listHeight[i + 1]
        if (-newY >= element1 && -newY < element2) {
          this.currentIndex = i
          this.diff = element2 + newY
          return
        }
        this.currentIndex = listHeight.length - 2
      }
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < 30) ? newVal - 30 : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixedTop.style.transform = `translate3d(0,${fixedTop}px,0)`
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
      background $color-highlight-background
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
      color $color-theme
      background $color-highlight-background
      transition all 0.3s ease-in-out
  .loading-container
    position absolute
    width 100%
    top 50%
    transform translateY(-50%)
</style>
