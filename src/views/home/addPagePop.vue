<template>
  <div class="add-page-pop">
    <div class="mask"></div>
    <el-card class="add-card">
      <p class="title">新建页面</p>
      <div class="input-block">
        <el-input
          placeholder="页面名称"
          v-model="pageName"
          clearable
        ></el-input>
      </div>
      <div class="btn-group">
        <el-button
          type="primary"
          plain
          @click="addPageFinish"
          :disabled="pageName == ''"
          >创建页面</el-button
        >
        <el-button type="danger" plain @click="closeAddPagePop">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import Middleware from "@/assets/js/Middleware";
import throttle from "@/utils/throttle";
import page from "@/api/page";
import { mapState } from "vuex";
export default {
  props: {
    noteId: Number,
    areaId: Number,
  },
  data() {
    return {
      pageName: "",
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  components: {},
  created() {
    // console.log(this.noteId);
    // console.log(this.areaId);
  },
  methods: {
    closeAddPagePop() {
      this.$emit("closeAddPagePop");
    },
    addPageFinish: throttle(function () {
      console.log(this.userInfo);
      let now = new Date().toLocaleString();
      page
        .addPage({
          userId: this.userInfo.id,
          noteId: this.noteId,
          areaId: this.areaId,
          createTime: now,
          uploadTime: now,
          pageTitle: this.pageName,
        })
        .then((res) => {
          // console.log(res);
          this.$message.success({ message: res.data.msg, center: true });
          Middleware.$emit("queryPage", true);
          this.closeAddPagePop();
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
</style>
