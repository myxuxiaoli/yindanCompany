//上传头像函数
var userId = $.getStore("userId");

console.log($.getStore("userId"));

function userImgFile(th) {
    if (th.files.length > 0) {
        new clip(th.files[0], function (reg) {
            console.log(reg);
            var data = new FormData();
            data.append('files', reg);
            data.append('userId', userId);
            // 接口：http: //192.168.3.24:8080/SocialContact/userApi/updateHeadPortrait.do
            // 参数files（图片文件数组）,userId默认为1
            $.changeAjax({
                url: 'myResourcesApi/updateResourcesLogo.do',
                type: 'FORM',
                data: data,
                callback: function (reg) {
                    console.log(reg);
                    $('.userImg').html('<img src="' + reg.data[0] + '"/>');
                }
            });
        });
    }
}