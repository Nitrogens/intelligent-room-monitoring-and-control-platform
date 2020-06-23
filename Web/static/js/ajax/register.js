$("#submit").click(function () {
    if ($("#username").val() === ""
        || $("#password").val() === ""
        || $("#password-confirm").val() === ""
        || $("#nickname").val() === ""
        || $("#email").val() === "") {
        $("#message").css("display", "block");
        $("#message").text("请输入完整的信息！")
    } else if ($("#password").val() != $("#password-confirm").val()) {
        $("#message").css("display", "block");
        $("#message").text("两次密码输入不一致！")
    } else {
        $.ajax({
            url: '/api/user/',
            dataType: 'json',
            async: true,
            type: 'POST',
            data: {
                username: $("#username").val(),
                password: $("#password").val(),
                nickname: $("#nickname").val(),
                email: $("#email").val(),
                oj_username: JSON.stringify(
                    {
                        CodeForces: $("#codeforces-username").val(),
                        VJudge: $("#vjudge-username").val(),
                        HDOJ: $("#hdoj-username").val(),
                        POJ: $("#poj-username").val(),
                    }
                ),
            },
            success: function (data) {
                if (data.message === "Failed") {
                    $("#message").css("display", "block");
                    $("#message").text("注册失败！")
                } else {
                    sync($("#username").val());
                    window.location.href = "/";
                }
            },
        });
    }
});