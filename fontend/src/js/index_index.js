/*
 *   @params
 *       初始化swiper
 * */
;(function () {

    const SPEED = 5000;

    let mySwiper = new Swiper('.swiper-container', {
        pagination : '.slider-bottom',
        autoplay : SPEED,
        loop: true,
    });

    $('.swiper-wrapper')
        .children('*').each((index, item) => {
            $(item).css('left', index * 10 + 'rem');
    });

    let swiperPaginationBullet = $('.swiper-pagination-bullet');

    swiperPaginationBullet
        .eq(0)
        .css('margin-left', ( 10 - swiperPaginationBullet.length * 17 / 64) / 2 + 'rem');

}());
/*
 *   @params
 *       懒加载
 * */
;(function () {

    let body = document.body,
        windowInnerHeight = window.innerHeight,
        itemOuter = $('#all-item-outer');

    let pageNum = -1,
        getNum = 4;

    let getFlag = true;

    const GET_ITEM_DATA_URL = '/home/index/getnewgoods';

    const DISTANCE = windowInnerHeight * 0.1;
    const LOAD_DATA_SPEED = 1000;

    function isNearBottom () {
        return body.scrollTop + windowInnerHeight >= body.offsetHeight - DISTANCE;
    }

    function formItemData (res) {

        let item;

        res.data.forEach((it, index) => {
            item = $('<div class="item-el"></div>');
            item.html(`
                <a href="/home/detail/index?item_id=${it.goodsId}">
                <div class="item-image" style="background: url(/static/imgs/covers/${it.cover}) no-repeat; background-size: cover;">
                </div>
                </a>
                <div class="item-inf">
                    ${it.descript}
                </div>
                <div class="buy-item">
                    <div class="item-price">
                    <span class='item-price-icon'>￥</span>
                    <span class='item-price-content'>${it.prize}</span>
                    <img class='buy-button' src='/static/imgs/buy_car_b.png' data-itemId='${it.goodsId}'>
                    </div>
                </div>
            `);
            item.appendTo(itemOuter);
            item.on('click', function (e) {

                let target = $(e.target);

                if (target.hasClass('buy-button')) {
                    console.log(1);
                    let id = parseInt( $( target ).attr('data-itemId') );
                    window.location.href = `/home/order/dish?item_id=${id}`;
                }

            })

        });

        overLoad(res);

        getFlag = true;

    }

    function overLoad (res) {
        if (res.data.length === 0) {
            clearInterval(timer);
            $('.loading-msg')
                .html('没有更多了');
        }
    }

    function getItemData () {
        $.get(GET_ITEM_DATA_URL, {
            page_num: ++pageNum,
            get_num: getNum,
        }, (res) => {
            formItemData(res);
        });
    }

    function loadData () {
        if (isNearBottom() && getFlag) {
            getFlag = false;
            getItemData();
        }
    }

    let timer = setInterval(loadData, LOAD_DATA_SPEED);

}());


(function () {

    $('.buy-button').on('click', function (e) {

            let target = $(e.target);

            if (target.hasClass('buy-button')) {
                console.log(1);
                let id = parseInt( $( target ).attr('data-itemId') );
                window.location.href = `/home/order/dish?item_id=${id}`;
            }

        })

}());