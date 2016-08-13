'use strict';
/**
 * model
 */
export default class extends think.model.relation {

    init(...args){

        super.init(...args);

        this.relation = {

            gooddetail: {

                type: think.model.HAS_ONE,
                key: 'del_id',
                fKey: 'id'

            },
        };
    }

    getOrderInf (openid) {

        return this

            .where({
                openid: openid
            })
            .select();

    }

}