$(document).ready(function () {
    $("#username").text(getUrlParam("username"));
    $.ajax({
        url: '/api/basic',
        dataType: 'json',
        async: true,
        type: 'GET',
        data: {
        },
        success: function (data) {
            if (data.message === "OK") {
                $("#temperature").text(data.data.temperature);
                $("#smoke").text(data.data.smoke);
                $("#light").text(data.data.light);
                if (data.data.smoke >= data.data.smoke_threshold) {
                    $("#smoke").attr('class', 'cp-dashboard-unit badge badge-pill badge-danger');
                } else {
                    $("#smoke").attr('class', 'cp-dashboard-unit badge badge-pill badge-success');
                }
            }
        }
    });
});

$.ajax({
        url: '/api/led',
        dataType: 'json',
        async: true,
        type: 'GET',
        data: {
        },
        success: function (data) {
            if (data.message === "OK") {
                if (Number(data.data.led_0) === Number(0)) {
                    $("#led-0").text("关闭状态");
                    $("#led-0").attr('class', 'cp-dashboard-unit badge badge-pill badge-secondary');
                } else if (Number(data.data.led_0) === Number(1)) {
                    $("#led-0").text("开启状态");
                    $("#led-0").attr('class', 'cp-dashboard-unit badge badge-pill badge-warning');
                } else if (Number(data.data.led_0) === Number(2)) {
                    $("#led-0").text("自动调整");
                    $("#led-0").attr('class', 'cp-dashboard-unit badge badge-pill badge-primary');
                }
            }
            if (data.message === "OK") {
                if (Number(data.data.led_1) === Number(0)) {
                    $("#led-1").text("关闭状态");
                    $("#led-1").attr('class', 'cp-dashboard-unit badge badge-pill badge-secondary');
                } else if (Number(data.data.led_1) === Number(1)) {
                    $("#led-1").text("开启状态");
                    $("#led-1").attr('class', 'cp-dashboard-unit badge badge-pill badge-warning');
                } else if (Number(data.data.led_1) === Number(2)) {
                    $("#led-1").text("自动调整");
                    $("#led-1").attr('class', 'cp-dashboard-unit badge badge-pill badge-primary');
                }
            }
            if (data.message === "OK") {
                if (Number(data.data.led_2) === Number(0)) {
                    $("#led-2").text("关闭状态");
                    $("#led-2").attr('class', 'cp-dashboard-unit badge badge-pill badge-secondary');
                } else if (Number(data.data.led_2) === Number(1)) {
                    $("#led-2").text("开启状态");
                    $("#led-2").attr('class', 'cp-dashboard-unit badge badge-pill badge-warning');
                } else if (Number(data.data.led_2) === Number(2)) {
                    $("#led-2").text("自动调整");
                    $("#led-2").attr('class', 'cp-dashboard-unit badge badge-pill badge-primary');
                }
            }
        }
    });

window.setInterval(function(){$.ajax({
        url: '/api/basic',
        dataType: 'json',
        async: true,
        type: 'GET',
        data: {
        },
        success: function (data) {
            if (data.message === "OK") {
                $("#temperature").text(data.data.temperature);
                $("#smoke").text(data.data.smoke);
                $("#light").text(data.data.light);
                if (data.data.smoke >= data.data.smoke_threshold) {
                    $("#smoke").attr('class', 'cp-dashboard-unit badge badge-pill badge-danger');
                } else {
                    $("#smoke").attr('class', 'cp-dashboard-unit badge badge-pill badge-success');
                }
            }
        }
    });},1000);

window.setInterval(function(){$.ajax({
        url: '/api/led',
        dataType: 'json',
        async: true,
        type: 'GET',
        data: {
        },
        success: function (data) {
            if (data.message === "OK") {
                if (Number(data.data.led_0) === Number(0)) {
                    $("#led-0").text("关闭状态");
                    $("#led-0").attr('class', 'cp-dashboard-unit badge badge-pill badge-secondary');
                } else if (Number(data.data.led_0) === Number(1)) {
                    $("#led-0").text("开启状态");
                    $("#led-0").attr('class', 'cp-dashboard-unit badge badge-pill badge-warning');
                } else if (Number(data.data.led_0) === Number(2)) {
                    $("#led-0").text("自动调整");
                    $("#led-0").attr('class', 'cp-dashboard-unit badge badge-pill badge-primary');
                }
            }
            if (data.message === "OK") {
                if (Number(data.data.led_1) === Number(0)) {
                    $("#led-1").text("关闭状态");
                    $("#led-1").attr('class', 'cp-dashboard-unit badge badge-pill badge-secondary');
                } else if (Number(data.data.led_1) === Number(1)) {
                    $("#led-1").text("开启状态");
                    $("#led-1").attr('class', 'cp-dashboard-unit badge badge-pill badge-warning');
                } else if (Number(data.data.led_1) === Number(2)) {
                    $("#led-1").text("自动调整");
                    $("#led-1").attr('class', 'cp-dashboard-unit badge badge-pill badge-primary');
                }
            }
            if (data.message === "OK") {
                if (Number(data.data.led_2) === Number(0)) {
                    $("#led-2").text("关闭状态");
                    $("#led-2").attr('class', 'cp-dashboard-unit badge badge-pill badge-secondary');
                } else if (Number(data.data.led_2) === Number(1)) {
                    $("#led-2").text("开启状态");
                    $("#led-2").attr('class', 'cp-dashboard-unit badge badge-pill badge-warning');
                } else if (Number(data.data.led_2) === Number(2)) {
                    $("#led-2").text("自动调整");
                    $("#led-2").attr('class', 'cp-dashboard-unit badge badge-pill badge-primary');
                }
            }
        }
    });},1000);

$("#led-0-0").click(function () {
    alert("指令已发送！请等待设备和前端页面响应！")
    $.ajax({
        url: '/api/setting/led-work-mode',
        dataType: 'json',
        async: true,
        type: 'GET',
        data: {
            id: 0,
            status: 0,
        },
    });
});

$("#led-0-1").click(function () {
    alert("指令已发送！请等待设备和前端页面响应！")
    $.ajax({
        url: '/api/setting/led-work-mode',
        dataType: 'json',
        async: true,
        type: 'GET',
        data: {
            id: 0,
            status: 1,
        },
    });
});

$("#led-0-2").click(function () {
    alert("指令已发送！请等待设备和前端页面响应！")
    $.ajax({
        url: '/api/setting/led-work-mode',
        dataType: 'json',
        async: true,
        type: 'GET',
        data: {
            id: 0,
            status: 2,
        },
    });
});

$("#led-1-0").click(function () {
    alert("指令已发送！请等待设备和前端页面响应！")
    $.ajax({
        url: '/api/setting/led-work-mode',
        dataType: 'json',
        async: true,
        type: 'GET',
        data: {
            id: 1,
            status: 0,
        },
    });
});

$("#led-1-1").click(function () {
    alert("指令已发送！请等待设备和前端页面响应！")
    $.ajax({
        url: '/api/setting/led-work-mode',
        dataType: 'json',
        async: true,
        type: 'GET',
        data: {
            id: 1,
            status: 1,
        },
    });
});

$("#led-1-2").click(function () {
    alert("指令已发送！请等待设备和前端页面响应！")
    $.ajax({
        url: '/api/setting/led-work-mode',
        dataType: 'json',
        async: true,
        type: 'GET',
        data: {
            id: 1,
            status: 2,
        },
    });
});

$("#led-2-0").click(function () {
    alert("指令已发送！请等待设备和前端页面响应！")
    $.ajax({
        url: '/api/setting/led-work-mode',
        dataType: 'json',
        async: true,
        type: 'GET',
        data: {
            id: 2,
            status: 0,
        },
    });
});

$("#led-2-1").click(function () {
    alert("指令已发送！请等待设备和前端页面响应！")
    $.ajax({
        url: '/api/setting/led-work-mode',
        dataType: 'json',
        async: true,
        type: 'GET',
        data: {
            id: 2,
            status: 1,
        },
    });
});

$("#led-2-2").click(function () {
    alert("指令已发送！请等待设备和前端页面响应！")
    $.ajax({
        url: '/api/setting/led-work-mode',
        dataType: 'json',
        async: true,
        type: 'GET',
        data: {
            id: 2,
            status: 2,
        },
    });
});