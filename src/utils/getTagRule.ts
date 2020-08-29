
import { getIndexList } from '@/utils/session'

export default function getTagRule(id: string,moduleId: string){
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
        return module[0].govModLabelsRule
    }else{
        return 0
    }
}