<template>
  <div class="focusedInvestmentBox">
    <div class="dialogContent">
      <div class="top">
        <div class="title">
          {{ type | type }}
        </div>
        <div
          v-if="labelList.length"
          class="labelBox"
        >
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
        <!-- 对外投资活跃企业 -->
        <div
          v-if="type==='middleBottom'"
          class="rankMiddleBox rankBox"
        >
          <div class="rankContent">
            <div>法定代表人</div>
            <div>成立时间</div>
            <div>注册资本</div>
          </div>
          <div
            v-for="(item,index) in rankList"
            :key="index"
            class="rankItem"
          >
            <div
              class="index"
            >
              {{ (((current-1)*10)+index)+1 }}
            </div>
            <div class="name ">
              {{ item.orgName }}
            </div>
            <div class="zczb rank">
              {{ item.govE3Money }}{{ item.govUnitName }}
            </div>
            <div class="clsj rank">
              {{ item.creatrTime | time }}
            </div>
            <div class="fddbr rank">
              {{ item.fddbr }}
            </div>
          </div>
        </div>
        <!-- 外来资本投资行业 -->
        <div
          v-if="type==='rightItem'"
          class="rankRightBox rankBox"
        >
          <div class="rankContent">
            <span>投资金额</span>
          </div>
          <div
            v-for="(item,index) in rankList"
            :key="index"
            class="rankItem"
          >
            <div
              class="index"
            >
              {{ (((current-1)*10)+index)+1 }}
            </div>
            <div class="name">
              {{ item.orgName }}
            </div>
            <div class="money">
              {{ item.govE5Money }}{{ item.govUnitName }}
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
import {getE3,getE5} from "@/api/focusedInvestment"
import { formData } from '@/utils/index'
export default Vue.extend({
  filters:{
    type:function(val: string){
      if(val === "middleBottom"){
        return "对外投资活跃企业"
      }else if(val === "rightItem"){
        return "外来资本投资企业"
      }
    },
    time:function(val: any){
      if(val){
        return val.split("T")[0]
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
      default:""
    }
  },
  data() {
    return {
      
      labelIndex:"",
      rankList:[],
      current:1,
      total:0
    }
  },
  created(){
    if(this.type === "middleBottom"){
      if(this.labelId!=''){
        this.labelIndex = this.labelId
      }else{
        if(this.labelList.length){
          this.labelIndex = this.labelList[0].id
        }
      }
    }
    //获取数据
    this.getEnterprise()
  },
  methods:{
    //切换选项
    changeLabel(index: any){
      this.labelIndex = index
      this.current = 1
      this.getEnterprise()
    },
    //关闭弹窗
    close(){
      this.$emit("closeDialog")
    },
    //分页
    handleCurrentChange(val: number){
      this.current = val
      this.getEnterprise()
    },
    //获取数据
    getEnterprise(){
      //对外投资活跃企业
      if(this.type === "middleBottom"){
        let _this = this as any
        let urlA1 = _this.$getModUrl('e','e3')
        getE3(formData({qydm:this.areaCode,label:this.labelIndex,pageNum:this.current,size:10}),urlA1).then((res: any)=>{
          if(res.code === "200"){
            this.rankList = JSON.parse(res.data).records
            this.total = JSON.parse(res.data).total
          }
        })
      }else if(this.type === "rightItem"){
        let _this = this as any
        let urlA1 = _this.$getModUrl('e','e5')
        getE5(formData({qydm:this.areaCode,pageNum:this.current,size:10})).then((res: any)=>{
          if(res.code === "200"){
            this.rankList = JSON.parse(res.data).records
            this.total = JSON.parse(res.data).total
          }
        })
      }
    }
  }
});
</script>


<style lang="scss" scope>

    .focusedInvestmentBox{
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
                      .num{
                        width:50px;
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
                  
                  .leftContent{
                    width:770px;
                  }     
                }
                
              }
              .rankMiddleBox{
                // margin-top:25px;
                .rankContent{
                  width:884px;
                  margin:10px 0 5px 0;
                  div{
                    float:right;
                    font-size: 12px;
                    color:#3DD3CF;
                    margin-bottom:5px;
                    width:120px;
                    text-align: center;
                  }
                }
                .rankItem{
                  .rank{
                    width:120px;
                    text-align: center;
                  }
                  .name{
                    width:460px;
                  }
                }
                
              }
              .rankRightBox{
                .rankContent{
                  width:884px;
                  height:13px;
                  margin:10px 0 5px 0;
                  span{
                    display:block;
                    width:150px;
                    float:right;
                    font-size: 12px;
                    color:#3DD3CF;
                    margin-bottom:5px;
                    margin-right:40px;
                    text-align: center;
                  }
                }
                
                .name{
                  width:600px!important;
                  margin-left:30px;
                }
                .money{
                  width:150px;
                  text-align: center;
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