import axios from 'axios'
import { commonParams } from './config.js'

export function getLyric (mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    pcachetime: +new Date(),
    format: 'jsonp',
    jsonpCallback: 'MusicJsonCallback_lrc',
    callback: 'MusicJsonCallback_lrc'
  })

  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
