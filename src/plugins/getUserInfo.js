import ajax from 'common/ajax.js'
import ajaxUrls from 'common/ajaxUrls.js'

let getUserInfo = function(){
    return ajax({
        url: ajaxUrls.authority.user + '/loginedinfo',
        method: 'get'
    })
};

let userDataPlugin = {};

userDataPlugin.install = function(Vue, options){
    Vue.prototype.$userInfoData = options.userInfo;
};

export {getUserInfo, userDataPlugin}