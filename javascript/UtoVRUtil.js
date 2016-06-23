/**
 * Created with IntelliJ IDEA.
 * User: moo
 * Date: 15-4-13
 * Time: 下午5:57
 * 这是一个帮助函数库，如果有需要可以在外部页面导入使用
 * 这里面包括了一些基础的函数操作
 * 可以使用 的对象包括 JTUtil, EventUtil
 */

var JTUtil = {
    //根据id的获取dom
    gId: function (id) {
        return document.getElementById(id) ? document.getElementById(id) : null
    },
    //获取name获取dom
    gName: function (name) {
        return document.getElementsByTagName(name) ? document.getElementsByTagName(name) : null;
    },
    contains: function (a, b) {
        if (!a)return false;
        return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(arg) & 16);
    },
    /*将一个新元素插入另一个元素后面*/
    insertAfter: function (newElement, targetElement) {
        var parent = targetElement.parentNode;
        if (parent.lastChild == targetElement) {
            parent.appendChild(newElement);
        } else {
            parent.insertBefore(newElement, targetElement.nextSibling);
        }
    },
    /*：将一个新元素插入另一个元素前面面*/
    insertBefore: function (newElement, targetElement) {
        var parent = targetElement.parentNode;
        parent.insertBefore(newElement, targetElement);
    },

    //创建dom
    cDom: function (tagName) {
        return document.createElement(tagName);
    },
    //加载script
    lScript: function (id, src, callback, cthis) {
        var script = JTUtil.cDom("script");
        script.name = id;
        script.type = "text/javascript";
        script.src = src;
        script.charset = "utf-8";
        script.onload = function () {
            if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
                if (callback && cthis) {
                    callback.call(cthis)
                } else if (callback) {
                    callback()
                }
            }
        };
        this.gName("head")[0].appendChild(script)
    },
    //加载css
    lCss: function (id, src, callback, cthis) {
        var link = JTUtil.cDom("link");
        link.name = id;
        link.type = "text/css";
        link.rel = "stylesheet";
        link.charset = "utf-8";
        link.href = src;
        link.onload = function () {
            if (callback && cthis) {
                callback.call(cthis)
            } else if (callback) {
                callback()
            }
        };
        this.gName("head")[0].appendChild(link)
    },
    //获取浏览器信息
    getBrowser: function () {
        var ua = navigator.userAgent.toLowerCase();
        var btypeInfo = (ua.match(/firefox|chrome|safari|opera/g) || "other")[0];
        if ((ua.match(/edge|msie|trident/g) || [] )[0]) {
            btypeInfo = "msie";
        }
        var pc = "";
        var prefix = "";
        var plat = "";
        //如果没有触摸事件 判定为PC
        var isTocuh = ("ontouchstart" in window) || (ua.indexOf("touch") != -1) || (ua.indexOf("mobile") != -1);
        if (isTocuh) {
            if (ua.indexOf("ipad") !== -1) {
                pc = "pad";
            } else if (ua.indexOf("mobile") !== -1) {
                pc = "mobile";
            } else if (ua.indexOf("android") !== -1) {
                pc = "androidPad";
            } else {
                pc = "pc";
            }
        } else {
            pc = "pc";
        }
        switch (btypeInfo) {
            case "chrome":
            case "safari":
            case "mobile":
                prefix = "webkit";
                break;
            case "msie":
                prefix = "ms";
                break;
            case "firefox":
                prefix = "Moz";
                break;
            case "opera":
                prefix = "O";
                break;
            default:
                prefix = "webkit";
                break
        }
        plat = (ua.indexOf("android") > 0) ? "android" : navigator.platform.toLowerCase();
        return {
            version: (ua.match(/[\s\S]+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],     //版本
            plat: plat,                   //系统
            type: btypeInfo,              //浏览器
            pc: pc,
            prefix: prefix,                //前缀
            isMobile: (pc == "pc") ? false : true              //是否是移动端
        };
    },
    /*获取当前浏览器语言*/
    getLanguage: function () {
        //ja-JP
        var nl = navigator.language;
        var lg = (nl === "zh-CN" || nl === "zh-cn") ? "cn" : (nl === "ja") ? "jp" : "en";
        return lg;
    },
    /*获取移动设备是否横屏：竖屏*/
    getWindowOrientation: function () {
        if (window.orientation == 0 || window.orientation == 180) {
            return 'Vertical';     //竖屏
        } else if (window.orientation == 90 || window.orientation == -90) {
            return 'Horizontal';   //横屏
        }
        return null;
    },
    /*获取窗口尺寸*/
    getWindowSize: function () {
        var wo = this.getWindowOrientation();
        var json = {
            position: {
                left: window.screenX || window.screenLeft,
                top: window.screenY || window.screenTop,
                width: window.screen.width,
                height: window.screen.height
            },
            width: document.documentElement.clientWidth || window.innerWidth || document.body.clientWidth,
            height: document.documentElement.clientHeight || window.innerHeight || document.body.clientHeight,
            viewPort: {
                width: document.documentElement.clientWidth || window.innerWidth || document.body.clientWidth,
                //修复IOS上 具有底部工具栏的浏览器 获取高度错误的问题
                height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
                horizontalScroll: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
                verticalScroll: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            },
            Document: {
                width: document.documentElement.scrollWidth || document.body.scrollWidth,
                height: document.documentElement.scrollHeight || document.body.scrollHeight
            }
        };
        if (this.getBrowser().pc == "pad" && wo == "Horizontal" && this.getBrowser().type == "safari") {
            var ver = navigator.userAgent.toLowerCase().match(/version\/[\d.]+/gi) + "";
            var ver_num = ver.replace(/[^0-9.]/ig, "").split(".")[0] || 8;
            //横屏pad 下的兼容
            if (ver_num && (ver_num < 8)) {
                json.viewPort.height = json.viewPort.height - 20;
            }
        }
        return json
    },
    /*ajax请求文件*/
    loadResource: function (uri, callBack) {
        var xmlHttp = this.createXMLHttp();
        var url = uri;
        xmlHttp.open("GET", url, true);
        xmlHttp.send();
        //xmlHttp.dataType="jsonp";
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4) {
                var result = xmlHttp.responseText || xmlHttp.response;
                if (callBack && typeof callBack == "function") {
                    callBack(result)
                }
            }
        };

    },
    createXMLHttp: function () {
        var XmlHttp;
        if (window.ActiveXObject) {
            var arr = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.5.0", "MSXML2.XMLHttp.4.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp", "Microsoft.XMLHttp"];
            for (var i = 0; i < arr.length; i++) {
                try {
                    XmlHttp = new ActiveXObject(arr[i]);
                    return XmlHttp
                } catch (error) {
                }
            }
        } else {
            try {
                XmlHttp = new XMLHttpRequest;
                return XmlHttp
            } catch (otherError) {
            }
        }
    },
    //转换成16进制
    to16Hex: function (v) {
        var s = v.toString(16);
        return s.length == 2 ? s : "0" + s
    },
    rndRGB: function () {
        var r = Math.floor(Math.random() * 256), g = Math.floor(Math.random() * 256), b = Math.floor(Math.random() * 256);
        return "#" + this.to16Hex(r) + this.to16Hex(g) + this.to16Hex(b)
    },
    //rgb转16
    rgbToHex: function (r, g, b) {
        return "#" + this.to16Hex(r) + this.to16Hex(g) + this.to16Hex(b);
    },
    //16转rgb
    hexToRgb: function (rgb_str) {
        if (rgb_str.length != 7) {
            return [0, 0, 0]
        }
        var r = rgb_str.substr(1, 2), g = rgb_str.substr(3, 2), b = rgb_str.substr(3, 2);
        return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)]
    },
    /*将argb颜色值转换成rgba */
    argbToRgba: function (argb) {
        var colorArr = argb ? argb.split(",") : "";
        var opacity = (colorArr[0] / 255).toFixed(2);
        var bgColor = colorArr ? "rgba(" + colorArr[1] + "," + colorArr[2] + "," + colorArr[3] + "," + opacity + ")" : "";
        return bgColor;
    },
    //xml转JSON数据
    xmlParseToJSON: function (nodes, flag) {
        var json = {};
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var name = node.nodeName;
            var type = node.nodeType;
            var value = null;
            if (type == 3) {
                continue
            }
            if (node.childNodes.length == 0) {
                value = null;
            } else if (node.childNodes.length == 1 && node.childNodes[0].nodeType == 3) {
                value = node.childNodes[0].nodeValue;
            } else {
                value = this.xmlParseToJSON(node.childNodes, flag);
            }
            if (!json[name]) {
                json[name] = value;
            } else {
                if (Object.prototype.toString.call(json[name]) === "[object Array]") {
                    json[name].push(value)
                } else {
                    var _value = json[name];
                    json[name] = [];
                    json[name].push(_value);
                    json[name].push(value)
                }
            }
        }
        return json
    },
    //字符串转换成xml文档对象
    getXMLDOM: function (source) {
        var doc;
        if (window.ActiveXObject) {
            doc = new ActiveXObject("Msxml2.DOMDocument");
            doc.async = false;
            doc.loadXML(source);
        } else {
            var parser = new DOMParser();
            doc = parser.parseFromString(source, "text/xml");
        }

        return doc.documentElement;
    },
    /*判断是否支持某一样式*/
    supportsStyle: function (prop) {
        var div = JTUtil.cDom('div'),
            vendors = 'Khtml Ms O Moz Webkit'.split(' '),
            len = vendors.length;
        if (prop in div.style) return true;
        prop = prop.replace(/^[a-z]/, function (val) {
            return val.toUpperCase();
        });
        while (len--) {
            if (vendors[len] + prop in div.style) {
                return true;
            }
        }
        return false;
    },
    /*浏览器插件支持检测 支持 flash pdf java*/
    pluginCheck: function () {
        var pluginSupported = {};
        var pluginList = {
            flash: {
                activex: "ShockwaveFlash.ShockwaveFlash",
                plugin: /flash/gim
            },
            pdf: {
                activex: "PDF.PdfCtrl",
                plugin: /adobe\s?acrobat/gim
            },
            java: {
                activex: navigator.javaEnabled(),
                plugin: /java/gim
            }
        };
        var isSupported = function (p) {
            if (window.ActiveXObject) {
                try {
                    new ActiveXObject(pluginList[p].activex);
                    pluginSupported[p] = true;
                } catch (e) {
                    pluginSupported[p] = false;
                }
            } else {
                for (var i = 0; i < navigator.plugins.length; i++) {
                    var pluginsObj = navigator.plugins[i];
                    if (pluginsObj.name.match(pluginList[p].plugin)) {
                        pluginSupported[p] = true;
                        return false;
                    } else {
                        pluginSupported[p] = false;
                    }
                }
            }
        };
        for (var key in pluginList) {
            isSupported(key);
        }
        return pluginSupported;
    },
    /*判断是否支持webGL*/
    support_WebGL: function () {
        if (!!window.WebGLRenderingContext) {
            var canvas = document.createElement("canvas"),
                names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
                gl = false;
            for (var i in names) {
                try {
                    gl = canvas.getContext(names[i]);
                    if (gl && typeof gl.getParameter == "function") {
                        /* WebGL is enabled */
                        return true;
                        /*return names[i];*/
                    }
                } catch (e) {
                }
            }
            /* WebGL is supported, but disabled */
            return false;
        }
        /* WebGL not supported*/
        return false;
        /* var canvas = this.cDom("canvas");
         var gl = canvas.getContext("webgl") || canvas.getContext("moz-webgl") || canvas.getContext("experimental-webgl") || canvas.getContext("webkit-3d");
         gl = gl ? true : false;
         return gl;*/
    },
    /*获取webGL的相关信息*/
    getWebGLInfo: function () {
        "use strict";

    },
    /*判断浏览器是否支持css3d属性*/
    support_Css3D: function () {
        var e, t, i = false, s = JTUtil.cDom("div");
        for (e = 0; e < 5; e++)
            if (typeof s.style[["p", "msP", "MozP", "WebkitP", "OP"][e] + "erspective"] != "undefined") {
                i = true, e == 3 && window.matchMedia && (t = window.matchMedia("(-webkit-transform-3d)"), t && (i = t.matches == true));
                break
            }
        return i;
    },
    // 动态加载CSS样式文本
    registerCss: function (cssText) {
        var style = JTUtil.cDom("style");
        var head = document.getElementsByTagName("head")[0];
        if (!head) {
            return;
        }
        if (document.all) {
            style.setAttribute("type", "text/css");
            style.styleSheet.cssText = cssText;
        }
        else {
            style.appendChild(document.createTextNode(cssText));
        }
        if (head.firstChild) {
            head.insertBefore(style, head.firstChild);
        }
        else {
            head.appendChild(style);
        }
        return style;
    },
    /*判断浏览器是否支持全屏*/
    isSupportFullScreen: function () {
        var doc = document.documentElement;
        return ( 'requestFullscreen' in doc ) || ('webkitRequestFullScreen' in doc ) || ('mozRequestFullScreen' in doc && document.mozFullScreenEnabled ) || false;
    },
    /*判断浏览器是否全屏*/
    isFullScreen: function () {
        var dom = document;
        return dom.msFullscreenElement || dom.mozFullScreenElement || dom.webkitFullscreenElement || dom.webkitIsFullScreen || false;
    },
    /*请求全屏显示*/
    reqFullScreen: function (dom) {
        //获取全屏的元素
        var fullscreenElement = document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullScreenElement || document.webkitIsFullScreen;
        var dom = dom ? dom : document.documentElement;
        if (!fullscreenElement) {
            dom.requestFullScreen && dom.requestFullScreen();
            dom.webkitRequestFullScreen && dom.webkitRequestFullScreen(); //webkite
            dom.msRequestFullscreen && dom.msRequestFullscreen();
            dom.mozRequestFullScreen && dom.mozRequestFullScreen();
            dom.oRequestFullScreen && dom.oRequestFullScreen();
            return true;
        } else {
            document.exitFullscreen && document.exitFullscreen();
            document.cancelFullScreen && document.cancelFullScreen();
            document.webkitCancelFullScreen && document.webkitCancelFullScreen();
            document.msExitFullscreen && document.msExitFullscreen();
            document.mozCancelFullScreen && document.mozCancelFullScreen();
            document.oCancelFullScreen && document.oCancelFullScreen();
            return false;
        }
    },
    /*首字母大写*/
    firstCharUpCase: function (str) {
        var operate2 = "";
        str = str || "";
        for (var j = 0, len = str.length; j < len; j++) {
            //获得unicode码
            var ch2 = str.charAt(j);
            if (j == 0) {
                operate2 = ch2.toUpperCase();
            }
            else {
                operate2 += ch2.toLowerCase();
            }
        }
        return operate2;
    },
    /*将对象转换成数组*/
    setToArray: function (obj) {
        if (obj && Object.prototype.toString.call(obj) != "[object Array]") {
            var cmaps = obj;
            var arr = [];
            arr.push(cmaps);
            return arr
        } else {
            return obj
        }
    },
    getBestFitSize: function (ImgWidth, ImgHeight, tarWidth, tarHeight) {
        var img_width = ImgWidth, img_height = ImgHeight, img_lv = img_width / img_height;
        var target_width = tarWidth, target_height = tarHeight;
        var width, height, left, top;
        if (img_lv > 1) {
            width = target_width;
            height = target_width / img_width * img_height;
            if (height > target_height) {
                width = target_height / height * width;
                height = target_height;
            }
            left = (target_width - width) * 0.5;
            top = (target_height - height) * 0.5;
        }
        else {
            height = target_height;
            width = target_height / img_height * img_width;
            if (width > target_width) {
                height = target_width / width * height;
                width = target_width;
            }
            left = (target_width - width) * 0.5;
            top = (target_height - height) * 0.5
        }
        return {"width": width, "height": height, "left": left, "top": top};
    },
    /*
     *设置图片居中对齐
     * 注意：这个函数不会改变原图的大小
     * */
    getCenterSize: function (sWidth, sHeight, tWidth, tHeight) {
        return {
            "width": sWidth,
            "height": sHeight,
            "top": (tHeight - sHeight) * 0.5,
            "left": (tWidth - sWidth) * 0.5
        }
    },
    /*设置viewport*/
    setViewPort: function (sWidth) {
        if (this.getBrowser().pc === "pc")return;
        //获取viewport 的meta不爱起
        var metaViewPort = document.getElementsByName("viewport")[0];
        if (!metaViewPort) {
            metaViewPort = JTUtil.cDom("meta");
            metaViewPort.name = "viewport";
            document.getElementsByTagName("head")[0].appendChild(metaViewPort);
        }
        var DEFAULT_WIDTH = sWidth, // 页面的默认宽度
            ua = navigator.userAgent.toLowerCase(), // 根据 user agent 的信息获取浏览器信息
            deviceWidth = window.screen.width; // 设备的宽度
        //只有iphone 和 ipod 上面使用viewport设置 ipad不使用
        var mobile = (/iphone|ipod/gi).test(navigator.platform);
        var contentText = "width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,minimal-ui,target-densitydpi=device-dpi";
        if (!isNaN(DEFAULT_WIDTH)) {
            if (mobile) {
                if (ua.indexOf("version/6") > 0 || ua.indexOf("iphone os 6") > 0) {
                    contentText = "width=640, initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5,minimal-ui";
                } else {
                    contentText = "width=" + DEFAULT_WIDTH + "px, user-scalable=no, minimal-ui,initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5";
                }
            }
            //android系统viewport设置
            if (ua.indexOf("android") !== -1) {
                //android默认设置，兼容平板
                contentText = "target-densitydpi=device-dpi, user-scalable=no";
                /*
                 注意：android 下使用 firefox 无法检测出 android 的版本，因此只能忽略 firefox
                 对于 android 4.0 以下的手机，不支持设置 viewport 的 width，但是我们可以设置 Android 的另一参数target-densitydpi，从而达到相同的目的
                 target-densitydpi = UI-width / device-width * window.devicePixelRatio * 160; //UI-width ：WebApp布局宽度 device-width ：屏幕分辨率宽度
                 于是，最终解决方案如下：
                 */
                //android手机端设置
                if (ua.indexOf("mobile") !== -1) {
                    //这个是android手机端统一的解决方案
                    contentText = "target-densitydpi=device-dpi, width=" + DEFAULT_WIDTH + "px, user-scalable=no";
                    var devicePixelRatio = window.devicePixelRatio || 1, // 物理像素和设备独立像素的比例，默认为1
                        targetDensitydpi = DEFAULT_WIDTH / deviceWidth * devicePixelRatio * 160,
                        versoinAndroid = parseFloat(ua.slice(ua.indexOf("android") + 8));
                    // Android4.0以下手机不支持viewport的width，需要设置target-densitydpi
                    if (versoinAndroid < 4) {
                        contentText = 'target-densitydpi=' + targetDensitydpi + ', width=device-width, user-scalable=no';
                    }
                    //Android4 qq浏览器和微信浏览器需要设置target-densitydpi
                    if (ua.indexOf("qq") !== -1 || ua.indexOf("micromessenger") !== -1) {
                        contentText = 'target-densitydpi=' + targetDensitydpi + ', width=device-width, user-scalable=no';
                    }
                    //Android4 firefox浏览器设置
                    if (ua.indexOf("firefox") !== -1) {
                        //还没找到解决方案暂时用默认设置
                        contentText = "target-densitydpi=device-dpi, width=" + DEFAULT_WIDTH + "px, user-scalable=no";
                    }
                }
            }
        }
        metaViewPort.content = contentText;
        return contentText;
    },
    /*获取url的参数*/
    getQueryString: function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    /*获取后缀*/
    getFileExt: function (str) {
        var d = /\.[^\.]+$/.exec(str);
        return (d ? d[0] : null);
    },
    /*css3动画效果*/
    css3Animate: function (curDom, css, time, fn) {
        var el = curDom;
        var Browser = JTUtil.getBrowser();
        var callback = function () {
            fn && fn(arguments);
            EventUtil.removeEvent(el, "transitionEnd", callback);
            el.style[Browser.prefix + "Transition"] = "";
        };
        EventUtil.addEvent(el, "transitionEnd", callback);
        var eff = "";
        for (var k in css) {
            //这里暂时只考虑webkit内核
            eff += k + ' ' + time + 's,';
        }
        //强制计算color样式 才能启用 Transition效果
        getComputedStyle(el).width;
        el.style[Browser.prefix + "Transition"] = eff + "color 0s";
        for (var k in css) {
            //这里暂时只考虑webkit内核
            el.style[k] = css[k];
        }
    },
    /*将秒转换为分钟格式*/
    formatToMin: function (num) {
        var min = Math.floor(num / 60);
        min = min < 10 ? "0" + min : min;
        var sec = Math.floor(num % 60);
        sec = sec < 10 ? "0" + sec : sec;
        return min + ":" + sec;
    },
    /*获取随机数*/
    getRandomNum: function (Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    },
    //将字符串转换成Unicode码
    toUnicodeByStr: function (str) {
        var codes = [];
        for (var i = 0; i < str.length; i++) {
            codes.push(str.charCodeAt(i));
        }
        return codes;
    },
    toStrByUniCode: function (arr) {
        var codes = [];
        for (var i = 0; i < arr.length; i++) {
            codes.push(String.fromCharCode(arr[i]));
        }
        return codes.join("");

    },
    /*判断是否是frame*/
    isIFrame: function () {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    },
    /*判断是否是2D n次幂*/
    isPow2: function (n) {
        return (n & (n - 1)) == 0;
    },
    /*判断是否是ios*/
    isIOS: function () {
        return /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    },
    isMobile: function () {
        var check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))check = true
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }

};
/*事件处理对象*/
var EventUtil = {
    /*获取兼容的事件名称，如果没有包含，将使用name作为添加事件*/
    getEventName: function (name) {
        var transitionEnd, fullscreenchange, Browser;
        Browser = JTUtil.getBrowser();
        switch (Browser.prefix) {
            case "webkit":
                transitionEnd = 'webkitTransitionEnd';
                fullscreenchange = 'webkitfullscreenchange';
                break;
            case "ms":
                transitionEnd = 'MSTransitionEnd';
                fullscreenchange = 'MSFullscreenChange';
                break;
            case "O":
                transitionEnd = 'otransitionend';
                fullscreenchange = 'ofullscreenchange';
                break;
            case "Moz":
                transitionEnd = 'transitionend';
                fullscreenchange = 'mozfullscreenchange';
                break;
            default:
                transitionEnd = 'transitionend';
                fullscreenchange = 'fullscreenchange';
        }
        var list = {
            "mouseout": !Browser.isMobile ? "mouseout" : "touchend",
            "mouseleave": !Browser.isMobile ? "mouseleave" : "touchend",
            "mouseover": !Browser.isMobile ? "mouseover" : "touchstart",
            "click": !Browser.isMobile ? "click" : "touchstart",
            "mousedown": !Browser.isMobile ? "mousedown" : "touchstart",
            "mousemove": !Browser.isMobile ? "mousemove" : "touchmove",
            "mouseup": !Browser.isMobile ? "mouseup" : "touchend",
            "mousewheel": (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel",
            "touchcancel": "touchcancel",
            "transitionEnd": transitionEnd,
            "fullScreenChange": fullscreenchange,
            "dblclick": "dblclick",
            "keydown": "keydown",
            "keyup": "keyup",
            "contextmenu": "contextmenu",
            "volumechange": "volumechange",
            "canplaythrough": "canplaythrough",
            "play": "play",
            "pause": "pause",
            "load": "load",
            "DOMContentLoaded": "DOMContentLoaded",
            "resize": /* (Browser.isMobile) ? "orientationchange" : */"resize"
        };
        return list[name] || name;
    },
    /**
     * 添加事件
     * 添加的事件函数会进行一次包装，
     * return 包装好滴事件句柄对象id
     * */
    addEvent: function (dom, type, fn, callobj) {
        var name = this.getEventName(type);
        var callFn = function (e) {
            var e1 = EventUtil.getEvent(e);
            fn.call(callobj, e1, e)
        };
        if (dom.addEventListener) {
            //统一使用事件冒泡的方式
            dom.addEventListener(name, callFn, false)
        } else if (dom.attachEvent) {
            dom.attachEvent("on" + name, callFn)
        } else {
            dom["on" + name] = callFn
        }
        return callFn;
    },
    //移除事件
    removeEvent: function (dom, type, fn) {
        var name = this.getEventName(type);
        if (dom.removeEventListener) {
            //统一使用事件冒泡的方式
            dom.removeEventListener(name, fn, false);
        } else if (dom.detachEvent) {
            dom.detachEvent("on" + name, fn)
        } else {
            dom["on" + name] = null;
        }
        return dom;
    },
    //获取事件的目标对象
    getTarget: function (event) {
        return event.target || event.srcElement;
    },
    //获取事件
    getEvent: function (event) {
        var Browser = JTUtil.getBrowser();
        if (Browser.isMobile) {
            EventUtil.stopDefault(event);
            EventUtil.stopPropagation(event);
        }
        return event.changedTouches ? event.changedTouches[0] : (event || window.event);
    },
    //阻止执行默认事件
    stopDefault: function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    //阻止事件冒泡或捕获
    stopPropagation: function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },
    /*获取鼠标按键信息*/
    getButton: function (event) {
        //0 鼠标左键 1 鼠标中间的按钮 2鼠标右键
        if (document.implementation.hasFeature("MouseEvents", "2.0")) {
            return event.button;
        } else {
            switch (event.button) {
                case 0:
                    return 0;
                case 2:
                case 6:
                    return 2;
                case 4:
                    return 1;
            }
        }
    },
    /*获取事件中的触发可视区域的位置*/
    getEventSize: function (event) {
        return {x: event.clientX, y: event.clientY};
    },
    getOffsetX: function (event) {
        var evt = event || window.event;
        var srcObj = evt.target || evt.srcElement;
        if (evt.offsetX) {
            return evt.offsetX;
        } else {
            var rect = srcObj.getBoundingClientRect();
            var clientx = evt.clientX;
            return clientx - rect.left;
        }
    },
    getOffsetY: function (event) {
        var evt = event || window.event;
        var srcObj = evt.target || evt.srcElement;
        if (evt.offsetY) {
            return evt.offsetY;
        } else {
            var rect = srcObj.getBoundingClientRect();
            var clienty = evt.clientY;
            return clienty - rect.top;
        }
    },
    /*
     * 频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
     * @param fn {function}  需要调用的函数
     * @param delay  {number}    延迟时间，单位毫秒
     * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
     * @return {function}实际调用函数
     */
    throttle: function (fn, delay, immediate, debounce) {
        var curr = +new Date(),//当前事件
            last_call = 0,
            last_exec = 0,
            timer = null,
            diff, //时间差
            context,//上下文
            args,
            exec = function () {
                last_exec = curr;
                fn.apply(context, args);
            };
        return function () {
            curr = +new Date();
            context = this,
                args = arguments,
                diff = curr - (debounce ? last_call : last_exec) - delay;
            clearTimeout(timer);
            if (debounce) {
                if (immediate) {
                    timer = setTimeout(exec, delay);
                } else if (diff >= 0) {
                    exec();
                }
            } else {
                if (diff >= 0) {
                    exec();
                } else if (immediate) {
                    timer = setTimeout(exec, -diff);
                }
            }
            last_call = curr;
        }
    },

    /*
     * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
     * @param fn {function}  要调用的函数
     * @param delay   {number}    空闲时间
     * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
     * @return {function}实际调用函数
     */

    debounce: function (fn, delay, immediate) {
        return this.throttle(fn, delay, immediate, true);
    }
};
/*
 * Dom处理对象
 * */
var DomUtil = {
    inject: function (curDom, targetDom) {
        targetDom && targetDom.appendChild(curDom);
        return curDom
    },
    /*将元素插入另一个元素后面*/
    insertAfter: function (curElement, targetElement) {
        var parent = targetElement.parentNode;
        if (parent.lastChild == targetElement) {
            parent.appendChild(curElement);
        } else {
            parent.insertBefore(curElement, targetElement.nextSibling);
        }
    },
    /*将元素插入另一个元素前面面*/
    insertBefore: function (curElement, targetElement) {
        var parent = targetElement.parentNode;
        parent.insertBefore(curElement, targetElement);
    },
    //设置多样式
    setStyles: function (curDom, options) {
        for (var key in options) {
            curDom.style[key] = options[key]
        }
        return curDom
    },
    getStyle: function (element, attr) {
        if (typeof window.getComputedStyle != 'undefined') {
            //如果支持W3C，使用getComputedStyle来获取样式
            return parseInt(window.getComputedStyle(element, null)[attr]);
        } else if (element.currentStyle) {
            return parseInt(element.currentStyle[attr]);
        }
    },
    //设置多属性
    setProperties: function (curDom, options) {
        for (var key in options) {
            curDom.setAttribute(key, options[key])
        }
        return curDom
    },
    //删除元素本身
    destroy: function (curDom) {
        curDom.parentNode && curDom.parentNode.removeChild(curDom)
    },
    hasClass: function (ele, cls) {
        return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    },
    addClass: function (ele, cls) {
        if (!this.hasClass(ele, cls)) {
            ele.className += " " + cls;
        }
    },
    removeClass: function (ele, cls) {
        if (this.hasClass(ele, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            ele.className = ele.className.replace(reg, " ");
        }
    }
};


