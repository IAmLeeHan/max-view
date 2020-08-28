<template>
  <div class="enterpriseAreaOverview">
    <div class="left">
      <moduleItem
        :sub-title="subTitle"
        title="产业/行业分布"
        class="industryDistribution"
        @changeCH="changeActive"
      >
        <pieChart
          v-if="CHshow"
          id="industryDistribution"
          slot="echarts"
          height="100%"
          width="100%"
          :echarts-data="CHChartData"
        ></pieChart>
      </moduleItem>
      <moduleItem
        title="经营状况分布"
        class="operatingStatusDistribution"
      >
        <RosePieChart
          v-if="JYshow"
          id="operatingStatusDistribution"
          slot="echarts"
          height="100%"
          width="100%"
          :echarts-data="JYChartData"
        ></RosePieChart>
      </moduleItem>
      <moduleItem
        title="注册资本分布"
        class="registeredCapitalDistribution"
      >
        <horizontalBar
          v-if="ZCshow"
          id="registeredCapitalDistribution"
          slot="echarts"
          height="100%"
          width="100%"
          :echarts-data="registeredCapitalDistribution"
          :unit="ZCunit"
        ></horizontalBar>
      </moduleItem>
    </div>
    <div class="middle">
      <!-- :org-list="OrgList" -->
      <mainItem
        class="enterpriseDistribution"
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
        class="distributionOfKeyEnterprises"
        :sub-title="KeyEnterprises"
        title="重点企业分布"
      >
        <div slot="echarts">
          <table>
            <tr>
              <td>
                <img
                  src="~img/px_1.png"
                  alt=""
                >
                <p>青岛啤酒股份有限公司</p>
              </td>
              <td>
                <h6>4</h6>
                <p>中国石化青岛炼油化工有限责任公司</p>
              </td>
            </tr>
            <tr>
              <td>
                <img
                  src="~img/px_2.png"
                  alt=""
                >
                <p>海尔集团公司</p>
              </td>
              <td>
                <h6>5</h6>
                <p>青岛钢铁控股集团有限责任公司</p>
              </td>
            </tr>
            <tr>
              <td>
                <img
                  src="~img/px_3.png"
                  alt=""
                >
                <p>海信集团有限公司</p>
              </td>
              <td>
                <h6>6</h6>
                <p>山东六和集团有限公司</p>
              </td>
            </tr>
          </table>
          <div class="getMore">
            <p>
              <span>查看更多</span>
              <i class="el-icon-arrow-right"></i>
            </p>
          </div>
        </div>
      </moduleItem>
    </div>
    <div class="right">
      <moduleItem
        title="企业性质/类型分布"
        class="businessNatureType"
      >
        <verticalBar
          v-if="XLshow"
          id="businessNatureType"
          slot="echarts"
          height="100%"
          width="100%"
          :echarts-data="businessNatureData"
          :unit="XLunit"
        ></verticalBar>
      </moduleItem>
      <moduleItem
        title="企业规模分布"
        class="enterpriseSize"
      >
        <ringChart
          v-if="GMshow"
          id="enterpriseSize"
          slot="echarts"
          height="100%"
          width="100%"
          :echarts-data="GMEchartsData"
        ></ringChart>
      </moduleItem>
      <moduleItem
        title="成立时间分布"
        class="established"
      >
        <horizontalBar
          id="established"
          slot="echarts"
          :echarts-data="established"
          height="100%"
          width="100%"
        ></horizontalBar>
      </moduleItem>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import mainItem from "@/components/mainItem/index.vue";
import moduleItem from "@/components/moduleItem/index.vue";
import pieChart from "@/components/Charts/pieChart.vue";
import RosePieChart from "@/components/Charts/RosePieChart.vue";
import horizontalBar from "@/components/Charts/horizontalBar.vue";
import verticalBar from "@/components/Charts/verticalBar.vue";
import ringChart from "@/components/Charts/ringChart.vue";
import { getIndexList } from '@/utils/session';
import { EAreaModule } from '@/store/modules/eArea';
import axios from 'axios'
import { 
  enterpriseIndustry,
  operatingConditions,
  registeredCapital,
  businessNatureType,
  enterpriseSize,
  established
} from '@/api/area'
export default Vue.extend({
  components: {
    mainItem,
    moduleItem,
    pieChart,
    RosePieChart,
    horizontalBar,
    verticalBar,
    ringChart
  },
  data() {
    return {
      CHshow:false,
      JYshow:false,
      ZCshow:false,
      XLshow:false,
      GMshow:false,
      CSshow:false,
      CHData:{},
      CHChartData:[],
      JYChartData:[],
      ZCunit:'家',
      XLunit:'家',
      CSunit:'家',
      registeredCapitalDistribution: [],
      GMEchartsData:[],
      established: [],
      businessNatureData: []
    };
  },
  computed:{
    subTitle(){
      return (this as any).$getTags('a','a2')
    },
    KeyEnterprises(){
      return (this as any).$getTags('a','a5')
    },
    currentQydm(){
      return EAreaModule.currentQydm
    }
  },
  watch:{
    currentQydm:{
      immediate:true,
      handler(newVal,oldVal){
        let _this = this as any
        let urlA1 = _this.$getModUrl('a','a2')
        enterpriseIndustry(newVal,urlA1).then((res: any)=>{
          _this.CHshow = true; 
          if(res.code === '200'){
            _this.CHData = res.data
            _this.CHChartData = res.data.hyfb
          }
        })
        operatingConditions(newVal).then((res: any)=>{
          _this.JYshow = true;
          if(res.code === '200'){
            _this.JYChartData = res.data.data
          }
        })
        registeredCapital(newVal).then((res: any)=>{
          _this.ZCshow = true;
          if(res.code === '200'){
            _this.registeredCapitalDistribution = res.data.data
            if(res.data.unit){
              _this.ZCunit = res.data.unit
            }
          }
        })
        businessNatureType(newVal).then((res: any)=>{
          _this.XLshow = true;
          if(res.code === '200'){
            _this.businessNatureData = res.data.data
            if(res.data.unit){
              _this.XLunit = res.data.unit
            }
          }
        })
        enterpriseSize(newVal).then((res: any)=>{
          _this.GMshow = true;
          if(res.code === '200'){
            _this.GMEchartsData = res.data.data
          }
        })
        established(newVal).then((res: any)=>{
          _this.CSshow = true;
          if(res.code === '200'){
            _this.established = res.data.data
            if(res.data.unit){
              _this.CSunit = res.data.unit
            }
          }
        })
      }
    }
  },
  methods:{
    changeActive(val: any){
      let _this = this as any
      _this.CHshow = false
      if(val * 1 === 1){
        _this.CHChartData = _this.CHData.hyfb
        _this.CHshow = true
      }else{
        _this.CHChartData = _this.CHData.cyfb
        _this.CHshow = true
      }
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
      table {
        width: 100%;
        margin-top: 28px;
        tr {
          width: 100%;
          height: 40px;
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
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
              font-size: 13px;
              color: #40dcd6;
              margin: 0 20px;
            }
          }
        }
      }
      .getMore {
        display: flex;
        align-items: center;
        justify-content: center;
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
  .right {
    /* background: #fff; */
    width: 480px;
    .businessNatureType {
      height: 326px;
      margin-bottom: 16px;
    }
    .enterpriseSize {
      height: 324px;
      margin-bottom: 16px;
    }
    .established {
      height: 272px;
    }
  }
}
</style>