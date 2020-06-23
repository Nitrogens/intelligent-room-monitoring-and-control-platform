$("#submit").click(function () {
    if ($("#username").val() === "" || $("#password").val() === "") {
        $("#message").css("display", "block");
        $("#message").text("请输入完整的用户名和密码！")
    } else {
        $.ajax({
            url: '/api/login/',
            dataType: 'json',
            async: true,
            type: 'POST',
            data: {
                username: $("#username").val(),
                password: $("#password").val(),
            },
            success: function (data) {
                if (data.message === "Failed") {
                    $("#message").css("display", "block");
                    $("#message").text("用户名或密码错误！")
                } else {
                    window.location.href = "/";
                }
            },
        });
    }
});