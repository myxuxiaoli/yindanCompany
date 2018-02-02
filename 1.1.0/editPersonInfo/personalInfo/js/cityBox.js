$('.letter ul li').on('click', 'a', function () {
    var s = $(this).html();
    $(window).scrollTop($('#' + s + '1').offset().top);
});
//热门城市数据请求
window.onload = function () {
    positioning();
    hotCities();
    selectCity();
};
//定位
function positioning() {
    //跨域（可跨所有域名）
    $.getScript("http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js", function () {
        console.log(remote_ip_info.city);
        $(".main .position em").html(remote_ip_info.city + "市");
    });
}
//热门城市数据请求
function hotCities() {
    $.changeAjax({
        url: 'cityApi/selectAllName.do',
        callback: function (res) {
            console.log(res);
            var cities = res.data.hotCity;
            var str = '';
            for (var i = 0; i < cities.length; i++) {
                str = "<em>" + cities[i] + "</em>";
                $(".main .hotCity .cities").append($(str));
            }
        }
    });
}
//选择城市后传值
function selectCity() {
    $('.main .position').on('click', 'em', function () {
        var val = $(this).text();
        $.setStore('userInfo', {
            city: val
        });
        window.location.href = './index.html';
    });
    $('.main .hotCity .cities').on('click', 'em', function () {
        var val = $(this).text();
        $.setStore('userInfo', {
            city: val
        });
        window.location.href = './index.html';
    });
    $('.city .city-list').on('click', 'p', function () {
        var val = $(this).text();
        $.setStore('userInfo', {
            city: val
        });
        window.location.href = './index.html';
    });
}