window.onload = function () {
    var stars = document.getElementById('stars');
    var star = document.getElementsByClassName('star');

    // js随机生成流星
    for (var j = 0; j < 30; j++) {
        var newStar = document.createElement("div");
        newStar.className = "star";
        newStar.style.top = randomDistance(30, -30) + 'px';
        newStar.style.left = randomDistance(200, 20) + 'px';
        stars.appendChild(newStar);
    }

    // 封装随机数方法
    function randomDistance(max, min) {
        var distance = Math.floor(Math.random() * (max - min + 1) * 10 + min);
        return distance;
    }

    // 给流星添加动画延时
    for (var i = 0, len = star.length; i < len; i++) {
        if (i % 6 == 0) {
            star[i].style.animationDelay = '0s';
        } else {
            star[i].style.animationDelay = i * 0.8 + 's';
        }
    }


};