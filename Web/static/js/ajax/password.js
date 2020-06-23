$("#submit").click(function () {
    if ($("#current-password").val() === ""
        || $("#new-password").val() === ""
        || $("#new-password-confirm").val() === "") {
        $("#message").css("display", "block");
        $("#message").text("请输入完整的信息！");
    } else if ($("#new-password").val() != $("#new-password-confirm").val()) {
        $("#message").css("display", "block");
        $("#message").text("两次密码输入不一致！")
    } else {
        $.ajax({
            url: '/api/password/',
            dataType: 'json',
            async: true,
            type: 'POST',
            data: {
                current_password: $("#current-password").val(),
                new_password: $("#new-password").val(),
            },
            success: function (data) {
                if (data.message === "Failed") {
                    $("#message").css("display", "block");
                    $("#message").text("修改失败！")
                } else {
                    $("#message").css("display", "block");
                    $("#message").text("修改成功！")
                }
            },
        });
    }
});