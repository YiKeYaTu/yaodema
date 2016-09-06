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
            adress: {
                type: think.model.HAS_ONE,
                key: 'od_adress_id',
                fKey: 'id'
            }
        };
    }

}