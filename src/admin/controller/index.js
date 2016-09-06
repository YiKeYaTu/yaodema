'use strict';

import Base from './base.js';

export default class extends Base {

    async indexAction(){

        return this.display('goods');
    
    }
    /*
    *
    *订单相关的操作
    *
    */
    async orderAction () {
        let type = this.post('type');

        let odModel = this.model('order');

        switch (type) {
            case 'change_od_state':
                let odId = this.post('od_id'),
                    odState = this.post('od_state');

                await odModel.where({
                    id: odId
                }).update({
                    od_state: odState
                });

                return this.success();
            case 'delete_od':
                let odId = this.post('od_id');

                await odModel.where({
                    id: odId
                }).delete();

                return this.success();

            default:
                return this.fail(10002);
        }
    }

    async goodsAction () {

        let type = this.post('type'),
            goodsModel = this.model('goods'),
            goodsDetailModel = this.model('gooddetail');

        switch (type) {
            case 'up_goods':
                let inf = await this.http.getPayload();
                inf = JSON.parse(inf);



            case 'delete_goods':

        }

    }

}