<template>
  <div
    :id="id"
    :class="className"
    :style="{height: height, width: width}"
  />
</template>

<script lang="ts">
import echarts, { EChartOption } from 'echarts'
import { Component, Prop,Watch} from 'vue-property-decorator'
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
  @Prop({ default: false }) private vertical!: boolean
  @Prop({ default:()=>[] }) private echartsData!: any[]

  private colorList = [
    "#528af3",
    "#40DCD6",
    "#D75353",
    "#A186F8",
    "#C0D53A",
    "#51AF51"
  ]

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

  private arrCount(arr:any[]){
    let count = 0
    arr.forEach(item => {
      count = count + item * 1 
    })
    
    return count
  }

  private initChart() {
    let _this = this as any;
    this.chart = echarts.init(document.getElementById(this.id) as HTMLDivElement)
    this.chart.clear();
     let dataName: string[] = [];
     for (let i in _this.echartsData) {
        dataName.push(_this.echartsData[i].name);
      }
    this.chart.setOption({
      color: _this.colorList,
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
              return params.name + ' ' +  _this.$formatNum(params.value) + ' ' + params.percent + '%'
            }
      },
      legend: {
        tooltip:{
          show:true,
          formatter:(params:any) => {
            let index = dataName.findIndex((item:string)=>{
              return item === params.name
            })
            let count:number = _this.arrCount(_this.echartsData.map((item:any)=>item.value * 1))
            let item = _this.echartsData.filter((item:any,i:number)=>{
              return i === index
            })
            return params.name + '  ' +  _this.$formatNum(item[0].value) + '  ' + ((item[0].value/count) * 100).toFixed(2) + '%'
          }
        },
        bottom: _this.vertical ? 30 : 0,
        padding: _this.vertical ? [5,0] :[0, 5],
        itemWidth: 10,
        itemHeight: 10,
        left: _this.vertical ? "right" : "center",
        orient:_this.vertical ? "vertical" : "horizontal",
        textStyle: {
          fontSize: 10,
          // fontWeight:'300',
          color: "#fff"
        },
        data: dataName
      },
      series: [
        {
          type: "pie",
          radius: ["22%", "46%"],
          center:_this.vertical?["40%", "44%"] : ["50%", "44%"],
          roseType: "radius",
          startAngle: 125, //起始角度
          selectedMode: "single",
          data: (_this as any).echartsData,
          label: {
            fontSize: 10,
            formatter: (params: any) => {
              // return _this.$formatNum(params.value) + ' ' + params.percent + '%'
              return params.percent + '%'
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          },
        }
      ]
    } as EChartOption<EChartOption.SeriesPie>)
    // _this.chart.on('mouseover',function(params:any){
    //   console.log(params,"159951");
      
    // })
  }
}
</script>
