var myOrganizationId;
var shareUserId;
var getRequest;
window.onload = function () {
    getRequest = $.getRequest();
    if (getRequest) {
        if (getRequest.myOrganizationId) {
            myOrganizationId = getRequest.myOrganizationId;
        }
        if (getRequest.shareUserId) {
            shareUserId = getRequest.shareUserId;
            console.log("分享者id:" + shareUserId);
        }
    }
    if (myOrganizationId) {
        businessInfo();
        console.log("顶部组织ID存在：" + myOrganizationId);
    } else {
        myOrganizationId = 11;
        businessInfo();
        console.log("myOrganizationId不存在：" + myOrganizationId);
    }
    if (shareUserId) {
        console.log("分享者id存在：" + shareUserId);
    } else {
        shareUserId = 13;
        console.log("分享者id不存在：" + shareUserId);
    }
};
//顶部组织机构信息
function businessInfo() {
    console.log(myOrganizationId);
    $.changeAjax({
        url: "myOrganizationApi/selectOrganizationInformation.do",
        data: {
            myOrganizationId: myOrganizationId,
            requestType: "h5"
        },
        callback: function (res) {
            var data = res.data;
            console.log(res);
            if (data) {
                if (data.organization_name) {
                    $(".friendName").text(data.organization_name);
                    //修改顶部标题
                    document.setTitle = function (t) {
                        document.title = t;
                        var i = document.createElement('iframe');
                        i.src = '//m.baidu.com/favicon.ico';
                        i.style.display = 'none';
                        i.onload = function () {
                            setTimeout(function () {
                                i.remove();
                            }, 9);
                        };
                        document.body.appendChild(i);
                    };
                    setTimeout(function () {
                        document.setTitle("邀请函-" + data.organization_name);
                    }, 5);
                }
                if (data.organization_synopsis) {
                    $(".businessInfo").text(data.organization_synopsis);
                }
                if (data.organization_sign_url != "") {
                    imgState(data.organization_sign_url, function (red) {
                        if (red === 'w') {
                            $('.photoBox').html("<img style='width:100%;' src='" + data.organization_sign_url + "'>");
                        } else if (red === 'h') {
                            $('.photoBox').html("<img style='height:100%;' src='" + data.organization_sign_url + "'>");
                        }
                    });
                }
            }

        }
    });
}
//电话号码区号
var flag = true;
$(".triangle-down").on("click", function () {
    if (flag == true) {
        $(".numRegion").show();
        $.changeAjax({
            url: "zoneDescriptionApi/selectAllZoneDescription.do",
            callback: function (res) {
                var data = res.data;
                console.log(res);
                var str1 = "";
                if (data != undefined && data.length != 0) {
                    for (var i = 0; i < data.length; i++) {
                        str1 += "<li data-id='" + data[i].zone_description_id + "'>" + "<span class='phoneRegion'>" + data[i].region + "</span>" + "+" + "<span class='regionNums'>" + data[i].area_code + "</span>" + "</li>";
                    }
                }
                $(".numRegion").html(str1);
            }
        });
        flag = false;
    } else {
        $(".numRegion").hide();
        flag = true;
    }
});
$(".numRegion").on("click", "li", function () {
    var dataTopId = $(this).attr("data-id");
    $(".havedNums").attr("data-topId", dataTopId);
    var myRegion = $(this).find(".phoneRegion").text();
    var myregionNum = $(this).find(".regionNums").text();
    $(".topRegion").text(myRegion);
    $(".topRegionNum").text("+" + myregionNum);
    $(".numRegion").hide();
});

//发送验证码
var countdown = 60;
$(".giveIdentifyCode").on("click", function () {
    var phoneNum = $(".photoNum input").val();
    var zoneDescriptionId = $(".havedNums").attr("data-topid");
    var base = new Base64();
    var newPhone = base.encode(phoneNum).replace(/\=/g, "*");
    var newZoneId = base.encode(zoneDescriptionId).replace(/\=/g, "*");
    console.log(phoneNum + "," + zoneDescriptionId);
    if (phoneNum == "") {
        $.MessagePrompt({
            text: '请输入手机号码！',
            type: 2
        });
    } else if (phoneNum.length < 11) {
        $.MessagePrompt({
            text: '请输入11位手机号码！',
            type: 2
        });
    } else {
        function settime() {
            if (countdown == 0) {
                $("#codeButton").attr("disabled", false);
                $("#codeButton").attr("class", "giveIdentifyCode");
                $("#codeButton").val("发送验证码");
                countdown = 60;
                return;
            } else {
                $("#codeButton").attr("disabled", true);
                $("#codeButton").attr("class", "giveIdentifyCodeAgain");
                $("#codeButton").val(countdown + "s后重发");
                countdown--;
            }
            setTimeout(function () {
                settime();
            }, 1000);
        }
        $.changeAjax({
            url: "verificationCodeApi/sendVerificationCodeInvitation.do",
            data: {
                phoneNumber: phoneNum,
                explain: "申请加入",
                myOrganizationId: myOrganizationId,
                zoneDescriptionId: zoneDescriptionId
            },
            callback: function (res) {
                var data = res.data;
                console.log(res);
                if (data) {
                    if (data.examineState && data.examineState == 1) {
                        $.MessagePrompt({
                            text: '该组织已被禁用！',
                            type: 2
                        });
                    } else {
                        if (data.organizationType) {
                            var base = new Base64();
                            if (data.organizationType == 1) {
                                $.MessagePrompt({
                                    text: '您已加入该组织！',
                                    type: 1,
                                    callback: function () {
                                        window.location.href = "./haveRegistered.html?myOrganizationId=" + myOrganizationId;
                                    }
                                });
                            } else if (data.organizationType == 3) {
                                settime();
                                $.MessagePrompt({
                                    text: '验证码发送成功！',
                                    type: 2
                                });
                                $("#codeButton").attr("data-id", 3);

                            } else if (data.organizationType == 2) {
                                settime();
                                $.MessagePrompt({
                                    text: '验证码发送成功！',
                                    type: 2
                                });
                                $("#codeButton").attr("data-id", 2);

                            } else if (data.organizationType == 4) {
                                if (data.user_name) {
                                    var username = base.decode(data.user_name);
                                    var newusername = username.replace(/\=/g, "*");
                                    $.MessagePrompt({
                                        text: '您已申请过该组织！',
                                        type: 1,
                                        callback: function () {
                                            window.location.href = "./haveApplied.html?name=" + newusername + "&np=" + newPhone + "&nz=" + newZoneId + "&shareUserId=" + shareUserId + "&ty=" + 4;
                                        }
                                    });
                                }

                            }
                        }
                    }
                }
            }
        });
    }

});

//下一步
$(".nextDiv").on("click", function () {
    var phoneNum = $(".photoNum input").val();
    var zoneDescriptionId = $(".havedNums").attr("data-topid");
    var code = $(".identifyCode input").val();
    var base = new Base64();
    var newPhone = base.encode(phoneNum).replace(/\=/g, "*");
    var newZoneId = base.encode(zoneDescriptionId).replace(/\=/g, "*");
    var ty;
    console.log(myOrganizationId + "," + phoneNum + "," + newPhone + "," + newZoneId);
    if (phoneNum == "") {
        $.MessagePrompt({
            text: '请输入手机号码！',
            type: 2
        });
    } else if (phoneNum.length < 11) {
        $.MessagePrompt({
            text: '请输入11位手机号码！',
            type: 2
        });
    } else if (code == "") {
        $.MessagePrompt({
            text: '请输入验证码！',
            type: 2
        });
    } else {
        $.changeAjax({
            url: "verificationCodeApi/verificationCodeInvitation.do",
            data: {
                phoneNumber: phoneNum,
                explain: "申请加入",
                zoneDescriptionId: zoneDescriptionId,
                code: code,
                myOrganizationId: myOrganizationId
            },
            callback: function (res) {
                var data = res.data;
                console.log(res);
                var cType = $("#codeButton").attr("data-id");
                if (data) {
                    if (data.type == 1) {
                        if (cType == 2) {
                            window.location.href = "./next01.html?np=" + newPhone + "&nz=" + newZoneId + "&myOrganizationId=" + myOrganizationId + "&shareUserId=" + shareUserId + "&ty=" + 2;
                        } else if (cType == 3) {
                            window.location.href = "./next01.html?np=" + newPhone + "&nz=" + newZoneId + "&myOrganizationId=" + myOrganizationId + "&shareUserId=" + shareUserId + "&ty=" + 3;
                        }
                    } else if (data.type == 2) {
                        $.MessagePrompt({
                            text: '请求超时！',
                            type: 2
                        });
                    } else if (data.type == 3) {
                        $.MessagePrompt({
                            text: '验证码错误！',
                            type: 2
                        });
                    }
                }

            }
        });
    }

});