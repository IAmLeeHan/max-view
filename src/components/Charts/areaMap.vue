<template>
  <div class="MapBox">
    <div class="legendBox">
      <div class="fl r_box_ul">
        <div
          v-for="(item,index) in legendList"
          :key="index"
          class="areaItem"
        >
          <span
            class="sp_cirle"
            :style="{backgroundColor: colorList2[index%20]}"
          ></span>
          <span :style="{color: colorList2[index%20]}">{{ item.qyName }}</span>
        </div>
      </div>
    </div>
    <div
      :id="id"
      :class="className"
      :style="{height: height, width: width}"
    />
  </div>
</template>

<script lang="ts">
import echarts, { EChartOption } from 'echarts'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from './mixins/resize'
import {MapModule} from '@/store/modules/map'
import $ from 'jquery';
import { formData } from '@/utils/index'


@Component({
  name: 'BarChart'
})
export default class extends mixins(ResizeMixin) {
  @Prop({ default: 'chart' }) private className!: string
  @Prop({ default: 'chart' }) private id!: string
  @Prop({ default: '200px' }) private width!: string
  @Prop({ default: '200px' }) private height!: string
  @Prop({ default: ()=>[] }) private echartData: any
  @Prop({ default: {name:"青岛市",code:"",selected:""} }) private areaInfo!: string

  
  @Watch("areaInfo",{ immediate: true,deep:true })
  private changeAreaInfo(){
    // this.$nextTick(() => {

    //   this.chart = echarts.init(document.getElementById(this.id) as any);
    //   this.initChart(this.chart)
    // })
  }
  @Watch("echartData",{
    immediate: true,deep:true
  })
  private changeData(){
    this.legendList = []
    this.sortList = []
    let data = JSON.parse(JSON.stringify(this.echartData))
    this.sortList = data.sort((a: any,b: any)=>{
          return (b.value*1) - (a.value*1)
    })
    this.$nextTick(() => {
      this.chart = echarts.init(document.getElementById(this.id) as any);
      this.initChart(this.chart)
    })
  }
  private legendList = [] as any
  private sortList = [] as any
  private colorList2 = ["#D31F9A","#00A2FF","#DEF427","#10D5C0","#ED694F","#F8A10B","#40CFE9","#5A45DA","#CB7BFD","#86ED32",'#c76972',"#c9a544","#329dcf","#ffb676","#a432f4","#f4cd32","#656ff0","#3a98f9","#57eb8b"]
  mounted() {
    this.chart = echarts.init(document.getElementById(this.id) as any);
  }

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  }
  //删除重复元素
  private fun(){
    let arr = JSON.parse(JSON.stringify(this.sortList))
    for (let i = 0; i < arr.length; i++) {
        for(let j = i+1; j < arr.length; j++){
            if(arr[i].value==arr[j].value){
                arr.splice(j,1);
　　　　　　　　　　j--;
            }
        }
    }
    return arr;
}
  private mapGet(data: any,total: number){
    let _this = this
    _this.legendList = []
     echarts.registerMap((_this as any).areaInfo.parentName, data);
        let d: any = {};
        for(let i in data.features){
            d[data.features[i].properties.adcode] = data.features[i].properties.center
        }
        
        _this.sortList.map((_item: any)=>{
              for(let key in d){
                if(key === _item.key){
                  _this.legendList.push(_item)
                }
            }
          })
        let series = [];
        for(let i = 0;i<_this.legendList.length;i++){
            let bb = {};
            let name = _this.legendList[i].qyName;
            let code = _this.legendList[i].key
            let unitName = _this.legendList[i].unitName
            let value = Number(_this.legendList[i].value);
            let scale = 4 - i*0.2
            let effectData = [] as any
            let val = {
              unitName:unitName,
              name:name,
              value:[] as any,
            }
            if(d[code]&&value){
              val.value = d[code].concat(value)
              effectData.push(val)
            }
            bb = {
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: {
                    period: 10,
                    scale: 3 ,
                    brushType: 'stroke'
                },
                label: {
                    show: false,
                    position: 'right',
                    formatter: '{b}',
                },
                
                symbolSize:function(params: any){
                  let data = _this.fun()
                  let size = parseInt((32/data.length)+"")*1
                  for(let i = data.length - 1;i>=0;i--){
                    if(data[i].value*1 === params[2]){
                      return (data.length-i) * size
                    }
                  }
                  // return 12
                },
                itemStyle: {
                    color: _this.colorList2[i%20]
                },
                // data: [{
                //     name: name,
                //     value: d[code].concat(value)
                // }]
                data:effectData
            };
            series.push(bb);
        }
        let option = {
            tooltip:{
              trigger:"item",
              formatter:function(params: any){
                let res = "";
                res = "<span style='color:#fff;'>" + params.data.name + "</span><br/>" + params.data.value[2]+params.data.unitName;
                return res
              }
            },
            geo: {
                // map: '青岛市',
                map:(_this as any).areaInfo.parentName,
                zoom:1.1,
                label: {
                    show: false,
                    emphasis: {
                        show: false
                    }
                },
                roam: false,
                itemStyle: {
                    normal: {
                        color: 'rgba(51, 69, 89, .3)', //地图背景色
                        borderColor: '#396ac4', //省市边界线00fcff 516a89
                        borderWidth: 1
                    },
                    emphasis: {
                        color: 'rgba(37, 43, 61, .5)' //悬浮背景
                    }
                },
                left:'center',
                top:"center"
            },
            series: series
        };
        (_this as any).chart.setOption(option as EChartOption<EChartOption.SeriesBar>);
  }
  private initChart(myChart: any) {
    let _this = this
    myChart.clear();
    let total = 0
    _this.sortList.map((item: any)=>{
      total += Number(item.value*1)
    })
    if(this.sortList.length){
      MapModule.SetCurrentMap(formData({adminCode:(this as any).areaInfo.parentNode})).then(res=>{
        _this.mapGet(MapModule.currentMap,total)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .MapBox{
    height:90%;
    width:100%;
    display:flex;
    align-items: center;
    .legendBox{
      width:50%;
      height:80%;
      .r_box_ul{
          width:100%;
          margin-left:40px;
          height:100%;
          display:flex;
          // flex-direction: column;
          flex-wrap: wrap;
          align-items: center;
          .areaItem{
              width:100px;
              font-size: 12px;
              line-height: 24px;
              // margin-right:20px;
              .sp_cirle{
                  width:6px;
                  height:6px;
                  background:rgba(37,112,226,1);
                  border-radius:50%;
                  display: inline-block;
                  vertical-align: middle;
                  margin-right:6px;
              }
          }
      }
    }
  }
</style>
