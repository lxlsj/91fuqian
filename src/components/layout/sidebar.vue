<template>
    <div id="main" :class="{'sidebar-collapse': isCollapse}">
        <aside class="main-sidebar">
            <div class="main-logo"><span class="logo-lg">松鼠聚付</span></div>
            <sideMenu :isCollapse="isCollapse"></sideMenu>
        </aside>
        <div class="main-wrapper">
            <header class="main-header">
                <a class="toggle--side-bar" @click="isCollapse = !isCollapse">
                    <i class="el-icon-fa-navicon"></i>
                </a>

                <el-popover
                    ref="popUser"
                    placement="bottom"
                    title="个人信息"
                    trigger="hover">
                    <el-button type="text" @click="goLogout">退出登录</el-button>
                </el-popover>
                <el-button class="fr user" type="text" icon="fa-user" v-popover:popUser>{{this.$userInfoData.loginName}}</el-button>
            </header>
            <div class="main-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
    body{
        background-color:#f3f3f3;
    }
    .main-header{
        height: 52px;
        background-color: #416fb5;
    }
    .main-logo{
        height: 52px;
        background-color: #3962a0;
        .logo-lg{
            display: block;
            line-height: 52px;
            color: #fff;
            font-size: 22px;
            text-align: center;
        }
    }
    .main-content{
        padding: 20px;
    }
    .main-wrapper{
        margin-left: 230px;
        transition: all .3s ease-in-out;
    }
    .main-sidebar{
        position: absolute;
        top: 0;
        left: 0;
        width: 230px;
        height: 100%;
        background-color: #324157;
        transition: all .3s ease-in-out;
    }
    .sidebar-collapse{
        .main-wrapper{
            margin-left: 64px;
        }
        .main-sidebar{
            width: 64px;
        }
    }
    .toggle--side-bar{
        display: inline-block;
        line-height: 52px;
        width: 52px;
        color: #fff;
        text-align: center;
        &:hover{
            background-color: #1f84f3;
        }
    }

    .user{
        padding: 0 10px;
        line-height: 52px;
        color: #fff;
        font-size: 14px;
        &:focus, &:hover{
            background-color: #3f6baf;
        }
        .el-button--text:focus, .el-button--text:hover{
            color: #fff;
        }
    }
</style>
<script>
    import sideMenu from '../sideMenu/index.vue'
    import {logout} from 'common/login.js'
    export default{
        data(){
            return{
                isCollapse: false,
                userShow: false
            }
        },
        components:{
            sideMenu
        },
        methods: {
            goLogout(){
                logout();
            }
        }
    }
</script>
