<template>
  <div class="editor-box">
    <div class="empty" v-show="!pageMsg">
      <el-empty
        description="没有页面，请选择编辑"
        style="
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        "
      ></el-empty>
    </div>
    <div class="scale-area" ref="listenArea" v-show="pageMsg">
      <div
        :contenteditable="true"
        class="page-title"
        @focus="focusTitle"
        @blur="blurTitle"
        @paste="pasteContent"
        @keydown="textareaKeydown"
        v-on:input="titleChange"
        ref="titleDom"
        v-html="pageTitle"
      ></div>
      <div class="create-time">{{ createTime }}</div>
      <div
        v-highlight
        :contenteditable="true"
        class="inputTextArea"
        @focus="focusTextarea"
        @blur="blurTextarea"
        @paste="pasteContent"
        @keydown="textareaKeydown"
        @mousedown="textareaMousedown"
        v-on:input="textChange"
        ref="textDom"
        v-html="pageContent"
      ></div>
      <!-- 图片查看组件 -->
      <!-- <picture-viewer
      v-if="pictrueViewerShow"
      :src="pictrueSrc"
      @closePV="pictrueViewerShow = false"
    ></picture-viewer> -->
    </div>
    <img-preview-pop
      v-show="imgPreview.show"
      :imgPreview="imgPreview"
      @closePreview="closePreview"
    ></img-preview-pop>
  </div>
  <!-- @keydown="textareaKeydown"
          @keyup="textareaKeyup"
          @input="inputing"
      @paste="pasteContent"
      @click.stop="getLastRange"
      @focus="focusTextarea"
      @blur="blurTextarea"
      :class="[placeholderShow ? 'showPlaceholder' : '']" -->
</template>

<script>
import { readFile } from "@/utils/uploadFile.js";
import {
  getEmojiByAlt,
  guid,
  getFileByAlt,
  fileToImg,
} from "@/utils/publicMethods";
import debounce from "@/utils/debounce";
import Middleware from "@/assets/js/Middleware";
// import PictureViewer from "@/components/PictureViewer";
import imgPreviewPop from "@/components/imgPreview";
import insertEditor from "@/api/insertEditor.js";
import page from "@/api/page";
import { mapState, mapMutations } from "vuex";
// 用于记录光标事件
const selection = getSelection();
// 光标最后的位置
let lastEditRange = null;
export default {
  data() {
    return {
      onmousedownDom: "",
      // 暂存在输入框的文件对象  key:唯一标识   value:file
      filesObj: {},
      // 是否显示PictrueViewer
      // pictrueViewerShow: false,
      // pictureViewer中的图片src
      // pictrueSrc: "",
      imgPreview: {
        img: "",
        show: false,
      },
      pageMsg: "",
      pageTitle: "",
      createTime: "",
      pageContent: "",
    };
  },
  computed: {
    ...mapState(["pageBackground", "pageScale"]),
  },
  components: {
    // PictureViewer,
    imgPreviewPop,
  },
  created() {
    this.createTime = new Date().toLocaleString();
    document.execCommand("enableObjectResizing", "false", null);
    // document.execCommand("defaultParagraphSeparator", false, "p");
  },
  mounted() {
    // 获取当前点击的dom
    document.onmousedown = (e) => {
      // console.log(e);
      // console.log(e.srcElement);
      if (
        e.path.includes(this.$refs.titleDom) ||
        e.path.includes(this.$refs.textDom)
      ) {
        // 初始化样式
        Middleware.$emit("Bold", false);
        Middleware.$emit("Italics", false);
        Middleware.$emit("Underline", false);
        Middleware.$emit("fontFamilyValue", "SimSun");
        Middleware.$emit("fontSizeValue", "2");
        Middleware.$emit("fontColor", "#000000");
        Middleware.$emit("highColor", "rgba(255, 255, 255, 1)");
        Middleware.$emit("isUl", false);
        Middleware.$emit("isOl", false);
        Middleware.$emit("AlignLeft", true);
        Middleware.$emit("Center", false);
        Middleware.$emit("AlignRight", false);
        Middleware.$emit("titleValue", "P");
        for (let value of e.path) {
          // 遍历获取富文本样式
          if (value == this.$refs.titleDom || value == this.$refs.textDom) {
            // 打开监听
            // 观察者的选项(要观察哪些突变)
            var config = {
              attributes: true,
              childList: true,
              characterData: true,
              subtree: true,
            };
            // 创建一个链接到回调函数的观察者实例
            var observer = new MutationObserver(() => {
              Middleware.$emit("loading", true);
              this.savePage();
            });
            // 开始观察的目标节点
            observer.observe(this.$refs.listenArea, config);
            break;
          } else if (value.tagName == "B") {
            Middleware.$emit("Bold", true);
          } else if (value.tagName == "I") {
            Middleware.$emit("Italics", true);
          } else if (value.tagName == "U") {
            Middleware.$emit("Underline", true);
          } else if (value.tagName == "FONT") {
            Middleware.$emit(
              "fontFamilyValue",
              value.getAttribute("face") || "SimSun"
            );
            Middleware.$emit(
              "fontSizeValue",
              value.getAttribute("size") || "2"
            );
            Middleware.$emit(
              "fontColor",
              value.getAttribute("color") || "#000000"
            );
            Middleware.$emit("highColor", value.style.backgroundColor);
          } else if (value.tagName == "SPAN") {
            Middleware.$emit(
              "fontColor",
              value.style.color || value.style.fontColor || "#000000"
            );
            Middleware.$emit(
              "highColor",
              value.style.backgroundColor ||
                value.style.background ||
                "rgba(255, 255, 255, 1)"
            );
          } else if (value.tagName == "UL") {
            Middleware.$emit("isUl", true);
          } else if (value.tagName == "OL") {
            Middleware.$emit("isOl", true);
          } else if (value.tagName == "LI" || value.tagName == "DIV") {
            value.style.width = "auto";
           
          } else if (
            value.tagName == "P" ||
            value.tagName == "H1" ||
            value.tagName == "H2" ||
            value.tagName == "H3" ||
            value.tagName == "H4" ||
            value.tagName == "H5"
          ) {
            Middleware.$emit("titleValue", value.tagName);
          }
          // console.log(value.tagName);
        }
      } else if (
        !e.path.includes(document.getElementsByClassName("nav-bar")[0]) &&
        !e.path.includes(document.getElementsByClassName("add-link-pop")[0])
      ) {
        Middleware.$emit("editorDom", "");
      }
      if (
        e.srcElement.nodeName == "IMG" &&
        e.srcElement.getAttribute("class") != "emoji" &&
        e.srcElement.getAttribute("class") != "file"
      ) {
        this.imgPreview.img = e.target.currentSrc;
        this.imgPreview.show = true;
      } else if (e.srcElement.nodeName == "A") {
        window.open(e.srcElement.href);
      }
      this.onmousedownDom = e;
    };
    // 监听粘贴内容
    Middleware.$on("Paste", (data) => {
      // console.log(data);
      if (data !== "") {
        // if (window.getSelection) {
        //   var newNode = document.createElement("span");
        //   newNode.innerHTML = data + `<br/>`;
        //   window.getSelection().getRangeAt(0).deleteContents();
        //   window.getSelection().getRangeAt(0).insertNode(newNode);
        //   // 插入光标
        //   this.reInsertRange(selection.getRangeAt(0));
        // } else {
        //   // 清除选定的内容
        //   document.selection.clear();
        //   document.selection.createRange().pasteHTML(data + `<br/>`);
        //   // document.selection.createRange().pasteHTML(`<br/>`);
        // }
        document.execCommand("insertHTML", false, data + `<br/>`);
      }
    });
    // 监听页面内容
    Middleware.$on("pageMsg", (data) => {
      // console.log(data);
      this.pageMsg = data;
      if (data) {
        // this.$refs.titleDom.innerHTML = data.pageTitle;
        this.pageTitle = data.pageTitle;
        this.createTime = data.createTime;
        // this.$refs.textDom.innerHTML = data.pageContent;
        this.pageContent = data.pageContent;
        // console.log(this.pageContent);
        // 缩放
        let scaleArea = document.getElementsByClassName("scale-area")[0];
        scaleArea.style.transform = "scale(" + data.pageScale + ")"; //scale()在这里要使用拼接的方式才能生效
        scaleArea.style.transformOrigin = "0 0";
        // 背景
        let editorBox = document.getElementsByClassName("editor-box")[0];
        editorBox.style.background = data.pageBackground;
        this.setPageBackground(data.pageBackground);
        this.setPageScale(data.pageScale);
      }
    });
    // 监听是否保存
    Middleware.$on("save", (data) => {
      if (data) {
        Middleware.$emit("loading", true);
        this.savePage();
      }
    });
  },
  methods: {
    ...mapMutations(["setPageBackground", "setPageScale"]),
    // 防止输入框失焦的回调
    blurTitle() {
      // console.log("blurTitle");
      // console.log(this.onmousedownDom);
      // 防止聚焦丢失 排除部分需要失焦元素
      if (
        !this.onmousedownDom.path.includes(this.$refs.textDom) &&
        !this.onmousedownDom.path.includes(
          document.getElementsByClassName("nav-bar")[0]
        ) &&
        !this.onmousedownDom.path.includes(
          document.getElementsByClassName("add-link-pop")[0]
        )
      ) {
        this.$refs.titleDom.focus();
      }
    },
    blurTextarea() {
      // console.log("blurTextarea");
      // console.log(this.onmousedownDom);
      // console.log(this.onmousedownDom.path);
      // console.log(window.event.srcElement);
      // 防止聚焦丢失 排除部分需要失焦元素
      if (
        !this.onmousedownDom.path.includes(this.$refs.titleDom) &&
        !this.onmousedownDom.path.includes(
          document.getElementsByClassName("nav-bar")[0]
        ) &&
        !this.onmousedownDom.path.includes(
          document.getElementsByClassName("add-link-pop")[0]
        )
      ) {
        this.$refs.textDom.focus();
      } else {
        // 记录光标位置
        lastEditRange = selection.getRangeAt(0);
        // console.log(lastEditRange);
      }
    },
    // 聚焦输入框后需要执行的操作
    focusTitle() {
      // console.log("focusTitle");
      // this.$refs.textDom.blur();

      Middleware.$emit("editorDom", this.$refs.titleDom);
    },
    focusTextarea() {
      // console.log(lastEditRange);
      if (lastEditRange) {
        lastEditRange.collapse(false);
        // 清除选定对象的所有光标对象
        selection.removeAllRanges();
        // 如果有上一次光标的位置，还原光标位置
        selection.addRange(lastEditRange);
        lastEditRange = null;
      }
      // console.log("focusTextarea");
      // this.$refs.titleDom.blur();
      Middleware.$emit("editorDom", this.$refs.textDom);
    },
    titleChange() {
      // console.log(this.$refs.titleDom.innerHTML);
      Middleware.$emit("change", true);
    },
    textChange() {
      // console.log(this.$refs.textDom.innerHTML);
      Middleware.$emit("change", true);
    },
    // 监听按键操作
    textareaKeydown(eve) {
      const e = eve || window.event;
      if (e.keyCode == 13) {
        // enter
        // e.preventDefault(); // 阻止浏览器默认换行操作
        // document.execCommand("insertBrOnReturn");
        document.execCommand("RemoveFormat");
      }
      // else if (e.shiftKey && e.keyCode == 13) {
      //   e.preventDefault(); // 阻止浏览器默认换行操作
      //   document.execCommand("insertBrOnReturn");
      // }
      if (e.keyCode == 9) {
        // 阻止默认切换元素的行为
        if (event && event.preventDefault) {
          event.preventDefault();
        } else {
          window.event.returnValue = false;
        }
        // 获取光标的range对象 event.view 是一个window对象
        let range = event.view.getSelection().getRangeAt(0);
        // 光标的偏移位置
        let offset = range.startOffset;
        // 新建一个span元素
        let span = document.createElement("span");
        // 四个 表示四个空格
        span.innerHTML = "&nbsp&nbsp&nbsp&nbsp";
        // 创建一个新的range对象
        let newrange = document.createRange();
        // 设置新的range的位置，也是插入元素的位置
        newrange.setStart(range.startContainer, offset);
        newrange.setEnd(range.startContainer, offset);
        newrange.collapse(true);
        newrange.insertNode(span);
        // 去掉旧的range对象，用新的range对象替换
        event.view.getSelection().removeAllRanges();
        event.view.getSelection().addRange(range);
        // 将光标的位置向后移动一个偏移量，放到加入的四个空格后面
        range.setStart(span, 1);
        range.setEnd(span, 1);
      }
    },
    textareaMousedown(eve) {
      const e = eve || window.event;
      Middleware.$emit("onDom", e.target);
      // console.log(e.target);
    },

    // 粘贴事件的回调
    pasteContent(e) {
      // 阻止默认事件
      e.preventDefault();
      // 获取粘贴的文件
      const file = e.clipboardData.files && e.clipboardData.files[0];
      // file && readAndUploadFile(file, this.userInfo)
      file && this.fileHandler(file);

      // 去粘贴文本的样式
      this.textFormat(e);
    },
    // 去除内容样式
    textFormat(e) {
      var text;
      var clp = (e.originalEvent || e).clipboardData;
      if (clp === undefined || clp === null) {
        text = window.clipboardData.getData("text/html") || "";
        if (text !== "") {
          if (window.getSelection) {
            var newNode = document.createElement("span");
            newNode.innerHTML = text + `<br/>`;
            window.getSelection().getRangeAt(0).insertNode(newNode);
          } else {
            document.selection.createRange().pasteHTML(text + `<br/>`);
          }
        }
      } else {
        text = clp.getData("text/html") || "";
        console.log(text);
        // 将标签的<br >转为&lt &gt, 防止用户自己插入标签后发送出去
        // text = transformTag(text);
        // 识别并插入表情
        text = getEmojiByAlt(text);
        // 识别并插入文件或图片
        text = text && getFileByAlt(text, this.filesObj);

        if (text !== "") {
          document.execCommand("insertHTML", false, text + `<br/>`);
        }
      }
    },
    // 输入文件的回调
    fileHandler(file) {
      // 判断文件是否超过 10M
      if (file.size > 1024 * 1024 * 10) {
        // console.log('The maximum file size is not allowed to exceed 10M')
        this.$message.warn({
          message: "The maximum file size is not allowed to exceed 10M",
          center: true,
        });
        return;
      }

      // 判断文件类型
      const fileType = /(jpg|jpeg|png|gif)/.test(file.type)
        ? "img"
        : "attachment";

      // 生成img标签,并打上特殊唯一标识
      const fileTag = document.createElement("img");
      if (fileType === "img") {
        fileTag.src = readFile(file);
      } else {
        // fileTag.src = require('@/assets/img/folder.png')
        fileTag.src = fileToImg(file.name);
        fileTag.className = "file";
      }

      fileTag.style = `${
        fileType === "attachment"
          ? "height:auto;"
          : "max-height:600px; max-width:600px;"
      } vertical-align:top; padding:8px; display:inline-block;`;

      // 生成唯一标识
      const uuid = guid();
      // fileTag.setAttribute('uuid', uuid)
      fileTag.alt = `[&*${uuid}]`;
      fileTag.title = file.name;

      // 将文件指针保存到缓存中
      this.filesObj[uuid] = {
        file,
        fileType,
        fileSrc: fileTag.src,
      };

      // 上传并插入
      this.onUpload("image", file);

      // 将标签插入光标位置
      // this.insertFunc(fileTag);
    },
    // 插入至节点方法
    insertFunc(node) {
      const range = selection.getRangeAt(0);
      // 删除range里面的内容
      range.deleteContents();
      // console.log(range, node)
      // 插入节点
      range.insertNode(node);

      // 插入光标
      this.reInsertRange(selection.getRangeAt(0));
      // 完成输入后的回调
      // this.completeInput();
    },
    // 重新插入光标
    reInsertRange(range) {
      if (!selection.getRangeAt(0)) return;
      // 光标开始和光标结束重叠
      range.collapse(false);
      // 清除选定对象的所有光标对象
      selection.removeAllRanges();
      // 插入新的光标对象
      selection.addRange(range);
    },
    closePreview() {
      this.$set(this.imgPreview, "show", false);
    },
    //第四步: 上传文件了
    onUpload(type, file) {
      let fd = new FormData(); //内置方法new FormData()  新建一个表格
      if (type == "image") {
        // fd.append("type", type);
        fd.append("file", file); //把image添加进去
        // console.log(file); //(       第二次有效打印           )
        // console.log(fd);
      } else if (type == "file") {
        fd.append("type", type);
        fd.append("file", this.file); //把image添加进去
        // console.log(file); //(       第二次有效打印           )
        // console.log(fd);
      }
      insertEditor
        .uploadfile(fd)
        .then((res) => {
          //第一个参:this.postUrl就是上面保存好的要上传的地址
          // console.log(res); //(      第三次有效打印    )
          //上传成功 , 后台返回了一个图片地址 转化一下
          let imageUrl = res.data.url.replace(/\\/g, "/");
          // 渲染图片
          // 生成img标签,并打上特殊唯一标识
          const fileTag = document.createElement("img");
          fileTag.src = imageUrl;
          fileTag.style = `max-height:600px; max-width:600px; vertical-align:top; padding:8px; display:inline-block;`;
          fileTag.title = file.name;
          const range = getSelection().getRangeAt(0);
          // 删除range里面的内容
          range.deleteContents();
          // console.log(range, node)
          // 插入节点
          range.insertNode(fileTag);

          // 插入光标
          // getSelection().addRange(getSelection().getRangeAt(0));
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 保存页面
    savePage: debounce(function () {
      let now = new Date().toLocaleString();
      // console.log(this.$refs.textDom.innerHTML);
      page
        .updatePage({
          pageId: this.pageMsg.pageId,
          pageTitle: this.$refs.titleDom.innerHTML
            .replaceAll("'", "\\'")
            .replace(/(<\/?mark.*?>)/g, ""), //单引号转化，去除mark标签
          pageContent: this.$refs.textDom.innerHTML
            .replaceAll("'", "\\'")
            .replace(/(<\/?mark.*?>)/g, ""), //单引号转化，去除mark标签
          uploadTime: now,
          pageScale: this.pageScale,
          pageBackground: this.pageBackground,
        })
        .then((res) => {
          console.log(res);
          this.$message.success({ message: "同步成功", center: true });
          Middleware.$emit("uploadTime", now);
          Middleware.$emit("loading", false);
          Middleware.$emit("queryPage", true);
        });
    }, 3000),
  },
};
</script>
<style lang="scss" scoped>
::selection {
  background: #c7c7c7;
  color: #000;
}
/* mozilla firefox（火狐浏览器） */
::-moz-selection {
  background: #c7c7c7;
  color: #000;
}
@media screen and (max-width: 765px) {
  .inputTextArea {
    min-width: 70vw;
    max-width: 80vw;
  }
}
@media screen and (min-width: 765px) {
  .inputTextArea {
    min-width: 70%;
    max-width: 80%;
  }
}
.editor-box {
  height: 100%;
  overflow-y: scroll;
  overflow-x: scroll;
  // .scale-area {
  //   height: 100%;
  //   max-height: fit-content;
  // }
  .empty {
    width: 100%;
    height: 100%;
    position: relative;
    ::v-deep .el-empty__image {
      width: 20rem;
    }
  }
  .scale-area > * {
    margin: 0 36px;
  }
  .page-title {
    display: inline-block;
    min-width: 300px;
    max-width: 600px;
    outline: none;
    font-size: 20px;
    border-bottom: 1px solid #000000;
    margin-top: 24px;
    padding: 0 8px;
  }
  .create-time {
    padding: 8px;
  }
  .inputTextArea {
    display: inline-block;
    min-height: 70vh;
    border: 1px solid #f1baba;
    padding: 8px;
    > * {
      line-height: 36px;
    }
    p {
      margin: 0;
    }
  }
}
.editor-box::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  margin-right: 2px;
  background-color: #edebe9;
  border-radius: 16px;
}
.editor-box::-webkit-scrollbar-thumb {
  background: #7719aa;
  border-radius: 16px;
  margin-right: 2px;
}
</style>
