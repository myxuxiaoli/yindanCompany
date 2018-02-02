// JavaScript Document
var serverUsrl = ' http://yindantech.com:8080/SocialContact/';
jQuery.extend({
    //ajax请求
    changeAjax: function (options) {
        if (options.url == undefined || options.url == "") {
            $.MessagePrompt({
                text: 'ajax请求 url为undefined或为空'
            });
            return false;
        }
        if (options.type === "FORM") {
            var type = 'POST';
        } else {
            var type = options.type;
        }
        if (/^http:\/\//.test(options.url)) {
            var url = options.url;
        } else {
            var url = serverUsrl + options.url;
        }
        console.log(url);
        $.ajax({
            url: url,
            type: type || 'POST',
            data: options.data || "",
            timeout: 50000,
            cache: options.type == "FORM" ? false : true,
            contentType: options.type == "FORM" ? false : 'application/x-www-form-urlencoded',
            processData: options.type == "FORM" ? false : true,
            dataType: options.dataType | false,
            jsonpCallback: options.dataType ? 'callback' : false,
            beforeSend: function (request) {
                $.LoadingShow();
            },
            complete: function () {
                $.LoadingHide();
            },
            error: function (a, b, c) {
                $.LoadingErroe(a, b, c);
            },
            success: function (data) {
                console.log("请求成功");
                console.log(data);
                if (data.code === 0) {
                    options.callback.call(this, data);
                } else {
                    $.MessagePrompt({
                        text: data.msg
                    });
                    options.callback.call(this, data);
                }
            }
        });
    },
    LoadingErroe: function (a, b, c) {
        console.log("失败");
        $.MessagePrompt({
            text: '数据请求失败'
        });
    },
    LoadingShow: function (a) {
        console.log("请求之前");
        $("body").append('<div class="modal_con"></div> <div class = "BeingLoaded" ><div class = "sk-spinner sk-spinner-three-bounce" ><div class = "sk-bounce1" > </div> <div class = "sk-bounce2" > </div> <div class = "sk-bounce3" > </div> </div> <p > 正在加载... </p> </div>');
    },
    LoadingHide: function () {
        console.log("请求完成");
        $(".modal_con").remove();
        $(".BeingLoaded").remove();
    },
    //消息提示框
    MessagePrompt: function (options) {
        var text = options.text || '无';
        var determineText = options.determineText || '确定';
        var type = options.type || 1;
        var te = '<div class="mask"></div>';
        te += '<div class="modal">';
        te += '<div class="content">';
        te += options.text;
        te += '</div>';
        te += '<div class="but">';
        if (type === 1) {
            te += '<button class="close">取消</button>';
            te += '<button class="confirm">' + determineText + '</button>';
        }
        // else {
        //     te += '<p>3S后跳转</p>';
        // }
        te += '</div>';
        te += '</div>';
        if ($(".modal").length < 1) {
            $(document.body).append(te);
        }
        if (type != 1) {
            time(2);
        }

        function time(s) {
            s--;
            // $('.modal .but p').text(s + 'S后跳转');
            if (s <= 0) {
                $(".mask").remove();
                $(".modal").remove();
                if (options.callback) {
                    options.callback.call(this);
                }
            } else {
                setTimeout(function () {
                    time(s);
                }, 1000);
            }
        }
        $(".confirm").click(function () {
            if (options.callback) {
                options.callback.call(this);
            }
            $(".mask").remove();
            $(".modal").remove();
        });
        $(".close").click(function () {
            console.log(123);
            $(".mask").remove();
            $(".modal").remove();
        });
    },
    //获取URL里面的值
    getRequest: function () {
        var strs;
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },
    //数据储存
    //这个方法的意思是：把数据储存到浏览器里面，
    //name 是储存名称
    //content 是内容
    //state  true 是重新储存   false是修改之前储存
    setStore: function (name, content, state) {
        state = state || false;
        if (!name) return;
        var newContent = content;
        if (typeof content === "object") {
            newContent = JSON.stringify(content);
        }
        if (state) {

            window.localStorage.setItem(name, newContent);
        } else {
            var storage = window.localStorage.getItem(name);

            if (storage && typeof JSON.parse(storage) === "object") {
                storageJson = JSON.parse(storage);
                var jsonObj = {};
                for (var i in storageJson) {
                    jsonObj[i] = storageJson[i];
                }
                for (var i in content) {
                    jsonObj[i] = content[i];
                }
                window.localStorage.setItem(name, JSON.stringify(jsonObj));
            } else {
                window.localStorage.setItem(name, newContent);
            }
        }
    },
    //数据取值
    getStore: function (name) {
        if (!name) return;
        return window.localStorage.getItem(name);
    },
    //清楚数据
    removeStore: function (name) {
        if (!name) return;
        return window.localStorage.removeItem(name);
    }
});

//数组去重函数
Array.prototype.removeDup = function () {
    var result = [this[0]];
    for (var i = 1; i < this.length; i++) {
        var repeat = false;
        for (var j = 0; j < result.length; j++) {
            if (this[i] === result[j]) {
                repeat = true;
                break;
            }
        }
        if (!repeat) {
            result.push(this[i]);
        }
    }
    return result;
};
//数组从大到小排序
function sort(arr) {
    for (var i = 0; i < arr.length - 1; i++) {
        for (var j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] < arr[j + 1]) {
                var hand = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = hand;
            }
        }
    }
    return arr;
}