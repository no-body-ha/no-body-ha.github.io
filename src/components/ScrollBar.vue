<template>
  <simple-bar
    ref="simplebar"
    class="ScrollBar"
    data-simplebar-auto-hide="false"
  >
    <slot></slot>
  </simple-bar>
</template>

<script>
import SimpleBar from "simplebar-vue";
import "simplebar/dist/simplebar.min.css";

export default {
  name: "ScrollBar",
  components: { SimpleBar },
};
</script>

<style scoped>
.ScrollBar /deep/ .simplebar-scrollbar::before {
  background: #b9b9b9;
}
</style>
