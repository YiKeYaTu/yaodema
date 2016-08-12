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

            callback(res.status);

        }); 

    }

    function callback (status) {

        switch (status) {

            case 200:
                window.location.href = "/home/adress/choose?msg=地址保存成功";
                break;
            case 400:
                alert('信息格式填写错误');
                break;
            default:
                ;

        }

        loadController.hide();

    }

}());