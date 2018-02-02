var userId;
window.onload = function () {
    var getRequest = $.getRequest();
    userId = getRequest.userId;
    if (getRequest.userId) {
        var base = new Base64();
        userId = base.decode(getRequest.userId);
    }
    if (userId) {
        myCard();
    } else {
        userId = 13;
        myCard();
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
            console.log(res);
            if (res.data) {
                var data = res.data;
                if (data.photo_url) {
                    $('.photo').attr('src', data.photo_url);
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
                if (data.city) {
                    $(".city").text(data.city);
                }
                if (data.userIdentityInformation) {
                    if (data.userIdentityInformation.identity_information) {
                        $('.business').text(data.userIdentityInformation.identity_information);
                    }
                    if (data.userIdentityInformation.positionName != undefined && data.userIdentityInformation.positionName.length != 0) {
                        var str = '';
                        for (var i = 0; i < data.userIdentityInformation.positionName.length; i++) {
                            str += "<span>" + data.userIdentityInformation.positionName[i] + "</span>";
                        }
                        $(".position").html(str);
                    }
                }
                if (data.strongField != undefined && data.strongField.length != 0) {
                    var html = '';
                    for (var j = 0; j < data.strongField.length; j++) {
                        html += " <em class='economics'>" + data.strongField[j] + "</em>";
                    }
                    $(".economicInfo").html(html);
                }
            }



        }
    });
}