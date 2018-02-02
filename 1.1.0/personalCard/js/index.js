var userId;
window.onload = function () {
    var getRequest = $.getRequest();
    userId = getRequest.userId;
    if (getRequest.userId) {
        var newId = getRequest.userId.replace(/\*/g, "=");
        var base = new Base64();
        userId = base.decode(newId);
    }
    if (userId) {
        myCard();
    } else {
        alert("该用户名片不存在！");
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
                $('.photo').attr('src', data.photo_url);
                imgState(data.photo_url, function (red) {
                    if (red === 'w') {
                        $('.photo').css({
                            'width': '100%'
                        });
                    } else if (red === 'h') {
                        $('.photo').css({
                            'height': '100%'
                        });
                    }
                });
            }
            if (data.user_name) {
                $(".userName").text(data.user_name);
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

                var user = JSON.parse($.getStore("user"));
                setTimeout(function () {
                    document.setTitle(data.user_name + "的名片");
                }, 5);
            }
            if (data.userIdentityInformation) {
                if (data.userIdentityInformation.identity_information != "") {
                    var newStr;
                    if (data.userIdentityInformation.identity_information.length > 15) {
                        newStr = data.userIdentityInformation.identity_information.substring(0, 15) + "…";
                    } else {
                        newStr = data.userIdentityInformation.identity_information;
                    }
                    $(".business").text(newStr);
                    if (data.userIdentityInformation.positionName != undefined && data.userIdentityInformation.positionName.length != 0) {
                        $(".business").text(newStr + data.userIdentityInformation.positionName[0]);
                    }
                }

            }



            if (data.strongField != undefined && data.strongField.length != 0) {
                var html = '';
                for (var j = 0; j < data.strongField.length; j++) {
                    html += " <em class='economics'>" + data.strongField[j] + "</em>";
                }
                $(".economicInfo").css("display", "block");
                $(".economicInfo").html(html);
            } else {
                $(".economicInfo").css("display", "none");
            }


        }
    });
}