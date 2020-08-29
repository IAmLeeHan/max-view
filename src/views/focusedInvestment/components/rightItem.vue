<template>
  <div class="rightItemBox">
    <!-- 标题及右侧选项栏 -->
    <div class="header">
      <div class="title">
        <p class="leftBK"></p>
        <p class="middleBK">
          <span>外来资本投资行业</span>
        </p>
        <p class="rightBK"></p>
      </div>
    </div>
    <!-- 标题栏结束 -->
    <!-- 投资金额top10 -->
    <div class="contentBox money">
      <div class="title">
        <div class="labelItem nameLabel">
          行业名称
        </div>
        <div class="labelItem moneyLabel">
          投资金额
        </div>
        <div class="labelItem numLabel">
          投资数量
        </div>
      </div>
      <div class="rankBox">
        <div
          v-for="(item,index) in rankTopData"
          :key="index"
          class="rankItem"
        >
          <div class="name">
            {{ item.govE4Hydm }}
          </div>
          <div class="num">
            {{ item.govE4Money }}{{ item.govUnitName }}
          </div>
          <div class="per">
            {{ item.govE4Size }}{{ item.govUnitName1 }}
          </div>
        </div>
      </div>
    </div>
    <!-- 投资金额top10结束 -->
    <div class="header">
      <div class="title">
        <p class="leftBK"></p>
        <p class="middleBK">
          <span>外来资本投资企业</span>
        </p>
        <p class="rightBK">
        </p>
      </div>
      <span
        v-if="zczb"
        class="tips"
      >注册资本 ≥{{ zczb }} 万元</span>
    </div>
    <!-- 标题栏结束 -->
    <!-- 投资金额top10 -->
    <div class="contentBox money">
      <div class="title">
        <div class="labelItem nameLabel2">
          企业名称
        </div>
        <div class="labelItem moneyLabel2">
          投资金额
        </div>
      </div>
      <div class="rankBox">
        <div
          v-for="(item,index) in rankBottomData"
          :key="index"
          class="rankItem"
        >
          <div class="name2">
            {{ item.orgName }}
          </div>
          <div class="num2">
            {{ item.govE5Money }}{{ item.govUnitName }}
          </div>
        </div>
      </div>
    </div>
    <div class="checkMore">
      <span @click="checkMore">查看更多></span>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import {getE4,getE5} from "@/api/focusedInvestment"
import { formData } from '@/utils/index'
export default Vue.extend({
  props:{
    title:{
      type:String,
      default:'title'
    },
    areaCode:{
      type:String,
      default:'title'
    },
    subTitle:{
      type:Array,
      default:()=>{
        return []
      }
    },
    type:{
      type:String,
      default:""
    }
  },
  data() {
    return {
      active:0,
      rankTopData:[],
      rankBottomData:[] as any,
      zczb:0
    }
  },
  watch:{
    areaCode(){
      this.getTopData()
      this.getBottomData()
    }
  },
  created(){
    //获取数据
    this.getTopData()
    this.getBottomData()
  },
  methods: {
    //点击查看更多
    checkMore(){
      let val = {
        type:this.type,
        labelList:[]
      }
      this.$emit("checkMore",val)
    },
    //获取外来资本投资行业
    getTopData(){
      let _this = this as any
      let urlA1 = _this.$getModUrl('e','e4')
      getE4(formData({qydm:this.areaCode}),urlA1).then((res: any)=>{
        if(res.code === "200"){
          this.rankTopData = JSON.parse(res.data)
        }
      })
    },
    //获取外来资本投资企业
    getBottomData(){
      let _this = this as any
      let urlA1 = _this.$getModUrl('e','e5')
      getE5(formData({qydm:this.areaCode,pageNum:1,size:9}),urlA1).then((res: any)=>{
        if(res.code === "200"){
          // console.log(JSON.parse(res.data))
          this.rankBottomData = JSON.parse(res.data).records
          if(this.rankBottomData.length){
            this.zczb = this.rankBottomData[0].govE5Zczb
          }
        }
      })
    },
  },
});
</script>


<style lang="scss" scope>
.rightItemBox {
  width: 100%;
  padding: 20px;
  background: url('~img/border.png') no-repeat;
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
    .tips{
      color:#fff;
      font-size: 12px;
    }
  }
  .contentBox{
    width:100%;
    margin-top:15px;
    .title{
      width:100%;
      height:30px;
      background:rgba(67,246,255,0.2);
      font-size: 12px;
      .labelItem{
        height:30px;
        line-height:30px;
        float:left;
        color:#43F6FF;
      }
      .nameLabel{
        width:200px;
        margin-left:20px;
      }
      .nameLabel2{
        width:250px;
        margin-left:20px;
      }
      .moneyLabel{
        width:80px;
        text-align: center;
      }
      .moneyLabel2{
        width:80px;
        text-align: center;
      }
      .numLabel{
        width:80px;
        text-align: center;
      }
    }
    .rankBox{
      .rankItem{
          height:35px;
          background:rgba(114,255,250,0.08);
          display:flex;
          color:#fff;
          font-size: 12px;
          line-height:36px;
          margin-top:2px;
          .name{
            width:200px;
            margin-left:20px;
          }
          .name2{
            width:250px;
            margin-left:20px;
          }
          .num{
            width:80px;
            text-align: center;
          }
          .num2{
            width:80px;
            text-align: center;
          }
          .per{
            width:80px;
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
  .checkMore{
    width:100%;
    text-align: right;
    margin-top:10px;
    span{
      font-size: 14px;
      color:#239af1;
      cursor: pointer;
    }
  }
}
</style>