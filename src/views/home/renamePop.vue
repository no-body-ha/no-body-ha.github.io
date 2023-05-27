<template>
  <div class="rename-pop">
    <div class="mask"></div>
    <el-card class="add-card">
      <p class="title">重命名</p>
      <div class="input-block" v-if="renameType == 'note'">
        <el-input
          placeholder="笔记名称"
          v-model="editorMsg.noteName"
          clearable
        ></el-input>
        <el-color-picker v-model="editorMsg.noteColor"></el-color-picker>
      </div>
      <div class="input-block" v-else-if="renameType == 'area'">
        <el-input
          placeholder="分区名称"
          v-model="editorMsg.areaName"
          clearable
        ></el-input>
        <el-color-picker v-model="editorMsg.areaColor"></el-color-picker>
      </div>
      <div class="input-block" v-else-if="renameType == 'page'">
        <el-input
          placeholder="页面名称"
          v-model="editorMsg.pageName"
          clearable
        ></el-input>
      </div>
      <div class="btn-group">
        <el-button type="primary" plain @click="renameFinish">确认</el-button>
        <el-button type="danger" plain @click="closeRenamePop">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import Middleware from "@/assets/js/Middleware";
import throttle from "@/utils/throttle";
import note from "@/api/note";
import area from "@/api/area";
export default {
  props: {
    renameType: String,
    renameMsg: Object,
  },
  data() {
    return {
      editorMsg: JSON.parse(JSON.stringify(this.renameMsg)),
    };
  },
  components: {},
  created() {
    // console.log(this.editorMsg);
  },
  methods: {
    closeRenamePop() {
      this.$emit("closeRenamePop");
    },
    renameFinish: throttle(function () {
      if (this.renameType == "note") {
        note
          .updateNote({
            noteId: this.editorMsg.noteId,
            noteName: this.editorMsg.noteName,
            noteColor: this.editorMsg.noteColor,
          })
          .then((res) => {
            // console.log(res);
            this.$message.success({ message: res.data.msg, center: true });
            Middleware.$emit("queryNote", true);
            this.closeRenamePop();
          });
      } else if (this.renameType == "area") {
        area
          .updateArea({
            areaId: this.editorMsg.areaId,
            areaName: this.editorMsg.areaName,
            areaColor: this.editorMsg.areaColor,
          })
          .then((res) => {
            // console.log(res);
            this.$message.success({ message: res.data.msg, center: true });
            Middleware.$emit("queryArea", true);
            this.closeRenamePop();
          });
      } else if (this.renameType == "page") {
        console.log("page");
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
    display: flex;
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
