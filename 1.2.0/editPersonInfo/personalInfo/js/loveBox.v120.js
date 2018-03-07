var userInfo;
window.onload = function () {
    userInfo = $.getStore('userInfo');
    searCommerces();
};

function searCommerces() {
    var tagArr = [];
    if (userInfo) {
        tagArr = JSON.parse(userInfo);
        console.log(tagArr);
        var str = "";
        if (tagArr.hobby != undefined && tagArr.hobby.length != 0) {
            for (var i = 0; i < tagArr.hobby.length; i++) {
                if (tagArr.hobby[i] != "" && tagArr.hobby[i] != null) {
                    str += "<div class='spanItems'><span>" + tagArr.hobby[i] + "</span><p>删除</p></div>";
                }
            }
            str += '<input type="text" placeholder="添加标签">';
            $(".businessBox").html(str);
        }
    }


    function checkArr(arr1) {
        var str = '';
        var s = false;
        for (var i = 0; i < arr1.length; i++) {
            s = false;
            if (tagArr.hobby != undefined && tagArr.hobby.length != 0) {
                for (var j = 0; j < tagArr.hobby.length; j++) {
                    if (arr1[i].hobby_name == tagArr.hobby[j]) {
                        s = true;
                    }
                }
            }

            if (s) {
                str += "<li class='liHave'>" + arr1[i].hobby_name + "</li>";
            } else {
                str += "<li class='liNo'>" + arr1[i].hobby_name + "</li>";
            }
        }
        return str;
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
                $(".main ul").html(checkArr(res.data));
            }
        });
    }
    industries();
    $(".businessBox").on("click", ".spanItems", function (ev) {
        var oEvent = ev || event;
        $(".spanItems p").hide();
        $(this).children("p").show();
        oEvent.stopPropagation();
    });
    $(".businessBox").on("click", ".spanItems p", function () {
        console.log($(this).parents(".spanItems").index());
        for (var i = 0; i < $(".main ul li").length; i++) {
            if ($(".main ul li")[i].innerHTML == $(".businessBox .spanItems:eq(" + ($(this).parents(".spanItems").index()) + ")").children("span").text()) {
                $(".main ul li")[i].className = 'liNo';
            }
        }
        $(".businessBox .spanItems:eq(" + ($(this).parents(".spanItems").index()) + ")").remove();
    });
    // 输入框事件
    $(".businessBox").on('keyup', "input", function (event) {
        var event = event || window.event;
        var val = $(this).val();
        if (event.keyCode == 13) {
            console.log($(this).val().length);
            if (val.length <= 5) {
                if (val == "") {
                    alert("请输入");
                } else {
                    if ($(".businessBox span").length < 10) {
                        $(".businessBox input").remove();
                        $(".businessBox").append("<div class='spanItems'><span>" + val + "</span><p>删除</p></div><input type='text' placeholder='添加标签'>");
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
            if (val == "") {
                var len = $(".businessBox .spanItems").length;
                console.log($(".businessBox .spanItems:eq(" + (len - 1) + ")").text());
                if ($(".businessBox .spanItems:eq(" + (len - 1) + ")").attr("state") == 1) {
                    // $(".businessBox .spanItems:eq(" + (len - 1) + ")").remove();
                    // for (var i = 0; i < $(".industryItems li").length; i++) {
                    //     if ($(".industryItems li")[i].innerHTML == $(".businessBox .spanItems:eq(" + (len - 1) + ")").children("span").text()) {
                    //         $(".industryItems li")[i].className = 'liNo';
                    //     }
                    // }
                } else {
                    $(".businessBox .spanItems:eq(" + (len - 1) + ")").attr("state", 1);
                    $(".businessBox .spanItems:eq(" + (len - 1) + ") p").css({
                        "display": "block"
                    });
                }
            }
        }
        event.stopPropagation();
    });
    $(".main").on("click", "ul li", function () {
        if ($(this).hasClass("liNo")) {
            $(this).attr("class", "liHave");
            if ($(".businessBox .spanItems").length < 10) {
                $(".businessBox input").remove();
                $(".businessBox").append("<div class='spanItems'><span>" + $(this).text() + "</span><p>删除</p></div><input type='text' placeholder='添加标签'>");
            } else {
                $.MessagePrompt({
                    text: '兴趣爱好标签不能超过10个！',
                    callback: function () {
                        return;
                    }
                });
            }
        }

    });
    //保存
    $("#TopmodalBtn").on('click', function () {
        var contentArr = [];
        if ($(".businessBox span").length >= 1) {
            if ($(".businessBox span").length <= 10) {
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
        } else {
            $.setStore("userInfo", {
                hobby: contentArr.removeDup()
            });
            $.MessagePrompt({
                text: '确定不选择兴趣爱好吗？',
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