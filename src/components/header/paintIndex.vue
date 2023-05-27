<template>
  <div class="paint-index">
    <redo-undo></redo-undo>
  </div>
</template>

<script>
import redoUndo from "@/components/header/redoUndo";
export default {
  data() {
    return {};
  },
  components: {
    "redo-undo": redoUndo,
  },
  created() {},
  methods: {},
};
</script>

<style lang='scss' scoped>
.paint-index {
  border-bottom: solid 1px #e6e6e6;
  > * {
    margin: 4px 0;
  }
}
</style>
