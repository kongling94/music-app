import jsonp from 'common/js/jsonp.js'
import { commonParams, options } from './config.js'

export function getTopList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    needNewCode: 0,
    platform: 'h5'
  })
  return jsonp(url, data, options)
}
export function getMusicList (id) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  const data = Object.assign({}, commonParams, {
    page: 'detail',
    type: 'top',
    platform: 'h5',
    tpl: 3,
    eedNewCode: 1,
    topid: id
  })
  return jsonp(url, data, options)
}
