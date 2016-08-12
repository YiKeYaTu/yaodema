'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
    getappidAction(){
        console.log(this.get());
        console.log(this.post());
    }

    async indexAction(){
    //auto render template file index_index.html
    
        let wxService = think.service("wx");
        let wx = new wxService();

        let http = this.http;

        await wx.getUserInf(
            false,
            http, 
            http.host + http.url.slice(0, -1)
        );

        let jsTicket = await wx.getJSSDK(http.host + http.url);
        console.log(jsTicket);
        this.assign('jsTicket', jsTicket);

        // await wx._getAccessTokenForUser(http);

        return this.display();
    }

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