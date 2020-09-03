<template>
  <div class="login">
    <!-- 
      color: String类型。默认'#dedede'。粒子颜色。
      particleOpacity: Number类型。默认0.7。粒子透明度。
      particlesNumber: Number类型。默认80。粒子数量。
      shapeType: String类型。默认'circle'。可用的粒子外观类型有："circle","edge","triangle", "polygon","star"。
      particleSize: Number类型。默认80。单个粒子大小。
      linesColor: String类型。默认'#dedede'。线条颜色。
      linesWidth: Number类型。默认1。线条宽度。
      lineLinked: 布尔类型。默认true。连接线是否可用。
      lineOpacity: Number类型。默认0.4。线条透明度。
      linesDistance: Number类型。默认150。线条距离。
      moveSpeed: Number类型。默认3。粒子运动速度。
      hoverEffect: 布尔类型。默认true。是否有hover特效。
      hoverMode: String类型。默认true。可用的hover模式有: "grab", "repulse", "bubble"。
      clickEffect: 布尔类型。默认true。是否有click特效。
      clickMode: String类型。默认true。可用的click模式有: "push", "remove", "repulse", "bubble"。
    -->
    <vue-particles
      class="particles"
      color="#dedede"
      :particle-opacity="0.5"
      :particles-number="80"
      shape-type="circle"
      :particle-size="4"
      lines-color="#dedede"
      :lines-width="1"
      :line-linked="true"
      :line-opacity="0.4"
      :lines-distance="150"
      :move-speed="3"
      :hover-effect="true"
      hover-mode="grab"
      :click-effect="true"
      click-mode="push"
    ></vue-particles>
    <div class="inputForm">
      <div class="name">
        智慧信用大数据平台
      </div>
      <div class="inputBox">
        <!-- <div class="head">
          <span>账号登录</span>
        </div>-->
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          autocomplete="on"
          label-position="left"
          class="demo-dynamic"
        >
          <el-form-item>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="用户名称"
              prefix-icon="el-icon-user"
              type="text"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              ref="password"
              v-model="loginForm.password"
              placeholder="输入登录密码"
              prefix-icon="el-icon-unlock"
              type="password"
              @keyup.native.enter="handleLogin"
            ></el-input>
          </el-form-item>
          <div
            class="KeepLoggedIn"
            @click="ChangeLoginState"
          >
            <div class="checkBox">
              <svg-icon
                v-show="checked === '1'"
                name="icon_select"
              ></svg-icon>
            </div>
            <p>一周内保持登录</p>
          </div>
          <el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              @click.stop="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import { Component, Vue, Watch } from "vue-property-decorator";
import Vue from "vue";
import { Route } from "vue-router";
import { Dictionary } from "vue-router/types/router";
import { Form as ElForm, Input, Message } from "element-ui";
import { isValidUsername } from "@/utils/validate";
import { UserModule } from "@/store/modules/user";
import getDefault from '@/utils/defaultPage'
import { EAreaModule } from '@/store/modules/eArea';
import { getGovInfoQydm } from '@/utils/session'
export default Vue.extend({
  data() {
    return {
      loading: false,
      redirect: "",
      otherQuery: {},
      config: {
        // 配置
        color: "255, 255, 255", // 线条颜色
        pointColor: "255, 255, 255", // 节点颜色
        opacity: 0.6, // 线条透明度
        count: 200, // 线条数量
        zIndex: -1 // 画面层级
      },
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { validator: (this as any).validateUsername, trigger: "blur" }
        ],
        password: [
          { validator: (this as any).validatePassword, trigger: "blur" }
        ]
      }
    };
  },
  computed:{
    checked(){
      return UserModule.KeepLoggedIn
    }
  },

  // Watch("$route", { immediate: true })

  mounted() {
    this.$nextTick(() => {
      if (this.loginForm.username === "") {
        (this.$refs.username as Input).focus();
      } else if (this.loginForm.password === "") {
        (this.$refs.password as Input).focus();
      }
    });
  },
  methods: {

    ChangeLoginState(){
      if(this.checked === '0'){
        this.$store.commit('SET_KEEP_LOGGED_IN','1')
      }else{
        this.$store.commit('SET_KEEP_LOGGED_IN','0')
      }
    },

    validateUsername: (rule: any, value: string, callback: Function) => {
      if (!isValidUsername(value)) {
        callback(new Error("请输入账号"));
      } else {
        callback();
      }
    },
    validatePassword: (rule: any, value: string, callback: Function) => {
      if (value.length < 6) {
        callback(new Error("密码不能小于六位"));
      } else {
        callback();
      }
    },
    onRouteChange(route: Route) {
      // TODO: remove the "as Dictionary<string>" hack after v4 release for vue-router
      // See https://github.com/vuejs/vue-router/pull/2050 for details
      const query = route.query as Dictionary<string>;
      if (query) {
        (this as any).redirect = query.redirect;
        (this as any).otherQuery = (this as any).getOtherQuery(query);
      }
    },
    handleLogin() {
      let _this = this as any;
      if(_this.loginForm.username.length<=0){
        _this.$message.closeAll();
        _this.$message({
          type:'error',
          message:'请输入用户名。'
        })
        return
      }
      if(_this.loginForm.password.length<=0){
        _this.$message.closeAll();
        _this.$message({
          type:'error',
          message:'请输入密码。'
        })
        return
      }
      ((this as any).$refs.loginForm as ElForm).validate(
        async(valid: boolean) => {
          if (valid) {
            (this as any).loading = true;
            UserModule.Login((this as any).loginForm).then((res:any)=>{
              EAreaModule.setQydm(getGovInfoQydm()as any)
              setTimeout(() => {
                (this as any).loading = false;
              }, 0.5 * 1000);
              if(res.code&&res.code === '200'){
                (this as any).$router
                  .push({
                    path: (this as any).redirect || getDefault(),
                    query: (this as any).otherQuery
                  })
                  .catch((err: String) => {
                    console.log("All Good");
                  });
                // Just to simulate the time of the request
              }
            })
          } else {
            return false;
          }
        }
      );
    },
    getOtherQuery(query: Dictionary<string>) {
      return Object.keys(query).reduce(
        (acc, cur) => {
          if (cur !== "redirect") {
            acc[cur] = query[cur];
          }
          return acc;
        },
        {} as Dictionary<string>
      );
    }
  }
});
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  .particles {
    position: absolute;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background: url("~img/dl_bg.jpg") no-repeat;
    background-size: 100% 100%;
  }
  .inputForm {
    display: flex;
    flex-flow: column;
    align-items: center;
    color: #fff;
    position: relative;
    .name {
      font-size: 60px;
      font-weight: 400;
      font-family: YSBT;
      color: rgba(255, 255, 255, 1);

      background: linear-gradient(
        0deg,
        rgba(21, 156, 219, 1) 0%,
        rgba(77, 236, 238, 1) 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .inputBox {
      background: url("~img/kuang.png") no-repeat;
      background-size: 100% 100%;
      margin-top: 50px;
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;
      width: 530px;
      height: 366px;
      /* .head {
        width: 100%;
        height: 105px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 26px;
        background: #2389e0;
      } */
      ::v-deep .el-form {
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        .el-form-item {
          &:nth-of-type(1) {
            /* margin-top: 46px; */
            margin-bottom: 0;
          }
          &:nth-of-type(2) {
            margin-top: 30px;
            margin-bottom: 0;
          }
          &:nth-of-type(3) {
            margin-top: 40px;
            margin-bottom: 0;
          }
          .el-form-item__content {
            margin: 0 !important;
            .el-input {
              font-size: 12px;
              .el-input__inner {
                width: 370px;
                height: 48px;
                border: 1px solid #2ea2f3;
                background: rgba(0, 0, 0, 0);
                border-radius: 2px;
                color: #fff;
              }
              .el-input__icon {
                font-size: 16px;
                color: #2ea2f3;
                line-height: 48px;
              }
            }
            .el-button {
              width: 370px;
              height: 48px;
              background: rgba(35, 137, 224, 1);
              border-radius: 2px;
              padding: 0;
              color: 14px;
              font-size: 16px;
              border: 0;
            }
          }
        }
        .KeepLoggedIn{
          width: 100%;
          display: flex;
          margin:30px 0 13px 0;
          &:hover{
            cursor: pointer;
          }
          .checkBox{
            width:14px;
            height:14px;
            background:rgba(46,162,243,0.2);
            border:1px solid rgba(46,162,243,1);
            border-radius:2px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
            .svg-icon{
              width: 10px!important;
              height: 8px!important;
              color: #2EA2F3;
            }
          }
          p{
            font-size:14px;
            color:rgba(255,255,255,1);
            opacity:0.6;
          }
        }
      }
    }
  }
}
</style>

