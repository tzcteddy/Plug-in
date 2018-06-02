/**
 * Created by YYBJ on 2018/6/1.
 */
var Event=function () {

};
Event.prototype={
    constructor:Event,
    /**
     * @param type:true时切换*/
    switch:function(e,ele,type){
        var actionAry=[$(".switch .active")];
        actionAry.pop().removeClass("active");
        $(ele).addClass("active");
       if(type){
           var ctrlContent=[$("main .show")];
           ctrlContent.pop().removeClass("show");
           $("."+$(ele).attr("switch-ctrl")).addClass("show");
           /*swiper&&swiper.destroy(true);
           var swiper = new Swiper('.swiper-container', {
               slidesPerView: "auto",
               spaceBetween: 30
           });*/
       }else {
           return;
       }
    },
    isSticky:function(){
        var nav=document.getElementsByClassName("nav")[0];
        return /sticky/i.test(window.getComputedStyle(nav).position);
    },
    scrollSwitch:function(){
        var _this=this;
        var indexFlag;
        $("section").each(function(index,item){
            if(($(item).height()+$(item).offset().top>=$(window).scrollTop()+$(window).height())&&($(item).offset().top<=$(window).scrollTop()+$(window).height())){
                indexFlag= index;
            }
        });
        indexFlag=indexFlag===undefined?3:indexFlag;
        return indexFlag;
    },
    bindNavBar:function(){
        var _this=this;
        var $navBar=$(".nav span");
        $navBar.each(function(index,item){
            $(item).on("click",function(e){
                _this.switch(e,this,true);
                $(window).scrollTop($("#section"+(index+1)).offset().top-$(".nav").height());
            })
        })
    },
    bindScroll:function(){
        var _this=this;
        $(window).on("scroll",function(){
            var actionAry=[$(".nav .active")];
            actionAry.pop().removeClass("active");
            $(".nav span").eq(_this.scrollSwitch()).addClass("active");
            if(!_this.isSticky()){
                if($(window).scrollTop()>=_this.navOffsetTop){
                    $(".switch").removeClass("static").addClass("fixed");
                    if($(window).scrollTop()>=$("#section3").offset().top){
                        $(".switch").removeClass("fixed").addClass("static");
                    }
                }else{
                    $(".nav-wrap").removeClass("fixed").addClass("static");
                }

            }
        })
    },
    lazyLoad: function() {
        var _this=this;
        var $images=$('img.lazy');
        for(var i=0;i<$images.length;i++ ){
            _this.imgLoadPosition($images[i])
        }
    },
    imgLoad: function(img, callBack) {
        var tempImag = new Image
            , e = $(img).attr("src")
            , n = $(img).attr("data-original");
        e == n ? tempImag.src = img.src : (tempImag.src = n || e,
            $(img).hide(),
            $(img).fadeIn(300)),
            tempImag.onload = function() {
                $(img).attr("src", n),
                    callBack(img, tempImag)
            }
    },
    imgLoadPosition: function(a) {
        var i = this;
        i.imgLoad(a, function(a, i) {
            var t = i.width
                , e = i.height
                , n = $(a).parent().width()
                , s = $(a).parent().height()
                , o = n / s
                , l = t / e;
            if (o < l) {
                var c = s * l
                    , r = (c - n) / 2;
                $(a).removeAttr("width"),
                    $(a).css({
                        position: "absolute",
                        top: 0,
                        height: s + "px",
                        left: -r + "px",
                        width: "auto"
                    })
            } else {
                var c = s * l
                    , r = (c - n) / 2
                    , d = n / l
                    , h = (d - s) / 2;
                $(a).css({
                    position: "absolute",
                    top: -h + "px",
                    height: "auto",
                    left: 0,
                    width: "100%"
                })
            }
        })
    },
};
$(".switch span").on("click",function (e) {
    var _this=this;
    if(!($(_this).hasClass("disable"))){
        $(_this).addClass("disable");
       // new Event().lazyLoad();
    }
    new Event().lazyLoad();
    new Event().switch(e,_this,true)

});
new Event().lazyLoad();
//new Event().bindNavBar();
//new Event().bindScroll();
