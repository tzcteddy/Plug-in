/**
 * Created by Administrator on 2017/2/19.
 */
;(function () {
    function addMouseWheelEvent(ele,fn) {
        if(window.navigator.userAgent.toLowerCase().indexOf("firefox")===-1){
            ele.onmousewheel=handler;
        }else {
            ele.addEventListener("DOMMouseScroll",handler);
        }
        function handler(e) {
            e=e||window.event;
            var isDown=null;
            if(e.wheelDelta){
                isDown=e.wheelDelta<0;
            }else {
                isDown=e.detail>0;
            }
            fn.call(ele,isDown,e);
            e.preventDefault?e.preventDefault():e.returnValue=false;
        }
    }
    window.addMouseWheelEvent=addMouseWheelEvent;
})();
