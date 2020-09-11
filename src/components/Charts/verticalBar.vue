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
  @Prop({ default: ''}) private echartsName!: string
  @Prop({ default: true }) private showPercentage!: boolean
  @Prop({ default:'' }) private unit!: string
  @Prop({ default: ()=>[] }) private echartsData!: any[]
  @Prop({ default: false }) private wrap!: boolean
  @Prop({ default: true }) private showUnit!: boolean
  @Prop({ default: 40}) private rotate!: number
  @Prop({ default: '#0AA2E4'}) private barColorTop!: string
  @Prop({ default: '#0290FF'}) private barColorBottom!: string
  @Prop({ default:false }) private interval!: boolean
  @Prop({ default:true }) private showY!: boolean
  @Prop({ default:'' }) private year!: number | string

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
    _this.chart  =echarts.init(document.getElementById(_this.id) as HTMLDivElement);
    _this.chart.clear();
    
    let nameList = [];
    let data: any = [];
    let data2: any[] = [];
    let all = 1;
    for(let i in _this.echartsData){
      nameList.push(_this.echartsData[i].name)
      data2.push(_this.echartsData[i].value);
      all += Number(_this.echartsData[i].value);
    }
    for(let i in data2){
        data.push(((data2[i]/all*10000)/100.00).toFixed(2))
    }
    _this.chart.setOption({
      title:{
        show:_this.showUnit,
        subtext:'单位 : ' + _this.unit,
        subtextStyle:{
          color:'#fff'
        },
        left: 'right'
      },
      tooltip : {
        trigger: 'axis',
        formatter: (params: any)=>{
          if(_this.showPercentage){
            return `${_this.year?_this.year + '年' + params[0].name + '月' : params[0].name}` +'：'+ _this.$formatNum(data2[params[0].dataIndex]) +_this.unit + " " + data[params[0].dataIndex] + '%'
          }else{
            return params[0].name +'：'+ _this.$formatNum(data2[params[0].dataIndex]) +_this.unit
          }
        },
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        textStyle:{
          fontSize:12
        }
      },
      grid: {
        left: _this.showY?'0':-15,
        right: '4%',
        top:'24%',
        bottom: '0%',
        containLabel: true
      },
      xAxis : [
        {
          type : 'category',
          data : nameList,
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
              color: '#2f4967',
              type:'solid'
            }
          },
          axisLabel: {
            color: 'rgba(255,255,255)',
            fontSize: 10,
            // fontWeight: "lighter",
            // align: 'center',
            // interval:nameList.length>6||_this.interval?2:0,
            rotate:0,
            formatter:function(value: any){  
              let ret = "";//拼接加\n返回的类目项  
              let maxLength = 4;//每项显示文字个数  
              let valLength = value.length;//X轴类目项的文字个数  
              let rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
              if(_this.wrap){
                if (rowN > 1)//如果类目项的文字大于3,  
                {  
                  for (let i = 0; i < rowN; i++) {  
                      let temp = "";//每次截取的字符串  
                      let start = i * maxLength;//开始截取的位置  
                      let end = start + maxLength;//结束截取的位置  
                      if(value.length>8){
                        value = value.substring(0,7)+'…'
                      }
                      //这里也可以加一个是否是最后一行的判断
                      if(i + 1 === rowN){
                        temp = value.substring(start, end);  
                      }else if(i === 0){
                        if(_this.rotate>0){
                          temp = value.substring(start, end) + "\n";  
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
          }
        }
      ],
      yAxis : [
        {
          show:_this.showY,
          name: _this.echartsName || '',
          nameTextStyle:{
            color:'#fff',
            padding:[0,0,0,20],
            fontSize:12
          },
          nameGap:10,
          // nameLocation:'start',
          axisTick: {
            show: false
          },
          // max:function(value) {
          //   let sum = value.max > 2000 ? value.max : value.max / 10
          //   return _this.showPercentage?100:value.max + sum;
          // },
          axisLabel: {
            formatter: function(params: number | string){
              if(_this.showPercentage){
                return params+'%'
              }else{
                return params
              }
            },
            // formatter:'{value}%',
            color: '#fff',
            fontWeight: "lighter",
            fontSize: 10
          },
          axisLine: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(234,234,234,0.2)',
              type:'dotted'
            }
          }
        }
      ],
      series : [
          {
            name:'',
            type:'bar',
            barWidth: '12',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                    0, 1, 0, 0,
                    [
                        {offset: 0, color: _this.barColorTop},
                        {offset: 1, color: _this.barColorBottom}
                    ]
                ),
                barBorderRadius: [6,6,0,0]
              }
            },
            label: {
              show: nameList.length>6?false:true,
              fontSize:10,
              color:'#4ABBBF',
              formatter: function(params: any){
                  return _this.$formatNum(data2[params.dataIndex])
              },
              position: 'top'
            },
            data:_this.showPercentage?data:_this.echartsData
          }
      ]
    } as EChartOption<EChartOption.SeriesBar>)
  }
}
</script>
