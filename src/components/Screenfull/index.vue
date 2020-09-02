<template>
  <div
    id="screenfull"
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

const sf = screenfull;

export default Vue.extend({
  computed: {
    isFullscreen() {
      return AppModule.isFullscreen;
    }
  },

  mounted() {
    if (sf.isEnabled) {
      sf.on("change", this.change);
    }
  },

  beforeDestroy() {
    if (sf.isEnabled) {
      sf.off("change", this.change);
    }
  },
  methods: {
    change() {
      if (sf.isEnabled) {
        this.$store.dispatch('SetIsFullscreen',sf.isFullscreen)
        // AppModule.isFullscreen = sf.isFullscreen;
      }
    },
    click() {
      if (!sf.isEnabled) {
        this.$message({
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
