/**
 * Created by Administrator on 2017/1/19.
 */
//用定义在原型上的公有方法去操作实例上的私有属性

function Banner(banner,url,interval) {
    this.interval=interval||2000;
    this.banner=banner;
    this.bannerInner=utils.getElesByClass("bannerInner",this.banner)[0];
    this.focusUl=utils.getElesByClass("focusUl",this.banner)[0];
    this.left=utils.getElesByClass("left",this.banner)[0];
    this.right=utils.getElesByClass("right",this.banner)[0];
    this.imgs=this.bannerInner.getElementsByTagName("img");
    this.lis=this.focusUl.getElementsByTagName("li");
    this.data=null;
    this.url=url;//每个轮播需要不同的数据
    this.index=0;
    this.timer=null;
    this.init();

}
Banner.prototype.getData=function () {
        var that=this;
        var xhr=new XMLHttpRequest();
        xhr.open("get",this.url+"?_="+Math.random(),false);
        xhr.onreadystatechange=function () {
            if(xhr.readyState==4&&xhr.status==200){
                that.data=JSON.parse(xhr.responseText);
            }
        };
        xhr.send();
};
Banner.prototype.bindData=function () {
    if (this.data) {
        var str = "";
        var strLi = "";
        for (var i = 0; i < this.data.length; i++) {
            str += "<div><img src='' real='" + this.data[i].src + "'></div>";
            strLi += i == 0 ? "<li class='cur'></li>" : "<li></li>";
        }
        this.bannerInner.innerHTML = str;
        this.focusUl.innerHTML = strLi;
    }
};
Banner.prototype.imgsDelayLoad=function () {
    var that=this;
    for(var i=0;i<this.imgs.length;i++){
        var tempImg=document.createElement("img");
        tempImg.index=i;
        tempImg.src=this.imgs[i].getAttribute("real");
        tempImg.onload=function () {
            that.imgs[this.index].src=this.src;
            if(this.index==0){
                utils.setCss(that.imgs[0].parentNode,"zIndex",1);
                animate({
                    ele:that.imgs[0].parentNode,
                    target:{
                        opacity:1
                    },
                    duration:500
                })
            }

        }

    }
};
Banner.prototype.autoPlay=function () {
    this.index++;
    if(this.index==this.data.length){
        this.index=0;
    }
    this.setImg();
    console.log(this.index,new Date())
};
Banner.prototype.setImg=function () {
    for(var i=0;i<this.imgs.length;i++){
        if(i==this.index){
            utils.setCss(this.imgs[i].parentNode,"zIndex",1);
            animate({
                ele:this.imgs[i].parentNode,
                target:{
                    opacity:1
                },
                duration:500,
                callback:function () {
                    var siblings=utils.siblings(this);
                    for(var i=0;i<siblings.length;i++){
                        utils.setCss(siblings[i],"opacity",0);
                    }

                }
            })
        }else {
            utils.setCss(this.imgs[i].parentNode,"zIndex",0);
        }
    }
    for(var i=0;i<this.lis.length;i++){
        i==this.index?this.lis[i].className="cur":this.lis[i].className="";
    }
};
Banner.prototype.bindEventForBanner=function () {
    var that=this;
    this.banner.onmouseover=function () {
        window.clearInterval(that.timer);
        utils.setCss(that.left,"display","block");
        utils.setCss(that.right,"display","block");
    };
    this.banner.onmouseout=function () {
        //时刻保证原型上方法中的this是实例
        that.timer = window.setInterval(function(){that.autoPlay();}, that.interval);//一般情况下定时和事件中的this修改我们会包一个匿名函数
        utils.setCss(that.left, "display", "none");
        utils.setCss(that.right, "display", "none");
    };
};
Banner.prototype.bindEventForBtn=function () {
    var that=this;
    this.left.onclick=function () {
        that.index--;
        if(that.index==-1){
            that.index=that.data.length-1;
        }
        that.setImg();
    };
    this.right.onclick=function(){that.autoPlay()};
};
Banner.prototype.bindEventForLis=function () {
    var that=this;
    for(var i=0;i<this.lis.length;i++){
       this.lis[i].index=i;
       this.lis[i].onclick=function () {
            that.index=this.index;
           console.log(this.index);
            that.setImg();
        }
    }
};
// Banner.prototype.init=function /() {
//     var that=this;
//     this.getData();
//     this.bindData();
//     this.imgsDelayLoad();
//     this.timer=window.setInterval(function(){that.autoPlay()},that.interval);
//     this.setImg();
//     this.bindEventForBanner();
//     this.bindEventForBtn();
//     this.bindEventForLis();
// };

