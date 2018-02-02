window.onload = function () {
    searchRanks();
};

function searchRanks() {
    var addBusinessInfo = $.getStore('addBusinessInfo');
    if (addBusinessInfo) {
        var data = JSON.parse(addBusinessInfo);
        console.log(data);
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
        $(".positionBox").css("display", "block");
        $(".content .positionBox").text($(this).text());
    });
    $(".main input").bind('keydown', function (event) {
        $(".positionBox").css("display", "block");
        $(".content .positionBox").text($(this).val());
        if ($(".content .positionBox").text() == "") {
            $(".content .positionBox").hide();
        }
    });
    $("#TopmodalBtn").on('click', function () {
        //修改储存在浏览器的 addBusinessInfo  后面的值必须是json
        //之前储存的json 有position_name值就修改他否则新增
        $.setStore('addBusinessInfo', {
            position_name: [$(".main .content .positionBox").text()]
        });
        $.MessagePrompt({
            text: '信息保存成功！',
            type: 2,
            callback: function () {
                window.location.href = '../components/addBusiness.html';
            }
        });

    });


    //没有保存就返回时的事件
    // $('.giveUpEdit').click(function (e) {
    //     e = window.event || e;
    //     var obj = e.srcElement || e.target;
    //     if (!$(obj).is(".submitBtn")) {
    //         $.MessagePrompt({
    //             text: '确认放弃添加职位吗？',
    //             callback: function () {
    //                 window.location.href = '../components/addBusiness.html';
    //             }
    //         });
    //     }
    // });







}