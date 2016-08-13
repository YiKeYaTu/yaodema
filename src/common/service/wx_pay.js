'use strict';

import request from 'request-promise';
import wxConfig from '../config/wx.js';
import xml2js from 'xml2js';

import {
    roundStr, produceSign, produceOutTradeNo,
    produceDate, hash, mkXml
} from '../ref/tools.js';

const APPID = wxConfig.appid;
const APPSECRET = wxConfig.appSecret;
const mchId = wxConfig.mchId

let wxService = think.service('wx');
let wx = new wxService();

export default class extends think.service.base {

    init (...args) {
        super.init(...args);
    }
    /*
    * 下单
    */
    async uniformOrder (conf) {

        const URL = 'https://api.mch.weixin.qq.com/pay/unifiedorder';

        let json = {
            appid: APPID,
            mch_id: mchId, // 微信支付分配的商户号
            device_info: 'WEB', // 终端设备号(门店号或收银设备ID)，注意：PC网页或公众号内支付请传"WEB"
            nonce_str: roundStr(), // 随机字符串，不长于32位
            sign: '',// 签名
            body: 'test',// 商品描述
            detail: conf.detail,// 商品详细列表，使用Json格式，传输签名前请务必使用CDATA标签将JSON文本串保护起来
            attach: conf.attach,// 附加数据，在查询API和支付通知中原样返回，该字段主要用于商户携带订单的自定义数据
            out_trade_no: conf.out_trade_no,// 商户系统内部的订单号,32个字符内、可包含字母, 其他说明见商户订单号
            fee_type: conf.fee_type || 'CNY', // 货币类型 默认CNY
            total_fee: conf.total_fee, // 订单总金额，单位为分 参数值不能带小数点
            spbill_create_ip: conf.spbill_create_ip, // APP和网页支付提交用户端ip，Native支付填调用微信支付API的机器IP
            time_start: conf.time_start,// 订单生成时间，格式为yyyyMMddHHmmss
            time_expire: conf.time_expire,// 订单失效时间，格式为yyyyMMddHHmmss
            goods_tag: conf.goods_tag,// 商品标记，代金券或立减优惠功能的参数
            notify_url: conf.notify_url,// 接收微信支付异步通知回调地址，通知url必须为直接可访问的url，不能携带参数
            trade_type: 'JSAPI',// 取值如下：JSAPI，NATIVE，APP
            product_id: conf.product_id,// trade_type=NATIVE，此参数必传。此id为二维码中包含的商品ID，商户自行定义。
            openid: conf.openid, //
        };

        json.sign = produceSign(json);

        let xml = mkXml({
            rootName: 'xml',
            headless: true,
            // cdata: true,
            json: json,
            // cdataName: 'detail'
        });

        console.log(xml);

        let res = await request({
            url: URL,
            body: xml,
            method: "POST",
            headers:{
                "Content-Type": 'application/xml;charset=utf-8',
              }
          });

        console.log('下单微信返回数据为.......');
        console.log(res);
        console.log('.......................');
        return res;

    }
    /*
    * 查询订单
    */
    async orderQuery (conf) {

        const URL = 'https://api.mch.weixin.qq.com/pay/orderquery';

        let json = {
            appid: APPID,
            mch_id: conf.mch_id,
            transaction_id: conf.transaction_id, // 微信的订单号，优先使用
            out_trade_no: conf.out_trade_no, // 商户系统内部的订单号，当没提供transaction_id时需要传这个。
            nonce_str: roundStr(),
            sign: '',
        };

        json.sign = produceSign(json);

        let xml = mkXml({
            rootName: 'xml',
            headless: true,
            json: json,
        });

        let res = await request({
            url: URL,
            body: xml,
            method: "POST",
            headers:{
                "Content-Type": 'application/xml;charset=utf-8',
              }
          });

        console.log('查询订单后微信返回数据为.......');
        console.log(res);
        console.log('............................');

    }
    /*
    * 下单
    */
    async closeOrder () {

        const URL = 'https://api.mch.weixin.qq.com/pay/closeorder';

        let json = {
            appid: APPID,
            mch_id: conf.mch_id,
            out_trade_no: conf.out_trade_no, // 商户系统内部的订单号，当没提供transaction_id时需要传这个。
            nonce_str: roundStr(),
            sign: '',
        };

        json.sign = produceSign(json);

        let xml = mkXml({
            rootName: 'xml',
            headless: true,
            json: json,
        });

        let res = await request({
            url: URL,
            body: xml,
            method: "POST",
            headers:{
                "Content-Type": 'application/xml;charset=utf-8',
              }
          });

        console.log('关闭订单后微信返回数据为.......');
        console.log(res);
        console.log('............................');

    }
    /*
    * 返回给前端的下单数据
    * (多写了两个引号 坑了一下午)
    */
    async getPayJSticketInf (conf) {

        let xml = await this.uniformOrder(conf);

        let payJson = await parseString(xml);
        let json;

        try {

            json = {
                appId: APPID,
                timeStamp: Math.floor(new Date().getTime() / 1000).toString(),
                nonceStr: roundStr(),
                package: `prepay_id=${payJson.xml.prepay_id[0]}`,
                signType: 'MD5',
            }

        } catch (e) {

             json = {
                status: 400,
                msg: 'fail'
             }

            return json;

        }

        json.paySign = produceSign(json);
        return json;

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