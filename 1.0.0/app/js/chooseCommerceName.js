var userId;

console.log($.getStore("userId"));
window.onload = function () {
    userId = $.getStore("userId");

    console.log($.getStore("userId"));
    searCommerces();
};

function searCommerces() {
    console.log(JSON.parse($.getStore("singleCommerce")));
    $(".main input").on('input', function () {
        if ($(this).val() == '') {
            $('.main ul').hide();
        }
        var key = $(this).val();
        if (key.length > 0) {
            $.changeAjax({
                url: 'myResourcesApi/fuzzySearchResourcesName.do',
                data: {
                    resourcesName: key,
                    userId: userId,
                    requestType: 'h5'
                },
                callback: function (res) {
                    if (res.data != []) {
                        var str = '';
                        for (var item of res.data) {
                            str += "<li>" + item.resources_name + "</li>";
                            var val = $(".main input").val();
                            if (item.resources_name == val) {
                                $.setStore('singleCommerce', {
                                    resources_name: item.resources_name,
                                    my_resources_id: item.my_resources_id,
                                    resources_logo_url: item.resources_logo_url,
                                    resources_introduce: item.resources_introduce
                                });
                            }

                        }
                        $(".main ul").html(str);
                    } else {
                        console.log(JSON.parse($.getStore("singleCommerce")));
                    }
                }
            });
        }
    });
    $('.main input').on('change', function () {
        $.setStore('singleCommerce', {
            resources_name: $(this).val(),
        });
    });
    $(".main ul").on("click", "li", function () {
        $('.main input').val($(this).text());
        $.setStore('singleCommerce', {
            resources_name: $(this).text(),
        });
    });
    $('#TopmodalBtn').on("click", function () {
        $.MessagePrompt({
            text: '信息保存成功！',
            type: 2,
            callback: function () {
                window.location.href = '../components/editCommerce.html';
            }
        });

    });
}