$("#submit").click(function () {
    $.ajax({
        url: '/api/logout/',
        dataType: 'json',
        async: true,
        type: 'GET',
        data: {
        },
        success: function (data) {
            $.ajax({
                url: '/api/user/',
                dataType: 'json',
                async: true,
                type: 'DELETE',
                data: {
                    username: username,
                },
                success: function (data) {
                    window.location.href = '/';
                },
            });
        },
    });
});