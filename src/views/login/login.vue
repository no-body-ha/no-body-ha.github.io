<template>
  <div class="login">
    <!-- <img class="background-image" src="@/assets/images/login/login.png" /> -->
    <transition name="el-fade-in-linear"
      ><router-view></router-view
    ></transition>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {},
  methods: {},
};
</script>
<style lang='scss' scoped>
.login {
  width: 100%;
  height: 100%;
  background-image: url(../../assets/images/login/login.png);
  background-size: cover; /* 使图片平铺满整个浏览器（从宽和高的最大需求方面来满足，会使某些部分无法显示在区域中） */
  position: absolute; /* 不可缺少 */
  z-index: -1;
}
</style>
