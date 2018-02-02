var userId;
window.onload = function () {
    var getRequest = $.getRequest();
    if (getRequest.userId) {
        var newId = getRequest.userId.replace(/\*/g, "=");
        var base = new Base64();
        userId = base.decode(newId);
    }
    if (userId) {
        systemMessage();
    } else {
        userId = 13;
        systemMessage();
    }

};



function getzf(num) { //月份补0
    if (parseInt(num) < 10) {
        num = '0' + num;
    }
    return num;
}
//根据后台返回的毫秒数显示时间
function getMyDate(str) {
    var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        oTime = getzf(oMonth) + '/' + getzf(oDay);
    var nowDate = new Date();
    if (oYear < nowDate.getFullYear()) {
        oTime = oYear + '/' + getzf(oMonth) + '/' + getzf(oDay);
    } else {
        if (oMonth < nowDate.getMonth()) {
            oTime = getzf(oMonth) + '/' + getzf(oDay);
        } else {
            if (nowDate.getDate() - oDay >= 7) {
                oTime = getzf(oMonth) + '/' + getzf(oDay);
            } else {
                if (nowDate.getDate() == oDay) {
                    if (nowDate.getHours() == oHour) {
                        oTime = nowDate.getMinutes() - oMin + '分钟前';
                    } else {
                        oTime = nowDate.getHours() - oHour + '小时前';
                    }
                } else {
                    oTime = nowDate.getDate() - oDay + '日前';
                }
            }
        }
    }
    return oTime;
}

function systemMessage() {
    $.changeAjax({
        url: "pushMessageApi/queryPushMessageList.do",
        data: {
            requestType: 'h5',
            userId: userId
        },
        callback: function (res) {
            console.log(res);
            var data = res.data;
            if (data != undefined && data.length != 0) {
                var str = "";
                for (var i = 0; i < data.length; i++) {
                    str += '<li><div class="massageTop">';
                    str += '<div class="leftDiv">';
                    if (data[i].notification_title) {
                        str += '<span class="title">' + data[i].notification_title + '</span>';
                    }
                    str += '<span class="redTag"></span>';
                    str += '</div><div class="rightDiv">';
                    if (data[i].establish_time) {
                        str += '<span class="massageDate">' + getMyDate(data[i].establish_time) + '</span>';
                    }
                    str += '</div></div>';
                    str += '<div class="massageContent">';
                    if (data[i].msg_content) {
                        str += '<div class="content">' + data[i].msg_content + '</div>';
                    }
                    str += '</div></li>';
                }
                $(".container ul").append(str);
            } else {
                $.MessagePrompt({
                    text: '暂无系统消息',
                    type: 2,
                    callback: function () {
                        return;
                    }
                });
            }

        }

    });
}