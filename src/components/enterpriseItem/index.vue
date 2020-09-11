<template>
  <div class="importantEnterpriseItem">
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
      v-if="type==='pillarEnterprise'"
      class="rankLeftBox rankBox"
    >
      <div
        v-for="(item,index) in rankList"
        :key="index"
        class="rankItem"
        :class="{top1: index===0&&order===1,top2: index===1&&order===1,top3: index===2&&order===1}"
      >
        <div
          class="index"
          :class="{top: index+1<=3&&order===1}"
        >
          {{ index+1 }}
        </div>
        <div class="content leftContent">
          {{ item.x315OrgName }}
        </div>
        <div class="num leftNum">
          {{ item.counts }}{{ item.unit }}
        </div>
      </div>
    </div>
    <div
      v-if="type==='starEnterprise'"
      class="rankMiddleBox rankBox"
    >
      <div
        v-if="rankList.length"
        class="rankContent"
      >
        <div class="indexLabel"></div>
        <div class="contentLabel"></div>
        <div class="numLabel"></div>
        <div class="rankLabel">
          <span v-if="flag===2&&!Municipality">市排名</span>
          <span v-else></span>
        </div>
        <div class="rankLabel countryLabel">
          <span v-if="flag!==0">省级排名</span>
          <span v-else></span>
        </div>
        <div class="rankLabel countryLabel">
          全国排名
        </div>
      </div>
      <div
        v-for="(item,index) in rankList"
        :key="index"
        class="rankItem"
        :class="{top1: index===0&&order===1,top2: index===1&&order===1,top3: index===2&&order===1}"
      >
        <div
          class="index"
          :class="{top: index+1<=3&&order===1}"
        >
          {{ index+1 }}
        </div>
        <div class="content middleContent">
          {{ item.x315OrgName }}
        </div>
        <div class="num middleNum">
          {{ item.counts }}{{ item.unit }}
        </div>
        <div class="cityRank rank">
          {{ item.spm | spm(that) }}
        </div>
        <div class="provinceRank rank">
          {{ item.sfpm | rank }}
        </div>
        <div class="countryRank rank">
          {{ item.qgpm | rank }}
        </div>
      </div>
    </div>
    <div
      v-if="type==='potentialEnterprise'"
      class="rankRightBox rankBox"
    >
      <div
        v-if="rankList.length"
        class="rankContent"
      >
        <span>增长率</span>
      </div>
      <div
        v-for="(item,index) in rankList"
        :key="index"
        class="rankItem"
        :class="{top1: index===0&&order===1,top2: index===1&&order===1,top3: index===2&&order===1}"
      >
        <div
          class="index"
          :class="{top: index+1<=3&&order===1}"
        >
          {{ index+1 }}
        </div>
        <div class="content rightContent">
          {{ item.x315OrgName }}
        </div>
        <div class="num rightNum">
          {{ $formatNum(item.counts) }}{{ item.unit }}
        </div>
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
    <!-- 查看更多 -->
    <div class="checkMore">
      <span
        v-if="rankList.length===10"
        @click="checkMore"
      > 查看更多></span>
    </div>
    <div
      v-if="rankList.length"
      class="echarts"
      :class="{pillarEnterprise: type==='pillarEnterprise',starEnterprise: type==='starEnterprise',potentialEnterprise: type==='potentialEnterprise'}"
    >
      <!-- echart标签栏 -->
      <div class="echartLabelBox">
        <div 
          v-for="(item,index) in echartLabelList" 
          :key="index"
          class="echartLabelItem"
          :class="{echartLabelSelected: echartLabelIndex===index}"
          @click="changeEchartLabel(index)"
        >
          {{ item.label }}
        </div> 
      </div>
      <!-- echart列表 -->
      <slot 
        v-if="echartLabelIndex===0" 
        name="capital"
      ></slot>
      <slot 
        v-if="echartLabelIndex===1" 
        name="time"
      ></slot>
      <slot 
        v-if="echartLabelIndex===2&&flag!==2" 
        name="area"
      ></slot>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import {getEnterpriseLeftData,getEnterpriseMiddleData,getEnterpriseRightData,getLeftLabelList,getMiddleLabelList,getrightLabelList, getRightDialogPage} from "@/api/importantEnterprise"
import { formData } from '@/utils/index'
import mixins from '@/components/polling/index.vue'
import getTagRule from '@/utils/getTagRule';
import {getGovModSleep,getGovModOrder} from '@/utils/getsleep';
export default Vue.extend({
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
    // 省排名 全国排名
    rank:function(val: any){
      if(val*1){
        if(val*1>999){
          return "999+"
        }else{
          return val
        }
      }else{
        return ""
      }
    },
    //市排名
    spm:function(val: any,that: any){
      if(that.flag === 2 && that.Municipality){
        return ""
      }else{
        if(val){
          if(val*1>999){
            return "999+"
          }else{
            return val
          }
        }else{
          return ""
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
      type:String,
      default:""
    },
    areaCode:{
      type:String,
      default:""
    },
  },
  data() {
    return {
      modSleep:0,
      that:this,
      hoverIndex:-1,
      active:0,
      labelList:[] as any,
      labelIndex:0,
      rankList:[] as any,
      echartLabelList:[
        {
          label:"注册资本分布"
        },
        {
          label:"成立时间分布"
        },
        {
          label:"区域分布"
        },
      ],
      echartLabelIndex:0,
      flag:0,//0:省，1市，2区
      Municipality:false,//直辖市
      d1ModTimer:null,
      d2ModTimer:null,
      d3ModTimer:null,
      order:1
    }
  },
  watch:{
    areaCode(){
      let _this = this as any
      window.clearInterval(_this.timer)
      _this.timer = null
      _this.loop = 0
      this.getLabelList(1)
      this.judgeArea()
    }
  },
  created(){
      //获取模块刷新时间
      this.getModSleep()
      //判断当前绑定的地区层级
      this.judgeArea()
      this.getLabelList(1)
  },
  beforeDestroy(){
    let _this = this as any
    if(_this.d1ModTimer){
      window.clearInterval(_this.d1ModTimer)
      this.d1ModTimer = null
    }
    if(_this.d2ModTimer){
      window.clearInterval(_this.d2ModTimer)
      this.d2ModTimer = null
    }
    if(_this.d3ModTimer){
      window.clearInterval(_this.d3ModTimer)
      this.d3ModTimer = null
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
      let _this = this as any
      if((ruleId===1&&hasValue)||(ruleId===0&&hasValue)){
        this.getData(val,name)
      }
      if(ruleId===2){
        this.getData(val,name)
      }
    },
    //切换echart标签
    changeEchartLabel(val: number){
      (this as any).echartLabelIndex = val
    },
    //点击查看更多
    checkMore(){
      let val = {
        type:this.type,
        labelList:this.labelList,
        labelId:this.labelIndex
      }
      this.$emit("checkMore",val)
    },
    //获取标签
    getLabelList(flag: any){
      let leftLabel = [] as any
      let rightLabel = [] as any
      let middleLabel = [] as any
      JSON.parse(this.$store.state.user.indexList).map((item: any)=>{
        if(item.govIndexId === "d"){
          if(this.type === 'pillarEnterprise'){
            item.modules.map((_item: any)=>{
              if(_item.govModId === 'd1'){
                if(_item.govModLabels){
                  leftLabel = this.operateLabel(_item.govModLabels)
                }
              }
            })
          }
          if(this.type === 'starEnterprise'){
            item.modules.map((_item: any)=>{
              if(_item.govModId === 'd2'){
                if(_item.govModLabels){
                  middleLabel = this.operateLabel(_item.govModLabels)
                }
              }
            })
          }
          if(this.type === 'potentialEnterprise'){
            item.modules.map((_item: any)=>{
              if(_item.govModId === 'd3'){
                if(_item.govModLabels){
                  rightLabel = this.operateLabel(_item.govModLabels)
                }
              }
            })
          }
        }
      })
      let _this = this as any
      if(this.type === 'pillarEnterprise'){
          let urlA1 = _this.$getModUrl('d','d1')
          getLeftLabelList(formData({qydm:this.areaCode}),urlA1).then((res: any)=>{
            if(res.code === "200"){
              let ruleId = getTagRule("d","d1")
              leftLabel.map((item: any)=>{
                this.$set(item,'ruleId',ruleId)
                res.data.map((_item: any)=>{
                  if(item.id == _item.label && _item.count>0){
                    this.$set(item,'hasValue',true)
                  }
                })
              })
              this.labelList = leftLabel
              let arr = this.labelList.filter((item: any)=>{
                return item.hasValue
              })
              
              if(_this.govModNext || flag){
                if(arr.length){
                  this.labelIndex = arr[0].id
                }
              }
              //开启标签轮询
              _this.pollingLabel()
              //获取数据
              this.getData(this.labelIndex)
            }
          })
      }
      if(this.type === 'starEnterprise'){
        let urlA1 = _this.$getModUrl('d','d2')
        getMiddleLabelList(formData({qydm:this.areaCode}),urlA1).then((res: any)=>{
            if(res.code === "200"){
              let ruleId = getTagRule("d","d2")
              middleLabel.map((item: any)=>{
                this.$set(item,'ruleId',ruleId)
                res.data.map((_item: any)=>{
                  if(item.id == _item.label && _item.count>0){
                    this.$set(item,'hasValue',true)
                  }
                })
              })
              this.labelList = middleLabel
              let arr = this.labelList.filter((item: any)=>{
                return item.hasValue
              })
              if(_this.govModNext || flag){
                if(arr.length){
                  this.labelIndex = arr[0].id
                }
              }
              //开启标签轮询
              _this.pollingLabel()
              //获取数据
              this.getData(this.labelIndex)
            }
          })
      }
      if(this.type === 'potentialEnterprise'){
        let urlA1 = _this.$getModUrl('d','d3')
        getrightLabelList(formData({qydm:this.areaCode}),urlA1).then((res: any)=>{
            if(res.code === "200"){
              let ruleId = getTagRule("d","d3")
              rightLabel.map((item: any)=>{
                this.$set(item,'ruleId',ruleId)
                res.data.map((_item: any)=>{
                  if(item.id == _item.label && _item.count>0){
                    this.$set(item,'hasValue',true)
                  }
                })
              })
              this.labelList = rightLabel
              let arr = this.labelList.filter((item: any)=>{
                return item.hasValue
              })
              if(_this.govModNext || flag){
                if(arr.length){
                  this.labelIndex = arr[0].id
                }
              }
              //开启标签轮询
              _this.pollingLabel()
              //获取数据
              this.getData(this.labelIndex)
            }
          })
      }
      
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
        this.echartLabelList = [
          {
            label:"注册资本分布"
          },
          {
            label:"成立时间分布"
          },
        ]
        if(this.echartLabelIndex === 2){
          this.echartLabelIndex = 0
        }
      }else{
        this.echartLabelList = [
          {
            label:"注册资本分布"
          },
          {
            label:"成立时间分布"
          },
          {
            label:"区域分布"
          },
        ]
      }
    },
    //获取数据
    getData(value: any,name?: any){
      let _this = this as any
      if(this.type === 'pillarEnterprise'){
        let urlA1 = _this.$getModUrl('d','d1')
        getEnterpriseLeftData(formData({qydm:this.areaCode,label:value})).then((res: any)=>{
          if(res.code === "200"){
            this.rankList = JSON.parse(res.data).zdqyfxTopDtos
            if(this.rankList.length&&this.rankList[0].isOrder&&this.rankList[0].isOrder === 1){
                this.order = 1
              }else{
                //判断模块是否需要排序
                this.getOrder()
            }
            let unitName = ''
            if(this.rankList.length){
              unitName = this.rankList[0].unit
            }
            let val = {
              type:this.type,
              data:JSON.parse(res.data),
              unitName:unitName
            }
            this.$emit("getEchartData",val)
            _this.labelIndex = value
          }
        })
      }
      if(this.type === 'starEnterprise'){
        let urlA1 = _this.$getModUrl('d','d2')
        getEnterpriseMiddleData(formData({qydm:this.areaCode,label:value})).then((res: any)=>{
          if(res.code === "200"){
            this.rankList = JSON.parse(res.data).zdqyfxTopDtos
            if(this.rankList.length&&this.rankList[0].isOrder&&this.rankList[0].isOrder === 1){
                this.order = 1
              }else{
                //判断模块是否需要排序
                this.getOrder()
            }
            let unitName = ''
            if(this.rankList.length){
              unitName = this.rankList[0].unit
            }
            let val = {
              type:this.type,
              data:JSON.parse(res.data),
              unitName:unitName
            }
            this.$emit("getEchartData",val)
            _this.labelIndex = value
          }
        })
      }
      if(this.type === 'potentialEnterprise'){
        let urlA1 = _this.$getModUrl('d','d3')
        getEnterpriseRightData(formData({qydm:this.areaCode,label:value})).then((res: any)=>{
          if(res.code === "200"){
            this.rankList = JSON.parse(res.data).zdqyfxTopDtos
            if(this.rankList.length&&this.rankList[0].isOrder&&this.rankList[0].isOrder === 1){
                this.order = 1
              }else{
                //判断模块是否需要排序
                this.getOrder()
            }
            let unitName = ''
            if(this.rankList.length){
              unitName = this.rankList[0].unit
            }
            let val = {
              type:this.type,
              data:JSON.parse(res.data),
              unitName:unitName
            }
            this.$emit("getEchartData",val)
            _this.labelIndex = value
          }
        })
      }
    },
    //获取模块刷新时间
    getModSleep(){
      let _this = this as any
      if(this.type==="pillarEnterprise"){
        this.modSleep = getGovModSleep("d","d1")
        if(this.modSleep){
          _this.d1ModTimer = setInterval(() => {
            setTimeout(()=>{
              window.clearInterval(_this.timer)
              _this.timer = null
              _this.loop = 0
              _this.getLabelList(0)
            }, 0)
          }, this.modSleep*1000)
        }
      }
      if(this.type==="starEnterprise"){
        this.modSleep = getGovModSleep("d","d2")
        if(this.modSleep){
          _this.d2ModTimer = setInterval(() => {
            setTimeout(()=>{
              window.clearInterval(_this.timer)
              _this.timer = null
              _this.loop = 0
              _this.getLabelList(0)
            }, 0)
          }, this.modSleep*1000)
        }
      }
      if(this.type==="potentialEnterprise"){
        this.modSleep = getGovModSleep("d","d3")
        if(this.modSleep){
          _this.d3ModTimer = setInterval(() => {
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
      if(this.type === "pillarEnterprise"){
        _this.order = getGovModOrder("d","d1")
      }
      if(this.type === "starEnterprise"){
        _this.order = getGovModOrder("d","d2")
      }
      if(this.type === "potentialEnterprise"){
        _this.order = getGovModOrder("d","d3")
      }
    }
  }
});
</script>


<style lang="scss" scope>
.importantEnterpriseItem {
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
  .labelBox{
    display:flex;
    flex-wrap: wrap;
    margin-top:30px;
    .labelItem{
        padding: 0px 30px;
        height: 38px;
        background:rgba(67,246,255,0.08);	      
        font-size: 14px;
        color:#fff;
        text-align: center;
        line-height:38px;
        cursor: pointer;
        margin-bottom:5px;
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
            width:300px;
            margin-left:15px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .num{
            width:50px;
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
  }
  .rankLeftBox{
    margin-top:25px;
    height:45%;
    .rankItem{
      height:8%;
      display: flex;
      align-items: center;
      .per{
        width:25px;
      }
      .num{
        width:100px;
      }
      .leftContent{
        width:420px;
      }     
    }
    
  }
  .rankMiddleBox{
    // margin-top:25px;
    height:45%;
    .rankContent{
      width:100%;
      margin:10px 0 5px 0;
      height:16px;
      display:flex;
      .indexLabel{
        width:35px;
        margin-left:15px;
      }
      .contentLabel{
        width:170px;
      }
      .numLabel{
        width:145px;
        margin-left:10px;
      }
      .rankLabel{
        font-size: 12px;
        color:#3DD3CF;
        // margin-bottom:5px;
        width:60px;
        text-align: center;
      }
      .countryLabel{
        width:75px;
      }
    }
    .rankItem{
      width:100%;
      height:8%;
      display: flex;
      align-items: center;
      .num{
        width:145px;
        margin-left:10px;
        text-align: center;
      }
      .rank{
        width:60px;
        text-align: center;
      }
      .cityRank{
        // margin-left:2px;
      }
      .provinceRank{
        // margin-left:5px;
        width:75px;
      }
      .countryRank{
        width:75px;
      }
      .content{
        width:155px;
      }
    }
    
  }
  .rankRightBox{
    height:45%;
    .rankContent{
      width:100%;
      height:16px;
      margin:5px 0 5px 0;
      span{
        float:right;
        font-size: 12px;
        color:#3DD3CF;
        margin-bottom:5px;
        display:block;
        width:100px;
        text-align: center;
        height:16px;
      }
    }
    .rankItem{
      height:8%;
      display: flex;
      align-items: center;
    }
    .perBox{
      width:100px!important;
      text-align: center;
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
    .rightContent{
      width:280px!important;
    }
    .num{
      width:140px!important;
      text-align: center;
    }
  }
  .checkMore{
    width:100%;
    font-size: 14px;
    color:#3DD3CF;
    text-align: right;
    margin-top:10px;
    span{
      cursor: pointer;
    }
  }
  .echartLabelBox{
    width:100%;
    display:flex;
    margin-left:10px;
    .echartLabelItem{
      font-size: 14px;
      color:#fff;
      margin-right:40px;
      cursor: pointer;
      padding-bottom:2px;
      &:hover{
        color: #43f6ff;
      }
    }
    .echartLabelSelected{
      color: #43f6ff;
      border-bottom:1px solid #43f6ff;
    }
  }
  .echarts{
    width: 100%;
    margin-top:20px;
    // height: calc(100% - 36px);
  }
  .pillarEnterprise{
      height: calc(100% - 64%);
  }
  .starEnterprise{
      height: calc(100% - 64%);
  }
  .potentialEnterprise{
      height: calc(100% - 64%);
  }
}
</style>