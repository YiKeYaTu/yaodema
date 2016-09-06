'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
    async indexAction(){

        await this.checkUserInf();

        let config = {};
        let goods = this.model('goods');

        config.topCover = await goods.getTopCover();
        config.goodsType = await goods.getGoodsType();
        config.hotGoods = await goods.getHotGoods(2);
        config.newGoods = await goods.getNewGoods(2);

        this.assign('data', config);
        
        return this.display();
    }
    /**
     * [getTopCover description]
     * 获取最热门商品前五的封面图片
     */
    async getnewgoodsAction(){
        let length = this.get('get_num') || 0;
        let time = this.get('page_num') || 0;
        let data = await this.model('goods').getNewGoods(length, time);
        this.success(data);
    }

}