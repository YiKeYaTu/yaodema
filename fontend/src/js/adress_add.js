;(function () {

    let form = document.forms[0];

    $('.add')
        .on('click', (e) => {

            e.preventDefault();

            let data = getFormData();

            postFormData(data, callback);

        }); 

    function getFormData () {

        return $(form).serialize();

    }

    function postFormData (data, callback) {

        loadController.show();

        $.post('/home/adress/add_adress_inf', data, (res) => {

            callback(res.errno);

        }); 

    }

    function callback (status) {

        switch (status) {

            case 0:
                window.location.href = '/home/order/pay' + window.location.search;
                break;
            case 10002:
                alert('信息格式填写错误');
                break;
            default:
                ;

        }

        loadController.hide();

    }

}());