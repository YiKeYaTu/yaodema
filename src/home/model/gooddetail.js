'use strict';
/**
 * model
 */
export default class extends think.model.relation {

    init(...args){

        super.init(...args);

        this.relation = {
            
            cover: {

                type: think.model.HAS_ONE,
                key: 'g_id',
                fKey: 'g_id',

            }
        };
    }

}