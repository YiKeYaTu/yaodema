let loadController = (function () {

    let container = $('.loading');

    function show () {

        container.css('display', 'block');

    }

    function hide () {

        container.css('display', 'none');

    }

    return {

        show: show,
        hide: hide

    }

}());