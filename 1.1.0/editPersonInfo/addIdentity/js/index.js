var userId;
window.onload = function () {
    userId = $.getStore("userId").replace(/(^\s*)|(\s*$)/g, "");
    console.log(userId);
    if (userId) {
        dataBefore();
        identityInfo();

    }
};


//数据请求之前的操作——函数
function dataBefore() {
    var flag = true;
    $(".yellowRound").on("click", function () {
        if (flag == true) {
            $(".promptDiv").show(300);
            $(".yellowRoundRotate").show();
            flag = false;
        } else {
            $(".promptDiv").hide(300);
            $(".yellowRoundRotate").hide();
            flag = true;
        }
    });
    var tag = true;
    $("#businessSelected").on("click", function () {
        if (tag == true) {
            $(this).css("border", "1px solid transparent");
            $("#busselect").css("display", "block");
            $.setStore("identityInfo", {
                topIdentity: 2
            });
            console.log(JSON.parse($.getStore("identityInfo")));
            tag = false;
        } else {
            $(this).css("border", "1px solid #999");
            $("#busselect").css("display", "none");
            $.setStore("identityInfo", {
                topIdentity: 1
            });
            console.log(JSON.parse($.getStore("identityInfo")));
            tag = true;
        }

    });
    var flags = true;
    $("#commerceSelected").on("click", function () {
        if (flags == true) {
            $(this).css("border", "1px solid transparent");
            $("#comselect").css("display", "block");
            $.setStore("commerceIdInfo", {
                topIdentity: 2
            });
            console.log(JSON.parse($.getStore("commerceIdInfo")));
            flags = false;
        } else {
            $(this).css("border", "1px solid #999");
            $("#comselect").css("display", "none");
            $.setStore("commerceIdInfo", {
                topIdentity: 1
            });
            console.log(JSON.parse($.getStore("commerceIdInfo")));
            flags = true;
        }

    });
    $(".professionBox").on("click", function () {
        window.location.href = "./professionBox.html";
    });
    $(".mainBusinessBox").on("click", function () {
        $.MessagePrompt({
            text: '请确定您已经选择了主营业务所属的行业！',
            callback: function () {
                window.location.href = "./mainBusinessBox.html";
            }
        });

    });
    $(".assetBox").on("click", function () {
        window.location.href = "./assetBox.html";
    });
    $(".equityBox").on("click", function () {
        window.location.href = "./equityBox.html";
    });
    $(".positionBox").on("click", function () {
        window.location.href = "./positionBox.html";
    });
    $(".introBox").on("click", function () {
        window.location.href = "./introBox.html";
    });
    $(".commerceTitleBox").on("click", function () {
        window.location.href = "./commerceTitleBox.html";
    });

}
$('.companyName').on('keyup', function () {
    $(this).css("color", "#7e8185");
    $.setStore('identityInfo', {
        identityInformation: $(this).val()
    });
    console.log(JSON.parse($.getStore("identityInfo")));
});
$('.commerceName').on('keyup', function () {
    $(this).css("color", "#7e8185");
    $.setStore('commerceIdInfo', {
        identityInformation: $(this).val()
    });
    console.log(JSON.parse($.getStore("commerceIdInfo")));
});

function identityInfo() {
    var getRequest = $.getRequest();
    if (getRequest.state == 1) {
        $.removeStore('identityInfo');
        $.removeStore('commerceIdInfo');
    } else {
        console.log(JSON.parse($.getStore("title")));
        var titleId = JSON.parse($.getStore("title"));
        if (titleId.id == 1) {
            $.removeStore('commerceIdInfo');
            console.log(JSON.parse($.getStore("commerceIdInfo")));
            $(this).css("color", "#3385ff");
            $(".noBusiness").css("color", "#666");
            $(this).find("span").css("display", "block");
            $(".noBusiness span").css("display", "none");
            $(".main_Business").css("display", "block");
            $(".main_NoBusiness").css("display", "none");
            var identityInfo = $.getStore("identityInfo");
            if (identityInfo) {
                var data = JSON.parse($.getStore("identityInfo"));
                console.log(data);
                if (data.identityInformation) {
                    $(".companyName").val(data.identityInformation);
                    $(".companyName").css("color", "#7e8185");
                }
                if (data.industry_name) {
                    $(".industries").text(data.industry_name);
                    $(".industries").css("color", "#7e8185");
                }
                if (data.business != undefined && data.business.length != 0) {
                    var str1 = "";
                    for (var i = 0; i < data.business.length; i++) {
                        str1 += '<span>' + data.business[i] + '</span>';
                    }
                    $(".mainBusiness").html(str1);
                    $(".mainBusiness").css("color", "#7e8185");
                }
                if (data.scale_information) {
                    $(".myAsset").text(data.scale_information);
                    $(".myAsset").css("color", "#7e8185");
                }
                if (data.financing_stage) {
                    $(".finaceStage").text(data.financing_stage);
                    $(".finaceStage").css("color", "#7e8185");
                }
                if (data.position_name != undefined && data.position_name.length != 0) {
                    $(".positionName").text(data.position_name[0]);
                    $(".positionName").css("color", "#7e8185");
                }
                if (data.other_instructions) {
                    $(".businessIntro").text(data.other_instructions);
                    $(".businessIntro").css("color", "#7e8185");
                }

            }
        }
        if (titleId.id == 2) {
            $.removeStore('identityInfo');
            console.log(JSON.parse($.getStore("identityInfo")));
            $(this).css("color", "#3385ff");
            $(".business").css("color", "#666");
            $(this).find("span").css("display", "block");
            $(".business span").css("display", "none");
            $(".main_NoBusiness").css("display", "block");
            $(".main_Business").css("display", "none");
            var commerceIdInfo = JSON.parse($.getStore("commerceIdInfo"));
            if (commerceIdInfo) {
                console.log(commerceIdInfo);
                if (commerceIdInfo.identityInformation) {
                    $(".commerceName").val(commerceIdInfo.identityInformation);
                    $(".commerceName").css("color", "#7e8185");
                }
                if (commerceIdInfo.position_name != undefined && commerceIdInfo.position_name.length != 0) {
                    $(".commercePosition").text(commerceIdInfo.position_name[0]);
                    $(".commercePosition").css("color", "#7e8185");
                }
            }
        }
    }
}
$(".noBusiness").on("click", function () {
    $.removeStore('identityInfo');
    $(".companyName").val("");
    $(".industries").text("请选择");
    $(".mainBusiness").html("请选择");
    $(".myAsset").text("请选择");
    $(".finaceStage").text("请选择");
    $(".positionName").text("请选择");
    $(".businessIntro").text("请选择");
    console.log(JSON.parse($.getStore("identityInfo")));
    $(this).css("color", "#3385ff");
    $(".business").css("color", "#666");
    $(this).find("span").css("display", "block");
    $(".business span").css("display", "none");
    $(".main_NoBusiness").css("display", "block");
    $(".main_Business").css("display", "none");
});
$(".business").on("click", function () {
    $.removeStore('commerceIdInfo');
    $(".commerceName").val("");
    $(".commercePosition").text("请选择");
    console.log(JSON.parse($.getStore("commerceIdInfo")));
    $(this).css("color", "#3385ff");
    $(".noBusiness").css("color", "#666");
    $(this).find("span").css("display", "block");
    $(".noBusiness span").css("display", "none");
    $(".main_Business").css("display", "block");
    $(".main_NoBusiness").css("display", "none");
});
// 企业保存

$("#businessBtn").on("click", function () {
    console.log(JSON.parse($.getStore("identityInfo")));
    var identityInfo = $.getStore("identityInfo");
    var data = JSON.parse($.getStore("identityInfo"));
    console.log(data);
    console.log(userId);
    var base = new Base64();
    var newuserId = base.encode(userId.toString());
    if (identityInfo) {
        $.changeAjax({
            url: "userIdentityInformationApi/saveUserIdentityInformation.do",
            data: {
                userId: userId,
                identityInformation: data.identityInformation,
                industryId: data.industry_id,
                identityFinancingStageId: data.identity_financing_stage_id,
                identityType: 1,
                topIdentity: data.topIdentity,
                otherInstructions: data.other_instructions,
                position: data.position_name.join(","),
                business: data.business.join(","),
                requestType: "h5"
            },
            callback: function (res) {
                console.log(res);
                $.MessagePrompt({
                    text: '信息保存成功！',
                    type: 2,
                    callback: function () {
                        window.location.href = '../index.html?userId=' + newuserId;
                    }
                });
            }
        });
    }
});

// 商会保存
$("#commerceBtn").on("click", function () {
    console.log(JSON.parse($.getStore("commerceIdInfo")));
    var identityInfo = $.getStore("commerceIdInfo");
    var data = JSON.parse($.getStore("commerceIdInfo"));
    console.log(data);
    console.log(userId);
    var base = new Base64();
    var newuserId = base.encode(userId.toString());
    $.changeAjax({
        url: "userIdentityInformationApi/saveUserIdentityInformation.do",
        data: {
            userId: userId,
            identityInformation: data.identityInformation,
            identityType: 2,
            topIdentity: data.topIdentity,
            position: data.position_name.join(",") + ",",
            requestType: "h5"
        },
        callback: function (res) {
            console.log(res);
            $.MessagePrompt({
                text: '信息保存成功！',
                type: 2,
                callback: function () {
                    window.location.href = '../index.html?userId=' + newuserId;
                }
            });
        }
    });
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
    if (!$(obj).is("#businessBtn") && !$(obj).is("#commerceBtn")) {
        $.MessagePrompt({
            text: '确认放弃添加身份吗？',
            callback: function () {
                location.href = "../index.html?userId=" + newuserId;
            }
        });
    }
};