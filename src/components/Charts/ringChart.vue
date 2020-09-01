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

  private  colorList = ["#528af3","#40DCD6","#D75353","#A186F8","#C0D53A","#51AF51","#3066CB"]

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
    _this.chart = echarts.init(document.getElementById(this.id) as HTMLDivElement)
    _this.chart.clear();
    let dataName = [];
    for(let i in _this.echartsData){
        dataName.push(_this.echartsData[i].name)
    }
    _this.chart.setOption({
      color: _this.colorList,
      tooltip: {
        trigger: 'item',
        formatter: (params:any) => {
              return params.name + ' ' +  _this.$formatNum(params.value) + ' ' + params.percent + '%'
            }
      },
      legend: {
        bottom: 25,
        padding:[0,0],
        left: 'center',
        textStyle:{
          fontSize:10,
          color:'#fff'
        },
        itemWidth:10,
        itemHeight: 10,
        data: dataName
      },
      series: [
        {
          type: 'pie',
          radius: ['26%',"40%"],
          center: ['50%', '44%'],
          startAngle:125, //起始角度
          selectedMode: 'single',
          data: (_this as any).echartsData,
          label:{
            formatter: (params:any) => {
              return  _this.$formatNum(params.value) + ' ' + params.percent + '%'
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    } as EChartOption<EChartOption.SeriesPie>)
  }
}
</script>
