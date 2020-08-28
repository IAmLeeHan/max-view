
import { getIndexList } from '@/utils/session'
export default function getDefault(){
    if(getIndexList()){
        let arr = JSON.parse(getIndexList() as any) 
        let indexArr = arr.filter((item: any)=>{
            return item.govInfoIsDefault === 1
        })
        return indexArr[0].govIndexPath
    }else{
        return 'enterpriseAreaOverview'
    }
}