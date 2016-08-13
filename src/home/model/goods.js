'use strict';
/**
 * model
 */
export default class extends think.model.base {

    async getGoodsPrice (goodsId) {

        let result =  await this.

            where({
                id: goodsId
            })
            .find()

        return result.g_sold;

    }

}