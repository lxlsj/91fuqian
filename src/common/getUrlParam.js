let getUrlParam = function(url, param){

    url = url ? url : location.href;

    let reg = new RegExp('[?|&]' + param + '\\=(.*?)(#|&|$)', 'ig');

    if(reg.test(url)){
        return RegExp.$1
    }else{
        return '';
    }
};

export default getUrlParam;