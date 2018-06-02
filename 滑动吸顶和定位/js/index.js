/**
 * Created by tianzhicun 2018/6/2.
 */
var Event=function () {
    this.navOffsetTop=$(".nav").offset().top;
};
Event.prototype={
    constructor:Event,
    /**
     * @param type:true时切换*/
    switch:function(e,ele){
        var actionAry=[$(".switch .active")];
        actionAry.pop().removeClass("active");
        $(ele).addClass("active");
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
                _this.switch(e,this);
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

};
new Event().bindNavBar();
new Event().bindScroll();