'use strict';

import {
    getClientIp
} from '../../common/ref/tools.js';

export default class extends think.controller.base {
    async checkUserInf () {
        const SESSION_NAME = 'userInf';
        let userInf = await this.session(SESSION_NAME);

        if (!userInf) {
            userInf = await this.cacheUserInf();
        }

        return userInf;
    }

    async checkJsSdk () {

        let wxService = think.service("wx");
        let wx = new wxService(); 

        let http = this.http;

        let jsTicket = await wx.getJSSDK(http.host + http.url);

        return jsTicket;
    }

    async getPayJSticket ($, outTradeNo) {

        let wxPayService = think.service("wx_pay");
        let wxPay = new wxPayService();

        let userInf = await this.checkUserInf();

        let payJSticket = await wxPay.getPayJSticketInf({
            openid: userInf.openid,
            total_fee: $,
            spbill_create_ip: getClientIp(http.req),
            out_trade_no: outTradeNo,
            notify_url: 'http://www.hangeer1996.com/home/order/recive_order'
        });

        return payJSticket;
    }

    async cacheUserInf () {
        
        const SESSION_NAME = 'userInf';

        let wxService = think.service("wx");
        let wx = new wxService(); 

        let http = this.http;

        let userInf = await wx.getUserInf(
            false,
            http, 
            http.host + http.url.slice(0, -1)
        );

        await this.session(SESSION_NAME, userInf);
        return userInf;
    }

    async getUserId (openid) {

        let id = await this.session('userId');

        if (id) return id;

        if (!openid) {

            let userInf = await this.checkUserInf();
            openid = userInf.openid;

        }

        let userModel = this.model('user');

        id = await userModel 
            .where({
                openid: openid
            })
            .find();

        await this.session('userId', id);

    }
}