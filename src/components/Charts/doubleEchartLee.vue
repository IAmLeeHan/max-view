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
  @Prop({ default: ()=>[] }) private echartsData!: any[]
  @Prop({ default: false }) private wrap!: boolean
  @Prop({ default: 40}) private rotate!: number

  @Watch('echartsData')
  private changeData(){
    this.$nextTick(()=>{
      this.initChart()
    })
  }
  mounted() {
    this.$nextTick(()=>{
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
    let unitList= ["企业数量（" + _this.unit + "）", "增长率"]
    let data: any = _this.echartsData.map((item: any)=>item.value)
    let nameList: any[]=_this.echartsData.map((item: any)=>item.name)
    let rateData: any[]=_this.echartsData.map((item: any)=>item.rate)
    _this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          formatter: function(params: any){
            let html = "<div>"
            if(params[1]){
              if(params[1].seriesName.indexOf("企业数量") !== -1){
                html += "<div>"+params[1].name+"</div>"
                html += "<div>"+params[1].marker+params[1].seriesName+" ："+params[1].data.num+"%"+"</div>"
              }else{
                html += "<div>"+params[1].name+"</div>"
                html += "<div>"+params[1].marker+params[1].seriesName+" ："+ _this.$formatNum(params[1].value) +"%"+"</div>"
              }
            }
            if(params[0]){
              html += "<div>"+params[0].marker+params[0].seriesName+" ："+ _this.$formatNum(params[0].value) +"</div>"
            }
            html += "</div>"
            return html
          },
          axisPointer: {
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          left: 'left',
          top: 8,
          itemWidth: 14,
          itemHeight: 4,
          textStyle: {
            color: '#fff'
          },
          data: unitList
        },
        grid: {
          left: '2%',
          right: '-10%',
          top: '22%',
          bottom: '0',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: nameList,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: "#2f4967",
                type: 'solid'
              }
            },
            axisLabel: {
              show:false,
              color: 'rgba(255,255,255,.8)',
              // align: 'center',
              textStyle: {
                fontSize: 10,
                fontWeight:'lighter'
              },
              interval: 2,
              rotate:0,
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
            },
          },
          {
            type: 'category',
            position:'bottom',
            data: nameList,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              show:false,
              lineStyle: {
                color: "#2f4967",
                type: 'solid'
              }
            },
            axisLabel: {
              color: 'rgba(255,255,255)',
              fontSize: 10,
              // fontWeight:'lighter',
              // align: 'center',
              // interval: nameList.length>6?2:0,
              rotate:0,
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
            },
          },
        ],
        yAxis: [
          {

            axisTick: {
              show: false
            },
            axisLabel: {
              formatter: '{value}%',
              color: '#fff',
              fontSize:10
            },
            axisLine: {
              show: false
            },
            // splitNumber: 6,
            splitLine: {
              lineStyle: {
                color: 'rgba(234,234,234,0.2)',
                type: 'dotted'
              }
            }
          },
          {
            show:false
          }
        ],
        series: [
          {
            name: '企业数量（'+_this.unit+'）',
            type: 'bar',
            barWidth: '12',
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: '#3cc1c8'
              }
            },
            label: {
              show: data.length>6?false:true,
              color: '#4ABBBF',
              fontSize:10,
              formatter: function(params: any) {
                return _this.$formatNum(params.data)
              },
              position: 'top'
            },
            data: data
          },
          {
            name: '增长率',
            type: 'line',
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
              normal: {
                width: 2,
                color: '#F37A3F'
              }
            },
            itemStyle: {
              normal: {
                color: "#F37A3F"
              }
            },
            data: rateData
          }
        ]
      } as unknown as EChartOption<EChartOption.SeriesBar> as EChartOption<EChartOption.SeriesPie>)
  }
}
</script>
