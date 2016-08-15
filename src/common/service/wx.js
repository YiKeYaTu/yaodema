'use strict';

import request from 'request-promise';
import sha1 from 'sha1';

import wxConfig from '../config/wx.js';

import {
    roundStr, UrlEncode, hash
} from '../ref/tools.js';

const APPID = wxConfig.appid;
const APPSECRET = wxConfig.appSecret;

const COOKIE_TOKEN = 'gt';

let cache = {
    keep: function (name, json) {
        think.cache(name, json);
    },
    get: async function (name) {
        let cacheJson = await think.cache(name);
        return cacheJson;
    }
}

export default class extends think.service.base {
  /**
   * init
   * @return {}         []
   */
    init (...args) {
        super.init(...args);
    }
/**
   此token用于全局并非用户组的token
   */
    async getAccessTokenN () {

        let accessTokenName = 'accessTokenN';

        let accessToken = await cache.get(accessTokenName);

        if (accessToken) return accessToken;

        const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`;
        
        accessToken = await request(URL);
        accessToken = JSON.parse(accessToken);

        cache.keep(accessTokenName, accessToken);

        return accessToken;        

    }

    async createMenu () {

        let accessToken = await this.getAccessTokenN();

        let menuJson = {
            button: [{
                type: 'view',
                name: '特产礼包',
                url: 'http://www.hangeer1996.com',                
            }, {
                type: 'view',
                name: '特产商城',
                url: 'http://www.hangeer1996.com/home/detail/index?item_id=2',
              }, {
                type: 'view',
                name: '我的订单',
                url: 'http://www.hangeer1996.com/home/order/dish',
            }]
        };

        const URL = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${accessToken.access_token}`;

        let res = await request({
            url: URL,
            method: 'POST',
            json: true,
            body: menuJson
        });

        console.log(res);

    }

    async _getAccessTokenForUser (http, redirect_uri) {

        let accessToken = await this._getCacheAcessTokenForUser(http);

        if (!accessToken) {

            console.log('未得到缓存token');
            let code = this.getCode(http, redirect_uri);

            if (!code) return false;

            const GET_ACCESS_TOKEN_URL = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${APPID}&secret=${APPSECRET}&code=${code}&grant_type=authorization_code`;

            accessToken = await request(GET_ACCESS_TOKEN_URL);

            this._cacheAcessTokenForUser(http, accessToken);

        } 
        return JSON.parse(accessToken);

    }

    async getUserInf (isUnionID, http, redirect_uri) {

        let accessToken = await this._getAccessTokenForUser(http, redirect_uri);

        if (!accessToken) return false;

        let GET_USER_INF_URL;

        if (isUnionID) {
            GET_USER_INF_URL = `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${accessToken.access_token}&openid=${accessToken.openid}&lang=zh_CN`;
        } else {
            GET_USER_INF_URL = `https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken.access_token}&openid=${accessToken.openid}&lang=zh_CN`;
        }

        let userInf = await request(GET_USER_INF_URL);

        console.log(userInf);

        return JSON.parse(userInf);

    }

    async _getJSAPITicket () {

        let ticket = await cache.get('jsTicket');

        if (ticket) return ticket;

        let accessToken = await this.getAccessTokenN();

        const GET_JS_TICKET_URL = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken.access_token}&type=jsapi`;

        ticket = await request(GET_JS_TICKET_URL);
        ticket = JSON.parse(ticket).ticket;

        cache.keep('jsTicket', ticket);

        return ticket;

    }

    async getJSSDK (url) {

        if (!/^https?:\/\//.test(url)) url = 'http://' + url;

        let obj = {
            timestamp: Math.floor(new Date().getTime() / 1000).toString(),
            noncestr: roundStr(),
            jsapi_ticket: await this._getJSAPITicket(),
            url: url
        };

        let arr = ['timestamp', 'noncestr', 'jsapi_ticket', 'url'].sort();
        let str = '';

        arr.forEach((item) => {

            str += item + '=' + obj[item] + '&';

        });
        console.log(str.slice(0, -1));

        obj.signature = sha1(str.slice(0, -1));
        obj.appId = APPID;

        return obj;

    }

    getCode (http, redirect_uri) {

        if (typeof http !== 'object') throw 'http should be a object with get and res';

        if (!/^https?:\/\//.test(redirect_uri)) redirect_uri = 'http://' + redirect_uri;

        const WX_GET_CODE_URL = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${UrlEncode(redirect_uri)}&response_type=code&scope=snsapi_userinfo&state=null#wechat_redirect`;

        let code = http.get('code');

        if (!code) {

            console.log('重定向获取code');

            http.res.writeHead(307, {
                'Location': WX_GET_CODE_URL
            });

            return false;

        } else {

            return code;

        }

    }

    _cacheAcessTokenForUser (http, accessToken) {

        var timestamp = new Date().getTime();

        var nonceStr = sha1(accessToken.openid + COOKIE_TOKEN);

        cache.keep(nonceStr, accessToken);

        http.cookie(COOKIE_TOKEN, nonceStr);

    }

    async _getCacheAcessTokenForUser (http) {

        let nonceStr = http.cookie(COOKIE_TOKEN);
        let accessToken = await cache.get(nonceStr);

        console.log(typeof accessToken);

        return (accessToken);

    }
    
}

