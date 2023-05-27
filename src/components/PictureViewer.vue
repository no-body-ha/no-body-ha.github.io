<template>
  <div class="PictrueViewer">
    <mask-cmp @clickMask="closePV">
      <div class="closeBtn">
        <svg-icon name="c-close" width="46px" height="46px"></svg-icon>
      </div>
      <!-- DomMouseScroll是兼容火狐的滚轮事件 -->
      <div class="imageContainer" @mousewheel="mousewheel" @DOMMouseScroll="mousewheel">
        <img class="image" :src="src" :style="{ transform: `scale(${currentScale})`, top:`${movePosition.y}px`, left:`${movePosition.x}px` }" alt="" @dragstart="dragstart" @click.stop @mousedown="dragImg" />
      </div>
    </mask-cmp>
  </div>
</template>

<script>
import MaskCmp from './MaskCmp.vue'

// dom
// let image = null

export default {
  name: 'PictrueViewer',
  components: { MaskCmp },
  props: {
    // 图片src
    src: {
      type: String,
      require: true
    },
    // 最大放大倍数
    maxScaleSize: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      // 当前的缩放比例
      currentScale: 1,
      // 移动的位置
      movePosition: {
        x: 0,
        y: 0
      }
    }
  },
  methods: {
    // 事件监听
    // 监听滚轮事件 实现放大缩小
    mousewheel (e) {
      // this.calcTouchWall()
      if (e.wheelDelta > 0 || e.detail < 0) {
        this.changeSize('large')
      } else {
        this.changeSize('small')
      }
    },

    // 阻止拖动事件
    dragstart (e) {
      e.preventDefault()
    },

    // 关闭closePictrueViewer组件
    closePV () {
      this.$emit('closePV')
    },

    // 放大缩小
    changeSize (size) {
      if (size == 'large') {
        if (this.currentScale < this.maxScaleSize) {
          this.currentScale += 0.1
        }
      } else {
        if (this.currentScale > 0.3) {
          this.currentScale -= 0.1
        }
      }
    },

    // 拖动img
    dragImg () {
      // console.log(e);
      // 鼠标移动事件
      window.onmousemove = (e) => {
        // console.log(e);
        this.movePosition.x += e.movementX / e.view.devicePixelRatio
        this.movePosition.y += e.movementY / e.view.devicePixelRatio
        // console.log(this.movePosition.x, this.movePosition.y);
      }
      // 鼠标松开时清空事件
      window.onmouseup = () => {
        window.onmousemove = null
        window.onmouseup = null
      }
    },

    // 初始化img的位置
    initPosition () {
      const image = document.querySelector('.image')
      setTimeout(() => {
        this.movePosition.x = (innerWidth - image.width) / 2
        this.movePosition.y = (innerHeight - image.height) / 2
      })
    }

    // 计算宽高是否触碰容器，若触碰，则禁止放大
    // calcTouchWall () {
    //   if (
    //     image.clientHeight * this.currentScale >= document.body.clientHeight ||
    //     image.clientWidth * this.currentScale >= document.body.clientWidth
    //   ) {
    //     return false
    //   }
    //   return true
    // }
  },
  mounted () {
    // 获取dom
    // image = document.querySelector('.image')
    this.initPosition()
  }
}
</script>

<style scoped>
.PictrueViewer {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 10000;
}

.closeBtn {
  position: fixed;
  top: 108px;
  right: 120px;
  cursor: pointer;
  z-index: 10;
}

.imageContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  position: relative;
}

.image {
  max-height: 100vh;
  max-width: 100vw;
  user-select: none;
  position: absolute;
}
</style>
