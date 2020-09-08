<template>
  <div class="leftItemBox">
    <!-- 标题及右侧选项栏 -->
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
    </div>
    <!-- 标题栏结束 -->
    <!-- 投资金额top10 -->
    <div class="contentBox money">
      <div class="title">
        <div class="contentTitle">
          投资金额TOP10
        </div>
        <div class="labelBox">
          <div
            v-for="(item,index) in labelList" 
            :key="index" 
            class="labelItem"
            :class="{moneySelected: moneyIndex===item.id}"
            @click="moneyChange(item.id)"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
      <!-- 投资金额top10排名 -->
      <div class="rankBox">
        <div
          v-for="(item,index) in rankListMoney"
          :key="index"
          class="rankItem"
          :class="{top1: index===0,top2: index===1,top3: index===2}"
        >
          <div
            class="index"
            :class="{top: index+1<=3}"
          >
            {{ index+1 }}
          </div>
          <div class="content">
            {{ item.mbqyName }}
          </div>
          <div class="num">
            {{ item.govE2Money | thousands(that) }}{{ item.govUnitName }}
          </div>
          <div class="per">
            {{ item.govE2Rate | rate }}%
          </div>
        </div>
      </div>
    </div>
    <!-- 投资金额top10结束 -->
    <!-- 投资数量top10 -->
    <div class="contentBox money">
      <div class="title">
        <div class="contentTitle">
          投资数量TOP10
        </div>
        <div class="labelBox">
          <div
            v-for="(item,index) in labelList" 
            :key="index" 
            class="labelItem"
            :class="{moneySelected: numIndex===item.id}"
            @click="numChange(item.id)"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
      <!-- 投资数量top10排名 -->
      <div class="rankBox">
        <div
          v-for="(item,index) in rankListNum"
          :key="index"
          class="rankItem"
          :class="{top1: index===0,top2: index===1,top3: index===2}"
        >
          <div
            class="index"
            :class="{top: index+1<=3}"
          >
            {{ index+1 }}
          </div>
          <div class="content">
            {{ item.mbqyName }}
          </div>
          <div class="num">
            {{ item.govE2Size | thousands(that) }}{{ item.govUnitName }}
          </div>
          <div class="per">
            {{ item.govE2Rate | rate }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import {getE2} from "@/api/focusedInvestment"
import mixins from '@/components/polling/index.vue'
import { formData } from '@/utils/index'
export default Vue.extend({
  filters:{
    rate:function(val: number){
      if(val){
        return parseInt(val*100 + '')
      }
    },
    thousands:function(val: any,that: any){
      if(val){
        return that.$formatNum(val)
      }else{
        return ""
      }
    }
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
    areaCode:{
      type:String,
      default:()=>{
        return ""
      }
    },
  },
  data() {
    return {
      that:this,
      active:0,
      moneyIndex:1,
      numIndex:1,
      labelList:[
        {
          id:1,
          label:"省"
        },
        {
          id:2,
          label:"市"
        },
      ],
      rankListMoney:[],
      rankListNum:[]
    }
  },
  watch:{
    // moneyIndex(){
    //   this.getLeftTopData()
    // },
    // numIndex(){
    //   this.getLeftBottomData()
    // },
    areaCode(){
      let _this = this as any
      window.clearInterval(_this.timer)
      _this.timer = null
      _this.loop = 0
      this.getLeftTopData(this.moneyIndex)
      this.getLeftBottomData(this.numIndex)
    }
  },
  created(){
    let _this = this as any
    //获取区域外来资本概况money
    this.getLeftTopData(this.moneyIndex)
    //获取区域外来资本概况size
    this.getLeftBottomData(this.numIndex)
    setTimeout(() => {
      //启动轮询
      _this.pollingLabel()
    }, 2000);
  },
  methods: {
    //切换投资金额top10
    moneyChange(val: number){
      // this.moneyIndex = val
      this.getLeftTopData(val)
    },
    //切换投资数量top10
    numChange(val: number){
      // this.numIndex = val
      this.getLeftBottomData(val)
    },
    //获取区域外来资本概况money
    getLeftTopData(val: any){
        let _this = this as any
        let urlA1 = _this.$getModUrl('e','e2')
        getE2(formData({qydm:(this as any).areaCode,label:val,type:'money'}),urlA1).then((res: any)=>{
          if(res.code === "200" && JSON.parse(res.data).length){
            this.rankListMoney = JSON.parse(res.data)
            this.moneyIndex = val
          }
        })
    },
    //获取区域外来资本概况size
    getLeftBottomData(val: any){
        let _this = this as any
        let urlA1 = _this.$getModUrl('e','e2')
        getE2(formData({qydm:(this as any).areaCode,label:val,type:'size'}),urlA1).then((res: any)=>{
          if(res.code === "200"){
            this.rankListNum = JSON.parse(res.data)
            this.numIndex = val
          }
        })
    },
    //轮询切换label
    changeLabel(val: any){
      //获取区域外来资本概况money
      this.getLeftTopData(val)
      //获取区域外来资本概况size
      this.getLeftBottomData(val)
    }
  },
});
</script>


<style lang="scss" scope>
.leftItemBox {
  width: 100%;
  padding: 20px;
  background: url('~img/image_14.png') no-repeat;
  background-size: 100% 100%;
  .header {
    height: 36px;
    display: flex;
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
  }
  .contentBox{
    width:100%;
    height:45%;
    margin-top:28px;
    .title{
      width:100%;
      height:30px;
      background:rgba(67,246,255,0.2);
      .contentTitle{
        height:30px;
        line-height:30px;
        float:left;
        font-size: 14px;
        color:#43F6FF;
        margin-left:20px;
      }
      .labelBox{
        float:right;
        .labelItem{
          display:inline-block;
          width:66px;
          height:30px;
          line-height:30px;
          text-align: center;
          color:#fff;
          background:rgba(91,239,253,0.18);
          cursor: pointer;
          font-size: 14px;
        }
        .moneySelected{
          background:rgba(91,239,253,0.55)
        }
      }
    }
    .rankBox{
      height:90%;
      .rankItem{
          height:9%;
          background:rgba(114,255,250,0.08);
          display:flex;
          align-items: center;
          color:#fff;
          font-size: 13px;
          // line-height:2%;
          margin-top:2px;
          .index{
            width:30px;
            margin-left:5px;
            color:#40DCD6;
            text-align: center;
          }
          .top{
            color:#fff;
            font-size: 22px;
          }
          .content{
            width:180px;
            margin-left:15px;
          }
          .num{
            width:120px;
            text-align: center;
          }
          .per{
            width:60px;
            text-align: center;
          }
      }
      .top1{
        background: url("../../../assets/images/01.png")no-repeat, rgba(114,255,250,0.08);
      }
      .top2{
        background: url("../../../assets/images/02.png")no-repeat, rgba(114,255,250,0.08);
      }
      .top3{
        background: url("../../../assets/images/03.png")no-repeat, rgba(114,255,250,0.08);
      }
    }
  }
}
</style>