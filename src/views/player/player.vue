<template>
  <div class="player"
       v-show="playList.length>0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player"
           v-show="fullScreen"
           ref="normalPlayer">
        <div class="background">
          <img :src="currentSong.image"
               width="100%"
               height="100%"
               alt="">
        </div>
        <div class="top">
          <div class="back"
               @click="hideNormalPlayer"
               ref="normalPlayer">
            <i class="icon-back"></i>
          </div>
          <h1 class="title"
              v-html="currentSong.name"></h1>
          <h2 class="subtitle"
              v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchS"
             @touchmove.prevent="middleTouchM"
             @touchend="middleTouchE">
          <div class="middle-l"
               ref="middleL">
            <div class="cd-wrapper"
                 ref="cdWrapper">
              <div class="cd"
                   :class="cdCls">
                <img :src="currentSong.image"
                     class="image"
                     alt="">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <Scroll class="middle-r"
                  :data="currentLyric && currentLyric.lines"
                  ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current':currentLineNum===index}"
                   v-for="(line,index) in currentLyric.lines"
                   :key="index">{{line.txt}}</p>
              </div>
            </div>
          </Scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot"
                  :class="{'active':currentShow==='cd'}"></span>
            <span class="dot"
                  :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">
              {{formatTime(currentTime)}}
            </span>
            <div class="progress-bar-wrapper">
              <progressBar :percent="percent"
                           @percentPos="newPercentChange">
              </progressBar>
            </div>
            <span class="time time-r">
              {{formatTime(currentSong.duration)}}
            </span>
          </div>
          <div class="operators">
            <div class="icon i-left"
                 @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left"
                 :class="disableCls">
              <i class="icon-prev"
                 @click="prev"></i>
            </div>
            <div class="icon i-center"
                 :class="disableCls">
              <i :class="playIcon"
                 @click="togglePlay"></i>
            </div>
            <div class="icon i-right"
                 :class="disableCls">
              <i class="icon-next"
                 @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player"
           v-show="!fullScreen"
           @click.stop="showNormalPlayer"
           ref="miniPlayer">
        <div class="icon">
          <img :src="currentSong.image"
               width="40"
               height="40"
               alt=""
               :class="cdCls">
        </div>
        <div class="text">
          <h2 class="name"
              v-html="currentSong.name"></h2>
          <p class="desc"
             v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progressCircle :radius="32"
                          :percent="percent">
            <i :class="miniPlayIcon"
               @click.stop="togglePlay"
               class="icon-mini"></i>
          </progressCircle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio"
           :src="currentSong.url"
           @canplay="ready"
           @timeupdate="updateTime"
           @ended="playNext"></audio>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import Scroll from 'base/scroll'
import _lyric from 'lyric-parser'
import progressBar from './progress-bar'
import progressCircle from './progress-circle'
const transform = prefixStyle('transform')
const transition = prefixStyle('transition')
export default {
  name: 'player',
  data () {
    return {
      songReady: false,
      currentTime: 0,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: ''
    }
  },
  components: {
    progressBar,
    progressCircle,
    Scroll
  },
  computed: {
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniPlayIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    disableCls () {
      return this.songReady ? '' : 'disable'
    },
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ])
  },
  methods: {
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlaying: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setMode: 'SET_PLAY_MODE',
      setList: 'SET_SEQUENCE_LIST'
    }),
    middleTouchS (e) {
      // 标记位
      this.touch.initiated = true
      const touch = e.touches[0]
      // 记录起始点
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchM (e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      // 计算滑动的差值
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      // 如果是上下滑动 不切换
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      // 计算偏移 若当前是CD展示偏移为0 否则是1屏宽
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + (deltaX)))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.middleL.style['opacity'] = 1 - this.touch.percent
      this.$refs.middleL.style[transition] = 'all .3s linear'
    },
    middleTouchE () {
      let offsetWidth
      let opacity
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          opacity = 1
          this.currentShow = 'cd'
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style[transition] = 'all .3s linear'
      this.$refs.middleL.style['opacity'] = opacity
      this.$refs.middleL.style[transition] = 'all .3s linear'
    },
    // 播放模式修改的时候，若当前歌曲在随机播放，用户点击列表中的歌曲时。播放指定歌曲
    changeMode () {
      const modeStatus = (this.mode + 1) % 3
      this.setMode(modeStatus)
      let listSong = null
      if (modeStatus === playMode.random) {
        listSong = shuffle(this.sequenceList)
      } else {
        listSong = this.sequenceList
      }
      this.resetCurrentSong(listSong)
      this.setList(listSong)
    },
    // 播放下一首
    playNext () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    // 单曲循环播放
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    // 随机播放时，再点击指定歌曲，修改当前歌曲列表的index
    resetCurrentSong (list, song) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    hideNormalPlayer () {
      this.setFullScreen(false)
    },
    showNormalPlayer () {
      this.setFullScreen(true)
    },
    // 拖动、点击 进度条，歌曲随着改变
    newPercentChange (percent) {
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = this.currentSong.duration * percent
      if (!this.playing) {
        this.togglePlay()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    enter (el, done) {
      // 解构赋值
      const { x, y, scale } = this._getPosAndScale()
      // 定义动画帧
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }
      // 定义动画名称和运动曲线
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      // 给组件注册动画
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    // 动画结束后
    afterEnter () {
      // 取消注册
      animations.unregisterAnimation('move')
      // DOM元素上将animation置空
      this.$refs.cdWrapper.style.animation = ''
    },
    leave (el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const { x, y, scale } = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave () {
      this.$refs.cdWrapper.style.animation = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    // CD封面位移的计算
    _getPosAndScale () {
      // 目标宽度
      let targetWidth = 40
      // 左侧偏移
      let paddingLeft = 40
      // 底部偏移
      let targetBottom = 30
      // 动画结束后相对于顶部偏移
      let paddingTop = 80
      // 动画结束后的width
      let width = window.innerWidth * 0.8
      // 比例计算
      const scale = targetWidth / width
      // x轴：因为是从左到右移动，起始位置小于结束位置 前面加负号
      const x = -(window.innerWidth / 2 - paddingLeft)
      // y轴：因为是从下到上，正值
      const y = window.innerHeight - paddingTop - width / 2 - targetBottom
      return { x, y, scale }
    },
    // 播放、暂停
    togglePlay () {
      if (!this.songReady) {
        return
      }
      this.setPlaying(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    // 播放上一首
    prev () {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlay()
        }
      }
      this.songReady = false
    },
    // 播放下一首
    next () {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlay()
        }
      }
      this.songReady = false
    },
    ready () {
      this.songReady = true
    },
    error () {
      this.songReady = true
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    // 对歌曲时间戳进行格式化
    formatTime (interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    handleLyric ({ lineNum, txt }) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollToElement(0, 0, 1000)
      }
      this.playingLyric = txt
      // console.log(this.playingLyric)
    },
    // 获取当前歌曲的歌词 并使用第三方插件对歌词进行管理
    _getLyric () {
      this.currentSong.getLyric().then((str) => {
        this.currentLyric = new _lyric(str, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
        // console.log(this.currentLyric)
      })
    },
    // 补全位数
    _pad (num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    }
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (newSong.id === oldSong.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      setTimeout(() => {
        this.$refs.audio.play()
        this._getLyric()
      }, 1000)
    },
    playing (newPlaying) {
      this.$nextTick(() => {
        const audio = this.$refs.audio
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  created () {
    this.touch = {}
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
*
  touch-action none
.player
  .normal-player
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    z-index 150
    background $color-background
    .background
      position absolute
      left 0
      top 0
      width 100%
      height 100%
      z-index -1
      opacity 0.8
      filter blur(20px)
    .top
      position relative
      margin-bottom 25px
      .back
        position absolute
        top 0
        left 6px
        z-index 50
        .icon-back
          display block
          padding 9px
          font-size $font-size-large-x
          color $color-theme
          transform rotate(-90deg)
      .title
        width 70%
        margin 0 auto
        line-height 40px
        text-align center
        no-wrap()
        font-size $font-size-large
        color $color-text
      .subtitle
        line-height 20px
        text-align center
        font-size $font-size-medium
        color $color-text
    .middle
      position fixed
      width 100%
      top 80px
      bottom 170px
      white-space nowrap
      font-size 0
      .middle-l
        display inline-block
        vertical-align top
        position relative
        width 100%
        height 0
        padding-top 80%
        .cd-wrapper
          position absolute
          left 10%
          top 0
          width 80%
          height 100%
          .cd
            width 100%
            height 100%
            box-sizing border-box
            border 10px solid rgba(255, 255, 255, 0.1)
            border-radius 50%
            &.play
              animation rotate 20s linear infinite
            &.pause
              animation-play-state paused
            .image
              position absolute
              left 0
              top 0
              width 100%
              height 100%
              border-radius 50%
        .playing-lyric-wrapper
          width 80%
          margin 30px auto 0 auto
          overflow hidden
          text-align center
          .playing-lyric
            height 20px
            line-height 20px
            font-size $font-size-medium
            color $color-text
      .middle-r
        display inline-block
        vertical-align top
        width 100%
        height 100%
        overflow hidden
        .lyric-wrapper
          width 80%
          margin 0 auto
          overflow hidden
          text-align center
          .text
            line-height 32px
            color $color-text-l
            font-size $font-size-medium
            &.current
              color $color-text
    .bottom
      position absolute
      bottom 50px
      width 100%
      .dot-wrapper
        text-align center
        font-size 0
        .dot
          display inline-block
          vertical-align middle
          margin 0 4px
          width 8px
          height 8px
          border-radius 50%
          background $color-text-l
          &.active
            width 20px
            border-radius 5px
            background $color-text-ll
      .progress-wrapper
        display flex
        align-items center
        width 80%
        margin 0px auto
        padding 10px 0
        .time
          color $color-text
          font-size $font-size-small
          flex 0 0 30px
          line-height 30px
          width 30px
          &.time-l
            text-align left
          &.time-r
            text-align right
        .progress-bar-wrapper
          flex 1
      .operators
        display flex
        align-items center
        .icon
          flex 1
          color $color-theme
          &.disable
            color $color-theme-d
          i
            font-size 30px
        .i-left
          text-align right
        .i-center
          padding 0 20px
          text-align center
          i
            font-size 36px
        .i-right
          text-align left
        .icon-favorite
          color $color-sub-theme
    &.normal-enter-active, &.normal-leave-active
      transition all 0.4s
      .top, .bottom
        transition all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity 0
      .top
        transform translate3d(0, -100px, 0)
      .bottom
        transform translate3d(0, 100px, 0)
  .mini-player
    display flex
    align-items center
    position fixed
    left 0
    bottom 0
    z-index 180
    width 100%
    height 60px
    background $color-highlight-background
    &.mini-enter-active, &.mini-leave-active
      transition all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity 0
    .icon
      flex 0 0 40px
      width 40px
      padding 0 10px 0 20px
      img
        border-radius 50%
        &.play
          animation rotate 10s linear infinite
        &.pause
          animation-play-state paused
    .text
      display flex
      flex-direction column
      justify-content center
      flex 1
      line-height 20px
      overflow hidden
      .name
        margin-bottom 2px
        no-wrap()
        font-size $font-size-medium
        color $color-text
      .desc
        no-wrap()
        font-size $font-size-small
        color $color-text-d
    .control
      flex 0 0 30px
      width 30px
      padding 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size 30px
        color $color-theme-d
      .icon-mini
        font-size 32px
        position absolute
        left 0
        top 0
@keyframes rotate
  0%
    transform rotate(0)
  100%
    transform rotate(360deg)
</style>
