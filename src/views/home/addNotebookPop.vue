<template>
  <div class="add-notebook-pop">
    <div class="mask"></div>
    <el-card class="add-card">
      <p class="title">新建笔记</p>
      <div class="input-block">
        <el-input
          placeholder="笔记名称"
          v-model="noteName"
          clearable
        ></el-input>
        <el-color-picker v-model="noteColor"></el-color-picker>
      </div>
      <div class="btn-group">
        <el-button
          type="primary"
          plain
          @click="addFinish"
          :disabled="noteName == ''"
          >创建笔记</el-button
        >
        <el-button type="danger" plain @click="closeAddNotePop">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import Middleware from "@/assets/js/Middleware";
import throttle from "@/utils/throttle";
import note from "@/api/note";
import { mapState } from "vuex";
export default {
  data() {
    return {
      noteName: "",
      noteColor: "#" + Math.random().toString(16).substr(2, 6),
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  components: {},
  created() {},
  methods: {
    closeAddNotePop() {
      this.$emit("closeAddNotePop");
    },
    addFinish: throttle(function () {
      // console.log(this.userInfo);
      // console.log(noteName);
      // console.log(noteColor);
      note
        .addNote({
          userId: this.userInfo.id,
          noteName: this.noteName,
          noteColor: this.noteColor,
        })
        .then((res) => {
          // console.log(res);
          this.$message.success({ message: res.data.msg, center: true });
          Middleware.$emit("queryNote", true);
          this.closeAddNotePop();
        });
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
    > * {
      margin: 0 8px;
    }
  }
  .btn-group {
    display: flex;
    justify-content: center;
  }
}
::v-deep .el-card__body {
  display: flex;
  flex-direction: column;
}
::v-deep .el-color-picker__color {
  border: none;
}
</style>
