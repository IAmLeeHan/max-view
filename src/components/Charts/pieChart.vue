<template>
  <div
    :id="id"
    :class="className"
    :style="{height: height, width: width}"
  />
</template>

<script lang="ts">
import echarts, { EChartOption } from 'echarts'
import { Component, Prop,Watch } from 'vue-property-decorator'
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
  @Prop({ default: ()=>[] }) private echartsData!: []

  @Watch('echartsData')
  private onEchartsDataChange(n: any,o: any){
    this.initChart()
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
    this.chart = echarts.init(document.getElementById(this.id) as HTMLDivElement)
    this.chart.setOption({
      color:[
        "#528af3",
        "#40DCD6",
        "#D75353",
        "#A186F8",
        "#C0D53A",
        "#51AF51",
        "#3066CB"
      ],
      tooltip:{
        trigger: "item",
        formatter: (params:any) => {
              return params.name + ' ' +  _this.$formatNum(params.value) + ' ' + params.percent + '%'
            }
      },
      legend: {
        bottom: 12,
        padding: [0, 5],
        itemWidth: 10,
        itemHeight:10,
        // itemGap:30,
        left: "center",
        textStyle: {
          color: "#fff",
          fontSize: 10,
          fontWeight: "normal"
        },
        data: this.echartsData.map((item: any)=> item.name)
      },
      series: [
        {
          type: "pie",
          radius: "40%",
          center: ["50%", "40%"],
          startAngle: 135, //起始角度
          selectedMode: "single",
          label: {
            fontSize: 10,
          },
          data:(this as any).echartsData
        }
      ]
    } as EChartOption<EChartOption.SeriesPie>,true)
  }
}
</script>
