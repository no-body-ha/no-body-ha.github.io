import client from "@/utils/request";
// import axios from 'axios';

export default {

  //POST 实例 
  // 查询分区
  queryArea(param) {
    return client.post("/area/editor/queryArea", param)
  },

  // 新增分区
  addArea(param) {
    return client.post("/area/editor/addArea", param)
  },

  // 删除分区
  deleteArea(param) {
    return client.post("/area/editor/deleteArea", param)
  },

  // 修改分区
  updateArea(param) {
    return client.post("/area/editor/updateArea", param)
  },
}