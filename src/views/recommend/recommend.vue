<template>
  <div class="recommend">
   {{data}}
  </div>
</template>
<script>
import { getRecommend } from 'api/recommend.js'
import { ERR_OK } from 'api/config.js'
// import axios from 'axios'
export default {
  name: 'recommend',
  data () {
    return {
      data: '',
      slider: ''
    }
  },
  methods: {
    _getRecommend () {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          console.log(res.data)
          // this.data = res.data.slider
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
@import '~stylus/variable';
</style>
