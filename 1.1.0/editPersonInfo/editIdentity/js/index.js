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
    var businessTag = true;
    $("#businessSelected").on("click", function () {
        if (businessTag == true) {
            $(this).css("border", "1px solid transparent");
            $("#busselect").css("display", "block");
            $.setStore("identityInfo", {
                top_identity: 2
            });
            businessTag = false;
        } else {
            $(this).css("border", "1px solid #999");
            $("#busselect").css("display", "none");
            $.setStore("identityInfo", {
                top_identity: 1
            });
            businessTag = true;
        }

    });
    var commerceTag = true;
    $("#commerceSelected").on("click", function () {
        if (commerceTag == true) {
            $(this).css("border", "1px solid transparent");
            $("#comselect").css("display", "block");
            $.setStore("commerceIdentityInfo", {
                top_identity: 2
            });
            commerceTag = false;
        } else {
            $(this).css("border", "1px solid #999");
            $("#comselect").css("display", "none");
            $.setStore("commerceIdentityInfo", {
                top_identity: 1
            });
            commerceTag = true;
        }

    });
    $(".commerceTitleBox").on("click", function () {
        window.location.href = "./commerceTitleBox.html";
    });
    $(".professionBox").on("click", function () {
        window.location.href = "./professionBox.html";
    });
    $(".mainBusinessBox").on("click", function () {
        window.location.href = "./mainBusinessBox.html";
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
}

function identityInfo() {
    var getRequest = $.getRequest();
    var identityId = getRequest.id;
    if (identityId) {
        $.removeStore("identityInfo");
        var userIdentity = JSON.parse($.getStore("userIdentity"));
        console.log(userIdentity);
        for (var i = 0; i < userIdentity.length; i++) {
            if (userIdentity[i].user_identity_information_id == identityId) {
                if (userIdentity[i].identity_type == 2) {
                    $(".commerceName").on("keyup", function () {
                        $(this).css("color", "#7e8185");
                        $.setStore("commerceIdentityInfo", {
                            identity_information: $(this).val()
                        });
                        console.log(JSON.parse($.getStore("commerceIdentityInfo")));
                    });
                    $.setStore('commerceIdentityInfo', userIdentity[i], true);
                    console.log(JSON.parse($.getStore("commerceIdentityInfo")));
                    $(".noBusiness").css("color", "#3385ff");
                    $(".business").css("color", "#666");
                    $(".noBusiness").find("span").css("display", "block");
                    $(".business span").css("display", "none");
                    $(".main_NoBusiness").css("display", "block");
                    $(".main_Business").css("display", "none");
                    if (userIdentity[i].identity_information) {
                        $(".commerceName").val(userIdentity[i].identity_information);
                        $(".commerceName").css("color", "#7e8185");
                    }
                    if (userIdentity[i].positionName != undefined && userIdentity[i].positionName.length != 0) {
                        $(".commercePosition").text(userIdentity[i].positionName[0]);
                        $(".commercePosition").css("color", "#7e8185");
                    } else {
                        $(".commercePosition").text("请选择");
                    }
                }
                if (userIdentity[i].identity_type == 1) {
                    $.setStore('identityInfo', userIdentity[i], true);
                    $(".companyName").on("keyup", function () {
                        $(this).css("color", "#7e8185");
                        $.setStore("identityInfo", {
                            identity_information: $(this).val()
                        });
                        console.log(JSON.parse($.getStore("identityInfo")));
                    });
                    $(".business").css("color", "#3385ff");
                    $(".noBusiness").css("color", "#666");
                    $(".business").find("span").css("display", "block");
                    $(".noBusiness span").css("display", "none");
                    $(".main_Business").css("display", "block");
                    $(".main_NoBusiness").css("display", "none");
                    if (userIdentity[i].identity_information) {
                        $(".companyName").val(userIdentity[i].identity_information);
                        $(".companyName").css("color", "#7e8185");
                    }
                    if (userIdentity[i].industry_name) {
                        $(".industries").text(userIdentity[i].industry_name);
                        $(".industries").css("color", "#7e8185");
                    } else {
                        $(".industries").text("请选择");
                    }
                    if (userIdentity[i].business != undefined && userIdentity[i].business.length != 0) {
                        var str1 = "";
                        for (var j = 0; j < userIdentity[i].business.length; j++) {
                            str1 += '<span class="mainBusiness">' + userIdentity[i].business[j] + '</span>';
                        }
                        $(".busBox").html(str1);
                        $(".busBox").css("color", "#7e8185");
                    } else {
                        $(".busBox").text("请选择");
                    }

                    if (userIdentity[i].scale_information) {
                        $(".assetNum").text(userIdentity[i].scale_information);
                        $(".assetNum").css("color", "#7e8185");
                    } else {
                        $(".assetNum").text("请选择");
                    }

                    if (userIdentity[i].financing_stage) {
                        $(".equityStage").text(userIdentity[i].financing_stage);
                        $(".equityStage").css("color", "#7e8185");
                    } else {
                        $(".equityStage").text("请选择");
                        $(".equityStage").css("color", "#7e8185");
                    }
                    if (userIdentity[i].positionName != undefined && userIdentity[i].positionName.length != 0) {
                        $(".businessPosition").text(userIdentity[i].positionName[0]);
                        $(".businessPosition").css("color", "#7e8185");
                    } else {
                        $(".businessPosition").text("请选择");
                        $(".businessPosition").css("color", "#7e8185");
                    }
                    if (userIdentity[i].other_instructions) {
                        $(".businessIntro").text(userIdentity[i].other_instructions);
                        $(".businessIntro").css("color", "#7e8185");
                    } else {
                        $(".businessIntro").text("请选择");
                    }
                }
            }
        }
    } else {
        var data = JSON.parse($.getStore("identityInfo"));
        var commerceData = JSON.parse($.getStore("commerceIdentityInfo"));
        console.log(data);
        console.log(commerceData);
        if (commerceData) {
            if (commerceData.identity_type == 2) {
                $(".commerceName").on("keyup", function () {
                    $(this).css("color", "#7e8185");
                    $.setStore("commerceIdentityInfo", {
                        identity_information: $(this).val()
                    });
                    console.log(JSON.parse($.getStore("commerceIdentityInfo")));
                });
                $(".noBusiness").css("color", "#3385ff");
                $(".business").css("color", "#666");
                $(".noBusiness").find("span").css("display", "block");
                $(".business span").css("display", "none");
                $(".main_NoBusiness").css("display", "block");
                $(".main_Business").css("display", "none");
                if (commerceData.identity_information) {
                    $(".commerceName").val(commerceData.identity_information);
                    $(".commerceName").css("color", "#7e8185");
                }
                if (commerceData.positionName != undefined && commerceData.positionName.length != 0) {
                    $(".commercePosition").text(commerceData.positionName[0]);
                    $(".commercePosition").css("color", "#7e8185");
                }
            }
        }
        if (data) {
            if (data.identity_type == 1) {
                $(".companyName").on("keyup", function () {
                    $(this).css("color", "#7e8185");
                    $.setStore("identityInfo", {
                        identity_information: $(this).val()
                    });
                    console.log(JSON.parse($.getStore("identityInfo")));
                });
                $(".business").css("color", "#3385ff");
                $(".noBusiness").css("color", "#666");
                $(".business").find("span").css("display", "block");
                $(".noBusiness span").css("display", "none");
                $(".main_Business").css("display", "block");
                $(".main_NoBusiness").css("display", "none");
                if (data.identity_information) {
                    $(".companyName").val(data.identity_information);
                    $(".companyName").css("color", "#7e8185");
                }
                if (data.industry_name) {
                    $(".industries").text(data.industry_name);
                    $(".industries").css("color", "#7e8185");
                } else {
                    $(".industries").text("请选择");
                }
                if (data.business != undefined && data.business.length != 0) {
                    var str2 = "";
                    for (var m = 0; m < data.business.length; m++) {
                        str2 += '<span class="mainBusiness">' + data.business[m] + '</span>';
                    }
                    $(".busBox").html(str2);
                    $(".busBox").css("color", "#7e8185");
                } else {
                    $(".busBox").html("<span>请选择</span>");
                }

                if (data.scale_information) {
                    $(".assetNum").text(data.scale_information);
                    $(".assetNum").css("color", "#7e8185");
                } else {
                    $(".assetNum").text("请选择");
                }
                if (data.financing_stage) {
                    $(".equityStage").text(data.financing_stage);
                    $(".equityStage").css("color", "#7e8185");
                } else {
                    $(".equityStage").text("请选择");
                }
                if (data.positionName != undefined && data.positionName.length != 0) {
                    $(".businessPosition").text(data.positionName[0]);
                    $(".businessPosition").css("color", "#7e8185");
                } else {
                    $(".businessPosition").text("请选择");
                }
                if (data.other_instructions) {
                    $(".businessIntro").text(data.other_instructions);
                    $(".businessIntro").css("color", "#7e8185");
                } else {
                    $(".businessIntro").text("请选择");
                }
            }
        }
    }
}
// 企业保存
$("#businessSubmit").on("click", function () {
    var base = new Base64();
    var newuserId = base.encode(userId.toString());
    console.log(JSON.parse($.getStore("identityInfo")));
    var identityInfo = $.getStore("identityInfo");
    var data = JSON.parse($.getStore("identityInfo"));
    console.log(data);
    console.log(userId);
    if (identityInfo) {
        $.changeAjax({
            url: "userIdentityInformationApi/updateUserIdentityInformation.do",
            data: {
                userIdentityInformationId: data.user_identity_information_id,
                identityInformation: data.identity_information,
                industryId: data.industry_id,
                assetsScaleId: data.identity_authentication,
                identityFinancingStageId: data.identity_financing_stage_id,
                identityType: 1,
                topIdentity: data.top_identity,
                otherInstructions: data.other_instructions,
                position: data.positionName.join(",") + ",",
                business: data.business.join(","),
                requestType: "h5",
                userId: userId
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
$("#commerceSubmit").on("click", function () {
    var base = new Base64();
    var newuserId = base.encode(userId.toString());
    var commerceIdentityInfo = $.getStore("commerceIdentityInfo");
    var data = JSON.parse($.getStore("commerceIdentityInfo"));
    console.log(data);
    console.log(userId);
    $.changeAjax({
        url: "userIdentityInformationApi/updateUserIdentityInformation.do",
        data: {
            userId: userId,
            identityInformation: data.identity_information,
            identityType: data.identity_type,
            topIdentity: data.top_identity,
            position: data.positionName.join(",") + ",",
            requestType: "h5",
            userIdentityInformationId: data.user_identity_information_id
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

//删除企业
$("#businessDelete").on("click", function () {
    var base = new Base64();
    var newuserId = base.encode(userId.toString());
    var data = JSON.parse($.getStore("identityInfo"));
    console.log(data);
    $.MessagePrompt({
        text: '确定删除该身份吗？',
        type: 1,
        callback: function () {
            $.changeAjax({
                url: "userIdentityInformationApi/deleteUserIdentityInformation.do",
                data: {
                    userIdentityInformationId: data.user_identity_information_id,
                    requestType: "h5"
                },
                callback: function (res) {
                    console.log(res);
                    $.MessagePrompt({
                        text: '删除成功！',
                        type: 2,
                        callback: function () {
                            window.location.href = '../index.html?userId=' + newuserId;
                        }
                    });
                }
            });
        }
    });

});

//删除商会
$("#commerceDelete").on("click", function () {
    var base = new Base64();
    var newuserId = base.encode(userId.toString());
    var data = JSON.parse($.getStore("commerceIdentityInfo"));
    console.log(data);
    $.MessagePrompt({
        text: '确定删除该身份吗？',
        type: 1,
        callback: function () {
            $.changeAjax({
                url: "userIdentityInformationApi/deleteUserIdentityInformation.do",
                data: {
                    userIdentityInformationId: data.user_identity_information_id,
                    requestType: "h5"
                },
                callback: function (res) {
                    console.log(res);
                    $.MessagePrompt({
                        text: '删除成功！',
                        type: 2,
                        callback: function () {
                            window.location.href = '../index.html?userId=' + newuserId;
                        }
                    });
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
    if (!$(obj).is("#businessSubmit") && !$(obj).is("#businessDelete") && !$(obj).is("#commerceSubmit") && !$(obj).is("#commerceDelete")) {
        $.MessagePrompt({
            text: '确认放弃编辑身份吗？',
            callback: function () {
                location.href = "../index.html?userId=" + newuserId;
            }
        });
    }
};