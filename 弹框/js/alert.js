/**
 * Created by tianzhicun on 2018/6/2.
 */
function AlertPop(options){
    this.msg=options.message;
    this.alertStr='';
    this.appendAlert();
}
AlertPop.prototype={
    constructor:AlertPop,
    createEle:function(){
        var _this=this;
        _this.alertStr+='<div class="alert-pop">';
        _this.alertStr+='<div class="alert-mask"></div>';
        _this.alertStr+='<div class="alert-msg">';
        _this.alertStr+='<span class="alert-text">'+this.msg+'</span>';
        _this.alertStr+='</div>';
        _this.alertStr+='</div>';
    },
    appendAlert:function(){
        var _this=this;
        _this.createEle();
        $("body").append(_this.alertStr);
        _this.close();
    },
    close:function(){
        var _this=this;
        setTimeout(function(){
            $(".alert-pop").remove();
        },600)
    }
}