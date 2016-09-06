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
    async deleteOrderAction () {
        let orderList = this.post('order_list').split('|');

        let userInf = await this.checkUserInf(),
            openid = userInf.openid;

        try {
            await this.model('order')
            .where({
                openid: openid,
                id: ['IN', orderList]
            })
            .delete();

            return this.success();
        } catch (e) {
            return this.fail();
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

        if (!adress.openid) {
            return this.redirect(`http://www.hangeer1996.com/home/adress/add?order_id=${orderId}`);
        }

        this.assign({
            orderInf: orderInfArr,
            jsTicket: jsTicket,
            adress: adress,
            orderId: orderId
        });

        return this.display('index');

    }

    async listAction () {

        let userInf = await this.checkUserInf(),
            openid = userInf.openid;
        
        let orderModel = this.model('order'),
            result = await orderModel.getOrderInf({
                where: {
                    od_state: ['IN', [1, 2]],
                    openid: openid
                }
            });
        // console.log(result);
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

        if (this.get('item_id')) {
            result['addGooddetail'] = await this
                    .model('gooddetail')
                    .where({'g_id': this.get('item_id')})
                    .select();

            result['addGood'] = await this
                    .model('goods')
                    .where({'id': this.get('item_id')})     
                    .select();            
        }

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

            let orderNo = produceOutTradeNo();

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

                await orderModel.where({
                    id: item.orderId
                }).update({
                    od_ticket_all: orderNo
                });
                
                totalFee += orderInf[0].gooddetail.del_prize * item.itemNum;

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
                out_trade_no: orderNo,
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
            let orderModel = this.model('order');
            let outRradeNo = wxRexJson.xml.out_trade_no[0];
            
            await orderModel.where({
                od_ticket_all: outRradeNo
            }).update({
                od_state: 1
            });

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

    async confirmAction(){

        this.model('order')
            .where({
                id: this.get('id')
            })
            .update({
                od_state: 2
            })
        this.json({status: 200});
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