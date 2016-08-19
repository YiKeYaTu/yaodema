/*
 *   @params
 *       初始化swiper
 * */

;(function () {
    var list = $('.swiper-slide');
    list.each((index, item) => {
        $(item).css('left', index * 100 + '%');
    });
}());
 
;(function () {

    const SPEED = 5000;

    let mySwiper = new Swiper('.swiper-container', {
        pagination : '.banner-bottom',
        autoplay : SPEED,
        loop: true
    });

}());
/*
 *   @params
 *       购物车相关控制器
 *    show  显示购物车
 *    hide  隐藏购物车
 *    changeUrl  改变确定按钮跳转URL
 * */
let buyCarController = (function () {

    let shadow = $('#shadow'),
        buyCar = $('#bottom-buy');

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

(function () {

    $('#shadow')
        .on('click', () => {
            buyCarController.hide();
        });

}());
/*
 *   @params
 *       购物车相关
 * */
(function () {

    $('#bottom > button').eq(1).on('click', (e) => {
        
        buyCarController.show();

    })

}());
/*
 *   @params
 *   进入页面是否直接跳出购物车
 * */
(function () {

    if (window.location.search.match(/buy_now=1/)) {

        buyCarController.show();

    }

}());

(function () {
    let button = $('#info-con > button'),
        inf = $('.item-detail-inf-box > p');

    const AJAX_URL = '/home/detail/get_item_inf';

    let defaultId = 0;
    let cache = {};

    let formData = (function () {

        let itemTrd = $('.item-trd'),   
            priceDetail = $('.price-detail'),
            itemDetailInf = $('.item-detail-inf');

        return function (obj) {

            itemTrd.html(obj.del_descript);
            priceDetail.html(obj.del_prize);
            itemDetailInf.html(`

                ${obj.del_taste} 包装方式：包装品牌：${obj.del_box}<br>
                包含：${obj.del_component}<br>

                规格: 8连包<br>
                产地: 中国大陆<br>   
                保质期：180 天<br>

            `);

        }

    }());

    button
        .on('click', (e) => {

            let target = $(e.target);

            let buttonId = target.attr('data-index-id');
            let ajaxId = target.attr('data-item-id');

            getItemInf(ajaxId);

            button.eq(defaultId).css({
                background: '#fff',
                color: '#ccac86'
            });
            button.eq(buttonId).css({
                background: '#ccac86',
                color: '#fff'
            });

            defaultId = buttonId;

        });

    

    function getItemInf (id) {

        if (cache[id]) {
            return formData(cache[id]);
        }

        $.get(AJAX_URL, {item_id: id}, (res) => {

            cache[id] = res.data;
            formData(res.data);

        });
    }

}());

(function () {

    let buyButton = $('.kouwei-con > button'),
        buyInf = $('.buy-inf');

    let defaultId = 0;
    let itemId = buyButton.eq(0).attr('data-item-id');

    let rediectUrl = '/home/order/pay/',
        rediectBuyCarUrl = '/home/order/dish';
    const ADD_ORDER_URL = '/home/order/add_order';
                
    buyButton
        .on('click', (e) => {

            let target = $(e.target);

            let buttonId = target.attr('data-index-id');

            buyButton
                .eq(defaultId)
                .css({
                    color: '#c93',
                    background: '#fff',
                });
            buyInf.eq(defaultId).css('display', 'none');

            target
                .css({
                    color: '#fff',
                    background: '#c93',
                });
            buyInf.eq(buttonId).css('display', 'block');

            defaultId = buttonId;
            itemId = target.eq(0).attr('data-item-id');

        });

    $('.num-con')
        .on('click', (e) => {
            bindButtonEvent($(e.target));
        });

    $('.confirm')
        .on('click', (e) => {
            
            loadController.show();

            $.post(ADD_ORDER_URL, {
                goods_id: itemId,
                od_num: $('.no-border').html()
            }, (res) => {
                loadController.hide();
                if (res.errno > 0) {

                    alert(res.errmsg);
                } else {

                    window.location.href = `${rediectUrl}?order_id=${res.data.orderId}`;

                }

            });

        });

    $('.join')
        .on('click', (e) => {

            window.location.href = `${rediectBuyCarUrl}?item_id=${itemId}`;

        });

    function bindButtonEvent (target) {

        let num;

        target = $(target);

        if (target.hasClass('reduce')) {

            num = parseInt(target.next().html()) - 1 || 1;

            target.next().html(num);

        } else if (target.hasClass('add')) {

            num = parseInt(target.prev().html()) + 1;

            target.prev().html(num);

        }

        if (num) {

            target
                .parents('.item-el')
                .attr('data-item-num', num);

        }
        

    }

}());