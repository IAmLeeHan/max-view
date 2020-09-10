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

  private arrCount(arr: any[]){
    let count = 0
    arr.forEach(item => {
      count = count + item * 1 
    })
    
    return count
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
        confine:true,
        formatter: (params: any) => {
              return params.name + '&nbsp;&nbsp;&nbsp;' +  _this.$formatNum(params.value) + '&nbsp;&nbsp;&nbsp;' + params.percent + '%'
            }
      },
      legend: {
        tooltip:{
          show:true,
          formatter:(params: any) => {
            let index = _this.echartsData.map((item: any)=> item.name).findIndex((item: string)=>{
              return item === params.name
            })
            let count: number = _this.arrCount(_this.echartsData.map((item: any)=>item.value * 1))
            let item = _this.echartsData.filter((item: any,i: number)=>{
              return i === index
            })
            return params.name + '&nbsp;&nbsp;&nbsp;' +  _this.$formatNum(item[0].value) + '&nbsp;&nbsp;&nbsp;' + ((item[0].value/count) * 100).toFixed(2) + '%'
          }
        },
        bottom: 12,
        padding: [-5, 5],
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
          avoidLabelOverlap: true,//对，就是这里avoidLabelOverlap
          center: ["50%", "40%"],
          startAngle: 135, //起始角度
          selectedMode: "single",
          label: {
            fontSize: 10
          },
          data:(this as any).echartsData
        }
      ]
    } as EChartOption<EChartOption.SeriesPie>,true)
  }
}
</script>
