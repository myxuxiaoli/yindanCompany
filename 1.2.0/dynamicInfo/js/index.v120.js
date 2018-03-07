var myDynamicId;
var getRequest;
window.onload = function () {
    getRequest = $.getRequest();
    userId = getRequest.userId;
    console.log(getRequest);
    if (getRequest.myDynamicId) {
        myDynamicId = getRequest.myDynamicId;
        console.log("动态ID存在：" + myDynamicId);
        myDynamics();
    } else {
        myDynamicId = 382;
        console.log("动态ID存在：" + myDynamicId);
        myDynamics();
    }
};

function getzf(num) { //月份补0
    if (parseInt(num) < 10) {
        num = '0' + num;
    }
    return num;
}
myDynamics();

function myDynamics() {
    $.changeAjax({
        url: 'myDynamicApi/dynamicDetails.do',
        data: {
            myDynamicId: myDynamicId,
            requestType: 'h5',
            version: 1.2
        },
        callback: function (res) {
            if (res.data) {
                var data = res.data;
                console.log(data);
                if (validate(data.dynamic_type)) {
                    if (data.dynamic_type == 5) {
                        if (data.myOrganizationMap) {
                            if (data.myOrganizationMap.organization_sign_url) {
                                imgState(data.myOrganizationMap.organization_sign_url, function (red) {
                                    if (red === 'w') {
                                        $('.photoImgDiv').append("<img class='myImage' style='width:100%;' src='" + data.myOrganizationMap.organization_sign_url + "'>");
                                    } else if (red === 'h') {
                                        $('.photoImgDiv').append("<img class='myImage' style='height:100%;' src='" + data.myOrganizationMap.organization_sign_url + "'>");
                                    }
                                });
                            }
                            if (data.myOrganizationMap.organization_name) {
                                $(".vvc").show();
                                $(".names").html(data.myOrganizationMap.organization_name);
                                $(".uName").css("marginTop", "0.5rem");
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
                                    document.setTitle(data.myOrganizationMap.organization_name + "的动态");
                                }, 5);
                            } else {
                                $(".vvc").hide();
                            }
                        }
                    }
                }
                if (data.user) {
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
                        $(".names").text(data.user.user_name);
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
                        $(".vv").show();
                        if (data.user.userIdentityInformation.identity_information) {
                            var newStr = ""; //限定12个字，多余的省略
                            if (data.user.userIdentityInformation.identity_information.length > 15) {
                                newStr = data.user.userIdentityInformation.identity_information.substring(0, 15) + "…  ";
                            } else {
                                newStr = data.user.userIdentityInformation.identity_information + "  ";
                            }
                            $(".companyName").text(newStr + "  ");
                            if (data.user.userIdentityInformation.positionName != undefined && data.user.userIdentityInformation.positionName.length != 0) {
                                $(".companyName").text(newStr + data.user.userIdentityInformation.positionName[0] + "  ");
                            }
                        }

                    } else {
                        $(".vv").hide();
                        $(".uName").css("marginTop", "0.5rem");
                    }


                }
                if (validate(data.establish_date)) {
                    $(".dynamicDate").text(getMyDate(data.establish_date));
                }
                if (data.my_dynamic_content) {
                    $(".dynamicContent").text(data.my_dynamic_content);
                }
                if (data.myOrganization != undefined && data.myOrganization.length != 0) {
                    $(".commerce").show();
                    $(".commerce").text(data.myOrganization[0]);
                } else {
                    $(".commerce").hide();
                }
                var html = '';
                if (data.dynamicPhoto != undefined && data.dynamicPhoto.length != 0) {
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
                            strss += '<div class="identUserNameBox">';
                            if (comData.user_name) {
                                strss += '<div class="identUserName">' + comData.user_name;
                            }
                            if (comData.commentContenMyOrganization != undefined && comData.commentContenMyOrganization.length != 0) {
                                strss += '<span class="identCommerce">' + comData.commentContenMyOrganization[0] + '</span>';
                            }
                            strss += '</div>';

                            strss += '<div class="identities">';
                            if (comData.commentContenUser) {
                                if (comData.commentContenUser.commentContenUserIdentityInformation) {
                                    if (comData.commentContenUser.commentContenUserIdentityInformation.identity_information) {
                                        var newString = "";
                                        if (comData.commentContenUser.commentContenUserIdentityInformation.identity_information.length > 15) {
                                            newString = comData.commentContenUser.commentContenUserIdentityInformation.identity_information.substring(0, 15) + "…  ";
                                            console.log(newString);
                                        } else {
                                            newString = comData.commentContenUser.commentContenUserIdentityInformation.identity_information + "  ";
                                            console.log(newString);
                                        }
                                        strss += '<div class="identityName">' + newString;

                                    }

                                    if (comData.commentContenUser.commentContenUserIdentityInformation.positionName != undefined && comData.commentContenUser.commentContenUserIdentityInformation.positionName.length != 0) {
                                        var cPosition = comData.commentContenUser.commentContenUserIdentityInformation.positionName[0];
                                        strss += cPosition;
                                        if (comData.commentContenUser.commentContenUserIdentityInformation.identity_type == 1) {
                                            strss += '<img src="./img/V@3x.png" alt="">';
                                        }
                                        strss += '</div>';
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
                            strss += '<img class="likeThumbs" src="./img/like.png" alt="">';
                            strss += '</div>';
                            strss += '</div>';
                            strss += '</div>';
                            if (comData.comment_content) {
                                strss += '<div class="comComment">' + comData.comment_content + '</div>';
                            }
                            if (validate(comData.establish_date)) {
                                strss += '<p class="comDate">' + getMyDate(comData.establish_date) + '</p>';
                            }
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