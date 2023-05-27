<template>
  <div class="img-preview">
    <div class="mask" @click="closePreview"></div>
    <!-- 富文本图片放大 -->
    <div class="imgDolg" @click="closePreview">
      <!-- <i class="el-icon-close" id="imgDolgClose" @click="closePreview"></i> -->
      <img class="pre-img" :src="imgPreview.img" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imgPreview: Object,
  },
  data() {
    return {};
  },
  components: {},
  created() {},
  methods: {
    closePreview() {
      this.$emit("closePreview");
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
  background: rgba(0, 0, 0, 0.4);
  z-index: 9;
}
.imgDolg {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
}
.pre-img {
  max-width: 90vw;
  max-height: 90vh;
}
</style>
