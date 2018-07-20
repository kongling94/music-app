<template>
  <div class="singer">
    <listview :data="singers"
              @select="selectSinger"></listview>
    <router-view></router-view>
  </div>
</template>
<script>
import { getSingerList } from 'api/singer.js'
import { ERR_OK } from 'api/config.js'
import Singer from 'common/js/singer.js'
import listview from 'base/listview'
import { mapMutations } from 'vuex'
const HOT_NAME = '热门'
const HOT_SINGER_LENGTH = 10
export default {
  name: 'singer',
  components: {
    listview
  },
  data () {
    return {
      singers: []
    }
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    selectSinger (item) {
      this.$router.push({
        path: `/singer/${item.id}`
      })
      this.setSinger(item)
      console.log(item)
    },
    _getSingerList () {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
        }
      })
    },
    _normalizeSinger (list) {
      // 将前10条作为热门的歌手列表展示
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      // 1.1 遍历JSON数据
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LENGTH) {
          // 1.1.1 push对象到目标数组中
          map.hot.items.push(new Singer(
            item.Fsinger_id,
            item.Fsinger_name,
            item.Fsinger_mid
          ))
        }
        // 关联 A、B、C...索引
        const key = item.Findex
        // 1.2 如果当前的索引关键字不存在
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        // 1.3 如果有，push数据
        map[key].items.push(new Singer(
          item.Fsinger_id,
          item.Fsinger_name,
          item.Fsinger_mid
        ))
        // console.log(map)
      })
      // 处理map数据，按照字母表顺序排列
      let hot = []
      let ret = []
      for (const key in map) {
        if (map.hasOwnProperty(key)) {
          const val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
      }
      // 英文排序
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      // 返回数据按照结构合并的数据
      return hot.concat(ret)
    }
  },
  created () {
    this._getSingerList()
  }
}
</script>
<style lang="stylus" scoped>
@import '~stylus/variable'
.singer
  position fixed
  top 88px
  bottom 0
  width 100%
</style>
