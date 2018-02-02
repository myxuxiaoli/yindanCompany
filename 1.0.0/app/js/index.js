var userId;
window.onload = function () {
    var getRequest = $.getRequest();
    userId = getRequest.userId;
    if (getRequest.userId) {
        var base = new Base64();
        userId = base.decode(getRequest.userId);
    }
    console.log(userId);
    if (userId) {
        personInfo();
        businessInfo();
        commerceInfo();
        console.log("userId存在！", userId);
        $.setStore('userId', userId, true);
    } else {
        userId = 13;
        personInfo();
        businessInfo();
        commerceInfo();
        console.log("userId不存在！");
        $.setStore('userId', 13, true);
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
                    $('.userImg').html('<img src="' + reg.data[0] + '"/>');
                }
            });
        });
    }
}

//用户默认头像以及个人信息部分数据请求

function personInfo() {
    $.changeAjax({
        url: "userApi/myInformation.do",
        data: {
            userId: userId,
            requestType: "h5"
        },
        callback: function (reg) {
            console.log(reg);
            $(".photo").attr('src', reg.data.head_portrait_url);
            $('.user_name').html(reg.data.user_name);
            $('.user_sex').text(reg.data.user_sex);
            $('.hometown').text(reg.data.hometown);
            $('.city').text(reg.data.city);
            $('.graduate_from').html(reg.data.graduate_from);
            $('.hobby').html(reg.data.hobby);
        }
    });
}
//企业信息部分数据请求
function businessInfo() {
    $.changeAjax({
        url: "companyApi/myCompanyIndustry.do",
        data: {
            userId: userId,
            requestType: "h5"
        },
        callback: function (res) {
            console.log(res.data);
            console.log(res.data.position_name);
            $(".addBusinessInfo").hide();
            if (res.data) {
                var str = '';
                var data = res.data;
                if (data.length > 2) {
                    var dataArr = data.slice(0, 2);
                    for (var i = 0; i < dataArr.length; i++) {
                        str += '<li>';
                        str += '<div class="firm">';
                        str += '<div class="firmColor">';
                        str += '<img class="leftpic" src="./images/bus@3x.png" alt="">';
                        str += '<span class="company_name">' + dataArr[i].company_name + '</span>&nbsp;';
                        if (dataArr[i].position_name) {
                            str += '<span class="position_name">' + dataArr[i].position_name[0] + '</span>';
                        }
                        str += '</div></div><p>所处行业：<span class="industry_name">' + dataArr[i].industry_name + '</span></p>';
                        if (dataArr[i].business) {
                            str += '<p>主营业务：<span class="business">' + dataArr[i].business + '</span></p> ';
                        }
                        if (dataArr[i].scale_information) {
                            str += '<p>资产规模：<span class="scale_information">' + dataArr[i].scale_information + '</span></p>';
                        }
                        if (dataArr[i].other_instructions) {
                            str += '<p>信息简介：<span class="other_instructions">' + dataArr[i].other_instructions + '</span></p>';
                        }


                        str += '</li>';
                    }
                    $('#business-information ul').html(str);
                } else {
                    console.log(data.position_name);
                    for (var i = 0; i < data.length; i++) {
                        str += '<li>';
                        str += '<div class="firm">';
                        str += '<div class="firmColor">';
                        str += '<img class="leftpic" src="./images/bus@3x.png" alt="">';
                        str += '<span class="company_name">' + data[i].company_name + '</span>&nbsp;';
                        if (data[i].position_name) {
                            str += '<span class="position_name">' + data[i].position_name[0] + '</span>';
                        }
                        str += '</div></div><p>所处行业：<span class="industry_name">' + data[i].industry_name + '</span></p>';
                        if (data[i].business) {
                            str += '<p>主营业务：<span class="business">' + data[i].business + '</span></p> ';
                        }
                        if (data[i].scale_information) {
                            str += '<p>资产规模：<span class="scale_information">' + data[i].scale_information + '</span></p>';
                        }
                        if (data[i].other_instructions) {
                            str += '<p>信息简介：<span class="other_instructions">' + data[i].other_instructions + '</span></p>';
                        }
                        str += '</li>';
                    }
                    $('#business-information ul').html(str);
                }
            } else {
                $(".addBusinessInfo").show();
                $('#business-information').hide();
            }
        }
    });
}
//商会，协会信息部分数据请求
function commerceInfo() {
    $.changeAjax({
        url: "myResourcesApi/selectMyResources.do",
        data: {
            userId: userId,
            requestType: "h5"
        },
        callback: function (res) {
            console.log("等等", res.data);
            if (res.data.resources === undefined || res.data.resources.length == 0) {
                $(".addCommerceInfo").show();
                $(".chamberOfCommerce").css("display", "none");
            } else {
                $(".addCommerceInfo").hide();
                $(".chamberOfCommerce a").css("display", "block");
                if (res.data.resources.length >= 2) {
                    var dms = res.data.resources.splice(0, 2);
                    console.log(dms);
                    var str = '';
                    for (var item of dms) {
                        str += "<li><div class='commerceLogo'>" +
                            '<img class="myLogos" src="' + item.resources_logo_url + '" alt=""></div>' +
                            '<div class="commerceAndRank">' +
                            "<h3>" + item.resources_name + "</h3><h5>" + item.position_name + "</h5>" +
                            "</div ></li>";
                    }
                    $(".main ul").html(str);
                } else {
                    var strr = '';
                    for (var items of res.data.resources) {
                        strr += "<li><div class='commerceLogo'>" +
                            '<img class="myLogos"  src="' + items.resources_logo_url + '" alt=""></div>' +
                            '<div class="commerceAndRank">' +
                            "<h3>" + items.resources_name + "</h3><h5>" + items.position_name + "</h5>" +
                            "</div ></li>";
                    }
                    $(".main ul").html(strr);
                }
                console.log(12345);

            }

        }
    });
}