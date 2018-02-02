window.onload = function () {
    deleteCommerce();
};

function deleteCommerce() {
    var managers = $.getStore('managers');
    var singleCommerce = $.getStore('singleCommerce');
    var datas = JSON.parse(singleCommerce);
    var data = JSON.parse(managers);
    console.log(data);
    console.log(datas);
    var str = '';
    for (var i = 0; i < data.length; i++) {
        str += '<li class="managerItem" data-id="' + data[i].user_id + '">';
        str += '<div class="managerInfo">';
        str += '<img src="' + data[i].head_portrait_url + '" alt="">';
        str += ' <span>' + data[i].user_name + '</span>';
        str += '</div>';
        str += '<div class="selectBox">';
        str += ' </div>';
        str += '</li>';
    }
    $(".managers").html(str);
    var count = 0;
    $(".managerItem").on('click', function () {
        console.log(12);
        count++;
        if (count % 2 != 0) {
            $(this).find(".selectBox").html("<span></span>");
            console.log($(this).attr("data-id"));
            $.setStore('managers', {
                user_id: $(this).attr("data-id"),
                my_resources_id: datas.my_resources_id
            });
        } else {
            $(this).find(".selectBox").html("");
            $.removeStore("managers");
        }
    });
    //顶部确定按钮事件——商会转让
    $("#TopmodalBtn").on("click", function () {
        var managers = $.getStore('managers');
        var singleCommerce = $.getStore('singleCommerce');
        var datas = JSON.parse(singleCommerce);
        var data = JSON.parse(managers);
        console.log(datas.my_resources_id);
        console.log(data.user_id);

        $.changeAjax({
            url: "myResourcesApi/resourcesTurn.do",
            data: {
                myResourcesId: datas.my_resources_id,
                userId: data.user_id,
                requestType: 'h5'
            },
            callback: function (res) {
                console.log(res);
                $.MessagePrompt({
                    text: '删除成功！',
                    callback: function () {
                        window.location.href = "../components/myCommerce.html";
                    }
                });
            }
        });
    });




}