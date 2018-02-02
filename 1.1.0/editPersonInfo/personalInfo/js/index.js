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
            str1 += '<span>' + userInfo.strongField.join("，") + '</span>';
            $(".goodAt").html(str1);
            $(".goodAt span").css("color", "#7e8185");
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
        }
        if (userInfo.hobby != undefined && userInfo.hobby.length != 0) {
            var str3 = "";
            str3 += '<span>' + userInfo.hobby.join("，") + '</span>';
            $(".hobbies").html(str3);
            $(".hobbies span").css("color", "#7e8185");
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
    var newuserId = base.encode(userId.toString());
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

pushHistory();

function pushHistory() {
    var state = {
        title: "title",
        url: "#"
    };
    window.history.pushState(state, "title", "#");
}
window.onpopstate = function (e) {
    var base = new Base64();
    var newuserId = base.encode(userId.toString());
    e = window.event || e;
    var obj = e.srcElement || e.target;
    if (!$(obj).is(".submitBtn")) {
        $.MessagePrompt({
            text: '确认放弃修改个人信息吗？',
            callback: function () {
                location.href = "../index.html?userId=" + newuserId;
            }
        });
    }
};