window.onload = function () {
    chooseAsset();
};

function chooseAsset() {
    $.changeAjax({
        url: "assetsScaleApi/updateMyInformation.do",
        callback: function (res) {
            console.log(res.data);
            var assets = res.data;
            var str = '';
            for (var item of res.data) {
                str += '<li data-id=' + item.assets_scale_id + '>' + item.scale_information + '</li>';
            }
            $(".main ul").html(str);
            console.log(str);
        }
    });
}
$('.main ul').on('click', "li", function () {
    var val = $(this).text();
    var id = parseInt($(this).attr('data-id'));
    console.log(val);
    $.setStore('identityInfo', {
        scale_information: val,
        assets_scale_id: id
    });
    window.location.href = './index.html';
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
//     if (!$(obj).is(".main ul li")) {
//         $.MessagePrompt({
//             text: '确认放弃选择资产规模吗？',
//             callback: function () {
//                 location.href = "./index.html";
//             }
//         });
//     }
// };