<template>
  <div class="advantageIndustry">
    <enterpriseItem
      title="区域核心企业分析"
      class="advantageIndustryItem"
      :type="'pillarEnterprise'"
      :area-code="selectedArea.selectedValue"
      @checkMore="checkMore"
      @getEchartData="getEchartData"
    >
      <verticalPie
        id="firstCapital"
        slot="capital"
        height="100%"
        width="100%"
        :echart-data="coreEnterprise.zczb"
      ></verticalPie>
      <roseType
        id="firstTime"
        slot="time"
        height="100%"
        width="100%"
        :echart-data="coreEnterprise.clsj"
      ></roseType>
      <areaMap
        id="firstArea"
        slot="area"
        height="100%"
        width="50%"
        :echart-data="coreEnterprise.fbdq"
        :area-info="selectedArea"
      ></areaMap>
    </enterpriseItem>
    <enterpriseItem
      title="区域明星企业分析"
      class="advantageIndustryItem"
      :type="'starEnterprise'"
      :area-code="selectedArea.selectedValue"
      @checkMore="checkMore"
      @getEchartData="getEchartData"
    >
      <verticalPie
        id="secondCapital"
        slot="capital"
        height="100%"
        width="100%"
        :echart-data="starEnterprise.zczb"
      ></verticalPie>
      <roseType
        id="secondTime"
        slot="time"
        height="100%"
        width="100%"
        :echart-data="starEnterprise.clsj"
      ></roseType>
      <areaMap
        id="secondArea"
        slot="area"
        height="100%"
        width="50%"
        :echart-data="starEnterprise.fbdq"
        :area-info="selectedArea"
      ></areaMap>
    </enterpriseItem>
    <enterpriseItem
      title="区域潜力企业分析"
      class="advantageIndustryItem"
      :type="'potentialEnterprise'"
      :area-code="selectedArea.selectedValue"
      @checkMore="checkMore"
      @getEchartData="getEchartData"
    >
      <verticalPie
        id="thirdCapital"
        slot="capital"
        height="100%"
        width="100%"
        :echart-data="potentialEnterprise.zczb"
      ></verticalPie>
      <roseType
        id="thirdTime"
        slot="time"
        height="100%"
        width="100%"
        :echart-data="potentialEnterprise.clsj"
      ></roseType>
      <areaMap
        id="thirdArea"
        slot="area"
        height="100%"
        width="50%"
        :echart-data="potentialEnterprise.fbdq"
        :area-info="selectedArea"
      ></areaMap>
    </enterpriseItem>
    <checkMoreDialog
      v-if="showDialog"
      :type="type"
      :label-list="labelList"
      :area-code="selectedArea.selectedValue"
      @closeDialog="closeDialog"
    ></checkMoreDialog>
    <!-- 地区切换 -->
    <div class="search_box">
      <i class="el-icon-location"></i>
      <el-cascader
        ref="cascader"
        v-model="valueCity"
        :options="dataCity"
        :props="defaultProps"
        :show-all-levels="false"
        @change="handleChange"
      ></el-cascader>
      <div class="rightArrow">
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import enterpriseItem from '@/components/enterpriseItem/index.vue'
import verticalPie from '@/components/Charts/verticalPie.vue'
import areaMap from '@/components/Charts/areaMap.vue'
import roseType from '@/components/Charts/roseType.vue'
import checkMoreDialog from "./components/checkMoreDialog.vue"
import {getAreaCode} from "@/api/advantageIndustry"
import {getEnterpriseLeftData,getEnterpriseMiddleData,getEnterpriseRightData} from "@/api/importantEnterprise"

import { formData } from '@/utils/index'

export default Vue.extend({
  components:{
    enterpriseItem,
    verticalPie,
    areaMap,
    roseType,
    checkMoreDialog
  },
  data() {
    return {
      showDialog:false,
      type:"",
      coreEnterprise:{
        zczb:[] as any,
        clsj:[] as any,
        fbdq:[] as any,
        
      },
      starEnterprise:{
        zczb:[] as any,
        clsj:[] as any,
        fbdq:[] as any,
        
      },
      potentialEnterprise:{
        zczb:[] as any,
        clsj:[] as any,
        fbdq:[] as any,
        
      },
      valueCity : [] as any,
      defaultProps:{
        value:"code",
        label:"name",
        children:"childs",
        checkStrictly:true,
        expandTrigger: 'hover'
      },
      dataCity:[],
      selectedArea:{
        parentNode:"",
        parentName:"",
        selectedLabel:"",
        selectedValue:""
      },
      labelList:[]
    }
  },
  created(){
    // this.selectedArea.name = this.$store.state.user.govInfoName
    // this.selectedArea.code = this.$store.state.user.govInfoQydm
    this.selectedArea.selectedLabel = this.$store.state.user.govInfoName
    this.selectedArea.selectedValue = this.$store.state.user.govInfoQydm
    this.getareaMap()
    // console.log(JSON.parse(this.$store.state.user.indexList))
  },
  methods:{
    //判断点击的是哪个查看更多
    checkMore(val: any){
      this.type = val.type
      this.showDialog = true
      this.labelList = val.labelList
    },
    //关闭弹窗
    closeDialog(){
      this.showDialog = false
    },
    handleChange(){
      let el: any = this.$refs.cascader
      el.dropDownVisible = false;
      if(el.getCheckedNodes()[0].level !== 3){
        this.selectedArea.parentNode = el.getCheckedNodes()[0].value
        this.selectedArea.parentName = el.getCheckedNodes()[0].label
        this.selectedArea.selectedLabel = el.getCheckedNodes()[0].label
        this.selectedArea.selectedValue = el.getCheckedNodes()[0].value
      }else{
        this.selectedArea.parentNode = el.getCheckedNodes()[0].parent.value
        this.selectedArea.parentName = el.getCheckedNodes()[0].parent.label
        this.selectedArea.selectedLabel = el.getCheckedNodes()[0].label
        this.selectedArea.selectedValue = el.getCheckedNodes()[0].value
      }
      console.log(this.selectedArea)
    },
    //获取区域层级
    getareaMap(){
      let adminCode = this.$store.state.user.govInfoQydm
      getAreaCode(formData({adminCode:adminCode})).then(res=>{
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
          if(this.valueCity.length === 3){
              this.dataCity.map((item: any)=>{
                item.childs.map((second: any)=>{
                  if(second.code === this.valueCity[1]){
                    this.selectedArea.parentNode = second.code
                    this.selectedArea.parentName = second.name
                  }
                })
              })
          }
        }
      })
      console.log(this.selectedArea)
    },
    //获取echart数据
    getEchartData(val: any){
      if(val.type === "pillarEnterprise"){
        if(val.data.zczb){
          this.coreEnterprise.zczb = val.data.zczb
        }else{
          this.coreEnterprise.zczb = []
        }
        if(val.data.clsj){
          this.coreEnterprise.clsj = val.data.clsj
        }else{
          this.coreEnterprise.clsj = []
        }
        if(val.data.qyfb){
          this.coreEnterprise.fbdq = val.data.qyfb
          // console.log(this.coreEnterprise.fbdq)
        }else{
          this.coreEnterprise.fbdq = []
        }
      }
      if(val.type === "starEnterprise"){
        if(val.data.zczb){
          this.starEnterprise.zczb = val.data.zczb
        }else{
          this.starEnterprise.zczb = []
        }
        if(val.data.clsj){
          this.starEnterprise.clsj = val.data.clsj
        }else{
          this.starEnterprise.clsj = []
        }
        if(val.data.qyfb){
          this.starEnterprise.fbdq = val.data.qyfb
          
        }else{
          this.starEnterprise.fbdq = []
        }
      }
      if(val.type === "starEnterprise"){
        if(val.data.zczb){
          this.potentialEnterprise.zczb = val.data.zczb
        }else{
          this.potentialEnterprise.zczb = []
        }
        if(val.data.clsj){
          this.potentialEnterprise.clsj = val.data.clsj
        }else{
          this.potentialEnterprise.clsj = []
        }
        if(val.data.qyfb){
          this.potentialEnterprise.fbdq = val.data.qyfb
        }else{
          this.potentialEnterprise.fbdq = []
        }
      }
    }
  }
});
</script>


<style lang="scss" scope>
.advantageIndustry{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .advantageIndustryItem{
      width:610px;
      height:960px;
      overflow: hidden;
  }
  .search_box{
    position: absolute;
    top:40px;
    left:24px;
    color:#fff;
    width:450px;
    height:44px;
    box-shadow:0px -1px 9px 0px rgba(0,163,248,0.6);
    display:flex;
    align-items:center;
    .el-icon-location{
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