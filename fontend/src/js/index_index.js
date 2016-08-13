/*
 *   @params
 *       初始化swiper
 * */
;(function () {

    const SPEED = 5000;

    let mySwiper = new Swiper('.swiper-container', {
        pagination : '.banner-bottom',
        autoplay : SPEED,
    });

}());
/*
 *   @params
 *       懒加载
 * */
;(function () {

    let body = document.body,
        windowInnerHeight = window.innerHeight,
        itemOuter = $('#all-item-outer');

    let pageNum = 0,
        getNum = 8;

    let getFlag = true;

    const GET_ITEM_DATA_URL = '';

    const DISTANCE = windowInnerHeight * 0.1;
    const LOAD_DATA_SPEED = 1000;

    function isNearBottom () {
        return body.scrollTop + windowInnerHeight >= body.offsetHeight - DISTANCE;
    }

    function formItemData (res) {

        let item;

        res = [1, 1, 1, 1];

        res.forEach((item, index) => {

            item = $('<div class="item-el"></div>');
            item.html(`
                <div class="item-image"></div>
                <div class="item-inf">
                    深刻忧郁浪漫基诺就像一个旧时代的时代个旧
                </div>
                <div class="buy-item">
                    <div class="item-price">
                    <span class='item-price-icon'>￥</span>
                    <span class='item-price-content'>1000</span>
                    <img class='buy-button' src='../imgs/buy_car_b.png'>
                    </div>
                </div>
            `)
            item.appendTo(itemOuter);

        });

        overLoad();

        getFlag = true;

    }

    function overLoad (res) {
        if (res.length === 0) {
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

    // let timer = setInterval(loadData, LOAD_DATA_SPEED);

}());