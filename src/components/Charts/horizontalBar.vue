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
  @Prop({ default:'' }) private unit!: string
  @Prop({ default: () =>[] }) private echartsData!: any[]
  @Prop({ default:'#53B9FF' }) private lineColor!: string
  // @Prop({ default:'#8adaff' }) private hoverColor!:string

  private barWidth = 12

  @Watch('echartsData')
  private onEchartsDataChange(n: any,o: any){
    this.$nextTick(() => {
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
    let pieName = [];
    let pieValue = [];
    for (let i in _this.echartsData) {
      pieValue.push(_this.echartsData[i].value);
      pieName.push(_this.echartsData[i].name);
    }
    _this.chart = echarts.init(document.getElementById(_this.id) as HTMLDivElement)
    _this.chart.clear();
    _this.chart.setOption({
      title: {
        subtext: "单位 : " + _this.unit,
        subtextStyle: {
          color: "#fff"
        },
        left: "right",
        top:'-6%'
      },
      tooltip: {
        trigger: "axis",
        formatter: "{b} ：{c}" +  _this.unit,
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: "2%",
        right: "2%",
        top: "10%",
        bottom: "-10%",
        containLabel: true
      },
        xAxis: [
          {
            show: false,
            type: "value",
            max: function(value) {
              if(value.max<=50){
                return value.max + 10
              }else if(value.max>50&&value.max <= 200){
                return value.max + 100
              }else if(value.max > 200 && value.max <= 1000){
                return value.max + 400
              }else{
                return value.max + 4000
              }
            }
          }
        ],
        yAxis: [
          {
            type: "category",
            data: pieName,
            axisTick: {
              show: false
            },
            axisLabel: {
              formatter: "{value}",
              color: "#fff"
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            inverse:true
            // max:'dataMax'
          }
        ],
        series: [
        {
          // name:'金主企业TOP5',
          type: "bar",
          barWidth:_this.barWidth,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#010A2B" },
                { offset: 1, color: _this.lineColor }
              ]),
              barBorderRadius: 6
            },
            // emphasis: {
            //   color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            //     { offset: 0, color: "#010A2B" },
            //     { offset: 1, color: _this.hoverColor }
            //   ]),
            // }
          },
          data: pieValue,
          label: {
            normal: {
              show: true,
              position: "right",
              color: _this.lineColor,
              formatter: (params: any) => {
                return _this.$formatNum(params.value);
              },
              rich: {
                value: {
                  padding: [0, 0, 0, 10],
                  color: "#75787D"
                }
              }
            },
            // emphasis:{
            //   color: _this.hoverColor
            // }
          }
        }
      ]
    } as EChartOption<EChartOption.SeriesBar>)
  }
}
</script>
