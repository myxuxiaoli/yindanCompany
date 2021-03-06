var userInfo;
window.onload = function () {
    userInfo = $.getStore('userInfo');
    searCommerces();
};

function searCommerces() {
    var tagArr = [];
    //页面打开显示已有的标签
    if (userInfo) {
        tagArr = JSON.parse(userInfo);
        var str = "";
        if (tagArr.expectStrong != undefined && tagArr.expectStrong.length != 0) {
            console.log(tagArr.expectStrong);
            for (var i = 0; i < tagArr.expectStrong.length; i++) {
                if (tagArr.expectStrong[i] != "" && tagArr.expectStrong[i] != null) {
                    str += "<div class='spanItems'><span>" + tagArr.expectStrong[i] + "</span><p>删除</p></div>";
                }
            }
            str += '<input type="text" placeholder="添加标签">';
            $(".businessBox").html(str);
        }
    }
    //判断Arr1中是否有与tagArr.expectStrong中相同的项
    function checkArr(arr1) {
        var str = '';
        var s = false;
        for (var i = 0; i < arr1.length; i++) {
            s = false;
            if (tagArr.expectStrong != undefined && tagArr.expectStrong.length != 0) {
                for (var j = 0; j < tagArr.expectStrong.length; j++) {
                    if (arr1[i] == tagArr.expectStrong[j]) {
                        s = true;
                    }
                }
            }

            if (s) {
                str += "<li class='liHave'>" + arr1[i] + "</li>";
            } else {
                str += "<li class='liNo'>" + arr1[i] + "</li>";
            }
        }
        return str;
    }
    // 左边行业以及热门部分右边内容的数据请求
    function industries() {
        $.changeAjax({
            url: 'expectStrongApi/selectAllHotExpectStrong.do',
            callback: function (res) {
                var data = res.data;
                console.log(data);
                if (data != undefined && data.length != 0) {
                    var strLeft = "";
                    var strRight = "";
                    for (var i = 0; i < data.length; i++) {
                        strLeft += '<li>' + data[i].industry_name + '</li>';
                    }
                    for (var k = 0; k < data[0].expectStrong.length; k++) {
                        strRight = checkArr(data[0].expectStrong);
                    }
                    $(".industryTags").html(strLeft);
                    $(".industryItems").html(strRight);
                    $(".industryTags li:nth-child(1)").addClass("active");
                }
            }
        });
    }
    industries();
    //行业标签的点击事件
    $(".industryTags").on("click", "li", function () {
        console.log(tagArr.expectStrong);
        $(".industryTags li").removeClass("active");
        $(this).addClass("active");
        var liIndex = $(this).index();
        $.changeAjax({
            url: 'expectStrongApi/selectAllHotExpectStrong.do',
            callback: function (res) {
                var data = res.data;
                if (data != undefined && data.length != 0) {
                    var strRight = "";
                    console.log(data[liIndex]);
                    for (var k = 0; k < data[liIndex].expectStrong.length; k++) {
                        strRight = checkArr(data[liIndex].expectStrong);
                    }
                    $(".industryItems").html(strRight);
                }
            }
        });
    });
    //顶部已选择的擅长领域标签的点击事件
    $(".businessBox").on("click", ".spanItems", function (ev) {
        var oEvent = ev || event;
        $(".spanItems p").hide();
        $(this).children("p").show();
        oEvent.stopPropagation();
    });
    //删除按钮的点击事件
    $(".businessBox").on("click", ".spanItems p", function () {
        console.log($(this).parents(".spanItems").index());
        //arr.splice($.inArray('b',arr),1);删除b这个元素 ，前提是不知道b在这个数组的下标
        tagArr.expectStrong.splice($.inArray($(this).parents(".spanItems").find("span").text(), tagArr.expectStrong), 1);
        for (var i = 0; i < $(".industryItems li").length; i++) {
            if ($(".industryItems li")[i].innerHTML == $(".businessBox .spanItems:eq(" + ($(this).parents(".spanItems").index()) + ")").children("span").text()) {
                $(".industryItems li")[i].className = 'liNo';
            }
        }
        $(".businessBox .spanItems:eq(" + ($(this).parents(".spanItems").index()) + ")").remove();
    });
    //输入框事件
    $(".businessBox").on('keyup', "input", function (event) {
        var event = event || window.event;
        var val = $(this).val();
        console.log(event.keyCode);
        if (event.keyCode == 13) {
            if (val != "") {
                if ($(".businessBox span").length < 10) {
                    $(".businessBox input").remove();
                    $(".businessBox").append("<div class='spanItems'><span>" + val + "</span><p>删除</p></div><input type='text' placeholder='添加标签'>");
                    $(this).val('');
                    $(".businessBox input").focus();
                } else {
                    $.MessagePrompt({
                        text: '期待结识标签不能超过10个！',
                        callback: function () {
                            return;
                        }
                    });
                }
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
    //右边期待结识标签的点击事件
    $(".industryItems").on("click", "li", function () {
        if ($(this).hasClass("liNo")) {
            $(this).attr("class", "liHave");
            if ($(".businessBox .spanItems").length < 10) {
                tagArr.expectStrong.push($(this).text());
                console.log(tagArr.expectStrong);
                $(".businessBox input").remove();
                $(".businessBox").append("<div class='spanItems'><span>" + $(this).text() + "</span><p>删除</p></div><input type='text' placeholder='添加标签'>");
            } else {
                $.MessagePrompt({
                    text: '期待结识标签不能超过10个！',
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
                    expectStrong: contentArr.removeDup()
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
                    text: '期待结识标签不能超过10个！',
                    callback: function () {
                        return;
                    }
                });
            }
        } else {
            $.setStore("userInfo", {
                expectStrong: contentArr.removeDup()
            });
            $.MessagePrompt({
                text: '确定不选择期待结识领域吗？',
                type: 1,
                callback: function () {
                    window.location.href = './index.html';
                }
            });
        }

    });
    //点击页面上其他部分的时候删除按钮消失
    $("body").on('click', function () {
        $(".spanItems p").hide();
    });


}