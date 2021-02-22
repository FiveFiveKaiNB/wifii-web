import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.headers['client'] = 'web'
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      const token = getToken()
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 提示
function showMessage() {
  MessageBox.confirm('您的账号被登出，请重新登录', '账号登出', {
    confirmButtonText: '重新登录',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.dispatch('user/resetToken').then(() => {
      location.reload()
    })
  })
  return Promise.reject(new Error('账号异常或登出'))
}

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const { status, data } = response
    return new Promise((resolve, reject) => {
      if (status === 401) {
        showMessage()
      }
      if (status !== 200) {
        reject(new Error(data.msg || 'Error'))
      }
      if (data.code !== 20000) {
        Message({
          message: data.msg,
          type: 'error',
          duration: 5 * 1000
        })
        if (data.code === 40001 || data.code === 40002 || data.code === 40003) {
          showMessage()
        }
        reject(new Error(data.msg || 'Error'))
      }
      resolve(data)
    })
  },
  error => {
    Message({
      message: error.response.data.errMsg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
