<template>
  <div class="home">
    <header-bar></header-bar>
    <div class="container">
      <nav-bar></nav-bar>
      <div class="main">
        <editor-box></editor-box>
      </div>
    </div>
  </div>
</template>

<script>
import headerBar from "@/components/home/headerBar";
import navBar from "@/components/home/navBar";
import editorBox from "@/components/home/editorBox";
export default {
  data() {
    return {};
  },
  watch: {},
  components: {
    "header-bar": headerBar,
    "nav-bar": navBar,
    "editor-box": editorBox,
  },
  methods: {},
};
</script>
<style lang='scss' scoped>
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.container {
  width: 100%;
  height: 100%;
  display: flex;
  // background: #ecdacb;
}
.main {
  width: 100%;
  height: 89vh;
  overflow: hidden;
}
</style>
