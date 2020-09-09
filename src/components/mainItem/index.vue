<template>
  <div
    :style="showNetBg"
    class="mainItem"
  >
    <div class="bg">
      <div class="header">
        <div class="headerLeft">
          <div class="title">
            <p class="leftBK"></p>
            <p class="middleBK">
              <span>{{ title }}</span>
            </p>
            <p class="rightBK"></p>
          </div>
          <div class="position">
            <p>
              <svg-icon name="icon_dingwei"></svg-icon>
              <span>{{ addressValue }}</span>
            </p>
            <img
              v-if="qydm !== top"
              src="~img/icon_5.png"
              alt=""
              @click="clickGoback"
            >
          </div>
        </div>
        <ul
          v-if="orgList.length>0"
          class="headerRight"
        >
          <li
            v-for="(item,index) in orgList"
            :key="index"
          >
            <p class="subtitle">{{ item.name }}</p>
            <p>
              <count-to
                :start-val="0"
                :end-val="item.value"
                :duration="3600"
                class="card-panel-num"
              /> <span>家</span>
            </p>
          </li>
        </ul>
      </div>
      <div class="echarts">
        <geoMap
          ref="echartsHandle"
          width="100%"
          height="100%"
          @sendQydm="qydmFun"
        ></geoMap>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import countTo from 'vue-count-to'
import geoMap from '@/components/Charts/geoMap.vue'
import { UserModule } from '@/store/modules/user'
import { EAreaModule } from '@/store/modules/eArea'
import { MapModule } from '@/store/modules/map';
export default Vue.extend({
  components:{
    countTo,
    geoMap
  },
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
    showBg:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      active:0,
      bg:require('img/img_x.png')
    }
  },
  computed:{
    addressValue(){
      return EAreaModule.currentName
    },
    showNetBg(): string{
      return this.showBg ? "background:url(" + this.bg + ") no-repeat 100% 100% / 100% 100%" :''
    },
    qydm(){
      return EAreaModule.currentQydm
    },
    top(): string{
      return UserModule.govInfoTop
    },
    orgList(){
      return [
        // {
        //   name:'机构总数',
        //   value:EAreaModule.agencyTotal
        // },
        {
          name:'企业',
          value:EAreaModule.orgCount
        },
        // {
        //   name:'个体工商户',
        //   value:EAreaModule.unitCount
        // },
        // {
        //   name:'其他',
        //   value:EAreaModule.otherCount
        // }
      ]
    }
  },
  methods: {
    // address(val: string){
    //   (this as any).addressValue = val
    // },
    qydmFun(val: string){
      (this as any).qydm = val
    },
    changeActive(i: number){
      (this as any).active = i
    },
    clickGoback(){
      (this.$refs.echartsHandle as any).goBack()
    }
  },
});
</script>
<style lang="scss" scope>
.mainItem {
  width: 100%;
  background-size: 100% 100%;
  .bg{
    background: url('~img/border-big.png') no-repeat;
    background-size: 100% 100%;
    padding: 20px;
    width: 100%;
    height: 100%;
  }
  .header {
    height: 76px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    // @media screen and (max-width: 1200px){
    //   .headerLeft{
    //     width: 200px;
    //     flex-wrap: wrap;
    //   }
    // }
    .headerLeft{
      display: flex;
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
            background:linear-gradient(rgba(216,255,252,1) 0%, rgba(59,234,236,1) 99.21875%);
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
      .position{
        flex: 1;
        display: flex;
        align-items: center;
        p{
          color: #fff;
          padding: 0 30px;
          span{
            margin-left: 10px;
          }
        }
        img{
          &:hover{
            cursor: pointer;
          }
        }
      }
    }
    .headerRight{
      height: 76px;
      padding: 14px 30px;
      background: url('~img/header_bg.png') no-repeat;
      background-size: 100% 100%;
      display: flex;
      li{
        margin-right: 30px;
        color: #fff;
        font-size: 16px;
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        &:last-child{
          margin: 0;
        }
        &:first-child{
          .card-panel-num{
            font-size: 24px;
            color: #2DA9FF;
          }
          span{
            font-size: 14px;
            color: #2DA9FF;
          }
        }
        .subtitle{
          margin-bottom: 10px;
        }
        .card-panel-num{
          font-size: 18px;
          color: #1DD6CE;
          font-family: Arial;
          // font-weight: bold;
        }
        span{
          font-size: 14px;
          color: #1DD6CE;
        }
      }
    }
  }
  .echarts{
    width: 100%;
    height: calc(100% - 76px);
  }
}
</style>