"use strict";var buyCarController=function(){function o(o){n.css("display",o),e.css("display",o)}var n=$("#shadow"),e=$("#bottom");return{show:function(){o("block")},hide:function(){o("none")}}}(),orderKeeper=function(){var o={};return{keep:function(n){o[n]=n},"delete":function(n){delete o[n]},toReq:function(){var n="";for(var e in o)o.hasOwnProperty(e)&&(n+=e+"|");return n.slice(0,-1)}}}();!function(){$("#shadow").on("click",function(){buyCarController.hide()})}(),function(){var o=window.location.search.match(/item_id=.+/);o&&buyCarController.show()}(),function(){$(".order-con").on("click",function(){var o=$(this),n=o.children(".choose").children(".choose-inner");n.hasClass("choosed")?(orderKeeper["delete"](o.attr("data-order-id")),n.removeClass("choosed")):(orderKeeper.keep(o.attr("data-order-id")),n.addClass("choosed"))})}(),function(){$(".choose-all").on("click",function(){$(".order-con").each(function(o,n){return n.click()})})}(),function(){var o="/home/order/pay/";$(".wx-pay").on("click",function(n){return n.preventDefault(),orderKeeper.toReq()?void(window.location.href=o+"?order_id="+orderKeeper.toReq()):alert("你没有选取任何订单额")})}(),function(){$(".kouwei-con").on("click",function(o){$(o.target).css({color:"#fff",background:"rgb(204, 172, 134)"})})}(),function(){$(".add").on("click",function(){$(".no-border").innerHTML=$(".no-border").innerHTML++}),$(".app").on("click",function(){$(".no-border").innerHTML=$(".no-border").innerHTML--})}();