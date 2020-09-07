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
        :class="{top1: index===0,top2: index===1,top3: index===2,itemSelected: item.hydmCode===itemIndex&&index>2,itemSelected1: item.hydmCode===itemIndex&&index===0,itemSelected2: item.hydmCode===itemIndex&&index===1,itemSelected3: item.hydmCode===itemIndex&&index===2}"
        @click="selectedItem(item.hydmCode)"
      >
        <div
          class="index"
          :class="{top: index+1<=3}"
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
          省排名
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
        :class="{top1: index===0,top2: index===1,top3: index===2,itemSelected: item.hydmCode===itemIndex&&index>2,itemSelected1: item.hydmCode===itemIndex&&index===0,itemSelected2: item.hydmCode===itemIndex&&index===1,itemSelected3: item.hydmCode===itemIndex&&index===2}"
        @click="selectedItem(item.hydmCode)"
      >
        <div
          class="index"
          :class="{top: index+1<=3}"
        >
          {{ index+1 }}
        </div>
        <div class="content">
          {{ item.hydmName }}
        </div>
        <div class="num">
          {{ item.counts }}{{ item.unit }}
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
        :class="{top1: index===0,top2: index===1,top3: index===2,itemSelected: item.hydmCode===itemIndex&&index>2,itemSelected1: item.hydmCode===itemIndex&&index===0,itemSelected2: item.hydmCode===itemIndex&&index===1,itemSelected3: item.hydmCode===itemIndex&&index===2}"
        @click="selectedItem(item.hydmCode)"
      >
        <div
          class="index"
          :class="{top: index+1<=3}"
        >
          {{ index+1 }}
        </div>
        <div class="content">
          {{ item.hydmName }}
        </div>
        <!-- <div class="num">{{item.num}}万家</div> -->
        <div class="perBox">
          <div
            class="per"
            :class="[item.rata>0?'up':'down']"
          >
            {{ item.rata | rata }}%
          </div>
          <div
            v-if="item.rata>0"
            class="flag up"
          >
            ↑
          </div>
          <div
            v-else
            class="flag down"
          >
            ↓
          </div>
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
export default Vue.extend({
  // components:{
  //   lottie
  // },
  filters:{
    rata:function(val: any){
      if(val){
        return Math.abs(parseInt(val*100 + ''))
      }else{
        return "-"
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
    labelList:{
      type:Array,
      default:()=>{
        return [] as any
      }
    }
  },
  data() {
    return {
      that:this,
      hoverIndex:-1,
      active:0,
      labelIndex:0,
      labelName:"",
      top10Data:[] as any,
      itemIndex:0,
      loading:true,
      flag:0,//0:省，1市，2区,
      Municipality:false,//直辖市
    }
  },
  watch: {
    areaCode(){
      let _this = this as any
      window.clearInterval(_this.timer)
      _this.timer = null
      _this.loop = 0
      this.judgeArea()
      this.getData(this.labelIndex,this.labelName)
    },
    labelList(){
      let arr = this.labelList.filter((item: any)=>{
        return item.hasValue
      })
      if(arr.length){
        this.labelIndex = arr[0].id
        this.labelName =arr[0].label
        this.getData(arr[0].id,arr[0].label)
      }
    }
  },
  created(){
    let _this = this as any
    // console.log(JSON.parse(_this.$store.state.user.indexList))
    //判断当前绑定的地区层级
    this.judgeArea()
    //获取数据
    // this.getData(this.labelIndex)
    setTimeout(()=>{
      //启动标签轮询
      _this.pollingLabel()
    },2000)
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
        this.getData(val,name)
      }
      if(ruleId===2){
        this.getData(val,name)
      }
    },
    //选中某个列表
    selectedItem(val: number){
      this.itemIndex = val
      let params = {
        type:this.type,
        data:[],
        labelName:this.labelName
      }
      this.top10Data.map((item: any)=>{
        if(this.itemIndex === item.hydmCode){
          params.data = item.charts
        }
      })
      this.$emit("getIndustry",params)
    },
    //获取数据
    getData(val: any,name: any){
      this.loading = true
      let _this = this as any
      //区域支柱行业
      if(this.type === "pillarIndustry"){
          let urlA1 = _this.$getModUrl('c','c1')
          getAdvantageLeftData(formData({qydm:this.areaCode,label:val}),urlA1).then((res: any)=>{
            this.loading = false
            if(res.code === "200" && JSON.parse(res.data).length){
              this.top10Data = JSON.parse(res.data)
              this.itemIndex = this.top10Data[0].hydmCode
              let params = {
                type:this.type,
                data:this.top10Data[0].charts,
                labelName:name
              }
              this.$emit("getIndustry",params)
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
              this.itemIndex = this.top10Data[0].hydmCode
              let params = {
                type:this.type,
                data:this.top10Data[0].charts,
                labelName:name
              }
              this.$emit("getIndustry",params)
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
              this.itemIndex = this.top10Data[0].hydmCode
              // console.log(this.top10Data)
              let params = {
                type:this.type,
                data:this.top10Data[0].charts,
                labelName:name
              }
              this.$emit("getIndustry",params)
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
          background:rgba(114,255,250,0.08);
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
        background: url("../../assets/images/01.png")no-repeat, rgba(114,255,250,0.08);
      }
      .top2{
        background: url("../../assets/images/02.png")no-repeat, rgba(114,255,250,0.08);
      }
      .top3{
        background: url("../../assets/images/03.png")no-repeat, rgba(114,255,250,0.08);
      }
      .itemSelected{
        background:rgba(67,246,255,0.24);
      }
      .itemSelected1{
        background: url("../../assets/images/01.png")no-repeat, rgba(67,246,255,0.24);
      }
      .itemSelected2{
        background: url("../../assets/images/02.png")no-repeat, rgba(67,246,255,0.24);
      }
      .itemSelected3{
        background: url("../../assets/images/03.png")no-repeat, rgba(67,246,255,0.24);
      }
  }
  .rankLeftBox{
    margin-top:20px;
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
        width:90px;
        text-align: center;
      }
    }
    .rankItem{
      width:100%;
      .content{
        width:150px;
      }
      .num{
        width:100px;
        text-align: center;
      }
      .rank{
        width:90px;
        text-align: center;
      }
    }
    
  }
  .rankRightBox{
    margin-top:20px;
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