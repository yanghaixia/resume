var banner = document.getElementById("banner");
var bannerInner = utils.getEleByClass("bannerInner", banner)[0];
var focusList = utils.getEleByClass("focusList", banner)[0];
var imgs = bannerInner.getElementsByTagName("img");
var lis = focusList.getElementsByTagName("li");
var leftBtn = utils.getEleByClass("left", banner)[0];
var rightBtn = utils.getEleByClass("right", banner)[0];
(function () {
    var xhr = new XMLHttpRequest();
    xhr.open("get", "data.txt?_=" + Math.random(), false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && /^2\d{2}$/.test(xhr.status)) {
            window.data = utils.jsonParse(xhr.responseText)
        }
    };
    xhr.send(null);
})();
(function () {
    if (window.data) {
        var str = '';
        var strLi = '';
        for (var i = 0; i < data.length; i++) {
            var curData = data[i];
            str += '<div><img src="" realSrc="' + curData.src + '"/></div>';
            strLi += i == 0 ? '<li class="selected"></li>' : '<li></li>';
        }
        bannerInner.innerHTML = str;
        focusList.innerHTML = strLi;
    }
})();
window.setTimeout(allImg, 300);
function allImg() {
    for (var i = 0; i < imgs.length; i++) {
        if (i == 0) {
            utils.css(imgs[i].parentNode, "zIndex", 1);
            animate(imgs[i].parentNode, {opacity: 1}, 300);
        }
        (function (i) {
            var curImg = imgs[i];
            var tempImg = new Image();
            tempImg.src = curImg.getAttribute("realSrc");
            tempImg.onload = function () {
                curImg.src = this.src;
                utils.css(curImg, "display", "block");
            };
            tempImg=null;
        })(i);

    }
}
var step=0;
var timer=window.setInterval(autoMove,2000);
function autoMove(){
    if(step==data.length-1){
        step=-1;
    }
    step++;
    bindImg();
}
function bindImg(){
    for(var i=0;i<imgs.length;i++){
        if(i==step){
            utils.css(imgs[i].parentNode, "zIndex", 1);
            animate(imgs[i].parentNode, {opacity: 1}, 300,function(){
                var siblings=utils.sibling(this);
                for(var i=0;i<siblings.length;i++){
                    utils.css(siblings[i],"opacity",0);
                }
            });
        }else{
            utils.css(imgs[i].parentNode, "zIndex", 0);
        }
    }
    for(var i=0;i<lis.length;i++){
        lis[i].className=i==step?"selected":"";
    }
}
banner.onmousemove=function(){
    window.clearInterval(timer);

};
banner.onmouseout=function(){
    timer=window.setInterval(autoMove,2000);

};
rightBtn.onclick=autoMove;
leftBtn.onclick=function(){
    step--;
    if(step==-1)
        step=data.length-1;
    bindImg();
};
(function(){
    for(var i=0;i<lis.length;i++){
        lis[i].index=i;
        lis[i].onclick=function(){
            step=this.index;
            bindImg();
        }
    }
})();
