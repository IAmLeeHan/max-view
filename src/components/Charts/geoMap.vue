<template>
  <div
    id="chart_map"
    :class="className"
    :style="{height: height, width: width}"
  />
</template>

<script lang="ts">
import echarts, { EChartOption } from 'echarts'
import 'echarts-gl'
import { Component, Prop ,Watch} from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from './mixins/resize'
import { AnyRecordWithTtl } from 'dns';
import { log } from 'util';
import $, { param } from 'jquery';
import { unregister } from 'register-service-worker';
import { UserModule } from '@/store/modules/user';
import { EAreaModule } from '@/store/modules/eArea';
import {MapModule} from '@/store/modules/map'
import { use } from 'vue/types/umd'
import { formData } from '@/utils/index';
import { getGovModSleep } from '@/utils/getsleep';
import { AppModule } from '@/store/modules/app'
import { getGovInfoQydm } from '@/utils/session'

@Component({
  name: 'BarChart'
})
export default class extends mixins(ResizeMixin) {
  @Prop({ default: 'chart' }) private className!: string
  @Prop({ default: 'chart' }) private id!: string
  @Prop({ default: '200px' }) private width!: string
  @Prop({ default: '200px' }) private height!: string

  private selectedPT = []

  private timer: any = null

  private isEara: boolean = false

  selectedAddress(){
    return this.selectedPT.length>1?this.selectedPT[this.selectedPT.length-1]:"中国"
  }

  mounted() {
    this.chart = echarts.init(document.getElementById('chart_map') as any);
    if(UserModule.govInfoQydm === '100000'){
      (this as any).selectedPT = [`china`]
    }else if(UserModule.govInfoQydm.indexOf('0000')!==-1){
      (this as any).selectedPT = [`china`,`${UserModule.govInfoName}`]
    }else{
      //  省代码
      let PQydm = UserModule.govInfoQydm.substr(0,2) + '0000';
      // 省名称
      let pName = ''
      for(let key in MapModule.provinces){
        if((MapModule as any).provinces[key].qydm === PQydm){
          pName = key
        }
      }
      
      (this as any).selectedPT = [`china`,`${pName}`,`${UserModule.govInfoName}`]
    }

    let time = getGovModSleep('a','a1') * 1000
    if(time > 0){
      this.timer = window.setInterval(()=>{
        this.getA1Data()
      },time)
    }else{
      this.getA1Data()
    }
    this.init()
    this.$nextTick(() => {
      this.$emit('sendAddress',this.selectedAddress)
      AppModule.setCurrentTitle((this as any).selectedAddress)
      // this.initChart()
    })
  }

  private getA1Data(){
    if(this.selectedPT.length > 1){
      EAreaModule.getEnterpriseDistribution(UserModule.govInfoQydm).then(res=>{
        MapModule.SetCurrentMap(formData({adminCode:UserModule.govInfoQydm})).then(res=>{
          this.mapGet(`${this.selectedPT[this.selectedPT.length-1]}`,MapModule.currentMap, this.chart);
        })
      })
    }else{
      EAreaModule.getEnterpriseDistribution(UserModule.govInfoQydm).then(res=>{
        MapModule.SetCurrentMap(formData({adminCode:UserModule.govInfoQydm})).then(res=>{
          this.mapGet(`中国`,MapModule.currentMap, this.chart);
        })
      })
    }
  }

  beforeDestroy() {
    window.clearInterval(this.timer)
    this.timer = null
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  }

  private mapGet(name: string,data: any, myChart: any){
      let _that = this as any;
      myChart.clear();
      let d: any[] = []
      data.features.map((item: any)=>{
        EAreaModule.areaList.map((item2: any)=>{
          if(item.properties.name === item2.name){
            d.push(item2)
          }
        })
      })
      d.sort((a: any,b: any)=>{
        return a - b
      })
      echarts.registerMap(name, data);
      let img = require('img/image_4.png');
      let series
      if(!_that.isEara){
        series =  [
          {
            type:'map3D',
            map:name,
            boxWidth: 100,
            itemStyle: {
              color:'#2b4c8a',
              opacity: 1,
              borderWidth: 0.8,
              borderColor: '#09fbfe',
            },
            groundPlane: {
              show: false
            },
            label: {
              show: true,
              textStyle: {
                color: '#fff', //地图初始化区域字体颜色
                fontSize: 14,
                opacity: 1,
                backgroundColor: 'rgba(0,0,0,0)'
                //backgroundColor: 'rgba(53,171,199,0)'
              },
            },
            emphasis: { //当鼠标放上去  地区区域是否显示名称
              label: {
                show: false,
                textStyle: {
                  color: '#fff',
                  fontSize: 16,
                  backgroundColor: 'rgba(0,23,11,0)'
                }
              },
              itemStyle:{
                color:"#2268d2"
              }
            },
            shading: 'lambert',
            light: { //光照阴影
              main: {
                color: '#00fbff', //光照颜色
                intensity: 2.4, //光照强度
                shadowQuality: 'medium', //阴影亮度
                shadow: true, //是否显示阴影
                alpha: -40,
              },
              ambient: {
                intensity: 1.2
              }
            },
            viewControl:{
              autoRotate:false,
              // distance:90,
              // minDistance: 40, // [ default: 40 ] 视角通过鼠标控制能拉近到主体的最小距离。在 projection 为'perspective'的时候有效。
              // maxDistance: 400, // [ default: 400 ] 视角通过鼠标控制能拉远到主体的最大距离。在 projection 为'perspective'的时候有效。
              // zoomSensitivity: 1, // 缩放操作的灵敏度，值越大越灵敏。默认为1,设置为0后无法缩放。
              // panSensitivity: 1, // 平移操作的灵敏度，值越大越灵敏。默认为1,设置为0后无法平移。支持使用数组分别设置横向和纵向的平移灵敏度
              // panMouseButton: 'left',
              // minBeta: -360,
              // maxBeta: 360,
              alpha:60, // 让canvas在x轴有一定的倾斜角度
              // beta:50
            },
            // top:0,
            // left:0,
            // right:0,
            // bottom:0,
            data:d
          }
        ]
      }else{
        series =  [
          {
            type:'map3D',
            map:name,
            boxWidth: 100,
            itemStyle: {
              color:(params:any)=>{
                if(params.data.code === EAreaModule.currentQydm){
                  return '#2268d2'
                }else{
                  return '#2b4c8a'
                }
              },
              opacity: 1,
              borderWidth: 0.8,
              borderColor: '#09fbfe',
            },
            groundPlane: {
              show: false
            },
            label: {
              show: true,
              textStyle: {
                color: '#fff', //地图初始化区域字体颜色
                fontSize: 14,
                opacity: 1,
                backgroundColor: 'rgba(0,0,0,0)'
                //backgroundColor: 'rgba(53,171,199,0)'
              },
            },
            emphasis: { //当鼠标放上去  地区区域是否显示名称
              label: {
                show: false,
                textStyle: {
                  color: '#fff',
                  fontSize: 16,
                  backgroundColor: 'rgba(0,23,11,0)'
                }
              },
              itemStyle:{
                color:"#2268d2"
              }
            },
            shading: 'lambert',
            light: { //光照阴影
              main: {
                color: '#00fbff', //光照颜色
                intensity: 2.4, //光照强度
                shadowQuality: 'medium', //阴影亮度
                shadow: true, //是否显示阴影
                alpha: -40,
              },
              ambient: {
                intensity: 1.2
              }
            },
            viewControl:{
              autoRotate:false,
              // distance:90,
              // minDistance: 40, // [ default: 40 ] 视角通过鼠标控制能拉近到主体的最小距离。在 projection 为'perspective'的时候有效。
              // maxDistance: 400, // [ default: 400 ] 视角通过鼠标控制能拉远到主体的最大距离。在 projection 为'perspective'的时候有效。
              // zoomSensitivity: 1, // 缩放操作的灵敏度，值越大越灵敏。默认为1,设置为0后无法缩放。
              // panSensitivity: 1, // 平移操作的灵敏度，值越大越灵敏。默认为1,设置为0后无法平移。支持使用数组分别设置横向和纵向的平移灵敏度
              // panMouseButton: 'left',
              // minBeta: -360,
              // maxBeta: 360,
              alpha:60, // 让canvas在x轴有一定的倾斜角度
              // beta:50
            },
            // top:0,
            // left:0,
            // right:0,
            // bottom:0,
            data:d
          }
        ]
      }
      let option = {
          tooltip:{
              show:true,
              formatter: function(params: any) {
                  return '<div class="tooltip_box" style="width:auto;height:146px;background: url('+img+') no-repeat left top / 100% 100%;"><p style="padding-left:20px;padding-top:16px;color:#fff;font-size:16px;font-weight:600;">'+params.name+'</p><p style="padding-left:20px;padding-top:12px;color:#1dd6cf;font-size:18px;font-weight:bold;font-family: Arial;">'+_that.$formatNum(params.value)+'<span style="padding-right:10px;color:#1dd6cf;font-size:14px;font-weight:500;"> 家</span></p></div>'
              },
              position:'top',
              backgroundColor:'none'
          },
          series:series
      };
      (_that as any).chart.setOption(option as any as EChartOption<EChartOption.SeriesBar>,true);

      this.$store.commit('SET_LOADING',true)

  }

  private init(){
      this.changeInit();
      this.echartsMap();
  }

  private changeInit(){
    (this as any).selectedAddress = this.selectedPT.length>1?this.selectedPT[this.selectedPT.length-1]:"中国"
    this.$emit('sendAddress',this.selectedAddress)
  }

  private goBack(){
      this.isEara = false
      if(this.selectedPT.length > 2){
        let name = this.selectedPT[this.selectedPT.length-2];
        if(name in MapModule.provinces){
          let qydm = (MapModule as any).provinces[name].qydm
          EAreaModule.setQydm(qydm)
          EAreaModule.getEnterpriseDistribution(qydm).then(res=>{
            MapModule.SetCurrentMap(formData({adminCode:qydm})).then(res=>{
              this.mapGet(`${this.selectedPT[this.selectedPT.length-1]}`,MapModule.currentMap, this.chart);
            })
          })
        }
        this.selectedPT.pop();
      }else{
        (this as any).selectedPT = ["china"];
        EAreaModule.setQydm('100000')
        EAreaModule.getEnterpriseDistribution('100000').then(res=>{
          MapModule.SetCurrentMap(formData({adminCode:'100000'})).then(res=>{
            this.mapGet('中国',MapModule.currentMap, this.chart);
          })
        })
      }
      this.changeInit();
  }
  private echartsMap(){
      let _that = this;
      (_that as any).chart.clear()
      // let myChart = this.$echarts.init(document.getElementById('chart_map'));
      if((_that as any).chart._$handlers.click){
          (_that as any).chart._$handlers.click.length = 0;
      }
      (_that as any).chart.on('click', function(params: any) {
          let code  = params.data.code
          if(code === getGovInfoQydm()){
            _that.isEara = false
          }else{
            _that.isEara = true
          }
          let name = params.name
          if(name in MapModule.provinces){
              (_that as any).selectedPT = ["china"];
              (_that as any).selectedPT.push(name);
              let qydm = (MapModule as any).provinces[name].qydm
              EAreaModule.setQydm(qydm)
              if(_that.isEara){
                EAreaModule.getEnterpriseDistributionEara(qydm).then(()=>{
                  _that.mapGet(params.data.name,MapModule.currentMap, _that.chart);
                })
              }else{
                EAreaModule.getEnterpriseDistribution(qydm).then((res:any)=>{
                  MapModule.SetCurrentMap(formData({adminCode:qydm})).then(res=>{
                    _that.mapGet(name,MapModule.currentMap, _that.chart)
                  })
                })
              }
          }else if(name in MapModule.cityMap){
            if((_that as any).selectedPT.length < 3){
              (_that as any).selectedPT.push(name)
            }else{
              (_that as any).selectedPT[2] = name
            }
              let qydm = (MapModule as any).cityMap[name]
              EAreaModule.setQydm(params.data.code)
              if(_that.isEara){
                EAreaModule.getEnterpriseDistributionEara(qydm).then(()=>{
                  _that.mapGet(params.data.name,MapModule.currentMap, _that.chart);
                })
              }else{
                EAreaModule.getEnterpriseDistribution(qydm).then((res:any)=>{
                  MapModule.SetCurrentMap(formData({adminCode:qydm})).then(res=>{     
                    _that.mapGet(name,MapModule.currentMap, _that.chart)
                  })
                })
              }
          }else{
            _that.isEara = true
            EAreaModule.setQydm(params.data.code)
            _that.mapGet(params.data.name,MapModule.currentMap, _that.chart);
          }
          _that.changeInit();
      });
  }
}
</script>
