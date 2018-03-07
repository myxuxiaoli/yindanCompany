var userId;
var getRequest = $.getRequest();
window.onload = function () {

    if (getRequest.userId) {
        var newId = getRequest.userId.replace(/\*/g, "=");
        var base = new Base64();
        userId = base.decode(newId);
    }
    if (userId) {
        myCard();
        console.log("用户id存在：" + userId);
    } else {
        console.log("该用户id不存在！");
    }
};

function myCard() {
    $.changeAjax({
        url: "businessCardApi/myBusinessCard.do",
        data: {
            userId: userId,
            requestType: 'h5'
        },
        callback: function (res) {
            var data = res.data;
            console.log(data);
            if (data.photo_url) {
                $('.photoBox img').attr('src', data.photo_url);
                imgState(data.photo_url, function (red) {
                    if (red === 'w') {
                        $('.photoBox img').css({
                            'width': '100%'
                        });
                    } else if (red === 'h') {
                        $('.photoBox img').css({
                            'height': '100%'
                        });
                    }
                });
            }
            if (data.user_name) {
                $(".personName").text(data.user_name);
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
                    document.setTitle(data.user_name);
                }, 5);
            }
            if (data.myOrganization != undefined && data.myOrganization.length != 0) {
                $(".commerce").show();
                var newCommerce;
                if (data.myOrganization[0].length > 14) {
                    newCommerce = data.myOrganization[0].substring(0, 14) + "…";
                } else {
                    newCommerce = data.myOrganization[0];
                }
                $(".commerce").text(newCommerce);
            } else {
                $(".commerce").hide();
            }
            if (data.userIdentityInformation) {
                if (data.userIdentityInformation.identity_information != "") {
                    var newStr;
                    if (data.userIdentityInformation.identity_information.length > 10) {
                        newStr = data.userIdentityInformation.identity_information.substring(0, 10) + "…  ";
                    } else {
                        newStr = data.userIdentityInformation.identity_information + "  ";
                    }
                    $(".businessName").text(newStr);
                    if (data.userIdentityInformation.positionName != undefined && data.userIdentityInformation.positionName.length != 0) {
                        var positions;
                        if (data.userIdentityInformation.positionName[0].length > 5) {
                            positions = data.userIdentityInformation.positionName[0].substring(0, 5) + "…  ";
                        } else {
                            positions = data.userIdentityInformation.positionName[0] + "  ";
                        }
                        $(".businessName").text(newStr + positions);
                    }
                }
                if (validate(data.business_card_type)) {
                    if (data.business_card_type == 1) {
                        $(".vvv").show();
                    } else {
                        $(".vvv").hide();
                    }
                }
            }
            if (data.strongField != undefined && data.strongField.length != 0) {
                console.log(data.strongField);
                var html = '';
                for (var j = 0; j < data.strongField.length; j++) {
                    html += " <span>" + data.strongField[j] + "</span>";
                }
                $(".goodAtTags").html(html);
                $(".goodAtTags").css("padding", "0rem 1rem 1rem 0.75rem");
            }
        }
    });
}