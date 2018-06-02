/**
 * Created by YYBJ on 2018/4/19.
 */
var utils = (function () {
    function getAllUrl(){
        return {
            openUrl:'https://www.menghunli.com/download',//ios打开app
            WeixinUrl:'http://android.myapp.com/myapp/detail.htm?apkName=com.dream.wedding',
            downAndroidUrl:'http://product-uploadtoapps.oss-cn-beijing.aliyuncs.com/version/default/hqApp-700002-release.apk',//安卓下载
            downIosUrl:'itms-apps://itunes.apple.com/app/id1304807209'//ios下载
        }
    }
    function BrowserInfo() {
        var json = {
            userAgent: navigator.userAgent.toLowerCase(),
            isAndroid: Boolean(navigator.userAgent.match(/android/ig)),
            isIphone: Boolean(navigator.userAgent.match(/iphone|ipod/ig)),
            isIpad: Boolean(navigator.userAgent.match(/ipad/ig)),
            isWeixin: Boolean(navigator.userAgent.match(/MicroMessenger/ig))
        };
        return json;
    }
    function openOrDown(openUrl, callback,canClick) {
        //检查app是否打开
        function checkOpen(cb){
            var _clickTime = +(new Date());
            function check(elsTime) {
                if ( elsTime > 3000 || document.hidden || document.webkitHidden) {
                    cb(1);
                } else {
                    cb(0);
                }
            }
            //启动间隔20ms运行的定时器，并检测累计消耗时间是否超过3000ms，超过则结束
            var _count = 0, intHandle;
            intHandle = setInterval(function(){
                _count++;
                var elsTime = +(new Date()) - _clickTime;
                if (_count>=100 || elsTime > 3000 ) {
                    clearInterval(intHandle);
                    check(elsTime);
                }
            }, 20);
        }

        //在iframe 中打开APP
        var ifr = document.createElement('iframe');
        if(BrowserInfo().isIphone||BrowserInfo().isIpad){
            location.href = openUrl;
        }else {
            ifr.src = openUrl;
        }
        ifr.style.display = 'none';
        if (callback) {
            //客户端检测微信直接跳应用宝链接
            var browser = BrowserInfo();
            //使用微链接
            var encodeUri = encodeURIComponent(openUrl);

            if (browser.isWeixin) {
                //window.location.href = '微链url&android_schema='+encodeUri;
                browser.isIphone||browser.isIpad
                    ?window.location.href = getAllUrl().downIosUrl
                    :window.location.href = getAllUrl().WeixinUrl;
            }else{
                checkOpen(function(opened){
                    callback && callback(opened);
                });
            }
        }
        document.body.appendChild(ifr);
        setTimeout(function() {
            document.body.removeChild(ifr);
        }, 2000);

    }
    function callBack(opened) {
        var browser=BrowserInfo();
        if(opened==1){//打开了app

        }else {//没打开去下载
            if(browser.isWeixin){//在微信上
                window.location.href = getAllUrl().WeixinUrl;
            }else if(browser.isIphone||browser.isIpad){//在ios上
                window.location = getAllUrl().downIosUrl;
            }else {//其他浏览器中
                window.location = getAllUrl().downAndroidUrl;
            }
        }
    }
    /**
     * @open_url: 要打开APP的地址*/
   function handler(open_url){
       utils.openOrDown(open_url,callBack);
   }
   /*判断登录状态*/
   function initMainInfo(){
        var _this=this;
        var phone = null, token = null;
        var user,isApp;

        user = localStorage.getItem("user_info");
        if (user) {
            user = JSON.parse(user);
            phone = user.phone;
            token = user.token;
        }
       if(BrowserInfo().isAndroid){
           isApp=window.android?true:false;
       }else if(BrowserInfo().isIphone||BrowserInfo().isIpad){
           isApp=user&&user!='' ? true : false;
       }
        return {
            isApp   : isApp,
            isToken : (token) && (token != '') ? true : false,
            user     : user
        }
    };
    return {
        BrowserInfo  : BrowserInfo,
        openOrDown   : openOrDown,
        handler      : handler,
        initMainInfo : initMainInfo
    }
})();


