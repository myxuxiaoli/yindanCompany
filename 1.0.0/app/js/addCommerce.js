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
                    console.log(reg.data);
                    $(".logoSpan").remove();
                    $('.resources_logo_url').html('<img src="' + reg.data[0] + '"/>');
                    $.setStore('chamberInfo', {
                        resources_logo_url: reg.data[0],
                    });
                }
            });
        });
    }
}


window.onload = function () {
    var getRequest = $.getRequest();
    userId = $.getStore("userId").replace(/(^\s*)|(\s*$)/g, "");
    if (getRequest.state == 1) {
        $.removeStore('chamberInfo');
    } else {
        var chamberInfo = $.getStore('chamberInfo');
        if (chamberInfo) {
            var data = JSON.parse(chamberInfo);
            console.log(data);
            if (data.resources_logo_url) {
                $(".logoSpan").remove();
                $(".resources_logo_url img").attr('src', data.resources_logo_url);
            }
            $('.commerceName').text(data.resources_name);
            $('.rankName').text(data.position_name);
            $('.resources_introduce').text(data.resources_introduce);
        }

    }
};

$('.submitBtn').on('click', function () {
    var chamberInfo = $.getStore('chamberInfo');
    if (chamberInfo) {
        var data = JSON.parse(chamberInfo);
        console.log(data);
        if (userId) {
            $.changeAjax({
                url: 'myResourcesApi/saveResourcesOrJoin.do',
                data: {
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
                        text: '添加成功！',
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

$(".nameBox").on("click", function () {
    window.location.href = "../components/addCommerceName.html";
});
$(".rankBox").on("click", function () {
    window.location.href = "../components/addCommerceRank.html";
});
$(".introBox").on("click", function () {
    window.location.href = "../components/addCommerceIntroduction.html";
});