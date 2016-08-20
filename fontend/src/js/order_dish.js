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

        $('.kouwei-con').children('button').map(function(i, item){

            $(item).css({color: '#cc9933', background: '#fff'})

        })  

        $(e.target).css({color: '#fff', background: '#cc9933'})

    })

    $('.add').on('click', function(){

        if($('.no-border')[0].innerHTML > 0){

            $('.no-border')[0].innerHTML = parseInt( $('.no-border')[0].innerHTML ) - 1;
        }

    });
    
    $('.app').on('click', function(){
 
            $('.no-border')[0].innerHTML = parseInt( $('.no-border')[0].innerHTML ) + 1;

    });

    $('.confirm').on('click', function(){
        let id = null;
        $('.kouwei-con').children('button').map(function(i, item){

            console.log( $(item).css('color') );

            if( $(item).css('color') == 'rgb(255, 255, 255)'){
                id = item.id;
            }

        });

        if(!id){
            alert('请选择口味');
            return;
        }

        let num = parseInt($('.no-border')[0].innerHTML);

        $.ajax({
            type: 'POST',
            url: 'http://www.hangeer1996.com/home/order/add_order',
            data: { goods_id: id, od_num: num },
            timeout: 300,
            context: $('body'),
            success: function(data){
                alert('添加购物车成功');
                window.location.href = "http://www.hangeer1996.com";
            },
            error: function(xhr, type){
              alert('Ajax error!')
            }
        })

    });
}());



