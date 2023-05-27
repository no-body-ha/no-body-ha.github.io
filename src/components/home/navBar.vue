<template>
  <div class="nav-bar">
    <el-menu
      :default-active="activeNav"
      class="el-menu-vertical"
      @select="barSelect"
    >
      <el-menu-item index="1" title="导航">
        <svg-icon width="20" height="20" name="bookshelf"></svg-icon>
      </el-menu-item>
      <el-menu-item index="2" title="搜索">
        <svg-icon width="20" height="20" name="search"></svg-icon>
      </el-menu-item>
      <el-menu-item index="3" title="最近的笔记">
        <svg-icon width="20" height="20" name="lately"></svg-icon>
      </el-menu-item>
    </el-menu>
    <div class="nav-body">
      <transition name="el-fade-in-linear">
        <note-detail
          :notebookList="notebookList"
          v-show="activeNav == 1 && isNoteDetail"
        ></note-detail>
      </transition>
      <transition name="el-fade-in-linear">
        <note-manage
          :notebookList="notebookList"
          v-show="activeNav == 1 && !isNoteDetail"
        ></note-manage
      ></transition>
      <transition name="el-fade-in-linear"
        ><note-search v-show="activeNav == 2"></note-search
      ></transition>
      <transition name="el-fade-in-linear"
        ><note-lately v-if="activeNav == 3"></note-lately
      ></transition>
    </div>
  </div>
</template>

<script>
import noteDetail from "@/components/nav/noteDetail";
import noteManage from "@/components/nav/noteManage";
import search from "@/components/nav/search";
import lately from "@/components/nav/lately";
import Middleware from "@/assets/js/Middleware";
import note from "@/api/note";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      activeNav: "1",
      notebookList: [],
      isNoteDetail: false,
    };
  },
  computed: {
    ...mapState(["userInfo", "activeNote"]),
  },
  watch: {
    // $route: function (to) {
    //   console.log(to.query);
    // },
  },
  components: {
    "note-detail": noteDetail,
    "note-manage": noteManage,
    "note-search": search,
    "note-lately": lately,
  },
  created() {
    console.log(this.$route.query);
    // 刷新还在该nav
    this.activeNav =
      this.$route.query.nav != undefined ? this.$route.query.nav + "" : "1";
    this.$nextTick(() => {
      // 更新路由参数
      this.$router.push({
        query: {
          nav: this.activeNav,
          note: this.$route.query.note,
          area: this.$route.query.area,
          page: this.$route.query.page,
        },
      });
    });
    this.queryNoteList();
    Middleware.$on("isNoteDetail", (data) => {
      this.isNoteDetail = data;
    });
    Middleware.$on("queryNote", (data) => {
      if (data) {
        this.queryNoteList();
      }
    });
  },
  mounted() {},

  methods: {
    ...mapMutations(["setActiveNoteInfo"]),
    barSelect(index) {
      if (this.activeNav == index) {
        this.activeNav = "";
      } else {
        this.activeNav = index;
        // 贡献路由
        this.$router.push({
          query: {
            nav: this.activeNav,
            note: this.$route.query.note,
            area: this.$route.query.area,
            page: this.$route.query.page,
          },
        });
      }
      // console.log(index);
    },
    queryNoteList() {
      note
        .queryNote({
          userId: this.userInfo.id,
        })
        .then((res) => {
          // console.log(res);
          this.notebookList = res.data.data;
          this.setActiveNoteInfo(this.notebookList[this.activeNote]);
          // 更新路由参数
          this.$router.push({
            query: {
              nav: this.$route.query.nav,
              note: this.activeNote,
              area: this.$route.query.area,
              page: this.$route.query.page,
            },
          });
        });
    },
  },
};
</script>

<style lang='scss' scoped>
.nav-bar {
  height: 100%;
  display: flex;
  .el-menu {
    height: 100%;
  }
  .el-menu-item {
    padding: 0 12px !important;
    height: 48px;
    line-height: 48px;
  }
  .el-menu-item.is-active {
    color: #7719aa;
    background: #ecf5ff;
  }
  .el-menu-item.is-active:after {
    content: "";
    position: absolute;
    left: 1px;
    height: 48px;
    width: 3px;
    background-color: #7719aa;
    top: 50%;
    transform: translateY(-50%);
  }
  .nav-body {
    overflow: hidden;
    > * {
      width: 28vw;
      min-width: 250px;
      height: 100%;
      background: #ffffff;
    }
  }
}
</style>
