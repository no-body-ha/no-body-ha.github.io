<template>
  <div class="add-link-pop" ref="popCard">
    <div class="mask" @click="closeAddLinkPop"></div>
    <el-card class="add-card">
      <div class="input-block">
        <label>要显示的文本</label>
        <el-input v-model="addressText"></el-input>
      </div>
      <div class="input-block">
        <label>链接</label>
        <el-input v-model="address"></el-input>
      </div>
      <div class="btn-group">
        <el-button
          type="primary"
          plain
          @click="addLinkFinish"
          :disabled="address == ''"
          >插入</el-button
        >
      </div>
    </el-card>
  </div>
</template>

// <script>
// import throttle from "@/utils/throttle";
export default {
  props: {
    // cursorPosition: { x: 0, y: 0 },
  },
  data() {
    return {
      addressText: "",
      address: "",
    };
  },
  components: {},
  created() {
    this.$nextTick(() => {
      // this.$refs.popCard.style.left = this.cursorPosition.x;
      // this.$refs.popCard.style.top = this.cursorPosition.y;
    });
  },
  methods: {
    closeAddLinkPop() {
      this.$emit("closeAddLinkPop");
    },
    addLinkFinish() {
      if (!this.addressText) this.addressText = this.address;
      this.$emit("addLinkFinish", this.addressText, this.address);
    },
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
  z-index: 9;
}
.add-card {
  width: 30rem;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  .input-block {
    display: flex;
    flex-direction: column;
    > div {
      margin: 16px 0px;
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
