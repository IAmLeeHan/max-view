<template>
  <div
    :id="id"
    :class="className"
    :style="{height: height, width: width}"
  />
</template>

<script lang="ts">
import echarts, { EChartOption } from 'echarts'
import { Component, Prop, Watch} from 'vue-property-decorator'
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
  @Prop({ default: ()=>[] as any }) private echartData: any
  private legendList = [] as any
  private pieData = [] as any
  @Watch("echartData",{
     immediate: true,deep:true
  })
  private changeData(){
    this.pieData = []
    this.echartData.map((item: any)=>{
      let val = {
        name:item.key,
        value:item.value
      }
      this.pieData.push(val)
    })
    this.$nextTick(() => {
      this.initChart()
    })
  }
  private echartsData = [
    {
      value: "5890",
      name: "制造业"
    },
    {
      value: "4100",
      name: "进出口"
    },
    {
      value: "3370",
      name: "建筑业"
    },
    {
      value: "2400",
      name: "服务业"
    },
    {
      value: "1600",
      name: "石化化工"
    },
    {
      value: "1000",
      name: "服装"
    },
    {
      value: "800",
      name: "其他"
    }
  ]
  // mounted() {
  //   this.$nextTick(() => {
  //     this.initChart()
  //   })
  // }

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
        itemWidth: 14,
        right: 30,
        top:"center",
        textStyle: {
          color: "#fff"
        },
        orient:"vertical" ,
        data: this.echartData.map((item: any)=> item.key)
      },
      series: [
        {
          type: "pie",
          radius: ['40%',"56%"],
          center: ['40%', '50%'],
          // startAngle: 60, //起始角度
          selectedMode: "single",
          label:{
              formatter: '{b} {d}%'
          },
          data:(this as any).pieData
        }
      ]
    } as EChartOption<EChartOption.SeriesPie>)
  }
}
</script>
