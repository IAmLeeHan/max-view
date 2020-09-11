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
  @Prop({ default: ()=>[] }) private echartData: any
  private seriesData = [] as any
  @Watch("echartData",{
     immediate: true,deep:true
  })
  private changeData(){
    this.seriesData = []
    this.echartData.map((item: any)=>{
      let val = {
        name:item.key,
        value:item.value
      }
      this.seriesData.push(val)
    })
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
    let _this = this
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
        formatter: "{b} : {c} ({d}%)"
      },
      legend: {
        bottom: 12,
        padding: [0, 5],
        itemWidth: 10,
        itemHeight: 10,
        itemGap:15,
        right: 20,
        top:"center",
        textStyle: {
          color: "#fff",
          fontSize:10
        },
        orient:"vertical" ,
        data: this.seriesData.map((item: any)=> item.name)
      },
      series: [
        {
          type: "pie",
          radius: ['40%',"56%"],
          center: ['35%', '50%'],
          startAngle: 60, //起始角度
          selectedMode: "single",
          roseType:"radius",
          label:{
              formatter: '{d}%'
          },
          labelLine:{
            length:10,
            length2:10
          },
          data:(this as any).seriesData
        }
      ]
    } as EChartOption<EChartOption.SeriesPie>)
  }
}
</script>
