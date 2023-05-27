import client from "@/utils/request";
// import axios from 'axios';

export default {

  //POST 实例 
  // 查询笔记
  queryNote(param) {
    return client.post("/note/editor/queryNote", param)
  },

  // 新增笔记
  addNote(param) {
    return client.post("/note/editor/addNote", param)
  },

  // 删除笔记
  deleteNote(param) {
    return client.post("/note/editor/deleteNote", param)
  },

  // 修改笔记
  updateNote(param) {
    return client.post("/note/editor/updateNote", param)
  },
}