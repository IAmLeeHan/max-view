<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script lang="ts">
// import { Component, Vue, Watch } from "vue-property-decorator";
import Vue from 'vue'
import screenfull from 'screenfull'
import {AppModule} from '@/store/modules/app'

const sf = screenfull

export default Vue.extend({
  mounted(){
    window.addEventListener("keydown", this.KeyDown, true);//监听按键事件
  },
  beforeDestroy(){
    window.removeEventListener("keydown", this.KeyDown, true);//监听按键事件
  },
  methods: {
    toFullscreen() {
      //不支持screenfull全屏，则打印错误
      if (!screenfull.isEnabled) {
        console.error("unEnabled");
        return;
      }
      screenfull.toggle();
      this.$store.dispatch('SetIsFullscreen',!(sf as any).isFullscreen)
    },
    KeyDown(event: any) {
      if (event.keyCode === 122) {
        event.returnValue = false;
        this.toFullscreen();
      }
    }
  }
})
</script>


<style></style>
