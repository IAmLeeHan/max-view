import request from '@/utils/request'

  // 获取b4/b4atags
  export const getB4Tags = (data:any,url?:string) => 
  request({
    url:`${url?url:''}/gov/trend/analyze/tag`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })

  // 企业总量
export const totalEnterprise = (data: any,url?: string) => 
  request({
    url:`${url?url:''}/gov/trend/analyze/b1`,
    headers:{
      'Content-Type': 'application/json'
    },
    method:'post',
    data
  })

  // 产业企业总量
  export const IndustrialEnterprises = (data: any,url?: string) =>
    request({
      url:`${url?url:''}/gov/trend/analyze/b2`,
      headers:{
        'Content-Type': 'application/json'
      },
      method:'post',
      data
    })

  // 新增企业趋势
  export const newBusinessTrends = (data: any,url?: string) =>
    request({
      url:`${url?url:''}/gov/trend/analyze/b3`,
      headers:{
        'Content-Type': 'application/json'
      },
      method:'post',
      data
    })
   // 新增重点企业数量趋势（图）
   export const trendsNewKeyEnterprises = (data: any,url?: string) =>
   request({
     url:`${url?url:''}/gov/trend/analyze/b4a`,
     headers:{
       'Content-Type': 'application/json'
     },
     method:'post',
     data
   })
   // 新增重点企业数量趋势（表）
   export const trendsNewKeyEnterprisesT = (data: any,url?: string) =>
   request({
     url:`${url?url:''}/gov/trend/analyze/b4`,
     headers:{
       'Content-Type': 'application/json'
     },
     method:'post',
     data
   })
  //  注吊销企业趋势
   export const revocationOfBusinessTrends = (data: any,url?: string) =>
   request({
     url:`${url?url:''}/gov/trend/analyze/b5`,
     headers:{
       'Content-Type': 'application/json'
     },
     method:'post',
     data
   })
  //  区域资本来源分析
  export const RegionalCapitalSources = (data: any,url?: string) =>
   request({
     url:`${url?url:''}/gov/trend/analyze/b6`,
     headers:{
       'Content-Type': 'application/json'
     },
     method:'post',
     data
   })
  // 区域从业人员规模分析
  export const scaleOfRegionalEmployees = (data: any,url?: string) =>
   request({
     url:`${url?url:''}/gov/trend/analyze/b7`,
     headers:{
       'Content-Type': 'application/json'
     },
     method:'post',
     data
   })
