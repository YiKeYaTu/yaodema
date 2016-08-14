'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
    async indexAction(){
    //auto render template file index_index.html
    
        // let wxService = think.service("wx");
        // let wx = new wxService();

        // let http = this.http;

        // await wx.getUserInf(
        //     false,
        //     http, 
        //     http.host + http.url.slice(0, -1)
        // );

        // let jsTicket = await wx.getJSSDK(http.host + http.url);
        // console.log(jsTicket);
        // this.assign('jsTicket', jsTicket);

        // await wx._getAccessTokenForUser(http);
        let config = {};
        let goods = this.model('goods');

        config.topCover = await goods.getTopCover();

        config.goodsType = await goods.getGoodsType();
        
        config.hotGoods = await goods.getHotGoods(2);

        config.newGoods = await goods.getNewGoods(2);

        this.assign('data', config);
        console.log(config.hotGoods);
        
        return this.display();
    }
    /**
     * [getTopCover description]
     * 获取最热门商品前五的封面图片
     */

    async testxmlAction () {

        let payService = think.service("wx_pay");
        let pay = new payService();

        await pay.uniformOrder({});

    }

    async postAction () {
        let data = await this.http.getPayload();
        console.log(data);
    }


}