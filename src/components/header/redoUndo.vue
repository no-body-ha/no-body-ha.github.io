<template>
  <div class="redoUndo">
    <div
      class="undo-btn"
      :class="haveDo ? 'active' : ''"
      @click="undo"
      title="撤销"
    >
      <svg-icon width="20" height="20" name="undo"></svg-icon>
    </div>
    <div
      class="redo-btn"
      :class="canRedo ? 'active' : ''"
      @click="redo"
      title="恢复"
    >
      <svg-icon width="20" height="20" name="redo"></svg-icon>
    </div>
  </div>
</template>

<script>
import Middleware from "@/assets/js/Middleware";
export default {
  data() {
    return {
      haveDo: false,
      canRedo: false,
    };
  },
  components: {},
  created() {
    Middleware.$on("change", (data) => {
      this.haveDo = data;
    });
  },
  methods: {
    undo() {
      if (this.haveDo) {
        console.log("undo");
        document.execCommand("undo");
        this.canRedo = true;
        if (!document.execCommand("undo")) {
          this.haveDo = false;
        }
      }
    },
    redo() {
      if (this.canRedo) {
        console.log("redo");
        document.execCommand("redo");
        // this.canRedo = false;
        this.haveDo = true;
        if (!document.execCommand("redo")) {
          this.canRedo = false;
        }
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.redoUndo {
  margin: 0 4px;
  display: inline-block;
}
.undo-btn,
.redo-btn {
  width: 36px;
  height: 36px;
  color: #909399;
  display: inline-block;
  line-height: 36px;
  text-align: center;
  cursor: pointer;
}
.active {
  color: #000000;
}
.active:hover {
  background: #e1dfdd;
}
</style>
