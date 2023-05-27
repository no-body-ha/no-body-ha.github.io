<template>
  <div class="search">
    <div class="search-message">
      <el-input
        placeholder="搜索"
        prefix-icon="el-icon-search"
        v-model="searchValue"
        @change="valueChange"
      >
      </el-input>
      <el-select
        v-model="searchType"
        @change="valueChange"
        placeholder="请选择"
      >
        <el-option
          v-for="item in searchOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.label == '无'"
        >
        </el-option>
      </el-select>
    </div>
    <div class="result-box">
      <div
        class="search-list"
        v-infinite-scroll="goSearch"
        infinite-scroll-disabled="disabled"
        v-if="searchList.length > 0"
      >
        <el-menu
          :collapse-transition="false"
          :default-active="searchSelect"
          class="el-menu-area"
          @select="pageSelect"
          v-for="(item, index) in searchList"
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
        <p class="loading-p" v-if="middleList.length == 0">没有更多了</p>
      </div>
      <div class="search-list" v-else>
        <el-empty
          description="没有找到结果"
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
import { mapState } from "vuex";
import Middleware from "@/assets/js/Middleware";
import throttle from "@/utils/throttle";
import page from "@/api/page";
import Mark from "mark.js";
export default {
  data() {
    return {
      searchText: "",
      searchOptions: [
        {
          value: "0",
          label: "所有笔记本",
        },
        {
          value: "1",
          label:
            this.activeNoteInfo == "" || this.activeNoteInfo == undefined
              ? "无"
              : "当前笔记本: " + this.activeNoteInfo.noteName,
        },
        {
          value: "2",
          label:
            this.activeAreaInfo == "" || this.activeNoteInfo == undefined
              ? "无"
              : "当前分区: " + this.activeAreaInfo.areaName,
        },
        {
          value: "3",
          label:
            this.activePageInfo == "" || this.activeNoteInfo == undefined
              ? "无"
              : "当前页面: " + this.deTag(this.activePageInfo.pageTitle),
        },
      ],
      middleList: [],
      searchList: [],
      searchType: "0",
      searchValue: "",
      count: 0,
      loading: false,
      searchSelect: "",
    };
  },
  computed: {
    ...mapState([
      "userInfo",
      "activeNoteInfo",
      "activeAreaInfo",
      "activePageInfo",
    ]),
  },
  watch: {
    activeNoteInfo(newValue) {
      if (newValue != "" && newValue != undefined) {
        this.searchOptions[1].label =
          "当前笔记本: " + this.activeNoteInfo.noteName;
      }
    },
    activeAreaInfo(newValue) {
      if (newValue != "" && newValue != undefined) {
        this.searchOptions[2].label =
          "当前笔记本: " + this.activeAreaInfo.areaName;
      }
    },
    activePageInfo(newValue) {
      if (newValue != "" && newValue != undefined) {
        this.searchOptions[3].label =
          "当前笔记本: " + this.deTag(this.activePageInfo.pageTitle);
      }
    },
  },
  components: {},
  created() {},
  methods: {
    // 去标签
    deTag(str) {
      // 用replace方法及正则表达式实现
      let str1 = str.replace(/<[^>]*>|<\/[^>]*/gi, "");
      // 定义一些特殊字符的正则表达式 如：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      return str1.replace(/&[a-zA-Z]{1,10};/gi, "").substr(0, 30);
    },
    getParams() {
      switch (this.searchType) {
        case "0": {
          return "";
        }
        case "1": {
          return this.activeNoteInfo.noteId;
        }
        case "2": {
          return this.activeAreaInfo.areaId;
        }
        case "3": {
          return this.activePageInfo.pageId;
        }
      }
    },
    valueChange() {
      this.count = 0;
      this.goSearch();
    },
    goSearch: throttle(function () {
      this.loading = true;
      if (this.count == 0) {
        this.searchList = [];
      }
      page
        .searchPage({
          userId: this.userInfo.id,
          type: this.searchType,
          searchValue: this.searchValue,
          typeId: this.getParams(),
          count: this.count,
        })
        .then((res) => {
          console.log(res);
          this.loading = false;
          this.count += 15;
          this.middleList = res.data.data;
          this.searchList.push.apply(this.searchList, this.middleList);
          // 设置高亮
          this.$nextTick(() => {
            let scaleArea = document.getElementsByClassName("scale-area")[0];
            let searchList = document.getElementsByClassName("search-list")[0];
            this.instance1 = new Mark(scaleArea);
            this.instance2 = new Mark(searchList);
            this.instance1.mark(this.searchValue);
            this.instance2.mark(this.searchValue);
          });
        });
    }, 1000),
    pageSelect(index) {
      // 先去除高亮
      this.searchSelect = index;
      Middleware.$emit("pageMsg", this.searchList[index]);
      Middleware.$emit("isNoteDetail", true);
      Middleware.$emit("otherChangeIndex", {
        noteId: this.searchList[index].noteId,
        areaId: this.searchList[index].areaId,
        pageId: this.searchList[index].pageId,
      });
      // 设置高亮
      this.$nextTick(() => {
        let scaleArea = document.getElementsByClassName("scale-area")[0];
        let searchList = document.getElementsByClassName("search-list")[0];
        this.instance1 = new Mark(scaleArea);
        this.instance2 = new Mark(searchList);
        this.instance1.mark(this.searchValue);
        this.instance2.mark(this.searchValue);
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.search {
  display: flex;
  flex-direction: column;
  position: relative;
}
.search-message {
  border-right: 2px solid #edebe9;
  display: flex;
  flex-direction: column;
  align-items: center;
  // position: relative;
  > * {
    width: 90%;
    margin: 8px 0;
  }
}
.result-box {
  width: 100%;
  position: absolute;
  top: 112px;
  bottom: 0;
  border-top: 1px solid #edebe9;
  .search-list {
    height: 100%;
    overflow-y: scroll;
    position: relative;
    border-right: 2px solid #edebe9;
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
.search-list::-webkit-scrollbar {
  width: 2px;
  background-color: #edebe9;
  border-radius: 16px;
}
.search-list::-webkit-scrollbar-thumb {
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
::v-deep .el-select-dropdown__wrap,
.el-scrollbar__wrap {
  margin-bottom: 0;
}
</style>
