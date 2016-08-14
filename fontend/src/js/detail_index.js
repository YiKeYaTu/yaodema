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