import Cookies from 'js-cookie'

// App
const sidebarStatusKey = 'sidebar_status'
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey)
export const setSidebarStatus = (sidebarStatus: string) => Cookies.set(sidebarStatusKey, sidebarStatus)

const languageKey = 'language'
export const getLanguage = () => Cookies.get(languageKey)
export const setLanguage = (language: string) => Cookies.set(languageKey, language)

const sizeKey = 'size'
export const getSize = () => Cookies.get(sizeKey)
export const setSize = (size: string) => Cookies.set(sizeKey, size)

// User
const refreshKey = 'vue_typescript_admin_access_refresh'
export const getRefresh = () => Cookies.get(refreshKey)
export const setRefresh = (refresh: string,keep?: string) => {
  // let seconds = 60;
  // let expires: Date = new Date(new Date() as any * 1 + seconds * 1000);
  if(keep === '1'){
    Cookies.set(refreshKey, refresh , {expires:new Date('Fri, 31 Dec 9999 23:59:59 GMT')})
  }else{
    Cookies.set(refreshKey, refresh)
  }
}
export const removeRefresh = () => Cookies.remove(refreshKey)

const tokenKey = 'vue_typescript_admin_access_token'
export const getToken = () => Cookies.get(tokenKey)
export const setToken = (token: string) => {
  Cookies.set(tokenKey, token)
}
export const removeToken = () => Cookies.remove(tokenKey)
