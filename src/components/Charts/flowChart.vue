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
import $ from 'jquery';

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
  @Prop({ default: ()=>[] }) private echartsData!: any[]
  private echartData = [] as any
  private fromData = [] as any
  // private fromData2 = [] as any
  private toData = [] as any

  private colorList = ['#CB7CFE','#DEF428','#10D6C0']

  @Watch("echartsData",{
     immediate: true,deep:false
  })
  private changeData(){
    if(this.echartsData.length){
      this.echartData = []
      this.fromData = []
          this.echartsData.map((item: any)=>{
          let val = {
            fromName:item.govE1Name,
            toName:item.qyName,
            coords:[] as any,
          }
          val.coords.push(item.govE1QydmWD)
          val.coords.push(item.govQydmWD)
          this.echartData.push(val)
          let val1 = {
            name:item.govE1Name,
            value:item.govE1QydmWD,
            je:item.govE1Money,
            unit:item.govUnitName
          }
          this.fromData.push(val1)
        })
        let val2 = {
          name:this.echartsData[0].qyName,
          value:this.echartsData[0].govQydmWD
        }
        this.toData = []
        this.toData.push(val2)
        this.$nextTick(() => {
          this.initChart()
        })
    }
   
  }
  private barWidth = 12

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
    let _this = this;
    _this.chart  =echarts.init(document.getElementById(_this.id) as HTMLDivElement, null as any);
    _this.chart.clear();
    $.getJSON('/map/china.json',function(data){
      echarts.registerMap('china', data);
      (_this as any).chart.setOption({
      tooltip: {
        trigger: 'item',
        borderColor: '#FFFFCC',
        showDelay: 0,
        hideDelay: 0,
        enterable: true,
        transitionDuration: 0,
        extraCssText: 'z-index:100',
        formatter: function(params: any, ticket: any, callback: any) {
          //根据业务自己拓展要显示的内容
          let res = "";
          res = "<span style='color:#fff;'>" + params.name + "</span><br/>金额：" + params.data.je+params.data.unit;
          return res;
        }
      },
      // visualMap: { //图例值控制
      //   inRange:{
      //     color:['#CB7BFD','#DEF427','#10D5C0']
      //   }
      // },

      geo: {
        map: 'china',
        zoom: 1.2,

        label: {
          emphasis: {
              show: false
          }
        },
        roam: true, //是否允许缩放
        itemStyle: {
          normal: {
            color: 'rgba(10, 37, 105, 0.5)', //地图背景色
            borderColor: '#4bf5ff', //省市边界线00fcff 516a89
            borderWidth: .1,
            
          },
          emphasis: {
            color: 'rgba(37, 43, 61, .1)', //悬浮背景
            borderWidth: .1
          }
        }
      },
      series:[
        {
          type: 'lines',
          zlevel: 2,
          tooltip:{
            show :false
          },
          effect: {
            show: true,
            period: 4, //箭头指向速度，值越小速度越快
            trailLength: 0.05, //特效尾迹长度[0,1]值越大，尾迹越长重
            // color: (params:any)=>{
            //   console.log(params,"params");
              
            //   return _this.colorList[params.dataIndex]
            // },
            symbol: 'arrow', //箭头图标
            symbolSize: 6, //图标大小
          },
          lineStyle: {
            normal: {
              width: 1, //尾迹线条宽度
              opacity: 1, //尾迹线条透明度
              curveness: .3, //尾迹线条曲直度
              color: (params: any)=>{
                return _this.colorList[params.dataIndex]
              }
            }
          },
          data:_this.echartData
        }, 
        {
          type: 'effectScatter',
                coordinateSystem: 'geo',
                showEffectOn: 'render',
                zlevel:1,
                rippleEffect: {
                    period: 15,
                    scale: 1,
                    brushType: 'fill'
                },
                hoverAnimation: true,
                label: {
                    normal: {
                        show: true,
                        formatter: '{b}',
                        position: 'right',
                        offset: [5, 0],
                        // color: function(params: any){
                        //   console.log(params,"params");
                          
                        // },
                    },
                },
                itemStyle: {
                    normal: {
                       color:function(params: any){
                          return _this.colorList[params.dataIndex]
                        },
                      shadowBlur: 10,
                      shadowColor: '#333'
                    }
                },
                symbolSize: 6,
          data:_this.fromData
        },
        //被攻击点
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          zlevel: 0,
          rippleEffect: { //涟漪特效
            period: 10, //动画时间，值越小速度越快
            brushType: 'stroke', //波纹绘制方式 stroke, fill
            scale: 3 //波纹圆环最大限制，值越大波纹越大
          },
          label: {
            normal: {
              show: false,
              position: 'right', //显示位置
              offset: [5, 0], //偏移设置
              formatter: function(params: any) { //圆环显示文字
                  return params.data.name;
              },
              fontSize: 16,
              color:"#ffffff"
            },
            emphasis: {
              show: true
            }
          },
          symbol: 'circle',
          symbolSize: function(val: any) {
              return 8; //圆环大小
          },
          itemStyle: {
            normal: {
              show: false,
              fontSize:10,
              color: function(params: any){
                return _this.colorList[params.dataIndex]
              }
            }
          },
          data:_this.fromData
        },
        //被攻击点
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          zlevel: 0,
          rippleEffect: { //涟漪特效
            period: 10, //动画时间，值越小速度越快
            brushType: 'stroke', //波纹绘制方式 stroke, fill
            scale: 3 //波纹圆环最大限制，值越大波纹越大
          },
          label: {
            normal: {
              show: false,
              position: 'right', //显示位置
              offset: [5, 0], //偏移设置
              formatter: function(params: any) { //圆环显示文字
                  return params.data.name;
              },
              fontSize: 16,
              color:"#ffffff"
            },
            emphasis: {
              show: true
            }
          },
          symbol: 'circle',
          symbolSize: function(val: any) {
              return 8; //圆环大小
          },
          itemStyle: {
            normal: {
              show: false,
              color: '#f00'
            }
          },
          data:_this.toData
        }
      ]
      } as any,true)
    })
  }
}
</script>
