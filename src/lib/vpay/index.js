import vpay from './vpay'

const myplugin = {
  install (Vue, options) {
    // 注册组件
    Vue.component('vpay', vpay)
  }
}

export default myplugin
