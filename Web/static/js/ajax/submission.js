var page_id = 1;

$(document).ready(function () {
    if (getUrlParam('page_id') != null) {
        page_id = parseInt(getUrlParam('page_id'));
    }
    $.ajax({
        url: '/api/submission/',
        dataType: 'json',
        async: true,
        type: 'GET',
        data: {
            page_id: page_id,
        },
        success: function (data) {
            if (data.message === "OK") {
                $("tbody").text("");
                for (var i = 0; i < data.data.length; i++) {
                    var htmlElement = '<tr>\n' +
                        '<th scope="row">' + data.data[i].id + '</th>\n' +
                        '<td><a target="_blank" href="/user/?username=' + data.data[i].user + '">' + data.data[i].user +
                        '<td>' + data.data[i].time + '</td>\n' +
                        '<td><span class="badge badge-primary"><i class="fas fa-question-circle"></i> ' + data.data[i].oj_name + '-' + data.data[i].problem_id + '</span></td>\n';
                    if (parseInt(data.data[i].verdict) === 0) {
                        htmlElement += '<td><span class="badge badge-success"><i class="fas fa-check-circle"></i>正确通过</span></td>\n'
                    } else if (parseInt(data.data[i].verdict) === 1) {
                        htmlElement += '<td><span class="badge badge-danger"><i class="fas fa-times-circle"></i>答案错误</span></td>';
                    } else if (parseInt(data.data[i].verdict) === 2) {
                        htmlElement += '<td><span class="badge badge-warning"><i class="fas fa-hourglass-end"></i>运行超时</span></td>';
                    } else if (parseInt(data.data[i].verdict) === 3) {
                        htmlElement += '<td><span class="badge badge-warning"><i class="fas fa-database"></i>内存超限</span></td>';
                    } else if (parseInt(data.data[i].verdict) === 4) {
                        htmlElement += '<td><span class="badge badge-danger"><i class="fas fa-exclamation-triangle"></i>运行错误</span></td>';
                    } else if (parseInt(data.data[i].verdict) === 5) {
                        htmlElement += '<td><span class="badge badge-warning"><i class="fas fa-times-circle"></i>输出格式错误</span></td>';
                    } else if (parseInt(data.data[i].verdict) === 6) {
                        htmlElement += '<td><span class="badge badge-info"><i class="fas fa-spinner"></i>编译错误</span></td>';
                    } else {
                        htmlElement += '<td><span class="badge badge-dark"><i class="fas fa-poll"></i>其他结果</span></td>';
                    }
                    htmlElement += '</tr>';
                    $("tbody").append(htmlElement);
                }
                $("#current-page").text(page_id);
                if (data.has_previous === 1) {
                    $("#previous-page").show();
                    $("#previous-page").attr("href", "/submission/?page_id=" + (page_id - 1));
                    $("#current-page-minus-1").show();
                    $("#current-page-minus-1").attr("href", "/submission/?page_id=" + (page_id - 1));
                    $("#current-page-minus-1").text(page_id - 1);
                } else {
                    $("#previous-page").hide();
                    $("#current-page-minus-1").hide();
                }
                if (data.has_next === 1) {
                    $("#next-page").show();
                    $("#next-page").attr("href", "/submission/?page_id=" + (page_id + 1));
                    $("#current-page-plus-1").show();
                    $("#current-page-plus-1").attr("href", "/submission/?page_id=" + (page_id + 1));
                    $("#current-page-plus-1").text(page_id + 1);
                } else {
                    $("#next-page").hide();
                    $("#current-page-plus-1").hide();
                }
                if (page_id > 2) {
                    $("#current-page-minus-2").show();
                    $("#current-page-minus-2").attr("href", "/submission/?page_id=" + (page_id - 2));
                    $("#current-page-minus-2").text(page_id - 2);
                } else {
                    $("#current-page-minus-2").hide();
                }
                if (page_id < data.num_pages - 1) {
                    $("#current-page-plus-2").show();
                    $("#current-page-plus-2").attr("href", "/submission/?page_id=" + (page_id + 2));
                    $("#current-page-plus-2").text(page_id + 2);
                } else {
                    $("#current-page-plus-2").hide();
                }
            }
        },
    });
});