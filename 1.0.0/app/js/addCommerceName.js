var userId;

window.onload = function () {
    userId = $.getStore("userId");

    console.log($.getStore("userId"));
    searCommerces();
};

function searCommerces() {
    $(".main input").on('input', function () {
        if ($(this).val() == '') {
            $('.main ul').hide();
        }
        var key = $(this).val();
        if (key.length > 0) {
            if (userId) {
                $.changeAjax({
                    url: 'myResourcesApi/fuzzySearchResourcesName.do',
                    data: {
                        resourcesName: key,
                        requestType: 'h5',
                        userId: userId
                    },
                    callback: function (res) {
                        if (res.data != '') {
                            var str = '';
                            for (var item of res.data) {
                                str += "<li data-id=" + item.my_resources_id + ">" + item.resources_name + "</li>";
                                $.setStore('chamberInfo', {
                                    resources_name: item.resources_name,
                                    my_resources_id: item.my_resources_id,
                                    resources_logo_url: item.resources_logo_url,
                                    resources_introduce: item.resources_introduce
                                });
                            }
                            $(".main ul").html(str);
                        }
                    }
                });
            }

        }
    });
    $('.main input').on('change', function () {
        $.setStore('chamberInfo', {
            resources_name: $(this).val()
        });
    });
    $(".main ul").on("click", "li", function () {
        $(".main input").val($(this).text());
    });
    $('.submitBtn').on("click", function () {
        $.removeStore('chamberInfo');
        var val = $(".main input").val();
        if (userId) {
            $.changeAjax({
                url: "myResourcesApi/verificationResourcesName.do",
                data: {
                    resourcesName: val,
                    userId: userId,
                    requestType: 'h5'
                },
                callback: function (res) {
                    console.log(res);
                    if (res.data.verificationType == 0) {
                        $.setStore('chamberInfo', {
                            resources_name: val
                        });
                        $.MessagePrompt({
                            text: '信息保存成功！',
                            type: 2,
                            callback: function () {
                                window.location.href = "../components/addCommerce.html";
                            }
                        });

                    } else {
                        $.MessagePrompt({
                            text: '您已加入该商会！',
                            callback: function () {
                                // window.location.href = "../components/addCommerceName.html";
                            }
                        });
                    }
                }
            });
        }


    });
}