/**
 * @name: request
 * @author: Chuwen
 * @date: 2021-04-15 16:38
 * @description：request
 * @update: 2021-04-15 16:38
 */

import axios from 'axios';
// import md5 from 'md5';
// import store from '@/store';
import utilsAuth from '@/utils/auth';
import router from '../router';

//const moment = require('moment');

//接口地址
const URL = process.env.VUE_APP_API_URL;

//验证用户的数据（假数据）
//TODO：后面需要改为自己的逻辑
const client = axios.create({
  baseURL: URL,
  //不携带 Cookie，这样的话 Access-Control-Allow-Origin 就允许为 *
  //参考链接：https://nowtime.cc/nginx/1360.html
  //        https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  }
})

//对请求前的拦截器
client.interceptors.request.use(
  config => {
    config.headers['Authorization'] = utilsAuth.getToken();
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

//对响应的拦截器
client.interceptors.response.use(res => {
  //TODO 隐藏加载框
  switch (res.data.code) {
    case '502':
    case '401':
    case '503':
      // TODO 登陆、请求失败等相关信息，然后跳转到登录页面
      // router.replace({name: 'signin'})
      router.replace('/login')
      break;
  }


  return res
}, error => {
  //TODO 隐藏加载框
  if (error && error.response && error.response.status) {
    switch (error.response.status) {
      case 400:
        error.msg = '错误请求'
        break;
      case 401:
        error.msg = '未授权，请重新登录'
        router.replace('/login')
        break;
      case 403:
        error.msg = '拒绝访问'
        break;
      case 404:
        error.msg = '请求错误,未找到该资源'
        break;
      case 405:
        error.msg = '请求方法未允许'
        break;
      case 408:
        error.msg = '请求超时'
        break;
      case 500:
        error.msg = '服务器端出错'
        break;
      case 501:
        error.msg = '网络未实现'
        break;
      case 502:
        error.msg = '网络错误'
        break;
      case 503:
        error.msg = '服务不可用'
        break;
      case 504:
        error.msg = '网络超时'
        break;
      case 505:
        error.msg = 'http版本不支持该请求'
        break;
      default:
        error.msg = `连接错误 ${error.response.status}`
    }
  } else {
    error.msg = '连接错误'
  }
  if (error.data) {
    error.data.status = 'fail'
    error.data.msg = error.msg
  }

  return Promise.reject(error)
})

export default client