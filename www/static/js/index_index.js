"use strict";!function(){var n=5e3;new Swiper(".swiper-container",{pagination:".banner-bottom",autoplay:n,loop:!0})}(),function(){function n(){return o.scrollTop+s>=o.offsetHeight-m}function t(n){var t=void 0;n.data.forEach(function(n,i){t=$('<div class="item-el"></div>'),t.html('\n                <a href="/home/detail/index?item_id='+n.goodsId+'">\n                <div class="item-image" style="background: url(/static/imgs/covers/'+n.cover+') no-repeat; background-size: cover;">\n                </div>\n                </a>\n                <div class="item-inf">\n                    '+n.descript+"\n                </div>\n                <div class=\"buy-item\">\n                    <div class=\"item-price\">\n                    <span class='item-price-icon'>￥</span>\n                    <span class='item-price-content'>"+n.prize+"</span>\n                    <img class='buy-button' src='/static/imgs/buy_car_b.png' data-itemId='"+n.goodsId+"'>\n                    </div>\n                </div>\n            "),t.appendTo(c)}),i(n),l=!0}function i(n){0===n.data.length&&(clearInterval(p),$(".loading-msg").html("没有更多了"))}function e(){$.get(u,{page_num:++d,get_num:r},function(n){t(n)})}function a(){n()&&l&&(l=!1,e())}var o=document.body,s=window.innerHeight,c=$("#all-item-outer"),d=-1,r=4,l=!0,u="/home/index/getnewgoods",m=.1*s,g=1e3,p=setInterval(a,g)}(),function(){$("body").on("click",function(n){var t=$(n.target);t.hasClass("buy-button")&&(window.location.href="/home/order/dish?item_id="+parseInt(t.attr("data-itemId")))})}();