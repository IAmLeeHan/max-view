
import { getIndexList } from '@/utils/session'

export default function getTags(id: string,moduleId: string){
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

    let str = module[0].govModLabels.split(';')

    let newArr: { name: string, value: string }[] = []
    str.map((item: any)=>{
        newArr.push(
            {
                name:item.split(':')[0],
                value:item.split(':')[1]
            }
        )
    })
    return newArr
}