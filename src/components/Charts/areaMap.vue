<template>
  <div class="MapBox">
    <div class="legendBox">
      <ul class="fl r_box_ul">
        <li
          v-for="(item,index) in echartData"
          :key="index"
        >
          <span
            class="sp_cirle"
            :style="{backgroundColor: colorList2[index%10]}"
          ></span>
          <span :style="{color: colorList2[index%10]}">{{ item.qyName }}</span>
        </li>
      </ul>
    </div>
    <div
      :id="id"
      :class="className"
      :style="{height: height, width: width}"
    />
  </div>
</template>

<script lang="ts">
import echarts, { EChartOption } from 'echarts'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from './mixins/resize'
import {MapModule} from '@/store/modules/map'
import $ from 'jquery';
import { formData } from '@/utils/index'


@Component({
  name: 'BarChart'
})
export default class extends mixins(ResizeMixin) {
  @Prop({ default: 'chart' }) private className!: string
  @Prop({ default: 'chart' }) private id!: string
  @Prop({ default: '200px' }) private width!: string
  @Prop({ default: '200px' }) private height!: string
  @Prop({ default: ()=>[] }) private echartData: any
  @Prop({ default: {name:"青岛市",code:"",selected:""} }) private areaInfo!: string

  
  @Watch("areaInfo",{ immediate: true,deep:true })
  private changeAreaInfo(){
    // this.$nextTick(() => {

    //   this.chart = echarts.init(document.getElementById(this.id) as any);
    //   this.initChart(this.chart)
    // })
  }
  @Watch("echartData",{
    immediate: true,deep:true
  })
  private changeData(){
    this.$nextTick(() => {
      this.chart = echarts.init(document.getElementById(this.id) as any);
      this.initChart(this.chart)
    })
  }
  private colorList2 = ["#D31F9A","#00A2FF","#DEF427","#10D5C0","#ED694F","#F8A10B","#40CFE9","#5A45DA","#CB7BFD","#86ED32"]
  mounted() {
    this.chart = echarts.init(document.getElementById(this.id) as any);
  }

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  }
  private mapGet(data: any,total: number){
    let _this = this
     echarts.registerMap((_this as any).areaInfo.parentName, data);
        let d: any = {};
        for(let i in data.features){
            d[data.features[i].properties.adcode] = data.features[i].properties.center
        }
        let series = [];
        for(let i = 0;i<_this.echartData.length;i++){
            let bb = {};
            let name = _this.echartData[i].qyName;
            let code = _this.echartData[i].key
            let value = Number(_this.echartData[i].value);
            let scale = 4 - i*0.2
            
            bb = {
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: {
                    period: 10,
                    scale: scale ,
                    brushType: 'stroke'
                },
                label: {
                    show: false,
                    position: 'right',
                    formatter: '{b}',
                },
                // symbolSize: function(val: any) {
                //     return (((val[2]/total)*100).toFixed(2))
                // },
                symbolSize:12,
                itemStyle: {
                    color: _this.colorList2[i%10]
                },
                data: [{
                    name: name,
                    value: d[code].concat(value)
                }]
            };
            series.push(bb);
        }
        let option = {
            tooltip:{
              trigger:"item",
              formatter:function(params: any){
                let res = "";
                res = "<span style='color:#fff;'>" + params.data.name + "</span><br/>" + params.data.value[2]+"家";
                return res
              }
            },
            geo: {
                // map: '青岛市',
                map:(_this as any).areaInfo.parentName,
                zoom:1,
                label: {
                    show: false,
                    emphasis: {
                        show: false
                    }
                },
                roam: false,
                itemStyle: {
                    normal: {
                        color: 'rgba(51, 69, 89, .3)', //地图背景色
                        borderColor: '#396ac4', //省市边界线00fcff 516a89
                        borderWidth: 1
                    },
                    emphasis: {
                        color: 'rgba(37, 43, 61, .5)' //悬浮背景
                    }
                },
                left:'center'
            },
            series: series
        };
        (_this as any).chart.setOption(option as EChartOption<EChartOption.SeriesBar>);
  }
  private initChart(myChart: any) {
    let _this = this
    myChart.clear();
    let total = 0
    _this.echartData.map((item: any)=>{
      total += Number(item.value*1)
    })
    if(this.echartData.length){
      console.log(this.areaInfo)
      MapModule.SetCurrentMap(formData({adminCode:(this as any).areaInfo.parentNode})).then(res=>{
          _this.mapGet(MapModule.currentMap,total)
         
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .MapBox{
    height:100%;
    width:100%;
    display:flex;
    align-items: center;
    .legendBox{
      width:50%;
      height:60%;
      .r_box_ul{
          /*width:50%;*/
          width:100%;
          margin-left:40px;
          height:100%;
          display:flex;
          flex-direction: column;
          flex-wrap: wrap;
          li{
              font-size: 12px;
              line-height: 24px;
              // margin-right:20px;
              .sp_cirle{
                  width:6px;
                  height:6px;
                  background:rgba(37,112,226,1);
                  border-radius:50%;
                  display: inline-block;
                  vertical-align: middle;
                  margin-right:6px;
              }
          }
      }
    }
  }
</style>
