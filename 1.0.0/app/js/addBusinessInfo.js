$('#TopmodalBtn').on('click', function () {
    var val = $("#infoIntro").val();
    $.setStore('addBusinessInfo', {
        other_instructions: val
    });
    $.MessagePrompt({
        text: '信息保存成功！',
        type: 2,
        callback: function () {
            window.location.href = '../components/addBusiness.html';
        }
    });
});

// //没有保存就返回时的事件
// $('.giveUpEdit').click(function (e) {
//     e = window.event || e;
//     var obj = e.srcElement || e.target;
//     if (!$(obj).is(".submitBtn")) {
//         $.MessagePrompt({
//             text: '确认放弃添加行业吗？',
//             callback: function () {
//                 window.location.href = '../components/addBusiness.html';
//             }
//         });
//     }
// });