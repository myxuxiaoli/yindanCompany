var userId;
window.onload = function () {
    userId = $.getStore("userId").replace(/(^\s*)|(\s*$)/g, "");
    console.log(userId);
    $("#commerceInfo").on("keyup", function (event) {
        $(".countNum").text($(this).val().length);
        if (event.keyCode == 13 || event.keyCode == 32) {
            if ($(this).val().length >= 30) {
                $(this).attr("disabled", true);
                $.MessagePrompt({
                    text: '荣誉名称不能超过30个字！',
                    type: 1,
                    callback: function () {
                        $("#commerceInfo").attr("disabled", false);
                    }
                });
            }
        }

        console.log($(this).val().length);
    });
    $("#submitBtn").on("click", function () {
        $.changeAjax({
            url: "myGloryApi/saveMyGlory.do",
            data: {
                userId: userId,
                requestType: "h5",
                gloryContent: $("#commerceInfo").val()
            },
            callback: function (res) {
                console.log(res);
                $.MessagePrompt({
                    text: '信息保存成功！',
                    type: 2,
                    callback: function () {
                        window.location.href = "./index.html";
                    }
                });
            }
        });

    });

};