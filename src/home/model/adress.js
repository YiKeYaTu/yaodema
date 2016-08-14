'use strict';
/**
 * model
 */
export default class extends think.model.relation {
    /**
     * [getAdress description]
     * 返回对应openid的用户填写的地址
     *           
     */
    async getAdress(openid){

        let data = await this
                         .model('adress')
                         .where({'openid': openid})
                         .select(); 

        return data;
    }

    async deleteOne(adressId, openid){
        let data = await this
                         .model('adress')
                         .where({
                             'id': adressId,
                             'openid': openid
                         })
                         .delete();
        return;
    }

    async setDefault(adressId, openid){
        let data = await this
                         .model('adress')
                         .where({
                            openid: openid,
                            is_default: 1
                         })
                         .update({
                            'is_default': 0
                         });
        let hehe = await this
                         .model('adress')
                         .where({
                             'id': adressId,
                             'openid': openid
                         })
                         .update({
                            'is_default': 1
                         });

        return;
    }
}