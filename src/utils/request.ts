import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { getToken,getRefresh } from '@/utils/cookies'
import router from '@/router'
import { errorLog } from '@/api/users'

const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 1000 * 30,
  withCredentials: false // send cookies when cross-domain requests
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    if (getToken()) {
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response) => {
    // Some example codes here:
    // statusCodeValue == 200: success
    // You can change this part for your own usage.
    const res = response.data
    if (res.code !== '200') {
      if(res.code === '400'){
        let msg;
        if(getRefresh()){
          msg = '自动登录失效'
        }else{
          msg = '用户名或者密码错误'
        }
        MessageBox.alert(
          msg,
          {
            confirmButtonText: '重新登录',
            // cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
        UserModule.ResetToken()
        location.reload() // To prevent bugs from vue-router
        })
      }
      if (res.code === '997') {
        MessageBox.alert(
          '没有找到首页信息，请联系客服！',
          {
            confirmButtonText: '确定',
            // cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
        UserModule.ResetToken()
        location.reload() // To prevent bugs from vue-router
        })
      }

      if (res.code === '777') {
        MessageBox.alert(
          '密码错误！',
          {
            confirmButtonText: '确定',
            // cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
        UserModule.ResetToken()
        location.reload() // To prevent bugs from vue-router
        })
      }

      if(res.code === '999'){
        if(getRefresh()){
          UserModule.Login()
        }
      }

      // Message({
      //   message: res.statusCode || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      return Promise.reject(new Error(res.code || 'Error'))
    } else {
      return response.data
    }
  },
  (error) => {
    if(error.config.url === "/gov/common/errorLog"){
      if(error.message === "Request failed with status code 500"){
        MessageBox.alert(
          '服务器错误,请联系客服',
          {
            confirmButtonText: '确定',
            // cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          UserModule.ResetToken()
          location.reload() // To prevent bugs from vue-router
        })
      }
    }else{
      let data = {
        title:'错误信息',
        msg:error,
        extraInfo:'错误时间：' + new Date()
      }
        errorLog(data)
      }
    }
)

export default service
