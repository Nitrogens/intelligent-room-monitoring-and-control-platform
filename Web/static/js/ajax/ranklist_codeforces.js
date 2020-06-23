var page_id = 1;

$(document).ready(function () {
    if (getUrlParam('page_id') != null) {
        page_id = parseInt(getUrlParam('page_id'));
    }
    $.ajax({
        url: '/api/ranklist/codeforces/',
        dataType: 'json',
        async: true,
        type: 'GET',
        data: {
            page_id: page_id,
        },
        success: function (data) {
            if (data.message === "OK") {
                $("tbody").text("");
                ratingColorClass = "";
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i].rating >= 2400) {
                        ratingColorClass = 'user-red';
                    } else if (data.data[i].rating >= 2100) {
                        ratingColorClass = 'user-orange';
                    } else if (data.data[i].rating >= 1900) {
                        ratingColorClass = 'user-violet';
                    } else if (data.data[i].rating >= 1600) {
                        ratingColorClass = 'user-blue';
                    } else if (data.data[i].rating >= 1400) {
                        ratingColorClass = 'user-cyan';
                    } else if (data.data[i].rating >= 1200) {
                        ratingColorClass = 'user-green';
                    } else {
                        ratingColorClass = 'user-gray';
                    }
                    var htmlElement = '<tr>\n' +
                        '<th scope="row">' + data.data[i].rank + '</th>\n' +
                        '<td><a target="_blank" href="/user/?username=' + data.data[i].username + '">' + data.data[i].username +
                        '<td><span class="badge ' + ratingColorClass + '">' + data.data[i].rating + '</span></td>\n' +
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