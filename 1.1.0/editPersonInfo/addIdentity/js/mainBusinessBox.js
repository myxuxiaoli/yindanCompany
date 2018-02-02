var identityInfo;
window.onload = function () {
    identityInfo = $.getStore('identityInfo');
    searCommerces();
};

function searCommerces() {
    if (identityInfo) {
        var data = JSON.parse(identityInfo);
        console.log(data);
        var str = "";
        if (data.business != undefined && data.business.length != 0) {
            for (var i = 0; i < data.business.length; i++) {
                str += "<span>" + data.business[i] + "</span>";
            }
            $(".content span").html(str);
        }
    }
    // input输入框输入时的数据请求
    $(".main input").on('input', function () {
        var key = $(this).val();
        var id = data.industry_id;
        if (key.length > 0) {
            $.changeAjax({
                url: 'businessInformationApi/queryIndustryBusiness.do',
                data: {
                    industryId: id,
                    businessContent: key,
                    requestType: 'h5'
                },
                callback: function (res) {
                    var str = '';
                    for (var item of res.data) {
                        str += "<li>" + item.business_content + "</li>";
                    }
                    $(".main ul").html(str);
                }
            });
        }
    });
    $(".main input").on('keyup', function (event) {
        if (event.keyCode == 13 || event.keyCode == 32) {
            var val = $(this).val();
            if (val == "") {
                alert("请输入");
            } else {
                if ($(".businessBox span").length < 5) {
                    $(".businessBox").append("<span>" + val + "</span>");
                    $(this).val('');
                } else {
                    $.MessagePrompt({
                        text: '主营业务标签不能超过5个！',
                        callback: function () {
                            return;
                        }
                    });
                }
            }
        } else if (event.keyCode == 8) {
            var val = $(this).val();
            if (val == "") {
                var len = $(".businessBox span").length;
                console.log($(".businessBox span:eq(" + (len - 1) + ")").text());
                $(".businessBox span:eq(" + (len - 1) + ")").remove();
            }
        }
        event.stopPropagation();
    });
    $(".main").on("click", "ul li", function () {
        if ($(".businessBox span").length < 5) {
            $(".businessBox").append("<span>" + $(this).text() + "</span>");

        } else {
            $.MessagePrompt({
                text: '主营业务标签不能超过5个！',
                callback: function () {
                    return;
                }
            });
        }
    });
    $("#TopmodalBtn").on('click', function () {
        if ($(".businessBox span").length <= 5) {

            var contentArr = [];
            for (var i = 0; i < $(".businessBox span").length; i++) {
                contentArr.push($($(".businessBox span")[i]).text());
            }
            console.log(contentArr);
            $.setStore("identityInfo", {
                business: contentArr.removeDup()
            });
            $.setStore("title", {
                id: 1
            });

            //修改储存在浏览器的 ”enterprise“的值  后面的值必须是json
            //之前储存的json 有position_name值就修改他否则新增

            $.MessagePrompt({
                text: '信息保存成功！',
                type: 2,
                callback: function () {
                    window.location.href = './index.html';
                }
            });
        } else {
            $.MessagePrompt({
                text: '主营业务不能超过5个！',
                callback: function () {
                    return;
                }
            });

        }


    });
}