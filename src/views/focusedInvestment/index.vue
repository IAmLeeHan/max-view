<template>
  <div class="focusedInvestment">
    <leftItem
      title="区域外来资本概况"
      class="leftItem"
      :gov-mod-next="nextE2"
      :gov-mod-next-sleep="sleepE2"
      :area-code="selectedArea.code"
    >
    </leftItem>
    <div class="middleBox">
      <!-- 区域外来资本流动图 -->
      <echartItem
        title="区域外来资本流动图"
        class="capitalFlowBox"
        :area-name="selectedArea.name"
      >
        <flowChart
          id="capitalFlow"
          slot="echarts"
          height="100%"
          width="100%"
          :echarts-data="flowEchartData"
        ></flowChart>
      </echartItem>
      <!-- 对外投资活跃企业 -->
      <middleBottom
        class="activeEnterprise"
        title="对外投资活跃企业"
        :sub-title="subTitle"
        :type="'middleBottom'"
        :area-code="selectedArea.code"
        :gov-mod-next="nextE3"
        :gov-mod-next-sleep="sleepE3"
        @checkMore="checkMore"
      ></middleBottom>
    </div>
    <rightItem
      class="rightItem"
      :type="'rightItem'"
      :area-code="selectedArea.code"
      @checkMore="checkMore"
    ></rightItem>
    <checkMoreDialog
      v-if="showDialog"
      :type="type"
      :label-list="labelInfo.labelList"
      :area-code="selectedArea.code"
      @closeDialog="closeDialog"
    ></checkMoreDialog>
    <!-- 地区切换 -->
    <div class="search_box">
      <svg-icon name="icon_dingwei"></svg-icon>
      <el-cascader
        ref="cascader"
        v-model="valueCity"
        :options="dataCity"
        :props="defaultProps"
        :show-all-levels="false"
        @change="handleChange"
      ></el-cascader>
      <div class="rightArrow">
        <i
          class="el-icon-arrow-right"
          @click="showList"
        ></i>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import leftItem from './components/leftItem.vue'
import rightItem from './components/rightItem.vue'
import checkMoreDialog from "./components/checkMoreDialog.vue"
import echartItem from "./components/echartItem.vue"
import flowChart from "@/components/Charts/capitalFlow.vue";
import middleBottom from "./components/middleBottom.vue"
import {getAreaCode} from "@/api/advantageIndustry"
import {getE1} from "@/api/focusedInvestment"
import {
  getGovModNext,
  getGovModNextSleep,
  getGovModSleep
} from '@/utils/getsleep';

import { formData } from '@/utils/index'
export default Vue.extend({
  components:{
    leftItem,
    checkMoreDialog,
    echartItem,
    flowChart,
    middleBottom,
    rightItem
  },
  data() {
    return {
      showDialog:false,
      type:"",
      subTitle:['新基建','跨国公司','上市公司','央企及下属'],
      valueCity:[] as any,
      defaultProps:{
        value:"code",
        label:"name",
        children:"childs",
        checkStrictly:true,
        expandTrigger: 'hover'
      },
      dataCity: [],
      selectedArea:{
        code:"",
        name:"",
        selected:""
      },
      flowEchartData:[],
      labelInfo:""
    }
  },
  computed:{
    nextE2(){
      return getGovModNext('e','e2')
    },
    sleepE2(){
      return getGovModNext('e','e2')
    },
    nextE3(){
      return getGovModNext('e','e3')
    },
    sleepE3(){
      return getGovModNext('e','e3')
    },
  },
  created(){
    this.selectedArea.name = this.$store.state.user.govInfoName
    this.selectedArea.code = this.$store.state.user.govInfoQydm
    this.selectedArea.selected = this.$store.state.user.govInfoName
    this.getareaMap()
    //获取区域外来资本流动图
    this.getEchartData()
  },
  methods:{
    //判断点击的是哪个查看更多
    checkMore(val: any){
      this.labelInfo = val
      this.type = val.type
      this.showDialog = true
    },
    //关闭弹窗
    closeDialog(){
      this.showDialog = false
    },
    handleChange(){
      let el: any = this.$refs.cascader
      el.dropDownVisible = false;
      this.selectedArea.code = el.getCheckedNodes()[0].value
      this.selectedArea.name = el.getCheckedNodes()[0].label
      this.getEchartData()
    },
    //获取区域层级
    getareaMap(){
      let adminCode = this.selectedArea.code
      getAreaCode(formData({adminCode:(this as any).selectedArea.code})).then(res=>{
        if((res as any).code === "200"){
          this.dataCity = res.data
          let firstIndex,secondIndex,thirdIndex = 0
          this.dataCity.map((item: any)=>{
            if(item.code.substr(0,2) === adminCode.substr(0,2)){
              this.valueCity.push(item.code)
              if(item.childs && item.childs.length){
                item.childs.map((second: any)=>{
                  if(second.code.substr(0,4) === adminCode.substr(0,4)){
                    this.valueCity.push(second.code)
                    if(second.childs && second.childs.length){
                      second.childs.map((third: any)=>{
                        if(third.code === adminCode){
                          this.valueCity.push(adminCode)
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        }
      })
    },
    //获取区域外来资本流动图
    getEchartData(){
      let _this = this as any
      let urlA1 = _this.$getModUrl('e','e1')
      getE1(formData({qydm:(this as any).selectedArea.code}),urlA1).then((res: any)=>{
        if(res.code === "200"){
          this.flowEchartData = JSON.parse(res.data)
        }
      })
    },
    //点击显示区域弹窗
    showList(){
      let el: any = this.$refs.cascader
      el.toggleDropDownVisible()
    }
  }
});
</script>


<style lang="scss" scope>

.focusedInvestment{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  // position: relative;
  margin-top:30px;
  .leftItem{
      width:450px;
      height:940px;
  }
  .middleBox{
    display:flex;
    flex-direction: column;
    // justify-content: space-between;
    height:940px;
    width:930px;
  }
  .capitalFlowBox{
    width:930px;
    height:500px;
  }
  .activeEnterprise{
    width:930px;
    height:420px;
    margin-top:20px;
  }
  .rightItem{
    width:450px;
    height:940px;
  }
  .search_box{
    position: absolute;
    top:40px;
    left:24px;
    color:#fff;
    width:450px;
    height:44px;
    display:flex;
    align-items:center;
    background:url("../../assets/images/selectedArea.png");
    background-size: 100% 100%;
    .svg-icon{
      font-size: 12px;
      color:#40cbd3;
      margin-left:15px;
    }
    .el-cascader{
      .el-input{
        border:none;
        width:377px;
        .el-input__inner{
          background:rgba(0,163,248,0);
          border:none;
          color:#fff;
          width:377px;
        }
        .el-input__suffix{
          display:none;
        }
      }
    }
    
    .rightArrow{
      width: 46px;
      height: 44px;
      background-color:rgba(91,239,253,0.24);
      cursor: pointer;
      display:flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
<style lang="scss">
  .el-popper{
    left:25px!important;
    border:none!important;
    background:#1680a8;
    .el-cascader-menu{
      border-right:1px solid #4c95b1;
      &:last-child{
        border-right:none;
      }
    }
    .el-cascader-node{
      color:#fff;
    }
    .el-cascader-node:hover{
      color:#43f6ff;
      background:rgba(255,255,255,0.06)
    }
    .el-cascader-node.in-active-path, .el-cascader-node.is-selectable.in-checked-path, .el-cascader-node.is-active{
      color:#43f6ff;
    }
  }
  .popper__arrow{
    border-bottom-color: #1680a8!important;
    &::after{
      border-bottom-color:#1680a8!important;
    }
  }
</style>