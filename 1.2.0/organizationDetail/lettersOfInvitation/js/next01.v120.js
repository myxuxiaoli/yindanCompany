var myOrganizationId;
var newPhone;
var np;
var newZoneId;
var nz;
var shareUserId;
var ortype;
var getRequest;
window.onload = function () {
    getRequest = $.getRequest();
    if (getRequest) {
        var base = new Base64();
        if (getRequest.myOrganizationId) {
            myOrganizationId = getRequest.myOrganizationId;
            businessInfo();
        }
        if (getRequest.shareUserId) {
            shareUserId = getRequest.shareUserId;
        }
        if (getRequest.np) {
            np = getRequest.np;
            newPhone = base.decode(getRequest.np.replace(/\*/g, "="));
        }
        if (getRequest.nz) {
            nz = getRequest.nz;
            newZoneId = base.decode(getRequest.nz.replace(/\*/g, "="));
        }
        if (getRequest.ty) {
            ty = getRequest.ty;
            ortype = getRequest.ty;
        }
        if (newPhone && ortype && newZoneId) {
            console.log(newPhone + "," + newZoneId + "," + ortype);
            tyUserInfo();
        }

    }
};

//顶部组织机构信息
function businessInfo() {
    console.log("顶部组织id:" + myOrganizationId);
    $.changeAjax({
        url: "myOrganizationApi/selectOrganizationInformation.do",
        data: {
            myOrganizationId: myOrganizationId,
            requestType: "h5"
        },
        callback: function (res) {
            var data = res.data;
            console.log(data);
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
                    document.setTitle("加入" + data.organization_name);
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
    });
}

function tyUserInfo() {
    if (validate(ortype)) {
        if (ortype == 2) {
            $.changeAjax({
                url: "userApi/selectOrganizationTypeUser.do",
                data: {
                    organizationType: ortype,
                    phoneNumber: newPhone,
                    zoneDescriptionId: newZoneId
                },
                callback: function (res) {
                    var data = res.data;
                    $("#realName").attr("disabled", true);
                    if (data) {
                        if (data.user_name) {
                            $(".endorseName input").val(data.user_name);
                            $(".endorseName input").attr("disabled", true);
                        } else {
                            $(".endorseName input").attr("disabled", false);
                        }
                        if (data.user_id) {
                            $(".endorseName input").attr("data-id", data.user_id);
                        }
                        if (data.user_sex) {
                            if (data.user_sex == "男") {
                                $("#r1").attr("checked", true);
                                $("#r2").attr("disabled", true);
                            } else {
                                $("#r2").attr("checked", true);
                                $("#r1").attr("disabled", true);
                            }
                        }
                        if (data.userIdentityInformation) {
                            var identityInfo = data.userIdentityInformation;
                            if (identityInfo.identity_information) {
                                $("#organizationName").val(identityInfo.identity_information);
                                $("#organizationName").attr("disabled", true);
                            } else {
                                $("#organizationName").attr("disabled", false);
                            }
                            if (identityInfo.identity_type) {
                                if (identityInfo.identity_type == 1) {
                                    $("#r3").attr("checked", true);
                                    $("#r4").attr("disabled", true);
                                } else if (identityInfo.identity_type == 2) {
                                    $("#r4").attr("checked", true);
                                    $("#r3").attr("disabled", true);
                                }
                            }
                            if (identityInfo.positionName != undefined && identityInfo.positionName.length != 0) {
                                $("#positionName").val(identityInfo.positionName[0]);
                                $("#positionName").attr("disabled", true);
                            } else {
                                $("#positionName").attr("disabled", false);
                            }
                        }
                    }

                }
            });
        }
        //提交
        if (ortype == 3) {
            $(".nextDiv").on("click", function () {
                var realName = $(".endorseName input").val();
                var base = new Base64();
                var baseName = base.encode(realName).replace(/\=/g, "*");
                var realSex;
                if ($("#r1").is(':checked')) {
                    realSex = "男";
                } else if ($("#r2").is(':checked')) {
                    realSex = "女";
                }
                var organizationName = $(".businessName input").val();
                var toporganizationName = $(".friendName").text();
                var businessType;
                if ($("#r3").is(':checked')) {
                    businessType = 1;
                } else if ($("#r4").is(':checked')) {
                    businessType = 2;
                }
                var organizationPosition = $(".businessPosition input").val();
                var Code = $(".CodeBox input").val();
                $.changeAjax({
                    url: "myOrganizationApi/invitationJoinOrganization.do",
                    data: {
                        organizationType: 3,
                        invitationCode: Code,
                        myOrganizationId: myOrganizationId,
                        userName: realName,
                        userSex: realSex,
                        identityInformation: organizationName,
                        identityType: businessType,
                        positionName: organizationPosition,
                        userPhone: newPhone,
                        zoneDescriptionId: newZoneId,
                        organizationName: toporganizationName
                    },
                    callback: function (res) {
                        console.log(res);
                        var invitationCode = $("#codeNum").val();
                        var data = res.data;
                        if (data) {
                            if (data.examineState && data.examineState == 1) {
                                $.MessagePrompt({
                                    text: '该组织已被禁用！',
                                    type: 2,

                                });
                            } else {
                                if (invitationCode == "") {
                                    if (JSON.stringify(data) == "{}") {
                                        console.log("空对象");
                                        window.location.href = "./haveApplied.html?name=" + baseName + "&shareUserId=" + shareUserId + "&np=" + np + "&nz=" + nz + "&myOrganizationId=" + myOrganizationId + "&ty=" + ty;
                                    } else if (validate(data.organizationType)) {
                                        if (data.organizationType == 4) { //已申请
                                            window.location.href = "./haveApplied.html?name=" + baseName + "&shareUserId=" + shareUserId + "&np=" + np + "&nz=" + nz + "&myOrganizationId=" + myOrganizationId + "&ty=" + ty;
                                        } else if (data.organizationType == 1) { //已加入
                                            $.MessagePrompt({
                                                text: '您已加入该组织！',
                                                type: 1,
                                                callback: function () {
                                                    window.location.href = "./haveRegistered.html?myOrganizationId=" + myOrganizationId;
                                                }
                                            });
                                        }
                                    }
                                } else if (invitationCode != "") {
                                    console.log("ggg");
                                    if (JSON.stringify(data) == "{}") {
                                        console.log("空对象");
                                        window.location.href = "./next02.html?name=" + baseName + "&shareUserId=" + shareUserId + "&np=" + np + "&nz=" + nz + "&myOrganizationId=" + myOrganizationId + "&ty=" + ty;
                                    } else if (data.invitationCodeType) {
                                        console.log(data.invitationCodeType);
                                        if (data.invitationCodeType == 2) {
                                            $.MessagePrompt({
                                                text: '邀请码错误！',
                                                type: 2
                                            });
                                        }
                                    } else if (data.organizationType) {
                                        if (data.organizationType == 4) {
                                            window.location.href = "./haveApplied.html?name=" + baseName + "&shareUserId=" + shareUserId + "&np=" + np + "&nz=" + nz + "&myOrganizationId=" + myOrganizationId + "&ty=" + ty;
                                        } else if (data.organizationType == 1) {
                                            $.MessagePrompt({
                                                text: '您已加入该组织！',
                                                type: 1,
                                                callback: function () {
                                                    window.location.href = "./haveRegistered.html?myOrganizationId=" + myOrganizationId;
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                        }

                    }
                });
            });
        } else if (ortype == 2) {
            $(".nextDiv").on("click", function () {
                var realName = $(".endorseName input").val();
                var base = new Base64();
                var baseName = base.encode(realName).replace(/\=/g, "*");
                var toporganizationName = $(".friendName").text();
                console.log($("#codeNum").val() + "," + myOrganizationId + "," + $("#realName").attr("data-id") + "," + "," + newPhone + "," + newZoneId + "," + toporganizationName);
                $.changeAjax({
                    url: "myOrganizationApi/invitationJoinOrganization.do",
                    data: {
                        organizationType: 2,
                        invitationCode: $("#codeNum").val(),
                        myOrganizationId: myOrganizationId,
                        userId: $("#realName").attr("data-id"),
                        userPhone: newPhone,
                        zoneDescriptionId: newZoneId,
                        organizationName: toporganizationName
                    },
                    callback: function (res) {
                        console.log(res);
                        var urlName = $("#realName").val();
                        var invitationCode = $("#codeNum").val();
                        var data = res.data;
                        if (data) {
                            if (data.examineState && data.examineState == 1) {
                                $.MessagePrompt({
                                    text: '该组织已被禁用！',
                                    type: 2,

                                });
                            } else {
                                if (invitationCode == "") {
                                    if (JSON.stringify(data) == "{}") {
                                        console.log("空对象");
                                        window.location.href = "./haveApplied.html?name=" + baseName + "&shareUserId=" + shareUserId + "&np=" + np + "&nz=" + nz + "&myOrganizationId=" + myOrganizationId + "&ty=" + ty;
                                    } else if (validate(data.organizationType)) {
                                        if (data.organizationType == 4) {
                                            window.location.href = "./haveApplied.html?name=" + baseName + "&shareUserId=" + shareUserId + "&np=" + np + "&nz=" + nz + "&myOrganizationId=" + myOrganizationId + "&ty=" + ty;
                                        } else if (data.organizationType == 1) {
                                            $.MessagePrompt({
                                                text: '您已加入该组织！',
                                                type: 1,
                                                callback: function () {
                                                    window.location.href = "./haveRegistered.html?myOrganizationId=" + myOrganizationId;
                                                }
                                            });
                                        }
                                    }
                                } else if (invitationCode != "") {
                                    console.log("xxx");
                                    if (JSON.stringify(data) == "{}") {
                                        console.log("空对象");
                                        window.location.href = "./next02.html?name=" + baseName + "&shareUserId=" + shareUserId + "&np=" + np + "&nz=" + nz + "&myOrganizationId=" + myOrganizationId + "&ty=" + ty;
                                    } else if (data.invitationCodeType) {
                                        console.log(data.invitationCodeType);
                                        if (data.invitationCodeType == 2) {
                                            $.MessagePrompt({
                                                text: '邀请码错误！',
                                                type: 2
                                            });
                                        }
                                    } else if (validate(data.organizationType)) {
                                        if (data.organizationType == 4) {
                                            window.location.href = "./haveApplied.html?name=" + baseName + "&inviterId=" + inviterId + "&np=" + np + "&nz=" + nz + "&myOrganizationId=" + myOrganizationId + "&ty=" + ty;
                                        } else if (data.organizationType == 1) {
                                            $.MessagePrompt({
                                                text: '您已加入该组织！',
                                                type: 1,
                                                callback: function () {
                                                    window.location.href = "./haveRegistered.html?myOrganizationId=" + myOrganizationId;
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            });
        }
    }
}

$(".noCode").on("click", function () {
    $(".myMask").show();
    $(".myModal").show();
});
$(".closeBtn").on("click", function () {
    $(".myMask").hide();
    $(".myModal").hide();
});
$(".promits").on("click", function () {
    window.location.href = "./serviceAgreement.html";
});