<template>
  <div class="header-bar">
    <el-menu
      :default-active="activeIndex"
      class="el-menu"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="1">开始</el-menu-item>
      <el-menu-item index="2">插入</el-menu-item>
      <el-menu-item index="3">绘图</el-menu-item>
      <el-menu-item index="4">视图</el-menu-item>
      <el-dropdown
        trigger="click"
        class="user-dropdown"
        @command="handleCommand"
      >
        <div class="user-name">
          <span>{{ userInfo.name }}</span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="loginOut"> 退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div
        class="upload"
        :title="'已同步' + uploadTime"
        @click="save"
        v-if="!loading"
      >
        <svg-icon width="24" height="24" name="upload"></svg-icon>
      </div>
      <div class="loading" title="正在同步…" v-else>
        <svg-icon width="24" height="24" name="loading"></svg-icon>
      </div>
    </el-menu>
    <start-index v-show="activeIndex == 1"></start-index>
    <insert-index v-show="activeIndex == 2"></insert-index>
    <paint-index v-show="activeIndex == 3"></paint-index>
    <view-index v-show="activeIndex == 4"></view-index>
  </div>
</template>

<script>
import Middleware from "@/assets/js/Middleware";
import startIndex from "@/components/header/startIndex";
import insertIndex from "@/components/header/insertIndex";
import paintIndex from "@/components/header/paintIndex";
import viewIndex from "@/components/header/viewIndex";
import { mapState } from "vuex";
export default {
  data() {
    return {
      activeIndex: "1",
      loading: false,
      uploadTime: "",
    };
  },
  components: {
    "start-index": startIndex,
    "insert-index": insertIndex,
    "paint-index": paintIndex,
    "view-index": viewIndex,
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  created() {
    Middleware.$on("loading", (data) => {
      this.loading = data;
    });
    Middleware.$on("uploadTime", (data) => {
      this.uploadTime = data;
    });
  },
  methods: {
    handleSelect(key, keyPath) {
      this.activeIndex = key;
      console.log(key, keyPath);
    },
    handleCommand(command) {
      console.log(command);
      this.$router.push("/login");
    },
    save() {
      Middleware.$emit("save", true);
    },
  },
};
</script>

<style lang='scss' scoped>
.header-bar {
  min-width: 504px;
}
.upload {
  line-height: 36px;
  float: right;
  margin-right: 16px;
  cursor: pointer;
}
.loading {
  line-height: 36px;
  float: right;
  margin-right: 16px;
  cursor: pointer;
  > * {
    -webkit-animation: rotate 1s linear infinite;
    animation: rotate 1s linear infinite;
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg); /* IE 9 */
    -moz-transform: rotate(0deg); /* Firefox */
    -o-transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg); /* IE 9 */
    -moz-transform: rotate(360deg); /* Firefox */
    -o-transform: rotate(360deg);
  }
}
@-webkit-keyframes rotate {
  0% {
    transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg); /* IE 9 */
    -moz-transform: rotate(0deg); /* Firefox */
    -o-transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg); /* IE 9 */
    -moz-transform: rotate(360deg); /* Firefox */
    -o-transform: rotate(360deg);
  }
}
.user-dropdown {
  float: right;
  margin-right: 48px;
}
.user-name {
  font-weight: 600;
  color: #7719aa;
  line-height: 36px;
  display: inline-block;
  cursor: pointer;
}
.el-menu-item {
  padding: 0 16px;
}
.el-menu,
.el-menu--horizontal {
  border-bottom: none;
}
.el-menu--horizontal > .el-menu-item {
  height: 36px;
  line-height: 36px;
  border-bottom: none;
}
.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: none;
}
.el-menu-item.is-active:after {
  content: "";
  position: absolute;
  bottom: 0;
  height: 2px;
  width: 30px;
  background-color: #7719aa;
  left: 50%;
  transform: translateX(-50%);
}
.el-dropdown-menu {
  top: 20px !important;
  // // right: 48px !important;
  // left: 1413px !important;
}
.el-dropdown-menu__item {
  white-space: nowrap;
}
</style>
