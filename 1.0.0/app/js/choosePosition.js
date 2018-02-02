window.onload = function () {
    searchRanks();
};



function searchRanks() {
    var enterprise = $.getStore('enterprise');
    if (enterprise) {
        var data = JSON.parse(enterprise);
        console.log(data);
        $(".content span").text(data.position_name[0]);

    }
    // input输入框输入时的数据请求
    $(".main input").on('input', function () {
        var key = $(this).val();
        if (key.length > 0) {
            $.changeAjax({
                url: 'resourcesPositionApi/selectVaguePosition.do',
                data: {
                    type: 1,
                    positionName: key,
                    requestType: 'h5'
                },
                callback: function (res) {
                    console.log(res)
                    var str = '';
                    for (var item of res.data) {
                        str += "<li>" + item.position_name + "</li>";
                    }
                    $(".main ul").html(str);
                }
            });
        }
    });


    $(".main ul").on("click", "li", function () {
        $(".content span").text($(this).text());

    });
    // enter键13，BackSpace键8，空格键32
    $(".main input").bind('keydown', function (event) {
        if (event.keyCode == '13') {
            $(".content span").text($(this).val());
        }
    });
    $("#TopmodalBtn").on('click', function () {
        $.setStore("enterprise", {
            position_name: [$(".main .content span").text()]
        });
        console.log(JSON.parse($.getStore("enterprise")));
        //修改储存在浏览器的 ”enterprise“的值  后面的值必须是json
        //之前储存的json 有position_name值就修改他否则新增

        $.MessagePrompt({
            text: '信息保存成功！',
            type: 2,
            callback: function () {
                window.location.href = '../components/editBusiness.html';
            }
        });

    });


}