'use strict';

import Base from './base.js';

export default class extends Base {

    async addAction () {

        // await this.checkUserInf();

        return this.display();

    }

    async addAdressInfAction () {

        let userName = this.post('user-name'),
            userCall = this.post('user-call'),
            userAdress = this.post('user-adress');

        let userId = await this.getUserId();

        if (!userInf) {

            return this.fail(10001)

        }

        let adressModel = this.model('adress');

        await adressModel.add({
            'user_name': userName,
            'user_call': userCall,
            'ad_detail': userAdress,
            'is_default': 0,
            'user_id': userId
        });

        return this.success();

    }

    chooseAction () {

        return this.display();

    }
    
}