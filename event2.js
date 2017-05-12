//div1.addEventListener('click',fn,false);
function on(ele,type,fn){
    if(ele.addEventListener){
        ele.addEventListener(type,fn);
    }else{
        if(!ele['AAA'+type]){
            ele['AAA'+type] = [];
            ele.attachEvent('on'+type,function (){
                this; // window
                run.call(ele); // run中的this就是绑定事件的元素了
            });
        }
        var a = ele['AAA'+type];
        for(var i = 0 ; i < a.length; i++){
            if(a[i] === fn){
                return;
            }
        }
        a.push(fn);
    }
}
function run(e){
    e = window.event;
    e.target = e.srcElement;
    e.pageX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
    e.pageY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
    e.preventDefault = function (){ e.returnValue = false; }
    e.stopPropagation = function (){ e.cancelBubble = true; }
    var a = this['AAA'+e.type];
    if(a && a.length){
        for(var i = 0; i < a.length; i++){
            if(typeof a[i] == 'function'){
                a[i].call(this,e);
            }else{ // null
                a.splice(i,1);
                i--;
            }
        }
    }
}

function off(ele,type,fn){
    if(ele.removeEventListener){
        ele.removeEventListener(type,fn);
    }else{
        var a = ele['AAA'+type];
        if(a && a.length){
            for(var i = 0; i < a.length; i++){
                if(a[i] === fn){
                    a[i] = null;
                    break;
                }
            }
        }
    }
}
function processThis(fn,context){
    // 我要把fn中的this处理成context
    return function (e){
        fn.call(context,e);
    }
}