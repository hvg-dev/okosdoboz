if (!carco) var carco = {};

carco.createlibrary = function() {
    return {
        run: function(currentScript, project) {
            if (!currentScript){
                if (!currentScript||carco.functions.browser.IE()>6||carco.functions.browser.Safari()||true){

                    var scripts = document.scripts;
                    var script = false;
                    for (var x = 0; x < document.scripts.length; x++) {
                        var xx = (document.scripts.length - x) - 1;
                        if (document.scripts[xx].getAttribute&&document.scripts[xx].getAttribute("name") == "carco"&&document.scripts[xx].getAttribute("project") == project){
                            if (!document.scripts[xx].getAttribute("founded")){
                                script = document.scripts[xx];
                            };
                        };
                    };

                    if (!currentScript&&!script) {
                        currentScript = scripts[scripts.length-1];
                    };
                    if (script) {
                        currentScript = script;
                        script.setAttribute("founded", "true");
                    };
                };
            };

            var parent = currentScript.parentElement;
            if (currentScript&&currentScript.carco&&currentScript.carco.parent) {
                parent = currentScript.carco.parent;
            };

            currentScript.removeAttribute("disableautorun");
            carco.project.loadProject(project, parent, currentScript);
        },
        plugin: function(object, name, constructor) {
            if (!this[object]) this[object] = {};
            var plugin = new constructor();
            if (typeof plugin == "function"){
                if (name) this[object][name] = plugin;
                if (!name) this[object] = plugin;
            };
            if (typeof plugin == "object"){
                if (name) {
                    if (!this[object][name]) this[object][name] = {};
                    for (var x in plugin) {
                        this[object][name][x] = plugin[x];
                    };
                }else{
                    if (!this[object]) this[object] = {};
                    for (var x in plugin) {
                        this[object][x] = plugin[x];
                    };
                };
            };
            if (!this.plugins) this.plugins = [];
            this.plugins.push({name:name, object:object, constructor:constructor});
        },
        loadProjects: function(name, parent, script, callback) {

            var scripts = {};
            if (!script) {
                for (var x in document.scripts) {
                    scripts[x] = document.scripts[x];
                };
            }else{
                var scripts = [];
                scripts.push(script);
            };

            for (var x = 0; x < scripts.length; x++) {
                if (scripts[x] && scripts[x].getAttribute && scripts[x].getAttribute("name") == "carco" && !scripts[x].getAttribute("disableautorun")){
                    var cscript = scripts[x];
                    var name = scripts[x].getAttribute("project");

                    if (!this[name]||this[name]&&this[name].preconfig) {

                        if (this[name]&&this[name].preconfig){
                            this[name].preconfig = false;
                        }else {
                            this[name] = {};
                        };

                        this[name].loader = new carco.createjs.LoadQueue(false);

                        this[name].configfile = "config.js";
                        if (scripts[x].getAttribute("config")) this[name].configfile = scripts[x].getAttribute("config");

                        this[name].name = scripts[x].getAttribute("project");
                        this[name].parent = scripts[x].getAttribute("parent");

                        var url = carco.functions.url.get(); url = url.split("/"); url = url[2];

                        if (scripts[x].getAttribute("lib")!==undefined&&scripts[x].getAttribute("lib")!==null&&scripts[x].getAttribute("lib")!=="") {
                            this[name].hosts = [scripts[x].getAttribute("lib")];
                        }else{
                            this[name].hosts=[];
                        };

                        this[name].currentScript = scripts[x];
                        this[name].projects = this;
                        this[name].files = [];
                        this[name].errors = [];
                        this[name].currentProject = {};
                        this[name].currentHost = "";
                        this[name].loaderProperties = {};

                        this[name].setLoaderProperties = function(manifest, listeners, object, name, scripttag) {

                            var lp = {};
                            lp.name = name;
                            lp.object = object;
                            lp.scripttag = scripttag;

                            lp.loaded = function(e) {
                                var name = lp.name;
                                if (lp.object[name].files[e.item.host] == undefined){
                                    lp.object[name].files[e.item.host] = {};
                                };
                                lp.object[name].files[e.item.host][e.item.id] = e.result;
                                lp.object[name].files[e.item.host][e.item.id].carco_project = name;
                                lp.object[name].files[e.item.host][e.item.id].carco_id = e.item.id;

                                if (e.item.type == carco.createjs.LoadQueue.CSS) {
                                    var link = document.createElement("link");
                                    link.setAttribute("rel", "stylesheet");
                                    link.setAttribute("type", "text/css");
                                    link.setAttribute("href", e.item.src);
                                    document.head.appendChild(link);
                                };

                            };

                            lp.error = function(e) {
                                var name = lp.name;
                                if (lp.object[name].files[e.item.host] == undefined){
                                    lp.object[name].files[e.item.host] = {};
                                };
                                if (lp.object[name].errors[e.item.host] == undefined){
                                    lp.object[name].errors[e.item.host] = {};
                                };
                                lp.object[name].errors[e.item.host][e.item.id] = e.item.tag;
                                lp.object[name].errors[e.item.host][e.item.id].carco_project = name;
                                lp.object[name].errors[e.item.host][e.item.id].carco_id = e.item.id;
                                lp.object[name].errors[e.item.host][e.item.id].carco_error = true;
                            };

                            lp.complete = function(e) {};
                            if (manifest&&manifest.length) {
                                lp.manifest = manifest;
                            };
                            if (!lp.manifest) lp.manifest = [];

                            lp.init = function() {
                                var name = lp.name;
                                if (lp.manifest&&lp.manifest.length) {
                                    lp.object[name].loader.loadManifest(lp.manifest);
                                };
                            };

                            lp.addlisteners = function() {
                                var name = lp.name;
                                lp.object[name].loader.addEventListener("fileload", lp.loaded);
                                lp.object[name].loader.addEventListener("error", lp.error);
                                lp.object[name].loader.addEventListener("complete", lp.complete);
                            };

                            lp.remove = function() {
                                var name = lp.name;
                                lp.object[name].loader.removeAll();
                                lp.object[name].loader.removeAllEventListeners();
                                lp.object[name].loader.removeEventListener("fileload", lp.loaded);
                                lp.object[name].loader.removeEventListener("error", lp.error);
                                lp.object[name].loader.removeEventListener("complete", lp.complete);
                            };

                            return lp;

                        };

                        this[name].load = function(object, name, scripttag) {
                            object[name].loaderProperties[name] = object[name].setLoaderProperties([], false, object, name, scripttag);
                            object[name].loaderProperties[name].addlisteners(name);

                            for (var i = 0; i < object[name].hosts.length; i++) {
                                var host = object[name].hosts[i]
                                if (object[name].configfile !== "false") {
                                    object[name].loaderProperties[name] = object[name].setLoaderProperties([{
                                        id: object[name].configfile,
                                        src: host + object[name].configfile + "?" + carco.functions.randomString.math10(),
                                        host: i
                                    }], false, object, name, scripttag);
                                    object[name].loaderProperties[name].init();
                                };
                            };
                        };

                        this[name].hostTimer = function(object, name) {
                            var loaded_host = [];
                            for (var i = 0; i < object[name].hosts.length; i++) {
                                if (object[name].files[i]!==undefined){
                                    loaded_host.push(i);
                                };
                            };
                            if (object[name].configfile == "false") {
                                loaded_host = object[name].hosts.slice(0);
                            };
                            if (loaded_host.length == object[name].hosts.length){
                                object[name].setCurrentHost(object, name);
                            }else{
                                setTimeout(function() {object[name].hostTimer(object, name)}, 300);
                            };
                        };

                        this[name].loadTimer = function(text, object, name) {
                            if (!object||object&&!object[name]) object = this;
                            if (!object||object&&!object[name]) object = {}; object[name] = this;
                            if (!object[name].timer) object[name].timer = {};
                            var currentdate = new Date();
                            if (!text) text="";
                            if (text == "reset"){
                                object[name].timer.starttime = undefined;
                                object[name].timer.starttimesec = undefined;
                                object[name].timer.timenowsec = undefined;
                            }else{
                                var datetime = text
                                    + currentdate.getHours() + ":"
                                    + currentdate.getMinutes() + ":"
                                    + currentdate.getSeconds();
                                var datetimesec = currentdate.getHours()*3600*1000+currentdate.getMinutes()*60*1000+currentdate.getSeconds()*1000+currentdate.getMilliseconds();
                                if (!object[name].timer.starttime) object[name].timer.starttime = datetime;
                                if (!object[name].timer.starttimesec) object[name].timer.starttimesec = datetimesec;
                                if (!object[name].timer.timenowsec) object[name].timer.timenowsec = datetimesec;
                                var lasttimesec = (datetimesec - object[name].timer.timenowsec)/1000
                                var starttimesec = (datetimesec - object[name].timer.starttimesec)/1000
                                carco.functions.console(datetime+" last elapsed time:"+lasttimesec+"s, start elapsed time:"+starttimesec+"s")
                                object[name].timer.timenow = datetime;
                                object[name].timer.timenowsec = datetimesec;
                            };
                        };

                        this[name].setCurrentHost = function(object, name) {
                            if (object[name].configfile == "false") {
                                object[name].currentHost = object[name].hosts.length-1;
                            }else{
                                for (var i = 0; i < object[name].files.length; i++) {
                                    if (object[name].files[i][object[name].configfile]!==undefined) {
                                        object[name].currentHost = i;
                                        break;
                                    };
                                };
                            };
                            if (object[name].currentHost !== ""){
                                object[name].filesload(object, name);
                            };
                        };

                        this[name].parentready = function(callback, root, item) {
                            var object = this;
                            var name = object.name;
                            if (!object[name]) object = object.projects;
                            if (object[name].parent){
                                if (!root) root = object[object[name].parent].root;
                                object[name].root = root;
                                if (root.carco.wapplr) {
                                    object[name].wapplr = root.carco.wapplr;
                                }else{
                                    object[name].wapplr = document.getElementById("wapplr")
                                };
                                var parentstart = setInterval(function() {
                                    if (object[object[name].parent].userstartready){
                                        clearInterval(parentstart);
                                        if (callback) callback(root, item);
                                        object[name].userstartready = true;
                                    }
                                },100)
                            }else{
                                object[name].root = root;
                                if (root.carco.wapplr) object[name].wapplr = root.carco.wapplr;
                                if (callback) callback(root, item);
                                object[name].userstartready = true;
                            };
                        };

                        this[name].filesload = function(object, name) {
                            object[name].loaderProperties[name].remove(name);
                            var remove_scripts = [];

                            for (var x in object[name].files[object[name].currentHost]){
                                if (x == object[name].configfile && object[name].configfile !== "false") {
                                    if (object[name].files[object[name].currentHost][x].parentElement) object[name].files[object[name].currentHost][x].parentElement.removeChild(object[name].files[object[name].currentHost][x]);
                                };
                            };

                            for (var x in document.scripts){
                                if (document.scripts[x].carco_error == true || document.scripts[x].carco_id == object[name].configfile && object[name].configfile !== "false") {
                                    remove_scripts.push(document.scripts[x]);
                                };
                            };

                            for (var x in remove_scripts){
                                if (!document.body) {document.body = document.getElementsByTagName('body')[0]}
                                if (carco.functions.browser.IE()>8 && carco.functions.browser.IE()==8) document.body.removeChild(remove_scripts[x]);
                            };

                            var host = object[name].hosts[object[name].currentHost];
                            if (object[name].configfile == "false") {}else {
                                object[name].loaderProperties[name].manifest = [{
                                    id: object[name].configfile,
                                    src: host + object[name].configfile + "?" + carco.functions.randomString.math10(),
                                    host: object[name].currentHost
                                }];
                            };

                            if (cscript.getAttribute("datafile")){
                                var datafile = cscript.getAttribute("datafile");
                                if (!object[name].filenames) object[name].filenames = [];
                                object[name].filenames.push(datafile);
                            };

                            var ufilenames = [];
                            for (var i = 0; i < object[name].filenames.length; i++) {
                                var wf = false;
                                for (var u = 0; u < ufilenames.length; u++) {
                                    if (ufilenames[u] == object[name].filenames[i]) wf = true;
                                };
                                if (!wf) ufilenames.push(object[name].filenames[i]);
                            };
                            object[name].filenames = ufilenames;

                            if (object[name].filenames!==undefined&&object[name].filenames.length>0){

                                function getFiles(object, name) {
                                    for (var i = 0; i < object[name].filenames.length; i++) {
                                        var file_data = object[name].filenames[i];
                                        if (file_data) {
                                            file_data = file_data.split(".");
                                            var file_type = file_data[file_data.length-1];

                                            if (file_type == "css"){
                                                var link=document.createElement("link");
                                                link.setAttribute("rel", "stylesheet");
                                                link.setAttribute("type", "text/css");
                                                link.setAttribute("href", host+object[name].filenames[i]+"?"+carco.functions.randomString.math10());
                                                if (!document.head) {document.head = document.getElementsByTagName('head')[0]}
                                                document.head.appendChild(link);
                                                if (!object[name].files[object[name].currentHost]) object[name].files[object[name].currentHost] = {}
                                                object[name].files[object[name].currentHost][object[name].filenames[i]] = link;

                                            }else{

                                                if (object[name].filenames[i] == "MathJax-master/MathJax.js?config=TeX-AMS_HTML.js"){
                                                    object[name].loaderProperties[name].manifest.push({id:object[name].filenames[i], src:host+object[name].filenames[i], host:object[name].currentHost});
                                                }else{
                                                    object[name].loaderProperties[name].manifest.push({id:object[name].filenames[i], src:host+object[name].filenames[i]+"?"+carco.functions.randomString.math10(), host:object[name].currentHost});
                                                };

                                            };
                                        };
                                    };
                                };

                                getFiles(object, name);

                                object[name].loaderProperties[name].remove(name);
                                object[name].errors[object[name].currentHost] = {};

                                object[name].loaderProperties[name].error = function(e) {
                                    object[name].errors[object[name].currentHost][e.item.id] = e.item.tag;
                                    if (e.item.tag.nodeName=="LINK"){
                                        document.head.appendChild(e.item.tag);
                                        object[name].files[object[name].currentHost][e.item.id] = e.item.tag;
                                    };
                                    carco.functions.console("not found "+e.item.src);
                                };

                                object[name].loaderProperties[name].complete = function() {
                                    var errorfiles = [];
                                    for (var i = 0; i < object[name].filenames.length; i++){
                                        if (object[name].files[object[name].currentHost][object[name].filenames[i]]==undefined){
                                            errorfiles.push(object[name].filenames[i]);
                                        };
                                    };
                                    if (errorfiles.length > 0){
                                        carco.functions.console("error files, project:"+name+", "+errorfiles);
                                    }else{
                                        object[name].loadTimer("Loaded program files, project:"+name+" ", object, name);
                                        object[name].loaded = true;
                                        if (object[name].parent) {
                                            var parentint = setInterval(function() {
                                                if (object[object[name].parent].loaded){
                                                    clearInterval(parentint);
                                                    var r = document.body;
                                                    if (document.getElementById("wapplr")) r = document.getElementById("wapplr");
                                                    if (!object[object[name].parent].root) object[object[name].parent].root = r;
                                                    var parente = object[name].loaderProperties[name].scripttag.parentElement;
                                                    if (parent) parente = parent;
                                                    if (!object[object[name].parent].wapplr) object[object[name].parent].wapplr = object[object[name].parent].root;
                                                    object[name].start(object[object[name].parent].wapplr, parente, object[name].currentScript, object[name].files[object[name].currentHost], callback);
                                                };
                                            },100)
                                        }else{
                                            object[name].start(object[name].wapplr, object[name].loaderProperties[name].scripttag.parentElement, object[name].currentScript, object[name].files[object[name].currentHost], callback);
                                        };
                                    };
                                };

                                object[name].loaderProperties[name].addlisteners(object, name);

                                if (object[name].parent){
                                    function wait(object, name){
                                        if (object[object[name].parent]&&object[object[name].parent].loaded){
                                            if (!object[name].loaderProperties[name].manifest||object[name].loaderProperties[name].manifest&&!object[name].loaderProperties[name].manifest[0]){
                                                getFiles(object, name);
                                            };
                                            object[name].loaderProperties[name].init(name);
                                        }else{
                                            setTimeout(function() {wait(object, name)});
                                        };
                                    };
                                    wait(object, name);
                                } else {
                                    object[name].loaderProperties[name].init(object, name);
                                };
                            };
                        };

                        if (this[name].configfile == "false"&&!this[name].loaderProperties[name]) {
                            this[name].loaderProperties[name] = this[name].setLoaderProperties([], false, this, name, scripts[x]);
                        };

                        this[name].loadTimer("Start Wapplr, project:"+name+" ", this, name);
                        this[name].hostTimer(this, name);
                        this[name].load(this, name, scripts[x]);

                    };
                };
            };
        },
        loadProject: function(name, parent, script) {
            if (this[name]&&this[name].preconfig&&this[name].loaded||this[name]&&!this[name].preconfig) {
                var object = this;
                var interval = setInterval(function() {
                    var go = true;
                    if (object[name].parent&&!object[object[name].parent]) go = false;
                    if (!object[name].start) go = false;
                    if (!object[name].loaded) go = false;
                    if (object[object[name].parent]&&!object[object[name].parent].root) go = false;
                    if (go){
                        object[name].start(object[object[name].parent].root, parent, script)
                        clearInterval(interval);
                    };
                },100)
            }else{
                this.loadProjects(name, parent, script);
            };
        }
    }
};

carco.project = new carco.createlibrary();
carco.functions = new carco.createlibrary();

carco.functions.loadProjects = function(a, b, c, d) {
    return carco.project.loadProjects(b, c, d, a);
};

$cp = carco.project;
$cf = carco.functions;

//preloadjs-NEXT.min.js inner carco object
if (carco.createjs == undefined || carco.createjs.PreloadJS == undefined){
    this.carco.createjs=this.carco.createjs||{},function(){"use strict";var a=carco.createjs.PreloadJS=carco.createjs.PreloadJS||{};a.version="NEXT",a.buildDate="Wed, 02 Apr 2014 17:54:19 GMT"}(),this.carco.createjs=this.carco.createjs||{},function(){"use strict";var a=function(a,b,c){this.initialize(a,b,c)},b=a.prototype;b.type=null,b.target=null,b.currentTarget=null,b.eventPhase=0,b.bubbles=!1,b.cancelable=!1,b.timeStamp=0,b.defaultPrevented=!1,b.propagationStopped=!1,b.immediatePropagationStopped=!1,b.removed=!1,b.initialize=function(a,b,c){this.type=a,this.bubbles=b,this.cancelable=c,this.timeStamp=(new Date).getTime()},b.preventDefault=function(){this.defaultPrevented=!0},b.stopPropagation=function(){this.propagationStopped=!0},b.stopImmediatePropagation=function(){this.immediatePropagationStopped=this.propagationStopped=!0},b.remove=function(){this.removed=!0},b.clone=function(){return new a(this.type,this.bubbles,this.cancelable)},b.toString=function(){return"[Event (type="+this.type+")]"},carco.createjs.Event=a}(),this.carco.createjs=this.carco.createjs||{},function(){"use strict";var a=function(){},b=a.prototype;a.initialize=function(a){a.addEventListener=b.addEventListener,a.on=b.on,a.removeEventListener=a.off=b.removeEventListener,a.removeAllEventListeners=b.removeAllEventListeners,a.hasEventListener=b.hasEventListener,a.dispatchEvent=b.dispatchEvent,a._dispatchEvent=b._dispatchEvent,a.willTrigger=b.willTrigger},b._listeners=null,b._captureListeners=null,b.initialize=function(){},b.addEventListener=function(a,b,c){var d;d=c?this._captureListeners=this._captureListeners||{}:this._listeners=this._listeners||{};var e=d[a];return e&&this.removeEventListener(a,b,c),e=d[a],e?e.push(b):d[a]=[b],b},b.on=function(a,b,c,d,e,f){return b.handleEvent&&(c=c||b,b=b.handleEvent),c=c||this,this.addEventListener(a,function(a){b.call(c,a,e),d&&a.remove()},f)},b.removeEventListener=function(a,b,c){var d=c?this._captureListeners:this._listeners;if(d){var e=d[a];if(e)for(var f=0,g=e.length;g>f;f++)if(e[f]==b){1==g?delete d[a]:e.splice(f,1);break}}},b.off=b.removeEventListener,b.removeAllEventListeners=function(a){a?(this._listeners&&delete this._listeners[a],this._captureListeners&&delete this._captureListeners[a]):this._listeners=this._captureListeners=null},b.dispatchEvent=function(a,b){if("string"==typeof a){var c=this._listeners;if(!c||!c[a])return!1;a=new carco.createjs.Event(a)}if(a.target=b||this,a.bubbles&&this.parent){for(var d=this,e=[d];d.parent;)e.push(d=d.parent);var f,g=e.length;for(f=g-1;f>=0&&!a.propagationStopped;f--)e[f]._dispatchEvent(a,1+(0==f));for(f=1;g>f&&!a.propagationStopped;f++)e[f]._dispatchEvent(a,3)}else this._dispatchEvent(a,2);return a.defaultPrevented},b.hasEventListener=function(a){var b=this._listeners,c=this._captureListeners;return!!(b&&b[a]||c&&c[a])},b.willTrigger=function(a){for(var b=this;b;){if(b.hasEventListener(a))return!0;b=b.parent}return!1},b.toString=function(){return"[EventDispatcher]"},b._dispatchEvent=function(a,b){var c,d=1==b?this._captureListeners:this._listeners;if(a&&d){var e=d[a.type];if(!e||!(c=e.length))return;a.currentTarget=this,a.eventPhase=b,a.removed=!1,e=e.slice();for(var f=0;c>f&&!a.immediatePropagationStopped;f++){var g=e[f];g.handleEvent?g.handleEvent(a):g(a),a.removed&&(this.off(a.type,g,1==b),a.removed=!1)}}},carco.createjs.EventDispatcher=a}(),this.carco.createjs=this.carco.createjs||{},function(){"use strict";carco.createjs.indexOf=function(a,b){for(var c=0,d=a.length;d>c;c++)if(b===a[c])return c;return-1}}(),this.carco.createjs=this.carco.createjs||{},function(){"use strict";carco.createjs.proxy=function(a,b){var c=Array.prototype.slice.call(arguments,2);return function(){return a.apply(b,Array.prototype.slice.call(arguments,0).concat(c))}}}(),this.carco.createjs=this.carco.createjs||{},function(){"use strict";var a=function(){this.init()};a.prototype=new carco.createjs.EventDispatcher;var b=a.prototype,c=a;c.ABSOLUTE_PATT=/^(?:\w+:)?\/{2}/i,c.RELATIVE_PATT=/^[./]*?\//i,c.EXTENSION_PATT=/\/?[^/]+\.(\w{1,5})$/i,b.loaded=!1,b.canceled=!1,b.progress=0,b._item=null,b.getItem=function(){return this._item},b.init=function(){},b.load=function(){},b.close=function(){},b._sendLoadStart=function(){this._isCanceled()||this.dispatchEvent("loadstart")},b._sendProgress=function(a){if(!this._isCanceled()){var b=null;"number"==typeof a?(this.progress=a,b=new carco.createjs.Event("progress"),b.loaded=this.progress,b.total=1):(b=a,this.progress=a.loaded/a.total,(isNaN(this.progress)||1/0==this.progress)&&(this.progress=0)),b.progress=this.progress,this.hasEventListener("progress")&&this.dispatchEvent(b)}},b._sendComplete=function(){this._isCanceled()||this.dispatchEvent("complete")},b._sendError=function(a){!this._isCanceled()&&this.hasEventListener("error")&&(null==a&&(a=new carco.createjs.Event("error")),this.dispatchEvent(a))},b._isCanceled=function(){return null==window.carco.createjs||this.canceled?!0:!1},b._parseURI=function(a){var b={absolute:!1,relative:!1};if(null==a)return b;var d=a.indexOf("?");d>-1&&(a=a.substr(0,d));var e;return c.ABSOLUTE_PATT.test(a)?b.absolute=!0:c.RELATIVE_PATT.test(a)&&(b.relative=!0),(e=a.match(c.EXTENSION_PATT))&&(b.extension=e[1].toLowerCase()),b},b._formatQueryString=function(a,b){if(null==a)throw new Error("You must specify data.");var c=[];for(var d in a)c.push(d+"="+escape(a[d]));return b&&(c=c.concat(b)),c.join("&")},b.buildPath=function(a,b){if(null==b)return a;var c=[],d=a.indexOf("?");if(-1!=d){var e=a.slice(d+1);c=c.concat(e.split("&"))}return-1!=d?a.slice(0,d)+"?"+this._formatQueryString(b,c):a+"?"+this._formatQueryString(b,c)},b._isCrossDomain=function(a){var b=document.createElement("a");b.href=a.src;var c=document.createElement("a");c.href=location.href;var d=""!=b.hostname&&(b.port!=c.port||b.protocol!=c.protocol||b.hostname!=c.hostname);return d},b._isLocal=function(a){var b=document.createElement("a");return b.href=a.src,""==b.hostname&&"file:"==b.protocol},b.toString=function(){return"[PreloadJS AbstractLoader]"},carco.createjs.AbstractLoader=a}(),this.carco.createjs=this.carco.createjs||{},function(){"use strict";var a=function(a,b,c){this.init(a,b,c)},b=a.prototype=new carco.createjs.AbstractLoader,c=a;c.loadTimeout=8e3,c.LOAD_TIMEOUT=0,c.BINARY="binary",c.CSS="css",c.IMAGE="image",c.JAVASCRIPT="javascript",c.JSON="json",c.JSONP="jsonp",c.MANIFEST="manifest",c.SOUND="sound",c.SVG="svg",c.TEXT="text",c.XML="xml",c.POST="POST",c.GET="GET",b._basePath=null,b._crossOrigin="",b.useXHR=!0,b.stopOnError=!1,b.maintainScriptOrder=!0,b.next=null,b._typeCallbacks=null,b._extensionCallbacks=null,b._loadStartWasDispatched=!1,b._maxConnections=1,b._currentlyLoadingScript=null,b._currentLoads=null,b._loadQueue=null,b._loadQueueBackup=null,b._loadItemsById=null,b._loadItemsBySrc=null,b._loadedResults=null,b._loadedRawResults=null,b._numItems=0,b._numItemsLoaded=0,b._scriptOrder=null,b._loadedScripts=null,b.init=function(a,b,c){this._numItems=this._numItemsLoaded=0,this._paused=!1,this._loadStartWasDispatched=!1,this._currentLoads=[],this._loadQueue=[],this._loadQueueBackup=[],this._scriptOrder=[],this._loadedScripts=[],this._loadItemsById={},this._loadItemsBySrc={},this._loadedResults={},this._loadedRawResults={},this._typeCallbacks={},this._extensionCallbacks={},this._basePath=b,this.setUseXHR(a),this._crossOrigin=c===!0?"Anonymous":c===!1||null==c?"":c},b.setUseXHR=function(a){return this.useXHR=0!=a&&null!=window.XMLHttpRequest,this.useXHR},b.removeAll=function(){this.remove()},b.remove=function(a){var b=null;if(!a||a instanceof Array){if(a)b=a;else if(arguments.length>0)return}else b=[a];var c=!1;if(b){for(;b.length;){var d=b.pop(),e=this.getResult(d);for(f=this._loadQueue.length-1;f>=0;f--)if(g=this._loadQueue[f].getItem(),g.id==d||g.src==d){this._loadQueue.splice(f,1)[0].cancel();break}for(f=this._loadQueueBackup.length-1;f>=0;f--)if(g=this._loadQueueBackup[f].getItem(),g.id==d||g.src==d){this._loadQueueBackup.splice(f,1)[0].cancel();break}if(e)delete this._loadItemsById[e.id],delete this._loadItemsBySrc[e.src],this._disposeItem(e);else for(var f=this._currentLoads.length-1;f>=0;f--){var g=this._currentLoads[f].getItem();if(g.id==d||g.src==d){this._currentLoads.splice(f,1)[0].cancel(),c=!0;break}}}c&&this._loadNext()}else{this.close();for(var h in this._loadItemsById)this._disposeItem(this._loadItemsById[h]);this.init(this.useXHR)}},b.reset=function(){this.close();for(var a in this._loadItemsById)this._disposeItem(this._loadItemsById[a]);for(var b=[],c=0,d=this._loadQueueBackup.length;d>c;c++)b.push(this._loadQueueBackup[c].getItem());this.loadManifest(b,!1)},c.isBinary=function(a){switch(a){case carco.createjs.LoadQueue.IMAGE:case carco.createjs.LoadQueue.BINARY:return!0;default:return!1}},c.isText=function(a){switch(a){case carco.createjs.LoadQueue.TEXT:case carco.createjs.LoadQueue.JSON:case carco.createjs.LoadQueue.MANIFEST:case carco.createjs.LoadQueue.XML:case carco.createjs.LoadQueue.HTML:case carco.createjs.LoadQueue.CSS:case carco.createjs.LoadQueue.SVG:case carco.createjs.LoadQueue.JAVASCRIPT:return!0;default:return!1}},b.installPlugin=function(a){if(null!=a&&null!=a.getPreloadHandlers){var b=a.getPreloadHandlers();if(b.scope=a,null!=b.types)for(var c=0,d=b.types.length;d>c;c++)this._typeCallbacks[b.types[c]]=b;if(null!=b.extensions)for(c=0,d=b.extensions.length;d>c;c++)this._extensionCallbacks[b.extensions[c]]=b}},b.setMaxConnections=function(a){this._maxConnections=a,!this._paused&&this._loadQueue.length>0&&this._loadNext()},b.loadFile=function(a,b,c){if(null==a){var d=new carco.createjs.Event("error");return d.text="PRELOAD_NO_FILE",this._sendError(d),void 0}this._addItem(a,null,c),b!==!1?this.setPaused(!1):this.setPaused(!0)},b.loadManifest=function(a,b,d){var e=null,f=null;if(a instanceof Array){if(0==a.length){var g=new carco.createjs.Event("error");return g.text="PRELOAD_MANIFEST_EMPTY",this._sendError(g),void 0}e=a}else if("string"==typeof a)e=[{src:a,type:c.MANIFEST}];else{if("object"!=typeof a){var g=new carco.createjs.Event("error");return g.text="PRELOAD_MANIFEST_NULL",this._sendError(g),void 0}if(void 0!==a.src){if(null==a.type)a.type=c.MANIFEST;else if(a.type!=c.MANIFEST){var g=new carco.createjs.Event("error");g.text="PRELOAD_MANIFEST_ERROR",this._sendError(g)}e=[a]}else void 0!==a.manifest&&(e=a.manifest,f=a.path)}for(var h=0,i=e.length;i>h;h++)this._addItem(e[h],f,d);b!==!1?this.setPaused(!1):this.setPaused(!0)},b.load=function(){this.setPaused(!1)},b.getItem=function(a){return this._loadItemsById[a]||this._loadItemsBySrc[a]},b.getResult=function(a,b){var c=this._loadItemsById[a]||this._loadItemsBySrc[a];if(null==c)return null;var d=c.id;return b&&this._loadedRawResults[d]?this._loadedRawResults[d]:this._loadedResults[d]},b.setPaused=function(a){this._paused=a,this._paused||this._loadNext()},b.close=function(){for(;this._currentLoads.length;)this._currentLoads.pop().cancel();this._scriptOrder.length=0,this._loadedScripts.length=0,this.loadStartWasDispatched=!1},b._addItem=function(a,b,c){var d=this._createLoadItem(a,b,c);if(null!=d){var e=this._createLoader(d);null!=e&&(d._loader=e,this._loadQueue.push(e),this._loadQueueBackup.push(e),this._numItems++,this._updateProgress(),(this.maintainScriptOrder&&d.type==carco.createjs.LoadQueue.JAVASCRIPT||d.maintainOrder===!0)&&(this._scriptOrder.push(d),this._loadedScripts.push(null)))}},b._createLoadItem=function(a,b,c){var d=null;switch(typeof a){case"string":d={src:a};break;case"object":d=window.HTMLAudioElement&&a instanceof window.HTMLAudioElement?{tag:a,src:d.tag.src,type:carco.createjs.LoadQueue.SOUND}:a;break;default:return null}var e=this._parseURI(d.src);e.extension&&(d.ext=e.extension),null==d.type&&(d.type=this._getTypeByExtension(d.ext));var f="",g=c||this._basePath,h=d.src;if(!e.absolute&&!e.relative)if(b){f=b;var i=this._parseURI(b);h=b+h,null==g||i.absolute||i.relative||(f=g+f)}else null!=g&&(f=g);if(d.src=f+d.src,d.path=f,(d.type==carco.createjs.LoadQueue.JSON||d.type==carco.createjs.LoadQueue.MANIFEST)&&(d._loadAsJSONP=null!=d.callback),d.type==carco.createjs.LoadQueue.JSONP&&null==d.callback)throw new Error("callback is required for loading JSONP requests.");(void 0===d.tag||null===d.tag)&&(d.tag=this._createTag(d)),(void 0===d.id||null===d.id||""===d.id)&&(d.id=h);var j=this._typeCallbacks[d.type]||this._extensionCallbacks[d.ext];if(j){var k=j.callback.call(j.scope,d.src,d.type,d.id,d.data,f,this);if(k===!1)return null;k===!0||(null!=k.src&&(d.src=k.src),null!=k.id&&(d.id=k.id),null!=k.tag&&(d.tag=k.tag),null!=k.completeHandler&&(d.completeHandler=k.completeHandler),k.type&&(d.type=k.type),e=this._parseURI(d.src),null!=e.extension&&(d.ext=e.extension))}return this._loadItemsById[d.id]=d,this._loadItemsBySrc[d.src]=d,d},b._createLoader=function(a){var b=this.useXHR;switch(a.type){case carco.createjs.LoadQueue.JSON:case carco.createjs.LoadQueue.MANIFEST:b=!a._loadAsJSONP;break;case carco.createjs.LoadQueue.XML:case carco.createjs.LoadQueue.TEXT:b=!0;break;case carco.createjs.LoadQueue.SOUND:case carco.createjs.LoadQueue.JSONP:b=!1;break;case null:return null}return b?new carco.createjs.XHRLoader(a,this._crossOrigin):new carco.createjs.TagLoader(a)},b._loadNext=function(){if(!this._paused){this._loadStartWasDispatched||(this._sendLoadStart(),this._loadStartWasDispatched=!0),this._numItems==this._numItemsLoaded?(this.loaded=!0,this._sendComplete(),this.next&&this.next.load&&this.next.load()):this.loaded=!1;for(var a=0;a<this._loadQueue.length&&!(this._currentLoads.length>=this._maxConnections);a++){var b=this._loadQueue[a];this._canStartLoad(b)&&(this._loadQueue.splice(a,1),a--,this._loadItem(b))}}},b._loadItem=function(a){a.on("progress",this._handleProgress,this),a.on("complete",this._handleFileComplete,this),a.on("error",this._handleFileError,this),this._currentLoads.push(a),this._sendFileStart(a.getItem()),a.load()},b._handleFileError=function(a){var b=a.target;this._numItemsLoaded++,this._finishOrderedItem(b,!0),this._updateProgress();var c=new carco.createjs.Event("error");c.text="FILE_LOAD_ERROR",c.item=b.getItem(),this._sendError(c),this.stopOnError||(this._removeLoadItem(b),this._loadNext())},b._handleFileComplete=function(a){var b=a.target,c=b.getItem();this._loadedResults[c.id]=b.getResult(),b instanceof carco.createjs.XHRLoader&&(this._loadedRawResults[c.id]=b.getResult(!0)),this._removeLoadItem(b),this._finishOrderedItem(b)||this._processFinishedLoad(c,b)},b._finishOrderedItem=function(a,b){var c=a.getItem();if(this.maintainScriptOrder&&c.type==carco.createjs.LoadQueue.JAVASCRIPT||c.maintainOrder){a instanceof carco.createjs.TagLoader&&c.type==carco.createjs.LoadQueue.JAVASCRIPT&&(this._currentlyLoadingScript=!1);var d=carco.createjs.indexOf(this._scriptOrder,c);return-1==d?!1:(this._loadedScripts[d]=b===!0?!0:c,this._checkScriptLoadOrder(),!0)}return!1},b._checkScriptLoadOrder=function(){for(var a=this._loadedScripts.length,b=0;a>b;b++){var c=this._loadedScripts[b];if(null===c)break;if(c!==!0){var d=this._loadedResults[c.id];c.type==carco.createjs.LoadQueue.JAVASCRIPT&&(document.body||document.getElementsByTagName("body")[0]).appendChild(d);var e=c._loader;this._processFinishedLoad(c,e),this._loadedScripts[b]=!0}}},b._processFinishedLoad=function(a,b){if(a.type==carco.createjs.LoadQueue.MANIFEST){var c=b.getResult();null!=c&&void 0!==c.manifest&&this.loadManifest(c,!0)}this._numItemsLoaded++,this._updateProgress(),this._sendFileComplete(a,b),this._loadNext()},b._canStartLoad=function(a){if(!this.maintainScriptOrder||a instanceof carco.createjs.XHRLoader)return!0;var b=a.getItem();if(b.type!=carco.createjs.LoadQueue.JAVASCRIPT)return!0;if(this._currentlyLoadingScript)return!1;for(var c=this._scriptOrder.indexOf(b),d=0;c>d;){var e=this._loadedScripts[d];if(null==e)return!1;d++}return this._currentlyLoadingScript=!0,!0},b._removeLoadItem=function(a){var b=a.getItem();delete b._loader,delete b._loadAsJSONP;for(var c=this._currentLoads.length,d=0;c>d;d++)if(this._currentLoads[d]==a){this._currentLoads.splice(d,1);break}},b._handleProgress=function(a){var b=a.target;this._sendFileProgress(b.getItem(),b.progress),this._updateProgress()},b._updateProgress=function(){var a=this._numItemsLoaded/this._numItems,b=this._numItems-this._numItemsLoaded;if(b>0){for(var c=0,d=0,e=this._currentLoads.length;e>d;d++)c+=this._currentLoads[d].progress;a+=c/b*(b/this._numItems)}this._sendProgress(a)},b._disposeItem=function(a){delete this._loadedResults[a.id],delete this._loadedRawResults[a.id],delete this._loadItemsById[a.id],delete this._loadItemsBySrc[a.src]},b._createTag=function(a){var b=null;switch(a.type){case carco.createjs.LoadQueue.IMAGE:return b=document.createElement("img"),""==this._crossOrigin||this._isLocal(a)||(b.crossOrigin=this._crossOrigin),b;case carco.createjs.LoadQueue.SOUND:return b=document.createElement("audio"),b.autoplay=!1,b;case carco.createjs.LoadQueue.JSON:case carco.createjs.LoadQueue.JSONP:case carco.createjs.LoadQueue.JAVASCRIPT:case carco.createjs.LoadQueue.MANIFEST:return b=document.createElement("script"),b.type="text/javascript",b;case carco.createjs.LoadQueue.CSS:return b=this.useXHR?document.createElement("style"):document.createElement("link"),b.rel="stylesheet",b.type="text/css",b;case carco.createjs.LoadQueue.SVG:return this.useXHR?b=document.createElement("svg"):(b=document.createElement("object"),b.type="image/svg+xml"),b}return null},b._getTypeByExtension=function(a){if(null==a)return carco.createjs.LoadQueue.TEXT;switch(a.toLowerCase()){case"jpeg":case"jpg":case"gif":case"png":case"webp":case"bmp":return carco.createjs.LoadQueue.IMAGE;case"ogg":case"mp3":case"wav":return carco.createjs.LoadQueue.SOUND;case"json":return carco.createjs.LoadQueue.JSON;case"xml":return carco.createjs.LoadQueue.XML;case"css":return carco.createjs.LoadQueue.CSS;case"js":return carco.createjs.LoadQueue.JAVASCRIPT;case"svg":return carco.createjs.LoadQueue.SVG;default:return carco.createjs.LoadQueue.TEXT}},b._sendFileProgress=function(a,b){if(this._isCanceled())return this._cleanUp(),void 0;if(this.hasEventListener("fileprogress")){var c=new carco.createjs.Event("fileprogress");c.progress=b,c.loaded=b,c.total=1,c.item=a,this.dispatchEvent(c)}},b._sendFileComplete=function(a,b){if(!this._isCanceled()){var c=new carco.createjs.Event("fileload");c.loader=b,c.item=a,c.result=this._loadedResults[a.id],c.rawResult=this._loadedRawResults[a.id],a.completeHandler&&a.completeHandler(c),this.hasEventListener("fileload")&&this.dispatchEvent(c)}},b._sendFileStart=function(a){var b=new carco.createjs.Event("filestart");b.item=a,this.hasEventListener("filestart")&&this.dispatchEvent(b)},b.toString=function(){return"[PreloadJS LoadQueue]"},carco.createjs.LoadQueue=a;var d=function(){};d.init=function(){var a=navigator.userAgent;d.isFirefox=a.indexOf("Firefox")>-1,d.isOpera=null!=window.opera,d.isChrome=a.indexOf("Chrome")>-1,d.isIOS=a.indexOf("iPod")>-1||a.indexOf("iPhone")>-1||a.indexOf("iPad")>-1},d.init(),carco.createjs.LoadQueue.BrowserDetect=d}(),this.carco.createjs=this.carco.createjs||{},function(){"use strict";var a=function(a){this.init(a)},b=a.prototype=new carco.createjs.AbstractLoader;b._loadTimeout=null,b._tagCompleteProxy=null,b._isAudio=!1,b._tag=null,b._jsonResult=null,b.init=function(a){this._item=a,this._tag=a.tag,this._isAudio=window.HTMLAudioElement&&a.tag instanceof window.HTMLAudioElement,this._tagCompleteProxy=carco.createjs.proxy(this._handleLoad,this)},b.getResult=function(){return this._item.type==carco.createjs.LoadQueue.JSONP||this._item.type==carco.createjs.LoadQueue.MANIFEST?this._jsonResult:this._tag},b.cancel=function(){this.canceled=!0,this._clean()},b.load=function(){var a=this._item,b=this._tag;clearTimeout(this._loadTimeout);var c=carco.createjs.LoadQueue.LOAD_TIMEOUT;0==c&&(c=carco.createjs.LoadQueue.loadTimeout),this._loadTimeout=setTimeout(carco.createjs.proxy(this._handleTimeout,this),c),this._isAudio&&(b.src=null,b.preload="auto"),b.onerror=carco.createjs.proxy(this._handleError,this),this._isAudio?(b.onstalled=carco.createjs.proxy(this._handleStalled,this),b.addEventListener("canplaythrough",this._tagCompleteProxy,!1)):(b.onload=carco.createjs.proxy(this._handleLoad,this),b.onreadystatechange=carco.createjs.proxy(this._handleReadyStateChange,this));var d=this.buildPath(a.src,a.values);switch(a.type){case carco.createjs.LoadQueue.CSS:b.href=d;break;case carco.createjs.LoadQueue.SVG:b.data=d;break;default:b.src=d}if(a.type==carco.createjs.LoadQueue.JSONP||a.type==carco.createjs.LoadQueue.JSON||a.type==carco.createjs.LoadQueue.MANIFEST){if(null==a.callback)throw new Error("callback is required for loading JSONP requests.");if(null!=window[a.callback])throw new Error('JSONP callback "'+a.callback+'" already exists on window. You need to specify a different callback. Or re-name the current one.');window[a.callback]=carco.createjs.proxy(this._handleJSONPLoad,this)}if(a.type==carco.createjs.LoadQueue.SVG||a.type==carco.createjs.LoadQueue.JSONP||a.type==carco.createjs.LoadQueue.JSON||a.type==carco.createjs.LoadQueue.MANIFEST||a.type==carco.createjs.LoadQueue.JAVASCRIPT||a.type==carco.createjs.LoadQueue.CSS){this._startTagVisibility=b.style.visibility,b.style.visibility="hidden";var e=document.body||document.getElementsByTagName("body")[0];if(null==e){if(a.type==carco.createjs.LoadQueue.SVG)return this._handleSVGError(),void 0;e=document.head||document.getElementsByTagName("head")}e.appendChild(b)}null!=b.load&&b.load()},b._handleSVGError=function(){this._clean();var a=new carco.createjs.Event("error");a.text="SVG_NO_BODY",this._sendError(a)},b._handleJSONPLoad=function(a){this._jsonResult=a},b._handleTimeout=function(){this._clean();var a=new carco.createjs.Event("error");a.text="PRELOAD_TIMEOUT",this._sendError(a)},b._handleStalled=function(){},b._handleError=function(){this._clean();var a=new carco.createjs.Event("error");this._sendError(a)},b._handleReadyStateChange=function(){clearTimeout(this._loadTimeout);var a=this.getItem().tag;("loaded"==a.readyState||"complete"==a.readyState)&&this._handleLoad()},b._handleLoad=function(){if(!this._isCanceled()){var a=this.getItem(),b=a.tag;if(!(this.loaded||this._isAudio&&4!==b.readyState)){switch(this.loaded=!0,a.type){case carco.createjs.LoadQueue.SVG:case carco.createjs.LoadQueue.JSON:case carco.createjs.LoadQueue.JSONP:case carco.createjs.LoadQueue.MANIFEST:case carco.createjs.LoadQueue.CSS:b.style.visibility=this._startTagVisibility,b.parentNode&&b.parentNode.contains(b)&&b.parentNode.removeChild(b)}this._clean(),this._sendComplete()}}},b._clean=function(){clearTimeout(this._loadTimeout);var a=this.getItem(),b=a.tag;null!=b&&(b.onload=null,b.removeEventListener&&b.removeEventListener("canplaythrough",this._tagCompleteProxy,!1),b.onstalled=null,b.onprogress=null,b.onerror=null,null!=b.parentNode&&a.type==carco.createjs.LoadQueue.SVG&&a.type==carco.createjs.LoadQueue.JSON&&a.type==carco.createjs.LoadQueue.MANIFEST&&a.type==carco.createjs.LoadQueue.CSS&&a.type==carco.createjs.LoadQueue.JSONP&&b.parentNode.removeChild(b));var a=this.getItem();(a.type==carco.createjs.LoadQueue.JSONP||a.type==carco.createjs.LoadQueue.MANIFEST)&&(window[a.callback]=null)},b.toString=function(){return"[PreloadJS TagLoader]"},carco.createjs.TagLoader=a}(),this.carco.createjs=this.carco.createjs||{},function(){"use strict";var a=function(a,b){this.init(a,b)},b=a;b.ACTIVEX_VERSIONS=["Msxml2.XMLHTTP.6.0","Msxml2.XMLHTTP.5.0","Msxml2.XMLHTTP.4.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"];var c=a.prototype=new carco.createjs.AbstractLoader;c._request=null,c._loadTimeout=null,c._xhrLevel=1,c._response=null,c._rawResponse=null,c._crossOrigin="",c.init=function(a,b){this._item=a,this._crossOrigin=b,!this._createXHR(a)},c.getResult=function(a){return a&&this._rawResponse?this._rawResponse:this._response},c.cancel=function(){this.canceled=!0,this._clean(),this._request.abort()},c.load=function(){if(null==this._request)return this._handleError(),void 0;if(this._request.onloadstart=carco.createjs.proxy(this._handleLoadStart,this),this._request.onprogress=carco.createjs.proxy(this._handleProgress,this),this._request.onabort=carco.createjs.proxy(this._handleAbort,this),this._request.onerror=carco.createjs.proxy(this._handleError,this),this._request.ontimeout=carco.createjs.proxy(this._handleTimeout,this),1==this._xhrLevel){var a=carco.createjs.LoadQueue.LOAD_TIMEOUT;if(0==a)a=carco.createjs.LoadQueue.loadTimeout;else try{console.warn("LoadQueue.LOAD_TIMEOUT has been deprecated in favor of LoadQueue.loadTimeout")}catch(b){}this._loadTimeout=setTimeout(carco.createjs.proxy(this._handleTimeout,this),a)}this._request.onload=carco.createjs.proxy(this._handleLoad,this),this._request.onreadystatechange=carco.createjs.proxy(this._handleReadyStateChange,this);try{this._item.values&&this._item.method!=carco.createjs.LoadQueue.GET?this._item.method==carco.createjs.LoadQueue.POST&&this._request.send(this._formatQueryString(this._item.values)):this._request.send()}catch(c){var d=new carco.createjs.Event("error");d.error=c,this._sendError(d)}},c.getAllResponseHeaders=function(){return this._request.getAllResponseHeaders instanceof Function?this._request.getAllResponseHeaders():null},c.getResponseHeader=function(a){return this._request.getResponseHeader instanceof Function?this._request.getResponseHeader(a):null},c._handleProgress=function(a){if(a&&!(a.loaded>0&&0==a.total)){var b=new carco.createjs.Event("progress");b.loaded=a.loaded,b.total=a.total,this._sendProgress(b)}},c._handleLoadStart=function(){clearTimeout(this._loadTimeout),this._sendLoadStart()},c._handleAbort=function(){this._clean();var a=new carco.createjs.Event("error");a.text="XHR_ABORTED",this._sendError(a)},c._handleError=function(){this._clean();var a=new carco.createjs.Event("error");this._sendError(a)},c._handleReadyStateChange=function(){4==this._request.readyState&&this._handleLoad()},c._handleLoad=function(){if(!this.loaded){if(this.loaded=!0,!this._checkError())return this._handleError(),void 0;this._response=this._getResponse(),this._clean();var a=this._generateTag();a&&this._sendComplete()}},c._handleTimeout=function(a){this._clean();var b=new carco.createjs.Event("error");b.text="PRELOAD_TIMEOUT",this._sendError(a)},c._checkError=function(){var a=parseInt(this._request.status);switch(a){case 404:case 0:return!1}return!0},c._getResponse=function(){if(null!=this._response)return this._response;if(null!=this._request.response)return this._request.response;try{if(null!=this._request.responseText)return this._request.responseText}catch(a){}try{if(null!=this._request.responseXML)return this._request.responseXML}catch(a){}return null},c._createXHR=function(a){var c=this._isCrossDomain(a),d={},e=null;if(window.XMLHttpRequest)e=new XMLHttpRequest,c&&void 0===e.withCredentials&&window.XDomainRequest&&(e=new XDomainRequest);else{for(var f=0,g=b.ACTIVEX_VERSIONS.length;g>f;f++){b.ACTIVEX_VERSIONS[f];try{e=new ActiveXObject(axVersions);break}catch(h){}}if(null==e)return!1}carco.createjs.LoadQueue.isText(a.type)&&e.overrideMimeType&&e.overrideMimeType("text/plain; charset=utf-8"),this._xhrLevel="string"==typeof e.responseType?2:1;var i=null;if(i=a.method==carco.createjs.LoadQueue.GET?this.buildPath(a.src,a.values):a.src,e.open(a.method||carco.createjs.LoadQueue.GET,i,!0),c&&e instanceof XMLHttpRequest&&1==this._xhrLevel&&(d.Origin=location.origin),a.values&&a.method==carco.createjs.LoadQueue.POST&&(d["Content-Type"]="application/x-www-form-urlencoded"),c||d["X-Requested-With"]||(d["X-Requested-With"]="XMLHttpRequest"),a.headers)for(var j in a.headers)d[j]=a.headers[j];carco.createjs.LoadQueue.isBinary(a.type)&&(e.responseType="arraybuffer");for(j in d)e.setRequestHeader(j,d[j]);return this._request=e,!0},c._clean=function(){clearTimeout(this._loadTimeout);var a=this._request;a.onloadstart=null,a.onprogress=null,a.onabort=null,a.onerror=null,a.onload=null,a.ontimeout=null,a.onloadend=null,a.onreadystatechange=null},c._generateTag=function(){var a=this._item.type,b=this._item.tag;switch(a){case carco.createjs.LoadQueue.IMAGE:return b.onload=carco.createjs.proxy(this._handleTagReady,this),""!=this._crossOrigin&&(b.crossOrigin="Anonymous"),b.src=this.buildPath(this._item.src,this._item.values),this._rawResponse=this._response,this._response=b,!1;case carco.createjs.LoadQueue.JAVASCRIPT:return b=document.createElement("script"),b.text=this._response,this._rawResponse=this._response,this._response=b,!0;case carco.createjs.LoadQueue.CSS:var c=document.getElementsByTagName("head")[0];if(c.appendChild(b),b.styleSheet)b.styleSheet.cssText=this._response;else{var d=document.createTextNode(this._response);b.appendChild(d)}return this._rawResponse=this._response,this._response=b,!0;case carco.createjs.LoadQueue.XML:var e=this._parseXML(this._response,"text/xml");return this._rawResponse=this._response,this._response=e,!0;case carco.createjs.LoadQueue.SVG:var e=this._parseXML(this._response,"image/svg+xml");return this._rawResponse=this._response,null!=e.documentElement?(b.appendChild(e.documentElement),this._response=b):this._response=e,!0;case carco.createjs.LoadQueue.JSON:case carco.createjs.LoadQueue.MANIFEST:var f={};try{f=JSON.parse(this._response)}catch(g){f=g}return this._rawResponse=this._response,this._response=f,!0}return!0},c._parseXML=function(a,b){var c=null;try{if(window.DOMParser){var d=new DOMParser;c=d.parseFromString(a,b)}else c=new ActiveXObject("Microsoft.XMLDOM"),c.async=!1,c.loadXML(a)}catch(e){}return c},c._handleTagReady=function(){var a=this._item.tag;a&&(a.onload=null),this._sendComplete()},c.toString=function(){return"[PreloadJS XHRLoader]"},carco.createjs.XHRLoader=a}(),"object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(a){return 10>a?"0"+a:a}function quote(a){return escapable.lastIndex=0,escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return"string"==typeof b?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(a,b){var c,d,e,f,g,h=gap,i=b[a];switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(a)),"function"==typeof rep&&(i=rep.call(b,a,i)),typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";if(gap+=indent,g=[],"[object Array]"===Object.prototype.toString.apply(i)){for(f=i.length,c=0;f>c;c+=1)g[c]=str(c,i)||"null";return e=0===g.length?"[]":gap?"[\n"+gap+g.join(",\n"+gap)+"\n"+h+"]":"["+g.join(",")+"]",gap=h,e}if(rep&&"object"==typeof rep)for(f=rep.length,c=0;f>c;c+=1)"string"==typeof rep[c]&&(d=rep[c],e=str(d,i),e&&g.push(quote(d)+(gap?": ":":")+e));else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&g.push(quote(d)+(gap?": ":":")+e));return e=0===g.length?"{}":gap?"{\n"+gap+g.join(",\n"+gap)+"\n"+h+"}":"{"+g.join(",")+"}",gap=h,e}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;"function"!=typeof JSON.stringify&&(JSON.stringify=function(a,b,c){var d;if(gap="",indent="","number"==typeof c)for(d=0;c>d;d+=1)indent+=" ";else"string"==typeof c&&(indent=c);if(rep=b,b&&"function"!=typeof b&&("object"!=typeof b||"number"!=typeof b.length))throw new Error("JSON.stringify");return str("",{"":a})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&"object"==typeof e)for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),void 0!==d?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;if(text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();
};

carco.functions.plugin("runoutside", false, function() {
    return function(c) {
        if (!carco.functions.loaded){
            setTimeout(function() {
                carco.functions.runoutside(c);
            },500);
        }else{
            if (c) c();
        };
    }
})


carco.functions.plugin("url", false, function() {
    return {
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
})

carco.functions.plugin("console", false, function() {
    return function (data) {
        if (carco.consoleDisable !== true && console !== undefined) {
            console.log(data);
        }
    };
})

carco.functions.plugin("randomString", false, function() {
    return {
        math10: function () {
            return Math.random().toString(36).substring(7);
        }
    };
});

carco.functions.plugin("browser", false, function() {
    return {
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
        },
        Firefox: function() {
            return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        },
        Safari: function() {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf('safari') != -1) {
                if (ua.indexOf('chrome') > -1||navigator.userAgent.match('CriOS')) {
                    return false
                } else {
                    return true
                };
            };
        }
    }
})

carco.functions.plugin("oldbrowsersupport", "ie8", function() {
    return function() {
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function(elt) {
                var len = this.length >>> 0;
                var from = Number(arguments[1]) || 0;
                from = (from < 0)
                    ? Math.ceil(from)
                    : Math.floor(from);
                if (from < 0)
                    from += len;

                for (; from < len; from++) {
                    if (from in this &&
                        this[from] === elt)
                        return from;
                }
                return -1;
            };
        };

        (function() {
            if (!document.getElementsByClassName) {
                var indexOf = [].indexOf || function(prop) {
                        for (var i = 0; i < this.length; i++) {
                            if (this[i] === prop) return i;
                        }
                        return -1;
                    };
                getElementsByClassName = function(className,context) {
                    var elems = document.querySelectorAll ? context.querySelectorAll("." + className) : (function() {
                        var all = context.getElementsByTagName("*"),
                            elements = [],
                            i = 0;
                        for (; i < all.length; i++) {
                            if (all[i].className && (" " + all[i].className + " ").indexOf(" " + className + " ") > -1 && indexOf.call(elements,all[i]) === -1) elements.push(all[i]);
                        }
                        return elements;
                    })();
                    return elems;
                };
                document.getElementsByClassName = function(className) {
                    return getElementsByClassName(className,document);
                };
                Element.prototype.getElementsByClassName = function(className) {
                    return getElementsByClassName(className,this);
                };
            }
        })()
    }
});

carco.functions.plugin("isMobile", false, function() {
    return {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            var ieMobile = navigator.userAgent.match(/IEMobile/i);
            if (!ieMobile) ieMobile = navigator.userAgent.match(/Tablet PC/i);
            return ieMobile;
        },
        any: function () {
            return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
        },
        androidApp: function() {
            return window.location.pathname.match("android_asset/www");
        }
    }
})

carco.project.plugin("config", false, function() {
    return function(config) {

        var name = config.name;
        var appname = config.appname;
        var callback = config.callback;
        var title = config.title;
        var version = config.version;
        if (!version) version = "1.00";

        if (name){

            if (!carco.project[name]) carco.project[name] = {};
            if (!carco.project[name].filenames)  carco.project[name].filenames = [];
            carco.project[name].preconfig = true;

            if (config.filenames){
                for (var a = 0; a < config.filenames.length; a++) {
                    carco.project[name].filenames.push(config.filenames[a]);
                };
            };

            carco.project[name].start = function(wapplr, parent, script, files){

                carco.project[name].version = version;
                carco.functions.console("Wapplr "+title+" "+carco.project[name].version+", current host: "+carco.project[name].hosts[carco.project[name].currentHost]);

                var user_attributes = {};
                if (script){
                    for (var x in script.attributes){
                        var avalue = script.getAttribute(script.attributes[x].name);
                        if (avalue&&script.attributes[x].name) {
                            user_attributes[script.attributes[x].name] = script.getAttribute(script.attributes[x].name);
                        };
                    };
                };

                var item = carco.functions.children.createHTML({type:"div", attr:{}, vars:{}, carco:{
                    wapplr:wapplr,
                    response:{},
                    currentScript: script,
                    paramsdata:{
                        user:user_attributes,
                        files:files
                    }
                }});

                item.carco.root = item;
                if (script) script.carco = item.carco;
                if (parent) parent.appendChild(item);

                carco.project[name].parentready(carco.project[name].userstart, item);

            };

            carco.project[name].userstart = function(root) {
                carco.project[name].loadTimer("Wapplr "+title+" Start ", false, name);
                if (callback) callback(root, root.carco.paramsdata.user);
            };

        };
    }
});

window.onload = function() {
    carco.functions.oldbrowsersupport.ie8();
	

};
document.addEventListener('DOMContentLoaded', function () {
    // Add keyup event listener
    document.addEventListener('keyup', function (event) {
        if (event.key === 'Escape') {
            window.parent.postMessage({
                type: 'escPressed'

            }, '*');
        }
    });
});