var userId;
var userInfo;
window.onload = function () {
    userId = $.getStore("userId").replace(/(^\s*)|(\s*$)/g, "");
    userInfo = JSON.parse($.getStore("userInfo"));
    console.log(userId);
    console.log(userInfo);
    if (userId) {
        personInfo();
        dataBefore();
    }
};

// 数据请求之前——函数
function dataBefore() {
    $(".moreBtn").on("click", function () {
        $(".hideInfos").show();
        $(".moreBtn").hide();
    });
    $(".mySex").on("click", function () {
        $(".sexBox").css("display", "block");
    });
    $(".sexBox ul").on("click", "li", function () {
        $(".user_sex").text($(this).text());
        $(".sexBox").css("display", "none");
        $.setStore("userInfo", {
            user_sex: $(this).text()
        });
        console.log(JSON.parse($.getStore("userInfo")));
    });
    $(".goodAtBox").on("click", function () {
        window.location.href = "./myGoodAt.html";
    });
    $(".cityBox").on("click", function () {
        window.location.href = "./cityBox.html";
    });
    $(".homeBox").on("click", function () {
        window.location.href = "./homeBox.html";
    });
    $(".loveBox").on("click", function () {
        window.location.href = "./loveBox.html";
    });
    $(".introductionBox").on("click", function () {
        window.location.href = "./introductionBox.html";
    });
    $(".wantToBox").on("click", function () {
        window.location.href = "./wantToBox.html";
    });
}
dataBefore();

function personInfo() {
    if (userInfo) {
        if (userInfo.user_name) {
            $(".user_name").val(userInfo.user_name);
            $(".user_name").css("color", "#7e8185");
        }
        if (userInfo.user_sex) {
            $(".user_sex").text(userInfo.user_sex);
            $(".user_sex").css("color", "#7e8185");
        }

        if (userInfo.strongField != undefined && userInfo.strongField.length != 0) {
            var str1 = "";
            console.log(userInfo.strongField);
            str1 += '<span>' + userInfo.strongField.join("，") + '</span>';
            $(".goodAt").html(str1);
            $(".goodAt span").css("color", "#7e8185");
            if (userInfo.strongField.length == 1 && userInfo.strongField[0] == null) {
                $(".goodAt").html('<span>请选择</span>');
            } else if (userInfo.strongField.length == 1 && userInfo.strongField[0] == "") {
                $(".goodAt").html('<span>请选择</span>');
            }
        }
        if (userInfo.city) {
            $(".city").text(userInfo.city);
            $(".city").css("color", "#7e8185");
        }
        if (userInfo.hometown) {
            $(".hometown").text(userInfo.hometown);
            $(".hometown").css("color", "#7e8185");
        }
        if (userInfo.graduate_from) {
            $(".graduate_from").val(userInfo.graduate_from);
            $(".graduate_from").css("color", "#7e8185");
        }
        if (userInfo.personal_signature) {
            $(".ownIntro").text(userInfo.personal_signature);
            $(".ownIntro").css("color", "#7e8185");
        }
        if (userInfo.expectStrong != undefined && userInfo.expectStrong.length != 0) {
            var str2 = "";
            str2 += '<span>' + userInfo.expectStrong.join("，") + '</span>';
            $(".wantToKnow").html(str2);
            $(".wantToKnow span").css("color", "#7e8185");
            if (userInfo.expectStrong.length == 1 && userInfo.expectStrong[0] == "") {
                $(".wantToKnow").html('<span>请选择</span>');
            } else if (userInfo.expectStrong.length == 1 && userInfo.expectStrong[0] == null) {
                $(".wantToKnow").html('<span>请选择</span>');
            }
        }
        if (userInfo.hobby != undefined && userInfo.hobby.length != 0) {
            var str3 = "";
            str3 += '<span>' + userInfo.hobby.join("，") + '</span>';
            $(".hobbies").html(str3);
            $(".hobbies span").css("color", "#7e8185");
            if (userInfo.hobby.length == 1 && userInfo.hobby[0] == "") {
                $(".hobbies").html('<span>请选择</span>');
            } else if (userInfo.hobby.length == 1 && userInfo.hobby[0] == null) {
                $(".hobbies").html('<span>请选择</span>');
            }
        }
        if (userInfo.head_portrait_url && userInfo.head_portrait_url != "") {
            $(".userImg img").attr("src", userInfo.head_portrait_url);
        }
    }
    $(".graduate_from").on("keyup", function () {
        $.setStore("userInfo", {
            graduate_from: $(this).val()
        });
        console.log(JSON.parse($.getStore("userInfo")));
    });
    $(".user_name").on("keyup", function () {
        $.setStore("userInfo", {
            user_name: $(this).val()
        });
        console.log(JSON.parse($.getStore("userInfo")));
    });

}
//保存
$(".submitBtn").on("click", function () {
    var base = new Base64();
    var newuserId = base.encode(userId.toString()).replace(/\=/g, "*");
    var data = JSON.parse($.getStore("userInfo"));
    if (data) {
        console.log(data);
        $.changeAjax({
            url: 'userApi/updateUserInformation.do',
            data: {
                userId: userId,
                userName: data.user_name,
                userSex: data.user_sex,
                hometown: data.hometown,
                city: data.city,
                graduateFrom: data.graduate_from,
                personalSignature: data.personal_signature,
                hobbyStr: data.hobby.join(","),
                strongFieldStr: data.strongField.join(","),
                expectStrongStr: data.expectStrong.join(","),
                requestType: 'h5'
            },
            callback: function (res) {
                console.log(res);
                $.MessagePrompt({
                    text: '信息保存成功！',
                    type: 2,
                    callback: function () {
                        window.location.href = "../index.html?userId=" + newuserId;
                    }
                });
            }
        });
    }

});
$(function () {
    pushHistory(); //这个必须在文档加载时就触发，创建出来的新的history实体  
    window.addEventListener("popstate", function (e) { //popstate 只有在history实体被改变时才会触发  
        var base = new Base64();
        var newuserId = base.encode(userId.toString()).replace(/\=/g, "*");
        // window.location.href = "../index.html?userId=" + newuserId; //根据自己的需求实现自己的功能
        $.MessagePrompt({
            text: '确定放弃编辑个人信息吗？',
            type: 1,
            callback: function () {
                window.location.href = "../index.html?userId=" + newuserId;
            }
        });
    }, false);

    function pushHistory() {
        var state = {
            title: "title",
            url: "#"
        };
        window.history.pushState(state, "title", "#");
    }

});