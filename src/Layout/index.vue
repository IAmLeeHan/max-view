<template>
  <div 
    class="layout"
    :style="{backgroundImage: 'url(' + bg + ')'}"
  >
    <el-header class="header">
      <h1 ref="pageTitle">
        {{ title }}
      </h1>
      <div class="setting">
        <p>
          <Screenfull ref="allView"></Screenfull>
        </p>
        <p class="line"></p>
        <p>
          <el-dropdown>
            <span>
              <svg-icon name="icon_shezhi"></svg-icon>
              <span>设置</span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div class="dropdownItem">
                  <svg-icon name="icon_grzh"></svg-icon>
                  <span>{{ name }}</span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div
                  class="dropdownItem logout"
                  @click="logout"
                >
                  <svg-icon name="icon_out"></svg-icon>
                  <span>退出</span>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </p>
      </div>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
    <Drag
      class="drag"
      :position="position"
      hide
      :lazy-time="10000"
    >
      <svg-icon name="icon_fenlei"></svg-icon>
    </Drag>
    <Popups
      @popupClose="handlePopupClose"
    >
      <div
        slot="popups-header"
        class="myHeader"
      >
        <div class="title">
          <h1>企业云图</h1>
          <!-- <span @click="setting = !setting">{{ setting?'取消':'设置默认页' }}</span> -->
        </div>
        <div class="save">
          <el-button v-if="setting">
            保存
          </el-button>
        </div>
      </div>
      <div
        slot="popups-content"
        class="myContent"
      >
        <div
          v-for="(t,i) in indexList"
          :key="i"
          :class="['echartsItem',{checked: t.govIndexPath === $route.name}]"
          @click="checkView(t.govIndexPath)"
        >
          <img
            v-if="t.govInfoIsDefault === 1"
            class="defaultImg"
            src="~img/moren.png"
            alt=""
          >
          <img
            :src="t.govIndexImages"
            alt=""
          >
          <span v-if="!setting">{{ t.govIndexName }}</span>
          <el-radio
            v-else
            v-model="defaultMap"
            :label="t.govIndexName"
          >
            {{ t.govIndexName }}
          </el-radio>
        </div>
      </div>
    </Popups>
  </div>
</template>

<script lang='ts'>
import { Component,Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import { Route, RouteRecord } from "vue-router";
import ResizeMixin from "./mixin/resize";
import Screenfull from "@/components/Screenfull/index.vue";
import { UserModule } from "@/store/modules/user";
import Drag from "@/components/drag/index.vue";
import Popups from "@/components/popups/index.vue";
import { EAreaModule } from '@/store/modules/eArea';
import { AppModule } from '@/store/modules/app'
import { getGovInfoQydm } from '@/utils/session'

@Component({
  name: "Layout",
  components: {
    Screenfull,
    Drag,
    Popups
  }
})
export default class extends mixins(ResizeMixin) {
  // computed:{
  //   currentTitle(){
  //     return AppModule.setCurrentTitle
  //   }
  // },
  // watch:{
  //   currentTitle:{
  //     immediate:true,
  //     handler(newVal,oldVal){
  //       console.log(newVal,"newVal");
  //       this.$nextTick(()=>{
  //         document.getElementsByTagName('title')[0].innerHTML = newVal + '-智慧信用云平台'
  //       })
  //     }
  //   }
  // },
  get currentTitle(){
    return AppModule.currentTitle
  }
  get title() {
    console.log(this.$route.meta.title,'title');
    
    return this.$route.meta.title;
  }
  get name() {
    return UserModule.name;
  }

  get bg() {
    let flag = this.$route.meta.bg
    return flag ? require('img/' + flag + '.jpg'):''
  } 

  get indexList(){    
    return JSON.parse((UserModule as any).indexList)
  }

  @Watch('title',{immediate:true,deep:true})
  private changeTitle(n: string){
    this.$nextTick(()=>{
      (this as any).$refs.pageTitle.innerHTML = n
    })
  }

  @Watch("currentTitle",{ immediate: true,deep:true })
    private cahngeCurrentTitle(){
      let _this = this as any
      this.$nextTick(()=>{
        document.getElementsByTagName('title')[0].innerHTML = _this.currentTitle + '-智慧信用云平台'
      })
    }
  @Watch("nowTime")
  private changeNowTime(newVal: any){
    let currentTime = newVal.substr(newVal.length-8,newVal.length)
    // if(currentTime === '23:59:59'){
    //   // if(currentTime === '11:31:00'){
    //   // UserModule.Login().then(()=>{
    //     window.location.reload()
    //   // })
    // }
  }

  private defaultMap = "";

  private setting = false;

  private nowTime = null

  // private dialogTableVisible = false;

  private position = {
    left: "50px",
    bottom: "50px"
  };

  mounted(){
    this.nowTimes()
  }

  private logout() {
    UserModule.LogOut().then(()=>{
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    });
  }

  private handlePopupClose(){
    this.setting = this.setting?!this.setting:this.setting
  }

  private checkView(path: string){
    if(this.$route.name === path){
      this.handlePopupClose()
      this.$store.dispatch('SetDialogTableVisible',false)
      return
    }
    this.handlePopupClose()
    // EAreaModule.setQydm(getGovInfoQydm() as any)
    this.$store.dispatch('SetDialogTableVisible',false)
    this.$router.push({name:path})
  }

  //显示当前时间（年月日时分秒）
    private timeFormate(timeStamp: any) {
      let year = new Date(timeStamp).getFullYear();
      let month =
        new Date(timeStamp).getMonth() + 1 < 10
          ? "0" + (new Date(timeStamp).getMonth() + 1)
          : new Date(timeStamp).getMonth() + 1;
      let date =
        new Date(timeStamp).getDate() < 10
          ? "0" + new Date(timeStamp).getDate()
          : new Date(timeStamp).getDate();
      let hh =
        new Date(timeStamp).getHours() < 10
          ? "0" + new Date(timeStamp).getHours()
          : new Date(timeStamp).getHours();
      let mm =
        new Date(timeStamp).getMinutes() < 10
          ? "0" + new Date(timeStamp).getMinutes()
          : new Date(timeStamp).getMinutes();
      let ss =
        new Date(timeStamp).getSeconds() < 10
          ? "0" + new Date(timeStamp).getSeconds()
          : new Date(timeStamp).getSeconds();
      (this as any).nowTime =
        year +
        "年" +
        month +
        "月" +
        date +
        "日" +
        " " +
        hh +
        ":" +
        mm +
        ":" +
        ss;
    }
    private nowTimes() {
      this.timeFormate(new Date());
      setInterval(this.nowTimes, 1000);
      this.clear();
    }
    private clear() {
      clearInterval((this as any).nowTimes);
      (this as any).nowTimes = null;
    }

}
</script>

<style lang="scss" scoped>
 ::v-deep.el-dropdown-selfdefine{
    display: flex;
    align-items: center;
  }
::v-deep.el-dropdown-menu {
  min-width: 180px;
  background: rgb(21, 127, 167);
  border: none;
  border-radius: 2px;
  .popper__arrow {
    display: none !important;
  }
  .el-dropdown-menu__item {
    margin:10px 0;
    .dropdownItem {
      display: flex;
      align-items: center;
      .svg-icon {
        width: 18px!important;
        height: 18px!important;
        color: #fff;
        opacity: 1;
      }
      span {
        font-size: 14px;
        color: #fff;
        margin-left: 10px;
      }
    }
    &:hover {
      background: rgba(0,0,0,0);
      cursor:default;
      .logout{
        &:hover{
          cursor: pointer;
          .svg-icon,span{
            color: #00ffff;
          }
        }
      }
    }
  }
}
.layout {
  width: 100%;
  min-height: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  ::v-deep .el-header {
    height: 80px !important;
    background: url("~img/bg_top.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    // align-items: center;
    position: relative;
    h1 {
      font-size: 30px;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      letter-spacing: 6px;
      margin-top:20px;
      line-height: 30px;
      background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 1) 12.5732421875%,
        rgba(133, 254, 255, 1) 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .setting {
      position: absolute;
      right: 20px;
      bottom: 20px;
      display: flex;
      align-items: center;
      p {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 20px;
        opacity: .5;
        &.line{
          width: 1px;
          height: 22px;
          padding:0;
          background: #43f5ff;
          &:hover{
            cursor: default;
          }
        }
        &:hover {
          opacity: 1;
          cursor: pointer;
        }
        .svg-icon {
          width: 22px!important;
          height: 22px!important;
          color: #43f5ff;
        }
        span {
          margin-left: 10px;
          color: #43f5ff;
          font-size: 14px;
        }
      }
    }
  }
  ::v-deep.el-main{
    padding:10px 24px;
    height: calc(100vh - 80px);
  }
  .drag {
    width: 70px;
    height: 70px;
    opacity: .9;
    background-image: radial-gradient(circle, #192050, #1c2357,#2474b2);
    // box-shadow: 0px -1px 13px 0px rgba(0, 163, 248, 0.6);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      cursor: pointer;
      opacity: 1;
      background-image: radial-gradient(circle, #192050, #1c2357,#2474b2);
      .svg-icon {
        opacity: 1;
      }
    }
    .svg-icon {
      width: 34px !important;
      height: 34px !important;
      opacity: 0.5;
      color: #43f5ff;
    }
  }
  .myHeader {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 50px;
    .title {
      display: flex;
      align-items: flex-end;
      padding-bottom: 20px;
      h1 {
        font-size: 18px;
        color: rgba(255, 255, 255, 1);
        background: linear-gradient(
          0deg,
          rgba(145, 233, 235, 1) 0%,
          rgba(255, 255, 255, 1) 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      span {
        font-size: 14px;
        color: #fff;
        margin-left: 40px;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .save {
      height: 100%;
      display: flex;
      align-items: center;
      .el-button {
        width: 100px;
        height: 34px;
        background: linear-gradient(
          0deg,
          rgba(128, 202, 240, 1),
          rgba(226, 243, 253, 1)
        );
        border-radius: 6px;
        color: rgba(15, 105, 151, 0.7);
        &:hover {
          color: rgba(15, 105, 151, 1);
        }
      }
    }
  }
  .myContent {
    height: calc(100% - 60px);
    overflow-y: auto;
    padding: 40px 0 40px 50px;
    display: flex;
    flex-wrap: wrap;
    .echartsItem {
      width: 300px;
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;
      margin: 0 40px 55px 0;
      position: relative;
      overflow: hidden;
      &:hover {
        cursor: pointer;
        img{
          border-radius: 10px;
          border: 4px solid rgba(82,200,244,1);
        }
        span{
          color: rgba(82,200,244,1);
        }
        .defaultImg{
          border: none;
        }
      }
      &.checked{
        img{
          border-radius: 10px;
          border: 4px solid rgba(82,200,244,1);
        }
        span{
          color: rgba(82,200,244,1);
        }
        .defaultImg{
          border: none;
        }
      }
      .defaultImg{
        width: 77px;
        height: 77px;
        position: absolute;
        left: -3px;
        top: -3px;
        border:none;
        z-index: 1;
      }
      img {
        width: 300px;
        height: 168px;
        border: 1px solid rgba(82, 200, 244, 1);
        border-radius: 10px;
      }
      span {
        margin-top: 22px;
        font-size: 16px;
        color: #fff;
      }
      ::v-deep.el-radio {
        margin-top: 22px;
        font-size: 14px;
        color: #fff;
        &.is-checked {
          .el-radio__inner {
            border: 1px solid #ffd543;
            background: rgba(0, 0, 0, 0);
            &::after {
              width: 10px;
              height: 10px;
              background: #ffd543;
            }
          }
          .el-radio__label {
            color: #ffd543;
          }
        }
      }
    }
  }
}
</style>

