function getUrlParam(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null) {
         return unescape(r[2]);
     }
     return null;
}

// function sync(username) {
//     $.ajax({
//             url: '/api/db/submission/',
//             dataType: 'json',
//             async: true,
//             type: 'GET',
//             data: {
//                 username: username,
//             },
//     });
//     $.ajax({
//             url: '/api/db/codeforces/contest/',
//             dataType: 'json',
//             async: true,
//             type: 'GET',
//             data: {
//                 username: username,
//             },
//     });
//     $.ajax({
//             url: '/api/db/codeforces/rating/',
//             dataType: 'json',
//             async: true,
//             type: 'GET',
//             data: {
//                 username: username,
//             },
//     });
// }

var urlSplit = location.href.split('/');
var actionName = urlSplit[3];
var username = '';

if (actionName === '' || actionName === '#') {
    $("#index").attr("class", "nav-item active");
} else if (actionName === 'statistics') {
    $("#statistics").attr("class", "nav-item active");
}

// $.ajax({
//     url: '/api/login/',
//     dataType: 'json',
//     async: false,
//     type: 'GET',
//     success: function (data) {
//         if (data.message === 'Not logged') {
//             $("#navbar-right").text('');
//             $("#navbar-right").append('<li class="nav-item">\n' +
//                 '                        <a class="nav-link" href="/login">登录</a>\n' +
//                 '                    </li>\n' +
//                 '                    <li class="nav-item">\n' +
//                 '                        <a class="nav-link" href="/register">注册</a>\n' +
//                 '                    </li>')
//         } else {
//             username = data.username;
//             $("#navbar-right").text('');
//             $("#navbar-right").append('<li class="nav-item">\n' +
//                 '                        <a class="nav-link" href="/setting">' + data.username + '</a>\n' +
//                 '                    </li>' +
//                 '                    <li class="nav-item">\n' +
//                 '                        <a class="nav-link" href="#" id="logout-action">退出</a>\n' +
//                 '                    </li>');
//         }
//         $("#logout-action").click(function () {
//             $.ajax({
//                 url: '/api/logout/',
//                 dataType: 'json',
//                 async: true,
//                 type: 'GET',
//                 success: function (data) {
//                     location.reload();
//                 },
//             });
//         });
//     }
// });