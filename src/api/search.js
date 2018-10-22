import jsonp from 'common/js/jsonp.js'
import axios from 'axios'
import { commonParams, options } from './config.js'

export function getHotKey () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, commonParams, {
    needNewCode: 0,
    loginUin: 0,
    hostUin: 0
  })
  return jsonp(url, data, options)
}

export function getSearchList (query, page, zhida) {
  const url = '/api/searchList'
  const data = Object.assign({}, commonParams, {
    w: query,
    zhidaqu: 1,
    catZhida: zhida ? 1 : 0,
    flag: 1,
    aggr: 0,
    sem: 1,
    ie: 'utf-8',
    perpage: 20,
    n: 20,
    p: page,
    remoteplace: 'txt.mqq.all',
    platform: 'h5',
    needNewCode: 1,
    format: 'jsonp'
  })
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
