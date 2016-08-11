'use strict';

import Base from './base.js';
import xml2js from 'xml2js';
import {
    getClientIp, produceOutTradeNo,
    produceSign, mkXml
} from '../../common/ref/tools.js';

let wxService = think.service("wx");
let wxPayService = think.service("wx_pay");
let wx = new wxService();
let wxPay = new wxPayService();

export default class extends Base {

    async addOrderAction () {

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
                notify_url: 'http://www.hangeer1996.com/home/order/recive_order'
            });

            this.assign('payJSticket', res);
            this.assign('jsTicket', jsTicket);

        }

        return this.display('index');
    }

    async getOrderAction () {

    }

    async reciveOrderAction () {

        let wxResXml = await this.http.getPayload(),
            wxRexJson = await parseString(wxResXml),
            sign = produceSign(wxRexJson.xml);

        let http = this.http;

        let returnWxXml;

        if (wxRexJson.xml.sign[0] === sign) {

            console.log ('支付成功');

            returnWxXml = mkXml({
                rootName: 'xml',
                headless: true,
                json: {
                    return_code: 'SUCCESS'
                },
            })
            return http.end(returnWxXml);

        } else {

            console.lgo('非法数据');
            returnWxXml = mkXml({
                rootName: 'xml',
                headless: true,
                json: {
                    return_code: 'FAIL'
                },
            })
            return http.end(returnWxXml);
        }
    }

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