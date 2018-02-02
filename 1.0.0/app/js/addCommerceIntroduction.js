$(".submitBtn").on('click', function () {
    var val = $("#commerceInfo").val();
    $.setStore('chamberInfo', {
        resources_introduce: val
    });
    $.MessagePrompt({
        text: '信息保存成功！',
        type: 2,
        callback: function () {
            window.location.href = '../components/addCommerce.html';
        }
    });


});