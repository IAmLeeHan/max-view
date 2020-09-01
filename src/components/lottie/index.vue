<template>
  <div
    class="loadShadow"
    @mousewheel="mousewheel"
  >
    <Lottie
      :options="defaultOptions"
      :height="100"
      :width="100"
    />
  </div>
</template>
 
<script>
import * as animationData from '@/assets/images/dataloading.json'
import Lottie from 'vue-lottie/src/lottie.vue'
 
export default {
    components: {
        Lottie
    },
    data() {
        return {
            defaultOptions: {
                animationData: animationData.default
            }
        }
    },
    methods:{
        mousewheel(e){
            e.preventDefault();
        }
    }
}
</script>
<style lang="scss" scoped>
    .loadShadow{
        width: 100vw;
        height: 100vh;
        background: rgba(1,14,58,.7);
        position: fixed;
        left: 0;
        right: 0;
        top:0;
        bottom: 0;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }
</style>