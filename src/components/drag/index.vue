<template>
  <transition name="fade">
    <div
      v-show="showDrag"
      id="moveDiv"
      ref="moveDiv"
      class="xuanfu"
      :style="position"
      @click="isClick"
      @mousedown="down"
      @touchstart="down"
      @mousemove="move"
      @touchmove="move"
      @mouseup="end"
      @touchend="end"
    >
      <slot></slot>
    </div>
  </transition>
</template>

<script lang='ts'>
import Vue from "vue";
import $ from "jquery";
import { setTimeout } from "timers";
import {AppModule} from '@/store/modules/app'
export default Vue.extend({
  name: "",
  components: {},
  props: {
    // 通过position来设置初始定位
    position: {
      type: Object,
      default: function() {
        return {
          left: "100px;",
          bottom: "100px"
        };
      }
    },
    // 是否隐藏
    hide: {
      type: Boolean,
      default: false
    },
    // 多长时间后隐藏
    lazyTime: {
      type: Number,
      default: 5000
    },
    // 通过fixed来禁用自由移动
    fixed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      flags: false,
      nx: 0,
      positionTemp: { x: 0, y: 0 }, // 记录手指点击的位置
      ny: 0,
      dx: 0,
      dy: 0,
      xPum: 0,
      yPum: 0,
      movementX: 0,
      movementY: 0,
      showDrag: true,
      timer: null,
      DownX: 0,
      DownY: 0,
      UpX: 0,
      UpY: 0
    };
  },
  computed: {},
  watch: {
    showDrag(n, o) {
      this.$nextTick(() => {
        if (!n) {
          $("#app").css("cursor", "none");
        } else {
          $("#app").css("cursor", "auto");
        }
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      $(document).mousemove(event => {
        if (!(this as any).hide) {
          return false;
        }
        if (
          this.movementY != event.offsetY ||
          this.movementX != event.offsetX
        ) {
          window.clearTimeout((this as any).timer);
          this.movementX = event.offsetX;
          this.movementY = event.offsetY; //重新赋值
          this.showDrag = true;
          (this as any).timer = window.setTimeout(() => {
            this.showDrag = false;
          }, (this as any).lazyTime);
        }
      });
    });
  },
  beforeDestroy() {
    window.clearTimeout((this as any).timer);
  },
  methods: {
    isClick() {
      let d = Math.sqrt((this.DownX-this.UpX)*(this.DownX-this.UpX)+(this.DownY-this.UpY)*(this.DownY-this.UpY))
      //*当d小于7px时默认客户是点击，否则客户是拖动，不执行点击事件
      if (d < 7) {
        this.$store.dispatch('SetDialogTableVisible',!AppModule.dialogTableVisible)
      }
    },

    // 实现移动端拖拽
    down(e: any) {
      if ((this as any).fixed) {
        return;
      }
      this.DownX = e.clientX
      this.DownY = e.clientY
      let moveDiv = this.$refs.moveDiv;
      this.flags = true;
      let touch;
      // 该if判断是用touch还是mouse来移动
      if ((event as any).touches) {
        touch = (event as any).touches[0];
      } else {
        touch = event;
      }
      this.positionTemp.x = touch.clientX; // 手指点击后的位置
      this.positionTemp.y = touch.clientY;

      this.dx = (moveDiv as any).offsetLeft; // 移动的div元素的位置
      this.dy = (moveDiv as any).offsetTop;
    },
    move() {
      let moveDiv = this.$refs.moveDiv;
      if (this.flags) {
        let touch;
        if ((event as any).touches) {
          touch = (event as any).touches[0];
        } else {
          touch = event;
        }
        this.nx = touch.clientX - this.positionTemp.x; // 手指移动的变化量
        this.ny = touch.clientY - this.positionTemp.y;

        this.xPum = this.dx + this.nx; // 移动后，div元素的位置
        this.yPum = this.dy + this.ny;

        let windowWidth = document.documentElement.clientWidth;
        let windowHeight = document.documentElement.clientHeight;

        if (
          this.xPum > 0 &&
          this.xPum + (moveDiv as any).clientWidth < windowWidth
        ) {
          // (movediv as any)的左右边，未出界
          (moveDiv as any).style.left = this.xPum + "px";
        } else if (this.xPum <= 0) {
          // 左边出界，则左边缘贴边
          (moveDiv as any).style.left = 0 + "px";
        } else if (this.xPum + (moveDiv as any).clientWidth >= windowWidth) {
          // 右边缘出界
          (moveDiv as any).style.left =
            windowWidth - (moveDiv as any).clientWidth + "px";
        }
        // 上下未出界
        if (
          this.yPum > 0 &&
          this.yPum + (moveDiv as any).clientHeight < windowHeight
        ) {
          (moveDiv as any).style.top = this.yPum + "px";
        } else if (this.yPum <= 0) {
          // 上边缘出界
          (moveDiv as any).style.top = 0 + "px";
        } else if (this.yPum + (moveDiv as any).clientHeight >= windowHeight) {
          // 下边缘
          (moveDiv as any).style.top =
            windowHeight - (moveDiv as any).clientHeight + "px";
        }

        // 阻止页面的滑动默认事件，为了只让悬浮球滑动，其他部分不滑动；如果碰到滑动问题，1.2 请注意是否获取到 touchmove, 系统默认passive: true，无法使用preventDefault
        // document.addEventListener("touchmove", function(){
        //    event.preventDefault();
        // }, { passive: false });
        // document.addEventListener("mousemove", function(){
        //     event.preventDefault();
        // }, { passive: false });
        document.addEventListener("touchmove", this.preventDefault, {
          passive: false
        });
        document.addEventListener("mousemove", this.preventDefault, {
          passive: false
        });
      }
    },
    //鼠标释放时候的函数，鼠标释放，移除之前添加的侦听事件，将passive设置为true，不然背景会滑动不了
    end(e: any) {
      this.UpX = e.clientX
      this.UpY = e.clientY
      this.flags = false;
      // 注意事项，在添加和删除监听事件时，其function必须是同名的函数，不能为匿名函数。
      document.removeEventListener("touchmove", this.preventDefault, false);
      document.removeEventListener("mousemove", this.preventDefault, false);
      // 下面两句是保证在移除监听事件后，除了悬浮球的部分还能够滑动，如果不添加，则无法滑动
      document.addEventListener("touchmove", function(e) {
        (window.event as any).returnValue = true;
      });
      document.addEventListener("mousemove", function(e) {
        (window.event as any).returnValue = true;
      });
    },
    preventDefault(e: any) {
      e.preventDefault();
    }
  }
});
</script>

<style lang="scss" scoped>
.xuanfu {
  /* 如果碰到滑动问题，1.3 请检查 z-index。z-index需比web大一级*/
  z-index: 99999999;
  position: fixed; // 这里的定位方式有待考量，fixed的话存在未知设置不合理，跑出屏幕不显示的问题
}
</style>
