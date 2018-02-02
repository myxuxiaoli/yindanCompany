var userId;
window.onload = function () {
    userId = $.getStore("userId").replace(/(^\s*)|(\s*$)/g, "");
    console.log($.getStore("userId"));
    if (userId) {
        businessInfo();
        $.setStore('userId', userId, true);
    }

};
$('.companyName').on('change', function () {
    $.setStore('addBusinessInfo', {
        company_name: $(this).val()
    });
});

function businessInfo() {
    var getRequest = $.getRequest();
    if (getRequest.state == 1) {
        $.removeStore('addBusinessInfo');
    } else {
        var addBusinessInfo = $.getStore('addBusinessInfo');
        if (addBusinessInfo) {
            var data = JSON.parse(addBusinessInfo);
            console.log(data);
            $('.companyName').val(data.company_name);
            if (data.position_name) {
                $(".position").text('');
                var html = '';
                console.log(data.position_name);
                for (var item of data.position_name) {
                    html += '<span>' + item + '</span>';
                }

                $('.positionBox').append(html);
            }

            $('.industry').text(data.industry_name);
            if (data.business && data.business.length > 0) {
                $(".businessBg").text('');
                console.log("sss", data.business);
                var str = '';
                for (var item of data.business) {
                    str += "<span class='mainBusiness'>" + item + "</span>";
                }
                $('.businessBox .busBox').append(str);

            }
            if (data.scale_information) {
                $('.assets').text(data.scale_information);
            }
            if (data.other_instructions) {
                $(".introduce").text(data.other_instructions);
            }
        }
    }
}

$(".submitBtn").on('click', function () {
    var addBusinessInfo = $.getStore('addBusinessInfo');
    var data = JSON.parse(addBusinessInfo);
    console.log(JSON.parse(addBusinessInfo));
    console.log($.getStore('addBusinessInfo'));
    console.log("用户id" + userId);
    console.log("保存的数据" + data);
    if (userId) {
        $.changeAjax({
            url: 'companyApi/saveMyCompany.do',
            data: {
                userId: userId,
                industryId: data.industry_id,
                assetsScaleId: data.assets_scale_id,
                companyName: data.company_name,
                otherInstructions: data.other_instructions,
                business: data.business.join(','),
                position: data.position_name.join(','),
                requestType: 'h5'
            },
            callback: function (res) {
                console.log(res);
                $.MessagePrompt({
                    text: '信息保存成功！',
                    type: 2,
                    callback: function () {
                        window.location.href = "../components/myBusiness.html";
                    }
                });
            }
        });
    }


});

$(".positionBox").on("click", function () {
    window.location.href = "../components/addBusinessPosition.html";
});
$(".industryBox").on("click", function () {
    window.location.href = "../components/addBusinessIndustry.html";
});
$(".businessBox").on("click", function () {
    window.location.href = "../components/addMainBusiness.html";
});
$(".assetBox").on("click", function () {
    window.location.href = "../components/addBusinessAsset.html";
});
$(".introBox").on("click", function () {
    window.location.href = "../components/addBusinessInfo.html";
});