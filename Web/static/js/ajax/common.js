function getUrlParam(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null) {
         return unescape(r[2]);
     }
     return null;
}

var urlSplit = location.href.split('/');
var actionName = urlSplit[3];
var username = '';

if (actionName === '' || actionName === '#') {
    $("#index").attr("class", "nav-item active");
} else if (actionName === 'statistics') {
    $("#statistics").attr("class", "nav-item active");
}