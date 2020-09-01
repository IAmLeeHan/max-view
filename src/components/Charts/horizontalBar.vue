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
        subtext: "单位 : 万家",
        subtextStyle: {
          color: "#fff"
        },
        left: "right"
      },
      tooltip: {
        trigger: "axis",
        formatter: "{b}:{c}万家",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: "2%",
        right: "2%",
        top: "18%",
        bottom: "-15%",
        containLabel: true
      },
        xAxis: [
          {
            show: false,
            type: "value",
            max: function(value) {
              if(value.max <= 200){
                return value.max + 40
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
                { offset: 1, color: "#53B9FF" }
              ]),
              barBorderRadius: 6
            }
          },
          data: pieValue,
          label: {
            normal: {
              show: true,
              position: "right",
              color: "#53B9FF",
              formatter: (params: any) => {
                return _this.$formatNum(params.value);
              },
              rich: {
                value: {
                  padding: [0, 0, 0, 10],
                  color: "#75787D"
                }
              }
            }
          }
        }
      ]
    } as EChartOption<EChartOption.SeriesBar>)
  }
}
</script>
