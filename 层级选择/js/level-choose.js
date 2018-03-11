/**
 * Created by tianzhicun on 2018/1/23.
 */
/*
* @params:{}
*   @params:container    //容器 默认：‘level’
*   @params:title        //头部标题
*   @params:selectedId   //
*   @params:paddingLeft  //每层左侧间距 默认：‘18’
*   */
var LevelChoose=function (options) {
    this.container=options.container||$("#level");
    this.title=options.title;
    this.selectedId=options.selectedId||"";
    this.paddingLeft=options.paddingLeft||18;
    this.init();
};
LevelChoose.prototype={
    constructor:LevelChoose,
    /*初始化基础元素*/
    initBaseElement:function () {
        var self=this;
        var baseEleStr='';
        baseEleStr+=' <p class="level-title">选择部门</p>';
        baseEleStr+='<div class="level-choose">';
        baseEleStr+='<span class="level-input" id="level-input" selected-id="'+self.selectedId+'">'+self.title+'</span>';
        baseEleStr+='<div class="level-area" id="level-area" style="display: block">';
        baseEleStr+='<div class="level-content" id="level-content">';
        baseEleStr+='<ul class="level-container" id="level-container"></ul>';
        baseEleStr+='</div></div></div>';
        self.container.html(baseEleStr);
    },

    /*递归计算每级选项的padding-left
    * @params:$ele:当前层级
    * @params:paddingLeft:每级左边距的距离
    * @params:n:当前层级-1,用于计算当前级的左边距*/
    countPadding: function ($ele, paddingLeft, n) {
        var self=this;
        //寻找第一层下是否有第二层
        var $levelBox = $ele.children(".level-box");
        if ($levelBox.length > 0) {//条件成立说明有第二层
            n += 1;
            //获取到第二层的list
            var $levelList = $levelBox.children(".level-list");
            //循环第二层的list
            $levelList.each(function (index, item) {
                //找到list下的p标签，并赋值paddingLeft
                $(item).children(".level-ctn").css("padding-left", paddingLeft * n);
                self.countPadding($(item), paddingLeft, n);
            })
        }
    },
    //事件执行函数：循环第一级并执行赋值padding
    assignPadding:function (index, item) {
        var self=this;
        $(item).children(".level-ctn").css("padding", "0 10px");
        self.countPadding($(item), self.paddingLeft, 0);
    },
    //选中效果切换
    /*@params:activeAry:已选中元素数组
    * @params:className:选中后要添加的类名*/
    selectedSwitch: function (activeAry, className) {
        if (activeAry.length <= 0) {
            activeAry.push($(this));
            $(this).addClass(className);
        } else {
            activeAry.pop().removeClass(className);
            activeAry.push($(this));
            $(this).addClass(className);
        }
    },
    //判断是否隐藏
    isShow:function ($ele) {
        return $ele.css("display") !== "none"
    },
    //展开层级盒子
    showChoose:function () {
        var self=this;
        var $levelArea = $("#level-area");
        if (self.isShow($levelArea)) {
            $levelArea.hide();
        } else {
            $levelArea.show();
        }
    },
    //点击选择部门事件函数
    choosePartEvent: function (event,that) {
        var self=that;
        var $levelArea=$("#level-area");
        var $levelInput=$("#level-input");
        var $target=$(event.target);
        if($target.hasClass("level-icon")){
            var $levelBox = $(this).siblings(".level-box");
            if (self.isShow($levelBox)) {
                $levelBox.hide().find(".level-box").hide();
                $levelBox.find(".level-icon").removeClass("level-show-icon").addClass("level-hide-icon");
                $(this).children(".level-icon").removeClass("level-hide-icon").addClass("level-show-icon");
                if($("#level-box").height()<430){
                    //$(".iScrollVerticalScrollbar").remove()
                }
            } else {
                $levelBox.show();
                $(this).children(".level-icon").removeClass("level-hide-icon").addClass("level-show-icon");
                //addScroll()
            }
        }else {
            if($(this).attr("data-id")!=="0"){
                self.selectedSwitch.call(this, [$("#level-container").find(".level-ctn-active")], "level-ctn-active");
                $levelArea.hide();
                $levelInput
                    .text($(this).children(".level-text").text())
                    .attr("data-id",$(this).attr("data-id"))
                    .addClass("level-input-active")
            }
        }
    },
    //生成层级数据HTML字符串
    elementStr:function (data,str) {
        var self=this;
        var str=str||"";
        var len=data.length;
        for(var i=0;i<len;i++ ){
            //修改的时候回填部门到#level-input
            if(data[i].id==self.selectedId&&self.selectedId!=="0"){
                $("#level-input").text(data[i].name).addClass("level-input-active");
            }
            str+='<li class="level-list">';
            str+='<p class="level-ctn" data-id="'+data[i].id+'">';
            str+='<i class="level-folder"></i>';
            str+='<span class="level-text">'+data[i].name+'</span>';
            if(data[i].children.length>0){
                str+='<i class="level-icon level-hide-icon"></i>';
            }
            str+='</p>';
            if(data[i].children.length>0){
                str+='<ul class="level-box" style="display: none">';
                str=self.elementStr((data[i].children),str);
                str+='</ul>';
            }
            str+='</li>';
        }
        return str;
    },
    //定位到被选中的部门元素
    positionSelected:function (id) {
        var $currentDepart;
        $(".level-ctn").each(function (index,item) {
            if($(item).attr("data-id")==id){
                $currentDepart=$(item);
                return;
            }
        });
        return $currentDepart;
    },
    //展开被选中的路径 in showSelected
    findParent:function ($ele) {
        var self=this;
        var $parent=$ele.parent().parent();
        if($parent.hasClass("level-box")){
            $parent.siblings(".level-ctn").children(".level-icon").addClass("level-show-icon");
            $parent.siblings(".level-ctn").children(".level-icon").removeClass("level-hide-icon");
            $parent.show();
            //self.addScroll();
            self.findParent($parent);

        }
    },
    //根据传入id展示被选中的部门
    showSelected:function (id){
        var self=this;
        if(id){
            var $currentDepart=self.positionSelected(id);
            $currentDepart.addClass("level-ctn-active");
            self.findParent($currentDepart);
        }else {return;}
    },
    bindData:function (data) {
        var self=this;
        var $levelContainer=$("#level-container");
        var $levelInput=$("#level-input");
        if(data){
            $levelContainer.html(self.elementStr(data,""));
            if(self.selectedId!=="0"){
                self.showSelected(self.selectedId);
            }
            var $FirstList = $("#level-container").children(".level-list");
            $FirstList.each(self.assignPadding.bind(self));
            $(".level-ctn").on("click",function(event){self.choosePartEvent.call(this,event,self)});
            $levelInput.on("click",self.showChoose.bind(self));
        }
    },
    getData:function (data) {
        var self=this;
        if(data){
            self.bindData(data);
        }
    },
    init:function () {
        var self=this;
        self.initBaseElement();
    }
}