
import { getIndexList } from '@/utils/session'

export default function getModUrl(id: string,moduleId: string){
    if(!getIndexList()){
        return false
    }

    let list = JSON.parse(getIndexList() as any)

    let arr = (list as any).filter((item: any)=>{
        return item.govIndexId === id
    })
    
    if(arr.length>0&&arr[0].modules){
        let modules = arr[0].modules

        let module = modules.filter((item: any)=>{
            return item.govModId === moduleId
        })
        if(module.length > 0){
            return module[0].govModUrl
        }else{
            return ""
        }
    }else{
        return ""
    }
}