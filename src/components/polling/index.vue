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
        console.log(1111)
        let _this = this as any
        window.clearInterval(_this.timer)
        _this.timer = null
    },
    methods:{
        //标签轮询
        pollingLabel(){
            let _this = this as any
            if(_this.labelList.length<=0){
                console.log("没有sub");
            }else{
                if(_this.govModNext === 0){
                    console.log("不切换");
                }else{
                    _this.timer = window.setInterval(()=>{
                        _this.loop ++
                        if(_this.loop <= _this.labelList.length - 1){
                            _this.changeLabel(_this.labelList[_this.loop].id)
                        }else{
                            _this.loop = 0
                            _this.changeLabel(_this.labelList[_this.loop].id)
                        }
                    },_this.govModNextSleep * 1000)
                }
            }
        }
    }
})
</script>