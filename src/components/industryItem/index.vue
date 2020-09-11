<template>
  <div 
    class="industryItem"
  >
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
    <!-- 标签栏 -->
    <div class="labelBox">
      <div
        v-for="(item,index) in labelList"
        v-if="(item.ruleId===1)||(item.ruleId===2&&item.hasValue)||(item.ruleId===0)"
        :key="index"
        class="labelItem"
        :class="{selected: labelIndex===item.id,hover: hoverIndex===item.id&&labelIndex!==hoverIndex,noData: (item.ruleId===1&&!item.hasValue)||(item.ruleId===0&&!item.hasValue)}"
        @click="changeLabel(item.id,item.label,item.ruleId,item.hasValue)"
        @mouseenter="hover(item.id)"
        @mouseleave="hoverLeave()"
      >
        {{ item.label }}
      </div>
    </div>
    <!-- 排名栏 -->
    <div
      v-if="type==='pillarIndustry'"
      class="rankLeftBox rankBox"
    >
      <div
        v-for="(item,index) in top10Data"
        :key="index"
        class="rankItem"
        :class="{top1: index===0&&order===1,top2: index===1&&order===1,top3: index===2&&order===1,itemSelected: (item.hydmCode===itemIndex&&index>2&&order===1)||(item.hydmCode===itemIndex&&order===0),itemSelected1: item.hydmCode===itemIndex&&index===0&&order===1,itemSelected2: item.hydmCode===itemIndex&&index===1&&order===1,itemSelected3: item.hydmCode===itemIndex&&index===2&&order===1}"
        @click="selectedItem(item.hydmCode)"
      >
        <div
          class="index"
          :class="{top: index+1<=3&&order===1}"
        >
          {{ index+1 }}
        </div>
        <div class="content">
          {{ item.hydmName }}
        </div>
        <div class="num">
          {{ item.counts }}{{ item.unit }}
        </div>
      </div>
    </div>
    <div
      v-if="type==='starIndustry'"
      class="rankMiddleBox rankBox"
    >
      <div class="rankContent">
        <div class="rankLabelItem">
          全国排名
        </div>
        <div
          v-show="flag!==0"
          class="rankLabelItem"
        >
          省级排名
        </div>
        <div
          v-show="flag===2&&!Municipality"
          class="rankLabelItem"
        >
          市排名
        </div>
      </div>
      <div
        v-for="(item,index) in top10Data"
        :key="index"
        class="rankItem"
        :class="{top1: index===0&&order===1,top2: index===1&&order===1,top3: index===2&&order===1,itemSelected: (item.hydmCode===itemIndex&&index>2&&order===1)||(item.hydmCode===itemIndex&&order===0),itemSelected1: item.hydmCode===itemIndex&&index===0&&order===1,itemSelected2: item.hydmCode===itemIndex&&index===1&&order===1,itemSelected3: item.hydmCode===itemIndex&&index===2&&order===1}"
        @click="selectedItem(item.hydmCode)"
      >
        <div
          class="index"
          :class="{top: index+1<=3&&order===1}"
        >
          {{ index+1 }}
        </div>
        <div class="content">
          {{ item.hydmName }}
        </div>
        <div class="num">
          {{ $formatNum(item.counts) }}{{ item.unit }}
        </div>
        <div class="rank cityRank">
          {{ item.spm | spm(that) }}
        </div>
        <div class="rank provinceRank">
          {{ item.sfpm | rank }}
        </div>
        <div class="rank countryRank">
          {{ item.qgpm | rank }}
        </div>
      </div>
    </div>
    <div
      v-if="type==='potentialIndustry'"
      class="rankRightBox rankBox"
    >
      <div
        v-for="(item,index) in top10Data"
        :key="index"
        class="rankItem"
        :class="{top1: index===0&&order===1,top2: index===1&&order===1,top3: index===2&&order===1,itemSelected: item.hydmCode===itemIndex&&index>2,itemSelected1: item.hydmCode===itemIndex&&index===0,itemSelected2: item.hydmCode===itemIndex&&index===1,itemSelected3: item.hydmCode===itemIndex&&index===2}"
        @click="selectedItem(item.hydmCode)"
      >
        <div
          class="index"
          :class="{top: index+1<=3&&order===1}"
        >
          {{ index+1 }}
        </div>
        <div class="content">
          {{ item.hydmName }}
        </div>
        <!-- <div class="num">{{item.num}}万家</div> -->
        <div class="perBox">
          <div
            class="per up"
          >
            {{ item.rata | rata }}
          </div>
          <div
            v-if="item.rata>0"
            class="flag up"
          >
            ↑
          </div>
          <!-- <div
            v-else
            class="flag down"
          >
            ↓
          </div> -->
        </div>
      </div>
    </div>
    <div
      class="echarts"
      :class="{pillarIndustry: type==='pillarIndustry',starIndustry: type==='starIndustry',potentialIndustry: type==='potentialIndustry'}"
    >
      <slot name="echarts"></slot>
    </div>
    <!-- 加载动画 -->
    <!-- <lottie class="loading" v-if="loading"></lottie> -->
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import {getAreaCode,getAdvantageLeftData,getAdvantageMiddleData,getAdvantageRightData,showLabel} from "@/api/advantageIndustry"
import { formData } from '@/utils/index'
import mixins from '@/components/polling/index.vue'
import lottie from '@/components/lottie/index.vue';
import getTagRule from '@/utils/getTagRule';
import {getGovModSleep,getGovModOrder} from '@/utils/getsleep';

export default Vue.extend({
  // components:{
  //   lottie
  // },
  filters:{
    rata:function(val: any){
      if(val){
        if(val*1>=0){
          return Math.abs(parseInt(val*100 + ''))+"%"
        }else{
          return "--"
        }
      }else{
        return "--"
      }
    },
    //省排名 全国排名
    rank:function(val: any){
      if(val){
        if(val*1>999){
          return "999+"
        }else{
          return val
        }
      }
    },
    //市排名
    spm:function(val: any,that: any){
      if(that.flag === 2 && that.Municipality){
        return ""
      }else{
        if(val){
          if(val.split("/")[0]*1>999){
            return "999+"
          }else{
            return val
          }
        }
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
      default:'',
      type:String
    },
    areaCode:{
      default:'',
      type:String
    },
  },
  data() {
    return {
      labelList:[],
      that:this,
      hoverIndex:-1,
      active:0,
      labelIndex:0,
      labelName:"",
      top10Data:[] as any,
      itemIndex:"" as any,
      loading:true,
      flag:0,//0:省，1市，2区,
      Municipality:false,//直辖市
      c1ModTimer:null,
      c2ModTimer:null,
      c3ModTimer:null,
      modSleep:0,
      order:1
    }
  },
  watch: {
    areaCode(){
      let _this = this as any
      window.clearInterval(_this.timer)
      _this.timer = null
      _this.loop = 0
      this.judgeArea()
      this.getData(this.labelIndex,this.labelName,1)
    },
  },
  created(){
    //页面刷新
    this.getModSleep()
    
    let _this = this as any
    //判断当前绑定的地区层级
    this.judgeArea()
    //获取标签数据
    this.getLabelList(1)
  },
  beforeDestroy(){
    let _this = this as any
    if(_this.c1ModTimer){
      window.clearInterval(_this.c1ModTimer)
      this.c1ModTimer = null
    }
    if(_this.c2ModTimer){
      window.clearInterval(_this.c2ModTimer)
      this.c2ModTimer = null
    }
    if(_this.c3ModTimer){
      window.clearInterval(_this.c3ModTimer)
      this.c3ModTimer = null
    }
  },
  methods: {
    hoverLeave(){
      this.hoverIndex = -1
    },
    hover(val: any){
      this.hoverIndex = val
    },
    changeActive(i: number){
      (this as any).active = i
    },
    //切换标签栏
    changeLabel(val: number,name: any,ruleId: any,hasValue: any){
      if((ruleId===1&&hasValue)||(ruleId===0&&hasValue)){
        this.getData(val,name,1)
      }
      if(ruleId===2){
        this.getData(val,name,1)
      }
    },
    //选中某个列表
    selectedItem(val: number){
      this.itemIndex = val
      let params = {
        type:this.type,
        data:[],
        labelName:this.labelName,
        industryName:""
      }
      this.top10Data.map((item: any)=>{
        if(this.itemIndex === item.hydmCode){
          params.data = item.charts,
          params.industryName = item.hydmName
        }
      })
      this.$emit("getIndustry",params)
    },
    //获取数据
    getData(val: any,name: any,flag: any){
      this.loading = true
      let _this = this as any
      //区域支柱行业
      if(this.type === "pillarIndustry"){
          let urlA1 = _this.$getModUrl('c','c1')
          getAdvantageLeftData(formData({qydm:this.areaCode,label:val}),urlA1).then((res: any)=>{
            this.loading = false
            if(res.code === "200" && JSON.parse(res.data).length){
              this.top10Data = JSON.parse(res.data)
              if(this.top10Data.length&&this.top10Data[0].isOrder&&this.top10Data[0].isOrder === 1){
                this.order = 1
              }else{
                //判断模块是否需要排序
                this.getOrder()
              }
              if(flag){
                this.itemIndex = this.top10Data[0].hydmCode
                let params = {
                  type:this.type,
                  data:this.top10Data[0].charts,
                  labelName:name,
                  industryName:this.top10Data[0].hydmName
                }
                this.$emit("getIndustry",params)
              }else{
                let params = {
                  type:this.type,
                  data:[] as any,
                  labelName:name,
                  industryName:""
                }
                this.top10Data.map((item: any)=>{
                  if(item.hydmCode === this.itemIndex){
                    params.data = item.charts
                    params.industryName = item.hydmName
                  }
                })
                this.$emit("getIndustry",params)
              }
              this.labelIndex = val
              this.labelName = name
            }
          })
      }
      //区域明星行业
      if(this.type === "starIndustry"){
          let urlA1 = _this.$getModUrl('c','c2')
          getAdvantageMiddleData(formData({qydm:this.areaCode,label:val}),urlA1).then((res: any)=>{
            this.loading = false
            if(res.code === "200" && JSON.parse(res.data).length){
              this.top10Data = JSON.parse(res.data)
              if(this.top10Data.length&&this.top10Data[0].isOrder&&this.top10Data[0].isOrder === 1){
                this.order = 1
              }else{
                //判断模块是否需要排序
                this.getOrder()
              }
              if(flag){
                this.itemIndex = this.top10Data[0].hydmCode
                let params = {
                  type:this.type,
                  data:this.top10Data[0].charts,
                  labelName:name,
                  industryName:this.top10Data[0].hydmName
                }
                this.$emit("getIndustry",params)
              }else{
                let params = {
                  type:this.type,
                  data:[] as any,
                  labelName:name,
                  industryName:""
                }
                this.top10Data.map((item: any)=>{
                  if(item.hydmCode === this.itemIndex){
                    params.data = item.charts
                    params.industryName = item.hydmName
                  }
                })
                this.$emit("getIndustry",params)
              }
              this.labelIndex = val,
              this.labelName = name
            }
          })
      }
      //区域潜力行业
      if(this.type === "potentialIndustry"){
          let urlA1 = _this.$getModUrl('c','c3')
          getAdvantageRightData(formData({qydm:this.areaCode,label:val}),urlA1).then((res: any)=>{
            this.loading = false
            if(res.code === "200" && JSON.parse(res.data).length){
              this.top10Data = JSON.parse(res.data)
              if(this.top10Data.length&&this.top10Data[0].isOrder&&this.top10Data[0].isOrder === 1){
                this.order = 1
              }else{
                //判断模块是否需要排序
                this.getOrder()
              }
              if(flag){
                this.itemIndex = this.top10Data[0].hydmCode
                let params = {
                  type:this.type,
                  data:this.top10Data[0].charts,
                  labelName:name,
                  industryName:this.top10Data[0].hydmName
                }
                this.$emit("getIndustry",params)
              }else{
                let params = {
                  type:this.type,
                  data:[] as any,
                  labelName:name,
                  industryName:""
                }
                this.top10Data.map((item: any)=>{
                  if(item.hydmCode === this.itemIndex){
                    params.data = item.charts
                    params.industryName = item.hydmName
                  }
                })
                this.$emit("getIndustry",params)
              }
              this.labelIndex = val,
              this.labelName = name
            }
          })
      }
    },
    //判断层级
    judgeArea(){
      if(this.areaCode.indexOf("0000")!==-1){
        this.flag = 0
      }else if(this.areaCode.indexOf("0000") ===-1 && this.areaCode.indexOf("00")!==-1){
        this.flag = 1
      }else if(this.areaCode.indexOf("0000") ===-1 && this.areaCode.indexOf("00")===-1){
        this.flag = 2
      }
      if(this.flag === 2){
        if(this.areaCode.substr(0,2)==="11" || this.areaCode.substr(0,2)==="12" || this.areaCode.substr(0,2)==="31" || this.areaCode.substr(0,2)==="50"){
          this.Municipality = true
        }
      }
    },
    //获取标签
    getLabelList(flag: any){
      let leftLabel = [] as any
      let rightLabel = [] as any
      let middleLabel = [] as any
      JSON.parse(this.$store.state.user.indexList).map((item: any)=>{
        if(item.govIndexId === "c"){
          if(this.type === 'pillarIndustry'){
            item.modules.map((_item: any)=>{
              if(_item.govModId === 'c1'){
                if(_item.govModLabels){
                  leftLabel = this.operateLabel(_item.govModLabels)
                }
              }
            })
          }
          if(this.type === 'starIndustry'){
            item.modules.map((_item: any)=>{
              if(_item.govModId === 'c2'){
                if(_item.govModLabels){
                  middleLabel = this.operateLabel(_item.govModLabels)
                }
              }
            })
          }
          if(this.type === 'potentialIndustry'){
            item.modules.map((_item: any)=>{
              if(_item.govModId === 'c3'){
                if(_item.govModLabels){
                  rightLabel = this.operateLabel(_item.govModLabels)
                }
              }
            })
          }
        }
      })
      let _this = this as any
      showLabel(formData({qydm:this.areaCode})).then((res: any)=>{
        if(res.code === "200"){
          if(this.type === "pillarIndustry"){
            if(res.data.c1 && res.data.c1.length){
              let ruleId = getTagRule("c","c1")
              leftLabel.map((item: any)=>{
                this.$set(item,'ruleId',ruleId)
                res.data.c1.map((_item: any)=>{
                  if(item.id == _item.label && _item.count>0){
                    this.$set(item,'hasValue',true)
                  }
                })
              })
              this.labelList = leftLabel
              let arr = [] as any
              arr = this.labelList.filter((item: any)=>{
                return item.hasValue
              })
              if(_this.govModNext || flag){
                if(arr.length){
                  this.labelIndex = arr[0].id
                  this.labelName = arr[0].label
                }
              }
              //开启标签轮询
              _this.pollingLabel()
              //获取数据
              this.getData(this.labelIndex,this.labelName,flag)
            }
          }
          if(this.type === "starIndustry"){
            if(res.data.c2 && res.data.c2.length){
              let ruleId = getTagRule("c","c2")
              middleLabel.map((item: any)=>{
                this.$set(item,'ruleId',ruleId)
                res.data.c2.map((_item: any)=>{
                  if(item.id == _item.label && _item.count>0){
                    this.$set(item,'hasValue',true)
                  }
                })
              })
              this.labelList = middleLabel
              let arr = [] as any
              arr = this.labelList.filter((item: any)=>{
                return item.hasValue
              })
              if(_this.govModNext || flag){
                if(arr.length){
                  this.labelIndex = arr[0].id
                  this.labelName = arr[0].label
                }
              }
              //开启标签轮询
              _this.pollingLabel()
              //获取数据
              this.getData(this.labelIndex,this.labelName,flag)
            }
          }
          if(this.type === "potentialIndustry"){
            if(res.data.c3 && res.data.c3.length){
              let ruleId = getTagRule("c","c3")
              rightLabel.map((item: any)=>{
                this.$set(item,'ruleId',ruleId)
                res.data.c3.map((_item: any)=>{
                  if(item.id == _item.label && _item.count>0){
                    this.$set(item,'hasValue',true)
                  }
                })
              })
              this.labelList = rightLabel
              let arr = [] as any
              arr = this.labelList.filter((item: any)=>{
                return item.hasValue
              })
              if(_this.govModNext || flag){
                if(arr.length){
                  this.labelIndex = arr[0].id
                  this.labelName = arr[0].label
                }
              }
              //开启标签轮询
              _this.pollingLabel()
              //获取数据
              this.getData(this.labelIndex,this.labelName,flag)
            }
          }
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
    //获取模块刷新时间
    getModSleep(){
      let _this = this as any
      if(this.type==="pillarIndustry"){
        this.modSleep = getGovModSleep("c","c1")
        if(this.modSleep){
          _this.c1ModTimer = setInterval(() => {
            setTimeout(()=>{
              window.clearInterval(_this.timer)
              _this.timer = null
              _this.loop = 0
              _this.getLabelList(0)
            }, 0)
          }, this.modSleep*1000)
        }
      }
      if(this.type==="starIndustry"){
        this.modSleep = getGovModSleep("c","c2")
        if(this.modSleep){
          _this.c2ModTimer = setInterval(() => {
            setTimeout(()=>{
              window.clearInterval(_this.timer)
              _this.timer = null
              _this.loop = 0
              _this.getLabelList(0)
            }, 0)
          }, this.modSleep*1000)
        }
      }
      if(this.type==="potentialIndustry"){
        this.modSleep = getGovModSleep("c","c3")
        if(this.modSleep){
          _this.c3ModTimer = setInterval(() => {
            setTimeout(()=>{
              window.clearInterval(_this.timer)
              _this.timer = null
              _this.loop = 0
              _this.getLabelList(0)
            }, 0)
          }, this.modSleep*1000)
        }
      }
    },
    getOrder(){
      let _this = this as any
      if(this.type === "pillarIndustry"){
        _this.order = getGovModOrder("c","c1")
      }
      if(this.type === "starIndustry"){
        _this.order = getGovModOrder("c","c2")
      }
      if(this.type === "potentialIndustry"){
        _this.order = getGovModOrder("c","c3")
      }
    }
  }
});
</script>


<style lang="scss" scope>
.industryItem {
  width: 100%;
  height:100%;
  padding: 20px;
  background: url('~img/image_14.png') no-repeat;
  background-size: 100% 100%;
  position: relative;
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
  .labelBox{
    display:flex;
    flex-wrap: wrap;
    margin-top:30px;
    .labelItem{
        // width:141px;
        height: 38px;
        background:rgba(67,246,255,0.08);	      
        font-size: 14px;
        color:#fff;
        text-align: center;
        line-height:38px;
        cursor: pointer;
        margin-bottom:5px;
        padding:0px 30px;
    }
    .hover{
      background:rgba(67,246,255,0.16);
      color:#43F6FF;
    }
    .selected{
      background:rgba(67,246,255,0.24);
      color:#43F6FF;
      position: relative;
      &:after{
          content: '';
          background-image: radial-gradient(rgba(181,242,255,1), rgba(67,246,255,0.24), rgba(67,246,255,0));
          width: 100%;
          height:2px;
          position: absolute;
          bottom:0;
          left:0;
          border-radius: 1px;
      }
    }
    .noData{
      color:rgba(255, 255, 255, 0.5);
      pointer-events: none;
    }
  }
  .rankBox{
      .rankItem{
          height:36px;
          background:rgba(114,255,250,0.06);
          display:flex;
          color:#fff;
          font-size: 12px;
          margin-bottom:5px;
          line-height:36px;
          cursor: pointer;
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
            width:170px;
            margin-left:15px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
      }
      .top1{
        background: url("../../assets/images/01.png")no-repeat, rgba(114,255,250,0.06);
      }
      .top2{
        background: url("../../assets/images/02.png")no-repeat, rgba(114,255,250,0.06);
      }
      .top3{
        background: url("../../assets/images/03.png")no-repeat, rgba(114,255,250,0.06);
      }
      .itemSelected{
        // background:rgba(67,246,255,0.24);
        background:#0c688a;
      }
      .itemSelected1{
        background: url("../../assets/images/01.png")no-repeat, #0c688a;
      }
      .itemSelected2{
        background: url("../../assets/images/02.png")no-repeat, #0c688a;
      }
      .itemSelected3{
        background: url("../../assets/images/03.png")no-repeat, #0c688a;
      }
  }
  .rankLeftBox{
    margin-top:20px;
    height:425px;
    .rankItem{
      width:100%;
      .content{
        width:390px;
      }
      .num{
        width:125px;
        text-align: center;
      }
      .perBox{
        text-align: center;
        width:70px;
        display:flex;
        justify-content: center;
      }
      .up{
        color:#46DB96;
      }
      .down{
        color:#F93B3B;
      }
      .flag{
        margin-left:5px;
      }      
    }
    
  }
  .rankMiddleBox{
    height:425px;
    .rankContent{
      width:100%;
      margin:5px 0 5px 0;
      div{
        float:right;
        font-size: 12px;
        color:#3DD3CF;
        margin-bottom:5px;
        width:80px;
        text-align: center;
      }
    }
    .rankItem{
      width:100%;
      .content{
        width:150px;
      }
      .num{
        width:130px;
        text-align: center;
      }
      .rank{
        width:80px;
        text-align: center;
      }
    }
    
  }
  .rankRightBox{
    margin-top:20px;
    height:425px;
    .rankItem{
      width:100%;
      .content{
        width:390px;
      }
      .perBox{
        text-align: center;
        width:120px;
        display:flex;
        justify-content: center;
      }
      .up{
        color:#46DB96;
      }
      .down{
        color:#F93B3B;
      }
      .flag{
        margin-left:5px;
      }      
    }
    
  }
  .echarts{
    width: 100%;
  }
  .pillarIndustry{
      height: calc(100% - 570px);
  }
  .starIndustry{
      height: calc(100% - 570px);
  }
  .potentialIndustry{
      height: calc(100% - 570px);
  }
  // 加载动画样式
  .loading{
    width:610px;
    height:960px;
    position:absolute;
  }
}
</style>