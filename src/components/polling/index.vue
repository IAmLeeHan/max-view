<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props:{
        govModNext:{
            type:Number,
            default:1
        },
        govModNextSleep:{
            type:Number,
            default:15
        }
    },
    data(){
        return{
            loop:0,
            timer:null
        }
    },
    mounted(){
        // // this.govModNext = 1
        // console.log(this.govModNext,this.govModNextSleep)
        // _this.$nextTick(()=>{
            
        // })
    },
    beforeDestroy(){
        let _this = this as any
        window.clearInterval(_this.timer)
        _this.timer = null
    },
    methods:{
        //标签轮询
        pollingLabel(){
            let _this = this as any
            let arr = _this.labelList.filter((item: any)=>{
                return item.hasValue
            })
            if(arr.length<=0){
                // console.log("没有sub");
            }else{
                if(_this.govModNext === 0){
                    // console.log("不切换");
                }else{
                    _this.timer = window.setInterval(()=>{
                        if(_this.loop <= arr.length - 1){
                            _this.changeLabel(arr[_this.loop].id,arr[_this.loop].label,arr[_this.loop].ruleId,arr[_this.loop].hasValue)
                        }else{
                            _this.loop = 0
                            _this.changeLabel(arr[_this.loop].id,arr[_this.loop].label,arr[_this.loop].ruleId,arr[_this.loop].hasValue)
                        }
                        _this.loop ++
                    },_this.govModNextSleep * 1000)
                }
            }
        }
    }
})
</script>