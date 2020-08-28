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
        right: "0",
        bottom: "-2%",
        top: "20%",
        containLabel: true
    },
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "shadow"
        },
        textStyle: {
            align: 'left'
        }
    },

    xAxis: [{
        type: "category",
        data: _this.echartsData.name,
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: "#DFDFDF",
            fontSize: 10
          },
          rotate:40
          // formatter: "{value}"
        },
        axisLine: {
          show: false
        }
    }],
    yAxis: [{
        type: "value",
        axisTick: {
            show: false
        },
        axisLine: {
            show: false
        },
        axisLabel: {
            show: true,
            textStyle: {
                color: "#DFDFDF",
                fontSize: 12
            }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(234,234,234,0.5)',
            type: 'dashed'
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
    } as EChartOption<EChartOption.SeriesBar>)
  }
}
</script>
