window.onload = function () {
    chooseIndustry();
};

function chooseIndustry() {
    $.changeAjax({
        url: "industryApi/selectAllIndustry.do",
        callback: function (res) {
            var str = '';
            for (var item of res.data) {
                str += '<li data-id=' + item.industry_id + '>' + item.industry_name + '</li>';
            }
            $(".main ul").html(str);
        }
    });
}
$('.main ul').on('click', "li", function () {
    var val = $(this).text();
    var id = parseInt($(this).attr('data-id'));
    console.log(val);
    $.setStore('identityInfo', {
        industry_name: val,
        industry_id: id
    });
    console.log(JSON.parse($.getStore("identityInfo")));
    var data = JSON.parse($.getStore("identityInfo"));
    console.log(data);
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
//             text: '确认放弃选择行业吗？',
//             callback: function () {
//                 location.href = "./index.html";
//             }
//         });
//     }
// };