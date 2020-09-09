<template>
  <div style="height:97%">
    <div class="advantageIndustry">
      <industryItem
        :title="c1Title"
        class="advantageIndustryItem"
        :type="'pillarIndustry'"
        :area-code="selectedArea.code"
        :gov-mod-next="nextC1"
        :gov-mod-next-sleep="sleepC1"
        @getIndustry="getIndustry"
      >
        <doubleEchart
          id="industryDistribution"
          slot="echarts"
          height="100%"
          width="100%"
          :echarts-data="pillarEchartData"
        ></doubleEchart>
      </industryItem>
      <industryItem
        :title="c2Title"
        class="advantageIndustryItem"
        :type="'starIndustry'"
        :top10data="starData"
        :area-code="selectedArea.code"
        :gov-mod-next="nextC2"
        :gov-mod-next-sleep="sleepC2"
        @getIndustry="getIndustry"
      >
        <doubleEchart
          id="startIndustry"
          slot="echarts"
          height="100%"
          width="100%"
          :echarts-data="starEchartData"
        ></doubleEchart>
      </industryItem>
      <industryItem
        :title="c3Title"
        class="advantageIndustryItem"
        :type="'potentialIndustry'"
        :top10data="potentialData"
        :area-code="selectedArea.code"
        :gov-mod-next="nextC3"
        :gov-mod-next-sleep="sleepC3"
        @getIndustry="getIndustry"
      >
        <doubleEchart
          id="registeredCapitalDistribution"
          slot="echarts"
          height="100%"
          width="100%"
          :echarts-data="potentialEchartData"
        ></doubleEchart>
      </industryItem>
      <!-- 地区切换 -->
      <div class="search_box">
        <svg-icon name="icon_dingwei"></svg-icon>
        <el-cascader
          ref="cascader"
          v-model="valueCity"
          class="aa"
          :options="dataCity"
          :props="defaultProps"
          :show-all-levels="false"
          @change="handleChange"
        ></el-cascader>
        <div
          class="rightArrow"
          @click="showList"
        >
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import industryItem from '@/components/industryItem/index.vue'
import doubleEchart from '@/components/Charts/doubleEchart.vue'
import {getAreaCode,getAdvantageLeftData,getAdvantageMiddleData,getAdvantageRightData,showLabel} from "@/api/advantageIndustry"
import { formData } from '@/utils/index'
import getTagRule from '@/utils/getTagRule';
import getModName from '@/utils/getModName'
import {
  getGovModNext,
  getGovModNextSleep,
  getGovModSleep
} from '@/utils/getsleep';
import { AppModule } from '@/store/modules/app'
export default Vue.extend({
  components:{
    industryItem,
    doubleEchart
  },
  data() {
    return {
      pillarData:[],
      starData:[],
      potentialData:[],
      pillarEchartData:[],
      starEchartData:[],
      potentialEchartData:[],
      defaultProps:{
        value:"code",
        label:"name",
        children:"childs",
        checkStrictly:true,
        expandTrigger: 'hover'
      },
      dataCity: [],
      valueCity : [] as any,
      selectedArea:{
        code:"",
        name:"",
        selected:""
      },     
    }
  },
  computed:{
    nextC1(){
      return getGovModNext('c','c1')
    },
    sleepC1(){
      return getGovModNextSleep('c','c1')
    },
    nextC2(){
      return getGovModNext('c','c2')
    },
    sleepC2(){
      return getGovModNextSleep('c','c2')
    },
    nextC3(){
      return getGovModNext('c','c3')
    },
    sleepC3(){
      return getGovModNextSleep('c','c3')
    },
    c1Title(){
      return getModName('c','c1')
    },
    c2Title(){
      return getModName('c','c2')
    },
    c3Title(){
      return getModName('c','c3')
    },
    c1ModSleep(){
      return getGovModSleep("c","c1")
    },
    c2ModSleep(){
      return getGovModSleep("c","c2")
    },
    c3ModSleep(){
      return getGovModSleep("c","c3")
    }
  },
  created(){
    this.selectedArea.name = this.$store.state.user.govInfoName
    this.selectedArea.code = this.$store.state.user.govInfoQydm
    this.selectedArea.selected = this.$store.state.user.govInfoName
    this.$nextTick(()=>{
        document.getElementsByTagName('title')[0].innerHTML = this.selectedArea.name + '-智慧信用云平台'
    })
    //判断显示label
    this.getareaMap()
    // this.advantageTimer = setInterval(() => {
    //   setTimeout(()=>{
    //     this._getLeftData()
    //   }, 0)
    // }, 3000)
  },
  mounted(){
    // console.log(JSON.parse(this.$store.state.user.indexList))
  },
  methods:{
    //点击某个行业后重新获取echart数据
    getIndustry(val: any){
      if(val.type === 'pillarIndustry'){
        this.pillarEchartData = val.data
        this.pillarEchartData.map((item: any)=>{
          this.$set(item,'labelName',val.labelName)
        })
      }else if(val.type === 'starIndustry'){
        this.starEchartData = val.data
        this.starEchartData.map((item: any)=>{
          this.$set(item,'labelName',val.labelName)
        })
      }else if(val.type === 'potentialIndustry'){
        this.potentialEchartData = val.data
        this.potentialEchartData.map((item: any)=>{
          this.$set(item,'labelName',val.labelName)
        })
      }
    },
    //切换区域
    handleChange(){
      let el: any = this.$refs.cascader
      el.dropDownVisible = false;
      this.selectedArea.code = el.getCheckedNodes()[0].value
      this.selectedArea.name = el.getCheckedNodes()[0].label
      AppModule.setCurrentTitle((this as any).selectedArea.name)
    },
    //获取区域层级
    getareaMap(){
      let _this = this as any
      let adminCode = this.selectedArea.code
      let topCode = this.$store.state.user.govInfoTop
      getAreaCode(formData({adminCode:(this as any).selectedArea.code,topCode:topCode})).then(res=>{
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
    //判断是否显示label
    //处理标签方法
    
    //点击显示区域弹窗
    showList(){
      let el: any = this.$refs.cascader
      el.toggleDropDownVisible()
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
<style lang="scss" >
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