/*--String.prototype--*/
~function (pro) {
    function queryURLParameter() {
        var reg = /([^?=&#]+)=([^?=&#]+)/g,
            obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        return obj;
    }

    pro.queryURLParameter = queryURLParameter;
}(String.prototype);

/*--MUSIC--*/

var M = document.querySelector("#M");
var music = document.querySelector(".music");
window.setTimeout(function(){
    M.play();//音频文件播放 -边缓冲边播放
    M.addEventListener("canplay",function(){
        music.className = "music musicMove";
        music.style.opacity = 1;
    })
},1000);
music.addEventListener("click",function(){
    if(M.paused){//停止
        M.play();
        music.className = "music musicMove";
    }else{//播放
        M.pause();
        music.className = "music";
    }
});

/*--LOADING--*/
var loadingRender = (function () {
    var ary = ["basketBall.jpg",  "contact.jpg", "course.png", "course1.png", "course2.png", "course3.png", "course4.png", "course5.png", "course6.png","coverBg.jpg", "cube1.png", "cube2.png", "cube3.png", "cube4.png", "cube5.png", "cube6.png", "cubeBg.jpg", "cubeTip.png", "Email.png", "enter.png", "icon.png", "name.png", "name.png", "phone.png", "qq.png", "return.png", "study.jpg", "work.jpg","me.jpg","wx.png","live.png","bg2.jpeg","bg4.png"];

    //->获取需要操作的元素
    var $loading = $('#loading'),
        $progressBox = $loading.find('.progressBox');
    var step = 0,
        total = ary.length;

    return {
        init: function () {
            $loading.css('display', 'block');

            //->循环加载所有的图片,控制进度条的宽度
            $.each(ary, function (index, item) {
                var oImg = new Image;
                oImg.src = 'img/' + item;
                oImg.onload = function () {
                    step++;
                    $progressBox.css('width', step / total * 100 + '%');
                    oImg = null;

                    //->所有图片都已经加载完毕:关闭LOADING,显示ENTER
                    if (step === total) {
                        if (page === 0) return;
                        window.setTimeout(function () {
                            $loading.css('display', 'none');
                            enterRender.init();
                        }, 2000);
                    }
                }
            });
        }
    }
})();

/*--ENTER--*/
var enterRender = (function () {
    var $enter = $('#enter'),
        $button = $enter.children('.button'),
        $buttonTouch = $button.children('.touch');


    //->closeEnter:关闭当前的ENTER区域展示下一个区域
    function closeEnter() {
        $enter.css('display', 'none');
    }

    return {
        init: function () {
            $enter.css('display', 'block');

            //->给BUTTON中的TOUCH绑定单击事件:移动端的单击事件使用CLICK会存在一个300MS的延迟,我们需要使用touchstart/touchmove/touchend来进行模拟,Zepto中的singleTap就是封装好的一个操作方法
            $buttonTouch.singleTap(function () {
                $button.css('display', 'none');
                closeEnter();
            });

            //->给TOUCH绑定单击事件
            $buttonTouch.singleTap(closeEnter);
            cubeRender.init();
        }
    }
})();

/*--CUBE--*/
var cubeRender = (function () {
    var $cube = $('#cube'),
        $cubeBox = $cube.children('.cubeBox'),
        $cubBoxLis = $cubeBox.children('li');

    //->滑动的处理
    function isSwipe(changeX, changeY) {
        return Math.abs(changeX) > 30 || Math.abs(changeY) > 0;
    }

    function start(ev) {
        var point = ev.touches[0];
        $(this).attr({
            strX: point.clientX,
            strY: point.clientY,
            changeX: 0,
            changeY: 0
        });
    }

    function move(ev) {
        var point = ev.touches[0];
        var changeX = point.clientX - $(this).attr('strX'),
            changeY = point.clientY - $(this).attr('strY');
        $(this).attr({
            changeX: changeX,
            changeY: changeY
        });
    }

    function end(ev) {
        var changeX = parseFloat($(this).attr('changeX')),
            changeY = parseFloat($(this).attr('changeY'));
        var rotateX = parseFloat($(this).attr('rotateX')),
            rotateY = parseFloat($(this).attr('rotateY'));
        if (isSwipe(changeX, changeY) === false) return;
        rotateX = rotateX - changeY / 3;
        rotateY = rotateY + changeX / 3;
        $(this).attr({
            rotateX: rotateX,
            rotateY: rotateY
        }).css('transform', 'scale(0.6) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)');
    }

    return {
        init: function () {
            $cube.css('display', 'block');

            //->魔方区域的滑动
            $cubeBox.attr({
                rotateX: -35,
                rotateY: 45
            }).on('touchstart', start).on('touchmove', move).on('touchend', end);

            //->每一个页面的点击操作
            $cubBoxLis.singleTap(function () {
                var index = $(this).index();
                $cube.css('display', 'none');
                swiperRender.init(index);
            });
        }
    }
})();

/*--SWIPER--*/
var swiperRender = (function () {
    var $swiper = $('#swiper'),
        $makisu = $('#makisu'),
        $return = $swiper.children('.return');

    //->change:实现每一屏幕滑动切换后控制页面的动画
    function change(example) {
        var slidesAry = example.slides,
            activeIndex = example.activeIndex;
        if (activeIndex === 0) {
            $makisu.makisu({
                selector: 'dd',
                overlap: 0.6,
                speed: 0.8
            });
            $makisu.makisu('open');
        } else {
            $makisu.makisu({
                selector: 'dd',
                overlap: 0.6,
                speed: 0
            });
            $makisu.makisu('close');
        }
        $.each(slidesAry, function (index, item) {
            if (index === activeIndex) {
                item.id = 'page' + (activeIndex + 1);
                return;
            }
            item.id = null;
        });
    }

    return {
        init: function (index) {
            $swiper.css('display', 'block');

            //->初始化SWIPER实现六个页面之间的切换
            var mySwiper = new Swiper('.swiper-container', {
                effect: 'coverflow',
                onTransitionEnd: change,
                onInit: change
            });
            index = index || 0;
            mySwiper.slideTo(index, 0);

            //->给返回按钮绑定单击事件
            $return.singleTap(function () {
                $swiper.css('display', 'none');
                $('#cube').css('display', 'block');
            });
        }
    }
})();

var urlObj = window.location.href.queryURLParameter(),
    page = parseFloat(urlObj['page']);

if (page === 0 || isNaN(page)) {
    loadingRender.init();
}

if (page === 1) {
    enterRender.init();
}

if (page === 3) {
    cubeRender.init();
}

if (page == 4) {
    swiperRender.init(0);
}

document.addEventListener("touchmove", function(e) {
    e.preventDefault();
});