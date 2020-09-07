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
  private toData = [] as any
  private sortData = [] as any
  // 16a5eb  4fb6d2  5abead  1de9b6
  // private colorList = ['#f56321','#c1bb1f','#4fb6d2','#1DE9B6'] 
  // private colorList = ['#f34e2b','#f56f1c','#f58f0e','#d5b314']
  // private colorList = ['#00ffff','#3de2fa','#1cfdc5','#aaed8a']
  private colorList = ['#1de9b6','#16a5eb','#4fb6d2','#5abead'] 

  @Watch("echartsData",{
     immediate: true,deep:true
  })
  private changeData(){
    let flowData = [] as any
    this.echartData = []
    let data = JSON.parse(JSON.stringify(this.echartsData))
    this.sortData = data.sort((a: any,b: any)=>{
        return b.govE1Money - a.govE1Money
    })
    if(this.sortData.length){
        this.sortData.map((item: any)=>{
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
          flowData.push(val1)
        })
        this.fromData = flowData.sort((a: any,b: any)=>{
            return b.je - a.je
        })
        let val2 = {
          name:this.sortData[0].qyName,
          value:this.sortData[0].govQydmWD
        }
        this.toData = []
        this.toData.push(val2)
        this.$nextTick(() => {
          this.initChart()
        })
    }
   
  }
  private barWidth = 12

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
    let _this = this;
    _this.chart  =echarts.init(document.getElementById(_this.id) as HTMLDivElement);
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
          // position: ['10%', '50%'],
          normal:{
            show:true,
            color: 'rgba(255,255,255,0.8)',
            fontSize:10,
            offset: [500, 0],
          },
          emphasis: {
              show:false,
              textStyle: {
                  color: 'rgba(255,255,255,0.5)',
                  fontSize:10
              }
          }
        },
        roam: true, //是否允许缩放
        itemStyle: {
          normal: {
            color: '#2b4c8a', //地图背景色
            borderColor: '#688cce', //省市边界线00fcff 516a89
            borderWidth: 1,
            
          },
          emphasis: {
            color: '#2268d2', //悬浮背景
            borderWidth: 1
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
            symbol: 'arrow', //箭头图标
            symbolSize: 6, //图标大小
          },
          lineStyle: {
            normal: {
              width: .3, //尾迹线条宽度
              opacity: .2, //尾迹线条透明度
              curveness: .3, //尾迹线条曲直度
              // color:function(params: any){
              //     if(params.dataIndex<5){
              //       return _this.colorList[0]
              //     }else if(params.dataIndex>=5 && params.dataIndex <15){
              //       return _this.colorList[1]
              //     }else if(params.dataIndex>=15 && params.dataIndex <29){
              //       return _this.colorList[2]
              //     }else{
              //       return _this.colorList[3]
              //     }
              //   },
              color:"rgba(82,247,206,0.8)"
            }
          },
          data:_this.echartData
        }, 
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          showEffectOn: 'render',
          zlevel:1,
          // rippleEffect: {
          //     period: 5,
          //     scale: 2.5,
          //     brushType: 'fill'
          // },
          rippleEffect: {
            brushType: 'stroke'
          },
          hoverAnimation: true,
          label: {
              normal: {
                  position: 'right',
                  offset: [5, 0],
                  color: '#fff',
                  show: false,
                  formatter: function(params: any) { 
                    console.log(params)
                    //圆环显示文字
                    return params.data.name;
                  },
                  fontSize: 10,
              },
          },
          // itemStyle: {
          //     normal: {
          //       color:function(params: any){
          //         if(params.dataIndex<5){
          //           return _this.colorList[0]
          //         }else if(params.dataIndex>=5 && params.dataIndex <15){
          //           return _this.colorList[1]
          //         }else if(params.dataIndex>=15 && params.dataIndex <29){
          //           return _this.colorList[2]
          //         }else{
          //           return _this.colorList[3]
          //         }
          //       },
          //       shadowBlur: 10,
          //       shadowColor: '#333'
          //     }
          // },
          itemStyle: {
            normal: {
                color: {
                    type: 'radial',
                    x: 0.5,
                    y: 0.5,
                    r: 0.5,
                     colorStops: [{
                        offset: 0,
                        color: 'rgba(29,233,182,0.6)'
                    }, {
                        offset: 0.8,
                        color: 'rgba(29,233,182,1)'
                    }, {
                        offset: 1,
                        color: 'rgba(82,247,206,1)'
                    }],
                    global: false // 缺省为 false
                },
            }

        },
          symbolSize:function(value: any,params: any){
            if(params.dataIndex<5){
              return 16
            }else if(params.dataIndex>=5 && params.dataIndex <15){
              return 12
            }else if(params.dataIndex>=15 && params.dataIndex <29){
              return 8
            }else{
              return 4
            }
          },
          data:_this.fromData
        },
        //被攻击点
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          zlevel: 2,
          rippleEffect: { //涟漪特效
            period: 10, //动画时间，值越小速度越快
            brushType: 'stroke', //波纹绘制方式 stroke, fill
            scale: 3 //波纹圆环最大限制，值越大波纹越大
          },
          tooltip:{
            show:false
          },
          label: {
            normal: {
              show: true,
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
              return 10; //圆环大小
          },
          itemStyle: {
            normal: {
              show: false,
              color: 'yellow'
            }
          },
          data:_this.toData
        }
      ]
      } as any)
    })
  }
}
</script>
