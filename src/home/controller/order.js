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

        let goodsId = this.post('goods_id'),
            odNum = parseInt(this.post('od_num')),
            orderNo = produceOutTradeNo(),
            userInf = await this.checkUserInf()/*{openid: 'oDNUjwV7l6KYEaEaBlWWSSn4Nel4'}*/;

        if (!userInf.openid) return this.fail(10001);

        if (!Number.isInteger(odNum) || odNum <= 0) return this.fail(10002);

        let gooddetailModel = this.model('gooddetail');

        if (await gooddetailModel.where({
            id: goodsId
        }).find()) {

            let orderModel = this.model('order');

            let orderId = await orderModel.add({
                openid: userInf.openid,
                del_id: goodsId,
                od_num: odNum,
                od_ticket: orderNo,
                od_prize: 0,
                od_state: 0,
                od_adress_id: 0
            });

            this.success({
                orderId: orderId
            });

        } else {

            return this.fail(10001);

        }

    }

    async payAction () {

        let userInf = await this.checkUserInf(),
            jsTicket = await this.checkJsSdk();

        let orderId = this.get('order_id');

        if (!userInf) return this.fail(10001);
        // let 

        let openid = /*'oDNUjwV7l6KYEaEaBlWWSSn4Nel4'*/ userInf.openid;

        let orderModel = this.model('order'),
            adressModel = this.model('adress');

        let orderInfArr = [];

        orderId = orderId.split('|');

        for (let i = 0, len = orderId.length; i < len; i++) {

            orderInfArr.push(await orderModel.getOrderInf({
                where: {
                    id: orderId[i],
                }
            }));

        }


        let adress = await adressModel

            .where({
                openid: openid,
                is_default: 1
            })
            .find();

        this.assign({
            orderInf: orderInfArr,
            jsTicket: jsTicket,
            adress: adress
        });

        return this.display('index');

    }

    async listAction () {

        let userInf = await this.checkUserInf(),
            openid = userInf.openid;

        let orderModel = this.model('order'),
            result = await orderModel.getOrderInf({
                where: {
                    od_state: 1,
                    openid: openid
                }
            });
        console.log(result);
        this.assign('orderInf', result);

        return this.display();

    }

    async dishAction () {

        let userInf = await this.checkUserInf(),
            openid = userInf.openid;

        let orderModel = this.model('order'),
            result = await orderModel.getOrderInf({
                where: {
                    od_state: 0,
                    openid: openid
                },
                order: "id DESC"
            });

        this.assign('orderInf', result);

        return this.display();

    }

    async _changeOrderState () {

    }

    async getOrderAction () {

        let http = this.http;

        let userInf = await this.checkUserInf();

        let openid = userInf.openid,
            res;

        if (openid) {
            let orderModel = this.model('order');

            let reqJson = await http.getPayload();
            let totalFee = 0; 
            let orderInf;

            reqJson = JSON.parse(reqJson);

            for (let item of reqJson.orderData) {

                item.orderId = parseInt(item.orderId);

                orderInf = await orderModel.getOrderInf({
                    where: {
                        id: item.orderId,
                    }
                });
                
                totalFee = orderInf[0].gooddetail.del_prize * item.itemNum;

                if (item.itemNum !== orderInf[0].od_num) {

                    await orderModel

                        .where({
                            id: item.orderId
                        })
                        .update({
                            od_num: item.itemNum
                        });
                }

            }

            if (!Number.isInteger(totalFee) || totalFee <= 0) return this.fail(10002);

            res = await wxPay.getPayJSticketInf({
                openid: openid,
                total_fee: totalFee,
                spbill_create_ip: getClientIp(http.req) ,
                out_trade_no: produceOutTradeNo(),
                notify_url: 'http://www.hangeer1996.com/home/order/recive_order'
            });

            this.success(res);

        } else {

            this.fail(10001);

        }


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