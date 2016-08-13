;(function () {

    let itemEl = $('.item-el'),
        itemBox = $('.item-box');

    let orderButton = $('.wx-pay');

    let adressId = $('.adress-box').attr('data-adress-id');

    let payArr = [];

    itemBox.on('click', (e) => {

        bindButtonEvent(e.target);

    }); 

    orderButton.on('click', (e) => {

        e.preventDefault();

        itemEl.each((index, item) => {

            let itemInf = getItemInf(item);
            payArr.push(itemInf);

        });

        order(payArr, (res) => {

            if (res.errno === 0) {

                WeixinJSBridge.invoke(

                    'getBrandWCPayRequest', {
                        "appId" : res.data.appId,     
                        "timeStamp": res.data.timeStamp,           
                        "nonceStr" : res.data.nonceStr,      
                        "package" : res.data.package,     
                        "signType" : res.data.signType,        
                        "paySign" : res.data.paySign  
                    },
                    
                    function(res){

                        if(res.err_msg == "get_brand_wcpay_request：ok" ) {}   

                    }
                ); 

            } else {

                alert(JSON.stringify(res));

            }

        });

        payArr = [];

    });

    function order (orderData, callback) {

        let obj = {
            adressId: adressId,
            orderData: orderData
        };

        console.log(obj);

        $.ajax({

            type: 'POST',
            url: '/home/order/get_order',
            data: JSON.stringify(obj),
            dataType: 'json',
            contentType: 'application/json',
            success: (data) => {
                callback(data);
            }
            
        });

    }

    function getItemInf (item) {

        if (!item.attr) {
            item = $(item);
        }

        return {

            itemId: item.attr('data-item-id'),
            itemNum: item.attr('data-item-num'),

        }

    }

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