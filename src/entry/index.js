import "babel-polyfill";

import Vue from 'vue';
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'style/common.scss'
import 'style/font.scss'
import filters from 'common/filters.js'
import routes from 'common/routes.js'
import replaceUrl from 'common/replaceUrl.js'
import {getTree, menuTreeDataPlugin} from 'plugins/getTree.js'
import {getUserInfo, userDataPlugin} from 'plugins/getUserInfo.js'

// 单点登陆无法传输hash值，所以在登录跳转之前在sessionStorage中记录跳转之前的地址，进入页面后判断跳转回去
replaceUrl();

import App from 'components/index.vue'

const router = new VueRouter({
    routes
});

filters(Vue);
Vue.use(VueRouter);
Vue.use(ElementUI);

Promise.all([getTree(), getUserInfo()]).then( ([treeData, userInfoData]) => {

    Vue.use(menuTreeDataPlugin, {tree: treeData.data});
    Vue.use(userDataPlugin, {userInfo: userInfoData.data});

    new Vue({
        el: '#appRoot',
        render: h => h(App),
        router
    });

});
