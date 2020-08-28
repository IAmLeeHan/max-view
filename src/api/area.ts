import request from '@/utils/request'

export const areaTags = (data?: any) =>
  request({
    url: '/gov/login',
    method: 'post',
    data
  })


  // 企业分布
export const enterpriseDistribution = (data: any,url? : string) => 
  request({
    url:`${url?url:''}/gov/area/overview/a1`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })

    // 产业/行业分布 
  export const enterpriseIndustry = (data: any,url? : string) => 
  request({
    url:`${url?url:''}/gov/area/overview/a2`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })
  // 经营状况资本
  export const operatingConditions = (data: any, url? : string) => 
  request({
    url:`${url?url:''}/gov/area/overview/a3`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })
  // 注册资本
  export const registeredCapital = (data: any,url? : string) => 
  request({
    url:`${url?url:''}/gov/area/overview/a4`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })

  // 重点企业分布
  export const keyEnterprise = (data: any,url? : string) =>
  request({
    url:`${url?url:''}/gov/area/overview/a5`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })

  // 企业性质/类型分布
  export const businessNatureType = (data: any,url? : string) =>
  request({
    url:`${url?url:''}/gov/area/overview/a6`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })

  // 企业规模分布
  export const enterpriseSize = (data: any,url? : string) =>
  request({
    url:`${url?url:''}/gov/area/overview/a7`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })

  // 成立时间分布
  export const established = (data: any,url? : string) =>
  request({
    url:`${url?url:''}/gov/area/overview/a8`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })
