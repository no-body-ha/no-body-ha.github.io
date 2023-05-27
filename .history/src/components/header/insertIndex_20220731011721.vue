<template>
  <div class="insert-index">
    <redo-undo></redo-undo>
    <div class="insert-editor">
      <a
        href="javascript:void(0)"
        class="add-img"
        title="上传图片"
        @click="onPickImg"
      >
        <svg-icon width="24" height="24" name="photo" class=""></svg-icon>
        <!-- 选择文件 -->
        <input
          type="file"
          ref="imgInput"
          accept="image/*"
          @change="getImg"
          style="display: none"
        />
      </a>
      <!-- <a
        href="javascript:void(0)"
        class="add-file"
        title="上传文件"
        @click="onPickFile"
      >
        <svg-icon width="24" height="24" name="file" class=""></svg-icon>
        <input
          type="file"
          ref="fileInput"
          @change="getFile"
          style="display: none"
        />
      </a> -->
      <a
        href="javascript:void(0)"
        class="add-link"
        title="链接"
        @click="addLink"
      >
        <svg-icon width="24" height="24" name="link" class=""></svg-icon>
      </a>
      <a
        href="javascript:void(0)"
        class="add-code"
        title="代码块"
        @click="addCode"
      >
        <svg-icon width="30" height="30" name="code" class=""></svg-icon>
      </a>
      <!-- 表情 -->
      <emoji-box ref="emojiBox" @chooseEmoji="insertEmoji">
        <a href="javascript:void(0)" class="add-emoji" title="表情">
          <svg-icon width="24" height="24" name="emoji" class=""></svg-icon>
        </a>
      </emoji-box>
    </div>
    <add-link-pop
      v-if="isAddLink"
      @closeAddLinkPop="closeAddLinkPop"
      @addLinkFinish="addLinkFinish"
      style="margin: 0"
    ></add-link-pop>
  </div>
</template>

<script>
import Middleware from "@/assets/js/Middleware";
import EmojiBox from "@/components/EmojiBox.vue";
import redoUndo from "@/components/header/redoUndo";
import insertEditor from "@/api/insertEditor.js";
import addLinkPop from "@/views/home/addLinkPop";
export default {
  data() {
    return {
      editorDom: "",
      imageUrl: "", //img绑定的src地址
      isAddLink: false,
      // 当前光标的位置
      // cursorPosition: { x: 0, y: 0 },
      // 链接文本
      addressText: "",
      // 链接
      address: "",
    };
  },
  components: {
    redoUndo,
    addLinkPop,
    EmojiBox,
  },
  created() {
    Middleware.$on("editorDom", (data) => {
      this.editorDom = data;
      // this.editorDom.focus();
    });
  },
  mounted() {
    // //第一步:先请求一下api,看看需要上传到哪里去,存到postUrl里面 ( 做了跨域配置,所以直接写成了api )
    // insertEditor
    //   .getUploadInfo({
    //     type: "image",
    //   })
    //   .then((res) => {
    //     console.log(res.data.data.url); //页面挂载后,先打印一下,拿到了需要上传到的url地址   ( 第一次有效打印 )
    //     this.postUrl = res.data.data.url; //把地址保存下来
    //   });
  },
  methods: {
    //第二步:再来写个方法, button代替input选择图片
    onPickImg() {
      if (!this.editorDom) return;
      this.$refs.imgInput.click();
    },
    onPickFile() {
      if (!this.editorDom) return;
      this.$refs.fileInput.click();
    },
    //第三步: 文件选择后, 后在页面上显示出来    转base64位的操作
    getImg(event) {
      const files = event.target.files;
      let filename = files[0].name; //只有一个文件
      if (filename.lastIndexOf(".") <= 0) {
        this.$message.error("Please add a valid image!"); //判断图片是否有效
      }
      const fileReader = new FileReader(); //内置方法new FileReader()   读取文件
      fileReader.addEventListener("load", () => {
        this.imageUrl = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
      this.image = files[0];
      //到这里后, 选择图片就可以显示出来了
      this.onUpload("image");
    },
    getFile(event) {
      const files = event.target.files;
      // let filename = files[0].name; //只有一个文件
      const fileReader = new FileReader(); //内置方法new FileReader()   读取文件
      fileReader.addEventListener("load", () => {
        this.fileUrl = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
      this.file = files[0];
      //到这里后, 选择图片就可以显示出来了
      this.onUpload("file");
    },
    //第四步: 上传文件了
    onUpload(type) {
      let fd = new FormData(); //内置方法new FormData()  新建一个表格
      if (type == "image") {
        // fd.append("type", type);
        fd.append("file", this.image); //把image添加进去
        // console.log(this.image); //(       第二次有效打印           )
        // console.log(fd);
      } else if (type == "file") {
        fd.append("type", type);
        fd.append("file", this.file); //把image添加进去
        // console.log(this.image); //(       第二次有效打印           )
        // console.log(fd);
      }
      insertEditor
        .uploadfile(fd)
        .then((res) => {
          //第一个参:this.postUrl就是上面保存好的要上传的地址
          // console.log(res); //(      第三次有效打印    )
          //上传成功 , 后台返回了一个图片地址 转化一下
          this.imageUrl = res.data.url.replace(/\\/g, "/");
          // 渲染图片
          // 生成img标签,并打上特殊唯一标识
          const fileTag = document.createElement("img");
          fileTag.src = this.imageUrl;
          fileTag.style = `max-height:600px; max-width:600px; vertical-align:top; padding:8px; display:inline-block;`;
          fileTag.title = this.image.name;
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
    addLink() {
      if (!this.editorDom) return;
      this.$nextTick(() => {
        // 获取当前光标位置
        // console.log(getSelection().getRangeAt(0).getClientRects()[0]);
        // let position = {
        //   x: getSelection().getRangeAt(0).getClientRects()[0].x,
        //   y: getSelection().getRangeAt(0).getClientRects()[0].y,
        // };
        // this.cursorPosition = position;
      });

      this.isAddLink = true;
    },
    closeAddLinkPop() {
      this.isAddLink = false;
    },
    addLinkFinish(addressText, address) {
      // console.log(addressText, address);
      //       let reg = "";
      //
      //       if (reg.test(address)) {
      //         this.$message.warning({
      //           message: "请输入正确的http链接",
      //           center: true,
      //         });
      //         return;
      //       }
      // 重定位输入框
      this.editorDom.focus();
      // 插入链接
      // 生成a标签
      const linkTag = document.createElement("a");
      linkTag.href = address;
      linkTag.innerText = addressText;
      linkTag.style = `cursor: pointer;`;
      const range = getSelection().getRangeAt(0);
      // 插入节点
      range.insertNode(linkTag);
      // linkTag.onclick = (e) => {
      //   // console.log(e.target.attributes.href.value);
      //   window.open(e.target.attributes.href.value);
      // };
      // 插入光标
      // this.reInsertRange(getSelection().getRangeAt(0));
      getSelection().addRange(range);
      this.closeAddLinkPop();
    },
    addCode() {
      if (!this.editorDom) return;
      // 生成img标签,并打上特殊唯一标识
      const codeTag = document.createElement("textarea");
      // codeTag.innerHTML = `&nbsp &nbsp <br/>`;
      codeTag.className = "code-block";
      // codeTag.style = `line-height: 19px;white-space: pre; color:#ffffff; background:#23272e;`;
      const range = getSelection().getRangeAt(0);
      // 删除range里面的内容
      range.deleteContents();
      // console.log(range, node)
      // 插入节点
      range.insertNode(codeTag);
      Middleware.$emit("initCodeBlock", codeTag);
      getSelection().addRange(getSelection().getRangeAt(0));
      range.insertNode()
    },
    // 插入表情
    insertEmoji(emoji) {
      if (!this.editorDom) return;
      // 外部调用的api
      // 插入表情的方法
      // 创建img标签并放入表情
      const emojiTag = document.createElement("img");
      emojiTag.src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=";
      emojiTag.alt = `[&${emoji}]`;
      emojiTag.className = "emoji";
      emojiTag.style = `background:url(${require("@/assets/emojiLib/emoji.png")}) 0 0 no-repeat; width:22px; height:22px; background-position:0 ${
        -22 * emoji
      }px; margin:-1px 1px 0px; vertical-align: middle;`;

      const range = getSelection().getRangeAt(0);
      // 删除range里面的内容
      range.deleteContents();
      // console.log(range, node)
      // 插入节点
      range.insertNode(emojiTag);
    },
  },
};
</script>

<style lang="scss" scoped>
.insert-index {
  border-bottom: solid 1px #e6e6e6;
  > * {
    margin: 4px 0;
  }
  .insert-editor {
    display: inline-block;
    line-height: 28px;
    padding: 0 16px;
    border-left: 1px solid #909399;
    border-right: 1px solid #909399;
    .add-img,
    .add-file,
    .add-link,
    .add-code,
    .add-emoji {
      width: 36px;
      height: 36px;
      margin: 0 8px;
      display: inline-block;
      line-height: 36px;
      text-align: center;
      cursor: pointer;
    }
  }
}
.add-img:hover,
.add-file:hover,
.add-link:hover,
.add-code:hover,
.add-emoji:hover {
  background: #ecf5ff;
}
</style>
