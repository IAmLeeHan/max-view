<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props:{
        govModNext:{
            type:Number,
            default:0
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
    watch:{
        subTitle:{
            immediate:true,
            handler(newVal,orlVal){
                let _this = this as any
                _this.$nextTick(()=>{
                    let data = newVal
                    if(data.length<=0){
                        console.log("没有sub");
                    }else{
                        if(_this.govModNext === 0 || data.length === 1){
                            console.log("不切换");
                        }else{
                            _this.loopFun(data)
                            // if(data[_this.loop].disabled){
                            //     _this.loop++
                            // }else{
                            // }
                        }
                    }
                })
            }
        }
    },
    beforeDestroy(){
        let _this = this as any
        window.clearInterval(_this.timer)
        _this.timer = null
    },
    methods:{
        loopFun(data: any[]){
            let _this = this as any
            // 当loop小于或者等于当前数组的长度时
            if(_this.loop <= data.length - 1){
                // 当disabled为false或者不存在时
                if(!data[_this.loop].disabled){
                        _this.changeActive(_this.loop ,data[_this.loop].value)
                        window.clearInterval(_this.timer)
                        _this.timer = null
                        _this.timer = window.setInterval(()=>{
                            _this.loop ++
                            _this.loopFun(data)
                        },_this.govModNextSleep * 1000)
                }else{
                    // 当disabled为true时
                    window.clearInterval(_this.timer)
                    _this.timer = null
                    _this.loop++
                    _this.loopFun(data)
                }
            }else{
                // 当loop超出当前数组的长度时
                _this.loop = 0
                _this.changeActive(_this.loop ,data[_this.loop].value)
                window.clearInterval(_this.timer)
                _this.timer = null
                _this.timer = window.setInterval(()=>{
                    _this.loop ++
                    _this.loopFun(data)
                },_this.govModNextSleep * 1000)
            }
        }
    }
})
</script>