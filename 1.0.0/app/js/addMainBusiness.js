var addBusinessInfo;
window.onload = function () {
    addBusinessInfo = $.getStore('addBusinessInfo');
    searCommerces();
};

function searCommerces() {
    if (addBusinessInfo) {
        var data = JSON.parse(addBusinessInfo);
        console.log(data);
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
        var event = event || window.event;
        console.log(event.keyCode);
        if (event.keyCode == 13 || event.keyCode == 32) {
            var val = $(this).val();
            if (val == "") {
                alert("请输入");
            } else {
                $(".busBox").css("display", "block");
                $(".busBox").append("<span>" + val + "</span>");
                $(this).val('');
            }
        } else if (event.keyCode == 8) {
            var val = $(this).val();
            if (val == "") {
                var len = $(".businessBox span").length;
                console.log($(".businessBox span:eq(" + (len - 1) + ")").text());
                $(".busBox span:eq(" + (len - 1) + ")").remove();

            }
        }
        event.stopPropagation();
    });

    $(".main").on("click", "ul li", function () {
        $(".busBox").css("display", "block");
        $(".busBox").append("<span>" + $(this).text() + "</span>");
    });


    $("#TopmodalBtn").on('click', function () {
        var contentArr = [];
        if ($(".busBox span").length > 5) {
            $.MessagePrompt({
                text: '主营业务不能超过5个！',
                callback: function () {
                    return;
                }
            });
        } else {
            for (var i = 0; i < $(".busBox span").length; i++) {
                contentArr.push($($(".busBox span")[i]).text());
            }
            console.log(contentArr);

            //修改储存在浏览器的 ”addBusinessInfo“的值  后面的值必须是json
            //之前储存的json 有position_name值就修改他否则新增
            $.setStore('addBusinessInfo', {
                business: contentArr.removeDup()
            });
            $.MessagePrompt({
                text: '信息保存成功！',
                type: 2,
                callback: function () {
                    window.location.href = '../components/addBusiness.html';
                }
            });
        }


    });


}