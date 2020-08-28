import request from '@/utils/request'

//区域外来资本概况
export const getE2 = (data: any,url? : string) => 
  request({
    url:`${url?url:''}/gov/attract/e2`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })
//区域外来资本流动图
export const getE1 = (data: any,url? : string) => 
  request({
    url:`${url?url:''}/gov/attract/e1`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })
//对外投资活跃企业
export const getE3 = (data: any,url? : string) => 
  request({
    url:`${url?url:''}/gov/attract/e3`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })
//对外投资活跃企业标签
export const getE3Label = (data: any,url? : string) => 
  request({
    url:`${url?url:''}/gov/attract/e3count`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })
//外来资本投资行业
export const getE4 = (data: any,url? : string) => 
  request({
    url:`${url?url:''}/gov/attract/e4`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })
//外来资本投资企业
export const getE5 = (data: any,url? : string) => 
  request({
    url:`${url?url:''}/gov/attract/e5`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })