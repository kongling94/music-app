<template>
  <div class="song-list">
    <ul>
      <li class="item"
          v-for="(song,index) in songs"
          :key="song.id"
          @click="selectItem(song,index)">
        <div class="rank"
             v-show="rank">
          <span :class="getRankCls(index)"
                v-text="getRankText(index)"></span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>

export default {
  name: 'song-list',
  props: [
    'songs', 'rank'
  ],
  methods: {
    getDesc (song) {
      return `${song.singer} · ${song.album}`
    },
    bgStyle (img) {
      return `background-image: url(${img})`
    },
    selectItem (item, index) {
      this.$emit('select', item, index)
    },
    getRankCls (index) {
      if (index < 3) {
        return `icon icon${index}`
      } else {
        return `text`
      }
    },
    getRankText (index) {
      if (index > 2) {
        return index + 1
      }
    }
  },
  computed: {

  },
  mounted () {

  }
}
</script>

<style lang="stylus" scoped>
@import '~stylus/variable'
@import '~stylus/mixin'
.song-list
  .item
    display flex
    align-items center
    box-sizing border-box
    height 64px
    font-size $font-size-medium
    .rank
      flex 0 0 25px
      width 25px
      margin-right 30px
      text-align center
      .icon
        display inline-block
        width 40px
        height 38px
        background-size 40px 38px
        &.icon0
          bg-image('first')
        &.icon1
          bg-image('second')
        &.icon2
          bg-image('third')
      .text
        color $color-theme
        font-size $font-size-large
    .content
      flex 1
      line-height 20px
      overflow hidden
      text-align left
      .name
        no-wrap()
        color $color-text
      .desc
        no-wrap()
        margin-top 4px
        color $color-text-d
</style>
