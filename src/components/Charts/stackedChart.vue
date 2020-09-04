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
  @Prop({ default: '家' }) private unit!: string
  @Prop({ default: () =>[] }) private echartsData!: any[]
  @Prop({ default: false }) private wrap!: boolean
  @Prop({ default:40 }) private rotate!: number

  @Watch('echartsData')
  private changeData(){
    this.$nextTick(()=>{
      this.initChart()
    })
  }

  mounted() {
    this.$nextTick(() => {
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
    let legendData = _this.echartsData.label
    let firstData = _this.echartsData.value[legendData[0]]
    let secondData = _this.echartsData.value[legendData[1]]
    let thirdData = _this.echartsData.value[legendData[2]]
    _this.chart = echarts.init(document.getElementById(_this.id) as HTMLDivElement)
    _this.chart.clear();
    _this.chart.setOption({
      title: {
        subtext: "单位 : " + this.unit,
        subtextStyle: {
          color: "#fff",
          fontSize: 12
        },
        right:'4%',
        top:-2
      },
    color: [
        "#0596F5",
        "#80DC91",
        "#F37A3F"
    ],
    legend: {
        data:legendData,
        top:8,
        left: "4%",
        itemWidth:14,
        itemHeight:4,
        textStyle: {
            color: "#DFDFDF"
        }
    },
    grid: {
        left: "4%",
        right: "4%",
        bottom: "2%",
        top: "20%",
        containLabel: true
    },
    tooltip: {
        trigger: "axis",
        formatter: (params: any)=>{
          let data = ''
          let date = ''
          params.map((item: any)=>{
            date = `<div>${item.name}</div>`
            data += ( `<div style="display:flex;align-items:center"><p style="width:10px;height:10px;border-radius:50%;background:${item.color};margin-right:10px"></p><p>${item.seriesName}：${item.value}</p></div>`)
          })
          return date + data
        },
        axisPointer: {
            type: "shadow"
        },
        textStyle: {
            align: 'left'
        }
    },

    xAxis: [
      {
        type: "category",
        data: _this.echartsData.name,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          show: true,
          color: "rgba(255,255,255)",
          fontSize: 10,
          // fontWeight:'lighter',
          rotate:0,
          interval:_this.echartsData.name.length>6?2:0,
          boundaryGap:true,
          formatter:function(value: any){  
              let ret = "";//拼接加\n返回的类目项  
              let maxLength = 5;//每项显示文字个数  
              let valLength = value.length;//X轴类目项的文字个数  
              let rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
              if(_this.wrap){
                if (rowN > 1)//如果类目项的文字大于3,  
                {  
                  for (let i = 0; i < rowN; i++) {  
                      let temp = "";//每次截取的字符串  
                      let start = i * maxLength;//开始截取的位置  
                      let end = start + maxLength;//结束截取的位置  
                      //这里也可以加一个是否是最后一行的判断
                      if(i + 1 === rowN){
                        temp = value.substring(start, end);  
                      }else if(i === 0){
                        if(_this.rotate>0){
                          temp = "\n" + value.substring(start, end) + "\n";  
                        }else{
                          temp = value.substring(start, end) + "\n";  
                        }
                      }else{
                        temp = value.substring(start, end) + "\n";  
                      }
                      ret += temp; //凭借最终的字符串
                  }
                  return ret;  
                } else {  
                  return value;  
                }  
              }else{
                return value
              }
            } 
          // formatter: "{value}"
        },
        axisLine: {
            lineStyle: {
              color: '#2f4967',
              type:'solid'
            }
          },
    }],
    yAxis: [{
        type: "value",
        axisTick: {
            show: false
        },
        axisLabel: {
          show: true,
            textStyle: {
              color: "#fff",
              fontSize: 10
            }
        },
        axisLine: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(234,234,234,0.2)',
              type:'dotted'
            }
          }
    }],
    series: [{
            name: "第一产业",
            type: "bar",
            stack: "总量",
            barWidth: 12,
            data: firstData
        },
        {
            name: "第二产业",
            type: "bar",
            stack: "总量",
            barWidth:12,
            data: secondData
        },
        {
            name: "第三产业",
            type: "bar",
            stack: "总量",
            barWidth: 12,
            data: thirdData
        }
    ]
    } as any as EChartOption<EChartOption.SeriesBar>)
  }
}
</script>
