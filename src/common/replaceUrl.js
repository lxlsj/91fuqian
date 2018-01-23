
const replaceUrl = () => {
    if(sessionStorage){
        let _url = sessionStorage.getItem('replaceUrl');
        if(_url){
            sessionStorage.removeItem('replaceUrl');
            location.replace(_url)
        }

    }
};

export default replaceUrl;