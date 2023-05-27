<template>
  <div class="view-index">
    <redo-undo></redo-undo>
    <div class="view-editor">
      <a
        href="javascript:void(0)"
        class="exit-screen"
        title="退出全屏"
        @click="exitScreen"
      >
        <svg-icon width="20" height="20" name="exitScreen" class=""></svg-icon>
      </a>
      <a
        href="javascript:void(0)"
        class="full-screen"
        title="全屏"
        @click="fullScreen"
      >
        <svg-icon width="20" height="20" name="fullScreen" class=""></svg-icon>
      </a>
      <a
        href="javascript:void(0)"
        class="narrow"
        title="缩小"
        @click="narrowArea"
      >
        <svg-icon width="26" height="26" name="narrow" class=""></svg-icon>
      </a>
      <a
        href="javascript:void(0)"
        class="enlarge"
        title="放大"
        @click="enlargeArea"
      >
        <svg-icon width="26" height="26" name="enlarge" class=""></svg-icon>
      </a>
      <a
        href="javascript:void(0)"
        class="reZoom"
        title="缩放至100%"
        @click="restoreZoom"
      >
        <svg-icon width="20" height="20" name="reZoom" class=""></svg-icon>
      </a>
    </div>
    <div class="page-editor">
      <div class="page-color" title="页面背景颜色">
        <el-color-picker
          v-model="pageColor"
          show-alpha
          @change="pageColorChange"
        ></el-color-picker>
      </div>
      <a href="javascript:void(0)" class="read" title="朗读" @click="startRead">
        <svg-icon width="24" height="24" name="read" class=""></svg-icon>
      </a>
      <a
        href="javascript:void(0)"
        class="play"
        title="播放"
        @click="play"
        v-if="!isPlay"
      >
        <svg-icon width="24" height="24" name="pause" class=""></svg-icon>
      </a>
      <a
        href="javascript:void(0)"
        class="pause"
        title="暂停"
        @click="pause"
        v-else
      >
        <svg-icon width="24" height="24" name="play" class=""></svg-icon>
      </a>
    </div>
    <div class="page-export">
      <a
        href="javascript:void(0)"
        class="export-pdf"
        title="导出pdf"
        @click="exportPdf"
      >
        <svg-icon width="24" height="24" name="exportPdf" class=""></svg-icon>
      </a>
    </div>
  </div>
</template>

<script>
import redoUndo from "@/components/header/redoUndo";
import html2Canvas from "html2canvas";
import JsPDF from "jspdf";
import throttle from "@/utils/throttle";
import Middleware from "@/assets/js/Middleware";
import { mapState, mapMutations } from "vuex";
// 语音对象
const synth = window.speechSynthesis;
export default {
  data() {
    return {
      pageColor: "rgba(255, 255, 255, 1)",
      isPlay: false,
      pdfSave: "",
      exportPdfThrottle: throttle(() => {
        let scaleArea = document.getElementsByClassName("scale-area")[0];
        let fileName =
          document.getElementsByClassName("page-title")[0].innerText;
        this.getPdfFromHtml(scaleArea, fileName);
        this.$message({
          message: "请稍后,正在导出PDF文件...",
          duration: 10000,
        });
      }, 5000),
    };
  },
  computed: {
    ...mapState(["pageBackground", "pageScale"]),
  },
  watch: {
    pageBackground: {
      handler(newColor) {
        this.pageColor = newColor;
      },
      immediate: true,
      deep: true,
    },
  },
  components: {
    "redo-undo": redoUndo,
  },
  created() {},
  methods: {
    ...mapMutations(["setPageBackground", "setPageScale"]),
    exitScreen() {
      // 判断各种浏览器，找到正确的方法

      var exitMethod =
        document.exitFullscreen || //W3C
        document.mozCancelFullScreen || //Chrome等
        document.webkitExitFullscreen || //FireFox
        document.webkitExitFullscreen; //IE11

      if (exitMethod) {
        exitMethod.call(document);
      }
      // else if (typeof window.ActiveXObject !== "undefined") {
      //   //for Internet Explorer

      //   var wscript = new ActiveXObject("WScript.Shell");

      //   if (wscript !== null) {
      //     wscript.SendKeys("{F11}");
      //   }
      // }
    },
    fullScreen() {
      let element = document.documentElement;
      var requestMethod =
        element.requestFullScreen || //W3C
        element.webkitRequestFullScreen || //Chrome等
        element.mozRequestFullScreen || //FireFox
        element.msRequestFullScreen; //IE11

      if (requestMethod) {
        requestMethod.call(element);
      }
      // else if (typeof window.ActiveXObject !== "undefined") {
      //   //for Internet Explorer
      //   var wscript = new ActiveXObject("WScript.Shell");
      //   if (wscript !== null) {
      //     wscript.SendKeys("{F11}");
      //   }
      // }
    },
    narrowArea() {
      let scaleArea = document.getElementsByClassName("scale-area")[0];
      let scale = (parseFloat(this.pageScale) - 0.1).toFixed(2);
      // console.log("放大系数: " + this.scal);
      scaleArea.style.transform = "scale(" + scale + ")"; //scale()在这里要使用拼接的方式才能生效
      scaleArea.style.transformOrigin = "0 0";
      this.setPageScale(scale);
      Middleware.$emit("save", true);
    },
    enlargeArea() {
      let scaleArea = document.getElementsByClassName("scale-area")[0];
      let scale = (parseFloat(this.pageScale) + 0.1).toFixed(2);
      // console.log("放大系数: " + this.scal);
      scaleArea.style.transform = "scale(" + scale + ")"; //scale()在这里要使用拼接的方式才能生效
      scaleArea.style.transformOrigin = "0 0";
      this.setPageScale(scale);
      Middleware.$emit("save", true);
    },
    restoreZoom() {
      let scale = 1;
      let scaleArea = document.getElementsByClassName("scale-area")[0];
      scaleArea.style.transform = "scale(" + scale + ")";
      scaleArea.style.transformOrigin = "0 0";
      this.setPageScale(scale);
      Middleware.$emit("save", true);
    },
    pageColorChange() {
      let scaleArea = document.getElementsByClassName("editor-box")[0];
      scaleArea.style.background = this.pageColor;
      this.setPageBackground(this.pageColor);
      Middleware.$emit("save", true);
    },
    startRead() {
      let readArea = document.getElementsByClassName("scale-area")[0];
      let utterThis = new window.SpeechSynthesisUtterance(readArea.innerText);
      utterThis.voice = synth.getVoices()[0];
      utterThis.pitch = 1; // 设置音高
      utterThis.rate = 1; // 设置音速
      utterThis.volume = 0.5; // 设置声音大小
      synth.speak(utterThis);
      this.isPlay = true;
    },
    play() {
      if (synth.speaking == false) {
        return;
      }
      synth.resume();
      this.isPlay = true;
    },
    pause() {
      synth.pause();
      this.isPlay = false;
    },
    exportPdf() {
      this.exportPdfThrottle();
    },
    getPdfFromHtml(ele, pdfFileName) {
      html2Canvas(ele, {
        dpi: window.devicePixelRatio * 3,
        scale: 3,
        useCORS: true, //允许canvas画布内可以跨域请求外部链接图片, 允许跨域请求。
        allowTaint: false,
        height: ele.offsetHeight,
        width: ele.offsetWidth,
        windowWidth: document.body.scrollWidth,
        windowHeight: document.body.scrollHeight,
      }).then((canvas) => {
        // const _this = this;
        //未生成pdf的html页面高度
        var leftHeight = canvas.height;
        var a4Width = 595.28;
        var a4Height = 800;
        //一页pdf显示html页面生成的canvas高度;
        var a4HeightRef = Math.floor((canvas.width / a4Width) * a4Height);
        //pdf页面偏移
        var position = 0;
        var pageData = canvas.toDataURL("image/jpeg", 1.0);
        var pdf = new JsPDF("x", "pt", "a4");
        let index = 1;
        var canvas1 = document.createElement("canvas");
        var height;
        pdf.setDisplayMode("fullwidth", "continuous", "FullScreen");
        function createImpl(canvas) {
          if (leftHeight > 0) {
            index++;
            console.log(index);
            var checkCount = 0;
            if (leftHeight > a4HeightRef) {
              var i = position + a4HeightRef;
              for (i = position + a4HeightRef; i >= position; i--) {
                var isWrite = true;
                for (var j = 0; j < canvas.width; j++) {
                  var c = canvas.getContext("2d").getImageData(j, i, 1, 1).data;
                  if (c[0] != 0xff || c[1] != 0xff || c[2] != 0xff) {
                    isWrite = false;
                    break;
                  }
                }
                if (isWrite) {
                  checkCount++;
                  if (checkCount >= 10) {
                    break;
                  }
                } else {
                  checkCount = 0;
                }
              }
              height =
                Math.round(i - position) || Math.min(leftHeight, a4HeightRef);
              if (height <= 0) {
                height = a4HeightRef;
              }
            } else {
              height = leftHeight;
            }

            canvas1.width = canvas.width;
            canvas1.height = height;

            var ctx = canvas1.getContext("2d");
            ctx.drawImage(
              canvas,
              0,
              position,
              canvas.width,
              height,
              0,
              0,
              canvas.width,
              height
            );
            // let pageHeight = Math.round((a4Width / canvas.width) * height);
            if (position != 0) {
              pdf.addPage();
            }
            pdf.addImage(
              canvas1.toDataURL("image/jpeg", 1.0),
              "JPEG",
              0,
              20,
              a4Width,
              (a4Width / canvas1.width) * height
            );

            leftHeight -= height;
            position += height;
            if (leftHeight > 0) {
              //添加全屏水印
              // const base64 = ''
              // for(let i=0;i<6;i++){
              //   for(let j=0;j<5;j++){
              //     const  left = (j*120)+20;
              //     pdf.addImage(base64,'JPEG', left, i*150, 20, 30);
              //   }
              // }
              setTimeout(createImpl, 500, canvas);
            } else {
              this.pdfSave = pdf.save(pdfFileName + ".pdf");
            }
          }
        }
        //当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < a4HeightRef) {
          pdf.addImage(
            pageData,
            "JPEG",
            0,
            0,
            a4Width,
            (a4Width / canvas.width) * leftHeight
          );
          this.dialogVisible = true;
          this.pdfSave = pdf.save(pdfFileName + ".pdf");
        } else {
          try {
            pdf.deletePage(0);
            setTimeout(createImpl, 500, canvas);
          } catch (err) {
            console.log(err);
          }
        }
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.view-index {
  border-bottom: solid 1px #e6e6e6;
  > * {
    margin: 4px 0;
  }
  .view-editor {
    display: inline-block;
    line-height: 28px;
    padding: 0 16px;
    border-left: 1px solid #909399;
    border-right: 1px solid #909399;
    .full-screen,
    .exit-screen,
    .narrow,
    .enlarge,
    .reZoom {
      width: 36px;
      height: 36px;
      margin: 0 8px;
      display: inline-block;
      line-height: 36px;
      text-align: center;
      cursor: pointer;
    }
  }
  .page-editor {
    display: inline-block;
    line-height: 28px;
    padding: 0 8px;
    border-right: 1px solid #909399;
    .page-color,
    .read,
    .play,
    .pause {
      width: 36px;
      height: 36px;
      margin: 0 8px;
      display: inline-block;
      line-height: 36px;
      text-align: center;
      cursor: pointer;
    }
  }
  .page-export {
    display: inline-block;
    line-height: 28px;
    padding: 0 8px;
    .export-pdf {
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
.full-screen:hover,
.exit-screen:hover,
.narrow:hover,
.enlarge:hover,
.reZoom:hover,
.page-color:hover,
.read:hover,
.play:hover,
.pause:hover,
.export-pdf:hover {
  background: #ecf5ff;
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
