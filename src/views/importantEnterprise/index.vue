<template>
  <div style="height:97%">
    <div class="importantEnterprise">
      <enterpriseItem
        :title="d1Title"
        class="advantageIndustryItem"
        :type="'pillarEnterprise'"
        :area-code="selectedArea.selectedValue"
        :gov-mod-next="nextD1"
        :gov-mod-next-sleep="sleepD1"
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
        :title="d2Title"
        class="advantageIndustryItem"
        :type="'starEnterprise'"
        :area-code="selectedArea.selectedValue"
        :gov-mod-next="nextD2"
        :gov-mod-next-sleep="sleepD2"
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
        :title="d3Title"
        class="advantageIndustryItem"
        :type="'potentialEnterprise'"
        :area-code="selectedArea.selectedValue"
        :gov-mod-next="nextD3"
        :gov-mod-next-sleep="sleepD3"
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
        :label-id="labelIndex"
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
import getModName from '@/utils/getModName'
import { formData } from '@/utils/index'
import { AppModule } from '@/store/modules/app'
import {
  getGovModNext,
  getGovModNextSleep,
  getGovModSleep
} from '@/utils/getsleep';
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
      labelList:[],
      labelIndex:""
    }
  },
  computed:{
    nextD1(){
      return getGovModNext('d','d1')
    },
    sleepD1(){
      return getGovModNextSleep('d','d1')
    },
    nextD2(){
      return getGovModNext('d','d2')
    },
    sleepD2(){
      return getGovModNextSleep('d','d2')
    },
    nextD3(){
      return getGovModNext('d','d3')
    },
    sleepD3(){
      return getGovModNextSleep('d','d3')
    },
    modSleep(){
      return getGovModNextSleep('d','d3')
    },
    d1Title(){
      return getModName('d','d1')
    },
    d2Title(){
      return getModName('d','d2')
    },
    d3Title(){
      return getModName('d','d3')
    },
  },
  created(){
    this.selectedArea.selectedLabel = this.$store.state.user.govInfoName
    this.selectedArea.selectedValue = this.$store.state.user.govInfoQydm
    this.$nextTick(()=>{
        document.getElementsByTagName('title')[0].innerHTML = this.selectedArea.selectedLabel + '-智慧信用云平台'
    })
    this.getareaMap()
  },
  mounted(){
    this.$nextTick(()=>{
      (document as any).getElementById("pageTitle").innerHTML = "重点企业分析"
    })
  },
  methods:{
    //判断点击的是哪个查看更多
    checkMore(val: any){
      this.type = val.type
      this.showDialog = true
      this.labelList = val.labelList
      this.labelIndex = val.labelId
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
      AppModule.setCurrentTitle((this as any).selectedArea.selectedLabel)
    },
    //获取区域层级
    getareaMap(){
      let adminCode = this.$store.state.user.govInfoQydm
      let topCode = this.$store.state.user.govInfoTop
      getAreaCode(formData({adminCode:adminCode,topCode:topCode})).then(res=>{
        if((res as any).code === "200"){
          this.dataCity = res.data
          let firstIndex,secondIndex,thirdIndex = 0
          if(adminCode.substr(0,2)==="11"||adminCode.substr(0,2)==="12"||adminCode.substr(0,2)==="31"||adminCode.substr(0,2)==="50"){
            this.dataCity.map((item: any)=>{
              if(item.code.substr(0,2) === adminCode.substr(0,2)){
                this.valueCity.push(item.code)
                if(item.childs && item.childs.length){
                  item.childs.map((second: any)=>{
                    if(second.code === adminCode){
                      this.valueCity.push(second.code)
                    }
                  })
                }
              }
            })
            if(adminCode.indexOf("0000")===-1&&adminCode.indexOf("00")===-1){
              this.dataCity.map((item: any)=>{
                if(item.code === this.valueCity[0]){
                  this.selectedArea.parentNode = item.code
                  this.selectedArea.parentName = item.name
                }
              })
            }else{
              this.selectedArea.parentName = this.$store.state.user.govInfoName
              this.selectedArea.parentNode = this.$store.state.user.govInfoQydm
            }
          }else{
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
            if(adminCode.indexOf("0000")===-1&&adminCode.indexOf("00")===-1){
              this.dataCity.map((item: any)=>{
                item.childs.map((second: any)=>{
                  if(second.code === this.valueCity[1]){
                    this.selectedArea.parentNode = second.code
                    this.selectedArea.parentName = second.name
                  }
                })
              })
          }else{
            this.selectedArea.parentName = this.$store.state.user.govInfoName
            this.selectedArea.parentNode = this.$store.state.user.govInfoQydm
          }
        }
          }
          
      })
      // console.log(this.selectedArea)
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
          this.coreEnterprise.fbdq.map((item: any)=>{
            if(!item.unitName){
              item.unitName = val.unitName
            }
          })
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
          this.starEnterprise.fbdq.map((item: any)=>{
            if(!item.unitName){
              item.unitName = val.unitName
            }
          })
        }else{
          this.starEnterprise.fbdq = []
        }
      }
      if(val.type === "potentialEnterprise"){
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
          this.potentialEnterprise.fbdq.map((item: any)=>{
            if(!item.unitName){
              item.unitName = val.unitName
            }
          })
        }else{
          this.potentialEnterprise.fbdq = []
        }
      }
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
.importantEnterprise{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  margin-top:20px;
  .advantageIndustryItem{
      width:610px;
      height:100%;
      min-height:960px;
      overflow: hidden;
      margin-bottom:10px;
  }
  .search_box{
    position: absolute;
    top:40px;
    left:24px;
    color:#fff;
    width:450px;
    height:44px;
    background:url("../../assets/images/selectedArea.png");
    background-size: 100% 100%;    display:flex;
    align-items:center;
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