<template>
  <div class="delete-pop">
    <div class="mask"></div>
    <el-card class="add-card">
      <p class="title">确认删除</p>
      <div class="input-block" v-if="deleteType == 'note'">
        是否要删除笔记
        <span style="color: #7719aa; word-break: break-all"
          >{{ deleteMsg.noteName }} </span
        >及笔记目录下所有的分区和页面?
      </div>
      <div class="input-block" v-else-if="deleteType == 'area'">
        是否要删除分区
        <span style="color: #7719aa; word-break: break-all"
          >{{ deleteMsg.areaName }} </span
        >及分区内所有页面?
      </div>
      <div class="input-block" v-else-if="deleteType == 'page'">
        是否要删除页面
        <span style="color: #7719aa; word-break: break-all"
          >{{ deleteMsg.pageName }} </span
        >?
      </div>
      <div class="btn-group">
        <el-button type="primary" plain @click="deleteFinish">删除</el-button>
        <el-button type="danger" plain @click="closeDeletePop">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import Middleware from "@/assets/js/Middleware";
import throttle from "@/utils/throttle";
import note from "@/api/note";
import area from "@/api/area";
import page from "@/api/page";
import { mapMutations } from "vuex";
export default {
  props: {
    deleteType: String,
    deleteMsg: Object,
  },
  data() {
    return {};
  },
  components: {},
  created() {
    // console.log(this.deleteType);
    // console.log(this.deleteMsg);
  },
  methods: {
    ...mapMutations([
      "setActiveNote",
      "setActiveArea",
      "setActivePage",
      "setActiveNoteInfo",
      "setActiveAreaInfo",
      "setActivePageInfo",
    ]),
    closeDeletePop() {
      this.$emit("closeDeletePop");
    },
    deleteFinish: throttle(function () {
      if (this.deleteType == "note") {
        note
          .deleteNote({
            noteId: this.deleteMsg.noteId,
          })
          .then((res) => {
            // console.log(res);
            this.$message.success({ message: res.data.msg, center: true });
            this.closeDeletePop();
            this.setActiveNote("0");
            this.setActivePageInfo("");
            Middleware.$emit("queryNote", true);
          });
      } else if (this.deleteType == "area") {
        area
          .deleteArea({
            areaId: this.deleteMsg.areaId,
          })
          .then((res) => {
            // console.log(res);
            this.$message.success({ message: res.data.msg, center: true });
            this.closeDeletePop();
            this.setActiveAreaInfo("");
            this.setActiveArea("0");
            Middleware.$emit("queryArea", true);
          });
      } else if (this.deleteType == "page") {
        page
          .deletePage({
            pageId: this.deleteMsg.pageId,
          })
          .then((res) => {
            // console.log(res);
            this.$message.success({ message: res.data.msg, center: true });
            this.closeDeletePop();
            this.setActivePage("0");
            this.setActivePageInfo("");
            Middleware.$emit("queryPage", true);
            Middleware.$emit("pageMsg", "");
          });
      }
    }, 3000),
  },
};
</script>

<style lang='scss' scoped>
.mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9;
}
.add-card {
  width: 30rem;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  > * > * {
    margin: 16px 8px;
  }
  .title {
    font-size: 24px;
    font-weight: 500;
    text-align: center;
  }
  .input-block {
    font-size: 18px;
    > * {
      margin: 0 8px;
    }
  }
  .btn-group {
    display: flex;
    justify-content: center;
    > * {
      margin: 0 16px;
    }
  }
}
::v-deep .el-card__body {
  display: flex;
  flex-direction: column;
}
</style>
