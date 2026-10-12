carco.functions.drag = {
    inner_up_mobile: function(ev, x, y, type) {
        if (!carco.drag.currentdrag) carco.drag.currentdrag = {};
        var item = carco.drag.currentdrag.item;
        if (item&&item.carco) var drag = item.carco.drag;
        var enable = carco.drag.innerupenable;
        if (drag&&drag.process==2&&enable){
            if (item.carco.activeitem&&item.carco.activeitem.parentElement == item) {
                item.carco.activeitem.style.visibility = "hidden";
                item.carco.activeitem.carco.style.visibility = "hidden";
            };

            if (ev) var x = carco.functions.event.xy(ev, "X", "page");
            if (ev) var y = carco.functions.event.xy(ev, "Y", "page");

            var scrollLeft = carco.functions.position.scrollLeft();
            var scrollTop = carco.functions.position.scrollTop();
            var scrollLeftDiv = carco.functions.position.scrollLeft(item);
            var scrollTopDiv = carco.functions.position.scrollTop(item);

            var scrollChangeLeft = scrollLeftDiv - drag.startDocScrollLeft
            var scrollChangeTop = scrollTopDiv - drag.startDocScrollTop

            if (carco.functions.browser.IE() == 10&&carco.functions.isMobile.any()||carco.functions.browser.IE() == 11&&carco.functions.isMobile.IeMobile()) {
                var scrollChangeLeft = 0
                var scrollChangeTop = 0
            };

            var root = item.carco.root;
            if (root){
                var rootbounds = root.getBoundingClientRect();
                var rootleft = rootbounds.left+scrollLeft;
                var roottop = rootbounds.top+scrollTop;
            };

            if (x<rootleft||y<roottop||!x&&x!==0||!y&&y!==0){
                drag.upeventx = false
                drag.upeventy = false
                var place = false;
                if (item.carco.game.tempinners){
                    for (var i = 0; i < item.carco.game.tempinners.length; i++) {
                        if (item.carco.game.tempinners[i].carco.customparams.gametype == "place"||item.carco.game.tempinners[i].carco.customparams.gametype == "coordinate") place = item.carco.game.tempinners[i];
                    };
                    drag.place = place;
                };
            }else{
                drag.upeventx = x
                drag.upeventy = y
                if (carco.functions.browser.IE() == 10&&carco.functions.isMobile.any()||carco.functions.browser.IE() == 11&&carco.functions.isMobile.IeMobile()) {
                    var coordinate = false;
                    var disablemagnet = false;
                    for (var c in item.carco.root.carco.recursivechildren){
                        if (item.carco.root.carco.recursivechildren[c].carco.customparams.gametype == "coordinate"){
                            coordinate = true;
                        };
                    };
                    if (item.carco.customparams.disablemagnet) disablemagnet = true
                    if (coordinate||disablemagnet) drag.inner_move(false, {toppx: y + scrollChangeTop, leftpx: x + scrollChangeLeft})
                }else{
                    drag.inner_move(false, {toppx: y + scrollChangeTop, leftpx: x + scrollChangeLeft})
                };
            };

            document.body.style.cursor = "default";

            if (!carco.drag.mobiletimeout) carco.drag.mobiletimeout = 0
            if (carco.functions.browser.IE() == 10&&carco.functions.isMobile.any()||carco.functions.browser.IE() == 11&&carco.functions.isMobile.IeMobile()) {
                carco.drag.mobiletimeout = 0;
            };
            if (carco.functions.browser.IE() == 11&&carco.functions.isMobile.any()) {
                carco.drag.mobiletimeout = 0;
            };

            drag.up(ev);
            carco.drag.innerdownenable = false;
            drag.run(item, 1, 1);
            carco.drag.currentdrag.tempitem = carco.drag.currentdrag.item;
            carco.drag.currentdrag.item = false;
        };
    }
};

carco.drag = function(item, moveitem) {
    var object = {
        init: function(item, moveitem) {
            this.item = item;
            if (!this.item.carco) this.item.carco = {}
            this.item.carco.drag = this;
            if (!this.item.carco.on){
                this.item.carco.on = function(type, fn) {
                    carco.functions.listeners.add(this.item, type, fn);
                };
            };
            if (!this.item.carco.off) {
                this.item.carco.off = function(type, fn) {
                    carco.functions.listeners.remove(this.item, type, fn);
                };
            };
            if (moveitem){
                this.item.carco.drag.moveitem = moveitem
                for (var x in moveitem){
                    if (!moveitem[x].carco) carco.container(moveitem[x]);
                    if (!moveitem[x].carco.drag) carco.drag(moveitem[x])
                };
            };
        },
        run: function(add, p, lp) {
            if (!carco.drag.currentdrag) carco.drag.currentdrag = {};
            var run = [];
            if (carco.drag.currentdrag.item&&carco.drag.currentdrag.item !== add){
                run.push([carco.drag.currentdrag.item, "remove"])
                run.push([add, "add"]);
            }else{
                if (!carco.drag.currentdrag.item) run.push([add, "add"]);
                if (carco.drag.currentdrag.item) run.push([add, "remove"]);
            };
            for (var i = 0; i < run.length; i++) {
                if (run[i][1] == "remove"){
                    carco.drag.currentdrag.tempitem = run[i][0];
                    carco.drag.currentdrag.item = false;
                    if (lp) run[i][0].carco.drag.process = lp;
                };
                if (run[i][1] == "add"){
                    carco.drag.currentdrag.item = run[i][0];
                    if (run[i][0]) {
                        if (p) run[i][0].carco.drag.process = p;
                    };
                };
            };
        },
        get: function() {
            if (carco.createjs.Touch.isSupported()&&item.carco.root&&item.carco.root.carco.paramsdata&&item.carco.root.carco.paramsdata.system.usertype == "user"||
                carco.functions.isMobile.any()&&item.carco.root&&item.carco.root.carco.paramsdata&&item.carco.root.carco.paramsdata.system.usertype == "user"){
                var drag = item.carco.drag

                if (!item.carco.root.carco.addMouseUpListenerToDocument){
                    if (carco.functions.browser.IE() > 9 && carco.functions.isMobile.any()) {
                        carco.functions.listeners.add(document, "mousedown", carco.functions.drag.inner_up_mobile);
                    } else {
                        carco.functions.listeners.add(document, "mousedown", carco.functions.drag.inner_up_mobile);
                    };
                    item.carco.root.carco.addMouseUpListenerToDocument = true;
                };

                if (!drag.process||drag.process&&drag.process < 1) {
                    if (carco.functions.browser.IE() > 9 && carco.functions.isMobile.any()) {
                        this.item.carco.on("pointerdown", drag.inner_down_mobile_start);
                        this.item.carco.on("pointerup", drag.inner_down_mobile);
                    }else{
                        this.item.carco.on("mousedown", drag.inner_down_mobile_start);
                        this.item.carco.on("mouseup", drag.inner_down_mobile);
                    };
                };
                drag.process = 1;
            }else{
                this.item.carco.off("mousedown", this.inner_down);
                this.item.carco.off("mousedown", this.down);
                this.item.carco.on("mousedown", this.inner_down);
                this.item.carco.on("mousedown", this.down);
            };
        },
        inner_down_mobile_start: function(ev, x, y){
            carco.drag.innerdownenable = true;
            var target = carco.functions.event.target(ev);
            if (target&&!target.carco||target&&target.carco&&!target.carco.drag){
                function searchParent(item) {
                    if (item.carco&&item.carco.drag){
                        target = item;
                    }else{
                        if (item.carco&&item.carco.parent) {
                            searchParent(item.carco.parent);
                        }else{
                            searchParent(item.parentElement);
                        };
                    };
                };
                searchParent(target);
            };
            var item = target.carco.drag.item;
            var drag = target.carco.drag;
            if (carco.drag.currentdrag&&carco.drag.currentdrag.item&&carco.drag.currentdrag.item !== target){
                if (!target.carco.game||!target.carco.game.inners||target.carco.game&&target.carco.game.inners&&!target.carco.game.inners[0]){
                    var tempitem = carco.drag.currentdrag.item;
                    if (carco.drag.currentdrag.item&&carco.drag.currentdrag.item.carco.game&&carco.drag.currentdrag.item.carco.game.tempinners&&carco.drag.currentdrag.item.carco.game.tempinners[0]){
                        target.carco.drag.up()
                    };
                    carco.drag.currentdrag.item = tempitem;
                    carco.drag.currentdrag.item.carco.drag.run(carco.drag.currentdrag.item, 1, 1);
                }else{};
            }else {

            };
        },
        inner_down_mobile: function(ev, x, y){
            document.body.style.cursor = "pointer";
            if (carco.drag.innerdownenable){
                var target = false;
                if (!isNaN(x)) target = x;
                var target = carco.functions.event.target(ev);
                if (target.carco&&target.carco.drag) {} else {
                    target = this;
                };

                var item = target.carco.drag.item;
                var drag = target.carco.drag;
                var process = drag.process;
                if (process == 2){
                    if (item == target){
                        var tempitem = carco.drag.currentdrag.tempitem
                        if (tempitem&&tempitem == item){
                            if (tempitem.carco.setStyle) {
                                if (tempitem.carco.activeitem&&tempitem.carco.activeitem.parentElement == tempitem){
                                    tempitem.carco.activeitem.style.visibility = "hidden";
                                    tempitem.carco.activeitem.carco.style.visibility = "hidden";
                                };
                            };
                        };
                        drag.run(item, 1, 1)
                    }else{
                        carco.drag.innerupenable = false;
                        drag.run(item, 1, 1)
                    };
                };

                if (process == 1){
                    drag.run(item, 2, 1);
                    var tempitem = carco.drag.currentdrag.tempitem;
                    if (tempitem&&tempitem !== item){
                        if (tempitem.carco.setStyle) {
                            if (tempitem.carco.activeitem&&tempitem.carco.activeitem.parentElement == tempitem){
                                tempitem.carco.activeitem.style.visibility = "hidden";
                                tempitem.carco.activeitem.carco.style.visibility = "hidden";
                            };
                        };
                    };

                    if (item.carco.activeitem){
                        item.carco.activeitem.style.visibility = "visible";
                        item.carco.activeitem.carco.style.visibility = "visible";
                    };

                    var scrollLeft = carco.functions.position.scrollLeft()
                    var scrollTop = carco.functions.position.scrollTop()

                    var top = Math.round(item.offsetTop);
                    var left = Math.round(item.offsetLeft);

                    if (drag.moveitem){
                        for (var x in drag.moveitem){
                            drag.moveitem[x].carco.drag.startleft = drag.moveitem[x].carco.position.absolute.x + scrollLeft;
                            drag.moveitem[x].carco.drag.starttop = drag.moveitem[x].carco.position.absolute.y + scrollTop;
                        };
                    };

                    var parent_width = item.parentElement.offsetWidth;
                    var parent_height = item.parentElement.offsetHeight;
                    if (!parent_height) parent_height = window.innerHeight
                    if (ev) drag.startx = carco.functions.event.xy(ev, "X")
                    if (ev) drag.starty = carco.functions.event.xy(ev, "Y")
                    if (!ev) {
                        drag.startx = left + scrollLeft;
                        drag.starty = top + scrollTop;
                    };

                    drag.startleft = left
                    drag.starttop = top
                    drag.itembounds = item.getBoundingClientRect();
                    drag.parent_width = parent_width
                    drag.parent_height = parent_height;
                    drag.docScrollLeft = carco.functions.position.scrollLeft()
                    drag.docScrollTop = carco.functions.position.scrollTop()
                    drag.startDocScrollLeft = carco.functions.position.scrollLeft(item)
                    drag.startDocScrollTop = carco.functions.position.scrollTop(item)
                    drag.itemOffsetWidth = item.offsetWidth;
                    drag.itemOffsetHeight = item.offsetHeight;

                    var leftend = left / parent_width * 100 +"%";
                    var topend = top / parent_height * 100 +"%";

                    item.style.left = leftend;
                    item.style.top = topend;
                    drag.down(ev);
                    carco.drag.innerupenable = true;
                };
            };

        },
        inner_up_mobile: function(ev, x, y) {
            var type = "external";
            carco.functions.drag.inner_up_mobile(ev, x, y, type);
        },
        inner_down: function(ev, target) {
            document.body.style.cursor = "pointer";
            if (!target) var target = carco.functions.event.target(ev);
            if (target.carco&&target.carco.drag) {} else {
                target = this;
            };
            var item = target.carco.drag.item;
            var drag = target.carco.drag;

            if (!carco.drag.currentdrag) carco.drag.currentdrag = {};
            if (carco.drag.currentdrag.tempitem == undefined) carco.drag.currentdrag.tempitem = carco.drag.currentdrag.item;
            carco.drag.currentdrag.item = item;

            var scrollLeft = carco.functions.position.scrollLeft()
            var scrollTop = carco.functions.position.scrollTop()

            var top = Math.round(item.offsetTop);
            var left = Math.round(item.offsetLeft);

            if (drag.moveitem){
                for (var x in drag.moveitem){
                    drag.moveitem[x].carco.drag.startleft = drag.moveitem[x].carco.position.absolute.x + scrollLeft;
                    drag.moveitem[x].carco.drag.starttop = drag.moveitem[x].carco.position.absolute.y + scrollTop;
                };
            };

            var parent_width = item.parentElement.offsetWidth;
            var parent_height = item.parentElement.offsetHeight;
            if (!parent_height) parent_height = window.innerHeight
            if (ev) drag.startx = carco.functions.event.xy(ev, "X")
            if (ev) drag.starty = carco.functions.event.xy(ev, "Y")
            if (!ev) {
                drag.startx = left + scrollLeft;
                drag.starty = top + scrollTop;
            };

            drag.startleft = left
            drag.starttop = top
            drag.itembounds = item.getBoundingClientRect();
            drag.parent_width = parent_width
            drag.parent_height = parent_height;
            drag.docScrollLeft = carco.functions.position.scrollLeft()
            drag.docScrollTop = carco.functions.position.scrollTop()
            drag.startDocScrollLeft = carco.functions.position.scrollLeft(item)
            drag.startDocScrollTop = carco.functions.position.scrollTop(item)
            drag.itemOffsetWidth = item.offsetWidth;
            drag.itemOffsetHeight = item.offsetHeight;

            var leftend = left / parent_width * 100 +"%";
            var topend = top / parent_height * 100 +"%";

            item.style.left = leftend;
            item.style.top = topend;

            if (carco.functions.browser.IE() == 8||carco.functions.browser.IE() == 9) {
                carco.functions.listeners.add(window, "scroll", drag.scroll);
                carco.functions.listeners.add(document, "mousemove", drag.move);
                carco.functions.listeners.add(document, "mousemove", drag.inner_move);
            } else {
                if (carco.functions.browser.IE() > 9) {
                    carco.functions.listeners.add(window, "scroll", drag.scroll);
                    carco.functions.listeners.add(document, "mousemove", drag.inner_move);
                    carco.functions.listeners.add(document, "mousemove", drag.move);
                    item.carco.root.style.opacity = 0.99;
                }else{
                    carco.functions.listeners.add(window, "scroll", drag.scroll);
                    carco.functions.listeners.add(document, "mousemove", drag.inner_move);
                    carco.functions.listeners.add(document, "mousemove", drag.move);
                };
            };
            carco.functions.listeners.add(document, "mouseup", drag.inner_up);

            setTimeout(function() {
                item.carco.off("mousedown", drag.inner_down);
                item.carco.off("mousedown", drag.down);
            },50)

        },
        scroll: function(){
            var item = carco.drag.currentdrag.item;
            var drag = item.carco.drag;
            var scrollLeft = carco.functions.position.scrollLeft()
            var scrollTop = carco.functions.position.scrollTop()
            var changeScrollLeft = scrollLeft - drag.docScrollLeft
            var changeScrollTop = scrollTop - drag.docScrollTop
            drag.startleft = drag.startleft + changeScrollLeft
            drag.starttop = drag.starttop + changeScrollTop
            drag.itembounds = item.getBoundingClientRect();
            drag.docScrollLeft = carco.functions.position.scrollLeft()
            drag.docScrollTop = carco.functions.position.scrollTop()
            drag.itemOffsetWidth = item.offsetWidth;
            drag.itemOffsetHeight = item.offsetHeight;
        },
        scrollIE10: function(ev){
            var item = carco.drag.currentdrag.item;
            if (item) var drag = carco.drag.currentdrag.item.carco.drag;
        },
        inner_move: function(ev, params) {
            if (!params) var params = {};
            if (!carco.drag.currentdrag) carco.drag.currentdrag = {};
            if (!carco.drag.currentdrag.item) carco.drag.currentdrag.item = params.item;
            var item = carco.drag.currentdrag.item;
            if (params.item) item = params.item;
            if (!item) item = carco.drag.currentdrag.tempitem;
            if (item){
                var drag = item.carco.drag;

                var parent_width = drag.parent_width
                var parent_height = drag.parent_height
                var startx = drag.startx;
                var starty = drag.starty;
                if (ev) var x = carco.functions.event.xy(ev, "X")
                if (ev) var y = carco.functions.event.xy(ev, "Y")
                if (ev) drag.movex = x - drag.startx;
                if (ev) drag.movey = y - drag.starty;

                if (drag.movex) var leftpercent = (drag.startleft + drag.movex) / parent_width * 100
                if (drag.movey) var toppercent = (drag.starttop + drag.movey) / parent_height * 100
                if (params.left) var leftpercent = params.left;
                if (params.top) var toppercent = params.top;

                if (!ev&&params.leftpx&&params.toppx) {
                    var scrollLeft = carco.functions.position.scrollLeft();
                    var scrollTop = carco.functions.position.scrollTop();
                    var itembounds = drag.itembounds;
                    drag.movex = params.leftpx - (itembounds.left+scrollLeft + drag.itemOffsetWidth/2)
                    drag.movey = params.toppx - (itembounds.top+scrollTop + drag.itemOffsetHeight/2)
                };

                if (params.leftpx) var leftpercent = (drag.startleft + drag.movex) / parent_width * 100;
                if (params.toppx) var toppercent = (drag.starttop + drag.movey) / parent_height * 100;

                if (carco.functions.browser.IE() > 9&&!carco.createjs.Touch.isSupported()&&!carco.functions.isMobile.any()) {
                    drag.endx = drag.startleft + drag.movex;
                    drag.endy = drag.starttop + drag.movey;
                    drag.getPosition();
                }else{
                    if (drag.disablex !== true) {
                        drag.endx = drag.startleft + drag.movex;
                        leftpercent = Math.round(leftpercent*100)/100
                        item.style.left = leftpercent + "%";
                    };
                    if (drag.disabley !== true) {
                        drag.endy = drag.starttop + drag.movey;
                        toppercent = Math.round(toppercent*100)/100
                        item.style.top = toppercent + "%";
                    };
                };

                if (ev) var x = carco.functions.event.xy(ev, "X", "page");
                if (ev) var y = carco.functions.event.xy(ev, "Y", "page");
                if (x) drag.upeventx = x
                if (y) drag.upeventy = y
            };
        },
        getPosition: function() {
            var item = carco.drag.currentdrag.item;
            var drag = item.carco.drag;
            if (drag.disablex !== true) item.style.left = drag.endx + "px";
            if (drag.disabley !== true) item.style.top = drag.endy + "px";
        },
        inner_up: function(ev) {
            if (!params) var params = {};
            if (!carco.drag.currentdrag) carco.drag.currentdrag = {};
            if (!carco.drag.currentdrag.item) carco.drag.currentdrag.item = params.item;
            var item = carco.drag.currentdrag.item;
            if (params.item) item = params.item;
            if (!item) item = carco.drag.currentdrag.tempitem;
            if (item){
                var drag = item.carco.drag;

                document.body.style.cursor = "default";
                //var item = carco.drag.currentdrag.item
                //var drag = item.carco.drag;

                if (carco.functions.browser.IE() > 9&&!carco.createjs.Touch.isSupported()&&!carco.functions.isMobile.any()) {
                    item.carco.root.style.opacity = 1;
                    drag.getPosition();
                };

                if (carco.functions.browser.IE() == 8||carco.functions.browser.IE() == 9) {
                    carco.functions.listeners.remove(document, "mousemove", drag.move);
                    carco.functions.listeners.remove(document, "mousemove", drag.inner_move);
                    carco.functions.listeners.remove(window, "scroll", drag.scroll);
                } else {
                    if (carco.functions.browser.IE() > 9) {
                        carco.functions.listeners.remove(document, "mousemove", drag.inner_move);
                        carco.functions.listeners.remove(document, "mousemove", drag.move);
                        carco.functions.listeners.remove(window, "scroll", drag.scroll);
                    }else{
                        carco.functions.listeners.remove(document, "mousemove", drag.inner_move);
                        carco.functions.listeners.remove(document, "mousemove", drag.move);
                        carco.functions.listeners.remove(window, "scroll", drag.scroll);
                    };
                };

                setTimeout(function() {
                    carco.functions.listeners.remove(document, "mouseup", drag.inner_up);
                    item.carco.on("mousedown", drag.inner_down);
                    item.carco.on("mousedown", drag.down);
                },100)
                drag.up(ev)
                drag.run(item, 1,1)
                carco.drag.currentdrag.tempitem = carco.drag.currentdrag.item;
                carco.drag.currentdrag.item = false;
            };

        },
        allup: function() {
            if (!carco.drag.currentdrag) carco.drag.currentdrag = {};
            if (!carco.drag.currentdrag.item) carco.drag.currentdrag.item = params.item;
            var item = carco.drag.currentdrag.item;
            if (carco.createjs.Touch.isSupported()&&item.carco.root&&item.carco.root.carco.paramsdata&&item.carco.root.carco.paramsdata.system.usertype == "user"||
                carco.functions.isMobile.any()&&item.carco.root&&item.carco.root.carco.paramsdata&&item.carco.root.carco.paramsdata.system.usertype == "user"){
                item.carco.drag.inner_up_mobile();
            }else{
                item.carco.drag.inner_up();
            };
        },
        down: function(ev) {},
        move: function() {},
        up: function() {},
        disablex: false,
        disabley: false
    }
    object.init(item, moveitem)
    return object;
};


carco.drag.placefunction = function(ev) {
    if (!carco.drag.currentdrag) carco.drag.currentdrag = {};
    var item = carco.drag.currentdrag.item;
    if (item&&item.carco) var drag = item.carco.drag;
    if (drag){
        var targets = [];
        if (ev.path) var targets = ev.path;
        var dragtargets = false;
        drag.place = false;
        for (var i = 0; i < targets.length; i++) {
            if (targets[i].carco&&targets[i].carco.customparams&&targets[i].carco.customparams.gametype == "place") drag.place = targets[i];
            if (targets[i].carco&&targets[i].carco.customparams&&targets[i].carco.customparams.gametype == "drag") dragtargets = targets[i];
        };
        if (!drag.place&&dragtargets){
            for (var i = 0; i < dragtargets.carco.game.inners.length; i++) {
                if (dragtargets.carco.game.inners[i].carco.customparams.gametype == "place") drag.place = dragtargets.carco.game.inners[i]
            };
        };
        if (!drag.place){
            function searchParent(item){
                if (item.carco.customparams.gametype == "drag"||item.carco.customparams.gametype == "place"){
                    if (item.carco.customparams.gametype == "drag"){
                        var focusinners = item.carco.game.inners;
                        if (item == carco.drag.currentdrag.item) focusinners = item.carco.game.tempinners;
                        for (var i = 0; i < focusinners.length; i++) {
                            if (focusinners[i].carco.customparams.gametype == "place") drag.place = focusinners[i];
                        };
                    };
                    if (item.carco.customparams.gametype == "place"){
                        drag.place = item;
                    };
                }else{
                    searchParent(item.carco.parent);
                };
            };
            searchParent(ev.target);
        };

        var places = item.carco.customparams.placeids;
        if (places){
            if (typeof places == 'string'){
                var places = item.carco.root.carco.recursivechildren[places];
            };
        };
        if (places&&places.length&&drag.place){
            var diffplace = carco.functions.array.diff(places, [drag.place.carco.id])
            if (diffplace&&diffplace.length==places.length){
                drag.place = false;
            };
        };
    };
};


carco.drag.addPlaceLayer = function(item) {
    if (!item.carco.dragplacelayer){
        item.carco.dragplacelayer = item.carco.addChild(carco.functions.children.createHTML(
            {type:"div",
                carco:{
                    name: "dragplacelayer",
                    root: item.carco.root,
                    type: "container",
                    addtools: false,
                    parent: item,
                    layer: "container",
                    size:{width:item.carco.size.width, height:item.carco.size.height},
                    position:{relative:{x:0, y:0}},
                    customparams: {gametype:"none"},
                    scale: {type:"parent"},
                    style: {"zIndex":4999999}
                }
            }
        ), item.carco.id+"pl")
    };
};

carco.drag.getActiveItem = function(item) {
    var shift = 10*item.carco.scale.x*item.carco.root.carco.scale.X;
    var shift = 0
    if (!item.carco.activeitem){
        item.carco.activeitem = item.carco.addChild(carco.functions.children.createHTML(
            {type:"div",
                carco:{
                    name: "activeitem",
                    root: item.carco.root,
                    type: "container",
                    addtools: false,
                    layer: "container",
                    size:{width:item.carco.size.width+shift, height:item.carco.size.height+shift},
                    scale:{type:"parent"},
                    position:{relative:{x:0-shift/2, y:0-shift/2}},
                    customparams: {gametype:"none"},
                    style: {"borderStyle":"dashed", "borderColor":"rgba(0, 76, 128, 0.8)", "boxShadow": "rgba(4, 56, 97, 0.5) 0px 0px 5px", "zIndex":1, "visibility":"hidden"}
                }
            }
        ), item.carco.id+"ai")
    }
};

carco.drag.currentdrag = {};

carco.functions.game.types.drag = function(item) {
    carco.drag(item);

    item.carco.drag.down = function(ev, ddl){

        function down(){
            if (carco.drag.currentdrag.item == false){
                setTimeout(function() {down()},50)
            }else{
                var item = carco.drag.currentdrag.item;
                var drag = item.carco.drag;
                item.carco.game.startdragged = false;

                if (item.carco.customparams.dragdisablemove){
                    if (item.carco.customparams.dragdisablemove=="x") {
                        drag.disablex = true;
                    }else{
                        drag.disablex = false;
                    };
                    if (item.carco.customparams.dragdisablemove=="y") {
                        drag.disabley = true;
                    }else{
                        drag.disabley = false;
                    }
                };

                if (item.carco.customparams.dragduplicate == "once") item.carco.game.dragduplicate();
                item.carco.game.tempposition = carco.functions.object.clone(item.carco.position)
                if (item.carco.game.inners&&item.carco.game.inners[0]){
                    item.carco.game.tempinners = item.carco.game.inners;
                    for (var a = 0; a < item.carco.game.inners.length; a++) {
                        item.carco.game.inners[a].carco.game.ready = false;
                        carco.functions.feedback.check.remove(item.carco.game.inners[a]);
                        carco.functions.feedback.solution.remove(item.carco.game.inners[a]);
                        item.carco.game.inners[a].carco.game.removeInner(item);
                        for (var t = 0; t < item.carco.game.inners.length; t++) {
                            if (item.carco.game.inners[t].carco.customparams.gametype == "place"){
                                var tempplaceinners = item.carco.game.tempinners[t].carco.game.inners;
                                for (var tt = 0; tt < tempplaceinners.length; tt++){
                                    if (!tempplaceinners[tt].carco.game.trueorfalse) {
                                        tempplaceinners[tt].carco.game.valueTrueOrFalse();
                                    };
                                };
                                item.carco.game.inners[t].carco.game.valueTrueOrFalse("start");
                            };
                        };
                    };
                    item.carco.game.removeInner(item.carco.game.inners);
                };
                carco.functions.feedback.check.remove(item);
                carco.functions.feedback.solution.remove(item);
                if (item.style.zIndex !== 5000003) item.style.zIndex = 5000003;
                if (ddl!==false) {
                    if (carco.functions.game.searchActions(item, "dragdownlistener")) {
                        carco.functions.game.searchActions(item, "dragdownlistener")(item);
                    };
                };

            };
        };
        down();
    };

    item.carco.drag.move = function(ev){
        if (carco.functions.browser.IE() == -1&&carco.functions.browser.Chrome()&&!carco.functions.isMobile.any()){
            var item = carco.drag.currentdrag.item;
            if (!item) var item = drwmsg
            var root = item.carco.root;
            var images = root.carco.getChildren({children:"recursivechildren", equal:{type:"image"}, type:"item"})
            if (images[0]&&images[0].carco.stage) images[0].carco.stage.update();
        };
    };
    item.carco.drag.up = function(ev, item, checkdisable) {
        if (!item) var item = carco.drag.currentdrag.item;
        if (item&&item.carco) var drag = item.carco.drag;
        if (!carco.drag.currentdrag) carco.drag.currentdrag = {};
        carco.drag.currentdrag.item = item;

        if (drag){

            var width = item.carco.originalsize.width;
            var height = item.carco.originalsize.height;
            item.carco.setSize({width:width, height:height})
            var texts = item.carco.getChildren({equal:{type:"text"}});
            if (texts[0]){
                for (var i = 0; i < texts.length; i++) {
                    texts[i].carco.setStyle({fontSize:texts[i].carco.originalstyle.fontSize})
                };
            };
            var places = carco.functions.game.searchPlace(item);
            if (places[0]&&item.carco.customparams.dragduplicate == "unlimited"&&item.carco.game.dropdragduplicate(places[0])&&places[0].carco.customparams.dropdragduplicate) places[0] = false;
            if (places[0]&&places[0].carco.customparams.dropdragduplicatetext&&item.carco.game.dropdragduplicatetext(places[0])) places[0] = false;
            if (places[0]&&places[0].carco.customparams.gametype == "coordinate"&&places[0].carco.customparams.disableduplicatepoints&&carco.functions.game.addPoint(places[0], item, true)) places[0] = false;
            if (places[0]){
                if (item.carco.customparams.dragduplicate == "unlimited") item.carco.game.dragduplicate();
                if (item.carco.customparams.dragscale&&item.carco.customparams.dragscale!==1&&!isNaN(Number(item.carco.customparams.dragscale))){
                    item.carco.size.width = item.carco.size.width * item.carco.customparams.dragscale
                    item.carco.size.height = item.carco.size.height * item.carco.customparams.dragscale
                };
                if (item.carco.game.tempinners&&item.carco.game.tempinners[0]){
                    for (var i = 0; i < item.carco.game.tempinners.length; i++){
                        item.carco.game.tempinners[i].carco.game.innersPosition();
                    };
                };
                for (var a = 0; a < places.length; a++){
                    var place = places[a];
                    if (!place.carco.game.inners) place.carco.game.inners = [];
                    if (!place.carco.customparams.multiboxmaxinner) place.carco.customparams.multiboxmaxinner = 1;
                    if (place.carco.customparams.multiboxmaxinner > place.carco.game.inners.length){
                        item.carco.game.setInner(place);
                        place.carco.game.setInner(item);
                        carco.functions.game.lastcheck(false, item);
                        carco.functions.game.lastcheck(false, place);
                        if (!place.carco.game.ready&&!checkdisable) carco.functions.feedback.check.remove(place);
                        if (!place.carco.game.ready&&!checkdisable) carco.functions.feedback.solution.remove(place);
                        place.carco.game.innersPosition();
                    }else{
                        if (place.carco.customparams.gametype !== "placecontainer"&&place.carco.game.inners[0].carco.customparams.dragchange == true&&item.carco.game.tempinners&&item.carco.game.tempinners[0]){
                            var dragchangeitem = false;
                            var reverseinners = place.carco.game.inners.reverse();
                            for (var i = 0; i < place.carco.game.inners.length; i++){
                                if (reverseinners[i].carco.game.ready!==true) {
                                    dragchangeitem = reverseinners[i];
                                };
                            };
                            place.carco.game.inners.reverse();
                            if (dragchangeitem){
                                var go = true;
                                if (go){
                                    for (var i = 0; i < dragchangeitem.carco.game.inners.length; i++){
                                        dragchangeitem.carco.game.inners[i].carco.game.removeInner(dragchangeitem);
                                    };
                                    for (var i = 0; i < dragchangeitem.carco.game.inners.length; i++){
                                        dragchangeitem.carco.game.removeInner(dragchangeitem.carco.game.inners[i]);
                                    };
                                    place.carco.game.removeInner(dragchangeitem);
                                    dragchangeitem.carco.game.removeInner(place);
                                    dragchangeitem.carco.game.inners = [];
                                    for (var i = 0; i < item.carco.game.tempinners.length; i++){
                                        dragchangeitem.carco.game.setInner(item.carco.game.tempinners[i]);
                                        item.carco.game.tempinners[i].carco.game.setInner(dragchangeitem);
                                        item.carco.game.tempinners[i].carco.game.innersPosition();
                                    };
                                    dragchangeitem.carco.game.tempinners = [];
                                    if (!checkdisable) {
                                        carco.functions.feedback.check.remove(dragchangeitem);
                                        carco.functions.feedback.solution.remove(dragchangeitem);
                                        carco.functions.feedback.check.remove(place);
                                        carco.functions.feedback.solution.remove(place);
                                        setTimeout(function () {
                                            dragchangeitem.carco.drag.get()
                                        }, 100)
                                    };

                                    item.carco.game.setInner(place);
                                    place.carco.game.setInner(item);
                                    carco.functions.game.lastcheck(false, item);
                                    carco.functions.game.lastcheck(false, place);
                                    place.carco.game.innersPosition();
                                    if (dragchangeitem.carco.customparams.startdrag) {
                                        dragchangeitem.carco.originalposition = carco.functions.object.clone(dragchangeitem.carco.position);
                                    };
                                    if (item.carco.customparams.startdrag) {
                                        item.carco.originalposition = carco.functions.object.clone(item.carco.position);
                                    };
                                };
                            }else{
                                if (item.carco.game.inners[0]){
                                    for (var i = 0; i < item.carco.game.inners.length; i++){
                                        item.carco.game.inners[i].carco.game.removeInner(item);
                                    };
                                    item.carco.game.removeInner(item.carco.game.inners);
                                };
                                item.carco.game.tempinners = [];
                                item.carco.game.setOriginal();
                                if (!item.carco.game.startdragged&&item.carco.customparams.startdrag&&item.carco.customparams.dragchange) {
                                    drag.place = false;
                                    drag.upeventx = false
                                    drag.upeventy = false
                                    item.carco.game.startdrag();
                                };
                            };
                        }else{

                            var dragchangeitem = false;
                            var reverseinners = place.carco.game.inners.reverse();
                            for (var i = 0; i < place.carco.game.inners.length; i++){
                                if (reverseinners[i].carco.game.ready!==true) {
                                    dragchangeitem = reverseinners[i];
                                };
                            };
                            place.carco.game.inners.reverse();
                            if (dragchangeitem){
                                var go = true;
                                if (place.carco.customparams.gametype == "placecontainer"&&place.carco.game.multiboxmaxinnerdisable == undefined){
                                    place.carco.game.setPlaceContainerMaxinnersDisable();
                                };
                                if (place.carco.customparams.gametype == "placecontainer"&&place.carco.game.multiboxmaxinnerdisable == true) go = false;
                                if (place.carco.customparams.gametype == "placecontainer"&&dragchangeitem.carco.customparams.dragchange == true) go = false

                                if (go){
                                    for (var i = 0; i < dragchangeitem.carco.game.inners.length; i++){
                                        dragchangeitem.carco.game.inners[i].carco.game.removeInner(dragchangeitem);
                                    };
                                    for (var i = 0; i < dragchangeitem.carco.game.inners.length; i++){
                                        dragchangeitem.carco.game.removeInner(dragchangeitem.carco.game.inners[i]);
                                    };
                                    place.carco.game.removeInner(dragchangeitem);
                                    dragchangeitem.carco.game.removeInner(place);
                                    dragchangeitem.carco.game.inners = [];
                                    dragchangeitem.carco.game.setOriginal();
                                    dragchangeitem.carco.game.valueTrueOrFalse()
                                    if (!checkdisable) {
                                        carco.functions.feedback.check.remove(dragchangeitem);
                                        carco.functions.feedback.solution.remove(dragchangeitem);
                                        carco.functions.feedback.check.remove(place);
                                        carco.functions.feedback.solution.remove(place);
                                    };
                                    dragchangeitem.carco.game.tempinners = [];
                                    setTimeout(function(){dragchangeitem.carco.drag.get()},100)
                                    if (dragchangeitem.carco.customparams.startdrag) {
                                        dragchangeitem.carco.drag.place = false;
                                        dragchangeitem.carco.drag.upeventx = false
                                        dragchangeitem.carco.drag.upeventy = false
                                        dragchangeitem.carco.game.startdrag();
                                    };
                                }else{}
                                item.carco.game.setInner(place);
                                place.carco.game.setInner(item);
                                carco.functions.game.lastcheck(false, item);
                                carco.functions.game.lastcheck(false, place);
                                place.carco.game.innersPosition();
                                if (place.carco.customparams.gametype == "placecontainer"&&item.carco.customparams.startdrag) {
                                    if (!checkdisable) {
                                        carco.functions.feedback.check.remove(place);
                                        carco.functions.feedback.solution.remove(place);
                                    };
                                };
                            }else{

                                var originalgo = true;
                                if (place.carco.customparams.gametype == "placecontainer"&&place.carco.game.multiboxmaxinnerdisable == undefined){
                                    place.carco.game.setPlaceContainerMaxinnersDisable();
                                };
                                if (place.carco.customparams.gametype == "placecontainer"&&
                                    place.carco.game.multiboxmaxinnerdisable == true&&
                                    !item.carco.game.startdragged&&
                                    item.carco.customparams.startdrag&&
                                    item.carco.customparams.dragchange == true) {
                                    originalgo = false;
                                };

                                if (place.carco.customparams.gametype == "placecontainer"&&
                                    item.carco.customparams.startdrag&&
                                    item.carco.customparams.dragchange == true) {
                                    originalgo = false;
                                };

                                if (originalgo){
                                    if (item.carco.game.inners[0]){
                                        for (var i = 0; i < item.carco.game.inners.length; i++){
                                            item.carco.game.inners[i].carco.game.removeInner(item);
                                        };
                                        item.carco.game.removeInner(item.carco.game.inners);
                                    };
                                    if (!item.carco.game.inners||item.carco.game.inners&&!item.carco.game.inners[0]) {
                                        item.carco.game.setOriginal();
                                    }else{
                                        item.carco.game.setOriginal(false);
                                    };
                                }else{
                                    item.carco.game.setInner(place);
                                    place.carco.game.setInner(item);
                                    carco.functions.game.lastcheck(false, item);
                                    carco.functions.game.lastcheck(false, place);
                                };
                            };
                        };
                    };
                };
            }else{
                var restart = true;
                if (item.carco.game.tempinners&&item.carco.game.tempinners[0]){
                    for (var a = 0; a < item.carco.game.tempinners.length; a++) {
                        restart = false;
                        if (item.carco.game.tempinners[a].carco.customparams.gametype == "place"){
                            var tempplaceinners = item.carco.game.tempinners[a].carco.game.inners;
                            for (var i = 0; i < tempplaceinners.length; i++){
                                tempplaceinners[i].carco.game.valueTrueOrFalse();
                            };
                        };
                        item.carco.game.tempinners[a].carco.game.innersPosition();
                        item.carco.game.tempinners[a].carco.game.removeInner(item);
                        item.carco.game.removeInner(item.carco.game.tempinners[a]);
                        if (!item.carco.game.tempinners[a].carco.game.ready){
                            if (!checkdisable) {
                                carco.functions.feedback.check.remove(item.carco.game.tempinners[a]);
                                carco.functions.feedback.solution.remove(item.carco.game.tempinners[a]);
                            };
                        };
                    };
                    item.carco.game.tempinners = [];
                };
                item.carco.game.setOriginal();
                if (!item.carco.game.startdragged&&item.carco.customparams.startdrag) {
                    drag.place = false;
                    drag.upeventx = false
                    drag.upeventy = false
                    item.carco.game.startdrag();
                };
                var searchitem = carco.drag.currentdrag.item;
                if (!searchitem) searchitem = item;
                if (searchitem&&searchitem.carco.drag&&!searchitem.carco.game.draguplistenerrun){
                    if (carco.functions.game.searchActions(searchitem, "draguplistener")){
                        carco.functions.game.searchActions(searchitem, "draguplistener")(searchitem);
                        searchitem.carco.game.draguplistenerrun = true;
                        setTimeout(function() {searchitem.carco.game.draguplistenerrun = false},200)
                    };
                };
            };

            if (item.style.zIndex !== 5000000)item.style.zIndex = 5000000;
            if (carco.functions.browser.IE() == -1&&carco.functions.browser.Chrome()&&carco.createjs.Touch.isSupported()&&!carco.functions.isMobile.any()){
                var item = carco.drag.currentdrag.item;
                if (!item) var item = drwmsg
                var root = item.carco.root;
                var images = root.carco.getChildren({children:"recursivechildren", equal:{type:"image"}, type:"item"})
                if (images[0]&&images[0].carco.stage) images[0].carco.stage.update();
            };

            drag.place = false;
            drag.upeventx = false
            drag.upeventy = false
        };

        var searchitem = carco.drag.currentdrag.item;
        if (!searchitem) searchitem = item;
        if (searchitem&&searchitem.carco.drag&&!searchitem.carco.game.draguplistenerrun){
            if (ev&&carco.functions.game.searchActions(searchitem, "draguplistener")){
                carco.functions.game.searchActions(searchitem, "draguplistener")(searchitem);
                searchitem.carco.game.draguplistenerrun = true;
                setTimeout(function() {searchitem.carco.game.draguplistenerrun = false},200)
            };
        };
    };

    item.carco.drag.get();

    if (item.style.zIndex !== 5000000) item.style.zIndex = 5000000;

    if (carco.createjs.Touch.isSupported()&&item.carco.root&&item.carco.root.carco.paramsdata&&item.carco.root.carco.paramsdata.system.usertype == "user"||
        carco.functions.isMobile.any()&&item.carco.root&&item.carco.root.carco.paramsdata&&item.carco.root.carco.paramsdata.system.usertype == "user"){
        carco.drag.getActiveItem(item);
    };

    return {
        innersPosition: function(params, savetype){},
        searchPlace: function(){
            carco.functions.game.searchPlace(item);
        },
        setOriginal: function(position, morecloneremove){
            carco.functions.game.setOriginal(item, position, morecloneremove);
        },
        setPosition: function(place, params, savetype){
            carco.functions.game.setPosition(item, place, params, savetype);
        },
        setSize: function(place){
            carco.functions.game.setSize(item, place);
        },
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
        values: function(params, save, type){
            carco.functions.game.values(item, params, save, type)
        },
        allChildrenImageColorise: function(params, trynumber) {
            carco.functions.game.allChildrenImageColorise(item, params, trynumber)
        },
        actions: function(params, type){
            carco.functions.game.actions(item, params, type)
        },
        dragduplicate: function(){
            carco.functions.game.dragduplicate(item);
        },
        dropdragduplicate: function(place){
            return carco.functions.game.dropdragduplicate(place, item);
        },
        dropdragduplicatetext: function(place){
            return carco.functions.game.dropdragduplicatetext(place, item);
        },
        startdrag: function(){
            return carco.functions.game.startdrag(item);
        }
    };
}