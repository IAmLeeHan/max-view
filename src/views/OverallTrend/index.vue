<template>
  <div 
    class="enterpriseAreaOverview" 
    v-loading="!mainItem"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="left">
      <moduleItem
        title="企业总量变化"
        class="industryDistribution"
        :sub-title="DateList"
        :gov-mod-next="nextB1"
        :gov-mod-next-sleep="sleepB1"
        @changeCH="changeB1Active"
      >
        <doubleEchartLee
          v-if="ZLshow"
          id="industryDistribution"
          slot="echarts"
          height="100%"
          width="100%"
          :unit="ZLunit"
          :echarts-data="ZLEchartsData"
        ></doubleEchartLee>
      </moduleItem>
      <moduleItem
        title="产业企业总量分析"
        class="operatingStatusDistribution"
        :sub-title="DateList"
        :gov-mod-next="nextB2"
        :gov-mod-next-sleep="sleepB2"
        @changeCH="changeB2Active"
      >
        <stackedChart
          v-if="ZLFXshow"
          id="operatingStatusDistribution"
          slot="echarts"
          height="100%"
          width="100%"
          :unit="ZLFXunit"
          :echarts-data="ZLFXEchartsData"
        ></stackedChart>
      </moduleItem>
      <moduleItem
        title="新增企业趋势"
        class="registeredCapitalDistribution"
        :sub-title="newEnterprise"
        :gov-mod-next="nextB3"
        :gov-mod-next-sleep="sleepB3"
        @changeCH="changeB3Active"
      >
        <verticalBar
          v-if="XZshow"
          id="registeredCapitalDistribution"
          slot="echarts"
          height="100%"
          width="100%"
          echarts-name="统计最新6个月数据"
          :show-percentage="false"
          :echarts-data="XZEchartsData"
          :unit="XZunit"
        ></verticalBar>
      </moduleItem>
    </div>
    <div class="middle">
      <mainItem
        class="enterpriseDistribution"
        :org-list="OrgList"
        title="企业分布"
        show-bg
      ></mainItem>
      <!-- <div class="regionalNews">
        <h6>区域快讯：</h6>
        <p>市南区9企业获得全国信用企业荣誉称号</p>
        <div class="more">
          <span>更多</span>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>-->
      <moduleItem
        ref="son"
        class="distributionOfKeyEnterprises"
        :sub-title="KeyEnterprises"
        :gov-mod-next="nextB4"
        :gov-mod-next-sleep="sleepB4"
        title="新增重点企业数量趋势"
        @changeCH="changeB4Active"
      >
        <div
          slot="echarts"
          style="height:100%"
        >
          <div class="NewKeyEnterprisesBox">
            <div class="echartsBox">
              <verticalBar
                v-if="XZZDechartsShow"
                id="NewKeyEnterprises"
                width="100%"
                height="100%"
                :echarts-data="XZZDRecharts"
                :unit="XZZDunit"
              ></verticalBar>
            </div>
            <div class="tableBox">
              <table>
                <tr
                  v-for="(t,i) in XZZDList"
                  :key="i"
                >
                  <td>
                    <img
                      v-if="i < 3"
                      :src="require('img/px_'+ (i+1) +'.png')"
                    >
                    <div
                      v-else
                      class="index"
                    >
                      <span>{{ i+1 }}</span>
                    </div>
                    <span class="name">{{ t.govX315OrgName }}</span>
                    <!-- <span class="money">{{ t.govB6Money }}</span>
                      <span class="percentage">{{ t.govB6Rate }}</span> -->
                  </td>
                </tr>
                <div class="getMore">
                  <p @click="showMore(currentId)">
                    <span>查看更多</span>
                    <i class="el-icon-arrow-right"></i>
                  </p>
                </div>
              </table>
            </div>
          </div>
        </div>
      </moduleItem>
    </div>
    <div class="right">
      <moduleItem
        title="注吊销企业趋势"
        class="businessNatureType"
        :sub-title="revocationOfEnterprise"
        :gov-mod-next="nextB5"
        :gov-mod-next-sleep="sleepB5"
        @changeCH="changeB5Active"
      >
        <ul
          v-if="showZDXDate"
          slot="Date"
          class="Date"
        >
          <li
            v-for="(t,i) in DateList"
            :key="i"
            :class="{active: ZDXActive === i}"
            @click="changeZDXDate(t.value,i)"
          >
            {{ t.name }}
          </li>
        </ul>
        <verticalBar
          v-if="ZDXBarShow"
          id="businessNatureType"
          slot="echarts"
          height="100%"
          width="100%"
          :unit="ZDXunit"
          :echarts-data="ZDXEchartsData"
          :show-unit="ZDXShowUnit"
          :wrap="ZDXWrap"
        ></verticalBar>
        <RosePieChart
          v-if="ZDXRoseShow"
          id="businessNatureType"
          slot="echarts"
          height="100%"
          width="100%"
          :echarts-data="ZDXEchartsData"
        ></RosePieChart>
        <ringChart
          v-if="ZDXRingShow"
          id="businessNatureType"
          slot="echarts"
          height="100%"
          width="100%"
          :echarts-data="ZDXEchartsData"
        ></ringChart>
        <!-- <el-button class="directory" slot="button">企业迁出名录 ></el-button> -->
      </moduleItem>
      <moduleItem
        title="区域资本来源分析"
        class="enterpriseSize"
        :sub-title="QYZBList"
        :gov-mod-next="nextB6"
        :gov-mod-next-sleep="sleepB6"
        @changeCH="changeQYZBView"
      >
        <div
          v-if="showMap"
          slot="echarts"
          style="height:100%;width:100%;"
        >
          <div class="enterpriseSizeBox">
            <div class="flowchartsBox">
              <flowChart
                v-if="QYZBShow"
                id="enterpriseSize"
                :echarts-data="QYZBEchartsData"
                height="100%"
                width="100%"
              ></flowChart>
            </div>
            <div class="sort">
              <h6>资本来源</h6>
              <div 
                v-for="(t,i) in QYZBSort"
                :key="i"
                class="item"
                :style="{color: itemStyle(i)}"
              >
                <i>●</i>
                <span>{{ t.value }}</span>
              </div>
              <h5
                class="moreButton"
                @click="$router.push({name: 'focusedInvestment'})"
              >
                <span>查看更多 ></span>
              </h5>
            </div>
          </div>
        </div>
        <div 
          v-else
          slot="echarts"
          width="100%"
          height="100%"
        >
          <div class="LDQYtable">
            <ul
              v-if="showZDXDate"
              class="Date"
            >
              <li
                v-for="(t,i) in LDQYList"
                :key="i"
                :class="{active: QYLDActive === i}"
                @click="changeQYLDType(t.value,i)"
              >
                {{ t.name }}
              </li>
            </ul>
            <div class="TableBox">
              <table>
                <tr
                  v-for="(t,i) in LDQYTableData1"
                  :key="i"
                >
                  <td>
                    <img
                      v-if="i < 3"
                      :src="require('img/px_'+ (i+1) +'.png')"
                    >
                    <div
                      v-else
                      class="index"
                    >
                      <span>{{ i+1 }}</span>
                    </div>
                    <span class="name">{{ t.govB6QydmName }}</span>
                    <span class="money">{{ t.govB6Money }}</span>
                    <span class="percentage">{{ t.govB6Rate }}</span>
                  </td>
                </tr>
              </table>
              <table>
                <tr
                  v-for="(t,i) in LDQYTableData2"
                  :key="i"
                >
                  <td>
                    <img
                      v-if="LDQYTableData1.length + i < 3"
                      :src="require('img/px_'+ (i+2) +'.png')"
                    >
                    <div
                      v-else
                      class="index"
                    >
                      <span>{{ i+LDQYTableData1.length+1 }}</span>
                    </div>
                    <span class="name">{{ t.govB6QydmName }}</span>
                    <span class="money">{{ t.govB6Money }}</span>
                    <span class="percentage">{{ t.govB6Rate }}</span>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </moduleItem>
      <moduleItem
        title="区域从业人员规模分析"
        class="established"
      >
        <verticalBar
          v-if="QYCYshow"
          id="theScaleOfRegionalEmployees"
          slot="echarts"
          height="100%"
          width="100%"
          :show-percentage="false"
          :unit="QYCYunit"
          :rotate="0"
          :echarts-data="QYCYEchartsData"
        ></verticalBar>
      </moduleItem>
    </div>
    <listPopups>
      <div
        slot="ListPopups-header"
        class="myHeader"
      >
        <div class="title">
          <h1>新增重点企业数量趋势</h1>
        </div>  
        <ul
          v-if="KeyEnterprises.length>0"
          :class="{margin: KeyEnterprises.length<=3}"  
        >
          <li 
            v-for="(item,index) in KeyEnterprises" 
            :key="index"
            :class="[{active: popActive === index},{disabled: item.disabled}]"
            @click="changePopActive(index,item.value)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      <ul
        slot="ListPopups-content"
        class="myContent"
      >
        <li 
          v-for="(t,i) in XZZDList"
          :key="i"
          class="item"
        >
          <img
            v-if="i + 1 <= 3"
            :src="require('img/px_'+ (i + 1) +'.png')"
          >
          <div
            v-else
            class="index"
          >
            <span>{{ i + 1 }}</span>
          </div>
          <span class="name">{{ t.govX315OrgName }}</span>
        </li>
      </ul>
      <div
        slot="other"
        class="pageBox"
      >
        <el-pagination
          :current-page="currentPage"
          :page-size="10"
          background
          layout="total, prev, pager, next"
          :total="popCount"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </listPopups>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import mainItem from "@/components/mainItem/index.vue";
import moduleItem from "@/components/moduleItem/index.vue";
import doubleEchartLee from "@/components/Charts/doubleEchartLee.vue";
import stackedChart from "@/components/Charts/stackedChart.vue";
import verticalBar from "@/components/Charts/verticalBar.vue";
import flowChart from "@/components/Charts/flowChart.vue";
import RosePieChart from "@/components/Charts/RosePieChart.vue";
import ringChart from "@/components/Charts/ringChart.vue";
import listPopups from '@/components/listPopups/index.vue';
import { EAreaModule } from '@/store/modules/eArea';
import { AppModule } from "@/store/modules/app"
import {getE1} from "@/api/focusedInvestment";
import {
  getGovModNext,
  getGovModNextSleep,
  getGovModSleep
} from '@/utils/getsleep';
import {
  totalEnterprise,
  IndustrialEnterprises,
  newBusinessTrends,
  revocationOfBusinessTrends,
  RegionalCapitalSources,
  scaleOfRegionalEmployees,
  trendsNewKeyEnterprises,
  trendsNewKeyEnterprisesT,
  getB4Tags
} from '@/api/trend';
import getTagRule from '@/utils/getTagRule';
import getModUrl from '@/utils/getModUrl';
import { formData } from '@/utils';
export default Vue.extend({
  components: {
    mainItem,
    moduleItem,
    doubleEchartLee,
    stackedChart,
    verticalBar,
    flowChart,
    RosePieChart,
    ringChart,
    listPopups
  },
  data() {
    return {
      // 企业总量
      ZLunit:'',
      ZLshow:false,
      ZLData:[],
      ZLEchartsData:[],
      ZLFXshow:false,
      ZLFXunit:'',
      ZLFX:[],
      ZLFXEchartsData:[],
      XZshow:false,
      XZData:[],
      XZEchartsData:[],
      XZunit:'',
      DateList:[
        {
          name:'月',
          value:1
        },
        {
          name:'季度',
          value:2
        },
        {
          name:'年',
          value:3
        }
      ],
      newEnterprise: [
        {
          name:'企业数量',
          value:1
        },
        {
          name:"行业分析",
          value:2
        }],
      ZDXBarShow: false,
      ZDXRoseShow: false,
      ZDXRingShow: false,
      ZDXunit:'',
      ZDXData:[],
      ZDXEchartsData: [],
      ZDXShowUnit:true,
      ZDXActive:0,
      ZDXWrap:false,
      showZDXDate:false,
      revocationOfEnterprise: [
        {
          name:"企业数量",
          value:1
        },
        { 
          name:"行业分布",
          value:2
        }, 
        {
          name:"类型分布",
          value:3
        }
      ],
      QYZBList:[
        {
          name:'资本流动地图',
          value:1
        },
        {
          name:'流动区域列表',
          value:2
        }
      ],
      QYZBShow:false,
      QYZBEchartsData:[],
      QYZBSort:[],
      showMap:true,
      LDQYList:[
        {
          name:'最多省份',
          value:1
        },
        {
          name:'最多城市',
          value:2
        }
      ],
      LDQYAllData:[],
      LDQYTableData1:[],
      LDQYTableData2:[],
      QYLDActive:0,
      OrgList: [
        {
          name: "机构总数",
          value: 11590
        },
        {
          name: "企业",
          value: 2300
        },
        {
          name: "个体工商户",
          value: 9240
        },
        {
          name: "其他",
          value: 50
        }
      ],
      QYCYshow:false,
      QYCYEchartsData:[],
      QYCYunit:'',
      timerB1:null,
      timerB2:null,
      timerB3:null,
      timerB4:null,
      timerB5:null,
      timerB6:null,
      timerB7:null,
      KeyEnterprises:[],
      XZZDList:[],
      XZZDRecharts:[],
      XZZDunit:'家',
      currentPage:1,
      popActive:0,
      currentId:0,
      popCount:0,
      XZZDListShow:false,
      XZZDechartsShow:false
    };
  },
  computed:{
    nextB1(){
      return getGovModNext('b','b1')
    },
    sleepB1(){
      return getGovModNext('b','b1')
    },
    nextB2(){
      return getGovModNext('b','b2')
    },
    sleepB2(){
      return getGovModNext('b','b2')
    },
    nextB3(){
      return getGovModNext('b','b3')
    },
    sleepB3(){
      return getGovModNext('b','b3')
    },
    nextB4(){
      return getGovModNext('b','b4')
    },
    sleepB4(){
      return getGovModNext('b','b4')
    },
    nextB5(){
      return getGovModNext('b','b5')
    },
    sleepB5(){
      return getGovModNext('b','b5')
    },
    nextB6(){
      return getGovModNext('b','b6')
    },
    sleepB6(){
      return getGovModNext('b','b6')
    },
    currentQydm(){
      return EAreaModule.currentQydm
    },
    mainItem(){
      let _this = this as any
      return EAreaModule.loading &&_this.XZZDListShow && _this.ZLshow && _this.ZLFXshow && _this.XZshow && _this.XZZDechartsShow && _this.showZDXDate && _this.ZDXBarShow && _this.showMap && _this.QYCYshow
    }
  },
  watch:{
    currentQydm:{
      immediate:true,
      handler(newVal,oldVal){
        let _this = this as any
        let urlB1 = _this.$getModUrl('b','b1')
        totalEnterprise(newVal,urlB1).then((res: any)=>{
          _this.ZLshow = true
          if(res.code === '200'){
            _this.ZLData = res.data
            _this.ZLEchartsData = res.data.month.data
            if(res.data.month.unit){
              _this.ZLunit = res.data.month.unit
            }
          }
        })
        let urlB2 = _this.$getModUrl('b','b2')
        IndustrialEnterprises(newVal,urlB2).then((res: any)=>{
          _this.ZLFXshow = true
          if(res.code === '200'){
            _this.ZLFXData = res.data
            _this.ZLFXEchartsData = res.data.month.data
            if(res.data.month.unit){
              _this.ZLFXunit = res.data.month.unit
            }
          }
        })
        let urlB3 = _this.$getModUrl('b','b3')
        newBusinessTrends(newVal,urlB3).then((res: any)=>{
          _this.XZshow = true
          if(res.code === '200'){
            _this.XZData = res.data
            _this.XZEchartsData = res.data.orgCount.data
            if(res.data.orgCount.unit){
              _this.XZunit = res.data.orgCount.unit
            }
          }
        })

        getB4Tags(newVal).then(res=>{
          let rule = getTagRule('b','b4')
          let data = _this.$getTags('b','b4')
          data.map((item:any)=>{
            if(!res.data.includes((item.value) * 1)){
              if(rule === 1){
                item.disabled = true
              }else{
                data = data.filter((item:any)=>{
                  return res.data.includes((item.value) * 1)
                })
              }
            }
          })
          _this.KeyEnterprises = data || []
          let hasDataTag = _this.KeyEnterprises.filter((item:any)=>{
            return !item.disabled
          })
          let urlB4 = _this.$getModUrl('b','b4')
          let id = (hasDataTag[0].value) * 1
          _this.currentId = id
          _this.getXZZDList(id,newVal,urlB4)
        })

        let urlB5 = _this.$getModUrl('b','b5')
        revocationOfBusinessTrends(newVal,urlB5).then((res: any)=>{
          _this.ZDXBarShow = true
         _this.showZDXDate = true
         _this.ZDXWrap = false
          _this.ZDXShowUnit = true
          if(res.code === '200'){
            _this.ZDXData = res.data
            _this.ZDXEchartsData = res.data.orgCount.month.data
            if(res.data.orgCount.month.unit){
              _this.ZDXunit = res.data.orgCount.month.unit
            }
          }
        })
        let urlE1 = _this.$getModUrl('e','e1')
        getE1(formData({qydm:newVal}),urlE1).then((res: any)=>{
          _this.QYZBShow = true
          if(res.code === '200'){
            let data = JSON.parse(res.data)
            let sort = data.sort((a: any,b: any)=>{
              return b.govE1Money - a.govE1Money
            })
            _this.QYZBEchartsData = sort.splice(0,3)
          }
        })
        let urlB6 = _this.$getModUrl('b','b6')
        RegionalCapitalSources(newVal,urlB6).then((res: any)=>{
          _this.QYZBSort = res.data.capital.outflow
          let data = res.data.flowArea.province
          let index = data.length / 2
          _this.LDQYTableData1 = data.slice(0,index)
          _this.LDQYTableData2 = data.slice(index,data.length)
          _this.LDQYAllData = res.data.flowArea
        })
        let urlB7 = _this.$getModUrl('b','b7')
        scaleOfRegionalEmployees(newVal,urlB7).then((res: any)=>{
          _this.QYCYshow = true
          if(res.code === '200'){
            _this.QYCYEchartsData = res.data.data
            if(res.data.unit){
              _this.QYCYunit = res.data.unit
            }
          }
        })
      }
    },
    currentId:{
      immediate:false,
      handler(newVal,oldVal){
        let _this = this as any
        _this.currentPage = 1
        _this.getPopListData(newVal,_this.currentQydm,_this.currentPage)
      }
    }
  },
  mounted(){
    let _this = this as any
    let newVal = _this.currentQydm
    _this.$nextTick(()=>{
      let time1 = getGovModSleep('b','b1') * 1000
      if(time1>0){
        _this.timerB1 = window.setInterval(()=>{
          let urlB1 = _this.$getModUrl('b','b1')
        totalEnterprise(newVal,urlB1).then((res: any)=>{
          _this.ZLshow = true
          if(res.code === '200'){
            _this.ZLData = res.data
            _this.ZLEchartsData = res.data.month.data
            if(res.data.month.unit){
              _this.ZLunit = res.data.month.unit
            }
          }
        })
        },time1)
      }
      let time2 = getGovModSleep('b','b2') * 1000
      if(time2>0){
        _this.timerB2 = window.setInterval(()=>{
          let urlB2 = _this.$getModUrl('b','b2')
        IndustrialEnterprises(newVal,urlB2).then((res: any)=>{
          _this.ZLFXshow = true
          if(res.code === '200'){
            _this.ZLFXData = res.data
            _this.ZLFXEchartsData = res.data.month.data
            if(res.data.month.unit){
              _this.ZLFXunit = res.data.month.unit
            }
          }
        })
        },time2)
      }
      let time3 = getGovModSleep('b','b3') * 1000
      if(time3>0){
        _this.timerB3 = window.setInterval(()=>{
          let urlB3 = _this.$getModUrl('b','b3')
        newBusinessTrends(newVal,urlB3).then((res: any)=>{
          _this.XZshow = true
          if(res.code === '200'){
            _this.XZData = res.data
            _this.XZEchartsData = res.data.orgCount.data
            if(res.data.orgCount.unit){
              _this.XZunit = res.data.orgCount.unit
            }
          }
        })
        },time3)
      }
      // let time4 = getGovModSleep('b','b4') * 1000
      // if(time4>0){

      // }
      // _this.timerB4 = window.setInterval(()=>{

      // },time4)
      let time5 = getGovModSleep('b','b5') * 1000
      if(time5>0){
        _this.timerB5 = window.setInterval(()=>{
          let urlB5 = _this.$getModUrl('b','b5')
        revocationOfBusinessTrends(newVal,urlB5).then((res: any)=>{
          _this.ZDXBarShow = true
         _this.showZDXDate = true
         _this.ZDXWrap = false
          _this.ZDXShowUnit = true
          if(res.code === '200'){
            _this.ZDXData = res.data
            _this.ZDXEchartsData = res.data.orgCount.month.data
            if(res.data.orgCount.month.unit){
              _this.ZDXunit = res.data.orgCount.month.unit
            }
          }
        })
        },time5)
      }
      let time6 = getGovModSleep('b','b6') * 1000
      if(time6>0){
        _this.timerB6 = window.setInterval(()=>{
          let urlE1 = _this.$getModUrl('e','e1')
        getE1(formData({qydm:newVal}),urlE1).then((res: any)=>{
          _this.QYZBShow = true
          if(res.code === '200'){
            let data = JSON.parse(res.data)
            let sort = data.sort((a: any,b: any)=>{
              return b.govE1Money - a.govE1Money
            })
            _this.QYZBEchartsData = sort.splice(0,3)
          }
        })
        let urlB6 = _this.$getModUrl('b','b6')
        RegionalCapitalSources(newVal,urlB6).then((res: any)=>{
          _this.QYZBSort = res.data.capital.outflow
          let data = res.data.flowArea.province
          let index = data.length / 2
          _this.LDQYTableData1 = data.slice(0,index)
          _this.LDQYTableData2 = data.slice(index,data.length)
          _this.LDQYAllData = res.data.flowArea
        })
        },time6)
      }
      let time7 = getGovModSleep('b','b7') * 1000
      if(time7>0){
        _this.timerB7 = window.setInterval(()=>{
          let urlB7 = _this.$getModUrl('b','b7')
        scaleOfRegionalEmployees(newVal,urlB7).then((res: any)=>{
          _this.QYCYshow = true
          if(res.code === '200'){
            _this.QYCYEchartsData = res.data.data
            if(res.data.unit){
              _this.QYCYunit = res.data.unit
            }
          }
        })
        },time7)
      }
    })
  },
  beforeDestroy(){
    let _this = this as any
    window.clearInterval(_this.timerB1)
    _this.timerB1 = null 
    window.clearInterval(_this.timerB2)
    _this.timerB2 = null 
    window.clearInterval(_this.timerB3)
    _this.timerB3 = null 
    window.clearInterval(_this.timerB4)
    _this.timerB4 = null 
    // _this.timerB5
    window.clearInterval(_this.timerB6)
    _this.timerB6 = null 
    window.clearInterval(_this.timerB7)
    _this.timerB7 = null 
  },
  methods:{
    itemStyle(i: any){
      switch (i) {
        case 0:
          return '#CB7CFE'
          break;
        case 1:
          return '#DEF428'
          break;
        case 2:
          return '#10D6C0'
          break;
        default:
          break;
      }
    },
    changeB1Active(val: any){
      let _this = this as any
      _this.CHshow = false
      switch (val * 1) {
        case 1:
          _this.ZLEchartsData = _this.ZLData.month.data
          if(_this.ZLData.month.unit){
            _this.ZLunit = _this.ZLData.month.unit
          }
          _this.CHshow = true
          break;
        case 2:
          _this.ZLEchartsData = _this.ZLData.season.data
          if(_this.ZLData.season.unit){
            _this.ZLunit = _this.ZLData.season.unit
          }
          _this.CHshow = true
          break;
        case 3:
          _this.ZLEchartsData = _this.ZLData.year.data
          if(_this.ZLData.year.unit){
            _this.ZLunit = _this.ZLData.year.unit
          }
          _this.CHshow = true
          break;
        default:
          break;
      }
    },
    changeB2Active(val: any){
      let _this = this as any
      _this.CHshow = false
      switch (val * 1) {
        case 1:
          _this.ZLFXEchartsData = _this.ZLFXData.month.data
          if(_this.ZLFXData.month.unit){
            _this.ZLFXunit = _this.ZLFXData.month.unit
          }
          _this.CHshow = true
          break;
        case 2:
          _this.ZLFXEchartsData = _this.ZLFXData.season.data
          if(_this.ZLFXData.season.unit){
            _this.ZLFXunit = _this.ZLFXData.season.unit
          }
          _this.CHshow = true
          break;
        case 3:
          _this.ZLFXEchartsData = _this.ZLFXData.year.data
          if(_this.ZLFXData.year.unit){
            _this.ZLFXunit = _this.ZLFXData.year.unit
          }
          _this.CHshow = true
          break;
        default:
          break;
      }
    },
    changeB3Active(val: any){
      let _this = this as any
      _this.CHshow = false
      switch (val * 1) {
        case 1:
          _this.XZEchartsData = _this.XZData.orgCount.data
          if(_this.XZData.orgCount.unit){
            _this.XZunit = _this.XZData.orgCount.unit
          }
          _this.CHshow = true
          break;
        case 2:
          _this.XZEchartsData = _this.XZData.industry.data
          if(_this.XZData.industry.unit){
            _this.XZunit = _this.XZData.industry.unit
          }
          _this.CHshow = true
          break;
        default:
          break;
      }
    },
    changeB4Active(val:any){
      let _this = this as any;
      _this.currentId = val;
      let urlB4 = _this.$getModUrl('b','b5')
      _this.getXZZDList(val*1,_this.currentQydm,urlB4)
    },
    changeB5Active(val: any){
      let _this = this as any
      _this.ZDXBarShow = false
      _this.ZDXRoseShow = false
      _this.ZDXRingShow = false
      switch (val * 1) {
        case 1:
          _this.ZDXEchartsData = _this.ZDXData.orgCount.month.data
          if(_this.ZDXData.orgCount.month.unit){
            _this.ZDXunit = _this.ZDXData.orgCount.month.unit
          }
         _this.showZDXDate = true
         _this.ZDXWrap = false
          _this.ZDXShowUnit = true
        _this.ZDXBarShow = true
          break;
        case 2:
          _this.ZDXEchartsData = _this.ZDXData.industry.data
          if(_this.ZDXData.industry.unit){
            _this.ZDXunit = _this.ZDXData.industry.unit
          }
          _this.showZDXDate = false
          _this.ZDXWrap = false
          _this.ZDXShowUnit = true
          _this.ZDXRoseShow = true
          break;
        case 3:
          _this.ZDXEchartsData = _this.ZDXData.orgNature
          if(_this.ZDXData.orgNature.unit){
            _this.ZDXunit = _this.ZDXData.orgNature.unit
          }else{
            _this.ZDXunit = ''
          }
          _this.showZDXDate = false
          _this.ZDXWrap = false
          _this.ZDXShowUnit = false
          _this.ZDXRingShow = true
          break;
        default:
          break;
      }
    },
    changeZDXDate(val: any,i: number){
      let _this = this as any
      _this.ZDXActive = i
      _this.showZDXDate = true
      switch (val * 1) {
        case 1:
          _this.ZDXEchartsData = _this.ZDXData.orgCount.month.data
          if(_this.ZDXData.orgCount.month.unit){
            _this.ZDXunit = _this.ZDXData.orgCount.month.unit
          }
         _this.ZDXWrap = false
          _this.ZDXShowUnit = true
          _this.ZDXshow = true
          break;
        case 2:
          _this.ZDXEchartsData = _this.ZDXData.orgCount.season.data
          if(_this.ZDXData.orgCount.season.unit){
            _this.ZDXunit = _this.ZDXData.orgCount.season.unit
          }
         _this.ZDXWrap = true
          _this.ZDXShowUnit = true
          _this.ZDXshow = true
          break;
        case 3:
          _this.ZDXEchartsData = _this.ZDXData.orgCount.year.data
          if(_this.ZDXData.orgCount.year.unit){
            _this.ZDXunit = _this.ZDXData.orgCount.year.unit
          }
         _this.ZDXWrap = false
          _this.ZDXShowUnit = true
          _this.ZDXshow = true
          break;
        default:
          break;
      }
    },
    changeQYZBView(val: any){
      let _this = this as any
      switch (val * 1) {
        case 1:
          _this.showMap = true
          break;
        case 2:
          _this.showMap = false
          break;
        default:
          break;
      }
    },
    changeQYLDType(val: any,i: number){
      let _this = this as any
      _this.QYLDActive = i
      console.log(val,"val");
      
      switch (val * 1) {
        case 1:
          let data = _this.LDQYAllData.province
          let index = data.length / 2
          _this.LDQYTableData1 = data.slice(0,index)
          _this.LDQYTableData2 = data.slice(index,data.length)
          break;
        case 2:
          let data2 = _this.LDQYAllData.city
          let index2 = data2.length / 2
          _this.LDQYTableData1 = data2.slice(0,index2)
          _this.LDQYTableData2 = data2.slice(index2,data2.length)
          break;
        default:
          break;
      }
    },
    getXZZDList(id:string|number,newVal:string,url?:string){
      let _this = this as any;
      // b4a 趋势图
      let b4aData = {
        "govLabel": id,
        "qydm": newVal
      }
      trendsNewKeyEnterprises(b4aData).then((res:any)=>{
        _this.XZZDechartsShow = true
        if(res.code === '200'){
          _this.XZZDRecharts = res.data
        }
      })
      // b4 列表
      let b4Data = {
          "data": {
            "govLabel": id,
            "qydm": newVal
          },
          "pageNum": 1,
          "pageSize": 6
      }
      trendsNewKeyEnterprisesT(b4Data).then((res:any)=>{
        _this.XZZDListShow = true
        if(res.code === '200'){
          _this.XZZDList = res.data
        }
      })
    },
    getPopListData(id: string|number,newVal: string,page: number,url?: string){
      let _this = this as any
      // b4a 趋势图
      let b4aData = {
        "govLabel": id,
        "qydm": newVal
      }
      trendsNewKeyEnterprises(b4aData).then((res:any)=>{
        if(res.code === '200'){
          _this.XZZDRecharts = res.data
        }
      })
      // b4 列表
      let b4Data = {
          "data": {
            "govLabel": id,
            "qydm": newVal
          },
          "pageNum": page,
          "pageSize": 10
      }
      trendsNewKeyEnterprisesT(b4Data).then((res:any)=>{
        if(res.code === '200'){
          _this.XZZDList = res.data
          _this.popCount = res.count
        }
      })
    },
    showMore(id: number | string){
      let _this = this as any
      _this.$store.dispatch('SetListPopupsShow',!AppModule.ListPopupsShow)
      _this.popActive = _this.KeyEnterprises.findIndex((item: any)=>{
        return item.value == _this.currentId
      })
      _this.getPopListData(id,_this.currentQydm,1)
    },
    changePopActive(i: number,t: any){
      let _this = this as any
      _this.$refs.son.active = i
      _this.popActive = i
      _this.currentId = t
    },
    handleCurrentChange(val: number){
      let _this = this as any
      _this.getPopListData(_this.currentId,_this.currentQydm,val)
    }
  }
});
</script>


<style lang="scss" scope>
.enterpriseAreaOverview {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .left {
    /* background: #fff; */
    width: 480px;
    .industryDistribution {
      height: 326px;
      margin-bottom: 16px;
    }
    .operatingStatusDistribution {
      height: 324px;
      margin-bottom: 16px;
    }
    .registeredCapitalDistribution {
      height: 272px;
    }
  }
  .middle {
    width: 872px;
    .enterpriseDistribution {
      height: 666px;
      margin-bottom: 16px;
    }
    .regionalNews {
      margin: 16px 0;
      width: 100%;
      height: 42px;
      background: url("~img/qykx_bg.png") no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      padding: 0 20px;
      h6 {
        font-weight: 500;
        color: #4decee;
        font-size: 14px;
      }
      p {
        flex: 1;
        color: #fff;
        font-size: 14px;
      }
      .more {
        font-size: 14px;
        color: #4decee;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .distributionOfKeyEnterprises {
      height: 272px;
      background-image: url("~img/border-md.png");
      .NewKeyEnterprisesBox {
        height: 100%;
        display: flex;
        justify-content: space-between;
        .echartsBox {
          width: 50%;
          height: 100%;
          padding-right: 100px;
        }
        .tableBox {
          width: 50%;
          height: 100%;
        }
        table {
          width: 100%;
          margin-top: 18px;
          position: relative;
          tr {
            width: 100%;
            height: 30px;
            display: flex;
            justify-content: space-between;
            margin-bottom: 2px;
            &:nth-of-type(odd) {
              background: rgba(114, 255, 250, 0.12);
            }
            td {
              flex: 1;
              padding: 0 10px;
              display: flex;
              align-items: center;
              border: none;
              color: #fff;
              img {
                width: 20px;
                height: 24px;
                margin: 0 20px;
              }
              h6 {
                width: 20px;
                height: 24px;
                text-align: center;
                line-height: 24px;
                font-size: 13px;
                color: #40dcd6;
                margin: 0 20px;
              }
            }
          }
          .getMore {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            right: 10px;
            bottom: 10px;
            z-index: 3000;
            &:hover{
              cursor: pointer;
            }
            p {
              font-size: 14px;
              color: #4decee;
              &:hover {
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
  .right {
    /* background: #fff; */
    width: 480px;
    .businessNatureType {
      height: 326px;
      margin-bottom: 16px;
    }
    .Date{
      height: 18px;
      display: flex;
      align-items: center;
      li{
        width: 45px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        &.active{
          background: rgba(91,239,253,.5);
        }
        &:hover{
          cursor: pointer;
        }
      }
    }
    .el-button{
      width: 102px;
      height: 20px;
      background: linear-gradient(90deg, rgba(64,220,214,.25), rgba(34,104,210,.25));
      opacity: 0.25;
      border-radius: 10px;
      font-size: 12px;
      color: #4EECEE;
      line-height: 16px;
      opacity: 0.8;
      padding: 0;
      border: none;
    }
    .enterpriseSize {
      height: 324px;
      margin-bottom: 16px;
      .enterpriseSizeBox{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 100%;
        .flowchartsBox{
          width: 80%;
          height: 100%;
        }
        .sort{
          width: 20%;
          margin-top: 30px;
          height: calc(100% - 30px);
          font-size: 12px;
          color: #CB7BFD;
          font-weight: 400;
          position: relative;
          .item{
            margin-top:10px;
            span{
              margin-left: 10px;
            }
          }
          h6{
            color: #FFFFFF;
          }
          .moreButton{
            width: 7em;
            font-size: 14px;
            font-weight: 500;
            color: #249AF2;
            position: absolute;
            bottom: 0;
            &:hover{
              cursor: pointer;
            }
          }
        }
      }
      .LDQYtable{
        margin-top: 20px;
        // position: absolute;
        z-index: 3000;
        color: #fff;
        width: 100%;
        position: absolute;
        left: 0px;
        .Date{
          width: 148px;
          height: 18px;
          margin-left: 20px;
          display: flex;
          align-items: center;
          background: url('~img/middleBK.png') no-repeat left bottom / 100% 100%;
          li{
            width: 74px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            &.active{
              background: rgba(91,239,253,.5);
            }
            &:hover{
              cursor: pointer;
            }
          }
        }
        .TableBox{
          width: 100%;
          height: 100%;
          display: flex;
          position: absolute;
          justify-content: space-between;
          table{
            width: 50%;
            border: 0;
            border-collapse: collapse;
            margin-top: 10px;
            tr{
              border: 0;
              display: flex;
              align-items: center;
              &:nth-of-type(odd){
                height: 30px;
                background: rgba(114,255,250,0.12);
              }
              &:nth-of-type(even){
                height: 50px;
              }
              td{
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border: 0;
                padding: 0 10px;
                img{
                  width: 20px;
                  height: 23px;
                }
                .index{
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 20px;
                  height: 23px;
                  font-size: 13px;
                  color: #40DCD6;
                }
                .name{
                  font-size: 12px;
                  color: #ffffff;
                  // margin-left: 14px;
                }
                .money{
                  font-size: 12px;
                  color: #D5A32A;
                  // margin-left: 14px;
                }
                .percentage{
                  font-size: 12px;
                  color: #D5A32A;
                  // margin-left: 10px;
                }
              }
            }
          }
        }
      }
    }
    .established {
      height: 272px;
    }
  }
  .myHeader{
    width: 100%;
    display: flex;
    align-items: flex-end;
    .title{
      padding: 0 30px;
      h1{
        font-size: 18px;
        color: #FFFFFF;
        background: linear-gradient(0deg, #91E9EB 0%, #FFFFFF 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    ul{
      display: flex;
      flex: 1;
      padding-right:20px; 
      align-items: flex-end;
      // justify-content: space-around;
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
        margin-left: 20px;
        &:hover{
          cursor: pointer;
        }
        &.active{
          padding-bottom: 3px;
          color: #43F6FF;
          border-bottom:3px solid #43F6FF;
        }
        &.disabled{
          color: #fff;
          pointer-events: none;
          cursor: pointer;
          opacity: 0.6;
        }
      }
    }
  }
  .myContent{
    padding:30px;
    .item{
      display: flex;
      align-items: center;
      width: 100%;
      height: 36px;
      background: rgba(255,255,255,.06);
      margin-bottom: 3px;
      img{
        width: 20px;
        height: 23px;
        margin:0 20px;
      }
      .index{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 23px;
        font-size: 13px;
        color: #40DCD6;
        margin:0 20px;
      }
      .name{
        font-size: 14px;
        color: #FFFFFF;
      }
    }
  }
  .pageBox{
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding:0 30px 20px 30px;
    .el-pagination{
      .el-pagination__total{
        color: #FEFEFE;
      }
      .btn-prev,.btn-next{
        color: #FEFEFE;
        background: rgba(255,255,255,.15);
      }
      .el-pager{
        .number,.el-icon{
          background-color: rgba(255,255,255,.15);
          color: #fff;
          &.active{
            background: #01B4C5;
          }
        }
      }
    }
  }
}
</style>