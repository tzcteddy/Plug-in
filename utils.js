
var utils = (function (){
    function toArray(likeAry){

        try{
            return Array.prototype.slice.call(likeAry,0);
        }catch(e){
            var ary = [];
            for(var i = 0 ; i < likeAry.length; i++){
                ary.push(likeAry[i]);
            }
            return ary;
        }
    }//转为数组
    function jsonParse(jsonStr){

            return "JSON" in window ? JSON.parse(jsonStr) : eval('('+jsonStr+')');
        }//把JSON格式的字符串转为JSON格式的对象
    function getRandom(n,m){
            if(isNaN(n)||isNaN(m)){
                return Math.random();
            }
            return Math.round(Math.random()*(m-n)+n);
        }//取n m之间的随机整数
    function prev(ele){

            var prev = ele.previousSibling; // comment text  element
            while ( prev && prev.nodeType != 1){
                prev = prev.previousSibling;
            }
            return prev;
        }//获取上一个兄弟元素节点
    function next(ele){
       /*     if("previousElementSibling" in ele){
                return ele.previousElementSibling;
            }*/
            var next = ele.nextSibling;
            while (next && next.nodeType != 1){
                next = next.nextSibling;
            }
            return next;
        }//获取下一个兄弟子节点
    function children(ele,tagName){
            var childs = ele.childNodes;
            var ary = [];
            for(var i = 0; i < childs.length; i++){
                if(childs[i].nodeType == 1){
                    ary.push(childs[i]);
                }
            }

            if(typeof tagName == "string"){
                for( i = 0; i < ary.length; i++ ){
                    // 'SPAN'  'DIV'
                    if(ary[i].nodeName !== tagName.toUpperCase()){
                        ary.splice(i,1);
                        i--;
                    }
                }
            }
            return ary;
        }//获取所有叫tagName的元素子节点
    function win(attr,val){
        if(typeof val !== 'undefined'){
            document.documentElement[attr] = val;
            document.body[attr] = val;
            return;
        }
        return document.documentElement[attr] || document.body[attr];
    }//一个参数：获取窗口的盒子模型；两个参数：给窗口的attr盒子模型属性赋值val
    function offset(ele){
        var l = 0,t = 0;
        l += ele.offsetLeft;
        t += ele.offsetTop;
        var par = ele.offsetParent;
        while (par){
            if(window.navigator.userAgent.indexOf('MSIE 8') === -1){
                l += par.clientLeft;
                t += par.clientTop;
            }
            l += par.offsetLeft;
            t += par.offsetTop;
            par = par.offsetParent;
        }
        return {left : l, top : t};
    }//获取左、上偏移量
    function getCss(ele,attr){
        var val = null;
        if(window.getComputedStyle){
            val = window.getComputedStyle(ele)[attr];
        }else{
            if(attr == 'opacity'){
                val = ele.currentStyle.filter;
                var reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                val = reg.test(val) ? reg.exec(val)[1]/100 : 1;
            }else{
                val = ele.currentStyle[attr];
            }
        }
        // -5.5px
        var reg = /^-?\d+(\.\d+)?(px|pt|em|rem|deg)?$/;
        return reg.test(val) ? parseFloat(val) : val;
    }//获取ele的已经有效的样式属性attr
    function setCss(ele,attr,val){
        if(attr == 'opacity'){
            ele.style.opacity = val;
            ele.style.filter = 'alpha(opacity='+ val*100 + ')';
            return;
        }
        if(attr == 'float'){
            ele.style.cssFloat = val;
            ele.style.styleFloat = val;
            return;
        }
        var reg = /^(width|height|left|top|right|bottom|(margin|padding)(Left|Top|Right|Bottom)?)$/;
        if(reg.test(attr)){
            if(!isNaN(val)){
                val += 'px';
            }
        }
        ele.style[attr] = val;
    }//给ele元素添加attr样式为val
    function setGroupCss(ele,obj) {
        for(var key in obj){
            setCss(ele,key,obj[key])
        }
    }//给ele设置多个样式
    function css(ele) {
        var secondParam=arguments[1];
        var thirdParam=arguments[1];
        if(typeof secondParam=="string"){
            if(typeof thirdParam=="undefined"){
                return getCss(ele,secondParam);
            }
            setCss(ele,secondParam,thirdParam);
        }
        if(Object.prototype.toString.call(secondParam)=="[object Object]"){
            setGroupCss(ele,secondParam);
        }
    }//根据参数不同处理getCss setCss setGroupCss合并
    function hasClass(ele,className) {
        var reg=new RegExp("(^| +)"+className+"( +|$)");///(^| +)c1( +|$)/
        return  reg.test(ele.className)
    }//判读元素是否有这个类名
    function addClass(ele,className) {
        var classNameAry = className.replace(/(^ +| +$)/g,"").split(/ +/);
        for(var i=0;i<classNameAry.length;i++){
            var curClass=classNameAry[i];
            if(!hasClass(ele,curClass)){
                ele.className+=" "+curClass;
            }
        }
    }//给元素添加类名
    function removeClass(ele,className) {
        var  classNameAry=className.replace(/^ +| +$/g,"").split(/ +/);
        for(var i=0;i<classNameAry.length;i++){
            var curClass=classNameAry[i];
            var reg=new RegExp("(^| +)"+curClass+"( +|$)","g");
            ele.className = ele.className.replace(reg," ");
        }
    }//删除元素中的某类名
    function toggleClass(ele,className) {
        if(hasClass(ele,className)){
            removeClass(ele,className)
        }else {addClass(ele,className)}
    }//实现toggle效果，根据类名是否存在进行添加或删除
    function prevAll(ele) {
        var ary=[];
        var pre=prev(ele);
        while (pre){
            ary.unshift(pre);
            pre=prev(pre);
        }
        return ary;
    }  //获取所有哥哥元素
    function nextAll(ele) {
        var ary=[];
        var nex=next(ele);
        while (nex){
            ary.push(nex);
            nex=next(nex);
        }
        return ary;
    } //获取所有弟弟元素
    function siblings(ele) {
        return  prevAll(ele).concat(nextAll(ele))
    } //获取所有兄、弟子节点
    function sibling(ele) {
        var ary = [];
        var pre = prev(ele);
        var nex = next(ele);
        pre && ary.push(pre);
        nex && ary.push(nex);
        return ary;
    }//获取相邻两个
    function index(ele) {
        return prevAll(ele).length
    }//索引
    function getElesByClass(className,context) {
        context=context||document;
        if(context.getElementsByClassName){
            return context.getElementsByClassName(className);
        }
        var tags=context.getElementsByTagName("*");
        var ary=[];
        var classNameAry=className.replace(/(^ +| +$)/g," ").split(/ +/);
        for(var i=0;i<tags.length;i++){
            var curTag=tags[i];
            var tagIsOk=true;
            for(var j=0;j<classNameAry.length;j++){
                var curClass=classNameAry[j];
                var reg=new RegExp("(^| +)"+curClass+"( +|$)");
                if(!reg.test(curTag.className)){
                    tagIsOk=false;
                    break;
                }
            }
            if(tagIsOk){
                ary.push(curTag);
            }
        }
        return ary;
    }//通过类在一个范围内获取元素，返回数组



    return {
        index:index,
        sibling:sibling,
        siblings:siblings,
        nextAll:nextAll,
        prevAll:prevAll,
        getElesByClass:getElesByClass,
        toggleClass:toggleClass,
        removeClass:removeClass,
        addClass:addClass,
        hasClass:hasClass,
        setCss : setCss,
        getCss : getCss,
        setGroupCss:setGroupCss,
        css:css,
        offset : offset,
        win : win,
        toArray : toArray,
        jsonParse : jsonParse,
        getRandom : getRandom,
        prev : prev,
        next : next,
        children : children
    };

})();








