(function (global, factory) {
  typeof exports === 'object' && typeof module !== void 0 ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global.MHLH5 = factory())
})(this, function () {
  'use strict';

  function getCookie(name) {
    let arr,
      reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
      return (arr[2]);
    } else {
      return null;
    }
  }

  function setCookie(name, value, expiredays) {
    let exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = name + "=" + escape(value) + ";path=/;" + ((expiredays == null) ? "" : "expires=" + exdate.toGMTString());
  }

  function clearCookie() {
    let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
      for (let i in keys) {
        document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString() + "; path=/";
      }
    }
  }

  function encodeHtml(sHtml) {
    return sHtml.replace(/[<>&"]/g, function (c) {
      return {'<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;'}[c];
    });
  }

  function decodeHtml(str) {
    var arrEntities = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'};
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
      return arrEntities[t];
    });
  }

  function removeHtmlTag(str) {
    return str.replace(/<\/?.+?>/g, "")
  }

  function formatDate(stamp, type) {
    if (!stamp) {
      return "";
    }
    const now = new Date(parseInt(stamp));
    const year = now.getFullYear();
    const month = now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;
    const day = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
    const hour = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
    const minute = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
    const second = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
    if (type == "HM") {
      return hour + ":" + minute;
    } else if (type == "MDHM") {
      return month + "-" + day + " " + hour + ":" + minute;
    } else if (type == "YMD") {
      return year + "-" + month + "-" + day;
    } else if (type == "YM") {
      return year + "-" + month;
    } else if (type == "Y") {
      return year;
    } else {
      return year + "-" + month + "-" + day + " " + hour + ":" + minute;
    }
  }

  function getDate(val) {
    let time = new Date(val)
    let year = time.getFullYear()
    let month = time.getMonth() + 1
    let day = time.getDate()
    let hour = time.getHours()
    let minutes = time.getMinutes()
    if (month < 10) {
      month = '0' + month
    }
    if (day < 10) {
      day = '0' + day
    }
    if (hour < 10) {
      hour = '0' + hour
    }
    if (minutes < 10) {
      minutes = '0' + minutes
    }
    return "" + year + "-" + month + "-" + day + " " + hour + ":" + minutes + ""
  }

  var defaultExport$2 = function defaultExport(all) {
    this.all = all || Object.create(null);
  };

  defaultExport$2.prototype.on = function on(type, handler) {
    (this.all[type] || (this.all[type] = [])).push(handler);
  };

  defaultExport$2.prototype.off = function off(type, handler) {
    if (this.all[type]) {
      this.all[type].splice(this.all[type].indexOf(handler) >>> 0, 1);
    }
  };

  defaultExport$2.prototype.emit = function emit(type, evt) {
    (this.all[type] || []).map(function (handler) {
      handler(evt);
    })
    ;(this.all['*'] || []).map(function (handler) {
      handler(type, evt);
    });
  };

  function Element(tagName, props, children) {
    if (!(this instanceof Element)) {
      return new Element(tagName, props, children);
    }

    this.tagName = tagName;
    this.props = props || {};
    this.children = children || [];
    this.key = props ? props.key : undefined;

    let count = 0;
    this.children.forEach((child) => {
      if (child instanceof Element) {
        count += child.count;
      }
      count++;
    });
    this.count = count;
  }

  Element.prototype.setAttr = function (node, key, value) {
    switch (key) {
      case 'style':
        node.style.cssText = value;
        break;
      case 'value': {
        const tagName = node.tagName.toLowerCase() || '';
        if (tagName === 'input' || tagName === 'textarea') {
          node.value = value;
        } else {
          node.setAttribute(key, value);
        }
        break;
      }
      default:
        node.setAttribute(key, value);
        break;
    }
  };
  Element.prototype.render = function () {
    let _this = this;
    const el = document.createElement(this.tagName);
    const props = this.props;

    for (const propName in props) {
      _this.setAttr(el, propName, props[propName]);
    }

    this.children.forEach((child) => {
      const childEl = (child instanceof Element) ? child.render() : document.createTextNode(child);
      el.appendChild(childEl);
    });

    return el;
  };
  const doc = (typeof document === 'undefined') ? {
    body: {},
    addEventListener: function addEventListener() {
    },
    removeEventListener: function removeEventListener() {
    },
    activeElement: {
      blur: function blur() {
      },
      nodeName: '',
    },
    querySelector: function querySelector() {
      return null;
    },
    querySelectorAll: function querySelectorAll() {
      return [];
    },
    getElementById: function getElementById() {
      return null;
    },
    createEvent: function createEvent() {
      return {
        initEvent: function initEvent() {
        },
      };
    },
    createElement: function createElement() {
      return {
        children: [],
        childNodes: [],
        style: {},
        setAttribute: function setAttribute() {
        },
        getElementsByTagName: function getElementsByTagName() {
          return [];
        },
      };
    },
    location: {hash: ''},
  } : document;
  const win = (typeof window === 'undefined') ? {
    document: doc,
    navigator: {
      userAgent: '',
    },
    location: {},
    history: {},
    CustomEvent: function CustomEvent() {
      return this;
    },
    addEventListener: function addEventListener() {
    },
    removeEventListener: function removeEventListener() {
    },
    getComputedStyle: function getComputedStyle() {
      return {
        getPropertyValue: function getPropertyValue() {
          return '';
        },
      };
    },
    Image: function Image() {
    },
    Date: function Date() {
    },
    setTimeout: function setTimeout() {
    },
    clearTimeout: function clearTimeout() {
    },
    localStorage: {
      getItem: function getItem() {
      },
      setItem: function setItem() {
      },
    }
  } : window;
  const BrowserInfo = {
    isAndroid: Boolean(win.navigator.userAgent.toLowerCase().match(/android/ig)),
    isIOS: Boolean(win.navigator.userAgent.toLowerCase().match(/iphone|ipod|ipad/ig)),
    isIphone: Boolean(win.navigator.userAgent.toLowerCase().match(/iphone|ipod/ig)),
    isIpad: Boolean(win.navigator.userAgent.toLowerCase().match(/ipad/ig)),
    isWeixin: Boolean(win.navigator.userAgent.toLowerCase().match(/micromessenger/ig)),
    isApp: Boolean(win.navigator.userAgent.toLowerCase().match(/dreamWedding/ig))
  };
  var MHLH5 = (function (Emmiter) {
    return {}
  })(defaultExport$2);
  return MHLH5
});
//var ary=[1,2,3];
//var ary2=ary;
//ary2===ary  true
//ary2=ary.slice();
//ary2===ary   false

//var obj={age:12};
//var obj2=obj;
//obj2===obj  true
//obj2=Object.assign({},obj);
//obj2===obj  false
/*----------------------------------------watch原理---------------------------------------*/
//标识当前的Dep id
let uidep = 0

class Dep {
  constructor() {
    this.id = uidep++
    // 存放所有的监听watcher
    this.subs = []
  }

  //添加一个观察者对象
  addSub(Watcher) {
    this.subs.push(Watcher)
  }

  //依赖收集
  depend() {
    //Dep.target 作用只有需要的才会收集依赖
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  // 调用依赖收集的Watcher更新
  notify() {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

Dep.target = null
const targetStack = []

// 为Dep.target 赋值
function pushTarget(Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = Watcher
}

function popTarget() {
  Dep.target = targetStack.pop()
}

/*----------------------------------------Watcher------------------------------------*/
//去重 防止重复收集
let uid = 0

class Watcher {
  constructor(vm, expOrFn, cb, options) {
    //传进来的对象 例如Vue
    this.vm = vm
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
    } else {
      this.deep = this.user = false
    }
    //在Vue中cb是更新视图的核心，调用diff并更新视图的过程
    this.cb = cb
    this.id = ++uid
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    if (typeof expOrFn === 'function') {
      //data依赖收集走此处
      this.getter = expOrFn
    } else {
      //watch依赖走此处
      this.getter = this.parsePath(expOrFn)
    }
    //设置Dep.target的值，依赖收集时的watcher对象
    this.value = this.get()
  }

  get() {
    //设置Dep.target值，用以依赖收集
    pushTarget(this)
    const vm = this.vm
    //此处会进行依赖收集 会调用data数据的 get
    let value = this.getter.call(vm, vm)
    //深度监听
    if (this.deep) {
      traverse(value)
    }
    popTarget()
    return value
  }

  //添加依赖
  addDep(dep) {
    //去重
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        //收集watcher 每次data数据 set
        //时会遍历收集的watcher依赖进行相应视图更新或执行watch监听函数等操作
        dep.addSub(this)
      }
    }
  }

  //更新
  update() {
    this.run()
  }

  //更新视图
  run() {
    const value = this.get()
    const oldValue = this.value
    this.value = value
    if (this.user) {
      //watch 监听走此处
      this.cb.call(this.vm, value, oldValue)
    } else {
      //data 监听走此处
      //这里只做简单的console.log 处理，在Vue中会调用diff过程从而更新视图
      console.log(`这里会去执行Vue的diff相关方法，进而更新数据`)
    }

  }

  // 此方法获得每个watch中key在data中对应的value值
  //使用split('.')是为了得到 像'a.b.c' 这样的监听值
  parsePath(path) {
    const bailRE = /[^w.$]/
    if (bailRE.test(path)) return
    const segments = path.split('.')
    return function (obj) {
      for (let i = 0; i < segments.length; i++) {
        if (!obj) return
        //此处为了兼容我的代码做了一点修改
        //此处使用新获得的值覆盖传入的值 因此能够处理 'a.b.c'这样的监听方式
        if (i == 0) {
          obj = obj.data[segments[i]]
        } else {
          obj = obj[segments[i]]
        }
      }
      return obj
    }
  }
}

//深度监听相关代码 为了兼容有一小点改动
const seenObjects = new Set()

function traverse(val) {
  seenObjects.clear()
  _traverse(val, seenObjects)
}

function _traverse(val, seen) {
  let i, keys
  const isA = Array.isArray(val)
  if (!isA && Object.prototype.toString.call(val) != '[object Object]') return;
  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  if (isA) {
    i = val.length
    while (i--) {
      if (i == '__ob__') return;
      _traverse(val[i], seen)
    }
  } else {
    keys = Object.keys(val)
    i = keys.length
    while (i--) {
      if (keys[i] == '__ob__') return;
      _traverse(val[keys[i]], seen)
    }
  }
}

/*----------------------------------------Observer------------------------------------*/
class Observer {
  constructor(value) {
    this.value = value
    // 增加dep属性（处理数组时可以直接调用）
    this.dep = new Dep()
    //将Observer实例绑定到data的__ob__属性上面去，后期如果oberve时直接使用，不需要从新Observer,
    //处理数组是也可直接获取Observer对象
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      //这里只测试对象
    } else {
      //处理对象
      this.walk(value)
    }
  }

  walk(obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      //此处我做了拦截处理，防止死循环，Vue中在oberve函数中进行的处理
      if (keys[i] == '__ob__') return;
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }
}

//数据重复Observer
function observe(value) {
  if (typeof(value) != 'object') return;
  let ob = new Observer(value)
  return ob;
}

// 把对象属性改为getter/setter，并收集依赖
function defineReactive(obj, key, val) {
  const dep = new Dep()
  //处理children
  let childOb = observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log(`调用get获取值，值为${val}`)
      const value = val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
        }
      }
      return value
    },
    set: function reactiveSetter(newVal) {
      console.log(`调用了set，值为${newVal}`)
      const value = val
      val = newVal
      //对新值进行observe
      childOb = observe(newVal)
      //通知dep调用,循环调用手机的Watcher依赖，进行视图的更新
      dep.notify()
    }
  })
}

//辅助方法
function def(obj, key, val) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: true,
    writable: true,
    configurable: true
  })
}

/*----------------------------------------初始化watch------------------------------------*/
class stateWatch {
  constructor(vm, watch) {
    this.vm = vm
    //初始化watch
    this.initWatch(vm, watch)
  }

  initWatch(vm, watch) {
    //遍历watch对象
    for (const key in watch) {
      const handler = watch[key]
      //数组则遍历进行createWatcher
      if (Array.isArray(handler)) {
        for (let i = 0; i < handler.length; i++) {
          this.createWatcher(vm, key, handler[i])
        }
      } else {
        this.createWatcher(vm, key, handler)
      }
    }
  }

  createWatcher(vm, key, handler) {
    let options
    if (Object.prototype.toString.call(handler) == '[object Object]') {
      //处理对象
      options = handler
      handler = handler.handler
    }
    if (typeof handler === 'string') {
      handler = vm[handler]
    }
    vm.$watch(key, handler, options)
  }
}

/*----------------------------------------Vue------------------------------------*/
function Vue() {
}

Vue.prototype.$watch = function (expOrFn, cb, options) {
  const vm = this
  options = options || {}
  //此参数用于给data从新赋值时走watch的监听函数
  options.user = true
  //watch依赖收集的Watcher
  const watcher = new Watcher(vm, expOrFn, cb, options)
  //immediate=true时 会调用一次 watcher.run 方法，因此会调用一次watch中相关key的函数
  if (options.immediate) {
    cb.call(vm, watcher.value)
  }
  //返回一个取消监听的函数
  return function unwatchFn() {
    watcher.teardown()
  }
}

