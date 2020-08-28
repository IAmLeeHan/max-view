import Cookies from 'js-cookie'

// 用户名
const nameKey = 'gov_name'
export const getGovName = () => localStorage.getItem(nameKey)
export const setGovName = (name: string) => {
  localStorage.setItem(nameKey, name)
}
export const removeGovName = () => localStorage.removeItem(nameKey)

// 最高行政代码
const govInfoTopKey = 'gov_govInfoTop'
export const getGovInfoTop = () => localStorage.getItem(govInfoTopKey)
export const setGovInfoTop = (govInfoTop: string) => {
  localStorage.setItem(govInfoTopKey, govInfoTop)
}
export const removeGovInfoTop = () => localStorage.removeItem(govInfoTopKey)

// 当前行政区域名称
const govInfoNameKey = 'gov_govInfoName'
export const getGovInfoName = () => localStorage.getItem(govInfoNameKey)
export const setGovInfoName = (govInfoName: string) => {
  localStorage.setItem(govInfoNameKey, govInfoName)
}
export const removeGovInfoName = () => localStorage.removeItem(govInfoNameKey)

// 当前行政区域代码
const govInfoQydmKey = 'gov_govInfoQydm'
export const getGovInfoQydm = () => localStorage.getItem(govInfoQydmKey)
export const setGovInfoQydm = (govInfoQydm: string) => {
  localStorage.setItem(govInfoQydmKey, govInfoQydm)
}
export const removeGovInfoQydm = () => localStorage.removeItem(govInfoQydmKey)

// 当前用户大屏首页列表
const indexListKey = 'gov_indexList'
export const getIndexList = () => localStorage.getItem(indexListKey)
export const setIndexList = (indexList: string) => {
  localStorage.setItem(indexListKey, indexList)
}
export const removeIndexList = () => localStorage.removeItem(indexListKey)

// 保持登录
const KeepLoggedInKey = 'KeepLoggedIn'
export const getKeepLoggedInKey = () => localStorage.getItem(KeepLoggedInKey)
export const setKeepLoggedInKey = (KeepLoggedIn: string) => {
  localStorage.setItem(KeepLoggedInKey, KeepLoggedIn)
}
export const removeKeepLoggedInKey = () => localStorage.removeItem(KeepLoggedInKey)