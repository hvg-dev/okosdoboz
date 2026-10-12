carco.functions.isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        var ieMobile = navigator.userAgent.match(/IEMobile/i);
        if (!ieMobile) ieMobile = navigator.userAgent.match(/Tablet PC/i);
        return ieMobile;
    },
    IeMobile: function() {
        var ieMobile = navigator.userAgent.match(/IEMobile/i);
        return ieMobile;
    },
    any: function() {
        return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
    },
    androidApp: function() {
        return window.location.pathname.match("android_asset/www");
    }
};

carco.functions.touchscreen = {
    updateOrientation: function() {
        this.orientation = window.orientation;
        if(this.orientation === 0 || this.orientation === 180) this.orientation = 'portrait';
        else if(this.orientation === 90 || this.orientation === -90) this.orientation = 'landscape';
        else {
            if(document.documentElement.clientWidth > document.documentElement.clientHeight) this.orientation = 'landscape';
            else this.orientation = 'portrait';
        }
    },
    updateScreenWidth: function() {
        this.screenWidth = screen.width;
        if(this.orientation === 'portrait') {
            if(screen.width > screen.height) this.screenWidth = screen.height;
        }else {
            if(screen.width < screen.height) this.screenWidth = screen.height;
        };
    },
    getScale: function() {
        this.viewportScale = undefined;
        var viewportWidth = document.documentElement.clientWidth;
        if(screen.width > viewportWidth) {return;}
        this.updateOrientation();
        this.screenWidth = screen.width;

        if(this.orientation === 'portrait') {
            if(screen.width > screen.height) this.screenWidth = screen.height;
        }else {
            if(screen.width < screen.height) this.screenWidth = screen.height;
        };
        this.viewportScale = this.screenWidth / window.innerWidth;
        return this.viewportScale;
    },
    viewPort: function(minwidth) {
        if (window.innerWidth<minwidth){
            if (carco.functions.browser.IE()>8){
            }else{
                var viewPortTag=document.createElement('meta');
                viewPortTag.name = "viewport";
                viewPortTag.content = "width="+minwidth+"";
                if (carco.functions.touchscreen.viewPortTag) document.getElementsByTagName('head')[0].removeChild(viewPortTag);
                carco.functions.touchscreen.viewPortTag = viewPortTag;
                document.getElementsByTagName('head')[0].appendChild(carco.functions.touchscreen.viewPortTag);
            };
        };
    },
    iemobile10touchfix: function() {
        if (carco.functions.browser.IE() == 10&&carco.functions.isMobile.any()||
            carco.functions.browser.IE() == 11&&carco.functions.isMobile.IeMobile()){
            var cssTag = document.createElement('style');
            cssTag.type='text/css';
            var text = document.createTextNode('.disabletouch, .disabletouch > div {touch-action: none; -ms-touch-action: none;} body {touch-action: auto; -ms-touch-action: auto}');
            cssTag.appendChild(text);
            document.getElementsByTagName('head')[0].appendChild(cssTag);

            var viewPortTag = document.createElement('style');
            viewPortTag.type='text/css';
            var text = document.createTextNode('@-ms-viewport {width:devide-width; initial-scale: 1; zoom: 1; min-zoom: 1; max-zoom: 1; user-zoom: 0; maximum-scale: 1.0;  minimum-scale:1.0, user-scalable: no;}');
            viewPortTag.appendChild(text);
            document.getElementsByTagName('head')[0].appendChild(viewPortTag);

            var viewPortTag=document.createElement('meta');
            viewPortTag.name = "viewport";
            viewPortTag.content = "width=devide-width initial-scale=1.0 zoom=1.0 min-zoom=1.0 max-zoom=1.0 maximum-scale=1.0 minimum-scale=1.0 user-scalable=no user-scalable=0";
            document.getElementsByTagName('head')[0].appendChild(viewPortTag);

            var viewPortTag=document.createElement('meta');
            viewPortTag.name = "viewport";
            viewPortTag.content = "name='format-detection' content='telephone=no'";
            document.getElementsByTagName('head')[0].appendChild(viewPortTag);

            document.body.setAttribute("x-ms-format-detection", "none")

        };
    }
};

carco.touchscale = carco.functions.touchscreen.getScale();

carco.functions.browser = {
    IE: function () {
        var rv = -1;
        if (navigator.appName == 'Microsoft Internet Explorer')
        {
            var ua = navigator.userAgent;
            var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat( RegExp.$1 );
        }
        else if (navigator.appName == 'Netscape')
        {
            var ua = navigator.userAgent;
            var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat( RegExp.$1 );
        }
        return rv;
    },
    Chrome: function() {
        var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        return isChrome;
    }
};


if (carco.functions.browser.IE() > 10&&carco.functions.isMobile.any()) {
    HTMLElement.prototype.getBoundingClientRect = (function () {
        var oldGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
        return function() {
            var bounds = oldGetBoundingClientRect.apply(this, arguments);
            var newbounds = {};
            var scrollLeft = carco.functions.position.scrollLeft();
            var scrollTop = carco.functions.position.scrollTop();
            newbounds.left = bounds.left - scrollLeft;
            newbounds.top = bounds.top - scrollTop;
            newbounds.oldbounds = bounds;
            return newbounds;
        };
    })();
};

carco.functions.url = {
    parent: function() {
        return document.referrer;
    },
    top: function() {
        return window.document.URL;
    },
    get: function () {
        return (this.parent() || this.top());
    },
    getHost: function(prefix, post) {
        if (!prefix) {var prefix = ""};
        if (!post) {var post = ""};
        var url = this.get();
        url = url.split("/");
        url = prefix+url[2]+post;
        return url;
    },
    getFolder: function(){
        var url = carco.functions.url.get();
        url = url.split("/")
        var newurl = "";
        for (var i = 0; i < url.length-1; i++) {
            newurl = newurl + "/" + url[i];
        };
        newurl = newurl.slice(1);
        return newurl;
    }
};

carco.functions.randomString = {
    math10: function() {
        return Math.random().toString(36).substring(7);
    }
}

carco.functions.string = {
    toCamelCase: function(input) {
        return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
            return group1.toUpperCase();
        });
    },
    allReplace: function(string, obj) {
        var retStr = string;
        for (var x in obj) {
            retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
        };
        return retStr;
    }
}

carco.functions.array = {
    shuffle: function(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        };
        return array;
    },
    diff: function(array, minusarray){
        if (array&&!array.diff){
            array.diff = function(a) {
                if (a){
                    return this.filter(function(i) {return a.indexOf(i) < 0;});
                }else{
                    return this;
                }
            };
        };
        var newarray = [];
        if (array&&minusarray) newarray = array.diff(minusarray);
        return newarray;
    },
    uniq: function(a){
        return a.reduce(function(p, c) {
            if (p.indexOf(c) < 0) p.push(c);
            return p;
        }, []);
    },
    combinations: function(arr, n){
        function getCombinations(arr, n){
            if(n == 1){
                var ret = [];
                for(var i = 0; i < arr.length; i++){
                    for(var j = 0; j < arr[i].length; j++){
                        ret.push([arr[i][j]]);
                    };
                };
                return ret;
            }else{
                var ret = [];
                if (arr){
                    for(var i = 0; i < arr.length; i++){
                        var elem = arr.shift();
                        if (elem){
                            for(var j = 0; j < elem.length; j++){
                                var childperm = getCombinations(arr.slice(), n-1);
                                for(var k = 0; k < childperm.length; k++){
                                    ret.push([elem[j]].concat(childperm[k]));
                                };
                            };
                        };
                    };
                };
                return ret;
            };
        }
        var newarr = [];
        for(var i = 0; i < arr.length; i++){
            if (arr[i]){
                if (!arr[i].length) {
                    newarr.push([arr[i]]);
                }else{
                    newarr.push(arr[i]);
                };
            };
        };
        if (!n) var n = newarr.length;
        var results = getCombinations(newarr.slice(),n);
        return results;
    },
    permutation: function (input) {
        var set =[];
        function permute (arr, data) {
            var cur, memo = data || [];

            for (var i = 0; i < arr.length; i++) {
                cur = arr.splice(i, 1)[0];
                if (arr.length === 0) set.push(memo.concat([cur]));
                permute(arr.slice(), memo.concat([cur]));
                arr.splice(i, 0, cur);
            }
            return set;
        }
        return permute(input);
    }
}

carco.functions.createHTML = {
    object: {},
    create: function(type, attr, vars) {
        this.object = document.createElement(type);

        for (var x in attr){
            this.object.setAttribute(x, attr[x]);
        };
        for (var y in vars){
            this.object[y] = vars[y];
        };
        this.object.add = function(where) {
            if (where!==false){
                where.appendChild(this);
                return this;
            };
        };
        this.object.on = function(type, on){
            this.addEventListener(type, on, false);
            return this;
        };
        this.object.off = function(type, off){
            this.removeEventListener(type, off, false);
            return this;
        };
        return this.object;
    }
}

carco.functions.createRadioButton = {
    get: function(params, classes, object){
        if (!object) {var object = {};}
        for (var x in params){
            object[x] = carco.functions.createHTML.create(params[x].type, params[x].attr, params[x].vars).add(params[x].where).on(params[x].ontype, params[x].on)
            object[x].on("mousedown", function() {
                for (var y in object){
                    if (this == object[y]){
                        object[y].className = classes.active;
                    }else{
                        object[y].className = classes.deactive;
                    };
                };
            }, false);
        };
        return object;
    }
};

carco.functions.listeners = {
    type: function(type) {
        if (carco.functions.isMobile.any() == true){
            if (type == "mousemove") type = "touchmove";
            if (type == "mouseup") type = "touchend";
        };
        return type;
    },
    add: function( obj, type, fn ) {
        var useCapture = false;
        if ( obj.addEventListener ) {
            obj.addEventListener( this.type(type), fn, useCapture );
        } else {
            obj.attachEvent( 'on'+this.type(type), fn );
        };
    },

    remove: function( obj, type, fn ) {
        if ( obj.removeEventListener ) {
            obj.removeEventListener( this.type(type), fn, false );
        } else {
            obj.detachEvent( 'on'+this.type(type), fn );
        };
    },

    removeAllListeners: function(item, type) {
        var ready = true;
        if (item.carco.originalcustomparams.values.disableoff == "wheninnersfalse"&&item.carco.game.inners){
            for (var i = 0; i < item.carco.game.inners.length; i++) {
                if (item.carco.game.inners[i].carco.customparams.values&&item.carco.game.inners[i].carco.customparams.values.valueon&&item.carco.game.inners[i].carco.game.value == 0) ready = false;
            };
        };

        if (type == false) ready = true;
        if (ready){
            if (type !== false) item.carco.game.ready = true;
            if (item.carco.drag){
                carco.functions.listeners.remove(item, "mouseup", item.carco.drag.down)
                carco.functions.listeners.remove(item, "mouseup", item.carco.drag.inner_down)
                carco.functions.listeners.remove(item, "mousedown", item.carco.drag.down)
                carco.functions.listeners.remove(item, "mousedown", item.carco.drag.inner_down)
                carco.functions.listeners.remove(item, "mousemove", item.carco.drag.move)
                carco.functions.listeners.remove(item, "mousemove", item.carco.drag.inner_move)
                carco.functions.listeners.remove(item, "mouseup", item.carco.drag.up)
                carco.functions.listeners.remove(item, "mouseup", item.carco.drag.inner_up)
                carco.functions.listeners.remove(item, "pointerup", item.carco.drag.inner_down_mobile)
                carco.functions.listeners.remove(item, "mouseup", item.carco.drag.inner_down_mobile)
            };

            if (item.carco.button){
                carco.functions.listeners.remove(item, "mousedown", item.carco.button.down)
            };

            if (item.carco.inputtext){
                var inputtext = item.carco.getChildren({equal:{type:"inputtext"}})[0];
                inputtext.setAttribute("disabled", true)
                inputtext.className = inputtext.className + " drwmsg-inputdisabled";
            };

            if (item.carco.actions){
                for (var x in item.carco.actions){
                    for (var i = 0; i < item.carco.actions[x].listeners.length; i++) {
                        carco.functions.listeners.remove(item, item.carco.actions[x].listeners[i], item.carco.actions[x]["function"])
                    };
                };
            };
        };
    },
    disableItems: function(root, diff) {
        var array = [];
        for (var x in root.carco.recursivechildren){
            if (root.carco.recursivechildren[x].carco.customparams.gametype=="button"||
                root.carco.recursivechildren[x].carco.customparams.gametype=="drag"||
                root.carco.recursivechildren[x].carco.customparams.gametype=="inputtext")
                array.push(root.carco.recursivechildren[x]);
        };
        var diffarray = array;
        if (diff) diffarray = carco.functions.array.diff(array, diff);
        for (var i = 0; i < diffarray.length; i++) {
            this.removeAllListeners(diffarray[i], false);
        };
    },
    enableItems: function(root, diff, disableready) {
        var array = [];
        for (var x in root.carco.recursivechildren){
            if (root.carco.recursivechildren[x].carco.customparams.gametype=="button"||
                root.carco.recursivechildren[x].carco.customparams.gametype=="drag"||
                root.carco.recursivechildren[x].carco.customparams.gametype=="inputtext")
                array.push(root.carco.recursivechildren[x]);
        };
        var diffarray = array;
        if (diff) diffarray = carco.functions.array.diff(array, diff);
        for (var i = 0; i < diffarray.length; i++) {
            if (disableready&&diffarray[i].carco.game.ready){}else{
                this.addAllListeners(diffarray[i], false);
            };
        };
    },
    removeAllitemListeners: function(root, ready){
        for (var x in root.carco.recursivechildren){
            if (root.carco.recursivechildren[x].carco.customparams.gametype=="button"||
                root.carco.recursivechildren[x].carco.customparams.gametype=="drag"||
                root.carco.recursivechildren[x].carco.customparams.gametype=="inputtext")
                this.removeAllListeners(root.carco.recursivechildren[x], ready);
        };
    },
    addAllListeners: function(item, type) {
        if (type !== false) item.carco.game.ready = false;
        if (item.carco.drag){
            item.carco.drag.get()
        };

        if (item.carco.button){
            carco.functions.listeners.add(item, "mousedown", item.carco.button.down)
        };

        if (item.carco.inputtext){
            var inputtext = item.carco.getChildren({equal:{type:"inputtext"}})[0];
            inputtext.removeAttribute("disabled")
        };

        if (item.carco.actions){
            for (var x in item.carco.actions){
                for (var i = 0; i < item.carco.actions[x].listeners.length; i++) {
                    carco.functions.listeners.add(item, item.carco.actions[x].listeners[i], item.carco.actions[x]["function"])
                };
            };
        };
    }
};

carco.functions.error = {
    disable: true,
    get: function() {
        window.onerror = function (errorMsg, url, lineNumber) {
            if (carco.functions.error.disable !== true) {
                alert(errorMsg, url, lineNumber);
            };
        };
    }
};
carco.functions.error.disable = true;
carco.functions.error.get()

carco.functions.event = {
    target: function(ev){
        if (ev.target) {
            return ev.target;
        }else{
            return ev.srcElement;;
        };
    },
    xy: function(ev, z, type) {
        if (type){
            if (carco.functions.browser.IE() == 10&&carco.functions.isMobile.any()&&type == "page"||
                carco.functions.browser.IE() == 11&&carco.functions.isMobile.IeMobile()&&type == "page") {
                var shift = 0
                var scrollLeft = carco.functions.position.scrollLeft()
                var scrollTop = carco.functions.position.scrollTop()
                if (z == "X") shift = scrollLeft
                if (z == "Y") shift = scrollTop
                return ev["client"+z];
            }else{
                return ev[type+z];
            };
        }else{
            if (ev["stage"+z]) {
                return ev["stage"+z];
            } else {
                return ev["client"+z];
            };
        };
    }
};

carco.functions.testfunctions = {
    init: function(item) {
        var savebutton = false;
        if (item.carco.playeritems&&item.carco.playeritems.testsavebutton) savebutton = item.carco.playeritems.testsavebutton;
        if (document.getElementById("testsavebutton")) savebutton = document.getElementById("testsavebutton");
        if (item.carco.paramsdata.user.testfunctions == "1"||item.carco.paramsdata.user.testfunctions == "true"){
            if (!savebutton){
                var player = document.getElementById("odPlayer");
                savebutton = player.parentElement.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"savebutton"}, vars:{innerHTML:"Mentés"}}))
            };
            if (savebutton&&item.carco.saveuserstatus){
                savebutton.style.display = "block";
                function save() {
                    savebutton.innerHTML = "..."
                    setTimeout(function() {
                        item.carco.saveuserstatus(function(r) {
                            if (r) window.open(r.fullsrc);
                            savebutton.innerHTML = "Mentés";
                        })
                    })
                };
                carco.functions.listeners.add(savebutton, "mousedown", save)
            };
        }else{
            if (savebutton) savebutton.style.display = "none";
        };
    }
};

carco.functions.root = {
    init: function(params) {

        var params = params;
        if (!params.carco) params.carco = {};
        if (!params.carco.paramsdata) params.carco.paramsdata = {};
        if (!params.carco.paramsdata.user) params.carco.paramsdata.user = {};

        var item = params.item;

        for (var x in item.attributes){
            if (item.getAttribute(item.attributes[x].name)){
                params.carco.paramsdata.user[item.attributes[x].name] = item.getAttribute(item.attributes[x].name);
            };
        };

        var searchobj = [];
        var varsobj = {};

        if (window.location.search){
            searchobj = window.location.search;
            if (searchobj.slice) searchobj = searchobj.slice(1);
            if (searchobj.split) searchobj = searchobj.split("&");
        };

        for (var i = 0; i < searchobj.length; i++) {
            var pairs = searchobj[i].split("=")
            varsobj[pairs[0]] = pairs[1]
        };

        for (var x in varsobj){
            params.carco.paramsdata.user[x] = varsobj[x];
        };

        for (var x in varsobj){
            if (x == "currenttrack") params.carco.paramsdata.user["tracksorder"] = "order";
        };

        if (params.carco.paramsdata.user.mode == "0") params.carco.paramsdata.user.feedbacktype = "practice";
        if (params.carco.paramsdata.user.mode == "1") params.carco.paramsdata.user.feedbacktype = "test";
        if (params.carco.paramsdata.user.type == "practice") params.carco.paramsdata.user.feedbacktype = "practice";
        if (params.carco.paramsdata.user.type == "test") params.carco.paramsdata.user.feedbacktype = "test";
        if (params.carco.paramsdata.user.restartbutton == "0") params.carco.paramsdata.user.restartbutton = 0;

        if (params.carco.paramsdata.user.playersize == "fullscreen") {carco.functions.touchscreen.viewPort(750);}
        carco.functions.touchscreen.iemobile10touchfix();
        if (carco.functions.browser.IE() == 10&&carco.functions.isMobile.any()||
            carco.functions.browser.IE() == 11&&carco.functions.isMobile.IeMobile()) {
            params.carco.colorisetype = "svg";
        };

        item.carco.id = carco.functions.children.getID();
        item.carco.config = params;

        if (params.carco){
            for (var x in params.carco){
                item.carco[x] = params.carco[x];
            };
        };

        carco.functions.kiopembed.init(item);

        item.carco.root = item
        if (carco.functions.browser.IE() > 9) {
            item.carco.root.style.opacity = 0.99;
        };

        item.carco.resizeplayer = function(type) {
            item.carco.parent.style.height = (item.carco.parent.offsetWidth*1350/3150)+6 +"px"
            if (item.carco.playeritems.player&&item.carco.paramsdata.user.playersize !== "fullscreen"||
                item.carco.playeritems.player&&type == "resize") {
                var plus = 106;
                item.carco.playeritems.player.style.minHeight = (item.carco.parent.offsetWidth*1350/3150)+ 6 + plus + "px";
                item.carco.playeritems.player.style.height = (item.carco.parent.offsetWidth*1350/3150)+ 6 + plus + "px";
            };
            if (item.carco.preloadlayerresize) item.carco.preloadlayerresize();
        };
        item.carco.resizeplayer();
        carco.functions.listeners.add(window, "resize", item.carco.resizeplayer)

        item.carco.paramsdata.system.usertype = params.carco.paramsdata.system.usertype;
        item.carco.paramsdata.system.currentgame = params.carco.paramsdata.user.currentgame;
        item.carco.paramsdata.system.currenttrack = params.carco.paramsdata.user.currenttrack;

        item.carco.paramsdata.system.urls = params.carco.urls

        carco.functions.load.init({
            item:item,
            save:params.carco.urls.save,
            load:params.carco.urls.load,
            loadtrack:params.carco.urls.loadtrack,
            alltrack:params.carco.urls.alltrack,
            allgame:params.carco.urls.allgame,
            saveuserstatus:params.carco.urls.saveuserstatus,
            loaduserstatus:params.carco.urls.loaduserstatus
        });

        item.carco.getEditor = function(startlayer) {
            carco.functions.root.getEditor(item, startlayer);
        };

        item.carco.getPlayer = function() {
            carco.functions.root.getPlayer(item);
        };

        item.carco.name = item.carco.paramsdata.system.currentgame;
        if (carco.project[item.carco.root.carco.paramsdata.system.currentproject]) carco.project[item.carco.root.carco.paramsdata.system.currentproject].loadTimer("Start Server request: ");

        carco.functions.testfunctions.init(item);

        item.carco.loaduserstatus(function() {
            item.carco.load("server", function() {
                carco.functions.load.loaduserstatuscallback(item, function() {
                    carco.functions.root.callback(item);
                    if (params.loadcallback) params.loadcallback(item);
                })
            })
        });
    },
    callback: function(item, startlayer, type){
        if (carco.project[item.carco.root.carco.paramsdata.system.currentproject]) carco.project[item.carco.root.carco.paramsdata.system.currentproject].loadTimer("End Server response or load data ");
        if (item.carco.paramsdata.system.usertype == "editor") item.carco.layers.layersitem.style.display = "block";
        if (!item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.originaltracks) item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.originaltracks = carco.functions.object.clone(item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.tracks)
        if (type !=="next"&&item.carco.paramsdata.user.tracksorder == "random") {
            if (item.carco.root.carco.paramsdata.user.datatype == "local"){
                item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.tracks = carco.data[item.carco.paramsdata.system.currentproject][item.carco.paramsdata.system.currentgame].games[item.carco.paramsdata.system.currentgame].params.shuffledtracks
            }else{
                item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.tracks = carco.functions.array.shuffle(item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.tracks)
            };
        };

        var currentgame = item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame];
        if (!currentgame.editor) currentgame.editor = {};
        if (!currentgame.params) currentgame.params = {};
        if (!currentgame.params.tracks) {
            currentgame.params.tracks = new Array();
        };

        if (!item.carco.paramsdata.tracks[item.carco.paramsdata.system.currenttrack]) {
            if (typeof currentgame.params.tracks == "string") currentgame.params.tracks = [currentgame.params.tracks]
            if (currentgame.params.tracks[Number(item.carco.paramsdata.system.currenttrack)-1]){
                item.carco.paramsdata.system.currenttrack = currentgame.params.tracks[Number(item.carco.paramsdata.system.currenttrack)-1];
            }else{
                currentgame.params.tracks.push(item.carco.paramsdata.system.currenttrack);
                item.carco.paramsdata.tracks[item.carco.paramsdata.system.currenttrack] = {};
            };
        };

        item.carco.getLanguage = function() {
            if (item.carco.paramsdata.user.lang == "hu_hu") item.carco.paramsdata.user.lang = "hu";
            if (item.carco.paramsdata.user.lang == "en_gb") item.carco.paramsdata.user.lang = "en";
            if (item.carco.paramsdata.user.lang !== "hu"&&item.carco.paramsdata.user.lang !== "en") item.carco.paramsdata.user.lang = "hu";
            var language = item.carco.paramsdata.user.lang;
            return language;
        };

        item.carco.getCurrentTrack = function() {
            var language = item.carco.getLanguage();
            var currenttrack = 1;
            if (!item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.originaltracks) item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.originaltracks = carco.functions.object.clone(item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.tracks);
            if (!item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.originaltracks.length) item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.originaltracks.length = item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.tracks.length
            for (var i = 0; i < item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.originaltracks.length; i++) {
                if (item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.originaltracks[i] == item.carco.paramsdata.system.currenttrack) {
                    currenttrack = i+1;
                };
            };
            return currenttrack;
        };

        item.carco.titleAudioSrc = function() {
            var language = item.carco.getLanguage();
            var currenttrack = item.carco.getCurrentTrack();
            var sound = item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.info[language]["audio_instruction_"+currenttrack];
            if (!sound) sound = item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.info[language]["audio_instruction_1-6"];
            var src = false;
            if (sound) src = item.carco.urls.root+item.carco.paramsdata.system.currentgame+"/"+sound;
            if (window.location.href.match("player")){}else{
                if (sound && !item.carco.paramsdata.user.disabledeletesoundsrcfolder ) src = sound;
            };
            if (src&&src.match("/../")){
                srca = src.split("/../");
                var src = "";
                for (var i = 0; i < srca.length; i++) {
                    var stringa = srca[i].split("/");
                    if (i !== srca.length-1) {
                        for (var a = 0; a < stringa.length; a++) {
                            if (a !== stringa.length-1) {
                                src = src + stringa[a] + "/"
                            };
                        };
                    }else{
                        src = src + srca[i];
                    };
                };
            };

            if (carco.functions.isMobile.androidApp()){
                src = "/android_asset/www/"+src;
            };
            return [src, sound];
        };

        item.carco.studentsAudisSrc = function() {

            var language = item.carco.getLanguage();
            var currenttrack = item.carco.getCurrentTrack();

            var ssound = item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.info[language]["audio_for_students"];
            var ssrc = false;
            if (ssound) ssrc = item.carco.urls.root+"/"+item.carco.paramsdata.system.currentgame+"/"+ssound;
            if (window.location.href.match("player")){}else{
                if (ssound && !item.carco.paramsdata.user.disabledeletesoundsrcfolder) ssrc = ssound;
            };

            if (ssrc&&ssrc.match("/../")){
                var srca = ssrc.split("/../");
                var ssrc = "";
                for (var i = 0; i < srca.length; i++) {
                    var stringa = srca[i].split("/");
                    if (i !== srca.length-1) {
                        for (var a = 0; a < stringa.length; a++) {
                            if (a !== stringa.length-1) {
                                ssrc = ssrc + stringa[a] + "/"
                            };
                        };
                    }else{
                        ssrc = ssrc + srca[i];
                    };
                };
            };

            return [ssrc, ssound];
        };

        function afterPreload() {
            var timeout = 0
            if (carco.functions.browser.IE() == 10&&carco.functions.isMobile.any()||carco.functions.browser.IE() == 11&&carco.functions.isMobile.IeMobile()) {timeout = 1000}
            setTimeout(function() {
                if (item.carco.paramsdata.system.usertype == "user") {
                    carco.functions.game.random(item);
                };
                item.carco.wassaveduserdata = undefined;
                carco.consoleDisable = true;
                if (carco.project[item.carco.root.carco.paramsdata.system.currentproject]) carco.project[item.carco.root.carco.paramsdata.system.currentproject].loadTimer("Start create objects: ");
                item.carco.addCurrentParamsChild();
                setTimeout(function() {carco.functions.root.preloadlayer(item, "remove")},500)
                if (carco.project[item.carco.root.carco.paramsdata.system.currentproject]) carco.project[item.carco.root.carco.paramsdata.system.currentproject].loadTimer("End create objects: ");
                if (carco.project[item.carco.root.carco.paramsdata.system.currentproject]) carco.project[item.carco.root.carco.paramsdata.system.currentproject].loadTimer("reset");
                if (item.carco.paramsdata.system.usertype == "user") carco.functions.children.id = carco.functions.children.id + 10000;
                carco.functions.feedback.solutionslayer(item)
                carco.functions.feedback.endlayer(item)

                carco.functions.game.getGame(item);
                item.carco.game.startAllValues();
                item.carco.loaduserstatusafterload();
                carco.functions.game.motioncontrols(item);
                item.carco.getEditor();
                item.carco.resizeplayer();
                item.carco.resizeChild("children");
                if (!item.carco.saveduserdata) item.carco.game.allInnersPosition();
                item.carco.game.startAllAudio();
                item.carco.getPlayer();
                if (!item.carco.saveduserdata) item.carco.game.startAllProcessBox();
                item.carco.game.startAllstartAction();

                item.carco.loaduserstatusafterload();
                carco.functions.load.loaduserstatusafterload2(item);

                setTimeout(function() {
                    if (item.carco.paramsdata.system.usertype == "user") item.carco.game.startAllTimer();
                },3000)
                item.carco.game.playeritems();
                item.carco.game.language();
                if (item.carco.paramsdata.system.usertype == "user") item.carco.game.titleaudio()
                item.carco.game.infoscreen();
                item.carco.game.player();
                item.carco.game.tracksbar();
                item.carco.game.getActivePlaces(true);
                item.carco.game.isReadyLoad = true;
                carco.functions.microsoft.init(item);


                carco.functions.load.loaduserstatusafterload3(item);
                carco.functions.load.loaduserstatusafterload4(item);

                if (item.carco.config.callback) item.carco.config.callback(item);


            },timeout)
        };

        carco.functions.root.preloader(item, afterPreload);
    },
    getEditor: function(item, startlayer){
        if (item.carco.paramsdata.system.usertype == "editor"){
            var tools = item.carco.tools;
            if (!tools) tools = carco.functions.tools.init(item);
            tools.carco.addTools();
            if (item.carco.layers.layersitem){
                var layers = carco.container(item.carco.layers.layersitem);
                layers.innerHTML = "";
                layers.style.display = "block";
                carco.layers.getlayers(item, layers, startlayer)
            };
            if (item.carco.customparams.toolsvisible !== "sol"){
                item.carco.sollayer.carco.setStyle({background:"rgba(51, 51, 51, 0.74)", visibility:"hidden"}, true)
            }else{
                item.carco.sollayer.carco.setStyle({background:"rgba(51, 51, 51, 0.74)", visibility:"visible"})
            }
        };
    },
    getPlayer: function(item){
        if (item.carco.paramsdata.system.usertype == "user"){
            if (!item.carco.saveduserdata) item.carco.game.allMix();
            carco.functions.game.allRemovePlaceIds(item);
            if (!item.carco.saveduserdata) item.carco.game.startAllDrag();
            item.carco.game.startAllSelectBox();
            item.carco.game.startAllScrollBox();
            if (!item.carco.saveduserdata) setTimeout(function() {item.carco.game.allDragDuplicateOnce()},500)
            if (carco.createjs.Touch.isSupported()&&item.carco.root&&item.carco.root.carco.paramsdata&&item.carco.root.carco.paramsdata.system.usertype == "user"||
                carco.functions.isMobile.any()&&item.carco.root&&item.carco.root.carco.paramsdata&&item.carco.root.carco.paramsdata.system.usertype == "user") {
                setTimeout(function() {item.carco.game.allPlaceLayer();},500)
            };
            item.carco.customparams.feedbackon = false;
            item.carco.originalcustomparams.feedbackon = false;
        };
    },
    preloader: function(item, complete, type){
        carco.functions.root.preloadlayer(item, "add")
        var uniqimages = [];
        var undefinedimages_widthsrc = [];
        var sounds = [];

        var currentgame = item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame];
        var currenttrack = item.carco.paramsdata.system.currenttrack;

        if (currentgame.params.tracks[Number(item.carco.paramsdata.system.currenttrack)-1]){
            currenttrack = currentgame.params.tracks[Number(item.carco.paramsdata.system.currenttrack)-1];
        };

        for (var x in item.carco.paramsdata.tracks){
            for (var r in item.carco.paramsdata.tracks[x].params){
                if (item.carco.paramsdata.tracks[x].params[r].type == "image"&&
                    item.carco.paramsdata.tracks[x].params[r].customparams&&
                    item.carco.paramsdata.tracks[x].params[r].customparams.image&&
                    item.carco.paramsdata.tracks[x].params[r].customparams.image.name&&
                    item.carco.paramsdata.tracks[x].params[r].customparams.image.name !== "fault.png"&&
                    item.carco.paramsdata.tracks[x].params[r].customparams.image.name !== "good.png"){
                    if (item.carco.paramsdata.tracks[x].params[r].customparams.image.newname){
                        if (x == currenttrack) uniqimages.push(item.carco.paramsdata.tracks[x].params[r].customparams.image.newname)
                    }else{
                        if (x == currenttrack) undefinedimages_widthsrc.push(item.carco.paramsdata.tracks[x].params[r].customparams.image.name)
                    };
                };
                if (item.carco.paramsdata.tracks[x].params[r].customparams.gametype == "audio"&&
                    item.carco.paramsdata.tracks[x].params[r].customparams.audio&&
                    item.carco.paramsdata.tracks[x].params[r].customparams.audio.src){
                    if (x == currenttrack) sounds.push(item.carco.paramsdata.tracks[x].params[r].customparams.audio.src);
                };
            };
        };

        if (carco.functions.isMobile.any() || carco.functions.isMobile.androidApp()){
            item.carco.paramsdata.user.enablehalfimages = true;
        };
        var srcroot = item.carco.urls.root + item.carco.urls.imagesfolder;
        var soundsrcroot = item.carco.urls.root + item.carco.urls.imagesfolder;
        if (item.carco.paramsdata.user.enablehalfimages && item.carco.urls.halfimagesfolder && !item.carco.paramsdata.system.disablehalfimages){
            srcroot = item.carco.urls.root + item.carco.urls.halfimagesfolder;
        };
        if (carco.functions.isMobile.androidApp()){
            if (srcroot.match("lib/../")){
                srcroot = srcroot.split("lib/../")[1];
                srcroot = "/android_asset/www/"+srcroot;
            };
            if (soundsrcroot.match("lib/../")){
                soundsrcroot = soundsrcroot.split("lib/../")[1];
                soundsrcroot = "/android_asset/www/"+soundsrcroot;
            };
        };
        sounds = carco.functions.array.uniq(sounds);
        var soundsobj = [];
        for (var i = 0; i < sounds.length; i++) {
            soundsobj.push({src:soundsrcroot+sounds[i]})
        };

        var titlesrc = item.carco.titleAudioSrc()[0];
        if (titlesrc) {
            sounds.push(titlesrc);
            soundsobj.push({src:titlesrc})
        };

        var studentssrc = item.carco.studentsAudisSrc()[0];
        if (studentssrc) {
            sounds.push(studentssrc);
            soundsobj.push({src:studentssrc})
        };

        consoletemp = carco.consoleDisable;
        carco.consoleDisable = false;

        uniqimages = carco.functions.array.uniq(uniqimages);
        undefinedimages_widthsrc = carco.functions.array.uniq(undefinedimages_widthsrc);
        var length = undefinedimages_widthsrc.length + uniqimages.length;

        carco.functions.console("   loadimages length: "+length);
        carco.functions.console("   images from global folder: "+uniqimages.length);
        carco.functions.console("   images from tracks folder: "+undefinedimages_widthsrc.length);

        if (sounds&&sounds.length&&item.carco.paramsdata.system.usertype == "user") {

            carco.createjs.Sound.removeAllSounds();

            if (carco.functions.isMobile.androidApp()){
                carco.createjs.Sound.registerPlugins([carco.createjs.CordovaAudioPlugin]);
                if (carco.media){
                    for (var x in carco.media){
                        if (carco.media[x].release) carco.media[x].release();
                    };
                };
                carco.media = {};
            };

            carco.functions.console("   loadsounds length: "+sounds.length);
            item.carco.audios = [];

            item.carco.audiosobject = {};

            if (!item.carco.loadedsounds) {
                item.carco.loadedsounds = function (ev) {
                    item.carco.audios.push({src: ev.src})
                    item.carco.audiosobject[ev.src] = carco.createjs.Sound.createInstance(ev.src);
                };
            };

            carco.createjs.Sound.alternateExtensions = ["mp3"];
            carco.createjs.Sound.removeEventListener("fileload", item.carco.loadedsounds);
            carco.createjs.Sound.removeAllEventListeners("fileload");
            carco.createjs.Sound.addEventListener("fileload", item.carco.loadedsounds);
            carco.createjs.Sound.registerSounds(soundsobj);

            var sint = setInterval(function() {
                if (item.carco.audios.length == sounds.length){
                    clearInterval(sint);
                    carco.consoleDisable = consoletemp;
                    carco.createjs.Sound.removeEventListener("fileload", item.carco.loadedsounds);
                    if (item.carco.config.preloadcallback){
                        item.carco.config.preloadcallback(complete);
                    }else {
                        if (complete) complete();
                    };
                }else{
                    //console.log(item.carco.audios.length)
                    //console.log(sounds.length)
                }
            },100)
        } else {
            carco.consoleDisable = consoletemp;
            if (item.carco.config.preloadcallback){
                item.carco.config.preloadcallback(complete);
            }else {
                if (complete) complete();
            };
        };

    },
    preloadlayer: function(item, type, preloadlayer) {
        if (!item.carco) item.carco = {};
        if (!item.carco.playeritems) item.carco.playeritems = {};
        var player = item
        if (preloadlayer) item.carco.playeritems.preload_layer = preloadlayer
        if (item.carco.playeritems.preload_layer){
            if (!item.carco.preloadlayerresize){
                item.carco.preloadlayerresize = function() {
                    var prltop = 108;
                    if (item.carco.playeritems.playerheader&&item.carco.playeritems.playerheader.carco.confighidden){
                        var prltop = 51;
                    };
                    var itembounds = player.getBoundingClientRect()
                    var scrollLeft = carco.functions.position.scrollLeft()
                    var scrollTop = carco.functions.position.scrollTop()
                    item.carco.playeritems.preload_layer.style.width = item.offsetWidth+3 + "px";
                    item.carco.playeritems.preload_layer.style.height = item.offsetHeight + "px";
                    item.carco.playeritems.preload_layer.style.top = prltop + "px";
                    item.carco.playeritems.preload_layer.style.left = 10 + "px";
                };
            };
            item.carco.preloadlayerresize();
            if (type == "add"){
                item.carco.playeritems.preload_layer.style.display = "block";
            }else{
                item.carco.playeritems.preload_layer.style.display = "none";
            };
        };
    }
}

carco.functions.parent = {
    getParent: function(item){
        if (item.parentElement) return item.parentElement;
        if (item.parentNode) return item.parentNode;
    }
}

carco.functions.object = {
    clone: function(object){
        var newobject = jQuery.extend(true,  {}, object)
        return newobject;
    },
    types: function(item){
        var type = "boolean";
        if (typeof item == "object") type = "object";
        if (typeof item == "function") type = "function";
        if (typeof item == "string") type = "string";
        if (typeof item == "number") type = "number";
        var tostring = false;
        if (type == "object") tostring = Object.prototype.toString.call(item);
        if (type == "object" && tostring == '[object Array]') type = "array"
        if (tostring == "[object HTMLDivElement]") type = "html";
        if (tostring == "[object HTMLDivElement]") type = "html";
        if (tostring == "[object HTMLCanvasElement]") type = "html";
        if (tostring.match&&tostring.match("HTML")) type = "html";
        if (item == document||item == document.body) type = "html";
        if (item == null) type = "null"
        if (item == undefined) type = "undefined"
        if (item&&item.outerHTML) type = "html"
        if (type == "object"&&item&&item.toString().match("Shape")) type = "shape";
        if (type == "object"&&item&&item.toString().match("Audio")) type = "audio";
        return type;
    }
}

carco.functions.children = {
    createHTML: function(params) {
        if (params.type == "img") params.type = "canvas"
        var object = document.createElement(params.type);
        for (var x in params.attr){
            object.setAttribute(x, params.attr[x]);
        };
        for (var y in params.vars){
            object[y] = params.vars[y];
        };
        if (!object.carco) object.carco = {};
        for (var c in params.carco){
            object.carco[c] = params.carco[c];
        };
        object.carco.itemtype = params.type;
        return object;
    },
    changeParent: function(item, newparent){
        var tempitem = item.carco.duplicate(item.carco.root, false)
        var id = item.carco.id
        item.carco.parent.carco.removeChild(item)
        var newitem = tempitem.carco.duplicate(newparent, false, id)
        tempitem.carco.parent.carco.removeChild(tempitem)
        return newitem
    },
    addChild: function(parent, item, id){

        if (!parent.carco) parent.carco = {};
        if (!parent.carco.children) parent.carco.children = {};
        if (!parent.carco.id) parent.carco.id = this.getID();
        if (!id) {
            var id = this.getID();
        }else{
            if (Number(id.slice(2))>carco.functions.children.id){
                carco.functions.children.id = Number(id.slice(2));
            };
        };

        if (!item.carco.originalcustomparams) {
            item.carco.originalcustomparams = carco.functions.object.clone(item.carco.customparams)
            item.carco.originalsize = carco.functions.object.clone(item.carco.size)
            item.carco.originalposition = carco.functions.object.clone(item.carco.position)
            item.carco.originalscale = carco.functions.object.clone(item.carco.scale)
            item.carco.originalstyle = carco.functions.object.clone(item.carco.style)
        };

        parent.carco.children[id] = item;
        if (item.carco.customparams&&item.carco.customparams.shadow) item.carco.layer = "shadowcontainer";
        if (item.carco.customparams&&item.carco.customparams.shadow&&parent.firstChild){
            parent.insertBefore(item, parent.firstChild);
        }else {
            parent.appendChild(item);
        };
        if (item.carco.type !== "tool") this.recursiveParentChildren(parent, id, item, "recursivechildren");
        carco.container(item);
        item.carco.id = id;
        if (parent.carco&&parent.carco.root) item.carco.root = parent.carco.root;

        if (item.carco.root&&!item.carco.root.carco.saveduserdata&&item.carco.customparams&&item.carco.customparams.checkitem){
            item.carco.style.visibility = "hidden";
            item.carco.originalstyle.visibility = "hidden";
        };

        if (item.carco.id == "id102"&&!item.carco.customparams.gametype) item.carco.customparams.gametype = "none";

        this.styleChild(item);
        if (item.carco.customparams.gametype !== "coordinate") carco.functions.game.getGame(item);
        if (item.carco.type == "inputtext") item.setAttribute("maxlength", 10)
        if (item.carco.type == "inputtext"&&item.carco.parent&&item.carco.parent.carco.parent){carco.functions.game.getGame(item.carco.parent.carco.parent);}
        if (item.carco.type == "text"&&item.carco.parent&&item.carco.parent.carco.parent&&item.carco.parent.carco.parent.carco.customparams&&item.carco.parent.carco.parent.carco.customparams.gametype == "timer"){carco.functions.game.getGame(item.carco.parent.carco.parent);}
        if (item.carco.type == "text"&&item.carco.parent&&item.carco.parent.carco.customparams&&item.carco.parent.carco.customparams.gametype == "timer"){carco.functions.game.getGame(item.carco.parent);}
        if (item.carco.type == "image"&&item.carco.parent&&item.carco.parent.carco.customparams&&item.carco.parent.carco.customparams.gametype == "coordinate"){
            carco.functions.game.getGame(item.carco.parent);
        }
        if (item.carco.type == "image"&&item.carco.parent&&item.carco.parent.carco.customparams&&item.carco.parent.carco.customparams.gametype == "pngseq"){
            carco.functions.game.getGame(item.carco.parent);
        }

        if (item.carco.customparams.checkitem == "container"){parent.carco.checkitem = item}
        if (item.carco.customparams.checkitem == "true") {
            if (!parent.carco.checkitems) parent.carco.checkitems = {};
            parent.carco.checkitems["true"] = item;
        }
        if (item.carco.customparams.checkitem == "false") {
            if (!parent.carco.checkitems) parent.carco.checkitems = {};
            parent.carco.checkitems["false"] = item;
        }

        if (item.carco.customparams.sollayer == true) {
            item.carco.root.carco.sollayer = item;
        }

        if (item.carco.customparams.solitem) {
            if (item.carco.root.carco.recursivechildren[item.carco.customparams.solitem]) {
                item.carco.root.carco.recursivechildren[item.carco.customparams.solitem].carco.game.solitem = item;
            };
        };

        if (item.carco.type == "tool"&&item.carco.seconditem){
            var seconditem = item.carco.seconditem;
            if (!seconditem.carco.tools) seconditem.carco.tools = {};
            seconditem.carco.tools[id] = item;
            this.recursiveParentChildren(seconditem, id, item, "recursivetools");
        };

        return item;
    },
    duplicate: function(item, parent, type, id){
        if (!parent) var parent = item.carco.parent;
        var newitem = addChild(item, parent, id);
        recursiveDuplicate(item, newitem);

        function recursiveDuplicate(item, parent) {
            for (var x in item.carco.children){
                if (item.carco.children[x].carco.name !== "activeitem"){
                    var newitem = addChild(item.carco.children[x], parent)
                    recursiveDuplicate(item.carco.children[x], newitem);
                };
            };
        };

        function addChild(item, parent, id){
            var object = {};
            object.name = item.carco.name;
            object.root = item.carco.root;
            object.type = item.carco.type;
            object.addtools = item.carco.addtools;
            object.layer = item.carco.layer;
            object.style = carco.functions.object.clone(item.carco.originalstyle)
            object.size = carco.functions.object.clone(item.carco.originalsize)
            object.scale = carco.functions.object.clone(item.carco.originalscale)
            object.position = carco.functions.object.clone(item.carco.originalposition)
            object.customparams = carco.functions.object.clone(item.carco.originalcustomparams)
            object.currentlanguage = item.carco.currentlanguage;
            if (type == "sol"||type == "sol1") {
                object.customparams.gametype = "solutionitem";
                object.customparams.values = undefined;
                object.customparams.actions = undefined;
                object.customparams.placeids = undefined;
                object.customparams.solutionplaceid = undefined;
                object.customparams.solutiontoobject = undefined;
                object.currentlanguage = "hu"
            }
            if (type == "sol1"){
                object.customparams.solitem = undefined;
                object.addtools = false;
            }

            var newitem = parent.carco.addChild(carco.functions.children.createHTML(
                {type:item.carco.itemtype,
                    carco:object
                }
            ), id)
            return newitem;
        };
        if (type !== "sol"&&type !== "sol1"){
            var root = item.carco.root;
            if (!type) root.carco.getEditor(newitem);
        };
        return newitem;
    },
    addCurrentParamsChild: function(item){

        var currenttrack = item.carco.paramsdata.tracks[item.carco.paramsdata.system.currenttrack];
        var currenttrack_params = currenttrack.params;

        carco.functions.number.recursiveNumber(currenttrack_params);

        for (var x in currenttrack_params){
            if (!item.carco.recursivechildren) item.carco.recursivechildren = {};
            var parent = item.carco.recursivechildren[currenttrack_params[x].parent];
            if (!parent) parent = item;
            if (currenttrack_params[x].type == "fixposition") currenttrack_params[x].customparams.gametype = "fixposition";

            if (!currenttrack_params[x].originalcustomparams) {

                var originalcustomparams = carco.functions.object.clone(currenttrack_params[x].customparams)
                var originalsize = carco.functions.object.clone(currenttrack_params[x].size)
                var originalposition = carco.functions.object.clone(currenttrack_params[x].position)
                var originalscale = carco.functions.object.clone(currenttrack_params[x].scale)
                var originalstyle = carco.functions.object.clone(currenttrack_params[x].style)

            }else{

                var originalcustomparams = carco.functions.object.clone(currenttrack_params[x].originalcustomparams)
                var originalsize = carco.functions.object.clone(currenttrack_params[x].originalsize)
                var originalposition = carco.functions.object.clone(currenttrack_params[x].originalposition)
                var originalscale = carco.functions.object.clone(currenttrack_params[x].originalscale)
                var originalstyle = carco.functions.object.clone(currenttrack_params[x].originalstyle)

            };

            if (currenttrack_params[x].type == "text"&&item.carco.paramsdata.system.usertype == "user"){
                if (!parent.carco.style) parent.carco.style = {};
                var textcontainer = parent.carco.addChild(carco.functions.children.createHTML(
                    {type: "div",
                        carco: {
                            name: "text container",
                            root: item,
                            type: "container",
                            layer: "textcontainer",
                            size: {width: parent.carco.size.width, height: parent.carco.size.height},
                            scale: {type: "parent"},
                            style: {visibility: parent.carco.style.visibility},
                            position: {relative: {x: 0, y: 0}}
                        }
                    }
                ), x+"tc")
                parent = textcontainer;

                parent.carco.addChild(carco.functions.children.createHTML(
                    {type:currenttrack_params[x].itemtype,
                        carco:{
                            root: item,
                            type: currenttrack_params[x].type,
                            layer: currenttrack_params[x].layer,
                            name: currenttrack_params[x].name,
                            style:currenttrack_params[x].style,
                            customparams:currenttrack_params[x].customparams,
                            size:currenttrack_params[x].size,
                            scale:currenttrack_params[x].scale,
                            position:currenttrack_params[x].position,
                            originalsize: originalsize,
                            originalposition: originalposition,
                            originalscale: originalscale,
                            originalstyle: originalstyle,
                            originalcustomparams: originalcustomparams
                        }
                    }), x);
            }else{
                parent.carco.addChild(carco.functions.children.createHTML(
                    {type:currenttrack_params[x].itemtype,
                        carco:{
                            root: item,
                            type: currenttrack_params[x].type,
                            addtools: currenttrack_params[x].addtools,
                            layer: currenttrack_params[x].layer,
                            name: currenttrack_params[x].name,
                            style:currenttrack_params[x].style,
                            customparams:currenttrack_params[x].customparams,
                            size:currenttrack_params[x].size,
                            scale:currenttrack_params[x].scale,
                            position:currenttrack_params[x].position,
                            originalsize: originalsize,
                            originalposition: originalposition,
                            originalscale: originalscale,
                            originalstyle: originalstyle,
                            originalcustomparams: originalcustomparams
                        }
                    }), x);
            };
        };
    },
    removeChild: function(parent, item, callback){
        var id = item.carco.id
        var root = item.carco.root;

        if (item.carco.customparams.solitem&&item.carco.root.carco.recursivechildren[item.carco.customparams.solitem]) {
            item.carco.root.carco.recursivechildren[item.carco.customparams.solitem].carco.game.solitem = undefined
        };

        for (var x in item.carco.recursivechildren){
            this.recursiveDeleteParentChildren(item.carco.recursivechildren[x].carco.parent, x, "children");
            this.recursiveDeleteParentChildren(item.carco.recursivechildren[x].carco.parent, x, "recursivechildren");
        };
        this.recursiveDeleteParentChildren(parent, id, "children");
        this.recursiveDeleteParentChildren(parent, id, "recursivechildren");
        if (item.carco.tools){
            for (var x in item.carco.recursivetools){
                var id = item.carco.recursivetools[x].carco.id
                this.recursiveDeleteParentChildren(parent, id, "recursivetools");
                item.carco.recursivetools[x].carco.parent.removeChild(item.carco.recursivetools[x]);
                delete item.carco.recursivetools[x];
            };
        };
        delete parent.carco.children[id];
        $(item).empty()
        parent.removeChild(item);
        if (callback) callback();
    },
    removeAllChildren: function(item, type){
        carco.functions.game.clearAllAudio(item);
        if (type == false&&item.carco.root.carco.paramsdata.system.usertype == "user"){
            item.carco.recursivechildren = {};
            item.carco.children = {};
            item.innerHTML = "";
        }else{
            function removeCache(object){
                if (object.carco.type == "image"&&object.carco.stage){
                    if (object.carco.tempitem) $(object.carco.tempitem).removeAttr('src');
                    var stage = object.carco.stage;
                    if (stage){
                        stage.autoClear = true;
                        if (stage.children[0]&&stage.children[0].image) {
                            $(stage.children[0].image).removeAttr('src');
                            stage.children[0].uncache()
                            $(stage.children[0].image).empty();
                            stage.children[0].image = null;
                        };
                        if (stage.children[1]) {
                            stage.children[1].uncache()
                            stage.children[1].graphics.clear()
                            stage.children[1]._matrix = {}
                            stage.children[1]._graphics = {}
                        };
                        if (stage.children[2]) {
                            stage.children[2].uncache()
                            stage.children[2].graphics.clear()
                            stage.children[2]._matrix = {}
                            stage.children[2]._graphics = {}
                        };
                        stage.removeAllChildren();
                        stage.clear();
                        $(stage.canvas).empty()
                        stage.update();
                    };
                };
                $(object).empty()
            };

            for (var x in item.carco.recursivechildren){
                removeCache(item.carco.recursivechildren[x]);
            };
            if (item.carco.solitems){
                for (var i = 0; i < item.carco.solitems.length; i++) {
                    for (var a = 0; a < item.carco.solitems[i].length; a++) {
                        for (var x in item.carco.solitems[i][a].carco.recursivechildren){
                            removeCache(item.carco.solitems[i][a].carco.recursivechildren[x]);
                        };
                    };
                };
            };
            for (var x in item.carco.children){
                item.carco.removeChild(item.carco.children[x]);
            };
        };
    },
    recursiveParentChildren: function(item, name, children, object){
        if (item&&item.carco){
            if (!item.carco[object]) item.carco[object] = {};
            item.carco[object][name] = children;
            if (!item.carco.getParent) carco.container(item);
            item.carco.getParent();
            this.recursiveParentChildren(item.carco.parent, name, children, object);
        };
    },
    recursiveDeleteParentChildren: function(item, name, object){
        if (item&&item.carco&&item.carco[object]){
            delete item.carco[object][name];
            this.recursiveDeleteParentChildren(item.carco.parent, name, object);
        };
    },
    styleChild: function(item, second_item) {
        carco.functions.size.getSize(item)
        if (!item.carco.originalsize) {
            item.carco.resize();
        }else{
            item.carco.resize("save");
        };
        if (!item.carco.originalcustomparams) item.carco.originalcustomparams = {};
        if (!item.carco.customparams) item.carco.customparams = {};
        item.carco.setStyle(false, true);
        if (item.carco.customparams&&item.carco.customparams.image&&item.carco.customparams.image.name)item.carco.loadImage(item.carco.customparams.image.name, "save");
        item.carco.innerHTML();
    },
    getID: function() {
        this.id = this.id + 1;
        return "id"+this.id;
    },
    id:100,
    getChildren: function(item, params) {
        var object = [];
        if (!params.children) params.children = "recursivechildren";
        var ids = [];
        for (var x in item.carco[params.children]){
            if (item.carco[params.children][x].carco.id.slice(-2) !== "ai"&&item.carco[params.children][x].carco.id.slice(-2) !== "pl") {
                ids.push(item.carco[params.children][x].carco.id);
            };
        };

        ids.sort(function(a,b) {
            if (!isNaN(Number(a.slice(2)))&&!isNaN(Number(b.slice(2)))) {
                return Number(a.slice(2)) - Number(b.slice(2))
            }else{
                if (isNaN(Number(a.slice(2)))&&isNaN(Number(b.slice(2)))){
                    return Number(a.slice(2,-2)) - Number(b.slice(2,-2))
                }else{
                    if (isNaN(Number(a.slice(2)))){
                        return Number(a.slice(2,-2)) - Number(b.slice(2))
                    }else{
                        return Number(a.slice(2)) - Number(b.slice(2,-2))
                    };
                };
            };
        })

        for (var x in item.carco[params.children]){
            if (item.carco[params.children][x].carco&&item.carco[params.children][x].carco.id.slice(-2) !== "pl"&&item.carco[params.children][x].carco.id.slice(-2) !== "ai"){
                var good = recursiveCondition(params.equal, item.carco[params.children][x].carco, "equal")
                if (good == true){
                    if (!params.type) {var type = "item";}else{var type = params.type};
                    object.push([item.carco[params.children][x].carco[type], item.carco[params.children][x].carco.id]);
                };
            };
        };

        function recursiveCondition(object, item, type) {
            var good = true;
            for (var o in object){
                var go = true;
                if (type == "equal"&&good == false) go = false;
                if (type == "nonequal"&&good == false) go = false;
                if (typeof object[o] == "object"&&go){
                    good = recursiveCondition(object[o], item[o], type);
                }else{
                    if (item){
                        if (type == "equal"){
                            if (object[o] !== item[o]) good = false;
                        }else{
                            if (object[o] === item[o]) good = false;
                        };
                    }else{
                        if (type == "equal"){
                            good = false;
                        };
                    };
                };
            };
            return good;
        };

        if (params.nonequal){
            var returnobject = [];
            for (var i = 0; i < object.length; i++) {
                var good = recursiveCondition(params.nonequal, object[i][0].carco, "nonequal")
                if (good == true){
                    if (!params.type) {var type = "item";}else{var type = params.type};
                    returnobject.push([object[i][0].carco[type], object[i][0].carco.id]);
                };
            }
            object = returnobject;
        };

        var sortedobjet = [];
        for (var i = 0; i < ids.length; i++) {
            for (var o = 0; o < object.length; o++) {
                if (object[o][1] == ids[i]) sortedobjet.push(object[o][0])
            };
        };

        object = sortedobjet;

        if (params.call){
            for (var o = 0; o < object.length; o++) {
                for (var c in params.call){
                    if (object[o]){
                        var sendobj = undefined;
                        if (params.call[c]) sendobj = carco.functions.object.clone(params.call[c])
                        if (object[o].carco[c]) object[o].carco[c](sendobj);
                    };
                };
            };
        };

        return object;
    }
};

carco.functions.childrenTypes = {
    add: function(parent, type, editor) {
        var item = this.types[type](parent);
        var root = parent.carco.root;
        if (editor !== false) root.carco.getEditor(item)
        return item;
    },
    types: {
        container: function(parent) {
            var item = parent.carco.addChild(carco.functions.children.createHTML(
                {type:"div",
                    carco:{
                        name: "container",
                        root: parent.carco.root,
                        type: "container",
                        addtools: true,
                        layer: "container",
                        style:{background:"#333333"},
                        size:{width:200, height:200},
                        position:{relative:{x:0, y:0}},
                        customparams: {gametype:"none"}
                    }
                }
            ))
            return item;
        },
        shadow_container: function(parent) {
            var background = "transparent";
            var width = parent.carco.originalsize.width*0.9;
            var height = parent.carco.originalsize.height*0.9;
            if (parent.carco.originalstyle&&parent.carco.originalstyle.background) var background = parent.carco.originalstyle.background;
            var item = parent.carco.addChild(carco.functions.children.createHTML(
                {type:"div",
                    carco:{
                        name: "shadow container",
                        root: parent.carco.root,
                        type: "container",
                        addtools: true,
                        layer: "shadowcontainer",
                        style:{background:background},
                        size:{width:width, height:height},
                        position:{type:{x:"center", y:"center"}},
                        customparams: {gametype:"none", shadow: true}
                    }
                }
            ))
            return item;
        },
        imagecontainer: function(parent, name) {
            if (!name) var name = "image container";
            var item = parent.carco.addChild(carco.functions.children.createHTML(
                {type:"div",
                    carco:{
                        name: name,
                        root: parent.carco.root,
                        type: "container",
                        addtools: true,
                        layer: "imagecontainer",
                        style:{background:"transparent"},
                        size:{width:200, height:200},
                        position:{relative:{x:0, y:0}},
                        customparams: {gametype:"none"}
                    }
                }
            ))

            var image = item.carco.addChild(carco.functions.children.createHTML(
                {type:"img",
                    carco:{
                        name: "image",
                        root: parent.carco.root,
                        type: "image",
                        addtools: false,
                        layer: "image",
                        size:{width:200, height:200},
                        scale:{type:"fitinternal"},
                        position:{type:{x:"center", y:"center"}}
                    }
                }
            ))
            return item;
        },
        covercontainer: function(parent) {
            var item = this.imagecontainer(parent, "cover container")
            return item;
        },
        image: function(parent) {
            var item = parent.carco.addChild(carco.functions.children.createHTML(
                {type:"img",
                    carco:{
                        name: "image",
                        root: parent.carco.root,
                        type: "image",
                        addtools: false,
                        layer: "image",
                        size:{width:200, height:200},
                        scale:{type:"fitinternal"},
                        position:{type:{x:"center", y:"center"}}
                    }
                }
            ))
            return item;
        },
        textcontainer: function(parent) {

            var item = parent.carco.addChild(carco.functions.children.createHTML(
                {type:"div",
                    carco:{
                        name: "text container",
                        root: parent.carco.root,
                        type: "container",
                        addtools: true,
                        layer: "textcontainer",
                        style:{background:"transparent"},
                        size:{width:200, height:200},
                        position:{relative:{x:0, y:0}},
                        customparams: {gametype:"none"}
                    }
                }
            ))

            var text = item.carco.addChild(carco.functions.children.createHTML(
                {type:"div",
                    carco:{
                        name: "text",
                        root: parent.carco.root,
                        type: "text",
                        addtools: false,
                        layer: "text",
                        size:{width:150, height:150},
                        scale:{type:"parent"},
                        position:{type:{x:"center", y:"center"}}
                    }
                }
            ))
            return item;
        },
        text: function(parent) {
            var item = parent.carco.addChild(carco.functions.children.createHTML(
                {type:"div",
                    carco:{
                        name: "text container",
                        root: parent.carco.root,
                        type: "container",
                        addtools: true,
                        layer: "textcontainer",
                        style:{background:"transparent"},
                        size:{width:200, height:200},
                        position:{relative:{x:0, y:0}},
                        customparams: {gametype:"none"}
                    }
                }
            ))

            var text = item.carco.addChild(carco.functions.children.createHTML(
                {type:"div",
                    carco:{
                        name: "text",
                        root: parent.carco.root,
                        type: "text",
                        addtools: false,
                        layer: "text",
                        size:{width:200, height:200},
                        scale:{type:"parent"},
                        position:{type:{x:"center", y:"center"}}
                    }
                }
            ))
            return item;
        },
        imagetextcontainer: function(parent) {

            var item = parent.carco.addChild(carco.functions.children.createHTML(
                {type:"div",
                    carco:{
                        name: "image text container",
                        root: parent.carco.root,
                        type: "container",
                        addtools: true,
                        layer: "container",
                        style:{background:"transparent"},
                        size:{width:200, height:200},
                        position:{relative:{x:10, y:10}},
                        customparams: {gametype:"none"}
                    }
                }
            ))

            var image = item.carco.addChild(carco.functions.children.createHTML(
                {type:"img",
                    carco:{
                        name: "image",
                        root: parent.carco.root,
                        type: "image",
                        addtools: false,
                        layer: "image",
                        size:{width:200, height:200},
                        scale:{type:"fitinternal"},
                        position:{type:{x:"center", y:"center"}}
                    }
                }
            ))

            var textcontainer = item.carco.addChild(carco.functions.children.createHTML(
                {type:"div",
                    carco:{
                        name: "text container",
                        root: parent.carco.root,
                        type: "container",
                        addtools: true,
                        layer: "textcontainer",
                        style:{background:"transparent"},
                        size:{width:150, height:150},
                        position:{type:{x:"center", y:"center"}},
                        customparams: {gametype:"none"}
                    }
                }
            ))

            var text = textcontainer.carco.addChild(carco.functions.children.createHTML(
                {type:"div",
                    carco:{
                        name: "text",
                        root: parent.carco.root,
                        type: "text",
                        addtools: false,
                        layer: "text",
                        size:{width:200, height:200},
                        scale:{type:"parent"},
                        position:{type:{x:"center", y:"center"}}
                    }
                }
            ))
            return item;
        },
        "fix position": function(parent) {
            var item = parent.carco.addChild(carco.functions.children.createHTML(
                {type:"div",
                    carco:{
                        name: "fix position",
                        root: parent.carco.root,
                        type: "fixposition",
                        addtools: true,
                        layer: "fixposition",
                        style: {background: "rgba(255, 255, 255, 0)"},
                        size:{width:100, height:100},
                        position:{relative:{x:0, y:0}},
                        customparams:{gametype:"fixposition"}
                    }
                }
            ))
            return item;
        },
        inputtextcontainer: function(parent) {

            var item = parent.carco.addChild(carco.functions.children.createHTML(
                {type:"div",
                    carco:{
                        name: "container",
                        root: parent.carco.root,
                        type: "container",
                        addtools: true,
                        layer: "container",
                        style:{background:"#333333"},
                        size:{width:460, height:160},
                        position:{relative:{x:0, y:0}},
                        customparams: {gametype:"none"}
                    }
                }
            ))

            var textcontainer = item.carco.addChild(carco.functions.children.createHTML(
                {type:"div",
                    carco:{
                        name: "input text container",
                        root: parent.carco.root,
                        type: "container",
                        addtools: true,
                        layer: "inputtextcontainer",
                        style:{background:"transparent"},
                        size:{width:400, height:100},
                        position:{type:{x:"center", y:"center"}}
                    }
                }
            ))

            var text = textcontainer.carco.addChild(carco.functions.children.createHTML(
                {type:"input",
                    attr:{"type":"text", "spellcheck":"false"},
                    carco:{
                        name: "inputtext",
                        root: parent.carco.root,
                        type: "inputtext",
                        addtools: false,
                        layer: "inputtext",
                        size:{width:400, height:100},
                        scale:{type:"parent"},
                        style:{background:"transparent"},
                        position:{type:{x:"center", y:"center"}}
                    }
                }
            ))
            return item;
        }
    }
};

carco.functions.position = {
    getBoundingClientRect: function(item, type) {
        return item.getBoundingClientRect();
    },
    getMeasuredPosition: function(item, newabsolute) {
        if (!item.carco) item.carco = {};
        if (!item.carco.position) item.carco.position = {};
        if (!item.carco.position.relative) item.carco.position.relative = {};
        if (!item.carco.position.absolute) item.carco.position.absolute = {};

        if (!newabsolute) var newabsolute = true
        if (newabsolute == true||!item.carco.position||!item.carco.position.absolute||!item.carco.position.absolute.x){
            var bounds = carco.functions.position.getBoundingClientRect(item);
            item.carco.position.absolute.x = bounds.left
            item.carco.position.absolute.y = bounds.top
        };

        if (!item.carco.parent) item.carco.getParent();

        var parent = item.carco.parent;
        var parentbounds = carco.functions.position.getBoundingClientRect(parent);
        if (!parent.carco) carco.container(parent);
        if (!parent.carco.scale) parent.carco.scale = {};
        if (!parent.carco.scale.x) parent.carco.scale.x = 1;
        if (!parent.carco.scale.y) parent.carco.scale.y = 1;

    },
    getPosition: function(item) {
        if (!item.carco) item.carco = {};
        if (!item.carco.position) item.carco.position = {};
        if (!item.carco.position.relative) item.carco.position.relative = {};
        if (!item.carco.position.absolute) item.carco.position.absolute = {};
        if (!item.carco.position.relative.x) item.carco.position.relative.x = 0;
        if (!item.carco.position.relative.y) item.carco.position.relative.y = 0;

        if (item.style.position !== "absolute") item.style.position = "absolute";

        if (!item.carco.parent) item.carco.getParent();
        var parent = item.carco.parent;
        if (!parent.carco) parent.carco = {};
        if (!parent.carco.getMeasuredSize) carco.container(parent);

        if (!parent.carco.size) parent.carco.getMeasuredSize();
        var parent_width = parent.carco.size.width;
        var parent_height = parent.carco.size.height;
        if (item.parentElement == document.body) {parent_height = window.innerHeight}

        if (item.carco.position.type&&item.carco.position.type.item){
            var second_item = item.carco.position.type.item;
            if (!second_item.carco.position) second_item.carco.getMeasuredPosition();
            item.carco.position.relative.x = second_item.carco.position.absolute.x - parent.carco.position.absolute.x
            item.carco.position.relative.y = second_item.carco.position.absolute.y - parent.carco.position.absolute.y
            item.carco.position.relative.x = item.carco.position.relative.x / second_item.carco.root.carco.scale.X;
            item.carco.position.relative.y = item.carco.position.relative.y / second_item.carco.root.carco.scale.Y;
        };

        var bordertop = 0;
        var borderbottom = 0;
        var borderleft = 0;
        var borderright = 0;

        if (parent.style.borderTopWidth){
            if (!isNaN(Number(parent.style.borderTopWidth.slice(0,-2)))) bordertop = Number(parent.style.borderTopWidth.slice(0,-2))
            if (!isNaN(Number(parent.style.borderBottomWidth.slice(0,-2)))) borderbottom = Number(parent.style.borderBottomWidth.slice(0,-2))
            if (!isNaN(Number(parent.style.borderLeftWidth.slice(0,-2)))) borderleft = Number(parent.style.borderLeftWidth.slice(0,-2))
            if (!isNaN(Number(parent.style.borderRightWidth.slice(0,-2)))) borderright = Number(parent.style.borderLeftWidth.slice(0,-2))
        }

        var pluswidth = (borderleft + borderright)
        var plusheight = (bordertop + borderbottom)

        if (item.carco.scale&&item.carco.scale.x){
            pluswidth = (borderleft + borderright)/item.carco.scale.x
            plusheight = (bordertop + borderbottom)/item.carco.scale.y
        };

        item.carco.position.relative.xpercent = (item.carco.position.relative.x-pluswidth/2) / (parent_width-pluswidth) * 100
        item.carco.position.relative.ypercent = (item.carco.position.relative.y-plusheight/2) / (parent_height-plusheight) * 100

        this.generatePosition(item);

        if (item.style.left == item.carco.position.relative.xpercent + "%"){}else{
            item.style.left = item.carco.position.relative.xpercent + "%";
            var getBounding = true
        };

        if (item.style.top == item.carco.position.relative.ypercent + "%") {}else{
            item.style.top = item.carco.position.relative.ypercent + "%";
            var getBounding = true
        };

        if (getBounding) carco.functions.position.getBoundingClientRect(item, "reset");

        var bounds = carco.functions.position.getBoundingClientRect(item);
        item.carco.position.absolute.x = bounds.left
        item.carco.position.absolute.y = bounds.top
    },
    setPosition: function(item, params) {
        if (!item.carco) item.carco = {};
        if (!item.carco) item.carco = {};
        if (!item.carco.position) item.carco.position = {};
        if (!item.carco.position.relative) item.carco.position.relative = {};
        if (!item.carco.position.absolute) item.carco.position.absolute = {};
        if (!item.carco.position.type) item.carco.position.type = {};
        if (!item.carco.parent) item.carco.getParent();
        var parentOffset = carco.functions.position.getBoundingClientRect(item.carco.parent);
        var parent_width = item.carco.parent.carco.size.width;
        var parent_height = item.carco.parent.carco.size.height;
        if (item.parentElement == document.body) {parent_height = window.innerHeight}
        var scrollLeft = carco.functions.position.scrollLeft()
        var scrollTop = carco.functions.position.scrollTop()

        if (params){
            if (params.relative){
                for (var x in params.relative){
                    item.carco.position.relative[x] = params.relative[x];
                };
            };
            if (params.absolute){
                params.absolute.x = params.absolute.x - scrollLeft * 2
                params.absolute.y = params.absolute.y - scrollTop * 2
                for (var x in params.absolute){
                    item.carco.position.absolute[x] = params.absolute[x];
                };
            };
            if (params.type){
                for (var x in params.type){
                    item.carco.position.type[x] = params.type[x];
                };
            };
        };

        var parent = item.carco.parent;

        var bordertop = 0;
        var borderbottom = 0;
        var borderleft = 0;
        var borderright = 0;

        if (!isNaN(Number(parent.style.borderTopWidth.slice(0,-2)))) bordertop = Number(parent.style.borderTopWidth.slice(0,-2))
        if (!isNaN(Number(parent.style.borderBottomWidth.slice(0,-2)))) borderbottom = Number(parent.style.borderBottomWidth.slice(0,-2))
        if (!isNaN(Number(parent.style.borderLeftWidth.slice(0,-2)))) borderleft = Number(parent.style.borderLeftWidth.slice(0,-2))
        if (!isNaN(Number(parent.style.borderRightWidth.slice(0,-2)))) borderright = Number(parent.style.borderLeftWidth.slice(0,-2))

        var pluswidth = borderleft + borderright
        var plusheight = bordertop + borderbottom;

        if (params.absolute){
            if (item.carco.position.type.boundingy){
                var shift = 0
                if (item.carco.position.type.boundingy == "center"){shift = item.carco.size.realOffsetHeight/2}
                if (item.carco.position.type.boundingy == "max"){shift = item.carco.size.realOffsetHeight}
                params.absolute.y = params.absolute.y + shift
            };
            if (item.carco.position.type.boundingx){
                var shift = 0
                if (item.carco.position.type.boundingx == "center"){shift = item.carco.size.realOffsetWidth/2}
                if (item.carco.position.type.boundingx == "max"){shift = item.carco.size.realOffsetWidth}
                params.absolute.x = params.absolute.x + shift
            };
            item.carco.position.relative.x = (params.absolute.x - (parentOffset.left - scrollLeft)) / (item.carco.parent.carco.scale.x * item.carco.root.carco.scale.X);
            item.carco.position.relative.y = (params.absolute.y - (parentOffset.top - scrollTop)) / (item.carco.parent.carco.scale.y * item.carco.root.carco.scale.Y);
            item.carco.position.relative.xpercent = (item.carco.position.relative.x-pluswidth/2) / (parent_width-pluswidth) * 100
            item.carco.position.relative.ypercent = (item.carco.position.relative.y-plusheight/2) / (parent_height-plusheight) * 100
            if (item.carco.customparams&&item.carco.customparams.gametype !== "solutionitem"){
                item.style.left = item.carco.position.relative.xpercent + "%";
                item.style.top = item.carco.position.relative.ypercent + "%";
                var measuredsize = carco.functions.position.getBoundingClientRect(item, "reset");
                var parentmeasuredsize = carco.functions.position.getBoundingClientRect(parent, "reset");
                if (params.absolute.y + scrollTop!== measuredsize.top){
                    item.carco.position.relative.y = (params.absolute.y - (measuredsize.top - params.absolute.y) - parentmeasuredsize.top + scrollTop*2) / (item.carco.parent.carco.scale.y * item.carco.root.carco.scale.Y);
                    item.carco.position.relative.ypercent = (item.carco.position.relative.y-plusheight/2) / (parent_height-plusheight) * 100
                };
                if (params.absolute.x + scrollLeft!== measuredsize.left){
                    item.carco.position.relative.x = (params.absolute.x - (measuredsize.left - params.absolute.x) - parentmeasuredsize.left + scrollLeft*2) / (item.carco.parent.carco.scale.x * item.carco.root.carco.scale.X);
                    item.carco.position.relative.xpercent = (item.carco.position.relative.x-pluswidth/2) / (parent_width-pluswidth) * 100
                };
            };
        };

        if (params.relative&&params.relative.xpercent){
            item.carco.position.relative.x = params.relative.xpercent / 100 * parent_width
            item.carco.position.relative.y = params.relative.ypercent / 100 * parent_height
        };

    },
    generatePosition: function(item){
        if (!item.carco) item.carco = {};
        if (!item.carco.getParent) carco.container(item);
        if (!item.carco.parent) item.carco.getParent();
        if (!item.carco.position) item.carco.position = {};
        if (!item.carco.position.type) item.carco.position.type = {};
        if (!item.carco.position.type.x) item.carco.position.type.x = false;
        if (!item.carco.position.type.y) item.carco.position.type.y = false;
        if (!item.carco.position.type.boundingx) item.carco.position.type.boundingx = false;
        if (!item.carco.position.type.boundingy) item.carco.position.type.boundingy = false;

        var bounds = carco.functions.position.getBoundingClientRect(item);
        item.carco.position.absolute.x = bounds.left
        item.carco.position.absolute.y = bounds.top

        var parent = item.carco.parent;

        if (item.carco.position.type.x == "center"){
            item.carco.position.relative.x = (parent.carco.size.clientWidth - item.carco.size.offsetWidth)/2

            if (item.carco.position.type&&item.carco.position.type.item){
                var second_item = item.carco.position.type.item;
                item.carco.position.relative.x = (second_item.carco.position.absolute.x - parent.carco.position.absolute.x) + ((second_item.carco.size.clientWidth - item.carco.size.offsetWidth)/2);
            };
            item.carco.position.relative.xpercent = item.carco.position.relative.x / parent.carco.size.offsetWidth * 100
        };

        if (item.carco.position.type.y == "center"){
            item.carco.position.relative.y = (parent.carco.size.clientHeight - item.carco.size.offsetHeight)/2
            if (item.carco.position.type&&item.carco.position.type.item){
                var second_item = item.carco.position.type.item;
                item.carco.position.relative.y = (second_item.carco.position.absolute.y - parent.carco.position.absolute.y) + ((second_item.carco.size.clientHeight - item.carco.size.offsetHeight)/2);
            };
            item.carco.position.relative.ypercent = item.carco.position.relative.y / parent.carco.size.offsetHeight * 100
        };

        if (item.carco.position.type.x == "max"){
            item.carco.position.relative.x = (parent.carco.size.offsetWidth - item.carco.size.offsetWidth)

            if (item.carco.position.type&&item.carco.position.type.item){
                var second_item = item.carco.position.type.item;
                item.carco.position.relative.x = (second_item.carco.position.absolute.x - parent.carco.position.absolute.x) / second_item.carco.root.carco.scale.X + ((second_item.carco.size.offsetWidth - item.carco.size.offsetWidth));
            };
            item.carco.position.relative.xpercent = item.carco.position.relative.x / parent.carco.size.offsetWidth * 100
        };

        if (item.carco.position.type.y == "max"){
            item.carco.position.relative.y = (parent.carco.size.offsetHeight - item.carco.size.offsetHeight)

            if (item.carco.position.type&&item.carco.position.type.item){
                var second_item = item.carco.position.type.item;
                item.carco.position.relative.y = (second_item.carco.position.absolute.y - parent.carco.position.absolute.y) / second_item.carco.root.carco.scale.Y + ((second_item.carco.size.offsetHeight - item.carco.size.offsetHeight));
            };
            item.carco.position.relative.ypercent = item.carco.position.relative.y / parent.carco.size.offsetHeight * 100
        };

        if (item.carco.position.type.x == "min"){
            item.carco.position.relative.x = 0

            if (item.carco.position.type&&item.carco.position.type.item){
                var second_item = item.carco.position.type.item;
                item.carco.position.relative.x = (second_item.carco.position.absolute.x - parent.carco.position.absolute.x) / second_item.carco.root.carco.scale.X
            };
            item.carco.position.relative.xpercent = item.carco.position.relative.x / parent.offsetWidth * 100
        };

        if (item.carco.position.type.y == "min"){
            item.carco.position.relative.y = 0

            if (item.carco.position.type&&item.carco.position.type.item){
                var second_item = item.carco.position.type.item;
                item.carco.position.relative.y = (second_item.carco.position.absolute.y - parent.carco.position.absolute.y) / second_item.carco.root.carco.scale.Y
            };
            item.carco.position.relative.ypercent = item.carco.position.relative.y / parent.offsetHeight * 100
        };

        if (item.carco.position.type.x == "max"||item.carco.position.type.x == "min"){
            var shiftx = 0
            if (item.carco.position.type.x == "max") shiftx = item.carco.size.offsetWidth
            if (item.carco.position.type.x == "min") shiftx = -item.carco.size.offsetWidth
            if (item.carco.position.type.boundingx == "center"){
                item.carco.position.relative.x = item.carco.position.relative.x + (shiftx)/2
                item.carco.position.relative.xpercent = item.carco.position.relative.x / parent.carco.size.offsetWidth * 100
            };

            if (item.carco.position.type.boundingx == "max"){
                item.carco.position.relative.x = item.carco.position.relative.x + (shiftx)
                item.carco.position.relative.xpercent = item.carco.position.relative.x / parent.carco.size.offsetWidth * 100
            };
        }else{
            if (item.carco.position.type.x !== "center"&&item.carco.position.type.boundingx){
                var shift = 0
                if (item.carco.position.type.boundingx == "center"){shift = -item.carco.size.offsetWidth/2}
                if (item.carco.position.type.boundingx == "max"){shift = -item.carco.size.offsetWidth}
                var newx = item.carco.position.relative.xpercent * parent.carco.size.offsetWidth / 100;
                var newx = newx + shift;
                item.carco.position.relative.xpercent = newx / parent.carco.size.offsetWidth * 100
            };
        };

        if (item.carco.position.type.y == "max"||item.carco.position.type.y == "min"){
            var shifty = 0;
            if (item.carco.position.type.y == "max") shifty = item.carco.size.offsetHeight
            if (item.carco.position.type.y == "min") shifty = -item.carco.size.offsetHeight
            if (item.carco.position.type.boundingy == "center"){
                item.carco.position.relative.y = item.carco.position.relative.y + (shifty)/2
                item.carco.position.relative.ypercent = item.carco.position.relative.y / parent.carco.size.offsetHeight * 100
            };

            if (item.carco.position.type.boundingy == "max"){
                item.carco.position.relative.y = item.carco.position.relative.y + (shifty)
                item.carco.position.relative.ypercent = item.carco.position.relative.y / parent.carco.size.offsetHeight * 100
            };
        }else{
            if (item.carco.position.type.y !== "center"&&item.carco.position.type.boundingy){
                var shift = 0
                if (item.carco.position.type.boundingy == "center"){shift = -item.carco.size.offsetHeight/2}
                if (item.carco.position.type.boundingy == "max"){shift = -item.carco.size.offsetHeight}
                var newy = item.carco.position.relative.ypercent * parent.carco.size.offsetHeight / 100;
                var newy = newy + shift;
                item.carco.position.relative.ypercent = newy / parent.carco.size.offsetHeight * 100
            };
        };

    },
    scrollLeft: function(item) {
        var scrollLeft = document.body.scrollLeft;
        if (scrollLeft == 0&&$(document).scrollLeft()) scrollLeft = $(document).scrollLeft();
        if (scrollLeft == 0&&$(window).scrollLeft()) scrollLeft = $(window).scrollLeft();
        if (scrollLeft == 0&&window.scrollX) scrollLeft = window.scrollX
        if (scrollLeft == 0&&document.documentElement.scrollLeft) scrollLeft = document.documentElement.scrollLeft
        if (item&&item.carco.root&&item.carco.root.carco.scrollDiv&&item.carco.root.carco.scrollDiv.length) {
            for (var i = 0; i < item.carco.root.carco.scrollDiv.length; i++) {
                scrollLeft = scrollLeft + item.carco.root.carco.scrollDiv[i].scrollLeft;
            };
        };
        return scrollLeft;
    },
    scrollTop: function(item) {
        var scrollTop = document.body.scrollTop;
        if (scrollTop == 0&&$(document).scrollTop()) scrollTop = $(document).scrollTop();
        if (scrollTop == 0&&$(window).scrollTop()) scrollTop = $(window).scrollTop();
        if (scrollTop == 0&&window.scrollY) scrollTop = window.scrollY
        if (scrollTop == 0&&document.documentElement.scrollTop) scrollLeft = document.documentElement.scrollTop
        if (item&&item.carco.root&&item.carco.root.carco.scrollDiv&&item.carco.root.carco.scrollDiv.length) {
            for (var i = 0; i < item.carco.root.carco.scrollDiv.length; i++) {
                scrollTop = scrollTop + item.carco.root.carco.scrollDiv[i].scrollTop;
            };
        };
        return scrollTop;
    }
};

carco.functions.size = {
    getMeasuredSize: function(item) {
        if (!item.carco) item.carco = {};
        if (!item.carco.size) item.carco.size = {};
        if (!item.carco.getParent) carco.container(item);
        if (!item.carco.parent) item.carco.getParent();

        item.carco.size.offsetWidth = this.offsetWidth(item);
        item.carco.size.offsetHeight = this.offsetHeight(item);
        item.carco.size.clientWidth = this.clientWidth(item);
        item.carco.size.clientHeight = this.clientHeight(item);
    },
    getSize: function(item) {
        item.carco.resize = function(type) {
            if (!item.carco) item.carco = {};
            if (!item.carco.size) item.carco.size = {};
            if (!item.carco.getParent) carco.container(item);
            if (!item.carco.parent) item.carco.getParent();

            if (item.carco.scale&&item.carco.scale.item){
                var second_item = item.carco.scale.item
                if (!second_item.carco) second_item.carco = {};
                if (!second_item.carco.getParent) carco.container(item);
                if (!second_item.carco.parent) second_item.carco.getParent();
                second_item.carco.getMeasuredSize();
                var second_parent = second_item.carco.parent;
                item.carco.size.offsetWidth = second_item.carco.size.offsetWidth;
                item.carco.size.offsetHeight = second_item.carco.size.offsetHeight;
                item.carco.size.width = Math.round(item.carco.size.offsetWidth / second_parent.carco.scale.x);
                item.carco.size.height = Math.round(item.carco.size.offsetHeight / second_parent.carco.scale.y);
            };

            var parent = item.carco.parent;
            if (parent&&parent.carco) var resize = parent.carco.resize
            if (!parent.carco) parent.carco = {};
            if (!parent.carco.size) parent.carco.size = {};
            if (!parent.carco.scale) parent.carco.scale = {};
            if (!parent.carco.scale.x) parent.carco.scale.x = 1;
            if (!parent.carco.scale.y) parent.carco.scale.y = 1;
            if (parent.carco.loadCustomCss) parent.carco.loadCustomCss();
            if (!parent.carco.size.offsetWidth||!parent.carco.size.offsetHeight) {
                parent.carco.size.offsetWidth = parent.offsetWidth
                parent.carco.size.offsetHeight = parent.offsetHeight
            }

            if (!parent.carco.size.clientWidth||!parent.carco.size.clientHeight) {
                parent.carco.size.clientWidth = parent.clientWidth
                parent.carco.size.clientHeight = parent.clientHeight
            }

            if (!parent.carco.size.width||!resize) parent.carco.size.width = Math.round(parent.carco.size.offsetWidth / parent.carco.scale.x);
            if (!parent.carco.size.height||!resize) parent.carco.size.height = Math.round(parent.carco.size.offsetHeight / parent.carco.scale.y);

            item.carco.size.width = Math.round(item.carco.size.width);
            item.carco.size.height = Math.round(item.carco.size.height);

            carco.functions.size.getScale(item);
            carco.functions.size.getRootScale(item)

            item.carco.size.offsetWidth = item.carco.size.width * item.carco.scale.x
            item.carco.size.offsetHeight = item.carco.size.height * item.carco.scale.y
            item.carco.size.realOffsetWidth = item.carco.size.offsetWidth * item.carco.root.carco.scale.X
            item.carco.size.realOffsetHeight = item.carco.size.offsetHeight * item.carco.root.carco.scale.Y

            if (item.carco.type == "tool"){
                item.carco.size.offsetWidth = 25 / item.carco.root.carco.scale.X
                item.carco.size.offsetHeight = 25 / item.carco.root.carco.scale.Y
                item.carco.size.realOffsetWidth = 25 / item.carco.root.carco.scale.X
                item.carco.size.realOffsetHeight = 25 / item.carco.root.carco.scale.Y
            };

            if (item.carco.customparams&&item.carco.customparams.checkitem){};

            var bordertop = 0;
            var borderbottom = 0;
            var borderleft = 0;
            var borderright = 0;

            if (item.style.borderTopWidth&&!isNaN(Number(item.style.borderTopWidth.slice(0,-2)))) bordertop = Number(item.style.borderTopWidth.slice(0,-2))
            if (item.style.borderBottomWidth&&!isNaN(Number(item.style.borderBottomWidth.slice(0,-2)))) borderbottom = Number(item.style.borderBottomWidth.slice(0,-2))
            if (item.style.borderLeftWidth&&!isNaN(Number(item.style.borderLeftWidth.slice(0,-2)))) borderleft = Number(item.style.borderLeftWidth.slice(0,-2))
            if (item.style.borderRightWidth&&!isNaN(Number(item.style.borderRightWidth.slice(0,-2)))) borderright = Number(item.style.borderLeftWidth.slice(0,-2))

            item.carco.size.clientWidth = item.carco.size.offsetWidth - borderleft - borderright;
            item.carco.size.clientHeight = item.carco.size.offsetHeight - bordertop - borderbottom;
            item.carco.size.realClientWidth = item.carco.size.realOffsetWidth - borderleft - borderright;
            item.carco.size.realClientHeight = item.carco.size.realOffsetHeight - bordertop - borderbottom;

            item.carco.size.widthpercent = Math.round(item.carco.size.offsetWidth) / Math.round(parent.carco.size.clientWidth) * 100
            item.carco.size.heightpercent = Math.round(item.carco.size.offsetHeight) / Math.round(parent.carco.size.clientHeight) * 100

            if (item.style.width == item.carco.size.widthpercent + "%"){}else{
                item.style.width = item.carco.size.widthpercent + "%";
            };

            if (item.style.height == item.carco.size.heightpercent + "%"){}else{
                item.style.height = item.carco.size.heightpercent + "%";
            };

            if (item.carco.canvasresize) item.carco.canvasresize()
            if (item.carco.coordinateresize) item.carco.coordinateresize()
            if (item.carco.pngseq&&item.carco.pngseq.ispaused){
                setTimeout(function() {
                    item.carco.pngseq.pause();
                },100)
            };
            item.carco.getPosition();
            if (item.carco.type == "text"||item.carco.style&&item.carco.style.boxShadow||item.carco.customparams&&item.carco.customparams.customcss){
                item.carco.setStyle()
            };

            if (item.carco.svgresize) item.carco.svgresize()

            item.carco.resizeChild("tools", type);
            item.carco.resizeChild("children", type);
            carco.functions.size.resizeInnersFixCoordinate(item);

            if (type == "save") item.carco.originalposition = carco.functions.object.clone(item.carco.position);
            if (type == "save") item.carco.originalsize = carco.functions.object.clone(item.carco.size);
            if (type == "save") item.carco.originalscale = carco.functions.object.clone(item.carco.scale);
        };
        if (item.carco.id == "id102"){
            $(window).on("resizeEnd", function (event) {
                item.carco.resize();
                if (item.carco.root&&item.carco.root.carco.tools) item.carco.root.carco.tools.carco.resize();
                setTimeout(function() {
                    if (item.carco.resizing !== true) item.carco.resize();
                    item.carco.resizing = true;
                    setTimeout(function() {
                        item.carco.resizing = false;
                        item.carco.root.carco.sollayer.carco.resizeChild("children");
                    },500)
                },500)
            });
        }
        return item.carco.resize;
    },
    resizeInnersFixCoordinate: function(item, type) {
        if (item.carco.game&&item.carco.game.fixcoordinate){
            var scale = item.carco.root.carco.scale.X;
            if (!item.carco.game.fixcoordiscale) item.carco.game.fixcoordiscale = 1;
            if (item.carco.game.fixcoordiscale !== scale||type == true){
                var place = item;
                var placebounds = place.getBoundingClientRect();
                var scrollLeft = carco.functions.position.scrollLeft()
                var scrollTop = carco.functions.position.scrollTop()
                for (var x in place.carco.game.fixcoordinate){
                    var item = item.carco.root.carco.recursivechildren[x];
                    var bounds = item.getBoundingClientRect();
                    var pointx = place.carco.game.fixcoordinate[x][3];
                    var pointy = place.carco.game.fixcoordinate[x][4];
                    var origox = place.carco.customparams.xorigo;
                    var origoy = place.carco.customparams.yorigo;
                    var scaleX = place.carco.scale.x*item.carco.root.carco.scale.X;
                    var scaleY = place.carco.scale.y*item.carco.root.carco.scale.Y;
                    var unitypx = place.carco.customparams.unitypx;
                    var width = place.carco.size.width;
                    var height = place.carco.size.height;
                    var left = placebounds.left + scrollLeft
                    var top = placebounds.top + scrollTop
                    var relativex = (bounds.left-1+scrollLeft+item.carco.size.realOffsetWidth/2-left)/scaleX;
                    var relativey = (bounds.top-1+scrollTop+item.carco.size.realOffsetHeight/2-top)/scaleY;
                    var shiftx = ((origox/unitypx)-Math.floor(origox/unitypx))*unitypx*scaleX;
                    var shifty = ((origoy/unitypx)-Math.floor(origoy/unitypx))*unitypx*scaleY;

                    var x = (Math.round((relativex-shiftx)/unitypx)*(unitypx))*scaleX
                    var y = (Math.round((relativey-2*shifty)/unitypx)*(unitypx))*scaleY

                    var boundshiftx = 0;
                    var boundshifty = 0;

                    if (item.carco.position.type.boundingy){
                        if (item.carco.position.type.boundingy == "center"){boundshifty = item.carco.size.realOffsetHeight/2}
                        if (item.carco.position.type.boundingy == "max"){boundshifty = item.carco.size.realOffsetHeight}
                    };
                    if (item.carco.position.type.boundingx){
                        if (item.carco.position.type.boundingx == "center"){boundshiftx = item.carco.size.realOffsetWidth/2}
                        if (item.carco.position.type.boundingx == "max"){boundshiftx = item.carco.size.realOffsetWidth}
                    };

                    place.carco.game.fixcoordinate[item.carco.id][0] = left+x+shiftx-boundshiftx
                    place.carco.game.fixcoordinate[item.carco.id][1] = top+y+shifty-boundshifty
                };
            };
            item.carco.game.fixcoordiscale = scale;
        };
    },
    getScale: function(item) {
        if (!item.carco.scale) item.carco.scale = {};
        if (!item.carco.scale.x) item.carco.scale.x = 1;
        if (!item.carco.scale.y) item.carco.scale.y = 1;
        if (!item.carco.scale.type) item.carco.scale.type = false;

        if (!item.carco.scale.item){
            var parent = item.carco.parent;
        }else{
            var parent = item.carco.scale.item;
        };

        if (item.carco.scale.type == false){
            item.carco.scale.x = parent.carco.scale.x;
            item.carco.scale.y = parent.carco.scale.y;
        };

        if (item.carco.scale.type == "fitinternal"){
            item.carco.scale.x = parent.carco.size.width * parent.carco.scale.x / item.carco.size.width;
            item.carco.scale.y = parent.carco.size.height * parent.carco.scale.y / item.carco.size.height;
            if (item.carco.scale.x <= item.carco.scale.y) {
                item.carco.scale.y = item.carco.scale.x;
            } else {
                item.carco.scale.x = item.carco.scale.y;
            };
        };

        if (item.carco.scale.type == "fitexternal"){
            item.carco.scale.x = parent.carco.size.width * parent.carco.scale.x / item.carco.size.width;
            item.carco.scale.y = parent.carco.size.height * parent.carco.scale.y / item.carco.size.height;
            if (item.carco.scale.x >= item.carco.scale.y) {
                item.carco.scale.y = item.carco.scale.x;
            } else {
                item.carco.scale.x = item.carco.scale.y;
            };

        };

        if (item.carco.scale.type == "parent"){
            item.carco.scale.x = parent.carco.size.width * parent.carco.scale.x / item.carco.size.width;
            item.carco.scale.y = parent.carco.size.height * parent.carco.scale.y / item.carco.size.height;
        };

    },
    getRootScale: function(item) {
        if (!item.carco.root) item.carco.root = item;
        var root = item.carco.root
        if (item.carco.type == "tools") root = item.carco.parent.carco.root
        if (!root.startsize) root.startsize = {};
        if (!root.startsize.width) root.startsize.width = root.offsetWidth;
        if (!root.startsize.height) root.startsize.height = root.offsetHeight;
        root.carco.scale.X = root.offsetWidth / root.startsize.width
        root.carco.scale.Y = root.offsetHeight / root.startsize.height
        return [root.carco.scale.X, root.carco.scale.Y]
    },
    resizeChild: function(item, child, type){
        if (item.carco[child]){
            for (var x in item.carco[child]){
                if (item.carco[child][x]&&item.carco[child][x].carco&&item.carco[child][x].carco.resize){
                    item.carco[child][x].carco.resize(type);
                };
            };
        };
    },
    setSize: function(item, params) {
        if (!item.carco) item.carco = {};
        if (!item.carco.size) item.carco.size = {};
        for (var x in params){
            item.carco.size[x] = params[x];
        };
        if (!item.carco.resize) this.getSize(item);
    },
    offsetWidth: function(item){
        return item.offsetWidth
    },
    offsetHeight: function(item){
        return item.offsetHeight
    },
    clientWidth: function(item){
        return item.clientWidth
    },
    clientHeight: function(item){
        return item.clientHeight
    }
};

carco.functions.style = {
    getComputedStyle: function(item) {
        if (window.getComputedStyle!==undefined){
            return window.getComputedStyle(item);
        }else{
            return item.currentStyle;
        };
    },
    setStyle: function(item, params, save) {

        if (params == "reset") var params = item.carco.originalstyle;
        if (!item.carco) item.carco = {};
        if (params){
            if (!item.carco.style) item.carco.style = {};
            for (var x in params){
                if (params[x] == "reset") params[x] = item.carco.originalstyle[x];
                item.carco.style[x] = params[x];
            };
        };
        if (item.carco.style){
            for (var x in item.carco.style){
                if (item.carco.style[x] == "initial"&&x=="visibility") item.carco.style[x] = "visible"
                if (x !== "fontSize"&&x !== "boxShadow"&&item.style[x] !== item.carco.style[x]) {
                    if (x == "visibility"&&item.carco.customparams.mathjax == true&&!item.carco.mathjaxgenerated){

                    }else {
                        item.style[x] = item.carco.style[x];
                    };
                };

                if (x == "visibility"&&!item.carco.customparams.selectbox){
                    for (var t in item.carco.children){
                        if (!item.carco.children[t].carco.customparams.checkitem&&item.carco.children[t].carco.name !== "cover container"&&item.carco.children[t].carco.name !== "activeitem"||
                            !item.carco.children[t].carco.customparams.checkitem&&item.carco.children[t].carco.customparams.gametype=="solutionitem"&&item.carco.children[t].carco.name == "cover container") {
                            var visibilitygo = false;
                            for (var xa in item.carco.children[t].carco.recursivechildren){
                                if (item.carco.children[t].carco.recursivechildren[xa].style.visibility !== item.style[x]) {
                                    visibilitygo = true;
                                };
                            };
                            if (item.carco.children[t].style.visibility !== item.style[x]||visibilitygo) {
                                item.carco.children[t].carco.setStyle({visibility: item.style[x]}, save)
                            };
                        };
                        if (item.carco.customparams.solitem||item.carco.customparams.sollayer == true){
                            for (var r in item.carco.recursivetools){
                                item.carco.recursivetools[r].carco.setStyle({visibility:item.style[x]})
                            };
                        };
                    };
                };

                if (x == "fontSize"){
                    var scale = item.carco.root.carco.scale.X * item.carco.parent.carco.scale.x * 0.95
                    if (item.carco.style.fontSize == "px"||item.carco.style.fontSize == "0px") {
                        if (item.carco.customparams.mathjaxsize){
                            var px = "px";
                            if (item.carco.customparams.mathjaxsize.slice(0-2) == "px") px = ""
                            item.carco.style.fontSize = item.carco.customparams.mathjaxsize + px;
                        }else{
                            item.carco.style.fontSize = 80+"px";
                        };
                    };
                    if (!item.carco.style.fontSize) item.carco.style.fontSize = "10px";
                    if (item.style.fontSize !== Math.floor(Math.round((Number(item.carco.style.fontSize.slice(0,-2))*(scale))*100)/100)+"px") {
                        item.style.fontSize = Math.floor(Math.round((Number(item.carco.style.fontSize.slice(0, -2)) * (scale)) * 100) / 100) + "px";
                    };
                    var MathJaxs = item.getElementsByClassName("MathJax_Display");
                    for (var i = 0; i < MathJaxs.length; i++) {
                        if (item.carco.customparams.mathjaxsize){
                            var size = Math.floor(Math.round((Number(item.carco.customparams.mathjaxsize.slice(0,-2))*(scale))*100)/100)+"px";
                            var style = "display:inline !important; font-size:"+size
                            MathJaxs[i].setAttribute('style', style);
                        };
                    };
                };
                if (x == "verticalAlign"&&item.carco.style[x]=="middle"||x == "verticalAlign"&&item.carco.style[x]=="bottom"){
                    if (item.style.position !== "relative") item.style.position = "relative";
                    if (item.style.top !== "initial") item.style.top = "initial";
                    if (item.style.height !== "auto") item.style.height = "auto";
                    if (item.style.display !== "table-cell") item.style.display = "table-cell";
                    if (item.style.paddingTop !== 5 * item.carco.parent.carco.scale.x + "px") item.style.paddingTop = 5 * item.carco.parent.carco.scale.x + "px";
                    if (item.carco.parent.style.display !== "table") item.carco.parent.style.display = "table";
                };
                if (x == "fontFamily"&&item.carco.style[x] == "MathJax"){
                    item.carco.style[x] == "Arial, Helvetica, sans-serif";
                    if (item.style[x] !== "Arial, Helvetica, sans-serif") item.style[x] = "Arial, Helvetica, sans-serif";
                }
                if (x == "boxShadow"){
                    var scale = item.carco.root.carco.scale.X * item.carco.parent.carco.scale.x * 0.95
                    if (item.carco.style[x]&&item.carco.style[x] !== "none") {
                        var bSarray = [];
                        if (item.carco.style[x].split) var bSarray = item.carco.style[x].split(" ");
                        var boxShadow = ""
                        var color = item.carco.customparams.boxShadowColor;
                        if (!color) color = "#000000";
                        for (var i = 0; i < bSarray.length; i++) {
                            if (!isNaN(Number(bSarray[i]))) {
                                boxShadow = boxShadow + Math.floor(Math.round((Number(bSarray[i]) * (scale)) * 100) / 100) + "px ";
                            };
                        };
                        if (boxShadow) boxShadow = color + " " + boxShadow;
                    }else{
                        var boxShadow = null;
                    };
                    if (item.style["box-shadow"] !== boxShadow&&boxShadow!==undefined) {
                        item.style["box-shadow"] = boxShadow;
                        item.style["-webkit-box-shadow"] = boxShadow;
                        item.style["-moz-box-shadow"] = boxShadow;
                        item.carco.appliedBoxShadow = boxShadow;
                    };
                }
            };
        };
        item.carco.loadCustomCss(false, save)
        if (save == true) {
            item.carco.originalstyle = carco.functions.object.clone(item.carco.style);
        };
    },
    delCustomCss: function(item){
        if (item.carco.customparams&&item.carco.customparams.customcss){
            var customcss = item.carco.customparams.customcss.replace(/\n/g, ";");
            customcss = customcss.replace(/  /gi, " ");
            customcss = customcss.replace(/  /gi, " ");
            customcss = customcss.replace(/;;/g, ";");
            if (customcss.slice(-1)==";") customcss = customcss.slice(0,-1);
            var params = customcss.split(";")
            var paramsobj = {};
            var setstyle = false;
            for (var i = 0; i < params.length; i++) {
                var paramssplit = params[i].split(":")
                if (paramssplit[0]&&paramssplit[1]){
                    if (paramssplit[1].slice(0,1)==" ") paramssplit[1] = paramssplit[1].slice(1);
                    if (paramssplit[1].slice(-1)==" ") paramssplit[1] = paramssplit[1].slice(0,-1);
                    if (paramssplit[0].slice(0,1)==" ") paramssplit[0] = paramssplit[0].slice(1);
                    if (paramssplit[0].slice(-1)==" ") paramssplit[0] = paramssplit[0].slice(0,-1);
                    paramsobj[paramssplit[0]] = paramssplit[1]
                    var setstyle = true
                };
            };

            if (setstyle == true){
                for (var x in paramsobj){
                    var param = carco.functions.string.toCamelCase(x);
                    item.style[param] = null;
                    if (carco.functions.browser.IE() > 8) item.style[x] = "";
                };
            };
            item.carco.appliedcss = ""
        };
    },
    loadCustomCss: function(item, value, save) {
        if (save&&item.carco.root.carco.paramsdata&&item.carco.root.carco.paramsdata.system.usertype == "editor"){
            this.delCustomCss(item);
        };

        if (!item.carco.originalcustomparams) item.carco.originalcustomparams = {};
        if (!item.carco.customparams) item.carco.customparams = {};
        if (!item.carco.originalcustomparams.customcss) item.carco.originalcustomparams.customcss = item.carco.originalcustomparams.customcss;

        if (value&&value!==false&&value!=="reset"||value==""&&value!==false) {
            if (typeof value == 'object'&&value.add) value = item.carco.customparams.customcss +"; "+ value.add;
            item.carco.customparams.customcss = value;
        };

        if (value == "reset") item.carco.customparams.customcss = item.carco.originalcustomparams.customcss;
        if (!item.carco.appliedscale) item.carco.appliedscale = item.carco.scale.x * item.carco.scale.y * item.carco.root.carco.scale.X * item.carco.root.carco.scale.Y
        if (item.carco.appliedcss !== item.carco.customparams.customcss||item.carco.appliedscale !== item.carco.scale.x * item.carco.scale.y * item.carco.root.carco.scale.X * item.carco.root.carco.scale.Y||save&&item.carco.root.carco.paramsdata&&item.carco.root.carco.paramsdata.system.usertype == "editor"){

            if (item.carco.customparams&&item.carco.customparams.customcss){
                var customcss = item.carco.customparams.customcss.replace(/\n/g, ";");
                customcss = customcss.replace(/  /gi, " ");
                customcss = customcss.replace(/  /gi, " ");
                customcss = customcss.replace(/;;/g, ";");
                if (customcss.slice(-1)==";") customcss = customcss.slice(0,-1);
                var params = customcss.split(";")
                var paramsobj = {};
                var setstyle = false;
                for (var i = 0; i < params.length; i++) {
                    var paramssplit = params[i].split(":")
                    if (paramssplit[0]&&paramssplit[1]){
                        if (paramssplit[1].slice(0,1)==" ") paramssplit[1] = paramssplit[1].slice(1);
                        if (paramssplit[1].slice(-1)==" ") paramssplit[1] = paramssplit[1].slice(0,-1);
                        if (paramssplit[0].slice(0,1)==" ") paramssplit[0] = paramssplit[0].slice(1);
                        if (paramssplit[0].slice(-1)==" ") paramssplit[0] = paramssplit[0].slice(0,-1);
                        paramsobj[paramssplit[0]] = paramssplit[1]
                        var setstyle = true
                    };
                };

                if (setstyle == true){
                    var scale = item.carco.root.carco.scale.X * item.carco.parent.carco.scale.x
                    for (var x in paramsobj){
                        var param = carco.functions.string.toCamelCase(x);
                        if (carco.functions.browser.IE() == 10&&carco.functions.isMobile.any()&&x == "transition"||
                            carco.functions.browser.IE() == 10&&carco.functions.isMobile.any()&&x == "-webkit-transition"||
                            carco.functions.browser.IE() == 10&&carco.functions.isMobile.any()&&x == "-moz-transition"||
                            carco.functions.browser.IE() == 10&&carco.functions.isMobile.any()&&x == "-o-transition"||
                            carco.functions.browser.IE() == 11&&carco.functions.isMobile.IeMobile()&&x == "transition"||
                            carco.functions.browser.IE() == 11&&carco.functions.isMobile.IeMobile()&&x == "-moz-transition"||
                            carco.functions.browser.IE() == 11&&carco.functions.isMobile.IeMobile()&&x == "-o-transition"||
                            carco.functions.browser.IE() == 11&&carco.functions.isMobile.IeMobile()&&x == "-moz-transition"){
                        }else{
                            if (x !== "-webkit-border-radius"&&x !== "-moz-border-radius"&&x !== "border-radius"&&x !== "border-width"&& x!=="font-size"&&x!=="padding") {
                                if (x == "-moz-box-shadow"&&item.carco.style.boxShadow||x=="-webkit-box-shadow"&&item.carco.style.boxShadow||x == "box-shadow"&&item.carco.style.boxShadow){
                                    if (item.style[param] !== item.carco.appliedBoxShadow) item.style[param] = item.carco.appliedBoxShadow
                                }else{
                                    if (item.style[param] !== paramsobj[x]) item.style[param] = paramsobj[x];
                                };
                            };
                        };
                        if (x == "-webkit-border-radius"||x == "-moz-border-radius"||x == "border-radius"||x=="border-width"||x=="font-size"||x=="padding"){
                            if (item.style[param] !== Math.round((Number(paramsobj[x].slice(0,-2))*(scale))*1000)/1000+"px") item.style[param] = Math.round((Number(paramsobj[x].slice(0,-2))*(scale))*1000)/1000+"px";
                        };
                    };
                };
            };
            item.carco.appliedcss = item.carco.customparams.customcss;
            item.carco.appliedscale = item.carco.scale.x * item.carco.scale.y * item.carco.root.carco.scale.X * item.carco.root.carco.scale.Y
        };

        if (save == true||save == "save") {
            item.carco.originalcustomparams.customcss = item.carco.customparams.customcss;
        };
    },
    fonts: {
        "Arial": "Arial, Helvetica, sans-serif",
        "Arial Black": '"Arial Black", Gadget, sans-serif',
        "Comic Sans": '"Comic Sans MS", cursive, sans-serif',
        "Impact": "Impact, Charcoal, sans-serif",
        "Lucida Sans": '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
        "Tahoma": "Tahoma, Geneva, sans-serif",
        "Trebuchet": '"Trebuchet MS", Helvetica, sans-serif',
        "Times New Roman": '"Times New Roman", Times, serif',
        "Verdana": "Verdana, Geneva, sans-serif"
    }
};

carco.functions.image = {
    removeDoubleSlash: function(bg) {
        if (bg && bg.split) {
            var bgaa = bg.split("http://");
            var gostring = bgaa[0];
            if (bgaa[1]) var gostring = bgaa[1];
            if (bgaa && gostring && gostring.split && gostring.split("//")) {
                var bga = gostring.split("//");
                var bg = "";
                if (bga.length > 1) {
                    for (var a = 0; a < bga.length; a++) {
                        if (a == 0){
                            bg = bga[a];
                        }else{
                            bg = bg + "/" + bga[a];
                        };
                    };
                }else{
                    bg = bga[0];
                };
                if (bgaa[1]) {
                    bg = "http://"+bg;
                };
            };
        };
        return bg;
    },
    loadImage: function(item, nameo, resize, type){
        var name = false;
        if (nameo&&nameo.fullname) {
            name = nameo.fullname;
        }else{
            name = nameo
        };
        if (name){
            var root = item.carco.root;
            if (!item.carco.customparams) item.carco.customparams = {};
            if (nameo&&nameo.md5name){
                if (!item.carco.customparams.image) item.carco.customparams.image = {};
                item.carco.customparams.image.newname = nameo.md5name;
            };
            if (name){
                if (!item.carco.customparams.image) item.carco.customparams.image = {};
                item.carco.customparams.image.name = name;
            };
            if (item.carco.customparams&&item.carco.customparams.image&&item.carco.customparams.image.newname){
                item.carco.customparams.image.src = root.carco.urls.root + root.carco.urls.imagesfolder + item.carco.customparams.image.newname;
                if (root.carco.paramsdata.user.enablehalfimages && root.carco.urls.halfimagesfolder && !root.carco.paramsdata.system.disablehalfimages){
                    item.carco.customparams.image.src = root.carco.urls.root + root.carco.urls.halfimagesfolder + item.carco.customparams.image.newname;
                };
                if (!item.carco.tempitem||item.carco.tempitem.src==""){
                    item.carco.tempitem = new Image();
                    item.carco.tempitem.src = item.carco.customparams.image.src;
                    item.carco.customparams.image.src = carco.functions.image.removeDoubleSlash(item.carco.customparams.image.src);
                    item.carco.tempitem.onerror = function() {
                        item.carco.customparams.image.newname = false;
                        item.carco.originalcustomparams.image.newname = false;
                        item.carco.tempitem.src = ""
                        carco.functions.image.loadImage(item, name, resize, type);
                    };
                    var onload = true;
                };
                function load(){
                    if (item.carco.tempitem){
                        if (item.carco.customparams&&item.carco.customparams.image&&item.carco.customparams.image.src){
                            item.carco.customparams.image.src = carco.functions.image.removeDoubleSlash(item.carco.customparams.image.src);
                            if (resize == true){
                                item.carco.setSize({width:item.carco.tempitem.width, height:item.carco.tempitem.height});
                                item.carco.parent.carco.setSize({width:item.carco.tempitem.width, height:item.carco.tempitem.height});
                                item.carco.parent.carco.resize("save");
                            };
                            if (resize == "onlyimage"){
                                item.carco.setSize({width:item.carco.tempitem.width, height:item.carco.tempitem.height});
                                item.carco.parent.carco.resize("save");
                            };
                            if (item.carco.customparams.imagerendertype){
                                if (carco.functions.game.searchActions(item, "imagerendertype")) {
                                    var customtype = carco.functions.game.searchActions(item, "imagerendertype")(item);
                                    if (customtype !== "svg"&&customtype !== "canvas") customtype = false;
                                };
                            };

                            if (customtype){
                                if (customtype == "svg"){
                                    carco.functions.image.imageTag(item);
                                };
                                if (customtype == "canvas"){
                                    carco.functions.canvas.stage(item);
                                };
                            }else{
                                if (item.carco.root.carco.colorisetype == "svg"&&item.carco.parent.carco.customparams.gametype !== "coordinate"){
                                    carco.functions.image.imageTag(item)
                                }else{
                                    carco.functions.canvas.stage(item)
                                };
                            };
                        };
                    }
                };
                if (onload){
                    item.carco.tempitem.onload = function() {load();}
                }else{
                    load();
                };
            }else{
                if (!item.carco.customparams.checkitem) {
                    if (!item.carco.customparams.image) item.carco.customparams.image = {};
                    item.carco.customparams.image.name = name;
                    item.carco.customparams.image.src = root.carco.urls.root + root.carco.urls.tracksfolder + root.carco.paramsdata.system.currenttrack + "/images/" + item.carco.customparams.image.name;
                    item.carco.customparams.image.src = carco.functions.image.removeDoubleSlash(item.carco.customparams.image.src);
                }else{
                    if (!item.carco.customparams.image) item.carco.customparams.image = {};
                    item.carco.customparams.image.name = name;
                    if (item.carco.customparams.image.name == "fault.png"||item.carco.customparams.image.name == "good.png"){
                        item.carco.customparams.image.src = item.carco.parent.carco.parent.carco.root.carco.urls.lib + "default_images/" + item.carco.customparams.image.name;
                        item.carco.customparams.image.src = carco.functions.image.removeDoubleSlash(item.carco.customparams.image.src);
                    }else{
                        item.carco.customparams.image.src = root.carco.urls.root + root.carco.urls.tracksfolder + root.carco.paramsdata.system.currenttrack + "/images/" + item.carco.customparams.image.name;
                        item.carco.customparams.image.src = carco.functions.image.removeDoubleSlash(item.carco.customparams.image.src);
                    }
                    if (item.style.zIndex !== "5000002") item.style.zIndex = "5000002";
                };

                if (item.carco.customparams&&item.carco.customparams.image&&item.carco.customparams.image.src){
                    item.carco.tempitem = new Image();
                    item.carco.tempitem.src = item.carco.customparams.image.src;
                    item.carco.tempitem.onload = function() {
                        if (resize == true){
                            item.carco.setSize({width:item.carco.tempitem.width, height:item.carco.tempitem.height});
                            item.carco.parent.carco.setSize({width:item.carco.tempitem.width, height:item.carco.tempitem.height});
                            item.carco.parent.carco.resize("save");
                        };
                        if (resize == "onlyimage"){
                            item.carco.setSize({width:item.carco.tempitem.width, height:item.carco.tempitem.height});
                            item.carco.parent.carco.resize("save");
                        };
                        if (item.carco.root.carco.colorisetype == "svg"&&item.carco.parent.carco.customparams.gametype !== "coordinate"){
                            carco.functions.image.imageTag(item)
                        }else{
                            carco.functions.canvas.stage(item)
                        };

                    };
                };
            }
        };
        if (type == "save"){
            if (!item.carco.originalcustomparams) item.carco.originalcustomparams = {};
            item.carco.originalcustomparams.image = carco.functions.object.clone(item.carco.customparams.image)
        }
    },
    imageTag: function(item){
        var string = 'url("'+item.carco.tempitem.src+'") no-repeat'

        item.style.background = string;
        item.style.backgroundSize = "100% 100%";
        item.style.backgroundPosition = "center";

        item.carco.svgresize = function() {
            if (item.carco.svgdef&&!item.carco.pulseimage) {
                item.carco.svgdef.setAttribute('height', item.style.height);
                item.carco.svgdef.setAttribute('width', item.style.width);
                item.carco.svgdef.style.top = item.style.top
                item.carco.svgdef.style.left = item.style.left
            };
        };

        item.carco.colorise = function(params, type) {
            carco.functions.image.colorise(item, params, type)
        };
        item.carco.startColorise = function(){
            carco.functions.canvas.startColorise(false, item)
        };
        item.carco.startColorise();
    },
    colorise: function(item, params, type){

        var canvas = item;
        if (!canvas.carco.customparams) canvas.carco.customparams = {};
        if (!canvas.carco.originalcustomparams) canvas.carco.originalcustomparams = {};
        if (!canvas.carco.customparams.filters) canvas.carco.customparams.filters = {};
        if (!canvas.carco.filters) canvas.carco.filters = [];

        var filterparams = canvas.carco.customparams.filters;
        if (!filterparams.brightness) filterparams.brightness = 0;
        if (!filterparams.contrast) filterparams.contrast = 0;
        if (!filterparams.saturation) filterparams.saturation = 0;
        if (!filterparams.hue) filterparams.hue = 0;
        if (!filterparams.blurx) filterparams.blurx = 0;
        if (!filterparams.blury) filterparams.blury = 0;
        if (!filterparams.red) filterparams.red = 255;
        if (!filterparams.green) filterparams.green = 255;
        if (!filterparams.blue) filterparams.blue = 255;
        if (!filterparams.colorise) filterparams.colorise = false;
        if (!filterparams.colorisealpha) filterparams.colorisealpha = false;

        if (!canvas.carco.originalcustomparams.filters) canvas.carco.originalcustomparams.filters = carco.functions.object.clone(filterparams);

        if (params){
            for (var x in params){
                canvas.carco.customparams.filters[x] = params[x];
            };
        };

        var filterparams = canvas.carco.customparams.filters;

        var brightnessValue = filterparams.brightness;
        var contrastValue =  filterparams.contrast;
        var saturationValue =  filterparams.saturation;
        var hueValue = filterparams.hue;
        var blurXValue = filterparams.blurx;
        var blurYValue = filterparams.blury;
        var redChannelValue = filterparams.red;
        var greenChannelValue = filterparams.green;
        var blueChannelValue = filterparams.blue;
        var colorise = filterparams.colorise;
        var colorisealpha = filterparams.colorisealpha;

        canvas.carco.filters = [];
        var filters = canvas.carco.filters;

        if (brightnessValue<0){
            var AlphaBrightnessValue = (brightnessValue/-100);
            colorisealpha = AlphaBrightnessValue;
            colorise = "#000000";
        };

        if (brightnessValue>0){
            var AlphaBrightnessValue = (brightnessValue/100);
            colorisealpha = AlphaBrightnessValue;
            colorise = "#FFFFFF";
        };

        if (colorise||hueValue||saturationValue||contrastValue||redChannelValue||greenChannelValue||blueChannelValue||blurYValue||blurXValue){

            if (colorise){
                var color = colorise;
                var hextorgb = carco.functions.color.hexToRgb
                var red = hextorgb(color).r;
                var green = hextorgb(color).g;
                var blue = hextorgb(color).b;
            };

            if (colorisealpha == false) colorisealpha = 1;

            if (!item.carco.svgdef){

                var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
                svg.style.position = "absolute"
                svg.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
                svg.setAttribute('height',item.style.height);
                svg.setAttribute('width',item.style.width);
                var stylestring = "top:"+item.style.top+";left:"+item.style.left+";";
                svg.setAttribute('style',stylestring);

                canvas.carco.resize();

                svg.setAttribute('version','1.1');
                if (item.carco.parent.style.display == "table") {
                    var tempdisplay = "table";
                    item.carco.parent.style.display = "block";
                };

                var viewBoxWidth = item.offsetWidth;
                var scale = viewBoxWidth/item.carco.size.width;
                var viewBoxHeight = item.carco.size.height*scale;
                var viewBoxHeight = item.offsetHeight;

                var viewBoxString = "0,0,"+viewBoxWidth+","+viewBoxHeight;
                svg.setAttribute('viewBox', viewBoxString);
                svg.setAttribute('preserveAspectRatio','none');
                svg.setAttribute('id', 'svgitem_'+item.carco.id);

                var svgimg = document.createElementNS('http://www.w3.org/2000/svg','image');
                svgimg.setAttribute('preserveAspectRatio','none');
                svgimg.setAttribute('height', viewBoxHeight);
                svgimg.setAttribute('width', viewBoxWidth);
                svgimg.setAttribute('id','svgimage_'+item.carco.id);
                svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href',item.carco.tempitem.src);
                svgimg.setAttribute('x','0');
                svgimg.setAttribute('y','0');

                svg.appendChild(svgimg);
                item.carco.svgdef = svg;
                item.carco.svgimg = svgimg;
                item.carco.parent.insertBefore(item.carco.svgdef, item.nextSibling);
                item.carco.svgdef.style.position = "absolute"

                var filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
                filter.setAttribute( 'id', 'svgfilter_'+item.carco.id );

                //alphamaskfilter
                var colorMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
                filter.appendChild(colorMatrix);
                item.carco.svgcolormatrix = colorMatrix;
                item.carco.svgcolormatrix.setAttribute( "type", "matrix" );
                item.carco.svgcolormatrix.setAttribute( "values", 5+" 5 5 0 0 0 "+5+" 5 5 0 0 0 "+5+" 5 5 0 0 0 "+1+" 0" );
                item.carco.svgdef.appendChild(filter);

                var filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
                filter.setAttribute( 'id', 'svgfiltercolor_'+item.carco.id );

                //blur
                var colorMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
                filter.appendChild(colorMatrix);
                item.carco.svgcolormatrixblur = colorMatrix;
                item.carco.svgcolormatrixblur.setAttribute( "in", "SourceGraphic" );

                //hue
                var colorMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
                filter.appendChild(colorMatrix);
                item.carco.svgcolormatrixhue = colorMatrix;
                item.carco.svgcolormatrixhue.setAttribute( "type", "hueRotate" );
                item.carco.svgcolormatrixhue.setAttribute( "values", "0" );

                //saturate
                var colorMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
                filter.appendChild(colorMatrix);
                item.carco.svgcolormatrixsat = colorMatrix;
                item.carco.svgcolormatrixsat.setAttribute( "type", "saturate" );
                item.carco.svgcolormatrixsat.setAttribute( "values", "0" );

                //contrast
                var colorMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feComponentTransfer');
                filter.appendChild(colorMatrix);
                item.carco.svgcomptransR = document.createElementNS('http://www.w3.org/2000/svg', 'feFuncR');
                item.carco.svgcomptransG = document.createElementNS('http://www.w3.org/2000/svg', 'feFuncG');
                item.carco.svgcomptransB = document.createElementNS('http://www.w3.org/2000/svg', 'feFuncB');
                item.carco.svgcomptransR.setAttribute( "type", "linear" );
                item.carco.svgcomptransG.setAttribute( "type", "linear" );
                item.carco.svgcomptransB.setAttribute( "type", "linear" );
                colorMatrix.appendChild(item.carco.svgcomptransR);
                colorMatrix.appendChild(item.carco.svgcomptransG);
                colorMatrix.appendChild(item.carco.svgcomptransB);

                //red,green,blue
                var colorMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
                filter.appendChild(colorMatrix);
                item.carco.svgcolormatrixrgb = colorMatrix;
                item.carco.svgcolormatrixrgb.setAttribute( "type", "matrix" );
                item.carco.svgcolormatrixrgb.setAttribute( "values", "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0" );
                item.carco.svgdef.appendChild(filter);

                item.carco.svgdef.appendChild(filter);

                //mask
                var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                var mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
                mask.setAttribute('id','svgmask_'+item.carco.id);
                var maskimage = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                maskimage.setAttribute('preserveAspectRatio','none');
                if (item.carco.duplicatedonce) {
                    maskimage.setAttribute('height', viewBoxHeight);
                    maskimage.setAttribute('width', viewBoxWidth);
                }else{
                    var pluswidth = 1;
                    if (item.carco.customparams.svgcolorisemaskwidth||item.carco.customparams.svgcolorisemaskwidth == 0) var pluswidth = item.carco.customparams.svgcolorisemaskwidth;
                    var plusheight = 1;
                    if (item.carco.customparams.svgcolorisemaskheight||item.carco.customparams.svgcolorisemaskheight == 0) var plusheight = item.carco.customparams.svgcolorisemaskheight;
                    plusheight = Number(plusheight);
                    pluswidth = Number(pluswidth);
                    maskimage.setAttribute('height', viewBoxHeight + plusheight);
                    maskimage.setAttribute('width', viewBoxWidth + pluswidth);
                };
                maskimage.setAttribute('x', '0');
                maskimage.setAttribute('y','0');


                maskimage.setAttributeNS('http://www.w3.org/1999/xlink','href',item.carco.tempitem.src);
                item.carco.svgmaskimage = maskimage;
                mask.appendChild(maskimage);
                defs.appendChild(mask);
                item.carco.svgdef.appendChild(defs);

                //rect
                var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('height', '105%');
                rect.setAttribute('width','105%');
                rect.setAttribute('x', '-2.5%');
                rect.setAttribute('y','-2.5%');
                rect.setAttribute('style','fill:rgb(0,0,0)');
                item.carco.svgdef.appendChild(rect);
                rect.style.mask = "url(#svgmask_"+item.carco.id+")";
                item.carco.svgrect = rect;

            };

            if (tempdisplay) {
                item.carco.parent.style.display = tempdisplay;
            };

            if (hueValue||hueValue==0){
                hueValue = 210/200*(hueValue + 100)-105
                if (item.carco.svgcolormatrixhue) item.carco.svgcolormatrixhue.setAttribute( "values", hueValue );
                if (item.carco.svgimg) item.carco.svgimg.style.filter = "url(#svgfiltercolor_"+item.carco.id+")"
                if (item.carco.svgrect) item.carco.svgrect.style.fill = "rgba(0,0,0,0)";
            };

            if (saturationValue||saturationValue==0){
                if (saturationValue<14.28) {
                    saturationValue = (saturationValue/100+1)
                }else{
                    saturationValue = Math.round((saturationValue/14.28)*100)/100
                }
                if (item.carco.svgcolormatrixsat) item.carco.svgcolormatrixsat.setAttribute( "values", saturationValue );
                if (item.carco.svgimg) item.carco.svgimg.style.filter = "url(#svgfiltercolor_"+item.carco.id+")"
                if (item.carco.svgrect) item.carco.svgrect.style.fill = "rgba(0,0,0,0)";
            };

            if (contrastValue||contrastValue == 0){
                if (contrastValue<20) {
                    contrastValue = (contrastValue/100+1)
                }else{
                    contrastValue = Math.round((contrastValue/20)*100)/100
                };
                var slope = contrastValue;
                item.carco.svgcomptransR.setAttribute( "slope", slope );
                item.carco.svgcomptransG.setAttribute( "slope", slope );
                item.carco.svgcomptransB.setAttribute( "slope", slope );
                if (item.carco.svgimg) item.carco.svgimg.style.filter = "url(#svgfiltercolor_"+item.carco.id+")"
                if (item.carco.svgrect) item.carco.svgrect.style.fill = "rgba(0,0,0,0)";
            };

            if (redChannelValue||redChannelValue == 0||greenChannelValue||greenChannelValue == 0||blueChannelValue||blueChannelValue == 0){
                redChannelValue = redChannelValue/255;
                greenChannelValue = greenChannelValue/255;
                blueChannelValue = blueChannelValue/255;
                item.carco.svgcolormatrixrgb.setAttribute( "values", redChannelValue+" 0 0 0 0 0 "+greenChannelValue+" 0 0 0 0 0 "+blueChannelValue+" 0 0 0 0 0 1 0" );
                if (item.carco.svgimg) item.carco.svgimg.style.filter = "url(#svgfiltercolor_"+item.carco.id+")"
                if (item.carco.svgrect) item.carco.svgrect.style.fill = "rgba(0,0,0,0)";
            };

            if (blurYValue||blurXValue||blurYValue==0||blurXValue==0){
                var blur = 0;
                if (blurYValue>blurXValue){
                    blur = blurYValue/7;
                }else{
                    blur = blurXValue/7;
                };
                if (item.carco.svgcolormatrixblur) item.carco.svgcolormatrixblur.setAttribute( "stdDeviation", blur );
                if (item.carco.svgimg) item.carco.svgimg.style.filter = "url(#svgfiltercolor_"+item.carco.id+")"
                if (item.carco.svgrect) item.carco.svgrect.style.fill = "rgba(0,0,0,0)";
            };

            if (colorise){
                if (item.carco.svgmaskimage) item.carco.svgmaskimage.style.filter = "url(#svgfilter_"+item.carco.id+")"
                if (item.carco.svgimg&&colorisealpha == 1) {item.carco.svgimg.style.opacity = 0;}
                item.carco.svgrect.style.fill = "rgba("+red+","+green+","+blue+","+colorisealpha+")";
            }else{
                if (item.carco.svgimg) item.carco.svgimg.style.opacity = 1
            };

            item.style.background = "none";
            item.style.backgroundSize = "100% 100%";
        }else{
            if (item.carco.svgimg) item.carco.svgimg.style.filter = "none";
            if (item.carco.svgrect) item.carco.svgrect.style.fill = "rgba(0,0,0,0)";
        };
        if (type == "save"){
            if (!canvas.carco.originalcustomparams) canvas.carco.originalcustomparams = {}
            canvas.carco.originalcustomparams.filters = carco.functions.object.clone(canvas.carco.customparams.filters)
        }
    }
};

carco.functions.HTML = {
    innerHTML: function(item, value, type){
        if (value=="reset") var value = item.carco.originalcustomparams.innerHTML;
        if (value){
            var root = item.carco.root;
            if (!item.carco.customparams) item.carco.customparams = {};
            item.carco.customparams.innerHTML = value;
        };
        if (item.carco.customparams&&item.carco.customparams.innerHTML||item.carco.customparams&&item.carco.customparams.innerHTML == 0){
            if (item.carco.customparams.mathjax == true){
                item.carco.mathjaxgenerated = false;
                item.innerHTML = item.carco.customparams.innerHTML;
                item.carco.style.visibility = "hidden";
                item.style.visibility = "hidden";
                setTimeout(function() {
                    MathJax.Hub.Queue(
                        ['Typeset',MathJax.Hub, item],
                        function(){
                            var MathJaxs = item.getElementsByClassName("MathJax_Display");
                            for (var i = 0; i < MathJaxs.length; i++) {
                                if (item.carco.customparams.mathjaxsize){
                                    var scale = item.carco.root.carco.scale.X * item.carco.parent.carco.scale.x * 0.95
                                    var size = Math.floor(Math.round((Number(item.carco.customparams.mathjaxsize.slice(0,-2))*(scale))*100)/100)+"px";
                                    var style = "display:inline !important; font-size:"+size
                                    MathJaxs[i].setAttribute('style', style);
                                }else{
                                    MathJaxs[i].setAttribute('style', 'display:inline !important');
                                };
                            };
                            if (item.carco.originalstyle.visibility == "visible"&&item.carco.parent.style.visibility == "hidden"){

                            }else{
                                item.carco.style.visibility = item.carco.originalstyle.visibility;
                                item.style.visibility = item.carco.originalstyle.visibility;
                                if (carco.functions.browser.IE() > 8 && item.carco.originalstyle.visibility == "visible") item.style.visibility = "";
                            };
                            item.carco.mathjaxgenerated = true;
                        }
                    )
                }, 100)
            }else{
                if (item.carco.root.carco.paramsdata.system.usertype == "user"&&item.carco.customparams.innerHTML.replace&&carco.functions.browser.IE() == 10&&carco.functions.isMobile.any()||
                    item.carco.root.carco.paramsdata.system.usertype == "user"&&item.carco.customparams.innerHTML.replace&&carco.functions.browser.IE() == 11&&carco.functions.isMobile.IeMobile()) {
                    var replacetext = item.carco.customparams.innerHTML;
                    replacetext = replacetext.replace(/<br\s*[\/]?>/gi, "\n");
                    replacetext = replacetext.replace(/<i>/gi, "$i");
                    replacetext = replacetext.replace(/<\/i>/gi, "$t");
                    replacetext = replacetext.replace(/<br \/>/gi, "\n");
                    replacetext = replacetext.replace(/\</g, "&lt;")
                    replacetext = replacetext.replace(/\>/g, "&gt;")
                    replacetext = replacetext.replace(/\n/gi, "<br/>");
                    replacetext = replacetext.replace(/\$i/gi, "<i>");
                    replacetext = replacetext.replace(/\$t/gi, "</i>");
                    item.innerHTML = replacetext;
                }else{
                    item.innerHTML = item.carco.customparams.innerHTML;
                };
            };
        };
        if (type == "save"){
            if (!item.carco.originalcustomparams) canvas.carco.originalcustomparams = {}
            item.carco.originalcustomparams.innerHTML = item.carco.customparams.innerHTML;
        }
    }
};

carco.functions.number = {
    recursiveNumber: function(object){
        for (var x in object){
            if (!isNaN(Number(object[x])&&object[x]!==false&&object[x]!==true&&object[x]!==null&&object[x]!=="true"&&object[x]!=="false")){
                object[x] = Number(object[x]);
            };
            if (typeof object[x] === 'object') carco.functions.number.recursiveNumber(object[x]);
        };
    }
};

carco.functions.load = {
    init: function(params) {
        this.defaults(params.item);
        var item = params.item;
        item.carco.save = function(copy, callback) {
            carco.functions.load.save(params.item, params.save, copy, callback);
        };
        item.carco.load = function(type, callback) {
            carco.functions.load.load(params.item, params.load, type, callback);
        };
        item.carco.alltrack = function(callback) {
            carco.functions.load.alltrack(params.item, params.alltrack, callback);
        };
        item.carco.loadtrack = function(callback) {
            carco.functions.load.load(params.item, params.loadtrack, "server", callback);
        };
        item.carco.reloadtrack = function(callback) {
            carco.functions.load.load(params.item, params.loadtrack, "reload", callback);
        };
        item.carco.allgame = function(callback) {
            carco.functions.load.allgame(params.item, params.allgame, callback);
        };
        item.carco.saveuserstatus = function(callback, savefilename) {
            return carco.functions.load.saveuserstatus(params.item, params.saveuserstatus, callback, savefilename);
        };
        item.carco.loaduserstatus = function(callback) {
            return carco.functions.load.loaduserstatus(params.item, params.loaduserstatus, callback);
        };
        item.carco.loaduserstatusafterload = function(){
            carco.functions.load.loaduserstatusafterload(params.item);
        };
    },
    defaults: function(item){
        if (!item.carco) item.carco = {};
        if (!item.carco.paramsdata) item.carco.paramsdata = {};

        if (!item.carco.paramsdata.system) item.carco.paramsdata.system = {};
        if (!item.carco.paramsdata.system.usertype) item.carco.paramsdata.system.usertype = "user";
        if (!item.carco.paramsdata.system.userid) item.carco.paramsdata.system.userid = false;
        if (!item.carco.paramsdata.system.currentgame) item.carco.paramsdata.system.currentgame = "blank";
        if (!item.carco.paramsdata.system.currenttrack) item.carco.paramsdata.system.currenttrack = "blank";
        if (!item.carco.paramsdata.system.url) {
            item.carco.paramsdata.system.url = carco.functions.url.get();
            var url = item.carco.paramsdata.system.url.split("/")
            item.carco.paramsdata.system.url = "";
            for (var i = 0; i < url.length-1; i++) {
                item.carco.paramsdata.system.url = item.carco.paramsdata.system.url + "/" + url[i];
            };
            item.carco.paramsdata.system.url = item.carco.paramsdata.system.url.slice(1);
        };

        if (!item.carco.paramsdata.user) item.carco.paramsdata.user = {};
        if (!item.carco.paramsdata.user.currentgame) item.carco.paramsdata.user.currentgame = "blank";
        if (!item.carco.paramsdata.user.currenttrack) item.carco.paramsdata.user.currenttrack = 1;
        if (!item.carco.paramsdata.user.tracksorder) item.carco.paramsdata.user.tracksorder = "order";

        if (!item.carco.paramsdata.games) item.carco.paramsdata.games = {};
        if (!item.carco.paramsdata.tracks) item.carco.paramsdata.tracks = {};
        if (!item.carco.alltracks) item.carco.alltracks = {};
        if (!item.carco.allgames) item.carco.allgames = {};

        if (!item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame]) item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame] = {};

        var currentgame = item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame];
        if (!currentgame.editor) currentgame.editor = {};
        if (!currentgame.params) currentgame.params = {};
        if (!currentgame.params.tracks) {
            currentgame.params.tracks = new Array();
        };

        if (!item.carco.loadedparams) item.carco.loadedparams = {};
    },
    load: function(item, src, type, callback) {

        if (type == "server"){
            if (item.carco.root.carco.paramsdata.user.datatype == "local"||!src){
                item.carco.root.carco.paramsdata.user.datatype = "local"
                if (!carco.data) carco.data = {};
                if (!carco.data[item.carco.paramsdata.system.currentproject]) carco.data[item.carco.paramsdata.system.currentproject] = {};

                function addscript(file, callback) {
                    var fileref = document.createElement('script')
                    fileref.setAttribute("type","text/javascript")
                    fileref.setAttribute("src", file)
                    document.getElementsByTagName("head")[0].appendChild(fileref)
                    fileref.onload = function() {
                        if (callback) callback();
                    };
                };

                function addTrack() {
                    if (!carco.data[item.carco.paramsdata.system.currentproject][item.carco.paramsdata.system.currentgame]['tracks']) carco.data[item.carco.paramsdata.system.currentproject][item.carco.paramsdata.system.currentgame]['tracks'] = {};
                    var currentgame = carco.data[item.carco.paramsdata.system.currentproject][item.carco.paramsdata.system.currentgame].games[item.carco.paramsdata.system.currentgame];
                    var currenttrack = item.carco.paramsdata.system.currenttrack
                    if (currentgame.params.tracks[Number(item.carco.paramsdata.system.currenttrack)-1]){
                        currenttrack = currentgame.params.tracks[Number(item.carco.paramsdata.system.currenttrack)-1];
                    };
                    if (!carco.data[item.carco.paramsdata.system.currentproject][item.carco.paramsdata.system.currentgame]['tracks'][currenttrack]) {
                        var file = item.carco.urls.root + item.carco.urls.datajsfolder + currenttrack + ".js"
                        addscript(file, go)
                    }else{
                        go();
                    };
                }

                function go() {
                    item.carco.loadedparams = carco.data&&carco.data[item.carco.paramsdata.system.currentproject][item.carco.paramsdata.system.currentgame];
                    if (!item.carco.loadedparams.user) item.carco.loadedparams.user = {};
                    item.carco.loadedparams.user.feedbacktype = item.carco.config.carco.paramsdata.user.feedbacktype;
                    item.carco.load(false, callback);
                };

                if (carco.data[item.carco.paramsdata.system.currentproject][item.carco.paramsdata.system.currentgame]&&carco.data[item.carco.paramsdata.system.currentproject][item.carco.paramsdata.system.currentgame].games) {
                    addTrack();
                }else{
                    var file = item.carco.urls.root + item.carco.urls.datajsfolder + item.carco.paramsdata.system.currentgame + "_game.js"
                    addscript(file, function() {
                        if (item.carco.paramsdata.user.tracksorder == "random") {
                            if (!carco.data[item.carco.paramsdata.system.currentproject][item.carco.paramsdata.system.currentgame].games[item.carco.paramsdata.system.currentgame].params.originaltracks) carco.data[item.carco.paramsdata.system.currentproject][item.carco.paramsdata.system.currentgame].games[item.carco.paramsdata.system.currentgame].params.originaltracks = carco.functions.object.clone(carco.data[item.carco.paramsdata.system.currentproject][item.carco.paramsdata.system.currentgame].games[item.carco.paramsdata.system.currentgame].params.tracks)
                            carco.data[item.carco.paramsdata.system.currentproject][item.carco.paramsdata.system.currentgame].games[item.carco.paramsdata.system.currentgame].params.shuffledtracks = carco.functions.array.shuffle(carco.data[item.carco.paramsdata.system.currentproject][item.carco.paramsdata.system.currentgame].games[item.carco.paramsdata.system.currentgame].params.tracks);
                        };
                        addTrack();
                    })
                };

            }else{
                carco.functions.json.send({url:src, input:item.carco.paramsdata, output:item.carco.loadedparams, callback:function(){item.carco.load(false, callback);}})
            };
        }else{
            var go = true;
            if (item.carco.root.carco.paramsdata.user.datatype == "local") {
                if (carco.data[item.carco.paramsdata.system.currentproject][item.carco.paramsdata.system.currentgame]&&carco.data[item.carco.paramsdata.system.currentproject][item.carco.paramsdata.system.currentgame].games) {
                    if (!carco.data[item.carco.paramsdata.system.currentproject][item.carco.paramsdata.system.currentgame]['tracks']) carco.data[item.carco.paramsdata.system.currentproject][item.carco.paramsdata.system.currentgame]['tracks'] = {};
                    var currentgame = carco.data[item.carco.paramsdata.system.currentproject][item.carco.paramsdata.system.currentgame].games[item.carco.paramsdata.system.currentgame];
                    var currenttrack = item.carco.paramsdata.system.currenttrack
                    if (currentgame.params.tracks[Number(item.carco.paramsdata.system.currenttrack)-1]){
                        currenttrack = currentgame.params.tracks[Number(item.carco.paramsdata.system.currenttrack)-1];
                    };
                    if (!carco.data[item.carco.paramsdata.system.currentproject][item.carco.paramsdata.system.currentgame]['tracks'][currenttrack]) {
                        go = false;
                    };
                }else{
                    go = false
                };
            };
            if (go){
                item.carco.paramsdata.tracks = carco.functions.object.clone(item.carco.loadedparams.tracks);
                item.carco.sollayer = undefined;
                item.carco.loadedparams.games[item.carco.paramsdata.system.currentgame].params.info = item.carco.loadedparams.info_object;
                item.carco.loadedparams.games[item.carco.paramsdata.system.currentgame].params.language = item.carco.loadedparams.language.texts;
                if (!item.carco.language) item.carco.language = {};
                item.carco.language.inner = item.carco.loadedparams.language.texts;

                for (var x in item.carco.loadedparams.games){
                    item.carco.paramsdata.games[x] = item.carco.loadedparams.games[x];
                };
                if (item.carco.root.carco.paramsdata.user.datatype == "local"&&carco.data&&carco.data[item.carco.paramsdata.system.currentproject][item.carco.paramsdata.system.currentgame]){}else{
                    for (var x in item.carco.loadedparams.system){
                        item.carco.paramsdata.system[x] = item.carco.loadedparams.system[x];
                    };
                    for (var x in item.carco.loadedparams.user){
                        item.carco.paramsdata.user[x] = item.carco.loadedparams.user[x];
                    };
                };
                if (callback) callback();
            }else{
                this.load(item, src, "server", callback);
            };
        }
    },
    save: function(item, src, copy, callback) {
        item.carco.root.carco.loadedalltrack = false;
        carco.functions.load.defaults(item);
        item.carco.customparams.feedbackon = false;
        item.carco.originalcustomparams.feedbackon = false;
        carco.functions.feedback.types[item.carco.root.carco.paramsdata.user.feedbacktype](item)
        item.carco.reloadLayers();
        item.carco.motionallreset();

        if (!item.carco.language) item.carco.language = {};
        if (!item.carco.language.inner) item.carco.language.inner = [];

        if (!item.carco.paramsdata.tracks[item.carco.paramsdata.system.currenttrack]) item.carco.paramsdata.tracks[item.carco.paramsdata.system.currenttrack] = {}
        var currenttrack = item.carco.paramsdata.tracks[item.carco.paramsdata.system.currenttrack];
        currenttrack.editor = {};
        currenttrack.params = {};

        for (var x in item.carco.recursivechildren){
            currenttrack.params[x] = {};
            var childrenparams = currenttrack.params[x];

            if (!childrenparams.size) childrenparams.size = {};
            if (!childrenparams.position) childrenparams.position = {};
            if (!childrenparams.position.relative) childrenparams.position.relative = {};
            if (!childrenparams.position.type) childrenparams.position.type = {};
            if (!childrenparams.scale) childrenparams.scale = {};
            if (!childrenparams.scale.type) childrenparams.scale.type = {};
            if (!childrenparams.style) childrenparams.style = {};
            if (!childrenparams.customparams) childrenparams.customparams = {};

            childrenparams.parent = item.carco.recursivechildren[x].carco.parent.carco.id;
            childrenparams.itemtype = item.carco.recursivechildren[x].carco.itemtype;
            childrenparams.type = item.carco.recursivechildren[x].carco.type;
            childrenparams.name = item.carco.recursivechildren[x].carco.name;
            childrenparams.layer = item.carco.recursivechildren[x].carco.layer;
            childrenparams.addtools = item.carco.recursivechildren[x].carco.addtools;
            childrenparams.customparams = item.carco.recursivechildren[x].carco.originalcustomparams;
            childrenparams.size.width = item.carco.recursivechildren[x].carco.originalsize.width;
            childrenparams.size.height = item.carco.recursivechildren[x].carco.originalsize.height;
            childrenparams.position.relative.x = item.carco.recursivechildren[x].carco.originalposition.relative.x;
            childrenparams.position.relative.y = item.carco.recursivechildren[x].carco.originalposition.relative.y;
            childrenparams.position.type.y = item.carco.recursivechildren[x].carco.originalposition.type.y;
            childrenparams.position.type.x = item.carco.recursivechildren[x].carco.originalposition.type.x;
            childrenparams.position.type.boundingy = item.carco.recursivechildren[x].carco.originalposition.type.boundingy;
            childrenparams.position.type.boundingx = item.carco.recursivechildren[x].carco.originalposition.type.boundingx;
            childrenparams.scale.type = item.carco.recursivechildren[x].carco.originalscale.type;
            childrenparams.style = item.carco.recursivechildren[x].carco.originalstyle;
        };

        carco.functions.game.generateLangXML(item);
        item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.language = item.carco.language.inner;

        if (src){
            if (copy) src = src+"&copy="+copy;
            carco.functions.json.send({url:src, input:item.carco.paramsdata, output:item.carco.paramsdata, callback:function(){
                if (callback) callback()
                carco.functions.console("save ready");
            }})
        };
    },
    saveuserstatus: function(item, src, callback, savefilename){

        var types = carco.functions.object.types;

        function htmlToID(save){
            save.runnedSaveRecursiveFunction = true;
            for (var x in save){
                var itemtype = types(save[x]);
                if (itemtype == "html") {
                    if (save[x].carco) {
                        save[x] = "HTML_"+save[x].carco.id;
                    }else{
                        delete save[x]
                    };
                };
                var itemtype = types(save[x]);
                if (itemtype == "object"||itemtype == "array"){
                    if (!save[x].runnedSaveRecursiveFunction&&x !== "a"&& x!=="stage" && x!== "coordinate") htmlToID(save[x]);
                };
                if (itemtype == "function"){
                    save[x] = undefined;
                    delete save[x];
                };
                if (x == "appliedscale"||x=="coordinate"||x=="stage"||itemtype == "audio"){
                    delete save[x];
                };
            };
            return save;
        };

        function htmlToIDclear(save){
            delete save.runnedSaveRecursiveFunction
            for (var x in save) {
                var itemtype = types(save[x]);
                if (itemtype == "object" || itemtype == "array") {
                    if (save[x].runnedSaveRecursiveFunction) htmlToIDclear(save[x]);
                };
            };
        };

        var save = {};
        save[item.carco.id] = htmlToID(carco.functions.object.clone(item.carco));
        delete save[item.carco.id].paramsdata.tracks
        delete save[item.carco.id].config.carco.paramsdata
        delete save[item.carco.id].config.carco.size
        delete save[item.carco.id].config.carco.scale
        delete save[item.carco.id].config.carco.playeritems
        delete save[item.carco.id].config.carco.customparams
        delete save[item.carco.id].config.carco.language
        delete save[item.carco.id].config.carco.layers
        delete save[item.carco.id].config.carco.urls
        delete save[item.carco.id].loadedparams.tracks
        delete save[item.carco.id].size
        delete save[item.carco.id].scale
        delete save[item.carco.id].parent
        delete save[item.carco.id].addMouseUpListenerToDocument
        delete save[item.carco.id].activeplaces
        delete save[item.carco.id].playeritems
        delete save[item.carco.id].solitems
        delete save[item.carco.id].wassaveduserdata
        delete save[item.carco.id].paramsdata.system.currentproject
        delete save[item.carco.id].paramsdata.system.urls

        for (var x in item.carco.recursivechildren){
            if (item.carco.recursivechildren[x].carco.game&&item.carco.recursivechildren[x].carco.game.values){
                item.carco.recursivechildren[x].carco.game.valuessave = {};
                if (item.carco.recursivechildren[x].carco.game.values.allitems&&item.carco.recursivechildren[x].carco.game.values.allitems.length) item.carco.recursivechildren[x].carco.game.valuessave.allitems = item.carco.recursivechildren[x].carco.game.values.allitems.slice(0);
                if (item.carco.recursivechildren[x].carco.game.values.allitemsplay&&item.carco.recursivechildren[x].carco.game.values.allitemsplay.length) item.carco.recursivechildren[x].carco.game.valuessave.allitemsplay = item.carco.recursivechildren[x].carco.game.values.allitemsplay.slice(0);
                if (item.carco.recursivechildren[x].carco.game.values.items&&item.carco.recursivechildren[x].carco.game.values.items.length) item.carco.recursivechildren[x].carco.game.valuessave.items = item.carco.recursivechildren[x].carco.game.values.items.slice(0);
            };
            save[x] = htmlToID(carco.functions.object.clone(item.carco.recursivechildren[x].carco));
            if (isNaN(Number(x.slice(2)))) delete save[x]
            if (save[x]&&save[x].actions) delete save[x].actions
        };

        for (var x in save){
            htmlToIDclear(save[x]);
        };

        if (src) {
            var output = {};
            if (savefilename){
                if (src.match(/\?/)){
                    src = src + "&trackname="+savefilename;
                }else{
                    src = src + "?trackname="+savefilename;
                };
            };
            carco.functions.json.send({
                url: src,
                input: save,
                output: output,
                callback: function () {
                    var fullsrc = window.location.protocol+"//"+window.location.host+window.location.pathname+"?saveduserdata="+output.filename;
                    if (output) output.fullsrc = fullsrc;
                    if (callback) callback(output);
                }
            })
            return save;
        }else{
            if (callback) callback();
            return save;
        };
    },
    loaduserstatusafterload3: function(item){

        var types = carco.functions.object.types;
        var root = item.carco.root;

        function idToHTML(item){
            if (item&&item.match&&item.match("HTML")){
                var id = item.split("HTML_")[1];
                if (root.carco.recursivechildren[id]) {
                    return root.carco.recursivechildren[id];
                }else{}
            };
            return false;
        };

        var root = item.carco.root;

        function recursiveRun(item, saveobject){
            var itemtype = types(item);

            function read(item, x){
                var xitemtype = types(item[x]);
                if (xitemtype == "object"||xitemtype == "array"){
                    if (!saveobject[x]) {
                        if (xitemtype == "array") saveobject[x] = [];
                        if (xitemtype == "object") saveobject[x] = {};
                    }else{
                        if (x == "solution") {
                            saveobject[x] = {};
                        };
                    };
                    if (saveobject[x]) recursiveRun(item[x], saveobject[x]);
                }else{
                    if (x !== "game") {
                        if (item[x] && item[x].match && item[x].match("HTML_")) {
                            var html = idToHTML(item[x]);
                            if (html) saveobject[x] = html;
                        }else{
                            saveobject[x] = item[x];
                        };
                    };
                };
            };

            if (itemtype == "object"){
                for (var x in item){
                    read(item, x);
                };
            };
            if (itemtype == "array"){
                for (var x = 0; x < item.length; x++){
                    read(item, x);
                };
            };
        };
        if (item.carco.saveduserdata){
            for (var x in item.carco.saveduserdata) {
                if (x == 'id101') {
                    recursiveRun(item.carco.saveduserdata[x], item.carco);
                };
                if (item.carco.intervals) item.carco.intervals = {};
            };
        };

    },
    loaduserstatusafterload4: function(item){
        if (item.carco.saveduserdata){
            item.carco.game.player();
            if (item.carco.recursivechildren['id102']) item.carco.recursivechildren['id102'].carco.resize();
            item.carco.saveduserdata = undefined;
            item.carco.wassaveduserdata = true;

            if (item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].showedscore) {
                if (item.carco.root.carco.playeritems.allscore) item.carco.root.carco.playeritems.allscore.innerHTML = item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].allscore;
                if (item.carco.root.carco.playeritems.userscore) item.carco.root.carco.playeritems.userscore.innerHTML = item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].showedscore;
            };
            if (item.carco.game.process > 2){
                setTimeout(function() {item.carco.showSolution()}, 1000)
            }else{
                for (var x in item.carco.recursivechildren)
                    if (item.carco.recursivechildren[x].carco.game&&item.carco.recursivechildren[x].carco.game.ready) {
                        carco.functions.listeners.removeAllListeners(item.carco.recursivechildren[x]);
                    };
            };
        };
    },
    loaduserstatusafterload2: function(item){
        if (item.carco.saveduserdata){
            for (var x in item.carco.saveduserdata){
                if (item.carco.recursivechildren[x]){
                    if (item.carco.recursivechildren[x].carco.game && item.carco.recursivechildren[x].carco.game.values && item.carco.recursivechildren[x].carco.game.valuessave) {
                        if (item.carco.recursivechildren[x].carco.game.valuessave.allitems && item.carco.recursivechildren[x].carco.game.valuessave.allitems.length) item.carco.recursivechildren[x].carco.game.values.allitems = item.carco.recursivechildren[x].carco.game.valuessave.allitems.slice(0);
                        if (item.carco.recursivechildren[x].carco.game.valuessave.allitemsplay && item.carco.recursivechildren[x].carco.game.valuessave.allitemsplay.length) item.carco.recursivechildren[x].carco.game.values.allitemsplay = item.carco.recursivechildren[x].carco.game.valuessave.allitemsplay.slice(0);
                        if (item.carco.recursivechildren[x].carco.game.valuessave.items && item.carco.recursivechildren[x].carco.game.valuessave.items.length) item.carco.recursivechildren[x].carco.game.values.items = item.carco.recursivechildren[x].carco.game.valuessave.items.slice(0);
                    };

                    if (item.carco.recursivechildren[x].carco.customparams.gametype == "inputtext"){
                        if (item.carco.recursivechildren[x].carco.inputtext.originalvalue||
                            item.carco.recursivechildren[x].carco.inputtext.originalvalue == "0"||
                            item.carco.recursivechildren[x].carco.inputtext.originalvalue == 0){
                            item.carco.recursivechildren[x].carco.inputtext.inputitem.value = item.carco.recursivechildren[x].carco.inputtext.originalvalue;
                        };
                    };

                    if (item.carco.recursivechildren[x].carco.customparams.gametype == "button"&&!item.carco.recursivechildren[x].carco.parent.carco.customparams.scrollbox&&!item.carco.recursivechildren[x].carco.parent.carco.customparams.processbox){
                        if (item.carco.recursivechildren[x].carco.button.pressed){
                            if (carco.functions.game.searchActions(item.carco.recursivechildren[x], "button")){
                                carco.functions.game.searchActions(item.carco.recursivechildren[x], "button")(item.carco.recursivechildren[x])
                            }else{
                                if (!item.carco.recursivechildren[x].carco.customparams.autostyle) item.carco.recursivechildren[x].carco.customparams.autostyle = "button1_image_colorise";
                                if (item.carco.recursivechildren[x].carco.customparams.autostyle&&carco.functions.autostyle[item.carco.recursivechildren[x].carco.customparams.autostyle]){
                                    carco.functions.autostyle[item.carco.recursivechildren[x].carco.customparams.autostyle](item.carco.recursivechildren[x]);
                                };
                            };
                        };
                    };

                    if (item.carco.recursivechildren[x].carco.customparams.gametype == "button"&&item.carco.recursivechildren[x].carco.parent.carco.customparams.scrollbox){
                        if (item.carco.recursivechildren[x].carco.button.pressed){
                            if (carco.functions.game.searchActions(item.carco.recursivechildren[x], "button")){};
                            if (!item.carco.recursivechildren[x].carco.customparams.autostyle) item.carco.recursivechildren[x].carco.customparams.autostyle = "button1_image_colorise";
                            if (item.carco.recursivechildren[x].carco.customparams.autostyle&&carco.functions.autostyle[item.carco.recursivechildren[x].carco.customparams.autostyle]){
                                carco.functions.autostyle[item.carco.recursivechildren[x].carco.customparams.autostyle](item.carco.recursivechildren[x]);
                            };
                        };
                    };

                    if (item.carco.recursivechildren[x].carco.customparams.processbox){
                        item.carco.recursivechildren[x].carco.game.processbox();
                    };

                };
            };
        };
    },
    loaduserstatusafterload: function(item){

        var types = carco.functions.object.types;
        var root = item.carco.root;

        function idToHTML(item){
            if (item&&item.match&&item.match("HTML")){
                var id = item.split("HTML_")[1];
                if (root.carco.recursivechildren[id]) {
                    return root.carco.recursivechildren[id];
                }else{}
            };
            return false;
        };

        var root = item.carco.root;

        function recursiveRun(item, saveobject){
            var itemtype = types(item);

            function read(item, x){
                var xitemtype = types(item[x]);
                if (xitemtype == "object"||xitemtype == "array"){
                    if (!saveobject[x]) {
                        if (xitemtype == "array") saveobject[x] = [];
                        if (xitemtype == "object") saveobject[x] = {};
                    }else{
                        if (x == "solution") {
                            saveobject[x] = {};
                        };
                    };
                    if (saveobject[x]) recursiveRun(item[x], saveobject[x]);
                }else{
                    if (x !== "game") {
                        if (item[x] && item[x].match && item[x].match("HTML_")) {
                            var html = idToHTML(item[x]);
                            if (html) saveobject[x] = html;
                        }else{
                            saveobject[x] = item[x];
                        };
                    };
                };
            };

            if (itemtype == "object"){
                for (var x in item){
                    read(item, x);
                };
            };
            if (itemtype == "array"){
                for (var x = 0; x < item.length; x++){
                    read(item, x);
                };
            };
        };

        if (item.carco.saveduserdata){
            for (var x in item.carco.saveduserdata){
                if (!item.carco.recursivechildren[x]){
                    if (item.carco.saveduserdata[x].customparams.dragduplicate){
                        if (item.carco.saveduserdata[x].customparams.dragduplicate == "unlimited"){
                            if (item.carco.saveduserdata[x].game&&
                                item.carco.saveduserdata[x].game.duplicateddrag&&
                                item.carco.saveduserdata[x].game.originalitem){
                                var oitem = idToHTML(item.carco.saveduserdata[x].game.originalitem);
                                if (oitem) var newitem = oitem.carco.duplicate(false, false, x);
                                if (newitem){};
                                if (!oitem.carco.customparams.duplicateautostyle) oitem.carco.customparams.duplicateautostyle = "none";
                                if (oitem.carco.customparams.duplicateautostyle&&carco.functions.autostyle[oitem.carco.customparams.duplicateautostyle]){
                                    setTimeout(function() {carco.functions.autostyle[oitem.carco.customparams.duplicateautostyle](newitem);},300)
                                };
                            };
                        };

                        if (item.carco.saveduserdata[x].customparams.dragduplicate == "once"){
                            if (item.carco.saveduserdata[x].game&&
                                item.carco.saveduserdata[x].game.duplicateddrag&&
                                item.carco.saveduserdata[x].game.originalitem) {
                                var oitem = idToHTML(item.carco.saveduserdata[x].game.originalitem);
                                var newitem = oitem.carco.duplicate(false, "sol", x);
                                if (newitem){};

                                if (!oitem.carco.customparams.duplicateautostyle) oitem.carco.customparams.duplicateautostyle = "none";
                                if (oitem.carco.customparams.duplicateautostyle&&carco.functions.autostyle[oitem.carco.customparams.duplicateautostyle]){
                                    var image = newitem.carco.getChildren({children:"recursivechildren", equal:{type:"image"}, type:"item"})[0];
                                    if (image) image.carco.duplicatedonce = true;
                                    setTimeout(function() {
                                        carco.functions.autostyle[oitem.carco.customparams.duplicateautostyle](newitem);
                                    },300)
                                };

                                if (carco.functions.game.searchActions(oitem, "dragduplicate")) {
                                    carco.functions.game.searchActions(oitem, "dragduplicate")(newitem);
                                };
                            };
                        };
                    };
                };
            };

            for (var x in item.carco.saveduserdata){
                if (x == 'id101'){
                    recursiveRun(item.carco.saveduserdata[x], item.carco);
                };
                if (item.carco.recursivechildren[x]){
                    recursiveRun(item.carco.saveduserdata[x], item.carco.recursivechildren[x].carco);
                };
            };

            for (var x in item.carco.saveduserdata){
                if (item.carco.recursivechildren[x]&&item.carco.recursivechildren[x].carco.customparams.gametype == "place"){
                    item.carco.recursivechildren[x].carco.game.innersPosition();
                };
            };
        };
    },
    loaduserstatuscallback: function(item, callback){

        var currentgame = item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame];
        var currenttrack = item.carco.paramsdata.system.currenttrack;
        if (currentgame.params.tracks[Number(item.carco.paramsdata.system.currenttrack)-1]){
            currenttrack = currentgame.params.tracks[Number(item.carco.paramsdata.system.currenttrack)-1];
        };

        if (item.carco.saveduserdata){

            var currentgame = item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame];
            var currenttrack = item.carco.paramsdata.system.currenttrack;
            if (currentgame.params.tracks[Number(item.carco.paramsdata.system.currenttrack)-1]){
                currenttrack = currentgame.params.tracks[Number(item.carco.paramsdata.system.currenttrack)-1];
            };

            for (var x in item.carco.saveduserdata){
                if (item.carco.paramsdata.tracks[currenttrack].params[x]) {

                    item.carco.paramsdata.tracks[currenttrack].params[x].originalcustomparams = item.carco.saveduserdata[x].originalcustomparams
                    item.carco.paramsdata.tracks[currenttrack].params[x].originalposition = item.carco.saveduserdata[x].originalposition
                    item.carco.paramsdata.tracks[currenttrack].params[x].originalsize = item.carco.saveduserdata[x].originalsize
                    item.carco.paramsdata.tracks[currenttrack].params[x].originalstyle = item.carco.saveduserdata[x].originalstyle
                    item.carco.paramsdata.tracks[currenttrack].params[x].originalscale = item.carco.saveduserdata[x].originalscale

                    item.carco.paramsdata.tracks[currenttrack].params[x].customparams = item.carco.saveduserdata[x].customparams
                    item.carco.paramsdata.tracks[currenttrack].params[x].position = item.carco.saveduserdata[x].position
                    item.carco.paramsdata.tracks[currenttrack].params[x].size = item.carco.saveduserdata[x].size
                    item.carco.paramsdata.tracks[currenttrack].params[x].style = item.carco.saveduserdata[x].style
                    item.carco.paramsdata.tracks[currenttrack].params[x].scale = item.carco.saveduserdata[x].scale

                }else{};

                if (item.carco.saveduserdata[x].customparams.savefixrandomids&&item.carco.paramsdata.tracks[currenttrack].params[x]){
                    item.carco.paramsdata.tracks[currenttrack].params[x].customparams.howmanyrandom = 0
                    item.carco.paramsdata.tracks[currenttrack].params[x].customparams.fixrandomids = item.carco.saveduserdata[x].customparams.savefixrandomids;
                };
            };
        };
        if (callback) callback();
    },
    loaduserstatus: function(item, src, callback){

        var types = carco.functions.object.types;

        function go(){
            if (item.carco.saveduserdata&&item.carco.saveduserdata['id101']){
                var project = item.carco.paramsdata.system.currentproject;
                var urls = item.carco.paramsdata.system.urls;
                for (var x in item.carco.saveduserdata['id101'].paramsdata){
                    item.carco.paramsdata[x] = carco.functions.object.clone(item.carco.saveduserdata['id101'].paramsdata[x])
                };
                item.carco.paramsdata.system.currentproject = project;
                item.carco.paramsdata.system.urls = urls;
            };
            if (callback) callback();
        };

        if (carco.data){
            if (item.carco.paramsdata.system.currentproject == "drwmsg"){
                var dataobject = carco.data["okosdoboz"];
            }else{
                var dataobject = carco.data[item.carco.paramsdata.system.currentproject];
            };
        };

        if (item.carco.paramsdata.user.saveduserdata||dataobject&&dataobject.saveuserdata){

            function addscript(file, callback) {
                var fileref = document.createElement('script')
                fileref.setAttribute("type","text/javascript")
                fileref.setAttribute("src", file)
                document.getElementsByTagName("head")[0].appendChild(fileref)
                fileref.onload = function() {
                    if (callback) callback();
                };
            };

            if (item.carco.paramsdata.user.saveduserdata){
                var folder = item.carco.urls.root + item.carco.urls.saveduserstatusfolder;
                addscript(folder+item.carco.paramsdata.user.saveduserdata, function(){
                    if (item.carco.paramsdata.system.currentproject == "drwmsg"){
                        var dataobject = carco.data["okosdoboz"];
                    }else{
                        var dataobject = carco.data[item.carco.paramsdata.system.currentproject];
                    };
                    if (dataobject.saveuserdata){
                        item.carco.saveduserdata = carco.functions.object.clone(dataobject.saveuserdata);
                    };
                    dataobject.saveuserdata = null;
                    item.carco.paramsdata.user.saveduserdata = null
                    go();
                })
            }else{
                if (dataobject.saveuserdata){
                    item.carco.saveduserdata = carco.functions.object.clone(dataobject.saveuserdata);
                };
                dataobject.saveuserdata = null;
                item.carco.paramsdata.user.saveduserdata = null
                go();
            };

        }else{
            go();
        };
    },
    alltrack: function(item, src, callback_function) {
        var go = true;
        if (item.carco.root.carco.loadedalltrack) go = false;
        if (src&&go){
            item.carco.root.carco.loadedalltrack = true;
            carco.functions.json.send({url:src, input:false, output:item.carco.alltracks, callback:function(){
                for (var x in item.carco.alltracks){
                    var split = item.carco.alltracks[x].split("/")
                    item.carco.alltracks[x] = split[split.length-1];
                }
                if (callback_function) callback_function();
            }})
        }else{
            if (callback_function) callback_function();
        };
    },
    allgame: function(item, src, callback_function) {
        if (src){
            carco.functions.json.send({url:src, input:false, output:item.carco.allgames, callback:function(){
                for (var x in item.carco.allgames){
                    var split = item.carco.allgames[x].split("/")
                    item.carco.allgames[x] = split[split.length-1];
                    if (item.carco.allgames[x] == "lib"||item.carco.allgames[x] == "tracks"){
                        delete item.carco.allgames[x];
                    }
                }
                if (callback_function) callback_function();
            }})
        };
    }
};

carco.functions.setParamsRecursiveChildren = function(item, param, value) {
    for (var x in item.carco.recursivechildren){
        item.carco.recursivechildren[x].carco[param] = value;
    };
};


carco.functions.autostyle = {
    none: function(item) {

    },
    button1_image_colorise: function(item) {
        if (item.carco.button){
            if (item.carco.button.pressed) {
                item.carco.game.allChildrenImageColorise({colorise:"#cdcdcd"});
            }else{
                item.carco.game.allChildrenImageColorise('reset');
            };
        };
    },
    button2_image_brightness: function(item) {
        if (item.carco.button){
            if (item.carco.button.pressed) {
                item.carco.game.allChildrenImageColorise({brightness: -30});
            }else{
                item.carco.game.allChildrenImageColorise('reset');
            }
        };
    },
    button3_div_background: function(item) {
        if (item.carco.button){
            if (item.carco.button.pressed) {
                item.carco.setStyle({background:'rgb(205, 205, 205)'});
            }else{
                item.carco.setStyle({background:"reset"});
            };
        };
    },
    button4_hide_cover: function(item) {
        if (item.carco.button){
            if (item.carco.button.pressed) {
                var cover = item.carco.getChildren({equal:{name:"cover container"}})[0];
                if (cover){
                    cover.carco.setStyle({visibility: "hidden"});
                };
            }else{
                var cover = item.carco.getChildren({equal:{name:"cover container"}})[0];
                if (cover){
                    cover.carco.setStyle({visibility: "reset"});
                };
            };
        };
    },
    drag_duplicate_colorise_image: function(item){
        item.carco.game.allChildrenImageColorise({colorise:"#cdcdcd"});
    },
    drag_duplicate_div_background: function(item){
        item.style.background = 'rgb(205, 205, 205)';
        if (item.carco&&item.carco.style) item.carco.style.background = 'rgb(205, 205, 205)';
    }
};

carco.functions.feedback = {
    types: {
        editor: function(item, check, ev) {
            var multiplier = 1;
            var root = item.carco.root;
            if (!root) root = item;
            if (!root.carco.customparams.feedbackon&&root.carco.customparams.feedbackon!==false&&root.carco.customparams.feedbackon!==0) {
                root.carco.customparams.feedbackon = true;
            };
            var feedbackon = root.carco.customparams.feedbackon;
            var allOnValues = item.carco.getChildren({children:"recursivechildren", equal:{type:"container", customparams:{values:{valueon:1}}}, type:"item"})

            if (check !== false&&check !== "getResult"){
                if (item.carco.root.carco.paramsdata.system.usertype == "user"){
                    carco.functions.feedback.check.remove(item);
                    carco.functions.feedback.solution.remove(item);
                    for (var i = 0; i < allOnValues.length; i++){
                        if (!allOnValues[i].carco.game.ready) carco.functions.feedback.check.remove(allOnValues[i]);
                        if (!allOnValues[i].carco.game.ready) carco.functions.feedback.solution.remove(allOnValues[i]);
                    };
                }else{
                    carco.functions.feedback.check.remove(item);
                    carco.functions.feedback.solution.remove(item);
                    for (var i = 0; i < allOnValues.length; i++){
                        carco.functions.feedback.check.remove(allOnValues[i]);
                        carco.functions.feedback.solution.remove(allOnValues[i]);
                    };
                }
            };
            if (!item.carco.root.carco.intervals) item.carco.root.carco.intervals = {};
            if (item.carco.root.carco.intervals.feedbackwait1) clearInterval(item.carco.root.carco.intervals.feedbackwait1);
            if (item.carco.root.carco.intervals.feedbackwait2) clearInterval(item.carco.root.carco.intervals.feedbackwait2);
            if (item.carco.root.carco.intervals.feedbackwait3) clearInterval(item.carco.root.carco.intervals.feedbackwait3);
            if (item.carco.root.carco.intervals.feedbackwait4) clearInterval(item.carco.root.carco.intervals.feedbackwait4);
            if (item.carco.root.carco.intervals.feedbackwait4a) clearInterval(item.carco.root.carco.intervals.feedbackwait4a);
            if (item.carco.root.carco.intervals.feedbackwait5) clearInterval(item.carco.root.carco.intervals.feedbackwait5);
            if (item.carco.root.carco.intervals.feedbackwait6) clearInterval(item.carco.root.carco.intervals.feedbackwait6);

            item.carco.root.carco.game.feedbackcheck = false;
            item.carco.root.carco.game.permutationready = false;
            item.carco.root.carco.game.feedbacksol = false;
            item.carco.root.carco.game.feedbacksolstyle = false;
            item.carco.root.carco.game.feedbacksolvisible = false;
            var howmanywaitfeedback1 = 0

            if (feedbackon == true||feedbackon == "all"){
                if (item.carco.root.carco.intervals.feedbackwait1) clearInterval(item.carco.root.carco.intervals.feedbackwait1);
                if (!carco.drag.currentdrag) carco.drag.currentdrag = {};
                if (!carco.drag.currentdrag.item) carco.drag.currentdrag.item = false;

                if (carco.drag.currentdrag.item) {
                    if (item.carco.root.carco.paramsdata.system.usertype == "user") {
                        var currentdrag = carco.drag.currentdrag.item;
                        currentdrag.carco.drag.inner_up_mobile(ev)
                    } else {
                        carco.drag.currentdrag.item = false
                    };
                };

                function go() {
                    if (item.carco.root.carco.intervals.feedbackwait1) clearInterval(item.carco.root.carco.intervals.feedbackwait1);
                    if (item.carco.root.carco.paramsdata.system.usertype == "user"&&check !== false&&item.carco.root.carco.game.trueAllValues() !== true) {
                        carco.functions.game.permutation(item.carco.root)
                    }else{
                        item.carco.root.carco.game.permutationready = true;
                    };
                    if (item.carco.root.carco.intervals.feedbackwait2) clearInterval(item.carco.root.carco.intervals.feedbackwait2);
                    if (item.carco.root.carco.game.permutationready){
                        carco.functions.game.lastcheck(item.carco.root)

                        var allmixcontainer = item.carco.root.carco.getChildren({equal:{type:"container", customparams:{gametype:"random_mix_sort_cont"}}, type:"item"});
                        for (var a = 0; a < allmixcontainer.length; a++) {
                            if (carco.functions.game.searchActions(allmixcontainer[a], "checkaction")){
                                carco.functions.game.searchActions(allmixcontainer[a], "checkaction")(allmixcontainer[a]);
                            };
                        };

                        item.carco.root.carco.game.feedbackcheck = false;
                        if (item.carco.root.carco.intervals.feedbackwait2) clearInterval(item.carco.root.carco.intervals.feedbackwait2);
                        if (check !== false&&check !== "getResult") carco.functions.feedback.check.add(item);
                        for (var i = 0; i < allOnValues.length; i++){
                            carco.functions.size.resizeInnersFixCoordinate(allOnValues[i], true);
                            if (check !== false&&check !== "getResult") carco.functions.feedback.check.add(allOnValues[i]);
                        };
                        item.carco.root.carco.game.scores(check);
                        if (check !== "getResult") item.carco.root.carco.game.trueAllValues()
                        if (item.carco.root.carco.game.trueAllValues()) {feedbackon = "all"};
                        item.carco.root.carco.game.feedbackcheck = true;
                        if (item.carco.root.carco.paramsdata.system.usertype == "user"&&check !== "getResult"){
                            item.carco.root.carco.game.player();
                            setTimeout(function() {
                                carco.functions.root.preloadlayer(item, "remove")
                                if (item.carco.playeritems.preload_layer) item.carco.playeritems.preload_layer.style.opacity = 1
                            },500)
                        };
                    }else{}
                };

                if (carco.drag.currentdrag.item == false){
                    go();
                }else{
                    carco.drag.currentdrag.item.carco.drag.up();
                    go();
                };
            };

            if (feedbackon == "all"){
                if (item.carco.root.carco.intervals.feedbackwait3) clearInterval(item.carco.root.carco.intervals.feedbackwait3);
                item.carco.solitems = [];

                item.carco.root.carco.intervals.feedbackwait3 = setInterval(function() {
                    if (item.carco.root.carco.game.feedbackcheck){
                        if (item.carco.root.carco.intervals.feedbackwait3) clearInterval(item.carco.root.carco.intervals.feedbackwait3);
                        item.carco.root.carco.game.feedbacksol = false;
                        var rootsol = carco.functions.feedback.solution.add(item);
                        item.carco.solitems = item.carco.solitems.concat(rootsol)
                        for (var i = 0; i < allOnValues.length; i++){
                            if (allOnValues[i].carco.customparams.gametype == "place"||allOnValues[i].carco.customparams.gametype == "placecontainer"||allOnValues[i].carco.customparams.gametype == "coordinate"){
                                var allonsol = carco.functions.feedback.solution.add(allOnValues[i]);
                                item.carco.solitems = item.carco.solitems.concat(allonsol);
                            };
                        };
                        item.carco.root.carco.game.feedbacksol = true;
                    }else{};
                },100)

                if (item.carco.root.carco.intervals.feedbackwait4) clearInterval(item.carco.root.carco.intervals.feedbackwait4);
                item.carco.root.carco.intervals.feedbackwait4 = setInterval(function() {
                    if (item.carco.root.carco.game.feedbacksol){
                        if (item.carco.root.carco.intervals.feedbackwait4) clearInterval(item.carco.root.carco.intervals.feedbackwait4);
                        if (item.carco.root.carco.intervals.feedbackwait4a) clearInterval(item.carco.root.carco.intervals.feedbackwait4a);
                        item.carco.root.carco.intervals.feedbackwait4a = setInterval(function() {
                            var readymathjax = true;
                            for (var i = 0; i < item.carco.solitems.length; i++){
                                var mathjaxs = item.carco.solitems[i][0].carco.getChildren({equal:{customparams:{mathjax:1}}, type:"item"});
                                for (var m = 0; m < mathjaxs.length; m++){
                                    if (mathjaxs[m].carco.mathjaxgenerated == false){
                                        readymathjax = false;
                                    };
                                };
                                if (item.carco.solitems[i][2].carco.customparams&&item.carco.solitems[i][2].carco.customparams.mathjax == true&&item.carco.solitems[i].carco.mathjaxgenerated == false){
                                    readymathjax = false;
                                };
                            };
                            if (readymathjax){
                                if (item.carco.root.carco.intervals.feedbackwait4a) clearInterval(item.carco.root.carco.intervals.feedbackwait4a);
                                item.carco.root.carco.game.feedbacksolstyle = false;
                                for (var i = 0; i < item.carco.solitems.length; i++){
                                    if (!item.carco.solitems[i][2].carco.customparams.solutionsstyle) item.carco.solitems[i][2].carco.customparams.solutionsstyle = "none";
                                    carco.functions.feedback.solutionsstyle[item.carco.solitems[i][2].carco.customparams.solutionsstyle](item.carco.solitems[i][0]);
                                    if (item.carco.solitems[i][2].carco.customparams.solutionsstyle == "none") carco.functions.feedback.solutionsstyle[item.carco.solitems[i][1].carco.customparams.solutionsstyle](item.carco.solitems[i][0]);
                                };
                                item.carco.root.carco.game.feedbacksolstyle = true;
                            }else{};
                        },100)
                    }else{};
                },100)

                if (item.carco.root.carco.intervals.feedbackwait5) clearInterval(item.carco.root.carco.intervals.feedbackwait5);
                item.carco.root.carco.intervals.feedbackwait5 = setInterval(function() {
                    if (item.carco.root.carco.game.feedbacksolstyle){
                        item.carco.root.carco.game.feedbacksolvisible = false;
                        if (item.carco.root.carco.intervals.feedbackwait5) clearInterval(item.carco.root.carco.intervals.feedbackwait5);
                        for (var i = 0; i < item.carco.solitems.length; i++){

                            if (item.carco.root.carco.paramsdata.system.usertype == "user") {
                                if (carco.functions.game.searchActions(item.carco.solitems[i][1], "aftersoloriginalobject")) {
                                    carco.functions.game.searchActions(item.carco.solitems[i][1], "aftersoloriginalobject")(item.carco.solitems[i][2]);
                                };
                            };

                            item.carco.solitems[i][0].carco.setStyle({visibility:"visible", zIndex:5000001}, true)
                        };
                        item.carco.root.carco.game.feedbacksolvisible = true;
                    }else{};
                },100)

                if (item.carco.root.carco.paramsdata.system.usertype == "user") {
                    if (item.carco.root.carco.intervals.feedbackwait6) clearInterval(item.carco.root.carco.intervals.feedbackwait6);
                    item.carco.root.carco.intervals.feedbackwait6 = setInterval(function() {
                        if (item.carco.root.carco.game.feedbacksolvisible){
                            if (item.carco.root.carco.intervals.feedbackwait6) clearInterval(item.carco.root.carco.intervals.feedbackwait6);
                            carco.functions.root.preloadlayer(item, "remove")
                            if (item.carco.playeritems.preload_layer) item.carco.playeritems.preload_layer.style.opacity = 1
                        }else{};
                    },100)
                };

            };

            if (feedbackon == true||feedbackon == "all"){
                if (item.carco.root.carco.checkcallback&&!item.carco.root.carco.checkcallbackrun){
                    item.carco.root.carco.checkcallbackrun = true;
                    setTimeout(function() {
                        item.carco.root.carco.checkcallbackrun = false;
                    },1000)
                    setTimeout(function() {
                        if (check !== "getResult") {
                            item.carco.root.carco.checkcallback(item);
                        };
                    },200)
                };
            };
        },
        practice: function(item) {
            if (item.carco.root.carco.game.process == 0){
                item.carco.root.carco.game.process = 1;
                item.carco.root.carco.game.player();
            };
            if (item.carco.root.carco.ischecking&&item.carco.root.carco.game.process>0&&item.carco.root.carco.paramsdata.user.restartbutton){
                item.carco.root.carco.game.player();
            };
        },
        test: function(item) {
            if (item.carco.root.carco.game.process == 0){
                item.carco.root.carco.game.process = 1;
                item.carco.root.carco.game.player();
            };
        }
    },
    checkStyle: {
        none: function(item, type) {
            if (type == "add"){
                if (item.carco.game.value&&item.carco.game.value > 0) {
                    //carco.functions.console("none check style "+item.carco.id+" GREEN")
                }else{
                    //carco.functions.console("none check style "+item.carco.id+" RED")
                };
            }else{
                //carco.functions.console("none check style "+item.carco.id+" RESET")
            };
        },
        none_but_disable_when_true: function(item, type) {
            if (type == "add"){
                if (item.carco.game.value&&item.carco.game.value > 0) {
                    //carco.functions.console("none check style "+item.carco.id+" GREEN")
                }else{
                    //carco.functions.console("none check style "+item.carco.id+" RED")
                };
            }else{
                //carco.functions.console("none check style "+item.carco.id+" RESET")
            };
        },
        check1_css_background: function(item, type) {
            if (type == "add"){
                if (item.carco.game.value&&item.carco.game.value > 0) {
                    item.carco.setStyle({background:'#4ba849'});
                    item.carco.getChildren({equal:{type:"text"}, call:{setStyle:{color:"#FFFFFF"}}});
                }else{
                    item.carco.setStyle({background:'#e12e2a'});
                    item.carco.getChildren({equal:{type:"text"}, call:{setStyle:{color:"#FFFFFF"}}});
                };
            }else{
                item.carco.setStyle({background:"reset"});
                item.carco.getChildren({equal:{type:"text"}, call:{setStyle:{color:"reset"}}});
            };
        },
        check2_icon: function(item, type) {
            if (type == "add"){
                if (!item.carco.checkitem) {
                    item.carco.checkitem = item.carco.addChild(carco.functions.children.createHTML(
                        {type:"div",
                            carco:{
                                name: "checkitem",
                                root: item.carco.root,
                                type: "container",
                                addtools: false,
                                layer: "imagecontainer",
                                style:{background:"transparent", visibility:"hidden"},
                                customparams:{checkitem: "container"},
                                size:{width:70, height:70},
                                position:{type:{x:"max", y:"center", boundingx: "center", boundingy: "center"}}
                            }
                        }
                    ))
                    item.carco.checkitem.carco.checkitems = {};
                    var currentproject = item.carco.root.carco.paramsdata.system.currentproject
                    item.carco.checkitem.carco.checkitems["true"] = item.carco.checkitem.carco.addChild(carco.functions.children.createHTML(
                        {type:"img",
                            carco:{
                                name: "checkitem true image",
                                root: item.carco.root,
                                type: "image",
                                addtools: false,
                                layer: "image",
                                size:{width:70, height:70},
                                style:{visibility:"hidden"},
                                customparams:{checkitem: "true", image:{name:"good.png", src:carco.project[currentproject].hosts[carco.project[currentproject].currentHost]+"default_images/good.png"}},
                                scale:{type:"fitinternal"},
                                position:{type:{x:"center", y:"center"}}
                            }
                        }
                    ))

                    item.carco.checkitem.carco.checkitems["false"] = item.carco.checkitem.carco.addChild(carco.functions.children.createHTML(
                        {type:"img",
                            carco:{
                                name: "checkitem false image",
                                root: item.carco.root,
                                type: "image",
                                addtools: false,
                                layer: "image",
                                size:{width:70, height:70},
                                style:{visibility:"hidden"},
                                customparams:{checkitem: "false", image:{name:"fault.png", src:carco.project[currentproject].hosts[carco.project[currentproject].currentHost]+"default_images/fault.png"}},
                                scale:{type:"fitinternal"},
                                position:{type:{x:"center", y:"center"}}
                            }
                        }
                    ))
                };
                item.carco.checkitem.carco.setStyle({visibility:"hidden"})
                item.carco.checkitem.carco.checkitems["true"].carco.setStyle({visibility:"hidden"})
                item.carco.checkitem.carco.checkitems["false"].carco.setStyle({visibility:"hidden"})
                if (item.carco.game.value&&item.carco.game.value > 0) {
                    item.carco.checkitem.carco.checkitems["false"].carco.setStyle({visibility:"hidden"})
                    item.carco.checkitem.carco.checkitems["true"].carco.setStyle({visibility:"visible"})
                }else{
                    item.carco.checkitem.carco.checkitems["true"].carco.setStyle({visibility:"hidden"})
                    item.carco.checkitem.carco.checkitems["false"].carco.setStyle({visibility:"visible"})
                };

            }else{
                if (item.carco.checkitem&&item.carco.checkitem.carco.checkitems){
                    item.carco.checkitem.carco.setStyle({visibility:"hidden"})
                    item.carco.checkitem.carco.checkitems["false"].carco.setStyle({visibility:"hidden"})
                    item.carco.checkitem.carco.checkitems["true"].carco.setStyle({visibility:"hidden"})
                };
            };
        },
        check2_icon_and_text: function(item, type) {
            this.check2_icon(item, type)
            this.check4_only_text(item, type)
        },
        check2_icon_and_imageBg: function(item, type) {
            this.check2_icon(item, type)
            this.check3_imageBg_and_text(item, type)
        },
        check2_icon_and_cssBg: function(item, type) {
            this.check2_icon(item, type)
            this.check1_css_background(item, type)
        },
        check3_imageBg_and_text: function(item, type) {
            if (type == "add"){
                if (item.carco.game.value&&item.carco.game.value > 0) {
                    item.carco.game.allChildrenImageColorise({colorise:"#4ba849"});
                    item.carco.getChildren({equal:{type:"text"}, call:{setStyle:{color:"#FFFFFF"}}});
                }else{
                    item.carco.game.allChildrenImageColorise({colorise:"#e12e2a"});
                    item.carco.getChildren({equal:{type:"text"}, call:{setStyle:{color:"#FFFFFF"}}});
                };
            }else{
                item.carco.game.allChildrenImageColorise('reset');
                item.carco.getChildren({equal:{type:"text"}, call:{setStyle:{color:"reset"}}});
            };
        },
        check4_only_text: function(item, type) {
            if (type == "add"){
                if (item.carco.game.value&&item.carco.game.value > 0) {
                    item.carco.getChildren({equal:{type:"text"}, call:{setStyle:{color:"#4ba849"}}});
                    if (item.carco.game.inners&&item.carco.game.inners[0]&&item.carco.game.inners[0].carco.game.innersPosition) item.carco.game.inners[0].carco.game.innersPosition()
                }else{
                    item.carco.getChildren({equal:{type:"text"}, call:{setStyle:{color:"#e12e2a"}}});
                    if (item.carco.game.inners&&item.carco.game.inners[0]&&item.carco.game.inners[0].carco.game.innersPosition) item.carco.game.inners[0].carco.game.innersPosition()
                };
            }else{
                item.carco.getChildren({equal:{type:"text"}, call:{setStyle:{color:"reset"}}});
            };
        },
        check4_only_inputtext: function(item, type) {
            if (type == "add"){
                if (item.carco.game.value&&item.carco.game.value > 0) {
                    item.carco.getChildren({equal:{type:"inputtext"}, call:{setStyle:{color:"#4ba849"}}});
                }else{
                    item.carco.getChildren({equal:{type:"inputtext"}, call:{setStyle:{color:"#e12e2a"}}});
                };
            }else{
                item.carco.getChildren({equal:{type:"inputtext"}, call:{setStyle:{color:"reset"}}});
            };
        },
        check4_icon_and_inputtext: function(item, type) {
            this.check2_icon(item, type)
            this.check4_only_inputtext(item, type)
        },
        check5_only_imageBg: function(item, type) {
            if (type == "add"){
                if (item.carco.game.value&&item.carco.game.value > 0) {
                    item.carco.game.allChildrenImageColorise({colorise:"#4ba849"});
                }else{
                    item.carco.game.allChildrenImageColorise({colorise:"#e12e2a"});
                };
            }else{
                item.carco.game.allChildrenImageColorise('reset');
            };
        },
        check5_only_imageBg_for_sol_and_button: function(item, type) {
            if (type == "add"){
                if (item.carco.game.value&&item.carco.game.value > 0) {
                    item.carco.game.allChildrenImageColorise({colorise:"#4ba849"});
                }else{
                    item.carco.game.allChildrenImageColorise({colorise:"#e12e2a"});
                };
            }else{};
        },
        check5_only_imageBg_alpha07: function(item, type) {
            if (type == "add"){
                if (item.carco.game.value&&item.carco.game.value > 0) {
                    item.carco.game.allChildrenImageColorise({colorise:"#4ba849", colorisealpha:0.7});
                }else{
                    item.carco.game.allChildrenImageColorise({colorise:"#e12e2a", colorisealpha:0.7});
                };
            }else{
                item.carco.game.allChildrenImageColorise('reset');
            };
        }
    },
    check: {
        add: function(item) {
            if (item.carco.customparams.values&&item.carco.customparams.values.valueon&&item.carco.customparams.values.valueon == true||
                item.carco.customparams.values&&item.carco.customparams.values.valueon&&item.carco.customparams.values.valueon == 1){

                if (!item.carco.game.inners) item.carco.game.inners = [];
                if (!item.carco.game.tempinners1) item.carco.game.tempinners1 = [];
                if (!item.carco.game.temptempinners) item.carco.game.temptempinners = [];

                item.carco.game.temptempinners = [];
                for (var i = 0; i < item.carco.game.tempinners1.length; i++) {
                    item.carco.game.temptempinners.push(item.carco.game.tempinners1[i]);
                };
                item.carco.game.tempinners1 = [];
                for (var i = 0; i < item.carco.game.inners.length; i++) {
                    item.carco.game.tempinners1.push(item.carco.game.inners[i]);
                };

                item.carco.game.temptempvalue = item.carco.game.tempvalue;
                item.carco.game.tempvalue = item.carco.game.value;

                if (!item.carco.customparams.checkstyle) item.carco.customparams.checkstyle = "check1_css_background";
                if (!item.carco.customparams.checkwhen) item.carco.customparams.checkwhen = "always";
                if (carco.functions.feedback.checkwhen[item.carco.customparams.checkwhen](item) == true){
                    if (item.carco.root.carco.paramsdata.system.usertype == "user"&&item.carco.game.value&&item.carco.game.value > 0 && item.carco.customparams.checkstyle&&item.carco.customparams.checkstyle !== "none") {
                        carco.functions.listeners.removeAllListeners(item);
                        if (item.carco.customparams.disableinnerswhenthistrue){
                            for (var i = 0; i < item.carco.game.inners.length; i++){
                                carco.functions.listeners.removeAllListeners(item.carco.game.inners[i]);
                            };
                        };
                    }else{
                        if (item.carco.customparams.gametype == "place"&&item.carco.parent.carco.customparams.gametype == "placecontainer"&&item.carco.parent.carco.game&&item.carco.parent.carco.game.value>0&&item.carco.parent.carco.customparams.disableinnerswhenthistrue){}else{
                            item.carco.game.tempready = item.carco.game.ready;
                            item.carco.game.ready = false;
                        }
                    };
                    if (item.carco.root.carco.paramsdata.system.usertype == "user"&&item.carco.game.value&&item.carco.game.value > 0 && item.carco.customparams.checkstyle&&item.carco.customparams.checkstyle !== "none"&&item.carco.customparams.gametype == "placecontainer") {
                        if (item.carco.customparams.disableinnerswhenthistrue){
                            for (var x in item.carco.recursivechildren){
                                if (item.carco.recursivechildren[x].carco.customparams.gametype == "place"&&item.carco.recursivechildren[x].carco.customparams.values&&item.carco.recursivechildren[x].carco.customparams.values.valueon){
                                    item.carco.recursivechildren[x].carco.game.ready = true
                                };
                            };
                        };
                    };

                    if (carco.functions.game.searchActions(item, "checkstyle")) {
                        carco.functions.game.searchActions(item, "checkstyle")({item:item, type:"add"})
                    }else{
                        carco.functions.feedback.checkStyle[item.carco.customparams.checkstyle](item, "add");
                    };
                    if (item.carco.customparams.gametype == "coordinate") {
                        item.carco.game.coordinate("check");
                    };
                }else{
                    if (!item.carco.game.ready){
                        if (carco.functions.game.searchActions(item, "checkstyle")) {
                            carco.functions.game.searchActions(item, "checkstyle")({item:item, type:"remove"})
                        }else{
                            carco.functions.feedback.checkStyle[item.carco.customparams.checkstyle](item, "remove");
                        }
                        if (item.carco.customparams.gametype == "coordinate") {
                            if (item.carco.coordinateChecked) item.carco.game.coordinate("removecheck");
                        };
                    }
                }
            };
        },
        remove: function(item) {
            if (item.carco.customparams.values&&item.carco.customparams.values.valueon&&item.carco.customparams.values.valueon == true||
                item.carco.customparams.values&&item.carco.customparams.values.valueon&&item.carco.customparams.values.valueon == 1){
                if (!item.carco.customparams.checkstyle) item.carco.customparams.checkstyle = "check1_css_background";
                if (carco.functions.game.searchActions(item, "checkstyle")) {
                    carco.functions.game.searchActions(item, "checkstyle")({item:item, type:"remove"})
                }else{
                    carco.functions.feedback.checkStyle[item.carco.customparams.checkstyle](item, "remove");
                    if (item.carco.customparams.gametype == "coordinate") {
                        if (item.carco.coordinateChecked) item.carco.game.coordinate("removecheck");
                    };
                }

                if (item.carco.actions&&
                    item.carco.actions.button&&
                    item.carco.actions.button["function"]&&
                    item.carco.customparams.actions&&
                    item.carco.customparams.actions.button&&
                    item.carco.customparams.actions.button.functions&&
                    item.carco.customparams.actions.button.functions["function"]&&
                    item.carco.customparams.actions.button.functions["function"]!==""){}else{
                    if (!item.carco.customparams.autostyle) item.carco.customparams.autostyle = "button1_image_colorise";
                    if (item.carco.button&&item.carco.customparams.autostyle&&carco.functions.autostyle[item.carco.customparams.autostyle]){
                        carco.functions.autostyle[item.carco.customparams.autostyle](item);
                    };
                }

            };
        }
    },
    checkwhen: {
        always: function(item) {
            return true
        },
        onlytrue: function(item){
            if (item.carco.game.value&&item.carco.game.value > 0) {
                return true
            };
        },
        onlyfalse: function(item){
            if (item.carco.game.value == 0) {
                return true
            };
        },
        not_inner_onlyfalse: function(item){
            if (!item.carco.game.inners||item.carco.game.inners&&!item.carco.game.inners[0]) {
                if (item.carco.game.value == 0) {
                    return true
                };
            };
        },
        when_inner: function(item){
            if (item.carco.game.inners&&item.carco.game.inners[0]) {
                return true
            };
        },
        when_inner_only_false: function(item){
            if (item.carco.game.inners&&item.carco.game.inners[0]&&item.carco.game.value == 0) {
                return true
            };
        },
        when_inner_and_sol_only_false: function(item){
            if (item.carco.root.carco.customparams.feedbackon == "all") {
                if (item.carco.game.inners&&item.carco.game.inners[0]&&item.carco.game.value == 0) {
                    return true
                };
            };
        },
        when_inner_and_sol_only: function(item){
            if (item.carco.root.carco.customparams.feedbackon == "all") {
                if (item.carco.game.inners&&item.carco.game.inners[0]) {
                    return true
                };
            };
        },
        always_sol_only: function(item){
            if (item.carco.root.carco.customparams.feedbackon == "all") {
                return true
            };
        },
        when_inner_sol_always: function(item){
            if (item.carco.root.carco.customparams.feedbackon !== "all") {
                if (item.carco.game.inners&&item.carco.game.inners[0]) {
                    return true
                };
            }else{
                return true;
            };
        }

    },
    solutionsstyle: {
        none: function(item, type) {},
        sol1_css_background: function(item, type) {
            item.carco.setStyle({background:'#4ba849'});
            setTimeout(function() {
                item.carco.getChildren({equal:{type:"text"}, call:{setStyle:{color:"#FFFFFF"}}});
            },100)
        },
        sol2_pulse_image: function(item, type) {
            var pulseimage = item.carco.getChildren({equal:{type:"image", customparams:{pulseimage:1}}})[0];
            if (pulseimage){
                newitem = pulseimage;
            }else{
                var image = item.carco.getChildren({equal: {type: "image"}})[0]
                var newitem = image.carco.duplicate()
                var mathjaxs =item.carco.getChildren({equal:{customparams:{mathjax:true}}, type:"item"});
                if (mathjaxs.length == 0) mathjaxs = item.carco.getChildren({equal:{customparams:{mathjax:1}}, type:"item"});
                if (mathjaxs.length>0){
                    for (var i = 0; i < mathjaxs.length; i++){
                        mathjaxs[i].carco.parent.carco.setStyle({zIndex:1});
                    };
                };
                image.style.opacity = 0;
                var plus = 100
                image.carco.scale.type = {};
                if (item.carco.root.carco.colorisetype !== "svg"){
                    image.carco.setSize({width: image.carco.parent.carco.size.width+(plus*item.carco.parent.carco.scale.x), height: image.carco.parent.carco.size.height+(plus*item.carco.parent.carco.scale.y)})
                    image.carco.setPosition({relative:{x:-((plus+25)/2)*item.carco.parent.carco.scale.x, y:-(plus/2)*item.carco.parent.carco.scale.y}})
                    image.carco.resize();
                }else{
                    var widthplus = 10;
                    var heightplus = 10;
                };
            };

            function colorise (){
                if (!pulseimage){
                    if (image.carco.colorise){
                        image.carco.colorise({colorise:"#4ba849"});
                        if (image.carco.svgdef) {
                            image.carco.svgdef.style.zIndex = 0;
                            var plus = 30;
                            var widthplus = ((((item.carco.size.width+plus)/item.carco.size.width))*100)-100;
                            var heightplus = ((((item.carco.size.height+plus)/item.carco.size.height))*100)-100;
                            image.carco.style.width = image.carco.style.width * ((widthplus/100)+1)
                            image.carco.style.height = image.carco.style.height * ((heightplus/100)+1)
                            image.carco.svgdef.style.width = (100 + widthplus) + "%"
                            image.carco.svgdef.style.height = (100 + heightplus) + "%"
                            image.carco.svgdef.style.left = (-widthplus/2) +"%"
                            image.carco.svgdef.style.top = (-heightplus/2) +"%"
                            image.carco.pulseimage = true;
                        };
                    }else{
                        setTimeout(function() {colorise()},200);
                    };
                };
                if (carco.functions.browser.IE() == 10&&carco.functions.isMobile.any()||carco.functions.browser.IE() == 11&&carco.functions.isMobile.IeMobile()) {}else{
                    if (image&&image.carco.svgdef||pulseimage&&pulseimage.carco.svgdef) {
                        if (pulseimage) image = pulseimage
                        pulse(image.carco.svgdef, image.carco.id)
                    }else{
                        pulse(image)
                    };
                };
            };
            setTimeout(function() {colorise()},200)
            if (!item.carco.root.carco.intervals) item.carco.root.carco.intervals = {};
            function pulse(item, id){
                var alpha = 1;
                var change = 0.25
                if (item&&!item.carco) {
                    item.carco = {};
                    item.carco.root = image.carco.root;
                };
                if (item){
                    if (!id) id = item.carco.id;
                    if (item.carco.root.carco.intervals[id+"pulse"]) {
                        clearInterval(item.carco.root.carco.intervals[id+"pulse"])
                        item.carco.root.carco.intervals[id+"pulse"] = null
                    };
                    if (!item.carco.root.carco.intervals[id+"pulse"]){
                        item.carco.root.carco.intervals[id+"pulse"] = setInterval(function() {
                            if (item) item.style.opacity = alpha;
                            alpha = alpha + change;
                            if (alpha>1||alpha<0.20) change = change * -1;
                            if (alpha>1) alpha = 1;
                            if (alpha<0) alpha = 0;
                        },50)
                    };
                    setTimeout(function() {
                        if (item) clearInterval(item.carco.root.carco.intervals[id+"pulse"])
                        if (item) item.style.opacity = 1;
                    },3000)
                };
            }
        },
        sol3_imageBg_and_text: function(item, type) {
            item.carco.game.allChildrenImageColorise({colorise:"#4ba849"});
            item.carco.getChildren({equal:{type:"text"}, call:{setStyle:{color:"#FFFFFF"}}});
        }
    },
    generatesolitem: function(item) {
        if (item&&!item.carco.game.solitem) {
            var newitem = item.carco.duplicate(item.carco.root.carco.sollayer, "sol")
            newitem.carco.setStyle({visibility:"hidden"});
            var mathjaxs = newitem.carco.getChildren({equal:{customparams:{mathjax:true}}, type:"item"});
            if (mathjaxs.length == 0) mathjaxs = newitem.carco.getChildren({equal:{customparams:{mathjax:1}}, type:"item"});
            if (mathjaxs.length>0){
                setTimeout(function() {
                    for (var i = 0; i < mathjaxs.length; i++){
                        mathjaxs[i].carco.setStyle({visibility:"hidden"});
                    };
                },100)
            };
            if (!newitem.carco.customparams) newitem.carco.customparams = {};
            if (!newitem.carco.originalcustomparams) newitem.carco.originalcustomparams = {};
            newitem.carco.customparams.solitem = item.carco.id;
            newitem.carco.originalcustomparams.solitem = item.carco.id;
            newitem.carco.setPosition({relative: {x:0, y:0}})
            newitem.carco.resize()
            if (item.carco.root.carco.paramsdata.system.usertype == "editor") item.carco.root.carco.getEditor(newitem);
            item.carco.game.solitem = newitem;
        }
        if (!item) {
            return item;
        }else{
            return item.carco.game.solitem;
        };
    },
    solutionslayer: function(item){
        if (!item.carco.sollayer) {
            item.carco.sollayer = item.carco.add("container", false);
            item.carco.sollayer.carco.scale = {type:"fitinternal"}
            item.carco.sollayer.carco.position = {type:{x:"center", y:"center"}}
            item.carco.sollayer.carco.setSize({width: 3150, height: 1350});
            item.carco.sollayer.carco.resize("save")
            item.carco.sollayer.carco.customparams.gametype = "random_mix_sort_cont";
            item.carco.sollayer.carco.customparams.sollayer = true;
            item.carco.sollayer.carco.originalcustomparams.gametype = "random_mix_sort_cont";
            carco.functions.game.getGame(item.carco.sollayer);
            item.carco.sollayer.carco.originalcustomparams.sollayer = true;
            item.carco.sollayer.carco.addtools = false;
            item.carco.sollayer.carco.setStyle({background:"rgba(51, 51, 51, 0.74)", visibility:"hidden",  zIndex:5000000+3}, true)
            item.carco.sollayer.carco.resize("save")
        }else{
            item.carco.sollayer.carco.setStyle({background:"rgba(51, 51, 51, 0.74)", visibility:"hidden",  zIndex:5000000+3}, true)
        }
        var params = {children:"children", equal:{type:"container"}, type:"item"}
        if (item.carco.sollayer.carco.game) item.carco.sollayer.carco.game.innersPosition(params, true);
    },
    endlayer: function(item){
        if (item.carco.paramsdata.system.usertype == "user") {
            item.carco.endlayer = item.carco.add("container", false);
            item.carco.endlayer.carco.scale = {type:"fitinternal"}
            item.carco.endlayer.carco.position = {type:{x:"center", y:"center"}}
            item.carco.endlayer.carco.setSize({width: 3150, height: 1350});
            item.carco.endlayer.carco.resize("save")
            item.carco.endlayer.carco.addtools = false;
            if (carco.functions.browser.IE() == 10&&carco.functions.isMobile.any()||
                carco.functions.browser.IE() == 11&&carco.functions.isMobile.IeMobile()) {
                carco.functions.listeners.add(item.carco.endlayer, "MSPointerDown", function(){});
            };
            item.carco.endlayer.carco.setStyle({background:"transparent", visibility:"hidden",  zIndex:5000000+1000000}, true)
            item.carco.endlayer.carco.resize()
        }
    },
    solutionstype: {
        none: function(item){
            return false;
        },
        missingitems: function(item){
            return item.carco.game.solution.missingitems
        },
        sortedallitems: function(item){
            return item.carco.game.solution.sortedallitems
        },
        min: function(item){
            return item.carco.game.solution.min
        },
        min_missing: function(item){
            return item.carco.game.solution.min_missing
        },
        max: function(item){
            return item.carco.game.solution.max
        },
        action_false_first_item: function(item){
            return item.carco.game.solution.action_false_first_item
        },
        action_false_allitemsallclones: function(item){
            return item.carco.game.solution.action_false_allitemsallclones
        },
        allitemsallclones: function(item){
            return item.carco.game.solution.allitemsallclones
        },
        returnaction: function(item){
            return item.carco.game.solution.returnaction;
        },
        allitemsfalse: function(item){
            return item.carco.game.solution.allitemsfalse;
        },
        allitemsfalsefirst: function(item){
            return item.carco.game.solution.allitemsfalsefirst;
        },
        allfalsecloneitemsclonenumber: function(item){
            return item.carco.game.solution.allfalsecloneitemsclonenumber;
        }
    },
    solution: {
        add: function(item) {
            var solitems = [];
            if (item.carco.customparams.values&&item.carco.customparams.values.valueon&&item.carco.customparams.values.valueon == true||
                item.carco.customparams.values&&item.carco.customparams.values.valueon&&item.carco.customparams.values.valueon == 1){
                if (item.carco.game.value == 0) {
                    if (!item.carco.customparams.solutionsstyle) item.carco.customparams.solutionsstyle = "none";
                    if (!item.carco.customparams.solutionstype) item.carco.customparams.solutionstype = "none";

                    if (!item.carco.customparams.solutionplaceid) item.carco.customparams.solutionplaceid = [];
                    if (typeof item.carco.customparams.solutionplaceid == "string") item.carco.customparams.solutionplaceid = [item.carco.customparams.solutionplaceid];

                    var solutiontoobject =  item.carco.customparams.solutiontoobject;

                    var solutionsetinner =  item.carco.customparams.solutionsetinner;
                    var items = carco.functions.feedback.solutionstype[item.carco.customparams.solutionstype](item);
                    if (!item.carco.game.solutionitems) item.carco.game.solutionitems = [];
                    if (!item.carco.game.solutionitems) {
                        carco.functions.feedback.solution.remove(item);
                    };
                    if (!items) var items = [];
                    for (var i = 0; i < items.length; i++){
                        var solutionplaceitems = [];
                        for (var s = 0; s < item.carco.customparams.solutionplaceid.length; s++){
                            if (item.carco.root.carco.recursivechildren[item.carco.customparams.solutionplaceid[s]]) solutionplaceitems.push(item.carco.root.carco.recursivechildren[item.carco.customparams.solutionplaceid[s]]);
                        };
                        if (solutiontoobject == true) {
                            solutionplaceitems.push(items[i])
                        };
                        for (var p = 0; p < solutionplaceitems.length; p++){
                            var generatesolitem = carco.functions.feedback.generatesolitem(items[i]);
                            if (generatesolitem){
                                var newitem = generatesolitem.carco.duplicate(solutionplaceitems[p], "sol1");
                                newitem.carco.customparams.solduplicate = generatesolitem.carco.id;
                                solitems.push([newitem, item, items[i]]);

                                if (solutionsetinner == true&&solutionplaceitems[p].carco.game&&solutionplaceitems[p].carco.game.setInner&&solutionplaceitems[p].carco.customparams.gametype == "place"||
                                    solutionsetinner == true&&solutionplaceitems[p].carco.game&&solutionplaceitems[p].carco.game.setInner&&solutionplaceitems[p].carco.customparams.gametype == "coordinate"){
                                    solutionplaceitems[p].carco.game.setInner(newitem, "sol")
                                };

                                newitem.carco.setStyle({visibility:"hidden", zIndex:5000001})
                                newitem.carco.setPosition({relative: {x:0, y:0}, type:{}})
                                if (items[i].carco.game.replacesolinputtext) {
                                    var text = newitem.carco.getChildren({equal:{type:"text"}});
                                    if (text&&text[0]){
                                        text[0].carco.innerHTML(items[i].carco.game.replacesolinputtext, "save")
                                    };
                                };

                                var text = items[i].carco.getChildren({equal:{type:"text"}});
                                if (text&&text[0]){
                                    for (var s = 0; s < text.length; s++){
                                        if (!isNaN(Number(text[s].carco.customparams.innerHTML))){
                                            text[s].carco.innerHTML(text[s].carco.customparams.innerHTML.toString().replace(/\./g, ","))
                                        };
                                    };
                                };
                                item.carco.game.solutionitems.push(newitem);
                                if (solutionsetinner == true&&solutionplaceitems[p].carco.game.innersPosition&&solutionplaceitems[p].carco.customparams.gametype == "place"||
                                    solutionsetinner == true&&solutionplaceitems[p].carco.game.innersPosition&&solutionplaceitems[p].carco.customparams.gametype == "coordinate") {
                                    solutionplaceitems[p].carco.game.innersPosition();
                                }else{
                                    if (solutionplaceitems[p].carco.customparams.autopositionchildren){
                                        var params = {children:"children", equal:{type:"container"}, type:"item"}
                                        solutionplaceitems[p].carco.game.innersPosition(params, true);
                                    };
                                };
                                if (!item.carco.customparams.solposition) item.carco.customparams.solposition = {};
                                if (!newitem.carco.customparams.addpoints) newitem.carco.setPosition(item.carco.customparams.solposition)
                                newitem.carco.resize();
                                carco.functions.game.language(newitem)
                            };
                        };
                    };
                    if (item.carco.root.carco.paramsdata.system.usertype !== "user") {
                        var params = {children:"children", equal:{type:"container"}, type:"item"}
                        item.carco.root.carco.sollayer.carco.game.innersPosition(params, true);
                    };

                };
            };
            return solitems;
        },
        remove: function(item) {
            if (item.carco.customparams.values&&item.carco.customparams.values.valueon&&item.carco.customparams.values.valueon == true||
                item.carco.customparams.values&&item.carco.customparams.values.valueon&&item.carco.customparams.values.valueon == 1){
                if (item.carco.game.solutionitems){
                    for (var i = 0; i < item.carco.game.solutionitems.length; i++){
                        if (item.carco.game.solutionitems[i].carco.parent.carco.game&&item.carco.game.solutionitems[i].carco.parent.carco.game.removeInner){
                            item.carco.game.solutionitems[i].carco.parent.carco.game.removeInner(item.carco.game.solutionitems[i], "sol");
                        };
                        item.carco.game.solutionitems[i].carco.parent.carco.removeChild(item.carco.game.solutionitems[i]);
                    };
                    item.carco.game.solutionitems = [];
                };
            };
        }
    }
};

carco.functions.color = {
    hexToRgb: function(hex) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
}

carco.functions.canvas = {
    stage: function(item) {
        if (item.carco.type == "image"){
            if (!item.carco.customparams) item.carco.customparams = {}
            if (!item.carco.customparams.image) item.carco.customparams.image = {}
            if (item.carco.customparams.image.src){
                var image = new carco.createjs.Bitmap(item.carco.customparams.image.src);
                image.image.onload = function() {
                    var canvas = item
                    item.carco.stage = new carco.createjs.Stage(canvas);
                    item.carco.stage.enableDOMEvents(false);
                    item.carco.stage.addChild(image);

                    function addShape(width, height, color) {
                        var g = new carco.createjs.Graphics();
                        g.beginFill(color)
                        g.drawRect(0,0,width, height)
                        g.endFill();
                        var shape = new carco.createjs.Shape(g);
                        return shape;
                    };

                    item.carco.canvasresize = function() {
                        var width = item.carco.size.realOffsetWidth
                        var height = item.carco.size.realOffsetHeight
                        if (item.carco.customparams.checkitem){
                            width = 70;
                            height = 70;
                        };
                        canvas.setAttribute("width", width)
                        canvas.setAttribute("height", height)
                        image.scaleX = width/image.image.width
                        image.scaleY = height/image.image.height

                        if (item.carco.blackimage){
                            item.carco.blackimage.scaleX = width/image.image.width;
                            item.carco.blackimage.scaleY = height/image.image.height;
                        };
                        if (item.carco.colorimage){
                            item.carco.colorimage.scaleX = width/image.image.width;
                            item.carco.colorimage.scaleY = height/image.image.height;
                        };
                        item.carco.stage.clear();
                        item.carco.stage.update();
                    };

                    item.carco.canvasresize();
                    item.carco.colorise = function(params, type) {
                        carco.functions.canvas.colorise(item.carco.stage.children[0], params, type)
                    };
                    item.carco.startColorise = function(){
                        carco.functions.canvas.startColorise(false, item)
                    };
                    item.carco.startColorise();
                };
            }
        };
    },
    colorise: function(item, params, type){
        if (item&&item.parent&&item.parent.canvas){
            var canvas = item.parent.canvas
            if (!canvas.carco.customparams) canvas.carco.customparams = {};
            if (!canvas.carco.originalcustomparams) canvas.carco.originalcustomparams = {};
            if (!canvas.carco.customparams.filters) canvas.carco.customparams.filters = {};
            if (!canvas.carco.filters) canvas.carco.filters = [];

            function addShape(width, height, color) {
                var g = new carco.createjs.Graphics();
                g.beginFill(color)
                g.drawRect(0,0,width, height)
                g.endFill();
                var shape = new carco.createjs.Shape(g);
                return shape;
            };

            var filterparams = canvas.carco.customparams.filters;
            if (!filterparams.brightness) filterparams.brightness = 0;
            if (!filterparams.contrast) filterparams.contrast = 0;
            if (!filterparams.saturation) filterparams.saturation = 0;
            if (!filterparams.hue) filterparams.hue = 0;
            if (!filterparams.blurx) filterparams.blurx = 0;
            if (!filterparams.blury) filterparams.blury = 0;
            if (!filterparams.red) filterparams.red = 255;
            if (!filterparams.green) filterparams.green = 255;
            if (!filterparams.blue) filterparams.blue = 255;
            if (!filterparams.colorise) filterparams.colorise = false;
            if (!filterparams.colorisealpha) filterparams.colorisealpha = false;

            if (!canvas.carco.originalcustomparams.filters) canvas.carco.originalcustomparams.filters = carco.functions.object.clone(filterparams);

            if (params){
                for (var x in params){
                    canvas.carco.customparams.filters[x] = params[x];
                };
            };

            var filterparams = canvas.carco.customparams.filters;

            var brightnessValue = filterparams.brightness;
            var contrastValue =  filterparams.contrast;
            var saturationValue =  filterparams.saturation;
            var hueValue = filterparams.hue;
            var blurXValue = filterparams.blurx;
            var blurYValue = filterparams.blury;
            var redChannelValue = filterparams.red;
            var greenChannelValue = filterparams.green;
            var blueChannelValue = filterparams.blue;
            var colorise = filterparams.colorise;
            var colorisealpha = filterparams.colorisealpha;

            canvas.carco.filters = [];
            var filters = canvas.carco.filters;

            if (colorise) {
                var color = colorise;
                var hextorgb = carco.functions.color.hexToRgb

                if (!item.parent.canvas.carco.colorimage){
                    item.parent.canvas.carco.colorimage = new addShape(item.image.width, item.image.height, "#4ba849");
                    item.parent.canvas.carco.colorimagelastcolor = "#4ba849";
                    if (type!=="eco"){
                        item.parent.canvas.carco.colorimage.filters = [new carco.createjs.AlphaMaskFilter(item.image)];
                        item.parent.canvas.carco.colorimage.cache(0, 0, item.image.width, item.image.height);
                    };
                    item.parent.canvas.carco.colorimage.alpha = 0;
                    item.parent.addChild(item.parent.canvas.carco.colorimage);
                    var width = item.parent.canvas.carco.size.realOffsetWidth
                    var height = item.parent.canvas.carco.size.realOffsetHeight
                    item.parent.canvas.carco.colorimage.scaleX = width/item.image.width;
                    item.parent.canvas.carco.colorimage.scaleY = height/item.image.height;
                };

                if (item.parent.canvas.carco.colorimage){
                    if (item.parent.canvas.carco.colorimagelastcolor !== color){
                        item.parent.canvas.carco.colorimage.graphics.clear().beginFill(color).drawRect(0,0,item.image.width, item.image.height)
                        item.parent.canvas.carco.colorimage.cache(0, 0, item.image.width, item.image.height);
                        item.parent.canvas.carco.colorimage.alpha = 1;
                        item.parent.canvas.carco.colorimagelastcolor = color;
                    };
                    if (!colorisealpha) colorisealpha = 1;
                    if (colorisealpha) item.parent.canvas.carco.colorimage.alpha = colorisealpha;
                }else{
                    filters.push(new carco.createjs.ColorFilter(0,0,0,1, hextorgb(color).r, hextorgb(color).g, hextorgb(color).b, 1));
                };
            }else{
                if (item.parent.canvas.carco.colorimage) item.parent.canvas.carco.colorimage.alpha = 0;
                if (brightnessValue||contrastValue||saturationValue||hueValue){
                    if (contrastValue||saturationValue||hueValue||brightnessValue>0){
                        cm = new carco.createjs.ColorMatrix();
                        cm.adjustColor(brightnessValue, contrastValue, saturationValue, hueValue);
                        filters.push(new carco.createjs.ColorMatrixFilter(cm))
                    }else{
                        var AlphaBrightnessValue = (brightnessValue/-100);
                        if (!item.parent.canvas.carco.blackimage){
                            item.parent.canvas.carco.blackimage = new addShape(item.image.width, item.image.height, "#000000");
                            if (type!=="eco"){
                                item.parent.canvas.carco.blackimage.filters = [new carco.createjs.AlphaMaskFilter(item.image)];
                                item.parent.canvas.carco.blackimage.cache(0, 0, item.image.width, item.image.height);
                            }
                            item.parent.canvas.carco.blackimage.alpha = 0;
                            item.parent.addChild(item.parent.canvas.carco.blackimage);
                            var width = item.parent.canvas.carco.size.realOffsetWidth
                            var height = item.parent.canvas.carco.size.realOffsetHeight
                            item.parent.canvas.carco.blackimage.scaleX = width/item.image.width;
                            item.parent.canvas.carco.blackimage.scaleY = height/item.image.height;
                        };
                        if (item.parent.canvas.carco.blackimage){
                            item.parent.canvas.carco.blackimage.alpha = AlphaBrightnessValue;
                        };
                    };
                }else{

                    if (brightnessValue == 0&&item.parent.canvas.carco.blackimage){
                        item.parent.canvas.carco.blackimage.alpha = 0;
                    };
                };
                if (redChannelValue !== 255) filters.push(new carco.createjs.ColorFilter(redChannelValue/255,1,1,1))
                if (greenChannelValue !== 255) filters.push(new carco.createjs.ColorFilter(1,greenChannelValue/255,1,1))
                if (blueChannelValue !== 255) filters.push(new carco.createjs.ColorFilter(1,1,blueChannelValue/255,1))
            };

            if (blurXValue||blurYValue) filters.push(new carco.createjs.BlurFilter(blurXValue,  blurYValue, 2))

            item.filters = filters
            item.cache(0, 0, item.image.width, item.image.height);
            item.updateCache();

            canvas.carco.stage.update();

            if (type == "save"){
                if (!canvas.carco.originalcustomparams) canvas.carco.originalcustomparams = {}
                canvas.carco.originalcustomparams.filters = carco.functions.object.clone(canvas.carco.customparams.filters)
            }
        };
    },
    startColorise: function(root, item){
        if (root) var allimage = root.carco.getChildren({equal:{type:"image"}, type:"item"});
        if (item) var allimage = [item];
        for (var i = 0; i < allimage.length; i++) {
            if (allimage[i].carco.customparams&&allimage[i].carco.customparams.filters){
                if (allimage[i].carco.customparams.filters.brightness&&allimage[i].carco.customparams.filters.brightness !== 0||
                    allimage[i].carco.customparams.filters.contrast&&allimage[i].carco.customparams.filters.contrast !== 0||
                    allimage[i].carco.customparams.filters.saturation&&allimage[i].carco.customparams.filters.saturation !== 0||
                    allimage[i].carco.customparams.filters.hue&&allimage[i].carco.customparams.filters.hue !== 0||
                    allimage[i].carco.customparams.filters.blurx&&allimage[i].carco.customparams.filters.blurx !== 0||
                    allimage[i].carco.customparams.filters.blury&&allimage[i].carco.customparams.filters.blury !== 0||
                    allimage[i].carco.customparams.filters.red&&allimage[i].carco.customparams.filters.red !== 255 ||
                    allimage[i].carco.customparams.filters.blue&&allimage[i].carco.customparams.filters.blue !== 255 ||
                    allimage[i].carco.customparams.filters.green&&allimage[i].carco.customparams.filters.green !== 255 ||
                    allimage[i].carco.customparams.filters.colorise&&allimage[i].carco.customparams.startcolorise||
                    allimage[i].carco.customparams.startsvg) {
                    if (allimage[i].carco.originalcustomparams&&allimage[i].carco.originalcustomparams.filters) {
                        if (allimage[i].carco.colorise) allimage[i].carco.colorise(false);
                    }else{
                        if (allimage[i].carco.colorise) allimage[i].carco.colorise(false, "save");
                    };
                }
            }
        };
    }
};

carco.functions.math = {
    generate: function(min, max){
        return Math.random() * (max - min) + min;
    },
    generateFromArray: function(array){
        var min = 0;
        var max = array.length;
        var index = Math.floor(Math.random() * (max - min)) + min;
        return array[index];
    },
    generateMoreNumbers: function(params, item){
        var params = params;
        if (!params.arrays) params.arrays = [];
        for (var a = 0; a < params.types.length; a++) {
            if (params.types[a] == "m"){
                var array = [];
                if (!params.arrays[a]) params.arrays[a] = params.globalarray;
                for (var b = params.arrays[a][0]; b < params.arrays[a][1]+1; b++) {
                    array.push(b);
                };
                params.arrays[a] = array;
            };
        };
        var combinations = carco.functions.array.combinations(params.arrays)
        if (!params.mix) params.mix = false;
        if (params.mix) combinations = carco.functions.array.shuffle(combinations);

        if (!params.conditions) params.conditions = [];
        if (!params.r) params.r = "all";
        var conditionstrue = [];

        for (var b = 0; b < params.conditions.length; b++) {
            if (isNaN(Number(params.conditions[b][0]))){
                var indexs = params.conditions[b][0].match(/\w+/g);
                var nonwords = params.conditions[b][0].match(/\W+/g);
                params.conditions[b][0] = [indexs, nonwords]
            };
            if (isNaN(Number(params.conditions[b][1]))){
                var indexs = params.conditions[b][1].match(/\w+/g);
                var nonwords = params.conditions[b][1].match(/\W+/g);
                params.conditions[b][1] = [indexs, nonwords]
            };
        };

        for (var a = 0; a < combinations.length; a++) {
            var condition = true;
            for (var b = 0; b < params.conditions.length; b++) {

                var first = combinations[a][params.conditions[b][0]];
                var second = combinations[a][params.conditions[b][1]];

                function stringToNumber(input){
                    var indexs = input[0];
                    var nonword = input[1];
                    var string = "";
                    for (var c = 0; c < indexs.length; c++) {
                        string = string + combinations[a][indexs[c]];
                        if (nonword[c]) string = string + nonword[c];
                    };
                    return eval(string);
                };

                if (!first) first = stringToNumber(params.conditions[b][0]);
                if (!second) second = stringToNumber(params.conditions[b][1]);

                var smaler = (first < second);
                var bigger = (first > second);
                var equal = (first == second);
                var nonequal = (first !== second);
                var smalerequal = (first <= second);
                var biggerequal = (first >= second)
                if (params.conditions[b][2] == "<"&&!smaler) condition = false;
                if (params.conditions[b][2] == ">"&&!bigger) condition = false;
                if (params.conditions[b][2] == "="&&!equal) condition = false;
                if (params.conditions[b][2] == "!="&&!nonequal) condition = false;
                if (params.conditions[b][2] == "<="&&!smalerequal) condition = false;
                if (params.conditions[b][2] == ">="&&!biggerequal) condition = false;
            };
            if (condition) conditionstrue.push(combinations[a]);
            if (!isNaN(Number(params.r))&& conditionstrue.length == Number(params.r)) break;
        };
        if (item&&item.carco){
            if (!item.carco.game) item.carco.game = {};
            item.carco.game.mathgenerate = conditionstrue;
        }else{
            return conditionstrue;
        };
    }
}

carco.functions.Math = carco.functions.math;

carco.functions.json = {
    send: function(params) {
        var xml = new XMLHttpRequest();
        xml.params = params;
        xml.onreadystatechange = function(data) {
            if (xml.readyState != 4)  { return; };
            if (params.type == "json"){
                if (xml.responseText !== ""){
                    var serverResponse = JSON.parse(xml.responseText);
                    for (var x in serverResponse){
                        params.output[x] = serverResponse[x];
                    };
                    params.callback(data);
                }
            }else{
                params.callback(data);
            };
        };
        if (!params.type) params.type = "json";

        if (params.type == "json"){
            xml.open("POST", params.url);
            xml.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xml.send(JSON.stringify(params.input));
        };

        if (params.type == "file"){
            var fd = new FormData();
            fd.append("file", params.input);
            xml.open("POST", params.url, true);
            xml.send(fd);
        };
    }
};

carco.functions.player = {
    get: function(item) {

        var player = carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-player"}});
        var item1 = player.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-flex-container"}}))
        var item2 = item1.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg drwmsg-flex-item"}}))
        var item3 = item2.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-player-header "}}))
        var item4 = item3.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-player-header-bg"}}))
        var item5 = item3.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-player-header-content"}}))
        var item6 = item5.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-player-title"}}))
        var item7 = item5.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-progress-bar-distinct"}}))
        var item8 = item5.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-navigation"}}))
        var item9  = item8.appendChild(carco.functions.children.createHTML({type:"ul", attr:{class:"drwmsg-nav_ul"}, vars:{innerHTML:"English"}}))
        var item10 = item8.appendChild(carco.functions.children.createHTML({type:"ul", attr:{class:"drwmsg-nav_ul drwmsg-nav_ul_change_left"}, vars:{innerHTML:"Magyar"}}))
        var item11 = item8.appendChild(carco.functions.children.createHTML({type:"ul", attr:{class:"drwmsg-nav_ul"}, vars:{innerHTML:"Info"}}))
        var item12 = item8.appendChild(carco.functions.children.createHTML({type:"ul", attr:{class:"drwmsg-nav_ul"}, vars:{innerHTML:"Tanároknak"}}))
        var item13 = item8.appendChild(carco.functions.children.createHTML({type:"ul", attr:{class:"drwmsg-nav_ul"}, vars:{innerHTML:"Diákoknak"}}))
        var item14 = item2.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-game-header"}}))
        var item15 = item14.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-game-title-box"}}))
        var item16 = item15.appendChild(carco.functions.children.createHTML({type:"span", attr:{class:"drwmsg-title-spacer"}}))
        var item17 = item16.appendChild(carco.functions.children.createHTML({type:"span", attr:{class:"drwmsg-game-title"}}))
        var item18 = item14.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-check-box"}}))
        var item19 = item18.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-nav_ul nextbutton"}, vars:{innerHTML:"Tovább"}}))
        var item20 = item18.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-nav_ul solutionbutton"}, vars:{innerHTML:"Megoldás"}}))
        var item21 = item18.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-nav_ul checkbutton"}, vars:{innerHTML:"Ellenőrzés"}}))
        var item21a = item18.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-nav_ul restartbutton"}, vars:{innerHTML:"Újra"}}))
        var item22 = item18.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-nav_ul drwmsg-nav_ul_active"}}))
        var item23 = item22.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-inline-box"}, vars:{innerHTML:"Eredmény: "}}))
        var item24 = item22.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-inline-box"}, vars:{innerHTML:"0"}}))
        var item25 = item22.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-inline-box"}, vars:{innerHTML:"/"}}))
        var item26 = item22.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-inline-box"}, vars:{innerHTML:"0"}}))
        var item27 = item2.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-gamein"}}))
        var item28 = item27.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg drwmsg-flex-item"}}))
        var item29 = item27.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-preload_layer"}}))
        var item30 = player.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-layer"}}))
        var item31 = player.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-endscreen"}}))
        var item32 = item31.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg_endscreen_outcome"}}))
        var item32a = item31.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg_endscreen_scores"}}))
        var item33 = item31.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg_endscreen_percent"}}))
        var item34 = item31.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg_endscreen_text"}}))
        var item35 = item31.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-bton drwmsg-bton_center"}}))
        var item36 = player.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-endscreen"}}))
        var item37 = item36.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-info_change_buttons"}}))
        var item38 = item37.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-bton drwmsg-bton_change_left"}}))
        var item39 = item37.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-bton drwmsg-bton_change_right"}}))
        var item40 = item36.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-info_info"}}))
        var item41 = item36.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-info_for"}}))
        var item42 = item36.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-info_info"}}))
        var item43 = item36.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-info_for"}}))
        var item44 = item36.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-bton drwmsg-info_restart_button"}}))
        var item45 = item1.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-layers drwmsg-flex-item"}}))

        var item46 = item18.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-nav_ul drwmsg-game-title-audio"}, vars:{innerHTML:""}}))
        var item47 = item36.appendChild(carco.functions.children.createHTML({type:"div", attr:{class:"drwmsg-game-title-audio drwmsg-game-student-audio"}, vars:{innerHTML:""}}))

        item.appendChild(player);

        for (var x in item.attributes){
            if (item.getAttribute(item.attributes[x].name)&&item.attributes[x].name!=="class"&&item.attributes[x].name!=="id"){
                item28.setAttribute(item.attributes[x].name, item.attributes[x].value)
            };
        };

        var playeritems = {
            player: player,
            root: item28,
            layers: item45,
            scorebar: item22,
            scoretitle: item23,
            allscore: item26,
            userscore: item24,
            tracksbar: item7,
            checkbutton: item21,
            restartbutton: item21a,
            solutionbutton: item20,
            nextbutton: item19,
            endscreen: item31,
            endscreen_outcome: item32,
            endscreen_scores: item32a,
            endscreen_percent: item33,
            endscreen_text: item34,
            endscreen_restart: item35,
            blacklayer: item30,
            playerheader: item3,
            playertitle: item6,
            gametitle: item17,
            gametitle_box: item15,
            langbutton_hu: item10,
            langbutton_en: item9,
            students_button: item13,
            teachers_button: item12,
            info_button: item11,
            infoscreen: item36,
            info_students_button: item38,
            info_teachers_button: item39,
            info_close_button: item44,
            info_forstudents: item41,
            info_forteachers: item43,
            info_infostudents: item40,
            info_infoteachers: item42,
            preload_layer: item29,
            checkbox: item18,
            navigation: item8,
            playertitleaudio: item46,
            playerstudentaudio: item47
        };

        return playeritems;
    }
}

//kiop embed

carco.functions.kiopembed = {
    init: function(root) {
        if (window.parent) {
            root.carco.paramsdata.user.kiop = true;
            if (root.carco.playeritems.tracksbar&&root.carco.paramsdata.user.feedbacktype == "test") 
                root.carco.playeritems.tracksbar.style.display = "none";
        }
    },
    get: function(root) {
        if (window.parent && root.carco.paramsdata.user.kiop) {
            if (root.carco.paramsdata.user.feedbacktype == "practice") {
                window.parent.postMessage({
                    type: 'gyakorloEredmeny',
                    sessionid: root.carco.paramsdata.user.sessionid,
                    scorepercent: root.carco.scores.scorepercent
                }, '*');
            }
            if (root.carco.paramsdata.user.feedbacktype == "test") {
                window.parent.postMessage({
                    type: 'tudasprobaEredmeny',
                    sessionid: root.carco.paramsdata.user.sessionid,
                    sorszam: root.carco.paramsdata.user.sorszam,
                    scorepercent: root.carco.scores.scorepercent
                }, '*');
            }
        }
    }
};

carco.functions.microsoft =  {
    init: function(item){
        if (!item.carco.playeritemshide){
            item.carco.playeritemshide = function(params) {
                if (!params) var params = [];
                for (var i = 0; i < params.length; i++) {
                    if (item.carco.playeritems[params[i]]){
                        item.carco.playeritems[params[i]].style.display = "none";
                        item.carco.playeritems[params[i]].carco.confighidden = true;
                        item.carco.playeritems[params[i]].setAttribute("style", "display:none!important");
                    };
                };
                item.carco.playeritems.player.parentElement.style.height = "auto;";
                //item.carco.playeritems.player.parentElement.style.minHeight = 0;
                item.carco.playeritems.player.parentElement.style.maxHeight = "none";
                item.carco.playeritems.player.style.height = "auto";
                item.carco.playeritems.player.style.minHeight = 0;
                item.carco.playeritems.player.style.maxHeight = "none";
                item.carco.playeritems.preload_layer.setAttribute("style", "top:"+item.offsetTop+"px!important")
                document.body.style.maxHeight = item.carco.playeritems.player.parentElement.offsetHeight+"px";
            };
            function addType(ev, type){
                var temptype = type;
                if (!type&&item.carco.customparams.feedbackon==true) {
                    type = "showevaluation";
                };
                if (!type){
                    if (!ev){
                        var ev = {};
                        ev.target = item.carco.playeritems.checkbutton;
                    };
                    var tempfeedbackon = item.carco.customparams.feedbackon;
                    if (item.carco.customparams.feedbackon == "all"){
                        item.carco.returnscores = carco.functions.object.clone(item.carco.scores);
                        if (item.carco.ongetresult) item.carco.ongetresult(item.carco.returnscores);
                    }else{
                        if (item.carco.customparams.feedbackon == true){

                        }else{
                            item.carco.customparams.feedbackon = true;
                            var currentdrag = false;
                            if (carco.drag.currentdrag&&carco.drag.currentdrag.item) currentdrag = carco.drag.currentdrag.item;
                            if (currentdrag) currentdrag.carco.drag.inner_up_mobile(ev);
                            carco.functions.game.permutation(item);
                            item.carco.customparams.feedbackon = tempfeedbackon;
                            if (item.carco.ongetresult) item.carco.ongetresult(item.carco.returnscores);
                        };
                    };
                };
                if (type == "getresult"){
                    var tempfeedbackon = item.carco.customparams.feedbackon;
                    if (item.carco.customparams.feedbackon !== "all") {
                        item.carco.customparams.feedbackon = true;
                        var currentdrag = false;
                        if (carco.drag.currentdrag && carco.drag.currentdrag.item) currentdrag = carco.drag.currentdrag.item;
                        if (currentdrag) currentdrag.carco.drag.inner_up_mobile(ev);
                        carco.functions.game.permutation(item, "getResult");
                    };
                    item.carco.customparams.feedbackon = tempfeedbackon;
                    item.carco.returnscores = carco.functions.object.clone(item.carco.scores);
                    if (item.carco.ongetresult) item.carco.ongetresult(item.carco.returnscores);
                };
                if (type == "showevaluation"){
                    if (!ev){
                        var ev = {};
                        ev.target = item.carco.playeritems.checkbutton;
                    };
                    var memogame = false;
                    var places = item.carco.getChildren({equal:{customparams:{gametype:"place"}}, type:"item"});
                    for (var i = 0; i < places.length; i++) {
                        if (places[i].carco.customparams.memogame) memogame = true;
                    };
                    if (memogame){}else{
                        item.carco.checkfunction(ev);
                        item.carco.root.carco.ischecking = true;
                    };
                };
                if (type == "showsolution"){
                    if (!ev){
                        var ev = {};
                        ev.target = item.carco.playeritems.checkbutton;
                        ev.callmicrosoft = true;
                    }else{
                        ev.callmicrosoft = true;
                    };
                    item.carco.solutionfunction(ev);
                };
                if (type !== "getresult") item.carco.game.scores("getResult");
                item.carco.returnscores = carco.functions.object.clone(item.carco.scores);
                return item.carco.returnscores;

            };
            item.carco.getResult = function(ev) {
                return addType(ev, "getresult");
            };
            item.carco.showEvalution = function(ev) {
                return addType(ev, "showevaluation");
            };
            item.carco.showSolution = function(ev) {
                return addType(ev, "showsolution");
            };
            item.carco.isReady = function(callback) {
                var interval = setInterval(function(){
                    if (item.carco.game&&item.carco.game.isReadyLoad){
                        clearInterval(interval);
                        if (callback) callback();
                    };
                },100)
            };
        }
    }
}

carco.functions.audio = {
    init:function(src, item) {
        var audio = document.createElement('audio');

        var source = document.createElement('source');
        source.setAttribute("src", src);
        source.setAttribute("type", "audio/mpeg");
        audio.appendChild(source);

        item.appendChild(audio);
        carco.container(audio);
        audio.carco.source = source;
        return audio;
    }
};


carco.functions.game = {
    types: {
        none: function() {return null},
        audio: function(item) {
            return {
                item: item,
                loadAudio: function(params, type){
                    carco.functions.game.loadAudio(item, params, type)
                }
            }
        },
        coordinate: function(item) {
            if (!item.carco.game) item.carco.game = {};
            if (!item.carco.game.coordinate){
                item.carco.game.coordinate = function() {
                    carco.functions.game.coordinate(item)
                };
            };
            item.carco.game.coordinate();
            return {
                item: item,
                setInner: function(inner, type){
                    var inners = carco.functions.game.setInner(item, inner, type)
                    return inners;
                },
                removeInner: function(inner, type){
                    var inners = carco.functions.game.removeInner(item, inner, type)
                    return inners;
                },
                valueTrueOrFalse: function(type, input){
                    carco.functions.game.valueTrueOrFalse(item, type, input);
                },
                actions: function(params, type){
                    carco.functions.game.actions(item, params, type)
                },
                values: function(params, save, type){
                    carco.functions.game.values(item, params, save, type)
                },
                coordinate: function(type) {
                    carco.functions.game.coordinate(item, type)
                },
                innersPosition: function(params, savetype){
                    carco.functions.game.innersPosition(item, params, savetype);
                }
            };
        },
        solutionitem: function(item) {
            return {
                allChildrenImageColorise: function(params, trynumber) {
                    carco.functions.game.allChildrenImageColorise(item, params, trynumber)
                },
                setOriginal: function(position){
                    carco.functions.game.setOriginal(item, position);
                },
                innersPosition: function(params, savetype){
                    carco.functions.game.innersPosition(item, params, savetype);
                },
                setPosition: function(place, params, savetype){
                    carco.functions.game.setPosition(item, place, params, savetype);
                },
                setSize: function(place){
                    carco.functions.game.setSize(item, place);
                }
            };
        },
        random_mix_sort_cont: function(item) {
            return {
                innersPosition: function(params, savetype){
                    carco.functions.game.innersPosition(item, params, savetype);
                },
                mix: function(mixtype){
                    carco.functions.game.mix(item, mixtype);
                },
                mathgenerate: function(){
                    carco.functions.game.mathgenerate(item);
                },
                textarray: function() {
                    carco.functions.game.textarray(item);
                },
                selectbox: function() {
                    carco.functions.game.selectbox(item);
                },
                scrollbox: function() {
                    carco.functions.game.scrollbox(item);
                },
                processbox: function(buttonitem) {
                    carco.functions.game.processbox(item, buttonitem);
                }
            };
        },
        place: function(item) {
            if (!item.carco.customparams.multiboxmaxinner) item.carco.customparams.multiboxmaxinner = 1;

            return {
                innersPosition: function(params, savetype){
                    carco.functions.game.innersPosition(item, params, savetype);
                },
                setInner: function(inner, type){
                    var inners = carco.functions.game.setInner(item, inner, type)
                    return inners;
                },
                removeInner: function(inner, type){
                    var inners = carco.functions.game.removeInner(item, inner, type)
                    return inners;
                },
                values: function(params, save, type){
                    carco.functions.game.values(item, params, save, type)
                },
                valueTrueOrFalse: function(type, input){
                    carco.functions.game.valueTrueOrFalse(item, type, input);
                },
                actions: function(params, type){
                    carco.functions.game.actions(item, params, type)
                },
                allChildrenImageColorise: function(params, trynumber) {
                    carco.functions.game.allChildrenImageColorise(item, params, trynumber)
                }
            };
        },
        placecontainer: function(item) {

            return {
                innersPosition: function(params, savetype){
                    if (item.carco.customparams.placecontainerInnersPos){
                        carco.functions.game.innersPosition(item, params, savetype);
                    };
                },
                setInner: function(inner, type){
                    var inners = carco.functions.game.setInner(item, inner, type)
                    return inners;
                },
                removeInner: function(inner, type){
                    var inners = carco.functions.game.removeInner(item, inner, type)
                    return inners;
                },
                values: function(params, save, type){
                    carco.functions.game.values(item, params, save, type)
                },
                valueTrueOrFalse: function(type, input){
                    carco.functions.game.valueTrueOrFalse(item, type, input);
                },
                actions: function(params, type){
                    carco.functions.game.actions(item, params, type)
                },
                allChildrenImageColorise: function(params, trynumber) {
                    carco.functions.game.allChildrenImageColorise(item, params, trynumber)
                },
                setPlaceContainerMaxinnersDisable: function() {
                    carco.functions.game.setPlaceContainerMaxinnersDisable(item);
                }
            };
        },
        inputtext: function(item) {
            if (!item.carco.inputtext) item.carco.inputtext = {};
            var inputtext = item.carco.getChildren({equal:{type:"inputtext"}})[0];
            item.carco.inputtext.inputitem = inputtext;

            item.carco.inputtext.maxlength = function() {
                var maxlength = item.carco.customparams.maxlength;
                if (inputtext&&maxlength) {
                    inputtext.setAttribute("maxlength", maxlength)
                };
            };

            item.carco.inputtext.keydown = function(ev){
                item.carco.inputtext.lastkeycode = ev.keyCode;
                if (carco.functions.game.searchActions(item, "keydownlistener")){
                    carco.functions.game.searchActions(item, "keydownlistener")(item);
                };
            };

            item.carco.inputtext.next = function(nextid){
                var root = item.carco.root;
                if (root.carco.recursivechildren[nextid]){
                    var next = root.carco.recursivechildren[nextid];
                    if (next.carco.inputtext&&next.carco.inputtext.inputitem) var inext = next.carco.inputtext.inputitem;
                    if (!next.carco.game.selectedinputtext&&inext){
                        next.carco.game.selectedinputtext = true;
                        if (carco.functions.isMobile.iOS()) {
                            $(inext).select();
                        }else{
                            $(inext).select();
                        };
                    };
                };
            };

            item.carco.inputtext.nextorprew = function(nextid, prewid){
                var maxlength = item.carco.customparams.maxlength;
                var inputitem = item.carco.inputtext.inputitem;
                var keycode = item.carco.inputtext.lastkeycode;
                if (inputitem){
                    var value = inputitem.value;
                    if (value.length == 0&&keycode==8&&item.carco.inputtext.lastlength !== 1){
                        if (prewid) item.carco.inputtext.next(prewid);
                    }else{
                        if (maxlength) {
                            if (value.length==maxlength){
                                if (nextid) item.carco.inputtext.next(nextid);
                            };
                        };
                    };
                    item.carco.inputtext.lastlength = value.length;
                };
            };

            item.carco.inputtext.start = function() {

                if (item.carco.inputtext.inputitem&&!item.carco.game.selectedinputtext&&item.carco.customparams.enableautofocusinputtext) {
                    item.carco.game.selectedinputtext = true;
                    if (carco.functions.isMobile.iOS()) {
                        $(item.carco.inputtext.inputitem).select();
                    }else{
                        setTimeout(function() {
                            $(item.carco.inputtext.inputitem).select();
                        })
                    };
                };

                if (item.carco.root.carco.game.process == 0){
                    item.carco.root.carco.game.process = 1;
                    item.carco.root.carco.game.player();
                };
                if (item.carco.game.inners&&item.carco.game.inners[0]){
                    for (var i = 0; i < item.carco.game.inners.length; i++){
                        carco.functions.feedback.check.remove(item.carco.game.inners[i]);
                        carco.functions.feedback.solution.remove(item.carco.game.inners[i]);
                    };
                };

                carco.functions.feedback.check.remove(item);
                carco.functions.feedback.solution.remove(item);
                var places = item.carco.customparams.placeids;
                if (typeof item.carco.customparams.placeids == "string") places = [item.carco.customparams.placeids];
                for (var i = 0; i < places.length; i++){
                    var place = item.carco.root.carco.recursivechildren[places[i]];
                    if (place){
                        carco.functions.feedback.check.remove(place);
                        carco.functions.feedback.solution.remove(place);
                    }
                }

                if (carco.functions.game.searchActions(item, "focusinlistener")){
                    carco.functions.game.searchActions(item, "focusinlistener")(item);
                };

                carco.functions.listeners.add(window, "keyup", item.carco.inputtext.keydown);

            };

            item.carco.inputtext.focusout = function(){
                item.carco.game.selectedinputtext = false;
                if (carco.functions.game.searchActions(item, "focusoutlistener")){
                    carco.functions.game.searchActions(item, "focusoutlistener")(item);
                };
                carco.functions.listeners.remove(window, "keyup", item.carco.inputtext.keydown);
            };

            item.carco.inputtext.change = function(){
                var inputtext = item.carco.inputtext.inputitem;
                item.carco.inputtext.value = "";
                if (item.carco.inputtext.timer) clearInterval(item.carco.inputtext.timer);
                if (inputtext) {
                    if (item.carco.game.inners&&item.carco.game.inners[0]){
                        carco.functions.feedback.check.remove(item.carco.game.inners[0]);
                        carco.functions.feedback.solution.remove(item.carco.game.inners[0]);
                    };
                    carco.functions.feedback.check.remove(item);
                    carco.functions.feedback.solution.remove(item);

                    item.carco.inputtext.value = inputtext.value
                    item.carco.inputtext.originalvalue = inputtext.value;
                    if (item.carco.inputtext.value&&typeof item.carco.inputtext.value == 'string'){
                        var value = item.carco.inputtext.value;
                        value = value.toLowerCase();
                        value = value.replace(/\n/g, "");
                        value = value.replace(/\+/g, "");
                        value = carco.functions.string.allReplace(value, {" ":""})
                        if (!isNaN(Number(value.replace(/\,/g, ".")))&&value !== ""){
                            value = value.replace(/\,/g, ".");
                        };
                        item.carco.inputtext.value = value;
                    };

                    if (item.carco.inputtext.value !== ""&&isNaN(Number(item.carco.inputtext.value))&&item.carco.inputtext.value * 20 == 0){
                        item.carco.inputtext.value = 0;
                    };

                    item.carco.inputtext.uppercasevalue = item.carco.inputtext.value;
                    if (inputtext.value.toUpperCase) item.carco.inputtext.uppercasevalue = inputtext.value.toUpperCase();

                    if (item.carco.inputtext.value == ""&&!item.carco.inputtext.value.length) {

                        if (item.carco.game.inners&&item.carco.game.inners[0]) {
                            carco.functions.feedback.check.remove(item.carco.game.inners[0]);
                            carco.functions.feedback.solution.remove(item.carco.game.inners[0]);
                            carco.functions.feedback.check.remove(item);
                            carco.functions.feedback.solution.remove(item);

                            for (var i = 0; i < item.carco.game.inners.length; i++){
                                item.carco.game.inners[i].carco.game.removeInner(item);
                            };
                            item.carco.game.inners = [];
                            item.carco.game.removeInner();

                        }
                    } else {
                        if (!item.carco.game.inners) item.carco.game.inners = [];
                        var places = item.carco.customparams.placeids;
                        if (typeof item.carco.customparams.placeids == "string") places = [item.carco.customparams.placeids];
                        for (var i = 0; i < places.length; i++){
                            var place = item.carco.root.carco.recursivechildren[places[i]];
                            if (place){
                                carco.functions.feedback.check.remove(place);
                                carco.functions.feedback.solution.remove(place);
                                place.carco.game.setInner(item);
                                item.carco.game.setInner(place);
                                place.carco.game.inners = carco.functions.array.uniq(place.carco.game.inners);
                                item.carco.game.inners = carco.functions.array.uniq(item.carco.game.inners);
                            };
                        };
                    };
                };
            };

            if (inputtext) {
                if (carco.functions.browser.IE() > 8){
                    $(inputtext).focusout(item.carco.inputtext.change);
                }else{
                    inputtext.carco.on("change", item.carco.inputtext.change);
                };

                inputtext.carco.on("keydown", item.carco.inputtext.start);
                //$(inputtext).focus(item.carco.inputtext.start);
                $(inputtext).focusout(item.carco.inputtext.focusout);
                item.carco.inputtext.maxlength();
            };

            return {
                item: item,
                setInner: function(inner, type){
                    var inners = carco.functions.game.setInner(item, inner, type)
                    return inners;
                },
                removeInner: function(inner, type){
                    var inners = carco.functions.game.removeInner(item, inner, type)
                    return inners;
                },
                valueTrueOrFalse: function(type, input){
                    carco.functions.game.valueTrueOrFalse(item, type, input);
                },
                actions: function(params, type){
                    carco.functions.game.actions(item, params, type)
                },
                values: function(params, save, type){
                    carco.functions.game.values(item, params, save, type)
                },
                allChildrenImageColorise: function(params, trynumber) {
                    carco.functions.game.allChildrenImageColorise(item, params, trynumber)
                }
            };
        },
        button: function(item) {
            item.carco.button = {};
            item.carco.button.down = function(ev){
                if (!item.carco.game.inners) item.carco.game.inners = [];

                if (item.carco.parent.carco.customparams.scrollbox&&item.carco.parent.carco.game.scrollBoxRun&&ev&&ev!=="scrollBox") {
                    item.carco.parent.carco.game.scrollBoxRun(item);
                }else{
                    if (item.carco.button.pressed) {
                        if (item.carco.game.inners&&item.carco.game.inners[0]) {
                            for (var i = 0; i < item.carco.game.inners.length; i++){
                                item.carco.game.inners[i].carco.game.removeInner(item);
                                carco.functions.feedback.check.remove(item.carco.game.inners[i]);
                                carco.functions.feedback.solution.remove(item.carco.game.inners[i]);
                            };
                            item.carco.game.inners = [];
                            item.carco.game.removeInner()

                            carco.functions.feedback.check.remove(item);
                            carco.functions.feedback.solution.remove(item);
                        }
                    } else {
                        if (item.carco.customparams.placeids){
                            var places = item.carco.customparams.placeids;
                            if (typeof item.carco.customparams.placeids == "string") places = [item.carco.customparams.placeids];
                            for (var i = 0; i < places.length; i++){
                                var place = item.carco.root.carco.recursivechildren[places[i]];
                                if (place&&place.carco.game&&place.carco.game.setInner&&!place.carco.game.ready){
                                    if (!place.carco.customparams.multiboxmaxinner) place.carco.customparams.multiboxmaxinner = 1;
                                    if (!place.carco.game.inners) place.carco.game.inners = [];
                                    if (place.carco.customparams.multiboxmaxinner <= place.carco.game.inners.length){

                                        var dropbutton = false
                                        var reverseinners = place.carco.game.inners.reverse()
                                        for (var i = 0; i < place.carco.game.inners.length; i++){
                                            if (reverseinners[i].carco.game.ready!==true) {
                                                dropbutton = reverseinners[i];
                                            };
                                        }

                                        if (dropbutton&&dropbutton.carco.customparams.gametype == "button"){
                                            place.carco.game.setInner(item);
                                            item.carco.game.setInner(place);
                                            dropbutton.carco.game.removeInner(place);
                                            place.carco.game.removeInner(dropbutton);
                                            carco.functions.feedback.check.remove(place);
                                            carco.functions.feedback.solution.remove(place);
                                            carco.functions.feedback.check.remove(dropbutton);
                                            carco.functions.feedback.solution.remove(dropbutton);
                                            if (dropbutton.carco.actions&&
                                                dropbutton.carco.actions.button&&
                                                dropbutton.carco.actions.button["function"]&&
                                                dropbutton.carco.customparams.actions&&
                                                dropbutton.carco.customparams.actions.button&&
                                                dropbutton.carco.customparams.actions.button.functions&&
                                                dropbutton.carco.customparams.actions.button.functions["function"]&&
                                                dropbutton.carco.customparams.actions.button.functions["function"]!==""){
                                                dropbutton.carco.button.pressed = false;
                                                dropbutton.carco.actions.button["function"]();
                                            }else{
                                                dropbutton.carco.button.pressed = false;
                                                if (!dropbutton.carco.customparams.autostyle) dropbutton.carco.customparams.autostyle = "button1_image_colorise";
                                                if (dropbutton.carco.customparams.autostyle&&carco.functions.autostyle[dropbutton.carco.customparams.autostyle]){
                                                    carco.functions.autostyle[dropbutton.carco.customparams.autostyle](dropbutton);
                                                }
                                            }
                                        }else{
                                            item.carco.button.pressed = true
                                        }
                                    }else{
                                        item.carco.game.setInner(place);
                                        place.carco.game.setInner(item);

                                        carco.functions.game.lastcheck(false, item);
                                        carco.functions.game.lastcheck(false, place);

                                        carco.functions.feedback.check.remove(place);
                                        carco.functions.feedback.solution.remove(place);
                                    }
                                }else{
                                    item.carco.button.pressed = true
                                };
                            }
                        }
                    };

                    if (item.carco.button.pressed == true){
                        item.carco.button.pressed = false;
                    }else{
                        item.carco.button.pressed = true;
                    };

                    if (item.carco.parent.carco.customparams.selectbox) {
                        item.carco.parent.carco.game.selectbox(item.carco.parent);
                    };

                    if (item.carco.actions&&
                        item.carco.actions.button&&
                        item.carco.actions.button["function"]&&
                        item.carco.customparams.actions&&
                        item.carco.customparams.actions.button&&
                        item.carco.customparams.actions.button.functions&&
                        item.carco.customparams.actions.button.functions["function"]&&
                        item.carco.customparams.actions.button.functions["function"]!==""&&ev&&ev!=="scrollBox"){}else{
                        if (!item.carco.customparams.autostyle) item.carco.customparams.autostyle = "button1_image_colorise";
                        if (item.carco.customparams.autostyle&&carco.functions.autostyle[item.carco.customparams.autostyle]){
                            carco.functions.autostyle[item.carco.customparams.autostyle](item);
                        };
                    }
                    if (carco.functions.browser.IE() == -1&&carco.functions.browser.Chrome()&&!carco.functions.isMobile.any()){
                        var root = item.carco.root;
                        var images = root.carco.getChildren({children:"recursivechildren", equal:{type:"image"}, type:"item"})
                        if (images[0]&&images[0].carco.stage) images[0].carco.stage.update();
                    };
                };
                if (item.carco.parent.carco.customparams.processbox&&item.carco.parent.carco.game.processbox&&ev!=="processBox") item.carco.parent.carco.game.processbox(item);
            }

            item.carco.on("mousedown", item.carco.button.down);

            if (item.carco.type == "image"&&item.carco.svgdef){
                carco.functions.listeners.add(item.carco.svgdef, "mousedown", item.carco.button.down);
                item.carco.svgdef.carco = item.carco
            };

            return {
                item: item,
                setInner: function(inner, type){
                    var inners = carco.functions.game.setInner(item, inner, type)
                    return inners;
                },
                removeInner: function(inner, type){
                    var inners = carco.functions.game.removeInner(item, inner, type)
                    return inners;
                },
                cloneParams: function(name){
                    carco.functions.game.cloneParams(item, name)
                },
                actions: function(params, type){
                    carco.functions.game.actions(item, params, type)
                },
                allChildrenImageColorise: function(params, trynumber) {
                    carco.functions.game.allChildrenImageColorise(item, params, trynumber)
                },
                valueTrueOrFalse: function(type, input){
                    carco.functions.game.valueTrueOrFalse(item, type, input);
                },
                values: function(params, save, type){
                    carco.functions.game.values(item, params, save, type)
                },
                setOriginal: function(position){
                    carco.functions.game.setOriginal(item, position);
                }
            };
        },
        csstransist: function(item){

            item.carco.csstransist = {};
            item.carco.csstransist.default = {};

            item.carco.csstransist.moveitem = item;
            if (item.carco.customparams.csstransistparent){
                item.carco.csstransist.moveitem = item.carco.parent;
                item.carco.csstransist.moveitem.carco.csstransist = {};
            };

            item.carco.csstransist.init = function() {

                item.carco.csstransist.moveitem = item;
                if (item.carco.customparams.csstransistparent){
                    item.carco.csstransist.moveitem = item.carco.parent;
                };

                item.carco.csstransist.scene = function(a) {
                    if (item.carco.customparams.csstransistscdata){
                        item.carco.csstransist.scenesdata = JSON.parse(item.carco.customparams.csstransistscdata);
                    };
                    if (item.carco.csstransist.scenesdata&&item.carco.csstransist.scenesdata[a.scene]){

                        if (a.default){
                            for (var d in a.default){
                                if (!item.carco.csstransist.default) item.carco.csstransist.default = {};
                                item.carco.csstransist.default[d] = a.default[d];
                            };
                        };

                        item.carco.csstransist.stopped = true;
                        clearInterval(item.carco.csstransist.interval);
                        clearTimeout(item.carco.csstransist.timeout);
                        clearTimeout(item.carco.csstransist.setdatatimeout);
                        if (item.carco.removeTransist) item.carco.removeTransist({type:"all"});

                        item.carco.csstransist.data = false;
                        item.carco.csstransist.currentframe = 0;
                        item.carco.csstransist.currentdata = 0;
                        item.carco.csstransist.allduration = 0;
                        item.carco.csstransist.ispauseddata = 0;
                        item.carco.csstransist.ispaused = 0;
                        item.carco.csstransist.ispauseddatadur = 0;
                        item.carco.csstransist.currentdatadata = {};

                        if (item.carco.csstransist.tempstart) {
                            item.carco.csstransist.start = item.carco.csstransist.tempstart;
                            item.carco.csstransiststart = item.carco.csstransist.start;
                        };

                        item.carco.csstransist.endcallback = function() {
                            item.carco.csstransist.endcallback = false;
                            item.carco.csstransist.isscene = false;
                            if (a.pngitem) a.pngitem.carco.pngseq.end();
                        };

                        item.carco.csstransist.afterendcallback = function() {
                            if (item.carco.csstransist.tempstart) {
                                item.carco.csstransist.start = item.carco.csstransist.tempstart;
                                item.carco.csstransiststart = item.carco.csstransist.start;
                            };
                            item.carco.csstransist.afterendcallback = false;
                            item.carco.csstransist.isscene = false;
                            if (a.disablerunreset) {}else{item.carco.csstransist.runn = 0;}

                            if (a.callback){
                                a.callback(a);
                            } else {
                                if (a.pngitem) a.pngitem.carco.pngseq.start();
                                item.carco.csstransist.start();
                            };
                        };

                        if (a.waitstart){
                            setTimeout(function() {
                                var newp = carco.functions.object.clone(item.carco.csstransist.scenesdata[a.scene]);
                                if (a.callbefore) a.callbefore(a);
                                item.carco.csstransist.start(newp, true);
                            }, a.waitstart)
                        } else {
                            var newp = carco.functions.object.clone(item.carco.csstransist.scenesdata[a.scene]);
                            if (a.callbefore) a.callbefore(a);
                            item.carco.csstransist.start(newp, true);
                        };

                    };
                };

                item.carco.csstransist.moveitem.carco.csstransist.scene = item.carco.csstransist.scene;

                item.carco.csstransist.start = function(p, scene) {

                    item.carco.csstransist.allduration = 0;
                    if (scene) item.carco.csstransist.isscene = true;
                    item.carco.csstransist.data = false;

                    if (item.carco.customparams.csstransistdata){
                        item.carco.csstransist.data = JSON.parse(item.carco.customparams.csstransistdata);
                    };

                    if (p && p.data)  item.carco.csstransist.data = carco.functions.object.clone(p.data);

                    if (item.carco.csstransist.data){
                        var datas = 0;
                        for (var x in item.carco.csstransist.data){
                            var dura = item.carco.csstransist.data[x].duration;
                            if (item.carco.csstransist.default&&dura&&item.carco.csstransist.default[dura]){
                                dura = item.carco.csstransist.default[dura];
                            };
                            if (!item.carco.csstransist.data[x].duration) item.carco.csstransist.data[x].duration = 2000;
                            if (!dura) dura = 2000;
                            if (!item.carco.csstransist.allduration) item.carco.csstransist.allduration = 0;
                            item.carco.csstransist.allduration = item.carco.csstransist.allduration + dura / 1000;
                            datas = datas + 1;
                        };
                    };

                    if (datas){

                        if (!item.carco.csstransist.runn) item.carco.csstransist.runn = 0;
                        item.carco.csstransist.allduration = Math.round(item.carco.csstransist.allduration*1000)/1000;

                        var cfps = 30;
                        var frames = cfps * item.carco.csstransist.allduration;
                        frames = Math.round(frames);

                        var maxtime = item.carco.csstransist.allduration * 1000;
                        var fps = cfps;

                        var ms = 1000 / fps;
                        var step = 1;

                        item.carco.csstransist.ms = ms;
                        item.carco.csstransist.currentframe = 0;
                        item.carco.csstransist.endframe = frames;

                        if (p&&p.startframe) item.carco.csstransist.currentframe = p.startframe;
                        if (p&&p.endframe) item.carco.csstransist.endframe = p.endframe;

                        if (item.carco.csstransist.ispaused&&!item.carco.csstransist.isscene) {
                            item.carco.csstransist.currentframe = item.carco.csstransist.ispaused;
                            item.carco.csstransist.ispauseddata = item.carco.csstransist.ispauseddata;
                            item.carco.csstransist.ispaused = 0;
                        }else{
                            item.carco.csstransist.runn = item.carco.csstransist.runn + 1;
                        };

                        item.carco.csstransist.starttime = new Date();
                        item.carco.csstransist.starttime = item.carco.csstransist.starttime.getTime();

                        clearInterval(item.carco.csstransist.interval);
                        clearTimeout(item.carco.csstransist.timeout);

                        if (item.carco.csstransist.restartwait) clearTimeout(item.carco.csstransist.restartwait);

                        item.carco.csstransist.setsize = function() {};

                        item.carco.csstransist.interval = setInterval(function() {
                            item.carco.csstransist.setsize();
                            item.carco.csstransist.currentframe = item.carco.csstransist.currentframe + step;
                            if (!item.carco.csstransist.currentframedata) item.carco.csstransist.currentframedata = {};
                            var bounds = item.getBoundingClientRect();
                            item.carco.csstransist.currentframedata[item.carco.csstransist.currentframe] = {
                                position:{
                                    x:bounds.left,
                                    y:bounds.top,
                                }
                            };
                            if (item.carco.csstransist.endframe <= item.carco.csstransist.currentframe){
                                item.carco.csstransist.timeoutfunc();
                            };

                        },item.carco.csstransist.ms);

                        item.carco.csstransist.timeoutfunc = function() {

                            var csstransistloop = item.carco.customparams.csstransistloop;
                            var csstransistmaxloop = item.carco.customparams.csstransistmaxloop;
                            if (p&&p.csstransistloop||p&&p.csstransistloop == 0) csstransistloop = p.csstransistloop;
                            if (p&&p.csstransistmaxloop||p&&p.csstransistmaxloop == 0) csstransistmaxloop = p.csstransistmaxloop;

                            if (csstransistloop) {
                                if (csstransistmaxloop){
                                    if (csstransistmaxloop > item.carco.csstransist.runn) {
                                        item.carco.csstransist.stop();
                                        item.carco.csstransist.start(p);
                                    }else{
                                        if (item.carco.csstransist.endcallback){
                                            item.carco.csstransist.endcallback();
                                        };
                                        item.carco.csstransist.stop(false, true, p);
                                        item.carco.csstransist.runn = 0;
                                        if (item.carco.csstransist.afterendcallback){
                                            item.carco.csstransist.afterendcallback();
                                        };
                                    };
                                }else{
                                    item.carco.csstransist.stop();
                                    item.carco.csstransist.start(p);
                                };
                            }else{
                                if (item.carco.csstransist.endcallback) {
                                    item.carco.csstransist.endcallback();
                                };
                                item.carco.csstransist.stop(false, true, p);
                                if (item.carco.csstransist.afterendcallback){
                                    item.carco.csstransist.afterendcallback();
                                };
                            };
                        };

                        item.carco.csstransist.timeout = setTimeout(item.carco.csstransist.timeoutfunc, maxtime);

                        if (!item.carco.addTransist) {
                            carco.functions.csstransist.init(item);
                        };

                        item.carco.csstransist.stopped = false;
                        item.carco.csstransist.setData = function(){

                            item.carco.csstransist.moveitem = item;
                            if (item.carco.customparams.csstransistparent){
                                item.carco.csstransist.moveitem = item.carco.parent;
                            };

                            if (!item.carco.csstransist.stopped&&!item.carco.csstransist.ispaused){
                                var x = item.carco.csstransist.currentdata;
                                var d = new Date();
                                t = d.getTime();
                                var td = t;
                                if (item.carco.csstransist.ispauseddatadur) td = t - item.carco.csstransist.ispauseddatadur;
                                if (!item.carco.csstransist.currentdatadata) item.carco.csstransist.currentdatadata = {};
                                item.carco.csstransist.currentdatadata[item.carco.csstransist.currentdata] = {
                                    starttime: td
                                };

                                if (item.carco.csstransist.data[x]&&item.carco.csstransist.data[x].position) {

                                    var setx = item.carco.csstransist.data[x].position.x;
                                    var sety = item.carco.csstransist.data[x].position.y;

                                    if (setx == "def"){
                                        if (item.carco.csstransist.default&&item.carco.csstransist.default.x||item.carco.csstransist.default&&item.carco.csstransist.default.x == 0) {
                                            setx = item.carco.csstransist.default.x;
                                        }else{
                                            setx = item.carco.csstransist.moveitem.carco.position.relative.x;
                                        };
                                    };
                                    if (sety == "def"){
                                        if (item.carco.csstransist.default&&item.carco.csstransist.default.y||item.carco.csstransist.default&&item.carco.csstransist.default.y == 0) {
                                            sety = item.carco.csstransist.default.y;
                                        }else{
                                            sety = item.carco.csstransist.moveitem.carco.position.relative.y;
                                        };
                                    };

                                    if (setx == "end"){
                                        if (item.carco.csstransist.default&&item.carco.csstransist.default.endx||item.carco.csstransist.default&&item.carco.csstransist.default.endx == 0) {
                                            setx = item.carco.csstransist.default.endx;
                                        }else{
                                            if (item.carco.csstransist.default&&item.carco.csstransist.default.x||item.carco.csstransist.default&&item.carco.csstransist.default.x == 0) {
                                                setx = item.carco.csstransist.default.x;
                                            }else{
                                                setx = item.carco.csstransist.moveitem.carco.position.relative.x;
                                            };
                                        };
                                    };
                                    if (sety == "end"){
                                        if (item.carco.csstransist.default&&item.carco.csstransist.default.endy||item.carco.csstransist.default&&item.carco.csstransist.default.endy == 0) {
                                            sety = item.carco.csstransist.default.endy;
                                        }else{
                                            if (item.carco.csstransist.default&&item.carco.csstransist.default.y||item.carco.csstransist.default&&item.carco.csstransist.default.y == 0) {
                                                sety = item.carco.csstransist.default.y;
                                            }else{
                                                sety = item.carco.csstransist.moveitem.carco.position.relative.y;
                                            };
                                        };
                                    };

                                    if (setx&&setx.match&&setx.match(/\+/)||setx&&setx.match&&setx.match("-")){
                                        if (setx&&setx.match(/\+/)){
                                            var sn = Number(setx.split("+")[1]);
                                            setx = item.carco.csstransist.lastx + sn;
                                        } else {
                                            if (setx&&setx.match("-")){
                                                var sn = Number(setx.split("-")[1]);
                                                setx = item.carco.csstransist.lastx - sn;
                                            };
                                        };
                                    };

                                    if (sety&&sety.match&&sety.match(/\+/)||sety&&sety.match&&sety.match("-")){
                                        if (sety&&sety.match(/\+/)){
                                            var sn = Number(sety.split("+")[1]);
                                            sety = item.carco.csstransist.lasty + sn;
                                        } else {
                                            if (sety && sety.match("-")) {
                                                var sn = Number(sety.split("-")[1]);
                                                sety = item.carco.csstransist.lasty - sn;
                                            };
                                        };
                                    };

                                    item.carco.csstransist.lastx = setx;
                                    item.carco.csstransist.lasty = sety;

                                    var dura = item.carco.csstransist.data[x].duration;
                                    if (item.carco.csstransist.default&&dura&&item.carco.csstransist.default[dura]){
                                        dura = item.carco.csstransist.default[dura];
                                    };

                                    if (dura == 1){


                                        item.carco.removeTransist({type:"all"});
                                        item.carco.csstransist.moveitem.carco.setPosition({relative:{x:setx, y:sety}})
                                        item.carco.csstransist.moveitem.carco.resize();
                                        //console.log("setPosition", item.carco.csstransist.data[x].position.x, item.carco.csstransist.data[x].position.y);
                                        item.carco.csstransist.currentdata = item.carco.csstransist.currentdata + 1;
                                        item.carco.csstransist.ispauseddatadur = 0;
                                        item.carco.csstransist.setData();

                                    }else{

                                        var dur = dura;
                                        if (item.carco.csstransist.ispauseddatadur) {
                                            dur = dur - item.carco.csstransist.ispauseddatadur;
                                            item.carco.csstransist.ispauseddatadur = 0;
                                        };

                                        item.carco.addTransist({type:"all", duration:dur});
                                        item.carco.csstransist.moveitem.carco.setPosition({relative:{x:setx, y:sety}})

                                        if (!item.carco.csstransist.stopped&&!item.carco.csstransist.ispaused) {
                                            item.carco.csstransist.moveitem.carco.resize();
                                            //console.log("setPosition", item.carco.csstransist.data[x].position.x, item.carco.csstransist.data[x].position.y);
                                        };

                                        item.carco.csstransist.setdatatimeout = setTimeout(function() {
                                            if (!item.carco.csstransist.stopped&&!item.carco.csstransist.ispaused) {
                                                item.carco.csstransist.currentdata = item.carco.csstransist.currentdata + 1;
                                                item.carco.csstransist.setData();
                                            };
                                        }, dur);
                                    };
                                };
                            };
                        };

                        if (!item.carco.csstransist.currentdata) item.carco.csstransist.currentdata = 0;
                        item.carco.csstransist.setData(item.carco.csstransist.currentdata);

                    };

                };

                item.carco.csstransiststart = item.carco.csstransist.start;
                item.carco.csstransist.moveitem.carco.csstransiststart = item.carco.csstransist.start;

                item.carco.csstransist.stop = function(ev, erestart, p) {

                    item.carco.csstransist.moveitem = item;
                    if (item.carco.customparams.csstransistparent){
                        item.carco.csstransist.moveitem = item.carco.parent;
                    };

                    item.carco.csstransist.stopped = true;
                    clearInterval(item.carco.csstransist.interval);
                    clearTimeout(item.carco.csstransist.timeout);
                    clearTimeout(item.carco.csstransist.setdatatimeout);
                    if (item.carco.removeTransist) item.carco.removeTransist({type:"all"});

                    if (item.carco.csstransist.starttime){
                        item.carco.csstransist.endtime = new Date();
                        item.carco.csstransist.endtime = item.carco.csstransist.endtime.getTime();
                        item.carco.csstransist.duration = item.carco.csstransist.endtime - item.carco.csstransist.starttime;
                        item.carco.csstransist.duration = item.carco.csstransist.duration;
                        if (item.carco.csstransist.duration < 20) item.carco.csstransist.duration = 0;
                        // if (item.carco.csstransist.duration) console.log("Duration: " + item.carco.csstransist.duration/1000 + "sec");
                        item.carco.csstransist.starttime = 0;
                    };

                    item.carco.csstransist.data = false;
                    item.carco.csstransist.currentframe = 0;
                    item.carco.csstransist.currentdata = 0;
                    item.carco.csstransist.allduration = 0;
                    item.carco.csstransist.ispauseddata = 0;
                    item.carco.csstransist.ispaused = 0;
                    item.carco.csstransist.ispauseddatadur = 0;
                    item.carco.csstransist.currentdatadata = {};

                    var setx = item.carco.csstransist.moveitem.carco.originalposition.relative.x;
                    var sety = item.carco.csstransist.moveitem.carco.originalposition.relative.y;
                    if (item.carco.csstransist.default.endx || item.carco.csstransist.default.endx == 0) setx = item.carco.csstransist.default.endx;
                    if (item.carco.csstransist.default.endy || item.carco.csstransist.default.endy == 0) sety = item.carco.csstransist.default.endy;

                    item.carco.csstransist.lastx = setx;
                    item.carco.csstransist.lasty = sety;

                    item.carco.csstransist.moveitem.carco.setPosition({relative: {x: setx, y: sety}});
                    item.carco.csstransist.moveitem.carco.resize();

                    var csstransistrestart = item.carco.customparams.csstransistrestart;
                    if (p&&p.csstransistrestart||p&&p.csstransistrestart == 0) csstransistrestart = p.csstransistrestart;

                    if (csstransistrestart&&erestart){
                        var rt = csstransistrestart*1000;
                        item.carco.csstransist.restartwait = setTimeout(function() {
                            item.carco.csstransist.restartwaitstart = false;
                            if (item.carco.csstransist.tempstart) {
                                item.carco.csstransist.start = item.carco.csstransist.tempstart;
                                item.carco.csstransiststart = item.carco.csstransist.start;
                            };
                            item.carco.csstransist.start(p);
                        },rt)

                        item.carco.csstransist.restartwaitstart = new Date().getTime();
                        if (!item.carco.csstransist.tempstart) item.carco.csstransist.tempstart = item.carco.csstransist.start;
                        item.carco.csstransist.start = function(p) {
                            if (!item.carco.csstransist.restartwaitstart){
                                if (item.carco.csstransist.tempstart) {
                                    item.carco.csstransist.start = item.carco.csstransist.tempstart;
                                    item.carco.csstransiststart = item.carco.csstransist.start;
                                };
                                item.carco.csstransist.start(p);
                            } else {
                                var pausedtime = item.carco.csstransist.ispausedtime;
                                var waitduration = (csstransistrestart*1000) - (pausedtime - item.carco.csstransist.restartwaitstart);
                                if (waitduration && waitduration > 0){
                                    item.carco.csstransist.restartwait = setTimeout(function() {
                                        item.carco.csstransist.restartwaitstart = false;
                                        if (item.carco.csstransist.tempstart) {
                                            item.carco.csstransist.start = item.carco.csstransist.tempstart;
                                            item.carco.csstransiststart = item.carco.csstransist.start;
                                        };
                                        item.carco.csstransist.start(p);
                                    },waitduration)
                                }else{
                                    if (item.carco.csstransist.tempstart) {
                                        item.carco.csstransist.start = item.carco.csstransist.tempstart;
                                        item.carco.csstransiststart = item.carco.csstransist.start;
                                    };
                                    item.carco.csstransist.start(p);
                                };
                            };
                        };
                        item.carco.csstransiststart = item.carco.csstransist.start;
                    };
                    if (!erestart){
                        if (item.carco.csstransist.restartwait) clearTimeout(item.carco.csstransist.restartwait);
                        item.carco.csstransist.restartwaitstart = false;
                        if (item.carco.csstransist.tempstart) {
                            item.carco.csstransist.start = item.carco.csstransist.tempstart;
                            item.carco.csstransiststart = item.carco.csstransist.start;
                        };
                    };
                    return {x:setx, y:sety};
                };

                item.carco.csstransiststop = item.carco.csstransist.stop;
                item.carco.csstransist.moveitem.carco.csstransiststop = item.carco.csstransist.stop;

                item.carco.csstransist.end = function() {
                    item.carco.csstransist.runn = 0;
                    var edata = item.carco.csstransist.stop();
                };

                item.carco.csstransistend = item.carco.csstransist.end;
                item.carco.csstransist.moveitem.carco.csstransistend = item.carco.csstransist.end;

                item.carco.csstransist.reset = function() {
                    item.carco.csstransist.default = {};
                    item.carco.csstransist.odata = false;
                    item.carco.csstransist.end();
                };

                item.carco.csstransistreset = item.carco.csstransist.reset;
                item.carco.csstransist.moveitem.carco.csstransistreset = item.carco.csstransist.reset;

                item.carco.csstransist.pause = function() {

                    item.carco.csstransist.moveitem = item;
                    if (item.carco.customparams.csstransistparent){
                        item.carco.csstransist.moveitem = item.carco.parent;
                    };

                    if (!item.carco.csstransist.isscene){
                        item.carco.csstransist.ispaused = item.carco.csstransist.currentframe;
                        item.carco.csstransist.stopped = true;
                        item.carco.csstransist.ispauseddata = item.carco.csstransist.currentdata;
                        item.carco.csstransist.ispausedtime = new Date().getTime();

                        clearInterval(item.carco.csstransist.interval);
                        clearTimeout(item.carco.csstransist.timeout);
                        clearTimeout(item.carco.csstransist.setdatatimeout);
                        if (item.carco.csstransist.restartwait) clearTimeout(item.carco.csstransist.restartwait);

                        var d = new Date();
                        t = d.getTime();
                        if (item.carco.csstransist&&item.carco.csstransist.currentdatadata&&item.carco.csstransist.currentdatadata[item.carco.csstransist.currentdata]) {
                            var et = t - item.carco.csstransist.currentdatadata[item.carco.csstransist.currentdata].starttime;
                            item.carco.csstransist.ispauseddatadur = et;
                        };

                        if (item.carco.csstransist&&item.carco.csstransist.currentframedata&&item.carco.csstransist.currentframedata[item.carco.csstransist.currentframe]) {
                            var cufdat = item.carco.csstransist.currentframedata[item.carco.csstransist.currentframe];
                            item.carco.csstransist.moveitem.carco.setPosition({absolute: {x: cufdat.position.x, y: cufdat.position.y}})
                            item.carco.csstransist.moveitem.carco.resize();
                        };

                        if (item.carco.removeTransist) item.carco.removeTransist({type:"all"});
                    }else{
                        item.carco.csstransist.stop();
                        item.carco.csstransist.isscene = false;
                    };

                };

                item.carco.csstransistpause = item.carco.csstransist.pause;
                item.carco.csstransist.moveitem.carco.csstransistpause = item.carco.csstransist.pause;

            };

            item.carco.csstransist.init();

            return {
                item: item
            }
        },
        pngseq: function(item) {

            var images = item.carco.getChildren({children:"recursivechildren", equal:{type:"image"}, type:"item"})
            var animitem = images[0];

            item.carco.pngseq = {};
            item.carco.pngseq.init = function() {
                if (animitem) {

                    item.carco.pngseq.scene = function(p) {
                        if (item.carco.customparams.pngdata){
                            item.carco.pngseq.data = JSON.parse(item.carco.customparams.pngdata);
                        };
                        if (item.carco.pngseq.data&&item.carco.pngseq.data[p.scene]){
                            if (!item.carco.pngseq.tempstart) item.carco.pngseq.tempstart = item.carco.pngseq.start;
                            item.carco.pngseq.endcallback = function() {
                                item.carco.pngseq.endcallback = false;
                                item.carco.pngseq.isscene = false;
                            };

                            item.carco.pngseq.afterendcallback = function() {
                                item.carco.pngseq.afterendcallback = false;
                                if (p.callback) p.callback(p);
                            };

                            if (item.carco.pngseq.ispaused){
                                item.carco.pngseq.end();
                            }else{
                                item.carco.pngseq.stop();
                            };

                            if (item.carco.pngseq.tempstart) {
                                item.carco.pngseq.start = item.carco.pngseq.tempstart;
                                item.carco.pngseqstart = item.carco.pngseq.start;
                            };

                            if (item.carco.pngseq.data[p.scene]){
                                if (p.endpause !== undefined) item.carco.pngseq.data[p.scene].endpause = p.endpause;
                            };

                            if (p.waitstart){
                                setTimeout(function() {
                                    if (p.callbefore) p.callbefore(p);
                                    item.carco.pngseq.start(item.carco.pngseq.data[p.scene], true);
                                },p.waitstart);
                            }else{
                                if (p.callbefore) p.callbefore(p);
                                item.carco.pngseq.start(item.carco.pngseq.data[p.scene], true);
                            };
                        };
                    };

                    item.carco.pngseqscene = item.carco.pngseq.scene;

                    item.carco.pngseq.start = function(p, scene) {

                        if (!item.carco.pngseq.runn) item.carco.pngseq.runn = 0;
                        if (scene) item.carco.pngseq.isscene = true;

                        var scaleX = animitem.carco.scale.x
                        var scaleY = animitem.carco.scale.y

                        var width = item.carco.size.offsetWidth;
                        var maxwidth = animitem.carco.size.offsetWidth;

                        var frames = maxwidth / width;
                        var cfps = 30;

                        if (!item.carco.customparams.pngsec) item.carco.customparams.pngsec = frames / cfps;
                        item.carco.customparams.pngsec = Math.round(item.carco.customparams.pngsec*1000)/1000;
                        frames = Math.round(frames);

                        var maxtime = item.carco.customparams.pngsec * 1000;
                        var fps = cfps;

                        if (p && p.fps) fps = p && p.fps;
                        var ms = 1000 / fps;
                        var realframes = item.carco.customparams.pngsec * fps;
                        if ((frames/realframes) >= 1) {
                            var step = Math.floor(frames / realframes);
                        }else{
                            step = 1;
                            fps = fps * (frames/realframes);
                            ms = 1000 / fps;
                        };

                        item.carco.pngseq.ms = ms;
                        item.carco.pngseq.startx = 0;
                        item.carco.pngseq.currentframe = 0;
                        item.carco.pngseq.endframe = frames;

                        if (item.carco.customparams.pngstartframe) item.carco.pngseq.currentframe = item.carco.customparams.pngstartframe;
                        if (item.carco.customparams.pngendframe) item.carco.pngseq.endframe = item.carco.customparams.pngendframe;

                        if (p&&p.startframe) item.carco.pngseq.currentframe = p.startframe;
                        if (p&&p.endframe) item.carco.pngseq.endframe = p.endframe;

                        if (item.carco.pngseq.restartwait) clearTimeout(item.carco.pngseq.restartwait);

                        if (item.carco.pngseq.ispaused) {
                            item.carco.pngseq.currentframe = item.carco.pngseq.ispaused;
                            item.carco.pngseq.ispaused = 0;
                        };

                        item.carco.pngseq.starttime = new Date();
                        item.carco.pngseq.starttime = item.carco.pngseq.starttime.getTime();

                        clearInterval(item.carco.pngseq.interval);
                        clearTimeout(item.carco.pngseq.timeout);

                        item.carco.pngseq.setsize = function() {
                            var percent = (animitem.carco.size.widthpercent/frames) * item.carco.pngseq.currentframe;
                            if (animitem.carco.svgdef){
                                animitem.style.left = -percent + "%";
                                if (animitem.carco.svgresize) animitem.carco.svgresize()
                            }else{
                                animitem.style.left = -percent + "%";
                            };
                        };

                        item.carco.pngseq.interval = setInterval(function() {
                            item.carco.pngseq.setsize();
                            item.carco.pngseq.currentframe = item.carco.pngseq.currentframe + step;
                            if (item.carco.pngseq.endframe <= item.carco.pngseq.currentframe){
                                item.carco.pngseq.timeoutfunc();
                            };

                        },item.carco.pngseq.ms);

                        item.carco.pngseq.timeoutfunc = function() {
                            var pngloop = item.carco.customparams.pngloop;
                            var pngmaxloop = item.carco.customparams.pngmaxloop;
                            if (p&&p.pngloop) pngloop = p.pngloop;
                            if (p&&p.pngmaxloop||p&&p.pngmaxloop == 0) pngmaxloop = p.pngmaxloop;
                            if (pngloop) {
                                if (pngmaxloop){
                                    if (pngmaxloop > item.carco.pngseq.runn) {
                                        //item.carco.pngseq.stop(); //akadt tőle
                                        item.carco.pngseq.start(p);
                                    }else{
                                        if (item.carco.pngseq.endcallback){
                                            item.carco.pngseq.endcallback();
                                        };
                                        if (p&&p.endpause){
                                            item.carco.pngseq.pause(p);
                                        }else {
                                            item.carco.pngseq.stop(false, true, p);
                                        };
                                        item.carco.pngseq.runn = 0;
                                        if (item.carco.pngseq.afterendcallback){
                                            item.carco.pngseq.afterendcallback();
                                        };
                                    };
                                }else{
                                    item.carco.pngseq.start(p);
                                };
                            }else{
                                if (item.carco.pngseq.endcallback){
                                    item.carco.pngseq.endcallback();
                                };
                                if (p&&p.endpause){
                                   item.carco.pngseq.pause(p);
                                } else {
                                    item.carco.pngseq.stop(false, true, p);
                                };
                                if (item.carco.pngseq.afterendcallback){
                                    item.carco.pngseq.afterendcallback();
                                };
                            };
                        };

                        item.carco.pngseq.timeout = setTimeout(item.carco.pngseq.timeoutfunc, maxtime);
                        item.carco.pngseq.runn = item.carco.pngseq.runn + 1;

                    };

                    item.carco.pngseqstart = item.carco.pngseq.start;

                    item.carco.pngseq.stop = function(e, erestart, p) {
                        clearInterval(item.carco.pngseq.interval);
                        clearTimeout(item.carco.pngseq.timeout);

                        if (item.carco.pngseq.starttime){
                            item.carco.pngseq.endtime = new Date();
                            item.carco.pngseq.endtime = item.carco.pngseq.endtime.getTime();
                            item.carco.pngseq.duration = item.carco.pngseq.endtime - item.carco.pngseq.starttime;
                            item.carco.pngseq.duration = item.carco.pngseq.duration;
                            if (item.carco.pngseq.duration < 20) item.carco.pngseq.duration = 0;
                            //if (item.carco.pngseq.duration) console.log("Duration: " + item.carco.pngseq.duration/1000 + "sec");
                            item.carco.pngseq.starttime = 0;
                        };

                        item.carco.pngseq.startx = 0;
                        item.carco.pngseq.currentframe = 0;
                        animitem.carco.setPosition({relative:{x:0, y:0}})
                        animitem.carco.resize();

                        var pngrestart = item.carco.customparams.pngrestart;
                        if (p&&p.pngrestart||p&&p.pngrestart == 0) pngrestart = p.pngrestart;

                        if (pngrestart&&erestart){
                            var rt = pngrestart*1000;

                            item.carco.pngseq.restartwait = setTimeout(function() {
                                item.carco.pngseq.restartwaitstart = false;
                                if (item.carco.pngseq.tempstart) {
                                    item.carco.pngseq.start = item.carco.pngseq.tempstart;
                                    item.carco.pngseqstart = item.carco.pngseq.start;
                                };
                                item.carco.pngseq.start(p);
                            },rt)

                            item.carco.pngseq.restartwaitstart = new Date().getTime();
                            if (!item.carco.pngseq.tempstart) item.carco.pngseq.tempstart = item.carco.pngseq.start;
                            item.carco.pngseq.start = function(p, scene) {
                                if (!item.carco.pngseq.restartwaitstart||scene||item.carco.pngseq.isscene){
                                    item.carco.pngseq.start = item.carco.pngseq.tempstart;
                                    item.carco.pngseqstart = item.carco.pngseq.start;
                                    item.carco.pngseq.start(p, scene);
                                } else {
                                    var pausedtime = item.carco.pngseq.ispausedtime;
                                    var waitduration = (pngrestart*1000) - (pausedtime - item.carco.pngseq.restartwaitstart);
                                    if (waitduration && waitduration > 0){
                                        item.carco.pngseq.restartwait = setTimeout(function() {
                                            item.carco.pngseq.restartwaitstart = false;
                                            if (item.carco.pngseq.tempstart) {
                                                item.carco.pngseq.start = item.carco.pngseq.tempstart;
                                                item.carco.pngseqstart = item.carco.pngseq.start;
                                            };
                                            item.carco.pngseq.start(p, scene);
                                        },waitduration)
                                    }else{
                                        if (item.carco.pngseq.tempstart) {
                                            item.carco.pngseq.start = item.carco.pngseq.tempstart;
                                            item.carco.pngseqstart = item.carco.pngseq.start;
                                        };
                                        item.carco.pngseq.start(p, scene);
                                    };
                                };
                            };
                            item.carco.pngseqstart = item.carco.pngseq.start;

                        };
                        if (!erestart){
                            if (item.carco.pngseq.restartwait) clearTimeout(item.carco.pngseq.restartwait);
                            item.carco.pngseq.restartwaitstart = false;
                            if (item.carco.pngseq.tempstart) {
                                item.carco.pngseq.start = item.carco.pngseq.tempstart;
                                item.carco.pngseqstart = item.carco.pngseq.start;
                            };
                        };

                    };

                    item.carco.pngseqstop = item.carco.pngseq.stop;

                    item.carco.pngseq.end = function() {
                        item.carco.pngseq.runn = 0;
                        item.carco.pngseq.ispaused = false;
                        item.carco.pngseq.stop();
                    };

                    item.carco.pngseqend = item.carco.pngseq.end;
                    item.carco.pngseqreset = item.carco.pngseq.end;

                    item.carco.pngseq.pause = function(p) {
                        if (!item.carco.pngseq.isscene || p&&p.endpause){
                            item.carco.pngseq.ispaused = item.carco.pngseq.currentframe;
                            if (item.carco.pngseq.restartwait) clearTimeout(item.carco.pngseq.restartwait);
                            clearInterval(item.carco.pngseq.interval);
                            clearTimeout(item.carco.pngseq.timeout);

                            item.carco.pngseq.ispausedtime = new Date().getTime();
                            if (item.carco.pngseq.restartwait) clearTimeout(item.carco.pngseq.restartwait);

                            if (item.carco.pngseq.setsize) item.carco.pngseq.setsize();
                        }else{
                            if (item.carco.pngseq.tempstart) {
                                item.carco.pngseq.start = item.carco.pngseq.tempstart;
                                item.carco.pngseqstart = item.carco.pngseq.start;
                            };
                            if (item.carco.pngseq.restartwait) clearTimeout(item.carco.pngseq.restartwait);
                            clearInterval(item.carco.pngseq.interval);
                            clearTimeout(item.carco.pngseq.timeout);
                            item.carco.pngseq.restartwaitstart = false;
                            item.carco.pngseq.end();
                        };
                    };

                    item.carco.pngseqpause = item.carco.pngseq.pause;

                };
            };

            item.carco.pngseq.init();

            return {
                item: item
            }
        },
        timer: function(item){

            item.carco.timer = {};
            var text = item.carco.getChildren({equal:{type:"text"}})[0];
            item.carco.timer.text = text;
            item.carco.timer.start = function() {
                var value = "1";
                if (item.carco.timer.text) {
                    item.carco.timer.startstyle();
                    value = item.carco.timer.text.carco.originalcustomparams.innerHTML;
                };
                var minute = value.split(":")[0];
                var second = value.split(":")[1];
                if (!minute||minute=="0"||isNaN(Number(minute))) minute = 0;
                if (!second||second=="0"||isNaN(Number(second))) second = 0;
                var allsecond = Number(minute)*60+Number(second)

                var currentdate = new Date();
                var currentsecond = currentdate.getHours()*3600+currentdate.getMinutes()*60+currentdate.getSeconds();
                var endsecond = Number(currentsecond) + Number(allsecond);

                if (carco.functions.game.searchActions(item, "timerstart")){
                    carco.functions.game.searchActions(item, "timerstart")(item);
                };

                item.carco.timer.fn = setInterval(function(){
                    var currentdate = new Date();
                    var currentsecond = currentdate.getHours()*3600+currentdate.getMinutes()*60+currentdate.getSeconds();
                    var outputsecond = Number(endsecond) - Number(currentsecond);
                    var minute = Math.floor(outputsecond / 60);
                    var second = outputsecond - (minute*60);
                    if (second<10) second = "0"+second;
                    if (text) text.carco.innerHTML(minute+":"+second, "save")
                    if (outputsecond<1) item.carco.timer.end(item);
                    if (item.carco.timer.clearlistener(item)){
                        clearInterval(item.carco.timer.fn);
                    };
                },1000)
            };

            item.carco.timer.end = function(item) {
                if (carco.functions.game.searchActions(item, "timerend")){
                    carco.functions.game.searchActions(item, "timerend")(item);
                }else{
                    item.carco.root.carco.solutionfunction();
                };
                if (text) text.carco.innerHTML("0:00");
                clearInterval(item.carco.timer.fn);
                item.carco.timer.endstyle(item);
            };

            item.carco.timer.endstyle = function(item){
                if (item.carco.timer.text){
                    item.carco.timer.text.carco.setStyle({color: "red"});
                };
            };

            item.carco.timer.startstyle = function(){
                if (item.carco.timer.text){
                    item.carco.timer.text.carco.setStyle({color: "reset"});
                };
            };

            var memogame = false;
            var places = item.carco.root.carco.getChildren({equal:{customparams:{gametype:"place"}}, type:"item"});
            for (var i = 0; i < places.length; i++) {
                if (places[i].carco.customparams.memogame) memogame = true;
            };

            item.carco.timer.clearlistener = function(item){
                var clear = false;
                if (item.carco.root.carco.customparams.feedbackon == "all") clear = true;
                if (item.carco.root.carco.game.process == 3||item.carco.root.carco.game.process == 2&&memogame == true) clear = true;
                return clear;
            };

            return {
                item: item
            }
        },
        root: function(item) {
            return {
                allInnersPosition: function(){
                    carco.functions.game.allInnersPosition(item);
                },
                random: function(){
                    carco.functions.game.random(item);
                },
                allMix: function(){
                    carco.functions.game.allMix(item);
                },
                allDragDuplicateOnce: function() {
                    carco.functions.game.allDragDuplicateOnce(item);
                },
                allPlaceLayer: function() {
                    carco.functions.game.allPlaceLayer(item);
                },
                allActions: function(){
                    carco.functions.game.allActions(item);
                },
                startAllValues: function(){
                    carco.functions.game.startAllValues(item);
                },
                generateLangXML: function() {
                    carco.functions.game.generateLangXML(item);
                },
                trueAllValues: function(nonequal){
                    var trueAllValues = carco.functions.game.trueAllValues(item, nonequal);
                    return trueAllValues;
                },
                allValueTrueOrFalse: function(){
                    carco.functions.game.allValueTrueOrFalse(item);
                },
                drawAllCoordinage: function(){
                    carco.functions.game.drawAllCoordinage(item);
                },
                player: function(){
                    carco.functions.game.player(item);
                },
                language: function(){
                    carco.functions.game.language(item);
                },
                titleaudio: function(type){
                    carco.functions.game.titleaudio(item, type);
                },
                scores: function(type){
                    carco.functions.game.scores(item, type);
                },
                endscreen: function(){
                    carco.functions.game.endscreen(item);
                },
                infoscreen: function(){
                    carco.functions.game.infoscreen(item);
                },
                playertitle: function(){
                    carco.functions.game.playertitle(item);
                },
                playeritems: function(){
                    carco.functions.game.playeritems(item);
                },
                getActivePlaces: function(reset){
                    return carco.functions.game.getActivePlaces(item, reset);
                },
                tracksbar: function(params){
                    return carco.functions.game.tracksbar(item, params);
                },
                startAllDrag: function(){
                    carco.functions.game.startAllDrag(item);
                },
                startAllAudio: function(){
                    carco.functions.game.startAllAudio(item);
                },
                stopAllRunnedAudio: function(src) {
                    carco.functions.game.stopAllRunnedAudio(item, src);
                },
                clearAllAudio: function(){
                    carco.functions.game.clearAllAudio(item);
                },
                startAllSelectBox: function(){
                    carco.functions.game.startAllSelectBox(item);
                },
                startAllScrollBox: function(){
                    carco.functions.game.startAllScrollBox(item);
                },
                startAllProcessBox: function(){
                    carco.functions.game.startAllProcessBox(item);
                },
                startAllstartAction: function(){
                    carco.functions.game.startAllstartAction(item);
                },
                startAllTimer: function(){
                    carco.functions.game.startAllTimer(item);
                },
                motioncontrols: function(){
                    carco.functions.game.motioncontrols(item);
                }
            };
        }
    },
    init: function(item) {
        if (!item.carco.game) carco.functions.game.getGame(item);
        for (var x in item.carco.recursivechildren){
            if (item.carco.recursivechildren[x].carco.customparams&&item.carco.recursivechildren[x].carco.customparams.gametype){
                if (!item.carco.recursivechildren[x].carco.getGame){
                    item.carco.recursivechildren[x].carco.getGame = function() {
                        carco.functions.game.getGame(item.carco.recursivechildren[x]);
                    };
                };
                item.carco.recursivechildren[x].carco.getGame();
            }
        };
    },
    getGame: function(item) {
        if (item.carco.customparams&&item.carco.customparams.gametype){
            if (carco.functions.browser.IE() == 10&&carco.functions.isMobile.any()||
                carco.functions.browser.IE() == 11&&carco.functions.isMobile.IeMobile()){
                if (item.carco.customparams.gametype == "drag"||
                    item.carco.customparams.gametype == "place"||
                    item.carco.customparams.gametype == "button"||
                    item.carco.customparams.gametype == "inputtext") {
                    if (item.carco.id !== "id102"&&item.carco.id !== "id101") {
                        item.className = item.className + " disabletouch";
                    };
                };
            };
            item.carco.game = {};
            if (carco.functions.game.types[item.carco.customparams.gametype]) item.carco.game = carco.functions.game.types[item.carco.customparams.gametype](item);
            if (item.carco.game&&item.carco.game.actions){
                if (item.carco.customparams.actions&&item.carco.game&&item.carco.game.actions) item.carco.game.actions(item.carco.customparams.actions);
            }else{
                if (item.carco.customparams.actions) carco.functions.game.actions(item, item.carco.customparams.actions);
            };
            if (item.carco.customparams.values&&item.carco.customparams.values.valueon&&item.carco.game&&item.carco.game.values&&item.carco.customparams.values.valueids) item.carco.game.values({valueids:item.carco.customparams.values.valueids, valuepoints:item.carco.customparams.valuepoints}, true, "start")
        }else{
            if (item.carco.customparams.actions) carco.functions.game.actions(item, item.carco.customparams.actions);
        }
    },
    removePlaceIds: function(item) {
        var places = item.carco.customparams.placeids;
        if (typeof places == 'string') places = [places];
        var endplaces = [];
        var changes = false;
        if (places&&places.length){
            for (var i = 0; i < places.length; i++) {
                if (item.carco.root.carco.recursivechildren[places[i]]) {
                    endplaces.push(places[i]);
                }else{
                    changes = true;
                };
            };
        };
        if (changes) {
            item.carco.customparams.placeids = endplaces;
        };
    },
    allRemovePlaceIds: function(item){
        for (var x in item.carco.recursivechildren){
            if (item.carco.recursivechildren[x].carco.customparams&&item.carco.recursivechildren[x].carco.customparams.gametype) {
                carco.functions.game.removePlaceIds(item.carco.recursivechildren[x]);
            };
        };
    },
    searchPlace: function(item){
        var places = item.carco.customparams.placeids;
        var targetplaces = [];

        if (carco.createjs.Touch.isSupported()&&item.carco.root&&item.carco.root.carco.paramsdata&&item.carco.root.carco.paramsdata.system.usertype == "user"||
            carco.functions.isMobile.any()&&item.carco.root&&item.carco.root.carco.paramsdata&&item.carco.root.carco.paramsdata.system.usertype == "user"){
            var item = carco.drag.currentdrag.item;
            var drag = item.carco.drag;
            var dragplace = drag.place;
        };

        if (item.carco.drag.goplace) dragplace = item.carco.drag.goplace;

        if (dragplace) places = [dragplace.carco.id];
        if (places){
            if (typeof places == 'string'){
                var place = item.carco.root.carco.recursivechildren[places];
                searchPosition(place, item);
            }else{
                for (var i = 0; i < places.length; i++) {
                    var place = item.carco.root.carco.recursivechildren[places[i]];
                    searchPosition(place, item);
                };
            };
        };

        function searchPosition(place, item) {
            if (place&&place.carco.game){
                var item = carco.drag.currentdrag.item;
                var drag = item.carco.drag;
                var eventx = drag.upeventx;
                var eventy = drag.upeventy;
                var bounds = carco.functions.position.getBoundingClientRect(item, "reset");
                var placebounds = carco.functions.position.getBoundingClientRect(place);
                var scrollLeft = carco.functions.position.scrollLeft()
                var scrollTop = carco.functions.position.scrollTop()
                if (carco.createjs.Touch.isSupported()&&item.carco.root&&item.carco.root.carco.paramsdata&&item.carco.root.carco.paramsdata.system.usertype == "user"||
                    carco.functions.isMobile.any()&&item.carco.root&&item.carco.root.carco.paramsdata&&item.carco.root.carco.paramsdata.system.usertype == "user"){
                    var dragplace = drag.place;
                }
                if (item.carco.drag.goplace) dragplace = item.carco.drag.goplace;
                if (!dragplace){
                    if (item.carco.customparams.drageventposdisable){
                        eventx = false;
                        eventy = false;
                    };
                    if (!eventx||!eventy){
                        eventx = bounds.left + item.carco.size.offsetWidth/2+scrollLeft;
                        eventy = bounds.top + item.carco.size.offsetHeight/2+scrollTop;
                    };
                    var searchx = eventx
                    var searchy = eventy
                    var minx = placebounds.left + scrollLeft
                    var maxx = placebounds.left + scrollLeft + place.offsetWidth;
                    var miny = placebounds.top + scrollTop
                    var maxy = placebounds.top + scrollTop + place.offsetHeight;
                };

                if (searchx > minx && searchx < maxx && searchy > miny && searchy < maxy && place.carco.game.ready !== true||dragplace&&dragplace.carco.game.ready !== true){
                    if (dragplace) place == dragplace;

                    if (place.carco.customparams.gametype == "coordinate"){
                        if (!place.carco.game.fixcoordinate) place.carco.game.fixcoordinate = {};

                        var origox = place.carco.customparams.xorigo;
                        var origoy = place.carco.customparams.yorigo;
                        var scaleX = place.carco.scale.x*item.carco.root.carco.scale.X;
                        var scaleY = place.carco.scale.y*item.carco.root.carco.scale.Y;
                        var unitypx = place.carco.customparams.unitypx;
                        var width = place.carco.size.width;
                        var height = place.carco.size.height;
                        var left = placebounds.left + scrollLeft
                        var top = placebounds.top + scrollTop
                        var itemboundpointx = item.carco.size.realOffsetWidth/2
                        var itemboundpointy = item.carco.size.realOffsetHeight/2
                        var relativex = (bounds.left+scrollLeft+itemboundpointx-left)/scaleX;
                        var relativey = (bounds.top+scrollTop+itemboundpointy-top)/scaleY;
                        var shiftx = ((origox/unitypx)-Math.floor(origox/unitypx))*unitypx*scaleX;
                        var shifty = ((origoy/unitypx)-Math.floor(origoy/unitypx))*unitypx*scaleY;

                        var x = (Math.round((relativex-shiftx)/unitypx)*(unitypx))*scaleX
                        var y = (Math.round((relativey-2*shifty)/unitypx)*(unitypx))*scaleY

                        var boundshiftx = 0;
                        var boundshifty = 0;

                        if (item.carco.position.type.boundingy){
                            if (item.carco.position.type.boundingy == "center"){boundshifty = item.carco.size.realOffsetHeight/2}
                            if (item.carco.position.type.boundingy == "max"){boundshifty = item.carco.size.realOffsetHeight}
                        };
                        if (item.carco.position.type.boundingx){
                            if (item.carco.position.type.boundingx == "center"){boundshiftx = item.carco.size.realOffsetWidth/2}
                            if (item.carco.position.type.boundingx == "max"){boundshiftx = item.carco.size.realOffsetWidth}
                        };

                        place.carco.game.fixcoordinate[item.carco.id] = [left+x+shiftx-boundshiftx, top+y+shifty-boundshifty];
                    };
                    if (place.carco.customparams.gametype !== "placecontainer") targetplaces.push(place);
                };
            }
        };
        if (item.carco.drag.goplace) item.carco.drag.goplace = false;
        targetplaces = carco.functions.array.uniq(targetplaces)
        var lasttargetplaces = [];
        if (targetplaces[targetplaces.length-1]){
            if (targetplaces[targetplaces.length-1].carco.parent&&targetplaces[targetplaces.length-1].carco.parent.carco.customparams.gametype == "placecontainer") {
                lasttargetplaces.push(targetplaces[targetplaces.length-1].carco.parent);
            };
            lasttargetplaces.push(targetplaces[targetplaces.length-1]);
        };
        return lasttargetplaces;
    },
    setOriginal: function(item, position, morecloneremove){
        var width = item.carco.originalsize.width;
        var height = item.carco.originalsize.height;
        item.carco.setSize({width:width, height:height})
        var texts = item.carco.getChildren({equal:{type:"text"}});
        if (item.carco.game.fixpositioned) item.carco.game.fixpositioned = false;
        if (texts[0]){
            for (var i = 0; i < texts.length; i++) {
                texts[i].carco.setStyle({fontSize:texts[i].carco.originalstyle.fontSize})
            }
        };
        if (position !== false) item.carco.setPosition({relative:{x:item.carco.originalposition.relative.x, y:item.carco.originalposition.relative.y}})
        item.carco.resize();
        if (morecloneremove == false) carco.functions.game.removeMoreDuplicate(item)
    },
    setPosition: function(item, place, params, savetype){
        if (!item.carco.position.type.x&&!item.carco.position.type.y){
            if (params){
                if (item.carco.position.absolute.x == params.x&&
                    item.carco.position.absolute.y == params.y){
                    var itembounds = carco.functions.position.getBoundingClientRect(item, "reset");
                    if (itembounds.left == params.x&&
                        itembounds.top == params.y){
                    }else {
                        item.carco.resize(savetype);
                    };
                }else {
                    item.carco.setPosition({absolute: {x: params.x, y: params.y}});
                    item.carco.resize(savetype);
                };
            }else{
                var placebound = carco.functions.position.getBoundingClientRect(place, "reset");
                var shiftx = 0
                var shifty = 0
                if (place.carco.type == "fixposition") {

                    var width = place.carco.size.width;
                    var height = place.carco.size.width/item.carco.originalsize.width * item.carco.size.height;
                    var scale = place.carco.size.width/item.carco.originalsize.width
                    if (item.carco.game.fixpositioned){
                        if (item.carco.game.tempinners&&item.carco.game.inners&&item.carco.game.inners[0]&&item.carco.game.tempinners[0]){
                            if (item.carco.game.tempinners[0] == item.carco.game.inners[0]) {
                                scale = 1;
                            }else {
                                scale = place.offsetWidth/item.offsetWidth
                            };
                        };
                    };

                    if (item.carco.customparams.autosizefixposition == "height"){
                        var height = place.carco.size.height;
                        var width = place.carco.size.height/item.carco.originalsize.height * item.carco.size.width;
                        var scale = place.carco.size.height/item.carco.originalsize.height;
                        if (item.carco.game.fixpositioned) {
                            if (item.carco.game.tempinners&&item.carco.game.inners&&item.carco.game.inners[0]&&item.carco.game.tempinners[0]){
                                if (item.carco.game.tempinners[0] == item.carco.game.inners[0]) {
                                    scale = 1;
                                }else {
                                    scale = place.offsetHeight/item.offsetHeight
                                };
                            };
                        }
                    };

                    if (item.carco.customparams.dragscalefixpos&&item.carco.customparams.dragscalefixpos!==1&&!isNaN(Number(item.carco.customparams.dragscalefixpos))){
                        width = width * item.carco.customparams.dragscalefixpos;
                        height = height * item.carco.customparams.dragscalefixpos;
                        scale = scale * item.carco.customparams.dragscalefixpos;
                    };

                    if (place.carco.customparams.fixposition&&place.carco.customparams.fixposition.type){
                        if (place.carco.customparams.fixposition.type.y == "center"){
                            shifty =  (place.carco.size.realOffsetHeight/2);
                        };
                        if (place.carco.customparams.fixposition.type.x == "center"){
                            shiftx = (place.carco.size.realOffsetWidth/2);
                        };
                        if (place.carco.customparams.fixposition.type.y == "max"){
                            shifty =  (place.carco.size.realOffsetHeight);
                        };
                        if (place.carco.customparams.fixposition.type.x == "max"){
                            shiftx = (place.carco.size.realOffsetWidth);
                        };
                        if (place.carco.customparams.fixposition.type.boundingy == "center"){
                            shifty = shifty - (item.carco.size.realOffsetHeight*scale)/2
                        };
                        if (place.carco.customparams.fixposition.type.boundingx == "center"){
                            shiftx = shiftx - (item.carco.size.realOffsetWidth*scale)/2
                        };
                        if (place.carco.customparams.fixposition.type.boundingy == "max"){
                            shifty = shifty - (item.carco.size.realOffsetHeight*scale)
                        };
                        if (place.carco.customparams.fixposition.type.boundingx == "max"){
                            shiftx = shiftx - (item.carco.size.realOffsetWidth*scale)
                        };
                    };

                    item.carco.game.fixpositioned = scale;

                };
                if (item.carco.position.absolute.x == placebound.left+carco.functions.position.scrollLeft()+shiftx&&
                    item.carco.position.absolute.y == placebound.top+carco.functions.position.scrollTop()+shifty){
                    var itembounds = carco.functions.position.getBoundingClientRect(item, "reset");
                    if (itembounds.left == placebound.left+carco.functions.position.scrollLeft()+shiftx&&
                        itembounds.top == placebound.top+carco.functions.position.scrollTop()+shifty){
                    }else {
                        item.carco.resize(savetype);
                    };
                }else{
                    item.carco.setPosition({
                        absolute: {
                            x: placebound.left + carco.functions.position.scrollLeft() + shiftx,
                            y: placebound.top + carco.functions.position.scrollTop() + shifty
                        }
                    });
                    item.carco.resize(savetype);
                };
            };
        }
    },
    setSize: function(item, place){
        var width = place.carco.size.width;
        var height = place.carco.size.width/item.carco.size.width * item.carco.size.height;

        if (place.carco.type == "fixposition") {
            if (item.carco.customparams.autosizefixposition == "height"){
                var height = place.carco.size.height;
                var width = place.carco.size.height/item.carco.size.height * item.carco.size.width;
            };
            if (item.carco.customparams.dragscalefixpos&&item.carco.customparams.dragscalefixpos!==1&&!isNaN(Number(item.carco.customparams.dragscalefixpos))){
                width = width * item.carco.customparams.dragscalefixpos;
                height = height * item.carco.customparams.dragscalefixpos;
            };
        };

        var originalwidth = item.carco.originalsize.width;
        var originalheight = item.carco.originalsize.height;
        var scalex = width/originalwidth
        var scalyx = height/originalheight
        if (item.carco.size.width == width&&item.carco.size.height == height){

        }else{
            item.carco.setSize({width:width, height:height})
            var texts = item.carco.getChildren({equal:{type:"text"}});
            if (texts[0]){
                for (var i = 0; i < texts.length; i++) {
                    if (texts[i].carco.originalstyle.fontSize == texts[i].carco.style.fontSize){
                        var newFontSize = Number(texts[i].carco.style.fontSize.slice(0,-2))*scalex + "px";
                        texts[i].carco.setStyle({fontSize:newFontSize})
                    };
                };
            };
            item.carco.resize();
        };
    },
    setInner: function(item, inner, type){
        if (!item.carco.game.inners) item.carco.game.inners = [];
        item.carco.game.inners.push(inner);
        if (inner.carco.customparams.gametype == "coordinate"){
            this.addPoint(inner, item);
        }else{};
        if (!type&&item.carco.game.valueTrueOrFalse) item.carco.game.valueTrueOrFalse()

        if (carco.functions.game.searchActions(item, "setinnerfunction")){
            carco.functions.game.searchActions(item, "setinnerfunction")(item);
        };

        return item.carco.game.inners;
    },
    addPoint: function(place, item, disableduplicatepoint){
        if (place.carco.customparams.gametype == "coordinate"&&item.carco.customparams.addpoints&&item.carco.customparams.gametype!=="solutionitem"){
            var bounds = carco.functions.position.getBoundingClientRect(item, "reset");
            var placebounds = carco.functions.position.getBoundingClientRect(place, "reset");
            var scrollLeft = carco.functions.position.scrollLeft();
            var scrollTop = carco.functions.position.scrollTop();
            var origox = place.carco.customparams.xorigo;
            var origoy = place.carco.customparams.yorigo;
            var scaleX = place.carco.scale.x*item.carco.root.carco.scale.X;
            var scaleY = place.carco.scale.y*item.carco.root.carco.scale.Y;
            var unitypx = place.carco.customparams.unitypx;
            var width = place.carco.size.width;
            var height = place.carco.size.height;
            var left = placebounds.left + scrollLeft
            var top = placebounds.top + scrollTop
            var relativex = (bounds.left+scrollLeft+item.carco.size.realOffsetWidth/2-left)/scaleX;
            var relativey = (bounds.top+scrollTop+item.carco.size.realOffsetHeight/2-top)/scaleY;
            var shiftx = ((origox/unitypx)-Math.floor(origox/unitypx))*unitypx*scaleX;
            var shifty = ((origoy/unitypx)-Math.floor(origoy/unitypx))*unitypx*scaleY;

            var x = (Math.round((relativex-shiftx)/unitypx)*(unitypx))*scaleX
            var y = (Math.round((relativey-2*shifty)/unitypx)*(unitypx))*scaleY

            var pointx = Math.round(((x+shiftx)-origox*scaleX)/(unitypx*scaleX))
            var pointy = Math.round(-((y+shifty)-origoy*scaleY)/(unitypx*scaleY))

            if (!disableduplicatepoint){
                if (place.carco.game.fixcoordinate[item.carco.id]){
                    place.carco.game.fixcoordinate[item.carco.id][3] = pointx
                    place.carco.game.fixcoordinate[item.carco.id][4] = pointy
                };
            };

            var points = item.carco.customparams.addpoints;

            if (points&&points !== ""){
                points = points.toString()
                points = points.replace(/\n/g, ",");
                points = points.replace(/ /gi, "")
                points = points.replace(/,,/g, ",");
                points = points.replace(/,,/g, ",");
                points = $.parseJSON(points);
            };

            var drop = false;
            if (points[0]){
                if (!disableduplicatepoint) place.carco.game.pluspoints[points[0]] = [pointx, pointy, points[1], points[2], points[3]];
                if (place.carco.customparams.disableduplicatepoints){
                    for (var i = 0; i < place.carco.game.pointsarray.length; i++) {
                        if (points[0]!==i&&place.carco.game.pointsarray[i][0] == pointx&&place.carco.game.pointsarray[i][1] == pointy) {
                            var drop = true;
                        };
                    };
                };
                if (!disableduplicatepoint) {
                    place.carco.game.coordinate();
                }else{};
            };
            if (!disableduplicatepoint) {}else{
                return drop;
            };
        };
    },
    removePoint: function(place, item){
        if (place.carco.customparams.gametype == "coordinate"&&item.carco.customparams.addpoints&&item.carco.customparams.gametype!=="solutionitem"){
            var points = item.carco.customparams.addpoints;

            if (points&&points !== ""){
                points = points.toString()
                points = points.replace(/\n/g, ",");
                points = points.replace(/ /gi, "")
                points = points.replace(/,,/g, ",");
                points = points.replace(/,,/g, ",");
                points = $.parseJSON(points);
            };

            if (points[0]){
                place.carco.game.pluspoints[points[0]] = [];
                place.carco.game.coordinate();
            };

        };
    },
    removeInner: function(item, inner, type){
        if (!item.carco.game.inners) item.carco.game.inners = [];
        var newinners = [];
        if (!inner||inner&&!inner.length){
            for (var i = 0; i < item.carco.game.inners.length; i++) {
                if (item.carco.game.inners[i] !== inner){
                    newinners.push(item.carco.game.inners[i]);
                }else{
                    var removeinner = inner;
                };
            };
        }else{
            newinners = carco.functions.array.diff(item.carco.game.inners, inner)
        };
        item.carco.game.inners = newinners;
        this.removePoint(item, inner);
        if (!type&&item.carco.game.valueTrueOrFalse) item.carco.game.valueTrueOrFalse();

        if (carco.functions.game.searchActions(item, "removeinnerfunction")){
            carco.functions.game.searchActions(item, "removeinnerfunction")(item);
        };

        return item.carco.game.inners;
    },
    allInnersPosition: function(root){
        var allautocontainer = root.carco.getChildren({equal:{type:"container"}, nonequal:{customparams:{autopositionchildren:undefined}}, type:"item"});
        for (var i = 0; i < allautocontainer.length; i++) {
            if (allautocontainer[i].carco.customparams&&allautocontainer[i].carco.customparams.autopositionchildren&&allautocontainer[i].carco.game&&allautocontainer[i].carco.game.innersPosition){
                var children = allautocontainer[i].carco.customparams.autopositionchildren;
                if (children == "container"){
                    var params = {children:"children", equal:{type:"container"}, type:"item"}
                }else{
                    var params = {children:"children", equal:{type:"container", customparams:{gametype:children}}, type:"item"}
                };
                allautocontainer[i].carco.game.innersPosition(params, true);
            }
        }
    },
    innersPosition: function(item, params, savetype){
        if (savetype == true){savetype = "save"};
        if (!item.carco.customparams.multiboxshift) item.carco.customparams.multiboxshift = 0;
        var preshift = item.carco.customparams.multiboxshift;
        var preshiftx = false;
        var preshifty = false;
        if (isNaN(item.carco.customparams.multiboxshift)&&item.carco.customparams.multiboxshift.split){
            var shiftdata = item.carco.customparams.multiboxshift.split(" ");
            if (shiftdata[3]||shiftdata[3]==0){
                if (shiftdata[0] || shiftdata[0] == 0) preshiftx = Number(shiftdata[0]);
                if (shiftdata[1] || shiftdata[1] == 0) preshifty = Number(shiftdata[1]);
                if (shiftdata[2] || shiftdata[2] == 0) var shiftx = Number(shiftdata[2]) * item.carco.scale.x * item.carco.root.carco.scale.X;
                if (shiftdata[3] || shiftdata[3] == 0) var shifty = Number(shiftdata[3]) * item.carco.scale.x * item.carco.root.carco.scale.X;
            }else{
                if (shiftdata[2]||shiftdata[2]==0) {
                    if (shiftdata[0] || shiftdata[0] == 0) preshift = Number(shiftdata[0]);
                    if (shiftdata[1] || shiftdata[1] == 0) var shiftx = Number(shiftdata[1]) * item.carco.scale.x * item.carco.root.carco.scale.X;
                    if (shiftdata[2] || shiftdata[2] == 0) var shifty = Number(shiftdata[2]) * item.carco.scale.x * item.carco.root.carco.scale.X;
                }else{
                    if (shiftdata[0] || shiftdata[0] == 0) preshiftx = Number(shiftdata[0]);
                    if (shiftdata[1] || shiftdata[1] == 0) preshifty = Number(shiftdata[1]);
                };
            };
        };
        if (preshiftx||preshiftx == 0&&preshiftx !== false){
            var pshiftx = preshiftx * item.carco.scale.x * item.carco.root.carco.scale.X;
        };
        if (preshifty||preshifty == 0&&preshifty !== false){
            var pshifty = preshifty * item.carco.scale.x * item.carco.root.carco.scale.X;
        };
        var shift = preshift * item.carco.scale.x * item.carco.root.carco.scale.X;
        function getShiftX(){
            if (pshiftx||pshiftx == 0){
                return pshiftx;
            }else{
                return shift;
            };
        };
        function getShiftY(){
            if (pshifty||pshifty == 0){
                return pshifty;
            }else{
                return shift;
            };
        };
        var scrollLeft = carco.functions.position.scrollLeft()
        var scrollTop = carco.functions.position.scrollTop()
        item.carco.getPosition()
        var itembounds = item.getBoundingClientRect()
        item.carco.game.maxinnerx = itembounds.left + scrollLeft
        item.carco.game.maxinnery = itembounds.top + scrollTop
        item.carco.game.mininnerx = itembounds.left + getShiftX() + scrollLeft
        item.carco.game.mininnery = itembounds.top + getShiftY() + scrollTop
        if (!isNaN(shiftx)&&shiftx||shiftx == 0) item.carco.game.mininnerx = itembounds.left + shiftx + scrollLeft;
        if (!isNaN(shifty)&&shifty||shifty == 0) item.carco.game.mininnery = itembounds.top + shifty + scrollTop;
        var tempparams = params;
        if (!params) var params = {};
        if (!params.children) params.children = "inners";
        if (params.children == "inners"){
            var inners = item.carco.game.inners;
            if (item.carco.root.carco.recursivechildren["id103"]) inners = carco.functions.array.diff(inners, [item.carco.root.carco.recursivechildren["id103"]]);

        }else{
            params.type = "item";
            var inners = item.carco.getChildren(params);
            if (item.carco.root.carco.recursivechildren["id103"]) inners = carco.functions.array.diff(inners, [item.carco.root.carco.recursivechildren["id103"]]);
            if (inners.length > 0){
                var possorter = {};
                var xyarray = [];
                var newinners = [];
                for (var i = 0; i < inners.length; i++) {
                    var itembounds = inners[i].getBoundingClientRect()
                    var newarray = [itembounds.left, itembounds.top, inners[i]];
                    xyarray.push(newarray);
                };
                xyarray.sort(function sortFunction(a, b) {
                    if (a[0] === b[0]) {
                        return 0;
                    }else{
                        return (a[0] > b[0]) ? 1 : -1;
                    };
                });
                xyarray.sort(function sortFunction(a, b) {
                    if (a[1] === b[1]) {
                        return 0;
                    }else{
                        return (a[1] > b[1]) ? 1 : -1;
                    };
                });
                for (var y = 0; y < xyarray.length; y++) {
                    newinners.push(xyarray[y][2]);
                };
                if (params.equal&&params.equal.type !== "fixposition"&&item.carco.customparams.autopositionchildrentype !== "id") {
                    inners = newinners;
                };
            };
        }
        var fixposition = item.carco.getChildren({equal:{type:"fixposition"}, type:"item"});
        var deletefix = []
        for (var i = 0; i < fixposition.length; i++) {
            if (fixposition[i].carco.parent !== item&&fixposition[i].carco.parent.carco.customparams.gametype == "place") deletefix.push(fixposition[i])
        };
        fixposition = carco.functions.array.diff(fixposition, deletefix);

        if (inners&&inners.length > 0){

            newinners = [];
            for (var i = 0; i < inners.length; i++) {
                if (inners[i].carco.id.slice(-2) !== "ai"&&inners[i].carco.id.slice(-2) !== "pl"&&!inners[i].carco.customparams.disablemagnet) newinners.push(inners[i]);
                if (inners[i].carco.customparams.disablemagnet){
                    var dibounds = inners[i].getBoundingClientRect();
                    var disetx = dibounds.left+scrollLeft;
                    var disety = dibounds.top+scrollTop;
                    if (!inners[i].carco.game||!inners[i].carco.game.setPosition){
                        carco.functions.game.setPosition(inners[i], false, {x:disetx, y:disety}, savetype);
                    }else{
                        inners[i].carco.game.setPosition(false, {x:disetx, y:disety}, savetype);
                    };
                };
            };
            inners = newinners;

            for (var i = 0; i < inners.length; i++) {
                var filter = ""
                if (!tempparams) {
                    if (inners[i].carco.customparams.gametype=="button") filter = "button";
                    if (inners[i].carco.customparams.gametype=="inputtext") filter = "inputtext";
                };
                if (!inners[i].carco.position.type.x&&!inners[i].carco.position.type.y&&inners[i].carco.customparams.gametype !== filter){
                    if (fixposition[i]&&params.children == "inners"){
                        inners[i].carco.game.setPosition(fixposition[i], false, savetype)
                        inners[i].carco.game.setSize(fixposition[i]);
                        setMaxInnersPosition(fixposition[i], inners[i]);
                    }else{
                        if (inners[i].carco.customparams.solduplicate&&inners[i].carco.customparams.addpoints){
                            var points = inners[i].carco.customparams.addpoints;
                            var solpoints = [];
                            if (item.carco.game.solution) solpoints = item.carco.game.solution.points;
                            if (points&&points !== ""){
                                points = points.toString()
                                points = points.replace(/\n/g, ",");
                                points = points.replace(/ /gi, "")
                                points = points.replace(/,,/g, ",");
                                points = points.replace(/,,/g, ",");
                                points = $.parseJSON(points);
                            };
                            if (points[0]&&solpoints[points[0]]){
                                var pointx = solpoints[points[0]][0];
                                var pointy = solpoints[points[0]][1];

                                var place = item;

                                var bounds = inners[i].getBoundingClientRect();
                                var placebounds = place.getBoundingClientRect();

                                var origox = place.carco.customparams.xorigo;
                                var origoy = place.carco.customparams.yorigo;
                                var scaleX = place.carco.scale.x*item.carco.root.carco.scale.X;
                                var scaleY = place.carco.scale.y*item.carco.root.carco.scale.Y;
                                var unitypx = place.carco.customparams.unitypx;
                                var width = place.carco.size.width;
                                var height = place.carco.size.height;
                                var left = placebounds.left;
                                var top = placebounds.top;
                                var shiftx = ((origox/unitypx)-Math.floor(origox/unitypx))*unitypx*scaleX;
                                var shifty = ((origoy/unitypx)-Math.floor(origoy/unitypx))*unitypx*scaleY;

                                var boundshiftx = 0;
                                var boundshifty = 0;

                                var solitem = item.carco.root.carco.recursivechildren[inners[i].carco.customparams.solduplicate];
                                if (solitem){
                                    if (solitem.carco.position.type.boundingy){
                                        if (solitem.carco.position.type.boundingy == "center"){boundshifty = -solitem.carco.size.realOffsetHeight/2}
                                        if (solitem.carco.position.type.boundingy == "max"){boundshifty = -solitem.carco.size.realOffsetHeight}
                                    };
                                    if (solitem.carco.position.type.boundingx){
                                        if (solitem.carco.position.type.boundingx == "center"){boundshiftx = -solitem.carco.size.realOffsetWidth/2}
                                        if (solitem.carco.position.type.boundingx == "max"){boundshiftx = -solitem.carco.size.realOffsetWidth}
                                    };
                                };

                                var setx = left+(origox+(unitypx*pointx))*scaleX+boundshiftx+scrollLeft
                                var sety = top+(origoy-(unitypx*pointy))*scaleY+boundshifty+scrollTop

                                if (item.carco.customparams.solposition&&item.carco.customparams.solposition.type){
                                    if (item.carco.customparams.solposition.type.boundingx == "center") setx = setx + inners[i].carco.size.realOffsetWidth/2;
                                    if (item.carco.customparams.solposition.type.boundingx == "max") setx = setx + inners[i].carco.size.realOffsetWidth;
                                    if (item.carco.customparams.solposition.type.boundingy == "center") sety = sety + inners[i].carco.size.realOffsetHeight/2;
                                    if (item.carco.customparams.solposition.type.boundingy == "max") sety = sety + inners[i].carco.size.realOffsetHeight;
                                };

                            };

                        }else{
                            if (item.carco.game.fixcoordinate&&item.carco.game.fixcoordinate[inners[i].carco.id]){
                                var setx = item.carco.game.fixcoordinate[inners[i].carco.id][0]
                                var sety = item.carco.game.fixcoordinate[inners[i].carco.id][1]
                            }else{
                                if (item.carco.game.maxinnerx+inners[i].offsetWidth+getShiftX()*0.9 < item.carco.size.realOffsetWidth+item.carco.position.absolute.x + scrollLeft){
                                    if (!shiftx&&shiftx!==0) shiftx = getShiftX();
                                    if (!shifty&&shifty!==0) shifty = getShiftY();
                                    if (!leftshift) {
                                        var setx = item.carco.game.maxinnerx + shiftx;
                                    }else{
                                        var setx = item.carco.game.maxinnerx + getShiftX();
                                    };
                                    if (!topshift) {
                                        var sety = item.carco.game.mininnery;
                                    }else{
                                        var sety = item.carco.game.mininnery;
                                    };
                                    var leftshift = true;
                                    var topshift = true;
                                } else {
                                    if (!shiftx&&shiftx!==0) shiftx = getShiftX();
                                    if (!shifty&&shifty!==0) shifty = getShiftY();
                                    var setx = item.carco.position.absolute.x + shiftx + scrollLeft
                                    var sety = item.carco.game.maxinnery + getShiftY()
                                    item.carco.game.maxinnerx = item.carco.position.absolute.x + getShiftX() + scrollLeft;
                                    item.carco.game.mininnerx = item.carco.position.absolute.x + getShiftX() + scrollLeft;
                                    shifty = getShiftY()
                                };

                                if (item.carco.position.type.boundingx == "center") setx = setx + item.carco.size.realOffsetWidth/2;
                                if (item.carco.position.type.boundingx == "max") setx = setx + item.carco.size.realOffsetWidth;
                                if (item.carco.position.type.boundingy == "center") sety = sety + item.carco.size.realOffsetHeight/2;
                                if (item.carco.position.type.boundingy == "max") sety = sety + item.carco.size.realOffsetHeight;
                                if (inners[i].carco.position.type.boundingx == "center") setx = setx - inners[i].carco.size.realOffsetWidth/2;
                                if (inners[i].carco.position.type.boundingx == "max") setx = setx - inners[i].carco.size.realOffsetWidth;
                                if (inners[i].carco.position.type.boundingy == "center") sety = sety - inners[i].carco.size.realOffsetHeight/2;
                                if (inners[i].carco.position.type.boundingy == "max") sety = sety - inners[i].carco.size.realOffsetHeight;

                            };
                        };
                        if (!inners[i].carco.game||!inners[i].carco.game.setPosition){
                            carco.functions.game.setPosition(inners[i], false, {x:setx, y:sety}, savetype);
                        }else{
                            inners[i].carco.game.setPosition(false, {x:setx, y:sety}, savetype);
                        };
                        setMaxInnersPosition(false, inners[i], {x:setx, y:sety});
                    };
                };
            }
        };

        function setMaxInnersPosition(positem, inneritem, params){
            var newmaxx = 0;
            var newmaxy = 0;
            var newminx = 0;
            var newminy = 0;
            if (positem){
                var scrollLeft = carco.functions.position.scrollLeft()
                var scrollTop = carco.functions.position.scrollTop()
                var itembounds = positem.getBoundingClientRect()
                newmaxx = itembounds.left + scrollLeft + inneritem.carco.size.realOffsetWidth;
                newmaxy = itembounds.top + scrollTop + inneritem.carco.size.realOffsetHeight;
                newminx = itembounds.left + scrollLeft;
                newminy = itembounds.top + scrollTop;
            };
            if (params){
                var scrollLeft = carco.functions.position.scrollLeft()
                var scrollTop = carco.functions.position.scrollTop()
                newmaxx = params.x + inneritem.carco.size.realOffsetWidth;
                newmaxy = params.y + inneritem.carco.size.realOffsetHeight;
                newminx = params.x
                newminy = params.y
            };
            if (item.carco.game.maxinnerx < newmaxx){
                item.carco.game.maxinnerx = newmaxx;
            };
            if (item.carco.game.maxinnery < newmaxy){
                item.carco.game.maxinnery = newmaxy;
            };
            if (item.carco.game.mininnerx < newminx){
                item.carco.game.mininnerx = newminx;
            };
            if (item.carco.game.mininnery < newminy){
                item.carco.game.mininnery = newminy;
            };
        };
    },
    allMix: function(root){
        var allmixcontainer = root.carco.getChildren({equal:{type:"container", customparams:{gametype:"random_mix_sort_cont"}}, type:"item"});
        for (var i = 0; i < allmixcontainer.length; i++) {
            allmixcontainer[i].carco.game.mathgenerate();
            allmixcontainer[i].carco.game.mix();
        };
    },
    allDragDuplicateOnce: function(root){
        var alldrag = root.carco.getChildren({equal:{type:"container", customparams:{gametype:"drag"}}, type:"item"});
        for (var i = 0; i < alldrag.length; i++) {
            if (alldrag[i].carco.customparams.dragduplicate == "once") alldrag[i].carco.game.dragduplicate();
        };
    },
    allPlaceLayer: function(root){
        var alldrag = root.carco.getChildren({equal:{type:"container", customparams:{gametype:"place"}}, type:"item"});
        for (var i = 0; i < alldrag.length; i++) {
            carco.drag.addPlaceLayer(alldrag[i]);
            if (!alldrag[i].carco.placeitemslistener) {
                if (carco.functions.browser.IE() == 10&&carco.functions.isMobile.any()||carco.functions.browser.IE() == 11&&carco.functions.isMobile.IeMobile()) {
                    carco.functions.listeners.add(alldrag[i].carco.dragplacelayer, "MSPointerDown", carco.drag.placefunction);
                }else{
                    carco.functions.listeners.add(alldrag[i].carco.dragplacelayer, "mousedown", carco.drag.placefunction);
                };
                alldrag[i].carco.placeitemslistener = true;
            };
        };
    },
    mix: function(item, mixtype){
        if (mixtype) item.carco.customparams.mixtype = mixtype;
        if (!item.carco.customparams.mixtype) item.carco.customparams.mixtype = false;
        var children = item.carco.customparams.mixtype;
        if (children !== false){
            var mixchildren = "children"
            if (item.carco.customparams.mixchildren) var mixchildren = "recursivechildren";
            if (children == "container"){
                var params = {children:mixchildren, equal:{type:"container"}, type:"item"}
            }else{
                var params = {children:mixchildren, equal:{type:"container", customparams:{gametype:children}}, type:"item"}
            };
            var inners = item.carco.getChildren(params);
            var scrollLeft = carco.functions.position.scrollLeft();
            var scrollTop = carco.functions.position.scrollTop();
            var xyarray = [];
            for (var i = 0; i < inners.length; i++) {
                var newarray = [inners[i].carco.position.absolute.x+scrollLeft, inners[i].carco.position.absolute.y+scrollTop]
                xyarray.push(newarray);
            };

            xyarray = carco.functions.array.shuffle(xyarray);
            for (var i = 0; i < inners.length; i++) {
                if (!inners[i].carco.game) inners[i].carco.game = {};
                if (!inners[i].carco.game.setPosition){
                    carco.functions.game.setPosition(inners[i], false, {x:xyarray[i][0], y:xyarray[i][1]}, "save");
                }else{
                    inners[i].carco.game.setPosition(false, {x:xyarray[i][0], y:xyarray[i][1]}, "save");
                };
            };
        };
        this.replaceSortInnerHTML(item);
    },
    replaceSortInnerHTML: function(item) {
        if (!item.carco.customparams.sorttype) item.carco.customparams.sorttype = false;
        var children = item.carco.customparams.sorttype;
        if (children !== false){
            var mixchildren = "children"
            if (item.carco.customparams.sortchildren) var mixchildren = "recursivechildren";
            if (children == "container"){
                var params = {children:mixchildren, equal:{type:"container"}, type:"item"}
            }else{
                var params = {children:mixchildren, equal:{type:"container", customparams:{gametype:children}}, type:"item"}
            };
            var inners = item.carco.getChildren(params);

            var xyarray = [];
            var newinners = [];
            for (var i = 0; i < inners.length; i++) {
                var itembounds = inners[i].getBoundingClientRect()
                var newarray = [itembounds.left, itembounds.top, inners[i]];
                xyarray.push(newarray);
            };

            xyarray.sort(function sortFunction(a, b) {
                if (a[0] === b[0]) {
                    if (a[1] === b[1]) {
                        return 0;
                    }else{
                        return (a[1] > b[1]) ? 1 : -1;
                    };
                }else{
                    return (a[0] > b[0]) ? 1 : -1;
                };
            });
            xyarray.sort(function sortFunction(a, b) {
                if (a[1] === b[1]) {
                    if (a[0] === b[0]) {
                        return 0;
                    }else{
                        return (a[0] > b[0]) ? 1 : -1;
                    };
                }else{
                    return (a[1] > b[1]) ? 1 : -1;
                };
            });

            for (var y = 0; y < xyarray.length; y++) {
                newinners.push(xyarray[y][2]);
            };

            var sortarray = item.carco.customparams.sortarray;

            if (sortarray&&sortarray !== ""){
                sortarray = sortarray.toString()
                sortarray = sortarray.replace(/\n/g, ",");
                sortarray = sortarray.replace(/,,/g, ",");
                sortarray = sortarray.replace(/,,/g, ",");
                sortarray = $.parseJSON(sortarray);

                if (sortarray&&typeof sortarray == "array"||sortarray&&typeof sortarray == "object"&&sortarray.length){
                    for (var i = 0; i < newinners.length; i++) {
                        var text = newinners[i].carco.getChildren({equal:{type:"text"}});
                        if (text&&text[0]&&sortarray[i]){
                            var endstring = sortarray[i];
                            if (sortarray[i][0]&&sortarray[i][0]!==sortarray[i]) endstring = eval(sortarray[i][0]);
                            for (a = 0; a < 10; a++) {
                                if (endstring) {
                                    text[0].carco.innerHTML(endstring, "save");
                                    sortarray[i] = endstring;
                                    break;
                                }else{
                                    if (sortarray[i][0]) endstring = eval(sortarray[i][0]);
                                }
                            };
                        };
                        if (newinners[i].carco.game&&newinners[i].carco.game.solitem){
                            var text = newinners[i].carco.game.solitem.carco.getChildren({equal:{type:"text"}});
                            if (text&&text[0]&&sortarray[i]){
                                text[0].carco.innerHTML(sortarray[i], "save");
                            };
                        };
                    };
                };
            };

        };
    },
    startAllDrag: function(root){
        var alldrag = root.carco.getChildren({equal:{type:"container", customparams:{gametype:"drag"}}, type:"item"});
        for (var i = 0; i < alldrag.length; i++) {
            if (alldrag[i].carco.customparams.startdrag) alldrag[i].carco.game.startdrag();
        };
        if (carco.drag.currentdrag&&carco.drag.currentdrag.item)carco.drag.currentdrag.item = false;
        setTimeout(function() {
            root.carco.game.process = 0;
            root.carco.game.player();
        },500)
    },
    startAllAudio: function(root){
        var allaudio = root.carco.getChildren({equal:{type:"container", customparams:{gametype:"audio"}}, type:"item"});
        for (var i = 0; i < allaudio.length; i++) {
            if (allaudio[i].carco.customparams.audio&&allaudio[i].carco.customparams.audio.src&&allaudio[i].carco.game.loadAudio) allaudio[i].carco.game.loadAudio();
        };
    },
    clearAllAudio: function(root){
        var allaudio = root.carco.getChildren({equal:{type:"container", customparams:{gametype:"audio"}}, type:"item"});
        for (var i = 0; i < allaudio.length; i++) {
            if (allaudio[i].carco.customparams.audio&&allaudio[i].carco.customparams.audio.src&&allaudio[i].carco.game.stopAudio) {
                var src = root.carco.urls.root + root.carco.urls.imagesfolder + allaudio[i].carco.customparams.audio.src;
                //carco.createjs.Sound.stop();
            };
        };

        carco.createjs.Sound.stop();

        if (root.carco.audiosobject){
            for (var x in root.carco.audiosobject){
                if (root.carco.audiosobject[x].destroy){
                    //root.carco.audiosobject[x].destroy();
                };
            };
        };
        //carco.createjs.Sound.removeAllSounds();

    },
    startAllstartAction: function(root){
        var allcontainer = root.carco.getChildren({equal:{type:"container"}, type:"item"});
        for (var i = 0; i < allcontainer.length; i++) {
            if (allcontainer[i].carco.customparams.startaction){
                if (carco.functions.game.searchActions(allcontainer[i], "startaction")){
                    carco.functions.game.searchActions(allcontainer[i], "startaction")(allcontainer[i]);
                };
            };
        };
    },
    motioncontrols: function(item) {
        if (!item.carco.motioncontrols) item.carco.motioncontrols = {};
        item.carco.motionallstart = function() {
            if (!item.carco.motioncontrols.allstart){
                var root = item;
                root.carco.getChildren({equal:{customparams:{gametype:"pngseq"}}, call:{pngseqstart:{}}});
                root.carco.getChildren({equal:{customparams:{gametype:"csstransist"}}, call:{csstransiststart:{}}});
                item.carco.motioncontrols.allstop = false;
                item.carco.motioncontrols.allpause = false;
                item.carco.motioncontrols.allstart = true;
            };
        };
        item.carco.motionallstop = function() {
            if (!item.carco.motioncontrols.allstop){
                var root = item;
                root.carco.getChildren({equal:{customparams:{gametype:"pngseq"}}, call:{pngseqend:1}});
                root.carco.getChildren({equal:{customparams:{gametype:"csstransist"}}, call:{csstransistend:1}});
                item.carco.motioncontrols.allstop = true;
                item.carco.motioncontrols.allpause = false;
                item.carco.motioncontrols.allstart = false;
            };
        };
        item.carco.motionallpause = function() {
            if (!item.carco.motioncontrols.allpause&&item.carco.motioncontrols.allstart) {
                var root = item;
                root.carco.getChildren({equal: {customparams: {gametype: "pngseq"}}, call: {pngseqpause: 1}});
                root.carco.getChildren({equal: {customparams: {gametype: "csstransist"}}, call: {csstransistpause: 1}});
                item.carco.motioncontrols.allstop = false;
                item.carco.motioncontrols.allpause = true;
                item.carco.motioncontrols.allstart = false;
            };
        };
        item.carco.motionallreset = function() {
            var root = item;
            root.carco.getChildren({equal:{customparams:{gametype:"pngseq"}}, call:{pngseqreset:1}});
            root.carco.getChildren({equal:{customparams:{gametype:"csstransist"}}, call:{csstransistreset:1}});
            item.carco.motioncontrols.allstop = true;
            item.carco.motioncontrols.allpause = false;
            item.carco.motioncontrols.allstart = false;
        };
    },
    startAllTimer: function(root){
        var allcontainer = root.carco.getChildren({equal:{type:"container", customparams:{gametype:"timer"}}, type:"item"});
        for (var i = 0; i < allcontainer.length; i++) {
            if (!carco.functions.game.searchActions(allcontainer[i], "timerend")&&root.carco.paramsdata.user.disablestarttimer){
            }else {
                if (allcontainer[i].carco.timer.start) allcontainer[i].carco.timer.start();
            };
            if (!carco.functions.game.searchActions(allcontainer[i], "timerend")&&root.carco.paramsdata.user.disabletimervisibility) {
                allcontainer[i].carco.setStyle({visibility:"hidden"}, "save");
                allcontainer[i].setAttribute("style", "visibility:hidden!important");
                if (allcontainer[i].carco.parent){
                    //majd ki kell találni, hogy mit vizsgáljunk a timer eltüntetésénél
                    var aimages = allcontainer[i].carco.parent.carco.getChildren({children:"recursivechildren", equal:{type:"image", customparams:{checkitem:undefined}}, type:"item"});
                    if (aimages.length == 1){
                        aimages[0].setAttribute("style", "visibility:hidden!important");
                        aimages[0].carco.setStyle({visibility:"hidden"}, "save");
                    };
                };
            };
        };
    },
    startAllSelectBox: function(root){
        var alldrag = root.carco.getChildren({equal:{type:"container", customparams:{gametype:"random_mix_sort_cont"}}, type:"item"});
        for (var i = 0; i < alldrag.length; i++) {
            if (alldrag[i].carco.customparams.selectbox) alldrag[i].carco.game.selectbox();
        };
    },
    startAllScrollBox: function(root){
        var alldrag = root.carco.getChildren({equal:{type:"container", customparams:{gametype:"random_mix_sort_cont"}}, type:"item"});
        for (var i = 0; i < alldrag.length; i++) {
            if (alldrag[i].carco.customparams.scrollbox) alldrag[i].carco.game.scrollbox();
        };
    },
    startAllProcessBox: function(root){
        var alldrag = root.carco.getChildren({equal:{type:"container", customparams:{gametype:"random_mix_sort_cont"}}, type:"item"});
        for (var i = 0; i < alldrag.length; i++) {
            if (alldrag[i].carco.customparams.processbox) alldrag[i].carco.game.processbox();
        };
    },
    startdrag: function(item) {
        item.carco.game.startdragged = true;
        item.carco.drag.up(false, item);
    },
    textarray: function(item){
        var textarray = item.carco.customparams.textarray;
        var replacetext = item.carco.getChildren({equal:{type:"text"}});
        replacetext = replacetext[0];
        if (replacetext&&textarray&&textarray !== ""){
            textarray = textarray.toString()
            textarray = textarray.replace(/\n/g, ",");
            textarray = textarray.replace(/,,/g, ",");
            textarray = textarray.replace(/,,/g, ",");
            textarray = $.parseJSON(textarray);
            var text = [];
            if (textarray&&typeof textarray == "array"||textarray&&typeof textarray == "object"&&textarray.length){
                for (var i = 0; i < textarray.length; i++) {
                    var textitem = false;
                    if (item.carco.root.carco.recursivechildren[textarray[i]]) textitem = item.carco.root.carco.recursivechildren[textarray[i]];
                    if (item.carco.root.carco.recursivechildren["id"+textarray[i]]) textitem = item.carco.root.carco.recursivechildren["id"+textarray[i]];
                    if (textitem&&textitem.carco.customparams.innerHTML){
                        if (textitem.carco.customparams.mathjax == true) {
                            text = text + textitem.carco.customparams.innerHTML + " ";
                        }else{
                            text = text + textitem.innerHTML + " ";
                        };
                    };
                    var innertexts = textitem.carco.getChildren({equal:{type:"text"}});
                    if (innertexts&&innertexts[0]){
                        for (var a = 0; a < innertexts.length; a++) {
                            if (innertexts[a].carco.customparams.innerHTML) {
                                if (innertexts[a].carco.customparams.mathjax){
                                    text = text + innertexts[a].carco.customparams.innerHTML + " ";
                                }else{
                                    text = text + innertexts[a].innerHTML + " ";
                                };
                            };
                        };
                    };
                };
            };
            replacetext.carco.innerHTML(text);
        };
    },
    processbox: function(item, buttonitem){
        if (item.carco.customparams.processbox){
            var processboxitems = item.carco.customparams.processboxitems;
            var childrentype = item.carco.customparams.processboxitemstype;
            var root = item.carco.root;
            var rch = root.carco.recursivechildren;

            if (!item.carco.game.processboxitems&&processboxitems&&processboxitems !== ""){
                processboxitems = processboxitems.toString()
                processboxitems = processboxitems.replace(/\n/g, ",");
                processboxitems = processboxitems.replace(/,,/g, ",");
                processboxitems = processboxitems.replace(/,,/g, ",");
                processboxitems = $.parseJSON(processboxitems);
                item.carco.game.processboxitems = [];
                item.carco.game.processboxitemswithtag = [];
                item.carco.game.processboxcontact = {};

                if (processboxitems&&typeof processboxitems == "array"||processboxitems&&typeof processboxitems == "object"&&processboxitems.length){
                    for (var i = 0; i < processboxitems.length; i++) {
                        if (processboxitems[i]&&processboxitems[i][0]&&processboxitems[i][1]){
                            var startitem = false;
                            if (rch[processboxitems[i][0]]) startitem = rch[processboxitems[i][0]];
                            if (rch["id"+processboxitems[i][0]]) startitem = rch["id"+processboxitems[i][0]];
                            var enditem = false;
                            if (rch[processboxitems[i][1]]) enditem = rch[processboxitems[i][1]];
                            if (rch["id"+processboxitems[i][1]]) enditem = rch["id"+processboxitems[i][1]];
                            if (startitem&&enditem){
                                if (!item.carco.game.processboxcontact[startitem.carco.id]) {
                                    item.carco.game.processboxcontact[startitem.carco.id] = [];
                                };
                                item.carco.game.processboxitems.push([startitem, enditem]);

                                var tag = false;
                                if (processboxitems[i][2]) tag = processboxitems[i][2];
                                if (tag&&!item.carco.game.processboxcontact[startitem.carco.id+tag]) item.carco.game.processboxcontact[startitem.carco.id+tag] = [];
                                if (tag) item.carco.game.processboxcontact[startitem.carco.id+tag].push(enditem);
                                if (tag) item.carco.game.processboxitemswithtag.push([startitem, enditem, tag]);

                                item.carco.game.processboxcontact[startitem.carco.id].push(enditem);
                            };
                        };
                    };
                };
            };

            if (!item.carco.game.processchildren) {
                if (!childrentype) childrentype = "button";
                var children = item.carco.getChildren({equal: {customparams: {gametype: childrentype}}});
                item.carco.game.processchildren = children;
            };

            var children = item.carco.game.processchildren;
            var deep = 0;
            for (var i = 0; i < children.length; i++) {
                var ready = false;
                if (children[i].carco.game&&children[i].carco.button&&children[i].carco.game&&children[i].carco.button.pressed) ready = true;
                if (ready) deep = deep + 1;
            };

            if (!item.carco.game.processreset){
                item.carco.game.processreset = function() {
                    var children = item.carco.game.processchildren;
                    for (var i = 0; i < children.length; i++) {
                        if (children[i].carco.game&&children[i].carco.button){
                            if (children[i].carco.button.pressed){
                                children[i].carco.game.ready = false;
                                children[i].carco.button.down("processBox");
                                carco.functions.listeners.removeAllListeners(children[i]);
                                carco.functions.listeners.addAllListeners(children[i]);
                            }else {
                                item.carco.game.processButtonStyleReset(children[i])
                            };
                        }
                    };
                    carco.functions.listeners.enableItems(item);
                    item.carco.game.processboxitems = false;
                    item.carco.game.processdeep = 0;
                    item.carco.game.lastpressed = [];
                    item.carco.game.lastpressedup = [];
                    item.carco.game.lasttag = [];
                    item.carco.game.processchildren = false;
                    item.carco.game.lasttagtext = false;
                    item.carco.game.processbox();
                };
            };

            if (!item.carco.game.processcall){
                item.carco.game.processcall = function(call, diff, uniq) {
                    if (call){
                        var children = item.carco.game.processchildren;
                        if (diff&&diff.length) var children = carco.functions.array.diff(children, diff);
                        if (uniq&&uniq.length) var children = uniq;
                        if (children&&children.length){
                            for (var i = 0; i < children.length; i++) {
                                call(children[i], i);
                            };
                        };
                    };
                };
            };

            if (!item.carco.game.setCoordinate){
                item.carco.game.setCoordinate = function(n, c, lp) {
                    if (n&&c){
                        if (lp){
                            var place = c;
                            var item = lp;
                            var bounds = carco.functions.position.getBoundingClientRect(item, "reset");
                            var placebounds = carco.functions.position.getBoundingClientRect(place, "reset");
                            var scrollLeft = carco.functions.position.scrollLeft();
                            var scrollTop = carco.functions.position.scrollTop();
                            var origox = place.carco.customparams.xorigo;
                            var origoy = place.carco.customparams.yorigo;
                            var scaleX = place.carco.scale.x*item.carco.root.carco.scale.X;
                            var scaleY = place.carco.scale.y*item.carco.root.carco.scale.Y;
                            var unitypx = place.carco.customparams.unitypx;
                            var width = place.carco.size.width;
                            var height = place.carco.size.height;
                            var left = placebounds.left + scrollLeft
                            var top = placebounds.top + scrollTop
                            var relativex = (bounds.left+scrollLeft+item.carco.size.realOffsetWidth/2-left)/scaleX;
                            var relativey = (bounds.top+scrollTop+item.carco.size.realOffsetHeight/2-top)/scaleY;
                            var shiftx = ((origox/unitypx)-Math.floor(origox/unitypx))*unitypx*scaleX;
                            var shifty = ((origoy/unitypx)-Math.floor(origoy/unitypx))*unitypx*scaleY;

                            var x = (Math.round((relativex-shiftx)/unitypx)*(unitypx))*scaleX
                            var y = (Math.round((relativey-2*shifty)/unitypx)*(unitypx))*scaleY

                            var pointx = Math.round(((x+shiftx)-origox*scaleX)/(unitypx*scaleX))
                            var pointy = Math.round(-((y+shifty)-origoy*scaleY)/(unitypx*scaleY))

                            c.carco.game.pluspoints[n] = [Number(pointx),Number(pointy), false,"#0aa0d7",10];;
                        }else{
                            c.carco.game.pluspoints[n] = [];
                        };
                        c.carco.game.coordinate()
                    };
                };
            };

            if (!item.carco.game.clearPressed){
                item.carco.game.clearPressed = function(a) {
                    var children = item.carco.game.processchildren;
                    var diff = [];
                    for (var i = 0; i < children.length; i++) {
                        if (children[i].carco.game && children[i].carco.button && children[i].carco.button.pressed) {
                            diff.push(children[i]);
                        };
                    };
                    var e = carco.functions.array.diff(a, diff);
                    return e;
                };
            };

            if (!item.carco.game.processButtonStyleReset){
                item.carco.game.processButtonStyleReset = function(item) {
                    if (item.carco.actions&&
                        item.carco.actions.button&&
                        item.carco.actions.button["function"]&&
                        item.carco.customparams.actions&&
                        item.carco.customparams.actions.button&&
                        item.carco.customparams.actions.button.functions&&
                        item.carco.customparams.actions.button.functions["function"]){
                        item.carco.actions.button["function"]();
                    }else{
                        if (!item.carco.customparams.autostyle) item.carco.customparams.autostyle = "button1_image_colorise";
                        if (item.carco.customparams.autostyle&&carco.functions.autostyle[item.carco.customparams.autostyle]){
                            carco.functions.autostyle[item.carco.customparams.autostyle](item);
                        };
                    };
                };
            };

            item.carco.game.processdeep = deep;
            if (!item.carco.game.lastpressed) item.carco.game.lastpressed = [];
            if (!item.carco.game.lastpressedup) item.carco.game.lastpressedup = [];
            if (!item.carco.game.lasttag) item.carco.game.lasttag = [];

            if (buttonitem&&buttonitem.carco.game&&buttonitem.carco.button) {
                if (buttonitem.carco.button.pressed){
                    var lasttag = false;
                    if (item.carco.game.lastpressed[deep-1]){
                        for (var i = 0; i < item.carco.game.processboxitems.length; i++) {
                            if (item.carco.game.processboxitems[i]&&
                                item.carco.game.processboxitems[i][0] == item.carco.game.lastpressed[deep-1]&&
                                item.carco.game.processboxitems[i][1] == buttonitem) {
                                if (item.carco.game.processboxitemswithtag[i]) lasttag = item.carco.game.processboxitemswithtag[i][2];
                            };
                        };
                    };
                    item.carco.game.lastpressed[deep] = buttonitem;
                    item.carco.game.lasttag[deep] = lasttag;
                    item.carco.game.lasttagtext = lasttag;
                    item.carco.game.lastpressedup[deep] = false;
                }else{
                    item.carco.game.lastpressedup[deep] = buttonitem;
                };
            };

            if (carco.functions.game.searchActions(item, "processfunction")) {
                carco.functions.game.searchActions(item, "processfunction")(item);
            };

        };
    },
    scrollbox: function(item, type){
        if (item.carco.customparams.scrollbox){
            if (!item.carco.game.scrollBoxRun){
                item.carco.game.scrollBoxRun = function(inputitem) {
                    var allButton = item.carco.getChildren({equal:{customparams:{gametype:"button"}}});
                    item.carco.game.tempLastPressButton = item.carco.game.lastPressButton;
                    var lastPressButton = false;
                    item.carco.game.lastPressButton = lastPressButton;
                    var lastPressButtonNumber = -1;

                    for (var i = 0; i < allButton.length; i++) {
                        if (allButton[i] == inputitem) {
                            lastPressButton = allButton[i];
                            item.carco.game.lastPressButton = lastPressButton;
                            lastPressButtonNumber = i;
                        };
                    };
                    if (lastPressButtonNumber == 0&&lastPressButton.carco.button.pressed&&item.carco.game.tempLastPressButton==lastPressButton){
                        lastPressButtonNumber = -1
                    };
                    if (lastPressButton||inputitem == false){
                        for (var i = 0; i < allButton.length; i++) {
                            if (i < lastPressButtonNumber+1){
                                if (!allButton[i].carco.button.pressed){
                                    allButton[i].carco.game.ready = false;
                                    allButton[i].carco.button.down("scrollBox");
                                };
                            }else{
                                if (allButton[i].carco.button.pressed){
                                    allButton[i].carco.game.ready = false;
                                    allButton[i].carco.button.down("scrollBox");
                                };
                            };
                        };
                    };
                };
            };
        };
    },
    selectbox: function(item, type){
        var selectboxitems = item.carco.customparams.selectboxitems;
        var selectitems = [];
        if (!item.carco.game.selectitems&&selectboxitems&&selectboxitems !== ""){
            selectboxitems = selectboxitems.toString()
            selectboxitems = selectboxitems.replace(/\n/g, ",");
            selectboxitems = selectboxitems.replace(/,,/g, ",");
            selectboxitems = selectboxitems.replace(/,,/g, ",");
            selectboxitems = $.parseJSON(selectboxitems);
            if (selectboxitems&&typeof selectboxitems == "array"||selectboxitems&&typeof selectboxitems == "object"&&selectboxitems.length){
                for (var i = 0; i < selectboxitems.length; i++) {
                    var selectitem = false;
                    if (item.carco.root.carco.recursivechildren[selectboxitems[i]]) selectitem = item.carco.root.carco.recursivechildren[selectboxitems[i]];
                    if (item.carco.root.carco.recursivechildren["id"+selectboxitems[i]]) selectitem = item.carco.root.carco.recursivechildren["id"+selectboxitems[i]];
                    selectitems.push(selectitem);
                };
            };
        };
        if (item.carco.game.selectboxopen) var type = item.carco.game.selectboxopen;
        if (!type) var type = "open";
        if (type == "open") {
            type = "close";
        }else{
            type = "open";
        };
        item.carco.game.selectitems = selectitems;
        selectitems = item.carco.game.selectitems;
        if (selectitems&&selectitems[2]){
            selectitems[2].style.zIndex = "5000002";
            if (!selectitems[2].carco.game) selectitems[2].carco.game = {};
            if (!selectitems[2].carco.game.arrowopenselectbox){
                selectitems[2].carco.game.arrowopenselectbox = function() {
                    if (item.carco.game.showitems&&item.carco.game.showitems[0]&&item.carco.game.showitems[0].carco.game.ready){}else{
                        item.carco.game.selectbox(item);
                    };
                };
                carco.functions.listeners.add(selectitems[2], "mousedown", selectitems[2].carco.game.arrowopenselectbox);
            };
        };
        if (!item.carco.game.selectBoxRun){
            item.carco.game.selectBoxRun = function(type) {
                var allButton = item.carco.getChildren({equal:{customparams:{gametype:"button"}}});
                if (selectitems&&selectitems[0]&&selectitems[1]&&allButton&&allButton[0]){
                    var placeinners = [];
                    if (selectitems[0].carco.game&&selectitems[0].carco.game.inners) placeinners = selectitems[0].carco.game.inners;
                    if (type == "close"){
                        if (item.carco.game.selectboxcloselistener) carco.functions.listeners.remove(window, "mousedown", item.carco.game.selectboxcloselistener);
                        var hideitems = carco.functions.array.diff(allButton, placeinners);
                        if (hideitems.length == allButton.length) hideitems = carco.functions.array.diff(allButton, [selectitems[1]]);
                        var showitems = carco.functions.array.diff(allButton, hideitems);
                        item.carco.game.showitems = showitems;
                        for (var i = 0; i < showitems.length; i++) {
                            showitems[i].carco.setPosition({relative:{x:0, y:0}})
                            showitems[i].carco.resize();
                        };

                        item.carco.setSize({width:item.carco.size.width, height:selectitems[1].carco.size.height})
                        item.carco.resize();
                        if (selectitems[2]){
                            if (selectitems[2].carco.setStyle) selectitems[2].carco.setStyle({visibility:"hidden"});
                        };

                        for (var i = 0; i < hideitems.length; i++) {
                            if (hideitems[i].carco.setStyle) hideitems[i].carco.setStyle({visibility:"hidden"});
                        };
                        if (selectitems[3]){
                            if (selectitems[3].carco.setStyle) selectitems[3].carco.setStyle({visibility:"hidden"});
                        };
                        if (selectitems[2]){
                            setTimeout(function(){
                                if (selectitems[2].carco.setStyle) selectitems[2].carco.setStyle({visibility:"visible"});
                            },250)
                        };
                        item.carco.game.selectboxopen = "close";
                    };
                    if (type == "open"){
                        if (selectitems[2]){
                            if (selectitems[2].carco.setStyle) selectitems[2].carco.setStyle({visibility:"hidden"});
                        };
                        item.carco.setSize({width:item.carco.size.width, height:item.carco.originalsize.height});
                        item.carco.resize();
                        if (selectitems[3]){
                            if (selectitems[3].carco.setStyle) selectitems[3].carco.setStyle({visibility:"reset"});
                            selectitems[3].style.zIndex = "5000002";
                        };
                        for (var i = 0; i < allButton.length; i++) {
                            if (allButton[i].carco.setStyle) allButton[i].carco.setStyle({visibility:"reset"});
                            allButton[i].carco.game.setOriginal();
                            allButton[i].style.zIndex = "5000001";
                        };

                        item.carco.game.selectboxopen = "open";
                        if (!item.carco.game.selectboxcloselistener){
                            item.carco.game.selectboxcloselistener = function() {
                                setTimeout(function() {
                                    if (item.carco.game.selectboxopen == "open"){
                                        item.carco.game.selectbox(item);
                                    };
                                },200)
                            };
                        };
                        carco.functions.listeners.remove(window, "mousedown", item.carco.game.selectboxcloselistener);
                        setTimeout(function() {
                            carco.functions.listeners.add(window, "mousedown", item.carco.game.selectboxcloselistener);
                        },200)
                    };
                    item.carco.game.innersPosition();
                };
            };
        };
        item.carco.game.selectBoxRun(type)
    },
    mathgenerate: function(item) {
        if (!item.carco.customparams.mathgenerate) item.carco.customparams.mathgenerate = false;
        var mathgenerate = item.carco.customparams.mathgenerate;
        if (mathgenerate&&mathgenerate !== ""){
            mathgenerate = mathgenerate.toString()
            mathgenerate = mathgenerate.replace(/\n/g, " ");
            mathgenerate = mathgenerate.replace(/,,/g, ",");
            mathgenerate = mathgenerate.replace(/,,/g, ",");
            mathgenerate = eval('('+mathgenerate+')');
            item.carco.game.mathgenerate = carco.functions.Math.generateMoreNumbers(mathgenerate)
        };
    },
    random: function(item){
        var randomcontainers = [];
        var currentgame = item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame];
        var currenttrack = item.carco.paramsdata.system.currenttrack;
        if (currentgame.params.tracks[Number(item.carco.paramsdata.system.currenttrack)-1]){
            currenttrack = currentgame.params.tracks[Number(item.carco.paramsdata.system.currenttrack)-1];
        };
        var x = currenttrack;
        for (var r in item.carco.paramsdata.tracks[x].params){
            if (item.carco.paramsdata.tracks[x].params[r].customparams&&
                item.carco.paramsdata.tracks[x].params[r].customparams.gametype == "random_mix_sort_cont"&&
                item.carco.paramsdata.tracks[x].params[r].customparams.random&&
                item.carco.paramsdata.tracks[x].params[r].customparams.random !== false){
                randomcontainers.push(r);
            };
        };
        for (var i = 0; i < randomcontainers.length; i++) {
            var containerid = randomcontainers[i]
            if (item.carco.paramsdata.tracks[x].params[containerid]){
                var randomtype = item.carco.paramsdata.tracks[x].params[containerid].customparams.random;
                var fixids = item.carco.paramsdata.tracks[x].params[containerid].customparams.fixrandomids;

                if (fixids&&fixids !== "0"&&typeof fixids == "string") fixids = [fixids];
                if (!fixids||fixids == "0") fixids = [];
                var howmanyrandom = item.carco.paramsdata.tracks[x].params[containerid].customparams.howmanyrandom;
                var allcontainer = [];
                for (var c in item.carco.paramsdata.tracks[x].params){
                    if (item.carco.paramsdata.tracks[x].params[c].type == "container"&&
                        item.carco.paramsdata.tracks[x].params[c].parent == containerid) {
                        if (randomtype == "container"){
                            allcontainer.push(c);
                        }else{
                            if (item.carco.paramsdata.tracks[x].params[c].customparams&&
                                item.carco.paramsdata.tracks[x].params[c].customparams.gametype == randomtype){
                                allcontainer.push(c);
                            };
                        };
                    }
                };

                allcontainer = carco.functions.array.diff(allcontainer, ["id103"]);
                allcontainer = carco.functions.array.diff(allcontainer, fixids);
                allcontainer = carco.functions.array.shuffle(allcontainer);
                for (var r = 0; r < Number(howmanyrandom); r++) {
                    if (allcontainer[r]) fixids.push(allcontainer[r]);
                };

                if (item.carco.root.carco.paramsdata.system.usertype == "user"){
                    if (fixids[0] == "0"){
                        var savefix = fixids.slice(1);
                    }else{
                        var savefix = fixids.slice(0);
                    };
                    item.carco.paramsdata.tracks[x].params[containerid].customparams.savefixrandomids = savefix;
                    item.carco.paramsdata.tracks[x].params[containerid].customparams.savehowmanyrandom = 0;
                };

                var deleteids = carco.functions.array.diff(allcontainer, fixids);
                var alldeleteids = [];

                function recursiveParentDelete(id){
                    alldeleteids.push(id);
                    for (var c in item.carco.paramsdata.tracks[x].params){
                        if (item.carco.paramsdata.tracks[x].params[c].parent == id) {
                            recursiveParentDelete(c)
                        };
                    };
                };

                for (var r = 0; r < deleteids.length; r++) {
                    recursiveParentDelete(deleteids[r]);
                };

                for (var r = 0; r < alldeleteids.length; r++) {
                    delete item.carco.paramsdata.tracks[x].params[alldeleteids[r]];
                };
            };

        };
    },
    cloneParams: function(item, name){
        var clone = {}
        clone.customparams = carco.functions.object.clone(item.carco.customparams)
        clone.position = carco.functions.object.clone(item.carco.position)
        clone.originalposition = carco.functions.object.clone(item.carco.originalposition)
        clone.size = carco.functions.object.clone(item.carco.size)
        clone.originalsize = carco.functions.object.clone(item.carco.originalsize)
        clone.scale = carco.functions.object.clone(item.carco.scale)
        clone.originalscale = carco.functions.object.clone(item.carco.originalscale)
        clone.style = carco.functions.object.clone(item.carco.style)
        clone.originalstyle = carco.functions.object.clone(item.carco.originalstyle)
        clone.originalcustomcss = item.carco.originalcustomcss;
        if (!item.carco.customparams.objets) item.carco.customparams.objets = {};
        item.carco.customparams.objects[name] = clone;
    },
    searchActions: function(item, type) {
        if (item.carco.actions&&
            item.carco.actions[type]&&
            item.carco.actions[type]["function"]&&
            item.carco.customparams.actions&&
            item.carco.customparams.actions[type]&&
            item.carco.customparams.actions[type].functions&&
            item.carco.customparams.actions[type].functions["function"]&&
            item.carco.customparams.actions[type].functions["function"]!==""){
            return item.carco.actions[type]["function"]
        }
    },
    actions: function(item, params, type){
        if (!item.carco.customparams.actions) item.carco.customparams.actions = {};
        if (!item.carco.actions) item.carco.actions = {};

        if (params){
            for (var x in params){
                if (item.carco.actions[x]){
                    if (item.carco.actions[x].listeners){
                        for (var l = 0; l < item.carco.actions[x].listeners.length; l++) {
                            item.carco.off(item.carco.actions[x].listeners[l], item.carco.actions[x]["function"])
                            if (item.carco.type == "image"&&item.carco.svgdef){
                                carco.functions.listeners.remove(item.carco.svgdef, item.carco.actions[x].listeners[l], item.carco.actions[x]["function"]);
                            };
                        };
                    };
                };
                item.carco.customparams.actions[x] = carco.functions.object.clone(params[x]);
                item.carco.actions[x] = {};
                item.carco.actions[x].listeners = item.carco.customparams.actions[x].listeners
                item.carco.actions[x].x = x;
                item.carco.actions[x]["function"] = function(ev, z) {
                    var name = this.x;
                    if (!name) name = item.carco.actions[x].x
                    if (z) name = z;
                    for (var l in item.carco.customparams.actions[name].functions) {
                        if (item.carco[l]){
                            if (typeof item.carco[l] == "function"){
                                item.carco[l](item.carco.customparams.actions[name].functions[l])
                            }else{
                                return item.carco[l];
                            }
                        }else{
                            if (item.carco.customparams.actions[name].functions[l].replace){
                                item.carco.customparams.actions[name].functions[l] = item.carco.customparams.actions[name].functions[l].replace(/x==""/g, 'x===""')
                                item.carco.customparams.actions[name].functions[l] = item.carco.customparams.actions[name].functions[l].replace(/y==""/g, 'y===""')
                                item.carco.customparams.actions[name].functions[l] = item.carco.customparams.actions[name].functions[l].replace(/x == ""/g, 'x===""')
                                item.carco.customparams.actions[name].functions[l] = item.carco.customparams.actions[name].functions[l].replace(/y == ""/g, 'y===""')
                            };
                            return eval("(function() {" + item.carco.customparams.actions[name].functions[l] + "})();");
                        };
                    };
                }
                if (item.carco.actions[x]["function"].bind) item.carco.actions[x]["function"] = item.carco.actions[x]["function"].bind(item.carco.actions[x])
                if (typeof item.carco.actions[x].listeners == "string"){item.carco.actions[x].listeners = [item.carco.actions[x].listeners];}
                if (item.carco.actions[x].listeners){
                    for (var l = 0; l < item.carco.actions[x].listeners.length; l++) {
                        if (carco.functions.browser.IE() > 8&&item.carco.actions[x].listeners[l] == "change"){
                            $(item).focusout(item.carco.actions[x]["function"]);
                        }else{
                            item.carco.on(item.carco.actions[x].listeners[l], item.carco.actions[x]["function"])
                            if (item.carco.type == "image"&&item.carco.svgdef){
                                carco.functions.listeners.add(item.carco.svgdef, item.carco.actions[x].listeners[l], item.carco.actions[x]["function"]);
                            };
                        };
                    };
                };
            };
        };
        if (type == "save"){
            if (!item.carco.originalcustomparams) item.carco.originalcustomparams = {};
            item.carco.originalcustomparams.actions = carco.functions.object.clone(item.carco.customparams.actions);
        }
    },
    allChildrenImageColorise: function(item, params, trynumber) {
        var images = item.carco.getChildren({children:"recursivechildren", equal:{type:"image"}, type:"item"})
        for (var l = 0; l < images.length; l++) {
            if (!images[l].carco.customparams.checkitem){
                if (params == "reset") var params = images[l].carco.originalcustomparams.filters;
                if (!images[l].carco.colorise) {
                    //if (!trynumber) var trynumber = 0;
                    //var trynumber = trynumber + 1;
                    //if (trynumber < 5){
                    setTimeout(function() {item.carco.game.allChildrenImageColorise(params, trynumber)},200)
                    //};
                };
                if (images[l].carco.colorise) images[l].carco.colorise(params);
            }
        };
    },
    allActions: function(item) {
        var allactions = item.carco.getChildren({children:"recursivechildren", equal:{type:"container"}, nonequal:{customparams:{actions:undefined}}, type:"item"});
        for (var l = 0; l < allactions.length; l++) {
            allactions[l].carco.game.actions(allactions[l].carco.customparams.actions)
        };
    },
    allValueTrueOrFalse: function(item) {
        var items = item.carco.getChildren({children:"recursivechildren", equal:{type:"container", customparams:{values:{valueon:1}}}, type:"item"});
        for (var i = 0; i < items.length; i++) {
            if (items[i].carco.game.valueTrueOrFalse) items[i].carco.game.valueTrueOrFalse("start");
        };
    },
    values: function(item, params, save, type){
        if (!item.carco.customparams) item.carco.customparams = {};
        if (!item.carco.customparams.values) item.carco.customparams.values = {};
        if (!item.carco.originalcustomparams) item.carco.originalcustomparams = {};
        if (!item.carco.originalcustomparams.values) item.carco.originalcustomparams.values = {};

        if (params){
            for (var x in params){
                item.carco.customparams.values[x] = params[x];
            };
        };

        if (params&&params.valueids){
            var valueids = params.valueids.toString();
            valueids = valueids.replace(/\n/g, ",");
            valueids = valueids.replace(/ /gi, "")
            valueids = valueids.replace(/,,/g, ",");
            valueids = valueids.replace(/,,/g, ",");
            var arrays = valueids.split("$$")
            var ids = $.parseJSON(arrays[0]);
            if(arrays[1]) var clonesnumber = $.parseJSON(arrays[1]);
            if (typeof ids == 'number'||typeof ids == 'string') ids = [ids];
            item.carco.customparams.values.ids = ids;
            item.carco.customparams.values.clonesnumber = clonesnumber;
            function idstring(array){
                for (var i = 0; i < array.length; i++) {
                    if (typeof array[i] == 'array'||typeof array[i] == 'object'){
                        idstring(array[i])
                    }else{
                        if (typeof array[i] == 'string'&& array[i].slice(0,2) == "id"){}else{
                            if (typeof array[i] == 'string'||typeof array[i] == 'number'){
                                if (array[i]!=="") array[i] = "id" + array[i];
                                if (!item.carco.root.carco.recursivechildren[array[i]]){
                                    array[i] = "undefined";
                                };
                            };
                        };
                    };
                };
            };
            idstring(item.carco.customparams.values.ids);
        }

        if (params&&params.valueids == ""){item.carco.customparams.values.ids = [];}

        if (item.carco.customparams.values.ids){
            if (item.carco.customparams.values.ids[0] == ""&&item.carco.customparams.values.ids.length == 1) item.carco.customparams.values.ids = [];
            if (typeof item.carco.customparams.values.ids == 'string' || typeof item.carco.customparams.values.ids == 'number') {
                item.carco.customparams.values.ids = [item.carco.customparams.values.ids];
            };

            if (!item.carco.game) item.carco.game = {};
            if (!item.carco.game.values) item.carco.game.values = {};
            item.carco.game.values.items = [];
            item.carco.game.values.allitems = [];

            function stringToItems(array, to, toall){
                for (var i = 0; i < array.length; i++) {
                    if (typeof array[i] == 'array' || typeof array[i] == 'object'){
                        to[i] = [];
                        stringToItems(array[i], to[i], toall);
                    }else{
                        if (item.carco.root.carco.recursivechildren[array[i]]){
                            to[i] = item.carco.root.carco.recursivechildren[array[i]]
                            if (toall) toall.push(to[i]);
                        }else{
                            to[i] = "undefined";
                        }
                    };
                };
            };

            stringToItems(item.carco.customparams.values.ids, item.carco.game.values.items, item.carco.game.values.allitems)
            item.carco.game.values.allitemsplay = item.carco.game.values.allitems.slice(0);

        };

        if (params&&params.valuepoints){
            item.carco.customparams.values.valuepoints = {};
            var valuepoints = params.valuepoints.toString();
            valuepoints = valuepoints.replace(/\n/g, ",");
            valuepoints = valuepoints.replace(/ /gi, "")
            valuepoints = valuepoints.replace(/,,/g, ",");
            valuepoints = valuepoints.replace(/,,/g, ",");
            valuepoints = $.parseJSON(valuepoints);
            item.carco.customparams.values.valuepoints = valuepoints;
        };

        item.carco.game.valueTrueOrFalse(type);

        if (save == "save") var save = true;
        if (save == true){
            item.carco.originalcustomparams.values = carco.functions.object.clone(item.carco.customparams.values);
        }
    },
    lastcheck: function(item, citem){
        if (item) var allOnValues = item.carco.getChildren({children:"recursivechildren", equal:{type:"container", customparams:{values:{valueon:1}}}, type:"item"})
        if (citem) {
            var allOnValues = [citem];
            var allOnValues = citem.carco.root.carco.getChildren({children:"recursivechildren", equal:{type:"container", customparams:{values:{valueon:1}}}, type:"item"})
        };
        var lastCheck = [];
        for (var i = 0; i < allOnValues.length; i++){
            if (allOnValues[i].carco.customparams.values.truewhenitemsaretrue) lastCheck.push(allOnValues[i]);
            if (allOnValues[i].carco.customparams.values.truewhenchildrensaretrue) lastCheck.push(allOnValues[i]);
            if (allOnValues[i].carco.customparams.values.truewheninnersaretrue) lastCheck.push(allOnValues[i]);
            if (allOnValues[i].carco.customparams.innerssortingbychildrenplace) lastCheck.push(allOnValues[i]);
        };
        lastCheck = carco.functions.array.uniq(lastCheck);
        for (var i = 0; i < lastCheck.length; i++) {
            lastCheck[i].carco.game.valueTrueOrFalse("start");
        };
    },
    permutation: function(item, type){
        item.carco.root.carco.game.permutationready = false;
        var allcontainer = item.carco.root.carco.getChildren({equal:{type:"container", customparams:{gametype:"random_mix_sort_cont"}}, type:"item"})
        if (allcontainer.length == 0) item.carco.root.carco.game.permutationready = true;
        var waspermutation = false;
        for (var i = 0; i < allcontainer.length; i++) {
            if (allcontainer[i].carco.customparams.permutation){
                if (carco.functions.game.searchActions(allcontainer[i], "permutationpreaction")){
                    carco.functions.game.searchActions(allcontainer[i], "permutationpreaction")(allcontainer[i]);
                };
                waspermutation = true;
                var children = allcontainer[i].carco.customparams.permutation;
                if (children !== false){
                    if (children == "container"){
                        var params = {children:"children", equal:{type:"container"}, type:"item"}
                    }else{
                        var params = {children:"children", equal:{type:"container", customparams:{gametype:children}}, type:"item"}
                    };
                    var inners = allcontainer[i].carco.getChildren(params);
                    var deleteinners = [];
                    for (var a = 0; a < inners.length; a++) {
                        if (inners[a].carco.game&&inners[a].carco.game.ready) deleteinners.push(inners[a]);
                        for (var b in inners[a].carco.children) {
                            if (inners[a].carco.children[b].carco.game&&inners[a].carco.children[b].carco.game.ready) deleteinners.push(inners[a]);
                        };
                        if (inners[a].carco.game&&inners[a].carco.game.inners){
                            for (var b = 0; b <  inners[a].carco.game.inners.length; b++) {
                                if (inners[a].carco.game.inners[b].carco.game&&inners[a].carco.game.inners[b].carco.game.ready) deleteinners.push(inners[a]);
                            };
                        };
                    };

                    if (item.carco.root.carco.paramsdata.system.usertype == "user"&&item.carco.root.carco.paramsdata.user.feedbacktype == "test") allcontainer[i].carco.customparams.permutationclosedisable = true;
                    if (allcontainer[i].carco.customparams.permutationclosedisable) deleteinners = [];
                    var allobject = inners.slice(0);

                    inners = carco.functions.array.diff(inners, deleteinners);
                    allcontainer[i].carco.game.permutation = {};

                    var allplace = [];
                    var xyarray = [];
                    var innersplace = [];
                    var innersplaceinners = [];
                    var innersinners = [];
                    var innersplaceallinners = [];
                    var scrollLeft = carco.functions.position.scrollLeft();
                    var scrollTop = carco.functions.position.scrollTop();

                    if (inners&&inners.length>1) {
                        for (var a = 0; a < inners.length; a++) {
                            innersplace[a] = [];
                            innersplaceallinners[a] = [];
                            innersplaceinners[a] = [];
                            innersinners[a] = [];
                            var innersabounds = inners[a].getBoundingClientRect()
                            var newarray = [innersabounds.left+scrollLeft, innersabounds.top+scrollTop]
                            xyarray.push(newarray);

                            if (inners[a].carco.customparams.gametype == "place"&&inners[a].carco.customparams.values.valueon||
                                inners[a].carco.customparams.gametype == "placecontainer"&&inners[a].carco.customparams.values.valueon) {
                                var innersplaceitem = inners[a];
                                if (innersplaceitem.carco.game.inners&&innersplaceitem.carco.game.inners[0]) {
                                    for (var b = 0; b < innersplaceitem.carco.game.inners.length; b++) {
                                        innersinners[a].push(innersplaceitem.carco.game.inners[b]);
                                    };
                                };
                            };

                            if (inners[a].carco.customparams.gametype == "place"&&inners[a].carco.customparams.values.valueon) {
                                allplace.push(inners[a]);
                                allobject.push(inners[a]);
                                innersplace[a].push(inners[a]);
                                var innersplaceitem = inners[a];
                                if (innersplaceitem.carco.game.inners&&innersplaceitem.carco.game.inners[0]){
                                    for (var b = 0; b < innersplaceitem.carco.game.inners.length; b++) {
                                        if (innersplaceitem.carco.game.inners[b].carco.customparams.gametype == "drag"||innersplaceitem.carco.game.inners[b].carco.customparams.gametype == "inputtext") {
                                            innersplaceallinners[a].push(innersplaceitem.carco.game.inners[b]);
                                            allobject.push(innersplaceitem.carco.game.inners[b]);
                                        };
                                    };
                                };
                            };
                            var ipa = 0
                            for (var b in inners[a].carco.children) {
                                if (inners[a].carco.children[b].carco.customparams.gametype == "place"&&inners[a].carco.children[b].carco.customparams.values.valueon){
                                    innersplaceinners[a][ipa] = [];
                                    allplace.push(inners[a].carco.children[b]);
                                    allobject.push(inners[a].carco.children[b]);
                                    innersplace[a].push(inners[a].carco.children[b]);
                                    var innersplaceitem = inners[a].carco.children[b]
                                    if (innersplaceitem.carco.game.inners&&innersplaceitem.carco.game.inners[0]){
                                        for (var c = 0; c < innersplaceitem.carco.game.inners.length; c++) {
                                            if (innersplaceitem.carco.game.inners[c].carco.customparams.gametype == "drag"||innersplaceitem.carco.game.inners[c].carco.customparams.gametype == "inputtext") {
                                                innersplaceallinners[a].push(innersplaceitem.carco.game.inners[c]);
                                                innersplaceinners[a][ipa].push(innersplaceitem.carco.game.inners[c])
                                                allobject.push(innersplaceitem.carco.game.inners[c]);
                                            };
                                        };
                                    };
                                    ipa = ipa+1
                                };
                            };
                        };

                        var allinners = [];
                        for (var a = 0; a < allplace.length; a++) {
                            allinners[a] = [];
                            if (allplace[a].carco.game.inners&&allplace[a].carco.game.inners[0]){
                                for (var b = 0; b < allplace[a].carco.game.inners.length; b++) {
                                    allinners[a].push(allplace[a].carco.game.inners[b]);
                                    allobject.push(allplace[a].carco.game.inners[b]);
                                };
                            };
                        };

                        allobject = carco.functions.array.uniq(allobject);
                        var allreadyobject = [];

                        for (var a = 0; a < allobject.length; a++) {
                            if (allobject[a].carco.game.ready) {
                                allreadyobject.push(allobject[a]);
                                allobject[a].carco.game.prepermtempvalue = allobject[a].carco.game.value;
                            };
                        };

                        var allscores = [];
                        var allplacescores = [];
                        var allreadysscores = [];

                        for (var p = 0; p < inners.length; p++) {
                            for (var a = 0; a < allplace.length; a++) {
                                allplace[a].carco.game.inners = [];
                                allplace[a].carco.game.value = 0;
                                allplace[a].carco.game.trueorfalse = 0;
                                allplace[a].carco.game.ready = undefined;
                                if (allplace[a].carco.parent.carco.customparams.gametype == "placecontainer"){
                                    allplace[a].carco.parent.carco.game.inners = [];
                                    allplace[a].carco.parent.carco.game.value = 0;
                                    allplace[a].carco.parent.carco.game.trueorfalse = 0;
                                    allplace[a].carco.parent.carco.game.ready = undefined;
                                };
                            };
                            for (var a = 0; a < allinners.length; a++) {
                                if (allinners[a]&&allinners[a][0]){
                                    for (var b = 0; b < allinners[a].length; b++) {
                                        allinners[a][b].carco.game.inners = [];
                                        allinners[a][b].carco.game.value = 0;
                                        allinners[a][b].carco.game.trueorfalse = 0;
                                        allinners[a][b].carco.game.ready = undefined;
                                    };
                                };
                            };
                            var scores = [];
                            var placescores = [];
                            var readysscores = [];

                            for (var b = 0; b < xyarray.length; b++) {
                                var wasinnersplace = false
                                if (innersplaceallinners[b]&&innersplaceallinners[b][0]){
                                    for (var c = 0; c < innersplaceallinners[b].length; c++) {

                                        var diffarray = carco.functions.array.diff(innersinners[b], [innersplaceallinners[b][c]]);
                                        if (diffarray.length !== innersinners[b].length) {
                                            innersplaceallinners[b][c].carco.game.setInner(inners[p]);
                                            inners[p].carco.game.setInner(innersplaceallinners[b][c]);
                                        }else{
                                            innersplaceallinners[b][c].carco.game.valueTrueOrFalse("start");
                                            inners[p].carco.game.valueTrueOrFalse("start");
                                        };

                                        for (var d = 0; d < innersplaceinners[b].length; d++) {
                                            if (innersplaceinners[b][d]&&innersplaceinners[b][d][0]){
                                                var diffarray = carco.functions.array.diff(innersplaceinners[b][d], [innersplaceallinners[b][c]]);
                                                if (diffarray.length !== innersplaceinners[b][d].length){
                                                    innersplaceallinners[b][c].carco.game.setInner(innersplace[p][d]);
                                                    innersplace[p][d].carco.game.setInner(innersplaceallinners[b][c]);
                                                };
                                            };
                                        };

                                        if(inners[p].carco.customparams.gametype == "placecontainer"){
                                            inners[p].carco.game.valueTrueOrFalse("start")
                                        };

                                        wasinnersplace = true;
                                    };
                                };
                                if (!wasinnersplace){
                                    for (var c = 0; c < innersplace[p].length; c++) {
                                        if (innersplace[p][c].carco.game&&innersplace[p][c].carco.game.valueTrueOrFalse) {
                                            innersplace[p][c].carco.game.valueTrueOrFalse("start");
                                        };
                                    };
                                };

                                item.carco.root.carco.game.scores("getResult");
                                scores.push(item.carco.root.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].uservalue)
                                placescores.push(item.carco.root.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].placevalue)
                                var readyscore = 0;
                                for (var r = 0; r < allreadyobject.length; r++) {
                                    if (allreadyobject[r].carco.game.trueorfalse) readyscore = readyscore + 1;
                                };
                                readysscores.push(readyscore);

                                if (innersplace[p]&&innersplace[p][0]){
                                    for (var c = 0; c < innersplace[p].length; c++) {
                                        innersplace[p][c].carco.game.inners = [];
                                        innersplace[p][c].carco.game.value = 0;
                                        innersplace[p][c].carco.game.trueorfalse = 0;
                                        innersplace[p][c].carco.game.ready = undefined;
                                        if (innersplace[p][c].carco.parent.carco.customparams.gametype == "placecontainer"){
                                            innersplace[p][c].carco.parent.carco.game.inners = [];
                                            innersplace[p][c].carco.parent.carco.game.value = 0;
                                            innersplace[p][c].carco.parent.carco.game.trueorfalse = 0;
                                            innersplace[p][c].carco.parent.carco.game.ready = undefined;
                                        };
                                    };
                                };

                                if (innersplaceallinners[b]&&innersplaceallinners[b][0]){
                                    for (var c = 0; c < innersplaceallinners[b].length; c++) {
                                        innersplaceallinners[b][c].carco.game.inners = [];
                                        innersplaceallinners[b][c].carco.game.value = 0;
                                        innersplaceallinners[b][c].carco.game.trueorfalse = 0;
                                        innersplaceallinners[b][c].carco.game.ready = undefined;
                                    };
                                };
                            };
                            allscores.push(scores);
                            allplacescores.push(placescores);
                            allreadysscores.push(readysscores);
                        };

                        var onrowarray = [];
                        for (var a = 0; a < allscores.length; a++) {
                            for (var c = 0; c < allscores[a].length; c++) {
                                onrowarray.push([allscores[a][c], a, c])
                            };
                        };

                        var maxscores = [];

                        for (var b = 0; b < allscores.length; b++) {
                            var maxscore = -1
                            var maxplace = -1
                            var maxready = -1
                            var maxitem = [];
                            for (var a = 0; a < onrowarray.length; a++) {

                                if (onrowarray[a][0] == maxscore){
                                    if (allplacescores[onrowarray[a][1]][onrowarray[a][2]] > maxplace) {
                                        maxscore = onrowarray[a][0];
                                        maxplace = allplacescores[onrowarray[a][1]][onrowarray[a][2]];
                                        maxitem = onrowarray[a];
                                    }else{
                                        if (allreadysscores[onrowarray[a][1]][onrowarray[a][2]] > maxready) {
                                            maxscore = onrowarray[a][0];
                                            maxready = allreadysscores[onrowarray[a][1]][onrowarray[a][2]];
                                            maxitem = onrowarray[a];
                                        };
                                    };
                                }else {
                                    if (onrowarray[a][0] > maxscore) {
                                        maxscore = onrowarray[a][0];
                                        maxplace = allplacescores[onrowarray[a][1]][onrowarray[a][2]];
                                        maxready = allreadysscores[onrowarray[a][1]][onrowarray[a][2]];
                                        maxitem = onrowarray[a];
                                    };
                                };

                            };
                            maxscores[maxitem[1]] = maxitem[2];
                            for (var a = 0; a < onrowarray.length; a++) {
                                if (onrowarray[a][2] == maxitem[2]){
                                    onrowarray[a][0] = -1
                                };
                                if (onrowarray[a][1] == maxitem[1]){
                                    onrowarray[a][0] = -1
                                };
                            };
                        };

                        for (var a = 0; a < allplace.length; a++) {
                            allplace[a].carco.game.inners = [];
                            allplace[a].carco.game.value = 0;
                            allplace[a].carco.game.trueorfalse = 0;
                            allplace[a].carco.game.ready = undefined;
                            if (allplace[a].carco.parent.carco.customparams.gametype == "placecontainer"){
                                allplace[a].carco.parent.carco.game.inners = [];
                                allplace[a].carco.parent.carco.game.value = 0;
                                allplace[a].carco.parent.carco.game.trueorfalse = 0;
                                allplace[a].carco.parent.carco.game.ready = undefined;
                            };
                        };
                        for (var a = 0; a < allinners.length; a++) {
                            if (allinners[a]&&allinners[a][0]){
                                for (var b = 0; b < allinners[a].length; b++) {
                                    allinners[a][b].carco.game.inners = [];
                                    allinners[a][b].carco.game.value = 0;
                                    allinners[a][b].carco.game.trueorfalse = 0;
                                    allinners[a][b].carco.game.ready = undefined;
                                };
                            };
                        };

                        for (var a = 0; a < maxscores.length; a++) {
                            if (!inners[a].carco.game.setPosition){
                                carco.functions.game.setPosition(inners[a], false, {x:xyarray[maxscores[a]][0], y:xyarray[maxscores[a]][1]});
                            }else{
                                inners[a].carco.game.setPosition(false, {x:xyarray[maxscores[a]][0], y:xyarray[maxscores[a]][1]});
                            };
                        };

                        allcontainer[i].carco.game.permutation = {};
                        allcontainer[i].carco.game.permutation.allinners = allinners;
                        allcontainer[i].carco.game.permutation.inners = inners;
                        allcontainer[i].carco.game.permutation.innersplaceallinners = innersplaceallinners;
                        allcontainer[i].carco.game.permutation.innersplace = innersplace;
                        allcontainer[i].carco.game.permutation.innersinners = innersinners;
                        allcontainer[i].carco.game.permutation.allplace = allplace;
                        allcontainer[i].carco.game.permutation.process = true;
                        allcontainer[i].carco.game.permutation.maxscores = maxscores;
                        allcontainer[i].carco.game.permutation.allobject = allobject;
                        allcontainer[i].carco.game.permutation.allreadyobject = allreadyobject;
                        allcontainer[i].carco.game.permutation.innersplaceinners = innersplaceinners;
                        allcontainer[i].carco.game.permutation.xyarray = xyarray;
                        if (!carco.drag.currentdrag) carco.drag.currentdrag = {};
                        carco.drag.currentdrag.item = false;
                    };
                };
            };
        };

        for (var i = 0; i < allcontainer.length; i++) {
            if (allcontainer[i].carco.customparams.permutation){
                if (allcontainer[i].carco.game.permutation&&allcontainer[i].carco.game.permutation.process&&
                    allcontainer[i].carco.game.permutation.inners&&allcontainer[i].carco.game.permutation.inners.length>1){
                    var allinners = allcontainer[i].carco.game.permutation.allinners;
                    var inners = allcontainer[i].carco.game.permutation.inners;
                    var innersinners = allcontainer[i].carco.game.permutation.innersinners;
                    var innersplaceinners = allcontainer[i].carco.game.permutation.innersplaceinners;
                    var innersplaceallinners = allcontainer[i].carco.game.permutation.innersplaceallinners;
                    var innersplace = allcontainer[i].carco.game.permutation.innersplace;
                    var allplace = allcontainer[i].carco.game.permutation.allplace;
                    var allobject = allcontainer[i].carco.game.permutation.allobject;
                    var allreadyobject = allcontainer[i].carco.game.permutation.allreadyobject;
                    var maxscores = allcontainer[i].carco.game.permutation.maxscores;
                    var permutationcontainer = allcontainer[i];

                    for (var b = 0; b < allinners.length; b++) {
                        if (allinners[b]&&allinners[b][0]){
                            for (var c = 0; c < allinners[b].length; c++) {
                                if (allinners[b][c].carco.customparams.gametype == "drag") {
                                    allinners[b][c].carco.drag.up(false, allinners[b][c], true);
                                };
                            };
                        };
                    };

                    for (var p = 0; p < inners.length; p++) {
                        var b = maxscores[p];
                        for (var c = 0; c < innersplaceallinners[b].length; c++) {
                            if (innersplaceallinners[b][c].carco.customparams.gametype == "inputtext") {

                                var diffarray = carco.functions.array.diff(innersinners[b], [innersplaceallinners[b][c]]);
                                if (diffarray.length !== innersinners[b].length) {
                                    innersplaceallinners[b][c].carco.game.setInner(inners[p]);
                                    inners[p].carco.game.setInner(innersplaceallinners[b][c]);
                                }else{
                                    innersplaceallinners[b][c].carco.game.valueTrueOrFalse("start");
                                    inners[p].carco.game.valueTrueOrFalse("start");
                                };

                                for (var d = 0; d < innersplaceinners[b].length; d++) {
                                    if (innersplaceinners[b][d]&&innersplaceinners[b][d][0]){
                                        var diffarray = carco.functions.array.diff(innersplaceinners[b][d], [innersplaceallinners[b][c]]);
                                        if (diffarray.length !== innersplaceinners[b][d].length){
                                            innersplaceallinners[b][c].carco.game.setInner(innersplace[p][d]);
                                            innersplace[p][d].carco.game.setInner(innersplaceallinners[b][c]);
                                        };
                                    };
                                };

                            };
                        };
                    };

                    if (!carco.drag.currentdrag) carco.drag.currentdrag = {};
                    carco.drag.currentdrag.item = false;

                    for (var a = 0; a < allobject.length; a++) {
                        if (allobject[a].carco.game&&allobject[a].carco.game.valueTrueOrFalse&&
                            allobject[a].carco.customparams.gametype !== "drag") {
                            allobject[a].carco.game.valueTrueOrFalse("start");
                        };
                    };

                    allcontainer[i].carco.game.permutation.process = false;

                    if (allcontainer[i].carco.customparams.permutationclosedisable){
                        for (var a = 0; a < allreadyobject.length; a++) {
                            if (allreadyobject[a].carco.game.trueorfalse) {
                                allreadyobject[a].carco.game.value = allreadyobject[a].carco.game.prepermtempvalue;
                                allreadyobject[a].carco.game.ready = true;
                            }else{
                                allreadyobject[a].carco.game.ready = false;
                                carco.functions.listeners.addAllListeners(allreadyobject[a]);
                            };
                        };
                        item.carco.root.carco.game.scores("getResult");
                    };

                    if (type !== "getResult") {
                        if (carco.functions.game.searchActions(allcontainer[i], "permutationendaction")) {
                            carco.functions.game.searchActions(allcontainer[i], "permutationendaction")(allcontainer[i]);
                        };
                    };

                };
            };
        };

        if (!item.carco.root.carco.intervals) item.carco.root.carco.intervals = {};
        if (item.carco.root.carco.intervals.feedbackwait8) clearInterval(item.carco.root.carco.intervals.feedbackwait8);

        item.carco.root.carco.game.scores("getResult");
        item.carco.root.carco.game.permutationready = true;

        if (type == "getResult") {
            for (var i = 0; i < allcontainer.length; i++) {
                if (allcontainer[i].carco.customparams.permutation){
                    if (allcontainer[i].carco.game.permutation&&
                        allcontainer[i].carco.game.permutation.inners&&allcontainer[i].carco.game.permutation.inners.length>1){
                        var allinners = allcontainer[i].carco.game.permutation.allinners;
                        var inners = allcontainer[i].carco.game.permutation.inners;
                        var innersinners = allcontainer[i].carco.game.permutation.innersinners;
                        var innersplaceinners = allcontainer[i].carco.game.permutation.innersplaceinners;
                        var innersplaceallinners = allcontainer[i].carco.game.permutation.innersplaceallinners;
                        var innersplace = allcontainer[i].carco.game.permutation.innersplace;
                        var allplace = allcontainer[i].carco.game.permutation.allplace;
                        var allobject = allcontainer[i].carco.game.permutation.allobject;
                        var allreadyobject = allcontainer[i].carco.game.permutation.allreadyobject;
                        var xyarray = allcontainer[i].carco.game.permutation.xyarray;
                        var permutationcontainer = allcontainer[i];

                        if (allplace){
                            for (var a = 0; a < allplace.length; a++) {
                                allplace[a].carco.game.inners = [];
                                allplace[a].carco.game.value = 0;
                                allplace[a].carco.game.trueorfalse = 0;
                                allplace[a].carco.game.ready = undefined;
                                if (allplace[a].carco.parent.carco.customparams.gametype == "placecontainer"){
                                    allplace[a].carco.parent.carco.game.inners = [];
                                    allplace[a].carco.parent.carco.game.value = 0;
                                    allplace[a].carco.parent.carco.game.trueorfalse = 0;
                                    allplace[a].carco.parent.carco.game.ready = undefined;
                                };
                            };
                            for (var a = 0; a < allinners.length; a++) {
                                if (allinners[a]&&allinners[a][0]){
                                    for (var b = 0; b < allinners[a].length; b++) {
                                        allinners[a][b].carco.game.inners = [];
                                        allinners[a][b].carco.game.value = 0;
                                        allinners[a][b].carco.game.trueorfalse = 0;
                                        allinners[a][b].carco.game.ready = undefined;
                                    };
                                };
                            };

                            for (var p = 0; p < inners.length; p++) {
                                carco.functions.game.setPosition(inners[p], false, {x: xyarray[p][0], y: xyarray[p][1]});
                            };

                            for (var b = 0; b < allinners.length; b++) {
                                if (allinners[b]&&allinners[b][0]){
                                    for (var c = 0; c < allinners[b].length; c++) {
                                        if (allinners[b][c].carco.customparams.gametype == "drag") {
                                            allinners[b][c].carco.drag.up(false, allinners[b][c], true);
                                        };
                                    };
                                };
                            };


                            for (var p = 0; p < inners.length; p++) {
                                var b = p;
                                for (var c = 0; c < innersplaceallinners[b].length; c++) {
                                    if (innersplaceallinners[b][c].carco.customparams.gametype == "inputtext") {

                                        var diffarray = carco.functions.array.diff(innersinners[b], [innersplaceallinners[b][c]]);
                                        if (diffarray.length !== innersinners[b].length) {
                                            innersplaceallinners[b][c].carco.game.setInner(inners[p]);
                                            inners[p].carco.game.setInner(innersplaceallinners[b][c]);
                                        }else{
                                            innersplaceallinners[b][c].carco.game.valueTrueOrFalse("start");
                                            inners[p].carco.game.valueTrueOrFalse("start");
                                        };

                                        for (var d = 0; d < innersplaceinners[b].length; d++) {
                                            if (innersplaceinners[b][d]&&innersplaceinners[b][d][0]){
                                                var diffarray = carco.functions.array.diff(innersplaceinners[b][d], [innersplaceallinners[b][c]]);
                                                if (diffarray.length !== innersplaceinners[b][d].length){
                                                    innersplaceallinners[b][c].carco.game.setInner(innersplace[p][d]);
                                                    innersplace[p][d].carco.game.setInner(innersplaceallinners[b][c]);
                                                };
                                            };
                                        };

                                    };
                                };
                            };

                            for (var a = 0; a < allobject.length; a++) {
                                if (allobject[a].carco.game&&allobject[a].carco.game.valueTrueOrFalse&&
                                    allobject[a].carco.customparams.gametype !== "drag") {
                                    allobject[a].carco.game.valueTrueOrFalse("start");
                                };
                            };

                            if (allcontainer[i].carco.customparams.permutationclosedisable){
                                for (var a = 0; a < allreadyobject.length; a++) {
                                    if (allreadyobject[a].carco.game.trueorfalse) {
                                        allreadyobject[a].carco.game.value = allreadyobject[a].carco.game.prepermtempvalue;
                                        allreadyobject[a].carco.game.ready = true;
                                    }else{
                                        allreadyobject[a].carco.game.ready = false;
                                        carco.functions.listeners.addAllListeners(allreadyobject[a]);
                                    };
                                };
                            };

                            if (carco.functions.game.searchActions(allcontainer[i], "permutationendaction")) {
                                carco.functions.game.searchActions(allcontainer[i], "permutationendaction")(allcontainer[i]);
                            };

                            if (!carco.drag.currentdrag) carco.drag.currentdrag = {};
                            carco.drag.currentdrag.item = false;
                        };
                    };
                };
            };
        };

        if (!carco.drag.currentdrag) carco.drag.currentdrag = {};
        if (carco.drag.currentdrag.tempitem) {
            carco.drag.currentdrag.tempitem = false;
        };
        if (!waspermutation) item.carco.root.carco.game.permutationready = true;
    },
    inputtextPermutationEnd: function(item, inputinners) {
        var po = item.carco.game.permutation;
        var texts = inputinners;
        var innersplace = po.innersplace;
        var n = 0;

        for (var b = 0; b < texts.length; b++) {
            for (var c = 0; c < innersplace.length; c++) {
                if (texts[b].carco.game.inners&&texts[b].carco.game.inners[0]&&innersplace[c]&&innersplace[c][0]) {
                    var diffarray = carco.functions.array.diff(innersplace[c], texts[b].carco.game.inners);
                    if (diffarray.length !== innersplace[c].length) {
                        n = c;
                    };
                };
            };
        };

        var nop = po.innersplace[n];
        for (var b = 0; b < texts.length; b++) {
            var pid = [nop[b].carco.id];
            texts[b].carco.customparams.placeids = pid;
        };
    },
    valueTrueOrFalse: function(item, type, input, permutation) {
        if (item.carco.customparams.values&&item.carco.customparams.values.valueon){

            item.carco.game.valueready = false;
            if (!item.carco.game.inners) item.carco.game.inners = [];
            if (!item.carco.customparams.values.maxon) item.carco.customparams.values.maxon = false;
            if (!item.carco.originalcustomparams.values.maxon) item.carco.originalcustomparams.values.maxon = item.carco.customparams.values.maxon;
            if (!item.carco.customparams.values.valuemaxinner) item.carco.customparams.values.valuemaxinner = 0;
            if (!item.carco.originalcustomparams.values.valuemaxinner) item.carco.originalcustomparams.values.valuemaxinner = item.carco.customparams.values.valuemaxinner;
            if (!item.carco.customparams.values.valuemininner) item.carco.customparams.values.valuemininner = 0;
            if (!item.carco.originalcustomparams.values.valuemininner) item.carco.originalcustomparams.values.valuemininner = item.carco.customparams.values.valuemininner;
            var inners = item.carco.game.inners;
            if (typeof inners == "string") inners = [inners];
            if (!item.carco.customparams.values.ids) item.carco.game.values({valueids:item.carco.originalcustomparams.values.valueids}, false, type)
            if (item.carco.customparams.gametype == "coordinate"){
                if (!item.carco.customparams.values.valuepoints&&item.carco.customparams.values.valuepoints !== 0) {
                    item.carco.game.values({valuepoints:item.carco.originalcustomparams.valuepoints}, false, type)
                };
            };
            var valueids = item.carco.customparams.values.ids;
            var clonesnumber = item.carco.customparams.values.clonesnumber;
            var max = item.carco.customparams.values.valuemaxinner;
            var min = item.carco.customparams.values.valuemininner;
            var maxon = item.carco.customparams.values.maxon;
            var valueitems = [];
            if (item.carco.game&&item.carco.game.values) valueitems = item.carco.game.values.items;
            var value = {uniqitems: false, clones:false, moreclone:false, fixorder:false, otheritem:false, max:false, min:false};
            var timeout = 200;
            var permutation = true;
            if (permutation) timeout = 0

            //uniq and clones
            if (item.carco.customparams.innerssortingbychildrenplace){

                var places = item.carco.getChildren({equal:{customparams:{gametype:"place"}}, type:"item"});
                if (item.carco.customparams.innerssortingbychildrenplace == "position") {
                    var xyarray = [];
                    var newplaces = [];
                    for (var i = 0; i < places.length; i++) {
                        var itembounds = carco.functions.position.getBoundingClientRect(places[i]);
                        var newarray = [itembounds.left, itembounds.top, places[i]];
                        xyarray.push(newarray);
                    };
                    xyarray.sort(function sortFunction(a, b) {
                        if (a[0] === b[0]) {
                            return 0;
                        }else{
                            return (a[0] > b[0]) ? 1 : -1;
                        };
                    });
                    xyarray.sort(function sortFunction(a, b) {
                        if (a[1] === b[1]) {
                            return 0;
                        }else{
                            return (a[1] > b[1]) ? 1 : -1;
                        };
                    });

                    for (var y = 0; y < xyarray.length; y++) {
                        newplaces.push(xyarray[y][2]);
                    };
                    places = newplaces
                };
                var allplaceinners = [];
                for (var i = 0; i < places.length; i++) {
                    if (places[i].carco.game&&places[i].carco.game.inners) {
                        for (var a = 0; a < places[i].carco.game.inners.length; a++) {
                            allplaceinners.push(places[i].carco.game.inners[a])
                        };
                    };
                };

                var sortedinners = [];
                for (var i = 0; i < allplaceinners.length; i++) {
                    for (var a = 0; a < inners.length; a++) {
                        if (allplaceinners[i] == inners[a]) sortedinners.push(inners[a]);
                    };
                };
                var inners = sortedinners;
                value.inners = inners;
            };

            var valueids1 = [];
            var valueitems1 = [];

            function recursivedelete(array, newarray){
                if (!array) array = [];
                for (var i = 0; i < array.length; i++) {
                    if (typeof array == 'array') {
                        newarray[i] = [];
                        recursivedelete(array[i], newarray[i])
                    }else{
                        if (array[i]&&array[i] !== 'undefined'){
                            newarray.push(array[i])
                        };
                    };
                };
            };

            recursivedelete(valueids, valueids1);
            valueids = valueids1;
            recursivedelete(valueitems, valueitems1);
            valueitems = valueitems1;

            var uniqitems = [];
            var clonearrays = [];
            for (var i = 0; i < valueids.length; i++) {
                if (typeof valueids[i] == 'string') uniqitems.push(valueitems[i]);
                if (typeof valueids[i] == 'array'||typeof valueids[i] == 'object') clonearrays.push(valueitems[i]);
            };

            if (!clonesnumber) var clonesnumber = [];
            var clonesnumberarray = [];
            for (var i = 0; i < clonearrays.length; i++) {
                if (clonesnumber[i]&&!isNaN(Number(clonesnumber[i]))||clonesnumber[i] == 0){
                    clonesnumberarray.push(Number(clonesnumber[i]));
                }else{
                    clonesnumberarray.push(1);
                };
            };
            var uniqin = carco.functions.array.diff(uniqitems, inners);
            if (uniqin.length == 0) value.uniqitems = true;
            if (uniqitems.length == 0) value.uniqitems = true;

            var uniqsolution = uniqin;

            if (clonearrays.length>0) {value.clones = false;};
            var clonetrue = [];
            var moreclonetrue = [];
            var clonesolution = [];
            var clonesexcluded = [];
            var dropclone = [];
            var allfalseclones = [];

            item.carco.game.valueclones = clonearrays;
            item.carco.game.valueclonenumber = clonesnumberarray;

            for (var i = 0; i < clonearrays.length; i++) {
                var uniqin = carco.functions.array.diff(clonearrays[i], inners);
                if (uniqin.length+clonesnumberarray[i] == clonearrays[i].length) clonetrue.push(true);

                if (uniqin.length < clonearrays[i].length-clonesnumberarray[i]&&item.carco.customparams.values.moreclone == true) {
                    clonetrue.push(true); value.moreclone = true;
                };

                if (uniqin.length < clonearrays[i].length-clonesnumberarray[i]) {
                    var innersclone = carco.functions.array.diff(clonearrays[i], uniqin)
                    var result = []
                    for (var c = 0; c < inners.length; c++) {
                        for (var ic = 0; ic < innersclone.length; ic++) {
                            if (innersclone[ic] == inners[c]) result.push(innersclone[ic]);
                        };
                    };
                    var dropclone = result.slice(clonesnumberarray[i]);
                    var dropclone_true = result.slice(0, clonesnumberarray[i]);

                    for (var dc = 0; dc < dropclone.length; dc++) {
                        dropclone[dc].carco.game.valueTrueOrFalse(type, false);
                    };
                    for (var dc = 0; dc < dropclone_true.length; dc++) {
                        dropclone_true[dc].carco.game.valueTrueOrFalse(type);
                    };

                };

                if (uniqin.length > clonearrays[i].length-clonesnumberarray[i]){
                    clonesolution.push([uniqin.length-(clonearrays[i].length-clonesnumberarray[i]), uniqin]);
                    allfalseclones.push(clonearrays[i]);
                }else{
                    clonesolution.push([0, false]);
                };
                if (clonesnumberarray[i] == 0){
                    for (var c = 0; c < clonearrays[i].length; c++) {
                        clonesexcluded.push(clonearrays[i][c]);
                    };
                };
            };

            if (clonetrue.length == clonearrays.length&&clonearrays.length>0) value.clones = true;

            var allfalsecloneitems = [];
            var allfalsecloneitemsclonenumber = [];
            for (var i = 0; i < allfalseclones.length; i++) {
                for (var p = 0; p < allfalseclones[i].length; p++) {
                    allfalsecloneitems.push(allfalseclones[i][p]);
                };
                for (var p = 0; p < clonesnumberarray[i]; p++) {
                    if (allfalseclones[i][p]) allfalsecloneitemsclonenumber.push(allfalseclones[i][p]);
                };
            };

            //order

            var orders = [];
            var ordersolution = [];
            var ordersolution1 = [];
            var clonenumber = 0;
            for (var i = 0; i < valueids.length; i++) {
                if (typeof valueids[i] == "string"){
                    ordersolution.push(valueitems[i])
                    ordersolution1.push(valueitems[i])
                    var innersnumber = 0
                    for (var n = 0; n < clonenumber; n++) {
                        innersnumber = innersnumber + (clonesnumberarray[n]-1);
                    };
                    if (valueitems[i] == inners[i+innersnumber]){
                        orders[i] = true;
                    }else{
                        orders[i] = false;
                    };
                }else{
                    var minus = [];
                    for (var n = 0; n < clonesnumberarray[clonenumber]; n++) {
                        ordersolution.push(valueitems[i][n]);
                    };
                    ordersolution1.push("array")
                    for (var n = 0; n < clonesnumberarray[clonenumber]; n++) {
                        if (inners[i+n]){
                            minus.push(inners[i+n])
                        }else{
                            orders[i] = "array";
                            break;
                        }
                    };
                    if (orders[i] !== false){
                        var uniqin = carco.functions.array.diff(valueitems[i], minus)
                        if (uniqin.length+clonesnumberarray[clonenumber] == valueitems[i].length) {
                            orders[i] = true;
                        }else{
                            if (uniqin.length+clonesnumberarray[clonenumber] > valueitems[i].length){
                                orders[i] = "array";
                            }else{
                                orders[i] = false;
                            }
                        };
                    };
                    clonenumber = clonenumber + 1;
                };
            };

            var solution = [];
            value.fixorder = true;
            clonenumber = 0;
            for (var i = 0; i < orders.length; i++) {
                if (orders[i] == false) {
                    solution.push(ordersolution1[i])
                    value.fixorder = false;
                };
                if (orders[i] == "array") {
                    for (var n = 0; n < clonesolution[clonenumber][0]; n++) {
                        if (clonesolution[clonenumber][1][n]){
                            solution.push(clonesolution[clonenumber][1][n])
                        }else{
                            solution.push(clonesolution[clonenumber][1][0])
                        };
                        value.fixorder = false;
                    };
                    clonenumber = clonenumber + 1;
                };
            };

            if (item.carco.customparams.values.fixedorder == true) {
                value.fixorder = false;
                var newinners = inners.slice(0,inners.length+1)
                var allfixorder = carco.functions.array.combinations(valueitems)
                for (var i = 0; i < allfixorder.length; i++) {
                    var resultorder = true
                    for (var a = 0; a < allfixorder[i].length; ++a) {
                        if (allfixorder[i][a] !== inners[a]) resultorder = false;
                    };
                    if (resultorder == true) value.fixorder = true;
                };
            };

            solution = carco.functions.array.diff(solution, inners);

            //otheritems

            var newuniq = uniqitems;
            for (var i = 0; i < clonearrays.length; i++) {
                newuniq = newuniq.concat(clonearrays[i]);
            };

            for (var i = 0; i < clonearrays.length; i++) {
                newuniq = newuniq.concat(clonearrays[i]);
            };

            newuniq = carco.functions.array.uniq(newuniq);
            var otheritem = carco.functions.array.diff(inners, newuniq);
            if (otheritem.length > 0) value.otheritem = true;

            //actions
            var inputtextsolution = [];
            var action_false_allitemsallclones = [];
            var returnaction = [];
            var returntext = false;

            if (item.carco.actions&&
                item.carco.actions.value&&
                item.carco.actions.value["function"]&&
                item.carco.customparams.actions&&
                item.carco.customparams.actions.value&&
                item.carco.customparams.actions.value.functions&&
                item.carco.customparams.actions.value.functions["function"]&&
                item.carco.customparams.actions.value.functions["function"]!==""){
                value.action = item.carco.actions.value["function"](value, "value");
                if (typeof value.action == 'object'&&value.action[1]||typeof value.action == 'array'&&value.action[1]){
                    returnaction = value.action[1];
                    value.action = value.action[0];
                };

                if (typeof returnaction == 'array'||typeof returnaction == 'object'){
                    var newreturnaction = [];
                    for (var i = 0; i < returnaction.length; i++) {
                        if (item.carco.root.carco.recursivechildren[returnaction[i]]) {
                            newreturnaction.push(item.carco.root.carco.recursivechildren[returnaction[i]]);
                        }else{
                            if (typeof returnaction[i] == "array"||typeof returnaction[i] == 'object'){
                                if (item.carco.root.carco.recursivechildren[returnaction[i][0]]) {
                                    newreturnaction.push(item.carco.root.carco.recursivechildren[returnaction[i][0]]);
                                    if (item.carco.root.carco.recursivechildren[returnaction[i][0]]&&item.carco.root.carco.recursivechildren[returnaction[i][0]].carco.game) {
                                        if (!isNaN(Number(returnaction[i][1]))&&returnaction[i][1]!==false&&returnaction[i][1].toString) {
                                            returnaction[i][1] = returnaction[i][1].toString();
                                            returnaction[i][1] = returnaction[i][1].replace(".", ",");
                                        };
                                        item.carco.root.carco.recursivechildren[returnaction[i][0]].carco.game.replacesolinputtext = returnaction[i][1];
                                    };
                                };
                            };
                        };
                    };
                    returnaction = newreturnaction;
                }else{
                    if (item.carco.root.carco.recursivechildren[returnaction]) {
                        returnaction = [item.carco.root.carco.recursivechildren[returnaction]];
                    }else{
                        returnaction = [];
                    };
                };

                if (!item.carco.game.values.allitems) item.carco.game.values.allitems = [];
                if (value.action == false&&item.carco.game.values.allitems[0]){
                    inputtextsolution = [item.carco.game.values.allitems[0]]
                    action_false_allitemsallclones = item.carco.game.values.allitems
                }
            }else{
                value.action = true;
            };

            //min or max

            var allvalueitems = item.carco.root.carco.getChildren({children:"recursivechildren", equal:{type:"container"}, type:"item"});
            var whovalues = [];
            for (var i = 0; i < allvalueitems.length; i++) {
                var who = true;
                if (allvalueitems[i].carco.game&&allvalueitems[i].carco.game.values&&allvalueitems[i].carco.game.values.allitems){
                    var uniqin = carco.functions.array.diff(allvalueitems[i].carco.game.values.allitems, [item])
                    if (allvalueitems[i].carco.game.values.allitems.length == uniqin.length) who = false;
                }else{
                    who = false;
                }
                if (who == true) whovalues.push(allvalueitems[i]);
            };

            for (var i = 0; i < allvalueitems.length; i++) {
                var who = true;
                if (allvalueitems[i].carco.customparams.placeids){
                    if (typeof allvalueitems[i].carco.customparams.placeids == "string") allvalueitems[i].carco.customparams.placeids = [allvalueitems[i].carco.customparams.placeids];
                    var uniqin = carco.functions.array.diff(allvalueitems[i].carco.customparams.placeids, [item.carco.id]);
                    if (allvalueitems[i].carco.customparams.placeids.length == uniqin.length) who = false;
                }else{
                    who = false;
                };
                if (who == true) whovalues.push(allvalueitems[i]);
            };

            var minsolution = [];
            var minsolution_missing = [];
            var maxsolution = [];

            whovalues = carco.functions.array.diff(whovalues, clonesexcluded)
            var whovalues_uniq = carco.functions.array.uniq(whovalues)
            var whovalues_without_inners = carco.functions.array.diff(whovalues_uniq, inners)
            var minuslength = whovalues_without_inners.length-(whovalues_uniq.length)
            var minmissing = min+minuslength
            if (isNaN(minmissing)) minmissing = 0;
            if (minmissing<0) minmissing = 0

            for (var i = 0; i < min; i++) {
                if(whovalues[i]) minsolution.push(whovalues[i])
            };

            for (var i = 0; i < minmissing; i++) {
                if(whovalues_without_inners[i]) minsolution_missing.push(whovalues_without_inners[i])
            };

            for (var i = 0; i < max; i++) {
                if(whovalues[i]) maxsolution.push(whovalues[i]);
            };

            if (!isNaN(Number(min))&&inners.length>=min) {value.min = true;}
            if (!isNaN(Number(max))&&inners.length<=max) {value.max = true;}

            value.points = true;
            var solutionpoints = [];
            if (item.carco.customparams.gametype == "coordinate"){
                var valuepoints = item.carco.customparams.values.valuepoints;
                var coordinates = item.carco.game.coordinates;
                if (coordinates&&valuepoints){
                    for (var i = 0; i < valuepoints.length; i++) {
                        if (!coordinates[i]){
                            value.points = false;
                        }else{
                            if (Number(valuepoints[i][0]) !== Number(coordinates[i][0])||Number(valuepoints[i][1]) !== Number(coordinates[i][1])) {
                                solutionpoints[i] = valuepoints[i];
                                value.points = false;
                            };
                        };
                    };
                }else{
                    value.points = false;
                };
            };

            value.innerstrue = false;

            if (item.carco.customparams.values&&item.carco.customparams.values.truewheninnersaretrue){
                var innerstrue = true;
                for (var i = 0; i < item.carco.game.inners.length; i++) {
                    if (item.carco.game.inners[i].carco.customparams.values&&item.carco.game.inners[i].carco.customparams.values.valueon&&!item.carco.game.inners[i].carco.game.trueorfalse) {
                        innerstrue = false;
                    };
                };
                if (innerstrue){
                    value.innerstrue = true;
                };
            };

            value.childrentrue = false;

            if (item.carco.customparams.values&&item.carco.customparams.values.truewhenchildrensaretrue){
                for (var i in item.carco.children) {
                    if (item.carco.children[i].carco.customparams.values&&item.carco.children[i].carco.customparams.values.valueon) {
                        item.carco.children[i].carco.game.valueTrueOrFalse("start");
                    };
                };
                var childrentrue = true
                for (var i in item.carco.children) {
                    if (item.carco.children[i].carco.customparams.values&&item.carco.children[i].carco.customparams.values.valueon&&!item.carco.children[i].carco.game.trueorfalse) {
                        childrentrue = false;
                    };
                };
                if (childrentrue){
                    value.childrentrue = true;
                };
            };

            if (item.carco.customparams.values.truewhenitemsaretrue) {
                if (item.carco.root.carco.game&&item.carco.root.carco.game.trueAllValues&&item.carco.root.carco.game.trueAllValues([item.carco.id])) {
                    value.truewhenitemsaretrue = true;
                }else{
                    value.truewhenitemsaretrue = false;
                };
            };


            value.allclonetrue = undefined;
            var summa = true;

            if (item.carco.customparams.values.allclonetrue&&type!=="start"&&type!=="skipallclone"){
                value.allclonetrue = true;
                var places = item.carco.customparams.placeids;
                var placearray = [];
                if (places){
                    if (typeof places == 'string'&&item.carco.root.carco.recursivechildren[places]){
                        placearray = [item.carco.root.carco.recursivechildren[places]];
                    }else{
                        for (var i = 0; i < places.length; i++) {
                            if (item.carco.root.carco.recursivechildren[places[i]]){
                                placearray.push(item.carco.root.carco.recursivechildren[places[i]]);
                            };
                        };
                    };
                };
                var allclone = [];
                for (var i = 0; i < placearray.length; i++) {
                    var placevalueids = placearray[i].carco.customparams.values.ids;
                    var placevalueitems = [];
                    if (placearray[i].carco.game&&placearray[i].carco.game.values) placevalueitems = placearray[i].carco.game.values.items;
                    var placeclonearrays = [];
                    for (var i = 0; i < placevalueids.length; i++) {
                        if (typeof placevalueids[i] == 'array'||typeof placevalueids[i] == 'object') placeclonearrays.push(placevalueitems[i]);
                    };
                    var targetplacearrays = [];
                    for (var a = 0; a < placeclonearrays.length; a++) {
                        var uniqin = carco.functions.array.diff(placeclonearrays[a], [item])
                        if (uniqin.length < placeclonearrays[a].length) targetplacearrays.push(placeclonearrays[a]);
                    };
                    for (var a = 0; a < targetplacearrays.length; a++) {
                        for (var b = 0; b < targetplacearrays[a].length; b++) {
                            allclone.push(targetplacearrays[a][b]);
                        };
                    };
                };
                allclone = carco.functions.array.uniq(allclone);
                allclone = carco.functions.array.diff(allclone, [item])

                for (var i = 0; i < allclone.length; i++) {
                    allclone[i].carco.game.valueTrueOrFalse("skipallclone")
                    if (allclone[i]&&allclone[i].carco&&allclone[i].carco.game.value == 0) {
                        value.allclonetrue = false;
                        summa = false;
                        if (summa == false) summa = 0;
                        if (summa == true) summa = 1;
                        if (!item.carco.root.carco.game) item.carco.root.carco.game = {};
                        if (!item.carco.root.carco.game.scoremultiplier) item.carco.root.carco.game.scoremultiplier = 1;
                        item.carco.game.value = summa*item.carco.root.carco.game.scoremultiplier;
                    };
                };

            };

            item.carco.game.solution = {};
            item.carco.game.solution.allitemsfalse = [];
            setTimeout(function() {
                if (item.carco.game.values&&item.carco.game.values.allitemsplay){
                    for (var i = 0; i < item.carco.game.values.allitemsplay.length; i++) {
                        if (item.carco.game.values.allitemsplay[i].carco.game.value == 0) {
                            item.carco.game.solution.allitemsfalse.push(item.carco.game.values.allitemsplay[i]);
                        };
                    };
                    if (item.carco.game.solution.allitemsfalse[0]) item.carco.game.solution.allitemsfalsefirst = [item.carco.game.solution.allitemsfalse[0]];
                };
            },50)

            //summa

            if (value.uniqitems == false) summa = false;
            if (clonearrays.length>0&&value.clones == false) summa = false;
            if (item.carco.customparams.values.moreclone== false&&clonearrays.length>0&&value.moreclone == true) summa = false;
            if (item.carco.customparams.values.fixedorder == true&&value.fixorder == false) summa = false;
            if (maxon == false&&value.otheritem == true) summa = false;
            if (value.min == false) summa = false;
            if (value.max == false&&maxon == true) summa = false;
            if (value.action == false) summa = false;
            if (value.points == false) summa = false;
            if (item.carco.customparams.values.truewheninnersaretrue&&value.innerstrue&&value.min !== false) summa = true;
            if (item.carco.customparams.values.truewhenitemsaretrue&&value.truewhenitemsaretrue) summa = true;
            if (item.carco.customparams.values.truewhenchildrensaretrue&&value.childrentrue) summa = true;
            if (input == false) summa = false;

            item.carco.game.valueobj = value;

            item.carco.game.solution.missingitems = solution;
            item.carco.game.solution.sortedallitems = ordersolution;
            item.carco.game.solution.min = minsolution;
            item.carco.game.solution.min_missing = minsolution_missing;
            item.carco.game.solution.max = maxsolution;
            item.carco.game.solution.action_false_first_item = inputtextsolution;
            item.carco.game.solution.allitemsallclones = [];
            if (item.carco.game.values&&item.carco.game.values.allitems) item.carco.game.solution.allitemsallclones = item.carco.game.values.allitems;
            item.carco.game.solution.action_false_allitemsallclones = action_false_allitemsallclones
            item.carco.game.solution.returnaction = returnaction;
            item.carco.game.solution.points = solutionpoints;
            item.carco.game.solution.allfalseclones = allfalseclones;
            item.carco.game.solution.allfalsecloneitems = allfalsecloneitems;
            item.carco.game.solution.allfalsecloneitemsclonenumber = allfalsecloneitemsclonenumber;

            carco.functions.console("summa "+item.carco.id+": "+summa);
            carco.functions.console(value);
            carco.functions.console(item.carco.game.solution);

            if (summa == false) summa = 0;
            if (summa == true) summa = 1;
            if (!item.carco.root.carco.game) item.carco.root.carco.game = {};
            if (!item.carco.root.carco.game.scoremultiplier) item.carco.root.carco.game.scoremultiplier = 1;

            if (item.carco.customparams.gametype == "placecontainer"){
                var innerswaschange = "nochanged";
                var innerswaschange1 = "nochanged";
                if (!item.carco.game.tempinners1) item.carco.game.tempinners1 = [];
                for (var i = 0; i < item.carco.game.inners.length; i++) {
                    if (item.carco.game.inners[i] !== item.carco.game.tempinners1[i]) innerswaschange = true;
                };
                if (!item.carco.game.temptempinners) item.carco.game.temptempinners = [];
                for (var i = 0; i < item.carco.game.inners.length; i++) {
                    if (item.carco.game.inners[i] !== item.carco.game.temptempinners[i]) innerswaschange1 = true;
                };
            };
            var tempvalue = item.carco.game.value
            item.carco.game.trueorfalse = summa;
            item.carco.game.value = summa*item.carco.root.carco.game.scoremultiplier;
            if (item.carco.game.ready) item.carco.game.value = tempvalue;
            if (item.carco.customparams.gametype == "placecontainer"){
                if (innerswaschange == "nochanged"&&summa==1){
                    if (!item.carco.game.tempvalue) item.carco.game.tempvalue = 0
                    if (item.carco.game.value < item.carco.game.tempvalue) {
                        item.carco.game.value = item.carco.game.tempvalue;
                    };
                };
            };
            item.carco.game.valueready = true;
        }else{
            item.carco.game.value = undefined;
        };
        setTimeout(function() {
            if (!item.carco.root.carco.paramsdata.user.feedbacktype) item.carco.root.carco.paramsdata.user.feedbacktype = "editor";
            if (type !== "start"&&type !== "innerssorter"&&type!=="skipallclone"&&type!=="childrenstrue"){
                carco.functions.feedback.types[item.carco.root.carco.paramsdata.user.feedbacktype](item.carco.root);
            };
        },500)

        if (item.carco.customparams.memogame) this.memogame(item);
        return item.carco.game.value
    },
    startAllValues: function(item) {
        var allOnValues = item.carco.getChildren({children:"recursivechildren", equal:{type:"container", customparams:{values:{valueon:1}}}, type:"item"})
        for (var i = 0; i < allOnValues.length; i++) {
            if (allOnValues[i].carco.game.values){
                allOnValues[i].carco.game.values({valueids:allOnValues[i].carco.customparams.values.valueids, valuepoints:item.carco.customparams.valuepoints}, true, "start");
            }
        };
        item.carco.game.scores();
    },
    trueAllValues: function(item, nonequal){
        var allOnValues = item.carco.getChildren({children:"recursivechildren", equal:{type:"container", customparams:{values:{valueon:1}}}, type:"item"})
        var nonEqualItems = [];
        if (nonequal){
            for (var i = 0; i < nonequal.length; i++) {
                if (item.carco.root.carco.recursivechildren[nonequal[i]]) nonEqualItems.push(item.carco.root.carco.recursivechildren[nonequal[i]]);
            };
        };
        allOnValues = carco.functions.array.diff(allOnValues, nonEqualItems);
        var trueAllValues = true;
        var falseValues = [];
        for (var i = 0; i < allOnValues.length; i++) {
            if (allOnValues[i].carco.game.value == 0&&allOnValues[i].carco.game.duplicateddrag !== true&&!allOnValues[i].carco.customparams.disabletrueallvalues) {
                trueAllValues = false;
                falseValues.push(allOnValues[i])
            };
        };

        var currenttrack = -1;
        if (!item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.originaltracks) item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.originaltracks = carco.functions.object.clone(item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.tracks);
        if (!item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.originaltracks.length) item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.originaltracks.length = item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.tracks.length
        for (var i = 0; i < item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.originaltracks.length; i++) {
            if (item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.originaltracks[i] == item.carco.root.carco.paramsdata.system.currenttrack) {
                currenttrack = i;
            };
        };
        if (item.carco.allscorearray&&item.carco.allscorearray[currenttrack]&&!isNaN(item.carco.allscorearray[currenttrack])){
            if (item.carco.root.carco.score[item.carco.paramsdata.system.currenttrack].userscore_withoutmultiplier==item.carco.allscorearray[currenttrack]) trueAllValues = true;
        };
        return trueAllValues;
    },
    titleaudio: function(item, type){

        var root = item.carco.root;
        var currenttrack = root.carco.getCurrentTrack();
        var language = item.carco.getLanguage();

        if (!root.carco.titleAudioAutoDisable){
            root.carco.titleAudioAutoDisable = function() {
                var root = item.carco.root;
                var disable = false;
                var allemptyen = true;
                var info = item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.info;
                if (info&&info[language]){
                    if (info[language]["audio_instruction_1-6"]) allemptyen = false;
                    if (info[language]["audio_instruction_"+currenttrack]) allemptyen = false;
                };
                if (allemptyen) disable = true;
                return disable;
            };
        };

        if (!root.carco.studentsAudioAutoDisable){
            root.carco.studentsAudioAutoDisable = function() {
                var root = item.carco.root;
                var disable = false;
                var allemptyen = true;
                var info = item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.info;
                if (info&&info[language]&&info[language]["audio_for_students"]) allemptyen = false;
                if (allemptyen) disable = true;
                return disable;
            };
        };
        if (item.carco.root.carco.titleAudioAutoDisable()){
            if (item.carco.root.carco.playeritems["playertitleaudio"]) item.carco.root.carco.playeritems["playertitleaudio"].style.display = "none";
        };
        if (item.carco.root.carco.studentsAudioAutoDisable()){
            if (item.carco.root.carco.playeritems["playerstudentaudio"]) item.carco.root.carco.playeritems["playerstudentaudio"].style.display = "none";
        };
        if (type !== "constructor"){

            if (!root.carco.titleAudioAutoDisable()){

                var src = item.carco.titleAudioSrc()[0];
                var sound = item.carco.titleAudioSrc()[1];

                if (src) {
                    if (item.carco.titlesound){
                        item.carco.stopTitleSound();
                        if (item.carco.stopStudentsSound) item.carco.stopStudentsSound();
                        if (item.carco.root.carco.playeritems["playertitleaudio"]) carco.functions.listeners.remove(item.carco.root.carco.playeritems["playertitleaudio"], "mousedown", item.carco.stopTitleSound);
                        if (item.carco.root.carco.playeritems["playertitleaudio"]) carco.functions.listeners.remove(item.carco.root.carco.playeritems["playertitleaudio"], "mousedown", item.carco.playTitleSound);
                        item.carco.titlesound = false;
                    };

                    if (!item.carco.playTitleSound){
                        item.carco.playTitleSound = function(id) {

                            var src = item.carco.titleAudioSrc()[0];
                            var sound = item.carco.titleAudioSrc()[1];

                            item.carco.root.carco.game.stopAllRunnedAudio(src);
                            item.carco.root.carco.currentplayaudio = {src:src, stop:item.carco.stopTitleSound};
                            //if (item.carco.stopStudentsSound) item.carco.stopStudentsSound();
                            if (item.carco.root.carco.playeritems["playertitleaudio"]) {
                                if (item.carco.root.carco.playeritems["playertitleaudio"]) carco.functions.listeners.remove(item.carco.root.carco.playeritems["playertitleaudio"], "mousedown", item.carco.playTitleSound);
                                if (item.carco.root.carco.playeritems["playertitleaudio"]) carco.functions.listeners.remove(item.carco.root.carco.playeritems["playertitleaudio"], "mousedown", item.carco.stopTitleSound);
                                if (item.carco.root.carco.playeritems["playertitleaudio"]) carco.functions.listeners.add(item.carco.root.carco.playeritems["playertitleaudio"], "mousedown", item.carco.stopTitleSound);
                                item.carco.root.carco.playeritems["playertitleaudio"].className = "drwmsg-nav_ul drwmsg-game-title-audio drwmsg-game-title-audio_active"
                            };
                            if (!item.carco.titlesound||true) {
                                item.carco.titlesound = carco.createjs.Sound.play(src);
                            }else{
                                if (!item.carco.titlesound.started) {
                                    item.carco.titlesound.removeEventListener("complete", function() {item.carco.stopTitleSound();})
                                    item.carco.titlesound = carco.createjs.Sound.play(src);
                                    item.carco.titlesound.started = true
                                };
                            };
                            if (item.carco.titlesound&&id) item.carco.titlesound.id = id;
                            item.carco.titlesound.removeEventListener("complete", function() {item.carco.stopTitleSound();})
                            item.carco.titlesound.addEventListener("complete", function() {item.carco.stopTitleSound();})
                        };

                        item.carco.stopTitleSound = function() {

                            var src = item.carco.titleAudioSrc()[0];
                            var sound = item.carco.titleAudioSrc()[1];

                            if (item.carco.root.carco.currentplayaudio&&item.carco.root.carco.currentplayaudio.src == src) {
                                item.carco.root.carco.currentplayaudio = false;
                            };
                            if (item.carco.root.carco.playeritems["playertitleaudio"]) {
                                carco.functions.listeners.remove(item.carco.root.carco.playeritems["playertitleaudio"], "mousedown", item.carco.stopTitleSound);
                                carco.functions.listeners.remove(item.carco.root.carco.playeritems["playertitleaudio"], "mousedown", item.carco.playTitleSound);
                                carco.functions.listeners.add(item.carco.root.carco.playeritems["playertitleaudio"], "mousedown", item.carco.playTitleSound);
                                item.carco.root.carco.playeritems["playertitleaudio"].className = "drwmsg-nav_ul drwmsg-game-title-audio"
                            };
                            if (item.carco.titlesound){
                                item.carco.titlesound.removeEventListener("complete", function() {item.carco.stopTitleSound();})
                                item.carco.titlesound.started = false;
                                if (item.carco.titlesound.gainNode) {
                                    item.carco.titlesound.stop();
                                }else{
                                    carco.createjs.Sound.stop();
                                };
                            };
                        };
                    };

                    if (!item.carco.titlesound){
                        if (item.carco.root.carco.playeritems["playertitleaudio"]) carco.functions.listeners.remove(item.carco.root.carco.playeritems["playertitleaudio"], "mousedown", item.carco.playTitleSound);
                        if (item.carco.root.carco.playeritems["playertitleaudio"]) carco.functions.listeners.add(item.carco.root.carco.playeritems["playertitleaudio"], "mousedown", item.carco.playTitleSound);
                    };

                };
                if (!item.carco.root.carco.wassaveduserdata&&!item.carco.paramsdata.user.disableautoplaysounds) {
                    setTimeout(function(){
                        item.carco.playTitleSound();
                    },100)
                };
            };

            if (!root.carco.studentsAudioAutoDisable()){

                var ssrc = item.carco.studentsAudisSrc()[0];
                var ssound = item.carco.studentsAudisSrc()[1];

                if (ssrc) {
                    if (item.carco.studentssound){
                        if (item.carco.root.carco.playeritems["playerstudentaudio"]) carco.functions.listeners.remove(item.carco.root.carco.playeritems["playerstudentaudio"], "mousedown", item.carco.stopStudentsSound);
                        if (item.carco.root.carco.playeritems["playerstudentaudio"]) carco.functions.listeners.remove(item.carco.root.carco.playeritems["playerstudentaudio"], "mousedown", item.carco.playStudentsSound);
                        item.carco.stopStudentsSound();
                    };
                    if (!item.carco.playStudentsSound){
                        item.carco.playStudentsSound = function() {

                            var ssrc = item.carco.studentsAudisSrc()[0];
                            var ssound = item.carco.studentsAudisSrc()[1];

                            item.carco.root.carco.game.stopAllRunnedAudio(ssrc);
                            item.carco.root.carco.currentplayaudio = {src:ssrc, stop:item.carco.stopStudentsSound};
                            //if (item.carco.stopTitleSound) item.carco.stopTitleSound();
                            if (item.carco.root.carco.playeritems["playerstudentaudio"]) {
                                if (item.carco.root.carco.playeritems["playerstudentaudio"]) carco.functions.listeners.remove(item.carco.root.carco.playeritems["playerstudentaudio"], "mousedown", item.carco.playStudentsSound);
                                if (item.carco.root.carco.playeritems["playerstudentaudio"]) carco.functions.listeners.remove(item.carco.root.carco.playeritems["playerstudentaudio"], "mousedown", item.carco.stopStudentsSound);
                                if (item.carco.root.carco.playeritems["playerstudentaudio"]) carco.functions.listeners.add(item.carco.root.carco.playeritems["playerstudentaudio"], "mousedown", item.carco.stopStudentsSound);
                                item.carco.root.carco.playeritems["playerstudentaudio"].className = "drwmsg-game-title-audio drwmsg-game-student-audio drwmsg-game-title-audio_active"
                            };
                            item.carco.studentssound = carco.createjs.Sound.play(ssrc);
                            item.carco.studentssound.addEventListener("complete", item.carco.stopStudentsSound)
                            item.carco.studentssoundplaying = true;
                        };
                        item.carco.stopStudentsSound = function() {

                            var ssrc = item.carco.studentsAudisSrc()[0];
                            var ssound = item.carco.studentsAudisSrc()[1];

                            if (item.carco.root.carco.currentplayaudio&&item.carco.root.carco.currentplayaudio.src == ssrc) {
                                item.carco.root.carco.currentplayaudio = false;
                            };
                            if (item.carco.root.carco.playeritems["playerstudentaudio"]) {
                                carco.functions.listeners.remove(item.carco.root.carco.playeritems["playerstudentaudio"], "mousedown", item.carco.stopStudentsSound);
                                carco.functions.listeners.remove(item.carco.root.carco.playeritems["playerstudentaudio"], "mousedown", item.carco.playStudentsSound);
                                carco.functions.listeners.add(item.carco.root.carco.playeritems["playerstudentaudio"], "mousedown", item.carco.playStudentsSound);
                                item.carco.root.carco.playeritems["playerstudentaudio"].className = "drwmsg-game-title-audio drwmsg-game-student-audio"
                            };
                            if (item.carco.studentssound) {
                                item.carco.studentssound.removeEventListener("complete", item.carco.stopStudentsSound)
                                if (item.carco.studentssound.gainNode) {
                                    item.carco.studentssound.stop();
                                }else{
                                    carco.createjs.Sound.stop();
                                };
                            }else {
                                //carco.createjs.Sound.stop(ssrc);
                            };
                            item.carco.studentssoundplaying = false;
                        };
                    };
                    if (!item.carco.studentssound){
                        if (item.carco.root.carco.playeritems["playerstudentaudio"]) carco.functions.listeners.remove(item.carco.root.carco.playeritems["playerstudentaudio"], "mousedown", item.carco.playStudentsSound);
                        if (item.carco.root.carco.playeritems["playerstudentaudio"]) carco.functions.listeners.add(item.carco.root.carco.playeritems["playerstudentaudio"], "mousedown", item.carco.playStudentsSound);
                    };
                };
            };

        };
    },
    language: function(item){
        var item = item.carco.root
        if (item.carco.changeLanguage_hu) carco.functions.listeners.remove(item.carco.root.carco.playeritems.langbutton_hu, "mousedown", item.carco.root.carco.changeLanguage_hu);
        if (item.carco.changeLanguage_en) carco.functions.listeners.remove(item.carco.root.carco.playeritems.langbutton_en, "mousedown", item.carco.root.carco.changeLanguage_en);

        if (item.carco.root.carco.paramsdata.user.lang == "hu_hu") item.carco.root.carco.paramsdata.user.lang = "hu";
        if (item.carco.root.carco.paramsdata.user.lang == "en_gb") item.carco.root.carco.paramsdata.user.lang = "en";
        if (item.carco.root.carco.paramsdata.user.lang !== "hu"&&item.carco.root.carco.paramsdata.user.lang !== "en") item.carco.root.carco.paramsdata.user.lang = "hu";

        item.carco.root.carco.changeLanguage_hu = function(){
            if (item.carco.root.carco.paramsdata.user.lang !== "hu"){
                item.carco.root.carco.paramsdata.user.lang = "hu";
                item.carco.root.carco.loadedparams.user.lang = "hu";
                item.carco.root.carco.game.language();
            };
        }

        item.carco.root.carco.changeLanguage_en = function(){
            if (item.carco.root.carco.paramsdata.user.lang !== "en"){
                item.carco.root.carco.paramsdata.user.lang = "en";
                item.carco.root.carco.loadedparams.user.lang = "en";
                item.carco.root.carco.game.language();
            };
        }

        item.carco.root.carco.LangAutoDisable = function() {
            var root = item.carco.root;
            var disable = false;
            var allemptyen = true;
            if (root.carco.language&&root.carco.language.inner&&root.carco.language.inner[0]){
                for (var i = 0; i < root.carco.language.inner.length; i++) {
                    if (root.carco.language.inner[i].en&&typeof root.carco.language.inner[i].en == 'string'&&
                        root.carco.language.inner[i].en !== root.carco.language.inner[i].hu){
                        allemptyen = false;
                    };
                };
            };

            var info = item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.info;
            if (info&&info.en&&info.hu){
                for (var i in info.en) {
                    if (info.hu[i]&&info.en[i] !== info.hu[i]) allemptyen = false;
                };
            };

            if (allemptyen) disable = true;
            if (root.carco.paramsdata.user.disablelangbuttons) disable = true;
            return disable;
        };

        item.carco.root.carco.game.titleaudio("constructor");

        if (item.carco.root.carco.LangAutoDisable()){
            if (item.carco.root.carco.playeritems["langbutton_hu"]) item.carco.root.carco.playeritems["langbutton_hu"].style.display = "none";
            if (item.carco.root.carco.playeritems["langbutton_en"]) item.carco.root.carco.playeritems["langbutton_en"].style.display = "none";
        };

        var language = item.carco.root.carco.paramsdata.user.lang;
        if (language == "hu"){
            if (item.carco.root.carco.playeritems["langbutton_hu"]) item.carco.root.carco.playeritems["langbutton_hu"].className = "drwmsg-nav_ul drwmsg-nav_ul_change_left drwmsg-nav_ul_active drwmsg-nav_ul_active_bg";
            if (item.carco.root.carco.playeritems["langbutton_en"]) item.carco.root.carco.playeritems["langbutton_en"].className = "drwmsg-nav_ul";
            if (item.carco.changeLanguage_en) carco.functions.listeners.add(item.carco.root.carco.playeritems.langbutton_en, "mousedown", item.carco.root.carco.changeLanguage_en);
        }else{
            if (item.carco.root.carco.playeritems["langbutton_hu"]) item.carco.root.carco.playeritems["langbutton_hu"].className = "drwmsg-nav_ul drwmsg-nav_ul_change_left";
            if (item.carco.root.carco.playeritems["langbutton_en"]) item.carco.root.carco.playeritems["langbutton_en"].className = "drwmsg-nav_ul drwmsg-nav_ul_active drwmsg-nav_ul_active_bg";
            if (item.carco.changeLanguage_hu) carco.functions.listeners.add(item.carco.root.carco.playeritems.langbutton_hu, "mousedown", item.carco.root.carco.changeLanguage_hu);
        }

        var player_title = item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.info[language].title;
        var currenttrack = 1;
        if (!item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.originaltracks) item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.originaltracks = carco.functions.object.clone(item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.tracks);
        if (!item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.originaltracks.length) item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.originaltracks.length = item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.tracks.length
        for (var i = 0; i < item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.originaltracks.length; i++) {
            if (item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.originaltracks[i] == item.carco.root.carco.paramsdata.system.currenttrack) {
                currenttrack = i+1;
            };
        };

        var game_title = item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.info[language]["instruction_"+currenttrack];
        if (!game_title) game_title = item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.info[language]["instruction_1-6"];

        if (item.carco.root.carco.playeritems.playertitle&&player_title) item.carco.root.carco.playeritems.playertitle.innerHTML = player_title;
        if (item.carco.root.carco.playeritems.gametitle&&game_title) item.carco.root.carco.playeritems.gametitle.innerHTML = game_title;

        var forstudents = item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.info[language]["for_students"];
        var forteachers = item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.info[language]["for_teachers"];

        if (item.carco.root.carco.playeritems.info_forstudents&&forstudents) item.carco.root.carco.playeritems.info_forstudents.innerHTML = forstudents;
        if (item.carco.root.carco.playeritems.info_forteachers&&forteachers) item.carco.root.carco.playeritems.info_forteachers.innerHTML = forteachers;

        if (!item.carco.language) item.carco.language = {};
        if (!item.carco.language.id) item.carco.language.id = {};
        for (var x in item.carco.root.carco.language.id){
            for (var y in item.carco.playeritems){
                if (item.carco.playeritems[y].getAttribute&&item.carco.playeritems[y].getAttribute("id") == x) item.carco.playeritems[y].innerHTML = item.carco.root.carco.language.id[x][language]
            };
            if (item.carco.playeritems[x]) item.carco.playeritems[x].innerHTML = item.carco.root.carco.language.id[x][language];
        };

        for (var x in item.carco.recursivechildren){
            if (item.carco.recursivechildren[x].carco.type == "text"&&item.carco.root.carco.language.inner) {
                if (!item.carco.recursivechildren[x].carco.currentlanguage) item.carco.recursivechildren[x].carco.currentlanguage = "hu";
                for (var z = 0; z < item.carco.root.carco.language.inner.length; z++) {
                    if (item.carco.root.carco.language.inner[z]["hu"] == item.carco.recursivechildren[x].carco.originalcustomparams.innerHTML&&item.carco.recursivechildren[x].carco.currentlanguage !== item.carco.root.carco.paramsdata.user.lang){
                        if (item.carco.root.carco.language.inner[z][item.carco.root.carco.paramsdata.user.lang]&&typeof item.carco.root.carco.language.inner[z][item.carco.root.carco.paramsdata.user.lang] == "string"&& item.carco.root.carco.language.inner[z][item.carco.root.carco.paramsdata.user.lang] !== ""){
                            if (item.carco.recursivechildren[x].carco.customparams.mathjax == true||item.carco.recursivechildren[x].carco.customparams.mathjax == 1){
                                if (item.carco.root.carco.paramsdata.user.lang == "en") {
                                    item.carco.recursivechildren[x].carco.innerHTML(item.carco.root.carco.language.inner[z][item.carco.root.carco.paramsdata.user.lang]);
                                }else{
                                    item.carco.recursivechildren[x].carco.innerHTML("reset");
                                };
                            }else{
                                if (item.carco.root.carco.paramsdata.system.usertype == "user"&&carco.functions.browser.IE() == 10&&carco.functions.isMobile.any()||
                                    item.carco.root.carco.paramsdata.system.usertype == "user"&&carco.functions.browser.IE() == 11&&carco.functions.isMobile.IeMobile()) {
                                    var replacetext = item.carco.root.carco.language.inner[z][item.carco.root.carco.paramsdata.user.lang];
                                    if (replacetext.replace){
                                        replacetext = replacetext.replace(/<br\s*[\/]?>/gi, "\n");
                                        replacetext = replacetext.replace(/<br \/>/gi, "\n");
                                        replacetext = replacetext.replace(/\</g, "&lt;")
                                        replacetext = replacetext.replace(/\>/g, "&gt;")
                                        replacetext = replacetext.replace(/\n/gi, "<br/>");
                                    };
                                    item.carco.recursivechildren[x].innerHTML = replacetext;
                                }else{
                                    item.carco.recursivechildren[x].innerHTML = item.carco.root.carco.language.inner[z][item.carco.root.carco.paramsdata.user.lang];
                                };
                            }
                            item.carco.root.carco.recursivechildren[x].carco.currentlanguage = item.carco.root.carco.paramsdata.user.lang
                        };
                    };
                };
            };
        };
        if (item.carco.game&&item.carco.game.playertitle) item.carco.game.playertitle();
        var allcontainer = item.carco.root.carco.getChildren({equal:{type:"container", customparams:{gametype:"random_mix_sort_cont"}}, type:"item"})
        for (var a = 0; a < allcontainer.length; a++) {
            if (allcontainer[a].carco.game.textarray) allcontainer[a].carco.game.textarray();
        };
    },
    generateLangXML: function(item) {

        if (!item.carco.language) item.carco.language = {};
        if (!item.carco.language.inner) item.carco.language.inner = [];
        var texts = [];
        for (var i = 0; i < item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.tracks.length; i++) {
            for (var x in item.carco.paramsdata.tracks){
                var track = item.carco.paramsdata.tracks[x];
                if (x == item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.tracks[i]){
                    for (var p in track.params){
                        if (track.params[p].customparams.innerHTML&&track.params[p].type == "text"){
                            texts.push(track.params[p].customparams.innerHTML);
                        };
                    };
                };
            };
            if (item.carco.paramsdata.system.currenttrack == item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.tracks[i]){
                for (var x in item.carco.recursivechildren){
                    if (item.carco.recursivechildren[x].type == "text") {
                        if (!item.carco.recursivechildren[x].carco.originalcustomparams) item.carco.recursivechildren[x].carco.originalcustomparams = {};
                        if (!item.carco.recursivechildren[x].carco.originalcustomparams.innerHTML) item.carco.recursivechildren[x].carco.originalcustomparams.innerHTML = item.carco.recursivechildren[x].carco.customparams.innerHTML;
                        texts.push(item.carco.recursivechildren[x].carco.originalcustomparams.innerHTML);
                    };
                };
            };
        };

        texts = carco.functions.array.uniq(texts);
        var newinner = [];
        for (var i = 0; i < texts.length; i++) {
            var target = "";
            for (var z = 0; z < item.carco.language.inner.length; z++) {
                if (item.carco.language.inner[z]["hu"] == texts[i]) {
                    if (item.carco.language.inner[z]["en"]) target = item.carco.language.inner[z]["en"];
                };
            };
            newinner.push({hu:texts[i], en:target});
        };

        item.carco.language.inner = newinner;

    },
    player: function(item){

        if (!item.carco.feedbacktypes){
            if (item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.feedbacktypes){
                if (item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.feedbacktypes!==""){
                    var points = item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.feedbacktypes;
                    points = points.toString()
                    points = points.replace(/\n/g, ",");
                    points = points.replace(/ /gi, "")
                    points = points.replace(/,,/g, ",");
                    points = points.replace(/,,/g, ",");
                    points = $.parseJSON(points);
                    item.carco.feedbacktypes = points;
                }else{
                    item.carco.feedbacktypes = [];
                };
            };
        };

        var currenttrack = -1;

        for (var i = 0; i < item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.originaltracks.length; i++) {
            if (item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.originaltracks[i] == item.carco.root.carco.paramsdata.system.currenttrack) {
                currenttrack = i;
            };
        };

        function addsolution(){
            addscorebar();
            if (item.carco.root.carco.playeritems.solutionbutton) {
                if (!item.carco.root.carco.playeritems.solutionbutton.carco.confighidden) {
                    item.carco.root.carco.playeritems.solutionbutton.className = "drwmsg-nav_ul solutionbutton"
                };
                if (item.carco.solutionfunction){
                    if (!item.carco.buttonsolutionfunction) {
                        item.carco.buttonsolutionfunction = function (ev) {
                            item.carco.playeritems.preload_layer.style.display = "block";
                            carco.functions.root.preloadlayer(item, "add");
                            if (item.carco.playeritems.preload_layer) item.carco.playeritems.preload_layer.style.opacity = 0.5
                            setTimeout(function () {
                                item.carco.solutionfunction(ev)
                            })
                        };
                    };
                    carco.functions.listeners.remove(item.carco.root.carco.playeritems.solutionbutton, "mousedown", item.carco.buttonsolutionfunction);
                    carco.functions.listeners.add(item.carco.root.carco.playeritems.solutionbutton, "mousedown", item.carco.buttonsolutionfunction);
                }
            };
        };

        function removesolution(){
            if (item.carco.root.carco.playeritems.solutionbutton) {
                item.carco.root.carco.playeritems.solutionbutton.className = "drwmsg-nav_ul solutionbutton drwmsg-nav_ul_disable"
                if (item.carco.solutionfunction){
                    carco.functions.listeners.remove(item.carco.root.carco.playeritems.solutionbutton, "mousedown", item.carco.buttonsolutionfunction);
                }
            };
        };

        item.carco.removesolution = function(){removesolution();};
        item.carco.addsolution = function(){addsolution();};

        function addscorebar(){
            if (item.carco.root.carco.playeritems.scorebar) {
                if (!item.carco.root.carco.playeritems.scorebar.carco.confighidden) {
                    item.carco.root.carco.playeritems.scorebar.style.display = "inline-block";
                };
            };
        };

        function removescorebar(){
            if (item.carco.root.carco.playeritems.scorebar) {
                item.carco.root.carco.playeritems.scorebar.style.display = "none";
            };
        };

        function addcheck(){

            if (item.carco.root.carco.ischecking&&item.carco.root.carco.paramsdata.system.usertype == "user"&&item.carco.root.carco.paramsdata.user.restartbutton&&item.carco.paramsdata.user.feedbacktype == "practice"||
                item.carco.root.carco.adeddrestartbutton&&item.carco.root.carco.paramsdata.system.usertype == "user"&&item.carco.root.carco.paramsdata.user.restartbutton&&item.carco.paramsdata.user.feedbacktype == "practice") {
                addrestart();
                item.carco.root.carco.playeritems.checkbutton.style.display = "none"
                item.carco.root.carco.playeritems.checkbutton.className = "drwmsg-nav_ul checkbutton"
                item.carco.root.carco.adeddrestartbutton = true;

            }else{

                item.carco.root.carco.adeddrestartbutton = false;
                if (item.carco.root.carco.playeritems.checkbutton) {
                    item.carco.root.carco.playeritems.checkbutton.className = "drwmsg-nav_ul checkbutton"
                    if(!item.carco.root.carco.playeritems.checkbutton.carco.confighidden) {
                        item.carco.root.carco.playeritems.checkbutton.style.display = "block"
                        setTimeout(function() {
                            item.carco.root.carco.playeritems.checkbutton.className = "drwmsg-nav_ul checkbutton checkbutton-open"
                        },10)
                    };
                    if (item.carco.checkfunction){
                        if (!item.carco.buttoncheckfunction) {
                            item.carco.buttoncheckfunction = function (ev) {
                                item.carco.playeritems.preload_layer.style.display = "block";
                                carco.functions.root.preloadlayer(item, "add");
                                if (item.carco.playeritems.preload_layer) item.carco.playeritems.preload_layer.style.opacity = 0.5
                                setTimeout(function () {
                                    item.carco.checkfunction(ev)
                                    item.carco.root.carco.ischecking = true;
                                })
                            };
                        };
                        carco.functions.listeners.remove(item.carco.root.carco.playeritems.checkbutton, "mousedown", item.carco.buttoncheckfunction);
                        carco.functions.listeners.add(item.carco.root.carco.playeritems.checkbutton, "mousedown", item.carco.buttoncheckfunction);
                    }
                };
            };
        };

        function addrestart(){
            if (item.carco.root.carco.playeritems.restartbutton) {
                item.carco.root.carco.playeritems.restartbutton.className = "drwmsg-nav_ul restartbutton drwmsg-greenbutton";
                if(!item.carco.root.carco.playeritems.restartbutton.carco.confighidden) item.carco.root.carco.playeritems.restartbutton.style.display = "block";
                if (item.carco.restartfunction){
                    carco.functions.listeners.remove(item.carco.root.carco.playeritems.restartbutton, "mousedown", item.carco.restartfunction)
                    carco.functions.listeners.add(item.carco.root.carco.playeritems.restartbutton, "mousedown", item.carco.restartfunction);
                };
                item.carco.endlayer.carco.setStyle({visibility: "visible"})
            };
        };

        function removerestart(){
            if (item.carco.root.carco.playeritems.restartbutton) {
                item.carco.root.carco.playeritems.restartbutton.style.display = "none";
                if (item.carco.restartfunction){
                    carco.functions.listeners.remove(item.carco.root.carco.playeritems.restartbutton, "mousedown", item.carco.restartfunction)
                };
                if (item.carco.root.carco.paramsdata.user.restartbutton&&item.carco.game.process<3) {
                    item.carco.endlayer.carco.setStyle({visibility: "hidden"})
                };
            };
        };

        function removecheck(){
            removerestart();
            if (item.carco.root.carco.playeritems.checkbutton) {
                item.carco.root.carco.playeritems.checkbutton.className = "drwmsg-nav_ul checkbutton drwmsg-nav_ul_disable"
                if(!item.carco.root.carco.playeritems.checkbutton.carco.confighidden) item.carco.root.carco.playeritems.checkbutton.style.display = "block";
                if (item.carco.checkfunction){
                    carco.functions.listeners.remove(item.carco.root.carco.playeritems.checkbutton, "mousedown", item.carco.buttoncheckfunction);
                }
            };
        };

        function addnext(){
            addscorebar();
            if (item.carco.root.carco.playeritems.nextbutton) {
                item.carco.root.carco.playeritems.nextbutton.className = "drwmsg-nav_ul nextbutton";
                if (item.carco.nextfunction){
                    carco.functions.listeners.remove(item.carco.root.carco.playeritems.nextbutton, "mousedown", item.carco.nextfunction)
                    carco.functions.listeners.add(item.carco.root.carco.playeritems.nextbutton, "mousedown", item.carco.nextfunction);
                }
            };
        };

        function removenext(){
            if (item.carco.root.carco.playeritems.nextbutton) {
                item.carco.root.carco.playeritems.nextbutton.className = "drwmsg-nav_ul nextbutton drwmsg-nav_ul_disable"
                if (item.carco.nextfunction){
                    carco.functions.listeners.remove(item.carco.root.carco.playeritems.nextbutton, "mousedown", item.carco.nextfunction)
                }
            };
        };

        if (item.carco.root.carco.playeritems.checkbox) item.carco.root.carco.playeritems.checkbox.style.display = "block";
        if (item.carco.root.carco.playeritems.navigation) item.carco.root.carco.playeritems.navigation.style.display = "inline-block";

        var memogame = false;
        var places = item.carco.getChildren({equal:{customparams:{gametype:"place"}}, type:"item"});
        for (var i = 0; i < places.length; i++) {
            if (places[i].carco.customparams.memogame) memogame = true;
        };

        if (item.carco.paramsdata.user.feedbacktype == "practice"){
            removecheck();
            removesolution();
            removenext();
            removescorebar();

            item.carco.restartfunction = function(ev){
                item.carco.root.carco.ischecking = false;
                item.carco.root.carco.adeddrestartbutton = false;
                var allOnValues = item.carco.root.carco.getChildren({children:"recursivechildren", equal:{type:"container", customparams:{values:{valueon:1}}}, type:"item"})

                carco.functions.feedback.check.remove(item);
                carco.functions.feedback.solution.remove(item);
                for (var i = 0; i < allOnValues.length; i++){
                    if (!allOnValues[i].carco.game.ready) carco.functions.feedback.check.remove(allOnValues[i]);
                    if (!allOnValues[i].carco.game.ready) carco.functions.feedback.solution.remove(allOnValues[i]);
                };
                setTimeout(function() {item.carco.game.player();},200)

            };

            item.carco.checkfunction = function(ev){
                item.carco.playeritems.preload_layer.style.display = "block";
                carco.functions.root.preloadlayer(item, "add");
                if (item.carco.playeritems.preload_layer) item.carco.playeritems.preload_layer.style.opacity = 0.5;
                var feedbackon = true;
                var nextprocess = 2
                if (item.carco.feedbacktypes&&item.carco.feedbacktypes[currenttrack]&&item.carco.feedbacktypes[currenttrack] == 1) {
                    feedbackon = "all";
                    nextprocess = 3;
                    item.carco.endlayer.carco.setStyle({visibility: "visible"})
                    carco.functions.listeners.removeAllitemListeners(item, false);
                    item.carco.root.carco.ischecking = false;
                };
                item.carco.customparams.feedbackon = feedbackon;
                item.carco.root.carco.game.feedbackcheck = false;
                carco.functions.feedback.types.editor(item, undefined, ev);
                if (!item.carco.game) item.carco.game = {};
                if (!item.carco.root.carco.intervals) item.carco.root.carco.intervals = {};
                if (item.carco.root.carco.intervals.feedbackwait7) clearInterval(item.carco.root.carco.intervals.feedbackwait7);
                if (item.carco.root.carco.intervals.feedbackwait7) clearInterval(item.carco.root.carco.intervals.feedbackwait7);
                if (!item.carco.game.scoremultiplier) item.carco.game.scoremultiplier = 1
                if (item.carco.game.scoremultiplier == 0.5) item.carco.game.scoremultiplier = 0.001
                if (item.carco.game.scoremultiplier == 1) item.carco.game.scoremultiplier = 0.5
                item.carco.returnscores = carco.functions.object.clone(item.carco.scores);
                item.carco.game.process = nextprocess;
                setTimeout(function() {item.carco.game.player();},200)
            };

            item.carco.nextfunction = function(ev, ct){
                removenext();
                if (item.carco.playeritems&&item.carco.playeritems.infoscreenreset) item.carco.playeritems.infoscreenreset();
                item.carco.motionallreset();

                if (item.carco.root.carco.intervals){
                    for (var x in item.carco.root.carco.intervals){
                        if (item.carco.root.carco.intervals[x]) {
                            clearInterval(item.carco.root.carco.intervals[x])
                        };
                    };
                };
                if (ev&&ev.target == item.carco.playeritems.endscreen_restart){
                    carco.functions.listeners.remove(item.carco.root.carco.playeritems.endscreen_restart, "mousedown", item.carco.nextfunction)
                    if (item.carco.playeritems.endscreen) item.carco.playeritems.endscreen.className = "drwmsg-endscreen";
                    if (item.carco.playeritems.blacklayer) item.carco.playeritems.blacklayer.className = "drwmsg-layer";
                    item.carco.paramsdata.system.currenttrack = 1
                    item.carco.reloadtrack(function() {
                        item.carco.removeAllChildren();
                        carco.functions.root.callback(item);
                    })
                }else{
                    howmanydone = 0;
                    for (var i = 0; i < item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.tracks.length; i++) {
                        if (item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.tracks[i] == item.carco.paramsdata.system.currenttrack) {
                            howmanydone = i;
                        };
                    };

                    if (item.carco.root.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.maxtrack&&
                        !isNaN(item.carco.root.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.maxtrack)&&
                        item.carco.root.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.maxtrack!==0&&
                        howmanydone+1>=item.carco.root.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.maxtrack){
                        item.carco.game.endscreen();
                        item.carco.score = {};
                        item.carco.scores = {};
                    }else{
                        if (item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.tracks[howmanydone+1]){
                            item.carco.paramsdata.system.currenttrack = item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.tracks[howmanydone+1];
                            if (ct) item.carco.paramsdata.system.currenttrack = ct;
                            carco.functions.listeners.remove(item.carco.root.carco.playeritems.nextbutton, "mousedown", item.carco.nextfunction)
                            carco.functions.root.preloadlayer(item, "add")
                            item.carco.reloadtrack(function() {
                                item.carco.paramsdata.system.currenttrack = item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.tracks[howmanydone+1];
                                if (ct) item.carco.paramsdata.system.currenttrack = ct;
                                item.carco.removeAllChildren();
                                carco.functions.root.callback(item, false, "next");
                            })
                        }else{
                            item.carco.game.endscreen();
                            item.carco.score = {};
                            item.carco.scores = {};
                        };
                    };
                }
                item.carco.game.process = 0;
            };

            item.carco.solutionfunction = function(ev, preload, check){

                if (item.carco.root.carco.paramsdata.system.usertype == "user") {
                    if (preload !== false)carco.functions.root.preloadlayer(item, "add")
                    if (item.carco.playeritems.preload_layer) item.carco.playeritems.preload_layer.style.opacity = 0.5
                    removenext()
                    removesolution()
                };
                item.carco.customparams.feedbackon = "all"
                carco.functions.feedback.types.editor(item, check, preload);
                setTimeout(function() {
                    item.carco.game.solutionstart = true;
                    item.carco.endlayer.carco.setStyle({visibility: "visible"});
                    carco.functions.listeners.removeAllitemListeners(item, false);
                    item.carco.game.process = 3
                    item.carco.game.player();
                    addnext()
                },100)
                if (!item.carco.game) item.carco.game = {};
                item.carco.root.carco.game.feedbacksolvisible = false;
                if (!item.carco.root.carco.intervals) item.carco.root.carco.intervals = {};
                if (item.carco.root.carco.intervals.feedbackwaitc) clearInterval(item.carco.root.carco.intervals.feedbackwaitc);
                item.carco.root.carco.intervals.feedbackwaitc = setInterval(function() {
                    if (item.carco.root.carco.game.feedbacksolvisible){
                        if (item.carco.root.carco.intervals.feedbackwaitc) clearInterval(item.carco.root.carco.intervals.feedbackwaitc);
                        item.carco.returnscores = carco.functions.object.clone(item.carco.scores);
                    };
                },100)
            };


            if (!item.carco.game) item.carco.game = {};
            if (!item.carco.game.process) item.carco.game.process = 0;
            var trueAllValues = item.carco.game.trueAllValues();
            if (item.carco.game.process>1 && trueAllValues == true && !item.carco.saveduserdata) {
                var check = false;
                if (item.carco.game.process==1) if (!item.carco.game.solutionstart) item.carco.solutionfunction(false, false, check);
                item.carco.game.solutionstart = true;
                item.carco.game.process = 3;
                item.carco.endlayer.carco.setStyle({visibility: "visible"});
                carco.functions.listeners.removeAllitemListeners(item);
            };
            if (memogame == true&&item.carco.game.process==1&&trueAllValues == true && !item.carco.saveduserdata) {
                item.carco.game.process = 3;
                item.carco.endlayer.carco.setStyle({visibility: "visible"});
                carco.functions.listeners.removeAllitemListeners(item);
            };

            if (item.carco.game.process == 3){
                removecheck();
                removesolution();
                addscorebar();
                addnext();
                if (item.carco.root.carco.playeritems.solutionbutton&&!item.carco.root.carco.playeritems.solutionbutton.carco.confighidden) item.carco.root.carco.playeritems.solutionbutton.style.display = "none";
                if (item.carco.root.carco.playeritems.nextbutton&&!item.carco.root.carco.playeritems.nextbutton.carco.confighidden) item.carco.root.carco.playeritems.nextbutton.style.display = "inline-block";
            }

            if (item.carco.game.process == 2){
                addcheck();
                addsolution();
                addscorebar();
                removenext();
                if (item.carco.root.carco.playeritems.solutionbutton&&!item.carco.root.carco.playeritems.solutionbutton.carco.confighidden) item.carco.root.carco.playeritems.solutionbutton.style.display = "inline-block";
                if (item.carco.root.carco.playeritems.nextbutton&&!item.carco.root.carco.playeritems.nextbutton.carco.confighidden) item.carco.root.carco.playeritems.nextbutton.style.display = "none";
            }

            if (item.carco.game.process == 1){
                addcheck();
                removesolution();
                removenext();
                if (item.carco.root.carco.playeritems.solutionbutton&&!item.carco.root.carco.playeritems.solutionbutton.carco.confighidden) item.carco.root.carco.playeritems.solutionbutton.style.display = "inline-block";
                if (item.carco.root.carco.playeritems.nextbutton&&!item.carco.root.carco.playeritems.nextbutton.carco.confighidden) item.carco.root.carco.playeritems.nextbutton.style.display = "none";
                if (memogame == true){
                    removecheck();
                    addsolution();
                    removenext();
                    if (item.carco.root.carco.playeritems.checkbutton&&!item.carco.root.carco.playeritems.checkbutton.carco.confighidden) item.carco.root.carco.playeritems.checkbutton.style.display = "none";
                    if (item.carco.root.carco.playeritems.solutionbutton&&!item.carco.root.carco.playeritems.solutionbutton.carco.confighidden) item.carco.root.carco.playeritems.solutionbutton.style.display = "inline-block";
                    if (item.carco.root.carco.playeritems.nextbutton&&!item.carco.root.carco.playeritems.nextbutton.carco.confighidden) item.carco.root.carco.playeritems.nextbutton.style.display = "inline-block";
                }
            };

            if (item.carco.game.process == 0){
                removecheck();
                removesolution();
                removenext();
                item.carco.root.carco.ischecking = false;
                item.carco.root.carco.adeddrestartbutton = false;
                if (item.carco.root.carco.playeritems.solutionbutton&&!item.carco.root.carco.playeritems.solutionbutton.carco.confighidden) item.carco.root.carco.playeritems.solutionbutton.style.display = "inline-block";
                if (item.carco.root.carco.playeritems.nextbutton&&!item.carco.root.carco.playeritems.nextbutton.carco.confighidden) item.carco.root.carco.playeritems.nextbutton.style.display = "none";
                if (memogame == true){
                    removecheck();
                    removesolution();
                    removenext();
                    if (item.carco.root.carco.playeritems.checkbutton&&!item.carco.root.carco.playeritems.checkbutton.carco.confighidden) item.carco.root.carco.playeritems.checkbutton.style.display = "none";
                    if (item.carco.root.carco.playeritems.solutionbutton&&!item.carco.root.carco.playeritems.solutionbutton.carco.confighidden) item.carco.root.carco.playeritems.solutionbutton.style.display = "inline-block";
                    if (item.carco.root.carco.playeritems.nextbutton&&!item.carco.root.carco.playeritems.nextbutton.carco.confighidden) item.carco.root.carco.playeritems.nextbutton.style.display = "inline-block";
                }
            };
        };

        if (item.carco.paramsdata.user.feedbacktype == "test"){

            removecheck();
            removesolution();
            removenext();
            removescorebar();

            item.carco.checkfunction = function(ev){
                if (item.carco.root.carco.paramsdata.system.usertype == "user") {
                    carco.functions.root.preloadlayer(item, "add")
                    if (item.carco.playeritems.preload_layer) item.carco.playeritems.preload_layer.style.opacity = 0.5
                };
                item.carco.customparams.feedbackon = "all";
                carco.functions.feedback.types.editor(item, undefined, ev);
                item.carco.game.process = 2;
                item.carco.returnscores = carco.functions.object.clone(item.carco.scores);
                item.carco.game.player();
                setTimeout(function() {
                    item.carco.endlayer.carco.setStyle({visibility: "visible"})
                    carco.functions.listeners.removeAllitemListeners(item);
                },100)
                if (!item.carco.game) item.carco.game = {};
                if (!item.carco.root.carco.intervals) item.carco.root.carco.intervals = {};
                if (item.carco.root.carco.intervals.feedbackwaitc) clearInterval(item.carco.root.carco.intervals.feedbackwaitc);
            };

            item.carco.nextfunction = function(ev){
                if (ev.target == item.carco.playeritems.endscreen_restart){
                    carco.functions.listeners.remove(item.carco.root.carco.playeritems.endscreen_restart, "mousedown", item.carco.nextfunction)
                    if (item.carco.playeritems.endscreen) item.carco.playeritems.endscreen.className = "drwmsg-endscreen"
                    if (item.carco.playeritems.blacklayer) item.carco.playeritems.blacklayer.className = "drwmsg-layer";
                    item.carco.reloadtrack(function() {
                        item.carco.removeAllChildren();
                        carco.functions.root.callback(item, false);
                    })
                }else{
                    item.carco.game.endscreen();
                    item.carco.score = {};
                    item.carco.scores = {};
                };
            };
            item.carco.solutionfunction = function(ev){
                if (item.carco.root.carco.paramsdata.system.usertype == "user") {
                    carco.functions.root.preloadlayer(item, "add")
                    if (item.carco.playeritems.preload_layer) item.carco.playeritems.preload_layer.style.opacity = 0.5
                };
                item.carco.game.solutionstart = true;
                item.carco.customparams.feedbackon = "all"
                carco.functions.feedback.types.editor(item);
                item.carco.game.process = 2
                item.carco.game.player()
                if (memogame == true){
                    item.carco.game.process = 2
                    item.carco.game.player()
                    item.carco.endlayer.carco.setStyle({visibility: "visible"});
                    carco.functions.listeners.removeAllitemListeners(item, false);
                };
                carco.functions.listeners.removeAllitemListeners(item, false);
                item.carco.returnscores = carco.functions.object.clone(item.carco.scores);

                if (!item.carco.game) item.carco.game = {};
                item.carco.root.carco.game.feedbacksolvisible = false;
                if (!item.carco.root.carco.intervals) item.carco.root.carco.intervals = {};
                if (item.carco.root.carco.intervals.feedbackwaitc) clearInterval(item.carco.root.carco.intervals.feedbackwaitc);
            };

            if (!item.carco.game) item.carco.game = {};
            if (!item.carco.game.process) item.carco.game.process = 0;
            var trueAllValues = item.carco.game.trueAllValues()
            if (item.carco.game.process>1&&trueAllValues == true && !item.carco.saveduserdata) {
                item.carco.game.solutionstart = true;
                item.carco.game.process = 2;
                item.carco.endlayer.carco.setStyle({visibility: "visible"});
                carco.functions.listeners.removeAllitemListeners(item);
            };
            if (memogame == true&&item.carco.game.process==1&&trueAllValues == true && !item.carco.saveduserdata) {
                item.carco.game.process = 2;
                item.carco.endlayer.carco.setStyle({visibility: "visible"});
                carco.functions.listeners.removeAllitemListeners(item);
            };

            if (item.carco.game.process == 2){
                removecheck();
                removesolution();
                addnext();
                addscorebar();
                if (item.carco.root.carco.playeritems.solutionbutton&&!item.carco.root.carco.playeritems.solutionbutton.carco.confighidden) item.carco.root.carco.playeritems.solutionbutton.style.display = "none";
                if (item.carco.root.carco.playeritems.nextbutton&&!item.carco.root.carco.playeritems.nextbutton.carco.confighidden) item.carco.root.carco.playeritems.nextbutton.style.display = "inline-block";
                if (memogame !== true) item.carco.game.process = 3;
            }

            if (item.carco.game.process == 1){
                addcheck();
                removesolution();
                removenext();
                if (item.carco.root.carco.playeritems.solutionbutton&&!item.carco.root.carco.playeritems.solutionbutton.carco.confighidden) item.carco.root.carco.playeritems.solutionbutton.style.display = "none";
                if (item.carco.root.carco.playeritems.nextbutton&&!item.carco.root.carco.playeritems.nextbutton.carco.confighidden) item.carco.root.carco.playeritems.nextbutton.style.display = "inline-block";
                if (memogame == true){
                    removecheck();
                    addsolution();
                    removenext();
                    if (item.carco.root.carco.playeritems.checkbutton&&!item.carco.root.carco.playeritems.checkbutton.carco.confighidden) item.carco.root.carco.playeritems.checkbutton.style.display = "none";
                    if (item.carco.root.carco.playeritems.solutionbutton&&!item.carco.root.carco.playeritems.solutionbutton.carco.confighidden) item.carco.root.carco.playeritems.solutionbutton.style.display = "inline-block";
                    if (item.carco.root.carco.playeritems.nextbutton&&!item.carco.root.carco.playeritems.nextbutton.carco.confighidden) item.carco.root.carco.playeritems.nextbutton.style.display = "inline-block";
                }
            };

            if (item.carco.game.process == 0){
                removecheck();
                removesolution();
                removenext();
                if (item.carco.root.carco.playeritems.solutionbutton&&!item.carco.root.carco.playeritems.solutionbutton.carco.confighidden) item.carco.root.carco.playeritems.solutionbutton.style.display = "none";
                if (item.carco.root.carco.playeritems.nextbutton&&!item.carco.root.carco.playeritems.nextbutton.carco.confighidden) item.carco.root.carco.playeritems.nextbutton.style.display = "inline-block";
                if (memogame == true){
                    removecheck();
                    removesolution();
                    removenext();
                    if (item.carco.root.carco.playeritems.checkbutton&&!item.carco.root.carco.playeritems.checkbutton.carco.confighidden) item.carco.root.carco.playeritems.checkbutton.style.display = "none";
                    if (item.carco.root.carco.playeritems.solutionbutton&&!item.carco.root.carco.playeritems.solutionbutton.carco.confighidden) item.carco.root.carco.playeritems.solutionbutton.style.display = "inline-block";
                    if (item.carco.root.carco.playeritems.nextbutton&&!item.carco.root.carco.playeritems.nextbutton.carco.confighidden) item.carco.root.carco.playeritems.nextbutton.style.display = "inline-block";
                }
            };
        }
    },
    scores: function(item, type){
        var allOnValues = item.carco.getChildren({children:"recursivechildren", equal:{type:"container", customparams:{values:{valueon:1}}}, type:"item"})
        if (!item.carco.score) item.carco.score = {};
        if (!item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack]) item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack] = {}
        var currenttrack = -1;
        if (!item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.originaltracks) item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.originaltracks = carco.functions.object.clone(item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.tracks);
        if (!item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.originaltracks.length) item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.originaltracks.length = item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.tracks.length
        for (var i = 0; i < item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.originaltracks.length; i++) {
            if (item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.originaltracks[i] == item.carco.root.carco.paramsdata.system.currenttrack) {
                currenttrack = i;
            };
        };
        item.carco.allscorearray = [];
        if (item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.allscore){
            if (item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.allscore!==""){
                var points = item.carco.root.carco.paramsdata.games[item.carco.root.carco.paramsdata.system.currentgame].params.allscore;
                points = points.toString()
                points = points.replace(/\n/g, ",");
                points = points.replace(/ /gi, "")
                points = points.replace(/,,/g, ",");
                points = points.replace(/,,/g, ",");
                points = $.parseJSON(points);
                item.carco.allscorearray = points;
            }else{
                item.carco.allscorearray = [];
            };
        };

        item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].allscore = 0;
        item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].userscore = 0;
        item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].uservalue = 0;
        item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].placevalue = 0;
        item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].readysvalue = 0;
        item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].userscore_withoutmultiplier = 0;

        for (var i = 0; i < allOnValues.length; i++) {
            if (allOnValues[i].carco.customparams&&allOnValues[i].carco.customparams.values&&allOnValues[i].carco.customparams.values.score){
                if (!isNaN(Number(allOnValues[i].carco.customparams.values.score))) item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].allscore = item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].allscore + Number(allOnValues[i].carco.customparams.values.score);
            };
            if (item.carco.allscorearray[currenttrack]) item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].allscore = item.carco.allscorearray[currenttrack];
            if (allOnValues[i].carco.customparams&&allOnValues[i].carco.customparams.values&&allOnValues[i].carco.customparams.values.score&&allOnValues[i].carco.game&&allOnValues[i].carco.game.value){
                if (!isNaN(Number(allOnValues[i].carco.customparams.values.score))) item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].userscore = item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].userscore + (Number(allOnValues[i].carco.customparams.values.score)*allOnValues[i].carco.game.value);
                item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].userscore_withoutmultiplier = item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].userscore_withoutmultiplier + (Number(allOnValues[i].carco.customparams.values.score)*allOnValues[i].carco.game.trueorfalse);
            };
            if (allOnValues[i].carco.customparams&&allOnValues[i].carco.customparams.values&&allOnValues[i].carco.game&&allOnValues[i].carco.game.value&&allOnValues[i].carco.game.trueorfalse){
                item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].uservalue = item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].uservalue + allOnValues[i].carco.game.trueorfalse;
            };
            if (allOnValues[i].carco.customparams&&allOnValues[i].carco.customparams.values&&allOnValues[i].carco.game&&allOnValues[i].carco.game.value&&allOnValues[i].carco.game.trueorfalse) {
                if (allOnValues[i].carco.customparams.gametype == "place" || allOnValues[i].carco.customparams.gametype == "placecontainer") {
                    item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].placevalue = item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].placevalue + allOnValues[i].carco.game.trueorfalse;
                };
            };
        };
        item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].userscore = Math.round(item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].userscore)

        if (item.carco.paramsdata.user.feedbacktype == "test"||item.carco.paramsdata.user.tempfeedbacktype == "test"){
            item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].userscore = item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].userscore/2;
            item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].allscore = item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].allscore/2
        };

        if (type !== "getResult"){
            if (item.carco.root.carco.playeritems.allscore) item.carco.root.carco.playeritems.allscore.innerHTML = item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].allscore;
            if (item.carco.root.carco.playeritems.userscore) item.carco.root.carco.playeritems.userscore.innerHTML = item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].userscore;
            item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].showedscore = item.carco.score[item.carco.root.carco.paramsdata.system.currenttrack].userscore;
        };
        item.carco.scores = {};
        item.carco.scores.allscore = 0;
        item.carco.scores.userscore = 0;
        item.carco.scores.scorepercent = 0;

        for (var i = 0; i < item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.tracks.length; i++) {
            var trackname = item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.tracks[i]
            if (item.carco.score[trackname]&&item.carco.score[trackname].allscore){
                item.carco.scores.allscore = item.carco.scores.allscore + item.carco.score[trackname].allscore;
            };
            if (item.carco.score[trackname]&&item.carco.score[trackname].userscore){
                item.carco.scores.userscore = item.carco.scores.userscore + item.carco.score[trackname].userscore;
            }
        };

        if (item.carco.scores.allscore !== 0){item.carco.scores.scorepercent = item.carco.scores.userscore/item.carco.scores.allscore*100}

    },
    endscreen: function(item){
        var percent = Math.round(item.carco.scores.scorepercent)
        if (item.carco.paramsdata.user.lang == "hu"){
            var outcome = "EREDMÉNY";
            var text1 = "ÖSSZESÍTETT";
            var text2 = "FELADAT";
            var text3 = "PONT";
            var text = "Gratulálunk! Remek munka!";
            if (percent<90){text = "Ügyes vagy, de még pontosítsd tudásod!"};
            if (percent<71){text = "Gyakorolj még! Fejleszd ismereteidet!"};
            if (percent<51){text = "Ne keseredj el, próbálkozz még és jobban fog sikerülni!"};
            if (percent<31){text = "Hát ez most nem sikerült! Még gyakorolnod kell!"};
            var restarttext = "Újra";
        }else{
            var outcome = "EVALUATION";
            var text1 = "SUMMA";
            var text2 = "TASK";
            var text3 = "SCORE";
            var text = "Congratulations! Great job!";
            if (percent<90){text = "Nice, but you still need some practice!"};
            if (percent<71){text = "You need more practice! Extend your knowledge!"};
            if (percent<51){text = "Don’t worry, try harder and you’ll be successful!"};
            if (percent<31){text = "Well, you failed this time! You need more practice!"};
            var restarttext = "Restart";
        }
        if (item.carco.root.carco.playeritems.endscreen) {
            if (item.carco.root.carco.playeritems.endscreen_outcome) item.carco.root.carco.playeritems.endscreen_outcome.innerHTML = outcome;
            if (item.carco.root.carco.playeritems.endscreen_percent) item.carco.root.carco.playeritems.endscreen_percent.innerHTML = "<div class='drwmsg_endscreen_left'>"+text1 + "</div><div class='drwmsg_endscreen_right'>" + percent+"%</div>";
            if (item.carco.root.carco.playeritems.endscreen_text) item.carco.root.carco.playeritems.endscreen_text.innerHTML = text;

            if (item.carco.root.carco.playeritems.endscreen_scores) {
                item.carco.root.carco.playeritems.endscreen_scores.innerHTML = ""
                var ii = 0;
                if (item.carco.root.carco.paramsdata.user.currenttrack&&!isNaN(Number(item.carco.root.carco.paramsdata.user.currenttrack))){
                    ii = Number(item.carco.root.carco.paramsdata.user.currenttrack)-1;
                };

                if (!ii) ii = 0;
                for (var x in item.carco.root.carco.score){
                    ii = ii + 1;
                    var itext = "<div class='drwmsg_endscreen_scorewor'><div class='drwmsg_endscreen_left'>"+ii+". "+text2+"</div><div class='drwmsg_endscreen_right'>"+item.carco.root.carco.score[x].userscore+"/"+item.carco.root.carco.score[x].allscore+" "+text3+"</div></div>"
                    item.carco.root.carco.playeritems.endscreen_scores.innerHTML = item.carco.root.carco.playeritems.endscreen_scores.innerHTML + itext;
                };
            };

            /*if (carco.functions.browser.IE() == 10&&carco.functions.isMobile.any()||carco.functions.browser.IE() == 11&&carco.functions.isMobile.IeMobile()){
             if (item.carco.root.carco.playeritems.endscreen_outcome) item.carco.root.carco.playeritems.endscreen_outcome.style.fontSize = "15px";
             if (item.carco.root.carco.playeritems.endscreen_percent) item.carco.root.carco.playeritems.endscreen_percent.style.fontSize = "30px";
             if (item.carco.root.carco.playeritems.endscreen_text) item.carco.root.carco.playeritems.endscreen_text.style.fontSize = "12px";
             }*/

            if (item.carco.root.carco.playeritems.endscreen_restart) {
                item.carco.root.carco.playeritems.endscreen_restart.innerHTML = restarttext;
                carco.functions.listeners.remove(item.carco.root.carco.playeritems.endscreen_restart, "mousedown", item.carco.nextfunction)
                carco.functions.listeners.add(item.carco.root.carco.playeritems.endscreen_restart, "mousedown", item.carco.nextfunction)
            };
            carco.functions.kiopembed.init(item.carco.root);
            if (item.carco.root.carco.paramsdata.user.feedbacktype == "practice"||item.carco.root.carco.paramsdata.user.feedbacktype == "test"&&!item.carco.root.carco.paramsdata.user.kiop){
                if (item.carco.root.carco.playeritems.blacklayer) item.carco.root.carco.playeritems.blacklayer.className = "drwmsg-layer drwmsg-layer_trans";
                item.carco.root.carco.playeritems.endscreen.className = "drwmsg-endscreen drwmsg-endtrans";
            };
        };
        carco.functions.kiopembed.get(item.carco.root);

        item.carco.endscreenresize = function() {
            var body_height = document.body.offsetHeight;
            if (item.carco.root.carco.playeritems.endscreen) {
                var player = item.carco.root.carco.playeritems.player
                item.carco.root.carco.playeritems.endscreen.style.width = player.offsetWidth / 100 * 80 + "px";
                var end_height = item.carco.root.carco.playeritems.endscreen.offsetHeight;
                var end_width = item.carco.root.carco.playeritems.endscreen.offsetWidth;
                item.carco.root.carco.playeritems.endscreen.style.marginTop = -item.carco.root.carco.playeritems.blacklayer.offsetHeight+10 +"px";
            };
        };

        item.carco.endscreenresize()

        carco.functions.listeners.remove(window, "resize", item.carco.endscreenresize)
        carco.functions.listeners.add(window, "resize", item.carco.endscreenresize)

    },
    playeritems: function(item) {
        if (item.carco.playeritems){
            for (var x in item.carco.playeritems){
                if (item.carco.playeritems[x]){
                    if (!item.carco.playeritems[x].carco) carco.container(item.carco.playeritems[x])
                    if (!item.carco.playeritems[x].carco.id) item.carco.playeritems[x].carco.id = x;
                }else{}
            };
        };
    },
    infoscreen: function(item){

        item.carco.infoclose = function(){
            item.carco.root.carco.playeritems.infoscreen.className = "drwmsg-endscreen";
            if (item.carco.root.carco.playeritems.blacklayer) item.carco.root.carco.playeritems.blacklayer.className = "drwmsg-layer";
            if (item.carco.root.carco.stopStudentsSound) item.carco.root.carco.stopStudentsSound();
        };

        item.carco.infoopen = function(ev){
            if (ev.target.carco){
                if (item.carco.tools) item.carco.tools.carco.setStyle({visibility:"hidden"})
                if (item.carco.sollayer) item.carco.sollayer.carco.setStyle({visibility:"hidden"})
                var id = ev.target.carco.id;
                var showtype = "students";
                if (id == "teachers_button"||id == "info_teachers_button") showtype = "teachers";
                if (item.carco.root.carco.playeritems.info_forstudents&&
                    item.carco.root.carco.playeritems.info_forteachers&&
                    item.carco.root.carco.playeritems.info_infostudents&&
                    item.carco.root.carco.playeritems.info_infoteachers){
                    var displays = ["block", "none"];
                    if (showtype == "teachers") displays = ["none", "block"];
                    if (showtype == "students"){
                        if (!item.carco.paramsdata.user.disableautoplaysounds&&item.carco.playStudentsSound) item.carco.playStudentsSound();
                    };
                    if (showtype == "teachers"){
                        if (item.carco.stopStudentsSound) item.carco.stopStudentsSound();
                    };
                    item.carco.root.carco.playeritems.info_forstudents.style.display = displays[0];
                    item.carco.root.carco.playeritems.info_infostudents.style.display = displays[0];
                    item.carco.root.carco.playeritems.info_forteachers.style.display = displays[1];
                    item.carco.root.carco.playeritems.info_infoteachers.style.display = displays[1];
                    if (displays[0] == "block") {
                        if (!item.carco.root.carco.studentsAudioAutoDisable()) item.carco.root.carco.playeritems["playerstudentaudio"].style.display = displays[0];
                    }else{
                        item.carco.root.carco.playeritems["playerstudentaudio"].style.display = displays[0];
                    };

                    if (carco.functions.browser.IE() == 10&&carco.functions.isMobile.any()||carco.functions.browser.IE() == 11&&carco.functions.isMobile.IeMobile()){
                        item.carco.root.carco.playeritems.info_forstudents.style.fontSize = "10px";
                        item.carco.root.carco.playeritems.info_infostudents.style.fontSize = "10px";
                        item.carco.root.carco.playeritems.info_forteachers.style.fontSize = "10px";
                        item.carco.root.carco.playeritems.info_infoteachers.style.fontSize = "10px";
                    }

                    if (item.carco.root.carco.playeritems.info_teachers_button) {
                        if (!item.carco.root.carco.playeritems.info_teachers_button.carco.tempclassname) item.carco.root.carco.playeritems.info_teachers_button.carco.tempclassname = item.carco.root.carco.playeritems.info_teachers_button.className;
                        if (showtype == "teachers"){
                            item.carco.root.carco.playeritems.info_teachers_button.className = item.carco.root.carco.playeritems.info_teachers_button.carco.tempclassname + " drwmsg-bton_active"
                        }else{
                            item.carco.root.carco.playeritems.info_teachers_button.className = item.carco.root.carco.playeritems.info_teachers_button.carco.tempclassname;
                        };
                    };

                    if (item.carco.root.carco.playeritems.info_students_button) {
                        if (!item.carco.root.carco.playeritems.info_students_button.carco.tempclassname) item.carco.root.carco.playeritems.info_students_button.carco.tempclassname = item.carco.root.carco.playeritems.info_students_button.className;
                        if (showtype == "students"){
                            item.carco.root.carco.playeritems.info_students_button.className = item.carco.root.carco.playeritems.info_students_button.carco.tempclassname + " drwmsg-bton_active"
                        }else{
                            item.carco.root.carco.playeritems.info_students_button.className = item.carco.root.carco.playeritems.info_students_button.carco.tempclassname;
                        };
                    };

                };
                if (item.carco.root.carco.playeritems.blacklayer) item.carco.root.carco.playeritems.blacklayer.className = "drwmsg-layer drwmsg-layer_trans";
                item.carco.root.carco.playeritems.infoscreen.className = "drwmsg-endscreen drwmsg-endtrans";
                if (item.carco.inforesize) item.carco.inforesize()
            };
        };

        if (item.carco.inforesize) carco.functions.listeners.remove(window, "resize", item.carco.inforesize);

        item.carco.inforesize = function() {
            var body_height = document.body.offsetHeight;
            var body_width = document.body.offsetWidth;
            var player = item.carco.root.carco.playeritems.player.children[0]
            if (player) var body_height = player.offsetHeight;
            if (player) var body_width = player.offsetWidth;
            var scrollLeft = carco.functions.position.scrollLeft()
            var scrollTop = carco.functions.position.scrollTop()

            if (item.carco.root.carco.playeritems.info_button&&item.carco.root.carco.playeritems.teachers_button&&item.carco.root.carco.playeritems.students_button){
                if (body_width<900){
                    item.carco.root.carco.playeritems.info_button.style.display = "block"
                    item.carco.root.carco.playeritems.teachers_button.style.display = "none"
                    item.carco.root.carco.playeritems.students_button.style.display = "none"
                }else{
                    item.carco.root.carco.playeritems.info_button.style.display = "none"
                    item.carco.root.carco.playeritems.teachers_button.style.display = "block"
                    item.carco.root.carco.playeritems.students_button.style.display = "block"
                }
            };
            if (item.carco.root.carco.playeritems.blacklayer&&item.carco.root.carco.playeritems.player) {
                var player = item.carco.root.carco.playeritems.player;
                var itembounds = carco.functions.position.getBoundingClientRect(player);
                item.carco.root.carco.playeritems.blacklayer.style.width = player.offsetWidth + "px";
                if (player.offsetHeight>=body_height) item.carco.root.carco.playeritems.blacklayer.style.height = player.offsetHeight + "px";
                if (body_height>player.offsetHeight) item.carco.root.carco.playeritems.blacklayer.style.height = body_height + "px";
                item.carco.root.carco.playeritems.blacklayer.style.marginTop = -body_height +"px";
            };

            item.carco.root.carco.playeritems.infoscreen.style.width = player.offsetWidth / 100 * 80 + "px";
            var end_height = item.carco.root.carco.playeritems.infoscreen.offsetHeight;
            var end_width = item.carco.root.carco.playeritems.infoscreen.offsetWidth;
            item.carco.root.carco.playeritems.infoscreen.style.marginTop = -item.carco.root.carco.playeritems.blacklayer.offsetHeight+20 +"px";

        };

        if (item.carco.root.carco.playeritems.infoscreen) {

            if (item.carco.root.carco.playeritems.info_close_button) {
                carco.functions.listeners.remove(item.carco.root.carco.playeritems.info_close_button, "mousedown", item.carco.infoclose)
                carco.functions.listeners.add(item.carco.root.carco.playeritems.info_close_button, "mousedown", item.carco.infoclose)
            };

            if (item.carco.root.carco.playeritems.info_students_button) {
                carco.functions.listeners.remove(item.carco.root.carco.playeritems.info_students_button, "mousedown", item.carco.infoopen)
                carco.functions.listeners.add(item.carco.root.carco.playeritems.info_students_button, "mousedown", item.carco.infoopen)
            };

            if (item.carco.root.carco.playeritems.students_button) {
                carco.functions.listeners.remove(item.carco.root.carco.playeritems.students_button, "mousedown", item.carco.infoopen)
                carco.functions.listeners.add(item.carco.root.carco.playeritems.students_button, "mousedown", item.carco.infoopen)
            };

            if (item.carco.root.carco.playeritems.info_teachers_button) {
                carco.functions.listeners.remove(item.carco.root.carco.playeritems.info_teachers_button, "mousedown", item.carco.infoopen)
                carco.functions.listeners.add(item.carco.root.carco.playeritems.info_teachers_button, "mousedown", item.carco.infoopen)
            };

            if (item.carco.root.carco.playeritems.teachers_button) {
                carco.functions.listeners.remove(item.carco.root.carco.playeritems.teachers_button, "mousedown", item.carco.infoopen)
                carco.functions.listeners.add(item.carco.root.carco.playeritems.teachers_button, "mousedown", item.carco.infoopen)
            };

            if (item.carco.root.carco.playeritems.info_button) {
                carco.functions.listeners.remove(item.carco.root.carco.playeritems.info_button, "mousedown", item.carco.infoopen)
                carco.functions.listeners.add(item.carco.root.carco.playeritems.info_button, "mousedown", item.carco.infoopen)
            };

            item.carco.inforesize();
            carco.functions.listeners.add(window, "resize", item.carco.inforesize);

            item.carco.root.carco.playeritems.infoscreenreset = function() {
                if (item.carco.root.carco.playeritems.info_close_button) {
                    carco.functions.listeners.remove(item.carco.root.carco.playeritems.info_close_button, "mousedown", item.carco.infoclose)
                };

                if (item.carco.root.carco.playeritems.info_students_button) {
                    carco.functions.listeners.remove(item.carco.root.carco.playeritems.info_students_button, "mousedown", item.carco.infoopen)
                };

                if (item.carco.root.carco.playeritems.students_button) {
                    carco.functions.listeners.remove(item.carco.root.carco.playeritems.students_button, "mousedown", item.carco.infoopen)
                };

                if (item.carco.root.carco.playeritems.info_teachers_button) {
                    carco.functions.listeners.remove(item.carco.root.carco.playeritems.info_teachers_button, "mousedown", item.carco.infoopen)
                };

                if (item.carco.root.carco.playeritems.teachers_button) {
                    carco.functions.listeners.remove(item.carco.root.carco.playeritems.teachers_button, "mousedown", item.carco.infoopen)
                };

                if (item.carco.root.carco.playeritems.info_button) {
                    carco.functions.listeners.remove(item.carco.root.carco.playeritems.info_button, "mousedown", item.carco.infoopen)
                };
            };

        };

    },
    playertitle: function(item) {

        if (item.carco.playertitleresize) carco.functions.listeners.remove(window, "resize", item.carco.playertitleresize);

        item.carco.playertitleresize = function() {
            var body_width = item.offsetWidth;
            if (item.carco.root.carco.playeritems.gametitle_box&&item.carco.root.carco.playeritems.gametitle) {
                titlelength = item.carco.root.carco.playeritems.gametitle.innerHTML.length;

                //var size = 15
                //if (body_width<1200){size = 12}

                var size = 15
                if (titlelength > 101&&body_width<1200) size = 14
                if (titlelength > 131&&body_width<1200) size = 13
                if (titlelength > 151&&body_width<1200) size = 12

                item.carco.root.carco.playeritems.gametitle.style.marginTop = 0;
                item.carco.root.carco.playeritems.gametitle_box.style.width = body_width-345-20+"px";
                item.carco.root.carco.playeritems.gametitle.parentElement.style.width = body_width-345-20+"px";
                item.carco.root.carco.playeritems.gametitle.style.fontSize = size+"px";
            };
            if (item.carco.root.carco.playeritems.playertitle) {
                var size = 19
                if (body_width<1200){size = 17}
                var titlelength = 0
                if (item.carco.root.carco.playeritems.playertitle.innerHTML&&item.carco.root.carco.playeritems.playertitle.innerHTML.length) titlelength = item.carco.root.carco.playeritems.playertitle.innerHTML.length
                if (titlelength > 35&&body_width<800) size = 15
                if (titlelength > 45&&body_width<1050) size = 15
                if (titlelength > 40&&body_width<800) size = 13
                if (titlelength > 45&&body_width<1000) size = 13
                if (titlelength > 50&&body_width<760) size = 11
                if (titlelength > 45&&body_width<950) size = 11
                item.carco.root.carco.playeritems.playertitle.style.fontSize = size+"px";
            };
        };

        item.carco.playertitleresize();
        carco.functions.listeners.add(window, "resize", item.carco.playertitleresize);
    },
    tracksbar: function(item, params){
        var howmanytrack = 0;
        var howmanydone = 0;

        if (params&&params.howmanytrack&&params.howmanydone){
            howmanytrack = params.howmanytrack
            howmanydone = params.howmanydone
        }else{
            if (item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.tracks){
                if (typeof item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.tracks == "string"){
                    item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.tracks = [item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.tracks];
                };
                howmanytrack = item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.tracks.length;
            };
            for (var i = 0; i < item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.tracks.length; i++) {
                if (item.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.tracks[i] == item.carco.paramsdata.system.currenttrack) {
                    howmanydone = i+1;
                };
            };
        }

        if (item.carco.root.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.maxtrack&&
            !isNaN(item.carco.root.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.maxtrack)&&
            item.carco.root.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.maxtrack!==0&&
            howmanytrack>item.carco.root.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.maxtrack){
            howmanytrack = item.carco.root.carco.paramsdata.games[item.carco.paramsdata.system.currentgame].params.maxtrack;
        };

        if (item.carco.root.carco.playeritems.tracksbar) {
            item.carco.root.carco.playeritems.tracksbar.innerHTML = "";
            item.carco.root.carco.playeritems.tracksbaritems = {};
            for (var i = 0; i < howmanytrack; i++) {
                item.carco.root.carco.playeritems.tracksbaritems[i] = carco.functions.children.createHTML({type:"li", attr:{class:"nothing"}});
                item.carco.root.carco.playeritems.tracksbar.appendChild(item.carco.root.carco.playeritems.tracksbaritems[i]);
                item.carco.root.carco.playeritems.tracksbaritems[i+"inner"] = carco.functions.children.createHTML({type:"div", attr:{class:"inner"}});
                item.carco.root.carco.playeritems.tracksbaritems[i].appendChild(item.carco.root.carco.playeritems.tracksbaritems[i+"inner"]);
            };

            for (var i = 0; i < howmanydone; i++) {
                if (item.carco.root.carco.playeritems.tracksbaritems[i]) item.carco.root.carco.playeritems.tracksbaritems[i].className = "done";
            };

        };
        return howmanydone;
    },
    dragduplicate: function(item) {
        if (!item.carco.customparams) item.carco.customparams = {};
        if (item.carco.root.carco.paramsdata.system.usertype == "user"){

            if (item.carco.customparams.dragduplicate == "once"){
                var newitem = item.carco.duplicate(false, "sol")

                newitem.carco.game.duplicateddrag = true;
                newitem.carco.game.originalitem = item;

                item.carco.customparams.dragduplicate = false;
                if (item.style.zIndex !== 5000000) item.style.zIndex = 5000000;
                if (!item.carco.customparams.duplicateautostyle) item.carco.customparams.duplicateautostyle = "none";
                if (item.carco.customparams.duplicateautostyle&&carco.functions.autostyle[item.carco.customparams.duplicateautostyle]){
                    var image = newitem.carco.getChildren({children:"recursivechildren", equal:{type:"image"}, type:"item"})[0];
                    if (image) image.carco.duplicatedonce = true;
                    setTimeout(function() {
                        carco.functions.autostyle[item.carco.customparams.duplicateautostyle](newitem);
                    },300)
                };
                if (carco.functions.game.searchActions(item, "dragduplicate")) {
                    carco.functions.game.searchActions(item, "dragduplicate")(newitem);
                };
            };

            if (item.carco.customparams.dragduplicate == "unlimited"&&!item.carco.game.startdragged){
                if (!item.carco.game.inners) item.carco.game.inners = [];
                if (item.carco.game.inners.length == 0){
                    var places = item.carco.customparams.placeids;
                    var targetplaces = [];
                    var originalitem = item;
                    if (item.carco.game&&item.carco.game.originalitem) originalitem = item.carco.game.originalitem;
                    var drags = item.carco.root.carco.getChildren({equal:{customparams:{gametype:"drag"}}, type:"item"});
                    var duplicateddragsonoriginalplace = [];
                    for (var i = 0; i < drags.length; i++) {
                        if (drags[i].carco.game&&drags[i].carco.game.originalitem == originalitem){
                            if (!drags[i].carco.game.inners||!drags[i].carco.game.inners[0]) {
                                duplicateddragsonoriginalplace.push(drags[i])
                            };
                        };
                    };
                    if (!duplicateddragsonoriginalplace[1]){
                        if (places){
                            if (typeof places == 'string'){
                                var place = item.carco.root.carco.recursivechildren[places];
                                if (place&&place.carco.customparams.values.valueon) targetplaces.push(place);
                                if (place&&place.carco.parent&&place.carco.parent.carco.customparams.gametype == "placecontainer"){
                                    targetplaces.push(place.carco.parent);
                                };
                            }else{
                                for (var i = 0; i < places.length; i++) {
                                    var place = item.carco.root.carco.recursivechildren[places[i]];
                                    if (place&&place.carco.customparams.values&&place.carco.customparams.values.valueon) targetplaces.push(place);
                                    if (place&&place.carco.parent&&place.carco.parent.carco.customparams.gametype == "placecontainer"){
                                        targetplaces.push(place.carco.parent);
                                    };
                                };
                            };
                        };
                        targetplaces = carco.functions.array.uniq(targetplaces);
                        setTimeout(function(){
                            var newitem = item.carco.duplicate();
                            newitem.carco.game.setOriginal();
                            newitem.carco.game.duplicateddrag = true;
                            if (!item.carco.game.originalitem) item.carco.game.originalitem = item;
                            item.carco.game.originalitem.carco.game.lastduplicated = newitem;
                            if (!item.carco.game.originalitem.carco.game.duplicateditems) item.carco.game.originalitem.carco.game.duplicateditems = [];
                            item.carco.game.originalitem.carco.game.duplicateditems.push(newitem);
                            if (item.carco.game.originalitem) {
                                newitem.carco.game.originalitem = item.carco.game.originalitem;
                            }else{
                                newitem.carco.game.originalitem = item;
                            };
                            for (var i = 0; i < targetplaces.length; i++) {
                                if (targetplaces[i].carco.game&&targetplaces[i].carco.game.values&&targetplaces[i].carco.game.values.items){
                                    var valueitems = targetplaces[i].carco.game.values.items;
                                    var allvalueitems = targetplaces[i].carco.game.values.allitemsplay;
                                    for (var v = 0; v < valueitems.length; v++) {
                                        if (typeof valueitems[v] == "string"){
                                            if (valueitems[v] == item) {
                                                valueitems.push(newitem);
                                                allvalueitems.push(newitem);
                                            };
                                        }else{
                                            for (var va = 0; va < valueitems[v].length; va++) {
                                                if (valueitems[v][va] == item) {
                                                    valueitems[v].push(newitem);
                                                    allvalueitems.push(newitem);
                                                };
                                            };
                                        };
                                    };
                                    allvalueitems = carco.functions.array.uniq(allvalueitems);
                                    targetplaces[i].carco.game.values.allitemsplay = allvalueitems;
                                };
                            };

                            if (!item.carco.customparams.duplicateautostyle) item.carco.customparams.duplicateautostyle = "none";
                            if (item.carco.customparams.duplicateautostyle&&carco.functions.autostyle[item.carco.customparams.duplicateautostyle]){
                                setTimeout(function() {carco.functions.autostyle[item.carco.customparams.duplicateautostyle](newitem);},300)
                            };
                            if (carco.functions.game.searchActions(item, "dragduplicate")) {
                                carco.functions.game.searchActions(item, "dragduplicate")(newitem);
                            };
                        },200)
                    };
                };
            };
        };
    },
    dropdragduplicate: function(item, newdrag){
        var inners = item.carco.game.inners;
        var drop = false;
        if (inners) {
            for (var i = 0; i < inners.length; i++) {
                if (inners[i].carco.game.originalitem == newdrag.carco.game.originalitem) drop = true;
            };
        };
        if (drop) {
            return true;
        }else{
            return false;
        };
    },
    dropdragduplicatetext: function(item, newdrag){
        var inners = item.carco.game.inners;
        var newtext = newdrag.carco.getChildren({equal:{type:"text"}})[0];
        var drop = false;
        if (inners&&newtext) {
            for (var i = 0; i < inners.length; i++) {
                var innerstext = inners[i].carco.getChildren({equal:{type:"text"}})[0];
                if (innerstext&&innerstext.carco.customparams.innerHTML == newtext.carco.customparams.innerHTML) drop = true;
            };
        };
        if (drop) {
            return true;
        }else{
            return false;
        };
    },
    removeMoreDuplicate: function(item) {
        if (item.carco.root.carco.paramsdata.system.usertype == "user"){
            var originalitem = item;
            if (item.carco.game&&item.carco.game.originalitem) originalitem = item.carco.game.originalitem;
            var drags = item.carco.root.carco.getChildren({equal:{customparams:{gametype:"drag"}}, type:"item"});
            var originalitemonplace = false
            var duplicateddragsonoriginalplace = [];
            for (var i = 0; i < drags.length; i++) {
                if (drags[i].carco.game&&drags[i].carco.game.originalitem == originalitem){
                    if (!drags[i].carco.game.inners||!drags[i].carco.game.inners[0]) {
                        if (drags[i]==originalitem) {
                            originalitemonplace == true;
                        }else{
                            duplicateddragsonoriginalplace.push(drags[i])
                        };
                    };
                };
            };
            var stayitem = false;
            if (!originalitemonplace) stayitem = item;
            for (var i = 0; i < duplicateddragsonoriginalplace.length; i++) {
                if (duplicateddragsonoriginalplace[i] !== stayitem){
                    duplicateddragsonoriginalplace[i].carco.parent.carco.removeChild(duplicateddragsonoriginalplace[i]);
                };
            };
        };
    },
    coordinate: function(item, type) {
        if (item.carco.type == "image"){
            var canvas = item;
        }else{
            var canvas = item.carco.getChildren({children:"recursivechildren", equal:{type:"image"}, type:"item"})[0];
        };
        function getCoordinate(stage){

            var background = stage.children[0];
            for (var i = 0; i < stage.children.length; i++) {
                if (i !== 0) stage.removeChild(stage.children[i])
            };

            if (canvas.carco.coordinate){
                for (var x in canvas.carco.coordinate) {
                    stage.removeChild(canvas.carco.coordinate[x])
                };
            };

            if (canvas.carco.coordinate&&canvas.carco.coordinate.xlines){
                for (var x in canvas.carco.coordinate.xlines) {
                    stage.removeChild(canvas.carco.coordinate.xlines[x])
                    stage.removeChild(canvas.carco.coordinate.xtext[x])
                };
            };

            if (canvas.carco.coordinate&&canvas.carco.coordinate.ylines){
                for (var x in canvas.carco.coordinate.ylines) {
                    stage.removeChild(canvas.carco.coordinate.ylines[x])
                    stage.removeChild(canvas.carco.coordinate.ytext[x])
                };
            };

            if (canvas.carco.coordinate&&canvas.carco.coordinate.points){
                for (var i = 0; i < canvas.carco.coordinate.points.length; i++) {
                    stage.removeChild(canvas.carco.coordinate.points[i]);
                    stage.removeChild(canvas.carco.coordinate.pointsname[i]);
                };
            };

            if (canvas.carco.coordinate&&canvas.carco.coordinate.connectlines){
                for (var i = 0; i < canvas.carco.coordinate.connectlines.length; i++) {
                    stage.removeChild(canvas.carco.coordinate.connectlines[i]);
                };
            };

            if (!item.carco.customparams.xorigo) item.carco.customparams.xorigo = 0;
            if (!item.carco.customparams.yorigo) item.carco.customparams.yorigo = 0;
            if (!item.carco.originalcustomparams.xorigo) item.carco.originalcustomparams.xorigo = item.carco.customparams.xorigo;
            if (!item.carco.originalcustomparams.yorigo) item.carco.originalcustomparams.yorigo = item.carco.customparams.yorigo;
            if (!item.carco.customparams.widthorigo) item.carco.customparams.widthorigo = 5;
            if (!item.carco.originalcustomparams.widthorigo) item.carco.originalcustomparams.widthorigo = item.carco.customparams.widthorigo;
            if (!item.carco.customparams.widthlines) item.carco.customparams.widthlines = 5;
            if (!item.carco.originalcustomparams.widthlines) item.carco.originalcustomparams.widthlines = item.carco.customparams.widthlines;
            if (!item.carco.customparams.unitypx) item.carco.customparams.unitypx = 100;
            if (!item.carco.originalcustomparams.unitypx) item.carco.originalcustomparams.unitypx = item.carco.customparams.unitypx;
            if (!item.carco.customparams.linescolor) item.carco.customparams.linescolor = "rgba(0,0,0,1)";
            if (!item.carco.originalcustomparams.linescolor) item.carco.originalcustomparams.linescolor = item.carco.customparams.linescolor;
            if (!item.carco.customparams.xcolor) item.carco.customparams.xcolor = "rgba(0,0,0,1)";
            if (!item.carco.originalcustomparams.xcolor) item.carco.originalcustomparams.xcolor = item.carco.customparams.xcolor;
            if (!item.carco.customparams.points) item.carco.customparams.points = "";
            if (!item.carco.originalcustomparams.points) item.carco.originalcustomparams.points = item.carco.customparams.points;
            if (!item.carco.customparams.pointcolor) item.carco.customparams.pointcolor = "rgba(0,0,0,1)";
            if (!item.carco.originalcustomparams.pointcolor) item.carco.originalcustomparams.pointcolor = item.carco.customparams.pointcolor;
            if (!item.carco.customparams.widthpoint) item.carco.customparams.widthpoint = 20;
            if (!item.carco.originalcustomparams.widthpoint) item.carco.originalcustomparams.widthpoint = item.carco.customparams.widthpoint;
            if (!item.carco.game.pluspoints) item.carco.game.pluspoints = [];
            if (!item.carco.customparams.connectlines) item.carco.customparams.connectlines = "";
            if (!item.carco.originalcustomparams.connectlines) item.carco.originalcustomparams.connectlines = item.carco.customparams.connectlines;
            if (!item.carco.customparams.connectlinecolor) item.carco.customparams.connectlinecolor = "rgba(0,0,0,1)";
            if (!item.carco.originalcustomparams.connectlinecolor) item.carco.originalcustomparams.connectlinecolor = item.carco.customparams.connectlinecolor;
            if (!item.carco.customparams.widthconnectlines) item.carco.customparams.widthconnectlines = 5;
            if (!item.carco.originalcustomparams.widthconnectlines) item.carco.originalcustomparams.widthconnectlines = item.carco.customparams.widthconnectlines;
            if (!item.carco.customparams.axisdashlen) item.carco.customparams.axisdashlen = 0;
            if (!item.carco.originalcustomparams.axisdashlen) item.carco.originalcustomparams.axisdashlen = item.carco.customparams.axisdashlen;
            if (!item.carco.customparams.linesdashlen) item.carco.customparams.linesdashlen = 0;
            if (!item.carco.originalcustomparams.linesdashlen) item.carco.originalcustomparams.linesdashlen = item.carco.customparams.linesdashlen;
            if (!item.carco.customparams.connectlinesdashlen) item.carco.customparams.connectlinesdashlen = 0;
            if (!item.carco.originalcustomparams.connectlinesdashlen) item.carco.originalcustomparams.connectlinesdashlen = item.carco.customparams.connectlinesdashlen;
            if (!item.carco.customparams.cnumbercolor) item.carco.customparams.cnumbercolor = "rgba(0,0,0,0)";
            if (!item.carco.originalcustomparams.cnumbercolor) item.carco.originalcustomparams.cnumbercolor = item.carco.customparams.cnumbercolor;
            if (!item.carco.customparams.cnumbersize) item.carco.customparams.cnumbersize = 50;
            if (!item.carco.originalcustomparams.cnumbersize) item.carco.originalcustomparams.cnumbersize = item.carco.customparams.cnumbersize;
            if (!item.carco.customparams.cnamesize) item.carco.customparams.cnamesize = 50;
            if (!item.carco.originalcustomparams.cnamesize) item.carco.originalcustomparams.cnamesize = item.carco.customparams.cnamesize;

            canvas.carco.coordinate = {};
            function addLine(endx, endy, width, color, dashlen) {
                var g = new carco.createjs.Graphics();
                g.setStrokeStyle(width)
                g.beginStroke(color);
                if (dashlen&&!isNaN(dashlen)&&Number(dashlen) > 0)   {
                    g.dashedLineTo(0, 0, endx, endy, dashlen);
                }else{
                    g.moveTo(0,0);
                    g.lineTo(endx, endy);
                };
                g.endStroke();
                var shape = new carco.createjs.Shape(g);
                if (endx == 0){
                    shape.width = width;
                    shape.height = endy;
                }
                if (endy == 0){
                    shape.width = endx;
                    shape.height = width;
                };
                return shape;
            };
            function addShapeLine(width, height, color, dashlen) {
                var g = new carco.createjs.Graphics();
                g.beginFill(color);
                g.drawRect(0,0,width, height)
                g.endFill();
                var shape = new carco.createjs.Shape(g);
                shape.width = width;
                shape.height = height;
                return shape;
            };
            function addConnectLines(startx, starty, endx, endy, width, color, dashlen) {
                var g = new carco.createjs.Graphics();
                g.setStrokeStyle(width)
                g.beginStroke(color);
                if (dashlen&&!isNaN(dashlen)&&Number(dashlen) > 0)   {
                    g.dashedLineTo(startx, starty, endx, endy, dashlen);
                }else{
                    g.moveTo(startx,starty);
                    g.lineTo(endx, endy);
                };
                g.endStroke();
                var shape = new carco.createjs.Shape(g);
                return shape;
            };
            function addCircle(width, color) {
                var g = new carco.createjs.Graphics();
                g.beginFill(color);
                g.drawCircle(0,0,width);
                var shape = new carco.createjs.Shape(g);
                shape.width = width;
                shape.height = width;
                return shape;
            };
            function addText(text, height, color) {
                var fs = "bold" + " " + height + "px" + " " + "Arial";
                var text = new carco.createjs.Text(text, fs, color);
                text.width = text.getMeasuredWidth()
                text.height = height;
                return text;
            };

            var widthlines = item.carco.customparams.widthlines;
            var widthorigo = item.carco.customparams.widthorigo;
            var axisdashlen = item.carco.customparams.axisdashlen*item.carco.scale.x*item.carco.root.carco.scale.X;;
            canvas.carco.coordinate.x = addLine(item.carco.size.realOffsetWidth, 0, widthorigo, item.carco.customparams.xcolor, axisdashlen);
            canvas.carco.coordinate.y = addLine(0, item.carco.size.realOffsetHeight, widthorigo, item.carco.customparams.xcolor, axisdashlen);

            var unitypx = item.carco.customparams.unitypx;
            var howmanyxlines = item.carco.size.height/unitypx+3;
            var howmanyylines = item.carco.size.width/unitypx+3;

            var origox = item.carco.customparams.xorigo;
            var origoy = item.carco.customparams.yorigo;

            var startynumber = Math.floor(howmanyylines-2-(item.carco.size.width - origox)/unitypx);
            var startxnumber = Math.floor(howmanyxlines-2-(item.carco.size.height - origoy)/unitypx);

            canvas.carco.coordinate.xlines = {};
            canvas.carco.coordinate.xtext = {};
            canvas.carco.coordinate.ylines = {};
            canvas.carco.coordinate.ytext = {};
            var xlineoff = false;
            var ylineoff = false;

            var linesdashlen = item.carco.customparams.linesdashlen*item.carco.scale.x*item.carco.root.carco.scale.X;
            for (var i = 0; i < howmanyxlines; i++) {
                canvas.carco.coordinate.xlines[i] = addLine(item.carco.size.realOffsetWidth, 0, widthlines, item.carco.customparams.linescolor, linesdashlen);
                var numbercolor = item.carco.customparams.cnumbercolor;
                var numbersize = item.carco.originalcustomparams.cnumbersize;
                if ((i-startxnumber)*-1 == 0) numbercolor = "rgba(0,0,0,0)";
                canvas.carco.coordinate.xtext[i] = addText((i-startxnumber)*-1, numbersize, numbercolor);
                if ((i-startxnumber)*-1 == 0) xlineoff = i
            };
            for (var i = 0; i < howmanyylines; i++) {
                canvas.carco.coordinate.ylines[i] = addLine(0, item.carco.size.realOffsetHeight, widthlines, item.carco.customparams.linescolor, linesdashlen);
                var numbercolor = item.carco.customparams.cnumbercolor;
                var numbersize = item.carco.originalcustomparams.cnumbersize;
                if ((i-startynumber) == 0) numbercolor = "rgba(0,0,0,0)";
                canvas.carco.coordinate.ytext[i] = addText((i-startynumber), numbersize, numbercolor);
                if ((i-startynumber)*-1 == 0) ylineoff = i
            };

            canvas.carco.coordinate.points = [];
            canvas.carco.coordinate.pointsname = [];
            var points = item.carco.customparams.points;

            if (points&&points !== ""){
                points = points.toString()
                points = points.replace(/\n/g, ",");
                points = points.replace(/ /gi, "")
                points = points.replace(/,,/g, ",");
                points = points.replace(/,,/g, ",");
                points = $.parseJSON(points);
            };

            if (!points&&points == "") points = [];
            if (canvas.carco.coordinateChecked&&item.carco.root.carco.saveduserdata||
                canvas.carco.coordinateChecked&&item.carco.root.carco.wassaveduserdata) {
                type = "check";
                item.carco.root.carco.wassaveduserdata = undefined;
            };
            if (type=="check"&&item.carco.game.solution) {
                var solitems = item.carco.game.solution.points;
            }else{
                var solitems = false;
            };

            var miny = (Math.round(howmanyxlines)-xlineoff)*-1
            var maxy = ((Math.round(howmanyxlines)-xlineoff) - Math.round(howmanyxlines))*-1

            var maxx = Math.round(howmanyylines)-ylineoff
            var minx = maxx - Math.round(howmanyylines)

            var shiftmaxpoint = 3

            minx = minx - shiftmaxpoint;
            miny = miny - shiftmaxpoint;
            maxx = maxx + shiftmaxpoint;
            maxy = maxy + shiftmaxpoint;

            if (points){
                for (var i = 0; i < item.carco.game.pluspoints.length; i++) {
                    if (item.carco.game.pluspoints[i]&&
                        !isNaN(item.carco.game.pluspoints[i][0])&&
                        !isNaN(item.carco.game.pluspoints[i][1])&&
                        item.carco.game.pluspoints[i][0]<maxx&&
                        item.carco.game.pluspoints[i][1]<maxy&&
                        item.carco.game.pluspoints[i][0]>minx&&
                        item.carco.game.pluspoints[i][1]>miny){
                        points[i] = carco.functions.object.clone(item.carco.game.pluspoints[i]);
                        if (type == "check"){
                            if (!solitems[i]){
                                points[i][3] = "#4ba849";
                            }else{
                                points[i][3] = "#e12e2a";
                            };
                        };
                    };
                };

                var originalpointslength = points.length;
                var solsdata = [];
                var solsnumber = 0;
                if (item.carco.root.carco.customparams.feedbackon == "all"&&item.carco.game.solution&&typeof item.carco.game.solution.points == "object") {
                    for (var i = 0; i < item.carco.game.solution.points.length; i++) {
                        if (item.carco.game.solution.points[i]) {
                            var name = "";
                            var color = "#4ba849"
                            if (item.carco.game.solution.points[i][2]) name = item.carco.game.solution.points[i][2];
                            if (item.carco.game.solution.points[i][3]) color = item.carco.game.solution.points[i][3];
                            if (item.carco.game.solution.points[i][4]) width = item.carco.game.solution.points[i][4];
                            points.push([item.carco.game.solution.points[i][0],item.carco.game.solution.points[i][1], name, color, width, "sol"])
                            solsdata[i] = originalpointslength+solsnumber;
                            solsnumber = solsnumber+1;
                        }
                    };
                };

                item.carco.game.coordinates = [];

                if (points&&points.length){
                    item.carco.game.pointsarray = points;
                    for (var i = 0; i < points.length; i++) {
                        var color = item.carco.customparams.pointcolor;
                        var width = item.carco.customparams.widthpoint;
                        var namesize = item.carco.customparams.cnamesize
                        var name = false;
                        if (points[i]){
                            if (points[i][3]) color = points[i][3];
                            if (points[i][4]) width = points[i][4];
                            if (points[i][2]) name = points[i][2];
                            if (!points[i][0]&&points[i][0]!==0&&!points[i][1]&&points[i][1]!==0) width = 0.001;
                            canvas.carco.coordinate.points[i] = addCircle(width, color);
                            canvas.carco.coordinate.points[i].type = points[i][5]
                            canvas.carco.coordinate.points[i].color = points[i][3]
                            item.carco.game.coordinates[i] = [points[i][0], points[i][1]];
                            if (!points[i][0]&&points[i][0]!==0&&!points[i][1]&&points[i][1]!==0) color = "rgba(0,0,0,0)";
                            if (name) {
                                if (name[0]){
                                    var endname = name[0] +"("+points[i][0]+";"+points[i][1]+")";
                                    if (name[1]==1) endname = name[0];
                                    if (name[1]==2) endname = "("+points[i][0]+";"+points[i][1]+")";
                                    name = endname;
                                }else{
                                    name = name +"("+points[i][0]+";"+points[i][1]+")";
                                }
                            }else{
                                name = "";
                            };
                            canvas.carco.coordinate.pointsname[i] = addText(name, namesize, color);
                        };
                    };
                }
            };

            canvas.carco.coordinate.lines = [];

            canvas.carco.coordinateresize = function() {

                if (canvas.carco.coordinate&&canvas.carco.coordinate.connectlines){
                    for (var i = 0; i < canvas.carco.coordinate.connectlines.length; i++) {
                        stage.removeChild(canvas.carco.coordinate.connectlines[i]);
                    };
                };

                var widthlines = item.carco.customparams.widthlines;
                var widthorigo = item.carco.originalcustomparams.widthorigo;
                var origox = item.carco.customparams.xorigo;
                var origoy = item.carco.customparams.yorigo;
                function scaleY(line) {
                    line.scaleX = item.carco.scale.x*item.carco.root.carco.scale.X;
                    line.scaleY = item.carco.size.realOffsetHeight/line.height;
                };
                function scaleX(line) {
                    line.scaleX = item.carco.size.realOffsetWidth/line.width;
                    line.scaleY = item.carco.scale.y*item.carco.root.carco.scale.Y;
                };
                function positionX(line, x){
                    line.x = x*item.carco.scale.x*item.carco.root.carco.scale.X-(line.scaleX*line.width)/2;
                };
                function positionY(line, y){
                    line.y = y*item.carco.scale.y*item.carco.root.carco.scale.Y-(line.scaleY*line.height)/2;
                };
                scaleX(canvas.carco.coordinate.x)
                scaleY(canvas.carco.coordinate.y)
                positionY(canvas.carco.coordinate.x, origoy)
                positionX(canvas.carco.coordinate.y, origox)
                var starty = ((origoy/unitypx)-Math.floor(origoy/unitypx))*unitypx-unitypx;
                var startx = ((origox/unitypx)-Math.floor(origox/unitypx))*unitypx-unitypx;
                for (var x in canvas.carco.coordinate.xlines){
                    scaleX(canvas.carco.coordinate.xlines[x]);
                    canvas.carco.coordinate.xtext[x].scaleX = canvas.carco.coordinate.xtext[x].scaleY = item.carco.scale.x*item.carco.root.carco.scale.X;
                    positionY(canvas.carco.coordinate.xlines[x], starty)
                    positionY(canvas.carco.coordinate.xtext[x], starty)
                    canvas.carco.coordinate.xtext[x].x = canvas.carco.coordinate.y.x - (canvas.carco.coordinate.xtext[x].width+20)*canvas.carco.coordinate.xtext[x].scaleX
                    starty = starty + unitypx
                    if (xlineoff == x) canvas.carco.coordinate.xlines[x].alpha = 0
                };
                for (var x in canvas.carco.coordinate.ylines){
                    scaleY(canvas.carco.coordinate.ylines[x]);
                    canvas.carco.coordinate.ytext[x].scaleX = canvas.carco.coordinate.ytext[x].scaleY = item.carco.scale.x*item.carco.root.carco.scale.X;
                    positionX(canvas.carco.coordinate.ylines[x], startx)
                    positionX(canvas.carco.coordinate.ytext[x], startx)
                    canvas.carco.coordinate.ytext[x].y = canvas.carco.coordinate.x.y + (20)*canvas.carco.coordinate.ytext[x].scaleY
                    startx = startx + unitypx
                    if (ylineoff == x) canvas.carco.coordinate.ylines[x].alpha = 0
                };
                for (var i = 0; i < canvas.carco.coordinate.points.length; i++) {
                    canvas.carco.coordinate.points[i].scaleX = item.carco.scale.x*item.carco.root.carco.scale.X;
                    canvas.carco.coordinate.points[i].scaleY = item.carco.scale.y*item.carco.root.carco.scale.Y;
                    canvas.carco.coordinate.pointsname[i].scaleX = item.carco.scale.x*item.carco.root.carco.scale.X;
                    canvas.carco.coordinate.pointsname[i].scaleY = item.carco.scale.y*item.carco.root.carco.scale.Y;
                    canvas.carco.coordinate.points[i].x = (origox+points[i][0]*unitypx)*item.carco.scale.x*item.carco.root.carco.scale.X;
                    canvas.carco.coordinate.points[i].y = (origoy-points[i][1]*unitypx)*item.carco.scale.y*item.carco.root.carco.scale.Y;
                    var name = points[i][2];
                    var shiftx = 0;
                    var shifty = 0;
                    if (name&&name[2]) var shiftx = name[2]
                    if (name&&name[3]) var shifty = name[3]
                    canvas.carco.coordinate.pointsname[i].x = canvas.carco.coordinate.points[i].x + canvas.carco.coordinate.points[i].width*canvas.carco.coordinate.points[i].scaleX+20*item.carco.scale.x*item.carco.root.carco.scale.X + shiftx*item.carco.scale.x*item.carco.root.carco.scale.X
                    canvas.carco.coordinate.pointsname[i].y = canvas.carco.coordinate.points[i].y - canvas.carco.coordinate.pointsname[i].height/2*item.carco.scale.y*item.carco.root.carco.scale.Y + shifty*item.carco.scale.x*item.carco.root.carco.scale.X
                };

                canvas.carco.coordinate.connectlines = [];
                var connectlines = item.carco.customparams.connectlines;

                if (connectlines&&connectlines !== ""){
                    connectlines = connectlines.toString()
                    connectlines = connectlines.replace(/\n/g, ",");
                    connectlines = connectlines.replace(/ /gi, "")
                    connectlines = connectlines.replace(/,,/g, ",");
                    connectlines = connectlines.replace(/,,/g, ",");
                    connectlines = connectlines.split("$$");
                    var connectlinescustomstyle = connectlines[1];
                    connectlines = $.parseJSON(connectlines[0]);
                    if (!connectlinescustomstyle) connectlinescustomstyle = "[]";
                    connectlinescustomstyle = $.parseJSON(connectlinescustomstyle);
                };
                if (!connectlinescustomstyle) connectlinescustomstyle = [];
                if (!connectlines&&connectlines == "") connectlines = [];
                if (connectlines&&connectlines.length){
                    var solsconnectlines = [];
                    for (var i = 0; i < connectlines.length; i++) {
                        if (solsdata[connectlines[i]]){
                            var prewpoint = solsdata[connectlines[i-1]]
                            if (!prewpoint) prewpoint = connectlines[i-1];
                            var nextpoint = solsdata[connectlines[i+1]]
                            if (!nextpoint) nextpoint = connectlines[i+1];
                            solsconnectlines.push(-1, prewpoint, solsdata[connectlines[i]], nextpoint);
                        };
                    };
                    for (var i = 0; i < solsconnectlines.length; i++) {
                        connectlines.push(solsconnectlines[i]);
                    };

                    for (var i = 0; i < connectlines.length; i++) {
                        var startpoint = canvas.carco.coordinate.points[connectlines[i]];
                        var endpoint = canvas.carco.coordinate.points[connectlines[i+1]];
                        var width = item.carco.customparams.widthconnectlines*item.carco.scale.x*item.carco.root.carco.scale.X;
                        var dashlen = item.carco.customparams.connectlinesdashlen*item.carco.scale.x*item.carco.root.carco.scale.X;
                        var connectlinecolor = item.carco.customparams.connectlinecolor;
                        if (startpoint&&endpoint){
                            if (connectlinescustomstyle&&connectlinescustomstyle[i]&&connectlinescustomstyle[i][0]) connectlinecolor = connectlinescustomstyle[i][0];
                            if (connectlinescustomstyle&&connectlinescustomstyle[i]&&connectlinescustomstyle[i][1]) dashlen = connectlinescustomstyle[i][1]*item.carco.scale.x*item.carco.root.carco.scale.X;
                            if (type == "check"&&item.carco.game.pluspoints[connectlines[i]]||type == "check"&&item.carco.game.pluspoints[connectlines[i+1]]){
                                if (!solitems[connectlines[i]]&&item.carco.game.pluspoints[connectlines[i]]||!solitems[connectlines[i+1]]&&item.carco.game.pluspoints[connectlines[i+1]]){
                                    if (solitems[connectlines[i-1]]||solitems[connectlines[i+1]]||solitems[connectlines[i]]){
                                        connectlinecolor = "#e12e2a";
                                    }else{
                                        connectlinecolor = "#4ba849";
                                    };
                                }else{
                                    connectlinecolor = "#e12e2a";
                                };
                            };
                            if (startpoint.type == "sol"||endpoint.type == "sol") {
                                connectlinecolor = "#4ba849";
                                if (endpoint.type == "sol"&&endpoint.color) connectlinecolor = endpoint.color;
                                if (startpoint.type == "sol"&&startpoint.color) connectlinecolor = startpoint.color;
                                dashlen = 0;
                            };
                            canvas.carco.coordinate.connectlines[i] = addConnectLines(startpoint.x,startpoint.y,endpoint.x, endpoint.y, width, connectlinecolor, dashlen);
                            stage.addChild(canvas.carco.coordinate.connectlines[i]);
                            stage.setChildIndex(canvas.carco.coordinate.connectlines[i], stage.getChildIndex(canvas.carco.coordinate.points[0])-1);
                        };
                    };
                };
                if (type == "check"){
                    canvas.carco.coordinateChecked = true;
                }else{
                    canvas.carco.coordinateChecked = false;
                };
                stage.update();
            };

            for (var x in canvas.carco.coordinate.xlines){
                stage.addChild(canvas.carco.coordinate.xlines[x]);
            };
            for (var x in canvas.carco.coordinate.ylines){
                stage.addChild(canvas.carco.coordinate.ylines[x]);
            };
            for (var x in canvas.carco.coordinate.xtext){
                stage.addChild(canvas.carco.coordinate.xtext[x]);
            };
            for (var x in canvas.carco.coordinate.ytext){
                stage.addChild(canvas.carco.coordinate.ytext[x]);
            };
            stage.addChild(canvas.carco.coordinate.x, canvas.carco.coordinate.y);

            for (var i = 0; i < canvas.carco.coordinate.points.length; i++) {
                stage.addChild(canvas.carco.coordinate.points[i]);
                stage.addChild(canvas.carco.coordinate.pointsname[i]);
            };

            if (canvas.carco.coordinateresize) canvas.carco.coordinateresize();

            if (!item.carco.game.valueTrueOrFalse){
                item.carco.game.valueTrueOrFalse = function(type){
                    carco.functions.game.valueTrueOrFalse(item, type);
                };
            }

            if (!type) item.carco.game.valueTrueOrFalse("start");
        };

        function getStage() {
            var stage = canvas.carco.stage;
            if (!stage) {
                var stage = setTimeout(function() {getStage();}, 500)
            }else{
                getCoordinate(stage);
            };
        };
        if (canvas) getStage();
    },
    drawAllCoordinage: function(item){
        var coordintes = item.carco.getChildren({children:"recursivechildren", equal:{type:"container", customparams:{gametype:"coordinate"}}, type:"item"})
        for (var i = 0; i < coordintes.length; i++) {
            if (coordintes[i].carco.game&&coordintes[i].carco.game.coordinate) coordintes[i].carco.game.coordinate();
        };
    },
    memogame: function(item){
        setTimeout(function() {
            if (item.carco.root.carco.game.memo > 1){
                var tempfeedbacktype = item.carco.root.carco.paramsdata.user.feedbacktype;
                item.carco.root.carco.paramsdata.user.tempfeedbacktype = tempfeedbacktype;
                var tempfeedbackon = item.carco.root.carco.customparams.feedbackon;
                item.carco.root.carco.customparams.feedbackon = true;
                item.carco.root.carco.paramsdata.user.feedbacktype = "editor";
                var allitems = item.carco.game.solution.allitemsallclones;
                if (item.carco.root.carco.paramsdata.system.usertype == "user"){
                    if (item.carco.root.carco.paramsdata.user.feedbacktype == "practice"){
                        if (item.carco.root.carco.game.process == 1) item.carco.root.carco.game.process = 1;
                    };
                    if (item.carco.root.carco.paramsdata.user.feedbacktype == "test"){
                        if (item.carco.root.carco.game.process == 1) item.carco.root.carco.game.process = 1;
                    };
                    carco.functions.feedback.types[item.carco.root.carco.paramsdata.user.feedbacktype](item.carco.root);
                    for (var i = 0; i < allitems.length; i++) {
                        carco.functions.listeners.removeAllListeners(allitems[i]);
                    };
                    item.carco.root.carco.removesolution();
                };
                item.carco.root.carco.paramsdata.user.feedbacktype = tempfeedbacktype;
                item.carco.root.carco.paramsdata.user.tempfeedbacktype = false;
                item.carco.root.carco.customparams.feedbackon = tempfeedbackon;
                setTimeout(function() {
                    item.carco.root.carco.game.memo = 0;
                    for (var i = 0; i < item.carco.game.solution.allfalsecloneitems.length; i++) {
                        var dragchangeitem = item.carco.game.solution.allfalsecloneitems[i];
                        var place = item;
                        place.carco.game.removeInner(dragchangeitem);
                        dragchangeitem.carco.game.removeInner(place);
                        carco.functions.feedback.check.remove(dragchangeitem);
                        carco.functions.feedback.solution.remove(dragchangeitem);
                        carco.functions.feedback.check.remove(place);
                        carco.functions.feedback.solution.remove(place);
                        dragchangeitem.carco.game.tempinners = [];
                        dragchangeitem.carco.game.valueTrueOrFalse();
                        var dropbutton = dragchangeitem;
                        dropbutton.carco.button.pressed = false;
                        carco.functions.autostyle[dropbutton.carco.customparams.autostyle](dropbutton);
                        var allitems = item.carco.game.solution.allitemsallclones;
                        if (item.carco.root.carco.paramsdata.system.usertype == "user"){
                            for (var a = 0; a < allitems.length; a++) {
                                if (allitems[a].carco.game.value == 0){
                                    carco.functions.listeners.addAllListeners(allitems[a]);
                                };
                            };
                        };
                    };
                    if (item.carco.root.carco.paramsdata.system.usertype == "user"){
                        if (item.carco.game.solution.allfalsecloneitems.length == 0){
                            item.carco.root.carco.game.player();
                        };
                    };
                    item.carco.root.carco.addsolution();
                },800);
            };
        },100);
    },
    newmemo: function(params) {

        var uitem = params.item;
        uitem.carco.useractions = params;

        uitem.carco.useractions.buttondownlistener = function(item) {

            var root = item.carco.root;
            var rch = root.carco.recursivechildren;
            var place = uitem.carco.useractions.place;
            var ufo = uitem.carco.useractions.item;

            if (!place.carco.game.tempinnerclones) {place.carco.game.tempinnerclones = []};

            var tc = place.carco.game.tempinnerclones;

            if (item.carco.button.pressed){
                tc.push(item);
            }else{

                var sp = ufo.carco.useractions.searchpairs(item);
                if (sp&&sp[0]){
                    if (tc&&tc[0]){
                        var inners = item.carco.game.inners;
                        setTimeout(function() {
                            item.carco.button.down();
                        },100);
                        var waspair = true;
                    }else{
                        tc = sp[0].slice(0);
                        var waspair = true;
                        for (var i = 0; i < sp[0].length; i++) {
                            sp[0][i].carco.button.pressed = true;
                        };
                        place.carco.game.tempinnerclones = sp[0];
                        ufo.carco.useractions.removepairs(true);
                        ufo.carco.useractions.showpairs();
                    };
                }else{
                    tc = carco.functions.array.diff(tc, [item]);
                    place.carco.game.tempinnerclones = tc;
                };

            };

            place.carco.game.tempinnerclones = tc;

            if (tc.length>1){
                ufo.carco.useractions.activepairbuttons();
            }else{
                ufo.carco.useractions.activepairbuttons(false);
            };

            if (!waspair){
                carco.functions.autostyle[item.carco.customparams.autostyle](item);
            };

        };

        uitem.carco.useractions.showpairs = function() {

            var item = uitem;
            var buttonscontainer = uitem.carco.useractions.buttonscontainer;
            var numbers = uitem.carco.useractions.showpairstexts;
            var place = uitem.carco.useractions.place;
            var showpairsactivecolor = "rgb(27, 153, 218)";
            if (uitem.carco.useractions.showpairsactivecolor) showpairsactivecolor = uitem.carco.useractions.showpairsactivecolor;

            if (buttonscontainer&&item.carco.root.carco.paramsdata.system.usertype == "user"&&numbers){
                var buttons = buttonscontainer.carco.root.carco.getChildren({equal:{customparams:{gametype:"button"}}, type:"item"});

                if (!item.carco.game.showpairs) {
                    item.carco.game.showpairs = [];
                    item.carco.game.showpairso = {};
                    for (var i = 0; i < buttons.length; i++) {
                        for (var x in buttons[i].carco.recursivechildren) {
                            if (buttons[i].carco.recursivechildren[x].carco.game&&buttons[i].carco.recursivechildren[x].carco.game.showpairs){
                                item.carco.game.showpairs.push(buttons[i].carco.recursivechildren[x]);
                                item.carco.game.showpairso[buttons[i].carco.id] = buttons[i].carco.recursivechildren[x];
                            };
                        };
                    };
                };


                for (var x in item.carco.game.showpairso){
                    var showpair = item.carco.game.showpairso[x];
                    showpair.carco.setStyle({visibility:"hidden", zIndex:5000002}, "save");
                    showpair.style.display = "none";
                };

                if (!place.carco.game.tempinnerclones) {place.carco.game.tempinnerclones = []};
                var tpairs = place.carco.game.tempinnerclones;
                for (var i = 0; i < tpairs.length; i++) {
                    var b = tpairs[i];
                    if (item.carco.game.showpairso[b.carco.id]){
                        var showpair = item.carco.game.showpairso[b.carco.id];
                        showpair.carco.setStyle({visibility:"visible", background:showpairsactivecolor});
                        showpair.style.display = "block";
                        var text = showpair.carco.getChildren({equal:{type:"text"}, type:"item"});
                        if (text[0]) text[0].carco.innerHTML(" ");
                    };
                };

                if (!place.carco.game.innerclones) {place.carco.game.innerclones = []};
                var pairs = place.carco.game.innerclones;
                for (var i = 0; i < pairs.length; i++) {
                    for (var a = 0; a < pairs[i].length; a++) {
                        var b = pairs[i][a];
                        var n = numbers[i];
                        if (item.carco.game.showpairso[b.carco.id]&&n){
                            var showpair = item.carco.game.showpairso[b.carco.id];
                            var text = showpair.carco.getChildren({equal:{type:"text"}, type:"item"});
                            if (text[0]) text[0].carco.innerHTML(n);
                            showpair.carco.setStyle({visibility:"visible", background:"reset"});
                            showpair.style.display = "block";
                        };
                    };
                };

            };

        };

        uitem.carco.useractions.activepairbuttons = function(type) {
            var root = uitem.carco.root;
            var rch = root.carco.recursivechildren;

            var place = uitem.carco.useractions.place;
            var b1 = uitem.carco.useractions.button1;
            var b2 = uitem.carco.useractions.button2;
            var disablelayer = uitem.carco.useractions.layer;

            var activecolor = uitem.carco.useractions.activecolor;
            var deactivecolor = uitem.carco.useractions.deactivecolor;

            if (type == false){
                b1.carco.setStyle({background:deactivecolor});
                b2.carco.setStyle({background:deactivecolor});

                disablelayer.carco.setStyle({visibility:"hidden", zIndex:-1});
                place.carco.game.activebuttons = false;
            }else{
                b1.carco.setStyle({background:activecolor});
                b2.carco.setStyle({background:activecolor});
                disablelayer.carco.setStyle({visibility:"visible", zIndex:5000002});
                place.carco.game.activebuttons = true;
            };

            uitem.carco.useractions.showpairs();

        };

        uitem.carco.useractions.activepairbuttons(false);

        uitem.carco.useractions.addpairs = function(type) {
            var item = uitem.carco.useractions.item;
            var root = uitem.carco.root;
            var rch = root.carco.recursivechildren;
            var place = uitem.carco.useractions.place;
            var ufo = uitem.carco.useractions.item;

            if (place.carco.game.activebuttons){
                if (!place.carco.game.tempinnerclones) {place.carco.game.tempinnerclones = []};

                if (!place.carco.game.innerclones) {place.carco.game.innerclones = []};

                var addpairs = place.carco.game.tempinnerclones;
                var addeditem = false;

                for (var i = 0; i < addpairs.length; i++) {
                    var sp = ufo.carco.useractions.searchpairs(addpairs[i]);
                    if (sp&&sp[0]) {addeditem = true;}
                };


                if (!addeditem&&addpairs&&addpairs.length){
                    place.carco.game.innerclones.push(addpairs);
                    place.carco.game.tempinnerclones = [];
                };

                ufo.carco.useractions.activepairbuttons(false);

            };
        };

        uitem.carco.useractions.searchpairs = function(item) {

            var root = item.carco.root;
            var rch = root.carco.recursivechildren;
            var place = uitem.carco.useractions.place;

            if (!place.carco.game.tempinnerclones) {place.carco.game.tempinnerclones = []};

            if (!place.carco.game.innerclones) {place.carco.game.innerclones = []};

            var r = [];

            var pairs = place.carco.game.innerclones;
            for (var i = 0; i < pairs.length; i++) {
                for (var a = 0; a < pairs[i].length; a++) {
                    if (pairs[i][a] == item){
                        r.push(pairs[i]);
                    };
                };
            };

            return r;

        };

        uitem.carco.useractions.removepairs = function(type) {
            var item = uitem.carco.useractions.item;
            var root = item.carco.root;
            var rch = root.carco.recursivechildren;
            var place = uitem.carco.useractions.place;
            var ufo = uitem.carco.useractions.item;
            if (place.carco.game.activebuttons||type){

                if (!place.carco.game.tempinnerclones) {place.carco.game.tempinnerclones = []};

                if (!place.carco.game.innerclones) {place.carco.game.innerclones = []};

                var addpairs = place.carco.game.tempinnerclones;
                var pairs = place.carco.game.innerclones;
                var r = [];
                var spr = [];

                for (var i = 0; i < addpairs.length; i++) {
                    var sp = ufo.carco.useractions.searchpairs(addpairs[i]);
                    if (sp&&sp[0]){spr = spr.concat(sp);};
                };

                for (var i = 0; i < spr.length; i++) {
                    pairs = carco.functions.array.diff(pairs, [spr[i]]);
                };

                if (!type){
                    for (var i = 0; i < addpairs.length; i++) {
                        if (addpairs[i].carco.button.pressed){

                            var inners = addpairs[i].carco.game.inners;

                            if (inners&&inners[0]){
                                for (var b = 0; b < inners.length; b++) {
                                    inners[b].carco.game.removeInner(addpairs[i]);
                                };
                                addpairs[i].carco.game.inners = [];
                            };

                            addpairs[i].carco.button.pressed = false;
                            carco.functions.autostyle[addpairs[i].carco.customparams.autostyle](addpairs[i]);

                        };
                    };
                };

                place.carco.game.innerclones = pairs;
                if (type){}else {
                    place.carco.game.tempinnerclones = [];
                    ufo.carco.useractions.activepairbuttons(false);
                };

            };
        };

        uitem.carco.useractions.value = function(item) {
            var root = item.carco.root;
            var rch = root.carco.recursivechildren;
            var place = item;
            var ufo = uitem.carco.useractions.item;
            var pairs = place.carco.game.innerclones;
            var clones = place.carco.game.valueclones;


            var ready = [];


            for (var i = 0; i < clones.length; i++) {
                ready[i] = 0;
                for (var p = 0; p < pairs.length; p++) {
                    var diffa = carco.functions.array.diff(clones[i], pairs[p])
                    if (diffa.length == 0){
                        ready[i] = 1;
                    };
                };
            };

            var allready = true;
            for (var i = 0; i < clones.length; i++) {
                for (var ii = 0; ii < clones[i].length; ii++) {
                    if (ready[i]) {
                        clones[i][ii].carco.game.valueTrueOrFalse("start", 1);
                    }else {
                        allready = false;
                        clones[i][ii].carco.game.valueTrueOrFalse("start", 0);
                    };
                };
            };

            return allready;
        };
    },
    getActivePlaces: function(item, reset){
        if (reset) item.carco.root.carco.activeplaces = undefined;
        if (!item.carco.root.carco.activeplaces) {
            var placesmaxinners = 0;
            var drags = item.carco.root.carco.getChildren({equal:{customparams:{gametype:"drag"}}, type:"item"});
            var places = [];
            for (var i = 0; i < drags.length; i++) {
                var dragplaces = drags[i].carco.customparams.placeids;
                if (dragplaces){
                    if (typeof dragplaces == 'string'){
                        if (item.carco.root.carco.recursivechildren[dragplaces]) places.push(item.carco.root.carco.recursivechildren[dragplaces]);
                    }else{
                        for (var a = 0; a < dragplaces.length; a++) {
                            if (item.carco.root.carco.recursivechildren[dragplaces[a]]) places.push(item.carco.root.carco.recursivechildren[dragplaces[a]]);
                        };
                    };
                };
            };
            places = carco.functions.array.uniq(places);
            for (var i = 0; i < places.length; i++) {
                places[i].carco.game.activeplaces = true;
            };
            item.carco.root.carco.activeplaces = places;
        };
        return item.carco.root.carco.activeplaces;
    },
    setPlaceContainerMaxinnersDisable: function(item){
        var places = item.carco.getChildren({equal:{customparams:{gametype:"place"}}, type:"item"});
        var placesmaxinners = 0;
        for (var i = 0; i < places.length; i++) {
            if (places[i].carco.game.activeplaces&&places[i].carco.customparams.multiboxmaxinner) placesmaxinners = placesmaxinners + places[i].carco.customparams.multiboxmaxinner;
        };

        if (item.carco.customparams.multiboxmaxinner<placesmaxinners){
            item.carco.game.multiboxmaxinnerdisable = false;
        }else{
            item.carco.game.multiboxmaxinnerdisable = true;
        };
    },
    stopAllRunnedAudio: function(item, src) {
        if (item.carco.paramsdata.user.stopAllRunnedAudio || true){
            var cpa = item.carco.root.carco.currentplayaudio;
            if (cpa&&cpa.src&&cpa.stop && cpa.src !== src){
                cpa.stop();
            };
        };
    },
    loadAudio: function(item, params, type) {
        if (!item.carco.customparams) item.carco.customparams = {};
        if (!item.carco.originalcustomparams) item.carco.originalcustomparams = {};
        if (params&&params.src) {
            if (!item.carco.customparams.audio) item.carco.customparams.audio = {};
            item.carco.customparams.audio.src = params.src;
        };
        if (item.carco.customparams.audio&&item.carco.customparams.audio.src&&item.carco.root.carco.paramsdata.system.usertype == "user"){
            var root = item.carco.root;
            var src = root.carco.urls.root + root.carco.urls.imagesfolder + item.carco.customparams.audio.src;
            if (carco.functions.isMobile.androidApp()){
                src = "/android_asset/www/"+root.carco.urls.imagesfolder+item.carco.customparams.audio.src;
            };
            carco.createjs.Sound.alternateExtensions = ["mp3"];

            item.carco.game.setAudioPosition = function(millisec) {
                if (millisec&&!isNaN(Number(millisec))){
                    item.carco.game.sound.setPosition(millisec);
                }else{
                    if (!millisec.srcElement) millisec.srcElement = millisec.target;
                    if (!millisec.offsetX) millisec.offsetX = millisec.layerX
                    if (millisec.srcElement == item){
                        if (millisec.offsetX&&millisec.srcElement&&millisec.srcElement.offsetWidth){
                            var percent = millisec.offsetX/millisec.srcElement.offsetWidth;
                            millisec = item.carco.game.sound._duration * percent
                            item.carco.game.sound.setPosition(millisec);
                        };
                    };
                    if (millisec.srcElement == item.carco.game.audioplayingitem){
                        if (millisec.offsetX){
                            var percent = millisec.offsetX/item.offsetWidth;
                            millisec = item.carco.game.sound._duration * percent
                            item.carco.game.sound.setPosition(millisec);
                        };
                    };
                };
            };

            if (!item.carco.game.audioplayingitem){
                item.carco.game.audioplayingitem = item.carco.addChild(carco.functions.children.createHTML(
                    {type:"div",
                        carco:{
                            name: "audio playing item",
                            root: item.carco.root,
                            type: "container",
                            addtools: true,
                            layer: "container",
                            style:{background:"rgba(51, 51, 51, 0.15)"},
                            size:{width:1, height:item.carco.size.height},
                            position:{relative:{x:0, y:0}},
                            customparams: {gametype:"none"}
                        }
                    }
                ))
                if (item.carco.customparams.audioenablesetposition){
                    carco.functions.listeners.add(item, "mousedown", item.carco.game.setAudioPosition);
                };
            };

            item.carco.game.playAudioHandler = function() {
                var position = item.carco.game.sound._duration/1000;
                var positionRound = Math.round(position*10)/10*60
                var sec = Math.floor(positionRound/60);
                item.carco.game.audioDuration = sec;
                var mintimesec = sec-(Math.floor(sec/60)*60)
                if (mintimesec < 10) mintimesec = "0"+ mintimesec;
                item.carco.game.audioDurationMin = Math.floor(sec/60)+":"+mintimesec;
                if (carco.functions.game.searchActions(item, "playaudio")){
                    carco.functions.game.searchActions(item, "playaudio")(item);
                };
            };
            item.carco.game.resetAudioHandler = function() {
                item.carco.game.audioPosition = 0;
                item.carco.game.sound.setPosition(item.carco.game.audioPosition);
                item.carco.game.audioPositionMin = "0:00";
                item.carco.game.setAudioPlayingItem(0.01);
                if (carco.functions.game.searchActions(item, "resetaudio")){
                    carco.functions.game.searchActions(item, "resetaudio")(item);
                };
            };
            item.carco.game.pauseAudioHandler = function() {
                if (carco.functions.game.searchActions(item, "pauseaudio")){
                    carco.functions.game.searchActions(item, "pauseaudio")(item);
                };
            }
            item.carco.game.stopAudioHandler = function(reset) {
                if (item.carco.game.playingInterval) clearInterval(item.carco.game.playingInterval);
                if (item.carco.game.playingIntervalFast) clearInterval(item.carco.game.playingIntervalFast);
                var position = item.carco.game.sound._duration/1000;
                var positionRound = Math.round(position*10)/10*60
                var sec = Math.floor(positionRound/60);
                item.carco.game.audioDuration = sec;
                var mintimesec = sec-(Math.floor(sec/60)*60)
                if (mintimesec < 10) mintimesec = "0"+ mintimesec;
                item.carco.game.setAudioPlayingItem(1);
                item.carco.game.audioDurationMin = Math.floor(sec/60)+":"+mintimesec;
                if (carco.functions.game.searchActions(item, "stopaudio")){
                    carco.functions.game.searchActions(item, "stopaudio")(item);
                };
                if (carco.functions.browser.IE() == 11&&carco.functions.isMobile.IeMobile()) {
                    item.carco.game.resetAudioHandler();
                }else{
                    setTimeout(function() {
                        item.carco.game.resetAudioHandler();
                        if (!reset){
                            item.carco.game.playAudio();
                            setTimeout(function() {item.carco.game.sound.setPaused(true);},100)
                        };
                    }, 1000)
                };

            };
            item.carco.game.getPositionHandler = function() {
                if (item.carco.game.playingInterval) clearInterval(item.carco.game.playingInterval);
                item.carco.game.playingInterval = setInterval(function() {
                    var position = item.carco.game.sound.getPosition()/1000;
                    var positionRound = Math.round(position*10)/10*60
                    var sec = Math.floor(positionRound/60);
                    item.carco.game.audioPosition = sec;
                    var mintimesec = sec-(Math.floor(sec/60)*60)
                    if (mintimesec < 10) mintimesec = "0"+ mintimesec;
                    item.carco.game.audioPositionMin = Math.floor(sec/60)+":"+mintimesec;
                    if (carco.functions.game.searchActions(item, "playingaudio")){
                        carco.functions.game.searchActions(item, "playingaudio")(item);
                    };
                }, 500)
            };

            item.carco.game.setAudioPlayingItem = function(percent) {
                var position = item.carco.game.sound.getPosition();
                var duration = item.carco.game.sound._duration;
                if (!percent) var percent = position/duration;
                var width = item.carco.size.width * percent;
                item.carco.game.audioplayingitem.carco.size.width = width;
                item.carco.game.audioplayingitem.carco.resize();
            };

            item.carco.game.getPositionHandlerFast = function() {
                if (item.carco.game.playingIntervalFast) clearInterval(item.carco.game.playingIntervalFast);
                item.carco.game.playingIntervalFast = setInterval(function() {
                    item.carco.game.setAudioPlayingItem();
                }, 100)
            };
            item.carco.game.playAudio = function(ev) {
                item.carco.root.carco.game.stopAllRunnedAudio(src);
                item.carco.root.carco.currentplayaudio = {src:src, stop:item.carco.game.resetAudio};
                if (item.carco.game.waitAudio) clearInterval(item.carco.game.waitAudio);
                item.carco.game.timeoutAudio = 10000;
                var timeinterval = 100;
                var elapsedtimeout = 0;

                if (carco.functions.isMobile.iOS()||carco.functions.browser.IE() == 11&&carco.functions.isMobile.IeMobile()) {
                    if (item.carco.game.sound&&item.carco.game.sound.getPaused&&item.carco.game.sound.getPaused()){
                        item.carco.game.sound.setPaused(false);
                    }else{
                        item.carco.game.sound = carco.createjs.Sound.play(src);
                        item.carco.game.playAudioHandler();
                        item.carco.game.getPositionHandler();
                        item.carco.game.getPositionHandlerFast();

                        item.carco.game.sound.removeEventListener("complete", function () {
                            item.carco.game.stopAudioHandler();
                        })
                        item.carco.game.sound.addEventListener("complete", function () {
                            item.carco.game.stopAudioHandler();
                        })
                    };

                }else{

                    item.carco.game.waitAudio = setInterval(function() {

                        if (item.carco.game.loadedAudio){

                            clearInterval(item.carco.game.waitAudio);
                            if (item.carco.game.sound.getPaused){
                                if (item.carco.game.sound.getPaused()){
                                    var position = item.carco.game.sound.getPosition()/1000;
                                    if (position < 0) {
                                        position = 0;
                                        item.carco.game.sound.setPosition(0);
                                    };
                                    item.carco.game.sound.setPaused(false);
                                }else{
                                    //carco.createjs.Sound.stop(src);
                                    if (item.carco.game.sound){
                                        if (item.carco.game.sound.gainNode) {
                                            item.carco.game.sound.stop(); 
                                        }else{
                                            carco.createjs.Sound.stop();
                                        };
                                        item.carco.game.sound = carco.createjs.Sound.play(src);
                                    }else {
                                        setTimeout(function () {
                                            item.carco.game.sound = carco.createjs.Sound.play(src);
                                        })
                                    };
                                };
                            }else{
                                item.carco.game.sound = carco.createjs.Sound.play(src);
                            };
                            item.carco.game.playAudioHandler();
                            item.carco.game.getPositionHandler();
                            item.carco.game.getPositionHandlerFast();
                            item.carco.game.sound.removeEventListener("complete", function () {
                                item.carco.game.stopAudioHandler();
                            })
                            item.carco.game.sound.addEventListener("complete", function () {
                                item.carco.game.stopAudioHandler();
                            })
                        }else{
                            elapsedtimeout = elapsedtimeout + timeinterval;
                            if (elapsedtimeout>item.carco.game.timeoutAudio) {
                                clearInterval(item.carco.game.waitAudio);
                            };
                        }
                    },timeinterval)

                };
            };
            item.carco.game.resetAudio = function() {
                item.carco.game.stopAudio(true);
            };
            item.carco.game.stopAudio = function(reset) {
                if (item.carco.root.carco.currentplayaudio&&item.carco.root.carco.currentplayaudio.src == src) {
                    item.carco.root.carco.currentplayaudio = false;
                };
                if (item.carco.game.waitAudio) clearInterval(item.carco.game.waitAudio);
                item.carco.game.timeoutAudio = 10000;
                var timeinterval = 100;
                var elapsedtimeout = 0;
                function stop() {
                    if (item.carco.game.waitAudio) clearInterval(item.carco.game.waitAudio);
                    item.carco.game.stopAudioHandler(reset);
                    item.carco.game.pausedTime = 0;
                    if (item.carco.game.sound) {
                        if (item.carco.game.sound.gainNode) {
                            item.carco.game.sound.stop();
                        }else{
                            carco.createjs.Sound.stop();
                        };
                    };
                    //carco.createjs.Sound.stop(src);
                };
                if (item.carco.game.loadedAudio){
                    stop();
                }else{
                    item.carco.game.waitAudio = setInterval(function() {
                        if (item.carco.game.loadedAudio){
                            clearInterval(item.carco.game.waitAudio);
                            stop();
                        }else{
                            elapsedtimeout = elapsedtimeout + timeinterval;
                            if (elapsedtimeout>item.carco.game.timeoutAudio) {
                                clearInterval(item.carco.game.waitAudio);
                            };
                        }
                    },timeinterval)
                };
            };
            item.carco.game.pauseAudio = function() {
                if (carco.functions.browser.IE() == 11&&carco.functions.isMobile.IeMobile()) {
                    item.carco.game.stopAudio();
                }else {
                    if (item.carco.game.sound && item.carco.game.sound.getPosition) {
                        item.carco.game.pausedTime = item.carco.game.sound.getPosition();
                        item.carco.game.sound.setPaused(true);
                    };
                    item.carco.game.pauseAudioHandler();
                };
            };
            item.carco.game.setVolume = function(volume) {
                item.carco.game.sound.setVolume(volume);
                if (carco.functions.game.searchActions(item, "changevolume")){
                    carco.functions.game.searchActions(item, "changevolume")(item);
                };
            };
            item.carco.game.setVolumeButton = function(volumeitem){
                item.carco.game.volumeitem = volumeitem;
                carco.functions.listeners.add(volumeitem, "mousedown", item.carco.game.volumeButtonAction);
            };

            item.carco.game.volumeButtonAction = function(millisec) {
                if (!millisec.offsetX) millisec.offsetX = millisec.layerX
                if (millisec.offsetX){
                    var percent = millisec.offsetX/item.carco.game.volumeitem.offsetWidth;
                    millisec = 1 * percent
                    item.carco.game.setVolume(millisec);
                };
            };

            item.carco.game.setLoadedAudio = function() {
                //item.carco.game.sound = carco.createjs.Sound.play(item.carco.id);
                /*item.carco.game.setVolume(0);
                 item.carco.game.getPositionHandlerFast();
                 item.carco.game.sound.setPaused(true);
                 item.carco.game.setVolume(1);*/
                //setTimeout(function() {item.carco.game.sound.setPaused(true);})
                //alert("loaded "+item.carco.id)
                item.carco.game.loadedAudio = true;
                item.carco.game.audioPosition = 0;
                item.carco.game.audioPositionMin = "0:00";

                var position = item.carco.game.sound._duration/1000;
                var positionRound = Math.round(position*10)/10*60
                var sec = Math.floor(positionRound/60);
                item.carco.game.audioDuration = sec;
                var mintimesec = sec-(Math.floor(sec/60)*60)
                if (mintimesec < 10) mintimesec = "0"+ mintimesec;
                item.carco.game.audioDurationMin = Math.floor(sec/60)+":"+mintimesec;

                if (carco.functions.game.searchActions(item, "loadedaudio")){
                    setTimeout(function() {carco.functions.game.searchActions(item, "loadedaudio")(item);},100)
                };
                if (item.carco.customparams.audiostartvolume){
                    item.carco.game.setVolume(item.carco.customparams.audiostartvolume);
                };
            };
            //carco.functions.root.preloadlayer(item.carco.root, "add");
            if (item.carco.root.carco.audiosobject[src]){
                item.carco.game.sound = item.carco.root.carco.audiosobject[src];
                item.carco.game.setLoadedAudio();
            }else {
                /*carco.createjs.Sound.on("fileload", item.carco.game.setLoadedAudio);
                if (!item.carco.root.carco.audios) item.carco.root.carco.audios = [];
                carco.createjs.Sound.removeSound(src);
                item.carco.game.sound = carco.createjs.Sound.registerSound(src);*/
            };

        }else{
            if (item.carco.customparams.audio&&item.carco.customparams.audio.src) {
                item.carco.game.setLoadedAudio = function () {}
                item.carco.game.pauseAudio = function () {}
                item.carco.game.stopAudio = function () {}
                item.carco.game.playAudio = function () {}
            };
        }
        if (type == true) type = "save";
        if (type == "save"){
            item.carco.originalcustomparams.audio = carco.functions.object.clone(item.carco.customparams.audio);
        };
    }
}

carco.functions.plugin("csstransist", false, function() {
    return {
        init: function(item){
            item.carco.addTransist = function(p) {
                var moveitem = item;
                if (item.carco.csstransist.moveitem){
                    moveitem = item.carco.csstransist.moveitem;
                };
                var root = moveitem.carco.root;
                var className = moveitem.className;
                var params = carco.functions.csstransist.getParams(p);
                var name = params[0];
                className = carco.functions.csstransist.removeTransist(moveitem, name);
                carco.functions.csstransist.addTransist(root, p);
                moveitem.className = carco.functions.csstransist.classNormalise(className + " " + name);
                return moveitem.className;
            };
            item.carco.removeTransist = function(p) {
                var moveitem = item;
                if (item.carco.csstransist.moveitem){
                    moveitem = item.carco.csstransist.moveitem;
                };
                var params = carco.functions.csstransist.getParams(p);
                var name = params[0];
                return carco.functions.csstransist.removeTransist(moveitem, name);
            };
        },
        getParams: function(p) {
            var type = "all";
            var duration = 250;
            if (p&&p.type) type = p.type;
            if (p&&p.duration) duration = p.duration;
            var sdur = duration/1000 + "s";
            var sduration = duration.toString();
            sduration = sduration.replace(/\./g, "-");
            var name = type+"_"+sduration+"_wapplrtransist";
            if (p.animation) {
                var animn = p.animation;
                animn = animn.replace(/\{/g, "");
                animn = animn.replace(/\}/g, "");
                animn = animn.replace(/\;/g, "");
                animn = animn.replace(/\ /g, "");
                animn = animn.replace(/\./g, "");
                animn = animn.replace(/\%/g, "");
                animn = animn.replace(/\:/g, "");
                name = name+"_"+animn
            };
            return [name, duration, type];
        },
        addTransist: function(root, p) {
            if (!root.carco.transists) root.carco.transists = {};

            var params = carco.functions.csstransist.getParams(p);
            var name = params[0];
            var duration = params[1];
            var type = params[2];

            var sdur = duration/1000 + "s";

            if (!root.carco.transists[name]){
                if (p.animation){
                    var astring = p.animation;
                    var style = "@-webkit-keyframes "+name + " {"+astring+"} "+"@-moz-keyframes "+name + " {"+astring+"} "+"@-o-keyframes "+name + " {"+astring+"} "+"@keyframes "+name + " {"+astring+"} ";
                    var steps = "";
                    if (p.steps) steps = " steps("+p.steps+", end) infinite";
                    style = style + " ."+name+" {-webkit-animation: "+name+" "+sdur+steps+"; -moz-animation: "+name+" "+sdur+steps+"; -o-animation: "+name+" "+sdur+steps+"; animation: "+name+" "+sdur+steps+";}"

                    root.carco.transists[name] = carco.functions.children.createHTML({type:"style", attr:{type:"text/css"}, vars:{innerHTML:style}});
                }else{
                    var style = "."+name+"{-webkit-transition: "+type+" "+sdur+"; -moz-transition: "+type+" "+sdur+"; -o-transition: "+type+" "+sdur+"; transition: "+type+" "+sdur+";}"
                    root.carco.transists[name] = carco.functions.children.createHTML({type:"style", attr:{type:"text/css"}, vars:{innerHTML:style}});
                }
                document.getElementsByTagName('head')[0].appendChild(root.carco.transists[name]);
            };
            return name;
        },
        classNormalise: function(s) {
            if (s && s.match(" ")){
                s = s.replace(/\s+/g, ' ');
            };
            if (s && s.slice(0,1) == " "){
                s = s.slice(1)
            };
            return s;
        },
        removeTransist: function(item, name) {
            var className = item.className;
            var newClassName = "";
            var type = false;
            if (name&&name.split) type = name.split("_")[0];
            if (name&&className&&className.match(name)||
                type&&className&&className.match(type)){
                var classNamea = className.split(" ");
                for (var i = 0; i < classNamea.length; i++) {
                    if (!type&&classNamea[i] && classNamea[i] !== name && classNamea[i] !== " ") newClassName = newClassName+" "+classNamea[i];
                    if (type&&classNamea[i] && !classNamea[i].match(type)) newClassName = newClassName+" "+classNamea[i];
                };
                item.className = carco.functions.csstransist.classNormalise(newClassName);
            };
            return item.className;
        }
    }
})