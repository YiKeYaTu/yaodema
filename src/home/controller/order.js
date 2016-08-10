'use strict';

import Base from './base.js';
import xml2js from 'xml2js';
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
            http.host + http.url
        );
        let openid = userInf.openid;
        let res, jsTicket;

        if (openid) {

            jsTicket = await wx.getJSSDK(http.host + http.url);

            res = await wxPay.getPayJSticketInf({
                openid: openid,
                total_fee: 1,
                spbill_create_ip: getClientIp(http.req),
                out_trade_no: produceOutTradeNo(),
                notify_url: 'http://www.hangeer.com/home/order/recive_order'
            }, jsTicket);

            console.log(res);


            this.assign('payJSticket', res);
            this.assign('jsTicket', jsTicket);

        }

        return this.display('index');
    }

    async recive_orderAction () {
        let wxRes = await this.http.getPayload();
        conosle.log(wxRes);
    }

}

async function _checkUserIsFollow () {

    let userInf = await wx.getUserInf();

    if (userInf.subscribe == 1) {

        return userInf;
    } 

    return false;
}

function parseString (xml) {

    return new Promise((reslove, reject) => {

        xml2js.parseString(xml, (err, json) => {

            if (err) {
                return reject(err);
            }
            reslove(json);
        })

    });

}