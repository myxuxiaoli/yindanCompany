var organizationId;
var shareUserId;
var getRequest;
window.onload = function () {
    getRequest = $.getRequest();
    var base = new Base64();
    if (getRequest) {
        if (getRequest.organizationId) {
            organizationId = getRequest.organizationId;
            console.log("组织id存在：" + organizationId);
            organization();
        } else {
            organizationId = 19;
            console.log("组织id不存在：" + organizationId);
            organization();
        }
        if (getRequest.shareUserId) {
            shareUserId = base.decode(getRequest.shareUserId.replace(/\*/g, "="));
            console.log("shareUserId存在：" + shareUserId);
        } else {
            shareUserId = 17;
            console.log("shareUserId不存在：" + shareUserId);
        }

    }
};

function organization() {
    $.changeAjax({
        url: "myOrganizationApi/selectOrganizationDetails.do",
        data: {
            myOrganizationId: organizationId,
            requestType: "h5"
        },
        callback: function (res) {
            var data = res.data;
            console.log(data);
            if (data) {
                if (data.myOrganization) {
                    if (data.myOrganization.organization_sign_url) {
                        imgState(data.myOrganization.organization_sign_url, function (red) {
                            if (red === 'w') {
                                $('.photoBox').html("<img style='width:100%;' src='" + data.myOrganization.organization_sign_url + "'>");
                            } else if (red === 'h') {
                                $('.photoBox').html("<img style='height:100%;' src='" + data.myOrganization.organization_sign_url + "'>");
                            }
                        });
                    }
                    if (data.myOrganization.add_condition) {
                        var newContion = data.myOrganization.add_condition.replace(/\n/g, "<br/>");
                        $(".enterInfo").html(newContion);
                    }
                    if (data.myOrganization.organization_synopsis) {
                        $(".introInfo").text(data.myOrganization.organization_synopsis);
                    }
                    if (data.myOrganization.organization_name) {
                        $(".identityName").text(data.myOrganization.organization_name);
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
                            document.setTitle("云商荟-" + data.myOrganization.organization_name);
                        }, 5);
                    }

                    if (data.myOrganization.my_organization_id) {
                        $(".identityName").attr("data-id", data.myOrganization.my_organization_id);
                    }
                    if (data.myOrganization.location_city) {
                        $(".position .rigth").text(data.myOrganization.location_city);
                        if (data.myOrganization.location_city.length > 4) {
                            $(".chances").css("textAlign", "left");
                        }
                    }
                }
                if (data.identityPosition != undefined && data.identityPosition.length != 0) {
                    var newStr = "";
                    if (data.identityPosition.length == 1) {
                        newStr += '<span class="ppleft">已有</span>';
                        newStr += '<span class="positionNums">' + data.identityPosition[0].rs + '位</span><span class="positions">' + data.identityPosition[0].position_name + "加入</span>";
                        $(".topBotInner").html(newStr);
                    } else if (data.identityPosition.length > 1) {
                        newStr += '<span class="ppleft">已有</span>';
                        newStr += '<span class="positionNums">' + data.identityPosition[0].rs + '位</span><span class="positions">' + data.identityPosition[0].position_name + "</span>";
                        var newArr = data.identityPosition.slice(1);
                        for (var i = 0; i < newArr.length; i++) {
                            newStr += '，<span class="positionNums">' + newArr[i].rs + '位</span><span class="positions">' + newArr[i].position_name + "</span>";
                        }
                        newStr += "<span>加入</span>";
                        $(".topBotInner").html(newStr);
                    }

                }
                if (validate(data.dynamicCount)) {
                    $(".dynamic .rigth").text(data.dynamicCount);
                }
                if (validate(data.businessOpportunityCount)) {
                    $(".chances .rigth").text(data.businessOpportunityCount);
                }
                if (validate(data.organizationMemberTotalNumber)) {
                    $(".memberNums").text("(" + data.organizationMemberTotalNumber + ")");
                }
                if (data.organizationMember != undefined && data.organizationMember.length != 0) {
                    console.log(data.organizationMember);
                    var photoStr = "";
                    var m = 0;
                    recursive();

                    function recursive() {
                        if (m < 5) {
                            var imgUrl = '';
                            var img = new Image();
                            if (data.organizationMember[m].head_portrait_url) {
                                imgUrl = data.organizationMember[m].head_portrait_url;
                            } else {
                                imgUrl = "http://yindantech.com/h5/organizationDetail/img/user.png";
                            }
                            img.src = imgUrl;
                            img.onload = function () {
                                if (img.width >= img.height) {
                                    photoStr += "<div class='photosItem' data-id=" + data.organizationMember[m].user_id + ">";
                                    photoStr += '<img style="height:100%;" src="' + imgUrl + '" alt="">';
                                    photoStr += "</div>";
                                } else if (img.width < img.height) {
                                    photoStr += "<div class='photosItem' data-id=" + data.organizationMember[m].user_id + ">";
                                    photoStr += '<img style="width:100%;" src="' + imgUrl + '" alt="">';
                                    photoStr += "</div>";
                                }
                                m++;
                                if (data.organizationMember.length > m) {
                                    recursive();
                                } else {
                                    $(".photosBox").html(photoStr);
                                }
                            };

                        } else {
                            photoStr += '<div class="diandian">…</div>';
                            console.log(photoStr);
                            $(".photosBox").html(photoStr);
                        }
                    }
                }
                if (data.userTagLibrary != undefined && data.userTagLibrary.length != 0) {
                    var businessStr = "";
                    if (data.userTagLibrary.length <= 5) {
                        for (var k = 0; k < data.userTagLibrary.length; k++) {
                            businessStr += '<span>' + data.userTagLibrary[k].tag_name + '(' + data.userTagLibrary[k].sl + ')' + '</span>';
                        }
                    } else {
                        var newBusinessTagArr = data.userTagLibrary.slice(0, 5);
                        for (var j = 0; j < data.userTagLibrary.length; j++) {
                            businessStr += '<span>' + data.userTagLibrary[j].tag_name + '(' + data.userTagLibrary[j].sl + ')' + '</span>';
                        }
                    }
                    $(".businessTag").html(businessStr);
                }
            }
        }
    });
}

$(".photosBox").on("click", ".photosItem", function () {
    var photoUserId = $(this).attr("data-id");
    console.log(photoUserId);
    var base = new Base64();
    var userId = base.encode(photoUserId).replace(/\=/g, "*");
    window.location.href = "./personalCard/index.html?userId=" + userId;
});
$(".enterEntry").on("click", function () {
    var topOrganizationId = $(".identityName").attr("data-id");
    window.location.href = "./lettersOfInvitation/index.html?myOrganizationId=" + topOrganizationId + "&shareUserId=" + shareUserId;
});