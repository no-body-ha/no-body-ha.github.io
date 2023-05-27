<template>
  <div class="start-index">
    <redo-undo></redo-undo>
    <el-dropdown
      trigger="click"
      placement="bottom-start"
      @command="handlePlateCommand"
    >
      <div class="shear-plate" title="剪切板">
        <svg-icon width="20" height="20" name="plate"></svg-icon>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="Cut">
          <svg-icon width="20" height="20" name="shear"></svg-icon>
          <span class="plate-text">剪切</span></el-dropdown-item
        >
        <el-dropdown-item command="Copy">
          <svg-icon width="20" height="20" name="copy"></svg-icon
          ><span class="plate-text">复制</span></el-dropdown-item
        >
        <el-dropdown-item command="Paste">
          <svg-icon width="20" height="20" name="paste"></svg-icon
          ><span class="plate-text">粘贴</span></el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>

    <div class="mark-editor">
      <el-select
        v-model="fontFamilyValue"
        @change="fontFamilyChange"
        filterable
        class="font-family-selector"
        title="字体"
      >
        <el-option
          v-for="item in fontFamilyOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <span :style="'font-family:' + item.value">{{ item.label }}</span>
        </el-option>
      </el-select>
      <el-select
        v-model="fontSizeValue"
        @change="fontSizeChange"
        filterable
        class="font-size-selector"
        title="字号"
      >
        <el-option
          v-for="item in fontSizeOpitions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <a
        href="javascript:void(0)"
        class="font-bold"
        :class="isBold ? 'isActive' : ''"
        @click="toBold"
        title="加粗"
      >
        <b>B</b>
      </a>
      <a
        href="javascript:void(0)"
        class="font-Italics"
        :class="isItalics ? 'isActive' : ''"
        @click="toItalics"
        title="倾斜"
      >
        <i>I</i>
      </a>
      <a
        href="javascript:void(0)"
        class="font-underline"
        :class="isUnderline ? 'isActive' : ''"
        @click="toUnderline"
        title="下划线"
      >
        <u>U</u>
      </a>
      <div class="font-color" title="字体颜色">
        <el-color-picker
          v-model="fontColor"
          @change="fontColorChange"
        ></el-color-picker>
      </div>
      <a href="javascript:void(0)" class="high-color" title="突出显示">
        <el-color-picker
          v-model="highColor"
          @change="highColorChange"
          show-alpha
        ></el-color-picker>
      </a>
      <a
        href="javascript:void(0)"
        class="format-painter"
        title="格式刷"
        @click="toBursh"
        :class="isBursh ? 'isActive' : ''"
      >
        <svg-icon width="24" height="24" name="formatPainter"></svg-icon>
      </a>
      <a
        href="javascript:void(0)"
        class="clear-style"
        @click="clearStyle"
        title="清除所有样式"
      >
        <svg-icon width="20" height="20" name="clearStyle"></svg-icon>
      </a>
    </div>
    <div class="layout-editor">
      <a
        href="javascript:void(0)"
        class="ul-layout"
        title="无序排序"
        @click="toUl"
        :class="isUl ? 'isActive' : ''"
      >
        <svg-icon width="24" height="24" name="ul"></svg-icon>
      </a>
      <a
        href="javascript:void(0)"
        class="ol-layout"
        title="有序排序"
        @click="toOl"
        :class="isOl ? 'isActive' : ''"
      >
        <svg-icon width="24" height="24" name="ol"></svg-icon>
      </a>
      <a
        href="javascript:void(0)"
        class="align-left"
        title="左对齐"
        @click="toAlignLeft"
        :class="isAlignLeft ? 'isActive' : ''"
      >
        <svg-icon width="24" height="24" name="alignLeft"></svg-icon>
      </a>
      <a
        href="javascript:void(0)"
        class="center"
        title="居中"
        @click="toCenter"
        :class="isCenter ? 'isActive' : ''"
      >
        <svg-icon width="24" height="24" name="center"></svg-icon>
      </a>
      <a
        href="javascript:void(0)"
        class="align-right"
        title="右对齐"
        @click="toAlignRight"
        :class="isAlignRight ? 'isActive' : ''"
      >
        <svg-icon width="24" height="24" name="alignRight"></svg-icon>
      </a>
      <a
        href="javascript:void(0)"
        class="decrease-indent"
        title="减少缩进量"
        @click="decreaseIndent"
      >
        <svg-icon width="20" height="20" name="deIndent"></svg-icon>
      </a>
      <a
        href="javascript:void(0)"
        class="increase-indent"
        title="增加缩进量"
        @click="increaseIndent"
      >
        <svg-icon width="20" height="20" name="inIndent"></svg-icon>
      </a>
    </div>
    <a href="javascript:void(0)" class="title-editor">
      <el-select
        v-model="titleValue"
        @change="titleValueChange"
        filterable
        class="title-selector"
        :title="titleValue"
      >
        <el-option
          v-for="item in titleOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </a>
  </div>
</template>

<script>
import Middleware from "@/assets/js/Middleware";
import redoUndo from "@/components/header/redoUndo";
export default {
  data() {
    return {
      editorDom: "",
      onDom: "",
      fontFamilyOptions: [
        {
          value: "SimHei",
          label: "黑体",
        },
        {
          value: "SimSun",
          label: "宋体",
        },
        {
          value: "FangSong",
          label: "仿宋",
        },
        {
          value: "KaiTi",
          label: "楷体",
        },
        {
          value: "NSimSun",
          label: "新宋体",
        },
        {
          value: "STHeiti",
          label: "华文黑体",
        },
        {
          value: "STKaiti",
          label: "华文楷体",
        },
        {
          value: "STSong",
          label: "华文宋体",
        },
        {
          value: "STFangsong",
          label: "华文仿宋",
        },
        {
          value: "Microsoft JhengHei",
          label: "微软正黑体",
        },
        {
          value: "Microsoft YaHei",
          label: "微软雅黑体",
        },
        {
          value: "LiSu",
          label: "隶书",
        },
        {
          value: "YouYuan",
          label: "幼圆",
        },
        {
          value: "FZShuTi",
          label: "方正舒体",
        },
        {
          value: "FZYaoti",
          label: "方正姚体",
        },
        {
          value: "STCaiyun",
          label: "华文彩云",
        },
        {
          value: "STHupo",
          label: "华文琥珀",
        },
        {
          value: "STLiti",
          label: "华文隶书",
        },
        {
          value: "STXingkai",
          label: "华文行楷",
        },
      ],
      fontFamilyValue: "SimSun",
      fontSizeOpitions: [
        {
          value: "1",
          label: "10",
        },
        {
          value: "2",
          label: "12",
        },
        {
          value: "3",
          label: "16",
        },
        {
          value: "4",
          label: "18",
        },
        {
          value: "5",
          label: "24",
        },
        {
          value: "6",
          label: "32",
        },
        {
          value: "7",
          label: "48",
        },
      ],
      fontSizeValue: "2",
      titleOptions: [
        {
          value: "P",
          label: "正文",
        },
        {
          value: "H1",
          label: "标题1",
        },
        {
          value: "H2",
          label: "标题2",
        },
        {
          value: "H3",
          label: "标题3",
        },
        {
          value: "H4",
          label: "标题4",
        },
        {
          value: "H5",
          label: "标题5",
        },
      ],
      titleValue: "P",
      isBold: false,
      isItalics: false,
      isUnderline: false,
      fontColor: "#000000",
      highColor: "rgba(255, 255, 255, 1)",
      isBursh: false,
      isUl: false,
      isOl: false,
      isAlignLeft: true,
      isCenter: false,
      isAlignRight: false,
    };
  },
  components: {
    "redo-undo": redoUndo,
  },
  created() {
    navigator.permissions
      .query({
        name: "clipboard-read",
      })
      .then((permissionStatus) => {
        // permissionStatus.state 的值是 'granted'、'denied'、'prompt':
        console.log(permissionStatus.state);
      });
    Middleware.$on("editorDom", (data) => {
      this.editorDom = data;
      // this.editorDom.focus();
    });
    Middleware.$on("onDom", (data) => {
      this.onDom = data;
    });
    Middleware.$on("fontFamilyValue", (data) => {
      this.fontFamilyValue = data;
    });
    Middleware.$on("fontSizeValue", (data) => {
      this.fontSizeValue = data;
    });
    Middleware.$on("Bold", (data) => {
      // console.log(data);
      this.isBold = data;
    });
    Middleware.$on("Italics", (data) => {
      this.isItalics = data;
    });
    Middleware.$on("Underline", (data) => {
      this.isUnderline = data;
    });
    Middleware.$on("fontColor", (data) => {
      this.fontColor = data;
    });
    Middleware.$on("highColor", (data) => {
      this.highColor = data;
    });
    Middleware.$on("Ul", (data) => {
      this.isUl = data;
    });
    Middleware.$on("Ol", (data) => {
      this.isOl = data;
    });
    Middleware.$on("AlignLedt", (data) => {
      this.isAlignLeft = data;
    });
    Middleware.$on("Center", (data) => {
      this.isCenter = data;
    });
    Middleware.$on("AlignRight", (data) => {
      this.isAlignRight = data;
    });
    Middleware.$on("titleValue", (data) => {
      this.titleValue = data;
    });
  },
  methods: {
    handlePlateCommand(command) {
      // console.log(command);
      // console.log(document.getSelection());
      if (command == "Paste") {
        // 读取剪切板内容
        (async () => {
          // const text = await navigator.clipboard.readText();
          // for (const clipboardItem of text) {
          //   for (const type of clipboardItem.types) {
          //     const blob = await clipboardItem.getType(type);
          //     console.log(URL.createObjectURL(blob));
          //   }
          // }
          // console.log(text);
          const clipboardItems = await window.navigator.clipboard.read();
          let text;
          for (const clipboardItem of clipboardItems) {
            for (const type of clipboardItem.types) {
              const item = await clipboardItem.getType(type);
              if (item && item.type == "text/html") {
                text = await item.text();
              }
              if (item && item.type == "text/plain") {
                text = await item.text();
              }
            }
          }
          // console.log(text);

          Middleware.$emit("Paste", text);
        })();
      }
      document.execCommand(command);
    },
    fontFamilyChange() {
      // console.log(this.fontFamilyValue);
      document.execCommand("FontName", "false", this.fontFamilyValue);
    },
    fontSizeChange() {
      // console.log(this.fontSizeValue);
      document.execCommand("FontSize", "false", this.fontSizeValue);
      // document.execFontSize = function () {
      //   var spanString = `<span style="font-size:${
      //     this.fontSizeValue
      //   }">${document.getSelection()}</span>`;

      //   document.execCommand("insertHTML", false, spanString);
      // };
    },
    fontColorChange() {
      // console.log(this.fontColor);
      document.execCommand("ForeColor", "false", this.fontColor);
    },
    highColorChange() {
      // console.log(this.highColor);
      document.execCommand("BackColor", "false", this.highColor);
    },
    titleValueChange() {
      // console.log(this.titleValue);
      document.execCommand("formatBlock", "false", "<" + this.titleValue + ">");
      window.getSelection().focusNode.parentNode.style.margin = 0;
    },
    toBold() {
      // console.log("bold");
      document.execCommand("bold");
      this.isBold = !this.isBold;
    },
    toItalics() {
      document.execCommand("italic");
      this.isItalics = !this.isItalics;
    },
    toUnderline() {
      document.execCommand("underline");
      this.isUnderline = !this.isUnderline;
    },
    toBursh() {
      this.isBursh = !this.isBursh;
    },
    clearStyle() {
      document.execCommand("RemoveFormat");
      if (!document.execCommand("RemoveFormat")) {
        // console.log(this.onDom);
        this.onDom.removeAttribute("style");
      }
    },
    toUl() {
      this.isUl = !this.isUl;
      this.isOl = false;
      document.execCommand("insertUnorderedList");
    },
    toOl() {
      this.isOl = !this.isOl;
      this.isUl = false;
      document.execCommand("insertOrderedList");
    },
    toAlignLeft() {
      this.isAlignLeft = true;
      this.isCenter = false;
      this.isAlignRight = false;
      document.execCommand("justifyLeft");
    },
    toCenter() {
      this.isCenter = true;
      this.isAlignLeft = false;
      this.isAlignRight = false;
      document.execCommand("justifyCenter");
    },
    toAlignRight() {
      this.isAlignRight = true;
      this.isAlignLeft = false;
      this.isCenter = false;
      document.execCommand("justifyRight");
    },
    decreaseIndent() {
      document.execCommand("outdent");
    },
    increaseIndent() {
      document.execCommand("indent");
      document.execCommand("insertHTML", false, `<br/>`);
    },
  },
  beforeDestroy() {
    Middleware.$off("editorDom");
    Middleware.$off("onDom");
    Middleware.$off("fontFamilyValue");
    Middleware.$off("fontSizeValue");
    Middleware.$off("Bold");
    Middleware.$off("Italics");
    Middleware.$off("Underline");
    Middleware.$off("fontColor");
    Middleware.$off("highColor");
    Middleware.$off("Ul");
    Middleware.$off("Ol");
    Middleware.$off("AlignLedt");
    Middleware.$off("Center");
    Middleware.$off("AlignRight");
    Middleware.$off("titleValue");
  },
};
</script>

<style lang="scss" scoped>
a,
a:hover,
a:active,
a:visited,
a:link,
a:focus {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent;
  text-decoration: none;
  color: #000000;
}
.start-index {
  border-bottom: solid 1px #e6e6e6;
  > * {
    margin: 4px 0;
  }
  .shear-plate {
    width: 36px;
    height: 36px;
    display: inline-block;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
  }
  .mark-editor {
    display: inline-block;
    line-height: 28px;
    padding: 0 16px;
    border-left: 1px solid #909399;
    border-right: 1px solid #909399;
    .font-family-selector {
      width: 120px;
    }
    .font-size-selector {
      width: 80px;
      margin: 0 8px;
    }
    .font-bold,
    .font-Italics,
    .font-underline,
    .font-color,
    .high-color,
    .format-painter,
    .clear-style {
      width: 36px;
      height: 36px;
      display: inline-block;
      line-height: 36px;
      text-align: center;
      cursor: pointer;
    }
  }
  .layout-editor {
    display: inline-block;
    line-height: 28px;
    padding: 0 8px;
    border-right: 1px solid #909399;
    .ul-layout,
    .ol-layout,
    .align-left,
    .center,
    .align-right,
    .decrease-indent,
    .increase-indent {
      width: 36px;
      height: 36px;
      margin: 0 4px;
      display: inline-block;
      line-height: 36px;
      text-align: center;
      cursor: pointer;
    }
  }
  .title-editor {
    display: inline-block;
    line-height: 28px;
    padding: 0 8px;
    .title-selector {
      width: 100px;
    }
  }
}
.plate-text {
  padding: 0 4px;
}
.isActive {
  background: #ecf5ff;
}
.share-plate:hover,
.font-bold:hover,
.font-Italics:hover,
.font-underline:hover,
.font-color:hover,
.high-color:hover,
.format-painter:hover,
.clear-style:hover,
.ul-layout:hover,
.ol-layout:hover,
.align-left:hover,
.center:hover,
.align-right:hover,
.decrease-indent:hover,
.increase-indent:hover {
  background: #ecf5ff;
}
::v-deep .el-input__inner {
  height: 32px;
  line-height: 32px;
}
::v-deep .el-input__icon {
  line-height: 32px;
}
::v-deep .el-color-picker {
  height: 24px;
  vertical-align: middle;
}
::v-deep .el-color-picker__color {
  border: none;
}
::v-deep .el-color-picker__trigger {
  height: 24px;
  width: 24px;
}
</style>
