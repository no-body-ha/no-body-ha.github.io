<template>
  <div class="note-detail">
    <add-area-pop
      v-if="isAddArea"
      :noteId="notebookList[activeNote].noteId"
      @closeAddAreaPop="isAddArea = false"
    ></add-area-pop>
    <add-page-pop
      v-if="isAddPage"
      :noteId="notebookList[activeNote].noteId"
      :areaId="areaList[activeArea].areaId"
      @closeAddPagePop="isAddPage = false"
    ></add-page-pop>
    <delete-pop
      :deleteType="deleteType"
      :deleteMsg="deleteMsg"
      @closeDeletePop="isDelete = false"
      v-if="isDelete"
    >
    </delete-pop>
    <rename-pop
      :renameType="renameType"
      :renameMsg="renameMsg"
      @closeRenamePop="isRename = false"
      v-if="isRename"
    ></rename-pop>
    <div class="notebook-layout" v-if="notebookList.length > 0" @click="goNav">
      <span
        class="note-icon"
        :style="'color:' + notebookList[activeNote].noteColor"
        ><svg-icon width="20" height="20" name="notebook"></svg-icon
      ></span>
      <span style="font-weight: 600">{{
        notebookList[activeNote].noteName
      }}</span>
      <span><svg-icon width="16" height="16" name="down"></svg-icon></span>
    </div>
    <!-- <el-dropdown
      trigger="click"
      placement="bottom-start"
      @command="handleSortCommand"
    >
      <span class="sort"
        ><svg-icon width="20" height="20" name="sort"></svg-icon
      ></span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="0"> <span>无</span></el-dropdown-item>
        <el-dropdown-item command="1"> <span>创建时间</span></el-dropdown-item>
        <el-dropdown-item command="2"> <span>修改时间</span></el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown> -->

    <div class="notebook-message">
      <div class="area-box">
        <div class="notebook-area" v-if="areaList.length > 0">
          <el-menu
            :collapse-transition="false"
            :default-active="activeArea"
            class="el-menu-area"
            @select="areaSelect"
            v-for="(item, index) in areaList"
            :key="index"
          >
            <el-menu-item :index="index + ''" :title="item.areaName">
              <span class="area-icon" :style="'color:' + item.areaColor"
                ><svg-icon width="20" height="20" name="area"></svg-icon
              ></span>
              <span class="area-name">{{ item.areaName }}</span>
            </el-menu-item>
            <el-dropdown
              trigger="click"
              placement="bottom-start"
              @command="handleArea"
            >
              <span class="option"
                ><svg-icon width="20" height="20" name="option"></svg-icon
              ></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="{ select: 'deleteArea', index: index }"
                >
                  <span>删除分区</span></el-dropdown-item
                >
                <el-dropdown-item
                  :command="{ select: 'renameArea', index: index }"
                >
                  <span>重命名</span></el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </el-menu>
        </div>
        <div class="notebook-area" v-else>
          <el-empty
            description="没有分区"
            style="
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            "
          ></el-empty>
        </div>
        <div class="add-area" @click="addArea">
          <svg-icon width="20" height="20" name="add"></svg-icon>
          <b>添加分区</b>
        </div>
      </div>
      <div class="page-box">
        <div class="notebook-page" v-if="pageList.length > 0">
          <el-menu
            :collapse-transition="false"
            :default-active="activePage"
            class="el-menu-area"
            @select="pageSelect"
            v-for="(item, index) in pageList"
            :key="index"
          >
            <el-menu-item :index="index + ''" :title="item.pageName">
              <span class="page-name">{{
                deTag(item.pageTitle) == "" ? "无标题页" : deTag(item.pageTitle)
              }}</span>
              <span class="note">{{
                item.pageContent == null ||
                item.pageContent == "" ||
                deTag(item.pageContent) == ""
                  ? "无文本内容"
                  : deTag(item.pageContent)
              }}</span>
            </el-menu-item>
            <el-dropdown
              trigger="click"
              placement="bottom-start"
              @command="handlePage"
            >
              <span class="option"
                ><svg-icon width="20" height="20" name="option"></svg-icon
              ></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="{ select: 'deletePage', index: index }"
                >
                  <span>删除页面</span></el-dropdown-item
                >
                <!-- <el-dropdown-item
                  :command="{ select: 'renamePage', index: index }"
                >
                  <span>重命名</span></el-dropdown-item
                > -->
              </el-dropdown-menu>
            </el-dropdown>
          </el-menu>
        </div>
        <div class="notebook-page" v-else>
          <el-empty
            description="没有页面"
            style="
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            "
          ></el-empty>
        </div>
        <div class="add-page" @click="addPage">
          <svg-icon width="20" height="20" name="add"></svg-icon>
          <b>添加页面</b>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Middleware from "@/assets/js/Middleware";
// import throttle from "@/utils/throttle";
import { mapState, mapMutations } from "vuex";
import addAreaPop from "@/views/home/addAreaPop";
import addPagePop from "@/views/home/addPagePop";
import deletePop from "@/views/home/deletePop";
import renamePop from "@/views/home/renamePop";
import area from "@/api/area";
import page from "@/api/page";
export default {
  props: {
    notebookList: [],
  },
  data() {
    return {
      areaList: [],
      pageList: [],
      isAddArea: false,
      isAddPage: false,
      isDelete: false,
      deleteMsg: "",
      deleteType: "",
      isRename: false,
      renameMsg: "",
      renameType: "",
    };
  },
  computed: {
    ...mapState(["userInfo", "activeNote", "activeArea", "activePage"]),
  },
  watch: {
    notebookList: {
      handler(newList) {
        if (newList.length > 0) {
          this.queryArea();
        }
      },
    },
    pageList: {
      handler(newList, oldList) {
        // 监听如果page数组发生变化，即第一次加载，则重新传页面
        if (newList.length != oldList.length && newList.length != 0) {
          Middleware.$emit("pageMsg", this.pageList[this.activePage]);
        }
      },
    },
  },
  components: {
    addAreaPop,
    addPagePop,
    deletePop,
    renamePop,
  },
  created() {
    // 刷新还在对应路径
    if (this.$route.query.note != undefined && this.$route.query.nav != "") {
      this.setActiveNote(this.$route.query.note);
    }
    if (this.$route.query.area != undefined && this.$route.query.area != "") {
      this.setActiveArea(this.$route.query.area);
      Middleware.$emit("isNoteDetail", true);
    }
    if (this.$route.query.page != undefined && this.$route.query.page != "") {
      this.setActivePage(this.$route.query.page);
    }
    Middleware.$on("queryArea", (data) => {
      if (data) {
        this.queryArea();
      }
    });
    Middleware.$on("queryPage", (data) => {
      if (data) {
        this.queryPage();
      }
    });
    // 更新活跃页面的信息，从别的入口（搜索，最近打开）获取页面信息
    Middleware.$on("otherChangeIndex", (data) => {
      this.setActiveNote(
        this.notebookList.findIndex((value) => value.noteId == data.noteId) + ""
      );
      this.queryArea(data.areaId, data.pageId);
    });
  },
  methods: {
    ...mapMutations([
      "setActiveNote",
      "setActiveArea",
      "setActivePage",
      "setActiveAreaInfo",
      "setActivePageInfo",
    ]),
    goNav() {
      Middleware.$emit("isNoteDetail", false);
    },
    // 有参数则为其他页面（搜索，最近打开）打开页面的，需要根据页面信息更新vuex
    queryArea(otherAreaId, otherPageId) {
      area
        .queryArea({
          userId: this.userInfo.id,
          noteId: this.notebookList[this.activeNote].noteId,
        })
        .then((res) => {
          console.log(res);
          this.areaList = res.data.data;
          // 无参数，且有数据
          if (this.areaList.length > 0 && otherAreaId == undefined) {
            this.setActiveAreaInfo(this.areaList[this.activeArea]);
            this.$router.push({
              query: {
                nav: this.$route.query.nav,
                note: this.$route.query.note,
                area: this.activeArea,
                page: this.$route.query.page,
              },
            });
            this.queryPage("new");
          } else if (otherAreaId != undefined) {
            //有参数，更新vuex
            let areaIndex =
              this.areaList.findIndex((value) => value.areaId == otherAreaId) +
              "";
            this.setActiveArea(areaIndex);
            this.setActiveAreaInfo(this.areaList[areaIndex]);
            this.$router.push({
              query: {
                nav: this.$route.query.nav,
                note: this.$route.query.note,
                area: this.activeArea,
                page: this.$route.query.page,
              },
            });
            this.queryPage(otherPageId);
          } else if (this.areaList.length == 0) {
            this.pageList = [];
            this.setActiveAreaInfo("");
            this.setActivePageInfo("");
            this.$router.push({
              query: {
                nav: this.$route.query.nav,
                note: this.$route.query.note,
                area: "",
                page: this.$route.query.page,
              },
            });
          }
        });
    },
    queryPage() {
      if (this.areaList.length == 0) {
        return;
      }
      page
        .queryPage({
          areaId: this.areaList[this.activeArea].areaId,
          // type: arguments[1] == undefined ? 0 : arguments[1],
        })
        .then((res) => {
          console.log(res);
          this.pageList = res.data.data;
          // 无参数，且有数据
          if (this.pageList.length > 0 && arguments[0] == undefined) {
            //有参数，更新vuex
            this.setActivePageInfo(this.pageList[this.activePage]);
            // Middleware.$emit("pageMsg", this.pageList[this.activePage]);
          } else if (this.pageList.length > 0 && arguments[0] == "new") {
            //有参数，更新vuex "new"是area改变
            this.setActivePageInfo(this.pageList[this.activePage]);
            this.$router.push({
              query: {
                nav: this.$route.query.nav,
                note: this.$route.query.note,
                area: this.activeArea,
                page: this.activePage,
              },
            });
            Middleware.$emit("pageMsg", this.pageList[this.activePage]);
          } else if (arguments[0] != undefined && arguments[0] != "new") {
            let pageIndex =
              this.pageList.findIndex((value) => value.pageId == arguments[0]) +
              "";
            this.setActivePage(pageIndex);
            this.setActivePageInfo(this.pageList[pageIndex]);
            this.$router.push({
              query: {
                nav: this.$route.query.nav,
                note: this.activeNote,
                area: this.activeArea,
                page: this.activePage,
              },
            });
          } else if (this.pageList.length == 0) {
            this.setActivePageInfo("");
            this.$router.push({
              query: {
                nav: this.$route.query.nav,
                note: this.$route.query.note,
                area: this.$route.query.area,
                page: "",
              },
            });
          }
          document.querySelectorAll("code-block").forEach((v) => {
            Middleware.$emit("initCodeBlock", v);
          });
        });
    },
    // 去标签
    deTag(str) {
      // 用replace方法及正则表达式实现
      let str1 = str.replace(/<[^>]*>|<\/[^>]*/gi, "");
      // 定义一些特殊字符的正则表达式 如：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      return str1.replace(/&[a-zA-Z]{1,10};/gi, "").substr(0, 30);
    },
    // handleSortCommand(command) {
    //   // console.log(command);
    //   if (this.areaList.length > 0 && this.pageList.length > 0) {
    //     this.queryPage(undefined, command);
    //   }
    // },
    areaSelect(index) {
      if (index != this.activeArea) {
        this.setActiveArea(index);
        this.setActiveAreaInfo(this.areaList[this.activeArea]);
        this.setActivePage("0");
        // 需要page请求后选择默认page
        this.queryPage("new");
      }
    },
    pageSelect(index) {
      if (index != this.activePage) {
        this.setActivePage(index);
        this.setActivePageInfo(this.pageList[this.activePage]);
        this.$router.push({
          query: {
            nav: this.$route.query.nav,
            note: this.$route.query.note,
            area: this.$route.query.area,
            page: this.activePage,
          },
        });
        Middleware.$emit("pageMsg", this.pageList[index]);
      }
    },
    handleArea(command) {
      console.log(command);
      switch (command.select) {
        case "deleteArea":
          {
            this.isDelete = true;
            this.deleteType = "area";
            this.deleteMsg = this.areaList[command.index];
          }
          break;
        case "renameArea":
          {
            this.isRename = true;
            this.renameType = "area";
            this.renameMsg = this.areaList[command.index];
          }
          break;
      }
    },
    addArea() {
      this.isAddArea = true;
    },
    handlePage(command) {
      console.log(command);
      switch (command.select) {
        case "deletePage":
          {
            this.isDelete = true;
            this.deleteType = "page";
            this.deleteMsg = this.pageList[command.index];
          }
          break;
        // case "renamePage":
        //   {
        //     this.isRename = true;
        //     this.renameType = "page";
        //     this.renameMsg = this.pageList[command.index];
        //   }
        //   break;
      }
    },
    addPage() {
      this.isAddPage = true;
    },
  },
  beforeDestroy() {
    Middleware.$off("queryArea");
    Middleware.$off("queryPage");
    Middleware.$off("otherChangeIndex");
  },
};
</script>

<style lang="scss" scoped>
.note-detail {
  // height: 100%;
  position: relative;
  .el-dropdown {
    position: absolute;
    right: 24px;
    top: 36px;
  }
}
.notebook-layout {
  display: flex;
  align-items: center;
  line-height: 47px;
  border-bottom: 1px solid #edebe9;
  border-right: 3px solid #edebe9;
  cursor: pointer;
  .note-icon {
    color: #979593;
    margin-left: 16px;
  }

  > * {
    margin: 0px 4px;
  }
}
.sort {
  width: 48px;
  height: 48px;
  display: inline-block;
  line-height: 48px;
  text-align: center;
  cursor: pointer;
  position: absolute;
  top: -36px;
  right: -24px;
  z-index: 9;
}
.notebook-message {
  display: flex;
}
.area-box {
  width: 40%;
}
.notebook-area {
  position: absolute;
  left: 0;
  right: 60%;
  top: 48px;
  bottom: 48px;
  overflow-y: scroll;
  border-right: 1px solid #edebe9;
  .area-name {
    margin-right: 16px !important;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-dropdown {
    position: absolute;
    right: 12px;
    top: 36px;
  }
  .option {
    display: inline-block;
    line-height: 48px;
    position: absolute;
    top: -36px;
    right: -12px;
    z-index: 9;
    cursor: pointer;
  }
  .el-menu-item {
    padding: 0 !important;
    height: 48px;
    line-height: 48px;
    display: flex;
    > * {
      margin: 0px 4px;
    }
  }
  .area-icon {
    color: #979593;
    margin-left: 16px;
  }
  ::v-deep .el-empty__image {
    width: 8rem;
  }
}
.notebook-area::-webkit-scrollbar {
  width: 2px;
  background-color: #edebe9;
  border-radius: 16px;
}
.notebook-area::-webkit-scrollbar-thumb {
  background: #7719aa;
  border-radius: 16px;
}
.page-box {
  width: 60%;
}
.notebook-page {
  // background: #ffc114;
  position: absolute;
  left: 40%;
  right: 0;
  top: 48px;
  bottom: 48px;
  overflow-y: scroll;
  border-right: 1px solid #edebe9;
  .page-name {
    line-height: 22px;
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
  .el-dropdown {
    position: absolute;
    right: 12px;
    top: 36px;
  }
  .option {
    display: inline-block;
    line-height: 64px;
    position: absolute;
    top: -36px;
    right: -12px;
    z-index: 9;
    cursor: pointer;
  }
  .el-menu-item {
    padding: 0 !important;
    height: 64px;
    line-height: 64px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    > * {
      margin: 0 16px;
    }
  }
  .el-menu-item.is-active:after {
    height: 64px;
  }
  ::v-deep .el-empty__image {
    width: 10rem;
  }
}
.notebook-page::-webkit-scrollbar {
  width: 2px;
  background-color: #edebe9;
  border-radius: 16px;
}
.notebook-page::-webkit-scrollbar-thumb {
  background: #7719aa;
  border-radius: 16px;
}
.add-area {
  position: absolute;
  left: 0;
  right: 60%;
  bottom: 0;
  line-height: 48px;
  color: #7719aa;
  border-top: 1px solid #edebe9;
  border-right: 2px solid #edebe9;
  cursor: pointer;
  > * {
    margin: 0px 4px;
  }
}
.add-page {
  position: absolute;
  left: 40%;
  right: 0;
  bottom: 0;
  line-height: 48px;
  color: #7719aa;
  border-top: 1px solid #edebe9;
  border-right: 2px solid #edebe9;
  cursor: pointer;
  > * {
    margin: 0px 4px;
  }
}
.notebook-layout:hover,
.sort:hover,
.add-area:hover,
.add-page:hover {
  background: #ecf5ff;
}
.el-menu-item.is-active {
  color: #7719aa;
  background: #ecf5ff;
}
.el-menu-item.is-active:after {
  content: "";
  position: absolute;
  left: 0;
  height: 48px;
  width: 3px;
  background-color: #7719aa;
  top: 50%;
  transform: translateY(-50%);
}
</style>
