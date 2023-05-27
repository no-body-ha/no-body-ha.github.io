<template>
  <div class="note-manage">
    <!-- 弹窗 -->
    <add-notebook-pop
      v-if="isAddNotebook"
      @closeAddNotePop="isAddNotebook = false"
    ></add-notebook-pop>
    <delete-pop
      :deleteType="deleteType"
      :deleteMsg="deleteMsg"
      @closeDeletePop="isDelete = false"
      v-if="isDelete"
    ></delete-pop>
    <rename-pop
      :renameType="renameType"
      :renameMsg="renameMsg"
      @closeRenamePop="isRename = false"
      v-if="isRename"
    ></rename-pop>
    <div class="notebook-layout" @click="goNoteDetail">
      <span class="note-icon"
        ><svg-icon width="20" height="20" name="notebook"></svg-icon
      ></span>
      <span style="font-weight: 600">笔记本</span>
      <span><svg-icon width="16" height="16" name="up"></svg-icon></span>
    </div>
    <div class="notebook-list" v-if="notebookList.length > 0">
      <el-menu
        :collapse-transition="false"
        :default-active="activeNote"
        class="el-menu-notebook"
        @select="noteSelect"
        v-for="(item, index) in notebookList"
        :key="index"
      >
        <el-menu-item :index="index + ''" :title="item.noteName">
          <span class="note-icon" :style="'color:' + item.noteColor"
            ><svg-icon width="20" height="20" name="notebook"></svg-icon
          ></span>
          <span>{{ item.noteName }}</span>
        </el-menu-item>
        <el-dropdown
          trigger="click"
          placement="bottom-start"
          @command="handleNote"
        >
          <span class="option"
            ><svg-icon width="20" height="20" name="option"></svg-icon
          ></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{ select: 'deleteNote', index: index }">
              <span>删除笔记</span></el-dropdown-item
            >
            <el-dropdown-item :command="{ select: 'renameNote', index: index }">
              <span>重命名</span></el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </el-menu>
    </div>
    <div class="notebook-list" v-else>
      <el-empty
        description="没有笔记"
        style="
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        "
      ></el-empty>
    </div>
    <div class="add-notebook" @click="addNotebook">
      <svg-icon width="20" height="20" name="add"></svg-icon>
      <b>添加笔记本</b>
    </div>
  </div>
</template>

<script>
import addNotebookPop from "@/views/home/addNotebookPop";
import Middleware from "@/assets/js/Middleware";
import deletePop from "@/views/home/deletePop";
import renamePop from "@/views/home/renamePop";
import { mapState, mapMutations } from "vuex";
export default {
  props: {
    notebookList: {},
  },
  data() {
    return {
      isAddNotebook: false,
      isDelete: false,
      deleteMsg: "",
      deleteType: "",
      isRename: false,
      renameMsg: "",
      renameType: "",
    };
  },
  computed: {
    ...mapState(["userInfo", "activeNote"]),
  },
  components: {
    addNotebookPop,
    deletePop,
    renamePop,
  },
  created() {
    this.$router.push({ query: { note: this.activeNote } });
  },
  methods: {
    ...mapMutations([
      "setActiveNote",
      "setActiveArea",
      "setActivePage",
      "setActiveNoteInfo",
    ]),
    goNoteDetail() {
      if (this.notebookList.length > 0) {
        Middleware.$emit("isNoteDetail", true);
      }
    },
    noteSelect(index) {
      if (index == this.activeNote) {
        this.goNoteDetail();
      } else {
        console.log(index);
        // 更新vuex
        this.setActiveNote(index);
        this.setActiveNoteInfo(this.notebookList[this.activeNote * 1]);
        this.setActiveArea("0");
        this.setActivePage("0");
        // 路由传参
        this.$router.push({
          query: {
            nav: this.$route.query.nav,
            note: this.activeNote,
            area: this.$route.query.area,
            page: this.$route.query.page,
          },
        });
        // 中间件传参
        Middleware.$emit("isNoteDetail", true);
        Middleware.$emit("queryArea", true);
      }
    },
    handleNote(command) {
      console.log(command);
      switch (command.select) {
        case "deleteNote":
          {
            this.isDelete = true;
            this.deleteType = "note";
            this.deleteMsg = this.notebookList[command.index];
          }
          break;
        case "renameNote":
          {
            this.isRename = true;
            this.renameType = "note";
            this.renameMsg = this.notebookList[command.index];
          }
          break;
      }
    },
    addNotebook() {
      this.isAddNotebook = true;
    },
  },
};
</script>

<style lang='scss' scoped>
.note-manage {
  position: relative;
}
.notebook-layout {
  display: flex;
  align-items: center;
  line-height: 47px;
  border-bottom: 1px solid #edebe9;
  border-right: 3px solid #edebe9;
  cursor: pointer;
  > * {
    margin: 0px 4px;
  }
  .note-icon {
    color: #979593;
    margin-left: 16px;
  }
}
.notebook-list {
  position: absolute;
  left: 0;
  right: 0;
  top: 48px;
  bottom: 48px;
  overflow-y: scroll;
  border-right: 1px solid #edebe9;
  .note-icon {
    color: #979593;
    margin-left: 16px;
  }
  .el-dropdown {
    position: absolute;
    right: 12px;
    top: 36px;
  }
  .option {
    width: 24px;
    display: inline-block;
    line-height: 48px;
    position: absolute;
    top: -36px;
    right: -12px;
    z-index: 9;
    cursor: pointer;
  }
}
.notebook-list::-webkit-scrollbar {
  width: 2px;
  background-color: #eee;
  border-radius: 16px;
}
.notebook-list::-webkit-scrollbar-thumb {
  background: #7719aa;
  border-radius: 16px;
}
.add-notebook {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  line-height: 47px;
  color: #7719aa;
  border-top: 1px solid #edebe9;
  border-right: 2px solid #edebe9;
  cursor: pointer;
  > * {
    margin: 0px 4px;
  }
}
.notebook-layout:hover,
.add-notebook:hover {
  background: #ecf5ff;
}
.el-menu-item {
  padding: 0 !important;
  height: 48px;
  line-height: 48px;
  > * {
    margin: 0px 4px;
  }
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
::v-deep .el-empty__image {
  width: 10rem !important;
}
</style>
