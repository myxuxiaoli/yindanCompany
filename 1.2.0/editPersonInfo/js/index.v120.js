var userId;
var getRequest;
window.onload = function () {
    getRequest = $.getRequest();
    if (getRequest.userId) {
        var newId = getRequest.userId.replace(/\*/g, "=");
        var base = new Base64();
        userId = base.decode(newId);
        personInfo();
        console.log("userId存在！", userId);
        $.setStore('userId', userId, true);
    } else {
        userId = 15;
        personInfo();
        console.log("userId不存在！", userId);
        $.setStore('userId', userId, true);
    }
};
//上传头像函数
function userImgFile(th) {
    if (th.files.length > 0) {
        new clip(th.files[0], function (reg) {
            var data = new FormData();
            data.append('files', reg);
            data.append('userId', userId);
            data.append('requestType', 'h5');
            $.changeAjax({
                url: 'userApi/updateHeadPortrait.do',
                type: 'FORM',
                data: data,
                callback: function (reg) {
                    console.log(reg);
                    $('.userImg img').attr("src", reg.data[0]);
                }
            });
        });
    }
}
//判断后台图片宽高大小的函数
function imgState(url, callback) {
    var img = new Image();
    img.src = url;
    img.onload = function () {
        if (img.width >= img.height) {
            callback('h');
        } else {
            callback('w');
        }
    };
    img.onerror = function () {
        callback('e');
    };
}
//个人信息部分数据请求

function personInfo() {
    console.log(userId);
    $.changeAjax({
        url: "userApi/editInformation.do",
        data: {
            userId: userId,
            requestType: "h5"
        },
        callback: function (reg) {
            if (reg.data) {
                if (reg.data.user) {
                    var userInfo = reg.data.user;
                    // 个人信息
                    if (userInfo) {
                        console.log(userInfo);
                        $.setStore('userInfo', userInfo, true);
                        if (userInfo.user_name) {
                            $(".realName").text(userInfo.user_name);
                        }
                        if (userInfo.user_sex) {
                            $(".userSex").text(userInfo.user_sex);
                        }
                        if (userInfo.strongField != undefined && userInfo.strongField.length != 0) {
                            var str1 = "";
                            str1 += '<span>' + userInfo.strongField.join("，") + '</span>';
                            $(".goodAts").html(str1);
                        }
                        if (userInfo.city) {
                            $(".atCity").text(userInfo.city);
                        }
                        if (userInfo.hometown) {
                            $(".homeTown").text(userInfo.hometown);
                        }
                        if (userInfo.graduate_from) {
                            $(".graduateFrom").text(userInfo.graduate_from);
                        }
                        if (userInfo.personal_signature) {
                            $(".ownIntro").text(userInfo.personal_signature);
                        }
                        if (userInfo.expectStrong != undefined && userInfo.expectStrong.length != 0) {
                            var str2 = "";
                            str2 += '<span>' + userInfo.expectStrong.join("，") + '</span>';
                            $(".wantToKnow").html(str2);
                        }
                        if (userInfo.hobby != undefined && userInfo.hobby.length != 0) {
                            var str3 = "";
                            str3 += '<span>' + userInfo.hobby.join("，") + '</span>';
                            $(".hobbies").html(str3);
                        }
                        if (userInfo.head_portrait_url && userInfo.head_portrait_url != "") {
                            $("#topPhoto img").attr("src", userInfo.head_portrait_url);
                            imgState(userInfo.head_portrait_url, function (red) {
                                if (red === 'w') {
                                    $("#topPhoto img").css({
                                        'width': '100%'
                                    });
                                } else if (red === 'h') {
                                    $("#topPhoto img").css({
                                        'height': '100%'
                                    });
                                }
                            });
                        }
                    }
                }
                if (reg.data.userIdentityInformation) {
                    // 身份信息
                    var userIdentity = reg.data.userIdentityInformation;
                    $.setStore('userIdentity', userIdentity, true);
                    if (userIdentity != undefined && userIdentity.length != 0) {
                        console.log(userIdentity);
                        var str4 = "";
                        for (var m = 0; m < userIdentity.length; m++) {

                            if (userIdentity[m].identity_type == 1) {
                                if (userIdentity[m].top_identity == 2) {
                                    if (userIdentity[m].user_identity_information_id) {
                                        str4 += '<div class="itemInfo" id="topPosition" data-id=' + userIdentity[m].user_identity_information_id + '>';
                                    }

                                } else {
                                    if (userIdentity[m].user_identity_information_id) {
                                        str4 += '<div class="itemInfo" data-id=' + userIdentity[m].user_identity_information_id + '>';
                                    }

                                }
                                str4 += '<div class="organization">';
                                str4 += '<div class="organizationName">';
                                if (userIdentity[m].identity_information) {
                                    str4 += '<div class="nameText">' + userIdentity[m].identity_information + '</div>';
                                }
                                str4 += '<img class="toTop" src="./img/stricky.png" alt="">';
                                if (userIdentity[m].identity_authentication && userIdentity[m].identity_authentication == 1) {
                                    str4 += '<div class="authen">证</div>';
                                }
                                str4 += '</div>';
                                str4 += '<a href="#"></a>';
                                str4 += '</div>';
                                if (userIdentity[m].positionName != undefined && userIdentity[m].positionName.length != 0) {
                                    str4 += '<div class="titleRank">' + userIdentity[m].positionName[0] + '</div>';
                                }
                                str4 += '<div class="mainBusinesses">';
                                if (userIdentity[m].business != undefined && userIdentity[m].business.length != 0) {
                                    for (var n = 0; n < userIdentity[m].business.length; n++) {
                                        str4 += '<i>' + userIdentity[m].business[n] + '</i>';
                                    }
                                }
                                str4 += '</div>';
                                str4 += '</div>';
                            }
                            if (userIdentity[m].identity_type == 2) {
                                if (userIdentity[m].top_identity == 2) {
                                    if (userIdentity[m].user_identity_information_id) {
                                        str4 += '<div class="itemInfo" id="topPosition" data-id=' + userIdentity[m].user_identity_information_id + '>';
                                    }

                                } else {
                                    if (userIdentity[m].user_identity_information_id) {
                                        str4 += '<div class="itemInfo" data-id=' + userIdentity[m].user_identity_information_id + '>';
                                    }
                                }
                                str4 += '<div class="organization">';
                                str4 += '<div class="organizationName">';
                                if (userIdentity[m].identity_information) {
                                    str4 += '<div class="nameText">' + userIdentity[m].identity_information + '</div>';
                                }
                                str4 += '<img class="toTop" src="./img/stricky.png" alt="">';
                                if (userIdentity[m].identity_authentication && userIdentity[m].identity_authentication == 1) {
                                    str4 += '<div class="authen">证</div>';
                                }
                                str4 += '</div>';
                                str4 += '<a href="./editIdentity/index.html"></a>';
                                str4 += '</div>';
                                if (userIdentity[m].positionName != undefined && userIdentity[m].positionName.length != 0) {
                                    str4 += '<div class="titleRank">' + userIdentity[m].positionName[0] + '</div>';
                                }
                                str4 += '</div>';
                            }
                        }
                        $(".titleItems").html(str4);
                    } else {
                        $("#identityAdd").css("display", "block");
                    }
                }
                if (reg.data.myGlory) {
                    //个人荣誉
                    var myGlory = reg.data.myGlory;
                    if (myGlory != undefined && myGlory.length != 0) {
                        console.log(myGlory);
                        var str5 = "";
                        for (var l = 0; l < myGlory.length; l++) {
                            if (myGlory[l].glory_content.length != 0) {
                                str5 += '<div class="gloryItems">';
                                str5 += '<div class="gloryImg">';
                                str5 += '<img src="./img/glory.png" alt="">' + myGlory[l].glory_content;
                                str5 += '</div>';
                                str5 += '</div>';
                            }
                        }
                        $(".glories").html(str5);
                    } else {
                        $("#gloriesAdd").css("display", "block");
                    }
                }
            }
        }
    });
}
//添加身份按钮
$("#addIdentity").on("click", function () {
    console.log($(".titleItems .itemInfo").length);
    if ($(".titleItems .itemInfo").length < 5) {
        window.location.href = "./addIdentity/index.html?state=1";
    } else {
        $.MessagePrompt({
            text: '最多可添加五个身份！',
            callback: function () {
                return;
            }
        });
    }
});
$("#editpersonInfo").on("click", function () {
    window.location.href = "./personalInfo/index.html?userId=" + userId;
});
$("#editGlory").on("click", function () {
    window.location.href = "./glories/index.html?userId=" + userId;
});
//点击进入编辑身份页面
$(".titleItems").on("click", ".itemInfo", function () {
    console.log(JSON.parse($.getStore("userIdentity")));
    window.location.href = "./editIdentity/index.html?id=" + $(this).attr("data-id");
});