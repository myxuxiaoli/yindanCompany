var userId;
var myDynamicId;
window.onload = function () {
    var getRequest = $.getRequest();
    userId = getRequest.userId;
    if (getRequest.userId) {
        var base = new Base64();
        userId = base.decode(getRequest.userId);
    }
    myDynamicId = getRequest.myDynamicId;
    if (userId) {
        myDynamics();
    } else {
        userId = 13;
        myDynamics();
    }
    myDynamics();
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
            myDynamicId: 257,
            userId: 17,
            requestType: 'h5'
        },
        callback: function (res) {
            var data = res.data;
            console.log(data);
            if (res.data.user) {
                if (data.user.head_portrait_url) {
                    $(".personalPhoto").attr("src", data.user.head_portrait_url);
                }
                if (data.user.user_name) {
                    $(".dynamicInfo h3").text(data.user.user_name);
                }

                if (data.user.userIdentityInformation.identity_information) {
                    $(".companyName").text(data.user.userIdentityInformation.identity_information);
                }
                if (data.user.userIdentityInformation.positionName != undefined && data.user.userIdentityInformation.positionName.length != 0) {
                    $(".positionName").text(data.user.userIdentityInformation.positionName[0]);
                }

            }
            if (data.establish_date) {
                $(".dynamicDate").text(getMyDate(data.establish_date));
            }
            if (data.my_dynamic_content) {
                $(".dynamicContent").text(data.my_dynamic_content);
            }

            var html = '';
            if (data.dynamicPhoto != undefined && data.dynamicPhoto.length != 0) {
                for (var j = 0; j < data.dynamicPhoto.length; j++) {
                    html += "<img src='" + data.dynamicPhoto[j].photo_url + "'" + "/>";
                }
                $(".dyPhotos").html(html);
            }
            if (data.forwardCount) {
                $(".transmit i").text(data.forwardCount);
            }
            if (data.fabulousCount) {
                $(".thumbs-up i").text(data.fabulousCount);
            }
            if (data.commentCount) {
                $(".comments i").text(data.commentCount);
            }
            var strss = '';
            // if (data.commentContent != undefined && data.commentContent.length != 0) {
            //     for (var k = 0; k < data.commentContent.length; k++) {
            //         strss += '<div class="commentPorson">';
            //         strss += '<div class="personaImage">';
            //         if (data.commentContent[k].commentContenUser.head_portrait_url) {
            //             strss += '<img style="height:2rem;" src="' + data.commentContent[k].commentContenUser.head_portrait_url + '" alt="">';
            //         }
            //         strss += '</div><div class="personinfo">';
            //         strss += '<div class="userInfo"><div class="info">';
            //         if (data.commentContent[k].commentContenUser.business_card_type == 1) {
            //             if (data.commentContent[k].commentContenUser.user_name) {
            //                 strss += '<span>' + data.commentContent[k].commentContenUser.user_name + '</span><i></i></div>';
            //             }
            //         } else {
            //             if (data.commentContent[k].commentContenUser.user_name) {
            //                 strss += '<span>' + data.commentContent[k].commentContenUser.user_name + '</span></div>';
            //             }
            //         }
            //         strss += '<div class="like">';
            //         if (data.commentContent[k].commentaryCount) {
            //             strss += '<span>' + data.commentContent[k].commentaryCount + '</span><i></i></div></div>';
            //         }
            //         if (data.commentContent[k].commentContenUser.userIdentityInformation.identity_information) {
            //             strss += '<h4>' + data.commentContent[k].commentContenUser.userIdentityInformation.identity_information + '</h4>';
            //         }
            //         if (data.commentContent[k].commentContenUser.userIdentityInformation.positionName != undefined && data.commentContent[k].commentContenUser.userIdentityInformation.positionName.length != 0) {
            //             strss += '<span>' + data.commentContent[k].commentContenUser.userIdentityInformation.positionName[0] + '</span>';
            //         }
            //         if (data.commentContent[k].comment_content) {
            //             strss += '<div class="content">' + data.commentContent[k].comment_content + '</div>';
            //         }
            //         if (data.commentContent[k].establish_date) {
            //             strss += '<p class="date">' + getMyDate(data.commentContent[k].establish_date) + '</p></div></div>';
            //         }
            //     }
            //     $(".commentsContent").html(strss);
            // }
        }
    });
}