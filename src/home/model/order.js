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

    getOrderInf (conf) {

        return this

            .where(conf.where)
            .setRelation(conf.setRelation || true)
            .select();

    }

    changeOrderState () {
        
    }

}