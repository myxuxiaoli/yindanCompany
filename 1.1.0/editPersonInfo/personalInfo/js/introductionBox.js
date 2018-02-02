var userInfo;
window.onload = function () {
    userInfo = JSON.parse($.getStore("userInfo"));
    if (userInfo.personal_signature != "") {
        $("#commerceInfo").val(userInfo.personal_signature);
        $(".countNum").text($("#commerceInfo").val().length);
    } else {
        $(".countNum").text("0");
    }

};

$("#commerceInfo").on("keyup", function (event) {
    $(".countNum").text($(this).val().length);
    console.log(event.keyCode);
    if (event.keyCode == 13 || event.keyCode == 32) {
        if ($(this).val().length >= 100) {
            $(this).attr("disabled", true);
            $.MessagePrompt({
                text: '自我介绍不能超过100个字！',
                type: 1,
                callback: function () {
                    $("#commerceInfo").attr("disabled", false);
                }
            });
        }
    }

    console.log($(this).val().length);
});
$('.submitBtn').on('click', function () {
    var val = $("#commerceInfo").val();
    $.setStore('userInfo', {
        personal_signature: val
    });
    $.MessagePrompt({
        text: '信息保存成功！',
        type: 2,
        callback: function () {
            window.location.href = './index.html';
        }
    });
});