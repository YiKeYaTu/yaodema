"use strict";var buyCarController=function(){function e(e){o.css("display",e),r.css("display",e)}var o=$("#shadow"),r=$("#bottom");return{show:function(){e("block")},hide:function(){e("none")}}}(),orderKeeper=function(){var e={};return{keep:function(o){e[o]=o},"delete":function(o){delete e[o]},toReq:function(){var o="";for(var r in e)e.hasOwnProperty(r)&&(o+=r+"|");return o.slice(0,-1)}}}();!function(){$("#shadow").on("click",function(){buyCarController.hide()})}(),function(){var e=window.location.search.match(/item_id=.+/);e&&buyCarController.show()}(),function(){$(".order-con").on("click",function(){var e=$(this),o=e.children(".choose").children(".choose-inner");o.hasClass("choosed")?(orderKeeper["delete"](e.attr("data-order-id")),o.removeClass("choosed")):(orderKeeper.keep(e.attr("data-order-id")),o.addClass("choosed"))})}(),function(){$(".choose-all").on("click",function(){$(".order-con").each(function(e,o){return o.click()})})}(),function(){var e="/home/order/index";$(".wx-pay").on("click",function(o){return o.preventDefault(),orderKeeper.toReq()?void(window.location.href=e+"?order_id="+orderKeeper.toReq()):alert("你没有选取任何订单额")})}();