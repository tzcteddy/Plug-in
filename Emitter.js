// new Drag(div1)
// on,off,fire
function Emitter(){}
Emitter.prototype.on = function (type,fn){
    // type: selfdragstart, fn : start
    //this : drag1{ ele: div1 }
    if(!this.ele[type]){
        this.ele[type] = [];
    }
    var a = this.ele[type];
    for(var i = 0; i < a.length; i++){
        if(fn === a[i]){
            return;
        }
    }
    a.push(fn);
    return this; // 保证链式写法，函数执行后返回一个实例
}
Emitter.prototype.off = function (type,fn){
    var a = this.ele[type];
    if(a && a.length){
        for(var i = 0; i < a.length; i++){
            if(a[i] === fn){
                a[i] = null;
                break;
            }
        }
    }
    return this;
}
Emitter.prototype.fire = function (type,e){
    // this : drag1
    // fire : 1 找到div1.selfdragstart = [start]  2 执行
    // type : selfdragstart
    var a = this.ele[type];
    if(a && a.length){
        for(var i = 0; i < a.length; i++){
            if(typeof a[i] == 'function'){
                a[i].call(this.ele,e);
            }else{
                a.splice(i,1);
                i--;
            }
        }
    }
}








