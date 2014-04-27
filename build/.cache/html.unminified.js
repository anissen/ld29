(function () { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw "EReg::matched";
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,__class__: EReg
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.remove = function(a,obj) {
	var i = a.indexOf(obj);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
Lambda.__name__ = true;
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
};
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
};
var IMap = function() { };
IMap.__name__ = true;
Math.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
var Std = function() { };
Std.__name__ = true;
Std["is"] = function(v,t) {
	return js_Boot.__instanceof(v,t);
};
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,addSub: function(s,pos,len) {
		if(len == null) this.b += HxOverrides.substr(s,pos,null); else this.b += HxOverrides.substr(s,pos,len);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var XmlType = { __ename__ : true, __constructs__ : [] };
var Xml = function() {
};
Xml.__name__ = true;
Xml.parse = function(str) {
	return haxe_xml_Parser.parse(str);
};
Xml.createElement = function(name) {
	var r = new Xml();
	r.nodeType = Xml.Element;
	r._children = new Array();
	r._attributes = new haxe_ds_StringMap();
	r.set_nodeName(name);
	return r;
};
Xml.createPCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.PCData;
	r.set_nodeValue(data);
	return r;
};
Xml.createCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.CData;
	r.set_nodeValue(data);
	return r;
};
Xml.createComment = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Comment;
	r.set_nodeValue(data);
	return r;
};
Xml.createDocType = function(data) {
	var r = new Xml();
	r.nodeType = Xml.DocType;
	r.set_nodeValue(data);
	return r;
};
Xml.createProcessingInstruction = function(data) {
	var r = new Xml();
	r.nodeType = Xml.ProcessingInstruction;
	r.set_nodeValue(data);
	return r;
};
Xml.createDocument = function() {
	var r = new Xml();
	r.nodeType = Xml.Document;
	r._children = new Array();
	return r;
};
Xml.prototype = {
	get_nodeName: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName;
	}
	,set_nodeName: function(n) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName = n;
	}
	,set_nodeValue: function(v) {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue = v;
	}
	,get: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.get(att);
	}
	,set: function(att,value) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.set(att,value);
	}
	,exists: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.exists(att);
	}
	,elements: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				if(this.x[k].nodeType == Xml.Element) break;
				k += 1;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k1 = this.cur;
			var l1 = this.x.length;
			while(k1 < l1) {
				var n = this.x[k1];
				k1 += 1;
				if(n.nodeType == Xml.Element) {
					this.cur = k1;
					return n;
				}
			}
			return null;
		}};
	}
	,firstElement: function() {
		if(this._children == null) throw "bad nodetype";
		var cur = 0;
		var l = this._children.length;
		while(cur < l) {
			var n = this._children[cur];
			if(n.nodeType == Xml.Element) return n;
			cur++;
		}
		return null;
	}
	,addChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.push(x);
	}
	,__class__: Xml
};
var flambe_util_Disposable = function() { };
flambe_util_Disposable.__name__ = true;
flambe_util_Disposable.prototype = {
	__class__: flambe_util_Disposable
};
var flambe_Component = function() { };
flambe_Component.__name__ = true;
flambe_Component.__interfaces__ = [flambe_util_Disposable];
flambe_Component.prototype = {
	onAdded: function() {
	}
	,onRemoved: function() {
	}
	,onUpdate: function(dt) {
	}
	,dispose: function() {
		if(this.owner != null) this.owner.remove(this);
	}
	,get_name: function() {
		return null;
	}
	,init: function(owner,next) {
		this.owner = owner;
		this.next = next;
	}
	,__class__: flambe_Component
};
var flambe_Entity = function() {
	this.firstComponent = null;
	this.next = null;
	this.firstChild = null;
	this.parent = null;
	this._compMap = { };
};
flambe_Entity.__name__ = true;
flambe_Entity.__interfaces__ = [flambe_util_Disposable];
flambe_Entity.prototype = {
	add: function(component) {
		if(component.owner != null) component.owner.remove(component);
		var name = component.get_name();
		var prev = this._compMap[name];
		if(prev != null) this.remove(prev);
		this._compMap[name] = component;
		var tail = null;
		var p = this.firstComponent;
		while(p != null) {
			tail = p;
			p = p.next;
		}
		if(tail != null) tail.next = component; else this.firstComponent = component;
		component.init(this,null);
		component.onAdded();
		return this;
	}
	,remove: function(component) {
		var prev = null;
		var p = this.firstComponent;
		while(p != null) {
			var next = p.next;
			if(p == component) {
				if(prev == null) this.firstComponent = next; else prev.init(this,next);
				delete(this._compMap[p.get_name()]);
				p.onRemoved();
				p.init(null,null);
				return true;
			}
			prev = p;
			p = next;
		}
		return false;
	}
	,addChild: function(entity,append) {
		if(append == null) append = true;
		if(entity.parent != null) entity.parent.removeChild(entity);
		entity.parent = this;
		if(append) {
			var tail = null;
			var p = this.firstChild;
			while(p != null) {
				tail = p;
				p = p.next;
			}
			if(tail != null) tail.next = entity; else this.firstChild = entity;
		} else {
			entity.next = this.firstChild;
			this.firstChild = entity;
		}
		return this;
	}
	,removeChild: function(entity) {
		var prev = null;
		var p = this.firstChild;
		while(p != null) {
			var next = p.next;
			if(p == entity) {
				if(prev == null) this.firstChild = next; else prev.next = next;
				p.parent = null;
				p.next = null;
				return;
			}
			prev = p;
			p = next;
		}
	}
	,disposeChildren: function() {
		while(this.firstChild != null) this.firstChild.dispose();
	}
	,dispose: function() {
		if(this.parent != null) this.parent.removeChild(this);
		while(this.firstComponent != null) this.firstComponent.dispose();
		this.disposeChildren();
	}
	,__class__: flambe_Entity
};
var flambe_util_PackageLog = function() { };
flambe_util_PackageLog.__name__ = true;
var flambe_platform_Platform = function() { };
flambe_platform_Platform.__name__ = true;
flambe_platform_Platform.prototype = {
	__class__: flambe_platform_Platform
};
var flambe_platform_html_HtmlPlatform = function() {
};
flambe_platform_html_HtmlPlatform.__name__ = true;
flambe_platform_html_HtmlPlatform.__interfaces__ = [flambe_platform_Platform];
flambe_platform_html_HtmlPlatform.prototype = {
	init: function() {
		var _g = this;
		flambe_platform_html_HtmlUtil.fixAndroidMath();
		var canvas = null;
		try {
			canvas = window.flambe.canvas;
		} catch( error ) {
		}
		canvas.setAttribute("tabindex","0");
		canvas.style.outlineStyle = "none";
		canvas.style.webkitTapHighlightColor = "transparent";
		canvas.setAttribute("moz-opaque","true");
		this._stage = new flambe_platform_html_HtmlStage(canvas);
		this._pointer = new flambe_platform_BasicPointer();
		this._mouse = new flambe_platform_html_HtmlMouse(this._pointer,canvas);
		this._renderer = this.createRenderer(canvas);
		this.mainLoop = new flambe_platform_MainLoop();
		this.musicPlaying = false;
		this._canvas = canvas;
		this._container = canvas.parentElement;
		this._container.style.overflow = "hidden";
		this._container.style.position = "relative";
		this._container.style.msTouchAction = "none";
		var lastTouchTime = 0;
		var onMouse = function(event) {
			if(event.timeStamp - lastTouchTime < 1000) return;
			var bounds = canvas.getBoundingClientRect();
			var x = _g.getX(event,bounds);
			var y = _g.getY(event,bounds);
			var _g1 = event.type;
			switch(_g1) {
			case "mousedown":
				if(event.target == canvas) {
					event.preventDefault();
					_g._mouse.submitDown(x,y,event.button);
					canvas.focus();
				}
				break;
			case "mousemove":
				_g._mouse.submitMove(x,y);
				break;
			case "mouseup":
				_g._mouse.submitUp(x,y,event.button);
				break;
			case "mousewheel":case "DOMMouseScroll":
				var velocity;
				if(event.type == "mousewheel") velocity = event.wheelDelta / 40; else velocity = -event.detail;
				if(_g._mouse.submitScroll(x,y,velocity)) event.preventDefault();
				break;
			}
		};
		window.addEventListener("mousedown",onMouse,false);
		window.addEventListener("mousemove",onMouse,false);
		window.addEventListener("mouseup",onMouse,false);
		canvas.addEventListener("mousewheel",onMouse,false);
		canvas.addEventListener("DOMMouseScroll",onMouse,false);
		canvas.addEventListener("contextmenu",function(event1) {
			event1.preventDefault();
		},false);
		var standardTouch = typeof(window.ontouchstart) != "undefined";
		var msTouch = 'msMaxTouchPoints' in window.navigator && (window.navigator.msMaxTouchPoints > 1);
		if(standardTouch || msTouch) {
			var basicTouch = new flambe_platform_BasicTouch(this._pointer,standardTouch?4:window.navigator.msMaxTouchPoints);
			this._touch = basicTouch;
			var onTouch = function(event2) {
				var changedTouches;
				if(standardTouch) changedTouches = event2.changedTouches; else changedTouches = [event2];
				var bounds1 = event2.target.getBoundingClientRect();
				lastTouchTime = event2.timeStamp;
				var _g2 = event2.type;
				switch(_g2) {
				case "touchstart":case "MSPointerDown":case "pointerdown":
					event2.preventDefault();
					if(flambe_platform_html_HtmlUtil.SHOULD_HIDE_MOBILE_BROWSER) flambe_platform_html_HtmlUtil.hideMobileBrowser();
					var _g11 = 0;
					while(_g11 < changedTouches.length) {
						var touch = changedTouches[_g11];
						++_g11;
						var x1 = _g.getX(touch,bounds1);
						var y1 = _g.getY(touch,bounds1);
						var id;
						id = (standardTouch?touch.identifier:touch.pointerId) | 0;
						basicTouch.submitDown(id,x1,y1);
					}
					break;
				case "touchmove":case "MSPointerMove":case "pointermove":
					event2.preventDefault();
					var _g12 = 0;
					while(_g12 < changedTouches.length) {
						var touch1 = changedTouches[_g12];
						++_g12;
						var x2 = _g.getX(touch1,bounds1);
						var y2 = _g.getY(touch1,bounds1);
						var id1;
						id1 = (standardTouch?touch1.identifier:touch1.pointerId) | 0;
						basicTouch.submitMove(id1,x2,y2);
					}
					break;
				case "touchend":case "touchcancel":case "MSPointerUp":case "pointerup":
					var _g13 = 0;
					while(_g13 < changedTouches.length) {
						var touch2 = changedTouches[_g13];
						++_g13;
						var x3 = _g.getX(touch2,bounds1);
						var y3 = _g.getY(touch2,bounds1);
						var id2;
						id2 = (standardTouch?touch2.identifier:touch2.pointerId) | 0;
						basicTouch.submitUp(id2,x3,y3);
					}
					break;
				}
			};
			if(standardTouch) {
				canvas.addEventListener("touchstart",onTouch,false);
				canvas.addEventListener("touchmove",onTouch,false);
				canvas.addEventListener("touchend",onTouch,false);
				canvas.addEventListener("touchcancel",onTouch,false);
			} else {
				canvas.addEventListener("MSPointerDown",onTouch,false);
				canvas.addEventListener("MSPointerMove",onTouch,false);
				canvas.addEventListener("MSPointerUp",onTouch,false);
			}
		} else this._touch = new flambe_platform_DummyTouch();
		var oldErrorHandler = window.onerror;
		window.onerror = function(message,url,line) {
			flambe_System.uncaughtError.emit(message);
			if(oldErrorHandler != null) return oldErrorHandler(message,url,line); else return false;
		};
		var hiddenApi = flambe_platform_html_HtmlUtil.loadExtension("hidden",window.document);
		if(hiddenApi.value != null) {
			var onVisibilityChanged = function(_) {
				flambe_System.hidden.set__(Reflect.field(window.document,hiddenApi.field));
			};
			onVisibilityChanged(null);
			window.document.addEventListener(hiddenApi.prefix + "visibilitychange",onVisibilityChanged,false);
		} else {
			var onPageTransitionChange = function(event3) {
				flambe_System.hidden.set__(event3.type == "pagehide");
			};
			window.addEventListener("pageshow",onPageTransitionChange,false);
			window.addEventListener("pagehide",onPageTransitionChange,false);
		}
		flambe_System.hidden.get_changed().connect(function(hidden,_1) {
			if(!hidden) _g._skipFrame = true;
		});
		this._skipFrame = false;
		this._lastUpdate = Date.now();
		var requestAnimationFrame = flambe_platform_html_HtmlUtil.loadExtension("requestAnimationFrame").value;
		if(requestAnimationFrame != null) {
			var performance = window.performance;
			var hasPerfNow = performance != null && flambe_platform_html_HtmlUtil.polyfill("now",performance);
			if(hasPerfNow) this._lastUpdate = performance.now(); else null;
			var updateFrame = null;
			updateFrame = function(now) {
				_g.update(hasPerfNow?performance.now():now);
				requestAnimationFrame(updateFrame,canvas);
			};
			requestAnimationFrame(updateFrame,canvas);
		} else window.setInterval(function() {
			_g.update(Date.now());
		},16);
		flambe_Log.info("Initialized HTML platform",["renderer",this._renderer.get_type()]);
	}
	,loadAssetPack: function(manifest) {
		return new flambe_platform_html_HtmlAssetPackLoader(this,manifest).promise;
	}
	,getStage: function() {
		return this._stage;
	}
	,getLocale: function() {
		var locale = window.navigator.language;
		if(locale == null) locale = window.navigator.userLanguage;
		return locale;
	}
	,update: function(now) {
		var dt = (now - this._lastUpdate) / 1000;
		this._lastUpdate = now;
		if(flambe_System.hidden._value) return;
		if(this._skipFrame) {
			this._skipFrame = false;
			return;
		}
		this.mainLoop.update(dt);
		this.mainLoop.render(this._renderer);
	}
	,getPointer: function() {
		return this._pointer;
	}
	,getRenderer: function() {
		return this._renderer;
	}
	,getX: function(event,bounds) {
		return (event.clientX - bounds.left) * this._stage.get_width() / bounds.width;
	}
	,getY: function(event,bounds) {
		return (event.clientY - bounds.top) * this._stage.get_height() / bounds.height;
	}
	,createRenderer: function(canvas) {
		try {
			var gl = js_html__$CanvasElement_CanvasUtil.getContextWebGL(canvas,{ alpha : false, depth : false, failIfMajorPerformanceCaveat : true});
			if(gl != null) {
				if(flambe_platform_html_HtmlUtil.detectSlowDriver(gl)) null; else return new flambe_platform_html_WebGLRenderer(this._stage,gl);
			}
		} catch( _ ) {
		}
		return new flambe_platform_html_CanvasRenderer(canvas);
		return null;
	}
	,__class__: flambe_platform_html_HtmlPlatform
};
var flambe_util_Value = function(value,listener) {
	this._value = value;
	if(listener != null) this._changed = new flambe_util_Signal2(listener); else this._changed = null;
};
flambe_util_Value.__name__ = true;
flambe_util_Value.prototype = {
	watch: function(listener) {
		listener(this._value,this._value);
		return this.get_changed().connect(listener);
	}
	,set__: function(newValue) {
		var oldValue = this._value;
		if(newValue != oldValue) {
			this._value = newValue;
			if(this._changed != null) this._changed.emit(newValue,oldValue);
		}
		return newValue;
	}
	,get_changed: function() {
		if(this._changed == null) this._changed = new flambe_util_Signal2();
		return this._changed;
	}
	,__class__: flambe_util_Value
};
var flambe_util_SignalConnection = function(signal,listener) {
	this._next = null;
	this._signal = signal;
	this._listener = listener;
	this.stayInList = true;
};
flambe_util_SignalConnection.__name__ = true;
flambe_util_SignalConnection.__interfaces__ = [flambe_util_Disposable];
flambe_util_SignalConnection.prototype = {
	once: function() {
		this.stayInList = false;
		return this;
	}
	,dispose: function() {
		if(this._signal != null) {
			this._signal.disconnect(this);
			this._signal = null;
		}
	}
	,__class__: flambe_util_SignalConnection
};
var flambe_util_SignalBase = function(listener) {
	if(listener != null) this._head = new flambe_util_SignalConnection(this,listener); else this._head = null;
	this._deferredTasks = null;
};
flambe_util_SignalBase.__name__ = true;
flambe_util_SignalBase.prototype = {
	connectImpl: function(listener,prioritize) {
		var _g = this;
		var conn = new flambe_util_SignalConnection(this,listener);
		if(this._head == flambe_util_SignalBase.DISPATCHING_SENTINEL) this.defer(function() {
			_g.listAdd(conn,prioritize);
		}); else this.listAdd(conn,prioritize);
		return conn;
	}
	,disconnect: function(conn) {
		var _g = this;
		if(this._head == flambe_util_SignalBase.DISPATCHING_SENTINEL) this.defer(function() {
			_g.listRemove(conn);
		}); else this.listRemove(conn);
	}
	,defer: function(fn) {
		var tail = null;
		var p = this._deferredTasks;
		while(p != null) {
			tail = p;
			p = p.next;
		}
		var task = new flambe_util__$SignalBase_Task(fn);
		if(tail != null) tail.next = task; else this._deferredTasks = task;
	}
	,willEmit: function() {
		var snapshot = this._head;
		this._head = flambe_util_SignalBase.DISPATCHING_SENTINEL;
		return snapshot;
	}
	,didEmit: function(head) {
		this._head = head;
		var snapshot = this._deferredTasks;
		this._deferredTasks = null;
		while(snapshot != null) {
			snapshot.fn();
			snapshot = snapshot.next;
		}
	}
	,listAdd: function(conn,prioritize) {
		if(prioritize) {
			conn._next = this._head;
			this._head = conn;
		} else {
			var tail = null;
			var p = this._head;
			while(p != null) {
				tail = p;
				p = p._next;
			}
			if(tail != null) tail._next = conn; else this._head = conn;
		}
	}
	,listRemove: function(conn) {
		var prev = null;
		var p = this._head;
		while(p != null) {
			if(p == conn) {
				var next = p._next;
				if(prev == null) this._head = next; else prev._next = next;
				return;
			}
			prev = p;
			p = p._next;
		}
	}
	,__class__: flambe_util_SignalBase
};
var flambe_util_Signal2 = function(listener) {
	flambe_util_SignalBase.call(this,listener);
};
flambe_util_Signal2.__name__ = true;
flambe_util_Signal2.__super__ = flambe_util_SignalBase;
flambe_util_Signal2.prototype = $extend(flambe_util_SignalBase.prototype,{
	connect: function(listener,prioritize) {
		if(prioritize == null) prioritize = false;
		return this.connectImpl(listener,prioritize);
	}
	,emit: function(arg1,arg2) {
		var _g = this;
		if(this._head == flambe_util_SignalBase.DISPATCHING_SENTINEL) this.defer(function() {
			_g.emitImpl(arg1,arg2);
		}); else this.emitImpl(arg1,arg2);
	}
	,emitImpl: function(arg1,arg2) {
		var head = this.willEmit();
		var p = head;
		while(p != null) {
			p._listener(arg1,arg2);
			if(!p.stayInList) p.dispose();
			p = p._next;
		}
		this.didEmit(head);
	}
	,__class__: flambe_util_Signal2
});
var flambe_util_Signal1 = function(listener) {
	flambe_util_SignalBase.call(this,listener);
};
flambe_util_Signal1.__name__ = true;
flambe_util_Signal1.__super__ = flambe_util_SignalBase;
flambe_util_Signal1.prototype = $extend(flambe_util_SignalBase.prototype,{
	connect: function(listener,prioritize) {
		if(prioritize == null) prioritize = false;
		return this.connectImpl(listener,prioritize);
	}
	,emit: function(arg1) {
		var _g = this;
		if(this._head == flambe_util_SignalBase.DISPATCHING_SENTINEL) this.defer(function() {
			_g.emitImpl(arg1);
		}); else this.emitImpl(arg1);
	}
	,emitImpl: function(arg1) {
		var head = this.willEmit();
		var p = head;
		while(p != null) {
			p._listener(arg1);
			if(!p.stayInList) p.dispose();
			p = p._next;
		}
		this.didEmit(head);
	}
	,__class__: flambe_util_Signal1
});
var flambe_animation_AnimatedFloat = function(value,listener) {
	this._behavior = null;
	flambe_util_Value.call(this,value,listener);
};
flambe_animation_AnimatedFloat.__name__ = true;
flambe_animation_AnimatedFloat.__super__ = flambe_util_Value;
flambe_animation_AnimatedFloat.prototype = $extend(flambe_util_Value.prototype,{
	set__: function(value) {
		this._behavior = null;
		return flambe_util_Value.prototype.set__.call(this,value);
	}
	,update: function(dt) {
		if(this._behavior != null) {
			flambe_util_Value.prototype.set__.call(this,this._behavior.update(dt));
			if(this._behavior.isComplete()) this._behavior = null;
		}
	}
	,animate: function(from,to,seconds,easing) {
		this.set__(from);
		this.animateTo(to,seconds,easing);
	}
	,animateTo: function(to,seconds,easing) {
		this.set_behavior(new flambe_animation_Tween(this._value,to,seconds,easing));
	}
	,set_behavior: function(behavior) {
		this._behavior = behavior;
		this.update(0);
		return behavior;
	}
	,__class__: flambe_animation_AnimatedFloat
});
var flambe_System = function() { };
flambe_System.__name__ = true;
flambe_System.init = function() {
	if(!flambe_System._calledInit) {
		flambe_System._platform.init();
		flambe_System._calledInit = true;
	}
};
flambe_System.loadAssetPack = function(manifest) {
	return flambe_System._platform.loadAssetPack(manifest);
};
var flambe_Log = function() { };
flambe_Log.__name__ = true;
flambe_Log.info = function(text,args) {
	null;
};
flambe_Log.__super__ = flambe_util_PackageLog;
flambe_Log.prototype = $extend(flambe_util_PackageLog.prototype,{
	__class__: flambe_Log
});
var flambe_SpeedAdjuster = function(scale) {
	if(scale == null) scale = 1;
	this._realDt = 0;
	this.scale = new flambe_animation_AnimatedFloat(scale);
};
flambe_SpeedAdjuster.__name__ = true;
flambe_SpeedAdjuster.__super__ = flambe_Component;
flambe_SpeedAdjuster.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "SpeedAdjuster_2";
	}
	,onUpdate: function(dt) {
		if(this._realDt > 0) {
			dt = this._realDt;
			this._realDt = 0;
		}
		this.scale.update(dt);
	}
	,__class__: flambe_SpeedAdjuster
});
var flambe_animation_Behavior = function() { };
flambe_animation_Behavior.__name__ = true;
flambe_animation_Behavior.prototype = {
	__class__: flambe_animation_Behavior
};
var flambe_animation_Ease = function() { };
flambe_animation_Ease.__name__ = true;
flambe_animation_Ease.linear = function(t) {
	return t;
};
flambe_animation_Ease.quadOut = function(t) {
	return t * (2 - t);
};
flambe_animation_Ease.bounceOut = function(t) {
	if(t < 0.363636363636363646) return 7.5625 * t * t;
	if(t < 0.727272727272727293) return 7.5625 * (t - 0.545454545454545414) * (t - 0.545454545454545414) + .75;
	if(t < 0.909090909090909061) return 7.5625 * (t - 0.818181818181818232) * (t - 0.818181818181818232) + .9375;
	return 7.5625 * (t - 0.954545454545454586) * (t - 0.954545454545454586) + .984375;
};
flambe_animation_Ease.backOut = function(t) {
	return 1 - --t * t * (-2.70158 * t - 1.70158);
};
flambe_animation_Ease.elasticOut = function(t) {
	return 1 * Math.pow(2,-10 * t) * Math.sin((t - 0.0636619772367581355 * Math.asin(1 / 1)) * 6.28318530717958623 / 0.4) + 1;
};
var flambe_animation_Jitter = function(base,strength) {
	this.base = base;
	this.strength = strength;
};
flambe_animation_Jitter.__name__ = true;
flambe_animation_Jitter.__interfaces__ = [flambe_animation_Behavior];
flambe_animation_Jitter.prototype = {
	update: function(dt) {
		return this.base + 2 * Math.random() * this.strength - this.strength;
	}
	,isComplete: function() {
		return false;
	}
	,__class__: flambe_animation_Jitter
};
var flambe_animation_Tween = function(from,to,seconds,easing) {
	this._from = from;
	this._to = to;
	this._duration = seconds;
	this.elapsed = 0;
	if(easing != null) this._easing = easing; else this._easing = flambe_animation_Ease.linear;
};
flambe_animation_Tween.__name__ = true;
flambe_animation_Tween.__interfaces__ = [flambe_animation_Behavior];
flambe_animation_Tween.prototype = {
	update: function(dt) {
		this.elapsed += dt;
		if(this.elapsed >= this._duration) return this._to; else return this._from + (this._to - this._from) * this._easing(this.elapsed / this._duration);
	}
	,isComplete: function() {
		return this.elapsed >= this._duration;
	}
	,__class__: flambe_animation_Tween
};
var flambe_asset_Asset = function() { };
flambe_asset_Asset.__name__ = true;
flambe_asset_Asset.__interfaces__ = [flambe_util_Disposable];
flambe_asset_Asset.prototype = {
	__class__: flambe_asset_Asset
};
var flambe_asset_AssetFormat = { __ename__ : true, __constructs__ : ["WEBP","JXR","PNG","JPG","GIF","DDS","PVR","PKM","MP3","M4A","OPUS","OGG","WAV","Data"] };
flambe_asset_AssetFormat.WEBP = ["WEBP",0];
flambe_asset_AssetFormat.WEBP.toString = $estr;
flambe_asset_AssetFormat.WEBP.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.JXR = ["JXR",1];
flambe_asset_AssetFormat.JXR.toString = $estr;
flambe_asset_AssetFormat.JXR.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.PNG = ["PNG",2];
flambe_asset_AssetFormat.PNG.toString = $estr;
flambe_asset_AssetFormat.PNG.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.JPG = ["JPG",3];
flambe_asset_AssetFormat.JPG.toString = $estr;
flambe_asset_AssetFormat.JPG.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.GIF = ["GIF",4];
flambe_asset_AssetFormat.GIF.toString = $estr;
flambe_asset_AssetFormat.GIF.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.DDS = ["DDS",5];
flambe_asset_AssetFormat.DDS.toString = $estr;
flambe_asset_AssetFormat.DDS.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.PVR = ["PVR",6];
flambe_asset_AssetFormat.PVR.toString = $estr;
flambe_asset_AssetFormat.PVR.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.PKM = ["PKM",7];
flambe_asset_AssetFormat.PKM.toString = $estr;
flambe_asset_AssetFormat.PKM.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.MP3 = ["MP3",8];
flambe_asset_AssetFormat.MP3.toString = $estr;
flambe_asset_AssetFormat.MP3.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.M4A = ["M4A",9];
flambe_asset_AssetFormat.M4A.toString = $estr;
flambe_asset_AssetFormat.M4A.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.OPUS = ["OPUS",10];
flambe_asset_AssetFormat.OPUS.toString = $estr;
flambe_asset_AssetFormat.OPUS.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.OGG = ["OGG",11];
flambe_asset_AssetFormat.OGG.toString = $estr;
flambe_asset_AssetFormat.OGG.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.WAV = ["WAV",12];
flambe_asset_AssetFormat.WAV.toString = $estr;
flambe_asset_AssetFormat.WAV.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.Data = ["Data",13];
flambe_asset_AssetFormat.Data.toString = $estr;
flambe_asset_AssetFormat.Data.__enum__ = flambe_asset_AssetFormat;
var flambe_asset_AssetEntry = function(name,url,format,bytes) {
	this.name = name;
	this.url = url;
	this.format = format;
	this.bytes = bytes;
};
flambe_asset_AssetEntry.__name__ = true;
flambe_asset_AssetEntry.prototype = {
	__class__: flambe_asset_AssetEntry
};
var flambe_asset_AssetPack = function() { };
flambe_asset_AssetPack.__name__ = true;
flambe_asset_AssetPack.__interfaces__ = [flambe_util_Disposable];
flambe_asset_AssetPack.prototype = {
	__class__: flambe_asset_AssetPack
};
var flambe_asset_File = function() { };
flambe_asset_File.__name__ = true;
flambe_asset_File.__interfaces__ = [flambe_asset_Asset];
flambe_asset_File.prototype = {
	__class__: flambe_asset_File
};
var flambe_asset_Manifest = function() {
	this._remoteBase = null;
	this._localBase = null;
	this._entries = [];
};
flambe_asset_Manifest.__name__ = true;
flambe_asset_Manifest.fromAssets = function(packName,required) {
	if(required == null) required = true;
	var packData = Reflect.field(haxe_rtti_Meta.getType(flambe_asset_Manifest).assets[0],packName);
	if(packData == null) {
		if(required) throw flambe_util_Strings.withFields("Missing asset pack",["name",packName]);
		return null;
	}
	var manifest = new flambe_asset_Manifest();
	manifest.set_localBase("assets");
	var _g = 0;
	while(_g < packData.length) {
		var asset = packData[_g];
		++_g;
		var name = asset.name;
		var path = packName + "/" + name + "?v=" + Std.string(asset.md5);
		var format = flambe_asset_Manifest.inferFormat(name);
		if(format != flambe_asset_AssetFormat.Data) name = flambe_util_Strings.removeFileExtension(name);
		manifest.add(name,path,asset.bytes,format);
	}
	return manifest;
};
flambe_asset_Manifest.fromAssetsLocalized = function(packName,locale,required) {
	if(required == null) required = true;
	if(locale == null) locale = flambe_System._platform.getLocale();
	if(locale != null) {
		var parts = locale.split("-");
		while(parts.length > 0) {
			var manifest = flambe_asset_Manifest.fromAssets(packName + "_" + parts.join("-"),false);
			if(manifest != null) return manifest;
			parts.pop();
		}
	}
	return flambe_asset_Manifest.fromAssets(packName,required);
};
flambe_asset_Manifest.inferFormat = function(url) {
	var extension = flambe_util_Strings.getUrlExtension(url);
	if(extension != null) {
		var _g = extension.toLowerCase();
		switch(_g) {
		case "gif":
			return flambe_asset_AssetFormat.GIF;
		case "jpg":case "jpeg":
			return flambe_asset_AssetFormat.JPG;
		case "jxr":case "wdp":
			return flambe_asset_AssetFormat.JXR;
		case "png":
			return flambe_asset_AssetFormat.PNG;
		case "webp":
			return flambe_asset_AssetFormat.WEBP;
		case "dds":
			return flambe_asset_AssetFormat.DDS;
		case "pvr":
			return flambe_asset_AssetFormat.PVR;
		case "pkm":
			return flambe_asset_AssetFormat.PKM;
		case "m4a":
			return flambe_asset_AssetFormat.M4A;
		case "mp3":
			return flambe_asset_AssetFormat.MP3;
		case "ogg":
			return flambe_asset_AssetFormat.OGG;
		case "opus":
			return flambe_asset_AssetFormat.OPUS;
		case "wav":
			return flambe_asset_AssetFormat.WAV;
		}
	} else null;
	return flambe_asset_AssetFormat.Data;
};
flambe_asset_Manifest.prototype = {
	add: function(name,url,bytes,format) {
		if(bytes == null) bytes = 0;
		if(format == null) format = flambe_asset_Manifest.inferFormat(url);
		var entry = new flambe_asset_AssetEntry(name,url,format,bytes);
		this._entries.push(entry);
		return entry;
	}
	,iterator: function() {
		return HxOverrides.iter(this._entries);
	}
	,getFullURL: function(entry) {
		var basePath;
		if(this.get_remoteBase() != null && flambe_asset_Manifest._supportsCrossOrigin) basePath = this.get_remoteBase(); else basePath = this.get_localBase();
		if(basePath != null) return flambe_util_Strings.joinPath(basePath,entry.url); else return entry.url;
	}
	,get_localBase: function() {
		return this._localBase;
	}
	,set_localBase: function(localBase) {
		if(localBase != null) flambe_util_Assert.that(!StringTools.startsWith(localBase,"http://") && !StringTools.startsWith(localBase,"https://"),"localBase must be a path on the same domain, NOT starting with http(s)://",null);
		return this._localBase = localBase;
	}
	,get_remoteBase: function() {
		return this._remoteBase;
	}
	,__class__: flambe_asset_Manifest
};
var flambe_display_BlendMode = { __ename__ : true, __constructs__ : ["Normal","Add","Mask","Copy"] };
flambe_display_BlendMode.Normal = ["Normal",0];
flambe_display_BlendMode.Normal.toString = $estr;
flambe_display_BlendMode.Normal.__enum__ = flambe_display_BlendMode;
flambe_display_BlendMode.Add = ["Add",1];
flambe_display_BlendMode.Add.toString = $estr;
flambe_display_BlendMode.Add.__enum__ = flambe_display_BlendMode;
flambe_display_BlendMode.Mask = ["Mask",2];
flambe_display_BlendMode.Mask.toString = $estr;
flambe_display_BlendMode.Mask.__enum__ = flambe_display_BlendMode;
flambe_display_BlendMode.Copy = ["Copy",3];
flambe_display_BlendMode.Copy.toString = $estr;
flambe_display_BlendMode.Copy.__enum__ = flambe_display_BlendMode;
var flambe_display_EmitterType = { __ename__ : true, __constructs__ : ["Gravity","Radial"] };
flambe_display_EmitterType.Gravity = ["Gravity",0];
flambe_display_EmitterType.Gravity.toString = $estr;
flambe_display_EmitterType.Gravity.__enum__ = flambe_display_EmitterType;
flambe_display_EmitterType.Radial = ["Radial",1];
flambe_display_EmitterType.Radial.toString = $estr;
flambe_display_EmitterType.Radial.__enum__ = flambe_display_EmitterType;
var flambe_display_EmitterMold = function(pack,name) {
	var blendFuncSource = 0;
	var blendFuncDestination = 0;
	var xml = Xml.parse(pack.getFile(name + ".pex").toString());
	var $it0 = xml.firstElement().elements();
	while( $it0.hasNext() ) {
		var element = $it0.next();
		var _g = element.get_nodeName().toLowerCase();
		switch(_g) {
		case "texture":
			this.texture = pack.getTexture(flambe_util_Strings.removeFileExtension(element.get("name")));
			break;
		case "angle":
			this.angle = flambe_display_EmitterMold.getFloat(element,"value");
			break;
		case "anglevariance":
			this.angleVariance = flambe_display_EmitterMold.getFloat(element,"value");
			break;
		case "blendfuncdestination":
			blendFuncDestination = Std["int"](flambe_display_EmitterMold.getFloat(element,"value"));
			break;
		case "blendfuncsource":
			blendFuncSource = Std["int"](flambe_display_EmitterMold.getFloat(element,"value"));
			break;
		case "duration":
			this.duration = flambe_display_EmitterMold.getFloat(element,"value");
			break;
		case "emittertype":
			if(Std["int"](flambe_display_EmitterMold.getFloat(element,"value")) == 0) this.type = flambe_display_EmitterType.Gravity; else this.type = flambe_display_EmitterType.Radial;
			break;
		case "finishcolor":
			this.alphaEnd = flambe_display_EmitterMold.getFloat(element,"alpha");
			break;
		case "finishcolorvariance":
			this.alphaEndVariance = flambe_display_EmitterMold.getFloat(element,"alpha");
			break;
		case "finishparticlesize":
			this.sizeEnd = flambe_display_EmitterMold.getFloat(element,"value");
			break;
		case "finishparticlesizevariance":
			this.sizeEndVariance = flambe_display_EmitterMold.getFloat(element,"value");
			break;
		case "gravity":
			this.gravityX = flambe_display_EmitterMold.getFloat(element,"x");
			this.gravityY = flambe_display_EmitterMold.getFloat(element,"y");
			break;
		case "maxparticles":
			this.maxParticles = Std["int"](flambe_display_EmitterMold.getFloat(element,"value"));
			break;
		case "maxradius":
			this.maxRadius = flambe_display_EmitterMold.getFloat(element,"value");
			break;
		case "maxradiusvariance":
			this.maxRadiusVariance = flambe_display_EmitterMold.getFloat(element,"value");
			break;
		case "minradius":
			this.minRadius = flambe_display_EmitterMold.getFloat(element,"value");
			break;
		case "particlelifespan":
			this.lifespan = flambe_display_EmitterMold.getFloat(element,"value");
			break;
		case "particlelifespanvariance":
			this.lifespanVariance = flambe_display_EmitterMold.getFloat(element,"value");
			break;
		case "radialaccelvariance":
			this.radialAccelVariance = flambe_display_EmitterMold.getFloat(element,"value");
			break;
		case "radialacceleration":
			this.radialAccel = flambe_display_EmitterMold.getFloat(element,"value");
			break;
		case "rotatepersecond":
			this.rotatePerSecond = flambe_display_EmitterMold.getFloat(element,"value");
			break;
		case "rotatepersecondvariance":
			this.rotatePerSecondVariance = flambe_display_EmitterMold.getFloat(element,"value");
			break;
		case "rotationend":
			this.rotationEnd = flambe_display_EmitterMold.getFloat(element,"value");
			break;
		case "rotationendvariance":
			this.rotationEndVariance = flambe_display_EmitterMold.getFloat(element,"value");
			break;
		case "rotationstart":
			this.rotationStart = flambe_display_EmitterMold.getFloat(element,"value");
			break;
		case "rotationstartvariance":
			this.rotationStartVariance = flambe_display_EmitterMold.getFloat(element,"value");
			break;
		case "sourcepositionvariance":
			this.emitXVariance = flambe_display_EmitterMold.getFloat(element,"x");
			this.emitYVariance = flambe_display_EmitterMold.getFloat(element,"y");
			break;
		case "speed":
			this.speed = flambe_display_EmitterMold.getFloat(element,"value");
			break;
		case "speedvariance":
			this.speedVariance = flambe_display_EmitterMold.getFloat(element,"value");
			break;
		case "startcolor":
			this.alphaStart = flambe_display_EmitterMold.getFloat(element,"alpha");
			break;
		case "startcolorvariance":
			this.alphaStartVariance = flambe_display_EmitterMold.getFloat(element,"alpha");
			break;
		case "startparticlesize":
			this.sizeStart = flambe_display_EmitterMold.getFloat(element,"value");
			break;
		case "startparticlesizevariance":
			this.sizeStartVariance = flambe_display_EmitterMold.getFloat(element,"value");
			break;
		case "tangentialaccelvariance":
			this.tangentialAccelVariance = flambe_display_EmitterMold.getFloat(element,"value");
			break;
		case "tangentialacceleration":
			this.tangentialAccel = flambe_display_EmitterMold.getFloat(element,"value");
			break;
		}
	}
	if(this.lifespan <= 0) this.lifespan = this.duration;
	if(blendFuncSource == 1 && blendFuncDestination == 1) this.blendMode = flambe_display_BlendMode.Add; else if(blendFuncSource == 1 && blendFuncDestination == 771) this.blendMode = null; else if(blendFuncSource != 0 || blendFuncDestination != 0) null;
};
flambe_display_EmitterMold.__name__ = true;
flambe_display_EmitterMold.getFloat = function(xml,name) {
	return Std.parseFloat(xml.get(name));
};
flambe_display_EmitterMold.prototype = {
	createEmitter: function() {
		return new flambe_display_EmitterSprite(this);
	}
	,__class__: flambe_display_EmitterMold
};
var flambe_math_Point = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
};
flambe_math_Point.__name__ = true;
flambe_math_Point.prototype = {
	__class__: flambe_math_Point
};
var flambe_display_Sprite = function() {
	this.scissor = null;
	this.blendMode = null;
	var _g = this;
	this._flags = 139;
	this._localMatrix = new flambe_math_Matrix();
	var dirtyMatrix = function(_,_1) {
		_g._flags = _g._flags | 12;
	};
	this.x = new flambe_animation_AnimatedFloat(0,dirtyMatrix);
	this.y = new flambe_animation_AnimatedFloat(0,dirtyMatrix);
	this.rotation = new flambe_animation_AnimatedFloat(0,dirtyMatrix);
	this.scaleX = new flambe_animation_AnimatedFloat(1,dirtyMatrix);
	this.scaleY = new flambe_animation_AnimatedFloat(1,dirtyMatrix);
	this.anchorX = new flambe_animation_AnimatedFloat(0,dirtyMatrix);
	this.anchorY = new flambe_animation_AnimatedFloat(0,dirtyMatrix);
	this.alpha = new flambe_animation_AnimatedFloat(1);
};
flambe_display_Sprite.__name__ = true;
flambe_display_Sprite.hitTest = function(entity,x,y) {
	var sprite = entity._compMap.Sprite_0;
	if(sprite != null) {
		if(!((sprite._flags & 3) == 3)) return null;
		if(sprite.getLocalMatrix().inverseTransform(x,y,flambe_display_Sprite._scratchPoint)) {
			x = flambe_display_Sprite._scratchPoint.x;
			y = flambe_display_Sprite._scratchPoint.y;
		}
		var scissor = sprite.scissor;
		if(scissor != null && !scissor.contains(x,y)) return null;
	}
	var result = flambe_display_Sprite.hitTestBackwards(entity.firstChild,x,y);
	if(result != null) return result;
	if(sprite != null && sprite.containsLocal(x,y)) return sprite; else return null;
};
flambe_display_Sprite.getBounds = function(entity,result) {
	if(result == null) result = new flambe_math_Rectangle();
	result.set(1.79769313486231e+308,1.79769313486231e+308,-1.79769313486231e+308,-1.79769313486231e+308);
	flambe_display_Sprite.getBoundsImpl(entity,null,result);
	result.width -= result.x;
	result.height -= result.y;
	return result;
};
flambe_display_Sprite.render = function(entity,g) {
	var sprite = entity._compMap.Sprite_0;
	if(sprite != null) {
		var alpha = sprite.alpha._value;
		if(!((sprite._flags & 1) != 0) || alpha <= 0) return;
		g.save();
		if(alpha < 1) g.multiplyAlpha(alpha);
		if(sprite.blendMode != null) g.setBlendMode(sprite.blendMode);
		var matrix = sprite.getLocalMatrix();
		var m02 = matrix.m02;
		var m12 = matrix.m12;
		if((sprite._flags & 128) != 0) {
			m02 = Math.round(m02);
			m12 = Math.round(m12);
		}
		g.transform(matrix.m00,matrix.m10,matrix.m01,matrix.m11,m02,m12);
		var scissor = sprite.scissor;
		if(scissor != null) g.applyScissor(scissor.x,scissor.y,scissor.width,scissor.height);
		sprite.draw(g);
	}
	var director = entity._compMap.Director_1;
	if(director != null) {
		var scenes = director.occludedScenes;
		var _g = 0;
		while(_g < scenes.length) {
			var scene = scenes[_g];
			++_g;
			flambe_display_Sprite.render(scene,g);
		}
	}
	var p = entity.firstChild;
	while(p != null) {
		var next = p.next;
		flambe_display_Sprite.render(p,g);
		p = next;
	}
	if(sprite != null) g.restore();
};
flambe_display_Sprite.hitTestBackwards = function(entity,x,y) {
	if(entity != null) {
		var result = flambe_display_Sprite.hitTestBackwards(entity.next,x,y);
		if(result != null) return result; else return flambe_display_Sprite.hitTest(entity,x,y);
	}
	return null;
};
flambe_display_Sprite.getBoundsImpl = function(entity,matrix,result) {
	var sprite = entity._compMap.Sprite_0;
	if(sprite != null) {
		if(matrix != null) matrix = flambe_math_Matrix.multiply(matrix,sprite.getLocalMatrix()); else matrix = sprite.getLocalMatrix();
		var x1 = 0.0;
		var y1 = 0.0;
		var x2 = sprite.getNaturalWidth();
		var y2 = sprite.getNaturalHeight();
		if(x2 > x1 && y2 > y1) {
			flambe_display_Sprite.extendRect(matrix,x1,y1,result);
			flambe_display_Sprite.extendRect(matrix,x2,y1,result);
			flambe_display_Sprite.extendRect(matrix,x2,y2,result);
			flambe_display_Sprite.extendRect(matrix,x1,y2,result);
		}
	}
	var director = entity._compMap.Director_1;
	if(director != null) {
		var scenes = director.occludedScenes;
		var ii = 0;
		var ll = scenes.length;
		while(ii < ll) {
			flambe_display_Sprite.getBoundsImpl(scenes[ii],matrix,result);
			++ii;
		}
	}
	var p = entity.firstChild;
	while(p != null) {
		var next = p.next;
		flambe_display_Sprite.getBoundsImpl(p,matrix,result);
		p = next;
	}
};
flambe_display_Sprite.extendRect = function(matrix,x,y,rect) {
	var p = matrix.transform(x,y,flambe_display_Sprite._scratchPoint);
	x = p.x;
	y = p.y;
	if(x < rect.x) rect.x = x;
	if(y < rect.y) rect.y = y;
	if(x > rect.width) rect.width = x;
	if(y > rect.height) rect.height = y;
};
flambe_display_Sprite.__super__ = flambe_Component;
flambe_display_Sprite.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "Sprite_0";
	}
	,getNaturalWidth: function() {
		return 0;
	}
	,getNaturalHeight: function() {
		return 0;
	}
	,containsLocal: function(localX,localY) {
		return localX >= 0 && localX < this.getNaturalWidth() && localY >= 0 && localY < this.getNaturalHeight();
	}
	,getLocalMatrix: function() {
		if((this._flags & 4) != 0) {
			this._flags = this._flags & -5;
			this._localMatrix.compose(this.x._value,this.y._value,this.scaleX._value,this.scaleY._value,this.rotation._value * 3.141592653589793 / 180);
			this._localMatrix.translate(-this.anchorX._value,-this.anchorY._value);
		}
		return this._localMatrix;
	}
	,centerAnchor: function() {
		this.anchorX.set__(this.getNaturalWidth() / 2);
		this.anchorY.set__(this.getNaturalHeight() / 2);
		return this;
	}
	,setXY: function(x,y) {
		this.x.set__(x);
		this.y.set__(y);
		return this;
	}
	,setAlpha: function(alpha) {
		this.alpha.set__(alpha);
		return this;
	}
	,setScale: function(scale) {
		this.scaleX.set__(scale);
		this.scaleY.set__(scale);
		return this;
	}
	,disablePointer: function() {
		this.set_pointerEnabled(false);
		return this;
	}
	,disablePixelSnapping: function() {
		this.set_pixelSnapping(false);
		return this;
	}
	,onAdded: function() {
		if((this._flags & 256) != 0) this.connectHover();
	}
	,onRemoved: function() {
		if(this._hoverConnection != null) {
			this._hoverConnection.dispose();
			this._hoverConnection = null;
		}
	}
	,onUpdate: function(dt) {
		this.x.update(dt);
		this.y.update(dt);
		this.rotation.update(dt);
		this.scaleX.update(dt);
		this.scaleY.update(dt);
		this.alpha.update(dt);
		this.anchorX.update(dt);
		this.anchorY.update(dt);
	}
	,draw: function(g) {
	}
	,getParentSprite: function() {
		if(this.owner == null) return null;
		var entity = this.owner.parent;
		while(entity != null) {
			var sprite = entity._compMap.Sprite_0;
			if(sprite != null) return sprite;
			entity = entity.parent;
		}
		return null;
	}
	,get_pointerDown: function() {
		if(this._pointerDown == null) this._pointerDown = new flambe_util_Signal1();
		return this._pointerDown;
	}
	,get_pointerUp: function() {
		if(this._pointerUp == null) this._pointerUp = new flambe_util_Signal1();
		return this._pointerUp;
	}
	,connectHover: function() {
		var _g = this;
		if(this._hoverConnection != null) return;
		this._hoverConnection = flambe_System._platform.getPointer().move.connect(function(event) {
			var hit = event.hit;
			while(hit != null) {
				if(hit == _g) return;
				hit = hit.getParentSprite();
			}
			if(_g._pointerOut != null && (_g._flags & 256) != 0) _g._pointerOut.emit(event);
			_g._flags = _g._flags & -257;
			_g._hoverConnection.dispose();
			_g._hoverConnection = null;
		});
	}
	,set_pointerEnabled: function(pointerEnabled) {
		this._flags = flambe_util_BitSets.set(this._flags,2,pointerEnabled);
		return pointerEnabled;
	}
	,set_pixelSnapping: function(pixelSnapping) {
		this._flags = flambe_util_BitSets.set(this._flags,128,pixelSnapping);
		return pixelSnapping;
	}
	,onPointerDown: function(event) {
		this.onHover(event);
		if(this._pointerDown != null) this._pointerDown.emit(event);
	}
	,onPointerMove: function(event) {
		this.onHover(event);
		if(this._pointerMove != null) this._pointerMove.emit(event);
	}
	,onHover: function(event) {
		if((this._flags & 256) != 0) return;
		this._flags = this._flags | 256;
		if(this._pointerIn != null || this._pointerOut != null) {
			if(this._pointerIn != null) this._pointerIn.emit(event);
			this.connectHover();
		}
	}
	,onPointerUp: function(event) {
		{
			var _g = event.source;
			switch(_g[1]) {
			case 1:
				var point = _g[2];
				if(this._pointerOut != null && (this._flags & 256) != 0) this._pointerOut.emit(event);
				this._flags = this._flags & -257;
				if(this._hoverConnection != null) {
					this._hoverConnection.dispose();
					this._hoverConnection = null;
				}
				break;
			default:
			}
		}
		if(this._pointerUp != null) this._pointerUp.emit(event);
	}
	,__class__: flambe_display_Sprite
});
var flambe_display_EmitterSprite = function(mold) {
	this._totalElapsed = 0;
	this._emitElapsed = 0;
	this.enabled = true;
	this.numParticles = 0;
	flambe_display_Sprite.call(this);
	this.texture = mold.texture;
	this.blendMode = mold.blendMode;
	this.type = mold.type;
	this.alphaEnd = new flambe_animation_AnimatedFloat(mold.alphaEnd);
	this.alphaEndVariance = new flambe_animation_AnimatedFloat(mold.alphaEndVariance);
	this.alphaStart = new flambe_animation_AnimatedFloat(mold.alphaStart);
	this.alphaStartVariance = new flambe_animation_AnimatedFloat(mold.alphaStartVariance);
	this.angle = new flambe_animation_AnimatedFloat(mold.angle);
	this.angleVariance = new flambe_animation_AnimatedFloat(mold.angleVariance);
	this.duration = mold.duration;
	this.emitXVariance = new flambe_animation_AnimatedFloat(mold.emitXVariance);
	this.emitYVariance = new flambe_animation_AnimatedFloat(mold.emitYVariance);
	this.gravityX = new flambe_animation_AnimatedFloat(mold.gravityX);
	this.gravityY = new flambe_animation_AnimatedFloat(mold.gravityY);
	this.maxRadius = new flambe_animation_AnimatedFloat(mold.maxRadius);
	this.maxRadiusVariance = new flambe_animation_AnimatedFloat(mold.maxRadiusVariance);
	this.minRadius = new flambe_animation_AnimatedFloat(mold.minRadius);
	this.lifespan = new flambe_animation_AnimatedFloat(mold.lifespan);
	this.lifespanVariance = new flambe_animation_AnimatedFloat(mold.lifespanVariance);
	this.radialAccel = new flambe_animation_AnimatedFloat(mold.radialAccel);
	this.radialAccelVariance = new flambe_animation_AnimatedFloat(mold.radialAccelVariance);
	this.rotatePerSecond = new flambe_animation_AnimatedFloat(mold.rotatePerSecond);
	this.rotatePerSecondVariance = new flambe_animation_AnimatedFloat(mold.rotatePerSecondVariance);
	this.rotationEnd = new flambe_animation_AnimatedFloat(mold.rotationEnd);
	this.rotationEndVariance = new flambe_animation_AnimatedFloat(mold.rotationEndVariance);
	this.rotationStart = new flambe_animation_AnimatedFloat(mold.rotationStart);
	this.rotationStartVariance = new flambe_animation_AnimatedFloat(mold.rotationStartVariance);
	this.sizeEnd = new flambe_animation_AnimatedFloat(mold.sizeEnd);
	this.sizeEndVariance = new flambe_animation_AnimatedFloat(mold.sizeEndVariance);
	this.sizeStart = new flambe_animation_AnimatedFloat(mold.sizeStart);
	this.sizeStartVariance = new flambe_animation_AnimatedFloat(mold.sizeStartVariance);
	this.speed = new flambe_animation_AnimatedFloat(mold.speed);
	this.speedVariance = new flambe_animation_AnimatedFloat(mold.speedVariance);
	this.tangentialAccel = new flambe_animation_AnimatedFloat(mold.tangentialAccel);
	this.tangentialAccelVariance = new flambe_animation_AnimatedFloat(mold.tangentialAccelVariance);
	this.emitX = new flambe_animation_AnimatedFloat(0);
	this.emitY = new flambe_animation_AnimatedFloat(0);
	this._particles = new Array(mold.maxParticles);
	var ii = 0;
	var ll = this._particles.length;
	while(ii < ll) {
		this._particles[ii] = new flambe_display__$EmitterSprite_Particle();
		++ii;
	}
};
flambe_display_EmitterSprite.__name__ = true;
flambe_display_EmitterSprite.random = function(base,variance) {
	if(variance != 0) base += variance * (2 * Math.random() - 1);
	return base;
};
flambe_display_EmitterSprite.__super__ = flambe_display_Sprite;
flambe_display_EmitterSprite.prototype = $extend(flambe_display_Sprite.prototype,{
	restart: function() {
		this.enabled = true;
		this._totalElapsed = 0;
	}
	,onUpdate: function(dt) {
		flambe_display_Sprite.prototype.onUpdate.call(this,dt);
		this.alphaEnd.update(dt);
		this.alphaEndVariance.update(dt);
		this.alphaStart.update(dt);
		this.alphaStartVariance.update(dt);
		this.angle.update(dt);
		this.angleVariance.update(dt);
		this.emitX.update(dt);
		this.emitXVariance.update(dt);
		this.emitY.update(dt);
		this.emitYVariance.update(dt);
		this.gravityX.update(dt);
		this.gravityY.update(dt);
		this.lifespan.update(dt);
		this.lifespanVariance.update(dt);
		this.maxRadius.update(dt);
		this.maxRadiusVariance.update(dt);
		this.minRadius.update(dt);
		this.radialAccel.update(dt);
		this.radialAccelVariance.update(dt);
		this.rotatePerSecond.update(dt);
		this.rotatePerSecondVariance.update(dt);
		this.rotationEnd.update(dt);
		this.rotationEndVariance.update(dt);
		this.rotationStart.update(dt);
		this.rotationStartVariance.update(dt);
		this.sizeEnd.update(dt);
		this.sizeEndVariance.update(dt);
		this.sizeStart.update(dt);
		this.sizeStartVariance.update(dt);
		this.speed.update(dt);
		this.speedVariance.update(dt);
		this.tangentialAccel.update(dt);
		this.tangentialAccelVariance.update(dt);
		var gravityType = this.type == flambe_display_EmitterType.Gravity;
		var ii = 0;
		while(ii < this.numParticles) {
			var particle = this._particles[ii];
			if(particle.life > dt) {
				if(gravityType) {
					particle.x += particle.velX * dt;
					particle.y += particle.velY * dt;
					var accelX = this.gravityX._value;
					var accelY = -this.gravityY._value;
					if(particle.radialAccel != 0 || particle.tangentialAccel != 0) {
						var dx = particle.x - particle.emitX;
						var dy = particle.y - particle.emitY;
						var distance = Math.sqrt(dx * dx + dy * dy);
						var radialX = dx / distance;
						var radialY = dy / distance;
						accelX += radialX * particle.radialAccel;
						accelY += radialY * particle.radialAccel;
						var tangentialX = -radialY;
						var tangentialY = radialX;
						accelX += tangentialX * particle.tangentialAccel;
						accelY += tangentialY * particle.tangentialAccel;
					}
					particle.velX += accelX * dt;
					particle.velY += accelY * dt;
				} else {
					particle.radialRotation += particle.velRadialRotation * dt;
					particle.radialRadius += particle.velRadialRadius * dt;
					var radius = particle.radialRadius;
					particle.x = this.emitX._value - Math.cos(particle.radialRotation) * radius;
					particle.y = this.emitY._value - Math.sin(particle.radialRotation) * radius;
					if(radius < this.minRadius._value) particle.life = 0;
				}
				particle.scale += particle.velScale * dt;
				particle.rotation += particle.velRotation * dt;
				particle.alpha += particle.velAlpha * dt;
				particle.life -= dt;
				++ii;
			} else {
				--this.numParticles;
				if(ii != this.numParticles) {
					this._particles[ii] = this._particles[this.numParticles];
					this._particles[this.numParticles] = particle;
				}
			}
		}
		if(!this.enabled) return;
		if(this.duration > 0) {
			this._totalElapsed += dt;
			if(this._totalElapsed >= this.duration) {
				this.enabled = false;
				return;
			}
		}
		var emitDelay = this.lifespan._value / this._particles.length;
		this._emitElapsed += dt;
		while(this._emitElapsed >= emitDelay) {
			if(this.numParticles < this._particles.length) {
				var particle1 = this._particles[this.numParticles];
				if(this.initParticle(particle1)) ++this.numParticles;
			}
			this._emitElapsed -= emitDelay;
		}
	}
	,draw: function(g) {
		var offset = -this.texture.get_width() / 2;
		var ii = 0;
		var ll = this.numParticles;
		while(ii < ll) {
			var particle = this._particles[ii];
			g.save();
			g.translate(particle.x,particle.y);
			if(particle.alpha < 1) g.multiplyAlpha(particle.alpha);
			if(particle.rotation != 0) g.rotate(particle.rotation);
			if(particle.scale != 1) g.scale(particle.scale,particle.scale);
			g.drawTexture(this.texture,offset,offset);
			g.restore();
			++ii;
		}
	}
	,initParticle: function(particle) {
		particle.life = flambe_display_EmitterSprite.random(this.lifespan._value,this.lifespanVariance._value);
		if(particle.life <= 0) return false;
		particle.emitX = this.emitX._value;
		particle.emitY = this.emitY._value;
		var angle = -flambe_math_FMath.toRadians(flambe_display_EmitterSprite.random(this.angle._value,this.angleVariance._value));
		var speed = flambe_display_EmitterSprite.random(this.speed._value,this.speedVariance._value);
		particle.velX = speed * Math.cos(angle);
		particle.velY = speed * Math.sin(angle);
		particle.radialAccel = flambe_display_EmitterSprite.random(this.radialAccel._value,this.radialAccelVariance._value);
		particle.tangentialAccel = flambe_display_EmitterSprite.random(this.tangentialAccel._value,this.tangentialAccelVariance._value);
		particle.radialRadius = flambe_display_EmitterSprite.random(this.maxRadius._value,this.maxRadiusVariance._value);
		particle.velRadialRadius = -particle.radialRadius / particle.life;
		particle.radialRotation = angle;
		particle.velRadialRotation = flambe_math_FMath.toRadians(flambe_display_EmitterSprite.random(this.rotatePerSecond._value,this.rotatePerSecondVariance._value));
		if(this.type == flambe_display_EmitterType.Gravity) {
			particle.x = flambe_display_EmitterSprite.random(this.emitX._value,this.emitXVariance._value);
			particle.y = flambe_display_EmitterSprite.random(this.emitY._value,this.emitYVariance._value);
		} else {
			var radius = particle.radialRadius;
			particle.x = this.emitX._value - Math.cos(particle.radialRotation) * radius;
			particle.y = this.emitY._value - Math.sin(particle.radialRotation) * radius;
		}
		var width = this.texture.get_width();
		var scaleStart = flambe_display_EmitterSprite.random(this.sizeStart._value,this.sizeStartVariance._value) / width;
		var scaleEnd = flambe_display_EmitterSprite.random(this.sizeEnd._value,this.sizeEndVariance._value) / width;
		particle.scale = scaleStart;
		particle.velScale = (scaleEnd - scaleStart) / particle.life;
		var rotationStart = flambe_display_EmitterSprite.random(this.rotationStart._value,this.rotationStartVariance._value);
		var rotationEnd = flambe_display_EmitterSprite.random(this.rotationEnd._value,this.rotationEndVariance._value);
		particle.rotation = rotationStart;
		particle.velRotation = (rotationEnd - rotationStart) / particle.life;
		var alphaStart = flambe_display_EmitterSprite.random(this.alphaStart._value,this.alphaStartVariance._value);
		var alphaEnd = flambe_display_EmitterSprite.random(this.alphaEnd._value,this.alphaEndVariance._value);
		particle.alpha = alphaStart;
		particle.velAlpha = (alphaEnd - alphaStart) / particle.life;
		return true;
	}
	,__class__: flambe_display_EmitterSprite
});
var flambe_display__$EmitterSprite_Particle = function() {
	this.life = 0;
	this.velAlpha = 0;
	this.alpha = 0;
	this.velRotation = 0;
	this.rotation = 0;
	this.velScale = 0;
	this.scale = 0;
	this.tangentialAccel = 0;
	this.radialAccel = 0;
	this.velRadialRotation = 0;
	this.radialRotation = 0;
	this.velRadialRadius = 0;
	this.radialRadius = 0;
	this.velY = 0;
	this.y = 0;
	this.velX = 0;
	this.x = 0;
	this.emitY = 0;
	this.emitX = 0;
};
flambe_display__$EmitterSprite_Particle.__name__ = true;
flambe_display__$EmitterSprite_Particle.prototype = {
	__class__: flambe_display__$EmitterSprite_Particle
};
var flambe_display_FillSprite = function(color,width,height) {
	flambe_display_Sprite.call(this);
	this.color = color;
	this.width = new flambe_animation_AnimatedFloat(width);
	this.height = new flambe_animation_AnimatedFloat(height);
};
flambe_display_FillSprite.__name__ = true;
flambe_display_FillSprite.__super__ = flambe_display_Sprite;
flambe_display_FillSprite.prototype = $extend(flambe_display_Sprite.prototype,{
	draw: function(g) {
		g.fillRect(this.color,0,0,this.width._value,this.height._value);
	}
	,getNaturalWidth: function() {
		return this.width._value;
	}
	,getNaturalHeight: function() {
		return this.height._value;
	}
	,onUpdate: function(dt) {
		flambe_display_Sprite.prototype.onUpdate.call(this,dt);
		this.width.update(dt);
		this.height.update(dt);
	}
	,__class__: flambe_display_FillSprite
});
var flambe_display_Glyph = function(charCode) {
	this._kernings = null;
	this.xAdvance = 0;
	this.yOffset = 0;
	this.xOffset = 0;
	this.page = null;
	this.height = 0;
	this.width = 0;
	this.y = 0;
	this.x = 0;
	this.charCode = charCode;
};
flambe_display_Glyph.__name__ = true;
flambe_display_Glyph.prototype = {
	draw: function(g,destX,destY) {
		if(this.width > 0) g.drawSubTexture(this.page,destX + this.xOffset,destY + this.yOffset,this.x,this.y,this.width,this.height);
	}
	,getKerning: function(nextCharCode) {
		if(this._kernings != null) return Std["int"](this._kernings.get(nextCharCode)); else return 0;
	}
	,setKerning: function(nextCharCode,amount) {
		if(this._kernings == null) this._kernings = new haxe_ds_IntMap();
		this._kernings.set(nextCharCode,amount);
	}
	,__class__: flambe_display_Glyph
};
var flambe_display_Font = function(pack,name) {
	this.name = name;
	this._pack = pack;
	this.reload();
};
flambe_display_Font.__name__ = true;
flambe_display_Font.prototype = {
	layoutText: function(text,align,wrapWidth,letterSpacing,lineSpacing) {
		if(lineSpacing == null) lineSpacing = 0;
		if(letterSpacing == null) letterSpacing = 0;
		if(wrapWidth == null) wrapWidth = 0;
		if(align == null) align = flambe_display_TextAlign.Left;
		return new flambe_display_TextLayout(this,text,align,wrapWidth,letterSpacing,lineSpacing);
	}
	,reload: function() {
		this._glyphs = new haxe_ds_IntMap();
		this._glyphs.set(flambe_display_Font.NEWLINE.charCode,flambe_display_Font.NEWLINE);
		var parser = new flambe_display__$Font_ConfigParser(this._pack.getFile(this.name + ".fnt").toString());
		var pages = new haxe_ds_IntMap();
		var idx = this.name.lastIndexOf("/");
		var basePath;
		if(idx >= 0) basePath = HxOverrides.substr(this.name,0,idx + 1); else basePath = "";
		var $it0 = parser.keywords();
		while( $it0.hasNext() ) {
			var keyword = $it0.next();
			switch(keyword) {
			case "info":
				var $it1 = parser.pairs();
				while( $it1.hasNext() ) {
					var pair = $it1.next();
					var _g = pair.key;
					switch(_g) {
					case "size":
						this.size = pair.getInt();
						break;
					}
				}
				break;
			case "common":
				var $it2 = parser.pairs();
				while( $it2.hasNext() ) {
					var pair1 = $it2.next();
					var _g1 = pair1.key;
					switch(_g1) {
					case "lineHeight":
						this.lineHeight = pair1.getInt();
						break;
					}
				}
				break;
			case "page":
				var pageId = 0;
				var file = null;
				var $it3 = parser.pairs();
				while( $it3.hasNext() ) {
					var pair2 = $it3.next();
					var _g2 = pair2.key;
					switch(_g2) {
					case "id":
						pageId = pair2.getInt();
						break;
					case "file":
						file = pair2.getString();
						break;
					}
				}
				var value = this._pack.getTexture(basePath + flambe_util_Strings.removeFileExtension(file));
				pages.set(pageId,value);
				break;
			case "char":
				var glyph = null;
				var $it4 = parser.pairs();
				while( $it4.hasNext() ) {
					var pair3 = $it4.next();
					var _g3 = pair3.key;
					switch(_g3) {
					case "id":
						glyph = new flambe_display_Glyph(pair3.getInt());
						break;
					case "x":
						glyph.x = pair3.getInt();
						break;
					case "y":
						glyph.y = pair3.getInt();
						break;
					case "width":
						glyph.width = pair3.getInt();
						break;
					case "height":
						glyph.height = pair3.getInt();
						break;
					case "page":
						var key = pair3.getInt();
						glyph.page = pages.get(key);
						break;
					case "xoffset":
						glyph.xOffset = pair3.getInt();
						break;
					case "yoffset":
						glyph.yOffset = pair3.getInt();
						break;
					case "xadvance":
						glyph.xAdvance = pair3.getInt();
						break;
					}
				}
				this._glyphs.set(glyph.charCode,glyph);
				break;
			case "kerning":
				var first = null;
				var second = 0;
				var amount = 0;
				var $it5 = parser.pairs();
				while( $it5.hasNext() ) {
					var pair4 = $it5.next();
					var _g4 = pair4.key;
					switch(_g4) {
					case "first":
						var key1 = pair4.getInt();
						first = this._glyphs.get(key1);
						break;
					case "second":
						second = pair4.getInt();
						break;
					case "amount":
						amount = pair4.getInt();
						break;
					}
				}
				if(first != null && amount != 0) first.setKerning(second,amount);
				break;
			}
		}
	}
	,__class__: flambe_display_Font
};
var flambe_display_TextAlign = { __ename__ : true, __constructs__ : ["Left","Center","Right"] };
flambe_display_TextAlign.Left = ["Left",0];
flambe_display_TextAlign.Left.toString = $estr;
flambe_display_TextAlign.Left.__enum__ = flambe_display_TextAlign;
flambe_display_TextAlign.Center = ["Center",1];
flambe_display_TextAlign.Center.toString = $estr;
flambe_display_TextAlign.Center.__enum__ = flambe_display_TextAlign;
flambe_display_TextAlign.Right = ["Right",2];
flambe_display_TextAlign.Right.toString = $estr;
flambe_display_TextAlign.Right.__enum__ = flambe_display_TextAlign;
var flambe_display_TextLayout = function(font,text,align,wrapWidth,letterSpacing,lineSpacing) {
	this.lines = 0;
	var _g = this;
	this._font = font;
	this._glyphs = [];
	this._offsets = [];
	this._lineOffset = Math.round(font.lineHeight + lineSpacing);
	this.bounds = new flambe_math_Rectangle();
	var lineWidths = [];
	var ll = text.length;
	var _g1 = 0;
	while(_g1 < ll) {
		var ii = _g1++;
		var charCode = text.charCodeAt(ii);
		var glyph = font._glyphs.get(charCode);
		if(glyph != null) this._glyphs.push(glyph); else null;
	}
	var lastSpaceIdx = -1;
	var lineWidth = 0.0;
	var lineHeight = 0.0;
	var newline = font._glyphs.get(10);
	var addLine = function() {
		_g.bounds.width = flambe_math_FMath.max(_g.bounds.width,lineWidth);
		_g.bounds.height += lineHeight;
		lineWidths[_g.lines] = lineWidth;
		lineWidth = 0;
		lineHeight = 0;
		++_g.lines;
	};
	var ii1 = 0;
	while(ii1 < this._glyphs.length) {
		var glyph1 = this._glyphs[ii1];
		this._offsets[ii1] = Math.round(lineWidth);
		var wordWrap = wrapWidth > 0 && lineWidth + glyph1.width > wrapWidth;
		if(wordWrap || glyph1 == newline) {
			if(wordWrap) {
				if(lastSpaceIdx >= 0) {
					this._glyphs[lastSpaceIdx] = newline;
					lineWidth = this._offsets[lastSpaceIdx];
					ii1 = lastSpaceIdx;
				} else this._glyphs.splice(ii1,0,newline);
			}
			lastSpaceIdx = -1;
			lineHeight = this._lineOffset;
			addLine();
		} else {
			if(glyph1.charCode == 32) lastSpaceIdx = ii1;
			lineWidth += glyph1.xAdvance + letterSpacing;
			lineHeight = flambe_math_FMath.max(lineHeight,glyph1.height + glyph1.yOffset);
			if(ii1 + 1 < this._glyphs.length) {
				var nextGlyph = this._glyphs[ii1 + 1];
				lineWidth += glyph1.getKerning(nextGlyph.charCode);
			}
		}
		++ii1;
	}
	addLine();
	var lineY = 0.0;
	var alignOffset = flambe_display_TextLayout.getAlignOffset(align,lineWidths[0],wrapWidth);
	var top = 1.79769313486231e+308;
	var bottom = -1.79769313486231e+308;
	var line = 0;
	var ii2 = 0;
	var ll1 = this._glyphs.length;
	while(ii2 < ll1) {
		var glyph2 = this._glyphs[ii2];
		if(glyph2.charCode == 10) {
			lineY += this._lineOffset;
			++line;
			alignOffset = flambe_display_TextLayout.getAlignOffset(align,lineWidths[line],wrapWidth);
		}
		this._offsets[ii2] += alignOffset;
		var glyphY = lineY + glyph2.yOffset;
		if(top < glyphY) top = top; else top = glyphY;
		bottom = flambe_math_FMath.max(bottom,glyphY + glyph2.height);
		++ii2;
	}
	this.bounds.x = flambe_display_TextLayout.getAlignOffset(align,this.bounds.width,wrapWidth);
	this.bounds.y = top;
	this.bounds.height = bottom - top;
};
flambe_display_TextLayout.__name__ = true;
flambe_display_TextLayout.getAlignOffset = function(align,lineWidth,totalWidth) {
	switch(align[1]) {
	case 0:
		return 0;
	case 2:
		return totalWidth - lineWidth;
	case 1:
		return Math.round((totalWidth - lineWidth) / 2);
	}
};
flambe_display_TextLayout.prototype = {
	draw: function(g) {
		var y = 0.0;
		var ii = 0;
		var ll = this._glyphs.length;
		while(ii < ll) {
			var glyph = this._glyphs[ii];
			if(glyph.charCode == 10) y += this._lineOffset; else {
				var x = this._offsets[ii];
				glyph.draw(g,x,y);
			}
			++ii;
		}
	}
	,__class__: flambe_display_TextLayout
};
var flambe_display__$Font_ConfigParser = function(config) {
	this._configText = config;
	this._keywordPattern = new EReg("([A-Za-z]+)(.*)","");
	this._pairPattern = new EReg("([A-Za-z]+)=(\"[^\"]*\"|[^\\s]+)","");
};
flambe_display__$Font_ConfigParser.__name__ = true;
flambe_display__$Font_ConfigParser.advance = function(text,expr) {
	var m = expr.matchedPos();
	return HxOverrides.substr(text,m.pos + m.len,text.length);
};
flambe_display__$Font_ConfigParser.prototype = {
	keywords: function() {
		var _g = this;
		var text = this._configText;
		return { next : function() {
			text = flambe_display__$Font_ConfigParser.advance(text,_g._keywordPattern);
			_g._pairText = _g._keywordPattern.matched(2);
			return _g._keywordPattern.matched(1);
		}, hasNext : function() {
			return _g._keywordPattern.match(text);
		}};
	}
	,pairs: function() {
		var _g = this;
		var text = this._pairText;
		return { next : function() {
			text = flambe_display__$Font_ConfigParser.advance(text,_g._pairPattern);
			return new flambe_display__$Font_ConfigPair(_g._pairPattern.matched(1),_g._pairPattern.matched(2));
		}, hasNext : function() {
			return _g._pairPattern.match(text);
		}};
	}
	,__class__: flambe_display__$Font_ConfigParser
};
var flambe_display__$Font_ConfigPair = function(key,value) {
	this.key = key;
	this._value = value;
};
flambe_display__$Font_ConfigPair.__name__ = true;
flambe_display__$Font_ConfigPair.prototype = {
	getInt: function() {
		return Std.parseInt(this._value);
	}
	,getString: function() {
		if(this._value.charCodeAt(0) != 34) return null;
		return HxOverrides.substr(this._value,1,this._value.length - 2);
	}
	,__class__: flambe_display__$Font_ConfigPair
};
var flambe_display_Graphics = function() { };
flambe_display_Graphics.__name__ = true;
flambe_display_Graphics.prototype = {
	__class__: flambe_display_Graphics
};
var flambe_display_ImageSprite = function(texture) {
	flambe_display_Sprite.call(this);
	this.texture = texture;
};
flambe_display_ImageSprite.__name__ = true;
flambe_display_ImageSprite.__super__ = flambe_display_Sprite;
flambe_display_ImageSprite.prototype = $extend(flambe_display_Sprite.prototype,{
	draw: function(g) {
		if(this.texture != null) g.drawTexture(this.texture,0,0);
	}
	,getNaturalWidth: function() {
		if(this.texture != null) return this.texture.get_width(); else return 0;
	}
	,getNaturalHeight: function() {
		if(this.texture != null) return this.texture.get_height(); else return 0;
	}
	,__class__: flambe_display_ImageSprite
});
var flambe_display_Orientation = { __ename__ : true, __constructs__ : ["Portrait","Landscape"] };
flambe_display_Orientation.Portrait = ["Portrait",0];
flambe_display_Orientation.Portrait.toString = $estr;
flambe_display_Orientation.Portrait.__enum__ = flambe_display_Orientation;
flambe_display_Orientation.Landscape = ["Landscape",1];
flambe_display_Orientation.Landscape.toString = $estr;
flambe_display_Orientation.Landscape.__enum__ = flambe_display_Orientation;
var flambe_display_PatternSprite = function(texture,width,height) {
	if(height == null) height = -1;
	if(width == null) width = -1;
	flambe_display_Sprite.call(this);
	this.texture = texture;
	if(width < 0) if(texture != null) width = texture.get_width(); else width = 0;
	this.width = new flambe_animation_AnimatedFloat(width);
	if(height < 0) if(texture != null) height = texture.get_height(); else height = 0;
	this.height = new flambe_animation_AnimatedFloat(height);
};
flambe_display_PatternSprite.__name__ = true;
flambe_display_PatternSprite.__super__ = flambe_display_Sprite;
flambe_display_PatternSprite.prototype = $extend(flambe_display_Sprite.prototype,{
	draw: function(g) {
		if(this.texture != null) g.drawPattern(this.texture,0,0,this.width._value,this.height._value);
	}
	,getNaturalWidth: function() {
		return this.width._value;
	}
	,getNaturalHeight: function() {
		return this.height._value;
	}
	,onUpdate: function(dt) {
		flambe_display_Sprite.prototype.onUpdate.call(this,dt);
		this.width.update(dt);
		this.height.update(dt);
	}
	,__class__: flambe_display_PatternSprite
});
var flambe_display_Texture = function() { };
flambe_display_Texture.__name__ = true;
flambe_display_Texture.__interfaces__ = [flambe_asset_Asset];
flambe_display_Texture.prototype = {
	__class__: flambe_display_Texture
};
var flambe_display_SubTexture = function() { };
flambe_display_SubTexture.__name__ = true;
flambe_display_SubTexture.__interfaces__ = [flambe_display_Texture];
var flambe_display_TextSprite = function(font,text) {
	if(text == null) text = "";
	this._layout = null;
	var _g = this;
	flambe_display_Sprite.call(this);
	this._font = font;
	this._text = text;
	this._align = flambe_display_TextAlign.Left;
	this._flags = this._flags | 64;
	var dirtyText = function(_,_1) {
		_g._flags = _g._flags | 64;
	};
	this.wrapWidth = new flambe_animation_AnimatedFloat(0,dirtyText);
	this.letterSpacing = new flambe_animation_AnimatedFloat(0,dirtyText);
	this.lineSpacing = new flambe_animation_AnimatedFloat(0,dirtyText);
};
flambe_display_TextSprite.__name__ = true;
flambe_display_TextSprite.__super__ = flambe_display_Sprite;
flambe_display_TextSprite.prototype = $extend(flambe_display_Sprite.prototype,{
	draw: function(g) {
		this.updateLayout();
		this._layout.draw(g);
	}
	,getNaturalWidth: function() {
		this.updateLayout();
		if(this.wrapWidth._value > 0) return this.wrapWidth._value; else return this._layout.bounds.width;
	}
	,getNaturalHeight: function() {
		this.updateLayout();
		var paddedHeight = this._layout.lines * (this._font.lineHeight + this.lineSpacing._value);
		var boundsHeight = this._layout.bounds.height;
		if(paddedHeight > boundsHeight) return paddedHeight; else return boundsHeight;
	}
	,containsLocal: function(localX,localY) {
		this.updateLayout();
		return this._layout.bounds.contains(localX,localY);
	}
	,setWrapWidth: function(wrapWidth) {
		this.wrapWidth.set__(wrapWidth);
		return this;
	}
	,setAlign: function(align) {
		this.set_align(align);
		return this;
	}
	,set_text: function(text) {
		if(text != this._text) {
			this._text = text;
			this._flags = this._flags | 64;
		}
		return text;
	}
	,set_align: function(align) {
		if(align != this._align) {
			this._align = align;
			this._flags = this._flags | 64;
		}
		return align;
	}
	,updateLayout: function() {
		if((this._flags & 64) != 0) {
			this._flags = this._flags & -65;
			this._layout = this._font.layoutText(this._text,this._align,this.wrapWidth._value,this.letterSpacing._value,this.lineSpacing._value);
		}
	}
	,onUpdate: function(dt) {
		flambe_display_Sprite.prototype.onUpdate.call(this,dt);
		this.wrapWidth.update(dt);
		this.letterSpacing.update(dt);
		this.lineSpacing.update(dt);
	}
	,__class__: flambe_display_TextSprite
});
var flambe_input_MouseButton = { __ename__ : true, __constructs__ : ["Left","Middle","Right","Unknown"] };
flambe_input_MouseButton.Left = ["Left",0];
flambe_input_MouseButton.Left.toString = $estr;
flambe_input_MouseButton.Left.__enum__ = flambe_input_MouseButton;
flambe_input_MouseButton.Middle = ["Middle",1];
flambe_input_MouseButton.Middle.toString = $estr;
flambe_input_MouseButton.Middle.__enum__ = flambe_input_MouseButton;
flambe_input_MouseButton.Right = ["Right",2];
flambe_input_MouseButton.Right.toString = $estr;
flambe_input_MouseButton.Right.__enum__ = flambe_input_MouseButton;
flambe_input_MouseButton.Unknown = function(buttonCode) { var $x = ["Unknown",3,buttonCode]; $x.__enum__ = flambe_input_MouseButton; $x.toString = $estr; return $x; };
var flambe_input_MouseCursor = { __ename__ : true, __constructs__ : ["Default","Button","None"] };
flambe_input_MouseCursor.Default = ["Default",0];
flambe_input_MouseCursor.Default.toString = $estr;
flambe_input_MouseCursor.Default.__enum__ = flambe_input_MouseCursor;
flambe_input_MouseCursor.Button = ["Button",1];
flambe_input_MouseCursor.Button.toString = $estr;
flambe_input_MouseCursor.Button.__enum__ = flambe_input_MouseCursor;
flambe_input_MouseCursor.None = ["None",2];
flambe_input_MouseCursor.None.toString = $estr;
flambe_input_MouseCursor.None.__enum__ = flambe_input_MouseCursor;
var flambe_input_MouseEvent = function() {
	this.init(0,0,0,null);
};
flambe_input_MouseEvent.__name__ = true;
flambe_input_MouseEvent.prototype = {
	init: function(id,viewX,viewY,button) {
		this.id = id;
		this.viewX = viewX;
		this.viewY = viewY;
		this.button = button;
	}
	,__class__: flambe_input_MouseEvent
};
var flambe_input_EventSource = { __ename__ : true, __constructs__ : ["Mouse","Touch"] };
flambe_input_EventSource.Mouse = function(event) { var $x = ["Mouse",0,event]; $x.__enum__ = flambe_input_EventSource; $x.toString = $estr; return $x; };
flambe_input_EventSource.Touch = function(point) { var $x = ["Touch",1,point]; $x.__enum__ = flambe_input_EventSource; $x.toString = $estr; return $x; };
var flambe_input_PointerEvent = function() {
	this.init(0,0,0,null,null);
};
flambe_input_PointerEvent.__name__ = true;
flambe_input_PointerEvent.prototype = {
	init: function(id,viewX,viewY,hit,source) {
		this.id = id;
		this.viewX = viewX;
		this.viewY = viewY;
		this.hit = hit;
		this.source = source;
		this._stopped = false;
	}
	,__class__: flambe_input_PointerEvent
};
var flambe_input_TouchPoint = function(id) {
	this.id = id;
	this._source = flambe_input_EventSource.Touch(this);
};
flambe_input_TouchPoint.__name__ = true;
flambe_input_TouchPoint.prototype = {
	init: function(viewX,viewY) {
		this.viewX = viewX;
		this.viewY = viewY;
	}
	,__class__: flambe_input_TouchPoint
};
var flambe_math_FMath = function() { };
flambe_math_FMath.__name__ = true;
flambe_math_FMath.toRadians = function(degrees) {
	return degrees * 3.141592653589793 / 180;
};
flambe_math_FMath.max = function(a,b) {
	if(a > b) return a; else return b;
};
flambe_math_FMath.min = function(a,b) {
	if(a < b) return a; else return b;
};
var flambe_math_Matrix = function() {
	this.identity();
};
flambe_math_Matrix.__name__ = true;
flambe_math_Matrix.multiply = function(lhs,rhs,result) {
	if(result == null) result = new flambe_math_Matrix();
	var a = lhs.m00 * rhs.m00 + lhs.m01 * rhs.m10;
	var b = lhs.m00 * rhs.m01 + lhs.m01 * rhs.m11;
	var c = lhs.m00 * rhs.m02 + lhs.m01 * rhs.m12 + lhs.m02;
	result.m00 = a;
	result.m01 = b;
	result.m02 = c;
	a = lhs.m10 * rhs.m00 + lhs.m11 * rhs.m10;
	b = lhs.m10 * rhs.m01 + lhs.m11 * rhs.m11;
	c = lhs.m10 * rhs.m02 + lhs.m11 * rhs.m12 + lhs.m12;
	result.m10 = a;
	result.m11 = b;
	result.m12 = c;
	return result;
};
flambe_math_Matrix.prototype = {
	set: function(m00,m10,m01,m11,m02,m12) {
		this.m00 = m00;
		this.m01 = m01;
		this.m02 = m02;
		this.m10 = m10;
		this.m11 = m11;
		this.m12 = m12;
	}
	,identity: function() {
		this.set(1,0,0,1,0,0);
	}
	,compose: function(x,y,scaleX,scaleY,rotation) {
		var sin = Math.sin(rotation);
		var cos = Math.cos(rotation);
		this.set(cos * scaleX,sin * scaleX,-sin * scaleY,cos * scaleY,x,y);
	}
	,translate: function(x,y) {
		this.m02 += this.m00 * x + this.m01 * y;
		this.m12 += this.m11 * y + this.m10 * x;
	}
	,invert: function() {
		var det = this.determinant();
		if(det == 0) return false;
		this.set(this.m11 / det,-this.m01 / det,-this.m10 / det,this.m00 / det,(this.m01 * this.m12 - this.m11 * this.m02) / det,(this.m10 * this.m02 - this.m00 * this.m12) / det);
		return true;
	}
	,transform: function(x,y,result) {
		if(result == null) result = new flambe_math_Point();
		result.x = x * this.m00 + y * this.m01 + this.m02;
		result.y = x * this.m10 + y * this.m11 + this.m12;
		return result;
	}
	,transformArray: function(points,length,result) {
		var ii = 0;
		while(ii < length) {
			var x = points[ii];
			var y = points[ii + 1];
			result[ii++] = x * this.m00 + y * this.m01 + this.m02;
			result[ii++] = x * this.m10 + y * this.m11 + this.m12;
		}
	}
	,determinant: function() {
		return this.m00 * this.m11 - this.m01 * this.m10;
	}
	,inverseTransform: function(x,y,result) {
		var det = this.determinant();
		if(det == 0) return false;
		x -= this.m02;
		y -= this.m12;
		result.x = (x * this.m11 - y * this.m01) / det;
		result.y = (y * this.m00 - x * this.m10) / det;
		return true;
	}
	,clone: function(result) {
		if(result == null) result = new flambe_math_Matrix();
		result.set(this.m00,this.m10,this.m01,this.m11,this.m02,this.m12);
		return result;
	}
	,__class__: flambe_math_Matrix
};
var flambe_math_Rectangle = function(x,y,width,height) {
	if(height == null) height = 0;
	if(width == null) width = 0;
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.set(x,y,width,height);
};
flambe_math_Rectangle.__name__ = true;
flambe_math_Rectangle.prototype = {
	set: function(x,y,width,height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	,contains: function(x,y) {
		x -= this.x;
		if(this.width >= 0) {
			if(x < 0 || x > this.width) return false;
		} else if(x > 0 || x < this.width) return false;
		y -= this.y;
		if(this.height >= 0) {
			if(y < 0 || y > this.height) return false;
		} else if(y > 0 || y < this.height) return false;
		return true;
	}
	,clone: function(result) {
		if(result == null) result = new flambe_math_Rectangle();
		result.set(this.x,this.y,this.width,this.height);
		return result;
	}
	,equals: function(other) {
		return this.x == other.x && this.y == other.y && this.width == other.width && this.height == other.height;
	}
	,__class__: flambe_math_Rectangle
};
var flambe_platform_BasicAsset = function() {
	this._disposed = false;
};
flambe_platform_BasicAsset.__name__ = true;
flambe_platform_BasicAsset.__interfaces__ = [flambe_asset_Asset];
flambe_platform_BasicAsset.prototype = {
	dispose: function() {
		if(!this._disposed) {
			this._disposed = true;
			this.onDisposed();
		}
	}
	,onDisposed: function() {
		null;
	}
	,__class__: flambe_platform_BasicAsset
};
var flambe_platform_BasicAssetPackLoader = function(platform,manifest) {
	var _g = this;
	this.manifest = manifest;
	this._platform = platform;
	this.promise = new flambe_util_Promise();
	this._bytesLoaded = new haxe_ds_StringMap();
	this._pack = new flambe_platform__$BasicAssetPackLoader_BasicAssetPack(manifest,this);
	var entries = Lambda.array(manifest);
	if(entries.length == 0) this.handleSuccess(); else {
		var groups = new haxe_ds_StringMap();
		var _g1 = 0;
		while(_g1 < entries.length) {
			var entry = entries[_g1];
			++_g1;
			var group = groups.get(entry.name);
			if(group == null) {
				group = [];
				groups.set(entry.name,group);
			}
			group.push(entry);
		}
		this._assetsRemaining = Lambda.count(groups);
		var $it0 = groups.iterator();
		while( $it0.hasNext() ) {
			var group1 = $it0.next();
			var group2 = [group1];
			this.pickBestEntry(group2[0],(function(group2) {
				return function(bestEntry) {
					if(bestEntry != null) {
						var url = manifest.getFullURL(bestEntry);
						try {
							_g.loadEntry(url,bestEntry);
						} catch( error ) {
							_g.handleError(bestEntry,"Unexpected error: " + Std.string(error));
						}
						var _g11 = _g.promise;
						_g11.set_total(_g11._total + bestEntry.bytes);
					} else {
						var badEntry = group2[0][0];
						if(flambe_platform_BasicAssetPackLoader.isAudio(badEntry.format)) _g.handleLoad(badEntry,flambe_platform_DummySound.getInstance()); else _g.handleError(badEntry,"Could not find a supported format to load");
					}
				};
			})(group2));
		}
	}
};
flambe_platform_BasicAssetPackLoader.__name__ = true;
flambe_platform_BasicAssetPackLoader.isAudio = function(format) {
	switch(format[1]) {
	case 8:case 9:case 10:case 11:case 12:
		return true;
	default:
		return false;
	}
};
flambe_platform_BasicAssetPackLoader.prototype = {
	onDisposed: function() {
	}
	,pickBestEntry: function(entries,fn) {
		var onFormatsAvailable = function(formats) {
			var _g = 0;
			while(_g < formats.length) {
				var format = formats[_g];
				++_g;
				var _g1 = 0;
				while(_g1 < entries.length) {
					var entry = entries[_g1];
					++_g1;
					if(entry.format == format) {
						fn(entry);
						return;
					}
				}
			}
			fn(null);
		};
		this.getAssetFormats(onFormatsAvailable);
	}
	,loadEntry: function(url,entry) {
		null;
	}
	,getAssetFormats: function(fn) {
		null;
	}
	,handleLoad: function(entry,asset) {
		if(this._pack.disposed) return;
		this.handleProgress(entry,entry.bytes);
		var map;
		var _g = entry.format;
		switch(_g[1]) {
		case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:
			map = this._pack.textures;
			break;
		case 8:case 9:case 10:case 11:case 12:
			map = this._pack.sounds;
			break;
		case 13:
			map = this._pack.files;
			break;
		}
		map.set(entry.name,asset);
		this._assetsRemaining -= 1;
		if(this._assetsRemaining == 0) this.handleSuccess();
	}
	,handleProgress: function(entry,bytesLoaded) {
		this._bytesLoaded.set(entry.name,bytesLoaded);
		var bytesTotal = 0;
		var $it0 = this._bytesLoaded.iterator();
		while( $it0.hasNext() ) {
			var bytes = $it0.next();
			bytesTotal += bytes;
		}
		this.promise.set_progress(bytesTotal);
	}
	,handleSuccess: function() {
		this.promise.set_result(this._pack);
	}
	,handleError: function(entry,message) {
		this.promise.error.emit(flambe_util_Strings.withFields(message,["url",entry.url]));
	}
	,handleTextureError: function(entry) {
		this.handleError(entry,"Failed to create texture. Is the GPU context unavailable?");
	}
	,__class__: flambe_platform_BasicAssetPackLoader
};
var flambe_platform__$BasicAssetPackLoader_BasicAssetPack = function(manifest,loader) {
	this.disposed = false;
	this._manifest = manifest;
	this.loader = loader;
	this.textures = new haxe_ds_StringMap();
	this.sounds = new haxe_ds_StringMap();
	this.files = new haxe_ds_StringMap();
};
flambe_platform__$BasicAssetPackLoader_BasicAssetPack.__name__ = true;
flambe_platform__$BasicAssetPackLoader_BasicAssetPack.__interfaces__ = [flambe_asset_AssetPack];
flambe_platform__$BasicAssetPackLoader_BasicAssetPack.prototype = {
	getTexture: function(name,required) {
		if(required == null) required = true;
		var texture = this.textures.get(name);
		if(texture == null && required) throw flambe_util_Strings.withFields("Missing texture",["name",name]);
		return texture;
	}
	,getSound: function(name,required) {
		if(required == null) required = true;
		var sound = this.sounds.get(name);
		if(sound == null && required) throw flambe_util_Strings.withFields("Missing sound",["name",name]);
		return sound;
	}
	,getFile: function(name,required) {
		if(required == null) required = true;
		var file = this.files.get(name);
		if(file == null && required) throw flambe_util_Strings.withFields("Missing file",["name",name]);
		return file;
	}
	,dispose: function() {
		if(!this.disposed) {
			this.disposed = true;
			var $it0 = this.textures.iterator();
			while( $it0.hasNext() ) {
				var texture = $it0.next();
				texture.dispose();
			}
			this.textures = null;
			var $it1 = this.sounds.iterator();
			while( $it1.hasNext() ) {
				var sound = $it1.next();
				sound.dispose();
			}
			this.sounds = null;
			var $it2 = this.files.iterator();
			while( $it2.hasNext() ) {
				var file = $it2.next();
				file.dispose();
			}
			this.files = null;
			this.loader.onDisposed();
		}
	}
	,__class__: flambe_platform__$BasicAssetPackLoader_BasicAssetPack
};
var flambe_platform_BasicFile = function(content) {
	flambe_platform_BasicAsset.call(this);
	this._content = content;
};
flambe_platform_BasicFile.__name__ = true;
flambe_platform_BasicFile.__interfaces__ = [flambe_asset_File];
flambe_platform_BasicFile.__super__ = flambe_platform_BasicAsset;
flambe_platform_BasicFile.prototype = $extend(flambe_platform_BasicAsset.prototype,{
	toString: function() {
		return this._content;
	}
	,onDisposed: function() {
		this._content = null;
	}
	,__class__: flambe_platform_BasicFile
});
var flambe_subsystem_MouseSystem = function() { };
flambe_subsystem_MouseSystem.__name__ = true;
var flambe_platform_BasicMouse = function(pointer) {
	this._pointer = pointer;
	this._source = flambe_input_EventSource.Mouse(flambe_platform_BasicMouse._sharedEvent);
	this.down = new flambe_util_Signal1();
	this.move = new flambe_util_Signal1();
	this.up = new flambe_util_Signal1();
	this.scroll = new flambe_util_Signal1();
	this._x = 0;
	this._y = 0;
	this._cursor = flambe_input_MouseCursor.Default;
	this._buttonStates = new haxe_ds_IntMap();
};
flambe_platform_BasicMouse.__name__ = true;
flambe_platform_BasicMouse.__interfaces__ = [flambe_subsystem_MouseSystem];
flambe_platform_BasicMouse.prototype = {
	submitDown: function(viewX,viewY,buttonCode) {
		if(!this._buttonStates.exists(buttonCode)) {
			this._buttonStates.set(buttonCode,true);
			this.prepare(viewX,viewY,flambe_platform_MouseCodes.toButton(buttonCode));
			this._pointer.submitDown(viewX,viewY,this._source);
			this.down.emit(flambe_platform_BasicMouse._sharedEvent);
		}
	}
	,submitMove: function(viewX,viewY) {
		this.prepare(viewX,viewY,null);
		this._pointer.submitMove(viewX,viewY,this._source);
		this.move.emit(flambe_platform_BasicMouse._sharedEvent);
	}
	,submitUp: function(viewX,viewY,buttonCode) {
		if(this._buttonStates.exists(buttonCode)) {
			this._buttonStates.remove(buttonCode);
			this.prepare(viewX,viewY,flambe_platform_MouseCodes.toButton(buttonCode));
			this._pointer.submitUp(viewX,viewY,this._source);
			this.up.emit(flambe_platform_BasicMouse._sharedEvent);
		}
	}
	,submitScroll: function(viewX,viewY,velocity) {
		this._x = viewX;
		this._y = viewY;
		if(!(this.scroll._head != null)) return false;
		this.scroll.emit(velocity);
		return true;
	}
	,prepare: function(viewX,viewY,button) {
		this._x = viewX;
		this._y = viewY;
		flambe_platform_BasicMouse._sharedEvent.init(flambe_platform_BasicMouse._sharedEvent.id + 1,viewX,viewY,button);
	}
	,__class__: flambe_platform_BasicMouse
};
var flambe_subsystem_PointerSystem = function() { };
flambe_subsystem_PointerSystem.__name__ = true;
flambe_subsystem_PointerSystem.prototype = {
	__class__: flambe_subsystem_PointerSystem
};
var flambe_platform_BasicPointer = function(x,y,isDown) {
	if(isDown == null) isDown = false;
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.down = new flambe_util_Signal1();
	this.move = new flambe_util_Signal1();
	this.up = new flambe_util_Signal1();
	this._x = x;
	this._y = y;
	this._isDown = isDown;
};
flambe_platform_BasicPointer.__name__ = true;
flambe_platform_BasicPointer.__interfaces__ = [flambe_subsystem_PointerSystem];
flambe_platform_BasicPointer.prototype = {
	submitDown: function(viewX,viewY,source) {
		if(this._isDown) return;
		this.submitMove(viewX,viewY,source);
		this._isDown = true;
		var chain = [];
		var hit = flambe_display_Sprite.hitTest(flambe_System.root,viewX,viewY);
		if(hit != null) {
			var entity = hit.owner;
			do {
				var sprite = entity._compMap.Sprite_0;
				if(sprite != null) chain.push(sprite);
				entity = entity.parent;
			} while(entity != null);
		}
		this.prepare(viewX,viewY,hit,source);
		var _g = 0;
		while(_g < chain.length) {
			var sprite1 = chain[_g];
			++_g;
			sprite1.onPointerDown(flambe_platform_BasicPointer._sharedEvent);
			if(flambe_platform_BasicPointer._sharedEvent._stopped) return;
		}
		this.down.emit(flambe_platform_BasicPointer._sharedEvent);
	}
	,submitMove: function(viewX,viewY,source) {
		if(viewX == this._x && viewY == this._y) return;
		var chain = [];
		var hit = flambe_display_Sprite.hitTest(flambe_System.root,viewX,viewY);
		if(hit != null) {
			var entity = hit.owner;
			do {
				var sprite = entity._compMap.Sprite_0;
				if(sprite != null) chain.push(sprite);
				entity = entity.parent;
			} while(entity != null);
		}
		this.prepare(viewX,viewY,hit,source);
		var _g = 0;
		while(_g < chain.length) {
			var sprite1 = chain[_g];
			++_g;
			sprite1.onPointerMove(flambe_platform_BasicPointer._sharedEvent);
			if(flambe_platform_BasicPointer._sharedEvent._stopped) return;
		}
		this.move.emit(flambe_platform_BasicPointer._sharedEvent);
	}
	,submitUp: function(viewX,viewY,source) {
		if(!this._isDown) return;
		this.submitMove(viewX,viewY,source);
		this._isDown = false;
		var chain = [];
		var hit = flambe_display_Sprite.hitTest(flambe_System.root,viewX,viewY);
		if(hit != null) {
			var entity = hit.owner;
			do {
				var sprite = entity._compMap.Sprite_0;
				if(sprite != null) chain.push(sprite);
				entity = entity.parent;
			} while(entity != null);
		}
		this.prepare(viewX,viewY,hit,source);
		var _g = 0;
		while(_g < chain.length) {
			var sprite1 = chain[_g];
			++_g;
			sprite1.onPointerUp(flambe_platform_BasicPointer._sharedEvent);
			if(flambe_platform_BasicPointer._sharedEvent._stopped) return;
		}
		this.up.emit(flambe_platform_BasicPointer._sharedEvent);
	}
	,prepare: function(viewX,viewY,hit,source) {
		this._x = viewX;
		this._y = viewY;
		flambe_platform_BasicPointer._sharedEvent.init(flambe_platform_BasicPointer._sharedEvent.id + 1,viewX,viewY,hit,source);
	}
	,__class__: flambe_platform_BasicPointer
};
var flambe_platform_BasicTexture = function(root,width,height) {
	this._parent = null;
	this.rootY = 0;
	this.rootX = 0;
	flambe_platform_BasicAsset.call(this);
	this.root = root;
	this._width = width;
	this._height = height;
};
flambe_platform_BasicTexture.__name__ = true;
flambe_platform_BasicTexture.__interfaces__ = [flambe_display_SubTexture];
flambe_platform_BasicTexture.__super__ = flambe_platform_BasicAsset;
flambe_platform_BasicTexture.prototype = $extend(flambe_platform_BasicAsset.prototype,{
	onDisposed: function() {
		if(this._parent == null) this.root.dispose();
	}
	,get_width: function() {
		return this._width;
	}
	,get_height: function() {
		return this._height;
	}
	,__class__: flambe_platform_BasicTexture
});
var flambe_subsystem_TouchSystem = function() { };
flambe_subsystem_TouchSystem.__name__ = true;
var flambe_platform_BasicTouch = function(pointer,maxPoints) {
	if(maxPoints == null) maxPoints = 4;
	this._pointer = pointer;
	this._maxPoints = maxPoints;
	this._pointMap = new haxe_ds_IntMap();
	this._points = [];
	this.down = new flambe_util_Signal1();
	this.move = new flambe_util_Signal1();
	this.up = new flambe_util_Signal1();
};
flambe_platform_BasicTouch.__name__ = true;
flambe_platform_BasicTouch.__interfaces__ = [flambe_subsystem_TouchSystem];
flambe_platform_BasicTouch.prototype = {
	submitDown: function(id,viewX,viewY) {
		if(!this._pointMap.exists(id)) {
			var point = new flambe_input_TouchPoint(id);
			point.init(viewX,viewY);
			this._pointMap.set(id,point);
			this._points.push(point);
			if(this._pointerTouch == null) {
				this._pointerTouch = point;
				this._pointer.submitDown(viewX,viewY,point._source);
			}
			this.down.emit(point);
		}
	}
	,submitMove: function(id,viewX,viewY) {
		var point = this._pointMap.get(id);
		if(point != null) {
			point.init(viewX,viewY);
			if(this._pointerTouch == point) this._pointer.submitMove(viewX,viewY,point._source);
			this.move.emit(point);
		}
	}
	,submitUp: function(id,viewX,viewY) {
		var point = this._pointMap.get(id);
		if(point != null) {
			point.init(viewX,viewY);
			this._pointMap.remove(id);
			HxOverrides.remove(this._points,point);
			if(this._pointerTouch == point) {
				this._pointerTouch = null;
				this._pointer.submitUp(viewX,viewY,point._source);
			}
			this.up.emit(point);
		}
	}
	,__class__: flambe_platform_BasicTouch
};
var flambe_sound_Sound = function() { };
flambe_sound_Sound.__name__ = true;
flambe_sound_Sound.__interfaces__ = [flambe_asset_Asset];
flambe_sound_Sound.prototype = {
	__class__: flambe_sound_Sound
};
var flambe_platform_DummySound = function() {
	flambe_platform_BasicAsset.call(this);
	this._playback = new flambe_platform_DummyPlayback(this);
};
flambe_platform_DummySound.__name__ = true;
flambe_platform_DummySound.__interfaces__ = [flambe_sound_Sound];
flambe_platform_DummySound.getInstance = function() {
	if(flambe_platform_DummySound._instance == null) flambe_platform_DummySound._instance = new flambe_platform_DummySound();
	return flambe_platform_DummySound._instance;
};
flambe_platform_DummySound.__super__ = flambe_platform_BasicAsset;
flambe_platform_DummySound.prototype = $extend(flambe_platform_BasicAsset.prototype,{
	loop: function(volume) {
		if(volume == null) volume = 1.0;
		return this._playback;
	}
	,onDisposed: function() {
	}
	,__class__: flambe_platform_DummySound
});
var flambe_sound_Playback = function() { };
flambe_sound_Playback.__name__ = true;
flambe_sound_Playback.__interfaces__ = [flambe_util_Disposable];
var flambe_platform_DummyPlayback = function(sound) {
	this._sound = sound;
	this.volume = new flambe_animation_AnimatedFloat(0);
	this._complete = new flambe_util_Value(true);
};
flambe_platform_DummyPlayback.__name__ = true;
flambe_platform_DummyPlayback.__interfaces__ = [flambe_sound_Playback];
flambe_platform_DummyPlayback.prototype = {
	dispose: function() {
	}
	,__class__: flambe_platform_DummyPlayback
};
var flambe_platform_DummyTouch = function() {
	this.down = new flambe_util_Signal1();
	this.move = new flambe_util_Signal1();
	this.up = new flambe_util_Signal1();
};
flambe_platform_DummyTouch.__name__ = true;
flambe_platform_DummyTouch.__interfaces__ = [flambe_subsystem_TouchSystem];
flambe_platform_DummyTouch.prototype = {
	__class__: flambe_platform_DummyTouch
};
var flambe_platform_EventGroup = function() {
	this._entries = [];
};
flambe_platform_EventGroup.__name__ = true;
flambe_platform_EventGroup.__interfaces__ = [flambe_util_Disposable];
flambe_platform_EventGroup.prototype = {
	addListener: function(dispatcher,type,listener) {
		dispatcher.addEventListener(type,listener,false);
		this._entries.push(new flambe_platform__$EventGroup_Entry(dispatcher,type,listener));
	}
	,addDisposingListener: function(dispatcher,type,listener) {
		var _g = this;
		this.addListener(dispatcher,type,function(event) {
			_g.dispose();
			listener(event);
		});
	}
	,dispose: function() {
		var _g = 0;
		var _g1 = this._entries;
		while(_g < _g1.length) {
			var entry = _g1[_g];
			++_g;
			entry.dispatcher.removeEventListener(entry.type,entry.listener,false);
		}
		this._entries = [];
	}
	,__class__: flambe_platform_EventGroup
};
var flambe_platform__$EventGroup_Entry = function(dispatcher,type,listener) {
	this.dispatcher = dispatcher;
	this.type = type;
	this.listener = listener;
};
flambe_platform__$EventGroup_Entry.__name__ = true;
flambe_platform__$EventGroup_Entry.prototype = {
	__class__: flambe_platform__$EventGroup_Entry
};
var flambe_platform_InternalGraphics = function() { };
flambe_platform_InternalGraphics.__name__ = true;
flambe_platform_InternalGraphics.__interfaces__ = [flambe_display_Graphics];
flambe_platform_InternalGraphics.prototype = {
	__class__: flambe_platform_InternalGraphics
};
var flambe_subsystem_RendererSystem = function() { };
flambe_subsystem_RendererSystem.__name__ = true;
flambe_subsystem_RendererSystem.prototype = {
	__class__: flambe_subsystem_RendererSystem
};
var flambe_platform_InternalRenderer = function() { };
flambe_platform_InternalRenderer.__name__ = true;
flambe_platform_InternalRenderer.__interfaces__ = [flambe_subsystem_RendererSystem];
flambe_platform_InternalRenderer.prototype = {
	__class__: flambe_platform_InternalRenderer
};
var flambe_platform_MainLoop = function() {
	this._tickables = [];
};
flambe_platform_MainLoop.__name__ = true;
flambe_platform_MainLoop.updateEntity = function(entity,dt) {
	var speed = entity._compMap.SpeedAdjuster_2;
	if(speed != null) {
		speed._realDt = dt;
		dt *= speed.scale._value;
		if(dt <= 0) {
			speed.onUpdate(dt);
			return;
		}
	}
	var p = entity.firstComponent;
	while(p != null) {
		var next = p.next;
		p.onUpdate(dt);
		p = next;
	}
	var p1 = entity.firstChild;
	while(p1 != null) {
		var next1 = p1.next;
		flambe_platform_MainLoop.updateEntity(p1,dt);
		p1 = next1;
	}
};
flambe_platform_MainLoop.prototype = {
	update: function(dt) {
		if(dt <= 0) return;
		if(dt > 1) dt = 1;
		var ii = 0;
		while(ii < this._tickables.length) {
			var t = this._tickables[ii];
			if(t == null || t.update(dt)) this._tickables.splice(ii,1); else ++ii;
		}
		flambe_System.volume.update(dt);
		flambe_platform_MainLoop.updateEntity(flambe_System.root,dt);
	}
	,render: function(renderer) {
		var graphics = renderer.graphics;
		if(graphics != null) {
			renderer.willRender();
			flambe_display_Sprite.render(flambe_System.root,graphics);
			renderer.didRender();
		}
	}
	,addTickable: function(t) {
		this._tickables.push(t);
	}
	,__class__: flambe_platform_MainLoop
};
var flambe_platform_MathUtil = function() { };
flambe_platform_MathUtil.__name__ = true;
flambe_platform_MathUtil.nextPowerOfTwo = function(n) {
	var p = 1;
	while(p < n) p <<= 1;
	return p;
};
var flambe_platform_MouseCodes = function() { };
flambe_platform_MouseCodes.__name__ = true;
flambe_platform_MouseCodes.toButton = function(buttonCode) {
	switch(buttonCode) {
	case 0:
		return flambe_input_MouseButton.Left;
	case 1:
		return flambe_input_MouseButton.Middle;
	case 2:
		return flambe_input_MouseButton.Right;
	}
	return flambe_input_MouseButton.Unknown(buttonCode);
};
var flambe_platform_TextureRoot = function() { };
flambe_platform_TextureRoot.__name__ = true;
var flambe_platform_Tickable = function() { };
flambe_platform_Tickable.__name__ = true;
flambe_platform_Tickable.prototype = {
	__class__: flambe_platform_Tickable
};
var flambe_platform_html_CanvasGraphics = function(canvas,alpha) {
	this._firstDraw = false;
	this._canvasCtx = canvas.getContext("2d",{ alpha : alpha});
};
flambe_platform_html_CanvasGraphics.__name__ = true;
flambe_platform_html_CanvasGraphics.__interfaces__ = [flambe_platform_InternalGraphics];
flambe_platform_html_CanvasGraphics.prototype = {
	save: function() {
		this._canvasCtx.save();
	}
	,translate: function(x,y) {
		this._canvasCtx.translate(x | 0,y | 0);
	}
	,scale: function(x,y) {
		this._canvasCtx.scale(x,y);
	}
	,rotate: function(rotation) {
		this._canvasCtx.rotate(rotation * 3.141592653589793 / 180);
	}
	,transform: function(m00,m10,m01,m11,m02,m12) {
		this._canvasCtx.transform(m00,m10,m01,m11,m02,m12);
	}
	,restore: function() {
		this._canvasCtx.restore();
	}
	,drawTexture: function(texture,destX,destY) {
		this.drawSubTexture(texture,destX,destY,0,0,texture.get_width(),texture.get_height());
	}
	,drawSubTexture: function(texture,destX,destY,sourceX,sourceY,sourceW,sourceH) {
		if(this._firstDraw) {
			this._firstDraw = false;
			this._canvasCtx.globalCompositeOperation = "copy";
			this.drawSubTexture(texture,destX,destY,sourceX,sourceY,sourceW,sourceH);
			this._canvasCtx.globalCompositeOperation = "source-over";
			return;
		}
		var texture1 = texture;
		var root = texture1.root;
		this._canvasCtx.drawImage(root.image,texture1.rootX + sourceX | 0,texture1.rootY + sourceY | 0,sourceW | 0,sourceH | 0,destX | 0,destY | 0,sourceW | 0,sourceH | 0);
	}
	,drawPattern: function(texture,x,y,width,height) {
		if(this._firstDraw) {
			this._firstDraw = false;
			this._canvasCtx.globalCompositeOperation = "copy";
			this.drawPattern(texture,x,y,width,height);
			this._canvasCtx.globalCompositeOperation = "source-over";
			return;
		}
		var texture1 = texture;
		var root = texture1.root;
		this._canvasCtx.fillStyle = texture1.getPattern();
		this._canvasCtx.fillRect(x | 0,y | 0,width | 0,height | 0);
	}
	,fillRect: function(color,x,y,width,height) {
		if(this._firstDraw) {
			this._firstDraw = false;
			this._canvasCtx.globalCompositeOperation = "copy";
			this.fillRect(color,x,y,width,height);
			this._canvasCtx.globalCompositeOperation = "source-over";
			return;
		}
		var hex = (16777215 & color).toString(16);
		while(hex.length < 6) hex = "0" + Std.string(hex);
		this._canvasCtx.fillStyle = "#" + Std.string(hex);
		this._canvasCtx.fillRect(x | 0,y | 0,width | 0,height | 0);
	}
	,multiplyAlpha: function(factor) {
		this._canvasCtx.globalAlpha *= factor;
	}
	,setBlendMode: function(blendMode) {
		var op;
		switch(blendMode[1]) {
		case 0:
			op = "source-over";
			break;
		case 1:
			op = "lighter";
			break;
		case 2:
			op = "destination-in";
			break;
		case 3:
			op = "copy";
			break;
		}
		this._canvasCtx.globalCompositeOperation = op;
	}
	,applyScissor: function(x,y,width,height) {
		this._canvasCtx.beginPath();
		this._canvasCtx.rect(x | 0,y | 0,width | 0,height | 0);
		this._canvasCtx.clip();
	}
	,willRender: function() {
		this._firstDraw = true;
	}
	,didRender: function() {
	}
	,onResize: function(width,height) {
	}
	,__class__: flambe_platform_html_CanvasGraphics
};
var flambe_platform_html_CanvasRenderer = function(canvas) {
	this.graphics = new flambe_platform_html_CanvasGraphics(canvas,false);
	this._hasGPU = new flambe_util_Value(true);
};
flambe_platform_html_CanvasRenderer.__name__ = true;
flambe_platform_html_CanvasRenderer.__interfaces__ = [flambe_platform_InternalRenderer];
flambe_platform_html_CanvasRenderer.prototype = {
	get_type: function() {
		return flambe_subsystem_RendererType.Canvas;
	}
	,createTextureFromImage: function(image) {
		var root = new flambe_platform_html_CanvasTextureRoot(flambe_platform_html_CanvasRenderer.CANVAS_TEXTURES?flambe_platform_html_HtmlUtil.createCanvas(image):image);
		return root.createTexture(root.width,root.height);
	}
	,getCompressedTextureFormats: function() {
		return [];
	}
	,createCompressedTexture: function(format,data) {
		return null;
	}
	,willRender: function() {
		this.graphics.willRender();
	}
	,didRender: function() {
		this.graphics.didRender();
	}
	,__class__: flambe_platform_html_CanvasRenderer
};
var flambe_platform_html_CanvasTexture = function(root,width,height) {
	this._rootUpdateCount = 0;
	this._pattern = null;
	flambe_platform_BasicTexture.call(this,root,width,height);
};
flambe_platform_html_CanvasTexture.__name__ = true;
flambe_platform_html_CanvasTexture.__super__ = flambe_platform_BasicTexture;
flambe_platform_html_CanvasTexture.prototype = $extend(flambe_platform_BasicTexture.prototype,{
	getPattern: function() {
		if(this._rootUpdateCount != this.root.updateCount || this._pattern == null) {
			this._rootUpdateCount = this.root.updateCount;
			this._pattern = this.root.createPattern(this.rootX,this.rootY,this._width,this._height);
		}
		return this._pattern;
	}
	,__class__: flambe_platform_html_CanvasTexture
});
var flambe_platform_html_CanvasTextureRoot = function(image) {
	this._graphics = null;
	this.updateCount = 0;
	flambe_platform_BasicAsset.call(this);
	this.image = image;
	this.width = image.width;
	this.height = image.height;
};
flambe_platform_html_CanvasTextureRoot.__name__ = true;
flambe_platform_html_CanvasTextureRoot.__interfaces__ = [flambe_platform_TextureRoot];
flambe_platform_html_CanvasTextureRoot.__super__ = flambe_platform_BasicAsset;
flambe_platform_html_CanvasTextureRoot.prototype = $extend(flambe_platform_BasicAsset.prototype,{
	createTexture: function(width,height) {
		return new flambe_platform_html_CanvasTexture(this,width,height);
	}
	,createPattern: function(x,y,width,height) {
		var ctx2d = this.getContext2d();
		var source = this.image;
		if(x != 0 || y != 0 || width != this.width || height != this.height) {
			source = flambe_platform_html_HtmlUtil.createEmptyCanvas(width,height);
			var crop = source.getContext("2d");
			crop.globalCompositeOperation = "copy";
			crop.drawImage(this.image,-x,-y);
		}
		return ctx2d.createPattern(source,"repeat");
	}
	,getContext2d: function() {
		if(!js_Boot.__instanceof(this.image,HTMLCanvasElement)) this.image = flambe_platform_html_HtmlUtil.createCanvas(this.image);
		var canvas = this.image;
		return canvas.getContext("2d");
	}
	,onDisposed: function() {
		this.image = null;
		this._graphics = null;
	}
	,__class__: flambe_platform_html_CanvasTextureRoot
});
var flambe_platform_html_HtmlAssetPackLoader = function(platform,manifest) {
	flambe_platform_BasicAssetPackLoader.call(this,platform,manifest);
};
flambe_platform_html_HtmlAssetPackLoader.__name__ = true;
flambe_platform_html_HtmlAssetPackLoader.detectImageFormats = function(fn) {
	var formats = [flambe_asset_AssetFormat.PNG,flambe_asset_AssetFormat.JPG,flambe_asset_AssetFormat.GIF];
	var formatTests = 2;
	var checkRemaining = function() {
		--formatTests;
		if(formatTests == 0) fn(formats);
	};
	var webp;
	var _this = window.document;
	webp = _this.createElement("img");
	webp.onload = webp.onerror = function(_) {
		if(webp.width == 1) formats.unshift(flambe_asset_AssetFormat.WEBP);
		checkRemaining();
	};
	webp.src = "data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==";
	var jxr;
	var _this1 = window.document;
	jxr = _this1.createElement("img");
	jxr.onload = jxr.onerror = function(_1) {
		if(jxr.width == 1) formats.unshift(flambe_asset_AssetFormat.JXR);
		checkRemaining();
	};
	jxr.src = "data:image/vnd.ms-photo;base64,SUm8AQgAAAAFAAG8AQAQAAAASgAAAIC8BAABAAAAAQAAAIG8BAABAAAAAQAAAMC8BAABAAAAWgAAAMG8BAABAAAAHwAAAAAAAAAkw91vA07+S7GFPXd2jckNV01QSE9UTwAZAYBxAAAAABP/gAAEb/8AAQAAAQAAAA==";
};
flambe_platform_html_HtmlAssetPackLoader.detectAudioFormats = function() {
	var audio;
	var _this = window.document;
	audio = _this.createElement("audio");
	if(audio == null || $bind(audio,audio.canPlayType) == null) return [];
	var blacklist = new EReg("\\b(iPhone|iPod|iPad|Android|Windows Phone)\\b","");
	var userAgent = window.navigator.userAgent;
	if(!flambe_platform_html_WebAudioSound.get_supported() && blacklist.match(userAgent)) return [];
	var types = [{ format : flambe_asset_AssetFormat.M4A, mimeType : "audio/mp4; codecs=mp4a"},{ format : flambe_asset_AssetFormat.MP3, mimeType : "audio/mpeg"},{ format : flambe_asset_AssetFormat.OPUS, mimeType : "audio/ogg; codecs=opus"},{ format : flambe_asset_AssetFormat.OGG, mimeType : "audio/ogg; codecs=vorbis"},{ format : flambe_asset_AssetFormat.WAV, mimeType : "audio/wav"}];
	var result = [];
	var _g = 0;
	while(_g < types.length) {
		var type = types[_g];
		++_g;
		var canPlayType = "";
		try {
			canPlayType = audio.canPlayType(type.mimeType);
		} catch( _ ) {
		}
		if(canPlayType != "") result.push(type.format);
	}
	return result;
};
flambe_platform_html_HtmlAssetPackLoader.supportsBlob = function() {
	if(flambe_platform_html_HtmlAssetPackLoader._detectBlobSupport) {
		flambe_platform_html_HtmlAssetPackLoader._detectBlobSupport = false;
		if(new EReg("\\bSilk\\b","").match(window.navigator.userAgent)) return false;
		if(window.Blob == null) return false;
		var xhr = new XMLHttpRequest();
		xhr.open("GET",".",true);
		if(xhr.responseType != "") return false;
		xhr.responseType = "blob";
		if(xhr.responseType != "blob") return false;
		flambe_platform_html_HtmlAssetPackLoader._URL = flambe_platform_html_HtmlUtil.loadExtension("URL").value;
	}
	return flambe_platform_html_HtmlAssetPackLoader._URL != null && flambe_platform_html_HtmlAssetPackLoader._URL.createObjectURL != null;
};
flambe_platform_html_HtmlAssetPackLoader.__super__ = flambe_platform_BasicAssetPackLoader;
flambe_platform_html_HtmlAssetPackLoader.prototype = $extend(flambe_platform_BasicAssetPackLoader.prototype,{
	loadEntry: function(url,entry) {
		var _g1 = this;
		var _g = entry.format;
		switch(_g[1]) {
		case 0:case 1:case 2:case 3:case 4:
			var image;
			var _this = window.document;
			image = _this.createElement("img");
			var events = new flambe_platform_EventGroup();
			events.addDisposingListener(image,"load",function(_) {
				if(flambe_platform_html_HtmlAssetPackLoader.supportsBlob()) flambe_platform_html_HtmlAssetPackLoader._URL.revokeObjectURL(image.src);
				var texture = _g1._platform.getRenderer().createTextureFromImage(image);
				if(texture != null) _g1.handleLoad(entry,texture); else _g1.handleTextureError(entry);
			});
			events.addDisposingListener(image,"error",function(_1) {
				_g1.handleError(entry,"Failed to load image");
			});
			if(flambe_platform_html_HtmlAssetPackLoader.supportsBlob()) this.download(url,entry,"blob",function(blob) {
				image.src = flambe_platform_html_HtmlAssetPackLoader._URL.createObjectURL(blob);
			}); else image.src = url;
			break;
		case 5:case 6:case 7:
			this.download(url,entry,"arraybuffer",function(buffer) {
				var texture1 = _g1._platform.getRenderer().createCompressedTexture(entry.format,null);
				if(texture1 != null) _g1.handleLoad(entry,texture1); else _g1.handleTextureError(entry);
			});
			break;
		case 8:case 9:case 10:case 11:case 12:
			if(flambe_platform_html_WebAudioSound.get_supported()) this.download(url,entry,"arraybuffer",function(buffer1) {
				flambe_platform_html_WebAudioSound.ctx.decodeAudioData(buffer1,function(decoded) {
					_g1.handleLoad(entry,new flambe_platform_html_WebAudioSound(decoded));
				},function() {
					_g1.handleLoad(entry,flambe_platform_DummySound.getInstance());
				});
			}); else {
				var audio;
				var _this1 = window.document;
				audio = _this1.createElement("audio");
				audio.preload = "auto";
				var ref = ++flambe_platform_html_HtmlAssetPackLoader._mediaRefCount;
				if(flambe_platform_html_HtmlAssetPackLoader._mediaElements == null) flambe_platform_html_HtmlAssetPackLoader._mediaElements = new haxe_ds_IntMap();
				flambe_platform_html_HtmlAssetPackLoader._mediaElements.set(ref,audio);
				var events1 = new flambe_platform_EventGroup();
				events1.addDisposingListener(audio,"canplaythrough",function(_2) {
					flambe_platform_html_HtmlAssetPackLoader._mediaElements.remove(ref);
					_g1.handleLoad(entry,new flambe_platform_html_HtmlSound(audio));
				});
				events1.addDisposingListener(audio,"error",function(_3) {
					flambe_platform_html_HtmlAssetPackLoader._mediaElements.remove(ref);
					var code = audio.error.code;
					if(code == 3 || code == 4) _g1.handleLoad(entry,flambe_platform_DummySound.getInstance()); else _g1.handleError(entry,"Failed to load audio: " + audio.error.code);
				});
				events1.addListener(audio,"progress",function(_4) {
					if(audio.buffered.length > 0 && audio.duration > 0) {
						var progress = audio.buffered.end(0) / audio.duration;
						_g1.handleProgress(entry,progress * entry.bytes | 0);
					}
				});
				audio.src = url;
				audio.load();
			}
			break;
		case 13:
			this.download(url,entry,"text",function(text) {
				_g1.handleLoad(entry,new flambe_platform_BasicFile(text));
			});
			break;
		}
	}
	,getAssetFormats: function(fn) {
		var _g = this;
		if(flambe_platform_html_HtmlAssetPackLoader._supportedFormats == null) {
			flambe_platform_html_HtmlAssetPackLoader._supportedFormats = new flambe_util_Promise();
			flambe_platform_html_HtmlAssetPackLoader.detectImageFormats(function(imageFormats) {
				flambe_platform_html_HtmlAssetPackLoader._supportedFormats.set_result(_g._platform.getRenderer().getCompressedTextureFormats().concat(imageFormats).concat(flambe_platform_html_HtmlAssetPackLoader.detectAudioFormats()).concat([flambe_asset_AssetFormat.Data]));
			});
		}
		flambe_platform_html_HtmlAssetPackLoader._supportedFormats.get(fn);
	}
	,download: function(url,entry,responseType,onLoad) {
		var _g = this;
		var xhr = null;
		var start = null;
		var intervalId = 0;
		var hasInterval = false;
		var clearRetryInterval = function() {
			if(hasInterval) {
				hasInterval = false;
				window.clearInterval(intervalId);
			}
		};
		var retries = 3;
		var maybeRetry = function() {
			--retries;
			if(retries >= 0) {
				start();
				return true;
			}
			return false;
		};
		start = function() {
			clearRetryInterval();
			if(xhr != null) xhr.abort();
			xhr = new XMLHttpRequest();
			xhr.open("GET",url,true);
			xhr.responseType = responseType;
			var lastProgress = 0.0;
			xhr.onprogress = function(event) {
				if(!hasInterval) {
					hasInterval = true;
					intervalId = window.setInterval(function() {
						if(xhr.readyState != 4 && Date.now() - lastProgress > 5000) {
							if(!maybeRetry()) {
								clearRetryInterval();
								_g.handleError(entry,"Download stalled");
							}
						}
					},1000);
				}
				lastProgress = Date.now();
				_g.handleProgress(entry,event.loaded);
			};
			xhr.onerror = function(_) {
				if(xhr.status != 0 || !maybeRetry()) {
					clearRetryInterval();
					_g.handleError(entry,"HTTP error " + xhr.status);
				}
			};
			xhr.onload = function(_1) {
				var response = xhr.response;
				if(response == null) response = xhr.responseText;
				clearRetryInterval();
				onLoad(response);
			};
			xhr.send();
		};
		start();
	}
	,__class__: flambe_platform_html_HtmlAssetPackLoader
});
var flambe_platform_html_HtmlMouse = function(pointer,canvas) {
	flambe_platform_BasicMouse.call(this,pointer);
	this._canvas = canvas;
};
flambe_platform_html_HtmlMouse.__name__ = true;
flambe_platform_html_HtmlMouse.__super__ = flambe_platform_BasicMouse;
flambe_platform_html_HtmlMouse.prototype = $extend(flambe_platform_BasicMouse.prototype,{
	__class__: flambe_platform_html_HtmlMouse
});
var flambe_platform_html_HtmlSound = function(audioElement) {
	flambe_platform_BasicAsset.call(this);
	this.audioElement = audioElement;
};
flambe_platform_html_HtmlSound.__name__ = true;
flambe_platform_html_HtmlSound.__interfaces__ = [flambe_sound_Sound];
flambe_platform_html_HtmlSound.__super__ = flambe_platform_BasicAsset;
flambe_platform_html_HtmlSound.prototype = $extend(flambe_platform_BasicAsset.prototype,{
	loop: function(volume) {
		if(volume == null) volume = 1.0;
		return new flambe_platform_html__$HtmlSound_HtmlPlayback(this,volume,true);
	}
	,onDisposed: function() {
		this.audioElement = null;
	}
	,__class__: flambe_platform_html_HtmlSound
});
var flambe_platform_html__$HtmlSound_HtmlPlayback = function(sound,volume,loop) {
	var _g = this;
	this._sound = sound;
	this._tickableAdded = false;
	var _this = window.document;
	this._clonedElement = _this.createElement("audio");
	this._clonedElement.loop = loop;
	this._clonedElement.src = sound.audioElement.src;
	this.volume = new flambe_animation_AnimatedFloat(volume,function(_,_1) {
		_g.updateVolume();
	});
	this.updateVolume();
	this._complete = new flambe_util_Value(false);
	this.playAudio();
	if(flambe_System.hidden._value) this.set_paused(true);
};
flambe_platform_html__$HtmlSound_HtmlPlayback.__name__ = true;
flambe_platform_html__$HtmlSound_HtmlPlayback.__interfaces__ = [flambe_platform_Tickable,flambe_sound_Playback];
flambe_platform_html__$HtmlSound_HtmlPlayback.prototype = {
	set_paused: function(paused) {
		if(this._clonedElement.paused != paused) {
			if(paused) this._clonedElement.pause(); else this.playAudio();
		}
		return paused;
	}
	,update: function(dt) {
		this.volume.update(dt);
		this._complete.set__(this._clonedElement.ended);
		if(this._complete._value || this._clonedElement.paused) {
			this._tickableAdded = false;
			this._volumeBinding.dispose();
			this._hideBinding.dispose();
			return true;
		}
		return false;
	}
	,dispose: function() {
		this.set_paused(true);
		this._complete.set__(true);
	}
	,playAudio: function() {
		var _g = this;
		this._clonedElement.play();
		if(!this._tickableAdded) {
			flambe_platform_html_HtmlPlatform.instance.mainLoop.addTickable(this);
			this._tickableAdded = true;
			this._volumeBinding = flambe_System.volume.get_changed().connect(function(_,_1) {
				_g.updateVolume();
			});
			this._hideBinding = flambe_System.hidden.get_changed().connect(function(hidden,_2) {
				if(hidden) {
					_g._wasPaused = _g._clonedElement.paused;
					_g.set_paused(true);
				} else _g.set_paused(_g._wasPaused);
			});
		}
	}
	,updateVolume: function() {
		this._clonedElement.volume = flambe_System.volume._value * this.volume._value;
	}
	,__class__: flambe_platform_html__$HtmlSound_HtmlPlayback
};
var flambe_subsystem_StageSystem = function() { };
flambe_subsystem_StageSystem.__name__ = true;
flambe_subsystem_StageSystem.prototype = {
	__class__: flambe_subsystem_StageSystem
};
var flambe_platform_html_HtmlStage = function(canvas) {
	var _g = this;
	this._canvas = canvas;
	this.resize = new flambe_util_Signal0();
	this.scaleFactor = flambe_platform_html_HtmlStage.computeScaleFactor();
	if(this.scaleFactor != 1) {
		flambe_platform_html_HtmlUtil.setVendorStyle(this._canvas,"transform-origin","top left");
		flambe_platform_html_HtmlUtil.setVendorStyle(this._canvas,"transform","scale(" + 1 / this.scaleFactor + ")");
	}
	if(flambe_platform_html_HtmlUtil.SHOULD_HIDE_MOBILE_BROWSER) {
		window.addEventListener("orientationchange",function(_) {
			flambe_platform_html_HtmlUtil.callLater($bind(_g,_g.hideMobileBrowser),200);
		},false);
		this.hideMobileBrowser();
	}
	window.addEventListener("resize",$bind(this,this.onWindowResize),false);
	this.onWindowResize(null);
	this.orientation = new flambe_util_Value(null);
	if(window.orientation != null) {
		window.addEventListener("orientationchange",$bind(this,this.onOrientationChange),false);
		this.onOrientationChange(null);
	}
	this.fullscreen = new flambe_util_Value(false);
	flambe_platform_html_HtmlUtil.addVendorListener(window.document,"fullscreenchange",function(_1) {
		_g.updateFullscreen();
	},false);
	this.updateFullscreen();
};
flambe_platform_html_HtmlStage.__name__ = true;
flambe_platform_html_HtmlStage.__interfaces__ = [flambe_subsystem_StageSystem];
flambe_platform_html_HtmlStage.computeScaleFactor = function() {
	var devicePixelRatio = window.devicePixelRatio;
	if(devicePixelRatio == null) devicePixelRatio = 1;
	var canvas;
	var _this = window.document;
	canvas = _this.createElement("canvas");
	var ctx = canvas.getContext("2d");
	var backingStorePixelRatio = flambe_platform_html_HtmlUtil.loadExtension("backingStorePixelRatio",ctx).value;
	if(backingStorePixelRatio == null) backingStorePixelRatio = 1;
	var scale = devicePixelRatio / backingStorePixelRatio;
	var screenWidth = window.screen.width;
	var screenHeight = window.screen.height;
	if(scale * screenWidth > 1136 || scale * screenHeight > 1136) return 1;
	return scale;
};
flambe_platform_html_HtmlStage.prototype = {
	get_width: function() {
		return this._canvas.width;
	}
	,get_height: function() {
		return this._canvas.height;
	}
	,onWindowResize: function(_) {
		var container = this._canvas.parentElement;
		var rect = container.getBoundingClientRect();
		this.resizeCanvas(rect.width,rect.height);
	}
	,resizeCanvas: function(width,height) {
		var scaledWidth = this.scaleFactor * width;
		var scaledHeight = this.scaleFactor * height;
		if(this._canvas.width == scaledWidth && this._canvas.height == scaledHeight) return false;
		this._canvas.width = scaledWidth | 0;
		this._canvas.height = scaledHeight | 0;
		this.resize.emit();
		return true;
	}
	,hideMobileBrowser: function() {
		var _g = this;
		var mobileAddressBar = 100;
		var htmlStyle = window.document.documentElement.style;
		htmlStyle.height = window.innerHeight + mobileAddressBar + "px";
		htmlStyle.width = window.innerWidth + "px";
		htmlStyle.overflow = "visible";
		flambe_platform_html_HtmlUtil.callLater(function() {
			flambe_platform_html_HtmlUtil.hideMobileBrowser();
			flambe_platform_html_HtmlUtil.callLater(function() {
				htmlStyle.height = window.innerHeight + "px";
				_g.onWindowResize(null);
			},100);
		});
	}
	,onOrientationChange: function(_) {
		var value = flambe_platform_html_HtmlUtil.orientation(window.orientation);
		this.orientation.set__(value);
	}
	,updateFullscreen: function() {
		var state = flambe_platform_html_HtmlUtil.loadFirstExtension(["fullscreen","fullScreen","isFullScreen"],window.document).value;
		this.fullscreen.set__(state == true);
	}
	,__class__: flambe_platform_html_HtmlStage
};
var flambe_platform_html_HtmlUtil = function() { };
flambe_platform_html_HtmlUtil.__name__ = true;
flambe_platform_html_HtmlUtil.callLater = function(func,delay) {
	if(delay == null) delay = 0;
	window.setTimeout(func,delay);
};
flambe_platform_html_HtmlUtil.hideMobileBrowser = function() {
	window.scrollTo(1,0);
};
flambe_platform_html_HtmlUtil.loadExtension = function(name,obj) {
	if(obj == null) obj = window;
	var extension = Reflect.field(obj,name);
	if(extension != null) return { prefix : "", field : name, value : extension};
	var capitalized = name.charAt(0).toUpperCase() + HxOverrides.substr(name,1,null);
	var _g = 0;
	var _g1 = flambe_platform_html_HtmlUtil.VENDOR_PREFIXES;
	while(_g < _g1.length) {
		var prefix = _g1[_g];
		++_g;
		var field = prefix + capitalized;
		var extension1 = Reflect.field(obj,field);
		if(extension1 != null) return { prefix : prefix, field : field, value : extension1};
	}
	return { prefix : null, field : null, value : null};
};
flambe_platform_html_HtmlUtil.loadFirstExtension = function(names,obj) {
	var _g = 0;
	while(_g < names.length) {
		var name = names[_g];
		++_g;
		var extension = flambe_platform_html_HtmlUtil.loadExtension(name,obj);
		if(extension.field != null) return extension;
	}
	return { prefix : null, field : null, value : null};
};
flambe_platform_html_HtmlUtil.polyfill = function(name,obj) {
	if(obj == null) obj = window;
	var value = flambe_platform_html_HtmlUtil.loadExtension(name,obj).value;
	if(value == null) return false;
	obj[name] = value;
	return true;
};
flambe_platform_html_HtmlUtil.setVendorStyle = function(element,name,value) {
	var style = element.style;
	var _g = 0;
	var _g1 = flambe_platform_html_HtmlUtil.VENDOR_PREFIXES;
	while(_g < _g1.length) {
		var prefix = _g1[_g];
		++_g;
		style.setProperty("-" + prefix + "-" + name,value);
	}
	style.setProperty(name,value);
};
flambe_platform_html_HtmlUtil.addVendorListener = function(dispatcher,type,listener,useCapture) {
	var _g = 0;
	var _g1 = flambe_platform_html_HtmlUtil.VENDOR_PREFIXES;
	while(_g < _g1.length) {
		var prefix = _g1[_g];
		++_g;
		dispatcher.addEventListener(prefix + type,listener,useCapture);
	}
	dispatcher.addEventListener(type,listener,useCapture);
};
flambe_platform_html_HtmlUtil.orientation = function(angle) {
	switch(angle) {
	case -90:case 90:
		return flambe_display_Orientation.Landscape;
	default:
		return flambe_display_Orientation.Portrait;
	}
};
flambe_platform_html_HtmlUtil.createEmptyCanvas = function(width,height) {
	var canvas;
	var _this = window.document;
	canvas = _this.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	return canvas;
};
flambe_platform_html_HtmlUtil.createCanvas = function(source) {
	var canvas = flambe_platform_html_HtmlUtil.createEmptyCanvas(source.width,source.height);
	var ctx = canvas.getContext("2d");
	ctx.save();
	ctx.globalCompositeOperation = "copy";
	ctx.drawImage(source,0,0);
	ctx.restore();
	return canvas;
};
flambe_platform_html_HtmlUtil.detectSlowDriver = function(gl) {
	var windows = window.navigator.platform.indexOf("Win") >= 0;
	if(windows) {
		var chrome = window.chrome != null;
		if(chrome) {
			var _g = 0;
			var _g1 = gl.getSupportedExtensions();
			while(_g < _g1.length) {
				var ext = _g1[_g];
				++_g;
				if(ext.indexOf("WEBGL_compressed_texture") >= 0) return false;
			}
			return true;
		}
	}
	return false;
};
flambe_platform_html_HtmlUtil.fixAndroidMath = function() {
	if(window.navigator.userAgent.indexOf("Linux; U; Android 4") >= 0) {
		var sin = Math.sin;
		var cos = Math.cos;
		Math.sin = function(x) {
			if(x == 0) return 0; else return sin(x);
		};
		Math.cos = function(x1) {
			if(x1 == 0) return 1; else return cos(x1);
		};
	}
};
var flambe_platform_html_WebAudioSound = function(buffer) {
	flambe_platform_BasicAsset.call(this);
	this.buffer = buffer;
};
flambe_platform_html_WebAudioSound.__name__ = true;
flambe_platform_html_WebAudioSound.__interfaces__ = [flambe_sound_Sound];
flambe_platform_html_WebAudioSound.get_supported = function() {
	if(flambe_platform_html_WebAudioSound._detectSupport) {
		flambe_platform_html_WebAudioSound._detectSupport = false;
		var AudioContext = flambe_platform_html_HtmlUtil.loadExtension("AudioContext").value;
		if(AudioContext != null) {
			flambe_platform_html_WebAudioSound.ctx = new AudioContext();
			flambe_platform_html_WebAudioSound.gain = flambe_platform_html_WebAudioSound.createGain();
			flambe_platform_html_WebAudioSound.gain.connect(flambe_platform_html_WebAudioSound.ctx.destination);
			flambe_System.volume.watch(function(volume,_) {
				flambe_platform_html_WebAudioSound.gain.gain.value = volume;
			});
		}
	}
	return flambe_platform_html_WebAudioSound.ctx != null;
};
flambe_platform_html_WebAudioSound.createGain = function() {
	if(flambe_platform_html_WebAudioSound.ctx.createGain != null) return flambe_platform_html_WebAudioSound.ctx.createGain(); else return flambe_platform_html_WebAudioSound.ctx.createGainNode();
};
flambe_platform_html_WebAudioSound.start = function(node,time) {
	if(node.start != null) node.start(time); else node.noteOn(time);
};
flambe_platform_html_WebAudioSound.__super__ = flambe_platform_BasicAsset;
flambe_platform_html_WebAudioSound.prototype = $extend(flambe_platform_BasicAsset.prototype,{
	loop: function(volume) {
		if(volume == null) volume = 1.0;
		return new flambe_platform_html__$WebAudioSound_WebAudioPlayback(this,volume,true);
	}
	,get_duration: function() {
		return this.buffer.duration;
	}
	,onDisposed: function() {
		this.buffer = null;
	}
	,__class__: flambe_platform_html_WebAudioSound
});
var flambe_platform_html__$WebAudioSound_WebAudioPlayback = function(sound,volume,loop) {
	var _g = this;
	this._sound = sound;
	this._head = flambe_platform_html_WebAudioSound.gain;
	this._complete = new flambe_util_Value(false);
	this._sourceNode = flambe_platform_html_WebAudioSound.ctx.createBufferSource();
	this._sourceNode.buffer = sound.buffer;
	this._sourceNode.loop = loop;
	this._sourceNode.onended = function() {
		_g._complete.set__(true);
	};
	flambe_platform_html_WebAudioSound.start(this._sourceNode,0);
	this.playAudio();
	this.volume = new flambe_animation_AnimatedFloat(volume,function(v,_) {
		_g.setVolume(v);
	});
	if(volume != 1) this.setVolume(volume);
	if(flambe_System.hidden._value) this.set_paused(true);
};
flambe_platform_html__$WebAudioSound_WebAudioPlayback.__name__ = true;
flambe_platform_html__$WebAudioSound_WebAudioPlayback.__interfaces__ = [flambe_platform_Tickable,flambe_sound_Playback];
flambe_platform_html__$WebAudioSound_WebAudioPlayback.prototype = {
	set_paused: function(paused) {
		if(paused != this._pausedAt >= 0) {
			if(paused) {
				this._sourceNode.disconnect();
				this._pausedAt = this.get_position();
			} else this.playAudio();
		}
		return paused;
	}
	,get_position: function() {
		if(this._complete._value) return this._sound.get_duration(); else if(this._pausedAt >= 0) return this._pausedAt; else {
			var elapsed = flambe_platform_html_WebAudioSound.ctx.currentTime - this._startedAt;
			return elapsed % this._sound.get_duration();
		}
	}
	,update: function(dt) {
		this.volume.update(dt);
		if(this._sourceNode.playbackState == 3) this._complete.set__(true);
		if(this._complete._value || this._pausedAt >= 0) {
			this._tickableAdded = false;
			this._hideBinding.dispose();
			return true;
		}
		return false;
	}
	,dispose: function() {
		this.set_paused(true);
		this._complete.set__(true);
	}
	,setVolume: function(volume) {
		if(this._gainNode == null) {
			this._gainNode = flambe_platform_html_WebAudioSound.createGain();
			this.insertNode(this._gainNode);
		}
		this._gainNode.gain.value = volume;
	}
	,insertNode: function(head) {
		if(!(this._pausedAt >= 0)) {
			this._sourceNode.disconnect();
			this._sourceNode.connect(head);
		}
		head.connect(this._head);
		this._head = head;
	}
	,playAudio: function() {
		var _g = this;
		this._sourceNode.connect(this._head);
		this._startedAt = flambe_platform_html_WebAudioSound.ctx.currentTime;
		this._pausedAt = -1;
		if(!this._tickableAdded) {
			flambe_platform_html_HtmlPlatform.instance.mainLoop.addTickable(this);
			this._tickableAdded = true;
			this._hideBinding = flambe_System.hidden.get_changed().connect(function(hidden,_) {
				if(hidden) {
					_g._wasPaused = _g._pausedAt >= 0;
					_g.set_paused(true);
				} else _g.set_paused(_g._wasPaused);
			});
		}
	}
	,__class__: flambe_platform_html__$WebAudioSound_WebAudioPlayback
};
var flambe_platform_html_WebGLBatcher = function(gl) {
	this._backbufferHeight = 0;
	this._backbufferWidth = 0;
	this._dataOffset = 0;
	this._maxQuads = 0;
	this._quads = 0;
	this._pendingSetScissor = false;
	this._currentRenderTarget = null;
	this._currentTexture = null;
	this._currentShader = null;
	this._currentBlendMode = null;
	this._lastScissor = null;
	this._lastTexture = null;
	this._lastShader = null;
	this._lastRenderTarget = null;
	this._lastBlendMode = null;
	this._gl = gl;
	gl.clearColor(0,0,0,0);
	gl.enable(3042);
	gl.pixelStorei(37441,1);
	this._vertexBuffer = gl.createBuffer();
	gl.bindBuffer(34962,this._vertexBuffer);
	this._quadIndexBuffer = gl.createBuffer();
	gl.bindBuffer(34963,this._quadIndexBuffer);
	this._drawTextureShader = new flambe_platform_shader_DrawTextureGL(gl);
	this._drawPatternShader = new flambe_platform_shader_DrawPatternGL(gl);
	this._fillRectShader = new flambe_platform_shader_FillRectGL(gl);
	this.resize(16);
};
flambe_platform_html_WebGLBatcher.__name__ = true;
flambe_platform_html_WebGLBatcher.prototype = {
	resizeBackbuffer: function(width,height) {
		this._gl.viewport(0,0,width,height);
		this._backbufferWidth = width;
		this._backbufferHeight = height;
	}
	,willRender: function() {
	}
	,didRender: function() {
		this.flush();
	}
	,bindTexture: function(texture) {
		this.flush();
		this._lastTexture = null;
		this._currentTexture = null;
		this._gl.bindTexture(3553,texture);
	}
	,deleteTexture: function(texture) {
		if(this._lastTexture != null && this._lastTexture.root == texture) {
			this.flush();
			this._lastTexture = null;
			this._currentTexture = null;
		}
		this._gl.deleteTexture(texture.nativeTexture);
	}
	,deleteFramebuffer: function(texture) {
		if(texture == this._lastRenderTarget) {
			this.flush();
			this._lastRenderTarget = null;
			this._currentRenderTarget = null;
		}
		this._gl.deleteFramebuffer(texture.framebuffer);
	}
	,prepareDrawTexture: function(renderTarget,blendMode,scissor,texture) {
		if(texture != this._lastTexture) {
			this.flush();
			this._lastTexture = texture;
		}
		return this.prepareQuad(5,renderTarget,blendMode,scissor,this._drawTextureShader);
	}
	,prepareDrawPattern: function(renderTarget,blendMode,scissor,texture) {
		if(texture != this._lastTexture) {
			this.flush();
			this._lastTexture = texture;
		}
		return this.prepareQuad(5,renderTarget,blendMode,scissor,this._drawPatternShader);
	}
	,prepareFillRect: function(renderTarget,blendMode,scissor) {
		return this.prepareQuad(6,renderTarget,blendMode,scissor,this._fillRectShader);
	}
	,prepareQuad: function(elementsPerVertex,renderTarget,blendMode,scissor,shader) {
		if(renderTarget != this._lastRenderTarget) {
			this.flush();
			this._lastRenderTarget = renderTarget;
		}
		if(blendMode != this._lastBlendMode) {
			this.flush();
			this._lastBlendMode = blendMode;
		}
		if(shader != this._lastShader) {
			this.flush();
			this._lastShader = shader;
		}
		if(scissor != null || this._lastScissor != null) {
			if(scissor == null || this._lastScissor == null || !this._lastScissor.equals(scissor)) {
				this.flush();
				if(scissor != null) this._lastScissor = scissor.clone(this._lastScissor); else this._lastScissor = null;
				this._pendingSetScissor = true;
			}
		}
		if(this._quads >= this._maxQuads) this.resize(2 * this._maxQuads);
		++this._quads;
		var offset = this._dataOffset;
		this._dataOffset += 4 * elementsPerVertex;
		return offset;
	}
	,flush: function() {
		if(this._quads < 1) return;
		if(this._lastRenderTarget != this._currentRenderTarget) this.bindRenderTarget(this._lastRenderTarget);
		if(this._lastBlendMode != this._currentBlendMode) {
			var _g = this._lastBlendMode;
			switch(_g[1]) {
			case 0:
				this._gl.blendFunc(1,771);
				break;
			case 1:
				this._gl.blendFunc(1,1);
				break;
			case 2:
				this._gl.blendFunc(0,770);
				break;
			case 3:
				this._gl.blendFunc(1,0);
				break;
			}
			this._currentBlendMode = this._lastBlendMode;
		}
		if(this._pendingSetScissor) {
			if(this._lastScissor != null) {
				this._gl.enable(3089);
				this._gl.scissor(this._lastScissor.x | 0,this._lastScissor.y | 0,this._lastScissor.width | 0,this._lastScissor.height | 0);
			} else this._gl.disable(3089);
			this._pendingSetScissor = false;
		}
		if(this._lastTexture != this._currentTexture) {
			this._gl.bindTexture(3553,this._lastTexture.root.nativeTexture);
			this._currentTexture = this._lastTexture;
		}
		if(this._lastShader != this._currentShader) {
			this._lastShader.useProgram();
			this._lastShader.prepare();
			this._currentShader = this._lastShader;
		}
		if(this._lastShader == this._drawPatternShader) {
			var texture = this._lastTexture;
			var root = texture.root;
			this._drawPatternShader.setRegion(texture.rootX / root.width,texture.rootY / root.height,texture._width / root.width,texture._height / root.height);
		}
		this._gl.bufferData(34962,this.data.subarray(0,this._dataOffset),35040);
		this._gl.drawElements(4,6 * this._quads,5123,0);
		this._quads = 0;
		this._dataOffset = 0;
	}
	,resize: function(maxQuads) {
		this.flush();
		if(maxQuads > 1024) return;
		this._maxQuads = maxQuads;
		this.data = new Float32Array(maxQuads * 4 * 6);
		this._gl.bufferData(34962,this.data.length * 4,35040);
		var indices = new Uint16Array(6 * maxQuads);
		var _g = 0;
		while(_g < maxQuads) {
			var ii = _g++;
			indices[ii * 6] = ii * 4;
			indices[ii * 6 + 1] = ii * 4 + 1;
			indices[ii * 6 + 2] = ii * 4 + 2;
			indices[ii * 6 + 3] = ii * 4 + 2;
			indices[ii * 6 + 4] = ii * 4 + 3;
			indices[ii * 6 + 5] = ii * 4;
		}
		this._gl.bufferData(34963,indices,35044);
	}
	,bindRenderTarget: function(texture) {
		if(texture != null) {
			this._gl.bindFramebuffer(36160,texture.framebuffer);
			this._gl.viewport(0,0,texture.width,texture.height);
		} else {
			this._gl.bindFramebuffer(36160,null);
			this._gl.viewport(0,0,this._backbufferWidth,this._backbufferHeight);
		}
		this._currentRenderTarget = texture;
		this._lastRenderTarget = texture;
	}
	,__class__: flambe_platform_html_WebGLBatcher
};
var flambe_platform_html_WebGLGraphics = function(batcher,renderTarget) {
	this._stateList = null;
	this._inverseProjection = null;
	if(flambe_platform_html_WebGLGraphics._scratchQuadArray == null) flambe_platform_html_WebGLGraphics._scratchQuadArray = new Float32Array(8);
	this._batcher = batcher;
	this._renderTarget = renderTarget;
};
flambe_platform_html_WebGLGraphics.__name__ = true;
flambe_platform_html_WebGLGraphics.__interfaces__ = [flambe_platform_InternalGraphics];
flambe_platform_html_WebGLGraphics.prototype = {
	save: function() {
		var current = this._stateList;
		var state = this._stateList.next;
		if(state == null) {
			state = new flambe_platform_html__$WebGLGraphics_DrawingState();
			state.prev = current;
			current.next = state;
		}
		current.matrix.clone(state.matrix);
		state.alpha = current.alpha;
		state.blendMode = current.blendMode;
		if(current.scissor != null) state.scissor = current.scissor.clone(state.scissor); else state.scissor = null;
		this._stateList = state;
	}
	,translate: function(x,y) {
		var matrix = this._stateList.matrix;
		matrix.m02 += matrix.m00 * x + matrix.m01 * y;
		matrix.m12 += matrix.m10 * x + matrix.m11 * y;
	}
	,scale: function(x,y) {
		var matrix = this._stateList.matrix;
		matrix.m00 *= x;
		matrix.m10 *= x;
		matrix.m01 *= y;
		matrix.m11 *= y;
	}
	,rotate: function(rotation) {
		var matrix = this._stateList.matrix;
		rotation = rotation * 3.141592653589793 / 180;
		var sin = Math.sin(rotation);
		var cos = Math.cos(rotation);
		var m00 = matrix.m00;
		var m10 = matrix.m10;
		var m01 = matrix.m01;
		var m11 = matrix.m11;
		matrix.m00 = m00 * cos + m01 * sin;
		matrix.m10 = m10 * cos + m11 * sin;
		matrix.m01 = m01 * cos - m00 * sin;
		matrix.m11 = m11 * cos - m10 * sin;
	}
	,transform: function(m00,m10,m01,m11,m02,m12) {
		var state = this._stateList;
		flambe_platform_html_WebGLGraphics._scratchMatrix.set(m00,m10,m01,m11,m02,m12);
		flambe_math_Matrix.multiply(state.matrix,flambe_platform_html_WebGLGraphics._scratchMatrix,state.matrix);
	}
	,restore: function() {
		this._stateList = this._stateList.prev;
	}
	,drawTexture: function(texture,x,y) {
		this.drawSubTexture(texture,x,y,0,0,texture.get_width(),texture.get_height());
	}
	,drawSubTexture: function(texture,destX,destY,sourceX,sourceY,sourceW,sourceH) {
		var state = this._stateList;
		var texture1 = texture;
		var root = texture1.root;
		var pos = this.transformQuad(destX,destY,sourceW,sourceH);
		var rootWidth = root.width;
		var rootHeight = root.height;
		var u1 = (texture1.rootX + sourceX) / rootWidth;
		var v1 = (texture1.rootY + sourceY) / rootHeight;
		var u2 = u1 + sourceW / rootWidth;
		var v2 = v1 + sourceH / rootHeight;
		var alpha = state.alpha;
		var offset = this._batcher.prepareDrawTexture(this._renderTarget,state.blendMode,state.scissor,texture1);
		var data = this._batcher.data;
		data[offset] = pos[0];
		data[++offset] = pos[1];
		data[++offset] = u1;
		data[++offset] = v1;
		data[++offset] = alpha;
		data[++offset] = pos[2];
		data[++offset] = pos[3];
		data[++offset] = u2;
		data[++offset] = v1;
		data[++offset] = alpha;
		data[++offset] = pos[4];
		data[++offset] = pos[5];
		data[++offset] = u2;
		data[++offset] = v2;
		data[++offset] = alpha;
		data[++offset] = pos[6];
		data[++offset] = pos[7];
		data[++offset] = u1;
		data[++offset] = v2;
		data[++offset] = alpha;
	}
	,drawPattern: function(texture,x,y,width,height) {
		var state = this._stateList;
		var texture1 = texture;
		var root = texture1.root;
		var pos = this.transformQuad(x,y,width,height);
		var u2 = width / root.width;
		var v2 = height / root.height;
		var alpha = state.alpha;
		var offset = this._batcher.prepareDrawPattern(this._renderTarget,state.blendMode,state.scissor,texture1);
		var data = this._batcher.data;
		data[offset] = pos[0];
		data[++offset] = pos[1];
		data[++offset] = 0;
		data[++offset] = 0;
		data[++offset] = alpha;
		data[++offset] = pos[2];
		data[++offset] = pos[3];
		data[++offset] = u2;
		data[++offset] = 0;
		data[++offset] = alpha;
		data[++offset] = pos[4];
		data[++offset] = pos[5];
		data[++offset] = u2;
		data[++offset] = v2;
		data[++offset] = alpha;
		data[++offset] = pos[6];
		data[++offset] = pos[7];
		data[++offset] = 0;
		data[++offset] = v2;
		data[++offset] = alpha;
	}
	,fillRect: function(color,x,y,width,height) {
		var state = this._stateList;
		var pos = this.transformQuad(x,y,width,height);
		var r = (color & 16711680) / 16711680;
		var g = (color & 65280) / 65280;
		var b = (color & 255) / 255;
		var a = state.alpha;
		var offset = this._batcher.prepareFillRect(this._renderTarget,state.blendMode,state.scissor);
		var data = this._batcher.data;
		data[offset] = pos[0];
		data[++offset] = pos[1];
		data[++offset] = r;
		data[++offset] = g;
		data[++offset] = b;
		data[++offset] = a;
		data[++offset] = pos[2];
		data[++offset] = pos[3];
		data[++offset] = r;
		data[++offset] = g;
		data[++offset] = b;
		data[++offset] = a;
		data[++offset] = pos[4];
		data[++offset] = pos[5];
		data[++offset] = r;
		data[++offset] = g;
		data[++offset] = b;
		data[++offset] = a;
		data[++offset] = pos[6];
		data[++offset] = pos[7];
		data[++offset] = r;
		data[++offset] = g;
		data[++offset] = b;
		data[++offset] = a;
	}
	,multiplyAlpha: function(factor) {
		this._stateList.alpha *= factor;
	}
	,setBlendMode: function(blendMode) {
		this._stateList.blendMode = blendMode;
	}
	,applyScissor: function(x,y,width,height) {
		var state = this._stateList;
		var rect = flambe_platform_html_WebGLGraphics._scratchQuadArray;
		rect[0] = x;
		rect[1] = y;
		rect[2] = x + width;
		rect[3] = y + height;
		state.matrix.transformArray(rect,4,rect);
		this._inverseProjection.transformArray(rect,4,rect);
		x = rect[0];
		y = rect[1];
		width = rect[2] - x;
		height = rect[3] - y;
		if(width < 0) {
			x += width;
			width = -width;
		}
		if(height < 0) {
			y += height;
			height = -height;
		}
		state.applyScissor(x,y,width,height);
	}
	,willRender: function() {
		this._batcher.willRender();
	}
	,didRender: function() {
		this._batcher.didRender();
	}
	,onResize: function(width,height) {
		this._stateList = new flambe_platform_html__$WebGLGraphics_DrawingState();
		var flip;
		if(this._renderTarget != null) flip = -1; else flip = 1;
		this._stateList.matrix.set(2 / width,0,0,flip * -2 / height,-1,flip);
		this._inverseProjection = new flambe_math_Matrix();
		this._inverseProjection.set(2 / width,0,0,2 / height,-1,-1);
		this._inverseProjection.invert();
	}
	,transformQuad: function(x,y,width,height) {
		var x2 = x + width;
		var y2 = y + height;
		var pos = flambe_platform_html_WebGLGraphics._scratchQuadArray;
		pos[0] = x;
		pos[1] = y;
		pos[2] = x2;
		pos[3] = y;
		pos[4] = x2;
		pos[5] = y2;
		pos[6] = x;
		pos[7] = y2;
		this._stateList.matrix.transformArray(pos,8,pos);
		return pos;
	}
	,__class__: flambe_platform_html_WebGLGraphics
};
var flambe_platform_html__$WebGLGraphics_DrawingState = function() {
	this.next = null;
	this.prev = null;
	this.scissor = null;
	this.matrix = new flambe_math_Matrix();
	this.alpha = 1;
	this.blendMode = flambe_display_BlendMode.Normal;
};
flambe_platform_html__$WebGLGraphics_DrawingState.__name__ = true;
flambe_platform_html__$WebGLGraphics_DrawingState.prototype = {
	applyScissor: function(x,y,width,height) {
		if(this.scissor != null) {
			var x1 = flambe_math_FMath.max(this.scissor.x,x);
			var y1 = flambe_math_FMath.max(this.scissor.y,y);
			var x2 = flambe_math_FMath.min(this.scissor.x + this.scissor.width,x + width);
			var y2 = flambe_math_FMath.min(this.scissor.y + this.scissor.height,y + height);
			x = x1;
			y = y1;
			width = x2 - x1;
			height = y2 - y1;
		} else this.scissor = new flambe_math_Rectangle();
		this.scissor.set(Math.round(x),Math.round(y),Math.round(width),Math.round(height));
	}
	,__class__: flambe_platform_html__$WebGLGraphics_DrawingState
};
var flambe_platform_html_WebGLRenderer = function(stage,gl) {
	var _g = this;
	this._hasGPU = new flambe_util_Value(true);
	this.gl = gl;
	gl.canvas.addEventListener("webglcontextlost",function(event) {
		event.preventDefault();
		_g._hasGPU.set__(false);
	},false);
	gl.canvas.addEventListener("webglcontextrestore",function(event1) {
		_g.init();
		_g._hasGPU.set__(true);
	},false);
	stage.resize.connect($bind(this,this.onResize));
	this.init();
};
flambe_platform_html_WebGLRenderer.__name__ = true;
flambe_platform_html_WebGLRenderer.__interfaces__ = [flambe_platform_InternalRenderer];
flambe_platform_html_WebGLRenderer.prototype = {
	get_type: function() {
		return flambe_subsystem_RendererType.WebGL;
	}
	,createTextureFromImage: function(image) {
		if(this.gl.isContextLost()) return null;
		var root = new flambe_platform_html_WebGLTextureRoot(this,image.width,image.height);
		root.uploadImageData(image);
		return root.createTexture(image.width,image.height);
	}
	,getCompressedTextureFormats: function() {
		return [];
	}
	,createCompressedTexture: function(format,data) {
		if(this.gl.isContextLost()) return null;
		return null;
	}
	,willRender: function() {
		this.graphics.willRender();
	}
	,didRender: function() {
		this.graphics.didRender();
	}
	,onResize: function() {
		var width = this.gl.canvas.width;
		var height = this.gl.canvas.height;
		this.batcher.resizeBackbuffer(width,height);
		this.graphics.onResize(width,height);
	}
	,init: function() {
		this.batcher = new flambe_platform_html_WebGLBatcher(this.gl);
		this.graphics = new flambe_platform_html_WebGLGraphics(this.batcher,null);
		this.onResize();
	}
	,__class__: flambe_platform_html_WebGLRenderer
};
var flambe_platform_html_WebGLTexture = function(root,width,height) {
	flambe_platform_BasicTexture.call(this,root,width,height);
};
flambe_platform_html_WebGLTexture.__name__ = true;
flambe_platform_html_WebGLTexture.__super__ = flambe_platform_BasicTexture;
flambe_platform_html_WebGLTexture.prototype = $extend(flambe_platform_BasicTexture.prototype,{
	__class__: flambe_platform_html_WebGLTexture
});
var flambe_platform_html_WebGLTextureRoot = function(renderer,width,height) {
	this._graphics = null;
	this.framebuffer = null;
	flambe_platform_BasicAsset.call(this);
	this._renderer = renderer;
	this.width = flambe_math_FMath.max(2,flambe_platform_MathUtil.nextPowerOfTwo(width));
	this.height = flambe_math_FMath.max(2,flambe_platform_MathUtil.nextPowerOfTwo(height));
	var gl = renderer.gl;
	this.nativeTexture = gl.createTexture();
	renderer.batcher.bindTexture(this.nativeTexture);
	gl.texParameteri(3553,10242,33071);
	gl.texParameteri(3553,10243,33071);
	gl.texParameteri(3553,10240,9729);
	gl.texParameteri(3553,10241,9728);
};
flambe_platform_html_WebGLTextureRoot.__name__ = true;
flambe_platform_html_WebGLTextureRoot.__interfaces__ = [flambe_platform_TextureRoot];
flambe_platform_html_WebGLTextureRoot.drawBorder = function(canvas,width,height) {
	var ctx = canvas.getContext("2d");
	ctx.drawImage(canvas,width - 1,0,1,height,width,0,1,height);
	ctx.drawImage(canvas,0,height - 1,width,1,0,height,width,1);
};
flambe_platform_html_WebGLTextureRoot.__super__ = flambe_platform_BasicAsset;
flambe_platform_html_WebGLTextureRoot.prototype = $extend(flambe_platform_BasicAsset.prototype,{
	createTexture: function(width,height) {
		return new flambe_platform_html_WebGLTexture(this,width,height);
	}
	,uploadImageData: function(image) {
		if(this.width != image.width || this.height != image.height) {
			var resized = flambe_platform_html_HtmlUtil.createEmptyCanvas(this.width,this.height);
			resized.getContext("2d").drawImage(image,0,0);
			flambe_platform_html_WebGLTextureRoot.drawBorder(resized,image.width,image.height);
			image = resized;
		}
		this._renderer.batcher.bindTexture(this.nativeTexture);
		var gl = this._renderer.gl;
		gl.texImage2D(3553,0,6408,6408,5121,image);
	}
	,onDisposed: function() {
		var batcher = this._renderer.batcher;
		batcher.deleteTexture(this);
		if(this.framebuffer != null) batcher.deleteFramebuffer(this);
		this.nativeTexture = null;
		this.framebuffer = null;
		this._graphics = null;
	}
	,__class__: flambe_platform_html_WebGLTextureRoot
});
var flambe_platform_shader_ShaderGL = function(gl,vertSource,fragSource) {
	fragSource = ["#ifdef GL_ES","precision mediump float;","#endif"].join("\n") + "\n" + fragSource;
	this._gl = gl;
	this._program = gl.createProgram();
	gl.attachShader(this._program,flambe_platform_shader_ShaderGL.createShader(gl,35633,vertSource));
	gl.attachShader(this._program,flambe_platform_shader_ShaderGL.createShader(gl,35632,fragSource));
	gl.linkProgram(this._program);
	gl.useProgram(this._program);
};
flambe_platform_shader_ShaderGL.__name__ = true;
flambe_platform_shader_ShaderGL.createShader = function(gl,type,source) {
	var shader = gl.createShader(type);
	gl.shaderSource(shader,source);
	gl.compileShader(shader);
	return shader;
};
flambe_platform_shader_ShaderGL.prototype = {
	useProgram: function() {
		this._gl.useProgram(this._program);
	}
	,prepare: function() {
		null;
	}
	,getAttribLocation: function(name) {
		var loc = this._gl.getAttribLocation(this._program,name);
		return loc;
	}
	,getUniformLocation: function(name) {
		var loc = this._gl.getUniformLocation(this._program,name);
		return loc;
	}
	,__class__: flambe_platform_shader_ShaderGL
};
var flambe_platform_shader_DrawPatternGL = function(gl) {
	flambe_platform_shader_ShaderGL.call(this,gl,["attribute highp vec2 a_pos;","attribute mediump vec2 a_uv;","attribute lowp float a_alpha;","varying mediump vec2 v_uv;","varying lowp float v_alpha;","void main (void) {","v_uv = a_uv;","v_alpha = a_alpha;","gl_Position = vec4(a_pos, 0, 1);","}"].join("\n"),["varying mediump vec2 v_uv;","varying lowp float v_alpha;","uniform lowp sampler2D u_texture;","uniform mediump vec4 u_region;","void main (void) {","gl_FragColor = texture2D(u_texture, u_region.xy + mod(v_uv, u_region.zw)) * v_alpha;","}"].join("\n"));
	this.a_pos = this.getAttribLocation("a_pos");
	this.a_uv = this.getAttribLocation("a_uv");
	this.a_alpha = this.getAttribLocation("a_alpha");
	this.u_texture = this.getUniformLocation("u_texture");
	this.u_region = this.getUniformLocation("u_region");
	this.setTexture(0);
};
flambe_platform_shader_DrawPatternGL.__name__ = true;
flambe_platform_shader_DrawPatternGL.__super__ = flambe_platform_shader_ShaderGL;
flambe_platform_shader_DrawPatternGL.prototype = $extend(flambe_platform_shader_ShaderGL.prototype,{
	setTexture: function(unit) {
		this._gl.uniform1i(this.u_texture,unit);
	}
	,setRegion: function(x,y,width,height) {
		this._gl.uniform4f(this.u_region,x,y,width,height);
	}
	,prepare: function() {
		this._gl.enableVertexAttribArray(this.a_pos);
		this._gl.enableVertexAttribArray(this.a_uv);
		this._gl.enableVertexAttribArray(this.a_alpha);
		var bytesPerFloat = 4;
		var stride = 5 * bytesPerFloat;
		this._gl.vertexAttribPointer(this.a_pos,2,5126,false,stride,0 * bytesPerFloat);
		this._gl.vertexAttribPointer(this.a_uv,2,5126,false,stride,2 * bytesPerFloat);
		this._gl.vertexAttribPointer(this.a_alpha,1,5126,false,stride,4 * bytesPerFloat);
	}
	,__class__: flambe_platform_shader_DrawPatternGL
});
var flambe_platform_shader_DrawTextureGL = function(gl) {
	flambe_platform_shader_ShaderGL.call(this,gl,["attribute highp vec2 a_pos;","attribute mediump vec2 a_uv;","attribute lowp float a_alpha;","varying mediump vec2 v_uv;","varying lowp float v_alpha;","void main (void) {","v_uv = a_uv;","v_alpha = a_alpha;","gl_Position = vec4(a_pos, 0, 1);","}"].join("\n"),["varying mediump vec2 v_uv;","varying lowp float v_alpha;","uniform lowp sampler2D u_texture;","void main (void) {","gl_FragColor = texture2D(u_texture, v_uv) * v_alpha;","}"].join("\n"));
	this.a_pos = this.getAttribLocation("a_pos");
	this.a_uv = this.getAttribLocation("a_uv");
	this.a_alpha = this.getAttribLocation("a_alpha");
	this.u_texture = this.getUniformLocation("u_texture");
	this.setTexture(0);
};
flambe_platform_shader_DrawTextureGL.__name__ = true;
flambe_platform_shader_DrawTextureGL.__super__ = flambe_platform_shader_ShaderGL;
flambe_platform_shader_DrawTextureGL.prototype = $extend(flambe_platform_shader_ShaderGL.prototype,{
	setTexture: function(unit) {
		this._gl.uniform1i(this.u_texture,unit);
	}
	,prepare: function() {
		this._gl.enableVertexAttribArray(this.a_pos);
		this._gl.enableVertexAttribArray(this.a_uv);
		this._gl.enableVertexAttribArray(this.a_alpha);
		var bytesPerFloat = 4;
		var stride = 5 * bytesPerFloat;
		this._gl.vertexAttribPointer(this.a_pos,2,5126,false,stride,0 * bytesPerFloat);
		this._gl.vertexAttribPointer(this.a_uv,2,5126,false,stride,2 * bytesPerFloat);
		this._gl.vertexAttribPointer(this.a_alpha,1,5126,false,stride,4 * bytesPerFloat);
	}
	,__class__: flambe_platform_shader_DrawTextureGL
});
var flambe_platform_shader_FillRectGL = function(gl) {
	flambe_platform_shader_ShaderGL.call(this,gl,["attribute highp vec2 a_pos;","attribute lowp vec3 a_rgb;","attribute lowp float a_alpha;","varying lowp vec4 v_color;","void main (void) {","v_color = vec4(a_rgb*a_alpha, a_alpha);","gl_Position = vec4(a_pos, 0, 1);","}"].join("\n"),["varying lowp vec4 v_color;","void main (void) {","gl_FragColor = v_color;","}"].join("\n"));
	this.a_pos = this.getAttribLocation("a_pos");
	this.a_rgb = this.getAttribLocation("a_rgb");
	this.a_alpha = this.getAttribLocation("a_alpha");
};
flambe_platform_shader_FillRectGL.__name__ = true;
flambe_platform_shader_FillRectGL.__super__ = flambe_platform_shader_ShaderGL;
flambe_platform_shader_FillRectGL.prototype = $extend(flambe_platform_shader_ShaderGL.prototype,{
	prepare: function() {
		this._gl.enableVertexAttribArray(this.a_pos);
		this._gl.enableVertexAttribArray(this.a_rgb);
		this._gl.enableVertexAttribArray(this.a_alpha);
		var bytesPerFloat = 4;
		var stride = 6 * bytesPerFloat;
		this._gl.vertexAttribPointer(this.a_pos,2,5126,false,stride,0 * bytesPerFloat);
		this._gl.vertexAttribPointer(this.a_rgb,3,5126,false,stride,2 * bytesPerFloat);
		this._gl.vertexAttribPointer(this.a_alpha,1,5126,false,stride,5 * bytesPerFloat);
	}
	,__class__: flambe_platform_shader_FillRectGL
});
var flambe_scene_Director = function() {
	this._height = -1;
	this._width = -1;
	this._transitor = null;
	this.scenes = [];
	this.occludedScenes = [];
	this._root = new flambe_Entity();
};
flambe_scene_Director.__name__ = true;
flambe_scene_Director.__super__ = flambe_Component;
flambe_scene_Director.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "Director_1";
	}
	,pushScene: function(scene,transition) {
		var _g = this;
		this.completeTransition();
		var oldTop = this.get_topScene();
		if(oldTop != null) this.playTransition(oldTop,scene,transition,function() {
			_g.hide(oldTop);
		}); else {
			this.add(scene);
			this.invalidateVisibility();
		}
	}
	,unwindToScene: function(scene,transition) {
		var _g = this;
		this.completeTransition();
		var oldTop = this.get_topScene();
		if(oldTop != null) {
			if(oldTop == scene) return;
			this.scenes.pop();
			while(this.scenes.length > 0 && this.scenes[this.scenes.length - 1] != scene) this.scenes.pop().dispose();
			this.playTransition(oldTop,scene,transition,function() {
				_g.hideAndDispose(oldTop);
			});
		} else this.pushScene(scene,transition);
	}
	,onAdded: function() {
		this.owner.addChild(this._root);
	}
	,onRemoved: function() {
		this.completeTransition();
		var _g = 0;
		var _g1 = this.scenes;
		while(_g < _g1.length) {
			var scene = _g1[_g];
			++_g;
			scene.dispose();
		}
		this.scenes = [];
		this.occludedScenes = [];
		this._root.dispose();
	}
	,onUpdate: function(dt) {
		if(this._transitor != null && this._transitor.update(dt)) this.completeTransition();
	}
	,get_topScene: function() {
		var ll = this.scenes.length;
		if(ll > 0) return this.scenes[ll - 1]; else return null;
	}
	,add: function(scene) {
		var oldTop = this.get_topScene();
		if(oldTop != null) this._root.removeChild(oldTop);
		HxOverrides.remove(this.scenes,scene);
		this.scenes.push(scene);
		this._root.addChild(scene);
	}
	,hide: function(scene) {
		var events = scene._compMap.Scene_3;
		if(events != null) events.hidden.emit();
	}
	,hideAndDispose: function(scene) {
		this.hide(scene);
		scene.dispose();
	}
	,show: function(scene) {
		var events = scene._compMap.Scene_3;
		if(events != null) events.shown.emit();
	}
	,invalidateVisibility: function() {
		var ii = this.scenes.length;
		while(ii > 0) {
			var scene = this.scenes[--ii];
			var comp = scene._compMap.Scene_3;
			if(comp == null || comp.opaque) break;
		}
		if(this.scenes.length > 0) this.occludedScenes = this.scenes.slice(ii,this.scenes.length - 1); else this.occludedScenes = [];
		var scene1 = this.get_topScene();
		if(scene1 != null) this.show(scene1);
	}
	,completeTransition: function() {
		if(this._transitor != null) {
			this._transitor.complete();
			this._transitor = null;
			this.invalidateVisibility();
		}
	}
	,playTransition: function(from,to,transition,onComplete) {
		this.completeTransition();
		this.add(to);
		if(transition != null) {
			this.occludedScenes.push(from);
			this._transitor = new flambe_scene__$Director_Transitor(from,to,transition,onComplete);
			this._transitor.init(this);
		} else {
			onComplete();
			this.invalidateVisibility();
		}
	}
	,get_width: function() {
		if(this._width < 0) return flambe_System._platform.getStage().get_width(); else return this._width;
	}
	,get_height: function() {
		if(this._height < 0) return flambe_System._platform.getStage().get_height(); else return this._height;
	}
	,__class__: flambe_scene_Director
});
var flambe_scene__$Director_Transitor = function(from,to,transition,onComplete) {
	this._from = from;
	this._to = to;
	this._transition = transition;
	this._onComplete = onComplete;
};
flambe_scene__$Director_Transitor.__name__ = true;
flambe_scene__$Director_Transitor.prototype = {
	init: function(director) {
		this._transition.init(director,this._from,this._to);
	}
	,update: function(dt) {
		return this._transition.update(dt);
	}
	,complete: function() {
		this._transition.complete();
		this._onComplete();
	}
	,__class__: flambe_scene__$Director_Transitor
};
var flambe_scene_Scene = function(opaque) {
	if(opaque == null) opaque = true;
	this.opaque = opaque;
	this.shown = new flambe_util_Signal0();
	this.hidden = new flambe_util_Signal0();
};
flambe_scene_Scene.__name__ = true;
flambe_scene_Scene.__super__ = flambe_Component;
flambe_scene_Scene.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "Scene_3";
	}
	,__class__: flambe_scene_Scene
});
var flambe_scene_Transition = function() { };
flambe_scene_Transition.__name__ = true;
flambe_scene_Transition.prototype = {
	init: function(director,from,to) {
		this._director = director;
		this._from = from;
		this._to = to;
	}
	,update: function(dt) {
		return true;
	}
	,complete: function() {
	}
	,__class__: flambe_scene_Transition
};
var flambe_scene_TweenTransition = function(duration,ease) {
	this._duration = duration;
	if(ease != null) this._ease = ease; else this._ease = flambe_animation_Ease.linear;
};
flambe_scene_TweenTransition.__name__ = true;
flambe_scene_TweenTransition.__super__ = flambe_scene_Transition;
flambe_scene_TweenTransition.prototype = $extend(flambe_scene_Transition.prototype,{
	init: function(director,from,to) {
		flambe_scene_Transition.prototype.init.call(this,director,from,to);
		this._elapsed = 0;
	}
	,update: function(dt) {
		this._elapsed += dt;
		return this._elapsed >= this._duration;
	}
	,interp: function(from,to) {
		return from + (to - from) * this._ease(this._elapsed / this._duration);
	}
	,__class__: flambe_scene_TweenTransition
});
var flambe_scene_SlideTransition = function(duration,ease) {
	this._direction = 2;
	flambe_scene_TweenTransition.call(this,duration,ease);
};
flambe_scene_SlideTransition.__name__ = true;
flambe_scene_SlideTransition.__super__ = flambe_scene_TweenTransition;
flambe_scene_SlideTransition.prototype = $extend(flambe_scene_TweenTransition.prototype,{
	init: function(director,from,to) {
		flambe_scene_TweenTransition.prototype.init.call(this,director,from,to);
		var _g = this._direction;
		switch(_g) {
		case 0:
			this._x = 0;
			this._y = -this._director.get_height();
			break;
		case 1:
			this._x = 0;
			this._y = this._director.get_height();
			break;
		case 2:
			this._x = -this._director.get_width();
			this._y = 0;
			break;
		case 3:
			this._x = this._director.get_width();
			this._y = 0;
			break;
		}
		var sprite = this._from._compMap.Sprite_0;
		if(sprite == null) this._from.add(sprite = new flambe_display_Sprite());
		sprite.setXY(0,0);
		var sprite1 = this._to._compMap.Sprite_0;
		if(sprite1 == null) this._to.add(sprite1 = new flambe_display_Sprite());
		sprite1.setXY(-this._x,-this._y);
	}
	,update: function(dt) {
		var done = flambe_scene_TweenTransition.prototype.update.call(this,dt);
		this._from._compMap.Sprite_0.setXY(this.interp(0,this._x),this.interp(0,this._y));
		this._to._compMap.Sprite_0.setXY(this.interp(-this._x,0),this.interp(-this._y,0));
		return done;
	}
	,complete: function() {
		this._from._compMap.Sprite_0.setXY(0,0);
		this._to._compMap.Sprite_0.setXY(0,0);
	}
	,__class__: flambe_scene_SlideTransition
});
var flambe_script_Action = function() { };
flambe_script_Action.__name__ = true;
flambe_script_Action.prototype = {
	__class__: flambe_script_Action
};
var flambe_script_CallFunction = function(fn) {
	this._fn = fn;
};
flambe_script_CallFunction.__name__ = true;
flambe_script_CallFunction.__interfaces__ = [flambe_script_Action];
flambe_script_CallFunction.prototype = {
	update: function(dt,actor) {
		this._fn();
		return 0;
	}
	,__class__: flambe_script_CallFunction
};
var flambe_script_Delay = function(seconds) {
	this._duration = seconds;
	this._elapsed = 0;
};
flambe_script_Delay.__name__ = true;
flambe_script_Delay.__interfaces__ = [flambe_script_Action];
flambe_script_Delay.prototype = {
	update: function(dt,actor) {
		this._elapsed += dt;
		if(this._elapsed >= this._duration) {
			var overtime = this._elapsed - this._duration;
			this._elapsed = 0;
			return dt - overtime;
		}
		return -1;
	}
	,__class__: flambe_script_Delay
};
var flambe_script_MoveTo = function(x,y,seconds,easingX,easingY) {
	this._x = x;
	this._y = y;
	this._seconds = seconds;
	this._easingX = easingX;
	this._easingY = easingY;
};
flambe_script_MoveTo.__name__ = true;
flambe_script_MoveTo.__interfaces__ = [flambe_script_Action];
flambe_script_MoveTo.prototype = {
	update: function(dt,actor) {
		var sprite = actor._compMap.Sprite_0;
		if(this._tweenX == null) {
			this._tweenX = new flambe_animation_Tween(sprite.x._value,this._x,this._seconds,this._easingX);
			sprite.x.set_behavior(this._tweenX);
			sprite.x.update(dt);
			this._tweenY = new flambe_animation_Tween(sprite.y._value,this._y,this._seconds,this._easingY != null?this._easingY:this._easingX);
			sprite.y.set_behavior(this._tweenY);
			sprite.y.update(dt);
		}
		if(sprite.x._behavior != this._tweenX && sprite.y._behavior != this._tweenY) {
			var overtime = flambe_math_FMath.max(this._tweenX.elapsed,this._tweenY.elapsed) - this._seconds;
			this._tweenX = null;
			this._tweenY = null;
			if(overtime > 0) return Math.max(0,dt - overtime); else return 0;
		}
		return -1;
	}
	,__class__: flambe_script_MoveTo
};
var flambe_script_Script = function() {
	this.stopAll();
};
flambe_script_Script.__name__ = true;
flambe_script_Script.__super__ = flambe_Component;
flambe_script_Script.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "Script_5";
	}
	,run: function(action) {
		var handle = new flambe_script__$Script_Handle(action);
		this._handles.push(handle);
		return handle;
	}
	,stopAll: function() {
		this._handles = [];
	}
	,onUpdate: function(dt) {
		var ii = 0;
		while(ii < this._handles.length) {
			var handle = this._handles[ii];
			if(handle.removed || handle.action.update(dt,this.owner) >= 0) this._handles.splice(ii,1); else ++ii;
		}
	}
	,__class__: flambe_script_Script
});
var flambe_script__$Script_Handle = function(action) {
	this.removed = false;
	this.action = action;
};
flambe_script__$Script_Handle.__name__ = true;
flambe_script__$Script_Handle.__interfaces__ = [flambe_util_Disposable];
flambe_script__$Script_Handle.prototype = {
	dispose: function() {
		this.removed = true;
		this.action = null;
	}
	,__class__: flambe_script__$Script_Handle
};
var flambe_script_Sequence = function(actions) {
	this._idx = 0;
	if(actions != null) this._runningActions = actions.slice(); else this._runningActions = [];
};
flambe_script_Sequence.__name__ = true;
flambe_script_Sequence.__interfaces__ = [flambe_script_Action];
flambe_script_Sequence.prototype = {
	update: function(dt,actor) {
		var total = 0.0;
		while(true) {
			var action = this._runningActions[this._idx];
			if(action != null) {
				var spent = action.update(dt - total,actor);
				if(spent >= 0) total += spent; else return -1;
			}
			++this._idx;
			if(this._idx >= this._runningActions.length) {
				this._idx = 0;
				break;
			} else if(total > dt) return -1;
		}
		return total;
	}
	,__class__: flambe_script_Sequence
};
var flambe_script_Shake = function(strengthX,strengthY,seconds) {
	this._strengthX = strengthX;
	this._strengthY = strengthY;
	this._duration = seconds;
	this._elapsed = 0;
};
flambe_script_Shake.__name__ = true;
flambe_script_Shake.__interfaces__ = [flambe_script_Action];
flambe_script_Shake.prototype = {
	update: function(dt,actor) {
		var sprite = actor._compMap.Sprite_0;
		if(this._jitterX == null) {
			this._jitterX = new flambe_animation_Jitter(sprite.x._value,this._strengthX);
			this._jitterY = new flambe_animation_Jitter(sprite.y._value,this._strengthY);
			sprite.x.set_behavior(this._jitterX);
			sprite.y.set_behavior(this._jitterY);
		}
		this._elapsed += dt;
		if(this._elapsed >= this._duration) {
			var overtime = this._elapsed - this._duration;
			if(sprite.x._behavior == this._jitterX) sprite.x.set__(this._jitterX.base);
			if(sprite.y._behavior == this._jitterY) sprite.y.set__(this._jitterY.base);
			this._jitterX = null;
			this._jitterY = null;
			this._elapsed = 0;
			return dt - overtime;
		}
		return -1;
	}
	,__class__: flambe_script_Shake
};
var flambe_subsystem_RendererType = { __ename__ : true, __constructs__ : ["Stage3D","WebGL","Canvas"] };
flambe_subsystem_RendererType.Stage3D = ["Stage3D",0];
flambe_subsystem_RendererType.Stage3D.toString = $estr;
flambe_subsystem_RendererType.Stage3D.__enum__ = flambe_subsystem_RendererType;
flambe_subsystem_RendererType.WebGL = ["WebGL",1];
flambe_subsystem_RendererType.WebGL.toString = $estr;
flambe_subsystem_RendererType.WebGL.__enum__ = flambe_subsystem_RendererType;
flambe_subsystem_RendererType.Canvas = ["Canvas",2];
flambe_subsystem_RendererType.Canvas.toString = $estr;
flambe_subsystem_RendererType.Canvas.__enum__ = flambe_subsystem_RendererType;
var flambe_util_Assert = function() { };
flambe_util_Assert.__name__ = true;
flambe_util_Assert.that = function(condition,message,fields) {
};
var flambe_util_BitSets = function() { };
flambe_util_BitSets.__name__ = true;
flambe_util_BitSets.set = function(bits,mask,enabled) {
	if(enabled) return bits | mask; else return bits & ~mask;
};
var flambe_util_Config = function() {
	this.mainSection = new haxe_ds_StringMap();
	this.sections = new haxe_ds_StringMap();
};
flambe_util_Config.__name__ = true;
flambe_util_Config.parse = function(text) {
	var config = new flambe_util_Config();
	var commentPattern = new EReg("^\\s*;","");
	var sectionPattern = new EReg("^\\s*\\[\\s*([^\\]]*)\\s*\\]","");
	var pairPattern = new EReg("^\\s*([\\w\\.\\-_]+)\\s*=\\s*(.*)","");
	var currentSection = config.mainSection;
	var _g = 0;
	var _g1 = new EReg("\r\n|\r|\n","g").split(text);
	while(_g < _g1.length) {
		var line = _g1[_g];
		++_g;
		if(commentPattern.match(line)) {
		} else if(sectionPattern.match(line)) {
			var name = sectionPattern.matched(1);
			if(config.sections.exists(name)) currentSection = config.sections.get(name); else {
				currentSection = new haxe_ds_StringMap();
				config.sections.set(name,currentSection);
			}
		} else if(pairPattern.match(line)) {
			var key = pairPattern.matched(1);
			var value = pairPattern.matched(2);
			var quote = value.charCodeAt(0);
			if((quote == 34 || quote == 39) && value.charCodeAt(value.length - 1) == quote) value = HxOverrides.substr(value,1,value.length - 2);
			var value1 = StringTools.replace(StringTools.replace(StringTools.replace(StringTools.replace(StringTools.replace(StringTools.replace(value,"\\n","\n"),"\\r","\r"),"\\t","\t"),"\\'","'"),"\\\"","\""),"\\\\","\\");
			currentSection.set(key,value1);
		}
	}
	return config;
};
flambe_util_Config.prototype = {
	get: function(path) {
		var idx = path.indexOf(".");
		if(idx < 0) return this.mainSection.get(path);
		var section;
		var key = HxOverrides.substr(path,0,idx);
		section = this.sections.get(key);
		if(section != null) {
			var key1 = HxOverrides.substr(path,idx + 1,null);
			return section.get(key1);
		} else return null;
	}
	,__class__: flambe_util_Config
};
var flambe_util_MessageBundle = function(config) {
	this.config = config;
	this.missingTranslation = new flambe_util_Signal1();
};
flambe_util_MessageBundle.__name__ = true;
flambe_util_MessageBundle.parse = function(text) {
	return new flambe_util_MessageBundle(flambe_util_Config.parse(text));
};
flambe_util_MessageBundle.prototype = {
	get: function(path,params) {
		var value = this.config.get(path);
		if(value == null) {
			this.missingTranslation.emit(path);
			return path;
		}
		if(params != null) return flambe_util_Strings.substitute(value,params); else return value;
	}
	,__class__: flambe_util_MessageBundle
};
var flambe_util_Promise = function() {
	this.success = new flambe_util_Signal1();
	this.error = new flambe_util_Signal1();
	this.progressChanged = new flambe_util_Signal0();
	this.hasResult = false;
	this._progress = 0;
	this._total = 0;
};
flambe_util_Promise.__name__ = true;
flambe_util_Promise.prototype = {
	set_result: function(result) {
		if(this.hasResult) throw "Promise result already assigned";
		this._result = result;
		this.hasResult = true;
		this.success.emit(result);
		return result;
	}
	,get: function(fn) {
		if(this.hasResult) {
			fn(this._result);
			return null;
		}
		return this.success.connect(fn).once();
	}
	,set_progress: function(progress) {
		if(this._progress != progress) {
			this._progress = progress;
			this.progressChanged.emit();
		}
		return progress;
	}
	,set_total: function(total) {
		if(this._total != total) {
			this._total = total;
			this.progressChanged.emit();
		}
		return total;
	}
	,__class__: flambe_util_Promise
};
var flambe_util_Random = function(seed) {
	if(seed != null) this._state = seed; else this._state = Math.floor(Math.random() * 2147483647);
};
flambe_util_Random.__name__ = true;
flambe_util_Random.prototype = {
	__class__: flambe_util_Random
};
var flambe_util_Signal0 = function(listener) {
	flambe_util_SignalBase.call(this,listener);
};
flambe_util_Signal0.__name__ = true;
flambe_util_Signal0.__super__ = flambe_util_SignalBase;
flambe_util_Signal0.prototype = $extend(flambe_util_SignalBase.prototype,{
	connect: function(listener,prioritize) {
		if(prioritize == null) prioritize = false;
		return this.connectImpl(listener,prioritize);
	}
	,emit: function() {
		var _g = this;
		if(this._head == flambe_util_SignalBase.DISPATCHING_SENTINEL) this.defer(function() {
			_g.emitImpl();
		}); else this.emitImpl();
	}
	,emitImpl: function() {
		var head = this.willEmit();
		var p = head;
		while(p != null) {
			p._listener();
			if(!p.stayInList) p.dispose();
			p = p._next;
		}
		this.didEmit(head);
	}
	,__class__: flambe_util_Signal0
});
var flambe_util__$SignalBase_Task = function(fn) {
	this.next = null;
	this.fn = fn;
};
flambe_util__$SignalBase_Task.__name__ = true;
flambe_util__$SignalBase_Task.prototype = {
	__class__: flambe_util__$SignalBase_Task
};
var flambe_util_Strings = function() { };
flambe_util_Strings.__name__ = true;
flambe_util_Strings.getFileExtension = function(fileName) {
	var dot = fileName.lastIndexOf(".");
	if(dot > 0) return HxOverrides.substr(fileName,dot + 1,null); else return null;
};
flambe_util_Strings.removeFileExtension = function(fileName) {
	var dot = fileName.lastIndexOf(".");
	if(dot > 0) return HxOverrides.substr(fileName,0,dot); else return fileName;
};
flambe_util_Strings.getUrlExtension = function(url) {
	var question = url.lastIndexOf("?");
	if(question >= 0) url = HxOverrides.substr(url,0,question);
	var slash = url.lastIndexOf("/");
	if(slash >= 0) url = HxOverrides.substr(url,slash + 1,null);
	return flambe_util_Strings.getFileExtension(url);
};
flambe_util_Strings.joinPath = function(base,relative) {
	if(base.length > 0 && base.charCodeAt(base.length - 1) != 47) base += "/";
	return base + relative;
};
flambe_util_Strings.substitute = function(str,values) {
	var _g1 = 0;
	var _g = values.length;
	while(_g1 < _g) {
		var ii = _g1++;
		str = StringTools.replace(str,"{" + ii + "}",values[ii]);
	}
	return str;
};
flambe_util_Strings.withFields = function(message,fields) {
	var ll = fields.length;
	if(ll > 0) {
		if(message.length > 0) message += " ["; else message += "[";
		var ii = 0;
		while(ii < ll) {
			if(ii > 0) message += ", ";
			var name = fields[ii];
			var value = fields[ii + 1];
			if(Std["is"](value,Error)) {
				var stack = value.stack;
				if(stack != null) value = stack;
			}
			message += name + "=" + Std.string(value);
			ii += 2;
		}
		message += "]";
	}
	return message;
};
var haxe_ds_IntMap = function() {
	this.h = { };
};
haxe_ds_IntMap.__name__ = true;
haxe_ds_IntMap.__interfaces__ = [IMap];
haxe_ds_IntMap.prototype = {
	set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,__class__: haxe_ds_IntMap
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__name__ = true;
haxe_ds_StringMap.__interfaces__ = [IMap];
haxe_ds_StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,__class__: haxe_ds_StringMap
};
var haxe_io_Bytes = function() { };
haxe_io_Bytes.__name__ = true;
var haxe_rtti_Meta = function() { };
haxe_rtti_Meta.__name__ = true;
haxe_rtti_Meta.getType = function(t) {
	var meta = t.__meta__;
	if(meta == null || meta.obj == null) return { }; else return meta.obj;
};
var haxe_xml_Parser = function() { };
haxe_xml_Parser.__name__ = true;
haxe_xml_Parser.parse = function(str) {
	var doc = Xml.createDocument();
	haxe_xml_Parser.doParse(str,0,doc);
	return doc;
};
haxe_xml_Parser.doParse = function(str,p,parent) {
	if(p == null) p = 0;
	var xml = null;
	var state = 1;
	var next = 1;
	var aname = null;
	var start = 0;
	var nsubs = 0;
	var nbrackets = 0;
	var c = str.charCodeAt(p);
	var buf = new StringBuf();
	while(!(c != c)) {
		switch(state) {
		case 0:
			switch(c) {
			case 10:case 13:case 9:case 32:
				break;
			default:
				state = next;
				continue;
			}
			break;
		case 1:
			switch(c) {
			case 60:
				state = 0;
				next = 2;
				break;
			default:
				start = p;
				state = 13;
				continue;
			}
			break;
		case 13:
			if(c == 60) {
				var child = Xml.createPCData(buf.b + HxOverrides.substr(str,start,p - start));
				buf = new StringBuf();
				parent.addChild(child);
				nsubs++;
				state = 0;
				next = 2;
			} else if(c == 38) {
				buf.addSub(str,start,p - start);
				state = 18;
				next = 13;
				start = p + 1;
			}
			break;
		case 17:
			if(c == 93 && str.charCodeAt(p + 1) == 93 && str.charCodeAt(p + 2) == 62) {
				var child1 = Xml.createCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child1);
				nsubs++;
				p += 2;
				state = 1;
			}
			break;
		case 2:
			switch(c) {
			case 33:
				if(str.charCodeAt(p + 1) == 91) {
					p += 2;
					if(HxOverrides.substr(str,p,6).toUpperCase() != "CDATA[") throw "Expected <![CDATA[";
					p += 5;
					state = 17;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) == 68 || str.charCodeAt(p + 1) == 100) {
					if(HxOverrides.substr(str,p + 2,6).toUpperCase() != "OCTYPE") throw "Expected <!DOCTYPE";
					p += 8;
					state = 16;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) != 45 || str.charCodeAt(p + 2) != 45) throw "Expected <!--"; else {
					p += 2;
					state = 15;
					start = p + 1;
				}
				break;
			case 63:
				state = 14;
				start = p;
				break;
			case 47:
				if(parent == null) throw "Expected node name";
				start = p + 1;
				state = 0;
				next = 10;
				break;
			default:
				state = 3;
				start = p;
				continue;
			}
			break;
		case 3:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(p == start) throw "Expected node name";
				xml = Xml.createElement(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml);
				state = 0;
				next = 4;
				continue;
			}
			break;
		case 4:
			switch(c) {
			case 47:
				state = 11;
				nsubs++;
				break;
			case 62:
				state = 9;
				nsubs++;
				break;
			default:
				state = 5;
				start = p;
				continue;
			}
			break;
		case 5:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				var tmp;
				if(start == p) throw "Expected attribute name";
				tmp = HxOverrides.substr(str,start,p - start);
				aname = tmp;
				if(xml.exists(aname)) throw "Duplicate attribute";
				state = 0;
				next = 6;
				continue;
			}
			break;
		case 6:
			switch(c) {
			case 61:
				state = 0;
				next = 7;
				break;
			default:
				throw "Expected =";
			}
			break;
		case 7:
			switch(c) {
			case 34:case 39:
				state = 8;
				start = p;
				break;
			default:
				throw "Expected \"";
			}
			break;
		case 8:
			if(c == str.charCodeAt(start)) {
				var val = HxOverrides.substr(str,start + 1,p - start - 1);
				xml.set(aname,val);
				state = 0;
				next = 4;
			}
			break;
		case 9:
			p = haxe_xml_Parser.doParse(str,p,xml);
			start = p;
			state = 1;
			break;
		case 11:
			switch(c) {
			case 62:
				state = 1;
				break;
			default:
				throw "Expected >";
			}
			break;
		case 12:
			switch(c) {
			case 62:
				if(nsubs == 0) parent.addChild(Xml.createPCData(""));
				return p;
			default:
				throw "Expected >";
			}
			break;
		case 10:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(start == p) throw "Expected node name";
				var v = HxOverrides.substr(str,start,p - start);
				if(v != parent.get_nodeName()) throw "Expected </" + parent.get_nodeName() + ">";
				state = 0;
				next = 12;
				continue;
			}
			break;
		case 15:
			if(c == 45 && str.charCodeAt(p + 1) == 45 && str.charCodeAt(p + 2) == 62) {
				parent.addChild(Xml.createComment(HxOverrides.substr(str,start,p - start)));
				p += 2;
				state = 1;
			}
			break;
		case 16:
			if(c == 91) nbrackets++; else if(c == 93) nbrackets--; else if(c == 62 && nbrackets == 0) {
				parent.addChild(Xml.createDocType(HxOverrides.substr(str,start,p - start)));
				state = 1;
			}
			break;
		case 14:
			if(c == 63 && str.charCodeAt(p + 1) == 62) {
				p++;
				var str1 = HxOverrides.substr(str,start + 1,p - start - 2);
				parent.addChild(Xml.createProcessingInstruction(str1));
				state = 1;
			}
			break;
		case 18:
			if(c == 59) {
				var s = HxOverrides.substr(str,start,p - start);
				if(s.charCodeAt(0) == 35) {
					var i;
					if(s.charCodeAt(1) == 120) i = Std.parseInt("0" + HxOverrides.substr(s,1,s.length - 1)); else i = Std.parseInt(HxOverrides.substr(s,1,s.length - 1));
					buf.add(String.fromCharCode(i));
				} else if(!haxe_xml_Parser.escapes.exists(s)) buf.b += Std.string("&" + s + ";"); else buf.add(haxe_xml_Parser.escapes.get(s));
				start = p + 1;
				state = next;
			}
			break;
		}
		c = StringTools.fastCodeAt(str,++p);
	}
	if(state == 1) {
		start = p;
		state = 13;
	}
	if(state == 13) {
		if(p != start || nsubs == 0) parent.addChild(Xml.createPCData(buf.b + HxOverrides.substr(str,start,p - start)));
		return p;
	}
	throw "Unexpected end";
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js_Boot.__string_rec(o[i],s); else str += js_Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
var js_html__$CanvasElement_CanvasUtil = function() { };
js_html__$CanvasElement_CanvasUtil.__name__ = true;
js_html__$CanvasElement_CanvasUtil.getContextWebGL = function(canvas,attribs) {
	var _g = 0;
	var _g1 = ["webgl","experimental-webgl"];
	while(_g < _g1.length) {
		var name = _g1[_g];
		++_g;
		var ctx = canvas.getContext(name,attribs);
		if(ctx != null) return ctx;
	}
	return null;
};
var ludumdare_BackgroundScroller = function(speed) {
	this.speed = new flambe_animation_AnimatedFloat(speed);
};
ludumdare_BackgroundScroller.__name__ = true;
ludumdare_BackgroundScroller.__super__ = flambe_Component;
ludumdare_BackgroundScroller.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "BackgroundScroller_7";
	}
	,onUpdate: function(dt) {
		this.speed.update(dt);
		var sprite = this.owner._compMap.Sprite_0;
		var _g = sprite.y;
		_g.set__(_g._value + dt * this.speed._value);
		while(sprite.y._value > 0) {
			var _g1 = sprite.y;
			_g1.set__(_g1._value - 256);
		}
	}
	,__class__: ludumdare_BackgroundScroller
});
var ludumdare_BendTile = function(ctx,x,y,rotation) {
	this._ctx = ctx;
	this._tileX = x;
	this._tileY = y;
	this._rotation = rotation;
};
ludumdare_BendTile.__name__ = true;
ludumdare_BendTile.__super__ = flambe_Component;
ludumdare_BendTile.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "BendTile_13";
	}
	,onAdded: function() {
		var texture = this._ctx.pack.getTexture("tiles/bend");
		var sprite = new flambe_display_ImageSprite(texture);
		this.owner.add(sprite);
		var tileData = new ludumdare_TileData();
		tileData.tileX = this._tileX;
		tileData.tileY = this._tileY;
		tileData.topOpen = this._rotation == 0 || this._rotation == 3;
		tileData.bottomOpen = this._rotation == 1 || this._rotation == 2;
		tileData.leftOpen = this._rotation == 2 || this._rotation == 3;
		tileData.rightOpen = this._rotation == 0 || this._rotation == 1;
		this.owner.add(tileData);
	}
	,__class__: ludumdare_BendTile
});
var ludumdare_BlockTile = function(ctx,x,y,rotation) {
	this._ctx = ctx;
	this._tileX = x;
	this._tileY = y;
	this._rotation = rotation;
};
ludumdare_BlockTile.__name__ = true;
ludumdare_BlockTile.__super__ = flambe_Component;
ludumdare_BlockTile.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "BlockTile_16";
	}
	,onAdded: function() {
		var texture = this._ctx.pack.getTexture("tiles/block");
		var sprite = new flambe_display_ImageSprite(texture);
		this.owner.add(sprite);
		var tileData = new ludumdare_TileData();
		tileData.tileX = this._tileX;
		tileData.tileY = this._tileY;
		tileData.topOpen = false;
		tileData.bottomOpen = false;
		tileData.leftOpen = false;
		tileData.rightOpen = false;
		this.owner.add(tileData);
	}
	,__class__: ludumdare_BlockTile
});
var ludumdare_EmptyTile = function(ctx,x,y,rotation) {
	this._ctx = ctx;
	this._tileX = x;
	this._tileY = y;
	this._rotation = rotation;
};
ludumdare_EmptyTile.__name__ = true;
ludumdare_EmptyTile.__super__ = flambe_Component;
ludumdare_EmptyTile.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "EmptyTile_14";
	}
	,onAdded: function() {
		var texture = this._ctx.pack.getTexture("tiles/empty");
		var sprite = new flambe_display_ImageSprite(texture);
		this.owner.add(sprite);
		var tileData = new ludumdare_TileData();
		tileData.tileX = this._tileX;
		tileData.tileY = this._tileY;
		tileData.topOpen = false;
		tileData.bottomOpen = false;
		tileData.leftOpen = false;
		tileData.rightOpen = false;
		this.owner.add(tileData);
	}
	,__class__: ludumdare_EmptyTile
});
var ludumdare_GameContext = function(mainPack,localePack,director) {
	this.pack = mainPack;
	this.director = director;
	this.random = new flambe_util_Random(1337);
	this.messages = flambe_util_MessageBundle.parse(localePack.getFile("messages.ini").toString());
	this.arialFont = new flambe_display_Font(this.pack,"fonts/handel");
	this.hurtParams = new vault_SfxrParams();
	this.hurtParams.generateHitHurt();
	this.jumpParams = new vault_SfxrParams();
	this.jumpParams.generateJump();
	this.powerupParams = new vault_SfxrParams();
	this.powerupParams.generatePowerup();
	this.explosionParams = new vault_SfxrParams();
	this.explosionParams.generateExplosion();
	this.beepParams = new vault_SfxrParams();
	this.beepParams.generateBlipSelect();
	this.coinParams = new vault_SfxrParams();
	this.coinParams.generatePickupCoin();
};
ludumdare_GameContext.__name__ = true;
ludumdare_GameContext.prototype = {
	enterPlayScene: function(animate) {
		if(animate == null) animate = true;
		this.director.unwindToScene(ludumdare_PlayScene.create(this),animate?new flambe_scene_SlideTransition(0.5,flambe_animation_Ease.quadOut):null);
	}
	,showPrompt: function(text,message,buttons) {
		this.director.pushScene(ludumdare_PromptScene.create(this,text,message,buttons));
	}
	,playHurt: function() {
		this.hurtParams.mutate();
		this.hurtParams.masterVolume = 0.3;
		var sfxr = new vault_Sfxr(this.hurtParams);
		sfxr.player();
	}
	,playJump: function() {
		this.jumpParams.mutate();
		this.jumpParams.masterVolume = 0.2;
		var sfxr = new vault_Sfxr(this.jumpParams);
		sfxr.player();
	}
	,playPowerup: function() {
		this.powerupParams.mutate();
		this.powerupParams.masterVolume = 0.3;
		var sfxr = new vault_Sfxr(this.powerupParams);
		sfxr.player();
	}
	,playExplosion: function() {
		this.explosionParams.mutate();
		this.explosionParams.sustainTime = 0.3;
		this.explosionParams.masterVolume = 0.3;
		var sfxr = new vault_Sfxr(this.explosionParams);
		sfxr.player();
	}
	,playBeep: function() {
		this.beepParams.mutate();
		this.beepParams.masterVolume = 0.3;
		var sfxr = new vault_Sfxr(this.beepParams);
		sfxr.player();
	}
	,playCoin: function() {
		this.coinParams.mutate();
		this.coinParams.masterVolume = 0.3;
		var sfxr = new vault_Sfxr(this.coinParams);
		sfxr.player();
	}
	,__class__: ludumdare_GameContext
};
var ludumdare_GoalTile = function(ctx,x,y,rotation) {
	this._ctx = ctx;
	this._tileX = x;
	this._tileY = y;
	this._rotation = rotation;
};
ludumdare_GoalTile.__name__ = true;
ludumdare_GoalTile.__super__ = flambe_Component;
ludumdare_GoalTile.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "GoalTile_11";
	}
	,onAdded: function() {
		var texture = this._ctx.pack.getTexture("tiles/goal");
		var sprite = new flambe_display_ImageSprite(texture);
		this.owner.add(sprite);
		var tileData = new ludumdare_TileData();
		tileData.tileX = this._tileX;
		tileData.tileY = this._tileY;
		tileData.topOpen = this._rotation == 0;
		tileData.bottomOpen = this._rotation == 2;
		tileData.leftOpen = this._rotation == 3;
		tileData.rightOpen = this._rotation == 1;
		this.owner.add(tileData);
	}
	,__class__: ludumdare_GoalTile
});
var ludumdare_GrassTile = function(ctx,x,y,rotation) {
	this._ctx = ctx;
	this._tileX = x;
	this._tileY = y;
	this._rotation = rotation;
};
ludumdare_GrassTile.__name__ = true;
ludumdare_GrassTile.__super__ = flambe_Component;
ludumdare_GrassTile.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "GrassTile_15";
	}
	,onAdded: function() {
		var texture = this._ctx.pack.getTexture("tiles/grass");
		var sprite = new flambe_display_ImageSprite(texture);
		this.owner.add(sprite);
		var tileData = new ludumdare_TileData();
		tileData.tileX = this._tileX;
		tileData.tileY = this._tileY;
		tileData.topOpen = true;
		tileData.bottomOpen = true;
		tileData.leftOpen = true;
		tileData.rightOpen = true;
		this.owner.add(tileData);
	}
	,__class__: ludumdare_GrassTile
});
var ludumdare_LevelModel = function(ctx) {
	this.totalMoves = 0;
	this._levelIndex = 1;
	this._ctx = ctx;
	this._zoom = new flambe_animation_AnimatedFloat(1);
	this.moves = new flambe_util_Value(0);
};
ludumdare_LevelModel.__name__ = true;
ludumdare_LevelModel.__super__ = flambe_Component;
ludumdare_LevelModel.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "LevelModel_4";
	}
	,onAdded: function() {
		this._worldLayer = new flambe_Entity();
		this._worldLayer.add(new flambe_display_Sprite().centerAnchor());
		this.owner.addChild(this._worldLayer);
		var background = new flambe_display_PatternSprite(this._ctx.pack.getTexture("backgrounds/background"),ludumdare_LevelModel.WIDTH,ludumdare_LevelModel.HEIGHT);
		background.setScale(2);
		this._worldLayer.addChild(new flambe_Entity().add(background).add(new ludumdare_BackgroundScroller(100)));
		this._worldLayer.addChild(this._mapLayer = new flambe_Entity());
		this.loadMap(this._levelIndex);
	}
	,loadMap: function(index) {
		var _g = this;
		this._mapLayer.disposeChildren();
		var map = new ludumdare_Map(this._ctx,"levels/level" + index + ".lvl",ludumdare_LevelModel.TILE_SIZE,ludumdare_LevelModel.WIDTH,ludumdare_LevelModel.HEIGHT);
		this._mapLayer.add(new flambe_display_Sprite());
		this._mapLayer.add(map);
		this.totalMoves += this.moves._value;
		map.moves.watch(function(movesOnMap,_) {
			_g.moves.set__(movesOnMap);
		});
		var levelMessage = this._ctx.messages.get("level" + index,[this.totalMoves]);
		if(levelMessage != "level" + index) {
			var worldSpeed = new flambe_SpeedAdjuster(0.5);
			this._worldLayer.add(worldSpeed);
			var showPromptScript = new flambe_script_Script();
			this.owner.add(showPromptScript);
			showPromptScript.run(new flambe_script_Sequence([new flambe_script_CallFunction(function() {
				worldSpeed.scale.animateTo(0.0,1);
			}),new flambe_script_Delay(1),new flambe_script_CallFunction(function() {
				_g._ctx.showPrompt(_g._ctx.messages.get("info_heading",[index]),levelMessage,["play",function() {
					_g._ctx.director.unwindToScene(_g.owner);
					worldSpeed.scale.animateTo(1.0,1);
				}]);
				showPromptScript.dispose();
			})]));
		}
		var player = map.playerEntity._compMap.Player_10;
		player.onWin.connect(function() {
			_g._ctx.playPowerup();
			_g.loadMap(++_g._levelIndex);
		});
	}
	,onUpdate: function(dt) {
	}
	,__class__: ludumdare_LevelModel
});
var ludumdare_Main = function() { };
ludumdare_Main.__name__ = true;
ludumdare_Main.main = function() {
	flambe_System.init();
	var director = new flambe_scene_Director();
	flambe_System.root.add(director);
	var manifest = flambe_asset_Manifest.fromAssets("bootstrap");
	flambe_System._platform.loadAssetPack(manifest).get(function(bootstrapPack) {
		flambe_System.loadAssetPack(flambe_asset_Manifest.fromAssetsLocalized("locale")).get(function(localePack) {
			var promise = flambe_System.loadAssetPack(flambe_asset_Manifest.fromAssets("main"));
			promise.get(function(mainPack) {
				var ctx = new ludumdare_GameContext(mainPack,localePack,director);
				ctx.enterPlayScene(false);
				bootstrapPack.dispose();
			});
			var preloader = ludumdare_PreloaderScene.create(bootstrapPack,promise);
			director.unwindToScene(preloader);
		});
	});
};
var ludumdare_Map = function(ctx,file,tileSize,width,height) {
	this._ctx = ctx;
	this._file = file;
	this.TILE_SIZE = tileSize;
	this.WIDTH = width;
	this.HEIGHT = height;
	this.moves = new flambe_util_Value(0);
};
ludumdare_Map.__name__ = true;
ludumdare_Map.__super__ = flambe_Component;
ludumdare_Map.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "Map_8";
	}
	,onAdded: function() {
		var _g3 = this;
		var _g = [];
		var _g1 = 0;
		while(_g1 < 5) {
			var y = _g1++;
			_g.push((function($this) {
				var $r;
				var _g2 = [];
				{
					var _g31 = 0;
					while(_g31 < 7) {
						var x = _g31++;
						_g2.push(new flambe_Entity());
					}
				}
				$r = _g2;
				return $r;
			}(this)));
		}
		this.tiles = _g;
		var mouseDown = false;
		var startTileX = 0;
		var startTileY = 0;
		var emitterMold = new flambe_display_EmitterMold(this._ctx.pack,"particles/explode");
		var emitter = emitterMold.createEmitter();
		var emitterEntity = new flambe_Entity().add(emitter);
		var rawlevel = this._ctx.pack.getFile(this._file).toString();
		var lines = rawlevel.split("\n");
		var _g11 = 0;
		while(_g11 < 5) {
			var y1 = _g11++;
			var _g21 = 0;
			while(_g21 < 7) {
				var x1 = _g21++;
				var entity = this.tiles[y1][x1];
				var rotation = Math.floor(Math.random() * 4);
				var random = Math.random();
				var type = lines[y1].charAt(x1);
				switch(type) {
				case "|":
					entity.add(new ludumdare_StraightTile(this._ctx,x1,y1,rotation = 0));
					break;
				case "-":
					entity.add(new ludumdare_StraightTile(this._ctx,x1,y1,rotation = 1));
					break;
				case "L":
					entity.add(new ludumdare_BendTile(this._ctx,x1,y1,rotation = 0));
					break;
				case "<":
					entity.add(new ludumdare_BendTile(this._ctx,x1,y1,rotation = 1));
					break;
				case ">":
					entity.add(new ludumdare_BendTile(this._ctx,x1,y1,rotation = 2));
					break;
				case "V":
					entity.add(new ludumdare_BendTile(this._ctx,x1,y1,rotation = 3));
					break;
				case " ":
					entity.add(new ludumdare_EmptyTile(this._ctx,x1,y1,rotation));
					break;
				case "W":
					entity.add(new ludumdare_GoalTile(this._ctx,x1,y1,rotation = 0));
					break;
				case "E":
					entity.add(new ludumdare_GoalTile(this._ctx,x1,y1,rotation = 1));
					break;
				case "M":
					entity.add(new ludumdare_GoalTile(this._ctx,x1,y1,rotation = 2));
					break;
				case "3":
					entity.add(new ludumdare_GoalTile(this._ctx,x1,y1,rotation = 3));
					break;
				case "G":
					entity.add(new ludumdare_GrassTile(this._ctx,x1,y1,rotation));
					break;
				case "X":
					entity.add(new ludumdare_BlockTile(this._ctx,x1,y1,rotation));
					break;
				default:
					null;
				}
				var tileSprite = [entity._compMap.Sprite_0];
				tileSprite[0].centerAnchor();
				tileSprite[0].setXY(this.WIDTH / 2,this.HEIGHT / 2);
				tileSprite[0].x.animateTo(x1 * this.TILE_SIZE + this.TILE_SIZE / 2,1 + Math.random(),flambe_animation_Ease.elasticOut);
				tileSprite[0].y.animateTo(y1 * this.TILE_SIZE + this.TILE_SIZE / 2,1 + Math.random(),flambe_animation_Ease.elasticOut);
				tileSprite[0].scaleX.animateTo(1.0,1 + Math.random(),flambe_animation_Ease.elasticOut);
				tileSprite[0].scaleY.animateTo(1.0,1 + Math.random(),flambe_animation_Ease.elasticOut);
				var rotations = [0.0,90.0,180.0,270.0];
				tileSprite[0].rotation.animateTo(rotations[rotation],1 + Math.random(),flambe_animation_Ease.elasticOut);
				var entity1 = this.tiles[y1][x1];
				entity1.add(tileSprite[0]);
				this.owner.addChild(entity1);
				var tileData = [entity1._compMap.TileData_9];
				tileSprite[0].get_pointerDown().connect((function() {
					return function(event) {
						mouseDown = true;
						startTileX = Math.floor(event.viewX / _g3.TILE_SIZE);
						startTileY = Math.floor(event.viewY / _g3.TILE_SIZE);
					};
				})());
				tileSprite[0].get_pointerUp().connect((function(tileData,tileSprite) {
					return function(event1) {
						if(!mouseDown) return;
						mouseDown = false;
						var tileX = tileData[0].tileX;
						var tileY = tileData[0].tileY;
						if(Math.abs(tileX - startTileX) == 0 && Math.abs(tileY - startTileY) == 0) {
							var player = _g3.playerEntity._compMap.Player_10;
							if(player._tile == null) return;
							var playerTileData = player._tile._compMap.TileData_9;
							var playerTileX = playerTileData.tileX;
							var playerTileY = playerTileData.tileY;
							var playerSprite = _g3.playerEntity._compMap.Sprite_0;
							if(Math.abs(playerTileX - tileX) + Math.abs(playerTileY - tileY) == 1) {
								if(_g3.canMoveToTile(playerTileData,tileData[0])) {
									player.moveToTile(tileSprite[0].owner);
									_g3._ctx.playJump();
									var _g4 = _g3.moves;
									var _g5 = _g4._value;
									_g4.set__(_g5 + 1);
									_g5;
								}
							}
							return;
						}
						if(Math.abs(tileX - startTileX) != 0 && Math.abs(tileY - startTileY) != 0) return;
						if(Math.abs(tileX - startTileX) != 0) {
							var hasBlock = false;
							var _g41 = 0;
							var _g51 = _g3.getRow(tileY);
							while(_g41 < _g51.length) {
								var tile = _g51[_g41];
								++_g41;
								if(tile._compMap.BlockTile_16 != null) {
									var shakeScript = new flambe_script_Script();
									tile.add(shakeScript);
									shakeScript.run(new flambe_script_Shake(5,5,0.5));
									emitter.setXY(tile._compMap.Sprite_0.x._value,tile._compMap.Sprite_0.y._value);
									emitter.restart();
									_g3._ctx.playHurt();
									hasBlock = true;
								}
							}
							if(hasBlock) return;
							_g3.moveRow(tileY,tileX - startTileX);
							_g3._ctx.playExplosion();
							var _g42 = _g3.moves;
							var _g52 = _g42._value;
							_g42.set__(_g52 + 1);
							_g52;
						} else if(Math.abs(tileY - startTileY) != 0) {
							var hasBlock1 = false;
							var _g43 = 0;
							var _g53 = _g3.getColumn(tileX);
							while(_g43 < _g53.length) {
								var tile1 = _g53[_g43];
								++_g43;
								if(tile1._compMap.BlockTile_16 != null) {
									var shakeScript1 = new flambe_script_Script();
									tile1.add(shakeScript1);
									shakeScript1.run(new flambe_script_Shake(5,5,0.5));
									emitter.setXY(tile1._compMap.Sprite_0.x._value,tile1._compMap.Sprite_0.y._value);
									emitter.restart();
									_g3._ctx.playHurt();
									hasBlock1 = true;
								}
							}
							if(hasBlock1) return;
							_g3.moveColumn(tileX,tileY - startTileY);
							_g3._ctx.playExplosion();
							var _g44 = _g3.moves;
							var _g54 = _g44._value;
							_g44.set__(_g54 + 1);
							_g54;
						}
					};
				})(tileData,tileSprite));
			}
		}
		var player1 = new ludumdare_Player(this._ctx,"player/player");
		this.playerEntity = new flambe_Entity().add(player1);
		this.owner.addChild(this.playerEntity);
		this.owner.addChild(emitterEntity);
		var playerSprite1 = this.playerEntity._compMap.Sprite_0;
		playerSprite1.setAlpha(0.0);
		var spawnPlayerScript = new flambe_script_Script();
		this.owner.add(spawnPlayerScript);
		spawnPlayerScript.run(new flambe_script_Sequence([new flambe_script_Shake(2,2,0.5),new flambe_script_CallFunction(function() {
			var startTile = _g3.tiles[2][2];
			var startTileSprite = startTile._compMap.Sprite_0;
			playerSprite1.setXY(startTileSprite.x._value,startTileSprite.y._value);
			playerSprite1.setScale(5.0);
			player1.moveToTile(startTile);
			playerSprite1.scaleX.animateTo(0.75,1,flambe_animation_Ease.bounceOut);
			playerSprite1.scaleY.animateTo(0.75,1,flambe_animation_Ease.bounceOut);
			playerSprite1.alpha.animateTo(1,1,flambe_animation_Ease.bounceOut);
		}),new flambe_script_Delay(0.3),new flambe_script_CallFunction(function() {
			var startTile1 = _g3.tiles[2][2];
			var startTileSprite1 = startTile1._compMap.Sprite_0;
			emitter.setXY(startTileSprite1.x._value,startTileSprite1.y._value);
			emitter.restart();
			_g3._ctx.playExplosion();
			spawnPlayerScript.dispose();
		})]));
	}
	,onUpdate: function(dt) {
	}
	,canMoveToTile: function(fromTile,toTile) {
		if(toTile.tileX < fromTile.tileX && (!fromTile.leftOpen || !toTile.rightOpen)) return false;
		if(toTile.tileX > fromTile.tileX && (!fromTile.rightOpen || !toTile.leftOpen)) return false;
		if(toTile.tileY < fromTile.tileY && (!fromTile.topOpen || !toTile.bottomOpen)) return false;
		if(toTile.tileY > fromTile.tileY && (!fromTile.bottomOpen || !toTile.topOpen)) return false;
		return true;
	}
	,getRow: function(index) {
		return this.tiles[index];
	}
	,getColumn: function(index) {
		var column = new Array();
		var _g = 0;
		var _g1 = this.tiles;
		while(_g < _g1.length) {
			var row = _g1[_g];
			++_g;
			column.push(row[index]);
		}
		return column;
	}
	,moveRow: function(index,direction) {
		var row = this.tiles[index];
		if(direction > 0) row.unshift(row.pop()); else if(direction < 0) row.push(row.shift());
		var count = 0;
		var _g = 0;
		while(_g < row.length) {
			var tile = row[_g];
			++_g;
			var tileData = tile._compMap.TileData_9;
			tileData.tileX = count;
			var sprite = tile._compMap.Sprite_0;
			sprite.x.animateTo(count * this.TILE_SIZE + this.TILE_SIZE / 2,1,flambe_animation_Ease.elasticOut);
			count++;
		}
		var shakeScript = new flambe_script_Script();
		this.owner.add(shakeScript);
		shakeScript.run(new flambe_script_Shake(2,1,0.4));
	}
	,moveColumn: function(index,direction) {
		var column = new Array();
		var _g = 0;
		var _g1 = this.tiles;
		while(_g < _g1.length) {
			var row = _g1[_g];
			++_g;
			column.push(row[index]);
		}
		if(direction > 0) column.unshift(column.pop()); else if(direction < 0) column.push(column.shift());
		var _g11 = 0;
		var _g2 = column.length;
		while(_g11 < _g2) {
			var y = _g11++;
			var tile = column[y];
			var tileData = tile._compMap.TileData_9;
			tileData.tileY = y;
			var sprite = tile._compMap.Sprite_0;
			sprite.y.animateTo(y * this.TILE_SIZE + this.TILE_SIZE / 2,1,flambe_animation_Ease.elasticOut);
			this.tiles[y][index] = tile;
		}
		var shakeScript = new flambe_script_Script();
		this.owner.add(shakeScript);
		shakeScript.run(new flambe_script_Shake(2,1,0.4));
	}
	,__class__: ludumdare_Map
});
var ludumdare_PlayScene = function() { };
ludumdare_PlayScene.__name__ = true;
ludumdare_PlayScene.create = function(ctx) {
	var scene = new flambe_Entity();
	var level = new ludumdare_LevelModel(ctx);
	ctx.level = level;
	scene.add(level);
	var scoreLabel = new flambe_display_TextSprite(ctx.arialFont);
	scoreLabel.setXY(flambe_System._platform.getStage().get_width() / 2,20);
	scoreLabel.centerAnchor();
	scoreLabel.setAlign(flambe_display_TextAlign.Center);
	scene.addChild(new flambe_Entity().add(scoreLabel));
	level.moves.watch(function(moves,_) {
		scoreLabel.set_text("Moves used: " + moves);
		scoreLabel.setScale(1.5);
		scoreLabel.scaleX.animateTo(1.0,0.7,flambe_animation_Ease.elasticOut);
		scoreLabel.scaleY.animateTo(1.0,0.7,flambe_animation_Ease.elasticOut);
		scoreLabel.letterSpacing.set__(5);
		scoreLabel.letterSpacing.animateTo(1.0,0.7,flambe_animation_Ease.elasticOut);
	});
	ctx.pack.getSound("music/main").loop(0.2);
	return scene;
};
var ludumdare_Player = function(ctx,name) {
	this.onWin = new flambe_util_Signal0();
	this._moveSpeed = 300;
	this._ctx = ctx;
	this._name = name;
};
ludumdare_Player.__name__ = true;
ludumdare_Player.__super__ = flambe_Component;
ludumdare_Player.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "Player_10";
	}
	,onAdded: function() {
		var normal = this._ctx.pack.getTexture(this._name);
		this._sprite = this.owner._compMap.Sprite_0;
		if(this._sprite == null) this.owner.add(this._sprite = new flambe_display_ImageSprite(normal));
		this._sprite.texture = normal;
		this._sprite.disablePixelSnapping();
		this._sprite.disablePointer();
		this._sprite.centerAnchor();
	}
	,onUpdate: function(dt) {
		if(this._tile != null) {
			var tileSprite = this._tile._compMap.Sprite_0;
			this._sprite.setXY(tileSprite.x._value,tileSprite.y._value);
		}
	}
	,moveToTile: function(tile) {
		var _g = this;
		var tileSprite = tile._compMap.Sprite_0;
		var distance = Math.sqrt(Math.pow(tileSprite.x._value - this._sprite.x._value,2) + Math.pow(tileSprite.y._value - this._sprite.y._value,2)) / this._moveSpeed;
		var moveScript = new flambe_script_Script();
		this.owner.add(moveScript);
		moveScript.run(new flambe_script_Sequence([new flambe_script_MoveTo(tileSprite.x._value,tileSprite.y._value,distance,flambe_animation_Ease.elasticOut,flambe_animation_Ease.elasticOut),new flambe_script_CallFunction(function() {
			_g._tile = tile;
			moveScript.dispose();
			if(tile._compMap.GoalTile_11 != null) _g.onWin.emit();
		})]));
		this._tile = null;
	}
	,__class__: ludumdare_Player
});
var ludumdare_PreloaderScene = function() { };
ludumdare_PreloaderScene.__name__ = true;
ludumdare_PreloaderScene.create = function(pack,promise) {
	var scene = new flambe_Entity();
	var background = new flambe_display_FillSprite(2105376,flambe_System._platform.getStage().get_width(),flambe_System._platform.getStage().get_height());
	scene.addChild(new flambe_Entity().add(background));
	var left = new flambe_display_ImageSprite(pack.getTexture("progress/Left"));
	var right = new flambe_display_ImageSprite(pack.getTexture("progress/Right"));
	var padding = 20;
	var progressWidth = flambe_System._platform.getStage().get_width() - left.texture.get_width() - right.texture.get_width() - 2 * padding;
	var y = flambe_System._platform.getStage().get_height() / 2 - left.texture.get_height();
	left.setXY(padding,y);
	scene.addChild(new flambe_Entity().add(left));
	var background1 = new flambe_display_PatternSprite(pack.getTexture("progress/Background"),progressWidth);
	background1.setXY(left.x._value + left.texture.get_width(),y);
	scene.addChild(new flambe_Entity().add(background1));
	var fill = new flambe_display_PatternSprite(pack.getTexture("progress/Fill"));
	fill.setXY(background1.x._value,y);
	promise.progressChanged.connect(function() {
		fill.width.set__(promise._progress / promise._total * progressWidth);
	});
	scene.addChild(new flambe_Entity().add(fill));
	right.setXY(fill.x._value + progressWidth,y);
	scene.addChild(new flambe_Entity().add(right));
	return scene;
};
var ludumdare_PromptScene = function() { };
ludumdare_PromptScene.__name__ = true;
ludumdare_PromptScene.create = function(ctx,text,message,buttons) {
	var scene = new flambe_Entity();
	scene.add(new flambe_scene_Scene(false));
	var background = new flambe_display_FillSprite(0,flambe_System._platform.getStage().get_width(),flambe_System._platform.getStage().get_height());
	background.alpha.animate(0,0.5,0.5);
	scene.addChild(new flambe_Entity().add(background));
	var label = new flambe_display_TextSprite(ctx.arialFont,text);
	label.setWrapWidth(flambe_System._platform.getStage().get_width()).setAlign(flambe_display_TextAlign.Center);
	label.x.animate(-flambe_System._platform.getStage().get_width(),0,0.5,flambe_animation_Ease.backOut);
	label.y.set__(flambe_System._platform.getStage().get_height() / 2 - 150);
	var labelBackground = new flambe_display_FillSprite(0,flambe_System._platform.getStage().get_width(),label.getNaturalHeight() + 5);
	labelBackground.alpha.animate(0,0.5,0.5);
	labelBackground.y.set__(label.y._value);
	var messageLabel = new flambe_display_TextSprite(ctx.arialFont,message);
	messageLabel.setWrapWidth(flambe_System._platform.getStage().get_width()).setAlign(flambe_display_TextAlign.Center);
	messageLabel.x.animate(-flambe_System._platform.getStage().get_width(),0,0.5,flambe_animation_Ease.backOut);
	messageLabel.y.set__(flambe_System._platform.getStage().get_height() / 2 - 80);
	scene.addChild(new flambe_Entity().add(labelBackground));
	scene.addChild(new flambe_Entity().add(label));
	scene.addChild(new flambe_Entity().add(messageLabel));
	var row = new flambe_Entity();
	var x = 0.0;
	var ii = 0;
	while(ii < buttons.length) {
		var name = buttons[ii++];
		var handler = [buttons[ii++]];
		var button = new flambe_display_ImageSprite(ctx.pack.getTexture("buttons/" + name));
		button.setXY(x,0);
		button.get_pointerDown().connect((function(handler) {
			return function(_) {
				ctx.playBeep();
				handler[0]();
			};
		})(handler));
		x += button.getNaturalWidth() + 20;
		row.addChild(new flambe_Entity().add(button));
	}
	var bounds = flambe_display_Sprite.getBounds(row);
	var sprite = new flambe_display_Sprite();
	sprite.x.animate(flambe_System._platform.getStage().get_width(),flambe_System._platform.getStage().get_width() / 2 - bounds.width / 2,0.5,flambe_animation_Ease.backOut);
	sprite.y.set__(messageLabel.y._value + messageLabel.getNaturalHeight() + 50);
	scene.addChild(row.add(sprite));
	ctx.playCoin();
	return scene;
};
var ludumdare_StraightTile = function(ctx,x,y,rotation) {
	this._ctx = ctx;
	this._tileX = x;
	this._tileY = y;
	this._rotation = rotation;
};
ludumdare_StraightTile.__name__ = true;
ludumdare_StraightTile.__super__ = flambe_Component;
ludumdare_StraightTile.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "StraightTile_12";
	}
	,onAdded: function() {
		var texture = this._ctx.pack.getTexture("tiles/straight");
		var sprite = new flambe_display_ImageSprite(texture);
		this.owner.add(sprite);
		var tileData = new ludumdare_TileData();
		tileData.tileX = this._tileX;
		tileData.tileY = this._tileY;
		var vertical = this._rotation == 0 || this._rotation == 2;
		tileData.topOpen = vertical;
		tileData.bottomOpen = vertical;
		tileData.leftOpen = !vertical;
		tileData.rightOpen = !vertical;
		this.owner.add(tileData);
	}
	,__class__: ludumdare_StraightTile
});
var ludumdare_TileData = function() {
};
ludumdare_TileData.__name__ = true;
ludumdare_TileData.__super__ = flambe_Component;
ludumdare_TileData.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "TileData_9";
	}
	,onAdded: function() {
	}
	,onUpdate: function(dt) {
	}
	,__class__: ludumdare_TileData
});
var vault_Sfxr = function(params) {
	if(params != null) this._params = params; else this._params = new vault_SfxrParams();
	this.buffer = new Array();
	this.reset(true);
	this.synthWave(this.buffer);
	this.player = this.makePlayer(this.buffer);
};
vault_Sfxr.__name__ = true;
vault_Sfxr.prototype = {
	reset: function(totalReset) {
		var p = this._params;
		this._period = 100.0 / (p.startFrequency * p.startFrequency + 0.001);
		this._maxPeriod = 100.0 / (p.minFrequency * p.minFrequency + 0.001);
		this._slide = 1.0 - p.slide * p.slide * p.slide * 0.01;
		this._deltaSlide = -p.deltaSlide * p.deltaSlide * p.deltaSlide * 0.000001;
		if(p.waveType == 0) {
			this._squareDuty = 0.5 - p.squareDuty * 0.5;
			this._dutySweep = -p.dutySweep * 0.00005;
		}
		if(p.changeAmount > 0.0) this._changeAmount = 1.0 - p.changeAmount * p.changeAmount * 0.9; else this._changeAmount = 1.0 + p.changeAmount * p.changeAmount * 10.0;
		this._changeTime = 0;
		if(p.changeSpeed == 1.0) this._changeLimit = 0; else this._changeLimit = (1.0 - p.changeSpeed) * (1.0 - p.changeSpeed) * 20000 + 32 | 0;
		if(totalReset) {
			this._masterVolume = p.masterVolume * p.masterVolume;
			this._waveType = p.waveType;
			if(p.sustainTime < 0.01) p.sustainTime = 0.01;
			var totalTime = p.attackTime + p.sustainTime + p.decayTime;
			if(totalTime < 0.18) {
				var multiplier = 0.18 / totalTime;
				p.attackTime *= multiplier;
				p.sustainTime *= multiplier;
				p.decayTime *= multiplier;
			}
			this._sustainPunch = p.sustainPunch;
			this._phase = 0;
			this._minFreqency = p.minFrequency;
			this._filters = p.lpFilterCutoff != 1.0 || p.hpFilterCutoff != 0.0;
			this._lpFilterPos = 0.0;
			this._lpFilterDeltaPos = 0.0;
			this._lpFilterCutoff = p.lpFilterCutoff * p.lpFilterCutoff * p.lpFilterCutoff * 0.1;
			this._lpFilterDeltaCutoff = 1.0 + p.lpFilterCutoffSweep * 0.0001;
			this._lpFilterDamping = 5.0 / (1.0 + p.lpFilterResonance * p.lpFilterResonance * 20.0) * (0.01 + this._lpFilterCutoff);
			if(this._lpFilterDamping > 0.8) this._lpFilterDamping = 0.8;
			this._lpFilterDamping = 1.0 - this._lpFilterDamping;
			this._lpFilterOn = p.lpFilterCutoff != 1.0;
			this._hpFilterPos = 0.0;
			this._hpFilterCutoff = p.hpFilterCutoff * p.hpFilterCutoff * 0.1;
			this._hpFilterDeltaCutoff = 1.0 + p.hpFilterCutoffSweep * 0.0003;
			this._vibratoPhase = 0.0;
			this._vibratoSpeed = p.vibratoSpeed * p.vibratoSpeed * 0.01;
			this._vibratoAmplitude = p.vibratoDepth * 0.5;
			this._envelopeVolume = 0.0;
			this._envelopeStage = 0;
			this._envelopeTime = 0;
			this._envelopeLength0 = p.attackTime * p.attackTime * 100000.0;
			this._envelopeLength1 = p.sustainTime * p.sustainTime * 100000.0;
			this._envelopeLength2 = p.decayTime * p.decayTime * 100000.0 + 10;
			this._envelopeLength = this._envelopeLength0;
			this._envelopeFullLength = this._envelopeLength0 + this._envelopeLength1 + this._envelopeLength2;
			this._phaser = p.phaserOffset != 0.0 || p.phaserSweep != 0.0;
			this._phaserOffset = p.phaserOffset * p.phaserOffset * 1020.0;
			if(p.phaserOffset < 0.0) this._phaserOffset = -this._phaserOffset;
			this._phaserDeltaOffset = p.phaserSweep * p.phaserSweep * p.phaserSweep * 0.2;
			this._phaserPos = 0;
			this._phaserBuffer = new Array();
			var _g = 0;
			while(_g < 1024) {
				var i = _g++;
				this._phaserBuffer.push(0.0);
			}
			this._noiseBuffer = new Array();
			var _g1 = 0;
			while(_g1 < 32) {
				var i1 = _g1++;
				this._noiseBuffer.push(Math.random() * 2.0 - 1.0);
			}
			this._repeatTime = 0;
			if(p.repeatSpeed == 0.0) this._repeatLimit = 0; else this._repeatLimit = ((1.0 - p.repeatSpeed) * (1.0 - p.repeatSpeed) * 20000 | 0) + 32;
		}
	}
	,synthWave: function(buffer) {
		var sampleRate = 44100;
		var bitDepth = 16;
		var finished = false;
		this._sampleCount = 0;
		this._bufferSample = 0.0;
		while(!finished) {
			if(this._repeatLimit != 0) {
				if(++this._repeatTime >= this._repeatLimit) {
					this._repeatTime = 0;
					this.reset(false);
				}
			}
			if(this._changeLimit != 0) {
				if(++this._changeTime >= this._changeLimit) {
					this._changeLimit = 0;
					this._period *= this._changeAmount;
				}
			}
			this._slide += this._deltaSlide;
			this._period *= this._slide;
			if(this._period > this._maxPeriod) {
				this._period = this._maxPeriod;
				if(this._minFreqency > 0.0) finished = true;
			}
			var periodTemp = this._period;
			if(this._vibratoAmplitude > 0.0) {
				this._vibratoPhase += this._vibratoSpeed;
				periodTemp = this._period * (1.0 + Math.sin(this._vibratoPhase) * this._vibratoAmplitude);
			}
			periodTemp = periodTemp | 0;
			if(periodTemp < 8) periodTemp = 8;
			if(this._waveType == 0) {
				this._squareDuty += this._dutySweep;
				if(this._squareDuty < 0.0) this._squareDuty = 0.0; else if(this._squareDuty > 0.5) this._squareDuty = 0.5;
			}
			if(++this._envelopeTime > this._envelopeLength) {
				this._envelopeTime = 0;
				var _g = ++this._envelopeStage;
				switch(_g) {
				case 1:
					this._envelopeLength = this._envelopeLength1;
					break;
				case 2:
					this._envelopeLength = this._envelopeLength2;
					break;
				}
			}
			var _g1 = this._envelopeStage;
			switch(_g1) {
			case 0:
				this._envelopeVolume = this._envelopeTime / this._envelopeLength0;
				break;
			case 1:
				this._envelopeVolume = 1.0 + (1.0 - this._envelopeTime / this._envelopeLength1) * 2.0 * this._sustainPunch;
				break;
			case 2:
				this._envelopeVolume = 1.0 - this._envelopeTime / this._envelopeLength2;
				break;
			case 3:
				this._envelopeVolume = 0.0;
				finished = true;
				break;
			}
			if(this._phaser) {
				this._phaserOffset += this._phaserDeltaOffset;
				this._phaserInt = this._phaserOffset | 0;
				if(this._phaserInt < 0) this._phaserInt = -this._phaserInt; else if(this._phaserInt > 1023) this._phaserInt = 1023;
			}
			if(this._filters && this._hpFilterDeltaCutoff != 0.0) {
				this._hpFilterCutoff *= this._hpFilterDeltaCutoff;
				if(this._hpFilterCutoff < 0.00001) this._hpFilterCutoff = 0.00001; else if(this._hpFilterCutoff > 0.1) this._hpFilterCutoff = 0.1;
			}
			this._superSample = 0.0;
			var _g2 = 0;
			while(_g2 < 8) {
				var j = _g2++;
				var sample = 0.0;
				this._phase++;
				if(this._phase >= periodTemp) {
					this._phase = this._phase - (periodTemp | 0);
					if(this._waveType == 3) {
						var _g11 = 0;
						while(_g11 < 32) {
							var n = _g11++;
							this._noiseBuffer[n] = Math.random() * 2.0 - 1.0;
						}
					}
				}
				var _g12 = this._waveType;
				switch(_g12) {
				case 0:
					if(this._phase / periodTemp < this._squareDuty) sample = 0.5; else sample = -0.5;
					break;
				case 1:
					sample = 1.0 - this._phase / periodTemp * 2.0;
					break;
				case 2:
					this._pos = this._phase / periodTemp;
					if(this._pos > 0.5) this._pos = (this._pos - 1.0) * 6.28318531; else this._pos = this._pos * 6.28318531;
					if(this._pos < 0) sample = 1.27323954 * this._pos + .405284735 * this._pos * this._pos; else sample = 1.27323954 * this._pos - 0.405284735 * this._pos * this._pos;
					if(sample < 0) sample = .225 * (sample * -sample - sample) + sample; else sample = .225 * (sample * sample - sample) + sample;
					break;
				case 3:
					sample = this._noiseBuffer[this._phase * 32 / (periodTemp | 0) | 0];
					break;
				}
				if(this._filters) {
					this._lpFilterOldPos = this._lpFilterPos;
					this._lpFilterCutoff *= this._lpFilterDeltaCutoff;
					if(this._lpFilterCutoff < 0.0) this._lpFilterCutoff = 0.0; else if(this._lpFilterCutoff > 0.1) this._lpFilterCutoff = 0.1;
					if(this._lpFilterOn) {
						this._lpFilterDeltaPos += (sample - this._lpFilterPos) * this._lpFilterCutoff;
						this._lpFilterDeltaPos *= this._lpFilterDamping;
					} else {
						this._lpFilterPos = sample;
						this._lpFilterDeltaPos = 0.0;
					}
					this._lpFilterPos += this._lpFilterDeltaPos;
					this._hpFilterPos += this._lpFilterPos - this._lpFilterOldPos;
					this._hpFilterPos *= 1.0 - this._hpFilterCutoff;
					sample = this._hpFilterPos;
				}
				if(this._phaser) {
					this._phaserBuffer[this._phaserPos & 1023] = sample;
					sample += this._phaserBuffer[this._phaserPos - this._phaserInt + 1024 & 1023];
					this._phaserPos = this._phaserPos + 1 & 1023;
				}
				this._superSample += sample;
			}
			this._superSample = this._masterVolume * this._envelopeVolume * this._superSample / 8.0;
			if(this._superSample > 1.0) this._superSample = 1.0; else if(this._superSample < -1.0) this._superSample = -1.0;
			var val = 32767.0 * this._superSample | 0;
			buffer.push(val & 255);
			buffer.push(val >> 8 & 255);
		}
	}
	,makePlayer: function(wave) {
		var wav_freq = 44100;
		var wav_bits = 16;
		var stereo = false;
		var buffer = new ArrayBuffer(44 + wave.length);
		var bv = new Uint8Array(buffer);
		var p = 0;
		var writeString = function(s) {
			var _g1 = 0;
			var _g = s.length;
			while(_g1 < _g) {
				var i = _g1++;
				bv[p++] = s.charCodeAt(i);
			}
		};
		var writeShort = function(s1) {
			bv[p++] = s1 & 255;
			bv[p++] = s1 >> 8 & 255;
		};
		var writeLong = function(s2) {
			bv[p++] = s2 & 255;
			bv[p++] = s2 >> 8 & 255;
			bv[p++] = s2 >> 16 & 255;
			bv[p++] = s2 >> 24 & 255;
		};
		writeString("RIFF");
		writeLong(0);
		writeString("WAVE");
		writeString("fmt ");
		writeLong(16);
		writeShort(1);
		var channels;
		if(stereo) channels = 2; else channels = 1;
		writeShort(channels);
		writeLong(wav_freq);
		var bps = wav_freq * channels * (wav_bits / 8 | 0);
		writeLong(bps);
		var align = channels * (wav_bits / 8 | 0);
		writeShort(align);
		writeShort(wav_bits);
		writeString("data");
		writeLong(wave.length);
		bv.set(wave,p);
		var audioBuffer = null;
		var wantsToPlay = false;
		if(vault_Sfxr.html5AudioContext == null) {
			var creator = window.webkitAudioContext || window.audioContext || null;
			if(creator == null) return function() {
			};
			vault_Sfxr.html5AudioContext = new creator();;
		}
		var play = function() {
			if(audioBuffer == null) {
				wantsToPlay = true;
				return;
			}
			var srcAudio = vault_Sfxr.html5AudioContext.createBufferSource();
			srcAudio.buffer = audioBuffer;
			srcAudio.connect(vault_Sfxr.html5AudioContext.destination);
			srcAudio.loop = false;
			srcAudio.start(0);
		};
		vault_Sfxr.html5AudioContext.decodeAudioData(buffer,function(b) {
			audioBuffer = b;
			if(wantsToPlay) play();
		});
		return play;
	}
	,__class__: vault_Sfxr
};
var vault_SfxrParams = function(seed) {
	this.MAX_INT = 2147483647;
	this.hpFilterCutoffSweep = 0.0;
	this.hpFilterCutoff = 0.0;
	this.lpFilterResonance = 0.0;
	this.lpFilterCutoffSweep = 0.0;
	this.lpFilterCutoff = 1.0;
	this.phaserSweep = 0.0;
	this.phaserOffset = 0.0;
	this.repeatSpeed = 0.0;
	this.dutySweep = 0.0;
	this.squareDuty = 0.0;
	this.changeSpeed = 0.0;
	this.changeAmount = 0.0;
	this.vibratoSpeed = 0.0;
	this.vibratoDepth = 0.0;
	this.deltaSlide = 0.0;
	this.slide = 0.0;
	this.minFrequency = 0.0;
	this.startFrequency = 0.3;
	this.decayTime = 0.4;
	this.sustainPunch = 0.0;
	this.sustainTime = 0.3;
	this.attackTime = 0.0;
	this.masterVolume = 0.5;
	this.waveType = 0;
	this.seed(seed);
};
vault_SfxrParams.__name__ = true;
vault_SfxrParams.prototype = {
	generatePickupCoin: function() {
		this.startFrequency = 0.4 + this.random() * 0.5;
		this.sustainTime = this.random() * 0.1;
		this.decayTime = 0.1 + this.random() * 0.4;
		this.sustainPunch = 0.3 + this.random() * 0.3;
		if(this.random() < 0.5) {
			this.changeSpeed = 0.5 + this.random() * 0.2;
			this.changeAmount = 0.2 + this.random() * 0.4;
		}
	}
	,generateExplosion: function() {
		this.waveType = 3;
		if(this.random() < 0.5) {
			this.startFrequency = 0.1 + this.random() * 0.4;
			this.slide = -0.1 + this.random() * 0.4;
		} else {
			this.startFrequency = 0.2 + this.random() * 0.7;
			this.slide = -0.2 - this.random() * 0.2;
		}
		this.startFrequency *= this.startFrequency;
		if(this.random() < 0.2) this.slide = 0.0;
		if(this.random() < 0.33) this.repeatSpeed = 0.3 + this.random() * 0.5;
		this.sustainTime = 0.1 + this.random() * 0.3;
		this.decayTime = this.random() * 0.5;
		this.sustainPunch = 0.2 + this.random() * 0.6;
		if(this.random() < 0.5) {
			this.phaserOffset = -0.3 + this.random() * 0.9;
			this.phaserSweep = -this.random() * 0.3;
		}
		if(this.random() < 0.33) {
			this.changeSpeed = 0.6 + this.random() * 0.3;
			this.changeAmount = 0.8 - this.random() * 1.6;
		}
	}
	,generatePowerup: function() {
		if(this.random() < 0.5) this.waveType = 1; else this.squareDuty = this.random() * 0.6;
		if(this.random() < 0.5) {
			this.startFrequency = 0.2 + this.random() * 0.3;
			this.slide = 0.1 + this.random() * 0.4;
			this.repeatSpeed = 0.4 + this.random() * 0.4;
		} else {
			this.startFrequency = 0.2 + this.random() * 0.3;
			this.slide = 0.05 + this.random() * 0.2;
			if(this.random() < 0.5) {
				this.vibratoDepth = this.random() * 0.7;
				this.vibratoSpeed = this.random() * 0.6;
			}
		}
		this.sustainTime = this.random() * 0.4;
		this.decayTime = 0.1 + this.random() * 0.4;
	}
	,generateHitHurt: function() {
		this.waveType = Std["int"](this.random() * 3);
		if(this.waveType == 2) this.waveType = 3; else if(this.waveType == 0) this.squareDuty = this.random() * 0.6;
		this.startFrequency = 0.2 + this.random() * 0.6;
		this.slide = -0.3 - this.random() * 0.4;
		this.sustainTime = this.random() * 0.1;
		this.decayTime = 0.1 + this.random() * 0.2;
		if(this.random() < 0.5) this.hpFilterCutoff = this.random() * 0.3;
	}
	,generateJump: function() {
		this.waveType = 0;
		this.squareDuty = this.random() * 0.6;
		this.startFrequency = 0.3 + this.random() * 0.3;
		this.slide = 0.1 + this.random() * 0.2;
		this.sustainTime = 0.1 + this.random() * 0.3;
		this.decayTime = 0.1 + this.random() * 0.2;
		if(this.random() < 0.5) this.hpFilterCutoff = this.random() * 0.3;
		if(this.random() < 0.5) this.lpFilterCutoff = 1.0 - this.random() * 0.6;
	}
	,generateBlipSelect: function() {
		this.waveType = Std["int"](this.random() * 2);
		if(this.waveType == 0) this.squareDuty = this.random() * 0.6;
		this.startFrequency = 0.2 + this.random() * 0.4;
		this.sustainTime = 0.1 + this.random() * 0.1;
		this.decayTime = this.random() * 0.2;
		this.hpFilterCutoff = 0.1;
	}
	,mutate: function(mutation) {
		if(mutation == null) mutation = 0.05;
		if(this.random() < 0.5) this.startFrequency += this.random() * mutation * 2 - mutation;
		if(this.random() < 0.5) this.minFrequency += this.random() * mutation * 2 - mutation;
		if(this.random() < 0.5) this.slide += this.random() * mutation * 2 - mutation;
		if(this.random() < 0.5) this.deltaSlide += this.random() * mutation * 2 - mutation;
		if(this.random() < 0.5) this.squareDuty += this.random() * mutation * 2 - mutation;
		if(this.random() < 0.5) this.dutySweep += this.random() * mutation * 2 - mutation;
		if(this.random() < 0.5) this.vibratoDepth += this.random() * mutation * 2 - mutation;
		if(this.random() < 0.5) this.vibratoSpeed += this.random() * mutation * 2 - mutation;
		if(this.random() < 0.5) this.attackTime += this.random() * mutation * 2 - mutation;
		if(this.random() < 0.5) this.sustainTime += this.random() * mutation * 2 - mutation;
		if(this.random() < 0.5) this.decayTime += this.random() * mutation * 2 - mutation;
		if(this.random() < 0.5) this.sustainPunch += this.random() * mutation * 2 - mutation;
		if(this.random() < 0.5) this.lpFilterCutoff += this.random() * mutation * 2 - mutation;
		if(this.random() < 0.5) this.lpFilterCutoffSweep += this.random() * mutation * 2 - mutation;
		if(this.random() < 0.5) this.lpFilterResonance += this.random() * mutation * 2 - mutation;
		if(this.random() < 0.5) this.hpFilterCutoff += this.random() * mutation * 2 - mutation;
		if(this.random() < 0.5) this.hpFilterCutoffSweep += this.random() * mutation * 2 - mutation;
		if(this.random() < 0.5) this.phaserOffset += this.random() * mutation * 2 - mutation;
		if(this.random() < 0.5) this.phaserSweep += this.random() * mutation * 2 - mutation;
		if(this.random() < 0.5) this.repeatSpeed += this.random() * mutation * 2 - mutation;
		if(this.random() < 0.5) this.changeSpeed += this.random() * mutation * 2 - mutation;
		if(this.random() < 0.5) this.changeAmount += this.random() * mutation * 2 - mutation;
	}
	,seed: function(seed) {
		if(seed != null) this._randomstate = seed; else this._randomstate = Math.floor(Math.random() * this.MAX_INT);
	}
	,randint: function() {
		this._randomstate = (1103515245.0 * this._randomstate + 12345) % this.MAX_INT;
		return this._randomstate;
	}
	,random: function() {
		return this.randint() / this.MAX_INT;
	}
	,__class__: vault_SfxrParams
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
Xml.Element = "element";
Xml.PCData = "pcdata";
Xml.CData = "cdata";
Xml.Comment = "comment";
Xml.DocType = "doctype";
Xml.ProcessingInstruction = "processingInstruction";
Xml.Document = "document";
flambe_platform_html_HtmlPlatform.instance = new flambe_platform_html_HtmlPlatform();
flambe_util_SignalBase.DISPATCHING_SENTINEL = new flambe_util_SignalConnection(null,null);
flambe_System.root = new flambe_Entity();
flambe_System.uncaughtError = new flambe_util_Signal1();
flambe_System.hidden = new flambe_util_Value(false);
flambe_System.volume = new flambe_animation_AnimatedFloat(1);
flambe_System._platform = flambe_platform_html_HtmlPlatform.instance;
flambe_System._calledInit = false;
flambe_asset_Manifest.__meta__ = { obj : { assets : [{ bootstrap : [{ bytes : 236, md5 : "0531ff7e710dfe83cf2a403d60cd0029", name : "progress/Background.png"},{ bytes : 233, md5 : "0f7932bfef9dc00317b5f065a6fd9ee2", name : "progress/Fill.png"},{ bytes : 1802, md5 : "38483ec805d762b46f98d860a07d8486", name : "progress/Left.png"},{ bytes : 1812, md5 : "ef81e68e66258c3d52b80674c6626bf9", name : "progress/Right.png"}], locale : [{ bytes : 671, md5 : "eb2ee507825770e975abe3184d4370e3", name : "messages.ini"}], main : [{ bytes : 4427, md5 : "145aeed568d44d8610fc81a14a4dc5fa", name : "backgrounds/background.png"},{ bytes : 10023, md5 : "8e8e4ad838d1be7108dbc21266a3c1a7", name : "buttons/play.png"},{ bytes : 248524, md5 : "84679cd7028d81b645a3787cbcf570dc", name : "buttons/play.pxm"},{ bytes : 17379, md5 : "f10f43eaf59d3c94722ac41913ea25fb", name : "cursors/cursor.png"},{ bytes : 192356, md5 : "fb27f2e7410f7bc3a3bf6352dc5b1cc2", name : "cursors/cursor.pxm"},{ bytes : 16389, md5 : "e7017482f5b5283a37438bb6ff320804", name : "fonts/arial_black_15_blue.fnt"},{ bytes : 20194, md5 : "c952b30fb571c1e0d0b8295260b48745", name : "fonts/arial_black_15_blue.png"},{ bytes : 20343, md5 : "ed17f2ec8f82db984282ce9de010ea40", name : "fonts/handel.fnt"},{ bytes : 19845, md5 : "85dbc080752469baf78cb5f23a0498c4", name : "fonts/handel.png"},{ bytes : 21146, md5 : "fb38026108207095328515670e6ebca5", name : "fonts/testfont.fnt"},{ bytes : 16859, md5 : "5cf7af9e72bc627d5f06e900647da029", name : "fonts/testfont.png"},{ bytes : 40, md5 : "89d9bd80e584ad10c025a13749ecdc7c", name : "levels/level1.lvl"},{ bytes : 40, md5 : "2fe02dc70ace3b0cf1f420dd947e624a", name : "levels/level2.lvl"},{ bytes : 43, md5 : "993bb2436d7fd8612bf4d35ae2aa4fb7", name : "levels/level3.lvl"},{ bytes : 40, md5 : "09ba7ce34a752c588e69f00154407508", name : "levels/level4.lvl"},{ bytes : 40, md5 : "c9a91d8a1d4cfd892dec58d3b96d0945", name : "levels/level5.lvl"},{ bytes : 40, md5 : "c10b57a9c5625b596d66989b71d67f80", name : "levels/level6.lvl"},{ bytes : 40, md5 : "aa61691d44c82d3d6915ea1338da496e", name : "levels/level7.lvl"},{ bytes : 1344992, md5 : "118724e0d5a13bd8313ea5ba127df499", name : "music/main.mp3"},{ bytes : 1688190, md5 : "65c64b02ef0425681390a2965ac8f22b", name : "music/main.ogg"},{ bytes : 1993, md5 : "25fa57d40cbbf5b1d651a960f7fe4b3b", name : "particles/explode.pex"},{ bytes : 3708, md5 : "f1e607dbc4cf9311f145e368f1194a2a", name : "particles/particle.png"},{ bytes : 88447, md5 : "5654c740be5b67f15b4e73c20edbef9c", name : "particles/particle.pxm"},{ bytes : 9559, md5 : "77defe41c9c94845cf762f099b99461a", name : "player/player.png"},{ bytes : 286892, md5 : "adc4885c6f610137677cc7027518b4f6", name : "player/player.pxm"},{ bytes : 4626, md5 : "3a6eda881dd2ead3146c205a3ea8a796", name : "tiles/bend.png"},{ bytes : 457301, md5 : "24bce3878ca65384d5cd8711c23d9125", name : "tiles/bend.pxm"},{ bytes : 4905, md5 : "7ae7f0ecfe9890b2d42288d6f28e3b56", name : "tiles/block.png"},{ bytes : 294413, md5 : "bfcbbf617bb64ae557caee5274686ca7", name : "tiles/block.pxm"},{ bytes : 4097, md5 : "37a20c6e71363a0aecf3801c1761ae13", name : "tiles/empty.png"},{ bytes : 93155, md5 : "ec2ceda8da2f36a88f0aebb5f7452cff", name : "tiles/empty.pxm"},{ bytes : 6448, md5 : "8c58b81e008d6518029ca1798642bd5f", name : "tiles/goal.png"},{ bytes : 779134, md5 : "abdb132737df944c37fdb69855650f7c", name : "tiles/goal.pxm"},{ bytes : 38285, md5 : "44b439731f8dc86c7b49f354293c48e6", name : "tiles/grass.png"},{ bytes : 387998, md5 : "f65075728d4ca38a1153f0ad3d115414", name : "tiles/grass.pxm"},{ bytes : 4506, md5 : "d7b4ca9fe82121203320621b7945c861", name : "tiles/selection.png"},{ bytes : 167676, md5 : "30823a390a49ec0f551feb5acbf37d7d", name : "tiles/selection.pxm"},{ bytes : 4478, md5 : "82a25413b88c1a407c6ae3e844c6906e", name : "tiles/straight.png"},{ bytes : 349847, md5 : "5fdd852fdc2d73faa12d7b98175b585b", name : "tiles/straight.pxm"}]}]}};
flambe_asset_Manifest._supportsCrossOrigin = (function() {
	var detected = (function() {
		if(window.navigator.userAgent.indexOf("Linux; U; Android") >= 0) return false;
		var xhr = new XMLHttpRequest();
		return xhr.withCredentials != null;
	})();
	if(!detected) null;
	return detected;
})();
flambe_display_Sprite._scratchPoint = new flambe_math_Point();
flambe_display_Font.NEWLINE = new flambe_display_Glyph(10);
flambe_platform_BasicMouse._sharedEvent = new flambe_input_MouseEvent();
flambe_platform_BasicPointer._sharedEvent = new flambe_input_PointerEvent();
flambe_platform_html_CanvasRenderer.CANVAS_TEXTURES = (function() {
	var pattern = new EReg("(iPhone|iPod|iPad)","");
	return pattern.match(window.navigator.userAgent);
})();
flambe_platform_html_HtmlAssetPackLoader._mediaRefCount = 0;
flambe_platform_html_HtmlAssetPackLoader._detectBlobSupport = true;
flambe_platform_html_HtmlUtil.VENDOR_PREFIXES = ["webkit","moz","ms","o","khtml"];
flambe_platform_html_HtmlUtil.SHOULD_HIDE_MOBILE_BROWSER = window.top == window && new EReg("Mobile(/.*)? Safari","").match(window.navigator.userAgent);
flambe_platform_html_WebAudioSound._detectSupport = true;
flambe_platform_html_WebGLGraphics._scratchMatrix = new flambe_math_Matrix();
haxe_xml_Parser.escapes = (function($this) {
	var $r;
	var h = new haxe_ds_StringMap();
	h.set("lt","<");
	h.set("gt",">");
	h.set("amp","&");
	h.set("quot","\"");
	h.set("apos","'");
	h.set("nbsp",String.fromCharCode(160));
	$r = h;
	return $r;
}(this));
ludumdare_LevelModel.TILE_SIZE = 128;
ludumdare_LevelModel.HEIGHT = ludumdare_LevelModel.TILE_SIZE * 5;
ludumdare_LevelModel.WIDTH = ludumdare_LevelModel.TILE_SIZE * 7;
ludumdare_Main.main();
})();
