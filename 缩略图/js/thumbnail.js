/**
 * Created by tzc on 2017/11/12.
 */
function Thumbnail() {
    this.$bigImage=$(".bigImage");
    this.$bannerList=$(".bannerList");
    this.$List=$(".bannerList li");
    this.$leftBtn=$(".leftBtn");
    this.$rightBtn=$(".rightBtn");
    this.$num=this.$bigImage.find(".num");
    this.index=Math.ceil(this.$List.length/5);
    this.curIndex=0;
    this.marginLeft=parseFloat(this.$List.css("margin-left"));
    this.liWidth=this.$List.width()+4;
    this.listArray=[this.$List.eq(2)];
    this.flag=true;
    this.$num.text("1/"+this.$List.length);
    this.$bannerList.css("width",this.index*5*(this.liWidth+this.marginLeft)+"px");
    this.init();
}
Thumbnail.prototype={
    constructor:Thumbnail,
    checkLength:function () {
        var that=this;
        if(that.$List.length%5!==0){
            if(that.curIndex==that.index-1){
                return false;
            }else {return true;}
        }else {return true;}
    },
    focusList:function (n) {
        var that=this;
        var $curList=that.checkLength()?that.$List.eq(2+5*n):that.$List.eq(that.$List.length-1);
        that.listArray.shift().removeClass("curLi");
        that.listArray.unshift($curList);
        $curList.addClass("curLi");
        that.$bigImage.find("img").attr("src",$curList.find("img").attr("src"));
        that.$num.text((3+5*n)+"/"+that.$List.length)
    },
    bannerMove:function (n) {
        var that=this;
        this.flag=false;
        var curLeft=parseFloat(this.$bannerList.css("left"));
        this.curIndex+=n;
        if(this.curIndex>=0&&this.curIndex<=this.index-1){
            curLeft=curLeft+(-n)*5*(this.liWidth+this.marginLeft);
            this.$bannerList.animate({
                left:curLeft+"px"
            },1000,function () {
                that.flag=true;
                that.focusList(that.curIndex);
            })
        }else {
            this.curIndex-=n;
            this.flag=true;
        }
    },
    clickBtn:function () {
        var that=this;
        that.$leftBtn.click(function () {
            that.flag?that.bannerMove(-1):null;
        });
        that.$rightBtn.click(function () {
            that.flag?that.bannerMove(1):null;
        });
    },
    clickList:function () {
        var that=this;
        that.$List.each(function (index,item) {
            $(item).mouseover(function () {
                that.listArray.shift().removeClass("curLi");
                that.listArray.unshift($(item));
                $(item).addClass("curLi");
                that.$bigImage.find("img").attr("src",$(item).find("img").attr("src"));
                that.$num.text((index+1)+"/"+that.$List.length)
            })
        });
    },
    defaultEvent:function () {
        $(document).on("mousemove",function (e) {
            e.preventDefault();
        });
    },
    drag:function (ele) {
        var that=this;
        ele.on("mousedown",down);
        function down(e){
            this.l = parseFloat($(this).css("left"));
            this.pageX=e.pageX;
            if(this.setCapture){
                this.setCapture();
                $(this).on("mousemove",move);
                $(this).on("mouseup",up);
            }else{ // 标准
                var that = this;
                that.MOVE = function (e){
                    this;// document
                    move.call(that,e);
                };
                ele.on("mousemove",that.MOVE);
                that.UP = function (e){
                    up.call(that,e);
                };
                $(document).on("mouseup",that.UP);
            }
        }
        function move(e){
            var changeX=e.pageX - this.pageX;
            this.changeX=changeX;
            e.preventDefault();
        }
        function up(e){
            var thatT=that;
            if(Math.abs(this.changeX)>10){
                if(this.changeX>0){
                    thatT.flag?thatT.bannerMove(-1):null;
                }else {
                    thatT.flag?thatT.bannerMove(1):null;
                }
            }
            // this
            if(this.releaseCapture){
                this.releaseCapture();
                $(this).off("mousemove",move);
                $(this).off("mouseup",up);
            }else{
                that.$bannerList.off('mousemove',this.MOVE);
                $(document).off('mouseup',this.UP);
                this.changeX=null;
            }
        }
    },
    init:function () {
        this.focusList(0);
        this.clickBtn();
        this.clickList();
        this.defaultEvent();
        this.drag(this.$bannerList);
    }
};