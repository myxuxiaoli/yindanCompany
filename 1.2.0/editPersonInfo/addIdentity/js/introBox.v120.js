window.onload = function () {
    console.log(JSON.parse($.getStore("identityInfo")));
    var data = JSON.parse($.getStore("identityInfo"));
    if (data) {
        if (data.other_instructions != "") {
            $("#infoIntro").val(data.other_instructions);
        }
    }

};
$('#TopmodalBtn').on('click', function () {
    var val = $("#infoIntro").val();
    console.log(val);
    $.setStore('identityInfo', {
        other_instructions: val,
    });
    $.setStore("title", {
        id: 1
    });
    $.MessagePrompt({
        text: '信息保存成功！',
        type: 2,
        callback: function () {
            window.location.href = './index.html';
        }
    });
});