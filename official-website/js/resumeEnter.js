$(function () {
  // 淫贱的阻止页面选中效果
  document.onmousedown = function () {
    document.onmousemove = function () {
      window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
    };
  };
  document.onmouseup = function () {
    document.onmousemove = null;
  };
  var $container = $('.portfolio-items');
  $('#resume').fullpage({
    scrollingSpeed: 700,
    // 是否首尾相接
    // continuousVertical: true,
    normalScrollElementTouchThreshold: 5,
    // 导航条显示
    navigation: true,
    // 内容超出后是否出现滚动条
    scrollOverflow: false,
    // // 左右滑块循环
    loopHorizontal: false,
    // 左右滑块颜色
    controlArrowColor: '#16BA9D',
    // 导航栏设置
    anchors: ['page1', 'page2', 'page3', 'page4', 'page5', 'page6'],
    menu: '#menu',
    easing: 'easeInOut',
    // 页面渲染后回调
    afterRender: function () {
      //侧边导航事件
      var Tooltips = ['', '', '', '', '', ''];
      $("#fp-nav ul li").each(function (index) {
        this.dataset['toggle'] = 'tooltip';
        this.dataset['placement'] = 'left';
        $(this).attr('title', Tooltips[index]);
      });
      $('[data-toggle="tooltip"]').tooltip();
      //底部按钮的点击事件
      $('.bottomArrow').on('click', function () {
        $.fn.fullpage.moveSectionDown();
      });
    },
    // 滚动触发后结束前回调
    onLeave: function (index, nextIndex, direction) {
      switch (index) {
        case 1:

          break;
        case 2:
          $('.item-2 .items').addClass('bounceInUp');
          setTimeout(function () {
            $('.item-2 .items').removeClass('bounceInUp');
          }, 1000);
          break;
        case 3:

          break;
        case 4:
      }
    },
    // 滚动到某一屏后的回调函数
    afterLoad: function (anchorLink, index) {
      $('.bottomInfo').removeClass('current');
      $('.bottomInfo').hide();
      switch (anchorLink) {
        case 'page1':

          break;
        case 'page2':
          $('.bottomInfo').show();
          $('.bottomInfo').addClass('current');
          break;
        case 'page3':

          break;
        case 'page4':

          break;

        case 'page5':
          break;
      }
    }
  });
});