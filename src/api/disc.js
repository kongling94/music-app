import axios from 'axios'
export function getDisc (id) {
  const url = '/api/disc'
  const data = Object.assign(
    {},
    {
      platform: 'yqq',
      onlysong: 0,
      hostUin: 0,
      needNewCode: 0,
      disstid: id,
      type: 1,
      json: 1,
      utf8: 1,
      format: 'json',
      g_tk: 5381,
      loginUin: 0,
      inCharset: 'utf8',
      outCharset: 'utf-8',
      notice: 0,
      jsonpCallback: 'playlistinfoCallback'
    }
  )
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
