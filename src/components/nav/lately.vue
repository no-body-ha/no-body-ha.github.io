<template>
  <div class="lately">
    <div class="notebook-layout">
      <span><b>最近笔记</b></span>
    </div>
    <div class="result-box">
      <div
        class="lately-list"
        v-infinite-scroll="queryLately"
        infinite-scroll-disabled="disabled"
        v-if="latelyList.length > 0"
      >
        <el-menu
          :collapse-transition="false"
          :default-active="selectLately"
          class="el-menu-lately"
          @select="latelySelect"
          v-for="(item, index) in latelyList"
          :key="index"
        >
          <el-menu-item
            :index="index + ''"
            :title="
              deTag(item.pageTitle) == '' ? '无标题页' : deTag(item.pageTitle)
            "
          >
            <span class="page-name">{{
              deTag(item.pageTitle) == "" ? "无标题页" : deTag(item.pageTitle)
            }}</span>
            <span class="note">{{ item.noteName }} >> {{ item.areaName }}</span>
          </el-menu-item>
        </el-menu>
        <p class="loading-p" v-if="loading">加载中...</p>
        <p class="loading-p" v-if="middleList.length">没有更多了</p>
      </div>
      <div class="lately-list" v-else>
        <el-empty
          description="没有记录"
          style="
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          "
        ></el-empty>
      </div>
    </div>
  </div>
</template>

<script>
import page from "@/api/page";
import Middleware from "@/assets/js/Middleware";
import { mapState } from "vuex";
export default {
  data() {
    return {
      latelyList: [],
      middleList: [],
      selectLately: "",
      count: 0,
      loading: false,
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  components: {},
  created() {
    this.queryLately();
  },
  methods: {
    queryLately() {
      this.loading = true;
      page
        .queryLately({
          userId: this.userInfo.id,
          count: this.count,
        })
        .then((res) => {
          console.log(res);
          this.loading = false;
          this.count += 15;
          this.middleList = res.data.data;
          this.latelyList.push.apply(this.latelyList, this.middleList);
        });
    },
    // 去标签
    deTag(str) {
      // 用replace方法及正则表达式实现
      let str1 = str.replace(/<[^>]*>|<\/[^>]*/gi, "");
      // 定义一些特殊字符的正则表达式 如：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      return str1.replace(/&[a-zA-Z]{1,10};/gi, "").substr(0, 30);
    },
    latelySelect(index) {
      this.selectLately = index;
      Middleware.$emit("pageMsg", this.latelyList[index]);
      Middleware.$emit("isNoteDetail", true);
      Middleware.$emit("otherChangeIndex", {
        noteId: this.latelyList[index].noteId,
        areaId: this.latelyList[index].areaId,
        pageId: this.latelyList[index].pageId,
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.lately {
  position: relative;
}
.notebook-layout {
  display: flex;
  align-items: center;
  line-height: 47px;
  border-bottom: 1px solid #edebe9;
  border-right: 2px solid #edebe9;
  > * {
    margin: 0px 4px;
  }
  span {
    margin-left: 16px;
  }
}
.result-box {
  width: 100%;
  position: absolute;
  top: 48px;
  bottom: 0;
  .lately-list {
    height: 100%;
    overflow-y: scroll;
    border-right: 1px solid #edebe9;
    .page-name {
      line-height: 24px;
      font-size: 20px;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .note {
      line-height: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .loading-p {
      text-align: center;
      margin: 24px 0;
      color: #7719aa;
    }
    .el-menu-item {
      padding: 8px 0 !important;
    }
  }
}
.lately-list::-webkit-scrollbar {
  width: 2px;
  background-color: #edebe9;
  border-radius: 16px;
}
.lately-list::-webkit-scrollbar-thumb {
  background: #7719aa;
  border-radius: 16px;
}
.el-menu-item.is-active {
  color: #7719aa;
  background: #ecf5ff;
}
.el-menu-item {
  padding: 0 !important;
  height: 64px;
  line-height: 64px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  > * {
    margin-left: 16px;
  }
}
.el-menu-item.is-active:after {
  content: "";
  position: absolute;
  left: 0;
  height: 64px;
  width: 3px;
  background-color: #7719aa;
  top: 50%;
  transform: translateY(-50%);
}
</style>
