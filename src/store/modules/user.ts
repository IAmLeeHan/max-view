import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, logout } from '@/api/users'
import { getRefresh, setRefresh, removeRefresh,setToken,removeToken } from '@/utils/cookies'
import {
  getGovName,
  setGovName,
  getGovInfoTop,
  setGovInfoTop,
  getGovInfoName,
  setGovInfoName,
  getGovInfoQydm,
  setGovInfoQydm,
  getIndexList,
  setIndexList,
  getKeepLoggedInKey,
  setKeepLoggedInKey
} from '@/utils/session'
import router, { resetRouter } from '@/router'
import store from '@/store'
import { formData } from '@/utils/index'
import { Message, Checkbox } from 'element-ui'
import getDefault from '@/utils/defaultPage'

export interface IUserState {
  token: string
  name: string
  govInfoName: string
  govInfoQydm: string
  govInfoTop: string
  indexList: any
  KeepLoggedIn: string
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public KeepLoggedIn = getKeepLoggedInKey() || '0'
  public token = getRefresh() || ''
  public name = getGovName() || ''
  public govInfoName = getGovInfoName() || ''
  public govInfoQydm = getGovInfoQydm() || ''
  public govInfoTop = getGovInfoTop() || ''
  public indexList = getIndexList() || []

  @Mutation
  private SET_KEEP_LOGGED_IN(checked: string){
    this.KeepLoggedIn = checked
    setKeepLoggedInKey(checked)
  }

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_GOV_INFO_NAME(govInfoName: string){
    this.govInfoName = govInfoName
  }

  @Mutation
  private SET_GOV_INFO_QYDM(govInfoQydm: string){
    this.govInfoQydm = govInfoQydm
  }

  @Mutation
  private SET_GOV_INFO_TOP(govInfoTop: string){
    this.govInfoTop = govInfoTop
  }

  @Mutation
  private SET_INDEX_LIST(indexList: any){
    this.indexList = indexList
  }

  @Action
  public Login(userInfo?: { username: string, password: string}) {
    if(userInfo){
      // 如果是账号密码登录
      let { username, password } = userInfo
      username = username.trim()
      return new Promise((resolve) => {
        login(formData({ username, password })).then(res=>{
          let code = (res as any).code
          if(code === '200'){
            let refresh = (res as any).data.refresh
            let token = (res as any).data.token
            let name = (res as any).data.extra.govInfoId
            let govInfoTop = (res as any).data.extra.govInfoTop
            let govInfoName = (res as any).data.extra.govInfoName
            let govInfoQydm = (res as any).data.extra.govInfoQydm
            let indexList = JSON.stringify((res as any).data.extra.indexList)
            setRefresh(refresh,this.KeepLoggedIn)
            setToken(token)
            this.SET_TOKEN(token)
            setGovName(name)
            this.SET_NAME(name)
            this.SET_GOV_INFO_NAME(govInfoName)
            setGovInfoName(govInfoName)
            this.SET_GOV_INFO_QYDM(govInfoQydm)
            setGovInfoQydm(govInfoQydm)
            this.SET_GOV_INFO_TOP(govInfoTop)
            setGovInfoTop(govInfoTop)
            this.SET_INDEX_LIST(indexList)
            setIndexList(indexList)
            resolve(res)
          }else{
            (Message as any).closeAll();
            Message({
              type:'error',
              message:(res as any).msg
            })
            // this.ResetToken()
            resolve()
          }
        })
      }).catch(err=>{
        console.log(err);
      })
    }else{
      // 如果是保持登录 通过refresh请求
      return new Promise((resolve) => {
        login().then(res=>{
          let code = (res as any).code
          if(code === '200'){
            let refresh = (res as any).data.refresh
            let token = (res as any).data.token
            let name = (res as any).data.extra.govInfoId
            let govInfoTop = (res as any).data.extra.govInfoTop
            let govInfoName = (res as any).data.extra.govInfoName
            let govInfoQydm = (res as any).data.extra.govInfoQydm
            let indexList = JSON.stringify((res as any).data.extra.indexList)
            setRefresh(refresh,this.KeepLoggedIn)
            setToken(token)
            this.SET_TOKEN(token)
            setGovName(name)
            this.SET_NAME(name)
            this.SET_GOV_INFO_NAME(govInfoName)
            setGovInfoName(govInfoName)
            this.SET_GOV_INFO_QYDM(govInfoQydm)
            setGovInfoQydm(govInfoQydm)
            this.SET_GOV_INFO_TOP(govInfoTop)
            setGovInfoTop(govInfoTop)
            this.SET_INDEX_LIST(indexList)
            setIndexList(indexList)

            router.push({
              name:getDefault()
            })

            resolve(res)
          }else{
            (Message as any).closeAll();
            Message({
              type:'error',
              message:(res as any).msg
            })
            // this.ResetToken()
            resolve()
          }
        })
      }).catch(err=>{
        console.log(err);
      })
    }
  }

  @Action
  public ResetToken() {
    removeRefresh()
    removeToken()
    localStorage.clear()
    this.SET_TOKEN('')
    this.SET_NAME('')
    this.SET_GOV_INFO_NAME('')
    this.SET_GOV_INFO_QYDM('')
    this.SET_GOV_INFO_TOP('')
    this.SET_INDEX_LIST([])
  }

  @Action
  public LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    return new Promise(resolve=>{
      logout()
      removeRefresh()
      removeToken()
      resetRouter()
      localStorage.clear()
      this.SET_TOKEN('')
      this.SET_KEEP_LOGGED_IN('0')
      location.reload()
      resolve()
    })
  }
}

export const UserModule = getModule(User)
