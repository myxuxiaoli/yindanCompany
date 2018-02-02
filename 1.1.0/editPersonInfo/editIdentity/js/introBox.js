window.onload = function () {
    console.log(JSON.parse($.getStore("identityInfo")));
    var data = JSON.parse($.getStore("identityInfo"));
    if (data.other_instructions) {
        $("#infoIntro").val(data.other_instructions);
    }
};
$('#TopmodalBtn').on('click', function () {
    var val = $("#infoIntro").val();
    console.log(val);
    $.setStore('identityInfo', {
        other_instructions: val
    });
    $.MessagePrompt({
        text: '信息保存成功！',
        type: 2,
        callback: function () {
            window.location.href = './index.html';
        }
    });
});
// pushHistory();

// function pushHistory() {
//     var state = {
//         title: "title",
//         url: "#"
//     };
//     window.history.pushState(state, "title", "#");
// }
// window.onpopstate = function (e) {
//     e = window.event || e;
//     var obj = e.srcElement || e.target;
//     if (!$(obj).is("#TopmodalBtn")) {
//         $.MessagePrompt({
//             text: '确认放弃修改信息简介吗？',
//             callback: function () {
//                 location.href = "./index.html";
//             }
//         });
//     }
// };