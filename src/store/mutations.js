import * as types from './mutation-type'
const mutations = {
  // 设置SET_SINGER方法
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  }
}
// 对外输出
export default mutations
