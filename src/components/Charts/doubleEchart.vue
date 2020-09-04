<template>
  <div
    :id="id"
    :class="className"
    :style="{height: height, width: width}"
  />
</template>

<script lang="ts">
import echarts, { EChartOption } from 'echarts'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from './mixins/resize'

@Component({
  name: 'BarChart'
})
export default class extends mixins(ResizeMixin) {
  @Prop({ default: 'chart' }) private className!: string
  @Prop({ default: 'chart' }) private id!: string
  @Prop({ default: '200px' }) private width!: string
  @Prop({ default: '200px' }) private height!: string
  @Prop({ default: ()=>[] }) private echartsData!: string

  @Watch('echartsData')
  private changeData(){
    this.$nextTick(()=>{
      this.initChart()
    })
  }
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  }

  private initChart() {
    let _this = this as any;
    this.chart = echarts.init(document.getElementById(this.id) as HTMLDivElement)
    let nameList = [];
    let data = [];
    let data2: any[] = [];
    let rateData = [] as any
    let all = 0;
    let unit = ''
    let unitList = [] as any
    let labelName = ''
    for(let i in _this.echartsData){
      nameList.push(_this.echartsData[i].year)
      data2.push(_this.echartsData[i].counts);
      all += Number(_this.echartsData[i].counts);
      rateData.push((_this.echartsData[i].addRate*100).toFixed(2))
      unit = _this.echartsData[i].unit
    }
    if(_this.echartsData.length){
      labelName = _this.echartsData[0].labelName
    }
    unitList.push(labelName+'（'+unit+'）')
    unitList.push('增长率')
    for(let i in data2){
      let val = {
        value:data2[i],
        // value:((data2[i]/all*10000)/100.00).toFixed(2),
        num:data2[i]
      }
      data.push(val)
    }
    this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          formatter: function(params: any){
            let html = "<div>"
            if(params[0]){
              if(params[0].seriesName.indexOf("企业数量") !== -1){
                html += "<div>"+params[0].name+"</div>"
                html += "<div>"+params[0].marker+params[0].seriesName+"："+_this.$formatNum(params[0].data.num)+"</div>"
              }else{
                html += "<div>"+params[0].name+"</div>"
                html += "<div>"+params[0].marker+params[0].seriesName+"："+params[0].value+"</div>"
              }
            }
            if(params[1]){
              html += "<div>"+params[1].marker+params[1].seriesName+"："+params[1].value+"%"+"</div>"
            }
            html += "</div>"
            return html
          },
          axisPointer: {
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          left:25,
          top: 30,
          itemWidth: 14,
          itemHeight: 4,
          textStyle: {
            color: '#fff'
          },
          data: unitList
        },
        grid: {
          left: '4%',
          right: '4%',
          top: '25%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: nameList,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              show:true,
              color: 'rgba(255,255,255)',
              // align: 'center',
              textStyle: {
                fontSize: 10
              },
              interval: 0,
              boundaryGap:true
              // rotate:40
            },
            axisLine: {
              lineStyle: {
                color: '#2f4967',
                type: 'solid'
              }
            },
          },
          {
            axisLine:{
              show:true,
              lineStyle: {
                color: 'rgba(67,44,54)',
                type: 'solid'
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            scale: true,
            splitLine: {
              lineStyle: {
                color: 'rgba(234,234,234,0.2)',
                type: 'dotted'
              }
            },
            axisLabel:{
              color: '#fff'
            },
            min:0,
            axisLine: {
              show: true,
              lineStyle: {
                color: 'rgba(47,73,103,0.5)',
                type: 'solid'
              }
            },
          },
          {
            axisTick: {
              show: true
            },
            // max: 100,
            // maxInterval: 20,
            axisLabel: {
              // formatter: function(params){
              //     return params+'%'
              // },
              formatter: '{value}%',
              color: '#fff'
            },
            // axisLine: {
            //   show: true,
            //   lineStyle: {
            //     color: 'rgba(243,122,63,0.2)',
            //     type: 'solid'
            //   }
            // },
            splitLine: {
              // lineStyle: {
              //   color: 'rgba(234,234,234,0.5)',
              //   type: 'dashed'
              // }
              show: false
            }
          }
        ],
        series: [
          {
            name: labelName+'（'+unit+'）',
            type: 'bar',
            barWidth: '12',
            itemStyle: {
              normal: {
                color: '#3cc1c8'
              }
            },
            label: {
              show: true,
              color: '#4ABBBF',
              formatter: function(params: any) {
                return params.data.num
              },
              position: 'top'
            },
            data: data
          },
          {
            name: '增长率',
            type: 'line',
            symbol: 'circle',
            symbolSize: 6,
            yAxisIndex: 1,
            lineStyle: {
              normal: {
                width: 2,
                color: '#F37A3F'
              }
            },
            itemStyle: {
              normal: {
                color: "#F37A3F"
              }
            },
            data: rateData
          }
        ]
      } as unknown as EChartOption<EChartOption.SeriesBar> as EChartOption<EChartOption.SeriesPie>)
  }
}
</script>
