<template>
  <div class="add-area-pop">
    <div class="mask"></div>
    <el-card class="add-card">
      <p class="title">新建分区</p>
      <div class="input-block">
        <el-input
          placeholder="分区名称"
          v-model="areaName"
          clearable
        ></el-input>
        <el-color-picker v-model="areaColor"></el-color-picker>
      </div>
      <div class="btn-group">
        <el-button
          type="primary"
          plain
          @click="addAreaFinish"
          :disabled="areaName == ''"
          >创建分区</el-button
        >
        <el-button type="danger" plain @click="closeAddAreaPop">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

// <script>
import Middleware from "@/assets/js/Middleware";
import throttle from "@/utils/throttle";
import area from "@/api/area";
import { mapState } from "vuex";
export default {
  props: {
    noteId: Number,
  },
  data() {
    return {
      areaName: "",
      areaColor: "#" + Math.random().toString(16).substr(2, 6),
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  components: {},
  created() {},
  methods: {
    closeAddAreaPop() {
      this.$emit("closeAddAreaPop");
    },
    addAreaFinish: throttle(function () {
      // console.log(this.userInfo);
      area
        .addArea({
          userId: this.userInfo.id,
          noteId: this.noteId,
          areaName: this.areaName,
          areaColor: this.areaColor,
        })
        .then((res) => {
          // console.log(res);
          this.$message.success({ message: res.data.msg, center: true });
          Middleware.$emit("queryArea", true);
          this.closeAddAreaPop();
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
