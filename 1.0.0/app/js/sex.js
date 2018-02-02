$('.main ul').on('click', "li", function () {
    var val = $(this).html();
    console.log(val);
    $.setStore('personInfo', {
        user_sex: val
    });
    window.location.href = '../components/personalInformation.html';
});