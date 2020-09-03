<template>
  <div class="moduleItem">
    <div class="header">
      <div class="title">
        <p class="leftBK"></p>
        <p class="middleBK">
          <span>{{ title }}</span>
        </p>
        <p class="rightBK"></p>
      </div>
      <ul
        v-if="subTitle.length>0"
        :class="{margin: subTitle.length<=3}"  
      >
        <li 
          v-for="(item,index) in subTitle" 
          :key="index"
          :class="{active: active === index}"
          @click="changeActive(index)"
        >
          {{ item }}
        </li>
      </ul>
      <!-- 展示定位 -->
      <div class="locationBox">
        <svg-icon name="icon_dingwei"></svg-icon>
        <span class="locationName">{{ areaName }}</span>
      </div>
    </div>
    <div class="echarts">
      <slot name="echarts"></slot>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props:{
    title:{
      type:String,
      default:'title'
    },
    areaName:{
      type:String,
      default:''
    },
    subTitle:{
      type:Array,
      default:()=>{
        return []
      }
    }
  },
  data() {
    return {
      active:0,
    }
  },
  methods: {
    changeActive(i: number){
      (this as any).active = i
    },
    
  },
});
</script>


<style lang="scss" scope>
.moduleItem {
  width: 100%;
  padding: 20px;
  background: url('~img/border.png') no-repeat;
  background-size: 100% 100%;
  .header {
    height: 36px;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    .title {
      display: flex;
      .leftBK{
        width: 14px;
        padding-bottom: 10px;
        background: url('~img/leftBK.png') no-repeat left bottom;
        background-size: 100% 70%;
      }
      .middleBK{
        padding:0 6px 10px 6px;
        background: url('~img/middleBK.png') no-repeat left bottom;
        background-size: 100% 70%;
        span {
          font-size: 18px;
          color: rgba(255, 255, 255, 1);
          font-weight: bold;
          background:linear-gradient(0deg,rgba(216,255,252,1) 0%, rgba(59,234,236,1) 99.21875%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
      .rightBK{
        width: 14px;
        padding-bottom: 10px;
        background: url('~img/rightBK.png') no-repeat left bottom;
        background-size: 100% 70%;
      }
    }
    ul{
      display: flex;
      flex: 1;
      align-items: center;
      padding-right:20px; 
      justify-content: space-around;
      &.margin{
        justify-content: center;
        li{
          margin-left: 40px;
          &:first-child{
            margin:0;
          }
        }
      }
      li{
        font-size: 14px;
        color: #fff;
        padding-bottom: 6px;
        &:hover{
          cursor: pointer;
        }
        &.active{
          color: #43F6FF;
          border-bottom:1px solid #43F6FF;
        }
      }
    }
    .locationBox{
      margin-left:30px;
      .svg-icon{
        font-size: 18px;
        color:#fff;
      }
      .locationName{
        font-size: 18px;
        color:#fff;
        font-weight: 500;
        margin-left:10px;
      }
    }
  }
  .echarts{
    width: 100%;
    height: calc(100% - 36px);
  }
}
</style>