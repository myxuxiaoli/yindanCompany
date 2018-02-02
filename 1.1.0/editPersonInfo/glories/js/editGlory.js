var userId;
window.onload = function () {
    userId = $.getStore("userId").replace(/(^\s*)|(\s*$)/g, "");
    console.log(userId);
    var gloryData = JSON.parse($.getStore("gloryItem"));
    console.log(gloryData);
    $("#commerceInfo").val(gloryData.glory_content);
    $(".countNum").text($("#commerceInfo").val().length);
    // 保存荣誉
    $("#submitBtn").on("click", function () {
        var gloryData = JSON.parse($.getStore("gloryItem"));
        console.log(gloryData);
        var val = $("#commerceInfo").val();
        $.changeAjax({
            url: "myGloryApi/updateMyGlory.do",
            data: {
                myGloryId: gloryData.my_glory_id,
                requestType: "h5",
                gloryContent: val
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
    //删除荣誉
    $("#deleteBtn").on("click", function () {
        var gloryData = JSON.parse($.getStore("gloryItem"));
        console.log(gloryData);
        $.changeAjax({
            url: "myGloryApi/deleteMyGlory.do",
            data: {
                myGloryId: gloryData.my_glory_id,
                requestType: "h5"
            },
            callback: function (res) {
                console.log(res);
                $.MessagePrompt({
                    text: '删除成功！',
                    type: 2,
                    callback: function () {
                        window.location.href = "./index.html";
                    }
                });
            }
        });
    });
};