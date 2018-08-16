<template>
  <div class="search">
    <div class="search-box-wrapper"></div>
    <div class="shortcut-wrapper">
      <div class="shortcut"></div>
    </div>
    <searchBox></searchBox>
  </div>
</template>
<script>
import searchBox from 'views/search-box/search-box'
export default {
  name: 'search',
  components: {
    searchBox
  }
}
</script>
<style lang="stylus" scoped>
@import '~stylus/variable'
.search
  padding 0 15px
  .search-box-wrapper
    margin 20px
  .shortcut-wrapper
    position fixed
    top 178px
    bottom 0
    width 100%
    .shortcut
      height 100%
      overflow hidden
      .hot-key
        margin 0 20px 20px 20px
        .title
          margin-bottom 20px
          font-size $font-size-medium
          color $color-text-l
        .item
          display inline-block
          padding 5px 10px
          margin 0 20px 10px 0
          border-radius 6px
          background $color-highlight-background
          font-size $font-size-medium
          color $color-text-d
      .search-history
        position relative
        margin 0 20px
        .title
          display flex
          align-items center
          height 40px
</style>
