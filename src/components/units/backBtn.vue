<template>
    <el-button @click="back">返回</el-button>
</template>
<script>
    export default {
        methods: {
            back(){
                history.back()
            }
        }
    }
</script>