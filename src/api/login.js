import client from "@/utils/request";
// import axios from 'axios';

export default {

  //POST 实例 
  // 登录
  login(param) {
    return client.post("/v1/user/auth/login", param)
  },

  // 注册
  register(param) {
    return client.post("/v1/user/auth/register", param)
  },
}