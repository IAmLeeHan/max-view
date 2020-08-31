import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { getGovInfoQydm } from '@/utils/session'
import store from '@/store'

import { enterpriseDistribution } from '@/api/area'

export interface IeAreaState {
  currentQydm: string
  // 机构总数
  agencyTotal: number
  // 企业数量 
  orgCount: number
  // 个体工商户数量
  unitCount: number
  // 其他数量
  otherCount: number
  // 区域列表
  areaList: any[],
  // 加载完成
  loading:boolean
}

@Module({ dynamic: true, store, name: 'EArea' })
class EArea extends VuexModule implements IeAreaState {
  public currentQydm = getGovInfoQydm()?(getGovInfoQydm() as any).substr(0,4) + '00' : '0'
  public agencyTotal = 0
  public orgCount = 0
  public unitCount = 0
  public otherCount = 0
  public areaList = []
  public loading = false
  // 设置当前区域代码
  @Mutation
  private SET_QYDM(qydm: string){
    this.currentQydm = qydm
  }
  // 设置机构数量
  @Mutation
  private SET_AGENCY_COUNT(agencyTotal: number){
    this.agencyTotal = agencyTotal
  }
  // 设置企业数量
  @Mutation
  private SET_ORG_COUNT(orgCount: number){
    this.orgCount = orgCount
  }
  // 设置个体工商数量
  @Mutation
  private SET_UNIT_COUNT(unitCount: number){
    this.unitCount = unitCount
  }
  // 设置其他数量
  @Mutation
  private SET_OTHER_COUNT(otherCount: number){
    this.otherCount = otherCount
  }
  @Mutation
  private SET_AREA_LIST(areaList: []){
    if(areaList){
      this.areaList = areaList
    }
  }
  @Mutation
  private SET_LOADING(data:boolean){
    this.loading = data
  }

  @Action
  public setQydm(qydm: string) {
    this.SET_QYDM(qydm)
  }

  @Action
  public getEnterpriseDistribution(data: number | string) {
    return new Promise(resolve=>{
      this.SET_LOADING(false)
      enterpriseDistribution(data).then(res=>{
        this.SET_LOADING(true)
        if((res as any).code === '200'){
          let { data } = res as any
          this.SET_AGENCY_COUNT(data.agencyTotal)
          this.SET_ORG_COUNT(data.orgCount)
          this.SET_UNIT_COUNT(data.unitCount)
          this.SET_OTHER_COUNT(data.otherCount)
          this.SET_AREA_LIST(data.areaList)
          resolve(res)
        }
      })
    })
  }
}

export const EAreaModule = getModule(EArea)
