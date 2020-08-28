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
            :key="index"
            class="labelItem"
            :class="{labelSelected: labelIndex===index}"
            @click="changeLabel(index)"
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
          v-if="type==='pillarIndustry'"
          class="rankLeftBox rankBox"
        >
          <div
            v-for="(item,index) in rankList"
            :key="index"
            class="rankItem"
            :class="{top1: index===0,top2: index===1,top3: index===2}"
          >
            <div
              class="index"
              :class="{top: index+1<=3}"
            >
              {{ index+1 }}
            </div>
            <div class="content leftContent">
              {{ item.name }}
            </div>
            <div class="num leftNum">
              {{ item.num }}万人
            </div>
          </div>
        </div>
        <!-- 区域明星企业分析 -->
        <div
          v-if="type==='starIndustry'"
          class="rankMiddleBox rankBox"
        >
          <div class="rankContent">
            <div>全国排名</div>
            <div>省排名</div>
            <div>市排名</div>
          </div>
          <div
            v-for="(item,index) in rankList"
            :key="index"
            class="rankItem"
            :class="{top1: index===0,top2: index===1,top3: index===2}"
          >
            <div
              class="index"
              :class="{top: index+1<=3}"
            >
              {{ index+1 }}
            </div>
            <div class="content middleContent">
              {{ item.name }}
            </div>
            <div class="num middleNum">
              {{ item.num }}万人
            </div>
            <div class="cityRank rank">
              {{ item.cityRank }}
            </div>
            <div class="provinceRank rank">
              {{ item.provinceRank }}
            </div>
            <div class="countryRank rank">
              {{ item.countryRank }}
            </div>
          </div>
        </div>
        <!-- 区域潜力企业分析 -->
        <div
          v-if="type==='potentialIndustry'"
          class="rankRightBox rankBox"
        >
          <div class="rankContent">
            <span>增长率</span>
          </div>
          <div
            v-for="(item,index) in rankList"
            :key="index"
            class="rankItem"
            :class="{top1: index===0,top2: index===1,top3: index===2}"
          >
            <div
              class="index"
              :class="{top: index+1<=3}"
            >
              {{ index+1 }}
            </div>
            <div class="content rightContent">
              {{ item.name }}
            </div>
            <div class="num rightNum">
              {{ item.num }}万人
            </div>
            <div
              class="per up"
              :class="[item.flag?'up':'down']"
            >
              {{ item.per }}%
            </div>
            <div
              v-if="item.flag"
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
        <!-- 分页 -->
        <div class="pageBox">
          <div class="block">
            <el-pagination
              background
              :page-size="10"
              :pager-count="5"
              :current-page="current"
              layout="total, prev, pager, next"
              :total="100"
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

export default Vue.extend({
  filters:{
    type:function(val: string){
      if(val === "pillarIndustry"){
        return "区域核心企业分析"
      }else if(val === "starIndustry"){
        return "区域明星企业分析"
      }else{
        return "区域潜力企业分析"
      }
    }
  },
  props:{
    type:{
      type:String,
      default:""
    }
  },
  data() {
    return {
      labelList:[
        {
          label:"企业数量"
        },
        {
          label:"参保人数"
        },
        {
          label:"营收/产值"
        },
        {
          label:"税收"
        },
        {
          label:"出口"
        },
        {
          label:"进口"
        },
        {
          label:"吸引资本"
        },
      ],
      labelIndex:0,
      rankList:[
        {
          name:"制造业",
          num:1,
          cityRank:'1/1000',
          provinceRank:2,
          countryRank:38,
          per:10,
          flag:true
        },
        {
          name:"制造业",
          num:2
        },
        {
          name:"制造业",
          num:3
        },
        {
          name:"制造业",
          num:4
        },
        {
          name:"制造业",
          num:5
        },
        {
          name:"制造业",
          num:6
        },
        {
          name:"制造业",
          num:7
        },
        {
          name:"制造业",
          num:8
        },
        {
          name:"制造业",
          num:9
        },
        {
          name:"制造业",
          num:10
        },
      ],
      current:1
    }
  },
  methods:{
    //切换选项
    changeLabel(index: any){
      this.labelIndex = index
    },
    //关闭弹窗
    close(){
      this.$emit("closeDialog")
    },
    handleCurrentChange(val: number){
      this.current = val
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
              }
              .labelBox{
                float:left;
                margin-left:10px;
                height:20px;
                margin-top:20px;
                .labelItem{
                  display:inline-block;
                  font-size: 14px;
                  color:#fff;
                  margin-right:20px;
                  cursor: pointer;
                  height:100%;
                }
                .labelSelected{
                  color:#43F6FF;
                  border-bottom:3px solid #43F6FF;
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
                      font-size: 12px;
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
                    width:100px;
                    text-align: center;
                  }
                }
                .rankItem{
                  .rank{
                    width:100px;
                    text-align: center;
                  }
                  .content{
                    width:400px;
                  }
                  .num{
                    width:104px;
                  }
                }
                
              }
              .rankRightBox{
                .rankContent{
                  width:884px;
                  height:13px;
                  margin:10px 0 5px 0;
                  span{
                    float:right;
                    font-size: 12px;
                    color:#3DD3CF;
                    margin-bottom:5px;
                    padding:0px 20px;
                    margin-right:40px;
                  }
                }
                .up{
                  display:inline-block;
                  width:15px;
                  color:#46DB96;
                  margin-left:140px;
                }
                .down{
                  display:inline-block;
                  width:15px;
                  color:#F93B3B;
                  margin-left:140px;
                }
                .flag{
                  margin-left:10px;
                } 
                .rightContent{
                  width:520px!important;
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