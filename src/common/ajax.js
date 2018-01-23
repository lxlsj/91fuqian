import axios from 'axios';
import qs from 'qs';
import login from 'common/login.js'

const ajax = function(config){
    let method = config.method ? config.method.toLowerCase() : 'get';
    let option = {};
    option.method = method;
    option.url = config.url;
    option.timeout = config.timeout || 3000;
    if(method === 'get'){
        option.params = config.data;
    }
    if(method === 'put' || method === 'delete'){
        option.headers = {
            'Content-type': 'application/json'
        };
        option.data = config.data;
    }
    if(method === 'post'){
        option.data = config.data ? qs.stringify(config.data) : '';
    }

    return axios(option).then(function (response) {
        let data = response.data;

        if(data.code === 'notLogin'){
            login();
        }else if(data.code !== 'success'){
            return Promise.reject(data);
        }else{
            return response.data
        }
    })
};
export default ajax;
