window.onload = function () {
    searchRanks();
};

function searchRanks() {
    $.changeAjax({
        url: 'resourcesPositionApi/selectAllPosition.do',
        data: {
            requestType: 'h5',
            type: 2
        },
        callback: function (res) {
            console.log(res);
            var str = '';
            for (var item of res.data) {
                str += "<li data-id=" + item.position_id + ">" + item.position_name + "</li>";
            }
            $(".main ul").html(str);
        }
    });

    $(".main ul").on("click", "li", function () {
        $.setStore('chamberInfo', {
            position_name: $(this).text(),
            position_id: $(this).attr("data-id")
        });
        console.log($.getStore('chamberInfo'));
        window.location.href = '../components/addCommerce.html';
    });

}