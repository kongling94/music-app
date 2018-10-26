import { getLyric } from 'api/song'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'
import { guidNum } from 'api/singer'

// ES6 class 创建一个song的类
export default class Song {
  constructor ({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }
  /* getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  } */
}

export function createSong (musicData) {
  let image = musicData.albummid
    ? `https://y.gtimg.cn/music/photo_new/T002R300x300M000${
      musicData.albummid
    }.jpg?max_age=2592000`
    : musicData.image
  return new Song({
    id: musicData.songid || musicData.id,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    // 专辑
    album: musicData.albumname || musicData.album,
    // 歌曲时长
    duration: musicData.interval || musicData.duration,
    image: image,
    url: `http://dl.stream.qqmusic.qq.com/${musicData.filename}?vkey=${
      musicData.vkey
    }&guid=${guidNum}&uin=0&fromtag=66`
  })
}

export function filterSinger (singer) {
  let ret = []
  if (!singer || typeof singer === 'string') {
    return ''
  }
  singer.forEach(s => {
    ret.push(s.name)
  })
  return ret.join('/')
}
