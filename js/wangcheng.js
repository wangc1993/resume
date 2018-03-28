/*
* 开发人员：王成
* 开发日期：2017年12月8日
* 描述：通用框架
* 版权所有 违者必究
*/

(function(window){
    /*定义一个对象：$$*/
    var $$ = function(){};
    /*原型方式创建对象*/
    $$.prototype = {
        /*对象扩展：将后面对象的属性和方法拷贝到前面对象*/
        extend: function(target,source){
            /*遍历对象*/
            for(var i in source){
                target[i] = source[i];
            }
            return target;
        }
    }
    /*在框架中进行实例化，框架外就可以直接用了*/
    $$ = new $$();

    /*数据类型检测模块*/
    $$.extend($$,{
        /*isFinite:如果 number 是有限数字（或可转换为有限数字），那么返回 true。否则，如果 number 是 NaN（非数字），或者是正、负无穷大的数，则返回 false。*/
        isNumber: function(val){
            return typeof val === 'number' && isFinite(val);
        },
        /*布尔型*/
        isBoolean: function(val){
            return typeof val === 'boolean';
        },
        /*字符型*/
        isString:function (val) {
            return typeof val === "string";
        },
        /*是否定义*/
        isUndefined:function (val) {
            return typeof val === "undefined";
        },
        /*对象*/
        isObj: function(val){
            if(val === null || typeof val === 'undefined'){
                return false;
            }
            return typeof val === 'object';
        },
        /*是否为空*/
        isNull: function(val){
            return val === null;
        },
        /*数组*/
        isArray: function(arr){
            if(arr === null || typeof arr === 'undefined'){
                return false;
            }
            return arr.constructor === Array;
        }
    });

    /*字符串模块*/
    $$.extend($$,{
        /*去除文本左边空格*/
        ltrim: function(str){
            return str.replace(/(^\s*)/g,'');//其中^表示匹配输入字符串的开始位置，\s匹配任何空白字符，包括空格、制表符、换页符等等。/g表示全局匹配，global
        },
        /*去除文本右边空格*/
        rtrim: function(str){
            return str.replace(/(\s*$)/g,'');//$表示匹配输入字符串的结尾位置
        },
        //去除空格
        trim:function(str){
            return str.replace(/(^\s*)|(\s*$)/g,'');
        },
        /*简单的数据绑定
        **replace参数：正则表达式，处理函数；
        **处理函数参数：匹配模式的字符串，与模式中的子表达式匹配的字符串（可以有多个或0个）
        */
        formateString: function(str,data){
            return str.replace(/@\((\w+)\)/g,function(match,key){
                return typeof data[key] === 'undefined'? '':data[key]
            })
        }
    });

    /*选择器模块*/
    $$.extend($$,{
        /*id选择器*/
        $id: function(id){
            return document.getElementById(id);
        },
        /*tag选择器*/
        $tag: function(tag,content){
            if(typeof content === 'string'){
                content = $$.$id(content);
            }
            if(content){
                return content.getElementsByTagName(tag);
            }else{
                return document.getElementsByTagName(tag);
            }
        },
        /*class选择器*/
        $class: function(className,content){
            var dom;
            var element = [];
            /*判断content类型*/
            if($$.isString(content)){
                content = $$.$id(content);
            }else{
                content = document;
            }
            /*处理浏览器兼容getElementsByClassName*/
            if(content.getElementsByClassName){
                return content.getElementsByClassName(className);
            }else{
                /*不兼容：获取全部标签，作遍历处理*/
                dom = document.getElementsByTagName('*');
                for(var i,len=dom.length;i<len;i++) {
                    if(dom[i].className && dom[i].className ==className ) {
                        elements.push(dom[i]);
                    }
                }
            }
        },
        /*分组选择器*/
        $group: function(content){
            var result = [], doms = [];
            var arr = $$.trim(content).split(',');
            for(var i=0,len=arr.length; i<len; i++) {
                var item = $$.trim(arr[i]);
                var first= item.charAt(0);
                var index = item.indexOf(first);
                if(first === '.') {
                    doms=$$.$class(item.slice(index+1))
                    /*每次循环将doms保存在reult中*/
                    pushArray(doms,result);

                }else if(first ==='#'){
                    doms=[$$.$id(item.slice(index+1))];
                    /*陷阱：之前我们定义的doms是数组，但是$id获取的不是数组，而是单个元素*/
                    pushArray(doms,result)
                }else{
                    doms = $$.$tag(item)
                    pushArray(doms,result)
                }
            }
            return result;
            /*封装重复的代码*/
            function pushArray(doms,result){
                for(var j= 0, domlen = doms.length; j < domlen; j++){
                    result.push(doms[j])
                }
            }
        },
        /*层次选择器*/
        $cengci: function(select){
            var sel = $$.trim(select).split(' ');
            var result = [];
            var content = [];
            for(var i=0, len = sel.length; i<len; i++){
                /*每次都需要清空result*/
                result = [];
                var item = $$.trim(sel[i]);
                var first = sel[i].charAt(0);
                var index = item.indexOf(first);
                if(first === '#'){
                    pushArray([$$.$id(item.slice(index + 1))]);
                    content = result;
                }else if(first === '.'){
                    /*需要判断.是否是第一层：即看content.length*/
                    if(content.length){
                        /*遍历父元素：content*/
                        for(var j=0, contentLen = content.length; j<contentLen; j++){
                            pushArray($$.$class(item.slice(index + 1),content[j]));
                        }
                    }else{
                        pushArray($$.$class(item.slice(index + 1)));
                    }
                    content = result;
                }else{
                    /*如果是标签*/
                    if(content.length){
                        for(var j=0, contentLen = content.length; j<contentLen; j++){
                            pushArray($$.$tag(item,content[j]));
                        }
                    }else{
                        pushArray($$.$tag(item));
                    }
                    content = result;
                }
            }
            return content;
            function pushArray(doms){
                for(var j= 0, domlen = doms.length; j < domlen; j++){
                    result.push(doms[j])
                }
            }
        },
        /*多组+层次*/
        $select: function(str){
            var result = [];
            var item = $$.trim(str).split(',');
            for(var i=0, len = item.length; i<len; i++){
                var select = $$.trim(item[i]);
                var content = [];
                content = $$.$cengci(select);
                pushArray(content);
            }
            return result;
            function pushArray(doms){
                for(var j= 0, domlen = doms.length; j < domlen; j++){
                    result.push(doms[j])
                }
            }
        },
        /*h5自身的选择器*/
        $all: function(selector,content){
            content = content || document;
            /*返回的是一个集合*/
            return content.querySelectorAll(selector);
        }
    });


    /*ajax模块*/
    $$.extend($$,{
        myAjax: function(url,fn){
            var xhr = createXHR();
            xhr.onreadystatechange = function(){
                if(xhr.readyState === 4){
                    if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
                        fn(xhr.responseText);
                    }else{
                        alert("错误的文件！");
                    }
                }
            };
            xhr.open("get",URL,true);
            xhr.send();

            /*闭包形式，因为这个函数只服务于ajax函数，所以放在里面*/
            function createXHR(){
                if(typeof XMLHttpRequest != 'undefined'){
                    return new XMLHttpRequest();
                }else if(typeof ActiveXObject != 'undefined'){
                    if(typeof arguments.callee.activeXString != 'string'){
                        var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
                                "MSXML2.XMLHttp"],i,len;

                        for(i=0, len = versions.length; i<len; i++){
                            try{
                                new ActiveXObject(versions[i]);
                                arguments.callee.activeXString = versions[i];
                                break;
                            }catch(ex){
                                /*略*/
                            }
                        }
                    }

                    return new ActiveXObject(arguments.callee.activeXString);
                }else{
                    throw new Error("No XHR object available.");
                }
            }
        }
    });

    /*事件模块*/
    $$.extend($$,{
        /*事件绑定*/
        on: function(id, type, fn){
            var doms = $$.isString(id)?document.getElementById(id):id;
            if(doms.addEventListener){
                /*W3C版本，大多数浏览器支持（火狐。谷歌、IE9及之后）true捕获阶段执行，false冒泡将阶段执行，默认false*/
                doms.addEventListener(type, fn, false);
            }else if(doms.attachEvent){
                /*IE8及之前*/
                doms.attachEvent('on' + type, fn);
            }
        },
        /*解绑*/
        un: function(id, type, fn){
            var doms = $$.isString(id)?document.getElementById(id):id;
            if(doms.removeEventListener){
                doms.removeEventListener(type, fn);
            }else if(doms.detachEvent){
                doms.detachEvent(type, fn);
            }
        },
        /*事件委托*/
        delegate: function(pid, eventType, selector, fn){
            /*参数处理*/
            var parent = $$.$id(pid);
            function handle(e){
                var target = $$.getTarget(e);
                if(target.nodeName.toLowerCase()=== selector || target.id === selector || target.className.indexOf(selector) != -1){
                    /*在事件冒泡的时候，回以此遍历每个子孙后代，如果找到对应的元素，则执行如下函数;函数中的this默认指向window，而我们希望指向当前dom元素本身,我们使用call，因为call可以改变this指向*/
                    fn.call(target);
                }
            }
            /*当我们给父亲元素绑定一个事件，他的执行顺序：先捕获到目标元素，然后事件再冒泡，这里是是给元素对象绑定一个事件*/
            parent[eventType] = handle;
        },
        /*点击事件*/
        click: function(id,fn){
            this.on(id, 'click', fn);
        },
        /*鼠标移上*/
        mouseover:function(id,fn){
            this.on(id,'mouseover',fn);
        },
        /*鼠标离开*/
        mouseout:function(id,fn){
            this.on(id,'mouseout',fn);
        },
        /*悬浮*/
        hover : function(id, fnOver, fnOut){
            if(fnOver){
                this.on(id,"mouseover",fnOver);
            }
            if(fnOut){
                this.on(id,"mouseout",fnOut);
            }
        },
        /*事件目标*/
        getEvent: function(event){
            return event?event:window.event;
        },
        /*获取目标*/
        getTarget: function(event){
            var e = $$.getEvent(event);
            return e.target || e.srcElement;
        },
        /*阻止默认行为*/
        preventDefault:function(event){
            var event = $$.getEvent(event);
            if(event.preventDefault){
                event.preventDefault();
            }else{
                event.returnValue = false;
            }
        },
        /*阻止冒泡*/
        stopPropagation: function(event){
            var event = $$.getEvent(event);
            if(event.stopPropagation){
                event.stopPropagation();
            }else{
                event.cancelBubble = true;
            }
        }
    });

    /*css模块*/
    $$.extend($$,{
        /*样式:key,value以字符串的形式传入*/
        css: function(context, key, value){
            /*先判断content表示一个字符串还是其他*/
            var doms = $$.isString(context)?$$.$all(context) : context;
            if(doms.length){
                /*如果是数组*/
                if(value){
                    /*如果有值：设置样式*/
                    for(var i = doms.length - 1; i >= 0; i--){
                            setStyle(doms[i],key, value);
                        }
                }else{
                    /*值为空：获取样式（第一个）*/
                    return getStyle(doms[0]);
                }
            }else{
                /*不是数组*/
                if(value){
                    setStyle(doms, key, value);
                }else{
                    return getStyle(doms);
                }
            }
            /*设置样式*/
            function setStyle(dom, key, value){
                /*这边key是变量，需要用[]取，点取无效*/
                dom.style[key] = value;
            }
            /*获取样式*/
            function getStyle(dom){
                /*当元素的样式是通过js动态加上去的，那么在获取样式时，通过style方式就获取不到
                *解决方式：js中提供了全局的getComputedStyle函数
                */
               if(dom.currentStyle){
                    /*在IE中，每个具有style属性的元素还有一个currentStyle属性。这个属性是CSSStyleDeclaration的实例，包含当前元素全部计算后的样式。*/
                    return dom.currentStyle[key];
               }else{
                /*getComputedStyle()方法接受两个参数：要取得计算样式的元素和一个伪元素字符串（例如“:after”）。如果不需要伪元素信息，第二个参数可以是null。getComputerStyle()方法返回一个CSSStyleDeclaration对象，其中包含当前元素的所有计算的样式。*/
                    return getComputedStyle(dom,null)[key];
               }
            }
        },
        /*元素高度宽度概述
        计算方式：clientHeight clientWidth innerWidth innerHeight
        元素的实际高度+border，也不包含滚动条*/
        Width:function (id){
            var doms = $$.isString(id)?$$.$id(id) : id;
            return doms.clientWidth;
        },
        Height:function (id){
            return $$.$id(id).clientHeight
        },
        /*元素的滚动高度和宽度
        当元素出现滚动条时候，这里的高度有两种：可视区域的高度 实际高度（可视高度+不可见的高度）
        计算方式 scrollwidth*/
        scrollWidth:function (id){
            return $$.$id(id).scrollWidth
        },
        scrollHeight:function (id){
            return $$.$id(id).scrollHeight
        },
        /*元素滚动的时候 如果出现滚动条 相对于左上角的偏移量
        计算方式 scrollTop scrollLeft*/
        scrollTop:function (id){
            return $$.$id(id).scrollTop
        },
        scrollLeft:function (id){
            return $$.$id(id).scrollLeft
        },
        /*获取屏幕的高度和宽度*/
        screenHeight:function (){
            return  window.screen.height
        },
        screenWidth:function (){
            return  window.screen.width
        },
        /*文档视口的高度和宽度*/
        wWidth:function (){
            return document.documentElement.clientWidth
        },
        wHeight:function (){
            return document.documentElement.clientHeight
        },
        /*文档滚动区域的整体的高和宽*/
        wScrollHeight:function () {
            return document.body.scrollHeight
        },
        wScrollWidth:function () {
            return document.body.scrollWidth
        },
        /*获取滚动条相对于其顶部的偏移*/
        wScrollTop:function (content) {
            if(content){
                if(document.documentElement.scrollTop != undefined){
                    document.documentElement.scrollTop = content;
                }else if(window.pageYOffset != undefined){
                    window.pageYOffset = content;
                }else if(document.body.scrollTop != undefined){
                    document.body.scrollTop = content;
                }
            }else{
                var scrollTop = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop;
                return scrollTop;
            }
        },
        /*获取滚动条相对于其左边的偏移*/
        wScrollLeft:function (content) {
            if(content){
                if(document.body.scrollLeft != undefined){
                    document.body.scrollLeft = content;
                }else if((document.documentElement != undefined) && (document.documentElement.scrollLeft != undefined)){
                    document.documentElement.scrollLeft = content;
                }
            }else{
                var scrollLeft = document.body.scrollLeft || (document.documentElement && document.documentElement.scrollLeft);
                return scrollLeft;
            }
        },
        /*隐藏元素*/
        hide: function(content){
            var doms = $$.$all(content);
            for(var i=0; i<doms.length; i++){
                $$.css(doms[i], 'display', 'none');
            }
        },
        /*显示元素*/
        show: function(content){
            var doms = $$.$all(content);
            for(var i=0; i<doms.length; i++){
                $$.css(doms[i], 'display', 'block');
            }
        }
    });

    /*属性模块*/
    $$.extend($$,{
        /*设置属性值*/
        attr: function(content, name, value){
            var doms =$$.$all(content);
            if(doms.length){
                /*数组*/
                if(value){
                    for(var i=0, len = doms.length; i<len; i++){
                        doms[i].setAttribute(name,value);
                    }
                }else{
                    return doms[0].getAttribute(name);
                }
            }else{
                /*单个元素*/
                if(value){
                    doms.setAttribute(name,value);
                }else{
                    return doms.getAttribute(name);
                }
            }
        },
        addClass: function(content, name){
            var doms =$$.$all(content);
            if(doms.length){
                for(var i= 0,len=doms.length;i<len;i++){
                    addName(doms[i]);
                }
            }else{
                addName(doms);
            }
            function addName(dom){
                dom.className = dom.className + ' ' + name;
            }
        },
        removeClass: function(content, name){
            var doms =$$.$all(content);
            if(doms.length){
                for(var i= 0,len=doms.length;i<len;i++){
                    removeName(doms[i]);
                }
            }else{
                addName(doms);
            }
            function removeName(dom){
                dom.className = dom.className.replace(name, '');
            }
        },
        /*判断是否包含某个类名*/
        hasClass: function(content, name){
            var doms = $$.$all(content);
            var flag = true;
            if(doms.length){
                for(var i=0, len = doms.length; i<len; i++){
                    flag = flag && checkClass(doms[i]);
                }
            }else{
                flag = flag && checkClass(doms);
            }
            return flag;
            /*判断每个元素是否包含name类名*/
            function checkClass(dom){
                /*由于类名的特殊写法，为了判断是否存在对应类名：将类名前后增加一个空格，在匹配的时候前后多匹配一个空格，即可达到效果*/
                return -1<(' '+dom.className+' ').indexOf(' '+name+' ');
            }
        },
        /*获取类名*/
        getClass: function(id){
            var doms = $$.$all(id);
            return $$.trim(doms[0].className).split(" ");
        }
    });

    /*内容框架*/
    $$.extend($$,{
        /*原生js中innerHTML实现*/
        html: function(content,value){
            var doms = typeof content === 'string' ? $$.$all(content) : content;
            if(doms.length){
                if(value){
                    /*设置内容*/
                    for(var i=0,len = doms.length; i<len; i++){
                        doms[i].innerHTML = value;
                    }
                }else{
                    /*获取内容*/
                    return doms[0].innerHTML;
                }
            }else{
                if(value){
                    /*设置内容*/
                    doms.innerHTML = value;
                }else{
                    /*获取内容*/
                    return doms.innerHTML;
                }
            }
        },
        text: function(content,value){
            var doms = typeof content === 'string' ? $$.$all(content) : content;
            if(doms.length){
                if(value){
                    /*设置内容*/
                    for(var i=0,len = doms.length; i<len; i++){
                        doms[i].innerText = value;
                    }
                }else{
                    /*获取内容*/
                    return doms[0].innerText;
                }
            }else{
                if(value){
                    /*设置内容*/
                    doms.innerText = value;
                }else{
                    /*获取内容*/
                    return doms.innerText;
                }
            }
        }
    });

    /*cookie模块*/
    $$.extend($$,{
        /*设置cookie*/
        setCookie: function(name,value,days,path){
            /*escape() 函数可对字符串进行编码，这样就可以在所有的计算机上读取该字符串。*/
            var name = escape(name);
            var value = escape(value);
            var expires = new Date();
            /*设置expires时间*/
            expires.setTime(expires.getTime() + days*24*60*60*1000);
            path = path == '' ? '' : ';path=' + path;
            /*toUTCString() 方法可根据世界时 (UTC) 把 Date 对象转换为字符串，并返回结果。*/
            _expires = (typeof hours) == "string" ? "" : ";expires=" + expires.toUTCString();
            document.cookie = name + '=' + value + _expires + path;
        },
        /*获取cookie*/
        getCookie: function(name){
            var name = escape(name);
            /*先返回文档的所有cookie*/
            var allCookie = document.cookie;
            name += '=';
            /*查找cookie的起始位置*/
            var pos = allCookie.indexOf(name);
            /*判断是否找到*/
            if(pos != -1){
                /*找到cookie起始位置*/
                var start = pos + name.length;
                /*结束位置*/
                var end = allCookie.indexOf(';',start);
                if(end == -1){
                    /*若end等于-1说明cookie中只有一个cookie*/
                    end = document.cookie;
                    /*获取cookie*/
                    var value = allCookie.substring(start,end);
                    return unescape(value);
                }
            }else{
                /*搜索失败*/
                return '';
            }
        },
        /*删除cookie：设置时间为0或过去式*/
        deleteCookie: function(name){
            var name = escape(name);
            var expires = new Date(0);
            path = path == "" ? "" : ";path=" + path;
            document.cookie = name + "="+ ";expires=" + expires.toUTCString() + path;
        }
    });

    /*h5本地存储模块*/

    /*贝塞尔曲线模块Tween.js*/
    $$.extend($$,{
        /*每个效果都分三个缓动方式，分别是：
         *easeIn：从0开始加速的缓动，也就是先慢后快；
         *easeOut：减速到0的缓动，也就是先快后慢；
         *easeInOut：前半段从0开始加速，后半段减速到0的缓动。
         * t: change time（变化量）；
         * b: beginning time（初始值）；
         * c: current time（当前时间）；
         * d: duration（持续时间）。
         **/
        eases: {
            /*线性匀速运动效果*/
            Linear: function(t, b, c, d) {
                return (c-b)*t/d + b;
            },
            /*二次方的缓动（t^2）*/
            QuadraticeaseIn: function(t, b, c, d) {
                return c * (t /= d) * t + b;
            },
            QuadraticeaseOut: function(t, b, c, d) {
                return -c *(t /= d)*(t-2) + b;
            },
            QuadraticeaseInOut: function(t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t + b;
                return -c / 2 * ((--t) * (t-2) - 1) + b;
            },
            /*三次方的缓动（t^3）*/
            CubiceaseIn: function(t, b, c, d) {
                return c * (t /= d) * t * t + b;
            },
            CubiceaseOut: function(t, b, c, d) {
                return c * ((t = t/d - 1) * t * t + 1) + b;
            },
            CubiceaseInOut: function(t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t*t + b;
                return c / 2*((t -= 2) * t * t + 2) + b;
            },
            /*四次方的缓动（t^4）*/
            QuarticeaseIn: function(t, b, c, d) {
                return c * (t /= d) * t * t*t + b;
            },
            QuarticeaseOut: function(t, b, c, d) {
                return -c * ((t = t/d - 1) * t * t*t - 1) + b;
            },
            QuarticeaseInOut: function(t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
                return -c / 2 * ((t -= 2) * t * t*t - 2) + b;
            },
            /*五次方的缓动（t^5）*/
            QuinticeaseIn: function(t, b, c, d) {
                return c * (t /= d) * t * t * t * t + b;
            },
            QuinticeaseOut: function(t, b, c, d) {
                return c * ((t = t/d - 1) * t * t * t * t + 1) + b;
            },
            QuinticeaseInOut: function(t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
                return c / 2*((t -= 2) * t * t * t * t + 2) + b;
            },
            /*正弦曲线的缓动（sin(t)）*/
            SinusoidaleaseIn: function(t, b, c, d) {
                return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
            },
            SinusoidaleaseOut: function(t, b, c, d) {
                return c * Math.sin(t/d * (Math.PI/2)) + b;
            },
            SinusoidaleaseInOut: function(t, b, c, d) {
                return -c / 2 * (Math.cos(Math.PI * t/d) - 1) + b;
            },
            /*指数曲线的缓动（2^t）*/
            ExponentialeaseIn: function(t, b, c, d) {
                return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
            },
            ExponentialeaseOut: function(t, b, c, d) {
                return (t==d) ? b + c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
            },
            ExponentialeaseInOut: function(t, b, c, d) {
                if (t==0) return b;
                if (t==d) return b+c;
                if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
            },
            /*圆形曲线的缓动（sqrt(1-t^2)）*/
            CirculareaseIn: function(t, b, c, d) {
                return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
            },
            CirculareaseOut: function(t, b, c, d) {
                return c * Math.sqrt(1 - (t = t/d - 1) * t) + b;
            },
            CirculareaseInOut: function(t, b, c, d) {
                if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
            },
            /*指数衰减的正弦曲线缓动*/
            ElasticeaseIn: function(t, b, c, d, a, p) {
                var s;
                if (t==0) return b;
                if ((t /= d) == 1) return b + c;
                if (typeof p == "undefined") p = d * .3;
                if (!a || a < Math.abs(c)) {
                    s = p / 4;
                    a = c;
                } else {
                    s = p / (2 * Math.PI) * Math.asin(c / a);
                }
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            },
            ElasticeaseOut: function(t, b, c, d, a, p) {
                var s;
                if (t==0) return b;
                if ((t /= d) == 1) return b + c;
                if (typeof p == "undefined") p = d * .3;
                if (!a || a < Math.abs(c)) {
                    a = c;
                    s = p / 4;
                } else {
                    s = p/(2*Math.PI) * Math.asin(c/a);
                }
                return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
            },
            ElasticeaseInOut: function(t, b, c, d, a, p) {
                var s;
                if (t==0) return b;
                if ((t /= d / 2) == 2) return b+c;
                if (typeof p == "undefined") p = d * (.3 * 1.5);
                if (!a || a < Math.abs(c)) {
                    a = c;
                    s = p / 4;
                } else {
                    s = p / (2  *Math.PI) * Math.asin(c / a);
                }
                if (t < 1) return -.5 * (a * Math.pow(2, 10* (t -=1 )) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p ) * .5 + c + b;
            },
            /*超过范围的三次方缓动（(s+1)*t^3 – s*t^2）*/
            BackeaseIn: function(t, b, c, d, s) {
                if (typeof s == "undefined") s = 1.70158;
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
            },
            BackeaseOut: function(t, b, c, d, s) {
                if (typeof s == "undefined") s = 1.70158;
                return c * ((t = t/d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },
            BackeaseInOut: function(t, b, c, d, s) {
                if (typeof s == "undefined") s = 1.70158;
                if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                return c / 2*((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
            },
            /*指数衰减的反弹缓动*/
            BounceeaseIn: function(t, b, c, d) {
                return c - $$.eases.BounceeaseOut(d-t, 0, c, d) + b;
            },
            BounceeaseOut: function(t, b, c, d) {
                if ((t /= d) < (1 / 2.75)) {
                    return c * (7.5625 * t * t) + b;
                } else if (t < (2 / 2.75)) {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                } else if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                } else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                }
            },
            BounceeaseInOut: function(t, b, c, d) {
                if (t < d / 2) {
                    return $$.eases.BounceeaseIn(t * 2, 0, c, d) * .5 + b;
                } else {
                    return $$.eases.BounceeaseOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
                }
            }
        }
    });

    /*运动模块*/
    function Animate(){
        /*定时器*/
        this._timer = '';
        /*默认配置参数*/
        this.config = {interval: 30, easeType: 'Linear', durationTime: 5000};
        /*相关配置参数*/
        /*this._obj = {};*/
        /*多属性队列*/
        this._queue = [];
        /*动画完成后执行的函数*/
        this.finish = null;
    }
    Animate.prototype = {
        /*用户设置配置参数*/
        setConfig: function(json){
            var that = this;
            /*调用$$中的extend方法*/
            $$.extend(that.config,json);
        },
        add: function(id,json,durationTime,fn){
            /*判断durationTime是否为空*/
            if(!durationTime){
                durationTime = this.config.durationTime;
            }
            /*判断durationTime的类型*/
            if($$.isString(durationTime)){
                switch (durationTime){
                    case '缓慢':
                    case 'slow':
                        durationTime = 8000;
                        break;
                    case '一般':
                    case 'normal':
                        durationTime = 4000;
                        break;
                    case '快速':
                    case 'fast':
                        durationTime = 2000;
                        break;
                }
            }
            /*json属性适配*/
            this._adapterMany(id,json,durationTime);
            /*开始动画*/
            this._run();
            if(typeof fn === 'function'){
                this.finish = fn;
            }else{
                this.finish = null;
            }
        },
        _adapterOne: function(id,json,durationTime){
            var _obj = {};
            /*目标元素*/
            _obj.id = $$.$id(id);
            /*贝塞尔曲线*/
            _obj.easeType = this.config.easeType;
            /*开始时间*/
            _obj.startTime = +new Date();
            /*当前时间*/
            _obj.now = +new Date();
            /*动画进度*/
            _obj.progress = 0;
            /*动画持续时间*/
            _obj.durationTime = durationTime;
            /*动画列表*/
            _obj.styles = this._getStyles(_obj.id,json);

            return _obj;
        },
        _adapterMany: function(id,json,durationTime){
            var _obj = this._adapterOne(id,json,durationTime);
            this._queue.push(_obj);
        },
        /*循环*/
        _loop: function(){
            for(var i=0, len = this._queue.length; i<len; i++){
                var _obj = this._queue[i];
                this._move(_obj);
            }
        },
        _run: function(){
            var that = this;
            /*that._timer = setInterval('animate._move()',that._interval);*/
            that._timer = setInterval(function(){
                that._loop();
            },that.config.interval);
        },
        _move: function(_obj){
            /*当前时间*/
            _obj.now = +new Date();
            /*更新完成进度*/
            _obj.progress = this._getProgress(_obj);
            if(_obj.progress >= 1){
                this._stop();
            }else{
                this._manyProperty(_obj);
            }
        },
        _getStyles: function(id,source){
            var styles = [];
            for(var item in source){
                /*json对象的定义需要放到循环里面，否则对象会被覆盖，数组中的对象都为最后一个属性*/
                var singleJson = {};
                singleJson.name = item;
                singleJson.start = parseFloat($$.css(id,item));
                singleJson.end = parseFloat(source[item]);
                styles.push(singleJson);
            }
            return styles;
        },
        _getProgress: function(_obj){
            var timeDelay = _obj.now - _obj.startTime;
            return $$.eases[_obj.easeType](timeDelay,0,1,_obj.durationTime);
        },
        _manyProperty: function(_obj){
            for(var i=0, len = _obj.styles.length; i<len; i++){
                this._oneProperty(_obj,_obj.styles[i]);
            }
        },
        _oneProperty: function(_obj,style){
            if(style.name === 'opacity'){
                $$.css(_obj.id,style.name,style.start + (style.end - style.start) * _obj.progress);
            }else{
                $$.css(_obj.id,style.name,style.start + (style.end - style.start) * _obj.progress + 'px');
            }
        },
        _stop: function(){
            clearInterval(this._timer);
            if(typeof this.finish === 'function'){
                this.finish();
            }
        }
    }
    $$.animate = new Animate();

    /*传递出去*/
    window.$$ = $$;
})(window)
