<template>
  <div class="advantageIndustry">
    <industryItem
      title="区域支柱行业"
      class="advantageIndustryItem"
      :type="'pillarIndustry'"
      :label-list="leftLabelList"
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
      title="区域明星行业"
      class="advantageIndustryItem"
      :type="'starIndustry'"
      :top10data="starData"
      :label-list="MiddleLabelList"
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
      title="区域潜力行业"
      class="advantageIndustryItem"
      :type="'potentialIndustry'"
      :top10data="potentialData"
      :label-list="rightLabelList"
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
import industryItem from '@/components/industryItem/index.vue'
import doubleEchart from '@/components/Charts/doubleEchart.vue'
import {getAreaCode,getAdvantageLeftData,getAdvantageMiddleData,getAdvantageRightData,showLabel} from "@/api/advantageIndustry"
import { formData } from '@/utils/index'
import {
  getGovModNext,
  getGovModNextSleep,
  getGovModSleep
} from '@/utils/getsleep';
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
      advantageTimer:"" as any,
      leftLabelList:[] as any,
      MiddleLabelList:[] as any,
      rightLabelList:[] as any,
    }
  },
  computed:{
    nextC1(){
      return getGovModNext('c','c1')
    },
    sleepC1(){
      return getGovModNext('c','c1')
    },
    nextC2(){
      return getGovModNext('c','c2')
    },
    sleepC2(){
      return getGovModNext('c','c2')
    },
    nextC3(){
      return getGovModNext('c','c3')
    },
    sleepC3(){
      return getGovModNext('c','c3')
    },
  },
  created(){
    this.selectedArea.name = this.$store.state.user.govInfoName
    this.selectedArea.code = this.$store.state.user.govInfoQydm
    this.selectedArea.selected = this.$store.state.user.govInfoName
    
    //判断显示label
    this._showLabel()
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
  beforeDestroy(){
    if(this.advantageTimer){
      clearInterval(this.advantageTimer)
    }
  },
  methods:{
    //点击某个行业后重新获取echart数据
    getIndustry(val: any){
      if(val.type === 'pillarIndustry'){
        this.pillarEchartData = val.data
      }else if(val.type === 'starIndustry'){
        this.starEchartData = val.data
      }else if(val.type === 'potentialIndustry'){
        this.potentialEchartData = val.data
      }
    },
    //切换区域
    handleChange(){
      let el: any = this.$refs.cascader
      el.dropDownVisible = false;
      this.selectedArea.code = el.getCheckedNodes()[0].value
      this.selectedArea.name = el.getCheckedNodes()[0].label
      this._showLabel()
    },
    //获取区域层级
    getareaMap(){
      let _this = this as any
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
    //判断是否显示label
    _showLabel(){
      let leftArr = [] as any
      let midddleArr = [] as any
      let rightArr = [] as any
      JSON.parse(this.$store.state.user.indexList).map((item: any)=>{
        if(item.govIndexId === "c"){
          item.modules.map((_item: any)=>{
            if(_item.govModId === 'c1'){
              leftArr = this.operateLabel(_item.govModLabels)
            }else if(_item.govModId === 'c2'){
              midddleArr = this.operateLabel(_item.govModLabels)
            }else if(_item.govModId === 'c3'){
              rightArr = this.operateLabel(_item.govModLabels)
            }
          })
        }
      })
      let adminCode = this.selectedArea.code
      showLabel(formData({qydm:adminCode})).then((res: any)=>{
        if(res.code === "200"){
            if(res.data.c1 && res.data.c1.length){
              leftArr.map((item: any)=>{
                res.data.c1.map((_item: any)=>{
                  if(item.id == _item.label && _item.count>0){
                    this.$set(item,'hasValue',true)
                  }
                })
              })
              this.leftLabelList = leftArr.filter((item: any)=>{
                return item.hasValue
              })
            }
            if(res.data.c2 && res.data.c2.length){
              midddleArr.map((item: any)=>{
                res.data.c2.map((_item: any)=>{
                  if(item.id == _item.label && _item.count>0){
                    this.$set(item,'hasValue',true)
                  }
                })
              })
              this.MiddleLabelList = midddleArr.filter((item: any)=>{
                return item.hasValue
              })
            }
            if(res.data.c1 && res.data.c1.length){
              rightArr.map((item: any)=>{
                res.data.c3.map((_item: any)=>{
                  if(item.id == _item.label && _item.count>0){
                    this.$set(item,'hasValue',true)
                  }
                })
              })
              this.rightLabelList = rightArr.filter((item: any)=>{
                return item.hasValue
              })
            }
        }
      })

    },
    //获取左侧数据
    // _getLeftData(): void{
    //   getAdvantageLeftData(formData({qydm:"111",label:"222"})).then(res=>{
         
    //   })
    // },
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