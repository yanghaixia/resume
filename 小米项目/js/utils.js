var utils = function () {
    var isStanderBrowser='getComputedStyle' in window;
    function listToArray(likeArray) { //把类数组转化成数组
        try {
            return Array.prototype.slice.call(likeArray, 0);
        } catch (e) {
            var ary = [];
            for (var i = 0; i < likeArray.length; i++) {
                ary[ary.length] = likeArray[i];
            }
            return ary;
        }
    }
    function getRandom(n, m) { // 获取n-m之间的随机整数
        n = Number(n);
        m = Number(m);
        if (isNaN(n) || isNaN(m)) {
            return Math.random();
        }
        if (n > m) {
            var temp = m;
            m = n;
            n = temp;
        }
        return Math.round(Math.random() * (m - n) + n);
    }
    function hasPubProperty(obj, prop) { //是否是公有属性
        return prop in obj && !(obj.hasOwnProperty(prop));
    }
    function prev(ele) { //获取上一个元素哥哥节点
        if(isStanderBrowser){
            return ele.previousElementSibling;
        }
        var pre = ele.previousSibling;
        while (pre && pre.nodeType != 1) {
            pre = pre.previousSibling;
        }
        return pre;
    }
    function jsonParse(jsonStr) {
        return "JSON" in window ? JSON.parse(jsonStr) : eval("(" + jsonStr + ")");
    }
    function offset(ele) {
        var l = null;
        var t = null;
        l += ele.offsetLeft;
        t += ele.offsetTop;
        var par = ele.offsetParent;
        while (par) {
            if (window.navigator.userAgent.indexOf("MSIE 8") == -1) {
                l += par.clientLeft;
                t += par.clientTop;
            }

            l += par.offsetLeft;
            t += par.offsetTop;
            par = par.offsetParent;
        }
        return {left: l, top: t};
    }
    function win(attr, val) {
        if (typeof val !== "undefined") {
            document.documentElement[attr] = val;
            document.body[attr] = val;

        }
        return document.documentElement[attr] || document.body[attr];
    }
    function getCss(attr) {
        var val = null;
        if (isStanderBrowser) {
            val = window.getComputedStyle(this)[attr];
        } else {
            if (attr == "opacity") {
                val = this.currentStyle["filter"];
                var reg = /alpha\(opacity=(\d+(\.\d+)?)\)/;
                val = reg.test(val) ? reg.exec(val)[1] / 100 : 1;
            } else {
                val = this.currentStyle[attr];
            }

        }
        var reg = /^-?\d+(\.\d+)?(px|pt|em|rem|deg)?$/;
        if (reg.test(val)) {
            val = parseFloat(val);
        }
        return val;
    }
    function setCss(attr, val) {
        if (attr == 'opacity') {
            this.style.opacity = val;
            this.style.filter = 'alpha(opacity' + val * 100 + ')';
            return;
        }
        if (attr == 'float') {
            this.style.cssFloat = val;
            this.style.styleFlat = val;
            return;
        }
        var reg = /^(width|height|top|bottom|left|right|(margin|padding)(Left|Right|Botttom|Top))$/;
        if (reg.test(attr)) {
            if (!isNaN(val)) {
                val += "px";
            }
        }
        this.style[attr] = val;
    }
    function setGroupCss(opations) {//保证opations是一个对象
        //这个已经在css方法中判断过了
       /* opations == opations || [];
        if (opations.toString() == "[object Object]") {*/
            //我就能保证opations是一个对象{}
            for (var key in opations) {
                if (opations.hasOwnProperty(key)) {
                    setCss.call(this, key, opations[key]);
                }
            }
        }
/*    }*/
    function css(ele){//根据参数个数或者类型的不同来调用不同处理函数
        var  argsAry=listToArray(arguments).slice(1);
        var secondParam=arguments[1];
        var thirdParam=arguments[2];
        if(typeof secondParam=="string"){//第二个参数是字符串，有可能是getcss/setCss还需要进一步看第三个参数是否存在
            if(typeof thirdParam=="undefined"){//第三个参数没有传
                return getCss.apply(ele,argsAry);
            }
            //只有代码运行到这说明有第三个参数，单个设置样式
            setCss.apply(ele,argsAry);
            return;
        }
        secondParam=secondParam||[];
        if(secondParam.toString()=="[object Object]"){
            //只有代码运行到这 说明第二个参数是对象
            setGroupCss.apply(ele,argsAry);
        }

    }
    function preAll(ele) {
        var ary = [];
        var prev = this.prev(ele);
        while (prev) {
            ary.unshift(prev);
            prev = this.prev(prev);
        }
        return ary;
    }
    function next(ele) {
        if(isStanderBrowser){
            return ele.nextElementSibling;
        }
        var nex = ele.nextSibling;
        while (nex && nex.nodeType != 1) {
            nex = nex.nextSibling;
        }
        return nex;
    }
    function nextAll(ele) {
        var ary = [];
        var next = this.next(ele);
        while (next) {
            ary.push(next);
            next = this.next(next);
        }
        return ary;
    }
    function children(ele, tagName) {
        var ary = [];
        if(isStanderBrowser){
          ary=listToArray(ele.children);
        }else{
            var nodes = ele.childNodes;
            for (var i = 0; i < nodes.length; i++) {
                var curNode = nodes[i];
                if (curNode.nodeType == 1) {
                    ary.push(curNode);
                }
            }
        }
        if (typeof tagName == "string") {
            for (i = 0; i < ary.length; i++) {
                var curEle = ary[i];
                if (curEle.nodeName.toLocaleLowerCase() !== tagName.toLocaleLowerCase()) {
                    ary.splice(i, 1);
                    i--;
                }
            }
        }
        return ary;
    }
    function sibling(ele) {
        var ary = [];
        var pre = this.prev(ele);
        var nex = this.next(ele);
        pre ? ary.push(pre) : void 0;
        nex ? ary.push(nex) : void 0;
        return ary;
    }
    function siblings(ele) {
        var ary = [];
        return this.preAll(ele).concat(this.nextAll(ele));
    }
    function index(ele) {
        return this.preAll(ele).length;
    }
    function firstEleChild(ele) {
        if(isStanderBrowser){
            return ele.firstElementChild;
        }
        var chs = this.children(ele);
        return chs.length > 0 ? chs[0] : null;
    }
    function lastChild(ele) {
        if(isStanderBrowser){
            return ele.lastElementChild;
        }
        var chs = this.children(ele);
        return chs.length > 0 ? chs[chs.length - 1] : null;
    }
    function append(newEle, container) {
        container.appendChild(newEle);
    }
    function prepend(newEle, container) {
        var firstChild = this.firstEleChild(container);
        firstChild ? container.insertBefore(newEle) : container.appendChild(newEle);
    }
    function insertBefore(newEle, oldEle) {
        oldEle.parentNode.insertBefore(newEle, oldEle);
    }
    function insertAfter(newEle, oldEle) {
        var nex = this.next(oldEle);
        nex ? oldEle.parentNode.insertBefore(newEle, oldEle) : oldEle.parentNode.appendChild(newEle);
    }
    function hasClass(ele, strClass) {
        strClass = strClass.replace(/(^ +| +$)/g, "");
        var reg = new RegExp("(^| +)" + strClass + "( +|$)");
        return reg.test(ele.className);
    }
    function addClass(ele, strClass) {
        strClass = strClass.replace(/(^ +| +$)/g, "");
        var strClassAry = strClass.split(/ +/);
        for (var i = 0; i < strClassAry.length; i++) {
            var curClass = strClassAry[i];
            if (!this.hasClass(ele, curClass)) {
                ele.className += " " + curClass;
            }

        }
    }
    function removeClass(ele, strClass) {
        var strClassAry = strClass.replace(/(^ +| +$)/g, "").split(/ +/);
        for (var i = 0; i < strClassAry.length; i++) {
            var curClass = strClassAry[i];
            if (this.hasClass(ele, curClass)) {
                var reg = new RegExp("(^| +)" + curClass + "( +|$)");
                ele.className = ele.className.replace(reg, " ");
            }
        }
    }
    function getEleByClass(strClass, context) {
        context = context || document;
        if(isStanderBrowser){
            return context.getElementsByClassName(strClass);
        }
        var strClassAry = strClass.replace(/(^ +| +$)/g, "").split(/ +/);
        var tags = context.getElementsByTagName("*");
        var ary = [];
        for (var i = 0; i < tags.length; i++) {
            var flag = true;
            var curTag = tags[i];
            for (var j = 0; j < strClassAry.length; j++) {
                var curClass = strClassAry[j];
                var reg = new RegExp("(^| +)" + curClass + "(  +|$)");
                if (!reg.test(curTag.className)) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                ary.push(curTag);
            }
        }
        return ary;
    }
    return{
        listToArray:listToArray,
        getRandom:getRandom,
        hasPubProperty:hasPubProperty,
        prev:prev,
        jsonParse:jsonParse,
        offset:offset,
        win:win,
        getCss:getCss,
        setCss:setCss,
        setGroupCss:setGroupCss,
        css:css,
        preAll:preAll,
        next:next,
        nextAll:nextAll,
        children:children,
        sibling:sibling,
        siblings:siblings,
        index:index,
        firstEleChild:firstEleChild,
        lastChild:lastChild,
        append:append,
        prepend:prepend,
        insertBefore:insertBefore,
        insertAfter:insertAfter,
        hasClass:hasClass,
        addClass:addClass,
        removeClass:removeClass,
        getEleByClass:getEleByClass
    }
}();








