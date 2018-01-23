import ajax from 'common/ajax.js'
import ajaxUrls from 'common/ajaxUrls.js'

let getTree = function(){
    return ajax({
        url: ajaxUrls.authority.menus + '/tree',
        method: 'get'
    })
};

let menuTreeDataPlugin = {};

menuTreeDataPlugin.install = function(Vue, options){
    Vue.prototype.$menuTreeData = options.tree;
};

export {getTree, menuTreeDataPlugin}