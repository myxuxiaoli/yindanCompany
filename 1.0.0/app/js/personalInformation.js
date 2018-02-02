var userId;

window.onload = function () {
    userId = $.getStore("userId").replace(/(^\s*)|(\s*$)/g, "");

    console.log($.getStore("userId"));
    if (userId) {
        personInfo();
        otherWays();
    }
};

function personInfo() {
    var getRequest = $.getRequest();
    if (getRequest.state == 1) {
        $.changeAjax({
            url: "userApi/myInformation.do",
            data: {
                userId: userId,
                requestType: "h5"
            },
            callback: function (reg) {
                var data = reg.data;
                console.log(data);
                $.setStore('personInfo', data, true);
                // var personInfo = $.getStore('personInfo');
                // if (personInfo) {
                //     console.log(JSON.parse(personInfo));
                // }

                $('.user_name').val(data.user_name);
                $('.user_sex').text(data.user_sex);
                $('.hometown').text(data.hometown);
                $('.city').text(data.city);
                $('.graduate_from').val(data.graduate_from);
                $('.hobby').val(data.hobby);
            }
        });
    } else {
        var personInfo = $.getStore('personInfo');
        var data = JSON.parse(personInfo);
        console.log(data);
        $('.user_name').val(data.user_name);
        $('.user_sex').text(data.user_sex);
        $('.hometown').text(data.hometown);
        $('.city').text(data.city);
        $('.graduate_from').val(data.graduate_from);
        $('.hobby').val(data.hobby);
    }


}

function otherWays() {
    $('.user_name').on('change', function () {
        $.setStore('personInfo', {
            user_name: $(this).val()
        });
    });
    $('.graduate_from').on('change', function () {
        $.setStore('personInfo', {
            graduate_from: $(this).val()
        });
    });
    $('.hobby').on('change', function () {
        $.setStore('personInfo', {
            hobby: $(this).val()
        });
    });
    $(".sex").on("click", function () {
        $('.sexBox').css("display", 'block');
    });
    $(".sexBox").on("click", "ul li", function () {
        $(".user_sex").text($(this).text());
        $.setStore('personInfo', {
            user_sex: $(this).text()
        });
        $('.sexBox').css("display", 'none');
    });

    $(".myHome").on("click", function () {
        window.location.href = "../components/comeFrom.html";
    });
    $(".myCity").on("click", function () {
        window.location.href = "../components/liveInCity.html";
    });
}
$(".submitBtn").on('click', function () {

    var personInfo = $.getStore('personInfo');
    var data = JSON.parse(personInfo);
    console.log(data);
    $.changeAjax({
        url: "userApi/updateMyInformation.do",
        data: {
            userId: userId,
            userName: data.user_name,
            userSex: data.user_sex,
            hometown: data.hometown,
            city: data.city,
            graduateFrom: data.graduate_from,
            hobby: data.hobby,
            requestType: 'h5'
        },
        callback: function (res) {
            console.log(res);
            $.MessagePrompt({
                text: '信息保存成功！',
                type: 2,
                callback: function () {
                    window.location.href = "./../index.html";
                }
            });
        }
    });


});
//没有保存就返回时的事件
$('.giveUpEdit').click(function (e) {
    e = window.event || e;
    var obj = e.srcElement || e.target;
    if (!$(obj).is(".submitBtn")) {
        $.MessagePrompt({
            text: '确认放弃编辑我的信息吗？',
            callback: function () {
                window.location.href = "./../index.html";
            }
        });
    }
});