let buyCarController = (function () {

    let shadow = $('#shadow'),
        buyCar = $('#bottom');

    function controllSH (display) {

        shadow.css('display', display);
        buyCar.css('display', display);

    }

    return {

        show () {
            controllSH('block');
        },

        hide () {
            controllSH('none');
        }

    }

}());

let orderKeeper = (function () {

    let keepObj = {};

    return {

        keep (orderId) {
            keepObj[orderId] = orderId;
        },

        delete (orderId) {
            delete keepObj[orderId];
        },

        toReq () {

            let str = '';

            for (let key in keepObj) {

                if (keepObj.hasOwnProperty(key)) {
                    str += key + '|';
                }

            }

            return str.slice(0, -1);
        }

    }

}());

(function () {

    $('#shadow')
        .on('click', () => {buyCarController.hide()});

}());

(function () {

    let itemId = window.location.search.match(/item_id=.+/);

    if (itemId) buyCarController.show();

}());

(function () {

    $('.order-con')
        .on('click', function () {

            let target = $(this);
            let inner = target
                .children('.choose')
                .children('.choose-inner');

 
            if (inner.hasClass('choosed')) {
                orderKeeper.delete(target.attr('data-order-id'));
                inner.removeClass('choosed');

            } else {
                orderKeeper.keep(target.attr('data-order-id'));
                inner.addClass('choosed');

            }

        });

}());

(function () {

    $('.choose-all')
        .on('click', function () {

            $('.order-con').each((index, item) => item.click());

        })

}());

(function () {

    const ORDER_URL = '/home/order/pay/';

    $('.wx-pay')
        .on('click', (e) => {

            e.preventDefault();

            if (!orderKeeper.toReq()) return alert('你没有选取任何订单额');

            window.location.href = `${ORDER_URL}?order_id=${orderKeeper.toReq()}`;

        });

}());
