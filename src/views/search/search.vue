<template>
  <div class="search">
    <div class="search-box-wrapper">
      <searchBox ref="searchBox"
                 @query="onQueryChange"></searchBox>
    </div>
    <div class="shortcut-wrapper"
         v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item"
                v-for="item in hotKey"
                :key="item.n"
                @click="setQuery(item.k)">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result">
      <suggest :query="query"></suggest>
    </div>

  </div>
</template>
<script>
import searchBox from 'views/search-box/search-box'
import suggest from 'views/suggest/suggest'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
export default {
  name: 'search',
  components: {
    searchBox,
    suggest
  },
  data () {
    return {
      hotKey: [],
      query: ''
    }
  },
  created () {
    this._getHotKey()
  },
  methods: {
    _getHotKey () {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    setQuery (item) {
      this.$refs.searchBox.setQuery(item)
    },
    onQueryChange (query) {
      this.query = query
    }
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
    left 0
    width 100%
    .shortcut
      height 100%
      overflow hidden
      .hot-key
        margin 0 20px 20px 20px
        .title
          text-align left
          margin-bottom 20px
          font-size $font-size-medium
          color $color-text-l
        .item
          display inline-block
          padding 5px 10px
          margin 15px 8px 0 0
          border-radius 6px
          background $color-highlight-background
          font-size $font-size-medium
          color $color-text-d
          text-align left
      .search-history
        position relative
        margin 0 20px
        .title
          display flex
          align-items center
          height 40px
</style>
