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
//获取优势行业左侧数据
export const getAdvantageLeftData = (data: any,url? : string) => 
  request({
    url:`${url?url:''}/gov/advantage/c1`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })
//获取优势行业中间数据
export const getAdvantageMiddleData = (data: any,url? : string) => 
  request({
    url:`${url?url:''}/gov/advantage/c2`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })
//获取优势行业右侧数据
export const getAdvantageRightData = (data: any,url? : string) => 
  request({
    url:`${url?url:''}/gov/advantage/c3`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })
//判断模块label是否需要显示
export const showLabel = (data: any,url? : string) => 
  request({
    url:`${url?url:''}/gov/advantage/count`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })