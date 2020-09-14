
import { getIndexList } from '@/utils/session'
import { EAreaModule } from '@/store/modules/eArea'
export default function getDefault(){
    if(getIndexList()){
        let arr = JSON.parse(getIndexList() as any) 
        let indexArr = arr.filter((item: any)=>{
            return item.govInfoIsDefault === 1
        })
        let str = indexArr[0].govInfoIndexDefault
        if(str){
            EAreaModule.setQydm(str.substr(0,6))
            EAreaModule.setCurrentName(str.substr(7,str.length))
        }
        return indexArr[0].govIndexPath
    }else{
        return 'enterpriseAreaOverview'
    }
}