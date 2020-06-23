var verdictData = ['正确通过' ,'答案错误', '运行超时', '内存超限', '运行错误' ,'格式错误', '编译错误', '其他错误'];
// $(document).ready(function () {
//     $("#username").text(getUrlParam("username"));
//     $.ajax({
//     url: '/api/stat/user/',
//     dataType: 'json',
//     async: true,
//     type: 'GET',
//     data: {
//         username: getUrlParam("username"),
//     },
//     success: function (data) {
//         if (data.message === "OK") {
//             $("#accepted-submission").text(data.data.accepted_submission_total);
//             $("#codeforces-rating").text(data.data.codeforces_rating);
//             $("#problem-rank").text(data.data.problem_rank);
//             $("#codeforces-rating-rank").text(data.data.codeforces_rating_rank);
//             if (data.data.codeforces_rating >= 2400) {
//                 $("#codeforces-rating").attr('class', 'cp-dashboard-unit badge badge-pill user-red');
//             } else if (data.data.codeforces_rating >= 2100) {
//                 $("#codeforces-rating").attr('class', 'cp-dashboard-unit badge badge-pill user-orange');
//             } else if (data.data.codeforces_rating >= 1900) {
//                 $("#codeforces-rating").attr('class', 'cp-dashboard-unit badge badge-pill user-violet');
//             } else if (data.data.codeforces_rating >= 1600) {
//                 $("#codeforces-rating").attr('class', 'cp-dashboard-unit badge badge-pill user-blue');
//             } else if (data.data.codeforces_rating >= 1400) {
//                 $("#codeforces-rating").attr('class', 'cp-dashboard-unit badge badge-pill user-cyan');
//             } else if (data.data.codeforces_rating >= 1200) {
//                 $("#codeforces-rating").attr('class', 'cp-dashboard-unit badge badge-pill user-green');
//             } else {
//                 $("#codeforces-rating").attr('class', 'cp-dashboard-unit badge badge-pill user-gray');
//             }
//         }
//     }
// });
//     $.ajax({
//         url: '/api/stat/verdict/',
//         dataType: 'json',
//         async: true,
//         type: 'GET',
//         data: {
//             username: getUrlParam("username"),
//         },
//         success: function (data) {
//             if (data.message === "OK") {
//                 var myChart = echarts.init(document.getElementById("chart-status"));
//                 var option = {
//                     tooltip: {
//                         trigger: 'item',
//                         formatter: "{b}<br>{c} ({d}%)"
//                     },
//                     textStyle: {
//                         fontSize: 14,
//                     },
//                     series: [
//                         {
//                             name: '提交状态分布',
//                             type: 'pie',
//                             radius: '60%',
//                             center: ['50%', '50%'],
//                             data: [],
//                             itemStyle: {
//                                 emphasis: {
//                                     shadowBlur: 10,
//                                     shadowOffsetX: 0,
//                                     shadowColor: 'rgba(0, 0, 0, 0.5)'
//                                 }
//                             }
//                         }
//                     ]
//                 };
//                 for (var i = 0; i < verdictData.length; i++) {
//                     var dataDict = {
//                         value: parseInt(data.data[i].verdict_count),
//                         name: verdictData[parseInt(data.data[i].verdict_id)],
//                     };
//                     option.series[0].data[i] = dataDict;
//                 }
//                 myChart.setOption(option);
//             }
//         }
//     });
//     $.ajax({
//         url: '/api/stat/oj/',
//         dataType: 'json',
//         async: true,
//         type: 'GET',
//         data: {
//             username: getUrlParam("username"),
//         },
//         success: function (data) {
//             if (data.message === "OK") {
//                 var myChart = echarts.init(document.getElementById("chart-oj"));
//                 var option = {
//                     tooltip: {
//                         trigger: 'item',
//                         formatter: "{b}<br>{c} ({d}%)"
//                     },
//                     textStyle: {
//                         fontSize: 14,
//                     },
//                     series: [
//                         {
//                             name: '提交状态分布',
//                             type: 'pie',
//                             radius: '60%',
//                             center: ['50%', '50%'],
//                             data: [],
//                             itemStyle: {
//                                 emphasis: {
//                                     shadowBlur: 10,
//                                     shadowOffsetX: 0,
//                                     shadowColor: 'rgba(0, 0, 0, 0.5)'
//                                 }
//                             }
//                         }
//                     ]
//                 };
//                 for (var i = 0; i < data.data.length; i++) {
//                     var dataDict = {
//                         value: parseInt(data.data[i].oj_count),
//                         name: data.data[i].oj_name,
//                     };
//                     option.series[0].data[i] = dataDict;
//                 }
//                 myChart.setOption(option);
//             }
//         }
//     });
//     $.ajax({
//         url: '/api/codeforces_contest/',
//         dataType: 'json',
//         async: true,
//         type: 'GET',
//         data: {
//             username: getUrlParam("username"),
//         },
//         success: function (data) {
//             if (data.message === "OK") {
//                 var myChart = echarts.init(document.getElementById("chart-codeforces"));
//                 var option = {
//                     tooltip: {
//                         trigger: 'axis',
//                         formatter: function (contest) {
//                             var htmlStr = "";
//                             htmlStr += contest[0].data.datas.new_rating;
//                             if (contest[0].data.datas.rating_change >= 0) {
//                                 htmlStr += (' (+' + contest[0].data.datas.rating_change + ')<br>');
//                             } else {
//                                 htmlStr += (' (' + contest[0].data.datas.rating_change + ')<br>');
//                             }
//                             htmlStr += (contest[0].data.datas.name + '<br>');
//                             htmlStr += ('排名：' + contest[0].data.datas.rank + '<br>');
//                             return htmlStr;
//                         }
//                     },
//                     grid: {
//                         left: '3%',
//                         right: '4%',
//                         bottom: '3%',
//                         containLabel: true
//                     },
//                     xAxis: [
//                         {
//                             type: 'category',
//                             boundaryGap: false,
//                             data: []
//                         }
//                     ],
//                     yAxis: [
//                         {
//                             type: 'value',
//                             min: function (value) {
//                                 return value.min - 200;
//                             },
//                             max: function (value) {
//                                 return value.max + 100;
//                             },
//                         }
//                     ],
//                     series: [
//                         {
//                             name: '邮件营销',
//                             type: 'line',
//                             stack: '总量',
//                             areaStyle: {},
//                             data: []
//                         },
//                     ]
//                 };
//                 for (var i = 0; i < data.data.length; i++) {
//                     option.xAxis[0].data.push(data.data[i].contest_id);
//                     option.series[0].data.push({
//                         value: data.data[i].new_rating, datas: {
//                             name: data.data[i].name,
//                             new_rating: data.data[i].new_rating,
//                             rating_change: data.data[i].rating_change,
//                             rank: data.data[i].rank,
//                         }
//                     });
//                 }
//                 myChart.setOption(option);
//             }
//         }
//     });
//     $.ajax({
//         url: '/api/stat/monthly/',
//         dataType: 'json',
//         async: true,
//         type: 'GET',
//         data: {
//             username: getUrlParam("username"),
//         },
//         success: function (data) {
//             if (data.message === "OK") {
//                 var myChart = echarts.init(document.getElementById("chart-monthly"));
//                 var option = {
//                     tooltip: {
//                         trigger: 'axis',
//                         formatter: "{b}<br>{c} 题"
//                     },
//                     textStyle: {
//                         fontSize: 16,
//                     },
//                     xAxis: {
//                         type: 'category',
//                         data: []
//                     },
//                     yAxis: {
//                         type: 'value'
//                     },
//                     series: [{
//                         data: [],
//                         type: 'bar'
//                     }]
//                 };
//                 for (var i = 0; i < data.data.length; i++) {
//                     option.xAxis.data.push(data.data[i].time);
//                     option.series[0].data.push(data.data[i].count);
//                 }
//                 myChart.setOption(option);
//             }
//         }
//     });
// });
// $("#update-data").click(function () {
//     alert("已发送更新请求！请等待几分钟后再返回该页面，谢谢！")
//     sync(getUrlParam('username'));
// });