'use strict';
/**
 * logic
 * @param  {} []
 * @return {}     []
 */
export default class extends think.logic.base {

    addAdressInfAction () {

        let rules = {
            'user-name': 'required|string',
            'user-call': 'required|int|length:11',
            'user-adress': 'required|string|maxLength:100',
        }

        let flag = this.validate(rules);

        if (!flag) {

            return this.fail(10002);

        }

    }
}