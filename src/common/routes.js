import Home from 'components/page/home/index.vue'

import AuthMenu from 'components/page/auth/menu/index.vue'
import AuthUser from 'components/page/auth/user/index.vue'
import AuthGroup from 'components/page/auth/group/index.vue'

import Channel from 'components/page/channel/channel.vue'
import ChannelDetail from 'components/page/channel/detail.vue'
import ChannelEdit from 'components/page/channel/edit.vue'
import ChannelBorrow from 'components/page/channel/borrow.vue'
import ChannelBorrowEdit from 'components/page/channel/borrowEdit.vue'

import Business from 'components/page/business/index.vue'
import BusinessDetail from 'components/page/business/detail.vue'
import BusinessEdit from 'components/page/business/edit.vue'
import BusinessBorrow from 'components/page/business/borrow.vue'
import BusinessBorrowEdit from 'components/page/business/borrowEdit.vue'
import BusinessBorrowDetail from 'components/page/business/borrowDetail.vue'

import Order from 'components/page/order/index.vue'

import ResetPwd from 'components/page/other/resetPwd.vue'

const routes = [
    {path: '/', name: 'home', component: Home},     //首页

    {path: '/auth/menu', name: 'authMenu', component: AuthMenu},    //菜单配置
    {path: '/auth/user', name: 'authUser', component: AuthUser},    //用户管理
    {path: '/auth/group', name: 'authGroup', component: AuthGroup},    //用户组管理

    {path: '/channel', name: 'channel', component: Channel},                                    //渠道管理
    {path: '/channel/detail', name: 'channelDetail', component: ChannelDetail},                 //渠道详情
    {path: '/channel/edit', name: 'channelEdit', component: ChannelEdit},                       //新增、修改渠道
    {path: '/channel/borrow', name: 'channelBorrow', component: ChannelBorrow},                 //渠道借款
    {path: '/channel/borrow/edit', name: 'channelBorrowEdit', component: ChannelBorrowEdit},    //新增、修改渠道借款

    {path: '/business', name: 'business', component: Business},                                         //商户管理
    {path: '/business/detail', name: 'businessDetail', component: BusinessDetail},                      //商户详情
    {path: '/business/edit', name: 'businessEdit', component: BusinessEdit},                            //新增、修改商户详情
    {path: '/business/borrow', name: 'businessBorrow', component: BusinessBorrow},                      //商户借款
    {path: '/business/borrow/edit', name: 'businessBorrowEdit', component: BusinessBorrowEdit},         //新增、修改商户借款
    {path: '/business/borrow/detail', name: 'businessBorrowDetail', component: BusinessBorrowDetail},   //商户借款详情

    {path: '/order', name: 'order', component: Order},   //订单管理

    {path: '/resetPwd', name: 'orderPwd', component: ResetPwd},   //重置密码
];

export default routes;