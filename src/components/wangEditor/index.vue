<template>
  <div class="editor-wang">
    <div id="wangEditor"></div>
  </div>
</template>

<script>
// 引入 wangEditor
import wangEditor from 'wangeditor'
import i18next from 'i18next'
export default {
  name: 'editor',
  data () {
    return {
      editor: null,
      editorData: ''
    }
  },
  props: {
    detail: String
  },
  mounted () {
    const editor = new wangEditor('#wangEditor')
    // 配置 onchange 回调函数，将数据同步到 vue 中
    editor.config.onchange = (newHtml) => {
      this.editorData = newHtml
      this.$emit('change', newHtml)
      // console.log(this.editorData);
    }

    // 选择语言
    editor.config.lang = 'en'
    // 引入 i18next 插件
    editor.i18next = i18next
    editor.config.uploadImgServer = process.env.VUE_APP_API_URL + 'upload_file'
    editor.config.uploadFileName = 'Attachment'
    // 限制上传图片大小
    editor.config.uploadImgMaxSize = 10 * 1024 * 1024 //  限制10M
    // 自定义上传的参数
    // editor.config.uploadImgParams = {
    //   Domain: 'helpdesktest007.myshopify.com',
    //   ResType: 'attachment'
    // }

    editor.config.uploadImgHooks = {
      // 上传图片之前
      before: function (xhr) {
        console.log(xhr)

        // 可阻止图片上传
        // return {
        //   prevent: true,
        //   msg: '需要提示给用户的错误信息'
        // }
      },
      // 图片上传并返回了结果，图片插入已成功
      success: function (xhr) {
        console.log('success', xhr)
      },
      // 图片上传并返回了结果，但图片插入时出错了
      fail: function (xhr, editor, resData) {
        console.log('fail', resData)
      },
      // 上传图片出错，一般为 http 请求的错误
      error: function (xhr, editor, resData) {
        console.log('error', xhr, resData)
      },
      // 上传图片超时
      timeout: function (xhr) {
        console.log('timeout')
      },
      // 图片上传并返回了结果，想要自己把图片插入到编辑器中
      // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
      customInsert: function (insertImgFn, result) {
        // result 即服务端返回的接口
        // console.log('customInsert', result)

        // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
        insertImgFn(result.data.Src)
      }
    }
    // 设置编辑区域高度为 666px
    editor.config.height = 666
    // 配置菜单栏，设置不需要的菜单
    editor.config.excludeMenus = [
      'video',
      'code',
      'emoticon'
    ]
    // editor.config.emotions = [{
    //     title: '新浪', // tab 的标题
    //     type: 'image', // 'emoji' 或 'image' ，即 emoji 形式或者图片形式
    //     content: [
    //       { alt: '[坏笑]', src: `${SINA_URL_PATH}/50/pcmoren_huaixiao_org.png` },
    //       { alt: '[舔屏]', src: `${SINA_URL_PATH}/40/pcmoren_tian_org.png` },
    //       { alt: '[污]', src: `${SINA_URL_PATH}/3c/pcmoren_wu_org.png` },
    //     ]
    //   },
    //   {
    //     title: 'emoji', // tab 的标题
    //     type: 'emoji', // 'emoji' / 'image'
    //     // emoji 表情，content 是一个数组即可
    //     content: '😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 🙃 😉 😓 😪 😴 🙄 🤔 😬 🤐'.split(/\s/),
    //   }
    // ]
    // 配置全屏功能按钮是否展示
    editor.config.showFullScreen = false
    // 取消网络图片上传功能
    editor.config.showLinkImg = false
    // 设置zIndex
    editor.config.zIndex = 99
    // 创建编辑器
    editor.create()
    this.editor = editor

    // 将传入的文本内容放置在编辑器中
    this.editor.txt.html(this.detail)
    // setTimeout(() => {
    //   this.editor.txt.html(this.detail)
    // }, 1000)

    this.$bus.$on('backToDefault', (val) => {
      console.log('backText', val)
      this.editor.txt.html(val)
      this.$emit('change', val)
    })
    document.querySelector('.placeholder').innerText = document.querySelector('.placeholder').innerText.substr(0, 1).toUpperCase() + document.querySelector('.placeholder').innerText.substr(1)
  },
  methods: {
    getEditorData () {
      // 通过代码获取编辑器内容
      const data = this.editor.txt.html()
      console.log('data', data)
      return data
    }

  },

  beforeDestroy () {
    // 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy()
    this.editor = null
    this.$bus.$off('backToDefault')
  }
}
</script>

<style lang="less" scoped>
  .editor-wang {
    width: 95%;
  }

  // .w-e-text-container .placeholder{
  //   text-transform: capitalize;
  // }
  // ::v-deep .w-e-text {
  //   /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
  //   -ms-overflow-style: none;
  //   /*火狐下隐藏滚动条*/
  //   scrollbar-width: none;

  //   /deep/ .w-e-text::-webkit-scrollbar {
  //     width: 5px;
  //   }

  //   /deep/ .w-e-text::-webkit-scrollbar-thumb {
  //     background: #B9B9B9;
  //     border-radius: 5px;
  //   }

  //   /*滚动条里面轨道*/
  //   /deep/ .w-e-text::-webkit-scrollbar-track {
  //     border-radius: 0;
  //     background: #ffffff;
  //   }
  // }
</style>
