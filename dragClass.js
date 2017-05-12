function Drag(ele){
    this.ele = ele;
    this.l = null;
    this.t = null;
    this.DOWN = processThis(this.down,this);
    this.MOVE = processThis(this.move,this);
    this.UP = processThis(this.up,this);
    on(this.ele,'mousedown',this.DOWN);
}
// 继承Emitter类，为了直接能调用on方法
Drag.prototype = new Emitter();
Drag.prototype.constructor = Drag;
//
Drag.prototype.down = function (e){
    this.l = e.pageX - this.ele.offsetLeft;
    this.t = e.pageY - this.ele.offsetTop;
    if(this.ele.setCapture){
        this.ele.setCapture();
        on(this.ele,'mousemove',this.MOVE);
        on(this.ele,'mouseup',this.UP);
    }else{
        on(document,'mousemove',this.MOVE);
        on(document,'mouseup',this.UP);
    }
    // 开始拖拽...  dragstart
    this.fire('selfdragstart',e);
}
Drag.prototype.move = function (e){
    var left = e.pageX - this.l;
    var top = e.pageY - this.t;
    this.ele.style.left = left + 'px';
    this.ele.style.top = top + 'px';
    e.preventDefault();
    // 拖拽中...   drag
    //fire.call(this.ele,'selfdragging',e);
    this.fire('selfdragging',e);
}
Drag.prototype.up = function (e){
    if(this.ele.releaseCapture){
        this.ele.releaseCapture();
        off(this.ele,'mousemove',this.MOVE);
        off(this.ele,'mouseup',this.UP);
    }else{
        off(document,'mousemove',this.MOVE);
        off(document,'mouseup',this.UP);
    }
    // 拖拽结束... dragend
    //fire.call(this.ele,'selfdragend',e);
    this.fire('selfdragend',e);
}
