<template>
  <div class="header">
    <div class="icon"></div>
    <div class="text">{{title}}</div>
  </div>
</template>
<script>
export default {
  name: 'home-header',
  data () {
    return {
      title: '烤鸭的世界'
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~stylus/variable';
@import '~stylus/mixin';

.header {
  position: relative;
  height: 44px;
  text-align: center;
  color: $color-theme;
  font-size: 0;

  .icon {
    display: inline-block;
    vertical-align: top;
    margin-top: 6px;
    width: 30px;
    height: 32px;
    margin-right: 9px;
    bg-image('logo');
    background-size: 30px 32px;
  }

  .text {
    display: inline-block;
    vertical-align: top;
    line-height: 44px;
    font-size: $font-size-large;
  }
}
</style>
