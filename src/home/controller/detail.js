'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
    async indexAction(){

        // await this.checkUserInf();

        let itemId = this.get('item_id');

        if (!itemId) return this.fail(10002);

        let goodsModel = this.model('goods');

        let result = await goodsModel.where({
            id: itemId
        }).find();

        console.log(result);

        this.assign('itemInf', result);

        return this.display();
    }

    async getItemInfAction () {

        let itemId = this.get('item_id');
        let goodsDetailModel = this.model('gooddetail');

        let res = await goodsDetailModel.

            where({
                id: itemId
            })
            .find();

        return this.success(res);

    }

}