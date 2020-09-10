<template>
  <div class="middleBottomBox">
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
        v-if="labelList.length>0"
        :class="{margin: labelList.length<=3}"  
      >
        <li 
          v-for="(item,index) in labelList" 
          v-if="(item.ruleId===1)||(item.ruleId===2&&item.hasValue)||(item.ruleId===0)"
          :key="index"
          :class="{active: active === item.id,noData: (item.ruleId===1&&!item.hasValue)||(item.ruleId===0&&!item.hasValue)}"
          @click="changeLabel(item.id,item.label,item.ruleId,item.hasValue)"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>
    <!-- 标题栏结束 -->
    <!-- 对外投资企业列表 -->
    <div class="contentBox money">
      <div class="title">
        <div class="titleItem nameLabel">
          企业名称
        </div>
        <div class="titleItem capitalLabel">
          注册资本
        </div>
        <div class="titleItem timeLable">
          成立时间
        </div>
        <div class="titleItem frLabel">
          法定代表人
        </div>
      </div>
      <!-- 投资金额top10排名 -->
      <div class="rankBox">
        <div
          v-for="(item,index) in rankList"
          :key="index"
          class="rankItem"
        >
          <div class="name">
            {{ item.orgName }}
          </div>
          <div class="capital">
            {{ item.govE3Money }}万元
          </div>
          <div class="time">
            {{ item.creatrTime | time }}
          </div>
          <div class="frmc">
            {{ item.fddbr }}
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
import {getE3Label,getE3} from "@/api/focusedInvestment"
import mixins from '@/components/polling/index.vue'
import { formData } from '@/utils/index'
import getTagRule from '@/utils/getTagRule';
import {getGovModSleep} from '@/utils/getsleep';

export default Vue.extend({
  filters:{
    time:function(val: any){
      if(val){
        return val.split("T")[0]
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
    type:{
      type:String,
      default:''
    },
    areaCode:{
      type:String,
      default:''
    },
  },
  data() {
    return {
      active:0,
      rankList:[],
      labelList:[] as any,
      modSleep:0,
      e3ModTimer:null
    }
  },
  watch:{
    areaCode(){
      let _this = this as any
      window.clearInterval(_this.timer)
      _this.timer = null
      _this.loop = 0
      this.getLabel(1)
    }
  },
  created(){
    //获取筛选label
    this.getLabel(1)
    //模块定时刷新
    this.getModSleep()
  },
  beforeDestroy(){
    let _this = this as any
    if(_this.e3ModTimer){
      window.clearInterval(_this.e3ModTimer)
      this.e3ModTimer = null
    }
    
  },
  methods: {
    //切换标签栏
    changeLabel(val: number,name: any,ruleId: any,hasValue: any){
      if((ruleId===1&&hasValue)||(ruleId===0&&hasValue)){
        this.getEnterpriseData(val)
      }
      if(ruleId===2){
        this.getEnterpriseData(val)
      }
    },
    //点击查看更多
    checkMore(){
      let val = {
        type:this.type,
        labelList:this.labelList,
        labelId:this.active
      }
      this.$emit("checkMore",val)
    },
    //获取标签Label
    getLabel(flag: any){
      let _this = this as any
      let urlA1 = _this.$getModUrl('e','e3')
      let ruleId = getTagRule("e","e3")
      getE3Label(formData({qydm:this.areaCode}),urlA1).then((res: any)=>{
          if(res.code === "200"){
            let data = ""
            JSON.parse(this.$store.state.user.indexList).map((item: any)=>{
              if(item.govIndexId === 'e'){
                item.modules.map((_item: any)=>{
                  if(_item.govModId === 'e3'){
                    data = _item.govModLabels
                  }
                })
              }
            })
            this.labelList = this.operateLabel(data)
            this.labelList.map((item: any)=>{
              this.$set(item,'ruleId',ruleId)
              res.data.map((_item: any)=>{
                if(item.id == _item.label && _item.count>0){
                  this.$set(item,'hasValue',true)
                }
              })
            })
            let arr = this.labelList.filter((item: any)=>{
              return item.hasValue
            })
            // if(arr.length){
            //   this.active = arr[0].id
            // }
            if(_this.govModNext || flag){
                if(arr.length){
                   this.active = arr[0].id
                }
              }
            //获取对外投资活跃企业数据
            this.getEnterpriseData(this.active)
            //启动轮询
            _this.pollingLabel()
          }
      })
    },
    //处理标签方法
    operateLabel(val: any){
        let arr = val.split(";")
        let newArr = [] as any
        arr.map((item: any)=>{
          let val = {
            label:item.split(":")[0],
            id:item.split(":")[1]
          }
          newArr.push(val)
        })
        return newArr
    },
    //获取对外投资活跃企业数据
    getEnterpriseData(val: any){
      let _this = this as any
      let urlA1 = _this.$getModUrl('e','e3')
      getE3(formData({qydm:this.areaCode,label:val,pageNum:1,size:7}),urlA1).then((res: any)=>{
          if(res.code === "200" && res.data && JSON.parse(res.data).records.length){
            this.rankList = JSON.parse(res.data).records
            this.active = val
          }
      })
    },
    getModSleep(){
      let _this = this as any
      this.modSleep = getGovModSleep("e","e3")
      if(this.modSleep){
        _this.e3ModTimer = setInterval(() => {
          setTimeout(()=>{
            window.clearInterval(_this.timer)
            _this.timer = null
            _this.loop = 0
            this.getLabel(0)
          }, 0)
        }, this.modSleep*1000)
      }
    }
  }
});
</script>


<style lang="scss" scope>
.middleBottomBox {
  width: 100%;
  padding: 20px;
  background: url('~img/img_k2.png') no-repeat;
  background-size: 100% 100%;
  overflow-y: auto;
  // margin-top:20px;
  .header {
    height: 36px;
    .title {
      display: flex;
      float:left;
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
      justify-content: space-between;
      padding-right:20px; 
      float:right;
      margin-top:10px;
      width:75%;
      &.margin{
        justify-content: center;
        li{
          margin-right: 40px;
          &:last-child{
            margin:0;
          }
        }
      }
      li{
        font-size: 14px;
        color: #fff;
        padding-bottom: 6px;
        &:last-child{
            margin:0;
        }
        &:hover{
          cursor: pointer;
          color: #43F6FF;
        }
        &.active{
          color: #43F6FF;
          border-bottom:1px solid #43F6FF;
        }
        &.noData{
          color:rgba(255, 255, 255, 0.5);
          pointer-events: none;
        }
      }
    }
  }
  .contentBox{
    width:100%;
    margin-top:20px;
    .title{
      width:100%;
      height:30px;
      background:rgba(67,246,255,0.2);
      display:flex;
      align-items: center;
      .titleItem{
        height:30px;
        line-height:30px;
        font-size: 14px;
        color:#43F6FF;
        
      }
      .nameLabel{
        width:450px;
        margin-left:20px;
      }
      .capitalLabel{
        width:140px;
        text-align: center;
      }
      .timeLable{
        width:110px;
        text-align: center;
      }
      .frLabel{
        width:110px;
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
          line-height:35px;
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
          .name{
            width:450px;
            margin-left:20px;
          }
          .capital{
            width:140px;
            text-align: center;
          }
          .time{
            width:110px;
            text-align: center;
          }
          .frmc{
            width:110px;
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
      color:#3DD3CF;
      cursor: pointer;
    }
  }
}
</style>