'use strict';

import Base from './base.js';
import {
    getClientIp, produceOutTradeNo
} from '../../common/ref/tools.js';

let wxService = think.service("wx");
let wxPayService = think.service("wx_pay");
let wx = new wxService();
let wxPay = new wxPayService();

export default class extends Base {

    async add_orderAction () {

        let userInf = await _checkUserIsFollow();

        if (!userInf) return this.json();

        let itemType = this.post('item_type'),
            itemNumber = this.post('item_number'),
            itemId = this.post('item_id');

        let openid = userInf.openid;

    }

    async paytestAction () {

        let http = this.http;

        let userInf = await wx.getUserInf(
            false,
            http, 
            http.host + http.url.slice(0, -1)
        );
        let openid = userInf.openid;

        if (!openid) return false;

        await wxPay.uniformOrder({
            openid: openid,
            total_fee: 888,
            spbill_create_ip: getClientIp(http.req),
            out_trade_no: produceOutTradeNo(),
            notify_url: 'http://www.hangeer.com/home/index/index'
        });
    }

}

async function _checkUserIsFollow () {

    let userInf = await wx.getUserInf();

    if (userInf.subscribe == 1) {

        return userInf;
    } 

    return false;
}