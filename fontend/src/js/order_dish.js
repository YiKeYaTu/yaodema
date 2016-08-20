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

(function () {

    $('.kouwei-con').on('click', function(e){
        console.log($('.kouwei-con').children());
        $('.kouwei-con').children().map(function(i){

            $(i).css({color: '#fff', background: 'rgb(204, 172, 134)'})
        })

        $(e.target).css({color: '#cc9933', background: '#fff'})

    })

}());

(function(){

    $('.add').on('click', function(){
        $('.no-border').innerHTML = parseInt($('.no-border').innerHTML)++;
    })
    $('.app').on('click', function(){
        if(parseInt($('.no-border').innerHTML > 0)
        $('.no-border').innerHTML = parseInt($('.no-border').innerHTML)--;
    })

}())


