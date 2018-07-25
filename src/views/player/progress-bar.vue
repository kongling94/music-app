<template>
  <div class="progress-bar"
       ref="progressBar"
       @click="changeProgressPos">
    <div class="bar-inner">
      <div class="progress"
           ref="progress"></div>
      <div class="progress-btn-wrapper"
           ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { prefixStyle } from 'common/js/dom'
const transform = prefixStyle('transform')
export default {
  name: 'progress-bar',
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {

    }
  },
  computed: {

  },
  methods: {
    progressTouchStart (e) {
      // 标记位
      this.touch.initiated = true
      // 起始位
      this.touch.startX = e.touches[0].pageX
      // 进度条当前位
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - 16, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    progressTouchEnd (e) {
      this.touch.initiated = false
      this.trigerPos()
    },
    trigerPos () {
      const barWidth = this.$refs.progressBar.clientWidth - 16
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentPos', percent)
    },
    changeProgressPos (e) {
      this._offset(e.offsetX)
      this.trigerPos()
    },
    _offset (x) {
      this.$refs.progress.style.width = `${x}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${x}px,0,0)`
    }
  },
  watch: {
    percent (newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - 16
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  },
  created () {
    this.touch = {}
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable'
.progress-bar
  height 30px
  .bar-inner
    position relative
    top 13px
    height 4px
    background rgba(0, 0, 0, 0.3)
    .progress
      position absolute
      height 100%
      background $color-theme
    .progress-btn-wrapper
      position absolute
      left -8px
      top -13px
      width 30px
      height 30px
      .progress-btn
        position relative
        top 7px
        left 7px
        box-sizing border-box
        width 16px
        height 16px
        border 3px solid $color-text
        border-radius 50%
        background $color-theme
</style>
