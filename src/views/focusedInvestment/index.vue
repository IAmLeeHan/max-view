<template>
  <div style="height:97%">
    <div
      class="focusedInvestment"
      :class="{blur: showDialog||this.$store.state.app.dialogTableVisible}"
    >
      <leftItem
        :title="e2Title"
        class="leftItem"
        :gov-mod-next="nextE2"
        :gov-mod-next-sleep="sleepE2"
        :area-code="selectedArea.code"
      >
      </leftItem>
      <div class="middleBox">
        <!-- 区域外来资本流动图 -->
        <echartItem
          :title="e1Title"
          class="capitalFlowBox"
          :area-name="selectedArea.name"
          @getModSleep="getEchartData"
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
          :title="e3Title"
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
        :top-title="e4Title"
        :bottom-title="e5Title"
        :area-code="selectedArea.code"
        @checkMore="checkMore"
      ></rightItem>
      
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
        <div
          class="rightArrow"
          @click="showList"
        >
          <i
            class="el-icon-arrow-right"
          ></i>
        </div>
      </div>
    </div>
    <checkMoreDialog
      v-if="showDialog"
      :type="type"
      :label-list="labelInfo.labelList"
      :label-id="labelInfo.labelId"
      :area-code="selectedArea.code"
      @closeDialog="closeDialog"
    ></checkMoreDialog>
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
import getModName from '@/utils/getModName'
import { AppModule } from '@/store/modules/app'
import { EAreaModule } from '@/store/modules/eArea';

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
      return getGovModNextSleep('e','e2')
    },
    nextE3(){
      return getGovModNext('e','e3')
    },
    sleepE3(){
      return getGovModNextSleep('e','e3')
    },
    e1Title(){
      return getModName('e','e1')
    },
    e2Title(){
      return getModName('e','e2')
    },
    e3Title(){
      return getModName('e','e3')
    },
    e4Title(){
      return getModName('e','e4')
    },
    e5Title(){
      return getModName('e','e5')
    },
  },
  created(){
    this.selectedArea.name = this.$store.state.EArea.currentName
    this.selectedArea.code = this.$store.state.EArea.currentQydm
    this.selectedArea.selected = this.$store.state.EArea.currentQydm
    this.$nextTick(()=>{
        document.getElementsByTagName('title')[0].innerHTML = this.selectedArea.name + '-智慧信用云平台'
    })
    this.getareaMap()
    //获取区域外来资本流动图
    this.getEchartData()
  },
  // mounted(){
  //   this.$nextTick(()=>{
  //     (document as any).getElementById("pageTitle").innerHTML = "重点引资企业"
  //   })
  // },
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
      AppModule.setCurrentTitle((this as any).selectedArea.name)
      EAreaModule.setQydm(this.selectedArea.code)
      EAreaModule.setCurrentName(this.selectedArea.name)
    },
    //获取区域层级
    getareaMap(){
      let selectedCode = this.selectedArea.code
      let adminCode = this.$store.state.user.govInfoQydm
      let topCode = this.$store.state.user.govInfoTop
      getAreaCode(formData({adminCode:adminCode,topCode:topCode})).then(res=>{
        if((res as any).code === "200"){
          this.dataCity = res.data
          let firstIndex,secondIndex,thirdIndex = 0
          if(selectedCode.substr(0,2)==="11"||selectedCode.substr(0,2)==="12"||selectedCode.substr(0,2)==="31"||selectedCode.substr(0,2)==="50"){
            this.dataCity.map((item: any)=>{
              if(item.code.substr(0,2) === selectedCode.substr(0,2)){
                this.valueCity.push(item.code)
                if(item.childs && item.childs.length){
                  item.childs.map((second: any)=>{
                    if(second.code === selectedCode){
                      this.valueCity.push(second.code)
                    }
                  })
                }
              }
            })
          }else{
            this.dataCity.map((item: any)=>{
              if(item.code.substr(0,2) === selectedCode.substr(0,2)){
                this.valueCity.push(item.code)
                if(item.childs && item.childs.length){
                  item.childs.map((second: any)=>{
                    if(second.code.substr(0,4) === selectedCode.substr(0,4)){
                      this.valueCity.push(second.code)
                      if(second.childs && second.childs.length){
                        second.childs.map((third: any)=>{
                          if(third.code === selectedCode){
                            this.valueCity.push(selectedCode)
                          }
                        })
                      }
                    }
                  })
                }
              }
            })
          }
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
.blur{
  filter: blur(5px);
}
.focusedInvestment{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  // position: relative;
  margin-top:20px;
  .leftItem{
      width:450px;
      height:100%;
      min-height:960px;
      margin-bottom:10px;
  }
  .middleBox{
    display:flex;
    flex-direction: column;
    // justify-content: space-between;
    height:100%;
    width:930px;
  }
  .capitalFlowBox{
    width:930px;
    height:54%;
    min-height:520px;
  }
  .activeEnterprise{
    width:930px;
    height:46%;
    margin-top:20px;
    min-height:420px;
  }
  .rightItem{
    width:450px;
    height:100%;
    min-height:960px;
    margin-bottom:10px;
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
  .el-cascader__dropdown{
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
<style lang="scss">
  .is-light{
    background:rgba(33,95,136,0.95)!important;
    color:#fff;
    border:none!important;
    .popper__arrow{
      &::after{
        border-top-color:rgba(33,95,136,0.95)!important
      }
    }
  }
</style>