import hostsUrl from 'common/hostsUrl.js';

function login(){
    let curHash = location.hash;
    if(curHash && sessionStorage){
        sessionStorage.setItem('replaceUrl', location.href);
    }
    let curUrl =  location.protocol + '//' + location.hostname;
    if(location.port){
        curUrl += ':' + location.port;
    }
    if(location.pathname){
        curUrl += location.pathname;
    }
    let loginUrl =  hostsUrl.login + encodeURIComponent(hostsUrl.loginTransfer + curUrl);

    window.location.replace(loginUrl);
}
function logout(){
    window.location.replace(hostsUrl.logout);
}
export default login;
export {logout};