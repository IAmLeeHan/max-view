<template>
  <div
    class="loadShadow"
    @mousewheel="mousewheel"
  >
    <div class="box">
      <Lottie
        :options="defaultOptions"
        :height="200"
        :width="200"
      />
      <span class="loading">loading...</span>
    </div>
  </div>
</template>
 
<script>
import * as animationData from "@/assets/images/dataloading.json";
import Lottie from "vue-lottie/src/lottie.vue";

export default {
  components: {
    Lottie,
  },
  data() {
    return {
      defaultOptions: {
        animationData: animationData.default,
      },
    };
  },
  methods: {
    mousewheel(e) {
      e.preventDefault();
    },
  },
};
</script>
<style lang="scss" scoped>
.loadShadow {
  width: 100vw;
  height: 100vh;
  background: rgba(1, 14, 58, 0.7);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  .box {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    .loading {
      color: #00ffff;
    }
  }
}
</style>