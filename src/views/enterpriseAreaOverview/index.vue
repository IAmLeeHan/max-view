<template>
  <div>
    <div :class="['enterpriseAreaOverview',{blur: !mainItem || showBlur}]">
      <div class="left">
        <moduleItem
          :sub-title="subTitle"
          title="产业/行业分布"
          class="industryDistribution"
          :gov-mod-next="nextA2"
          :gov-mod-next-sleep="sleepA2"
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
          ref="mainItem"
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
          ref="son"
          class="distributionOfKeyEnterprises"
          :sub-title="KeyEnterprises"
          :gov-mod-next="nextA5"
          :gov-mod-next-sleep="sleepA5"
          title="重点企业分布"
          @changeCH="changeA5Active"
          flexStart
        >
          <div slot="echarts">
            <div class="TableBox">
              <table>
                <tr
                  v-for="(t,i) in ZDQYTableData1"
                  :key="i"
                >
                  <td>
                    <img
                      v-if="t.govIsOrder === 1 && i < 3"
                      :src="require('img/px_'+ (i+1) +'.png')"
                    >
                    <div
                      v-else
                      class="index"
                    >
                      <span>{{ t.govIsOrder === 1 ? t.govOrder : i + 1 }}</span>
                    </div>
                    <span class="name">{{ t.govX315OrgName }}</span>
                  <!-- <span class="money">{{ t.govB6Money }}</span>
                    <span class="percentage">{{ t.govB6Rate }}</span> -->
                  </td>
                </tr>
              </table>
              <table>
                <tr
                  v-for="(t,i) in ZDQYTableData2"
                  :key="i"
                >
                  <td>
                    <img
                      v-if="t.govIsOrder === 1 && ZDQYTableData1.length + i < 3"
                      :src="require('img/px_'+ (i+2) +'.png')"
                    >
                    <div
                      v-else
                      class="index"
                    >
                      <span>{{ t.govIsOrder === 1 ? t.govOrder : i+ZDQYTableData1.length+1 }}</span>
                    </div>
                    <span class="name">{{ t.govX315OrgName }}</span>
                  <!-- <span class="money">{{ t.govB6Money }}</span>
                    <span class="percentage">{{ t.govB6Rate }}</span> -->
                  </td>
                </tr>
              </table>
            </div>
            <div class="getMore">
              <p>
                <span @click="showMore(currentId)">查看更多</span>
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
            v-if="CSshow"
            id="established"
            slot="echarts"
            line-color="#40DCD6"
            :echarts-data="established"
            height="100%"
            width="100%"
          ></horizontalBar>
        </moduleItem>
      </div>
    </div>
    <lottie v-if="!mainItem"></lottie>
    <listPopups
      @popupClose="popupCloseHandler"
    >
      <div
        slot="ListPopups-header"
        class="myHeader"
      >
        <div class="title">
          <h1>重点企业分布</h1>
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
          v-for="(t,i) in popListData"
          :key="i"
          class="item"
        >
          <img
            v-if="t.govIsOrder === 1 && i + 1 <= 3"
            :src="require('img/px_'+ (i + 1) +'.png')"
          >
          <div
            v-else
            class="index"
          >
            <span>{{ t.govIsOrder === 1 ? t.govOrder : (currentPage * 10 - 10) + i +1 }}</span>
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
import pieChart from "@/components/Charts/pieChart.vue";
import RosePieChart from "@/components/Charts/RosePieChart.vue";
import horizontalBar from "@/components/Charts/horizontalBar.vue";
import verticalBar from "@/components/Charts/verticalBar.vue";
import ringChart from "@/components/Charts/ringChart.vue";
import listPopups from '@/components/listPopups/index.vue'
import lottie from '@/components/lottie/index.vue';
import { getIndexList } from '@/utils/session';
import { AppModule } from '@/store/modules/app';
import { EAreaModule } from '@/store/modules/eArea';
import getTagRule from '@/utils/getTagRule';
import axios from 'axios'
import {
  getGovModNext,
  getGovModNextSleep,
  getGovModSleep
} from '@/utils/getsleep';
import { 
  areaTags,
  enterpriseIndustry,
  operatingConditions,
  registeredCapital,
  businessNatureType,
  enterpriseSize,
  established,
  keyEnterprise
} from '@/api/area'
export default Vue.extend({
  components: {
    mainItem,
    moduleItem,
    pieChart,
    RosePieChart,
    horizontalBar,
    verticalBar,
    ringChart,
    listPopups,
    lottie
  },
  data() {
    return {
      currentPage:1,
      popActive:0,
      currentId:0,
      CHshow:false,
      JYshow:false,
      ZCshow:false,
      XLshow:false,
      GMshow:false,
      CSshow:false,
      ZDQYTableShow:false,
      CHData:{},
      CHChartData:[],
      JYChartData:[],
      ZCunit:'家',
      XLunit:'家',
      CSunit:'家',
      registeredCapitalDistribution: [],
      GMEchartsData:[],
      established: [],
      businessNatureData: [],
      timerA2:null,
      timerA3:null,
      timerA4:null,
      timerA5:null,
      timerA6:null,
      timerA7:null,
      timerA8:null,
      KeyEnterprises:[],
      ZDQYTableData1:[],
      ZDQYTableData2:[],
      popListData:[],
      popCount:0
    };
  },
  computed:{
    nextA2(){
      return getGovModNext('a','a2')
    },
    sleepA2(){
      return getGovModNextSleep('a','a2')
    },
    nextA5(){
      return getGovModNext('a','a5')
    },
    sleepA5(){
      return getGovModNextSleep('a','a5')
    },
    subTitle(){
      return (this as any).$getTags('a','a2')
    },
    currentQydm(){
      return EAreaModule.currentQydm
    },
    mainItem(){
      let _this = this as any
      return EAreaModule.loading && _this.CHshow && _this.JYshow && _this.ZCshow &&_this.ZDQYTableShow && _this.XLshow && _this.GMshow &&_this.CSshow
    },
    showBlur(){
      return AppModule.ListPopupsShow || AppModule.dialogTableVisible
    }
  },
  watch:{
    currentQydm:{
      immediate:true,
      handler(newVal,oldVal){
        let _this = this as any
        let urlA2 = _this.$getModUrl('a','a2')
        _this.CHshow = false;
        enterpriseIndustry(newVal,urlA2).then((res: any)=>{
          _this.CHshow = true; 
          if(res.code === '200'){
            _this.CHData = res.data
            _this.CHChartData = res.data.cyfb
          }
        }).catch((error: any)=>{
          _this.CHshow = true;
        })
        let urlA3 = _this.$getModUrl('a','a3')
        _this.JYshow = false;
        operatingConditions(newVal,urlA3).then((res: any)=>{
          _this.JYshow = true;
          if(res.code === '200'){
            _this.JYChartData = res.data.data
          }
        }).catch((error: any)=>{
          _this.JYshow = true;
        })
        let urlA4 = _this.$getModUrl('a','a4')
        _this.ZCshow = false;
        registeredCapital(newVal,urlA4).then((res: any)=>{
          _this.ZCshow = true;
          if(res.code === '200'){
            _this.registeredCapitalDistribution = res.data.data
            if(res.data.unit){
              _this.ZCunit = res.data.unit
            }
          }
        }).catch((error: any)=>{
          _this.ZCshow = true;
        })
        areaTags((this as any).currentQydm).then(res=>{
          let rule = getTagRule('a','a5')
          let data = (this as any).$getTags('a','a5')
          data.map((item: any)=>{
            if(!res.data.includes((item.value) * 1)){
              if(rule === 1){
                item.disabled = true
              }else{
                data = data.filter((item: any)=>{
                  return res.data.includes((item.value) * 1)
                })
              }
            }
          })
          if(res.data.length<=0){
            _this.KeyEnterprises = _this.$getTags('a','a5')
            _this.KeyEnterprises.map((item: any)=>{
              item.disabled = true
            })
          }else{
            _this.KeyEnterprises = data || []
          }
          let hasDataTag = _this.KeyEnterprises.filter((item: any)=>{
            return !item.disabled
          })
          let urlA5 = _this.$getModUrl('a','a5')
          let id
          if(res.data.length<=0){
            id = (_this.KeyEnterprises[0].value) * 1
          }else{
            id = (hasDataTag[0].value) * 1
          }
          _this.currentId = id
          _this.getZDQYList(id,newVal,urlA5)
        })
        let urlA6 = _this.$getModUrl('a','a6')
        _this.XLshow = false;
        businessNatureType(newVal,urlA6).then((res: any)=>{
          _this.XLshow = true;
          if(res.code === '200'){
            _this.businessNatureData = res.data.data
            if(res.data.unit){
              _this.XLunit = res.data.unit
            }
          }
        }).catch((error: any)=>{
          _this.XLshow = true;
        })
        let urlA7 = _this.$getModUrl('a','a7')
        _this.GMshow = false;
        enterpriseSize(newVal,urlA7).then((res: any)=>{
          _this.GMshow = true;
          if(res.code === '200'){
            _this.GMEchartsData = res.data.data
          }
        }).catch((error: any)=>{
          _this.GMshow = true;
        })
        let urlA8 = _this.$getModUrl('a','a8')
        _this.CSshow = false;
        established(newVal,urlA8).then((res: any)=>{
          _this.CSshow = true;
          if(res.code === '200'){
            _this.established = res.data.data
            if(res.data.unit){
              _this.CSunit = res.data.unit
            }
          }
        }).catch((error: any)=>{
          _this.CSshow = true;
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
    _this.$nextTick(()=>{
      let time2 = getGovModSleep('a','a2') * 1000
      if(time2>0){
        _this.timerA2 = window.setInterval(()=>{
          let urlA2 = _this.$getModUrl('a','a2')
          enterpriseIndustry(_this.currentQydm,urlA2).then((res: any)=>{
            _this.CHshow = true; 
            if(res.code === '200'){
              _this.CHData = res.data
              _this.CHChartData = res.data.cyfb
            }
          }).catch((error: any)=>{
            _this.CHshow = true;
          })
        },time2)
      }
      let time3 = getGovModSleep('a','a3') * 1000
      if(time3>0){
        _this.timerA3 = window.setInterval(()=>{
          let urlA3 = _this.$getModUrl('a','a3')
          operatingConditions(_this.currentQydm,urlA3).then((res: any)=>{
            _this.JYshow = true;
            if(res.code === '200'){
              _this.JYChartData = res.data.data
            }
          }).catch((error: any)=>{
            _this.JYshow = true;
          })
        },time3)
      }
      let time4 = getGovModSleep('a','a4') * 1000
      if(time4>0){
        _this.timerA4 = window.setInterval(()=>{
          let urlA4 = _this.$getModUrl('a','a4')
          registeredCapital(_this.currentQydm,urlA4).then((res: any)=>{
            _this.ZCshow = true;
            if(res.code === '200'){
              _this.registeredCapitalDistribution = res.data.data
              if(res.data.unit){
                _this.ZCunit = res.data.unit
              }
            }
          }).catch((error: any)=>{
            _this.ZCshow = true;
          })
        },time4)
      }
      // let time5 = getGovModSleep('a','a5') * 1000
      // if(time5>0){

      // }
      // _this.timerA5 = window.setInterval(()=>{

      // },time5)
      let time6 = getGovModSleep('a','a6') * 1000
      if(time6>0){
        _this.timerA6 = window.setInterval(()=>{
          let urlA6 = _this.$getModUrl('a','a6')
          businessNatureType(_this.currentQydm,urlA6).then((res: any)=>{
            _this.XLshow = true;
            if(res.code === '200'){
              _this.businessNatureData = res.data.data
              if(res.data.unit){
                _this.XLunit = res.data.unit
              }
            }
          }).then((error: any)=>{
            _this.XLshow = true;
          })
        },time6)
      }
      let time7 = getGovModSleep('a','a7') * 1000
      if(time7>0){
        _this.timerA7 = window.setInterval(()=>{
          let urlA7 = _this.$getModUrl('a','a7')
          enterpriseSize(_this.currentQydm,urlA7).then((res: any)=>{
            _this.GMshow = true;
            if(res.code === '200'){
              _this.GMEchartsData = res.data.data
            }
          }).catch((error)=>{
            _this.GMshow = true;
          })
        },time7)
      }
      let time8 = getGovModSleep('a','a8') * 1000
      if(time8>0){
        _this.timerA8 = window.setInterval(()=>{
          let urlA8 = _this.$getModUrl('a','a8')
          established(_this.currentQydm,urlA8).then((res: any)=>{
            _this.CSshow = true;
            if(res.code === '200'){
              _this.established = res.data.data
              if(res.data.unit){
                _this.CSunit = res.data.unit
              }
            }
          }).catch((error: any)=>{
            _this.CSshow = true;
          })
        },time8)
      }
    })
  },
  beforeDestroy(){
    let _this = this as any
    window.clearInterval(_this.timerA2)
    _this.timerA2 = null 
    window.clearInterval(_this.timerA3)
    _this.timerA3 = null 
    window.clearInterval(_this.timerA4)
    _this.timerA4 = null 
    // _this.timerA5
    window.clearInterval(_this.timerA6)
    _this.timerA6 = null 
    window.clearInterval(_this.timerA7)
    _this.timerA7 = null 
    window.clearInterval(_this.timerA8)
    _this.timerA8 = null 
  },
  methods:{
    getZDQYList(id: string|number,newVal: string,url: string){
      let _this = this as any
      let dataA5 = {
          "data": {
            "govLabel": id,
            "qydm": newVal
          },
          "pageNum": 1,
          "pageSize":6 
        }
      // _this.ZDQYTableShow = false
      keyEnterprise(dataA5,url).then((res: any)=>{
        _this.ZDQYTableShow = true
        if(res.code === '200' && res.data && res.data.length>0){
          let data = res.data
          let index = data.length / 2
          _this.ZDQYTableData1 = data.slice(0,index)
          _this.ZDQYTableData2 = data.slice(index,data.length)
        }else{
          let hasDataTag = _this.KeyEnterprises.filter((item: any)=>{
            return !item.disabled
          })
          let curIndex = hasDataTag.findIndex((item: any)=>{
            return item.value == id
          })
          _this.$refs.son.active = _this.KeyEnterprises.findIndex((item: any)=>{
            return item.value === hasDataTag[curIndex-1].value
          })
        }
      }).catch((error: any)=>{
        _this.ZDQYTableShow = true
      })
    },
    getPopListData(id: string|number,newVal: string,page: number,url?: string){
      let _this = this as any
      let dataA5 = {
          "data": {
            "govLabel": id,
            "qydm": newVal
          },
          "pageNum": page,
          "pageSize":10
        }
      keyEnterprise(dataA5,url).then((res: any)=>{
        let data = res.data
        _this.popListData = data
        _this.popCount = res.count
      })
    },
    changeActive(val: any){
      let _this = this as any
      _this.CHshow = false
      if(val * 1 === 1){
        _this.CHChartData = _this.CHData.cyfb
        _this.CHshow = true
      }else{
        _this.CHChartData = _this.CHData.hyfb
        _this.CHshow = true
      }
    },
    changeA5Active(val: any){
      let _this = this as any
      _this.currentId = val      
      let urlA5 = _this.$getModUrl('a','a5');
      _this.getZDQYList(val*1,_this.currentQydm,urlA5)
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
      _this.currentPage = 1
      _this.$refs.son.active = i
      _this.popActive = i
      _this.currentId = t
    },
    handleCurrentChange(val: number){
      let _this = this as any
      _this.currentPage = val
      _this.getPopListData(_this.currentId,_this.currentQydm,val)
    },
    popupCloseHandler(){
      let _this = this as any
      _this.currentPage = 1
      _this.getPopListData(_this.currentId,_this.currentQydm,1)
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
  &.blur{
    filter: blur(5px);
  }
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
      .TableBox{
          width: 100%;
          height: 100%;
          display: flex;
          margin-top: 20px;
          // position: absolute;
          justify-content: space-between;
          table{
            width: 50%;
            border: 0;
            border-collapse: collapse;
            tr{
              border: 0;
              display: flex;
              align-items: center;
              &:nth-of-type(odd){
                height: 45px;
                background: rgba(114,255,250,0.12);
              }
              &:nth-of-type(even){
                height: 45px;
              }
              td{
                width: 100%;
                display: flex;
                justify-content: flex-start;
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
                  width: 20em;
                  // flex: 1;
                  font-size: 14px;
                  color: #ffffff;
                  margin-left: 20px;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                  font-size: 12px;
                  color: #fff;
                }
                // .money{
                //   font-size: 12px;
                //   color: #D5A32A;
                //   // margin-left: 14px;
                // }
                // .percentage{
                //   font-size: 12px;
                //   color: #D5A32A;
                //   // margin-left: 10px;
                // }
              }
            }
          }
        }
      .getMore {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top:20px;
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
.myHeader{
  width: 100%;
  height: 18px;
  display: flex;
  align-items: flex-start;
  .title{
    padding: 0 30px;
    h1{
      font-size: 18px;
      line-height: 18px;
      color: #FFFFFF;
      background: linear-gradient(180deg, #91E9EB 0%, #FFFFFF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  ul{
    display: flex;
    flex: 1;
    padding-right:20px;
    align-items: flex-start;
    // justify-content: space-around;
    &.margin{
      justify-content: flex-start;
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
      padding-bottom: 6px;
      &:hover{
        cursor: pointer;
        color: #43F6FF;
      }
      &.active{
        color: #43F6FF;
        padding-bottom: 3px;
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
  padding:30px 30px 20px 30px;
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
  padding:0 22px 20px 30px;
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
</style>