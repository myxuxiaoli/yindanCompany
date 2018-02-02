var userInfo;
window.onload = function () {
    userInfo = $.getStore('userInfo');
    searCommerces();
};

function searCommerces() {
    if (userInfo) {
        var data = JSON.parse(userInfo);
        console.log(data);
        var str = "";
        if (data.hobby != undefined && data.hobby.length != 0) {
            for (var i = 0; i < data.hobby.length; i++) {
                str += "<span>" + data.hobby[i] + "</span>";
            }
            $(".content span").html(str);
        }
    }

    // 所有兴趣爱好的数据请求
    function industries() {
        $.changeAjax({
            url: 'hobbyApi/selectAllHobby.do',
            data: {
                requestType: 'h5'
            },
            callback: function (res) {
                console.log(res);
                var str = '';
                for (var item of res.data) {
                    str += "<li>" + item.hobby_name + "</li>";
                }
                $(".main ul").html(str);
            }
        });
    }
    industries();
    // 输入框事件
    $(".main input").on('keyup', function (event) {
        var event = event || window.event;
        if (event.keyCode == 13 || event.keyCode == 32) {
            console.log($(this).val().length);
            var val = $(this).val();
            if (val.length <= 5) {
                if (val == "") {
                    alert("请输入");
                } else {
                    if ($(".businessBox span").length < 10) {
                        $(".businessBox").append("<span>" + val + "</span>");
                        $(this).val('');
                    } else {
                        $.MessagePrompt({
                            text: '兴趣爱好标签不能超过10个！',
                            callback: function () {
                                return;
                            }
                        });
                    }
                }
            } else {
                $.MessagePrompt({
                    text: '单个标签不能超过5个字！',
                    callback: function () {
                        return;
                    }
                });
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
        if ($(".businessBox span").length < 10) {
            $(".businessBox").append("<span>" + $(this).text() + "</span>");

        } else {
            $.MessagePrompt({
                text: '兴趣爱好标签不能超过10个！',
                callback: function () {
                    return;
                }
            });
        }
    });
    //保存
    $("#TopmodalBtn").on('click', function () {
        if ($(".businessBox span").length <= 10) {

            var contentArr = [];
            for (var i = 0; i < $(".businessBox span").length; i++) {
                contentArr.push($($(".businessBox span")[i]).text());
            }
            console.log(contentArr);
            $.setStore("userInfo", {
                hobby: contentArr.removeDup()
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
                text: '兴趣爱好标签不能超过10个！',
                callback: function () {
                    return;
                }
            });

        }


    });




}