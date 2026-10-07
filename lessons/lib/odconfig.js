carco.project.okosdoboz.filenames = [
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
];

carco.project.okosdoboz.start = function(callback){
    carco.project.okosdoboz.version = "3.44";
    carco.functions.console("Okosdoboz matek "+carco.project.okosdoboz.version+", current host: "+carco.project.okosdoboz.hosts[carco.project.okosdoboz.currentHost]);

    if (carco.functions.isMobile.iOS()) {
        MathJax.Hub.Config({

            extensions: ["tex2jax.js"],
            jax: ["input/TeX", "output/HTML-CSS"],
            imageFont: null,
            "HTML-CSS": {
                webFont: "STIX-Web"
            },
            tex2jax: {inlineMath: [["$","$"],["\\(","\\)"]]},
            messageStyle: "none",
            skipStartupTypeset: true,
            display: "inline",
            styles: {
                ".MathJax_Preview": {
                    visibility: "hidden"
                }
            }
        });
        MathJax.Hub.Register.StartupHook(
            "HTML-CSS Jax Config",
            function () {MathJax.OutputJax["HTML-CSS"].FontFaceBug = true}
        );
    }else{
        MathJax.Hub.Config({
            extensions: ["tex2jax.js"],
            jax: ["input/TeX", "output/HTML-CSS"],
            "HTML-CSS": {
                availableFonts: ["TeX"]
            },
            tex2jax: {inlineMath: [["$","$"],["\\(","\\)"]]},
            messageStyle: "none",
            skipStartupTypeset: true,
            display: "inline",
            styles: {
                ".MathJax_Preview": {
                    visibility: "hidden"
                }
            }
        });
    }

    if (callback) callback();
};