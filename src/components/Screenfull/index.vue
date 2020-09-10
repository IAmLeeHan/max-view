<template>
  <div
    id="screenfull"
    ref="screen"
    class="screenfull"
    @click="click"
  >
    <svg-icon :name="isFullscreen? 'exit-fullscreen': 'icon_big'" />
    <span>{{ isFullscreen?'退出全屏':'最大化' }}</span>
  </div>
</template>

<script lang="ts">
import screenfull from "screenfull";
import Vue from "vue";
import { AppModule } from "@/store/modules/app";
import $ from "jquery"

const sf = screenfull;

export default Vue.extend({
  data(){
    return{
      timer:null
    }
  },
  computed: {
    isFullscreen() {
      return AppModule.isFullscreen;
    }
  },
  mounted() {
    let _this = this as any
    if (sf.isEnabled) {
      sf.on("change", this.change);
    }
    // _this.timer = window.setTimeout(() => {
    //   if(sf.isEnabled){
    //     _this.click()
    //   }
    // }, 3000);
  },

  beforeDestroy() {
    let _this = this as any
    if (sf.isEnabled) {
      sf.off("change", this.change);
    }
    window.clearTimeout(_this.timer)
    _this.timer = null
  },
  methods: {
    change() {
      if (sf.isEnabled) {
        this.$store.dispatch('SetIsFullscreen',sf.isFullscreen)
        // AppModule.isFullscreen = sf.isFullscreen;
      }
    },
    click() {
      let _this = this as any
      if (!sf.isEnabled) {
        _this.$message.closeAll();
        _this.$message({
          message: "you browser can not work",
          type: "warning"
        });
        return false;
      }
      sf.toggle();
    }
  }
});
</script>

<style lang="scss" scoped>
  .screenfull{
    display:flex;
    align-items: center;
  }
</style>
