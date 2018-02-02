$("#TopmodalBtn").on('click', function () {
    var val = $("#commerceInfo").val();
    $.setStore('singleCommerce', {
        resources_introduce: val
    });
    $.MessagePrompt({
        text: '信息保存成功！',
        type: 2,
        callback: function () {
            window.location.href = '../components/editCommerce.html';
        }
    });


});