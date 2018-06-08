<template>
  <div class="slider" v-if="sliderList">
    <swiper :options="swiperOption" ref="mySwiper">
      <!-- slides -->
      <swiper-slide v-for="item in sliderList" :key="item.id">
        <a :href="item.linkUrl">
          <img :src="item.picUrl" alt="">
        </a>
      </swiper-slide>
      <!-- Optional controls -->
      <!-- <div class="swiper-pagination"  slot="pagination"></div> -->
      <!-- <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div> -->
      <div class="swiper-scrollbar" slot="scrollbar"></div>
    </swiper>
  </div>
</template>
<script>
// import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'slider',
  props: ['sliderList'],
  components: {
    swiper,
    swiperSlide
  },
  data () {
    return {
      swiperOption: {
        autoplay: {delay: 1000},
        loop: true,
        scrollbar: {
          el: '.swiper-scrollbar'
        },
        observer: true,
        observeParents: true,
        effect: 'fade'
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~stylus/variable';

.slider >>> .swiper-slide
  min-height 150px
.slider >>> .swiper-scrollbar-drag
  background-color rgba(255,205,50,0.8)
.slider
  min-height: 1px
  .swiper-slide
    a
      display block
      img
        height 100%
        width 100%
</style>
