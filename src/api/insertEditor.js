import client from "@/utils/request";
// import axios from 'axios';

export default {

  //POST 实例 
  // 上传文件
  uploadfile(param) {
    return client.post("/v1/editor/uploadFile", param)
  },
}