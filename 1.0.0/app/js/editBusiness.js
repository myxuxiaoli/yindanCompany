var userId;
window.onload = function () {
    userId = $.getStore("userId").replace(/(^\s*)|(\s*$)/g, "");
    console.log(userId);
    if (userId) {
        businessInfo();
        $.setStore('userId', userId, true);
    }

};

function businessInfo() {
    var getRequest = $.getRequest();
    if (getRequest.id) {
        $.changeAjax({
            url: "companyApi/myCompanyIndustry.do",
            data: {
                companyId: getRequest.id,
                requestType: "h5"
            },
            callback: function (res) {
                var data = res.data[0];
                $('.user_name').val(data.company_name);
                var str = '';
                for (var item of data.position_name) {
                    str += '<span class="positiones">' + item + '</span>';
                }
                $('.positionBox').append(str);
                $('.hometown').text(data.industry_name);
                $('.hometown').attr('data-id', data.industry_id);
                var html = '';
                if (data.business && data.business.length > 0) {
                    $(".businessBg").text('');
                    for (var item of data.business) {
                        html += "<span class='mainBusiness'>" + item + "</span>";
                    }
                    $('.businessBox .busBox').append(html);
                    console.log(html);
                }
                if (data.scale_information) {
                    $('.city').text(data.scale_information);
                }
                if (data.other_instructions) {
                    $('.other_instructions').text(data.other_instructions);
                }
                $.setStore('enterprise', data, true);
                var enterprise = $.getStore('enterprise');
                console.log(JSON.parse(enterprise));
            }
        });
    } else {
        var enterprise = $.getStore('enterprise');
        var data = JSON.parse(enterprise);
        console.log(JSON.parse(enterprise));
        $('.user_name').val(data.company_name);
        var str = '';
        for (var item of data.position_name) {
            str += '<span class="positiones">' + item + '</span>';
        }
        $('.positionBox').append(str);
        $('.hometown').text(data.industry_name);
        var html = '';
        if (data.business && data.business.length > 0) {
            $(".businessBg").text('');
            for (var item of data.business) {
                html += "<span class='mainBusiness'>" + item + "</span>";
            }
            $('.businessBox .busBox').append(html);
            console.log(html);
        }
        $('.businessBox .busBox').html(html);
        if (data.scale_information) {
            $('.city').text(data.scale_information);
        }
        if (data.other_instructions) {
            $('.other_instructions').text(data.other_instructions);
        }

    }
}
$('.user_name').on('change', function () {
    $.setStore('enterprise', {
        company_name: $(this).val(),
        // industry_id: $('.hometown').attr('data-id')

    });
});
//保存按钮事件
$('.submitBtn').on('click', function () {
    var enterprise = $.getStore('enterprise');
    var data = JSON.parse(enterprise);
    console.log(JSON.parse(enterprise));
    console.log($.getStore('enterprise'));
    console.log("用户id" + userId);
    console.log("保存的数据" + data);

    if (userId) {
        $.changeAjax({
            url: 'companyApi/updateMyCompany.do',
            data: {
                companyId: data.company_id,
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


//删除企业事件
$('#TopmodalBtn').on('click', function () {
    var enterprise = $.getStore('enterprise');
    var data = JSON.parse(enterprise);
    $.changeAjax({
        url: 'companyApi/deleteMyCompany.do',
        data: {
            companyId: data.company_id,
            requestType: 'h5'
        },
        callback: function (res) {
            console.log(res);
            $.MessagePrompt({
                text: '删除成功！',
                type: 2,
                callback: function () {
                    window.location.href = "../components/myBusiness.html";
                }
            });
        }
    });
});
$(".positionBox").on("click", function () {
    window.location.href = "../components/choosePosition.html"
});
$(".industryBox").on("click", function () {
    window.location.href = "../components/chooseIndustry.html"
});
$(".businessBox").on("click", function () {
    window.location.href = "../components/chooseMainBusiness.html"
});
$(".assetBox").on("click", function () {
    window.location.href = "../components/chooseAsset.html"
});
$(".introBox").on("click", function () {
    window.location.href = "../components/InformationIntroduction.html"
});