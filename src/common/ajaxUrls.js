let ajaxUrls = {
    authority: {
        menus: '/auth/menus',
        sysTree: '/auth/menus/systree',

        user: '/auth/users',
        groups: '/auth/groups',
        groupDropList: '/auth/groups/droplist'
    },
    // 渠道
    channel: {

        // 渠道管理
        channelList: '/mgr/channel/list',
        allList: '/mgr/channel/allId',
        add: '/mgr/channel/add',
        detail: '/mgr/channel/get',
        creditRecord: '/mgr/channel/creditRecord',
        busList: '/mgr/channel/busList',
        adjustCredit: '/mgr/channel/adjustCredit',
        update: '/mgr/channel/update',

        // 渠道借款管理
        chaBorrow: '/mgr/chaBorrow/list',
        addChaBorrow: '/mgr/chaBorrow/add',
        getChaBorrow: '/mgr/chaBorrow/get',
        upDateChaBorrow: '/mgr/chaBorrow/update',
    },
    // 订单
    order: {
        list: '/mgr/order/search',
        export: '/mgr/order/search/export',
    },
    // 商户
    business: {

        // 商户借款管理
        busBorrowCheck: '/mgr/busBorrow/checkBorrow',
        busBorrowAdd: '/mgr/busBorrow/add',
        busBorrowInvalid: '/mgr/busBorrow/invalid',
        busBorrowList: '/mgr/busBorrow/list',
        busBorrowGet: '/mgr/busBorrow/get',
        busBorrowUpdate: '/mgr/busBorrow/update',
        busBorrowExport: '/mgr/busBorrow/export',

        // 商户借款管理
        allId: '/mgr/business/allId',
        list: '/mgr/business/list',
        get: '/mgr/business/get',
        adjustCredit: '/mgr/business/adjustCredit',
        creditRecord: '/mgr/business/creditRecord',
        add: '/mgr/business/add',
        update: '/mgr/business/update',
        listArea: '/mgr/business/listArea',
        export: '/mgr/business/export',
        updateAlipayNum: '/mgr/business/updateAlipayNum',

        //验证商户支付账户
        sendAlipayVCode: '/mgr/business/sendAlipayVCode',
        compareAlipayVCode: '/mgr/business/compareAlipayVCode',
    },
    other: {
        resetPwd: '/mgr/user/resetPwd'
    },


    upload: '/mgr/common/uploadImg'
};
const prefix = '/api';
function urlPrefix(obj){
    let keys = Object.keys(obj);
    keys.forEach((item) => {
        if(typeof obj[item] === 'string'){
            obj[item] =  prefix + obj[item];
        }else{
            urlPrefix(obj[item])
        }
    })
}
urlPrefix(ajaxUrls);
export default ajaxUrls;