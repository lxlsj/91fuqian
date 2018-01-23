<template>
    <div class="card-wrapper">
        <div class="card-header">
            <slot name="header"></slot>
        </div>
        <div class="card-body">
            <slot></slot>
        </div>
        <div class="card-footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>
<style lang="scss">
    .card-wrapper{
        background-color: #fff;
        .card-header{
            padding: 10px 0;
            min-height: 36px;
            border-bottom: 1px solid  #ddd;
        }
        .card-body{
            padding: 10px 0;
            border-bottom: 1px solid #ddd;
        }
    }
</style>
<script>
    export default{
        props:{
        },
        data(){
            return{
            }
        },
        components:{
        }
    }
</script>
