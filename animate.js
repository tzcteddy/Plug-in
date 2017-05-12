/**
 * Created by Administrator on 2017/1/17.
 */
;(function () {
    function animate(option) {
        var linear=function (t,b,c,d) {
            return b+t/d*c
        };
        var ele=option.ele;
        var target=option.target;
        var time=0;
        var begin={};
        var change={};
        var duration=option.duration||1000;
        var callback=option.callback;
        for(var key in target){
            begin[key]=utils.getCss(ele,key);
            change[key]=target[key]-begin[key];
        }
        window.clearInterval(ele.timer);
        ele.timer=window.setInterval(function () {
            time+=10;
            if(time>=duration){
                window.clearInterval(ele.timer);
                for(var key in target){
                    utils.setCss(ele,key,target[key]);
                }
                if(typeof callback=="function"){
                    callback.call(ele);
                    return;
                }
            }
            for(var key in change){
                var val=linear(time,begin[key],change[key],duration);
                utils.setCss(ele,key,val);
            }
        },10)
    }
    window.animate=animate;
})();