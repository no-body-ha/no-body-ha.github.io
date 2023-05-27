<template>
  <div class="emojiBoxContainer">
    <div @click="clickBtn">
      <slot></slot>
    </div>
    <ScrollBar class="scrollbar" v-if="showEmojiBox">
      <ul class="emojiBox">
        <li
          v-for="index in totalNum"
          :key="index"
          class="emojiItem"
          @click="chooseEmoji(index)"
          :style="{ 'background-position': `0 ${-22 * index}px` }"
        ></li>
      </ul>
    </ScrollBar>
  </div>
</template>

<script>
// import simplebar from 'simplebar-vue'
import ScrollBar from "@/components/ScrollBar";

import "simplebar/dist/simplebar.min.css";

const DOM = { emojiBoxContainer: null };

export default {
  name: "EmojiBox",
  components: {
    ScrollBar,
  },
  data() {
    return {
      // 表情库
      // emojiLib,
      // 表情总数
      totalNum: 200,
      // 是否显示表情框
      showEmojiBox: false,
    };
  },
  mounted() {
    DOM.emojiBoxContainer = document.querySelector(".emojiBoxContainer");
  },
  methods: {
    // 点击emojiItem的回调
    chooseEmoji(index) {
      this.$emit("chooseEmoji", index);
      this.showEmojiBox = false;
    },

    // 点击 表情按钮 的回调
    clickBtn() {
      this.showEmojiBox = !this.showEmojiBox;
    },

    // 方法
    // 全局点击事件 : 判断是否关闭表情框
    clickFunc(eve) {
      const e = eve || window.event;
      // 关闭表情框需要满足的条件
      if (this.showEmojiBox && !DOM.emojiBoxContainer.contains(e.target)) {
        this.showEmojiBox = false;
      }
    },
  },
  watch: {
    showEmojiBox(current) {
      if (current) {
        document.addEventListener("mousedown", this.clickFunc, false);
      } else {
        document.removeEventListener("mousedown", this.clickFunc, false);
      }
    },
  },
};
</script>

<style scoped>
.emojiBoxContainer {
  display: inline-block;
  position: relative;
  z-index: 90;
}

::-webkit-scrollbar {
  /* for Mac OS X support */
  width: 0;
}

.scrollbar {
  width: 385px;
  height: 236px;
  position: absolute;
  top: 37px;
  left: 0px;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  background: #ffffff;
}

.scrollbar /deep/ .simplebar-content {
  height: unset !important;
}

.emojiBox {
  height: 100%;
  overflow-y: scroll;
  cursor: auto;
  display: flex;
  flex-wrap: wrap;
  /* padding: 26px; */

  /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
  -ms-overflow-style: none;
  /*火狐下隐藏滚动条*/
  scrollbar-width: none;
}

.emojiItem {
  /* color: black;
  font-size: 24px;
  width: 36px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  font-family: unset;
  cursor: pointer;
  margin-right: 6px;
  margin-bottom: 4px;
  box-sizing: border-box;
  user-select: none; */
  color: black;
  width: 22px;
  height: 22px;
  background: url("../assets/emojiLib/emoji.png") 0 0 no-repeat;
  text-decoration: none;
  list-style-type: none;
  user-select: none;
  /* -webkit-user-select: none; */
  cursor: pointer;
  margin-bottom: 10px;
  margin-right: 15px;
}
</style>
