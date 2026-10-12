carco.project.getConfig = function() {

    var config = "default";
    var player = false;
    var searchobj = [];
    var varsobj = {};
    var o = {};

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
        o[x] = varsobj[x];
    };

    if (carco&&
        carco.data&&
        carco.data.okosdoboz&&
        carco.data.okosdoboz.paramsdata&&
        carco.data.okosdoboz.paramsdata.user){
        if (carco.data.okosdoboz.paramsdata.user.player) {
            player = carco.data.okosdoboz.paramsdata.user.player;
        };
        if (carco.data.okosdoboz.paramsdata.user.config) {
            config = carco.data.okosdoboz.paramsdata.user.config;
        };
    };

    if (o.player){
        player = o.player;
    };

    if (o.config){
        config = o.config;
    };

    if (!player) player = config;

    var lib = "../lib/";
    if (carco.project.okosdoboz.hosts[0]) lib = carco.project.okosdoboz.hosts[0];

    if (!carco.project.loadedconfigs) {

        if (player == "editor") player = "default";
        if (player == "player") player = "default";

        console.log("Config type: " + config);
        console.log("Player type: " + player);

        var sc = document.createElement("script");
        sc.setAttribute("src", lib+"configs/" + config + "/config.js")
        document.getElementsByTagName('head')[0].appendChild(sc);

        var sc = document.createElement("script");
        sc.setAttribute("src", lib+"configs/" + config + "/config_user.js")
        document.getElementsByTagName('head')[0].appendChild(sc);

        carco.project.okosdoboz.filenames = carco.project.configs[config];
        carco.project.okosdoboz.filenames = carco.project.okosdoboz.filenames.concat(carco.project.players[player])

        if (carco.functions.isMobile.androidApp()){
            carco.project.okosdoboz.filenames.push("../cordova.js");
            carco.project.okosdoboz.filenames.push("createjs/cordovaaudioplugin-NEXT.min.js");
        };

        carco.project.loadedconfigs = true;

    };

    if (o.id){
        if (!carco.data) carco.data = {};
        if (!carco.data.okosdoboz) carco.data.okosdoboz = {};
        carco.data.okosdoboz.id = o.id;
    };

};

carco.project.configs = {
    "default":[
        "player.css",
        "createjs/tweenjs-0.5.1.min.js",
        "createjs/easeljs-0.7.1.min.js",
        "createjs/soundjs-NEXT.min.js",
        "jquery/chosen.css",
        "jquery/jquery-2.0.3.js",
        "jquery/jquery-ui-1.10.4.custom.min.js",
        "jquery/jquery.iframe-transport.js",
        "jquery/jquery.fileupload.js",
        "jquery/jquery-resizeEnd.min.js",
        "carco_stage.js",
        "carco_functions.js",
        "carco_drag.js",
        "carco.css",
        "MathJax-master/MathJax.js?config=TeX-AMS_HTML.js"
    ],
    "editor":[
        "player.css",
        "carco.css",
        "configs/editor/editor.css",
        "createjs/tweenjs-0.5.1.min.js",
        "createjs/easeljs-0.7.1.min.js",
        "createjs/soundjs-NEXT.min.js",
        "jquery/chosen.css",
        "jquery/jquery-2.0.3.js",
        "jquery/jquery-ui-1.10.4.custom.min.js",
        "jquery/chosen.jquery.js",
        "jquery/jquery.iframe-transport.js",
        "jquery/jquery.fileupload.js",
        "jquery/jquery-resizeEnd.min.js",
        "bootstrap/js/bootstrap.min.js",
        "colorpickerslider/tinycolor.js",
        "colorpickerslider/bootstrap.colorpickersliders.js",
        "bootstrap/css/bootstrap.css",
        "colorpickerslider/bootstrap.colorpickersliders.css",
        "carco_functions.js",
        "carco_drag.js",
        "carco_stage.js",
        "configs/editor/carco_editor.js",
        "MathJax-master/MathJax.js?config=TeX-AMS_HTML.js",
        "configs/editor/custom_script.js"
    ],
    "player": [
        "player.css",
        "createjs/tweenjs-0.5.1.min.js",
        "createjs/easeljs-0.7.1.min.js",
        "createjs/soundjs-NEXT.min.js",
        "jquery/chosen.css",
        "jquery/jquery-2.0.3.js",
        "jquery/jquery-ui-1.10.4.custom.min.js",
        "jquery/jquery.iframe-transport.js",
        "jquery/jquery.fileupload.js",
        "jquery/jquery-resizeEnd.min.js",
        "carco_stage.js",
        "carco_functions.js",
        "carco_drag.js",
        "carco.css",
        "MathJax-master/MathJax.js?config=TeX-AMS_HTML.js"
    ],
    "ms":[
        "player.css",
        "createjs/tweenjs-0.5.1.min.js",
        "createjs/easeljs-0.7.1.min.js",
        "createjs/soundjs-NEXT.min.js",
        "jquery/chosen.css",
        "jquery/jquery-2.0.3.js",
        "jquery/jquery-ui-1.10.4.custom.min.js",
        "jquery/jquery.iframe-transport.js",
        "jquery/jquery.fileupload.js",
        "jquery/jquery-resizeEnd.min.js",
        "carco_stage.js",
        "carco_functions.js",
        "carco_drag.js",
        "carco.css",
        "MathJax-master/MathJax.js?config=TeX-AMS_HTML.js"
    ],
    "cinemon":[
        "player.css",
        "createjs/tweenjs-0.5.1.min.js",
        "createjs/easeljs-0.7.1.min.js",
        "createjs/soundjs-NEXT.min.js",
        "jquery/chosen.css",
        "jquery/jquery-2.0.3.js",
        "jquery/jquery-ui-1.10.4.custom.min.js",
        "jquery/jquery.iframe-transport.js",
        "jquery/jquery.fileupload.js",
        "jquery/jquery-resizeEnd.min.js",
        "carco_stage.js",
        "carco_functions.js",
        "carco_drag.js",
        "carco.css",
        "configs/cinemon/player.css"
    ]
}

carco.project.players = {
    "default":[
        "players/default/player.css",
        "players/default/fullscreenbody.css",
        "players/default/player.js"
    ],
    "ms":[
        "players/ms/player.css",
        "players/ms/fullscreenbody.css",
        "players/ms/player.js"
    ],
    "cinemon":[
        "players/cinemon/player.css",
        "players/cinemon/fullscreenbody.css",
        "players/cinemon/player.js",
    ],
    "cineyellow":[
        "players/cineyellow/player.css",
        "players/cineyellow/fullscreenbody.css",
        "players/cineyellow/player.js",
    ]
}


carco.project.getConfig();