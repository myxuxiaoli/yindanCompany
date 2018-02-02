window.onload = function () {
    chooseIndustry();
}

function chooseIndustry() {
    $.changeAjax({
        url: "industryApi/selectAllIndustry.do",
        callback: function (res) {
            var str = '';
            for (var item of res.data) {
                str += '<li data-id=' + item.industry_id + '>' + item.industry_name + '</li>';
            }
            $(".main ul").html(str);
        }
    });
}
$('.main ul').on('click', "li", function () {
    var val = $(this).text();
    var id = parseInt($(this).attr('data-id'));
    console.log(val);
    $.setStore('enterprise', {
        industry_name: val,
        industry_id: id
    });
    window.location.href = '../components/editBusiness.html';
});
//没有保存就返回时的事件
$('.giveUpEdit').click(function (e) {
    e = window.event || e;
    var obj = e.srcElement || e.target;
    if (!$(obj).is(".submitBtn")) {
        $.MessagePrompt({
            text: '确认放弃选择行业吗？',
            callback: function () {
                window.location.href = "../components/editBusiness.html";
            }
        });
    }
});