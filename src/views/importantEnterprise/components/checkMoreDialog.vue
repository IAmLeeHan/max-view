<template>
  <div class="importantEnterpriseBox">
    <div class="dialogContent">
      <div class="top">
        <div class="title">
          {{ type | type }}
        </div>
        <div class="labelBox">
          <div
            v-for="(item,index) in labelList" 
            v-if="(item.ruleId===1)||(item.ruleId===2&&item.hasValue)||(item.ruleId===0)"
            :key="index"
            class="labelItem"
            :class="{labelSelected: labelIndex===item.id,noData: (item.ruleId===1&&!item.hasValue)||(item.ruleId===0&&!item.hasValue)}"
            @click="changeLabel(item.id)"
          >
            {{ item.label }}
          </div>
        </div>
        <i
          class="el-icon-close"
          @click="close"
        />
      </div>
      <div class="bottom">
        <!-- 区域核心企业分析 -->
        <div
          v-if="type==='pillarEnterprise'"
          class="rankLeftBox rankBox"
        >
          <div
            v-for="(item,index) in rankList"
            :key="index"
            class="rankItem"
            :class="{top1: index===0&&current===1,top2: index===1&&current===1,top3: index===2&&current===1}"
          >
            <div
              class="index"
              :class="{top: index+1<=3&&current===1}"
            >
              {{ (((current-1)*10)+index)+1 }}
            </div>
            <div class="content leftContent">
              {{ item.x315OrgName }}
            </div>
            <div class="num leftNum">
              {{ item.counts }}{{ item.unit }}
            </div>
          </div>
        </div>
        <!-- 区域明星企业分析 -->
        <div
          v-if="type==='starEnterprise'"
          class="rankMiddleBox rankBox"
        >
          <div class="rankContent">
            <div>全国排名</div>
            <div v-show="flag!==0" class="rank">
              省排名
            </div>
            <div v-show="flag===2&&!Municipality" class="rank">
              市排名
            </div>
          </div>
          <div
            v-for="(item,index) in rankList"
            :key="index"
            class="rankItem"
            :class="{top1: index===0&&current===1,top2: index===1&&current===1,top3: index===2&&current===1}"
          >
            <div
              class="index"
              :class="{top: index+1<=3&&current===1}"
            >
              {{ (((current-1)*10)+index)+1 }}
            </div>
            <div class="content middleContent">
              {{ item.x315OrgName }}
            </div>
            <div class="num middleNum">
              {{ item.counts }}{{ item.unit }}
            </div>
            <div class="cityRank rank">
              {{ item.spm | spm(that) }}
            </div>
            <div class="provinceRank rank">
              {{ item.sfpm | rank }}
            </div>
            <div class="countryRank rank">
              {{ item.qgpm | rank }}
            </div>
          </div>
        </div>
        <!-- 区域潜力企业分析 -->
        <div
          v-if="type==='potentialEnterprise'"
          class="rankRightBox rankBox"
        >
          <div class="rankContent">
            <span>增长率</span>
          </div>
          <div
            v-for="(item,index) in rankList"
            :key="index"
            class="rankItem"
            :class="{top1: index===0&&current===1,top2: index===1&&current===1,top3: index===2&&current===1}"
          >
            <div
              class="index"
              :class="{top: index+1<=3&&current===1}"
            >
              {{ (((current-1)*10)+index)+1 }}
            </div>
            <div class="content rightContent">
              {{ item.x315OrgName }}
            </div>
            <div class="num rightNum">
              {{ item.counts }}{{ item.unit }}
            </div>
            <div class="perBox">
              <div
                class="per"
                :class="[item.rata?'up':'down']"
              >
                {{ item.rata | rata }}%
              </div>
              <div
                v-if="item.rata>0"
                class="flag up"
              >
                ↑
              </div>
              <div
                v-else
                class="flag down"
              >
                ↓
              </div>
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <div class="pageBox">
          <div class="block">
            <el-pagination
              background
              :page-size="10"
              :pager-count="5"
              :current-page="current"
              layout="total, prev, pager, next"
              :total="total"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import {getLeftDialogPage,getMiddleDialogPage,getRightDialogPage} from "@/api/importantEnterprise"
import { formData } from '@/utils/index'
export default Vue.extend({
  filters:{
    type:function(val: string){
      if(val === "pillarEnterprise"){
        return "区域核心企业分析"
      }else if(val === "starEnterprise"){
        return "区域明星企业分析"
      }else{
        return "区域潜力企业分析"
      }
    },
    rata:function(val: any){
      if(val){
        return Math.abs(parseInt(val*100 + ''))
      }else{
        return "-"
      }
    },
    //省排名 全国排名
    rank:function(val: any){
      if(val){
        if(val*1>999){
          return "999+"
        }else{
          return val
        }
      }
    },
    //市排名
    spm:function(val: any,that: any){
      if(that.flag === 2 && that.Municipality){
        return ""
      }else{
        if(val){
          if(val*1>999){
            return "999+"
          }else{
            return val
          }
        }else{
          return ""
        }
      }
    }
  },
  props:{
    type:{
      type:String,
      default:""
    },
    areaCode:{
      type:String,
      default:""
    },
    labelList:{
      type:Array,
      default:[] as any
    },
    labelId:{
      type:String,
      default:''
    }
  },
  data() {
    return {
      that:this,
      labelIndex:"",
      rankList:[],
      current:1,
      total:0,
      flag:0,//0:省，1市，2区
      Municipality:false
    }
  },
  created(){
    if(this.labelId!=''){
      this.labelIndex = this.labelId
    }else{
      if(this.labelList.length){
        this.labelIndex = this.labelList[0].id
      }
    }
    //判断当前绑定的地区层级
    this.judgeArea()
    //获取数据
    this.getPageData()
  },
  methods:{
    //切换选项
    changeLabel(index: any){
      this.current = 1
      this.labelIndex = index
      this.getPageData()
    },
    //关闭弹窗
    close(){
      this.$emit("closeDialog")
    },
    handleCurrentChange(val: number){
      this.current = val
      this.getPageData()
    },
    //获取数据
    getPageData(){
      let _this = this as any
      if(this.type === 'pillarEnterprise'){
        let urlA1 = _this.$getModUrl('d','d1')
        getLeftDialogPage(formData({qydm:this.areaCode,label:this.labelIndex,page:this.current,size:10}),urlA1).then((res: any)=>{
            if(res.code === "200"){
              this.rankList = JSON.parse(res.data).records
              this.total = JSON.parse(res.data).total
            }
        })
      }
      if(this.type === 'starEnterprise'){
        let urlA1 = _this.$getModUrl('d','d1')
        getMiddleDialogPage(formData({qydm:this.areaCode,label:this.labelIndex,page:this.current,size:10}),urlA1).then((res: any)=>{
            if(res.code === "200"){
              this.rankList = JSON.parse(res.data).records
              this.total = JSON.parse(res.data).total
            }
        })
      }
      if(this.type === 'potentialEnterprise'){
        let urlA1 = _this.$getModUrl('d','d1')
        getRightDialogPage(formData({qydm:this.areaCode,label:this.labelIndex,page:this.current,size:10}),urlA1).then((res: any)=>{
            if(res.code === "200"){
              this.rankList = JSON.parse(res.data).records
              this.total = JSON.parse(res.data).total
            }
        })
      }
    },
    //判断层级
    judgeArea(){
      if(this.areaCode.indexOf("0000")!==-1){
        this.flag = 0
      }else if(this.areaCode.indexOf("0000") ===-1 && this.areaCode.indexOf("00")!==-1){
        this.flag = 1
      }else if(this.areaCode.indexOf("0000") ===-1 && this.areaCode.indexOf("00")===-1){
        this.flag = 2
      }
      if(this.flag === 2){
        if(this.areaCode.substr(0,2)==="11" || this.areaCode.substr(0,2)==="12" || this.areaCode.substr(0,2)==="31" || this.areaCode.substr(0,2)==="50"){
          this.Municipality = true
        }
      }
    }
  },
  
});
</script>


<style lang="scss" scope>

    .importantEnterpriseBox{
        width:100%;
        height: 100%;
        position: fixed;
        top:0;
        bottom: 0;
        left:0;
        right: 0;
        margin:auto;
        background: rgba(0,0,0,.5);
        z-index: 19999;
        overflow: hidden;
        .dialogContent{
            width:944px;
            height:580px;
            background:#0F6997;
            position: fixed;
            top:0;
            bottom: 0;
            left:0;
            right: 0;
            margin:auto;
            .top{
              width:100%;
              height:60px;
              // line-height:60px;
              .title{
                font-size: 18px;
                color:#fff;
                margin-left:30px;
                float:left;
                height:20px;
                margin-top:20px;
                line-height:20px;
                background: linear-gradient(0deg, #91E9EB 0%, #FFFFFF 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
              .labelBox{
                float:left;
                margin-left:30px;
                height:20px;
                margin-top:20px;
                .labelItem{
                  display:inline-block;
                  font-size: 14px;
                  color:#fff;
                  margin-right:20px;
                  cursor: pointer;
                  height:100%;
                  &:hover{
                    color:#43F6FF;
                  }
                }
                .labelSelected{
                  color:#43F6FF;
                  border-bottom:3px solid #43F6FF;
                }
                .noData{
                  color:rgba(255, 255, 255, 0.5);
                  pointer-events: none;
                }
              }
              .el-icon-close{
                float:right;
                margin-right:24px;
                font-size: 12px;
                color:#fff;
                cursor: pointer;
                margin-top:24px;
              }
            }
            .bottom{
              width:100%;
              height:520px;
              overflow-y:auto;
              background:#1680a8;
              .rankBox{
                  .rankItem{
                      width:884px;
                      height:36px;
                      background:rgba(114,255,250,0.08);
                      display:flex;
                      color:#fff;
                      font-size: 13px;
                      line-height:36px;
                      margin:0 auto 5px;
                      .index{
                        width:30px;
                        margin-left:5px;
                        color:#40DCD6;
                        text-align: center;
                      }
                      .top{
                        color:#fff;
                        font-size: 22px;
                      }
                      .content{
                        width:300px;
                        margin-left:15px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        font-size: 14px;
                      }
                  }
                  .top1{
                    background: url("../../../assets/images/01.png")no-repeat, rgba(114,255,250,0.08);
                  }
                  .top2{
                    background: url("../../../assets/images/02.png")no-repeat, rgba(114,255,250,0.08);
                  }
                  .top3{
                    background: url("../../../assets/images/03.png")no-repeat, rgba(114,255,250,0.08);
                  }
              }
              .rankLeftBox{
                margin-top:25px;
                .rankItem{
                  .per{
                    width:25px;
                  }
                  .leftNum{
                    width:150px;
                  }
                  .leftContent{
                    width:770px;
                  }     
                }
                
              }
              .rankMiddleBox{
                // margin-top:25px;
                .rankContent{
                  width:884px;
                  margin:10px auto 5px ;
                  div{
                    float:right;
                    font-size: 12px;
                    color:#3DD3CF;
                    margin-bottom:5px;
                    width:100px;
                    text-align: center;
                  }
                  .rank{
                    width:70px;
                  }
                }
                .rankItem{
                  .rank{
                    width:100px;
                    text-align: center;
                  }
                  .cityRank{
                    width:70px;
                  }
                  .provinceRank{
                    width:70px;
                  }
                  .content{
                    width:400px;
                  }
                  .num{
                    width:194px;
                    // background:red;
                    text-align: center;
                  }
                }
                
              }
              .rankRightBox{
                .rankContent{
                  width:884px;
                  height:13px;
                  margin:10px auto 5px;
                  span{
                    float:right;
                    font-size: 12px;
                    color:#3DD3CF;
                    margin-bottom:5px;
                    display:block;
                    width:150px;
                    text-align: center;
                  }
                }
                .perBox{
                  width:150px;
                  text-align: center;
                }
                .up{
                  display:inline-block;
                  
                  color:#46DB96;
                }
                .down{
                  display:inline-block;
                  
                  color:#F93B3B;
                }
                .flag{
                  margin-left:10px;
                } 
                .rightContent{
                  width:505px!important;
                }
                .num{
                  width:180px;
                }
                
              }
              .pageBox{
                width:884px;
                margin:0 auto;
                .block{
                  margin-top:20px;
                  float:right;
                  color:#fff!important;
                   .el-pagination{
                    li{
                      color:#fff;
                      background:rgba(255,255,255,0.15);
                    }
                    .active{
                        background:#01b4c5;
                    }
                    .btn-prev{
                      background:rgba(255,255,255,0.15);
                      i{
                        color:#fff;
                      }
                    }
                    .btn-next{
                      background:rgba(255,255,255,0.15);
                      i{
                        color:#fff;
                      }
                    }
                    .el-pagination__total{
                      color:#fff;
                    }
                  }
                }
              }
            }
        }
    }

</style>