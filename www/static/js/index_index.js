"use strict";!function(){var n=5e3;new Swiper(".swiper-container",{pagination:".banner-bottom",autoplay:n})}(),function(){function n(){return o.scrollTop+c>=o.offsetHeight-m}function i(n){var i=void 0;n.data.forEach(function(n,e){i=$('<div class="item-el"></div>'),i.html('\n                <a href="/home/detail/index?item_id='+n.goodsId+'">\n                <div class="item-image" style="background: url(/static/imgs/covers/'+n.cover+') no-repeat; background-size: cover;"></div>\n                </a>\n                <div class="item-inf">\n                    '+n.descript+"\n                </div>\n                <div class=\"buy-item\">\n                    <div class=\"item-price\">\n                    <span class='item-price-icon'>￥</span>\n                    <span class='item-price-content'>"+n.prize+"</span>\n                    <img class='buy-button' src='/static/imgs/buy_car_b.png'>\n                    </div>\n                </div>\n            "),i.appendTo(s)}),e(n),l=!0}function e(n){0===n.data.length&&(clearInterval(p),$(".loading-msg").html("没有更多了"))}function t(){$.get(u,{page_num:++r,get_num:d},function(n){i(n)})}function a(){n()&&l&&(l=!1,t())}var o=document.body,c=window.innerHeight,s=$("#all-item-outer"),r=-1,d=4,l=!0,u="/home/index/getnewgoods",m=.1*c,g=1e3,p=setInterval(a,g)}();