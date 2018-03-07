var myOrganizationId;
var getRequest;
window.onload = function () {
    getRequest = $.getRequest();
    if (getRequest) {
        if (getRequest.myOrganizationId) {
            myOrganizationId = getRequest.myOrganizationId;
            businessInfo();
        }
    }
};
//顶部组织机构信息
function businessInfo() {
    console.log("顶部组织id:" + myOrganizationId);
    $.changeAjax({
        url: "myOrganizationApi/selectOrganizationInformation.do",
        data: {
            myOrganizationId: myOrganizationId,
            requestType: "h5"
        },
        callback: function (res) {
            var data = res.data;
            console.log(data);
            if (data) {
                if (data.organization_name) {
                    $(".friendName").text(data.organization_name);
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
                        document.setTitle("邀请函-" + data.organization_name);
                    }, 5);

                }
                if (data.organization_synopsis) {
                    $(".businessInfo").text(data.organization_synopsis);
                }
                if (data.organization_sign_url != "") {
                    imgState(data.organization_sign_url, function (red) {
                        if (red === 'w') {
                            $('.photoBox').html("<img style='width:100%;' src='" + data.organization_sign_url + "'>");
                        } else if (red === 'h') {
                            $('.photoBox').html("<img style='height:100%;' src='" + data.organization_sign_url + "'>");
                        }
                    });
                }
            }

        }
    });
}