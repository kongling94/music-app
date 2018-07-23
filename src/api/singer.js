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
    guid: guidNum,
    jsonpCallback: 'MusicJsonCallback898829490820267',
    callback: 'MusicJsonCallback898829490820267'
  })
  return jsonp(url, data)
}

export function _guid () {
  let random = parseInt(Math.random() * 2147483647)
  let time = parseInt(new Date().getUTCMilliseconds())
  let result = (random * time) % 1e10
  // let t = new Date().getUTCMilliseconds()
  // return (Math.round(2147483647 * Math.random()) * t) % 1e10
  return result
}

export const guidNum = _guid()

// QQ音乐官方的Guid方法

/* function _getGuid () {
  if (_guid.length > 0) return _guid
  var e = MUSIC.cookie.get('pgv_pvid')
  if (e && e.length > 0) return (_guid = e)
  var t = new Date().getUTCMilliseconds()
  return (
    (_guid = (Math.round(2147483647 * Math.random()) * t) % 1e10),
    (document.cookie =
      'pgv_pvid=' +
      _guid +
      '; Expires=Sun, 18 Jan 2038 00:00:00 GMT; PATH=/; DOMAIN=qq.com;'),
    _guid
  )
} */
