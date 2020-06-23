var page_id = 1;
$(document).ready(function () {
    if (getUrlParam('page_id') != null) {
        page_id = parseInt(getUrlParam('page_id'));
    }
    $.ajax({
        url: '/api/ranklist/',
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
                        '<th scope="row">' + data.data[i].rank + '</th>\n' +
                        '<td><a target="_blank" href="/user/?username=' + data.data[i].username + '">' + data.data[i].username + '</td>\n' +
                        '<td><span class="badge badge-success">' + data.data[i].count + '</span> 题</td>\n' +
                        '</tr>';
                    $("tbody").append(htmlElement);
                }
                $("#current-page").text(page_id);
                if (data.has_previous === 1) {
                    $("#previous-page").show();
                    $("#previous-page").attr("href", "/ranklist/?page_id=" + (page_id - 1));
                    $("#current-page-minus-1").show();
                    $("#current-page-minus-1").attr("href", "/ranklist/?page_id=" + (page_id - 1));
                    $("#current-page-minus-1").text(page_id - 1);
                } else {
                    $("#previous-page").hide();
                    $("#current-page-minus-1").hide();
                }
                if (data.has_next === 1) {
                    $("#next-page").show();
                    $("#next-page").attr("href", "/ranklist/?page_id=" + (page_id + 1));
                    $("#current-page-plus-1").show();
                    $("#current-page-plus-1").attr("href", "/ranklist/?page_id=" + (page_id + 1));
                    $("#current-page-plus-1").text(page_id + 1);
                } else {
                    $("#next-page").hide();
                    $("#current-page-plus-1").hide();
                }
                if (page_id > 2) {
                    $("#current-page-minus-2").show();
                    $("#current-page-minus-2").attr("href", "/ranklist/?page_id=" + (page_id - 2));
                    $("#current-page-minus-2").text(page_id - 2);
                } else {
                    $("#current-page-minus-2").hide();
                }
                if (page_id < data.num_pages - 1) {
                    $("#current-page-plus-2").show();
                    $("#current-page-plus-2").attr("href", "/ranklist/?page_id=" + (page_id + 2));
                    $("#current-page-plus-2").text(page_id + 2);
                } else {
                    $("#current-page-plus-2").hide();
                }
            }
        },
    });
});