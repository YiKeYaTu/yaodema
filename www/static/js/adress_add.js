"use strict";!function(){function o(){return $(r).serialize()}function n(o,n){loadController.show(),$.post("/home/adress/add_adress_inf"+window.location.search,o,function(o){n(o.errno)})}function e(o){switch(o){case 0:window.location.href="/home/order/pay"+window.location.search;break;case 10002:alert("信息格式填写错误")}loadController.hide()}var r=document.forms[0];$(".add").on("click",function(r){r.preventDefault();var a=o();n(a,e)})}();