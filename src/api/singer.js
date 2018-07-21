import jsonp from 'common/js/jsonp.js'
import { commonParams, options } from './config.js'

export function getSingerList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })
  return jsonp(url, data, options)
}
export function getSingerDetail (id) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?'
  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    singermid: id,
    order: 'listen',
    begin: 0,
    num: 50,
    songstatus: 1
  })
  return jsonp(url, data, options)
}
export function getSongVkey (mid) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?'
  const data = Object.assign({}, commonParams, {
    cid: 205361747,
    songmid: mid,
    filename: `C400${mid}.m4a`,
    platform: 'yqq',
    hostUin: 0,
    loginUin: 0,
    needNewCode: 0,
    guid: _guid(),
    jsonpCallback: 'MusicJsonCallback5827673999447271'
  })
  return jsonp(url, data)
}

function _guid () {
  let random = parseInt(Math.random() * 2147483647)
  let time = parseInt(new Date().getTime() * 1000)
  let reslut = (random * time) % 10000000000
  return reslut
}
