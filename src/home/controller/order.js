'use strict';

import Base from './base.js';

let wxService = think.service("wx");
let wx = new wxService();

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
    async addOrder () {

        let userInf = await _checkUserIsFollow();

        if (!userInf) return this.json();

        let itemType = this.post('item_type'),
            itemNumber = this.post('item_number'),
            itemId = this.post('item_id');

        let openid = userInf.openid;

    }
}

async function _checkUserIsFollow () {

    let userInf = await wx.getUserInf();

    if (userInf.subscribe == 1) {

        return userInf;
    } 

    return false;
}