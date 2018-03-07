var businessOpportunityId;
var getRequest;
window.onload = function () {
    getRequest = $.getRequest();
    if (getRequest.businessOpportunityId) {
        businessOpportunityId = getRequest.businessOpportunityId;
    }
    if (businessOpportunityId) {
        console.log("businessOpportunityId存在" + businessOpportunityId);
        chance();
    } else {
        businessOpportunityId = 18;
        console.log("businessOpportunityId不存在：" + businessOpportunityId);
        chance();
    }
};

function chance() {
    $.changeAjax({
        url: "businessOpportunityApi/selectBusinessOpportunityDetails.do",
        data: {
            businessOpportunityId: businessOpportunityId,
            requestType: "h5"
        },
        callback: function (res) {
            var data = res.data;
            console.log(data);
            if (data) {
                if (data.business_opportunity_title) {
                    $(".bigTitle").text(data.business_opportunity_title);
                }
                if (data.highlights != undefined && data.highlights.length != 0) {
                    $(".littleTitle").text(data.highlights.join("/"));
                }
                if (validate(data.seeCount)) {
                    $(".seeNums").text(data.seeCount);
                }
                if (validate(data.intentionCount)) {
                    $(".loveNums").text(data.intentionCount);
                }
                if (validate(data.establish_time)) {
                    $(".chanceDate").text(getMyDate(data.establish_time));
                }
                if (data.business_opportunity_details) {
                    var newDetails = data.business_opportunity_details.replace(/\n/g, "<br/>");
                    console.log(newDetails);
                    $(".chanceInfo").html(newDetails);
                }
                if (data.opportunityPhoto != undefined && data.opportunityPhoto.length != 0) {
                    var html = "";
                    var j = 0;
                    recursive();

                    function recursive() {
                        var img = new Image();
                        img.src = data.opportunityPhoto[j].photo_url;
                        img.onload = function () {
                            if (img.width >= img.height) {
                                html += "<div class='imgBox'>";
                                html += '<img style="height:100%;" src="' + data.opportunityPhoto[j].photo_url + '" alt="">';
                                html += "</div>";
                            } else if (img.width < img.height) {
                                html += "<div class='imgBox'>";
                                html += '<img style="width:100%;" src="' + data.opportunityPhoto[j].photo_url + '" alt="">';
                                html += "</div>";
                            }
                            j++;
                            if (data.opportunityPhoto.length > j) {
                                recursive();
                            } else {
                                $(".chanceImgBox").html(html);
                            }
                        };
                    }
                    $(".chanceImgBox").html(html);
                }
                if (data.location) {
                    $(".cityName").text(data.location);
                }
                if (data.industry_name) {
                    $(".chanceNameCenter").text(data.industry_name);
                }
                if (data.category_name) {
                    $(".chanceNameRight").text(data.category_name);
                }
                if (data.myOrganization != undefined && data.myOrganization.length != 0) {
                    $(".commerce").text(data.myOrganization[0]);
                }
                if (data.user) {
                    if (data.user.head_portrait_url) {
                        imgState(data.user.head_portrait_url, function (red) {
                            if (red === 'w') {
                                $('.photoBox').html("<img class='issuersPhoto' style='width:100%;' src='" + data.user.head_portrait_url + "'>");
                            } else if (red === 'h') {
                                $('.photoBox').html("<img class='issuersPhoto' style='height:100%;' src='" + data.user.head_portrait_url + "'>");
                            }
                        });
                    }
                    if (data.user.user_name) {
                        $(".issuerName").text(data.user.user_name);
                    }
                    if (validate(data.user.business_card_type)) {
                        if (data.user.business_card_type == 1) {
                            $(".vvvv").show();
                        } else {
                            $(".vvvv").hide();
                        }
                    } else {
                        $(".vvvv").hide();
                    }
                    if (data.user.userIdentityInformation) {
                        if (data.user.userIdentityInformation.identity_information) {
                            var newStr = ""; //限定12个字，多余的省略
                            if (data.user.userIdentityInformation.identity_information.length >= 12) {
                                newStr = data.user.userIdentityInformation.identity_information.substring(0, 12) + "…  ";
                            } else {
                                newStr = data.user.userIdentityInformation.identity_information + "  ";
                            }
                            $(".identityBox").text(newStr);
                            if (data.user.userIdentityInformation.positionName != undefined && data.user.userIdentityInformation.positionName.length != 0) {
                                $(".identityBox").text(newStr + data.user.userIdentityInformation.positionName[0]);
                            }
                        }

                    }
                }
            } else {
                $(".main").hide();
                $(".isseurs").hide();
            }

        }
    });
}