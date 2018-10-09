import axios from 'axios'
// qs模块 用于处理post数据的序列化
import QS from 'qs'
// iview message组件 信息提示框
import { Message } from 'iview'

// 请求拦截 登录状态的判断、post序列化

// 2.1先导入vuex,因为我们要使用到里面的状态对象
import store from '@/store/index'
import { resolve } from 'path'

// 1.1 环境检测
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'https://www.badiu.com'
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'https://www.sina.com'
} else if (process.env.NODE_ENV === 'debug') {
  axios.defaults.baseURL = 'https://www.163.com'
}
// 1.2 超时处理
axios.defaults.timeout = 10000
// 1.3 post请求头
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8'
// 2.2 请求拦截器
axios.interceptors.request.use(
  config => {
    // 每次发送请求之前判断vuex中是否存在token
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    const token = store.state.token
    token && (config.headers.Authorization = token)
    return config
  },
  error => {
    return Promise.error(error)
  }
)
// 2.3 响应拦截器
axios.interceptors.response.use(
  response => {
    // 200 请求成功
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    if (error.response.status) {
      switch (error.response) {
        // 未登录
        case 401:
          toLogin()
          break
        // 登录超时
        case 403:
          tip('warning', '登录过期，请重新登录.')
          toLogin()
          // 清除token
          localStorage.removeItem('token')
          store.commit('loginSuccess', null)
          // 设置延时跳转
          setTimeout(() => {}, 1000)
          break
        // 请求不存在
        case 404:
          tip('error', '网络请求不存在.')
          break
        // 错误时，抛出错误
        default:
      }
      return Promise.reject(error.response)
    }
  }
)

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params  [请求携带的参数]
 */
export function get (url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post (url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, QS.stringify(params))
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
const toLogin = () => {
  router.replace({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

const tip = (type, msg) => {
  Message.type({
    content: msg,
    duration: 2
  })
}
