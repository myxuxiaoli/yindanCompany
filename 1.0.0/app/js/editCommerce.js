var userId;

function commerceLogo(th) {
    if (th.files.length > 0) {
        new clip(th.files[0], function (reg) {

            var data = new FormData();
            data.append('files', reg);
            $.changeAjax({
                url: 'myResourcesApi/updateResourcesLogo.do',
                type: 'FORM',
                data: data,
                callback: function (reg) {
                    console.log(reg);
                    $('.resources_logo_url').html('<img src="' + reg.data[0] + '"/>');

                    $.setStore('singleCommerce', {
                        resources_logo_url: reg.data[0],
                    });
                    console.log(JSON.parse($.getStore('singleCommerce')));
                }
            });
        });
    }
}
window.onload = function () {
    userId = $.getStore("userId").replace(/(^\s*)|(\s*$)/g, "");
    console.log($.getStore("userId"));
    commerceInfo();
};

function commerceInfo() {
    var getRequest = $.getRequest();
    if (getRequest.state == 1) {
        var singleCommerce = $.getStore('singleCommerce');
        var data = JSON.parse(singleCommerce);
        console.log(data);
        $(".resources_name").html(data.resources_name);
        $(".resources_logo_url img").attr('src', data.resources_logo_url);
        if (data.position_name) {
            $(".position_name").html(data.position_name);
        }
        if (data.resources_introduce) {
            $(".resources_introduce").text(data.resources_introduce);
        }

        $(".rankBox").on("click", function () {
            window.location.href = "../components/chooseYourRank.html";
        });
        if (data.ltype != 0) {
            $(".introBox").on('click', function () {
                console.log(2222);
                window.location.href = "../components/commerceIntroduction.html";
            });
            $(".nameBox").on('click', function () {
                console.log(2222);
                window.location.href = "../components/chooseCommerceName.html";

            });

        } else {
            $(".nameBox").on('click', function () {
                $.MessagePrompt({
                    text: '对不起，您不是商会管理员，不能修改商会名字！',
                    callback: function () {
                        window.location.href = "../components/editCommerce.html?state=1";
                    }
                });
            });
            $(".introBox").on('click', function () {
                $.MessagePrompt({
                    text: '对不起，您不是商会管理员，不能修改商会简介！',
                    callback: function () {
                        window.location.href = "../components/editCommerce.html?state=1";
                    }
                });
            });
            $(".searchLogo input").remove();
            $("#resources_logo_url").on('click', function () {
                $.MessagePrompt({
                    text: '对不起，您不是商会管理员，不能修改商会Logo！',
                    callback: function () {
                        window.location.href = "../components/editCommerce.html?state=1";
                    }
                });
            });
            $(".resources_logo_url input").remove();
            $(".resources_logo_url").on('click', 'img', function () {
                $.MessagePrompt({
                    text: '对不起，您不是商会管理员，不能修改商会Logo！',
                    callback: function () {
                        window.location.href = "../components/editCommerce.html?state=1";
                    }
                });
            });
        }

    } else {
        var singleCommerce = $.getStore('singleCommerce');
        if (singleCommerce) {
            var datas = JSON.parse(singleCommerce);
            console.log(datas);
            $(".resources_name").html(datas.resources_name);
            $(".resources_logo_url img").attr('src', datas.resources_logo_url);
            if (datas.position_name) {
                $(".position_name").html(datas.position_name);
            }
            if (datas.resources_introduce) {
                $(".resources_introduce").text(datas.resources_introduce);
            }
            $(".rankBox").on("click", function () {
                window.location.href = "../components/chooseYourRank.html";
            });
            if (datas.ltype != 0) {
                $(".introBox").on('click', function () {
                    console.log(2222);
                    window.location.href = "../components/commerceIntroduction.html";
                });
                $(".nameBox").on('click', function () {
                    console.log(2222);
                    window.location.href = "../components/chooseCommerceName.html";

                });


                $(".searchLogo").on("click", 'a', function () {
                    $(".searchLogo").append('<input type="file" onchange="commerceLogo(this)">');
                });
                $(".resources_logo_url").on("click", 'img', function () {
                    $(".resources_logo_url").append('<input type="file" onchange="commerceLogo(this)">');
                });
            } else {
                $(".nameBox").on('click', function () {
                    $.MessagePrompt({
                        text: '对不起，您不是商会管理员，不能修改商会名字！',
                        callback: function () {
                            window.location.href = "../components/editCommerce.html?state=1";
                        }
                    });
                });
                $(".introBox").on('click', function () {
                    $.MessagePrompt({
                        text: '对不起，您不是商会管理员，不能修改商会简介！',
                        callback: function () {
                            window.location.href = "../components/editCommerce.html?state=1";
                        }
                    });
                });
                $("#resources_logo_url").on('click', function () {
                    $.MessagePrompt({
                        text: '对不起，您不是商会管理员，不能修改商会Logo！',
                        callback: function () {
                            window.location.href = "../components/editCommerce.html?state=1";
                        }
                    });
                });
                $(".resources_logo_url").on('click', 'img', function () {
                    $.MessagePrompt({
                        text: '对不起，您不是商会管理员，不能修改商会Logo！',
                        callback: function () {
                            window.location.href = "../components/editCommerce.html?state=1";
                        }
                    });
                });
            }
            $.setStore('singleCommerce', datas, true);
        }
    }
}
//保存商会事件
$(".subBtnBox .submitBtn").on('click', function () {
    var singleCommerce = $.getStore('singleCommerce');
    if (singleCommerce) {
        var data = JSON.parse(singleCommerce);
        console.log(data);
        if (userId) {
            $.changeAjax({
                url: 'myResourcesApi/updateMyResources.do',
                data: {
                    myResourcesId: data.my_resources_id,
                    userId: userId,
                    positionId: data.position_id,
                    resourcesIntroduce: data.resources_introduce,
                    resourcesLogoUrl: data.resources_logo_url,
                    resourcesName: data.resources_name,
                    requestType: 'h5'
                },
                callback: function (res) {
                    console.log(res);
                    $.MessagePrompt({
                        text: '信息保存成功！',
                        type: 2,
                        callback: function () {
                            window.location.href = "../components/myCommerce.html";
                        }
                    });
                }
            });
        }

    }



});

//删除商会按钮事件
$("#TopmodalBtn").on("click", function () {
    var singleCommerce = $.getStore('singleCommerce');
    console.log(singleCommerce);
    if (singleCommerce) {
        var data = JSON.parse(singleCommerce);
        console.log(data.my_resources_id);
        if (data.my_resources_id) {
            if (userId) {
                $.changeAjax({
                    url: 'myResourcesApi/signOutResources.do',
                    data: {
                        myResourcesId: data.my_resources_id,
                        userId: userId,
                        requestType: 'h5'
                    },
                    callback: function (res) {
                        console.log(res);
                        if (res.data) {
                            var data = res.data;
                            $.setStore('managers', data, true);
                            var s = $.getStore('managers');
                            var datas = JSON.parse(s);
                            console.log(datas);
                            window.location.href = "../components/deleteCommerce.html";
                        } else {
                            console.log(1111);
                            $.MessagePrompt({
                                text: '删除成功！',
                                type: 2,
                                callback: function () {
                                    window.location.href = "../components/myCommerce.html";
                                }
                            });
                        }

                    }
                });
            }

        }
    }

});