carco.container = function(item) {
    var object = {};
    object.item = item;

    if (!object.item.carco) {
        object.item.carco = {};
    };
    if (!object.item.carco.item) {
        object.item.carco.item = object.item;
    };

    // add listener

    if (!object.item.carco.on) {
        object.item.carco.on = function(type, fn) {
            carco.functions.listeners.add(object.item, type, fn)
        };
    };

    if (!object.item.carco.off) {
        object.item.carco.off = function(type, fn) {
            carco.functions.listeners.remove(object.item, type, fn)
        };
    };

    // add children, add parent

    if (!object.item.carco.getParent) {
        object.item.carco.getParent = function() {
            object.item.carco.parent = carco.functions.parent.getParent(this.item);
            return object.item.carco.parent;
        };
    };

    if (!object.item.carco.addChild) {
        object.item.carco.addChild = function(item, id, second_id){
            carco.functions.children.addChild(object.item, item, id, second_id);
            return item;
        };
    };

    if (!object.item.carco.changeParent) {
        object.item.carco.changeParent = function(newparent){
            carco.functions.children.changeParent(object.item, newparent);
        };
    };

    if (!object.item.carco.removeAllChildren) {
        object.item.carco.removeAllChildren = function(type){
            carco.functions.children.removeAllChildren(object.item, type);
        };
    };

    if (!object.item.carco.addCurrentParamsChild) {
        object.item.carco.addCurrentParamsChild = function(){
            carco.functions.children.addCurrentParamsChild(object.item);
        };
    };

    if (!object.item.carco.removeChild) {
        object.item.carco.removeChild = function(item, callback){
            var tempitem = carco.functions.children.removeChild(object.item, item, callback);
            return tempitem;
        };
    };

    if (!object.item.carco.add) {
        object.item.carco.add = function(type, editor){
            var newitem = carco.functions.childrenTypes.add(object.item, type, editor);
            return newitem;
        };
    };

    if (!object.item.carco.duplicate) {
        object.item.carco.duplicate = function(parent, type, id){
            var newitem = carco.functions.children.duplicate(object.item, parent, type, id);
            return newitem;
        };
    };

    if (!object.item.carco.getChildren) {
        object.item.carco.getChildren = function(params){
            var returnobject = carco.functions.children.getChildren(object.item, params);
            return returnobject;
        };
    };

    // position

    if (!object.item.carco.getPosition) {
        object.item.carco.getPosition = function() {
            carco.functions.position.getPosition(object.item);
            return object.item.carco.position;
        };
    };

    if (!object.item.carco.setPosition) {
        object.item.carco.setPosition = function(params) {
            carco.functions.position.setPosition(object.item, params);
            return object.item.carco.position;
        };
    };
    if (!object.item.carco.getMeasuredPosition) {
        object.item.carco.getMeasuredPosition = function(newabsolute) {
            carco.functions.position.getMeasuredPosition(object.item, newabsolute);
            return object.item.carco.position;
        };
    };

    // container size

    if (!object.item.carco.getSize) {
        object.item.carco.getSize = function(setsize){
            carco.functions.size.getSize(object.item, setsize);
            object.item.carco.resize();
        };
    };
    if (!object.item.carco.setSize) {
        object.item.carco.setSize = function(params, type){
            carco.functions.size.setSize(object.item, params, type);
        };
    };
    if (!object.item.carco.getMeasuredSize) {
        object.item.carco.getMeasuredSize = function() {
            carco.functions.size.getMeasuredSize(object.item);
            return object.item.carco.size;
        };
    };
    if (!object.item.carco.resizeChild) {
        object.item.carco.resizeChild = function(child, type) {
            carco.functions.size.resizeChild(object.item, child, type);
        };
    };

    // item style

    if (!object.item.carco.setStyle) {
        object.item.carco.setStyle = function(params, save){
            carco.functions.style.setStyle(object.item, params, save);
        };
    };

    if (!object.item.carco.loadCustomCss) {
        object.item.carco.loadCustomCss = function(value, save){
            carco.functions.style.loadCustomCss(object.item, value, save);
        };
    };

    // load image

    if (!object.item.carco.loadImage) {
        object.item.carco.loadImage = function(name, resize, save){
            carco.functions.image.loadImage(object.item, name, resize, save)
        };
    };

    // innerHTML

    if (!object.item.carco.innerHTML) {
        object.item.carco.innerHTML = function(value, type){
            carco.functions.HTML.innerHTML(object.item, value, type)
        };
    };

    object.item.carco.getParent();
    return item;
};