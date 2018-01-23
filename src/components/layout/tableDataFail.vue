<template>
    <div class="table-data-fail">
        <template v-if="type === 'empty'">
            暂无数据
        </template>
        <template v-if="type === 'error'">
            请求失败，请重新请求
        </template>
    </div>
</template>
<style lang="scss">
    .table-data-fail{
        font-size: 16px;
        text-align: center;
    }
</style>
<script>
    export default{
        props:{
            type:{
                type: String,
                required: true
            }
        },
        data(){
            return{
            }
        },
        components:{
        }
    }
</script>
