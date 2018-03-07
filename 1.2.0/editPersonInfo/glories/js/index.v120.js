var userId;
window.onload = function () {
    userId = $.getStore("userId").replace(/(^\s*)|(\s*$)/g, "");
    console.log(userId);
    getGlories();
};

//显示所有的荣誉
function getGlories() {
    $.changeAjax({
        url: "myGloryApi/selectMyGlory.do",
        data: {
            userId: userId,
            requestType: "h5"
        },
        callback: function (res) {
            console.log(res);
            var data = res.data;
            if (data) {
                if (data.myGlory != undefined && data.myGlory.length != 0) {
                    $.setStore("glories", data.myGlory, true);
                    var str = "";
                    for (var i = 0; i < data.myGlory.length; i++) {
                        if (data.myGlory[i].glory_content) {
                            str += '<div class="gloryImg">';
                            str += '<img src="../img/glory.png" alt="">';
                            if (data.myGlory[i].glory_content.length != 0) {
                                str += '<div  class="glorytitle">' + data.myGlory[i].glory_content + '</div>';
                                str += '<span data-id=' + data.myGlory[i].my_glory_id + ' class="editMyGlory"></span>';
                                str += '</div>';
                            }
                        }
                    }
                    $(".gloryItems").html(str);
                }
            }
        }
    });
}

// 添加荣誉
$(".addBtn").on("click", function () {
    console.log($(".gloryItems .gloryImg").length);
    if ($(".gloryItems .gloryImg").length < 10) {
        window.location.href = "./addGlory.html";
    } else {
        $.MessagePrompt({
            text: '个人荣誉不能超过10个！',
            callback: function () {
                return;
            }
        });
    }
});
//编辑荣誉
$(".gloryItems").on("click", ".editMyGlory", function () {
    var gloryArr = JSON.parse($.getStore("glories"));
    console.log(gloryArr);
    for (var m = 0; m < gloryArr.length; m++) {
        if (gloryArr[m].my_glory_id == $(this).attr("data-id")) {
            $.setStore("gloryItem", gloryArr[m], true);
            window.location.href = "./editGlory.html";
        }
    }
});