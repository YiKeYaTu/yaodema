'use strict';

import Base from './base.js';

export default class extends Base {

    async indexAction () {

        return this.display();
    
    }

    async goodsHtmlAction () {

        let orderModel = this.model('order');

        let search = this.get('search');

        // if (search)

        let orderList = await orderModel
            .order('od_state ASC')
            .select();

        let odState = [{
            color: 'danger',
            state: '未付款'
        }, {
            color: 'info',
            state: '已付款'
        }, {
            color: 'success',
            state: '已收货'
        }];

        this.assign({
            orderList,
            odState
        });

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
        let odId = this.post('od_id');
        switch (type) {
            case 'change_od_state':
                let odState = this.post('od_state');

                await odModel.where({
                    id: odId
                }).update({
                    od_state: odState
                });

                return this.success();
            case 'delete_od':

                await odModel.where({
                    id: odId
                }).delete();

                return this.success();

            default:
                return this.fail(10002);
        }
    }
    /*
    *
    *商品相关的操作
    *
    */
    async goodsAction () {

        let type = this.get('type'),
            goodsModel = this.model('goods'),
            goodsDetailModel = this.model('gooddetail');

        switch (type) {
            case 'up_goods':
                let inf = await this.http.getPayload();
                inf = JSON.parse(inf);

                let gId = await goodsModel.add({
                    gt_id: inf.goods.gt_id,
                    g_name: inf.goods.g_name,
                    g_descript: inf.goods.g_descript,
                    g_sold: 0,
                    g_time: think.datetime(),
                });

                inf.goodsdetail.forEach(async (item) => {
                    await goodsDetailModel.add({
                        g_id: gId,
                        del_taste: item.del_taste,
                        del_prize: item.del_prize,
                        del_box: item.del_box,
                        del_compoent: item.del_compoent,
                        del_descript: item.del_descript,
                        del_stock: item.del_stock
                    });
                });

                return this.success();

            case 'delete_goods':
                let goodsId = this.post('goods_id');

                await goodsModel.where({
                    id: goodsId
                }).delete();

                return this.success();

            case 'change_prize':
                let goodsdetailId = this.post('goodsdetail_id'),
                    delPrize = this.post('del_prize');

                await goodsDetailModel.where({
                    id: goodsdetailId
                }).update({
                    del_prize: delPrize
                });

                return this.success();

        }

    }

}