import request from '@/utils/request'

//获取区域代码三级联动
export const getAreaCode = (data: any,url? : string) => 
  request({
    url:`${url?url:''}/gov/common/adminCode`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })
//获取重点企业左侧数据
export const getEnterpriseLeftData = (data: any,url? : string) => 
  request({
    url:`${url?url:''}/gov/zhong/d1`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })
//获取重点企业中间数据
export const getEnterpriseMiddleData = (data: any,url? : string) => 
  request({
    url:`${url?url:''}/gov/zhong/d2`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })
//获取重点企业右侧数据
export const getEnterpriseRightData = (data: any,url? : string) => 
  request({
    url:`${url?url:''}/gov/zhong/d3`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })
//核心企业弹窗分页
export const getLeftDialogPage = (data: any,url? : string) => 
  request({
    url:`${url?url:''}/gov/zhong/d1/details`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })
//明星企业弹窗分页
export const getMiddleDialogPage = (data: any,url? : string) => 
  request({
    url:`${url?url:''}/gov/zhong/d2/details`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })
//潜力企业弹窗分页
export const getRightDialogPage = (data: any,url? : string) => 
  request({
    url:`${url?url:''}/gov/zhong/d3/details`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })
//左侧label列表
export const getLeftLabelList = (data: any,url? : string) => 
  request({
    url:`${url?url:''}/gov/zhong/d1count`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })
//左侧label列表
export const getMiddleLabelList = (data: any,url? : string) => 
  request({
    url:`${url?url:''}/gov/zhong/d2count`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })
//左侧label列表
export const getrightLabelList = (data: any,url? : string) => 
  request({
    url:`${url?url:''}/gov/zhong/d3count`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })