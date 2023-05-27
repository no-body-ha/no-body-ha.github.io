import client from "@/utils/request";
// import axios from 'axios';

export default {

  //POST 实例 
  // 查询页面
  queryPage(param) {
    return client.post("/page/editor/queryPage", param)
  },

  // 新增页面
  addPage(param) {
    return client.post("/page/editor/addPage", param)
  },

  // 删除页面
  deletePage(param) {
    return client.post("/page/editor/deletePage", param)
  },

  // 修改页面
  updatePage(param) {
    return client.post("/page/editor/updatePage", param)
  },

  // 模糊搜索
  searchPage(param) {
    return client.post("/page/editor/searchPage", param)
  },

  // 查询最近打开
  queryLately(param) {
    return client.post("/page/editor/queryLately", param)
  },
}