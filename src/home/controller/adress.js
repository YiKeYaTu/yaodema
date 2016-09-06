'use strict';

import Base from './base.js';

export default class extends Base {

    async addAction () {

        await this.checkUserInf();

        return this.display();

    }

    async addAdressInfAction () {

        let userName = this.post('user-name'),
            userCall = this.post('user-call'),
            userAdress = this.post('user-adress');

        let userInf = await this.checkUserInf(); 

        if (!userInf) {

            return this.fail(10001)

        }

        let adressModel = this.model('adress');

        let id = await adressModel.add({
            'user_name': userName,
            'user_call': userCall,
            'ad_detail': userAdress,
            'is_default': 0,
            'openid': userInf.openid
        });

        await this.model('adress').setDefault(id, userInf.openid);

        return this.success();

    }

    async chooseAction () {

        let userInf = await this.checkUserInf();

        let data = this.model('adress').getAdress(userInf.openid);

        let orderId = this.get('order_id');

        this.assign('data', data);
        this.assign('orderId', orderId);

        return this.display();

    }

    async deleteAction(){

        let userInf = await this.checkUserInf();

        let data = this.model('adress').getAdress(userInf.openid);

        let id = this.get('id');

        await this.model('adress').deleteOne(id, userInf);  //  这里应该传用户openid

        this.redirect(`/home/adress/choose?order_id=${this.get('order_id')}`);
    }

    async setdefaultAction(){
        let userInf = await this.checkUserInf();

        let data = this.model('adress').getAdress(userInf.openid);

        let id = this.get('id');

        await this.model('adress').setDefault(id, userInf.openid);  //  这里应该传用户openid

        this.redirect(`/home/order/pay/?order_id=${this.get('order_id')}`);
    }
    
}