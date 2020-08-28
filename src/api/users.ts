import request from '@/utils/request'
import { getRefresh } from '@/utils/cookies'

// 登录
export const login = (data?: any) =>
  request({
    url: '/gov/login',
    method: 'post',
    headers:{
      'refreshToken':getRefresh() || ''
    },
    data
  })

  // 登出
export const logout = () =>
  request({
    url: '/gov/logout',
    headers:{
      'refreshToken':getRefresh() || ''
    },
    method: 'post'
  })

  // 地图Json
export const geoJson = (data: string) =>
request({
  url:'/gov/common/datav',
  method:'post',
  data
})
// 错误日志
export const errorLog = (data: any) =>
  request({
    url:'/gov/common/errorLog',
    method:'post',
    data
  })
