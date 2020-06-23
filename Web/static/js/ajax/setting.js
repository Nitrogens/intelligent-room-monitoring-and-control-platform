$(document).ready(function () {
    $.ajax({
        url: '/api/user/',
        dataType: 'json',
        async: true,
        type: 'GET',
        data: {
            username: username,
        },
        success: function (data) {
            $('#nickname').val(data.data.nickname);
            $('#email').val(data.data.email);
            $('#codeforces-username').val(data.data.oj_username.CodeForces);
            $('#vjudge-username').val(data.data.oj_username.VJudge);
            $('#hdoj-username').val(data.data.oj_username.HDOJ);
            $('#poj-username').val(data.data.oj_username.POJ);
            $("#submit").click(function () {
                if ($("#nickname").val() === ""
                    || $("#email").val() === "") {
                    $("#message").css("display", "block");
                    $("#message").text("请输入完整的信息！");
                } else {
                    $.ajax({
                        url: '/api/user/',
                        dataType: 'json',
                        async: true,
                        type: 'PUT',
                        data: {
                            username: username,
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
                                $("#message").text("修改失败！")
                            } else {
                                sync(username);
                                $("#message").css("display", "block");
                                $("#message").text("修改成功！")
                            }
                        },
                    });
                }
            });
        },
    });
});