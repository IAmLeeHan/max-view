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
      <div class="year" v-if="year">
        <svg-icon class="svgIcon" name="calendar" />
        <span>{{year}}</span>
      </div>
      <ul
        v-if="subTitle.length>0&&showSwiper"
        :class="[{margin: subTitle.length<=3},{flexStart: flexStart}]"  
      >
        <li 
          v-for="(item,index) in subTitle" 
          :key="index"
          :class="[{active: active === index},{disabled: item.disabled}]"
          @click="changeActive(index,item.value)"
        >
          {{ item.name }}
        </li>
      </ul>
      <swiper
        v-else
        id="#swiper-container"
        ref="mySwiper"
        :options="swiperOption"
        :class="['swiperBox',{margin: subTitle.length<=3},{flexStart: flexStart}]"
      >
        <swiper-slide 
          v-for="(item,index) in subTitle" 
          :key="index"
          :class="['swiper_slide',{active: active === index},{disabled: item.disabled}]"
        >
          {{ item.name }}
        </swiper-slide>
      </swiper>
    </div>
    <div class="DateBox">
      <slot name="Date"></slot>
    </div>
    <div class="echarts">
      <slot name="echarts"></slot>
    </div>
    <div class="button">
      <slot name="button"></slot>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import mixins from './mixins/index.vue';
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default Vue.extend({
  components:{
    swiper,
    swiperSlide
  },
  mixins:[mixins],
  props:{
    title:{
      type:String,
      default:'title'
    },
    subTitle:{
      type:Array,
      default:()=>{
        return []
      }
    },
    flexStart:{
      type:Boolean,
      default:false
    },
    showSwiper:{
      type:Boolean,
      default:true
    },
    govKey:{
      type:String,
      default:''
    },
    year:{
      type:[String,Number],
      default:''
    }
  },
  data() {
    const that = this as any
    return {
      a:0,
      active:0,
      swiperOption: {
        freeMode: true,
        freeModeMomentumRatio: 0.5,
        slidesPerView: 'auto',
        resistanceRatio:0.7,
        on:{
          click:function(swiper: any){
            that.a = (this as any).clickedIndex
          }
        },
      }
    }
  },
  watch:{
    a(n,o){
      let _this = this as any
      let item = _this.subTitle.filter((item: any,i: number)=>{
        return i === n
      })
      let id = item[0].value
      _this.changeActive(_this.a,id)
    }
  },
  methods: {
    changeActive(i: number,value: any){
      let _this = this as any
      _this.active = i
      let key = _this.govKey
      if(key){
        sessionStorage.setItem(key,JSON.stringify({index:i,value:value}))
      }
      _this.$emit('changeCH',value)
    }
  },
});
</script>


<style lang="scss" scope>
.moduleItem {
  width: 100%;
  padding: 20px;
  background: url('~img/border.png') no-repeat;
  background-size: 100% 100%;
  position: relative;
  .header {
    height: 36px;
    display: flex;
    padding-right: 4px;
    align-items: flex-end;
    justify-content: space-between;
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
    .year{
      margin:6px 10px;
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #43F6FF;
      .svg-icon{
        width: 14px!important;
        height: 14px!important;
      }
      span{
        padding-left: 6px;
      }
    }
    ul{
      display: flex;
      flex: 1;
      align-items: center;
      // padding-right:20px; 
      justify-content: space-around;
      &.margin{
        justify-content: flex-end;
        li{
          margin-left:14px;
          &:first-child{
            margin:0px;
          }
        }
      }
      &.flexStart{
        padding:0 10px;
        justify-content: space-between;
        overflow: auto;
        li{
          margin-left:0px!important;
        }
      }
      li{
        flex-shrink: 0;
        margin-left: 14px;
        font-size: 14px;
        color: #fff;
        padding-bottom: 6px;
        &:hover{
          cursor: pointer;
          color: #43F6FF;
        }
        &.active{
          color: #43F6FF;
          border-bottom:1px solid #43F6FF;
        }
        &.disabled{
          color: #fff;
          pointer-events: none;
          cursor: pointer;
          opacity: 0.6;
        }
      }
    }
    .swiperBox{
      flex: 1;
      .swiper_slide{
        width: auto!important;
        margin-left: 20px;
        font-size: 14px;
        color: #fff;
        padding-bottom: 6px;
        &:hover{
          cursor: pointer;
          color: #43F6FF;
        }
        &.active{
          color: #43F6FF;
          border-bottom:1px solid #43F6FF;
        }
        &.disabled{
          color: #fff;
          pointer-events: none;
          cursor: pointer;
          opacity: 0.6;
        }
      }
    }
  }
  .DateBox{
    margin-top: 20px;
    position: absolute;
    z-index: 3000;
    background: url('~img/middleBK.png') no-repeat left bottom / 100% 100%;
    color: #fff;
  }
  .echarts{
    width: 100%;
    height: calc(100% - 36px);
  }
  .button{
    width: 100%;
    position: absolute;
    bottom: 10px;
    display: flex;
    justify-content: center;
  }
}
</style>