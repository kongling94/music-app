import Vuex from 'vuex'
import Vue from 'vue'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutation from './mutation'
import createdLogger from 'vuex/dist/logger'
Vue.use(Vuex)

// 环境监测
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  mutation,
  actions,
  getters,
  // 开启严格模式
  strict: debug,
  // 打印修改日志
  plugins: debug ? [createdLogger()] : []
})
