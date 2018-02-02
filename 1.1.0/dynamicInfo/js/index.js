var userId;
var myDynamicId;
window.onload = function () {
    var getRequest = $.getRequest();
    userId = getRequest.userId;
    console.log(getRequest);
    if (getRequest.userId) {
        var base = new Base64();
        userId = base.decode(getRequest.userId.replace(/\*/g, "="));

    }
    myDynamicId = getRequest.myDynamicId;
    console.log(myDynamicId);
    if (userId) {
        console.log(userId);
        myDynamics();
    } else {
        alert("该动态不存在！");
    }
};

function getzf(num) { //月份补0
    if (parseInt(num) < 10) {
        num = '0' + num;
    }
    return num;
}
//根据后台返回的毫秒数显示时间
function getMyDate(str) {
    var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        oTime = getzf(oMonth) + '月' + getzf(oDay) + '日';
    var nowDate = new Date();
    if (oYear < nowDate.getFullYear()) {
        oTime = oYear + '年' + getzf(oMonth) + '月' + getzf(oDay) + '日';
    } else {
        if (oMonth < nowDate.getMonth()) {
            oTime = getzf(oMonth) + '月' + getzf(oDay) + '日';
        } else {
            if (nowDate.getDate() - oDay >= 7) {
                oTime = getzf(oMonth) + '月' + getzf(oDay) + '日';
            } else {
                if (nowDate.getDate() == oDay) {
                    if (nowDate.getHours() == oHour) {
                        oTime = nowDate.getMinutes() - oMin + '分前';
                    } else {
                        oTime = nowDate.getHours() - oHour + '小时前';
                    }
                } else {
                    oTime = nowDate.getDate() - oDay + '日前';
                }
            }
        }
    }
    return oTime;
}



function myDynamics() {
    $.changeAjax({
        url: 'myDynamicApi/dynamicDetails.do',
        data: {
            myDynamicId: myDynamicId,
            userId: userId,
            requestType: 'h5'
        },
        callback: function (res) {
            if (res.data) {
                var data = res.data;
                if (res.data.user) {
                    if (data.user.head_portrait_url) {
                        imgState(data.user.head_portrait_url, function (red) {
                            if (red === 'w') {
                                $('.photoImgDiv').append("<img class='myImage' style='width:100%;' src='" + data.user.head_portrait_url + "'>");
                            } else if (red === 'h') {
                                $('.photoImgDiv').append("<img class='myImage' style='height:100%;' src='" + data.user.head_portrait_url + "'>");
                            }
                        });

                    }
                    if (data.user.user_name) {
                        $(".dynamicInfo h3").text(data.user.user_name);
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
                            document.setTitle(data.user.user_name + "的动态");
                        }, 5);
                    }
                    if (data.user.userIdentityInformation) {
                        if (data.user.userIdentityInformation.identity_information) {
                            var newStr = ""; //限定12个字，多余的省略
                            if (data.user.userIdentityInformation.identity_information.length > 12) {
                                newStr = data.user.userIdentityInformation.identity_information.substring(0, 12) + "…";
                            } else {
                                newStr = data.user.userIdentityInformation.identity_information;
                            }
                            $(".companyName").text(newStr);
                            if (data.user.userIdentityInformation.positionName != undefined && data.user.userIdentityInformation.positionName.length != 0) {
                                $(".companyName").text(newStr + data.user.userIdentityInformation.positionName[0]);
                            }
                        }

                    }


                }
                if (validate(data.establish_date)) {
                    $(".dynamicDate").text(getMyDate(data.establish_date));
                }
                if (data.my_dynamic_content) {
                    $(".dynamicContent").text(data.my_dynamic_content);
                }

                var html = '';
                var bigDivHeight;
                if (data.dynamicPhoto != undefined && data.dynamicPhoto.length != 0) {
                    if (data.dynamicPhoto.length == 1) {
                        bigDivHeight = Math.ceil(data.dynamicPhoto.length / 2) * 9 + Math.ceil(data.dynamicPhoto.length / 2) * 0.5 + 6;
                    } else {
                        bigDivHeight = Math.ceil(data.dynamicPhoto.length / 2) * 9 + Math.ceil(data.dynamicPhoto.length / 2) * 0.5 + 5.5;
                    }
                    console.log(bigDivHeight);
                    $(".dyCenter").css("height", bigDivHeight + "rem");
                    for (var j = 0; j < data.dynamicPhoto.length; j++) {
                        var img = new Image();
                        img.src = data.dynamicPhoto[j].photo_url;
                        if (img.width > img.height) {
                            html += "<div class='imgItem'>";
                            html += '<img style="height:100%;" src="' + data.dynamicPhoto[j].photo_url + '" alt="">';
                            html += "</div>";
                        } else {
                            html += "<div class='imgItem'>";
                            html += '<img style="width:100%;" src="' + data.dynamicPhoto[j].photo_url + '" alt="">';
                            html += "</div>";
                        }

                    }
                    $(".dyPhotos").html(html);
                }
                if (validate(data.forwardCount)) {
                    $(".transmit i").text(data.forwardCount);
                }
                if (validate(data.fabulousCount)) {
                    $(".thumbs-up i").text(data.fabulousCount);
                }
                if (validate(data.commentCount)) {
                    $(".comments i").text(data.commentCount);
                }
                var strss = '';
                if (data.commentContent != undefined && data.commentContent.length != 0) {
                    $(".commentsContent").css("display", "block");
                    var s = 0;
                    ondata();

                    function ondata() {
                        console.log(s);
                        var comData = data.commentContent[s];
                        console.log(comData.commentContenUser.head_portrait_url);
                        imgState(comData.commentContenUser.head_portrait_url, function (red) {
                            strss += '<div class="commentItems">';
                            strss += '<div class="comItem over-flow">';
                            strss += '<div class="comImgDiv">';
                            if (red === 'w') {
                                strss += "<img class='myImage' style='width:100%;' src='" + comData.commentContenUser.head_portrait_url + "'>";
                            } else if (red === 'h') {
                                strss += "<img class='myImage' style='height:100%;' src='" + comData.commentContenUser.head_portrait_url + "'>";
                            }
                            strss += '</div>';
                            strss += '<div class="rightDivs">';
                            strss += '<div class="identityInfo over-flow">';
                            strss += '<div class="ident">';
                            if (comData.user_name) {
                                strss += '<h4>' + comData.user_name + '</h4>';
                            }
                            strss += '<div class="identities">';
                            if (comData.commentContenUser) {
                                if (comData.commentContenUser.commentContenUserIdentityInformation) {
                                    if (comData.commentContenUser.commentContenUserIdentityInformation.identity_information) {
                                        var newString = "";
                                        if (comData.commentContenUser.commentContenUserIdentityInformation.identity_information.length > 12) {
                                            newString = comData.commentContenUser.commentContenUserIdentityInformation.identity_information.substring(0, 12) + "…";
                                            console.log(newString);
                                        } else {
                                            newString = comData.commentContenUser.commentContenUserIdentityInformation.identity_information;
                                            console.log(newString);
                                        }
                                        strss += '<div class="identityName">' + newString;
                                    }
                                    if (comData.commentContenUser.commentContenUserIdentityInformation.positionName != undefined && comData.commentContenUser.commentContenUserIdentityInformation.positionName.length != 0) {
                                        var cPosition = comData.commentContenUser.commentContenUserIdentityInformation.positionName[0];
                                        strss += cPosition + '</div>';
                                    } else {
                                        strss += '</div>';
                                    }

                                }
                            }
                            strss += "</div>";
                            strss += '</div>';
                            strss += '</div>';
                            strss += '<div class="likeDiv">';

                            if (validate(comData.commentaryCount)) {
                                strss += '<i class="likeNum">' + comData.commentaryCount + '</i>';
                            }
                            console.log(comData.commentaryCount);
                            strss += '<img class="likeThumbs" src="./img/like.png" alt="">';
                            strss += '</div>';
                            strss += '</div>';
                            strss += '</div>';
                            if (comData.comment_content) {
                                strss += '<div class="comComment">' + comData.comment_content;
                            }
                            if (validate(comData.establish_date)) {
                                strss += '<p class="comDate">' + getMyDate(comData.establish_date) + '</p>';
                            }
                            strss += '</div>';
                            strss += "</div>";
                            console.log(strss);
                            s++;
                            if (data.commentContent.length > s) {
                                ondata();
                            } else {
                                $(".commentsContent").html(strss);
                            }
                        });
                    }
                } else {
                    $(".noComments").css("display", "block");
                }
            }

        }
    });
}
//判断是否是纯数字
function validate(obj) {
    var reg = /^[0-9]*$/;
    return reg.test(obj);

}