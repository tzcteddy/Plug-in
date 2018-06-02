/**
 * Created by tianzhicun on 2018/6/2.
 */
function OlderPop(options){
    this.callBack=options?options.callBack:null;

    this.host='';
    this.formData = {
        seller_id: "",
        activity_id: "",
        phone: "",
        code: "",
        token: "",
        activity_num:3
    };
    this.getCodeTimer=null;
    this.isAndroid=utils.BrowserInfo().isAndroid;
    this.isIOS=utils.BrowserInfo().isIphone||utils.BrowserInfo().isIpad;

}
OlderPop.prototype={
    constructor:OlderPop,
    /**
     * @param {string} ele
     * @param {string} type
     * @param {function array} fn
     */
    bindEvent: function (ele, type, fn) {
        var _this = this;
        if (typeof ele == 'string') {
            $(ele).on(type, function (e) {
                if (Object.prototype.toString.call(fn) == '[object Function]') {
                    fn.call(_this, e, this);
                }
                if (Object.prototype.toString.call(fn) == '[object Array]') {
                    for (var i = 0; i < fn.length; i++) {
                        fn[i].call(_this, e, this);
                    }
                }
            })
        }
    },
    /**
     * @param {string} ele
     * @param {string} type
     */
    offEvent: function (ele, type) {
        var _this = this;
        if (typeof ele == 'string') {
            if (typeof type == "string") {
                $(ele).off(type)
            }
            if (Object.prototype.toString.call(type) == '[object Array]') {
                for (var i = 0; i < type.length; i++) {
                    $(ele).off(type[i]);
                }
            }
        }
    },
    //展示工具函数
    show: function (eles, flag) {
        var _this = this;
        if (typeof eles == 'string') {
            flag ? $(eles).show() : $(eles).hide();
        }
        if (Object.prototype.toString.call(eles) == '[object Array]') {
            for (var i = 0; i < eles.length; i++) {
                flag ? $(eles[i]).show() : $(eles[i]).hide();
            }
        }
    },

    /**
     * @param {string} url
     * @param {string} method
     * @param {object} data
     * @param {function} callback
     */
    getData: function (url, method, data, callback) {
        var _this=this;
        $.ajax({
            url: _this.host+url,
            type: method,
            data: data,
            dataType: 'json',
            success: function (result) {

                callback(result);
            }
        })
    },
    Login:function(obj){
        var _this=this;
        if((utils.initMainInfo().isApp)&&(!utils.initMainInfo().isToken)){
            if (obj) {
                //去登录
                //需判断android/ios
                if(_this.isAndroid){
                    utils.initMainInfo().isApp && window.android&&window.android.jsObtainUserInfo(JSON.stringify(obj));
                }
                if(_this.isIOS){
                    utils.initMainInfo().isApp&&window.webkit && window.webkit.messageHandlers.jsObtainUserInfo.postMessage(obj);
                }
            }
        }
    },
    //展示预约弹框
    showOlderPop:function(){
        var _this=this;
        _this.show([".alpha",".fixed-wrap",".join-info-1"],true);
        $("html").css({
            "overflow-y":"hidden",
            "position":"fixed"
        });
        //绑定背景关闭事件
        _this.bindEvent(".join-info", 'click', _this.stop);
        _this.bindEvent('.fixed-wrap', 'click', _this.close);
        //绑定输入手机号事件
        _this.bindEvent('#phone', 'keyup', _this.inputPhone);
        //绑定获取验证码事件
        _this.bindEvent('.join-fill-code .disable', 'click', _this.getCode);
        //绑定输入验证码事件
        _this.bindEvent('#code', 'keyup', function () {
            $("#code").siblings(".error-msg").css("visibility", "hidden");
        });
        //绑定提交事件
        _this.bindEvent('.join-disable', 'click', _this.submit);
    },
    //展示成功弹框
    showSucStatus:function(){
        var _this=this;
        _this.show([".join-info-1"],false);
        _this.show([".alpha",".fixed-wrap",".join-info-suc"],true);
        _this.offEvent('.fixed-wrap', 'click');
        _this.bindEvent('.close', 'click', _this.close);
    },
    //验证手机号
    checkPhone:function(phone) {
        var reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
        return reg.test(phone)
    },
    //输入手机号
    inputPhone: function () {
        var _this = this;
        var $phone = $("#phone");
        var $code = $(".join-fill-code").find(".disable");
        var phone = $phone.val();
        $phone.siblings(".error-msg").css("visibility", "hidden");
        if (phone.length >= 11 && _this.checkPhone(phone)) {
            $code.addClass("get-code");
            $('.join-disable').addClass("join-submit");
        } else {
            $code.removeClass("get-code");
        }
    },

    //获取验证码
    getCode: function (e) {
        var _this = this;
        var $target = $(e.target);
        if ($target.hasClass('get-code')) {
            var obj = {
                "phone": $('#phone').val(),
                "type": 0
            };
            //TODO
            _this.getData('/api/app/user/GetVerificationCode', 'post', JSON.stringify(obj), function (result) {
                $target.removeClass('get-code');
                /*开启倒计时*/
                if(result.retcode==0){
                    _this.countdown.call(_this);
                }else {
                    $("#code").siblings(".error-msg").text(result.msg).css("visibility","visible")
                }
                // _this.offEvent('.join-fill-code .disable',"click")
            })
        }
    },
    //倒计时
    countdown: function () {
        var _this=this;
        var $getCode = $('.join-fill-code .disable');
        var count = 60;
        clearInterval(_this.getCodeTimer);
        _this.getCodeTimer = setInterval(function () {
            if (count <= -1) {
                clearInterval(_this.timer);
                $getCode.html('获取验证码');
                $getCode.addClass('get-code');
                return;
            }
            $getCode.html(count + 's');
            count--;
        }, 1000)
    },
    submit: function (e) {
        var _this = this;
        var $target = $(e.target);
        if ($target.hasClass("join-submit")) {
            var phone = $("#phone").val();
            var code = $("#code").val();
            if (!_this.checkPhone(phone) || !(/\d{4}/.test(code))) {
                !_this.checkPhone(phone) ? $("#phone").siblings('.error-msg').css("visibility", 'visible') : null;
                !(/\d{4}/.test(code)) ? $("#code").siblings('.error-msg').html("验证码错误").css("visibility", 'visible') : null;
                return;
            }
            //TODO
            _this.formData.phone = $("#phone").val();
            _this.formData.code = $("#code").val();
            _this.formData.token = '';
           _this.callBack.call(_this,_this.formData);

        }
    },
    stop:function(e){
        var _this=this;
        e.stopPropagation?e.stopPropagation():e.cancelBubble=true;
    },
    //关闭弹框
    close:function(){
        var _this=this;
        _this.show([".alpha",".fixed-wrap",".join-info-1"],false);
        _this.show([".alpha",".fixed-wrap",".join-info-suc"],false);
        $("html").css({
            "overflow-y":"scroll",
            "position":"static"
        });
        $("#phone,#code").val("");
        $('.join-fill-code .disable').removeClass("get-code").text("获取验证码");
        clearInterval(_this.getCodeTimer);
        $(".join-disable").removeClass("join-submit");
        $(".error-msg").css("visibility", "hidden");

        //解绑背景关闭事件
        _this.offEvent(".join-info", 'click');
        _this.offEvent('.fixed-wrap', 'click');
        //解绑输入手机号事件
        _this.offEvent('#phone', 'keyup');
        //解绑获取验证码事件
        _this.offEvent('.join-fill-code .disable', 'click');
        //解绑输入验证码事件
        _this.offEvent('#code', 'keyup');
        //解绑提交事件
        _this.offEvent('.join-disable', 'click');
    }
};