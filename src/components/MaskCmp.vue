<template>
  <div class="maskCmp" @click="clickMask" :style="{ backgroundColor: `rgba(0, 0, 0, ${alpha})` }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  // 遮罩层组件
  name: 'MaskCmp',
  props: {
    // 背景色透明度
    alpha: {
      type: Number,
      default () {
        return 0.7
      }
    }
  },
  methods: {
    // 监听遮罩层点击事件
    clickMask () {
      this.$emit('clickMask')
    }
  }
}
</script>

<style scoped>
.maskCmp {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
}
</style>
