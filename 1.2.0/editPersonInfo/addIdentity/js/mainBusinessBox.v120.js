var identityInfo;
window.onload = function () {
    identityInfo = $.getStore('identityInfo');
    searCommerces();
};

function searCommerces() {
    var tagArr = [];
    if (identityInfo) {
        tagArr = JSON.parse(identityInfo);
        var str = "";
        if (tagArr.business != undefined && tagArr.business.length != 0) {
            for (var i = 0; i < tagArr.business.length; i++) {
                if (tagArr.business[i] != "" && tagArr.business[i] != null) {
                    str += "<div class='spanItems'><span>" + tagArr.business[i] + "</span><p>删除</p></div>";
                }
            }
            str += '<input type="text" placeholder="添加标签">';
            $(".businessBox").html(str);
        } else {
            $(".businessBox").html('<input type="text" placeholder="添加标签">');
        }
    }
    // input输入框输入时的数据请求
    $(".businessBox").on('input', "input", function () {
        var key = $(this).val();
        var id = tagArr.industry_id;
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
                    $(".main ul").show();
                    $(".main ul").html(str);
                }
            });
        } else {
            $(".main ul").hide();
        }
    });
    $(".businessBox").on("click", ".spanItems", function (ev) {
        var oEvent = ev || event;
        $(".spanItems p").hide();
        $(this).children("p").show();
        oEvent.stopPropagation();
    });
    $(".businessBox").on("click", ".spanItems p", function () {
        $(".businessBox .spanItems:eq(" + ($(this).parents(".spanItems").index()) + ")").remove();
    });
    $(".businessBox").on('keyup', "input", function (event) {
        var val = $(this).val();
        if (event.keyCode == 13) {
            if (val != "") {
                if ($(".businessBox span").length < 5) {
                    $(".businessBox input").remove();
                    $(".businessBox").append("<div class='spanItems'><span>" + val + "</span><p>删除</p></div><input type='text' placeholder='添加标签'>");
                    $(this).val('');
                    $(".businessBox input").focus();
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
            var len = $(".businessBox .spanItems").length;
            if (val == "") {
                if ($(".businessBox .spanItems:eq(" + (len - 1) + ")").attr("state") == 1) {
                    // $(".businessBox .spanItems:eq(" + (len - 1) + ")").remove();
                } else {
                    $(".businessBox .spanItems:eq(" + (len - 1) + ")").attr("state", 1);
                    $(".businessBox .spanItems:eq(" + (len - 1) + ") p").css({
                        "display": "block"
                    });
                }
                $(".businessBox .spanItems").attr("state", 0);
            }
        }
        event.stopPropagation();
    });
    $(".main").on("click", "ul li", function () {
        if ($(".businessBox .spanItems").length < 5) {
            $(".businessBox input").remove();
            $(".businessBox").append("<div class='spanItems'><span>" + $(this).text() + "</span><p>删除</p></div><input type='text' placeholder='添加标签'>");

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
        var contentArr = [];
        if ($(".businessBox span").length >= 1) {
            if ($(".businessBox .spanItems").length <= 5) {
                for (var i = 0; i < $(".businessBox span").length; i++) {
                    contentArr.push($($(".businessBox span")[i]).text());
                }
                console.log(contentArr);
                $.setStore("identityInfo", {
                    business: contentArr.removeDup()
                });
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
        } else {
            $.setStore("identityInfo", {
                business: contentArr.removeDup()
            });
            $.MessagePrompt({
                text: '确定不选择主营业务吗？',
                type: 1,
                callback: function () {
                    window.location.href = './index.html';
                }
            });
        }



    });
    $("body").on('click', function () {
        $(".spanItems p").hide();
    });
}