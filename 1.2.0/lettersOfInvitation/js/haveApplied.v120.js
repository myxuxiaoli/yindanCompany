var inviterId;
var ortype;
var newPhone;
var newZoneId;
var realName;
var getRequest;
window.onload = function () {
    getRequest = $.getRequest();
    if (getRequest) {
        var base = new Base64();
        console.log(getRequest);
        if (getRequest.name) {
            realName = base.decode(getRequest.name.replace(/\*/g, "="));
            $(".myName").text(realName);
        }
        if (getRequest.inviterId) {
            inviterId = getRequest.inviterId;
        }
        if (getRequest.myOrganizationId) {
            myOrganizationId = getRequest.myOrganizationId;
        }
        if (getRequest.ty) {
            ortype = getRequest.ty;
        }
        if (getRequest.np) {
            newPhone = base.decode(getRequest.np.replace(/\*/g, "="));
        }
        if (getRequest.nz) {
            newZoneId = base.decode(getRequest.nz.replace(/\*/g, "="));
        }
        user();
    }
};


function user() {
    console.log(ortype + "," + newPhone + "," + newZoneId);
    $.changeAjax({
        url: "userApi/selectOrganizationTypeUser.do",
        data: {
            organizationType: ortype,
            phoneNumber: newPhone,
            zoneDescriptionId: newZoneId
        },
        callback: function (res) {
            var data = res.data;
            if (data.user_name) {
                $(".myName").text(data.user_name);
            }
            if (data.head_portrait_url) {
                imgState(data.head_portrait_url, function (red) {
                    if (red === 'w') {
                        $('.rightBox').html("<img class='imgRight' style='width:100%;' src='" + data.head_portrait_url + "'>");
                    } else if (red === 'h') {
                        $('.rightBox').html("<img class='imgRight' style='height:100%;' src='" + data.head_portrait_url + "'>");
                    }
                });
            }
        }
    });
    $.changeAjax({
        url: "userApi/selectHeadPortrait.do",
        data: {
            userId: inviterId,
            requestType: "h5"
        },
        callback: function (res) {
            console.log(res);
            var data = res.data;
            if (data) {
                if (data.head_portrait_url) {
                    imgState(data.head_portrait_url, function (red) {
                        if (red === 'w') {
                            $('.leftBox').html("<img class='imgLeft' style='width:100%;' src='" + data.head_portrait_url + "'>");
                        } else if (red === 'h') {
                            $('.leftBox').html("<img class='imgLeft' style='height:100%;' src='" + data.head_portrait_url + "'>");
                        }
                    });
                }
                if (data.user_name) {
                    $(".inviterName").text(data.user_name);
                }
            }
        }
    });
}