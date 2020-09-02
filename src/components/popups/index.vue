<template>
  <transition name="el-fade-in-linear">
    <div
      v-if="dialogTableVisible"
      class="popusShadow"
      @click.stop="close"
    >
      <div
        class="popups"
        @click.stop
      >
        <div class="header">
          <slot name="popups-header"></slot>
          <i
            class="el-icon-close"
            @click.stop="close"
          ></i>
        </div>
        <slot name="popups-content"></slot>
      </div>
    </div>
  </transition>
</template>


<script lang="ts">
import Vue from 'vue';
import {AppModule} from '@/store/modules/app'
export default Vue.extend({
  computed:{
    dialogTableVisible(){
      return AppModule.dialogTableVisible
    }
  },
  methods: {
    close(){
      this.$store.dispatch('SetDialogTableVisible',false)
      this.$emit('popupClose')
    }
  },
})
</script>


<style lang="scss" scope>
.popusShadow{
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  right: 0;
  top:0;
  bottom:0;
  margin:auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,.5);
  z-index: 9999;
  .popups{
    width: 1106px;
    max-height: 610px;
    background: #1680A8;
    .header{
      width: 100%;
      height: 60px;
      background: #0F6997;
      position: relative;
      display: flex;
      align-items: center;
      .el-icon-close{
        position: absolute;
        right: 20px;
        color: #fff;
        font-size: 28px;
        &:hover{
          cursor: pointer;
        }
      }
    }
  }
}
</style>