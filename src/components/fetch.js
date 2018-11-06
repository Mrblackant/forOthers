/**
 * Encapsulation of the fetch method
 */

import React, { Component } from 'react';
import { Toast } from 'antd-mobile';

const Environment = 'develop';

class Fetch extends Component{
    static Fetch_last_url = {}; // 之前请求的URL信息
    static CryptoJS = require('crypto-js');

    /**
     * Asynchronous         异步
     * @param url
     * @param params
     * @param headers
     * @param, environment      develop - 开发， formal -正式
     */
    static async post(url, params, headers){
        if (!params) {
            params = {};
        }
        params.environment = Environment;
        // 重复请求校验
        if (Fetch.Fetch_last_url[url] === JSON.stringify(params)) {
            return
        }
        Fetch.Fetch_last_url[url] = JSON.stringify(params);

        let uriParams = new FormData();
        Object.keys(params).forEach(key => {
            uriParams.append(key, params[key]);
        });

        return new Promise((resolve, reject) => {
            fetch('http://lingys.eyuntx.com/' + url, {
                method: 'POST',
                headers: headers,
                body: uriParams,
                credentials: 'include'
            }).then((response) => {
                Fetch.Fetch_last_url[url] = null;
                if (response.ok) {
                    return response.json();
                } else {
                    reject({success: false, errCode:'500', errDesc: 'Network request error'});
                    Toast.info('网络异常，请稍后重试', 1);
                }
            }).then((respResult) => {
                switch (respResult.errCode) {
                    case "10000":   // 成功
                        resolve(respResult.result);
                        break;
                    case "20001":   // 鉴权失败
                        Fetch.reLoginFunc();
                        break;
                    case "40006":   // 权限不足
                        Fetch.reLoginFunc();
                        break;
                    case "20002":   // 访问授权过期，重新鉴权
                        window.location.href = respResult.errDesc;
                        break;
                    default :
                        Toast.info(respResult.errDesc, 1);
                        reject(respResult);
                        break;
                }
            }).catch((error) => {
                Fetch.Fetch_last_url[url] = null;
                Toast.info(error.message, 1);
                reject({success: false, errCode:'500', error: error.message});
            })
        })
    }

    /**
     * 授权的方法
     */
    static reLoginFunc(){
        let BASE_URL = window.location.href + "";
        if (window.location.pathname !== '/') {
            BASE_URL = window.location.href.replace(window.location.pathname, '');
        }

        if (BASE_URL.indexOf("?") > -1) {
            BASE_URL = BASE_URL.substring(0, BASE_URL.indexOf("?"));
        }

        if (BASE_URL[BASE_URL.length - 1] !== '/') {
            BASE_URL = BASE_URL + '/';
        }

        // 公众号网页授权
        Fetch.post('/d-app/API/login/wxOatuh2',{
            indexUrl: BASE_URL,
            loginUrl: `${BASE_URL}login`,
            environment: Environment
        }).then((result)=>{
            window.location.href = result;
        }).catch((err)=>{
        });
    };

}

export default Fetch;