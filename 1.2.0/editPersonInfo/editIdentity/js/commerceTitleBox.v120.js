window.onload = function () {
    var commerceIdentityInfo = $.getStore('commerceIdentityInfo');
    var data = JSON.parse(commerceIdentityInfo);
    console.log(data);
    if (data) {
        if (data.positionName != undefined && data.positionName.length != 0) {
            $(".main .content span").css("display", "block");
            $(".content span").text(data.positionName[0]);
        }
    }
    searchRanks();
};



function searchRanks() {

    $.changeAjax({
        url: 'resourcesPositionApi/selectAllPosition.do',
        data: {
            type: 2,
            requestType: 'h5'
        },
        callback: function (res) {
            console.log(res);
            var str = '';
            for (var item of res.data) {
                str += "<li>" + item.position_name + "</li>";
            }
            $(".main ul").html(str);
        }
    });

    $(".main ul").on("click", "li", function () {
        $(".main .content span").css("display", "block");
        $(".content span").text($(this).text());

    });
    // enter键13，BackSpace键8，空格键32
    $(".main input").bind('keyup', function (event) {
        $(".main .content span").css("display", "block");
        $(".main .content span").text($(this).val());
        if (event.keyCode == '8' && $(".content span").text() == "") {
            $(".content span").css("display", "none");
        }
    });
    $("#TopmodalBtn").on('click', function () {
        console.log($(".content span").text());
        $.setStore("commerceIdentityInfo", {
            positionName: [$(".main .content span").text()]
        });
        console.log(JSON.parse($.getStore("commerceIdentityInfo")));
        //修改储存在浏览器的 ”enterprise“的值  后面的值必须是json
        //之前储存的json 有position_name值就修改他否则新增

        $.MessagePrompt({
            text: '信息保存成功！',
            type: 2,
            callback: function () {
                window.location.href = './index.html';
            }
        });

    });


}
// pushHistory();

// function pushHistory() {
//     var state = {
//         title: "title",
//         url: "#"
//     };
//     window.history.pushState(state, "title", "#");
// }
// window.onpopstate = function (e) {
//     e = window.event || e;
//     var obj = e.srcElement || e.target;
//     if (!$(obj).is("#TopmodalBtn")) {
//         $.MessagePrompt({
//             text: '确认放弃修改职位吗？',
//             callback: function () {
//                 location.href = "./index.html";
//             }
//         });
//     }
// };