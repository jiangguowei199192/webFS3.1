import axios from 'axios'
import qs from 'qs'
import {
  Message
} from 'element-ui'
// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://111.47.13.103:50017/gdu/' : 'http://111.47.13.103:50017/gdu/', // 请求前缀
  timeout: 5000, // 请求超时时间
  // crossDomain: true, // 设置cross跨域
  withCredentials: true // 设置cross跨域 并设置访问权限 允许跨域携带cookie信息
})

// 设置 post 默认 Content-Type
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 添加请求拦截器
service.interceptors.request.use((config) => {
  // 判断请求方式是否为POST，进行转换格式
  config.method === 'post' ? config.data = qs.stringify({ ...config.data }) : config.params = { ...config.params }// 请求发送前进行处理
  return config
},
(error) => {
  // 请求错误处理
  return Promise.reject(error)
}
)

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    if (response.data.code !== 0) {
      Message({
        message: response.data.msg,
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      return response
    }
  },
  (error) => {
    Message({
      message: error.response,
      type: 'error',
      duration: 5 * 1000
    })
  }
)

/**
 * 向外抛出service
 */
export default service