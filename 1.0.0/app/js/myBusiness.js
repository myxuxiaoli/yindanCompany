var userId;

window.onload = function () {
    userId = $.getStore("userId").replace(/(^\s*)|(\s*$)/g, "");

    console.log($.getStore("userId"));
    if (userId) {
        businessInfo();
        $.setStore('userId', userId, true);
    }

};

function businessInfo() {
    $.changeAjax({
        url: "companyApi/myCompanyIndustry.do",
        data: {
            userId: userId,
            requestType: "h5"
        },
        callback: function (res) {
            console.log(res.data);
            var html = '';
            for (var item of res.data) {
                html += '<li>';
                html += '<div class="firm">';
                html += '<div class="firmColor">';
                html += '<span class="companyName">' + item.company_name + '</span>&nbsp;';
                if (item.position_name) {
                    html += '<span class="positionName">' + item.position_name[0] + '</span>';
                }
                html += '<a href="./editBusiness.html?id=' + item.company_id + '" class="bianji">编辑';
                html += '<img class="rightpic" src="../images/edit@3x.png" alt="">';
                html += '</a>';
                html += '</div>';
                html += '</div>';
                if (item.industry_name) {
                    html += '<p>所处行业：' + item.industry_name + '</p>';
                }
                if (item.business) {
                    html += '<p>主营业务：' + item.business + '</p>';
                }
                html += '<p>资产规模：' + item.scale_information + '</p>';
                if (item.other_instructions) {
                    html += '<p>信息简介：' + item.other_instructions + '</p>';
                }
                html += '</li>';
            }
            $('.businessBox').html(html);
        }
    });
}