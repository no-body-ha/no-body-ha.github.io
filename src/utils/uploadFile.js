import axios from 'axios'
import Middleware from '@/assets/js/Middleware'

import store from '@/store/state.js'

// import { calcImgSize } from './publicMethods'

const config = {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
  // onUploadProgress: (progressEvent) => {},
}

// 上传文件
// id是发送对象的 id
export function uploadFile(file, userInfo) {
  const param = new FormData()
  param.append('Attachment', file)
  param.append('Domain', store.serviceInfo.shop)
  param.append('ResType', 'attachment')
  param.append('no_domain_param', 1) // 手动加domian
  if (userInfo) {
    param.append('CustomerId', userInfo.cusId)
    param.append('UserName', userInfo.cusName)
    param.append('CustomerServiceId', store.serviceInfo.id)
    param.append('CustomerService', store.serviceInfo.userName)
  }

  return axios.post(
    `${process.env.VUE_APP_API_URL}upload_file`,
    param,
    config
  )
}

// 读取本地文件
export function readFile(fileData) {
  // // 创建用来读取此文件的对象
  // const reader = new FileReader()
  // // 使用该对象读取file文件
  // reader.readAsDataURL(fileData)
  // // 读取文件也需要一定时间，所以这里返回一个 promise
  // return new Promise((resolve) => {
  //   // 读取文件成功后执行的方法函数
  //   reader.onload = (e) => {
  //     resolve(e.target.result)
  //   }
  // })
  return window.URL.createObjectURL(fileData)
}

// 判断上传的文件是否是图片并执行对应的回调
// file：需要上传的文件    userInfo：需要发送的用户信息
export function readAndUploadFile(file, userInfo) {
  // console.log(userInfo)
  // 判断文件是否超过 30M
  // if (file.size > 1024 * 1024 * 10) {
  //   console.log('The maximum file size is not allowed to exceed 10M')
  //   return
  // }

  const timestamp = new Date().getTime()

  // 判断是否为图片类型
  const type = /(jpg|jpeg|png|gif)/.test(file.type) ? 'img' : 'attachment'
  Middleware.$emit('sendFile', {
    file,
    timestamp,
    src: window.URL.createObjectURL(file),
    type
  })
  reSendFile(file, userInfo, type, timestamp)
}

// 重发文件的回调
export function reSendFile(file, userInfo, type, timestamp) {
  uploadFile(file, userInfo, type).then((res) => {
    // 图片发送成功的操作
    const imgUrl = res.data.data.Src + `?size=${res.data.data.Width}x${res.data.data.Height}`
    console.log(imgUrl)

    // websocket中发送消息
    // websocket的10秒内没有接收到服务器响应算作发送失败
    sendWS(file, imgUrl, userInfo, type, timestamp, userInfo)
    // this.timer = setTimeout(() => {
    //   clearTimeout(this.timer)
    // }, 10000)
  }).catch(err => {
    console.log(err)
    uploadFileFail(timestamp)
  })
}

// 发送websocket
// id是顾客id，type是发送文件的类型
function sendWS(file, imgUrl, userInfo, type, timestamp) {
  window.$ws.send(
    JSON.stringify({
      data: file.name,
      target: userInfo.cusId + '',
      type,
      format: 'message',
      cid: store.serviceInfo.id + '',
      sid: userInfo.sid,
      timeStamp: timestamp + '',
      cname: store.serviceInfo.userName,
      facesColor: store.serviceInfo.color,
      src: imgUrl,
      uname: userInfo.cusName
      // shop_name: this.$store.state.shop
      // chat_type: 'attachment'
    })
  )
}

// 发送失败的回调
function uploadFileFail(timestamp) {
  // 通过事件总线发送一个发送失败的事件
  Middleware.$emit('uploadFileFail', timestamp)
}
