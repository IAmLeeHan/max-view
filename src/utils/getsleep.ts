
import { getIndexList } from '@/utils/session'

 /*
   * govModNext : 是否轮询标签
   * govModNextSleep : 轮询间隔
   * govModSleep ： 模块刷新间隔
  */
export function getGovModNext(id: string,moduleId: string){
    if(!getIndexList()){
        return false
    }

    let list = JSON.parse(getIndexList() as any)

    let arr = (list as any).filter((item: any)=>{
        return item.govIndexId === id
    })
    
    
    let modules = arr[0].modules

    let module = modules.filter((item: any)=>{
        return item.govModId === moduleId
    })
    if(module.length > 0){
        return module[0].govModNext
    }else{
        return 0
    }
}

export function getGovModNextSleep(id: string,moduleId: string){
    if(!getIndexList()){
        return false
    }

    let list = JSON.parse(getIndexList() as any)

    let arr = (list as any).filter((item: any)=>{
        return item.govIndexId === id
    })
    
    
    let modules = arr[0].modules

    let module = modules.filter((item: any)=>{
        return item.govModId === moduleId
    })
    if(module.length > 0){
        return module[0].govModNextSleep
    }else{
        return 0
    }
}

export function getGovModSleep(id: string,moduleId: string){
    if(!getIndexList()){
        return false
    }

    let list = JSON.parse(getIndexList() as any)

    let arr = (list as any).filter((item: any)=>{
        return item.govIndexId === id
    })
    
    
    let modules = arr[0].modules

    let module = modules.filter((item: any)=>{
        return item.govModId === moduleId
    })
    if(module.length > 0){
        return module[0].govModSleep
    }else{
        return 0
    }
}