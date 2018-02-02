var userId;
window.onload = function () {
    userId = $.getStore("userId");

    console.log($.getStore("userId"));
    commerceInfo();
}

function commerceInfo() {
    var dataArr = [];
    if (userId) {
        $.changeAjax({
            url: "myResourcesApi/selectMyResources.do",
            data: {
                userId: userId,
                requestType: "h5"
            },
            callback: function (res) {
                console.log(res.data);
                var data = res.data.resources;
                var str = '';
                for (var item of res.data.resources) {
                    str += '<li>';
                    str += '<span class="identification"></span>';
                    str += '<img class="commerceLogo" src="' + item.resources_logo_url + '" alt="">';
                    str += '<div class="commerceAndRank">';
                    str += '<h3>' + item.resources_name + '</h3>';
                    str += '<h5>' + item.position_name + '</h5>';
                    str += '</div>';
                    str += '<span class="edit">编辑';
                    str += '<img src="../images/edit@3x.png" alt="">';
                    str += '</span></li>';
                    if (item.authentication === '已认证') {
                        $(".identification").html(' <img src="../images/yellow@3x.png" alt="">');
                    } else {
                        $(".identification").html('');
                    }
                }
                $(".main ul").html(str);
                $.setStore('myCommerce', data, true);
                var myCommerce = JSON.parse($.getStore('myCommerce'));
            }

        });
    }


}

$(".main ul").on("click", "li .edit", function () {
    var myCommerce = JSON.parse($.getStore('myCommerce'));
    var ins = $(this).parent().index();
    $.setStore('singleCommerce', myCommerce[ins], true);
    console.log(JSON.parse($.getStore('singleCommerce')));
    window.location.href = "./editCommerce.html?state=1";
});
$("#addCommerceBtn").on("click", function () {
    var myCommerce = JSON.parse($.getStore('myCommerce'));
    if (myCommerce.length >= 5) {
        $.MessagePrompt({
            text: '对不起，一个用户最多只能添加5个商会！',
            callback: function () {
                window.location.href = "../components/myCommerce.html";
            }
        });
    } else {
        window.location.href = "../components/addCommerce.html?state=1";
    }
});